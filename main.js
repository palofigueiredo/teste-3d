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
        x:5.3721,y:0,z:0
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
	'./senhas_02.glb',
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



const frametv_01 = planeBuilder (1.04,1.81,'#404040',false)
frametv_01.position.set(1,1.26,-2.49);
scenebg.add(frametv_01);


const frametv_02 = planeBuilder (1.94,1.04,'#404040',false)
frametv_02.position.set(-1,1.6,-2.49);
scenebg.add(frametv_02);

const frametv_03 = planeBuilder (0.98,0.55,'#404040',false)
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
iframe3d.src = './menu.html';
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
const group_MV = new THREE.Group;
const display_01 = css3dElementBuilder('iframe',720,1360);
const display_01_3d = new CSS3DObject (display_01)

display_01_3d.scale.set(1/720,1/720);
// display_01_3d.rotation.x = 0.5;

display_01.src = './montra_V.html'
group_MV.add(display_01_3d);
group_MV.position.set(1,1.2,-2.49)

const group_MH = new THREE.Group;
const display_02 = css3dElementBuilder('iframe', 1360,720);
display_02.src = './montra_H.html'
const display_02_3d = new CSS3DObject(display_02);
display_02_3d.scale.set(1/720,1/720);
group_MH.add(display_02_3d);
group_MH.position.set(-1,1.6,-2.49);

const group_CTV = new THREE.Group;
const display_03 = css3dElementBuilder('iframe', 1366,768);
display_03.src = './ctv.html'
const display_03_3d = new CSS3DObject(display_03);
display_03_3d.scale.set(1/(720*2),1/(720*2));
group_CTV.add(display_03_3d);
group_CTV.position.set(2.3,2,-2.1);

group_CTV.rotation.x=Math.PI*0.1;
group_CTV.rotation.y=2*Math.PI-Math.PI*.2;
group_CTV.rotation.z=Math.PI*.05;



scenebg.add(group_CTV);
scenebg.add(group_MH);
scenebg.add(group_MV);
// scene.add(bgscene);
// bgscene.add(display_01_3d)




const object3d = new CSS3DObject( iframe3d );

object3d.scale.set(1/screenhtml.width,1/screenhtml.width)

object3d.position.set( screenhtml.x, screenhtml.y, screenhtml.z );
object3d.rotateX(screenhtml.rotation.x)
object3d.rotateY(screenhtml.rotation.y)
object3d.rotateZ(screenhtml.rotation.z)



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

// camera.lookAt(camerafocus);


// CONTROLS 
const controls = new OrbitControls(camera, renderercss3d.domElement)
// const controlsbg = new OrbitControls(camera, renderercss3dbg.domElement)
// const controls = new TrackballControls(camera, renderercss3d.domElement)
// const controls = new ArcballControls(camera, renderercss3d.domElement)
controls.movementSpeed = 0.1;
// console.log(screenhtml.rotation.x);
const initcontrols={minpolar:-Math.PI*0.99,
    maxpolar: Math.PI/2,
    minazimuth: -Math.PI/2.1,
    maxazimuth: Math.PI/2.1,
    maxdist: 2.3
}
controls.minPolarAngle = initcontrols.minpolar;
controls.maxPolarAngle = initcontrols.maxpolar;
controls.minAzimuthAngle = initcontrols.minazimuth;
controls.maxAzimuthAngle = initcontrols.maxazimuth;
controls.maxDistance = initcontrols.maxdist;

controls.target.set(camerafocus.x,camerafocus.y,camerafocus.z);
console.log('setcontrols target');

// const controls = new TrackballControls(camera,canvas)
controls.enableDamping = true;

