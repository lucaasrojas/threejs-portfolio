import * as THREE from "three"
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js"


// import Stats from "../node_modules/three/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();

// const gridHelper = new THREE.GridHelper(10);//(10, 10, 0xaec6cf, 0xaec6cf)
// scene.add(gridHelper);
// const axisHelper = new THREE.AxesHelper(1)
// scene.add(axisHelper);
const light = new THREE.DirectionalLight(0xffffff, 1, 100);
light.position.set(0, 1, 1);
light.castShadow = true // Esta luz genera sombra
scene.add(light);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: document.querySelector("#myCanvas")

});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let laptop;

const gltfLoader = new GLTFLoader()

gltfLoader.load("./models/notebook/scene.gltf", (model) => {
  laptop = model.scene
  // laptop.position.set(0, 0, 0)
  // laptop.scale.set(0.1, 0.1, 0.1)
  // laptop.rotation.set(-0.8, -0.8, 0)
  scene.add(model.scene)
  console.log("DONE...")

}, () => { console.log("LOADING...") }, (err) => console.log("ERROR", err))


window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

/* Liner Interpolation
 * lerp(min, max, ratio)
 * eg,
 * lerp(20, 60, .5)) = 40
 * lerp(-20, 60, .5)) = 20
 * lerp(20, 60, .75)) = 50
 * lerp(-20, -10, .1)) = -.19
 */
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

// Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start, end, percent = scrollPercent) {
  return (percent - start) / (end - start);
}

const animationScripts = [];
//add an animation that moves the cube through first 40 percent of scroll
animationScripts.push({
  start: 0,
  end: 33,
  func: () => {
    if (laptop) {
      laptop.scale.set(0.04, 0.04, 0.04)
      laptop.position.set(
        lerp(0.6, 0.2, scalePercent(0, 33)),
        lerp(-0.2, -0.5, scalePercent(0, 33)),
        lerp(-0.7, 0, scalePercent(0, 33, 0)))
      laptop.rotation.set(0.2, -0.7, 0)
      camera.position.set(0, 0, 1.5);
      // laptop.position.z = lerp(-10, 0, scalePercent(0, 30));
    }

    //console.log(cube.position.z)
  },
});

//add an animation that rotates the cube between 40-60 percent of scroll
animationScripts.push({
  start: 33,
  end: 66,
  func: () => {
    if (laptop) {
      laptop.rotation.y = lerp(-0.5, 0, scalePercent(33, 66))
      // camera.lookAt(laptop.position);
      // camera.position.set(0, 1, 2);
      // laptop.rotation.x = lerp(-1, Math.PI, scalePercent(40, 60));
      //console.log(cube.rotation.z)
    }
  },
});

//add an animation that moves the camera between 60-80 percent of scroll
animationScripts.push({
  start: 100,
  end: 101,
  func: () => {
    laptop.rotation.y += 0.01;
    // camera.position.x = lerp(0, 5, scalePercent(60, 80));
    // camera.position.y = lerp(1, 5, scalePercent(60, 80));
    // camera.lookAt(laptop?.position);
    //console.log(camera.position.x + " " + camera.position.y)
  },
});

//add an animation that auto rotates the cube from 80 percent of scroll
// animationScripts.push({
//   start: 80,
//   end: 101,
//   func: () => {
//     //auto rotate

//   },
// });

function playScrollAnimations() {
  animationScripts.forEach((a) => {
    if (scrollPercent >= a.start && scrollPercent < a.end) {
      a.func();
    }
  });
}

let scrollPercent = 0;

document.body.onscroll = () => {
  //calculate the current scroll progress as a percentage
  scrollPercent =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
      ((document.documentElement.scrollHeight || document.body.scrollHeight) -
        document.documentElement.clientHeight)) *
    100;
  (document.getElementById("scrollProgress")).innerText =
    "Scroll Progress : " + scrollPercent.toFixed(2);
};

// const stats = new Stats();
// document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  playScrollAnimations();

  render();

  // stats.update();
}

function render() {
  renderer.render(scene, camera);
}

window.scrollTo({ top: 0, behavior: "smooth" });
animate();
