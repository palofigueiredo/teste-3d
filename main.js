import * as THREE from 'three';
import { gsap } from "gsap";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Definitions:
const screenhtml={
    width:600,
    height:1024,
    x:0,
    y:4.3,
    z:0.19,
    rotation:{
        x:-0.911,y:0,z:0
    }
}

// DIMENSIONS - to use mainly in the renderers (we're associating them with a const just in case we want to force the renderers sizes so we don't want to find all relevant instances of window.innerWidth, for example, and change them manually)
const sizes = {
    width: window.innerWidth,
    height:window.innerHeight
}

//scale will be used to rescale the size of the rendered object and the screen.
const scale_group = 0.25;

// the canvas is where the renderer draws its output and it corresponds to the domElement property. If it's not indicated a new canvas is created. (more info at https://threejs.org/docs/#api/en/renderers/WebGLRenderer )
const canvas = document.querySelector('.bodycanvas')

const scene = new THREE.Scene(); // Where the objects will be placed in order to be displayed
const scenebg = new THREE.Scene() // for css3d background elements

// GRID for reference for a "ground" (horizontal plane at y=0)
const grid = new THREE.GridHelper(6,12);
scenebg.add(grid);

// Creating a group so it's easier to move various elements around if necessary
const group = new THREE.Group

// WebGL Renderer
const rendererwebgl = new THREE.WebGLRenderer({canvas:canvas}); // standard renderer for 3JS
const rendererwebglbg = new THREE.WebGLRenderer({}); // renderer for webgl elements that will be placed in the background (this is needed because we want to create css3D elements that will be behind some webgl elements in the "first" webglrenderer and then put some more webgl elements behind those background css3d ones, so four layers will be necessary in total)
rendererwebgl.setClearColor(0xeeeeee,0.0) // this sets the "background color" and its transparency for the rendererwebgl element.
rendererwebgl.setSize( sizes.width, sizes.height); // calling the const defined earlier to set the size for the renderer
rendererwebgl.domElement.style.position = 'absolute' // keeps the renderer from being pushed downwards by other DOM html elements on the page
rendererwebgl.domElement.style.top = 0 // places the renderer at the top of the page
rendererwebgl.domElement.style.zIndex = 0; // just to make sure the z-index of the WebGL Renderer

//Next do the same for the BG webgl renderer 
rendererwebglbg.setClearColor(0x010101,0.1)
rendererwebglbg.setSize( sizes.width, sizes.height);
rendererwebglbg.domElement.style.position = 'absolute'
rendererwebglbg.domElement.style.top = 0 
rendererwebglbg.domElement.style.zIndex = 0;


//CSS3d Renderer - basically the same as WebGL renderer
const renderercss3d = new CSS3DRenderer({canvas:canvas});
renderercss3d.setSize( sizes.width, sizes.height );
renderercss3d.domElement.style.position = 'absolute'
const renderercss3dbg = new CSS3DRenderer({canvas:canvas});
renderercss3dbg.setSize( sizes.width, sizes.height );
renderercss3dbg.domElement.style.position = 'absolute'

// placing both renderers on the page
// ORDER IS IMPORTANT, as we want the elements on the CSS3D Renderer to be interactive, so they need to be "on top" of the WebGL ones.
document.body.appendChild( rendererwebglbg.domElement );
document.body.appendChild( renderercss3dbg.domElement );
document.body.appendChild( rendererwebgl.domElement );
document.body.appendChild( renderercss3d.domElement );

//Models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoaders = new GLTFLoader()

gltfLoaders.setDRACOLoader(dracoLoader)
gltfLoaders.load(
	'./src/senhas_02.glb',
	(gltf) =>
	{
		const dispenser = gltf.scene;
        //
		gltf.scene.position.y = 0//Move Models
		gltf.scene.rotation.y = Math.PI*-0.5
		gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
				child.receiveShadow = true;
            }
            // gltf.scene.scale.set(0.5,0.5,0.5);
        });
		gltf.scene.scale.set(scale_group,scale_group,scale_group);
		scene.add(gltf.scene)
	}
)


//Light

 //Ambient light
const light = new THREE.AmbientLight( 0x404040,10 ); // soft white light
light.castShadow = false;

scene.add( light );

//Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040,50)
directionalLight.position.y = 3;
directionalLight.position.z = -1.5;
directionalLight.position.x = 2;
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.bias = -0.01;
scene.add(directionalLight);

