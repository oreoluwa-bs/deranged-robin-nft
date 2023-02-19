import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    mainnet: {
      url: process.env.ALCHEMY_GOERLI_RPC,
      accounts: [process.env.WALLET_PRIVATE_KEY!],
    },
    goerli: {
      url: process.env.ALCHEMY_GOERLI_RPC,
      accounts: [process.env.WALLET_PRIVATE_KEY!],
    },
  },
};

export default config;
