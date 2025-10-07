import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Ejecutar solo cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("[three.js] Inicializando...");

  const modal = document.getElementById("model-modal");
  const canvasContainer = document.getElementById("canvas-container");
  const loaderEl = document.getElementById("loader");
  const closeBtn = document.getElementById("close-modal");

  // Verifica si el modal existe
  if (!modal || !canvasContainer || !loaderEl || !closeBtn) {
    console.warn(
      "[three.js] No se encontró el modal o sus elementos. Asegúrate de incluir el HTML del modal en la página."
    );
    return;
  }

  let scene, camera, renderer, controls;
  let currentModel = null;

  // Listener de clics global
  document.addEventListener("click", (e) => {
    const card = e.target.closest('.card[data-type="model"]');
    if (!card) return;
    e.preventDefault();

    const modelPath = card.dataset.model;
    if (!modelPath) return;

    openModal(modelPath);
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function openModal(modelPath) {
    modal.classList.remove("hidden");
    loaderEl.style.display = "block";
    canvasContainer.innerHTML = "";

    // Configurar escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(
      75,
      canvasContainer.clientWidth / canvasContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Luces
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(2, 2, 2);
    scene.add(ambient, dirLight);

    // Controles
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Cargar modelo
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      modelPath,
      (gltf) => {
        currentModel = gltf.scene;
        scene.add(currentModel);
        loaderEl.style.display = "none";
      },
      (xhr) => {
        if (xhr.total) {
          loaderEl.textContent = `Cargando modelo... ${(
            (xhr.loaded / xhr.total) *
            100
          ).toFixed(0)}%`;
        }
      },
      (error) => {
        loaderEl.textContent = "Error al cargar el modelo 😢";
        console.error(error);
      }
    );

    animate();
    window.addEventListener("resize", onResize);
  }

  function animate() {
    if (!renderer) return;
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  function onResize() {
    if (!camera || !renderer) return;
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  }

  function closeModal() {
    modal.classList.add("hidden");
    loaderEl.style.display = "none";

    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement = null;
      renderer = null;
    }

    scene = null;
    camera = null;
    controls = null;
    currentModel = null;
    window.removeEventListener("resize", onResize);
  }
});