//Directional Light2
const directionalLight2 = new THREE.DirectionalLight(0x404040, 20)
directionalLight2.position.y = 3;
directionalLight2.position.z = 1.5;
directionalLight2.position.x = -2;
directionalLight2.castShadow = true
directionalLight2.shadow.mapSize.width = 1024;
directionalLight2.shadow.mapSize.height = 1024;
directionalLight2.shadow.camera.left = -5;
directionalLight2.shadow.camera.right = 5;
directionalLight2.shadow.camera.top = 5;
directionalLight2.shadow.camera.bottom = -10;
directionalLight2.shadow.camera.near = 0.1;
directionalLight2.shadow.camera.far = 100;
directionalLight2.shadow.bias = -0.001;
scene.add(directionalLight2);


// Target
directionalLight.target.position.set(0, 1, 0)
directionalLight2.target.position.set(directionalLight.target.position)
directionalLight.target.updateWorldMatrix()

scene.add(directionalLight)
scene.add(directionalLight2)


rendererwebgl.shadowMap.enabled = true;
rendererwebgl.shadowMap.type = true;



// Building walls around our stage/set
const wall_01 = planeBuilder(6, 3, '#ccccdd',false)
wall_01.position.x = 0;
wall_01.position.y = 1.5;
wall_01.position.z = -2.5;
scenebg.add(wall_01);

const wall_02 = planeBuilder(6, 3, '#efeeef',false)
wall_02.position.x = -3
wall_02.position.y = 1.5;
wall_02.position.z = 0;
wall_02.rotation.y = Math.PI/2;
scenebg.add(wall_02);

const wall_03 = planeBuilder(6, 3, '#efeeee',false)
wall_03.position.x = 3
wall_03.position.y = 1.5;
wall_03.position.z = 0;
wall_03.rotation.y = -Math.PI/2;
scenebg.add(wall_03);

const floor = planeBuilder(6,6, '#dddddd', false)
floor.rotation.x=-Math.PI/2;
floor.position.y=-0.01
scenebg.add(floor);

const boxtv = boxBuilder(1.1,0.6,0.25,'#343434', false);
// boxtv.position.set(2,1.5,-2.2);
boxtv.position.set(2.35,2,-2.2);
// 
boxtv.x=Math.PI*0.15;
boxtv.rotation.y=-Math.PI*.2;
boxtv.rotation.z=-Math.PI*.015;
// scenebg.add(boxtv);



const frametv_01 = planeBuilder (1.1,1.9,'#404040',false)
frametv_01.position.set(1,1.25,-2.49);
scenebg.add(frametv_01);


const frametv_02 = planeBuilder (2,1.1,'#404040',false)
frametv_02.position.set(-1,1.6,-2.49);
scenebg.add(frametv_02);

const frametv_03 = planeBuilder (1.1,0.6,'#404040',false)
frametv_03.position.set(2.3,2,-2.1);
frametv_03.rotation.x=Math.PI*0.1;
frametv_03.rotation.y=-Math.PI*.2;
frametv_03.rotation.z=Math.PI*.05;
scenebg.add(frametv_03);
// group_03.position.set(2.3,2,-2.1);
// group_03.rotation.x=Math.PI*0.1;
// group_03.rotation.y=-Math.PI*.2;
// group_03.rotation.z=Math.PI*.05;


// Creating elements that will be placed in the CSS3D Renderer
const iframe3d = document.createElement( 'iframe' );
iframe3d.style.width = `${screenhtml.width}px`;
iframe3d.style.height = `${screenhtml.height}px`;
// iframe.style.height = '3px';
iframe3d.style.border = '1px solid black';
iframe3d.style.zIndex = 2;
iframe3d.style.pointerEvents = 'auto';
// iframe.src = './iframe3dcontent.html';
iframe3d.src = './src/menu.html';
iframe3d.style.backfaceVisibility = 'hidden'
// div3d.appendChild( iframe );

function css3dElementBuilder(type,width,height){
    let cssobject = document.createElement(type);
    cssobject.style.width = `${width}px`;
    cssobject.style.height = `${height}px`;
    cssobject.style.pointerEvents = 'auto';
    cssobject.style.border = 'none';
    cssobject.style.backfaceVisibility = 'hidden';
    return cssobject;
}
const group_01 = new THREE.Group;
const display_01 = css3dElementBuilder('iframe',720,1360);
const display_01_3d = new CSS3DObject (display_01)

display_01_3d.scale.set(1/720,1/720);
// display_01_3d.rotation.x = 0.5;

display_01.src = './src/montra_V.html'
group_01.add(display_01_3d);
group_01.position.set(1,1.2,-2.49)

