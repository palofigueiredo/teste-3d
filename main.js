import * as THREE from 'three';
import { gsap } from "gsap";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( 1024, 1024 );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry(2, 2, 2); 
const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );

// camera.position.x = 1;
camera.position.z = 5;
camera.position.y = .5;

const grid = new THREE.GridHelper();
scene.add(grid);


function animate() {
    
    // cube.rotation.x += 0.001;
	// cube.rotation.y += 0.01;
    
	requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();

// Nav btns
document.querySelector('.nav').addEventListener('click', event => {
    if (!event.target.classList.contains('btn')) return;
    // console.log(event.target);
    rotateMesh(event.target.getAttribute('data-value'));
})

function rotateMesh (str) {
    if (str === '1') gsap.to(cube.rotation, {x: 0, y: 1, duration: 1});
    if (str === '2') gsap.to(cube.rotation, {x: 1, y: 0, duration: 1});
    if (str === '3') gsap.to(cube.rotation, {x: 0, y: 0, duration: 1});
}
