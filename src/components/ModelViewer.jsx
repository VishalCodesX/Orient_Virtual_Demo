// Updated ModelViewer.jsx with product image fallback and Camera AR integration

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Eye, RotateCcw, Maximize, X, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import CameraARButton from './CameraAR/CameraARButton';

const ModelViewer = ({ 
  modelType, 
  modelPath, 
  onARClick, 
  productName, 
  productImage, // Add this prop for the product image
  className = "" 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelState, setModelState] = useState('loading');
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const [showImageFallback, setShowImageFallback] = useState(!modelPath);
  const containerRef = useRef(null);

  // Load model-viewer script only when actually needed
  useEffect(() => {
    // If no model path provided, show image immediately and don't load model-viewer
    if (!modelPath) {
      setShowImageFallback(true);
      setModelState('fallback');
      return;
    }

    // Don't auto-load model-viewer on component mount - wait for user interaction
    // This prevents slow loading on the main product page
    setShowImageFallback(true);
    setModelState('ready'); // Ready to load when needed
  }, [modelPath]);

  // Create model-viewer element when script is loaded
  useEffect(() => {
    if (!isModelViewerLoaded || !containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = '';

    // Determine final model path - prioritize explicit modelPath, then type-based default
    let finalModelPath;
    if (modelPath) {
      finalModelPath = modelPath;
      console.log(`Using explicit model path: ${finalModelPath}`);
    } else {
      finalModelPath = getDefaultModelPath(modelType);
      console.log(`Using default model path for type "${modelType}": ${finalModelPath}`);
    }

    // Create model-viewer element
    const modelViewer = document.createElement('model-viewer');
    
    // Set attributes with proper lighting for materials
    modelViewer.src = finalModelPath;
    modelViewer.alt = productName || `${modelType} 3D model`;
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('environment-image', 'legacy');
    modelViewer.setAttribute('exposure', '0.8');
    modelViewer.setAttribute('shadow-intensity', '1');
    modelViewer.setAttribute('shadow-softness', '0.5');
    modelViewer.setAttribute('tone-mapping', 'aces');
    modelViewer.setAttribute('loading', 'eager');
    modelViewer.setAttribute('reveal', 'auto');
    
    // Enable AR for supported devices
    if (modelType === 'panel' || modelType === 'podium') {
      modelViewer.setAttribute('ar', '');
      modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
      modelViewer.setAttribute('ios-src', finalModelPath);
    }
    
    // Set styles
    Object.assign(modelViewer.style, {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      '--progress-bar-color': '#10b981',
      '--progress-bar-height': '4px'
    });

    // Event handlers
    const handleLoad = () => {
      console.log('3D model loaded successfully');
      setModelState('loaded');
      setShowImageFallback(false);
    };

    const handleError = (event) => {
      console.error('Model loading error:', event);
      setModelState('fallback');
      setShowImageFallback(true);
    };

    const handleProgress = (event) => {
      if (event.detail?.totalProgress) {
        const progress = Math.round(event.detail.totalProgress * 100);
        console.log(`Loading progress: ${progress}%`);
      }
    };

    // Add event listeners
    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    modelViewer.addEventListener('progress', handleProgress);

    // Append to container
    containerRef.current.appendChild(modelViewer);

    // Set timeout to show image if model takes too long
    const timeout = setTimeout(() => {
      if (modelState === 'loading') {
        console.log('Model taking too long, showing image fallback');
        setShowImageFallback(true);
      }
    }, 10000); // 10 seconds timeout

    // Cleanup function
    return () => {
      clearTimeout(timeout);
      if (containerRef.current) {
        modelViewer.removeEventListener('load', handleLoad);
        modelViewer.removeEventListener('error', handleError);
        modelViewer.removeEventListener('progress', handleProgress);
      }
    };
  }, [isModelViewerLoaded, modelPath, modelType, productName]);

  // Get model paths from your actual GLB files
  const getDefaultModelPath = (type) => {
    const actualModels = {
      'panel': '/models/panel-65.glb',
      'podium': '/models/podium.glb',
      'default': '/models/panel-65.glb'
    };
    console.log(`Getting model for type: "${type}" -> ${actualModels[type] || actualModels.default}`);
    return actualModels[type] || actualModels.default;
  };

  // Product Image Fallback Component
  const ProductImageFallback = () => (
    <div className="relative w-full h-full">
      <img 
        src={productImage} 
        alt={productName}
        className="w-full h-full object-cover"
        onError={(e) => {
          // If product image also fails, show a placeholder
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTIwIiByPSI0MCIgZmlsbD0iIzEwYjk4MSIgb3BhY2l0eT0iMC4yIi8+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzEwYjk4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk9yaWVudCBTb2x1dGlvbnM8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI3NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3QgSW1hZ2U8L3RleHQ+PC9zdmc+';
        }}
      />
      
      {/* AR & 3D Available Overlay */}
      {(modelPath || modelType === 'panel' || modelType === 'podium') && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="text-center text-white">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-2 mx-auto w-fit">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p className="text-sm font-medium">AR Visualization Available</p>
            <p className="text-xs text-white/80">
              {modelState === 'loading' ? 'Loading...' : 'Multiple viewing options available'}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced AR Buttons for Image View */}
      {(modelType === 'panel' || modelType === 'podium') && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          {/* Advanced AR Button */}
          {onARClick && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleARClick();
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 hover:scale-105 text-sm"
            >
              <Camera size={16} />
              Advanced AR
            </button>
          )}
          
          {/* Simple Camera AR Button */}
          <CameraARButton
            productName={productName}
            productType={modelType}
            className="text-xs px-3 py-2"
          />
        </div>
      )}
    </div>
  );

  // Status icon - don't show loading for image display
  const getStatusIcon = () => {
    switch(modelState) {
      case 'loaded': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ready': return null; // No icon for ready state (showing image)
      case 'fallback': return null; // No icon for fallback (showing image)
      case 'loading': return <LoadingSpinner size="small" />;
      default: return null;
    }
  };

  const getStatusText = () => {
    switch(modelState) {
      case 'ready': return '📸 Product Image';
      case 'loaded': return '🎉 3D Model Active';
      case 'loading': return '⏳ Loading 3D Model...';
      case 'fallback': return productImage ? '📸 Product Image' : '🎨 Preview Mode';
      default: return '🚀 Ready to View';
    }
  };

  // Handle AR click - load model-viewer only when needed
  const handleARClick = () => {
    if (onARClick) {
      onARClick(); // Open AR modal immediately - let AR modal handle 3D loading
    }
  };

  return (
    <>
      <div className={`relative bg-gradient-to-br from-green-50 to-white rounded-xl overflow-hidden shadow-lg ${
        isFullscreen ? 'fixed inset-4 z-50' : 'w-full h-96'
      } ${className}`}>
        
        <div className="w-full h-full flex items-center justify-center">
          {/* Always show image fallback on main product page - 3D only in AR modal */}
          {showImageFallback && productImage ? (
            <ProductImageFallback />
          ) : (
            <div className="text-center">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-600">Preparing 3D model...</p>
              <div 
                ref={containerRef} 
                className="absolute inset-0 opacity-0"
              />
            </div>
          )}
        </div>
        
        {/* Status Indicator - only show when actually loading */}
        {(modelState === 'loading' || modelState === 'loaded') && (
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${
              modelState === 'loaded' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {getStatusIcon()}
              {getStatusText()}
            </div>
          </div>
        )}

        {/* 3D Viewer Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
            title="Fullscreen"
          >
            <Maximize size={20} className="text-green-600" />
          </button>
          {modelState === 'loaded' && (
            <button 
              onClick={() => {
                const modelViewer = containerRef.current?.querySelector('model-viewer');
                if (modelViewer && modelViewer.resetTurntableRotation) {
                  modelViewer.resetTurntableRotation();
                }
              }}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
              title="Reset View"
            >
              <Eye size={20} className="text-green-600" />
            </button>
          )}
        </div>
        
        {/* Enhanced AR Buttons Section for 3D Model View */}
        {(modelType === 'panel' || modelType === 'podium') && !(showImageFallback && productImage) && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            {/* Advanced AR Button (for supported devices) */}
            {onARClick && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleARClick();
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-2 hover:scale-105"
              >
                <Camera size={20} />
                AR Experience
              </button>
            )}
            
            {/* Camera Overlay AR Button (for all devices) */}
            <CameraARButton
              productName={productName}
              productType={modelType}
              className="text-sm px-4 py-2"
            />
          </div>
        )}

        {/* Model Info - only show when 3D model is active */}
        {modelState === 'loaded' && (
          <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm">
            <div className="font-medium">{productName}</div>
            <div className="text-gray-300">
              🎮 Interactive 3D Model
            </div>
          </div>
        )}

        {/* AR Features Badge */}
        {(modelType === 'panel' || modelType === 'podium') && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
              🚀 AR Ready • Multiple View Options
            </div>
          </div>
        )}

        {/* Fullscreen close button */}
        {isFullscreen && (
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10"
          >
            <X size={20} className="text-green-600" />
          </button>
        )}
      </div>
    </>
  );
};

export default ModelViewer;