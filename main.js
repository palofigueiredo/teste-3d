import * as THREE from 'three';
import { gsap } from "gsap";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


// DIMENSIONS
const sizes = {
    width: window.innerWidth,
    height:window.innerHeight
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);


const renderer = new THREE.WebGLRenderer();
// const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x123456,0.0)
renderer.setSize( sizes.width, sizes.height);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = 0
renderer.domElement.style.zIndex = 0;

console.log(renderer.getSize)

// document.body.appendChild( renderer.domElement ); //Only if the WebGL renderer is the one that'll contain the 3DCSS renderer

//CSS3d Renderer
const renderercss3d = new CSS3DRenderer();
renderercss3d.setSize( sizes.width, sizes.height );
renderercss3d.domElement.style.position = 'absolute'

// renderercss3d.domElement.appendChild(renderer.domElement)

document.body.appendChild( renderer.domElement );
document.body.appendChild( renderercss3d.domElement );


const group = new THREE.Group

const geometry = new THREE.BoxGeometry(1, 1, 1); 
const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: false});
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );
// cube.position.x=0;
cube.position.y=.5;
cube.position.z=0.5;



// TESTING
const sphere = new THREE.SphereGeometry(0.1)
const refball = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color:0x00ffff}))

// const povfront = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color:0xff00ff}))
// scene.add(povfront)
// povfront.position.x = cube.position.x
// povfront.position.y = cube.position.x + geometry.height/2

scene.add(refball);


const displaygeom = new THREE.PlaneGeometry(0.5,0.5);
// const display = new THREE.Mesh(displaygeom, new THREE.MeshBasicMaterial({color:0xdd00dd}))
const display = new THREE.Mesh(displaygeom, new THREE.MeshBasicMaterial({color:0x123456}))
display.position.y=1
display.position.z=0.5
display.rotateX(-0.4)


scene.add(display)

// End of testing


//CAMERA
scene.add(camera)
camera.position.z = 2;
camera.position.y = 1.3;
camera.position.x = .88;

// camera.position.set(1,1,1) 
camera.lookAt(cube.position);


const grid = new THREE.GridHelper();
scene.add(grid);


// Inserts adapted from cube example

const div3d = document.createElement( 'div' );
div3d.id="div3d";
// div3d.style.width = '4px';
// div3d.style.height = '3px';
div3d.style.width = 958;
div3d.style.pointerEvents = 'auto'
// div3d.style.height = sizes.height;
console.log('sizes.width: ')
console.log(sizes.width)
div3d.style.backgroundColor = '#ff121233';
// div3d.style.zIndex = 2

const iframe = document.createElement( 'iframe' );
iframe.style.width = 958;
// iframe.style.height = '3px';
iframe.style.border = '1px solid black';
iframe.style.zIndex = 2;
iframe.style.pointerEvents = 'auto';
iframe.src = './ex-iframe.html';
div3d.appendChild( iframe );


const object3d = new CSS3DObject( div3d );


object3d.scale.set(2/sizes.height,2/sizes.height)
// object3d.scale.set(1,1)

object3d.position.set( 0, 1, 1 );

// scene.add(object3d)


group.add(object3d)
group.add(cube)
group.add(display)


scene.add(group)









// End of inserts from cube


//CONTROLS
// const controls = new OrbitControls(camera, scene)
// OrbitControls are not working
// const cursor = {
//     x:0,
//     y:0
// }
// window.addEventListener('mousemove', (event) => { 
//     cursor.x=2*event.clientX / sizes.width - 0.5
//     cursor.y= - 3*(event.clientY / sizes.height - 0.5)
//     console.log(cursor.x + ' , ' + cursor.y)
//     })
// Camera is updated in animate()



function animate() {
    camera.lookAt(cube.position);
	requestAnimationFrame( animate );
    
    renderer.render( scene, camera );
    renderercss3d.render( scene, camera );
    
    // controls.update();

//Update Camera
    // camera.position.x = cursor.x*10
    // camera.position.y = cursor.y*10
    
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 5
    
    // camera.lookAt(new THREE.Vector3())
    // camera.lookAt(cube.position)
//End of Update Camera
}
animate();


// Nav btns
document.querySelector('.nav').addEventListener('click', event => {
    if (!event.target.classList.contains('btn')) return;
    // console.log(event.target);
    rotateMesh(event.target.getAttribute('data-value'));
})

function rotateMesh (str) {

    if (str === '0') { //Reset
        gsap.to(camera.position,{x:.88, y:1.3, z:2,duration:.6});        
    }
    if (str === '1') { // Front
        gsap.to(camera.position, {x: cube.position.x, y: cube.position.y, z:cube.position.z+2, duration: 1});
    }
    if (str === '2') { // Top
        gsap.to(camera.position, {x: cube.position.x, y: cube.position.y+2, z:cube.position.z, duration: 1});
    }
    if (str === '3') { // Side
        gsap.to(camera.position, {x: cube.position.x+2, y: cube.position.y, z:cube.position.z, duration: 1});
    }
}