function animate() {
    // camera.lookAt(camerafocus);
	requestAnimationFrame( animate );
    
    rendererwebglbg.render( scenebg, camera );
    renderercss3dbg.render( scenebg, camera);
    rendererwebgl.render( scene, camera );
    renderercss3d.render( scene, camera );
    
    // forcing camera position
    // if(camera.position.y<object3d.position.y*scale_group){
    //     camera.position.y=object3d.position.y*scale_group+0.25;
    // }
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
        camerafocus.x = object3d.position.x*scale_group;
        camerafocus.y = object3d.position.y*scale_group;
        camerafocus.z = object3d.position.z*scale_group;
        gsap.to(controls.target,{
            x:camerafocus.x,
            y:camerafocus.y, 
            z:camerafocus.z,
            duration:.6
        });
        controls.minPolarAngle = initcontrols.minpolar;
        controls.maxPolarAngle = initcontrols.maxpolar;
        controls.minAzimuthAngle = initcontrols.minazimuth;
        controls.maxAzimuthAngle = initcontrols.maxazimuth;
        controls.maxDistance = initcontrols.maxdist;        
    }
    if (str === '2') {  //front
        gsap.to(camera.position, {
            x: object3d.position.x*scale_group, 
            y: object3d.position.y*scale_group, 
            z:object3d.position.z+3*scale_group, 
            duration: 1});
            camerafocus.x = object3d.position.x*scale_group;
        camerafocus.y = object3d.position.y*scale_group;
        camerafocus.z = object3d.position.z*scale_group;
        gsap.to(controls.target,{
            x:camerafocus.x,
            y:camerafocus.y, 
            z:camerafocus.z,
            duration:.6
        });
        controls.minPolarAngle = initcontrols.minpolar;
        controls.maxPolarAngle = initcontrols.maxpolar;
        controls.minAzimuthAngle = initcontrols.minazimuth;
        controls.maxAzimuthAngle = initcontrols.maxazimuth;
        controls.maxDistance = initcontrols.maxdist;
    }
    if (str === 'top') { 
        gsap.to(camera.position, {
            x: object3d.position.x*scale_group+0.1, 
            y: object3d.position.y*scale_group+1, 
            z:object3d.position.z*scale_group+0.1, 
            duration: 1});
            camerafocus.x = object3d.position.x*scale_group;
        camerafocus.y = object3d.position.y*scale_group;
        camerafocus.z = object3d.position.z*scale_group;
        gsap.to(controls.target,{
            x:camerafocus.x,
            y:camerafocus.y, 
            z:camerafocus.z,
            duration:.6
        });
        controls.minPolarAngle = initcontrols.minpolar;
        controls.maxPolarAngle = initcontrols.maxpolar;
        controls.minAzimuthAngle = initcontrols.minazimuth;
        controls.maxAzimuthAngle = initcontrols.maxazimuth;
        controls.maxDistance = initcontrols.maxdist;
    }
    if (str === '0') { 
        gsap.to(camera.position, {
            x: object3d.position.x*scale_group+1, 
            y: object3d.position.y*scale_group, 
            z:object3d.position.z*scale_group+0.3, 
            duration: 1});
            camerafocus.x = object3d.position.x*scale_group;
        camerafocus.y = object3d.position.y*scale_group;
        camerafocus.z = object3d.position.z*scale_group;
        gsap.to(controls.target,{
            x:camerafocus.x,
            y:camerafocus.y, 
            z:camerafocus.z,
            duration:.6
        });
        controls.minPolarAngle = initcontrols.minpolar;
        controls.maxPolarAngle = initcontrols.maxpolar;
        controls.minAzimuthAngle = initcontrols.minazimuth;
        controls.maxAzimuthAngle = initcontrols.maxazimuth;
        controls.maxDistance = initcontrols.maxdist;
    }
    if (str === '1') {  
    
        let fc = positionsLookAt(object3d.position,screenhtml.rotation,scale_group,0.4);
        gsap.to(
            camera.position, {
                x: fc.x,
                y: fc.y, 
                z: fc.z,
                duration: 1});
        camerafocus.x = object3d.position.x*scale_group;
        camerafocus.y = object3d.position.y*scale_group;
        camerafocus.z = object3d.position.z*scale_group;
        gsap.to(controls.target,{
            x:camerafocus.x,
            y:camerafocus.y, 
            z:camerafocus.z,
            duration:.6
        });
        controls.minPolarAngle = initcontrols.minpolar;
        controls.maxPolarAngle = initcontrols.maxpolar;
        controls.minAzimuthAngle = initcontrols.minazimuth;
        controls.maxAzimuthAngle = initcontrols.maxazimuth;
        controls.maxDistance = initcontrols.maxdist;
    }
    if (str === '5') {
        camerafocus.x = group_CTV.position.x;
        camerafocus.y = group_CTV.position.y;
        camerafocus.z = group_CTV.position.z;
        


        let ctvp = positionsLookAt(group_CTV.position,group_CTV.rotation,1,1.2)

        gsap.to(
            camera.position, {
                x: ctvp.x,
                y: ctvp.y, 
                z: ctvp.z,
                duration: 1});
        gsap.to(controls.target,{
            x:camerafocus.x,
            y:camerafocus.y, 
            z:camerafocus.z,
            duration:.6
        }); 
        controls.minPolarAngle = Math.PI - 1.9;
        controls.maxPolarAngle = Math.PI/1.3;
        controls.minAzimuthAngle = -Math.PI/2.2;
        controls.maxAzimuthAngle = Math.PI/4.2;
        controls.maxDistance = 1

                
    }
    if (str === '3') {
        camerafocus.x = group_MH.position.x;
        camerafocus.y = group_MH.position.y;
        camerafocus.z = group_MH.position.z;

        let mhp = positionsLookAt(group_MH.position,group_MH.rotation,1,1)

        gsap.to(
            camera.position, {
                x: mhp.x,
                y: mhp.y, 
                z: mhp.z,
                duration: 1});
        gsap.to(controls.target,{
            x:camerafocus.x,
            y:camerafocus.y, 
            z:camerafocus.z,
            duration:.6
        }); 

        controls.minPolarAngle = Math.PI - 2;
        controls.maxPolarAngle = Math.PI/1.5;
        controls.minAzimuthAngle = -Math.PI/2.5;
        controls.maxAzimuthAngle = Math.PI/2.5;
        controls.maxDistance = 1.5
                
    }
    if (str === '4') {

        camerafocus.x = group_MV.position.x;
        camerafocus.y = group_MV.position.y;
        camerafocus.z = group_MV.position.z;

        let mvp = positionsLookAt(group_MV.position,group_MV.rotation,1,1)

        gsap.to(
            camera.position, {
                x: mvp.x,
                y: mvp.y, 
                z: mvp.z,
                duration: 1});
        gsap.to(controls.target,{
            x:camerafocus.x,
            y:camerafocus.y, 
            z:camerafocus.z,
            duration:.6
        }); 
        controls.minPolarAngle = Math.PI - 2;
        controls.maxPolarAngle = Math.PI/1.5;
        controls.minAzimuthAngle = -Math.PI/2.5;
        controls.maxAzimuthAngle = Math.PI/2.5;
        controls.maxDistance = 1.5
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

// let popupshow = '';
// function popUpDescription(){
//     let popupdiv = document.createElement('div');
//     popupdiv.className = 'popupdiv';
//     if(popupshow==true){
//         popupdiv.remove();
//         document.querySelector('#info').style.backgroundColor = '#fff';
//     }
//     let popupdivint = document.createElement('p');
//     popupdivint.className = 'popupdivint';
//     let popupbtn = document.createElement('button')
//     popupbtn.className = 'popupbtn';
//     popupbtn.innerHTML = 'X';
//     popupbtn.addEventListener('click', event => {
//         popupdiv.remove();
//         popupshow=false;
//         document.querySelector('#info').style.backgroundColor = '#fff';
//     })
//     let popuptitle = document.createElement('h2');
//     popuptitle.className = 'popuptitle';
//     popuptitle.innerHTML = `Dispensador senhas XPTO`
//     let popupparagraph = document.createElement('p');
//     popupparagraph.className = 'popupparagraph';
//     popupparagraph.innerHTML = 
//         `<ul>
//             <li>Ecrã touch 600x1024</li>
//             <li>Impressora térmica</li>
//             <li>Sistema Linux</li>
//             <li>Interface web (html5)</li>
//             <li>Personalizável com marca do cliente</li>
//         </ul>`
//     popupdiv.appendChild(popupbtn);
//     popupdivint.appendChild(popuptitle);
//     popupdivint.appendChild(popupparagraph);
//     popupdiv.appendChild(popupdivint);
//     let docbody = document.querySelector('#container');
//     if(!popupshow){
//         docbody.appendChild(popupdiv);
//         document.querySelector('#info').style.backgroundColor = 'hotpink';
//         popupshow=true;
//     }
// }

function positionsLookAt(targetpos,targetrot,scale,dist){
    let rx = targetpos.x*scale;
    let ry = targetpos.y*scale;
    let rz = targetpos.z*scale;
    
    let sinx = Math.sin((targetrot.x)) * dist;
    let cosx = Math.cos((targetrot.x)) * dist;
    let siny = Math.sin((targetrot.y)) * dist;
    let cosy = Math.cos((targetrot.y)) * dist;
    let sinz = Math.sin((targetrot.z)) * dist;
    let cosz = Math.cos((targetrot.z)) * dist;

    
    let cx = 0;
    let cy = 0;
    let cz = 0;

    // cx = rx + siny - sinz;
    cx = rx + cosy - cosz
    cy = ry - sinx + sinz;
    cz = rz + siny + cosx;

    console.log(ry+ ' ' +rz + ' '+ cy + ' ' +cz);

    let xpos = cx;
    let ypos = cy;
    let zpos = cz;

    return(new THREE.Vector3(xpos,ypos,zpos));
}
function posval(num){
    return(Math.sqrt(num**2));
}

document.querySelector('.nav').addEventListener('click', event => {
    if (!event.target.classList.contains('btn')) return;
    rotateMesh(event.target.getAttribute('data-value')); 
})

// document.querySelector('#info').addEventListener('click', () => {
//     if(popupshow==true){
//         document.querySelector('.popupdiv').remove();
//         popupshow=false;
//         document.querySelector('#info').style.backgroundColor = '#fff';
//     }else{
//         popUpDescription();
//     }
// })



const textos_popup = [
{
    title: "Branding",
    content:
    "<p class='dialog-text'>Personalizável com marca do cliente nas laterais e topo do equipmaneto</p>"
},
{
    title: "Menu",
    content:
    "<p class='dialog-text'>Menu HTML. Escolha uma opção para simular uma chamada de senha.</p>"
},
{
    title: "Dispensador de senhas",
    content:
    "<ul class='dialog-list'><li>Ecrã touch 600x1024</li><li>Impressora térmica</li><li>Sistema Linux</li><li>Interface web (HTML5)</li><li>Personalizável com marca do cliente</li></ul>"
},
{
    title: "Montra Digital horizontal",
    content:
    "<p class='dialog-text'>Montra Digital, no formato Horizontal, com playlist de Campanhas</p>"
},
{
    title: "Montra Digital vertical",
    content:
    "<p class='dialog-text'>Montra Digital, no formato Vertical, com playlist de Campanhas</p>"
},
{
    title: "TV Corporativa",
    content:
    "<p class='dialog-text'>TV Corporativa com Gestão de Atendimento e playlist de Campanhas e Conteúdos  Institucionais</p>"
}
];


const dialog = document.querySelector("dialog .content");

function showModalText(str) {
    dialog.innerHTML = `
    <h2 class="dialog-title">${textos_popup[str].title}</h2>
    ${textos_popup[str].content}
`;    
}

showModalText(0);

// Menu
const modal =  document.querySelector("dialog");
const menu = document.querySelector('.menu');
menu.addEventListener('click', event => {
    modal.setAttribute('open', '');
    showModalText(event.target.getAttribute('data-text'));
    rotateMesh(event.target.getAttribute('data-text'));
})

// Menu toggle
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', event => {
    event.currentTarget.closest('.nav').classList.toggle('active');
})


// window.onload=popUpDescription();


// CONSOLE LOGS:
// console.log('sizes.width: ')
// console.log(sizes.width)