import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              About Orient Solutions
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Orient Solutions is a leading provider of innovative technology solutions, specializing in professional printing systems and smart classroom technologies. We are committed to delivering excellence and helping our clients achieve their goals with cutting-edge solutions.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full w-fit mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide cutting-edge technology solutions that enhance productivity and learning experiences. We strive to bridge the gap between traditional methods and modern digital solutions through innovative products and exceptional service.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full w-fit mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the leading technology partner for educational institutions and businesses, revolutionizing how people interact with technology through immersive experiences like AR visualization and smart interactive solutions.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full w-fit mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quality Assurance</h3>
            <p className="text-gray-600 text-center">
              We ensure the highest quality standards in all our products and services, providing reliable solutions you can trust for your critical business operations.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full w-fit mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Innovation</h3>
            <p className="text-gray-600 text-center">
              We stay at the forefront of technology, offering innovative solutions like AR visualization and smart interactive systems that transform user experiences.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full w-fit mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Customer Support</h3>
            <p className="text-gray-600 text-center">
              Our dedicated support team is always ready to assist you with expert guidance and comprehensive after-sales service to ensure your success.
            </p>
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl shadow-lg p-8 md:p-12 text-white mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Achievement</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-green-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Support</div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <p className="text-gray-600">+91 98409 09409</p>
              <p className="text-gray-600">+91 98409 09409</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-gray-600">info@orientsolutions.com</p>
              <p className="text-gray-600">sales@orientsolutions.com</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p className="text-gray-600">37/62, S W Boag Rd, T Nagar, CIT Nagar West, CIT Nagar</p>
              <p className="text-gray-600">Chennai, TamilNadu - 600017</p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Subject</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea 
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
