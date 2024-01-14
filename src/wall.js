// import * as THREE from "three";

// var gap = 0.2;
// var planes = [];
// const drawWall = (images, numRows, numColumns) => {
//     for (var j = 0; j < numRows; j++) {
//         for (var i = 0; i < numColumns; i++) {
//             // DEBUG
//             if (images.lengh === 0) {
//                 var texture = new THREE.TextureLoader().load(`https://placehold.co/400x400?amo`);
//             }
//             var geometry = new THREE.PlaneGeometry(1, 1);
//             var material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff});
//             var plane = new THREE.Mesh(geometry, material);
    
//             plane.position.set(((i - 1.5) * aspectRatio) + (i * gap), -(j - 4.5) + (j * -gap ), -5);
    
//             scene.add(plane);
//             planes.push(plane);
//             centerOfInterest = planes[0];
//         }
//     }
// }

// const destroyWall = () => {
//     for (var j = 0; j < numRows; j++) {
//         for (var i = 0; i < numColumns; i++) {
//             // DEBUG
//             if (images.lengh === 0) {
//                 var texture = new THREE.TextureLoader().load(`https://placehold.co/400x400?amo`);
//             }
//             var geometry = new THREE.PlaneGeometry(1, 1);
//             var material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff});
//             var plane = new THREE.Mesh(geometry, material);
    
//             plane.position.set(((i - 1.5) * aspectRatio) + (i * gap), -(j - 4.5) + (j * -gap ), -5);
    
//             scene.add(plane);
//             planes.push(plane);
//             centerOfInterest = planes[0];
//         }
//     }
// }

// export { drawWall };
