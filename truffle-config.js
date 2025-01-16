var infura_url = "https://ropsten.infura.io/v3/55bd501e41924fee9ae78506959da324";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
      },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, infura_url);
      },
      network_id: 3,
      gas: 5000000
      }
    },
  contracts_directory: './client/src/contracts/',
  contracts_build_directory: './client/src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
