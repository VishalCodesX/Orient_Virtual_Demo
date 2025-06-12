import React from 'react';
import ProductCard from '../components/ProductCard';
import { raptorProducts } from '../data/products';

const RaptorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              RAPTOR
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Smart interactive solutions for modern classrooms with AR visualization technology
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {raptorProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hasAR={product.hasAR}
            />
          ))}
        </div>

        {/* AR Technology Showcase */}
        <div className="mt-16 bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Experience AR Technology</h2>
            <p className="text-lg text-green-100 max-w-3xl mx-auto">
              See how our interactive panels and podiums will look in your space with cutting-edge AR visualization
            </p>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">3D Visualization</h3>
                <p className="text-gray-600">View detailed 3D models of our products from every angle</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">AR Placement</h3>
                <p className="text-gray-600">Place virtual products in your real environment using AR technology</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time Demo</h3>
                <p className="text-gray-600">Experience interactive features and capabilities before purchase</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaptorPage;
