require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const config = {
  solidity: "0.8.17",
  networks: {
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
    hardhat: {
      initialBaseFeePerGas: 0,
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY}`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
    },
  },
};

module.exports = config;
