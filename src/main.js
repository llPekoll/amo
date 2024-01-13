import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

let images:[string];


let selectedObjects = [];
let INTERSECTED;

var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
var renderer = new THREE.WebGLRenderer();

// Postprocessing
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

let numColumns;
if (window.innerWidth <= 480) { 
    numColumns = 2;
} else if (window.innerWidth <= 1024) { 
    numColumns = 3;
} else { 
    numColumns = 4;
}
let numRows = 10;

var currentRow = 0;
var currentColumn = 0;

// MESH
var aspectRatio = window.innerWidth / window.innerHeight;

var gap = 0.2;
for (var j = 0; j < numRows; j++) {
    for (var i = 0; i < numColumns; i++) {
        // DEBUG
        var texture = new THREE.TextureLoader().load(`https://placehold.co/400x400?text=${i}_${j}`);
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

            var index = planes.indexOf(centerOfInterest);
            currentRow = Math.floor(index / numColumns);
            currentColumn = index % numColumns;
            
            scalePlane(centerOfInterest);
            addSelectedObject( centerOfInterest );
            outlinePass.selectedObjects = selectedObjects;
        }
        
    } else {
        // no meed to clean Intersected
    }
   
}

function scalePlane(plane) {
    var scaleTween = new TWEEN.Tween(plane.scale)
        .to({ x: 3, y: 3 }, 300)
        .onComplete(function() {
            scaleTween.stop();
        });
    var positionTween = new TWEEN.Tween(plane.position)
        .to({ z: -3 }, 300)
        .onComplete(function() {
            positionTween.stop();
        });
    var colorTween = new TWEEN.Tween(plane.material.color)
        .to({ r: 1, g: 0, b: 0 }, 300)
        .onComplete(function() {
            colorTween.stop();
        });
    scaleTween.start();
    colorTween.start();
    positionTween.start();
}

function resetPlane(plane) {
    var scaleTween = new TWEEN.Tween(plane.scale)
        .to({ x: 1, y: 1 }, 300)
        .onComplete(function() {
            scaleTween.stop();
            plane.scale.set(1, 1, 1);
        });

    var positionTween = new TWEEN.Tween(plane.position)
        .to({ z: -5 }, 300) 
        .onComplete(function() {
            positionTween.stop();
        });
    var colorTween = new TWEEN.Tween(plane.material.color)
        .to({ r: 1, g: 1, b: 1 }, 300) 
        .onComplete(function() {
            colorTween.stop();
            plane.material.color.set(0xffffff);
        });
    var rotationTween = new TWEEN.Tween(plane.rotation)
        .to({ x:0, y: 0, z:0 }, 300) // Reset rotation
        .onComplete(function() {
            rotationTween.stop();
        });
    scaleTween.start();
    colorTween.start();
    positionTween.start();
    rotationTween.start();

}



// Keyboard



window.addEventListener('keydown', function(event) {
    
    switch (event.key) {
        case 'ArrowUp':
            currentRow = Math.max(currentRow - 1, 0); 
            break;
        case 'ArrowDown':
            currentRow = Math.min(currentRow + 1, numRows); 
            break;
        case 'ArrowLeft':
            currentColumn = Math.max(currentColumn - 1, 0); 
            break;
        case 'ArrowRight':
            currentColumn = Math.min(currentColumn + 1, numColumns-1); 
            break;
    }

    centerOfInterest = planes[currentRow * numColumns + currentColumn];

    scalePlane(centerOfInterest);
    addSelectedObject(centerOfInterest);
    outlinePass.selectedObjects = selectedObjects;

    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            resetPlane(centerOfInterest);
        }
    });
});

// Render loop
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    camera.position.y -= scrollSpeed / 100;
    scrollSpeed = 0;

    var lookAtTween = new TWEEN.Tween(currentLookAt)
    .to(centerOfInterest.position, 800)
    .onUpdate(function() {
        camera.lookAt(new THREE.Vector3(currentLookAt.x, currentLookAt.y, currentLookAt.z));
    })
    .start();
    composer.render();

    centerOfInterest.lookAt(camera.position);

    for (var i = 0; i < planes.length; i++) {
        if (planes[i] != centerOfInterest){

            resetPlane(planes[i]); 
        }
    }
   
}
animate();