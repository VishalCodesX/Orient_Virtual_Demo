// src/components/CameraAR/RoomTemplates.js

export const roomTemplates = {
  camera: {
    name: 'Live Camera',
    description: 'Use your device camera',
    bg: null,
    icon: '📷'
  },
  classroom: {
    name: 'Classroom',
    description: 'Modern classroom setting',
    bg: '/images/rooms/classroom-bg.jpg',
    icon: '🏫'
  },
  office: {
    name: 'Office',
    description: 'Professional office space',
    bg: '/images/rooms/office-bg.jpg', 
    icon: '🏢'
  },
  meeting: {
    name: 'Meeting Room',
    description: 'Conference room setup',
    bg: '/images/rooms/meeting-bg.jpg',
    icon: '🤝'
  },
  auditorium: {
    name: 'Auditorium',
    description: 'Large presentation hall',
    bg: '/images/rooms/auditorium-bg.jpg',
    icon: '🎭'
  }
};

// Product-specific settings
export const productSettings = {
  'panel': {
    defaultScale: 1,
    minScale: 0.3,
    maxScale: 2.5,
    defaultPosition: { x: 50, y: 40 }, // Higher up on wall
    shadow: 'drop-shadow(0 10px 30px rgba(0,0,0,0.4))'
  },
  '65-inch': {
    defaultScale: 0.8,
    minScale: 0.3,
    maxScale: 2,
    defaultPosition: { x: 50, y: 40 },
    shadow: 'drop-shadow(0 8px 25px rgba(0,0,0,0.4))'
  },
  '75-inch': {
    defaultScale: 1,
    minScale: 0.3,
    maxScale: 2.2,
    defaultPosition: { x: 50, y: 40 },
    shadow: 'drop-shadow(0 10px 30px rgba(0,0,0,0.4))'
  },
  '86-inch': {
    defaultScale: 1.2,
    minScale: 0.4,
    maxScale: 2.5,
    defaultPosition: { x: 50, y: 40 },
    shadow: 'drop-shadow(0 12px 35px rgba(0,0,0,0.4))'
  },
  'podium': {
    defaultScale: 1,
    minScale: 0.3,
    maxScale: 2,
    defaultPosition: { x: 50, y: 70 }, // Lower on ground
    shadow: 'drop-shadow(0 15px 40px rgba(0,0,0,0.5))'
  }
};

// Camera settings for different devices
export const cameraSettings = {
  mobile: {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      facingMode: 'environment'
    }
  },
  desktop: {
    video: {
      width: { ideal: 1920, max: 1920 },
      height: { ideal: 1080, max: 1080 },
      facingMode: 'user'
    }
  }
};

// Helper function to detect device type
export const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
  return isMobile ? 'mobile' : 'desktop';
};

// Helper function to get optimal camera settings
export const getCameraSettings = () => {
  const deviceType = getDeviceType();
  return cameraSettings[deviceType];
};