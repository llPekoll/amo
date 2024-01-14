import * as THREE from "three";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { scene, camera, renderer } from './threeSetup.js';

// Postprocessing
const composer = new EffectComposer( renderer );
composer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

let outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
composer.addPass( outlinePass );

const outputPass = new OutputPass();
outlinePass.pulsePeriod = Number( 2.5 );
outlinePass.edgeStrength = Number( 10 );
outlinePass.edgeThickness = Number( 4 );
outlinePass.visibleEdgeColor.set( 'green' );
composer.addPass( outputPass );

const effectFXAA = new ShaderPass( FXAAShader );
effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
composer.addPass( effectFXAA );

export { composer, renderPass, outlinePass, outputPass, effectFXAA };