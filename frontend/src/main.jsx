import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NFTProvider } from './context/NFTContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NFTProvider>
      <App />
    </NFTProvider>
  </React.StrictMode>,
)
