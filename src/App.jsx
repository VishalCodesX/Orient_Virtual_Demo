import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import ScrollToTop from './components/ScrollToTop'
import ChatWidget from './components/ChatBot/ChatWidget'  
import HomePage from './pages/HomePage'
import KyoceraPage from './pages/KyoceraPage'
import RaptorPage from './pages/RaptorPage'
import AboutPage from './pages/AboutPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kyocera" element={<KyoceraPage />} />
        <Route path="/raptor" element={<RaptorPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
      <ChatWidget />  
    </div>
  )
}

export default App