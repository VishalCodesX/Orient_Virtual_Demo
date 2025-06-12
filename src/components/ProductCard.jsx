import React from 'react';
import { ArrowRight } from 'lucide-react';
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
      <div className="h-48 bg-gradient-to-br from-green-50 to-gray-50 relative overflow-hidden">
        {/* Always show regular image for ALL products on main page */}
        <img 
          src={product.image || "https://via.placeholder.com/400x300?text=Product+Image"} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=Product+Image";
          }}
        />
        
        {/* AR Ready badge for AR-enabled products */}
        {hasAR && (
          <div className="absolute top-3 right-3 ar-ready-badge text-yellow-900 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            AR Ready
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          {/* Updated pricing display */}
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-green-600 hover:to-green-700 transition-all duration-200 group-hover:scale-105">
            {product.price}
          </button>
          <ArrowRight className="text-green-500 group-hover:translate-x-1 transition-transform duration-200" size={20} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;