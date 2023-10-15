import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

process.env.MUMBAI_PRIVATE_KEY ??= '';

const config: HardhatUserConfig = {
  solidity: "0.4.26",

  networks: {
    ganache: {
      url: 'HTTP://127.0.0.1:8545',
      accounts: ['0xa820a772525b69a6d6e788b7a7cfe12757a99a59f4436b2a3ff6227d009c9041'],
    },
    mumbai: {
      url: 'https://polygon-mumbai-bor.publicnode.com',
      accounts: [process.env.MUMBAI_PRIVATE_KEY],
    }
  }
};

export default config;
