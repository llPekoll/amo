var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

var planes = [];
var centerOfInterest = new THREE.Vector3(0, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Add ambient light
var ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// Add point light
var pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 10); // you can change the position as you like
scene.add(pointLight);



// MESH
for (var i = 0; i < 50; i++) {
    // var texture = new THREE.TextureLoader().load('path_to_your_images/' + i + '.jpg');
    var texture = new THREE.TextureLoader().load('https://placehold.co/600x400/EEE/31343C');
    var geometry = new THREE.PlaneGeometry(1, 1);
    var material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff});
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set((i % 10)*1.5 - 5, Math.floor(i / 10)*1.5 - 2, -5);
    scene.add(plane);
    planes.push(plane);
    centerOfInterest = planes[0].position;
}

// MOUSE
// ...


var mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {
    // Update the mouse position
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(planes);
    console.log({intersects});
    centerOfInterest = intersects[0].object.position;
    if (intersects.length) {
        intersects[0].object.scale.set(1.3, 1.3, 1.3);
    }
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    console.log(mouseX, mouseY);
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    console.log("camera.position.x, camera.position.y");
    console.log(camera.position.x, camera.position.y);

    console.log("camera.position");
    console.log(camera.position);    
    camera.lookAt(centerOfInterest);
    renderer.render(scene, camera);
    for (var i = 0; i < planes.length; i++) {
        if (planes[i].scale.x > 1) {
            planes[i].scale.set(1, 1, 1);
        }
    }
}
animate();