import * as THREE from "three"
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js"


// Se necesitan tres cosas: escena, camara, y renderer
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// Hay distintas camaras una es PerspectiveCamera
/**
 * The first attribute is the field of view. FOV is the extent of the scene that is seen on the display
 * at any given moment. The value is in degrees.
 * The second one is the aspect ratio. You almost always want to use the width of the element
 * divided by the height, or you'll get the same result as when you play old movies on a widescreen TV -
 * the image looks squished.
 * The next two attributes are the near and far clipping plane. What that means, is that objects
 * further away from the camera than the value of far or closer than near won't be rendered.
 **/
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  // 0.1,
  // 1000
);

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
});


renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement)

// Crear el objeto
const geometry = new THREE.BoxGeometry(1, 1, 1);
// Crear la textura, los materiales basicos no reciben sombra
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// Agregar la textura al objeto
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true
// Se agrega el objeto a la escena
// scene.add(cube);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1, 100);
light.position.set(0, 1, 1);
light.castShadow = true // Esta luz genera sombra
scene.add(light);


// Load the model

const gltfLoader = new GLTFLoader()
let laptop;
gltfLoader.load("./models/notebook/scene.gltf", (model) => {
  // model.scene.set(0, 0, 0)
  model.scene.position.set(5, 0, 0)
  model.scene.scale.set(0.12, 0.12, 0.12)
  model.scene.rotation.set(0.4, -1, 0.2)
  scene.add(model.scene)

  laptop = model.scene
}, () => { }, (err) => console.log("ERROR", err))


// Plane
// const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// plane.receiveShadow = true
// plane.position.set(0, 0, 0)
// scene.add(plane)

// Agrega una grilla que ayuda a posicionarnos en el canvas
// const grid = new THREE.GridHelper(100, 100);

// scene.add(grid);
camera.position.set(0, 2, 5);
// Esto hace que se renderice
function animate() {
  /**
   * This will create a loop that causes the renderer to draw the scene every time the screen
   * is refreshed (on a typical screen this means 60 times per second)
   */
  /**
   * If you're new to writing games in the browser, you might say "why don't we just create a setInterval ?"
   * The thing is - we could, but requestAnimationFrame has a number of advantages.
   * Perhaps the most important one is that it pauses when the user navigates to another browser tab,
   * hence not wasting their precious processing power and battery life.
   */
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  renderer.render(scene, camera);

}
animate();
// const scene2 = new THREE.Scene()
// laptop.position.set(5, 0, 0)
// laptop.scale.set(0.1, 0.1, 0.1)
// laptop.rotation.set(0.4, -1, 0.2)
// scene2.add(laptop)
// renderer.render(scene2, camera)

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})