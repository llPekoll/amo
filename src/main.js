import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';


let selectedObjects = [];
let INTERSECTED;
const pointer = new THREE.Vector2();

var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
var renderer = new THREE.WebGLRenderer();


const composer = new EffectComposer( renderer );
composer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

let outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
composer.addPass( outlinePass );

const outputPass = new OutputPass();
outlinePass.pulsePeriod = Number( 2.5 );
outlinePass.visibleEdgeColor.set( '#00ffff' );
composer.addPass( outputPass );

let effectFXAA = new ShaderPass( FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( effectFXAA );



function addSelectedObject( object ) {
    selectedObjects = [];
    selectedObjects.push( object );

}

var planes = [];
var centerOfInterest;
var currentLookAt = { x: 0, y: 0, z: 0 };

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);




// MESH
var aspectRatio = window.innerWidth / window.innerHeight;

var gap = 0.2;
for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 10; j++) {
        var texture = new THREE.TextureLoader().load(`https://placehold.co/400x400?text=Hello+World${i}_${j}`);
        var geometry = new THREE.PlaneGeometry(1, 1);
        var material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff});
        var plane = new THREE.Mesh(geometry, material);

        plane.position.set(((i - 1.5) * aspectRatio) + (i * gap), -(j - 4.5) + (j * -gap ), -5);

        scene.add(plane);
        planes.push(plane);
        centerOfInterest = planes[0];

    }
}


// MOUSE
var scrollSpeed = 0;
window.addEventListener('wheel', function(event) {
    scrollSpeed = event.deltaY;
});


document.addEventListener('mousemove', onDocumentMouseMove, false);



function onDocumentMouseMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects(planes, false );
    if (intersects.length>0) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            INTERSECTED = intersects[ 0 ].object;
            console.log("contact");
            centerOfInterest = intersects[0].object;
            scalePlane(centerOfInterest);
            addSelectedObject( centerOfInterest );
            outlinePass.selectedObjects = selectedObjects;
        }
        
    } else {
        // no meed to clean Intersected
    }
    for (var i = 0; i < planes.length; i++) {
        if (planes[i] != centerOfInterest){

            resetPlane(planes[i]); 
        }
    }
}

function scalePlane(plane) {
    var scaleTween = new TWEEN.Tween(plane.scale)
        .to({ x: 1.3, y: 1.3 }, 300)
        .onComplete(function() {
            scaleTween.stop();
        });
    var colorTween = new TWEEN.Tween(plane.material.color)
        .to({ r: 1, g: 0, b: 0 }, 300)
        .onComplete(function() {
            colorTween.stop();
        });
    scaleTween.start();
    colorTween.start();
}

function resetPlane(plane) {
    var scaleTween = new TWEEN.Tween(plane.scale)
        .to({ x: 1, y: 1 }, 300)
        .onComplete(function() {
            scaleTween.stop();
            plane.scale.set(1, 1, 1);
        });

    var colorTween = new TWEEN.Tween(plane.material.color)
        .to({ r: 1, g: 1, b: 1 }, 300) 
        .onComplete(function() {
            colorTween.stop();
            plane.material.color.set(0xffffff);
        });

    scaleTween.start();
    colorTween.start();
}



// Render loop
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    camera.position.y -= scrollSpeed / 100;
    scrollSpeed = 0;

    var lookAtTween = new TWEEN.Tween(currentLookAt)
    .to(centerOfInterest.position, 1000)
    .onUpdate(function() {
        camera.lookAt(new THREE.Vector3(currentLookAt.x, currentLookAt.y, currentLookAt.z));
    })
    .start();
    composer.render();
   
}
animate();