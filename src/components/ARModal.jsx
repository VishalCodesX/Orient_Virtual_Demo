// Clean and spacious AR Modal with focus on 3D model

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Smartphone, Download, HelpCircle, RotateCcw } from 'lucide-react';

const ARModal = ({ isOpen, onClose, productName, modelType, modelPath }) => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [arState, setARState] = useState('checking');
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [hotspotsVisible, setHotspotsVisible] = useState(true);
  const arContainerRef = useRef(null);

  // Check AR support when modal opens
  useEffect(() => {
    if (isOpen) {
      checkARSupport();
      loadModelViewerForAR();
    }
  }, [isOpen]);

  const checkARSupport = async () => {
    try {
      if ('xr' in navigator) {
        const xr = navigator.xr;
        const isSupported = await xr.isSessionSupported('immersive-ar');
        setIsARSupported(isSupported);
        setARState(isSupported ? 'supported' : 'unsupported');
      } else {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        if (isIOS || isAndroid) {
          setIsARSupported(true);
          setARState('supported');
        } else {
          setIsARSupported(false);
          setARState('unsupported');
        }
      }
    } catch (error) {
      console.error('Error checking AR support:', error);
      setIsARSupported(false);
      setARState('unsupported');
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
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      
      script.onload = () => {
        setIsModelViewerLoaded(true);
      };
      
      document.head.appendChild(script);
    } catch (error) {
      console.error('Failed to load model-viewer for AR:', error);
    }
  };

  // Create AR-enabled model-viewer
  useEffect(() => {
    if (!isOpen || !isModelViewerLoaded || !arContainerRef.current) return;

    arContainerRef.current.innerHTML = '';

    let finalModelPath;
    if (modelPath) {
      finalModelPath = modelPath;
      console.log(`AR Modal using explicit model path: ${finalModelPath}`);
    } else {
      finalModelPath = getDefaultModelPath(modelType);
      console.log(`AR Modal using default model path for type "${modelType}": ${finalModelPath}`);
    }

    const modelViewer = document.createElement('model-viewer');
    
    // Use the working settings that showed the model before
    modelViewer.src = finalModelPath;
    modelViewer.alt = `${productName} AR Model`;
    modelViewer.setAttribute('ar', '');
    modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('environment-image', 'legacy');
    modelViewer.setAttribute('exposure', '0.8');
    modelViewer.setAttribute('shadow-intensity', '1');
    modelViewer.setAttribute('shadow-softness', '0.5');
    modelViewer.setAttribute('tone-mapping', 'aces');
    modelViewer.setAttribute('loading', 'eager');
    modelViewer.setAttribute('reveal', 'auto');
    modelViewer.setAttribute('ios-src', finalModelPath);
    
    // AR placement settings
    modelViewer.setAttribute('ar-placement', 'floor');
    modelViewer.setAttribute('ar-scale', 'auto');
    
    // Full size styling with visible background
    Object.assign(modelViewer.style, {
      width: '100%',
      height: '100%',
      backgroundColor: '#f0f0f0',
      '--progress-bar-color': '#10b981',
      '--progress-bar-height': '3px'
    });

    // Event listeners
    const handleARStatus = (event) => {
      console.log('AR Status:', event.detail);
      if (event.detail.status === 'session-started') {
        setARState('active');
      } else if (event.detail.status === 'not-presenting') {
        setARState('supported');
      }
    };

    // Add hotspots after model loads
    const handleModelLoad = () => {
      console.log('✅ 3D Model loaded successfully in AR modal');
      addHotspots();
    };

    const handleModelError = (event) => {
      console.error('❌ Model loading error in AR modal:', event);
    };

    modelViewer.addEventListener('ar-status', handleARStatus);
    modelViewer.addEventListener('load', handleModelLoad);
    modelViewer.addEventListener('error', handleModelError);

    arContainerRef.current.appendChild(modelViewer);

    return () => {
      if (arContainerRef.current) {
        modelViewer.removeEventListener('ar-status', handleARStatus);
        modelViewer.removeEventListener('load', handleModelLoad);
        modelViewer.removeEventListener('error', handleModelError);
      }
    };
  }, [isOpen, isModelViewerLoaded, modelPath, modelType, productName]);

  const getDefaultModelPath = (type) => {
    const actualModels = {
      'panel': '/models/panel-65.glb',
      'podium': '/models/podium.glb', 
      'default': '/models/panel-65.glb'
    };
    console.log(`Getting model for type: "${type}" -> ${actualModels[type] || actualModels.default}`);
    return actualModels[type] || actualModels.default;
  };

  // Add feature callouts around the model (not on it)
  const addHotspots = () => {
    const modelViewer = arContainerRef.current?.querySelector('model-viewer');
    if (!modelViewer) return;

    // Create features container
    const featuresContainer = document.createElement('div');
    featuresContainer.id = 'features-container';
    featuresContainer.className = 'absolute inset-0 pointer-events-none z-10';
    
    // Get features for this product type
    const features = getFeaturesForProduct(modelType);
    
    features.forEach((feature, index) => {
      const featureElement = document.createElement('div');
      featureElement.className = `feature-callout feature-${index + 1}`;
      featureElement.innerHTML = `
        <div class="feature-content">
          <div class="feature-icon">
            ${feature.icon}
          </div>
          <div class="feature-text">
            <div class="feature-label">${feature.label}</div>
            <div class="feature-description">${feature.description}</div>
          </div>
        </div>
        <div class="feature-line"></div>
      `;
      
      featuresContainer.appendChild(featureElement);
    });

    // Add to the model container (parent of model-viewer)
    const modelContainer = modelViewer.parentElement;
    modelContainer.appendChild(featuresContainer);

    // Add feature styles
    addFeatureStyles();
  };

  // Get features with positioning around the model (6 for panels, 4 for podiums)
  const getFeaturesForProduct = (type) => {
    const featureConfigs = {
      'panel': [
        {
          label: '4K Display',
          description: '4K Ultra HD Resolution',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="m10 9 5 3-5 3v-6z"></path>
          </svg>`,
          position: 'top-left'
        },
        {
          label: 'Multi-Touch',
          description: '20-Point Touch',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4"></path>
            <circle cx="12" cy="12" r="8"></circle>
          </svg>`,
          position: 'top-center'
        },
        {
          label: 'Android OS',
          description: 'Powered by Android',
          icon: `<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.523 15.3414c-.4478 0-.8099.362-.8099.8077 0 .4458.3621.8078.8099.8078s.8098-.3620.8098-.8078c0-.4458-.3620-.8077-.8098-.8077zm-11.046 0c-.4478 0-.8098.362-.8098.8077 0 .4458.362.8078.8098.8078.4479 0 .8099-.3620.8099-.8078 0-.4458-.3620-.8077-.8099-.8077zm11.4045-6.02l1.9143-3.4473c.1043-.1882.0362-.4265-.1521-.5308-.1883-.1043-.4266-.0362-.5309.1521L17.2062 8.96c-.9841-.41-2.1-0.6329-3.2062-.6329s-2.2221.2229-3.2062.6329L9.0048 5.9154c-.1043-.1883-.3426-.2564-.5309-.1521-.1883.1043-.2564.3426-.1521.5308L10.2361 9.32C8.7061 10.2 7.8 11.7 7.8 13.32h8.4c0-1.62-.9061-3.12-2.4361-4.0z"></path>
          </svg>`,
          position: 'top-right'
        },
        {
          label: '20W x 2 Speakers',
          description: 'Built-in Audio',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>`,
          position: 'bottom-left'
        },
        {
          label: 'Screen Cast',
          description: 'Wireless Display',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
            <line x1="2" y1="20" x2="2.01" y2="20"></line>
          </svg>`,
          position: 'bottom-center'
        },
        {
          label: 'Seamless Experience',
          description: 'Smooth Performance',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>`,
          position: 'bottom-right'
        }
      ],
      'podium': [
        {
          label: 'Built-in Amplifier',
          description: '60W Power Output',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>`,
          position: 'top-left'
        },
        {
          label: 'VHF Microphone',
          description: 'Wireless MIC System',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>`,
          position: 'top-right'
        },
        {
          label: 'Column Speaker',
          description: '60W with Tweeter & Woofers',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="2" width="12" height="20" rx="2"></rect>
            <circle cx="12" cy="8" r="2"></circle>
            <circle cx="12" cy="16" r="2"></circle>
          </svg>`,
          position: 'bottom-left'
        },
        {
          label: 'Gooseneck MIC',
          description: 'Flexible 47cm Length',
          icon: `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <path d="M8 21l4-4 4 4"></path>
          </svg>`,
          position: 'bottom-right'
        }
      ]
    };

    return featureConfigs[type] || featureConfigs['panel'];
  };

  // Add CSS styles for features
  const addFeatureStyles = () => {
    if (document.querySelector('#feature-styles')) return;

    const style = document.createElement('style');
    style.id = 'feature-styles';
    style.textContent = `
      #features-container {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.4s ease;
      }

      #features-container.show {
        opacity: 1;
        transform: scale(1);
      }

      .feature-callout {
        position: absolute;
        pointer-events: auto;
        animation: featureSlideIn 0.6s ease forwards;
      }

      .feature-callout.feature-1 {
        top: 20px;
        left: 20px;
        animation-delay: 0.1s;
      }

      .feature-callout.feature-2 {
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        animation-delay: 0.15s;
      }

      .feature-callout.feature-3 {
        top: 20px;
        right: 20px;
        animation-delay: 0.2s;
      }

      .feature-callout.feature-4 {
        bottom: 120px;
        left: 20px;
        animation-delay: 0.25s;
      }

      .feature-callout.feature-5 {
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        animation-delay: 0.3s;
      }

      .feature-callout.feature-6 {
        bottom: 120px;
        right: 20px;
        animation-delay: 0.35s;
      }

      .feature-content {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 10px 14px;
        border-radius: 14px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.2);
        min-width: 180px;
        transition: all 0.3s ease;
      }

      .feature-callout:hover .feature-content {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        border-color: rgba(16, 185, 129, 0.4);
      }

      .feature-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #10b981, #059669);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .feature-text {
        flex: 1;
      }

      .feature-label {
        font-weight: 700;
        font-size: 14px;
        color: #1f2937;
        margin-bottom: 2px;
      }

      .feature-description {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
      }

      .feature-line {
        position: absolute;
        top: 50%;
        width: 40px;
        height: 2px;
        background: linear-gradient(90deg, rgba(16, 185, 129, 0.6), transparent);
        transform: translateY(-50%);
        z-index: -1;
      }

      .feature-callout.feature-1 .feature-line {
        right: -40px;
      }

      .feature-callout.feature-2 .feature-line {
        left: -40px;
        background: linear-gradient(270deg, rgba(16, 185, 129, 0.6), transparent);
      }

      .feature-callout.feature-3 .feature-line {
        right: -40px;
      }

      .feature-callout.feature-4 .feature-line {
        left: -40px;
        background: linear-gradient(270deg, rgba(16, 185, 129, 0.6), transparent);
      }

      @keyframes featureSlideIn {
        0% {
          opacity: 0;
          transform: translateY(20px) scale(0.8);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  };

  const handleLaunchAR = () => {
    const modelViewer = arContainerRef.current?.querySelector('model-viewer');
    if (modelViewer && modelViewer.activateAR) {
      try {
        modelViewer.activateAR();
      } catch (error) {
        console.error('Failed to launch AR:', error);
        alert('AR launch failed. Please ensure you have a compatible device.');
      }
    }
  };

  const handleTakeScreenshot = () => {
    const modelViewer = arContainerRef.current?.querySelector('model-viewer');
    if (modelViewer) {
      try {
        const screenshot = modelViewer.toDataURL();
        const link = document.createElement('a');
        link.download = `${productName}_3D_screenshot.png`;
        link.href = screenshot;
        link.click();
      } catch (error) {
        console.error('Screenshot failed:', error);
      }
    }
  };

  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full h-full max-w-[95vw] max-h-[95vh] m-4 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
          
          {/* Minimal Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-800">3D Model Viewer</h3>
              <p className="text-sm text-gray-600">{productName}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Help button */}
              <button 
                onClick={() => setShowInstructions(!showInstructions)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="View AR Instructions"
              >
                <HelpCircle size={20} />
              </button>
              {/* Close button */}
              <button 
                onClick={onClose} 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Large 3D Model Area */}
          <div className="flex-1 p-6 min-h-0 relative">
            <div 
              ref={arContainerRef}
              className="w-full h-full bg-gray-100 rounded-2xl shadow-inner flex items-center justify-center relative overflow-hidden"
              style={{ minHeight: '400px' }}
            >
              {!isModelViewerLoaded ? (
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-700 font-medium">Loading 3D Model...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {modelPath ? modelPath.split('/').pop() : 'Default model'}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Floating controls - positioned to avoid features */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setHotspotsVisible(!hotspotsVisible);
                  const featuresContainer = document.querySelector('#features-container');
                  if (featuresContainer) {
                    if (hotspotsVisible) {
                      featuresContainer.classList.remove('show');
                    } else {
                      featuresContainer.classList.add('show');
                    }
                  }
                }}
                className={`px-4 py-2 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 hover:scale-105 text-sm font-medium ${
                  hotspotsVisible ? 'bg-green-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
                title="Toggle Features"
              >
                {hotspotsVisible ? 'Hide Features' : 'Show Features'}
              </button>
              
              <button 
                onClick={() => {
                  const modelViewer = arContainerRef.current?.querySelector('model-viewer');
                  if (modelViewer && modelViewer.resetTurntableRotation) {
                    modelViewer.resetTurntableRotation();
                  }
                }}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                title="Reset View"
              >
                <RotateCcw size={18} className="text-gray-700" />
              </button>
            </div>

            {/* AR Status - Floating */}
            <div className="absolute top-10 left-10">
              <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm ${
                arState === 'supported' ? 'bg-green-100/90 text-green-800' :
                arState === 'checking' ? 'bg-blue-100/90 text-blue-800' :
                arState === 'active' ? 'bg-purple-100/90 text-purple-800' :
                'bg-orange-100/90 text-orange-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  arState === 'supported' ? 'bg-green-500' :
                  arState === 'checking' ? 'bg-blue-500 animate-pulse' :
                  arState === 'active' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`}></div>
                {arState === 'supported' && 'AR Ready'}
                {arState === 'checking' && 'Checking AR...'}
                {arState === 'active' && 'AR Active'}
                {arState === 'unsupported' && 'Mobile AR Only'}
              </div>
            </div>
          </div>

          {/* Compact Bottom Controls */}
          <div className="p-6 border-t border-gray-100 flex-shrink-0">
            {isARSupported ? (
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={handleLaunchAR}
                  disabled={arState !== 'supported'}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Camera size={20} />
                  {arState === 'active' ? 'AR Session Active' : 'Launch AR Experience'}
                </button>
                
                <button 
                  onClick={handleTakeScreenshot}
                  className="flex items-center gap-2 py-3 px-6 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  <Download size={18} />
                  Screenshot
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 p-4 bg-orange-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-orange-600" />
                <div className="text-center">
                  <p className="font-medium text-orange-800">AR Available on Mobile</p>
                  <p className="text-sm text-orange-600">Best experience on iOS and Android devices</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">How to use AR</h4>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <p>Point your camera at a flat surface like a floor or table</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <p>Tap to place the {modelType} in your space</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <p>Walk around to see it from different angles</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <p>Pinch to resize or move the model as needed</p>
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