import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Original, procedural toy and choreography. This is a playful illustration,
// not a recording or an implementation of the research described beside it.
const stage = document.querySelector("#research-stage");
const progress = document.querySelector("#research-progress");
const replay = document.querySelector("#research-replay");
const action = document.querySelector("#research-action");

if (stage) {
  try {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setClearColor(0, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.setAttribute("aria-hidden", "true");
    stage.append(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, 0.1, 30);
    camera.position.set(3.4, 3.1, 7);
    camera.lookAt(0, 0.95, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc2bddb, 2.4));
    const light = new THREE.DirectionalLight(0xfff7ef, 3.8);
    light.position.set(-3, 7, 5);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    Object.assign(light.shadow.camera, {
      left: -4,
      right: 4,
      top: 5,
      bottom: -4,
    });
    light.shadow.normalBias = 0.035;
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xb4b0ff, 2);
    fill.position.set(4, 3, -4);
    scene.add(fill);
    const world = new THREE.Group();
    scene.add(world);
    const mat = (color, roughness = 0.6) =>
      new THREE.MeshStandardMaterial({ color, roughness });
    const white = mat("#fffaf5", 0.4),
      lilac = mat("#8580dc", 0.45),
      dark = mat("#323447"),
      peach = mat("#eea078"),
      sole = mat("#c4c0e9");
    const add = (geo, material, parent, x = 0, y = 0, z = 0) => {
      const object = new THREE.Mesh(geo, material);
      object.position.set(x, y, z);
      object.castShadow = object.receiveShadow = true;
      parent.add(object);
      return object;
    };
    const box = (w, h, d, radius, material, parent, x, y, z) =>
      add(
        new RoundedBoxGeometry(w, h, d, 4, radius),
        material,
        parent,
        x,
        y,
        z,
      );
    const sphere = (radius, material, parent, x, y, z) =>
      add(new THREE.SphereGeometry(radius, 24, 16), material, parent, x, y, z);
    const cylinder = (r, height, material, parent, x, y, z) =>
      add(
        new THREE.CylinderGeometry(r, r, height, 48),
        material,
        parent,
        x,
        y,
        z,
      );
    // An open miniature set, without a UI card around the illustration.
    box(4.6, 0.1, 2.2, 0.5, mat("#f0edf7"), world, 0, 0, 0);
    const stops = [-1.45, 1.45];
    stops.forEach((x, i) => {
      cylinder(
        0.38,
        0.13,
        mat(i ? "#d4e5db" : "#f4d9c9"),
        world,
        x,
        0.11,
        0.55,
      );
      const ring = add(
        new THREE.TorusGeometry(0.29, 0.018, 10, 48),
        mat(i ? "#9bbdac" : "#d5a48a"),
        world,
        x,
        0.183,
        0.55,
      );
      ring.rotation.x = Math.PI / 2;
    });
    for (let i = 0; i < 11; i++) {
      const dot = cylinder(
        0.022,
        0.012,
        mat("#c6c1db"),
        world,
        -1.12 + i * 0.224,
        0.058,
        0.55,
      );
      dot.castShadow = false;
    }
    const buddy = new THREE.Group();
    world.add(buddy);
    buddy.position.set(-1.45, 0.08, -0.15);
    const leg = (x) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.61, 0);
      buddy.add(pivot);
      box(0.24, 0.39, 0.29, 0.1, sole, pivot, 0, -0.19, 0);
      box(0.34, 0.22, 0.48, 0.1, white, pivot, 0, -0.44, 0.08);
      return pivot;
    };
    const legs = [leg(-0.22), leg(0.22)];
    box(0.86, 0.72, 0.58, 0.22, lilac, buddy, 0, 0.92, 0);
    box(0.41, 0.25, 0.025, 0.07, sole, buddy, 0, 0.96, 0.3);
    // The paired tabs and asymmetric peach button carry the homepage's own motif.
    sphere(0.035, peach, buddy, 0.12, 1.0, 0.33);
    const head = new THREE.Group();
    head.position.y = 1.68;
    buddy.add(head);
    box(1.13, 0.86, 0.83, 0.3, white, head, 0, 0, 0);
    box(0.87, 0.57, 0.07, 0.2, dark, head, 0, -0.02, 0.415);
    const eyes = [-0.23, 0.23].map((x) =>
      box(0.065, 0.15, 0.024, 0.03, white, head, x, 0.04, 0.462),
    );
    [-0.32, 0.32].forEach((x) => {
      const cheek = sphere(0.045, peach, head, x, -0.12, 0.463);
      cheek.scale.set(1.3, 0.6, 0.22);
    });
    const smile = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, -0.13, 0.465),
      new THREE.Vector3(0, -0.17, 0.465),
      new THREE.Vector3(0.08, -0.13, 0.465),
    ]);
    add(new THREE.TubeGeometry(smile, 12, 0.013, 6, false), white, head);
    const tabA = box(0.105, 0.19, 0.07, 0.025, lilac, head, -0.07, 0.51, 0);
    tabA.rotation.z = 0.2;
    const tabB = box(0.11, 0.26, 0.07, 0.025, peach, head, 0.07, 0.54, 0);
    tabB.rotation.z = -0.2;
    const arm = (x) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, 1.17, 0);
      buddy.add(pivot);
      sphere(0.1, sole, pivot);
      box(0.2, 0.39, 0.23, 0.095, white, pivot, 0, -0.17, 0);
      sphere(0.12, white, pivot, 0, -0.37, 0.025);
      return pivot;
    };
    const arms = [arm(-0.51), arm(0.51)];
    const ball = sphere(0.22, peach, world, -1.45, 0.4, 0.55);
    const sparkles = new THREE.Group();
    world.add(sparkles);
    for (let i = 0; i < 7; i++) {
      const spark = add(
        new THREE.OctahedronGeometry(0.065),
        mat(i % 2 ? "#a5cdb8" : "#c6b3ee"),
        sparkles,
      );
      spark.userData.angle = (i / 7) * Math.PI * 2;
    }
    let target = 0,
      current = 0,
      playing = false,
      playStart = 0,
      frame = 0,
      last = 0;
    let visible = false,
      lost = false,
      paused = document.body.classList.contains("motion-paused");
    let manual = false,
      turn = 0,
      drag = null,
      hover = 0;
    const clamp = THREE.MathUtils.clamp;
    const range = (value, a, b) => clamp((value - a) / (b - a), 0, 1);
    const smooth = (x) => x * x * (3 - 2 * x);
    const labels = ["01 · Notice", "02 · Pick up", "03 · Carry", "04 · Place"];
    function reflect(value) {
      const percentage = Math.round(value * 100);
      if (progress.value !== String(percentage))
        progress.value = String(percentage);
      const label =
        labels[value < 0.15 ? 0 : value < 0.36 ? 1 : value < 0.82 ? 2 : 3];
      if (action.value !== label) action.value = label;
      const valueText = `${label.slice(5)}, ${percentage} percent`;
      if (progress.getAttribute("aria-valuetext") !== valueText)
        progress.setAttribute("aria-valuetext", valueText);
      const replayText = playing
        ? "Pause Ⅱ"
        : value > 0.02
          ? "Replay ↗"
          : "Play ↗";
      if (replay.textContent !== replayText) replay.textContent = replayText;
      replay.setAttribute(
        "aria-label",
        playing
          ? "Pause the practice run"
          : "Play the little robot’s practice run",
      );
    }
    function pose(value, time = 0) {
      const pickup = smooth(range(value, 0.12, 0.34));
      const travel = smooth(range(value, 0.36, 0.8));
      const place = smooth(range(value, 0.82, 0.98));
      const carry = pickup * (1 - place);
      const walking = value > 0.36 && value < 0.8;
      buddy.position.x = THREE.MathUtils.lerp(-1.45, 1.45, travel);
      buddy.position.y =
        0.08 + (walking ? Math.abs(Math.sin(value * 50)) * 0.045 : 0);
      buddy.rotation.y = Math.sin(travel * Math.PI) * 0.38;
      head.rotation.y = hover * 0.13 + Math.sin(value * Math.PI) * -0.2;
      head.rotation.z = -0.04 + Math.sin(value * Math.PI * 2) * 0.06;
      head.rotation.x = Math.sin(pickup * Math.PI) * 0.16;
      legs.forEach((leg, i) => {
        leg.rotation.x = walking
          ? Math.sin(value * 50 + i * Math.PI) * 0.36
          : 0;
      });
      arms.forEach((arm, i) => {
        arm.rotation.x = -carry * 1.15;
        arm.rotation.z = (i ? -1 : 1) * (-0.12 + carry * 0.8);
      });
      ball.position.set(
        buddy.position.x,
        THREE.MathUtils.lerp(0.4, 1.1, carry) + (walking ? 0.025 : 0),
        THREE.MathUtils.lerp(0.55, 0.23, carry),
      );
      ball.rotation.y = value * Math.PI * 4;
      world.rotation.y = turn;
      const blink = !paused && time % 5200 > 5000 ? 0.15 : 1;
      eyes.forEach((eye) => {
        eye.scale.y = blink;
      });
      const finish = range(value, 0.96, 1);
      sparkles.visible = finish > 0;
      sparkles.children.forEach((spark, i) => {
        const a = spark.userData.angle;
        spark.position.set(
          1.45 + Math.cos(a) * (0.35 + finish * 0.25),
          0.6 + Math.sin(a) * 0.35 + finish * 0.2,
          0.55 + Math.sin(a) * 0.1,
        );
        spark.scale.setScalar(finish * 0.8);
        spark.rotation.z = i + value * 5;
      });
      if (!lost) renderer.render(scene, camera);
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }
    function start() {
      if (!frame && visible && !document.hidden && !lost && !paused)
        frame = requestAnimationFrame(tick);
    }
    function tick(time) {
      frame = 0;
      if (!visible || document.hidden || lost || paused) return;
      frame = requestAnimationFrame(tick);
      if (time - last < 1000 / 30) return;
      const delta = last ? Math.min((time - last) / 1000, 0.08) : 0.03;
      last = time;
      if (playing) {
        target = clamp((time - playStart) / 6200, 0, 1);
        if (target === 1) playing = false;
      }
      current = THREE.MathUtils.damp(current, target, 9, delta);
      pose(current, time);
      reflect(target);
    }
    function setProgress(value, user = false) {
      target = clamp(value, 0, 1);
      if (user) {
        manual = true;
        playing = false;
      }
      // Direct controls remain usable when automatic motion is disabled.
      if (paused || !visible) {
        current = target;
        pose(current);
      }
      reflect(target);
      start();
    }
    function scrollProgress() {
      if (manual || paused || innerWidth <= 700 || !visible) return;
      const first = document
        .querySelector("#research-memory")
        .getBoundingClientRect();
      const second = document
        .querySelector("#research-actions")
        .getBoundingClientRect();
      const startAt = first.top + first.height * 0.35;
      const endAt = second.top + second.height * 0.6;
      setProgress((innerHeight * 0.5 - startAt) / Math.max(1, endAt - startAt));
    }
    function resize() {
      const { width, height } = stage.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      const halfWidth = 2.85;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = (halfWidth * height) / width;
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
      pose(current);
    }
    progress.addEventListener("input", () =>
      setProgress(Number(progress.value) / 100, true),
    );
    replay.addEventListener("click", () => {
      manual = true;
      if (paused) {
        setProgress(target < 1 ? 1 : 0, true);
        return;
      }
      playing = !playing;
      if (playing) {
        target = current = 0;
        playStart = performance.now();
      }
      reflect(target);
      start();
    });
    stage.addEventListener("pointerdown", (e) => {
      drag = { id: e.pointerId, x: e.clientX, turn };
    });
    stage.addEventListener("pointermove", (e) => {
      const rect = stage.getBoundingClientRect();
      hover = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      if (drag && e.pointerId === drag.id) {
        const distance = e.clientX - drag.x;
        if (Math.abs(distance) > 5 && !stage.hasPointerCapture(e.pointerId))
          stage.setPointerCapture(e.pointerId);
        turn = clamp(drag.turn + (distance / rect.width) * 2.8, -1.05, 1.05);
      }
      if (paused) pose(current);
    });
    const release = () => {
      drag = null;
    };
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    stage.addEventListener("lostpointercapture", release);
    stage.addEventListener("pointerleave", () => {
      hover = 0;
      if (!drag || !stage.hasPointerCapture(drag.id)) release();
    });
    // Native scroll is preserved. A manual replay holds its place until the next
    // wheel/touch navigation, so dragging the slider never fights scroll updates.
    addEventListener(
      "wheel",
      () => {
        if (!playing) manual = false;
      },
      { passive: true },
    );
    addEventListener(
      "touchmove",
      () => {
        if (!drag && !playing) manual = false;
      },
      { passive: true },
    );
    addEventListener("keydown", (e) => {
      if (
        ["PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp"].includes(
          e.key,
        ) &&
        e.target !== progress &&
        !playing
      )
        manual = false;
    });
    addEventListener("scroll", scrollProgress, { passive: true });
    new ResizeObserver(resize).observe(stage);
    new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) {
          scrollProgress();
          start();
        } else {
          stop();
          if (playing) {
            playing = false;
            reflect(target);
          }
        }
      },
      { rootMargin: "80px" },
    ).observe(stage);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stop();
        playing = false;
        reflect(target);
      } else start();
    });
    document.addEventListener("zhe-motion-change", (e) => {
      paused = e.detail.paused;
      if (paused) {
        playing = false;
        stop();
        current = target;
        pose(current);
        reflect(target);
      } else start();
    });
    renderer.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      lost = true;
      stop();
      stage.classList.remove("ready");
      document.querySelector(".research-interaction").hidden = true;
    });
    renderer.domElement.addEventListener("webglcontextrestored", () => {
      lost = false;
      resize();
      stage.classList.add("ready");
      document.querySelector(".research-interaction").hidden = false;
      start();
    });
    resize();
    stage.classList.add("ready");
    document.querySelector(".research-interaction").hidden = false;
  } catch (error) {
    stage.querySelector("canvas")?.remove();
    console.info("Using the static research buddy.", error.message);
  }
}
