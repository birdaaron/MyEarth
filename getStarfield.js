import * as THREE from "three";

export function getStarfield({ numStars = 2000 } = {}) {
  const verts = [];
  const colors = [];
  const loader = new THREE.TextureLoader();

  for (let i = 0; i < numStars; i++) {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    verts.push(x, y, z);

    const col = new THREE.Color().setHSL(0.6, 0.2, Math.random());
    colors.push(col.r, col.g, col.b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: loader.load("./textures/stars/circle.png"),
    transparent: true,
    depthWrite: false,
  });

  return new THREE.Points(geo, mat);
}