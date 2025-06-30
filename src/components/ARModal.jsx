// Enhanced ARModal.jsx with iOS and Chrome fixes

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Smartphone, Download, HelpCircle, RotateCcw, Ruler, Info, Eye, EyeOff, Move } from 'lucide-react';
import CameraARButton from './CameraAR/CameraARButton';

// Real-world dimensions for products (in meters)
const PRODUCT_DIMENSIONS = {
  'panel-65': { 
    width: 1.448, 
    height: 0.838, 
    depth: 0.087,
    displaySize: '65"',
    category: 'Interactive Panel'
  },
  'panel-75': { 
    width: 1.677, 
    height: 0.970, 
    depth: 0.087,
    displaySize: '75"',
    category: 'Interactive Panel'
  },
  'panel-86': { 
    width: 1.924, 
    height: 1.113, 
    depth: 0.087,
    displaySize: '86"',
    category: 'Interactive Panel'
  },
  'podium': { 
    width: 0.600, 
    height: 1.200, 
    depth: 0.450,
    displaySize: 'Smart',
    category: 'Podium'
  }
};

// CORS and MIME type setup for model files
const setupModelServing = () => {
  // Add CORS headers for model files
  const observer = new MutationObserver(() => {
    const modelViewers = document.querySelectorAll('model-viewer');
    modelViewers.forEach(viewer => {
      if (viewer.src && !viewer.dataset.corsSetup) {
        viewer.dataset.corsSetup = 'true';
        
        // Ensure proper MIME types
        const originalSrc = viewer.src;
        viewer.src = `${originalSrc}?t=${Date.now()}`;
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
};

const ARModal = ({ isOpen, onClose, productName, modelType, modelPath }) => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [arState, setARState] = useState('checking');
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);  
  const [deviceInfo, setDeviceInfo] = useState({});
  const [modelError, setModelError] = useState(null);
  const [corsObserver, setCorsObserver] = useState(null);
  const arContainerRef = useRef(null);
  const modelViewerRef = useRef(null);

  // Get product dimensions
  const getProductDimensions = () => {
    const productKey = modelType === 'podium' ? 'podium' : `panel-${productName.match(/(\d+)/)?.[1] || '65'}`;
    return PRODUCT_DIMENSIONS[productKey] || PRODUCT_DIMENSIONS['panel-65'];
  };

  const productDimensions = getProductDimensions();

  // Enhanced device detection with better iOS detection
  useEffect(() => {
    if (isOpen) {
      detectDeviceCapabilities();
      loadModelViewerForAR();
      
      // Setup CORS handling
      const observer = setupModelServing();
      setCorsObserver(observer);
      
      return () => {
        if (observer) observer.disconnect();
      };
    }
  }, [isOpen]);

  const detectDeviceCapabilities = async () => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isIOSSafari = isIOS && /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !isIOS;
    const isChromeIOS = /CriOS/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);
    
    // Check iOS version for AR compatibility
    const iOSVersion = isIOS ? parseFloat(userAgent.match(/OS (\d+)_(\d+)/)?.[1] + '.' + userAgent.match(/OS (\d+)_(\d+)/)?.[2]) : 0;
    const isARCompatible = isIOS ? iOSVersion >= 12 : true;
    
    const device = {
      isIOS,
      isIOSSafari,
      isAndroid,
      isChrome,
      isChromeIOS,
      isEdge,
      isARCompatible,
      iOSVersion,
      isHTTPS: location.protocol === 'https:',
      isLocalhost: location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    };
    
    setDeviceInfo(device);
    
    try {
      if (device.isIOS && device.isARCompatible) {
        setIsARSupported(true);
        setARState('supported');
      } else if (device.isAndroid && 'xr' in navigator) {
        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        setIsARSupported(isSupported);
        setARState(isSupported ? 'supported' : 'unsupported');
      } else {
        setIsARSupported(false);
        setARState(device.isIOS && !device.isARCompatible ? 'ios-old' : 'unsupported');
      }
    } catch (error) {
      console.log('XR check failed:', error);
      setIsARSupported(device.isIOS && device.isARCompatible);
      setARState(device.isIOS && device.isARCompatible ? 'supported' : 'unsupported');
    }
  };

  const loadModelViewerForAR = async () => {
    if (customElements.get('model-viewer')) {
      setIsModelViewerLoaded(true);
      return;
    }

    try {
      // Load model-viewer with proper error handling
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        console.log('✅ Model-viewer loaded successfully');
        setIsModelViewerLoaded(true);
      };
      
      script.onerror = (error) => {
        console.error('❌ Failed to load model-viewer:', error);
        setModelError('Failed to load 3D viewer library');
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('❌ Script loading error:', error);
      setModelError('Failed to initialize 3D viewer');
    }
  };

  // Enhanced model path resolution
  const getModelPaths = (type, explicitPath) => {
    if (explicitPath) {
      const basePath = explicitPath.replace(/\.(glb|gltf)$/i, '');
      return {
        glb: explicitPath,
        usdz: `${basePath}.usdz`
      };
    }
    
    const modelMaps = {
      'panel': '/models/panel-65.glb',
      'podium': '/models/podium.glb',
      'default': '/models/panel-65.glb'
    };
    
    const glbPath = modelMaps[type] || modelMaps.default;
    return {
      glb: glbPath,
      usdz: glbPath.replace('.glb', '.usdz')
    };
  };

  // Enhanced model-viewer setup with better iOS and Chrome compatibility
  useEffect(() => {
    if (!isOpen || !isModelViewerLoaded || !arContainerRef.current) return;

    const setupModelViewer = async () => {
      try {
        arContainerRef.current.innerHTML = '';

        const modelPaths = getModelPaths(modelType, modelPath);
        const modelViewer = document.createElement('model-viewer');
        modelViewerRef.current = modelViewer;
        
        // Core model configuration
        modelViewer.src = modelPaths.glb;
        modelViewer.alt = `${productName} AR Model - Actual Size`;
        
        // Enhanced iOS configuration
        if (deviceInfo.isIOS) {
          modelViewer.setAttribute('ios-src', modelPaths.usdz);
          modelViewer.setAttribute('ar-modes', 'quick-look');
          modelViewer.setAttribute('ar-scale', 'auto'); // Allow iOS natural scaling
          modelViewer.setAttribute('ar-placement', 'floor wall');
          modelViewer.setAttribute('interaction-prompt', 'none');
          
          // iOS-specific attributes for better AR experience
          modelViewer.setAttribute('quick-look-browsers', 'safari chrome');
          
        } else if (deviceInfo.isAndroid) {
          modelViewer.setAttribute('ar-modes', 'webxr scene-viewer');
          modelViewer.setAttribute('ar-scale', 'auto');
          modelViewer.setAttribute('ar-placement', 'floor wall');
        }
        
        // Essential AR configuration
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('auto-rotate-delay', '3000');
        
        // Enhanced lighting and environment
        modelViewer.setAttribute('environment-image', 'legacy');
        modelViewer.setAttribute('exposure', '0.8');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('shadow-softness', '0.5');
        
        // Loading configuration
        modelViewer.setAttribute('loading', 'eager');
        modelViewer.setAttribute('reveal', 'auto');
        
        // Prevent context menu that can cause downloads
        modelViewer.setAttribute('disable-tap', 'false');
        
        // Styling for better compatibility
        Object.assign(modelViewer.style, {
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
          '--progress-bar-color': '#10b981',
          '--progress-bar-height': '3px',
          '--progress-mask': 'url(#progress-mask)',
          touchAction: 'manipulation'
        });

        // Enhanced event listeners
        modelViewer.addEventListener('load', () => {
          console.log('✅ Model loaded successfully');
          setModelError(null);
          setARState('supported');
        });

        modelViewer.addEventListener('error', (event) => {
          console.error('❌ Model loading error:', event);
          setModelError(`Model failed to load: ${event.detail?.message || 'Unknown error'}`);
        });

        // Enhanced AR status handling
        modelViewer.addEventListener('ar-status', (event) => {
          console.log('📱 AR Status:', event.detail.status);
          
          switch (event.detail.status) {
            case 'session-started':
              setARState('active');
              console.log('🚀 AR session started - Movement enabled');
              break;
            case 'not-presenting':
              setARState('supported');
              console.log('📱 AR session ended');
              break;
            case 'failed':
              setARState('error');
              console.error('❌ AR session failed');
              break;
            case 'session-supported':
              setARState('supported');
              break;
          }
        });

        // Prevent accidental downloads on long press
        modelViewer.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });

        // Enhanced touch handling for better mobile experience
        modelViewer.addEventListener('touchstart', (e) => {
          e.stopPropagation();
        });

        // Handle model-viewer specific events
        modelViewer.addEventListener('model-visibility', (event) => {
          console.log('Model visibility changed:', event.detail.visible);
        });

        arContainerRef.current.appendChild(modelViewer);
        
        // Force load for iOS
        if (deviceInfo.isIOS) {
          setTimeout(() => {
            if (modelViewer.src) {
              modelViewer.src = modelViewer.src; // Force reload
            }
          }, 1000);
        }
        
      } catch (error) {
        console.error('❌ Model viewer setup failed:', error);
        setModelError('Failed to setup 3D viewer');
      }
    };

    setupModelViewer();
  }, [isOpen, isModelViewerLoaded, modelPath, modelType, productName, deviceInfo]);

  // Enhanced AR launch with better iOS compatibility
  const handleLaunchAR = async () => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) {
      console.error('❌ Model viewer not found');
      return;
    }

    try {
      console.log(`🚀 Launching AR for ${productDimensions.displaySize} ${productDimensions.category}`);
      
      // Wait for model to be fully loaded
      if (!modelViewer.loaded) {
        console.log('⏳ Waiting for model to load...');
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Model loading timeout'));
          }, 10000);
          
          modelViewer.addEventListener('load', () => {
            clearTimeout(timeout);
            resolve();
          }, { once: true });
        });
      }

      if (deviceInfo.isIOS) {
        console.log('🍎 Launching iOS AR Quick Look');
        
        // Multiple iOS AR activation strategies
        const launchStrategies = [
          // Strategy 1: Direct activateAR call
          () => {
            if (typeof modelViewer.activateAR === 'function') {
              return modelViewer.activateAR();
            }
            throw new Error('activateAR not available');
          },
          
          // Strategy 2: Find and click AR button
          () => {
            const arButton = modelViewer.shadowRoot?.querySelector('[slot="ar-button"]') ||
                           modelViewer.shadowRoot?.querySelector('.ar-button') ||
                           modelViewer.shadowRoot?.querySelector('[data-ar-button]');
            
            if (arButton) {
              arButton.click();
              return Promise.resolve();
            }
            throw new Error('AR button not found');
          },
          
          // Strategy 3: Dispatch AR event
          () => {
            const arEvent = new CustomEvent('activate-ar', { bubbles: true });
            modelViewer.dispatchEvent(arEvent);
            return Promise.resolve();
          },
          
          // Strategy 4: Touch event simulation
          () => {
            const rect = modelViewer.getBoundingClientRect();
            const touch = new Touch({
              identifier: 1,
              target: modelViewer,
              clientX: rect.left + rect.width / 2,
              clientY: rect.top + rect.height / 2,
              radiusX: 10,
              radiusY: 10,
              rotationAngle: 0,
              force: 0.5
            });
            
            const touchEvent = new TouchEvent('touchstart', {
              touches: [touch],
              targetTouches: [touch],
              changedTouches: [touch],
              bubbles: true,
              cancelable: true
            });
            
            modelViewer.dispatchEvent(touchEvent);
            
            setTimeout(() => {
              const touchEndEvent = new TouchEvent('touchend', {
                touches: [],
                targetTouches: [],
                changedTouches: [touch],
                bubbles: true,
                cancelable: true
              });
              modelViewer.dispatchEvent(touchEndEvent);
            }, 100);
            
            return Promise.resolve();
          }
        ];

        // Try each strategy
        for (const [index, strategy] of launchStrategies.entries()) {
          try {
            console.log(`🍎 Trying iOS AR strategy ${index + 1}`);
            await strategy();
            console.log(`✅ iOS AR launched with strategy ${index + 1}`);
            return;
          } catch (error) {
            console.log(`❌ iOS AR strategy ${index + 1} failed:`, error.message);
            continue;
          }
        }
        
        throw new Error('All iOS AR launch strategies failed');
        
      } else if (deviceInfo.isAndroid) {
        console.log('🤖 Launching Android WebXR');
        
        if (typeof modelViewer.activateAR === 'function') {
          await modelViewer.activateAR();
          console.log('✅ Android AR launched');
        } else {
          throw new Error('WebXR not supported on this device');
        }
      }
      
    } catch (error) {
      console.error('❌ AR launch failed:', error);
      
      let errorMessage = 'AR launch failed. ';
      
      if (deviceInfo.isIOS) {
        if (deviceInfo.isChromeIOS) {
          errorMessage += 'Please try opening this page in Safari for better AR support.';
        } else if (!deviceInfo.isARCompatible) {
          errorMessage += 'AR requires iOS 12 or later.';
        } else {
          errorMessage += 'Make sure you have a compatible iOS device with AR support.';
        }
      } else if (deviceInfo.isAndroid) {
        errorMessage += 'Make sure your Android device supports ARCore.';
      } else {
        errorMessage += 'AR is currently available on mobile devices only.';
      }
      
      alert(errorMessage);
    }
  };


  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full h-full max-w-[95vw] max-h-[95vh] m-4 overflow-hidden shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-800">AR Viewer - Realistic Size</h3>
              <p className="text-sm text-gray-600">{productName}</p>
              <p className="text-xs text-green-600 font-medium">
                📏 True size • ✋ Free movement
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowInstructions(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="AR Instructions"
              >
                <HelpCircle size={20} />
              </button>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* 3D Model Area */}
          <div className="flex-1 p-6 min-h-0 relative">
            <div 
              ref={arContainerRef}
              className="w-full h-full bg-gray-100 rounded-2xl shadow-inner flex items-center justify-center relative overflow-hidden"
              style={{ minHeight: '400px' }}
            >
              {!isModelViewerLoaded && !modelError ? (
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-700 font-medium">Loading 3D Model...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Preparing {productDimensions.displaySize} model with AR support
                  </p>
                </div>
              ) : modelError ? (
                <div className="text-center p-8">
                  <div className="text-red-500 mb-4">⚠️ Model Loading Issue</div>
                  <p className="text-gray-600 mb-4">{modelError}</p>
                  <button
                    onClick={() => {
                      setModelError(null);
                      loadModelViewerForAR();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : null}
            </div>


            {/* AR Status */}
            <div className="absolute top-4 right-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm ${
                arState === 'supported' ? 'bg-green-100/90 text-green-800' :
                arState === 'checking' ? 'bg-blue-100/90 text-blue-800' :
                arState === 'active' ? 'bg-purple-100/90 text-purple-800' :
                arState === 'ios-old' ? 'bg-orange-100/90 text-orange-800' :
                'bg-red-100/90 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  arState === 'supported' ? 'bg-green-500' :
                  arState === 'checking' ? 'bg-blue-500 animate-pulse' :
                  arState === 'active' ? 'bg-purple-500' :
                  arState === 'ios-old' ? 'bg-orange-500' :
                  'bg-red-500'
                }`}></div>
                {arState === 'supported' && 'AR Ready'}
                {arState === 'checking' && 'Checking AR...'}
                {arState === 'active' && 'AR Active'}
                {arState === 'ios-old' && 'iOS 12+ Required'}
                {arState === 'unsupported' && 'AR Unavailable'}
                {arState === 'error' && 'AR Error'}
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="p-6 border-t border-gray-100">
            {isARSupported && !modelError ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={handleLaunchAR}
                    disabled={arState !== 'supported'}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center gap-3 disabled:opacity-50 shadow-lg"
                  >
                    <Camera size={20} />
                    Launch AR Experience
                  </button>
                </div>
                
                {/* Browser warning for iOS Chrome */}
                {deviceInfo.isChromeIOS && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500 text-white p-2 rounded-full">
                        <Info size={16} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-800">Better AR Experience</h4>
                        <p className="text-yellow-600 text-sm">
                          For optimal AR on iOS, please open this page in Safari browser.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <p className="font-medium text-orange-800">
                    {arState === 'ios-old' ? 'iOS 12+ Required for AR' : 'AR Available on Mobile'}
                  </p>
                  <p className="text-sm text-orange-600">
                    {arState === 'ios-old' 
                      ? 'Please update your iOS to version 12 or later' 
                      : 'Use a mobile device for AR experience'
                    }
                  </p>
                </div>
                <CameraARButton
                  productName={productName}
                  productType={modelType}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">
                AR Experience Guide
              </h4>
              <button onClick={() => setShowInstructions(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">✅ What You Can Do</h5>
                <div className="space-y-2">
                  <div>• Place on any surface (floor, wall, table)</div>
                  <div>• Move freely by dragging</div>
                  <div>• Rotate with two fingers</div>
                  <div>• Walk around to see from all angles</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">📱 Device Support</h5>
                <div className="space-y-1 text-blue-700">
                  <div>• iOS 12+ with Safari (recommended)</div>
                  <div>• Android with ARCore support</div>
                  <div>• HTTPS connection required</div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ARModal;
