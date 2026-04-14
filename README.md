<h1 align="center"> Decentralized NFT Marketplace 🎨 </h1>

<p align="center">
  A cutting-edge Web3 application where creators can mint, list, and sell their digital art securely on the Ethereum blockchain. Built with a premium aesthetic and decentralized infrastructure natively orchestrated for frictionless Vercel deployment.
</p>

## ✨ Features
- **NFT Minting:** Seamlessly upload artwork and JSON metadata to IPFS via Pinata.
- **Decentralized Escrow:** Securely list your items on the market utilizing a trustless Solidity contract protected by ReentrancyGuards.
- **Dashboard Interfaces:** View the digital assets you own, and independently track the assets you currently have listed for sale.
- **Premium Aesthetics:** Fully responsive, modern user interface crafted with deep dark modes, glassmorphism, and dynamic CSS animations.

## 🛠️ Technology Stack
- **Blockchain:** Ethereum, Solidity, Hardhat, Ethers.js v6
- **Smart Contracts:** OpenZeppelin (ERC721URIStorage, ReentrancyGuard)
- **Frontend:** React, Vite, Vanilla CSS Modules
- **Storage:** IPFS (InterPlanetary File System) via Pinata

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed and configured:
*   [Node.js](https://nodejs.org/en/) (v18+ recommended)
*   A Web3 Wallet browser extension (e.g., [MetaMask](https://metamask.io/), Trust Wallet, Rabby)
*   A [Pinata Gateway](https://pinata.cloud/) account for securing API keys to pin images to IPFS.

### 1. Installation
Clone the repository and install the blockchain & frontend dependencies simultaneously from the root:
```bash
git clone https://github.com/shivshivam1802/NFT-Marketplace.git
cd NFT-Marketplace

# Install Hardhat root dependencies
npm install

# Install Frontend dependencies
cd frontend && npm install
```

### 2. Environment Configuration
Navigate to your `frontend` directory and create an `.env.local` file:
```env
VITE_MARKETPLACE_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_PINATA_API_KEY="YOUR_PINATA_API_KEY"
VITE_PINATA_SECRET_KEY="YOUR_PINATA_SECRET_KEY"
```
*(Note: If you run the local deployment script below, it will automatically populate your marketplace address here!)*

### 3. Local Hardhat Deployment
To test and interact with the application locally without spending real Ethereum gas fees:

**Start a local Ethereum node:**
```bash
# In the root 'NFT-Marketplace' directory
npx hardhat node
```
This will generate 20 test accounts. Import one of the private keys into your Web3 wallet and switch your network to `Localhost 8545`.

**Deploy the smart contract:**
Leave the node running, open a new terminal window, and run:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Run the Dev Server
Fire up the Vite development server to view your dapp!
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` in your browser. Connect your Web3 wallet, and mint your very first local NFT!

---

## 🌐 Deploying to Testnet (Sepolia)
When you are ready to take your project to a public testnet:
1. Generate an Alchemy or Infura API key.
2. Inside `hardhat.config.js`, uncomment and configure the `sepolia` network object using your API URL and wallet Private Key.
3. Deploy!
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
4. Verify your deployed contract on [Sepolia Etherscan](https://sepolia.etherscan.io/) using `@nomicfoundation/hardhat-verify`.

---

<p align="center">Built with 💜 by the Web3 Community</p>
