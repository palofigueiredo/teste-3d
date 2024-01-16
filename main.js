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
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha:true});
// const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x123456,0.0)


// renderer.setSize( 1024, 1024 );
renderer.setSize( sizes.width, sizes.height);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = 0
renderer.domElement.style.zIndex = 2;



console.log(renderer.getSize)





// document.body.appendChild( renderer.domElement );

const renderercss3d = new CSS3DRenderer();
renderercss3d.setSize( sizes.width, sizes.height );
// renderercss3d.setSize( 200,200 );
renderercss3d.domElement.style.position = 'absolute'

renderercss3d.domElement.appendChild(renderer.domElement)



document.body.appendChild( renderercss3d.domElement );

const geometry = new THREE.BoxGeometry(1, 1, 1); 
const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: false});
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );
cube.position.y=.5;
// cube.position.y=0;
cube.position.z=0.5;

//CONTROLS

// const controls = new OrbitControls(camera, scene)



// Testing
// const sphere = new THREE.SphereGeometry(.1)
const sphere = new THREE.SphereGeometry(0.1)
const refball = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color:0x00ffff}))
// refball.position.x = 0;
// refball.position.y = 0;
// refball.position.z = 0;

const povfront = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color:0xff00ff}))
scene.add(povfront)
povfront.position.x = cube.position.x
// povfront.position.y = cube.position.x + geometry.height/2

console.log('cube.width: ')
console.log(cube.x)



scene.add(refball);
scene.add(camera)
// camera.position.x = 1;
camera.position.z = 2;
camera.position.y = 1.3;
camera.position.x = .88;

// camera.position.set(1,1,1) 
camera.lookAt(cube.position);

const displaygeom = new THREE.PlaneGeometry(0.5,0.5);
// const display = new THREE.Mesh(displaygeom, new THREE.MeshBasicMaterial({color:0xdd00dd}))
const display = new THREE.Mesh(displaygeom, new THREE.MeshBasicMaterial({color:0x123456}))
display.position.y=1
display.position.z=0.5
display.rotateX(-0.4)


scene.add(display)

// End of testing


const grid = new THREE.GridHelper();
scene.add(grid);


// Inserts adapted from cube example

const div3d = document.createElement( 'div' );
div3d.id="div3d";
// div3d.style.width = '4px';
// div3d.style.height = '3px';
div3d.style.width = 958;
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
iframe.src = './ex-iframe.html';
div3d.appendChild( iframe );
// div3d.innerHTML += `<h1>I'm a div</h1>`

// const object3d = new CSS3DObject( 'div' );
const object3d = new CSS3DObject( div3d );
// object3d.position.x = 0.5;
// object3d.position.y = 0.5;
// object3d.position.z = 0.5;
// object3d.scale.set()

// object3d.position = (0,0,0)

// console.log('object3d.rotation: ')
// console.log(object3d.rotation)
// console.log('object3d.position: ')
// console.log(object3d.position)
// console.log('object3d scale: ')
// console.log(object3d.scale)

object3d.scale.set(2/sizes.width,2/sizes.width)
// object3d.scale.set(1,1)

object3d.position.set( 0, 1, 1 );


// object3d.rotation.set = (0,1,0);

// const object2 = new CSS3DObject(Element.div)

scene.add(object3d)

// const group = new THREE.Group();
// group.add(object3d)
// scene.add(group)









// End of inserts from cube




function animate() {
    
    // cube.rotation.x += 0.001;
	// cube.rotation.y += 0.01;
    camera.lookAt(cube.position);
	requestAnimationFrame( animate );
    renderercss3d.render( scene, camera );
    renderer.render( scene, camera );
    // controls.update();
}

animate();

// Nav btns
document.querySelector('.nav').addEventListener('click', event => {
    if (!event.target.classList.contains('btn')) return;
    // console.log(event.target);
    rotateMesh(event.target.getAttribute('data-value'));
})

function rotateMesh (str) {
    // if (str === '1') gsap.to(cube.rotation, {x: 0, y: 1, duration: 1});
    // if (str === '2') gsap.to(cube.rotation, {x: 1, y: 0, duration: 1});
    // if (str === '3') gsap.to(cube.rotation, {x: 0, y: 0, duration: 1});

    if (str === '0') {
        // camera.position.z = 2;
        // camera.position.y = 1.3;
        // camera.position.x = .88;
        
        gsap.to(camera.position,{x:.88, y:1.3, z:2,duration:.6});
        
    }
    if (str === '1') {
        gsap.to(camera.position, {x: cube.position.x, y: cube.position.y, z:cube.position.z+2, duration: 1});
    }
    if (str === '2') {
        gsap.to(camera.position, {x: cube.position.x, y: cube.position.y+2, z:cube.position.z, duration: 1});
        
    }
    if (str === '3') {
        gsap.to(camera.position, {x: cube.position.x+2, y: cube.position.y, z:cube.position.z, duration: 1});
    }
}




