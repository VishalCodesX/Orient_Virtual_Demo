// Updated RaptorPage.jsx with clean, professional design

import React from 'react';
import ProductCard from '../components/ProductCard';
import { raptorProducts } from '../data/products';

const RaptorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              RAPTOR
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Smart interactive solutions for modern classrooms and meeting rooms with cutting-edge AR visualization technology. 
            Experience products before you buy with our advanced 3D and augmented reality features.
          </p>
          
          {/* Key Benefits */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium text-gray-700">🚀 AR Ready</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium text-gray-700">📱 3D Models</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium text-gray-700">🎯 Try Before You Buy</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-medium text-gray-700">⚡ Interactive Demos</span>
            </div>
          </div>
        </div>

        {/* Products Grid - Clean and Consistent */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {raptorProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hasAR={product.hasAR}
            />
          ))}
        </div>

        {/* AR Technology Showcase */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Experience AR Technology</h2>
            <p className="text-lg text-green-100 max-w-4xl mx-auto leading-relaxed">
              See how our interactive panels and podiums will look in your space with cutting-edge AR visualization. 
              Choose from multiple viewing options to find the perfect solution for your needs.
            </p>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-200">
                <div className="bg-green-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-200">
                  <svg className="w-8 h-8 text-green-600 mx-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Advanced 3D Visualization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore detailed 3D models of our products from every angle with realistic lighting and materials
                </p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-200">
                <div className="bg-blue-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                  <svg className="w-8 h-8 text-blue-600 mx-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">AR Room Placement</h3>
                <p className="text-gray-600 leading-relaxed">
                  Place virtual products in your real environment using advanced AR technology for accurate sizing
                </p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-200">
                <div className="bg-purple-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:bg-purple-200 transition-colors duration-200">
                  <svg className="w-8 h-8 text-purple-600 mx-auto mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Interactive Features Demo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience touch functionality, interface navigation, and all interactive capabilities before purchase
                </p>
              </div>
            </div>

            {/* Additional AR Benefits */}
            <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Use AR for Your Purchase Decision?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full p-1 mt-1">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Perfect Size Validation</h4>
                      <p className="text-gray-600 text-sm">Ensure the panel size is perfect for your room and audience</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full p-1 mt-1">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Optimal Placement</h4>
                      <p className="text-gray-600 text-sm">Find the best position for maximum visibility and engagement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full p-1 mt-1">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Confident Decision Making</h4>
                      <p className="text-gray-600 text-sm">Make informed purchases with complete visual validation</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-2xl text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to Experience AR?</h3>
                <p className="text-gray-600 mb-6">
                  Click on any RAPTOR product above to explore with multiple AR viewing options
                </p>
                <div className="space-y-2">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-green-600">🎯 Advanced AR Experience</span>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-blue-600">📱 Quick Room Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Comparison Section */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose the Right Size for Your Space</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our smart recommendation system helps you select the perfect panel size based on your room and audience size
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">🏫</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Small Classrooms</h3>
              <p className="text-gray-600 mb-4">10-20 students</p>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                65" Panel Recommended
              </div>
              <p className="text-sm text-gray-500 mt-2">Perfect visibility for intimate learning environments</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200 ring-2 ring-green-500">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Standard Classrooms</h3>
              <p className="text-gray-600 mb-4">20-30 students</p>
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                75" Panel - Most Popular
              </div>
              <p className="text-sm text-gray-500 mt-2">Ideal balance of size, visibility, and value</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Large Spaces</h3>
              <p className="text-gray-600 mb-4">30+ students</p>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                86" Panel Premium
              </div>
              <p className="text-sm text-gray-500 mt-2">Maximum impact for large audiences</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-4">
              Not sure which size is right for you? Our AR preview lets you try all sizes virtually!
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning Environment?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Experience the future of interactive education with RAPTOR panels. Try our AR features and see the difference for yourself.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:scale-105">
              Schedule Live Demo
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-200">
              Get Quote
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-green-100 text-sm">
              📞 Call us: +91 98409 09409 | 📧 Email: sales@orientsolutions.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaptorPage;