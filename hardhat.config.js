require('@nomiclabs/hardhat-waffle')
require('dotenv').config()
//https://brown-characteristic-platypus-927.mypinata.cloud
module.exports = {
  networks: {
    Fantom: {
      url: 'https://rpc.testnet.fantom.network',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './src/contracts',
    artifacts: './src/abis',
  },
  mocha: {
    timeout: 40000,
  },
}
// require('./scripts/deploy')