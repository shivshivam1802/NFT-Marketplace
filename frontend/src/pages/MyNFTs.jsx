import { useContext, useEffect, useState } from 'react';
import { NFTContext } from '../context/NFTContext';

const MyNFTs = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount, isLoading } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (currentAccount) {
      fetchMyNFTsOrListedNFTs('fetchMyNFTs').then((items) => {
        if(items) setNfts(items);
      });
    }
  }, [currentAccount, fetchMyNFTsOrListedNFTs]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <h2 className="gradient-text">Loading Your Collection...</h2>
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className="hero glass-panel" style={{ margin: '40px auto', maxWidth: '800px' }}>
        <h2>Wallet Not Connected</h2>
        <p>Please connect your wallet to view your collection.</p>
      </div>
    );
  }

  if (!nfts.length) {
    return (
      <div className="hero">
        <h2>No Digital Assets Owned</h2>
        <p>You haven't bought any NFTs yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1 style={{ fontSize: '3rem' }}>Your <span className="gradient-text">Collection</span></h1>
      </div>
      
      <div className="nft-grid">
        {nfts.map((nft, i) => (
          <div key={i} className="nft-card glass-panel">
            <div className="nft-image-container">
              <img src={nft.image} alt={nft.name} className="nft-image" />
            </div>
            <div className="nft-info">
              <h3 className="nft-name">{nft.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{nft.description}</p>
              <div className="nft-price-container">
                <div>
                  <div className="nft-price-label">Purchased For</div>
                  <div className="nft-price-value">{nft.price} ETH</div>
                </div>
                <div className="nft-price-label" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Owned</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFTs;
