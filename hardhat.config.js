import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    // We can add Sepolia here once we have alchemy url and private key
    /*
    sepolia: {
      url: process.env.SEPOLIA_ALCHEMY_API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
    */
  }
};
