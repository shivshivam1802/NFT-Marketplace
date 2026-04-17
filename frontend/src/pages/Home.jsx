import { useContext, useEffect, useState } from 'react';
import { NFTContext } from '../context/NFTContext';

const Home = () => {
  const { fetchNFTs, buyNFT, isLoading, currentAccount } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (currentAccount) {
      fetchNFTs().then((items) => {
        if (items) setNfts(items);
      });
    }
  }, [currentAccount, fetchNFTs]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <h2 className="gradient-text">Loading Marketplace...</h2>
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className="hero glass-panel" style={{ margin: '40px auto', maxWidth: '800px' }}>
        <h1>Welcome to the <span className="gradient-text">Future</span> of Art.</h1>
        <p>Connect your wallet to discover, collect, and sell extraordinary digital assets.</p>
      </div>
    );
  }

  if (!nfts.length) {
    return (
      <div className="hero">
        <h2>No NFTs listed in the marketplace.</h2>
        <p>Be the first to mint and list an NFT!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <h1>Explore <span className="gradient-text">Digital Art</span></h1>
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
                  <div className="nft-price-label">Price</div>
                  <div className="nft-price-value">{nft.price} ETH</div>
                </div>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => buyNFT(nft)}>
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
