import "./App.css";
import { useState, useEffect } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Buffer } from "buffer";
import Web3 from "web3";
import Meme from "./abis/Meme.json";

const projectId = "2X7EVxMkvakuKsp4tXQHQmihJa8";
const projectSecret = "f72b425c3cf76393e04dd0683b84b63b";
const authorization = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

function App() {
  const [account, setAccount] = useState("");
  const [buffer, setBuffer] = useState(null);
  const [contract, setContract] = useState(null);
  const [memeHashes, setMemeHashes] = useState([]); // 複数の画像ハッシュを管理

  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Please use Metamask!");
    }
  };

  //deploy memeHash to Blockchain
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = Meme.networks[networkId];
    if (networkData) {
      const abi = Meme.abi;
      const address = networkData.address;
      const contractInstance = new web3.eth.Contract(abi, address);
      setContract(contractInstance);

      // ここで複数のハッシュを取得するためのロジックを記述
      const hashCount = await contractInstance.methods.getHashCount().call(); // 仮定: ハッシュの数を返す関数
      const hashes = [];
      for (let i = 0; i < hashCount; i++) {
        const memeHash = await contractInstance.methods.getHash(i).call(); // 仮定: 特定のインデックスのハッシュを取得
        hashes.push(memeHash);
      }
      setMemeHashes(hashes);
    } else {
      window.alert("Smart contract not deployed to detected network!");
    }
  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
    };
  };

  //set memeHash in front to Meme.sol
  const onSubmit = (event) => {
    event.preventDefault();
    ipfs.add(buffer)
      .then((result) => {
        const memeHash = result.path;
        setMemeHashes([...memeHashes, memeHash]); // 配列に追加
        contract.methods.set(memeHash).send({ from: account }).then(() => {
          console.log("Meme added to blockchain:", memeHash);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //insert memeHash to infura and return 2.change memeHash 
  return (
    <div>
      <h1>Decentralized Meme Storage</h1>
      <p>Account: {account}</p>
      <form className="button" onSubmit={onSubmit}>
        <input type="file" onChange={captureFile} />
        <input type="submit" />
      </form>
      <div className="images">
        {memeHashes.map((hash, index) => (
          <a key={index} href={`https://ipfs.infura.io/ipfs/${hash}`} target="_blank" rel="noopener noreferrer">
            <img src={`https://ipfs.infura.io/ipfs/${hash}`} alt={`Meme ${index}`} style={{ width: "200px", margin: "10px" }} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;
