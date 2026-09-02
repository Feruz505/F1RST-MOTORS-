(function () {
  const container = document.getElementById('heroCar3D');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0.3, 1.5, 6.4);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.HemisphereLight(0xffffff, 0x101012, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(5, 8, 5);
  scene.add(key);
  const rimLight = new THREE.DirectionalLight(0xc9a06a, 0.55);
  rimLight.position.set(-6, 3, -4);
  scene.add(rimLight);

  // Faint ground disc for grounding shadow feel
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(6, 32),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0b, roughness: 0.5, metalness: 0.15 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.62;
  scene.add(ground);

  const carGroup = new THREE.Group();
  scene.add(carGroup);

  const paint = new THREE.MeshStandardMaterial({ color: 0x121216, metalness: 0.85, roughness: 0.22 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x37424b, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.85 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x18181a, metalness: 0.6, roughness: 0.4 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd9d9db, metalness: 1, roughness: 0.15 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffe9c7, emissive: 0xc9a06a, emissiveIntensity: 0.8 });
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x3a1210, emissive: 0xff5a3c, emissiveIntensity: 0.6 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.55, 1.7), paint);
  body.position.y = -0.15;
  carGroup.add(body);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 1.55), paint);
  hood.position.set(1.35, 0.18, 0);
  carGroup.add(hood);

  const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 1.55), paint);
  trunk.position.set(-1.6, 0.17, 0);
  carGroup.add(trunk);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 1.45), paint);
  cabin.position.set(-0.15, 0.53, 0);
  carGroup.add(cabin);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 1.3), glass);
  windshield.position.set(0.75, 0.56, 0);
  windshield.rotation.z = -0.3;
  carGroup.add(windshield);

  const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.38, 1.3), glass);
  rearWindow.position.set(-1.05, 0.56, 0);
  rearWindow.rotation.z = 0.34;
  carGroup.add(rearWindow);

  const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.32, 1.42), glass);
  sideWindow.position.set(-0.1, 0.6, 0);
  carGroup.add(sideWindow);

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 1.1), trim);
  grille.position.set(2.28, 0.05, 0);
  carGroup.add(grille);

  [0.62, -0.62].forEach((z) => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.32), headMat);
    hl.position.set(2.3, 0.12, z);
    carGroup.add(hl);
  });
  [0.6, -0.6].forEach((z) => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.34), tailMat);
    tl.position.set(-2.28, 0.1, z);
    carGroup.add(tl);
  });

  function makeWheel(x, z) {
    const wheel = new THREE.Group();
    const tire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.32, 24),
      new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.9 })
    );
    tire.rotation.z = Math.PI / 2;
    wheel.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.34, 24), chrome);
    rim.rotation.z = Math.PI / 2;
    wheel.add(rim);
    wheel.position.set(x, -0.42, z);
    carGroup.add(wheel);
  }
  makeWheel(1.5, 0.95);
  makeWheel(1.5, -0.95);
  makeWheel(-1.5, 0.95);
  makeWheel(-1.5, -0.95);

  carGroup.rotation.y = 0.5;

  // Drag / swipe / trackpad rotation
  let dragging = false;
  let lastX = 0;
  let targetRotY = carGroup.rotation.y;
  let autoRotate = true;
  let resumeTimer = null;

  function pause() {
    autoRotate = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { autoRotate = true; }, 2200);
  }

  renderer.domElement.style.cursor = 'grab';

  renderer.domElement.addEventListener('mousedown', (e) => {
    dragging = true;
    lastX = e.clientX;
    renderer.domElement.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    targetRotY += dx * 0.008;
    pause();
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    renderer.domElement.style.cursor = 'grab';
  });

  renderer.domElement.addEventListener('touchstart', (e) => {
    dragging = true;
    lastX = e.touches[0].clientX;
  }, { passive: true });
  renderer.domElement.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - lastX;
    lastX = e.touches[0].clientX;
    targetRotY += dx * 0.008;
    pause();
  }, { passive: true });
  renderer.domElement.addEventListener('touchend', () => { dragging = false; });

  // Trackpad two-finger horizontal swipe
  renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetRotY += e.deltaX * 0.003;
    pause();
  }, { passive: false });

  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) targetRotY += 0.0025;
    carGroup.rotation.y += (targetRotY - carGroup.rotation.y) * 0.08;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
