// src/components/CameraAR/CameraOverlayAR.jsx

import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, RotateCcw, Move, ZoomIn, ZoomOut, Download, Share2, Maximize, Minimize } from 'lucide-react';

const CameraOverlayAR = ({ isOpen, onClose, productName, productType }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overlayTransform, setOverlayTransform] = useState({
    x: 50, // percentage
    y: 50, // percentage
    scale: 1,
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [lastTouch, setLastTouch] = useState(null);
  const [controlMode, setControlMode] = useState('move'); // 'move', 'scale', 'rotate'
  const [showControls, setShowControls] = useState(true);
  const [roomTemplate, setRoomTemplate] = useState('camera'); // 'camera', 'classroom', 'office', 'meeting'
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    } else {
      cleanup();
    }
    
    return cleanup;
  }, [isOpen]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }

      // Request camera permission with optimal settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          facingMode: 'environment' // Use back camera on mobile
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Get product image based on type
  const getProductImage = () => {
    const productImages = {
        'panel': '/images/camera-ar/panels/panel-65-transparent.png',
        'podium': '/images/camera-ar/podium/podium-transparent.png',
        '65-inch': '/images/camera-ar/panels/panel-65-transparent.png',
        '75-inch': '/images/camera-ar/panels/panel-75-transparent.png', 
        '86-inch': '/images/camera-ar/panels/panel-86-transparent.png'
    };
    
    return productImages[productType] || productImages['panel'];
  };

  // Touch and mouse event handlers
  const handleStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    if (e.touches) {
      setLastTouch({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      if (e.touches.length === 2) {
        setIsScaling(true);
      }
    } else {
      setLastTouch({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const container = overlayRef.current?.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    
    if (e.touches) {
      if (e.touches.length === 2 && isScaling) {
        // Handle pinch to zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        if (lastTouch.distance) {
          const scaleChange = distance / lastTouch.distance;
          setOverlayTransform(prev => ({
            ...prev,
            scale: Math.max(0.3, Math.min(3, prev.scale * scaleChange))
          }));
        }
        setLastTouch({ ...lastTouch, distance });
      } else if (e.touches.length === 1) {
        // Handle single touch move
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastTouch.x;
        const deltaY = touch.clientY - lastTouch.y;
        
        handleMovement(deltaX, deltaY, rect);
        setLastTouch({ x: touch.clientX, y: touch.clientY });
      }
    } else {
      // Handle mouse movement
      const deltaX = e.clientX - lastTouch.x;
      const deltaY = e.clientY - lastTouch.y;
      
      handleMovement(deltaX, deltaY, rect);
      setLastTouch({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMovement = (deltaX, deltaY, rect) => {
    if (controlMode === 'move') {
      setOverlayTransform(prev => ({
        ...prev,
        x: Math.max(5, Math.min(95, prev.x + (deltaX / rect.width) * 100)),
        y: Math.max(5, Math.min(95, prev.y + (deltaY / rect.height) * 100))
      }));
    } else if (controlMode === 'rotate') {
      const rotationSpeed = 2;
      setOverlayTransform(prev => ({
        ...prev,
        rotation: prev.rotation + deltaX * rotationSpeed
      }));
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsScaling(false);
    setLastTouch(null);
  };

  // Control functions
  const resetPosition = () => {
    setOverlayTransform({
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    });
  };

  const adjustScale = (factor) => {
    setOverlayTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(3, prev.scale * factor))
    }));
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0);

    // Create overlay image
    const overlayImg = new Image();
    overlayImg.crossOrigin = 'anonymous';
    overlayImg.onload = () => {
      // Calculate overlay position and size
      const overlayWidth = (canvas.width * overlayTransform.scale * 0.3); // 30% of canvas width
      const overlayHeight = (overlayImg.height / overlayImg.width) * overlayWidth;
      const x = (canvas.width * overlayTransform.x / 100) - (overlayWidth / 2);
      const y = (canvas.height * overlayTransform.y / 100) - (overlayHeight / 2);
      
      // Save context for rotation
      ctx.save();
      ctx.translate(x + overlayWidth/2, y + overlayHeight/2);
      ctx.rotate(overlayTransform.rotation * Math.PI / 180);
      ctx.drawImage(overlayImg, -overlayWidth/2, -overlayHeight/2, overlayWidth, overlayHeight);
      ctx.restore();
      
      // Download the image
      const link = document.createElement('a');
      link.download = `${productName}_room_preview.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    overlayImg.src = getProductImage();
  };

  // Room template backgrounds
  const roomTemplates = {
    camera: { name: 'Live Camera', bg: null },
    classroom: { name: 'Classroom', bg: '/images/rooms/classroom-bg.jpg' },
    office: { name: 'Office', bg: '/images/rooms/office-bg.jpg' },
    meeting: { name: 'Meeting Room', bg: '/images/rooms/meeting-bg.jpg' }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-20">
        <div className="flex justify-between items-center text-white">
          <div>
            <h2 className="text-lg font-bold">View in Your Room</h2>
            <p className="text-sm text-gray-300">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Camera/Room View */}
      <div className="relative w-full h-full">
        {/* Camera Feed or Room Background */}
        {roomTemplate === 'camera' ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${roomTemplates[roomTemplate].bg})` }}
          />
        )}

        {/* Product Overlay */}
        <div
          ref={overlayRef}
          className="absolute pointer-events-auto cursor-move"
          style={{
            left: `${overlayTransform.x}%`,
            top: `${overlayTransform.y}%`,
            transform: `translate(-50%, -50%) scale(${overlayTransform.scale}) rotate(${overlayTransform.rotation}deg)`,
            zIndex: 10
          }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <img
            src={getProductImage()}
            alt={productName}
            className="max-w-none w-64 h-auto drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
            draggable={false}
          />
          
          {/* Size indicator */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {productType.includes('86') ? '86" Panel' :
             productType.includes('75') ? '75" Panel' :
             productType.includes('65') ? '65" Panel' :
             productType === 'podium' ? 'Smart Podium' : 'RAPTOR Panel'}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin w-12 h-12 border-3 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Starting camera...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-white p-8">
            <div className="text-center max-w-md">
              <Camera size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold mb-2">Camera Not Available</h3>
              <p className="text-gray-300 mb-6">
                {error === 'Camera not supported' 
                  ? 'Your device doesn\'t support camera access'
                  : 'Please allow camera access to use this feature'
                }
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setRoomTemplate('classroom')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition-colors"
                >
                  Try Classroom Background
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {!isLoading && !error && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {/* Room Template Selector */}
          <div className="flex justify-center space-x-2 mb-4">
            {Object.entries(roomTemplates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => setRoomTemplate(key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  roomTemplate === key
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>

          {/* Control Mode Selector */}
          <div className="flex justify-center space-x-2 mb-4">
            {[
              { mode: 'move', icon: Move, label: 'Move' },
              { mode: 'scale', icon: ZoomIn, label: 'Scale' },
              { mode: 'rotate', icon: RotateCcw, label: 'Rotate' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setControlMode(mode)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  controlMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => adjustScale(0.8)}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            
            <button
              onClick={() => adjustScale(1.25)}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            
            <button
              onClick={resetPosition}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
              title="Reset Position"
            >
              <RotateCcw size={20} />
            </button>
            
            <button
              onClick={capturePhoto}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-colors shadow-lg"
              title="Take Photo"
            >
              <Camera size={24} />
            </button>
            
            <button
              onClick={capturePhoto}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Instructions */}
          <div className="text-center mt-4 text-white/80 text-sm">
            {controlMode === 'move' && '👆 Drag to move the panel around'}
            {controlMode === 'scale' && '👆 Drag or pinch to resize the panel'} 
            {controlMode === 'rotate' && '👆 Drag left/right to rotate the panel'}
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraOverlayAR;