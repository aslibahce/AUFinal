require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config()

module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  //defaultNetwork: 'localhost'
  /*,
  networks : {
    sepolia: {
      url: process.env.TESTNET_API_URL,
      accounts : [process.env.TEST_PRIVATE_KEY]
    } 
  }*/
};
