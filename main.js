import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, -5, 5); // lower y
camera.lookAt(0, 0, 0);       // point toward origin

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

// Shapes
const shape1 = createTriangle(
  { x: 0, y: 1 },
  { x: 0.5, y: 0 },
  { x: -0.5, y: 0 }
);

const shape2 = createTriangle(
  { x: 0.5, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  0xff0000
);

const shape3 = createTriangle(
  { x: -0.5, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  0x00ff00
);

const shape4 = createTriangle(
  { x: -0.5, y: 0 },
  { x: 0, y: -1 },
  { x: 0.5, y: 0 },
  0x0000ff
);

// Pivot + rotating point
const A = new THREE.Vector3(0, 1, 0);
const B = new THREE.Vector3(1, 0, 0);
const axis = new THREE.Vector3().subVectors(B, A).normalize();

const pivot = new THREE.Object3D();
pivot.position.copy(A);
scene.add(pivot);

const C = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  new THREE.MeshPhongMaterial({ color: 0xff0000 })
);
C.position.set(1, 0, 0); // offset from pivot A
pivot.add(C);

// Add shapes
scene.add(shape1);
// scene.add(shape2);
scene.add(shape3);
scene.add(shape4);

// Animation
function animate() {
  requestAnimationFrame(animate);
  pivot.rotateOnAxis(axis, 0.02);
  renderer.render(scene, camera);
}
animate();

// Triangle generator
function createTriangle(p1, p2, p3, color = 0xf0c00f) {
  const shape = new THREE.Shape();
  shape.moveTo(p1.x, p1.y);
  shape.lineTo(p2.x, p2.y);
  shape.lineTo(p3.x, p3.y);
  shape.lineTo(p1.x, p1.y);

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshPhongMaterial({
    color,
    side: THREE.DoubleSide
  });

  return new THREE.Mesh(geometry, material);
}
