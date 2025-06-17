// src/components/CameraAR/CameraARButton.jsx

import React, { useState } from 'react';
import { Camera, Eye, Smartphone } from 'lucide-react';
import CameraOverlayAR from './CameraOverlayAR';

const CameraARButton = ({ productName, productType, className = "" }) => {
  const [showCameraAR, setShowCameraAR] = useState(false);

  const handleQuickTry = () => {
    setShowCameraAR(true);
  };

  return (
    <>
      <button
        onClick={handleQuickTry}
        className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-lg ${className}`}
      >
        <Eye size={20} />
        View in Your Room
      </button>

      {/* Camera Overlay AR Modal */}
      <CameraOverlayAR
        isOpen={showCameraAR}
        onClose={() => setShowCameraAR(false)}
        productName={productName}
        productType={productType}
      />
    </>
  );
};

export default CameraARButton;