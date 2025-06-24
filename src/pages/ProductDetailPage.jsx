// Complete ProductDetailPage.jsx with clean professional design

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Check, X, ZoomIn, Camera, Eye } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ARModal from '../components/ARModal';
import CameraARButton from '../components/CameraAR/CameraARButton';
import { getProductById } from '../data/products';

// Image Modal Component
const ImageModal = ({ isOpen, onClose, imageSrc, productName }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-7xl max-h-full">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
        >
          <X size={24} />
        </button>

        <button 
          onClick={onClose}
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-all duration-200 z-10 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
        
        <img 
          src={imageSrc}
          alt={productName}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
          <p className="font-medium">{productName}</p>
          <p className="text-sm text-gray-300">Press ESC or click outside to close</p>
        </div>

        <div className="absolute bottom-4 right-4">
          <button 
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// KYOCERA Product Detail Component
const KyoceraProductDetail = ({ product }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Large Product Image */}
      <div className="space-y-6">
        <div 
          className="relative bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group h-[500px]"
          onClick={() => setShowImageModal(true)}
        >
          <img 
            src={product.image || "https://via.placeholder.com/600x450?text=Product+Image"} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x450?text=Product+Image";
            }}
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/90 p-3 rounded-full">
              <ZoomIn size={24} className="text-gray-800" />
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            Click to enlarge
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">High-Quality Product Image</h3>
          <p className="text-blue-600 text-sm">
            Click the image above to view in full-screen mode for detailed examination of all product features.
          </p>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              KYOCERA
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{product.description}</p>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600">(4.8/5 based on 127 reviews)</span>
          </div>
          
          <div className="mb-8">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
              Know More
            </button>
            <p className="text-sm text-gray-600 mt-2">Click to get detailed pricing and consultation</p>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Technical Specifications</h3>
          {product.specs && product.specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">{spec}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Key Features</h3>
          {product.features && product.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-lg">
            Request Quote
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button className="border-2 border-blue-200 text-blue-600 py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors font-medium">
              Download Brochure
            </button>
            <button className="border-2 border-gray-200 text-gray-600 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={product.image || "https://via.placeholder.com/600x450?text=Product+Image"}
        productName={product.name}
      />
    </div>
  );
};

// RAPTOR Product Detail Component - Clean Version
const RaptorProductDetail = ({ product }) => {
  const [showAR, setShowAR] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleARClick = () => {
    setShowAR(true);
  };

  // Get all product images (main image + gallery images)
  const getAllImages = () => {
    const images = [product.image];
    
    if (product.gallery && product.gallery.length > 0) {
      images.push(...product.gallery);
    } else {
      // Fallback demo images if no gallery is provided
      const demoImages = [
        product.image,
        product.image,
        product.image,
        product.image
      ];
      return demoImages;
    }
    
    return images;
  };

  const productImages = getAllImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image Gallery Section - Clean Version */}
        <div className="space-y-6">
          {/* Main Image Gallery */}
          <div 
            className="relative bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group h-[500px]"
            onClick={() => setShowImageModal(true)}
          >
            {/* Current Image */}
            <img 
              src={productImages[currentImageIndex] || "https://via.placeholder.com/600x450?text=Product+Image"} 
              alt={`${product.name} - View ${currentImageIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x450?text=Product+Image";
              }}
            />
            
            {/* Image Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            {productImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              Click to enlarge • {productImages.length} photos
            </div>
          </div>

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    currentImageIndex === index 
                      ? 'ring-3 ring-green-500 scale-105' 
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={image || "https://via.placeholder.com/150x150?text=Image"}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150x150?text=Image";
                    }}
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Enhanced AR Experience Section - Clean Version */}
          {product.hasAR && (
            <div className="space-y-4">
              {/* Advanced AR Card */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 text-white">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Camera size={20} />
                    Experience in Augmented Reality
                  </h3>
                  <p className="text-green-100 mb-4">
                    See how this {product.modelType || product.type} will look in your space with full 3D interaction and realistic placement
                  </p>
                  <button 
                    onClick={handleARClick}
                    className="w-full bg-white text-green-600 py-3 px-6 rounded-xl font-bold hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <Camera size={20} />
                    Launch AR Experience
                  </button>
                </div>
              </div>

              {/* Simple Camera AR Card */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 text-white">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Eye size={20} />
                    View in Your Room
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Instantly see the product in your room with our simple camera overlay feature - no downloads required
                  </p>
                  <CameraARButton
                    productName={product.name}
                    productType={product.modelType || product.type || 'panel'}
                    className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Virtual Demo Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 text-white">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Virtual Full Demo
              </h3>
              <p className="text-purple-100 mb-4">
                Complete interactive demonstration with all features and capabilities explained
              </p>
              <button 
                onClick={() => {
                  console.log('Open Virtual Demo for:', product.name);
                }}
                className="w-full bg-white text-purple-600 py-3 px-6 rounded-xl font-bold hover:bg-purple-50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Start Virtual Demo
              </button>
            </div>
          </div>
          
          {/* Clean Info Card - No Badges */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              🎮 Multiple Viewing Options Available
            </h3>
            <p className="text-green-600 text-sm mb-3">
              This product features multiple visualization options to help you make the best decision:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-green-600" />
                <span className="text-green-700"><strong>Advanced AR:</strong> Full 3D model with realistic placement</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-blue-600" />
                <span className="text-green-700"><strong>Room Preview:</strong> Quick camera overlay visualization</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="text-purple-600">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span className="text-green-700"><strong>Virtual Demo:</strong> Interactive feature walkthrough</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information - Clean Version */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                RAPTOR
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">(4.9/5 based on 89 reviews)</span>
            </div>
            
            <div className="mb-8">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg">
                Know More
              </button>
              <p className="text-sm text-gray-600 mt-2">Click to get detailed pricing and consultation</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specs'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'features'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Features
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'specs' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Technical Specifications</h3>
                {product.specs && product.specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{spec}</span>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'features' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Key Features</h3>
                {product.features && product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-lg">
              Request Quote
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button className="border-2 border-green-200 text-green-600 py-3 px-6 rounded-xl hover:bg-green-50 transition-colors font-medium">
                Download Brochure
              </button>
              <button className="border-2 border-gray-200 text-gray-600 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={productImages[currentImageIndex]}
        productName={product.name}
      />

      {/* AR Modal - Only loads 3D model when opened */}
      <ARModal 
        isOpen={showAR}
        onClose={() => setShowAR(false)}
        productName={product.name}
        modelType={product.modelType || product.type}
        modelPath={product.modelPath}
      />
    </>
  );
};

// Main Product Detail Page Component
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading product:', error);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={handleBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-8 group"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" size={20} />
          <span className="font-medium">Back to Products</span>
        </button>

        {product.category === 'kyocera' ? (
          <KyoceraProductDetail product={product} />
        ) : (
          <RaptorProductDetail product={product} />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
