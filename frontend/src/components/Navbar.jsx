import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NFTContext } from '../context/NFTContext';

const Navbar = () => {
  const { connectWallet, currentAccount } = useContext(NFTContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      {!currentAccount && (
        <div className="wallet-banner">
          Please connect your MetaMask wallet to interact with the decentralized marketplace.
        </div>
      )}
      <nav className="navbar glass-panel" style={{ margin: '20px 5%', borderRadius: '30px' }}>
        <div className="nav-logo">
          <span className="gradient-text">Meta</span>Market
        </div>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/create-nft" className={`nav-link ${isActive('/create-nft')}`}>Mint NFT</Link>
          <Link to="/my-nfts" className={`nav-link ${isActive('/my-nfts')}`}>My Collection</Link>
          <Link to="/listed-nfts" className={`nav-link ${isActive('/listed-nfts')}`}>Dashboard</Link>
          
          {currentAccount ? (
            <button className="btn-secondary">
              {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
            </button>
          ) : (
            <button className="btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
