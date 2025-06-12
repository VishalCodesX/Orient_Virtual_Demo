import React from 'react';
import ProductCard from '../components/ProductCard';
import { kyoceraProducts } from '../data/products';

const KyoceraPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              KYOCERA
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional printing solutions designed for reliability, efficiency, and environmental responsibility
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kyoceraProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hasAR={product.hasAR}
            />
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose KYOCERA?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              KYOCERA printers are renowned for their exceptional reliability, cost-effectiveness, and environmental sustainability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reliability</h3>
              <p className="text-gray-600">Long-life components ensure minimal downtime and maximum productivity</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cost Effective</h3>
              <p className="text-gray-600">Low total cost of ownership with energy-efficient operation</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Sustainable technology that reduces environmental impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KyoceraPage;