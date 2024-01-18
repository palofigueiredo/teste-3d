import * as THREE from 'three';
import { gsap } from "gsap";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { TrackballControls } from 'three/addons/controls/TrackballControls.js'



// DIMENSIONS - to use mainly in the renderers
const sizes = {
    width: window.innerWidth,
    height:window.innerHeight
}


const canvas = document.querySelector('.bodycanvas')

const intDisplaySizes = {
    width: '480px' ,
    height: '640px',
    widthnum: 480,
    heightnum:640
}

const scene = new THREE.Scene(); // Where the objects will be placed in order to be displayed

// GRID for reference for a "ground" (horizontal plane at y=0)
const grid = new THREE.GridHelper();
scene.add(grid);

// Creating a group so it's easier to move various elements around if necessary
const group = new THREE.Group


// WebGL Renderer
const rendererwebgl = new THREE.WebGLRenderer({canvas:canvas}); // standard renderer for 3JS
rendererwebgl.setClearColor(0x123456,0.0)
rendererwebgl.setSize( sizes.width, sizes.height); // calling the const defined earlier to set the size for the renderer
rendererwebgl.domElement.style.position = 'absolute' // keeps the renderer from being pushed downwards by other DOM html elements on the page
rendererwebgl.domElement.style.top = 0 // places the renderer on top of the page
rendererwebgl.domElement.style.zIndex = 0; // just to make sure what's the z-index of the WebGL Renderer


//CSS3d Renderer - basically the same as WebGL renderer
const renderercss3d = new CSS3DRenderer({canvas:canvas});
renderercss3d.setSize( sizes.width, sizes.height );
renderercss3d.domElement.style.position = 'absolute'

// placing both renderer on the page
// ORDER IS IMPORTANT, as we want the elements on the CSS3D Renderer to be interactive, so they need to be "on top" of the WebGL ones.
document.body.appendChild( rendererwebgl.domElement );

document.body.appendChild( renderercss3d.domElement );




// Creating the "3D Objects" for the WebGL Renderer - we need a geometry and a material that are to be put together via THREE.Mesh
const boxgeometry = new THREE.BoxGeometry(1, 1, 1); 
const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});

const cube = new THREE.Mesh( boxgeometry, material ); 
scene.add( cube );


//Positioning the cube slightly in front of the origin (0,0,0)
// cube.position.x=0;
cube.position.y=.5;
cube.position.z=0.5;


// Creating a plane that will simulate the area where we want to place the display 
const displaygeom = new THREE.PlaneGeometry(0.5,0.5);
// const display = new THREE.Mesh(displaygeom, new THREE.MeshBasicMaterial({color:0xdd00dd}))
const displaywebgl = new THREE.Mesh(displaygeom, new THREE.MeshBasicMaterial({color:0x123456}))
displaywebgl.position.y=1
displaywebgl.position.z=0.5
displaywebgl.rotateX(-0.4)

scene.add(displaywebgl)

const displaygeom2 = new THREE.PlaneGeometry(0.5,0.5);
const displaywebgl2 = new THREE.Mesh(displaygeom2, new THREE.MeshBasicMaterial({color:0x224466}))
displaywebgl2.position.y=1
displaywebgl2.position.z=0.5
displaywebgl2.position.x=0;
displaywebgl2.rotateX(4);

scene.add(displaywebgl2)


// Creating elements that will be placed in the CSS3D Renderer

const div3d = document.createElement( 'div' );
div3d.id="div3d";
div3d.style.width = intDisplaySizes.width;
div3d.style.height = intDisplaySizes.height;
div3d.style.backfaceVisibility= 'hidden';
div3d.style.transformStyle = 'preserve-3d';

// div3d.style.pointerEvents = 'auto' // not needed, but was recommended to make sure elements in the div will be clickable
div3d.style.backgroundColor = '#ff111133'; // red-ish with transparency

const iframe = document.createElement( 'iframe' );
iframe.style.width = intDisplaySizes.width;
iframe.style.height = intDisplaySizes.height;
// iframe.style.height = '3px';
iframe.style.border = '1px solid black';
iframe.style.zIndex = 2;
iframe.style.pointerEvents = 'auto';
// iframe.src = './iframe3dcontent.html';
iframe.src = './menu.html';
iframe.style.backfaceVisibility = 'hidden'
div3d.appendChild( iframe );




const object3d = new CSS3DObject( div3d );

// object3d.scale.set(1/(sizes.width),1/(sizes.width))
// object3d.scale.set(0.005,0.005)
object3d.scale.set(1/intDisplaySizes.widthnum,1/intDisplaySizes.widthnum)