const group_02 = new THREE.Group;
const display_02 = css3dElementBuilder('iframe', 1360,720);
display_02.src = './src/montra_H.html'
const display_02_3d = new CSS3DObject(display_02);
display_02_3d.scale.set(1/720,1/720);
group_02.add(display_02_3d);
group_02.position.set(-1,1.6,-2.49);

const group_03 = new THREE.Group;
const display_03 = css3dElementBuilder('iframe', 1360,720);
display_03.src = './src/ctv.html'
const display_03_3d = new CSS3DObject(display_03);
display_03_3d.scale.set(1/(720*2),1/(720*2));
group_03.add(display_03_3d);
group_03.position.set(2.3,2,-2.1);

group_03.rotation.x=Math.PI*0.1;
group_03.rotation.y=-Math.PI*.2;
group_03.rotation.z=Math.PI*.05;



scenebg.add(group_03);
scenebg.add(group_02);
scenebg.add(group_01);
// scene.add(bgscene);
// bgscene.add(display_01_3d)




const object3d = new CSS3DObject( iframe3d );

object3d.scale.set(1/screenhtml.width,1/screenhtml.width)

object3d.position.set( screenhtml.x, screenhtml.y, screenhtml.z );
object3d.rotateX(screenhtml.rotation.x)



group.add(object3d)

scene.add(group)

group.scale.set(scale_group, scale_group,scale_group);

//CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000); // the camera is where the "viewer" is. Has the parameters (vertical angle, aspect ratio, min distance for viewing something, maximum distance for viewing something - objects farther away will not be displayed)
// const camerabg = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000);



scene.add(camera);
scenebg.add(camera);

let camera_initial_position={
    x: object3d.position.x+2,
    y: object3d.position.y+1.3,
    z: object3d.position.z+2
};
camera.position.set(camera_initial_position.x*scale_group,camera_initial_position.y*scale_group, camera_initial_position.z*scale_group);
let camerafocus = new THREE.Vector3(object3d.position.x*scale_group,object3d.position.y*scale_group,object3d.position.z*scale_group);
// camerafocus = (new THREE.Vector3(2.35,2,-2.2))

camera.lookAt(camerafocus);


// CONTROLS 
const controls = new OrbitControls(camera, renderercss3d.domElement)
// const controlsbg = new OrbitControls(camera, renderercss3dbg.domElement)
// const controls = new TrackballControls(camera, renderercss3d.domElement)
// const controls = new ArcballControls(camera, renderercss3d.domElement)
controls.movementSpeed = 0.1;
// console.log(screenhtml.rotation.x);
controls.minPolarAngle = -Math.PI*0.99;
controls.maxPolarAngle = -screenhtml.rotation.x*.9;
controls.minAzimuthAngle = -Math.PI/2.1;
controls.maxAzimuthAngle = Math.PI/2.1;
controls.maxDistance = 2.3;


// const controls = new TrackballControls(camera,canvas)
controls.enableDamping = true;

function animate() {
    camera.lookAt(camerafocus);
	requestAnimationFrame( animate );
    
    rendererwebglbg.render( scenebg, camera );
    renderercss3dbg.render( scenebg, camera);
    rendererwebgl.render( scene, camera );
    renderercss3d.render( scene, camera );
    
    // forcing camera position
    if(camera.position.y<object3d.position.y*scale_group){
        camera.position.y=object3d.position.y*scale_group+0.25;
    }
    // if(camera.position.z<object3d.position.z*scale_group){
    //     camera.position.z=object3d.position.z*scale_group+0.25;
    // }

    controls.update();

        if(camera.position.z<=(object3d.position.z*scale_group-zposB(object3d.position.y,camera.position.y,screenhtml.rotation.x,scale_group))){
            
            iframe3d.style.visibility='hidden';
        }else{
            iframe3d.style.visibility='visible';
        }
}
animate();


// Nav btns - this will make the buttons in the interface active a function for rotating the camera when clicked



