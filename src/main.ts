import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';
import { scene, raycaster, mouse, camera, renderer } from './threeSetup';
import { composer, outlinePass } from './postprocessingSetup';
import { animatePlane, resetPlane } from './animations';


document.getElementById('container')!.appendChild(renderer.domElement);

interface Image {
    contentUrl: string;
}

let images:Image[] = [];
let planes:THREE.Mesh[] = [];
let centerOfInterest:THREE.Mesh | null = null;
let currentLookAt = { x: 0, y: 0, z: 0 };

let numColumns:number;
let numRows = 10;

let currentRow = 0;
let currentColumn = 0;

let aspectRatio = window.innerWidth / window.innerHeight;

function drawWall(images) {
    // Set basic setup for positioning the planes
    let gap = 0.2;
    if (window.innerWidth <= 480) { 
        numColumns = 1;
    } else if (window.innerWidth <= 1024) { 
        numColumns = 2;
        gap = 0.5;
    } else { 
        numColumns = 4;
    }
    // Clean the wall
    for (let i = 0; i < planes.length; i++) {
        scene.remove(planes[i]);
    }
    planes = [];
    if (images.length > 0) {
        numRows = Math.ceil(images.length / numColumns);
    }
    for (let j = 0; j < numRows; j++) {
        for (let i = 0; i < numColumns; i++) {
            let texture;
            if (images.length > 0) {
                texture = new THREE.TextureLoader().load(images[j * numColumns + i].contentUrl);
            } else {
                texture = new THREE.TextureLoader().load(`https://placehold.co/400x400?text=amo`);
            }
            let geometry = new THREE.PlaneGeometry(1, 1);
            let material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff});
            let plane = new THREE.Mesh(geometry, material);

            plane.position.set(((i - 1.5) * aspectRatio) + (i * gap), -(j - 4.5) + (j * -gap ), -5);

            scene.add(plane);
            planes.push(plane);
        }
    }
    centerOfInterest = planes[0];
}

drawWall(images);


// MOUSE & TOUCH
let scrollSpeed = 0;
window.addEventListener('wheel', function(event) {
    scrollSpeed = event.deltaY;
});

let touchStartY: number;
let touchMoveY: number;

window.addEventListener('touchstart', function(event) {
    touchStartY = event.touches[0].clientY;
    if (event.touches.length === 2) {
        centerOfInterest = null;
    }
});

window.addEventListener('touchmove', function(event) {
    touchMoveY = event.touches[0].clientY;
    scrollSpeed = ((touchMoveY - touchStartY)/10) * -1;
});

window.addEventListener('touchend', function(event) {
    scrollSpeed = 0;
});

window.addEventListener('resize', function() {
    // Update aspect ratio
    aspectRatio = window.innerWidth / window.innerHeight;

    // Update camera
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Redraw the wall with the new aspect ratio
    drawWall(images); // You need to have access to the images array here
});

document.getElementById('searchForm')!.addEventListener('submit', function(event) {
    event.preventDefault();

    let query = document.getElementById('search')!.value;

    fetch('https://api.bing.microsoft.com/v7.0/images/search?q=' + encodeURIComponent(query), {
        headers: {
            // 'Ocp-Apim-Subscription-Key': import.meta.env.VITE_BING_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        const images = data.value;
        drawWall(images);
        console.log(data.value);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects(planes, false );
    
    let intersected;
    if (intersects.length > 0) {
        if (intersected !== intersects[0].object) {
            intersected = intersects[0].object as THREE.Mesh;
            centerOfInterest = intersected;
            const index = planes.indexOf(centerOfInterest as THREE.Mesh);
            currentRow = Math.floor(index / numColumns);
            currentColumn = index % numColumns;
            
            animatePlane(centerOfInterest);
            outlinePass.selectedObjects = [centerOfInterest as THREE.Mesh];
        }
        
    } else {
        // no meed to clean Intersected
    }
   
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

    animatePlane(centerOfInterest);
    outlinePass.selectedObjects = [centerOfInterest]

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

    let lookAtTween = new TWEEN.Tween(currentLookAt)
    .to(centerOfInterest.position, 800)
    .onUpdate(function() {
        camera.lookAt(new THREE.Vector3(currentLookAt.x, currentLookAt.y, currentLookAt.z));
    })
    .start();
    composer.render();

    centerOfInterest.lookAt(camera.position);

    for (let i = 0; i < planes.length; i++) {
        if (planes[i] != centerOfInterest){

            resetPlane(planes[i]); 
        }
    }
   
}
animate();