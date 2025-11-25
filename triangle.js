import*as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(-3, 0, -3);
camera.lookAt(0,0,0);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// camera 
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth movement
controls.dampingFactor = 0.05;
controls.enableZoom = true;    // allow zoom
controls.enablePan = true;     // allow panning

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5);
scene.add(light);
scene.background = new THREE.Color(0x87ceeb);

// create triangles
// top right
const A = new THREE.Vector3(0.5, 0, 0);
const B = new THREE.Vector3(0, Math.sqrt(3)/2, 0);
let triangle1 = addshape(A, B, 1, Math.sqrt(3)/2, 0, 0xFF6F61);
scene.add(triangle1);
// top left
const D = new THREE.Vector3(-0.5, 0, 0);
const E = new THREE.Vector3(0, Math.sqrt(3)/2, 0);
let triangle2 = addshape(D, E, -1, Math.sqrt(3)/2, 0, 0xA78BFA);
scene.add(triangle2);
// bottom
const G = new THREE.Vector3(-0.5, 0, 0);
const H = new THREE.Vector3(0.5, 0, 0);
let triangle3 = addshape(G, H, -1, -(Math.sqrt(3)/2), 0, 0x6EE7B7);
scene.add(triangle3);

// middle triangle
const shape1 = createTriangle(
    {x: 0, y: Math.sqrt(3)/2}, 
    {x: -.5, y: 0}, 
    {x: .5, y: 0}
);
scene.add(shape1);

let angle = 0;
let result1 = new THREE.Vector3(1, 0, 0);
let result2 = new THREE.Vector3(2, 0, 0);
let result3 = new THREE.Vector3(3, 0, 0);

function addshape(A, B, x3, y3, z3, color = 0xFBBF24){
    // Triangle geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
    A.x, A.y, A.z, // point A
    B.x, B.y, B.z, // point B
    x3, y3, z3       // point C initial
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    // Material & mesh
    const material = new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide });
    const triangle = new THREE.Mesh(geometry, material);

    return triangle;
}


// Function to rotate C around AB
function rotateC(A, B, angle, geometry, reverse = false) {
  const midpoint = new THREE.Vector3().addVectors(A, B).multiplyScalar(0.5);
  const axis = new THREE.Vector3().subVectors(B, A).normalize(); // AB line

  // Find a vector not parallel to AB
  const up = new THREE.Vector3(0, 0, 1);
  if (Math.abs(up.dot(axis)) > 0.99) up.set(1, 0, 0); // avoid parallel

  // Build perpendicular basis
  const radius =  Math.sqrt(3)/2;
  const u = new THREE.Vector3().crossVectors(axis, up).normalize().multiplyScalar(radius);
  let v = new THREE.Vector3().crossVectors(axis, u).normalize().multiplyScalar(radius);
  if (reverse){
    v = new THREE.Vector3().crossVectors(u, axis).normalize().multiplyScalar(radius);
  }


  // Compute new C position
  const C = new THREE.Vector3().copy(midpoint)
            .add(u.clone().multiplyScalar(Math.cos(angle)))
            .add(v.clone().multiplyScalar(Math.sin(angle)));

  // Update vertices
  const pos = geometry.attributes.position.array;
  pos[6] = C.x;
  pos[7] = C.y;
  pos[8] = C.z;
  geometry.attributes.position.needsUpdate = true;

  return C;
}


function createTriangle(p1, p2, p3, color = 0xf0c00f) {
    // Create the shape from points
    const shape = new THREE.Shape();
    shape.moveTo(p1.x, p1.y);
    shape.lineTo(p2.x, p2.y);
    shape.lineTo(p3.x, p3.y);
    shape.lineTo(p1.x, p1.y); // close the shape
  
    // Convert to geometry
    const geometry = new THREE.ShapeGeometry(shape);
  
    // Material
    const material = new THREE.MeshPhongMaterial({
      color: color,
      side: THREE.DoubleSide
    });
  
    // Return mesh
    return new THREE.Mesh(geometry, material);
  }
  
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    // for camera
    // controls.update();
    // for shapes
    angle += 0.01;
    if (angle < (1.9106)){
        result1 = rotateC(A, B, angle, triangle1.geometry);
        result2 = rotateC(D, E, angle + Math.PI, triangle2.geometry, true);
        result3 = rotateC(G, H, angle, triangle3.geometry);
    }
    // alternate method
    // if (result1.distanceTo(result2) > .001 ||
    //     result2.distanceTo(result3) > .001 ||
    //     result3.distanceTo(result1) > .001) {
    //         result1 = rotateC(A, B, angle, triangle1.geometry);
    //         result2 = rotateC(D, E, angle + Math.PI, triangle2.geometry, true);
    //         result3 = rotateC(G, H, angle, triangle3.geometry);
    // }
    renderer.render(scene, camera);
  }
  

animate();