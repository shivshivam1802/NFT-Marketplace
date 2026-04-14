import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import NFTMarketplace from '../NFTMarketplace.json';

export const NFTContext = createContext();

const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const marketplaceABI = NFTMarketplace.abi;

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install a Web3 Wallet (like MetaMask).');
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found.');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install a Web3 Wallet (like MetaMask).');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
  };

  const uploadToIPFS = async (file) => {
    setIsLoading(true);
    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_KEY;
    
    if (!pinataApiKey || !pinataSecretApiKey) {
      setIsLoading(false);
      throw new Error("Missing Pinata API Keys. Check your .env file.");
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
          "Content-Type": "multipart/form-data",
        },
      });

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      setIsLoading(false);
      return ImgHash;
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading to IPFS: ", error);
      throw error;
    }
  };

  const createNFT = async (name, price, image, description, router) => {
    if (!name || !description || !price || !image) return;
    setIsLoading(true);

    try {
      // 1. Upload JSON metadata to IPFS
      const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
      const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_KEY;
      
      const data = JSON.stringify({ name, description, image });

      const res = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data,
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      
      // 2. Call Smart Contract createToken
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);
      
      const priceFormatted = ethers.parseUnits(price.toString(), "ether");
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      const transaction = await contract.createToken(url, priceFormatted, { value: listingPrice });
      await transaction.wait();

      setIsLoading(false);
      router('/'); // navigate to home
    } catch (error) {
      console.error("Error creating NFT: ", error);
      setIsLoading(false);
      throw error;
    }
  };

  const fetchNFTs = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, provider);
      
      const data = await contract.fetchMarketItems();

      const items = await Promise.all(data.map(async i => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      }));

      setIsLoading(false);
      return items;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return [];
    }
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);

      const data = type === 'fetchItemsListed' 
        ? await contract.fetchItemsListed() 
        : await contract.fetchMyNFTs();

      const items = await Promise.all(data.map(async i => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      }));

      setIsLoading(false);
      return items;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return [];
    }
  };

  const buyNFT = async (nft) => {
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);

      const price = ethers.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.buyMarketItem(nft.tokenId, { value: price });
      
      await transaction.wait();
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only check if window.ethereum object is injected by MetaMask
    if (window.ethereum) {
      checkIfWalletIsConnected();
      
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
        else setCurrentAccount('');
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return (
    <NFTContext.Provider
      value={{
        connectWallet,
        currentAccount,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        isLoading
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
