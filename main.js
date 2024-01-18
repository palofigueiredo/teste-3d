import * as THREE from 'three';
import { gsap } from "gsap";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { TrackballControls } from 'three/addons/controls/TrackballControls.js'


// Definitions:
const screenhtml={
    width:480,
    height:640,
    x:1,
    y:1,
    z:1,
    rotation:{
        x:-0.5,y:0,z:0
    }
}

const sizestd = 1;

const box_01 = {
    width: 1 * sizestd,
    height: 1 * sizestd,
    depth: 1 * sizestd,
    x: 0 * sizestd,
    y:0 * sizestd,
    z:0 * sizestd
}
box_01.y = (box_01.height/2) * sizestd;
box_01.z = (box_01.depth/2) * sizestd;

const box_02 = {
    width: 1 * sizestd,
    height: 1 * sizestd,
    depth: 1 * sizestd,
    x: 0 * sizestd,
    y:0 * sizestd,
    z:0 * sizestd
}
box_02.y = box_02.height/2 * sizestd;
box_02.z = box_02.depth/2 * sizestd;


// DIMENSIONS - to use mainly in the renderers
const sizes = {
    width: window.innerWidth,
    height:window.innerHeight
}


const canvas = document.querySelector('.bodycanvas')

const intDisplaySizes = {
    width: `${screenhtml.width}px`,
    height: `${screenhtml.height}px`,
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
// const boxgeometry = new THREE.BoxGeometry(sizestd, sizestd, sizestd); 
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});

// const cube = new THREE.Mesh( boxgeometry, material ); 
// scene.add( cube );

function boxBuilder(width=1,height=1,depth=1,color='white',wframe=false){
    let newbox = new THREE.BoxGeometry(width,height,depth);
    let material = new THREE.MeshBasicMaterial({color:color, wireframe:wframe})
    let builtbox = new THREE.Mesh(newbox, material);
    return(builtbox);
}

const cube = boxBuilder(box_01.width,box_01.height,box_01.depth,'green',true);
scene.add(cube)

cube.position.y=box_01.y;
cube.position.z=box_01.z;


// Creating a plane that will simulate the area where we want to place the display 
// const displaygeom = new THREE.PlaneGeometry(0.5,0.5);
// // const display = new THREE.Mesh(displaygeom, new THREE.MeshBasicMaterial({color:0xdd00dd}))
// const displaywebgl = new THREE.Mesh(displaygeom, new THREE.MeshBasicMaterial({color:0x123456}))
// displaywebgl.position.y=1
// displaywebgl.position.z=0.5
// displaywebgl.rotateX(-0.4)

function planeBuilder(width=1,height=1,color='white',wframe=false){
    let newplane = new THREE.PlaneGeometry(width,height);
    let planematerial = new THREE.MeshBasicMaterial({color:color, wireframe:wframe})
    let builtplane = new THREE.Mesh(newplane, planematerial);
    return(builtplane);
}

const displaywebgl = planeBuilder(0.5,0.5, 'blue', false)
displaywebgl.position.y=1
displaywebgl.position.z=0.5
displaywebgl.rotateX(-0.4)

scene.add(displaywebgl)

// const displaygeom2 = new THREE.PlaneGeometry(0.5,0.5);
// const displaywebgl2 = new THREE.Mesh(displaygeom2, new THREE.MeshBasicMaterial({color:0x224466}))

const displaywebgl2 = planeBuilder(0.5,0.5,0x224466, false)

displaywebgl2.position.y=1
displaywebgl2.position.z=0.5
displaywebgl2.position.x=0;
displaywebgl2.rotateX(4);

scene.add(displaywebgl2)


// Creating elements that will be placed in the CSS3D Renderer

// const div3d = document.createElement( 'div' );
// div3d.id="div3d";
// div3d.style.width = intDisplaySizes.width;
// div3d.style.height = intDisplaySizes.height;
// div3d.style.backfaceVisibility= 'hidden';
// div3d.style.transformStyle = 'preserve-3d';

// div3d.style.pointerEvents = 'auto' // not needed, but was recommended to make sure elements in the div will be clickable
// div3d.style.backgroundColor = '#ff111133'; // red-ish with transparency

const iframe3d = document.createElement( 'iframe' );
iframe3d.style.width = intDisplaySizes.width;
iframe3d.style.height = intDisplaySizes.height;
// iframe.style.height = '3px';
iframe3d.style.border = '1px solid black';
iframe3d.style.zIndex = 2;
iframe3d.style.pointerEvents = 'auto';
// iframe.src = './iframe3dcontent.html';
iframe3d.src = './menu.html';
iframe3d.style.backfaceVisibility = 'hidden'
// div3d.appendChild( iframe );




const object3d = new CSS3DObject( iframe3d );

object3d.scale.set(1/screenhtml.width,1/screenhtml.width)

object3d.position.set( 0, 1, 1 );
object3d.rotateX(screenhtml.rotation.x)
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


    function zposB(yp,ycam,ang){
        {
            return(Math.sqrt((Math.tan(ang)*(ycam-yp))**2));
        }
    }

        if(camera.position.z<=(object3d.position.z-zposB(object3d.position.y,camera.position.y,screenhtml.rotation.x))){
            
            iframe3d.style.visibility='hidden';
        }else{
            iframe3d.style.visibility='visible';
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
    if (str === 'screen') {
        gsap.to(camera.position, {x: object3d.position.x, y: (object3d.position.y+object3d.position.y*Math.sqrt((Math.sin(screenhtml.rotation.x))**2)), z:(object3d.position.z+object3d.position.z*Math.sqrt((Math.cos(screenhtml.rotation.x))**2)), duration: 1});
    }
}

// CONSOLE LOGS:
console.log('sizes.width: ')
console.log(sizes.width)