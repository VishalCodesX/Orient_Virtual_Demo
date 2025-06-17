// Improved ProductCard.jsx - Clean, professional design consistent across all products

import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, hasAR = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
    >
      <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Product Image */}
        <img 
          src={product.image || "https://via.placeholder.com/400x300?text=Product+Image"} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=Product+Image";
          }}
        />
        
        {/* Category-specific gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${
          product.category === 'raptor' 
            ? 'from-green-900/20 to-transparent' 
            : 'from-blue-900/20 to-transparent'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        
        {/* AR Ready badge - only for RAPTOR products */}
        {hasAR && product.category === 'raptor' && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            AR Ready
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
            product.category === 'raptor' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {product.category === 'raptor' ? 'RAPTOR' : 'KYOCERA'}
          </div>
        </div>
        
        {/* Hover overlay with view details prompt */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-center text-white">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-2 mx-auto w-fit">
              <ArrowRight size={24} />
            </div>
            <p className="text-sm font-medium">Click to view details</p>
            {hasAR && (
              <p className="text-xs text-white/80 mt-1">3D & AR features available</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className={`font-bold text-xl mb-2 text-gray-800 group-hover:transition-colors ${
          product.category === 'raptor' ? 'group-hover:text-green-600' : 'group-hover:text-blue-600'
        }`}>
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(4.8/5)</span>
        </div>
        
        {/* Price and Action Row */}
        <div className="flex items-center justify-between mb-4">
          <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 group-hover:scale-105 ${
            product.category === 'raptor' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
          }`}>
            {product.price}
          </button>
          <ArrowRight className={`transition-transform duration-200 group-hover:translate-x-1 ${
            product.category === 'raptor' ? 'text-green-500' : 'text-blue-500'
          }`} size={20} />
        </div>
        
        {/* Features Preview */}
        <div className="space-y-2">
          {product.specs && product.specs.slice(0, 2).map((spec, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
              <div className={`w-1.5 h-1.5 rounded-full ${
                product.category === 'raptor' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <span>{spec}</span>
            </div>
          ))}
          {product.specs && product.specs.length > 2 && (
            <div className="text-xs text-gray-400">
              +{product.specs.length - 2} more specifications
            </div>
          )}
        </div>
        
        {/* Product Tags */}
        <div className="flex flex-wrap gap-1 mt-4">
          {product.category === 'raptor' && (
            <>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Interactive
              </span>
              {hasAR && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                  AR Ready
                </span>
              )}
              {product.features && product.features.includes('4K') && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                  4K Display
                </span>
              )}
            </>
          )}
          
          {product.category === 'kyocera' && (
            <>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                Printing
              </span>
              {product.features && product.features.includes('Color') && (
                <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">
                  Color
                </span>
              )}
              {product.features && product.features.includes('Duplex') && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                  Duplex
                </span>
              )}
            </>
          )}
        </div>
        
        {/* Bottom Info */}
        <div className="text-center pt-3 border-t border-gray-100 mt-4">
          <p className="text-xs text-gray-500">
            {hasAR && product.category === 'raptor' 
              ? '🚀 Advanced 3D & AR visualization available'
              : '📋 View detailed specifications and features'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;