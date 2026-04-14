import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NFTContext } from '../context/NFTContext';

const CreateNFT = () => {
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  const [fileUrl, setFileUrl] = useState(null);
  const { uploadToIPFS, createNFT, isLoading, currentAccount } = useContext(NFTContext);
  const router = useNavigate();

  const onChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadToIPFS(file);
        setFileUrl(url);
      } catch (error) {
        console.error("Error uploading file: ", error);
        alert(error.message);
      }
    }
  };

  const handleCreate = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      alert("Please fill all fields and upload an image.");
      return;
    }
    
    try {
      await createNFT(name, price, fileUrl, description, router);
    } catch (error) {
      console.error(error);
      alert("Error minting NFT.");
    }
  };

  if (!currentAccount) {
    return (
      <div className="hero glass-panel" style={{ margin: '40px auto', maxWidth: '800px' }}>
        <h2>Wallet Not Connected</h2>
        <p>Please connect your wallet to mint entirely new NFTs.</p>
      </div>
    );
  }

  return (
    <div className="form-container glass-panel" style={{ marginTop: '40px' }}>
      <h1 className="gradient-text" style={{ textAlign: 'center', marginBottom: '20px' }}>Create New NFT</h1>
      
      <div className="form-group">
        <label className="form-label">Asset Name</label>
        <input 
          placeholder="e.g. CryptoPunk 2.0"
          className="input-glass"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Asset Description</label>
        <textarea
          placeholder="Describe your asset..."
          className="input-glass"
          style={{ minHeight: '100px', resize: 'vertical' }}
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Price in ETH</label>
        <input
          placeholder="e.g. 0.05"
          type="number"
          step="0.01"
          className="input-glass"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Asset Image</label>
        <input
          type="file"
          name="Asset"
          className="input-glass"
          onChange={onChange}
        />
        {fileUrl && (
          <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden' }}>
            <img style={{ width: '100%', objectFit: 'cover' }} src={fileUrl} alt="uploaded" />
          </div>
        )}
      </div>

      <button onClick={handleCreate} className="btn-primary" style={{ marginTop: '10px' }} disabled={isLoading}>
        {isLoading ? 'Creating NFT (Confirm in MetaMask)...' : 'Create & List NFT'}
      </button>
    </div>
  );
};

export default CreateNFT;
