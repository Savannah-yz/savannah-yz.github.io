import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// An original miniature built from simple geometry. The scene is decorative;
// navigation, publications, and the CV never depend on WebGL.
const stage = document.querySelector("#robot-stage");
const waveButton = document.querySelector("#wave-button");
const motionButton = document.querySelector(".motion-button");
const speech = document.querySelector("#robot-speech");

try {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  stage.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2.7, 2.7, 2.7, -2.7, 0.1, 50);
  camera.position.set(4.2, 3.5, 8);
  camera.lookAt(0, 1.35, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb3aedc, 2.2));
  const key = new THREE.DirectionalLight(0xfff6eb, 4.3);
  key.position.set(-3, 7, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -4;
  key.shadow.normalBias = 0.035;
  key.shadow.bias = -0.0001;
  key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc0c3ff, 2.5);
  rim.position.set(4, 3, -4);
  scene.add(rim);

  const material = (color, roughness = 0.55, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const porcelain = material("#f9f8ff", 0.35);
  const lavender = material("#777ae7", 0.45);
  const pale = material("#b5b9ff", 0.65);
  const screen = material("#22283c", 0.32);
  const peach = material("#ffb089", 0.45);
  const leafMat = material("#83b9a5", 0.75);
  const eyeMat = new THREE.MeshStandardMaterial({
    color: "#cbc9ff",
    emissive: "#8b80ed",
    emissiveIntensity: 0.45,
    roughness: 0.3,
  });
  const mesh = (geometry, mat, parent, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geometry, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const box = (w, h, d, radius, mat, parent, x = 0, y = 0, z = 0) =>
    mesh(new RoundedBoxGeometry(w, h, d, 5, radius), mat, parent, x, y, z);
  const sphere = (r, mat, parent, x = 0, y = 0, z = 0) =>
    mesh(new THREE.SphereGeometry(r, 24, 16), mat, parent, x, y, z);
  const cylinder = (rt, rb, h, mat, parent, x = 0, y = 0, z = 0) =>
    mesh(new THREE.CylinderGeometry(rt, rb, h, 64), mat, parent, x, y, z);

  const world = new THREE.Group();
  scene.add(world);
  // A small desk, set against the page's soft illustrated background.
  cylinder(1.93, 1.93, 0.17, pale, world, 0, 0.04, 0);
  cylinder(1.93, 1.93, 0.035, material("#d0d4ff", 0.82), world, 0, 0.14, 0);
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const shadowContext = shadowCanvas.getContext("2d");
  const gradient = shadowContext.createRadialGradient(64, 64, 15, 64, 64, 64);
  gradient.addColorStop(0, "rgba(66,64,120,.24)");
  gradient.addColorStop(0.7, "rgba(66,64,120,.08)");
  gradient.addColorStop(1, "rgba(66,64,120,0)");
  shadowContext.fillStyle = gradient;
  shadowContext.fillRect(0, 0, 128, 128);
  const floorShadow = mesh(
    new THREE.PlaneGeometry(4.9, 4.9),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      depthWrite: false,
    }),
    scene,
    0,
    -0.055,
    0,
  );
  floorShadow.rotation.x = -Math.PI / 2;
  floorShadow.castShadow = false;
  floorShadow.receiveShadow = false;

  const robot = new THREE.Group();
  robot.position.set(-0.04, 0.16, 0.25);
  world.add(robot);
  box(0.48, 0.29, 0.65, 0.13, porcelain, robot, -0.33, 0.16, 0.1);
  box(0.48, 0.29, 0.65, 0.13, porcelain, robot, 0.33, 0.16, 0.1);
  box(0.25, 0.26, 0.29, 0.07, lavender, robot, -0.33, 0.38, 0);
  box(0.25, 0.26, 0.29, 0.07, lavender, robot, 0.33, 0.38, 0);
  box(1.05, 0.88, 0.77, 0.22, porcelain, robot, 0, 0.92, 0);
  box(0.59, 0.35, 0.045, 0.1, material("#e2e2f4", 0.6), robot, 0, 0.98, 0.394);
  const badgeCanvas = document.createElement("canvas");
  badgeCanvas.width = 256;
  badgeCanvas.height = 128;
  const badgeContext = badgeCanvas.getContext("2d");
  badgeContext.fillStyle = "#e4e3f5";
  badgeContext.fillRect(0, 0, 256, 128);
  badgeContext.fillStyle = "#7875ad";
  badgeContext.font = "500 66px sans-serif";
  badgeContext.textAlign = "center";
  badgeContext.fillText("ZY", 128, 86);
  const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
  badgeTexture.colorSpace = THREE.SRGBColorSpace;
  mesh(
    new THREE.PlaneGeometry(0.39, 0.2),
    new THREE.MeshBasicMaterial({ map: badgeTexture }),
    robot,
    0,
    0.99,
    0.425,
  );
  cylinder(0.17, 0.17, 0.15, lavender, robot, 0, 1.43, 0);
  const button = sphere(0.038, peach, robot, 0.34, 1.12, 0.36);
  button.scale.z = 0.5;
  for (const x of [-0.17, 0, 0.17])
    box(0.06, 0.024, 0.024, 0.011, pale, robot, x, 0.71, 0.397);

  const head = new THREE.Group();
  head.position.set(0, 2.05, 0);
  robot.add(head);
  box(1.64, 1.17, 1.02, 0.34, porcelain, head);
  box(1.37, 0.85, 0.12, 0.22, screen, head, 0, -0.015, 0.486);
  const eyes = [-0.29, 0.29].map((x) =>
    box(0.13, 0.25, 0.04, 0.064, eyeMat, head, x, 0.055, 0.56),
  );
  const smileCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.11, -0.19, 0.568),
    new THREE.Vector3(0, -0.29, 0.57),
    new THREE.Vector3(0.11, -0.19, 0.568),
  );
  mesh(new THREE.TubeGeometry(smileCurve, 20, 0.018, 8, false), eyeMat, head);
  const cheeks = [-0.48, 0.48].map((x) =>
    sphere(0.047, material("#d08eaa"), head, x, -0.15, 0.56),
  );
  cheeks.forEach((c) => c.scale.set(1.4, 0.65, 0.3));
  cylinder(0.045, 0.045, 0.2, lavender, head, 0, 0.66, -0.03);
  // Two mismatched memory tabs, a small personal detail rather than a stock antenna.
  const tabOne = box(
    0.13,
    0.23,
    0.075,
    0.035,
    lavender,
    head,
    -0.085,
    0.82,
    -0.03,
  );
  tabOne.rotation.z = 0.3;
  const tabTwo = box(0.14, 0.3, 0.075, 0.035, peach, head, 0.08, 0.85, -0.03);
  tabTwo.rotation.z = -0.2;
  const ear = cylinder(0.16, 0.16, 0.1, pale, head, -0.83, -0.03, 0);
  ear.rotation.z = Math.PI / 2;
  const ear2 = ear.clone();
  ear2.position.x = 0.83;
  head.add(ear2);
  const memoryPack = box(
    0.14,
    0.37,
    0.36,
    0.045,
    lavender,
    head,
    0.87,
    -0.04,
    -0.02,
  );
  for (let row = 0; row < 3; row++)
    box(0.025, 0.045, 0.2, 0.01, peach, head, 0.95, 0.04 - row * 0.09, 0.01);

  function makeArm(x) {
    const arm = new THREE.Group();
    arm.position.set(x, 1.2, 0);
    robot.add(arm);
    sphere(0.14, lavender, arm);
    box(0.27, 0.48, 0.31, 0.13, porcelain, arm, 0, -0.22, 0);
    sphere(0.17, porcelain, arm, 0, -0.48, 0.02);
    return arm;
  }
  const leftArm = makeArm(-0.65);
  leftArm.rotation.z = -0.18;
  const rightArm = makeArm(0.65);
  rightArm.rotation.z = 0.22;

  // Two books and a tiny plant give the robot a sense of place.
  const books = new THREE.Group();
  books.position.set(-1.2, 0.18, 0.21);
  books.rotation.y = -0.25;
  world.add(books);
  box(0.68, 0.15, 0.55, 0.025, peach, books, 0, 0.075, 0);
  box(0.64, 0.09, 0.49, 0.01, material("#fff5e9"), books, 0, 0.078, 0.025);
  const topBook = box(
    0.62,
    0.14,
    0.5,
    0.025,
    lavender,
    books,
    0.04,
    0.22,
    -0.02,
  );
  topBook.rotation.y = -0.14;
  const paper = box(0.59, 0.08, 0.45, 0.008, porcelain, books, 0.04, 0.221, 0);
  paper.rotation.y = -0.14;
  const bookmark = box(
    0.07,
    0.009,
    0.13,
    0.005,
    peach,
    books,
    0.22,
    0.296,
    0.19,
  );
  bookmark.rotation.y = -0.14;
  const plant = new THREE.Group();
  plant.position.set(1.23, 0.17, -0.38);
  world.add(plant);
  cylinder(0.24, 0.16, 0.38, material("#efad87", 0.8), plant, 0, 0.19, 0);
  cylinder(0.245, 0.245, 0.07, peach, plant, 0, 0.36, 0);
  cylinder(0.19, 0.19, 0.025, material("#8c737c"), plant, 0, 0.397, 0);
  cylinder(0.025, 0.025, 0.55, leafMat, plant, 0, 0.65, 0);
  [
    [-0.12, 0.64, 0, -0.6],
    [0.13, 0.77, 0.02, 0.65],
    [-0.1, 0.92, 0, -0.45],
    [0.04, 1.01, -0.01, 0.2],
  ].forEach(([x, y, z, rot]) => {
    const leaf = sphere(0.15, leafMat, plant, x, y, z);
    leaf.scale.set(0.6, 1.5, 0.38);
    leaf.rotation.z = rot;
  });

  let frame = 0,
    lastFrame = 0,
    animationTime = 0,
    wavingUntil = 0,
    greetingTimer;
  let visible = true,
    paused = document.body.classList.contains("motion-paused"),
    contextLost = false;
  const pointer = { x: 0, y: 0 };
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const halfHeight = 2.17;
    const halfWidth = Math.max(2.25, (halfHeight * width) / height);
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = (halfWidth * height) / width;
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    renderStill();
  }
  function renderStill() {
    if (!contextLost) renderer.render(scene, camera);
  }
  function animate(time) {
    frame = 0;
    if (paused || !visible || document.hidden || contextLost) return;
    frame = requestAnimationFrame(animate);
    if (time - lastFrame < 1000 / 30) return;
    const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 0.07) : 0;
    lastFrame = time;
    animationTime += delta;
    const t = animationTime;
    head.rotation.y = THREE.MathUtils.damp(
      head.rotation.y,
      pointer.x * 0.18 - 0.04,
      5,
      delta,
    );
    head.rotation.x = THREE.MathUtils.damp(
      head.rotation.x,
      pointer.y * 0.09,
      5,
      delta,
    );
    head.rotation.z = 0.045 + Math.sin(t * 0.85) * 0.025;
    robot.position.y = 0.16 + Math.sin(t * 1.7) * 0.025;
    const blinkPhase = t % 4.8;
    const blink =
      blinkPhase > 4.55
        ? Math.max(0.12, Math.abs((blinkPhase - 4.675) / 0.125))
        : 1;
    eyes.forEach((eye) => {
      eye.scale.y = blink;
    });
    const waving = time < wavingUntil;
    rightArm.rotation.z = THREE.MathUtils.damp(
      rightArm.rotation.z,
      waving
        ? 2.18 + Math.sin(time * 0.014) * 0.25
        : 0.22 + Math.sin(t * 1.7) * 0.025,
      9,
      delta,
    );
    leftArm.rotation.z = -0.18 + Math.sin(t * 1.7 + 0.4) * 0.025;
    renderer.render(scene, camera);
  }
  function start() {
    if (!frame && !paused && visible && !document.hidden && !contextLost) {
      lastFrame = 0;
      frame = requestAnimationFrame(animate);
    }
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }
  stage.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || paused) return;
    const r = stage.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  });
  stage.addEventListener("pointerleave", () => {
    pointer.x = 0;
    pointer.y = 0;
  });
  const greetings = ["Hello! 👋", "Nice to meet you.", "Good to see you."];
  let greetingIndex = 0;
  waveButton.addEventListener("click", () => {
    speech.textContent = greetings[greetingIndex++ % greetings.length];
    speech.classList.add("greeting");
    clearTimeout(greetingTimer);
    wavingUntil = performance.now() + 2400;
    if (paused) {
      rightArm.rotation.z = 2.1;
      renderStill();
    }
    greetingTimer = setTimeout(() => {
      speech.textContent = "Hello, there.";
      speech.classList.remove("greeting");
      if (paused) {
        rightArm.rotation.z = 0.22;
        renderStill();
      }
    }, 4200);
    start();
  });
  document.addEventListener("zhe-motion-change", (e) => {
    paused = e.detail.paused;
    if (paused) {
      stop();
      eyes.forEach((eye) => {
        eye.scale.y = 1;
      });
      renderStill();
    } else start();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    },
    { rootMargin: "80px" },
  ).observe(stage);
  new ResizeObserver(resize).observe(stage);
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    contextLost = true;
    stop();
    stage.classList.remove("ready");
    waveButton.hidden = true;
    motionButton.hidden = true;
  });
  renderer.domElement.addEventListener("webglcontextrestored", () => {
    contextLost = false;
    resize();
    stage.classList.add("ready");
    waveButton.hidden = false;
    motionButton.hidden = false;
    start();
  });
  resize();
  stage.classList.add("ready");
  waveButton.hidden = false;
  motionButton.hidden = false;
  start();
} catch (error) {
  // Static artwork is already in the HTML for unsupported or blocked WebGL.
  stage.querySelector("canvas")?.remove();
  stage.classList.remove("ready");
  waveButton.hidden = true;
  motionButton.hidden = true;
  console.info("Using the static lab buddy illustration.", error.message);
}
