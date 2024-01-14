import * as TWEEN from '@tweenjs/tween.js';

function animatePlane(plane) {
    const scaleTween = new TWEEN.Tween(plane.scale)
        .to({ x: 3, y: 3 }, 300)
        .onComplete(function() {
            scaleTween.stop();
        });

    const positionTween = new TWEEN.Tween(plane.position)
        .to({ z: -3 }, 300)
        .onComplete(function() {
            positionTween.stop();
        });

    const colorTween = new TWEEN.Tween(plane.material.color)
        .to({ r: 1, g: 0, b: 0 }, 300)
        .onComplete(function() {
            colorTween.stop();
        });

    scaleTween.start();
    colorTween.start();
    positionTween.start();
}

function resetPlane(plane) {
    const scaleTween = new TWEEN.Tween(plane.scale)
        .to({ x: 1, y: 1 }, 300)
        .onComplete(function() {
            scaleTween.stop();
            plane.scale.set(1, 1, 1);
        });

    const positionTween = new TWEEN.Tween(plane.position)
        .to({ z: -5 }, 300) 
        .onComplete(function() {
            positionTween.stop();
        });

    const colorTween = new TWEEN.Tween(plane.material.color)
        .to({ r: 1, g: 1, b: 1 }, 300) 
        .onComplete(function() {
            colorTween.stop();
            plane.material.color.set(0xffffff);
        });

    const rotationTween = new TWEEN.Tween(plane.rotation)
        .to({ x:0, y: 0, z:0 }, 300) // Reset rotation
        .onComplete(function() {
            rotationTween.stop();
        });

    scaleTween.start();
    colorTween.start();
    positionTween.start();
    rotationTween.start();
}

export { animatePlane, resetPlane };