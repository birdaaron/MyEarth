import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getFresnelMat } from "./getFresnelMat.js";
import { getStarfield } from "./getStarfield.js";
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({anatialias: true});
renderer.setSize( width, height );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;

const loader = new THREE.TextureLoader();
const detail = 12;
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh( geometry, material );
scene.add( earthMesh );

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * (Math.PI / 180); 
scene.add(earthGroup);
earthGroup.add(earthMesh);

const lightMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
  transparent: true,
});

const lightMesh = new THREE.Mesh( geometry, lightMat );
earthGroup.add(lightMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(earthMesh.geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(earthMesh.geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 5000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  const rot = 0.002;
  earthMesh.rotation.y  += rot;
  lightMesh.rotation.y += rot;
  glowMesh.rotation.y   += rot;
  cloudsMesh.rotation.y += rot * 1.15;

  stars.rotation.y -= 0.0002;

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});