function rotateMesh (str) {
    if (str === 'reset') {
        gsap.to(camera.position,{
            x:camera_initial_position.x*scale_group,
            y:camera_initial_position.y*scale_group, 
            z:camera_initial_position.z*scale_group,
            duration:.6
        });        
    }
    if (str === 'front') { 
        gsap.to(camera.position, {
            x: object3d.position.x*scale_group, 
            y: object3d.position.y*scale_group, 
            z:object3d.position.z+1*scale_group, 
            duration: 1});
    }
    if (str === 'top') { 
        gsap.to(camera.position, {
            x: object3d.position.x*scale_group+0.1, 
            y: object3d.position.y*scale_group+1, 
            z:object3d.position.z*scale_group+0.1, 
            duration: 1});

    }
    if (str === 'side') { 
        gsap.to(camera.position, {
            x: object3d.position.x*scale_group+1, 
            y: object3d.position.y*scale_group, 
            z:object3d.position.z*scale_group+0.3, 
            duration: 1});
    }
    if (str === 'screen') {
        let rz = object3d.position.z*scale_group;
        let ry = object3d.position.y*scale_group;
        let cz = rz + Math.sqrt(Math.cos(screenhtml.rotation.x)**2)*scale_group*1.5;
        let cy = ry + Math.sqrt(Math.sin(screenhtml.rotation.x)**2)*scale_group*1.5;
        let nz = rz+(cz)*scale_group;
        let ny = ry+((nz)/Math.sqrt(Math.tan(screenhtml.rotation.x)**2));
        // console.log(ny)
        let xpos = object3d.position.x*scale_group;
        let ypos = cy;
        let zpos = cz;
        
        gsap.to(
            camera.position, {
                x: xpos,
                y: ypos, 
                z:zpos,
                duration: 1});
                
            let textAlert=
            'object3d.position.z:'+
            object3d.position.z+
            ' , Math.cos(screenhtml.rotation.x):'+
            Math.cos(screenhtml.rotation.x)+
            ' , object3d.position.z+Math.sqrt((Math.cos(screenhtml.rotation.x))**2)):'+
            (object3d.position.z+
            (Math.cos(screenhtml.rotation.x)))+
            ' , zpos:'+zpos;
            // console.log('distance to center of screen: ' + camera.position.distanceTo(new THREE.Vector3(object3d.position.x*scale_group,object3d.position.y*scale_group,object3d.position.z*scale_group)))
    }
}

function boxBuilder(width=1,height=1,depth=1,color='white',wframe=false){
    let newbox = new THREE.BoxGeometry(width,height,depth);
    let material = new THREE.MeshBasicMaterial({color:color, wireframe:wframe})
    let builtbox = new THREE.Mesh(newbox, material);
    return(builtbox);
}
function planeBuilder(width=1,height=1,color='white',wframe=false){
    let newplane = new THREE.PlaneGeometry(width,height);
    let planematerial = new THREE.MeshBasicMaterial({color:color, wireframe:wframe})
    let builtplane = new THREE.Mesh(newplane, planematerial);
    return(builtplane);
}

function zposB(yp,ycam,ang,scale){
    {
        return(Math.sqrt((Math.tan(ang)*(ycam-yp*scale))**2));
    }
}

let popupshow = '';
function popUpDescription(){
    let popupdiv = document.createElement('div');
    popupdiv.className = 'popupdiv';
    if(popupshow==true){
        popupdiv.remove();
        document.querySelector('#info').style.backgroundColor = '#fff';
    }
    let popupdivint = document.createElement('p');
    popupdivint.className = 'popupdivint';
    let popupbtn = document.createElement('button')
    popupbtn.className = 'popupbtn';
    popupbtn.innerHTML = 'X';
    popupbtn.addEventListener('click', event => {
        popupdiv.remove();
        popupshow=false;
        document.querySelector('#info').style.backgroundColor = '#fff';
    })
    let popuptitle = document.createElement('h2');
    popuptitle.className = 'popuptitle';
    popuptitle.innerHTML = `Dispensador senhas XPTO`
    let popupparagraph = document.createElement('p');
    popupparagraph.className = 'popupparagraph';
    popupparagraph.innerHTML = 
        `<ul>
            <li>Ecrã touch 600x1024</li>
            <li>Impressora térmica</li>
            <li>Sistema Linux</li>
            <li>Interface web (html5)</li>
            <li>Personalizável com marca do cliente</li>
        </ul>`
    popupdiv.appendChild(popupbtn);
    popupdivint.appendChild(popuptitle);
    popupdivint.appendChild(popupparagraph);
    popupdiv.appendChild(popupdivint);
    let docbody = document.querySelector('#container');
    if(!popupshow){
        docbody.appendChild(popupdiv);
        document.querySelector('#info').style.backgroundColor = 'hotpink';
        popupshow=true;
    }

}
document.querySelector('.nav').addEventListener('click', event => {
    if (!event.target.classList.contains('btn')) return;
    rotateMesh(event.target.getAttribute('data-value')); 
})

document.querySelector('#info').addEventListener('click', () => {
    if(popupshow==true){
        document.querySelector('.popupdiv').remove();
        popupshow=false;
        document.querySelector('#info').style.backgroundColor = '#fff';
    }else{
        popUpDescription();
    }
})


window.onload=popUpDescription();


// CONSOLE LOGS:
// console.log('sizes.width: ')
// console.log(sizes.width)