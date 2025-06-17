// Enhanced ARModal.jsx with iOS AR Quick Look fix

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Smartphone, Download, HelpCircle, RotateCcw, AlertCircle } from 'lucide-react';
import CameraARButton from './CameraAR/CameraARButton';

const ARModal = ({ isOpen, onClose, productName, modelType, modelPath }) => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [arState, setARState] = useState('checking');
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [modelError, setModelError] = useState(null);
  const arContainerRef = useRef(null);

  // Enhanced device detection with iOS specific checks
  useEffect(() => {
    if (isOpen) {
      detectDeviceCapabilities();
      loadModelViewerForAR();
    }
  }, [isOpen]);

  const detectDeviceCapabilities = async () => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isIOSSafari = isIOS && /Safari/.test(userAgent) && !/CriOS|FxiOS|OPiOS|mercury/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !isIOS;
    const isChromeIOS = /CriOS/.test(userAgent);
    
    // Check iOS version for AR Quick Look support (iOS 12+)
    let iosVersion = null;
    if (isIOS) {
      const match = userAgent.match(/OS (\d+)_(\d+)/);
      if (match) {
        iosVersion = parseInt(match[1]);
      }
    }
    
    const device = {
      isIOS,
      isIOSSafari,
      isAndroid,
      isChrome,
      isChromeIOS,
      isHTTPS: location.protocol === 'https:',
      isLocalhost: location.hostname === 'localhost',
      iosVersion,
      supportsQuickLook: isIOS && iosVersion >= 12
    };
    
    setDeviceInfo(device);
    
    console.log('🔍 Enhanced Device Detection:', device);

    try {
      if (device.isIOS && device.supportsQuickLook) {
        // iOS devices with Quick Look support
        setIsARSupported(true);
        setARState('supported');
        console.log('✅ iOS AR Quick Look available');
      } else if (device.isAndroid && 'xr' in navigator) {
        // Android with WebXR support
        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        setIsARSupported(isSupported);
        setARState(isSupported ? 'supported' : 'unsupported');
        console.log('🤖 Android WebXR:', isSupported ? 'Available' : 'Not available');
      } else {
        setIsARSupported(false);
        setARState('unsupported');
        console.log('❌ AR not supported on this device');
      }
    } catch (error) {
      console.error('Error detecting AR capabilities:', error);
      // Be optimistic for iOS, conservative for others
      setIsARSupported(device.isIOS && device.supportsQuickLook);
      setARState(device.isIOS ? 'supported' : 'unsupported');
    }
  };

  const loadModelViewerForAR = async () => {
    if (customElements.get('model-viewer')) {
      setIsModelViewerLoaded(true);
      return;
    }

    try {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js';
      
      script.onload = () => {
        console.log('✅ Model-viewer library loaded');
        setIsModelViewerLoaded(true);
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load model-viewer library');
        setModelError('Failed to load 3D viewer');
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('Failed to load model-viewer for AR:', error);
      setModelError('Failed to initialize 3D viewer');
    }
  };

  // Enhanced model paths with iOS-specific USDZ support
  const getModelPaths = (type, explicitPath) => {
    if (explicitPath) {
      const basePath = explicitPath.replace(/\.(glb|gltf)$/i, '');
      return {
        glb: explicitPath,
        usdz: `${basePath}.usdz`
      };
    }
    
    // Default model paths with USDZ alternatives
    const modelMaps = {
      'panel': {
        glb: '/models/panel-65.glb',
        usdz: '/models/panel-65.usdz'
      },
      'podium': {
        glb: '/models/podium.glb',
        usdz: '/models/podium.usdz'
      },
      'default': {
        glb: '/models/panel-65.glb',
        usdz: '/models/panel-65.usdz'
      }
    };
    
    const paths = modelMaps[type] || modelMaps.default;
    console.log(`📁 Model paths for "${type}":`, paths);
    return paths;
  };

  // Create AR-enabled model-viewer with iOS-specific fixes
  useEffect(() => {
    if (!isOpen || !isModelViewerLoaded || !arContainerRef.current) return;

    const setupModelViewer = async () => {
      arContainerRef.current.innerHTML = '';

      const modelPaths = getModelPaths(modelType, modelPath);
      
      console.log('📋 Setting up model viewer for:', {
        modelPaths,
        device: deviceInfo
      });

      const modelViewer = document.createElement('model-viewer');
      
      // CRITICAL iOS Fix: Set primary source based on device
      if (deviceInfo.isIOS) {
        // For iOS, prioritize USDZ for AR, GLB for 3D viewing
        modelViewer.src = modelPaths.glb;
        modelViewer.setAttribute('ios-src', modelPaths.usdz);
        
        // iOS-specific AR configuration
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('ar-modes', 'quick-look');
        
        // CRITICAL: Prevent download behavior
        modelViewer.setAttribute('interaction-prompt', 'none');
        modelViewer.setAttribute('loading', 'eager');
        
        console.log('🍎 iOS configuration applied');
      } else {
        // Android/Desktop configuration
        modelViewer.src = modelPaths.glb;
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('ar-modes', 'webxr scene-viewer');
        
        console.log('🤖 Android/Desktop configuration applied');
      }
      
      modelViewer.alt = `${productName} AR Model`;
      
      // General 3D viewer settings
      modelViewer.setAttribute('camera-controls', '');
      modelViewer.setAttribute('auto-rotate', '');
      modelViewer.setAttribute('environment-image', 'legacy');
      modelViewer.setAttribute('exposure', '0.8');
      modelViewer.setAttribute('shadow-intensity', '1');
      modelViewer.setAttribute('shadow-softness', '0.5');
      
      // AR placement settings
      modelViewer.setAttribute('ar-placement', 'floor');
      modelViewer.setAttribute('ar-scale', 'auto');
      
      // Styling
      Object.assign(modelViewer.style, {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        '--progress-bar-color': '#10b981',
        '--progress-bar-height': '3px'
      });

      // Enhanced event listeners
      const handleARStatus = (event) => {
        console.log('📱 AR Status Event:', event.detail);
        if (event.detail.status === 'session-started') {
          setARState('active');
        } else if (event.detail.status === 'not-presenting') {
          setARState('supported');
        } else if (event.detail.status === 'failed') {
          console.error('❌ AR session failed');
          setARState('error');
        }
      };

      const handleModelLoad = () => {
        console.log('✅ 3D Model loaded successfully');
        setModelError(null);
      };

      const handleModelError = (event) => {
        console.error('❌ Model loading error:', event);
        setModelError('Model failed to load');
      };

      // Add event listeners
      modelViewer.addEventListener('ar-status', handleARStatus);
      modelViewer.addEventListener('load', handleModelLoad);
      modelViewer.addEventListener('error', handleModelError);

      // iOS-specific event handling
      if (deviceInfo.isIOS) {
        // Handle iOS AR button interaction
        modelViewer.addEventListener('quick-look-button-tapped', () => {
          console.log('🍎 iOS Quick Look button tapped');
        });
        
        // Prevent context menu on long press (can trigger download)
        modelViewer.addEventListener('contextmenu', (e) => {
          e.preventDefault();
        });
      }

      // Append to container
      arContainerRef.current.appendChild(modelViewer);

      // Cleanup function
      return () => {
        if (arContainerRef.current && modelViewer) {
          modelViewer.removeEventListener('ar-status', handleARStatus);
          modelViewer.removeEventListener('load', handleModelLoad);
          modelViewer.removeEventListener('error', handleModelError);
        }
      };
    };

    setupModelViewer();
  }, [isOpen, isModelViewerLoaded, modelPath, modelType, productName, deviceInfo]);

  // iOS-specific AR launch function
  const handleLaunchAR = async () => {
    const modelViewer = arContainerRef.current?.querySelector('model-viewer');
    if (!modelViewer) {
      console.error('❌ Model viewer not found');
      return;
    }

    try {
      console.log('🚀 Launching AR experience...');
      console.log('📱 Device info:', deviceInfo);

      if (deviceInfo.isIOS) {
        console.log('🍎 Launching iOS AR Quick Look');
        
        // Wait for model to be fully loaded
        if (!modelViewer.loaded) {
          console.log('⏳ Model not loaded yet, waiting...');
          await new Promise((resolve) => {
            modelViewer.addEventListener('load', resolve, { once: true });
          });
        }

        // iOS AR Launch Methods (try multiple approaches)
        
        // Method 1: Use activateAR if available
        if (typeof modelViewer.activateAR === 'function') {
          console.log('📱 Using activateAR method');
          await modelViewer.activateAR();
        } else {
          // Method 2: Create and dispatch AR button click event
          console.log('📱 Using synthetic AR button click');
          
          // Find the AR button in shadow DOM
          const arButton = modelViewer.shadowRoot?.querySelector('.ar-button') || 
                          modelViewer.shadowRoot?.querySelector('[slot="ar-button"]') ||
                          modelViewer.shadowRoot?.querySelector('button[data-js-focus-visible]');
          
          if (arButton) {
            console.log('📱 Found AR button, clicking...');
            arButton.click();
          } else {
            // Method 3: Trigger via model interaction
            console.log('📱 Triggering via model interaction');
            const touchEvent = new TouchEvent('touchstart', {
              bubbles: true,
              cancelable: true,
              touches: [{
                clientX: modelViewer.clientWidth / 2,
                clientY: modelViewer.clientHeight / 2
              }]
            });
            modelViewer.dispatchEvent(touchEvent);
            
            // Immediately follow with touchend
            setTimeout(() => {
              const touchEndEvent = new TouchEvent('touchend', {
                bubbles: true,
                cancelable: true
              });
              modelViewer.dispatchEvent(touchEndEvent);
            }, 100);
          }
        }
      } else {
        // Android/WebXR launch
        console.log('🤖 Launching Android WebXR');
        if (typeof modelViewer.activateAR === 'function') {
          await modelViewer.activateAR();
        } else {
          console.error('❌ WebXR not supported');
        }
      }
    } catch (error) {
      console.error('❌ AR launch failed:', error);
      
      // Show user-friendly error message
      const errorMessage = deviceInfo.isIOS 
        ? 'AR Quick Look requires iOS 12+ and Safari browser. Please ensure you\'re using Safari on a compatible iOS device.'
        : 'AR requires a compatible Android device with ARCore support.';
      
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full h-full max-w-[95vw] max-h-[95vh] m-4 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
          
          {/* Enhanced Header with device-specific info */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-800">3D Model Viewer</h3>
              <p className="text-sm text-gray-600">{productName}</p>
              <p className="text-xs text-gray-500">
                {deviceInfo.isIOS ? '🍎 iOS Quick Look' : 
                 deviceInfo.isAndroid ? '🤖 Android WebXR' : '💻 Desktop'} • 
                {deviceInfo.isHTTPS ? '🔒 HTTPS' : '⚠️ HTTP'}
                {deviceInfo.iosVersion && ` • iOS ${deviceInfo.iosVersion}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowInstructions(!showInstructions)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="View AR Instructions"
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
                    {deviceInfo.isIOS ? 'Preparing USDZ for iOS...' : 'Loading GLB model...'}
                  </p>
                </div>
              ) : modelError ? (
                <div className="text-center p-8">
                  <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Model Loading Issue</h3>
                  <p className="text-gray-600 mb-4">{modelError}</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setModelError(null);
                        loadModelViewerForAR();
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Retry Loading
                    </button>
                    <p className="text-xs text-gray-500">
                      Try using the "View in Your Room" option instead
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Enhanced AR Status */}
            <div className="absolute top-4 left-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm ${
                arState === 'supported' ? 'bg-green-100/90 text-green-800' :
                arState === 'checking' ? 'bg-blue-100/90 text-blue-800' :
                arState === 'active' ? 'bg-purple-100/90 text-purple-800' :
                arState === 'error' ? 'bg-red-100/90 text-red-800' :
                'bg-orange-100/90 text-orange-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  arState === 'supported' ? 'bg-green-500' :
                  arState === 'checking' ? 'bg-blue-500 animate-pulse' :
                  arState === 'active' ? 'bg-purple-500' :
                  arState === 'error' ? 'bg-red-500' :
                  'bg-orange-500'
                }`}></div>
                {arState === 'supported' && (deviceInfo.isIOS ? 'iOS AR Ready' : 'Android AR Ready')}
                {arState === 'checking' && 'Checking AR...'}
                {arState === 'active' && 'AR Active'}
                {arState === 'error' && 'AR Error'}
                {arState === 'unsupported' && 'Mobile AR Only'}
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Controls */}
          <div className="p-6 border-t border-gray-100 flex-shrink-0">
            {isARSupported && !modelError ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={handleLaunchAR}
                    disabled={arState !== 'supported'}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <Camera size={20} />
                    {arState === 'active' ? 'AR Session Active' : 
                     deviceInfo.isIOS ? 'Launch iOS AR' : 'Launch Android AR'}
                  </button>
                </div>
                
                {/* Alternative option */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Having trouble? Try our simple camera overlay:</p>
                  <CameraARButton
                    productName={productName}
                    productType={modelType}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                  <div className="text-center">
                    <p className="font-medium text-orange-800">AR Available on Mobile</p>
                    <p className="text-sm text-orange-600">
                      {deviceInfo.isIOS ? 'Requires iOS 12+ with Safari' : 
                       deviceInfo.isAndroid ? 'Requires Android 7+ with Chrome' :
                       'Best experience on iOS and Android devices'}
                    </p>
                  </div>
                </div>
                
                {/* Fallback option */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Try our camera overlay instead:</p>
                  <CameraARButton
                    productName={productName}
                    productType={modelType}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Instructions Modal for iOS */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">
                How to use {deviceInfo.isIOS ? 'iOS' : 'Android'} AR
              </h4>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              {deviceInfo.isIOS ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p>Tap "Launch iOS AR" to open AR Quick Look</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p>Point your camera at a flat surface (floor, desk, table)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <p>Tap the screen to place the {modelType} in your space</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <p>Use pinch gestures to resize and drag to move the model</p>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm font-medium">💡 Pro Tip</p>
                    <p className="text-blue-600 text-xs">Make sure you're using Safari for the best iOS AR experience</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p>Tap "Launch Android AR" to open Scene Viewer</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p>Point your camera at a flat surface like a floor or table</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <p>Tap to place the {modelType} in your space</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <p>Walk around to see it from different angles and pinch to resize</p>
                  </div>
                </>
              )}
            </div>
            
            {/* Browser-specific warnings */}
            {deviceInfo.isIOS && deviceInfo.isChromeIOS && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 text-sm font-medium">⚠️ Browser Notice</p>
                <p className="text-yellow-700 text-xs">For best AR experience on iOS, please use Safari browser instead of Chrome.</p>
              </div>
            )}
            
            {!deviceInfo.isHTTPS && !deviceInfo.isLocalhost && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-red-800 text-sm font-medium">🔒 HTTPS Required</p>
                <p className="text-red-600 text-xs">AR features require a secure HTTPS connection.</p>
              </div>
            )}
            
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