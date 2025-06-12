import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Users, Shield, Headphones, Zap, Globe, Award, TrendingUp, FileText, Phone } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 page-transition">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-float">
              <span className="gradient-text">Orient Solution</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 font-light mb-8">
              YOU ARE IN <span className="font-bold text-green-600">GOOD HANDS</span>
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
          </div>

          {/* Carousel */}
          <div className="mb-16">
            <ImageCarousel />
          </div>

          {/* Our Products Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive range of printing solutions and smart classroom technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* KYOCERA Card */}
            <div 
              onClick={() => navigate('/kyocera')}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover-lift cursor-pointer"
            >
              <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
                <img 
                  src="/images/kyocera/taskalfa-2020.jpg" 
                  alt="KYOCERA Printers"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-bold text-white mb-2">KYOCERA</h3>
                  <p className="text-blue-100">Premium Printing Solutions</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-4">
                  Professional printing solutions with advanced features and eco-friendly technology
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                  <span>Explore Printers</span>
                  <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </div>

            {/* RAPTOR Card */}
            <div 
              onClick={() => navigate('/raptor')}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover-lift cursor-pointer"
            >
              <div className="h-64 bg-gradient-to-br from-green-500 to-green-700 relative overflow-hidden">
                <img 
                  src="/images/raptor/panel-65.jpg" 
                  alt="RAPTOR Interactive Solutions"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-bold text-white mb-2">RAPTOR</h3>
                  <p className="text-green-100">Smart Classroom Solutions</p>
                </div>
                <div className="absolute top-4 right-4 ar-ready-badge text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  AR Ready
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-4">
                  Interactive panels and smart podiums with AR visualization capabilities
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                  <span>Explore Interactive Solutions</span>
                  <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Orient Solution */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Orient Solution?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with exceptional service to deliver solutions that exceed expectations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover-lift">
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-full w-24 h-24 mx-auto mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                <Shield className="w-12 h-12 text-green-600 mx-auto mt-3" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Trusted Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Premium products from world-renowned brands with proven reliability and performance in demanding environments.
              </p>
            </div>

            <div className="text-center group hover-lift">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-full w-24 h-24 mx-auto mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mt-3" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Innovation First</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay ahead with the latest technology including AR visualization, smart integration, and future-ready solutions.
              </p>
            </div>

            <div className="text-center group hover-lift">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-full w-24 h-24 mx-auto mb-6 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <Headphones className="w-12 h-12 text-purple-600 mx-auto mt-3" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated support team providing consultation, installation, training, and ongoing maintenance services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Businesses Everywhere</h2>
            <p className="text-green-100 text-lg">Our commitment to excellence speaks through our achievements</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-200">1000+</div>
              <div className="text-green-100 font-medium">Happy Clients</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-200">5000+</div>
              <div className="text-green-100 font-medium">Products Delivered</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-200">20+</div>
              <div className="text-green-100 font-medium">Years Experience</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-200">24/7</div>
              <div className="text-green-100 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real feedback from real customers who trust Orient Solution</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Orient Solution transformed our office with their KYOCERA printers. The quality and reliability are outstanding, and their support team is incredibly responsive."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">IT Manager, TechCorp</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "The RAPTOR interactive panels have revolutionized our classrooms. Students are more engaged, and the AI features are simply amazing!"
              </p>
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">David Chen</div>
                  <div className="text-sm text-gray-600">Principal, Modern Academy</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Professional service from start to finish. The virtual demo helped us choose the perfect solutions before purchase. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Maria Rodriguez</div>
                  <div className="text-sm text-gray-600">Operations Director, Global Inc</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Showcase */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Cutting-Edge Technology</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of product demonstration with our AR-enabled virtual showroom
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Virtual Product Demo</h3>
                  <p className="text-gray-600">Explore our products in detail with interactive 3D models and comprehensive specifications.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">AR Visualization</h3>
                  <p className="text-gray-600">See how our interactive panels and podiums look in your actual space using augmented reality.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Integration</h3>
                  <p className="text-gray-600">Seamlessly integrate with your existing systems and workflows for maximum efficiency.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-6 inline-block">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Innovation at Work</h3>
                  <p className="text-gray-600">Experience the future of product visualization</p>
                </div>
                <button 
                  onClick={() => navigate('/raptor')}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:scale-105"
                >
                  Try AR Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Workspace?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Get in touch with our experts to find the perfect solutions for your business needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/about')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                Contact Us Today
              </button>
              <button 
                onClick={() => navigate('/kyocera')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                  <Globe className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold">Orient Solution</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for premium printing solutions and smart classroom technology.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/kyocera')} className="hover:text-white transition-colors">KYOCERA Printers</button></li>
                <li><button onClick={() => navigate('/raptor')} className="hover:text-white transition-colors">RAPTOR Panels</button></li>
                <li><button onClick={() => navigate('/raptor')} className="hover:text-white transition-colors">Smart Podiums</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">Contact</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">Support</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@orientsolution.com</p>
                <p>📞 +91 98409 09409</p>
                <p>📍 37/62, S W Boag Rd, T Nagar, CIT Nagar West, CIT Nagar, Chennai, Tamil Nadu 600017</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Orient Solution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;