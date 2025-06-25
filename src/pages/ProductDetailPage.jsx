import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Check, X, ZoomIn, Camera, Eye, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings, Download, Share2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ARModal from '../components/ARModal';
import CameraARButton from '../components/CameraAR/CameraARButton';
import { getProductById } from '../data/products';

// Enhanced Video Modal Component with Advanced Features
const VideoModal = ({ isOpen, onClose, videoSrc, productName }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const controlsTimeoutRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          e.preventDefault();
          if (isFullscreen) exitFullscreen();
          else if (showSettings) setShowSettings(false);
          else onClose();
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardHelp(!showKeyboardHelp);
          break;
        default:
          break;
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isFullscreen, showSettings, showKeyboardHelp]);

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying && !showSettings && !showKeyboardHelp) setShowControls(false);
      }, 3000);
    };
    if (isOpen && isPlaying) resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isOpen, isPlaying, showSettings, showKeyboardHelp]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };
  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };
  const handleLoadStart = () => {
    setIsLoading(true);
    setVideoError(false);
  };
  const handleError = () => {
    setIsLoading(false);
    setVideoError(true);
  };
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const handleProgressClick = (e) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  const skipForward = () => {
    if (videoRef.current)
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  };
  const skipBackward = () => {
    if (videoRef.current)
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };
  const adjustVolume = (delta) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
    if (newVolume === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  };
  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
    setIsFullscreen(!isFullscreen);
  };
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  const downloadVideo = () => {
    const link = document.createElement('a');
    link.href = videoSrc;
    link.download = `${productName}_demo.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const shareVideo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${productName} - Virtual Demo`,
          text: `Check out this virtual demo of ${productName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (showKeyboardHelp) setShowKeyboardHelp(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={() => setShowControls(true)}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-20"
      >
        <X size={24} />
      </button>

      {/* Video Container */}
      <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center text-white">
              <div className="animate-spin w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading Virtual Demo...</p>
              <p className="text-sm text-gray-300 mt-2">Preparing {productName} demonstration</p>
            </div>
          </div>
        )}
        {/* Error State */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center text-white">
              <div className="text-red-500 mb-4">⚠️</div>
              <p className="text-lg font-medium mb-2">Video Loading Failed</p>
              <p className="text-sm text-gray-300 mb-4">Unable to load the virtual demo video</p>
              <button
                onClick={onClose}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {/* Main Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onLoadStart={handleLoadStart}
          onError={handleError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        />
        {/* Video Controls Overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-xl font-bold">{productName} - Virtual Demo</h3>
                <p className="text-sm text-gray-300">Interactive Product Demonstration</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={shareVideo}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Share Video"
                >
                  <Share2 size={20} />
                </button>
                <button
                  onClick={downloadVideo}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Download Video"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
          {/* Center Play Button (when paused) */}
          {!isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="bg-purple-500/80 hover:bg-purple-500 text-white p-6 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Play size={48} fill="currentColor" />
              </button>
            </div>
          )}
          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-4"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                {/* Skip Backward */}
                <button
                  onClick={skipBackward}
                  className="p2 hover:bg-white/20 rounded-full transition-colors"
                  title="Skip backward 10s"
                >
                  <SkipBack size={20} />
                </button>
                {/* Skip Forward */}
                <button
                  onClick={skipForward}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Skip forward 10s"
                >
                  <SkipForward size={20} />
                </button>
                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => adjustVolume(parseFloat(e.target.value) - volume)}
                    className="w-20 h-1 bg-white/30 rounded-full appearance-none slider"
                  />
                </div>
                {/* Time Display */}
                <div className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Settings */}
                <div className="relative">
                  <button
                    onClick={toggleSettings}
                    className={`p-2 hover:bg-white/20 rounded-full transition-colors ${
                      showSettings ? 'bg-white/20' : ''
                    }`}
                  >
                    <Settings size={20} />
                  </button>
                  {/* Enhanced Settings Panel */}
                  {showSettings && (
                    <div className="absolute bottom-12 right-0 bg-black/95 backdrop-blur-sm rounded-lg p-4 min-w-[250px] border border-white/10">
                      {/* Playback Speed Section */}
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-3 text-white">Playback Speed</div>
                        <div className="grid grid-cols-3 gap-2">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`px-3 py-2 rounded text-sm transition-colors ${
                                playbackRate === rate
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Keyboard Shortcuts Section */}
                      <div className="border-t border-white/10 pt-4">
                        <button
                          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                          className="flex items-center justify-between w-full text-sm font-medium mb-3 text-white hover:text-purple-300 transition-colors"
                        >
                          <span>Keyboard Shortcuts</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${showKeyboardHelp ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showKeyboardHelp && (
                          <div className="space-y-2 text-xs text-gray-300">
                            <div className="flex justify-between items-center">
                              <span>Play/Pause</span>
                              <div className="flex gap-1">
                                <kbd className="bg-white/20 px-2 py-1 rounded text-white">Space</kbd>
                                <kbd className="bg-white/20 px-2 py-1 rounded text-white">K</kbd>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Skip Forward/Back</span>
                              <div className="flex gap-1">
                                <kbd className="bg-white/20 px-2 py-1 rounded text-white">←</kbd>
                                <kbd className="bg-white/20 px-2 py-1 rounded text-white">→</kbd>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Volume Up/Down</span>
                              <div className="flex gap-1">
                                <kbd className="bg-white/20 px-2 py-1 rounded text-white">↑</kbd>
                                <kbd className="bg-white/20 px-2 py-1 rounded text-white">↓</kbd>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Mute</span>
                              <kbd className="bg-white/20 px-2 py-1 rounded text-white">M</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Fullscreen</span>
                              <kbd className="bg-white/20 px-2 py-1 rounded text-white">F</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Close/Exit</span>
                              <kbd className="bg-white/20 px-极2 py-1 rounded text-white">Esc</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Show Shortcuts</span>
                              <kbd className="bg-white/20 px-2 py-1 rounded text-white">?</kbd>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Close Settings Button */}
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <button
                          onClick={() => setShowSettings(false)}
                          className="w-full bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-sm transition-colors"
                        >
                          Close Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Image Modal Component
const ImageModal = ({ isOpen, onClose, imageSrc, productName }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-7xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 z-10"
        >
          <X size={24} />
        </button>
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-all duration-200 z-10 flex items-center gap-2"
        >
          <Arrow极Left size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
        <img
          src={imageSrc}
          alt={productName}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
          <p className="font-medium">{productName}</p>
          <p className="text-sm text-gray-300">Press ESC or click outside to close</p>
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// KYOCERA Product Detail Component
const KyoceraProductDetail = ({ product }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Large Product Image */}
      <div className="space-y-6">
        <div
          className="relative bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group h-[500px]"
          onClick={() => setShowImageModal(true)}
        >
          <img
            src={product.image || "https://via.placeholder.com/600x450?text=Product+Image"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x450?text=Product+Image";
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/90 p-3 rounded-full">
              <ZoomIn size={24} className="text-gray-800" />
            </div>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            Click to enlarge
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">High-Quality Product Image</h3>
          <p className="text-blue-极600 text-sm">
            Click the image above to view in full-screen mode for detailed examination of all product features.
          </p>
        </div>
      </div>
      {/* Product Information */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              KYOCERA
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{product.description}</p>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600">(4.8/5 based on 127 reviews)</span>
          </div>
          <div className="mb-8">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-极700 transition-all duration-200 shadow-lg">
              Know More
            </button>
            <p className="text-sm text-gray-600 mt-2">Click to get detailed pricing and consultation</p>
          </div>
        </div>
        {/* Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Technical Specifications</h3>
          {product.specs && product.specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">{spec}</span>
            </div>
          ))}
        </div>
        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Key Features</h3>
          {product.features && product.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        {/* Action Buttons */}
        <div className="space-y-4">
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-lg">
            Request Quote
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button className="border-2 border-blue-200 text-blue-600 py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors font-medium">
              Download Brochure
            </button>
            <button className="border-2 border-gray-200 text-gray-600 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={product.image || "https://via.placeholder.com/600x450?text=Product+Image"}
        productName={product.name}
      />
    </div>
  );
};

// RAPTOR Product Detail Component - Enhanced with Video Modal
const RaptorProductDetail = ({ product }) => {
  const [showAR, setShowAR] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleARClick = () => {
    setShowAR(true);
  };

  const handleVideoClick = () => {
    setShowVideoModal(true);
  };

  // Get all product images (main image + gallery images)
  const getAllImages = () => {
    const images = [product.image];
    if (product.gallery && product.gallery.length > 0) {
      images.push(...product.gallery);
    } else {
      // Fallback demo images if no gallery is provided
      const demoImages = [
        product.image,
        product.image,
        product.image,
        product.image
      ];
      return demoImages;
    }
    return images;
  };

  const productImages = getAllImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image Gallery Section - Clean Version */}
        <div className="space-y-6">
          {/* Main Image Gallery */}
          <div
            className="relative bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group h-[500px]"
            onClick={() => setShowImageModal(true)}
          >
            {/* Current Image */}
            <img
              src={productImages[currentImageIndex] || "https://via.placeholder.com/600x450?text=Product+Image"}
              alt={`${product.name} - View ${currentImageIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x450?text=Product+Image";
              }}
            />
            {/* Image Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 极0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            {/* Image Counter */}
            {productImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              Click to enlarge • {productImages.length} photos
            </div>
          </div>
          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    currentImageIndex === index
                      ? 'ring-3 ring-green-500 scale-105'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image || "https://via.placeholder.com/150x150?text=Image"}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150x150?text=Image";
                    }}
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Enhanced AR Experience Section - Clean Version */}
          {product.hasAR && (
            <div className="space-y-4">
              {/* Advanced AR Card */}
              <div className="bg-gradient-to-r from-green-500 to-green-极600 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 text-white">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Camera size={20} />
                    Experience in Augmented Reality
                  </h3>
                  <p className="text-green-100 mb-4">
                    See how this {product.modelType || product.type} will look in your space with full 3D interaction and realistic placement
                  </p>
                  <button
                    onClick={handleARClick}
                    className="w-full bg-white text-green-600 py-3 px-6 rounded-xl font-bold hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <Camera size={20} />
                    Launch AR Experience
                  </button>
                </div>
              </div>
              {/* Simple Camera AR Card */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 text-white">
                  <h3 className="font-bold text-lg mb-2 flex items极-center gap-2">
                    <Eye size={20} />
                    View in Your Room
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Instantly see the product in your room with our simple camera overlay feature - no downloads required
                  </p>
                  <CameraARButton
                    productName={product.name}
                    productType={product.modelType || product.type || 'panel'}
                    className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Enhanced Virtual Demo Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 text-white">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Play size={20} />
                Virtual Full Demo
              </h3>
              <p className="text-purple-100 mb-4">
                Watch a complete interactive demonstration with all features and capabilities explained in detail
              </p>
              <button
                onClick={handleVideoClick}
                className="w-full bg-white text-purple-600 py-3 px-6 rounded-xl font-bold hover:bg-purple-50 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
              >
                <Play size={20} />
                Start Virtual Demo
              </button>
            </div>
          </div>
          {/* Clean Info Card - No Badges */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              🎮 Multiple Viewing Options Available
            </h3>
            <p className="text-green-600 text-sm mb-3">
              This product features multiple visualization options to help you make the best decision:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-green-600" />
                <span className="text-green-700"><strong>Advanced AR:</strong> Full 3D model with realistic placement</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-blue-600" />
                <span className="text-green-700"><strong>Room Preview:</strong> Quick camera overlay visualization</span>
              </div>
              <div className="flex items-center gap-2">
                <Play size={14} className="text-purple-600" />
                <span className="text-green-700"><strong>Virtual Demo:</strong> Complete video walkthrough with features</span>
              </div>
            </div>
          </div>
        </div>
        {/* Product Information - Clean Version */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                RAPTOR
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">(4.9/5 based on 89 reviews)</span>
            </div>
            <div className="mb-8">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg">
                Know More
              </button>
              <p className="text-sm text-gray-600 mt极-2">Click to get detailed pricing and consultation</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specs'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'features'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Features
              </button>
            </nav>
          </div>
          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'specs' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Technical Specifications</h3>
                {product.specs && product.specs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-极700">{spec}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'features' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semib极old text-gray-800">Key Features</h3>
                {product.features && product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-lg">
              Request Quote
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button className="border-2 border-green-200 text-green-600 py-3 px-6 rounded-xl hover:bg-green-50 transition-colors font-medium">
                Download Brochure
              </button>
              <button className="border-2 border-gray-200 text-gray-600 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={productImages[currentImageIndex]}
        productName={product.name}
      />
      {/* AR Modal - Only loads 3D model when opened */}
      <ARModal
        isOpen={showAR}
        onClose={() => setShowAR(false)}
        productName={product.name}
        modelType={product.modelType || product.type}
        modelPath={product.modelPath}
      />
      {/* Enhanced Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoSrc="/videos/panel_demo.mp4"
        productName={product.name}
      />
    </>
  );
};

// Main Product Detail Page Component
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading product:', error);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={handleBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-8 group"
        >
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" size={20} />
          <span className="font-medium">Back to Products</span>
        </button>
        {product.category === 'kyocera' ? (
          <KyoceraProductDetail product={product} />
        ) : (
          <RaptorProductDetail product={product} />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
