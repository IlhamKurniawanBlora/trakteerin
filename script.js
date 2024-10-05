// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();

// Create a new camera with position and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1.5; // Set camera distance from object

// Keep track of the mouse position, so we can make the coffe_cup follow the mouse
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Keep the 3D object on a global variable so we can access it later
let object;

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
  "public/coffe_cup/scene.gltf",
  (gltf) => {
    // If the file is loaded, add it to the scene
    object = gltf.scene;

    // Set initial rotation for the object to 30 degrees (in radians)
    object.rotation.x = Math.PI / 6;

    // Enable shadow casting and receiving
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(object);
  },
  (xhr) => {
    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
  },
  (error) => {
    console.error(error);
  }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Add directional light to simulate sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // (color, intensity)
directionalLight.position.set(10, 10, 10); // Light position
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

// Add ambient light to create overall illumination
const ambientLight = new THREE.AmbientLight(0x404040, 1); // (color, intensity)
scene.add(ambientLight);

// Create a ground plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.8 }); // Use shadow material
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate plane to be horizontal
plane.position.y = -0.3; // Set plane position
plane.receiveShadow = true; // Enable receiving shadows
scene.add(plane);

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // If the object is loaded, rotate it and make it follow the mouse
  if (object) {
    // Rotate the object based on cursor position
    const rotationSpeed = 0.005;
    object.rotation.y = (mouseX - window.innerWidth / 2) * rotationSpeed;
    object.rotation.x = Math.PI / 6 + (mouseY - window.innerHeight / 2) * rotationSpeed * 0.5; // Keep the initial 30-degree tilt with added mouse control
  }

  renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add mouse position listener, so the object can move based on mouse position
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Start the 3D rendering
animate();