object3d.position.set( 0, 1, 1 );
object3d.rotateX(-0.5)
// scene.add(object3d)

// Reference
const sphere = new THREE.SphereGeometry(0.05)
const refball = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color:'cyan'}))
scene.add(refball);
const refball2 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color:'red'}))
refball2.position.set(object3d.position.x,object3d.position.y,object3d.position.z)
scene.add(refball2);
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)




group.add(object3d)
group.add(cube)
group.add(displaywebgl)

scene.add(group)


//CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000); // the camera is where the "viewer" is. Has the parameters (vertical angle, aspect ratio, min distance for viewing something, maximum distance for viewing something - objects farther away will not be displayed)
scene.add(camera)
camera.position.z = 2;
camera.position.y = 1.3;
camera.position.x = .88;
// camera.lookAt(cube.position);
camera.lookAt(refball2.position);


// CONTROLS 
const controls = new OrbitControls(camera, renderercss3d.domElement)
controls.maxPolarAngle = Math.PI*0.5
// const controls = new TrackballControls(camera,canvas)

controls.enableDamping = true;
// // OrbitControls are not working
// (if you want to freely move the camera de-select the lines below and also the "Mouse camera controls" inside the animate() function right below)
    // const cursor = {
    //     x:0,
    //     y:0
    // }
    // window.addEventListener('mousemove', (event) => { 
    //     cursor.x=2*event.clientX / sizes.width - 0.5
    //     cursor.y= - 3*(event.clientY / sizes.height - 0.5)
    //     // console.log(cursor.x + ' , ' + cursor.y)
    //     })
// // Obs: Camera is updated in animate()

window.addEventListener('camera.position.z', () => {
    if(camera.position.z<1){
        console.log('funciona')
        div3d.style.visibility='hidden';
    }else{
        div3d.style.visibility='visible'
    }
})

var testerposition = false;
var freecamera = false;


function animate() {
    camera.lookAt(refball2.position);
	requestAnimationFrame( animate );
    
    rendererwebgl.render( scene, camera );
    renderercss3d.render( scene, camera );
    
    //forcing camera position
    if(camera.position.y<1){
        camera.position.y=1;
    }


    //Mouse camera controls (to activate, de-comment everything below and also the "controls" section just above
    controls.update();
    // //Update Camera (manual camera movement - to activate deselect one of two group os lines below)

    // Free camera around the 3D objects
        // if(freecamera==true){
        // camera.position.x = cursor.x*10
        // camera.position.y = cursor.y*10
        // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
        // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
        // camera.position.y = cursor.y * 5
        // camera.lookAt(new THREE.Vector3())
        // camera.lookAt(cube.position)
        // }
        


    //End of Update Camera

    // Hiding css3d display
    if(camera.position.z<0.8){
        if(testerposition==false){
            console.log('funciona')
            testerposition=true;
            div3d.style.visibility='hidden';
        }
    }else if(camera.position.z>=0.8){
        if(testerposition==true){
            div3d.style.visibility='visible'
            testerposition=false;
            console.log('testerposition true')
        }
        
    }
}
animate();


// Nav btns - this will make the buttons in the interface active a fucntion for rotating the camera when clicked
document.querySelector('.nav').addEventListener('click', event => {
    if (!event.target.classList.contains('btn')) return;
    // console.log(event.target);
    rotateMesh(event.target.getAttribute('data-value'));
})
// document.querySelector('#freecamerabtn').addEventListener('click', () => {
//     if (freecamera==true){
//         freecamera=false;
//     }else if(freecamera==false){
//         freecamera=true;
//     }
//     })

function rotateMesh (str) {

    if (str === '0') { //Reset
        gsap.to(camera.position,{x:.88, y:1.3, z:2,duration:.6});        
    }
    if (str === '1') { // Front
        gsap.to(camera.position, {x: object3d.position.x, y: object3d.position.y, z:object3d.position.z+2, duration: 1});
    }
    if (str === '2') { // Top
        gsap.to(camera.position, {x: object3d.position.x+0.1, y: object3d.position.y+2, z:object3d.position.z+0.1, duration: 1});
        

        gsap.to(camera.lookAt, {x: object3d.position.x, y: object3d.position.y+2, z:object3d.position.z, duration: 2});

    }
    if (str === '3') { // Side
        gsap.to(camera.position, {x: object3d.position.x+2, y: object3d.position.y, z:object3d.position.z, duration: 1});
    }
}

// CONSOLE LOGS:
console.log('sizes.width: ')
console.log(sizes.width)