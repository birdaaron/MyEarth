import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({anatialias: true});
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;



window.addEventListener('resize', () => {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
});

const geometry = new THREE.SphereGeometry( 2, 64, 64 );
const material = new THREE.MeshBasicMaterial( { color: 0x2266ff, wireframe: false } );
const earthMesh = new THREE.Mesh( geometry, material );
scene.add( earthMesh );

const loader = new THREE.TextureLoader();
const earthMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
  specularMap: loader.load("./textures/02_earthspec1k.jpg"),
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
earthMesh.material = earthMat;

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2,0.5,1.5);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x404040, 0.4));

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
function animate() {
  requestAnimationFrame( animate );
  earthMesh.rotation.y += 0.002;
  controls.update();
  renderer.render( scene, camera );
}

animate();