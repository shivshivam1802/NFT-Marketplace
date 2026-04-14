import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateNFT from './pages/CreateNFT';
import MyNFTs from './pages/MyNFTs';
import ListedNFTs from './pages/ListedNFTs';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-nft" element={<CreateNFT />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
            <Route path="/listed-nfts" element={<ListedNFTs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
