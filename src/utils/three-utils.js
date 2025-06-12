import * as THREE from 'three';

// Helper function to load GLB models
export const loadGLBModel = (modelPath) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        resolve(gltf);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        reject(error);
      }
    );
  });
};

// Helper function to create basic materials
export const createMaterials = () => {
  return {
    standard: new THREE.MeshStandardMaterial({ color: 0x10b981 }),
    metallic: new THREE.MeshStandardMaterial({ 
      color: 0x374151, 
      metalness: 0.8, 
      roughness: 0.2 
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 0.9,
      transparent: true,
      opacity: 0.8
    })
  };
};

// Helper function to setup basic lighting
export const setupLighting = (scene) => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Point light
  const pointLight = new THREE.PointLight(0xffffff, 0.3);
  pointLight.position.set(-10, -10, -10);
  scene.add(pointLight);

  return { ambientLight, directionalLight, pointLight };
};

// Helper function to create camera controls
export const createOrbitControls = (camera, domElement) => {
  // This would typically use OrbitControls from three/examples/jsm/controls/OrbitControls
  // For now, we'll return a basic setup object
  return {
    enableDamping: true,
    dampingFactor: 0.05,
    enableZoom: true,
    enablePan: true,
    enableRotate: true,
    autoRotate: false,
    autoRotateSpeed: 2.0
  };
};

// Helper function to optimize models
export const optimizeModel = (model) => {
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Optimize geometry
      if (child.geometry) {
        child.geometry.computeBoundingSphere();
        child.geometry.computeBoundingBox();
      }
      
      // Optimize materials
      if (child.material) {
        child.material.needsUpdate = true;
      }
    }
  });
  
  return model;
};

// AR detection helpers
export const checkARSupport = async () => {
  if ('xr' in navigator) {
    try {
      const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
      return isSupported;
    } catch (error) {
      console.warn('AR not supported:', error);
      return false;
    }
  }
  return false;
};

// Model positioning helpers
export const positionModel = (model, type) => {
  switch (type) {
    case 'panel':
      model.position.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      break;
    case 'podium':
      model.position.set(0, -1, 0);
      model.scale.set(0.8, 0.8, 0.8);
      break;
    case 'printer':
      model.position.set(0, -0.5, 0);
      model.scale.set(1.2, 1.2, 1.2);
      break;
    default:
      model.position.set(0, 0, 0);
      model.scale.set(1, 1, 1);
  }
  return model;
};

export default {
  loadGLBModel,
  createMaterials,
  setupLighting,
  createOrbitControls,
  optimizeModel,
  checkARSupport,
  positionModel
};