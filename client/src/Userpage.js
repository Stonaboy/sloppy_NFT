import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import './Userpage.css';
import Meme from './abis/Meme.json';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
    if (networkData) {
      const abi = Meme.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({ contract })
      const memeHash = await contract.methods.get().call()
      this.setState({ memeHash })
    } else {
      window.alert('Smart contract not deployed to detected network!')
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      buffer: null,
      contract: null,
      memeHash: 'QmeE1FS9LVnPuwtv8Q6ZYGAnWPpobrYQgJJRwUoz9gYMMF'
    };
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Please use Metamask!')
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})
    }
  }


  
  render() {
    return (
              <div>
                <a className="image1" href={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} alt="" download>
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} alt="" />
                </a>
               </div>
    );
  }
}

export default App;
