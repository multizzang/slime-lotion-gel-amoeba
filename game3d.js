(() => {
  const container = document.getElementById('three-root');
  const appShell = document.getElementById('app-shell');
  const titleOverlay = document.getElementById('title-overlay');
  const clearOverlay = document.getElementById('clear-overlay');
  const endingOverlay = document.getElementById('ending-overlay');
  const popupTelop = document.getElementById('anime-popup-telop');
  const restoreHudBtn = document.getElementById('btn-restore-hud');

  const uiStage = document.getElementById('ui-stage');
  const uiDeaths = document.getElementById('ui-deaths');
  const uiViews = document.getElementById('ui-views');
  const uiGoalCount = document.getElementById('ui-goal-count');
  const clearTitle = document.getElementById('clear-title');
  const clearSub = document.getElementById('clear-sub');
  const clearStageDeaths = document.getElementById('clear-stage-deaths');
  const clearViews = document.getElementById('clear-views');
  const endDeaths = document.getElementById('end-deaths');
  const endViews = document.getElementById('end-views');

  const telopBar = document.getElementById('telop-bar');
  const speakerEmoji = document.getElementById('speaker-emoji');
  const speakerName = document.getElementById('speaker-name');
  const telopText = document.getElementById('telop-text');
  const telopEditor = document.getElementById('telop-editor');
  const stageButtonsWrap = document.getElementById('stage-buttons');
  const camStateEl = document.getElementById('cam-state');
  const markerStateEl = document.getElementById('marker-state');
  const modeStateEl = document.getElementById('mode-state');
  const touchStateEl = document.getElementById('touch-state');
  const touchControlsEl = document.getElementById('touch-controls');
  const touchModeBtn = document.getElementById('touch-mode');
  const joyLabel0 = document.getElementById('joy-label-0');
  const jumpBtn1 = document.getElementById('jump-1');
  const modeBtn1p = document.getElementById('mode-btn-1p');
  const modeBtn2p = document.getElementById('mode-btn-2p');
  const titleHintDesktop = document.getElementById('title-hint-desktop');
  const titleHintMobile = document.getElementById('title-hint-mobile');
  const bgmStateEl = document.getElementById('bgm-state');
  const sfxStateEl = document.getElementById('sfx-state');

  // =========================================================================
  // THREE.JS SCENE SETUP
  // =========================================================================
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb6e8ff);
  scene.fog = new THREE.Fog(0xc4f0ff, 68, 165);

  const camera = new THREE.PerspectiveCamera(52, 16 / 9, 0.1, 260);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  function handleResize() {
    const rect = container.getBoundingClientRect();
    const w = Math.max(320, rect.width);
    const h = Math.max(180, rect.height);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', handleResize);
  handleResize();

  // Bright anime daytime lighting
  const hemiLight = new THREE.HemisphereLight(0xe4f8ff, 0x0ca4d8, 0.85);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xfffef2, 0.92);
  dirLight.position.set(28, 48, 32);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 5;
  dirLight.shadow.camera.far = 160;
  const d = 62;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  // =========================================================================
  // PROCEDURAL ANIME TEXTURES
  // =========================================================================
  function createSlimeTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const g = c.getContext('2d');

    // Vibrant anime cyan/aqua base (#05b6eb)
    g.fillStyle = '#07b9eb';
    g.fillRect(0, 0, 512, 512);

    // Subtle deeper aqua horizontal bands
    for (let i = 0; i < 42; i++) {
      const y = (i / 42) * 512;
      g.fillStyle = i % 2 === 0 ? 'rgba(0, 145, 205, 0.25)' : 'rgba(110, 238, 255, 0.22)';
      g.fillRect(0, y, 512, 6 + Math.random() * 10);
    }

    // Bright liquid specular wave streaks (exact anime horizontal cyan sheen!)
    for (let i = 0; i < 95; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const rw = 40 + Math.random() * 130;
      const rh = 3 + Math.random() * 7;
      const grad = g.createLinearGradient(x, y, x + rw, y);
      grad.addColorStop(0, 'rgba(165, 248, 255, 0)');
      grad.addColorStop(0.5, 'rgba(185, 252, 255, 0.55)');
      grad.addColorStop(1, 'rgba(165, 248, 255, 0)');
      g.fillStyle = grad;
      g.beginPath();
      g.ellipse(x + rw / 2, y, rw / 2, rh, 0, 0, Math.PI * 2);
      g.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(22, 22);
    return tex;
  }

  function createGrasshopperTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d');

    // Exact lime-yellow-green base from anime close-up (step_92_shot_4.png)
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#c8df34');
    grad.addColorStop(0.65, '#b6cf29');
    grad.addColorStop(1, '#98b41f');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);

    // Subtle organic insect ridge lines
    g.strokeStyle = 'rgba(72, 95, 16, 0.28)';
    g.lineWidth = 2;
    for (let x = 16; x < 256; x += 22) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x + 8, 256);
      g.stroke();
    }

    // Irregular dark-brown / black mottled camouflage spots!
    const spots = [
      [34, 48, 18, 11], [72, 34, 14, 9], [110, 62, 22, 13], [156, 44, 16, 10],
      [198, 56, 20, 11], [228, 38, 13, 8], [52, 98, 16, 9], [95, 118, 19, 12],
      [142, 92, 15, 10], [186, 112, 14, 8], [220, 96, 18, 11], [44, 158, 12, 7],
      [124, 156, 16, 9], [174, 162, 13, 8], [68, 192, 11, 6], [202, 185, 15, 9],
      [88, 66, 9, 6], [164, 72, 10, 6], [30, 124, 10, 6], [240, 132, 12, 7],
    ];
    for (const [sx, sy, rx, ry] of spots) {
      g.fillStyle = Math.random() > 0.35 ? '#462c13' : '#261709';
      g.beginPath();
      g.ellipse(sx, sy, rx, ry, (Math.random() - 0.5) * 0.7, 0, Math.PI * 2);
      g.fill();
    }
    for (let i = 0; i < 45; i++) {
      g.fillStyle = i % 2 === 0 ? '#3a230e' : '#5e4219';
      g.beginPath();
      g.arc(Math.random() * 256, Math.random() * 210, 2 + Math.random() * 4.5, 0, Math.PI * 2);
      g.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    return tex;
  }

  function createRedMushroomCapTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#e52727';
    g.fillRect(0, 0, 256, 256);

    // Soft bright-red highlight & white polka dots
    g.fillStyle = 'rgba(255, 120, 120, 0.25)';
    g.beginPath();
    g.arc(128, 70, 90, 0, Math.PI * 2);
    g.fill();

    g.fillStyle = '#fff9df';
    const dots = [
      [42, 70, 16], [118, 46, 18], [198, 78, 17], [78, 132, 19],
      [158, 128, 15], [224, 152, 16], [34, 176, 15], [116, 196, 17], [186, 206, 14],
    ];
    for (const [dx, dy, r] of dots) {
      g.beginPath();
      g.arc(dx, dy, r, 0, Math.PI * 2);
      g.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function createGoalBannerTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 160;
    const g = c.getContext('2d');

    const grad = g.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#ffdf38');
    grad.addColorStop(0.5, '#fff6a6');
    grad.addColorStop(1, '#ffdf38');
    g.fillStyle = grad;
    g.fillRect(8, 8, 496, 144);
    g.strokeStyle = '#ff3b5c';
    g.lineWidth = 12;
    g.strokeRect(8, 8, 496, 144);

    g.font = '900 84px "Malgun Gothic", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.strokeStyle = '#202020';
    g.lineWidth = 10;
    g.strokeText('GOAL', 256, 84);
    g.fillStyle = '#ff2244';
    g.fillText('GOAL', 256, 84);
    return new THREE.CanvasTexture(c);
  }

  function createMarkerSprite(text, bgColor) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 96;
    const g = c.getContext('2d');
    g.fillStyle = bgColor;
    g.beginPath();
    g.roundRect(12, 14, 232, 68, 22);
    g.fill();
    g.strokeStyle = '#fff';
    g.lineWidth = 6;
    g.stroke();
    g.font = '900 42px "Malgun Gothic", sans-serif';
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, 128, 50);

    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const spr = new THREE.Sprite(mat);
    spr.scale.set(2.3, 0.85, 1);
    spr.position.set(0, 2.2, 0);
    return spr;
  }

  // Shared materials & geometries
  const slimeTexture = createSlimeTexture();
  const hopperTexture = createGrasshopperTexture();
  const mushCapTexture = createRedMushroomCapTexture();
  const goalBannerTex = createGoalBannerTexture();

  const matTrunk = new THREE.MeshLambertMaterial({ color: 0x7b4a1f, flatShading: true });
  const matFrond = new THREE.MeshLambertMaterial({ color: 0x22cc3a, flatShading: true });
  const matSpike = new THREE.MeshLambertMaterial({ color: 0xf4f7fa, flatShading: true });
  const matMushStem = new THREE.MeshLambertMaterial({ color: 0xf1e48d, flatShading: true });
  const matMushUnder = new THREE.MeshLambertMaterial({ color: 0xede085, flatShading: true, side: THREE.DoubleSide });
  const matMushCap = new THREE.MeshLambertMaterial({ map: mushCapTexture, flatShading: true });
  const matGrass = new THREE.MeshLambertMaterial({ color: 0x22c936, flatShading: true, side: THREE.DoubleSide });
  const matHill1 = new THREE.MeshLambertMaterial({ color: 0x25ba34, flatShading: true });
  const matHill2 = new THREE.MeshLambertMaterial({ color: 0x1ea32c, flatShading: true });
  const matCloud = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
  const matHopperBody = new THREE.MeshLambertMaterial({ map: hopperTexture, flatShading: true });
  const matHopperLeg = new THREE.MeshLambertMaterial({ color: 0xb7d429, flatShading: true });
  const matEye = new THREE.MeshPhongMaterial({ color: 0x101010, shininess: 120 });
  const matBloodMats = [
    new THREE.MeshLambertMaterial({ color: 0xee0909 }),
    new THREE.MeshLambertMaterial({ color: 0xff2222 }),
    new THREE.MeshLambertMaterial({ color: 0xb80000 }),
  ];
  const matBloodPuddle = new THREE.MeshBasicMaterial({ color: 0xdc0808, transparent: true, opacity: 0.92, side: THREE.DoubleSide });
  const matGoldCoin = new THREE.MeshPhongMaterial({ color: 0xffd700, emissive: 0x664400, shininess: 140, specular: 0xfff8b0 });
  const matGoldRim = new THREE.MeshPhongMaterial({ color: 0xffae00, emissive: 0x442200, shininess: 100 });
  const matCoinBeam = new THREE.MeshBasicMaterial({ color: 0xffe45e, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false });
  const matSparkGold = new THREE.MeshBasicMaterial({ color: 0xffe84a });
  const matSafePad = new THREE.MeshLambertMaterial({ color: 0x35d448, flatShading: true });
  const matSafePadRim = new THREE.MeshLambertMaterial({ color: 0x1e8f2c, flatShading: true });
  const matWallBand = new THREE.MeshLambertMaterial({ color: 0xa66a32, flatShading: true });

  const geoBloodCube = new THREE.BoxGeometry(0.19, 0.19, 0.19);
  const geoBloodDrop = new THREE.SphereGeometry(0.11, 5, 5);
  const geoSpike = new THREE.ConeGeometry(0.18, 0.78, 5);
  const geoSmallSpike = new THREE.ConeGeometry(0.13, 0.56, 5);

  // =========================================================================
  // PERMANENT ENVIRONMENT (Cyan Slime Plain, Rolling Green Hills, Clouds)
  // =========================================================================
  const floorGeo = new THREE.PlaneGeometry(280, 280);
  const floorMat = new THREE.MeshPhongMaterial({
    map: slimeTexture,
    shininess: 95,
    specular: 0xc5f8ff,
  });
  const slimeFloor = new THREE.Mesh(floorGeo, floorMat);
  slimeFloor.rotation.x = -Math.PI / 2;
  slimeFloor.receiveShadow = true;
  scene.add(slimeFloor);

  // Distant lush green rounded dome hills ringing the cyan slime horizon!
  const hillsGroup = new THREE.Group();
  const hillCount = 30;
  for (let i = 0; i < hillCount; i++) {
    const ang = (i / hillCount) * Math.PI * 2;
    const dist = 88 + (i % 3) * 9;
    const rad = 16 + (i % 4) * 5;
    const hGeo = new THREE.SphereGeometry(rad, 12, 8);
    const hill = new THREE.Mesh(hGeo, i % 2 === 0 ? matHill1 : matHill2);
    hill.scale.set(1.45, 0.62 + (i % 3) * 0.14, 1.25);
    hill.position.set(Math.cos(ang) * dist, -2.5, Math.sin(ang) * dist - 22);
    hillsGroup.add(hill);
  }
  scene.add(hillsGroup);

  // Puffy white clouds drifting in the light-blue sky
  const clouds = [];
  for (let i = 0; i < 16; i++) {
    const cg = new THREE.Group();
    const puffs = 3 + (i % 3);
    for (let p = 0; p < puffs; p++) {
      const s = 2.6 + Math.random() * 2.4;
      const m = new THREE.Mesh(new THREE.SphereGeometry(s, 8, 6), matCloud);
      m.position.set((p - puffs / 2) * 2.8, Math.random() * 1.2, (Math.random() - 0.5) * 2.2);
      m.scale.set(1.3, 0.72, 1);
      cg.add(m);
    }
    const ang = (i / 16) * Math.PI * 2;
    cg.position.set(Math.cos(ang) * (50 + Math.random() * 45), 22 + Math.random() * 12, Math.sin(ang) * (50 + Math.random() * 45) - 20);
    scene.add(cg);
    clouds.push({ mesh: cg, speed: 0.4 + Math.random() * 0.6 });
  }

  // =========================================================================
  // ANIME 3D PROP BUILDERS (Spiked Palm Tree, Giant Mushroom, Grasshopper)
  // =========================================================================

  function buildPalmTree(cfg) {
    const group = new THREE.Group();
    const s = cfg.scale || 1;
    group.position.set(cfg.x, 0, cfg.z);
    group.rotation.y = cfg.rotY || 0;

    // 1. Thick faceted brown octagonal/hexagonal tapered trunk (height 7.2*s for crisp wall-jump reach!)
    const trunkH = 7.2 * s;
    const trunkTopR = 0.64 * s;
    const trunkBotR = 1.12 * s;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(trunkTopR, trunkBotR, trunkH, 6),
      matTrunk
    );
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // Subtle lighter wood grip band on the safe middle trunk so players instantly spot the Wall-Jump zone!
    const wallBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.84 * s, 0.94 * s, 1.9 * s, 6),
      matWallBand
    );
    wallBand.position.y = 3.55 * s;
    group.add(wallBand);

    // 2. White conical spikes sticking out all around the LOWER trunk (y = 0.45..1.95 -> easy to jump over!)
    const spikeRings = [0.48, 1.05, 1.62];
    spikeRings.forEach((ry, ringIdx) => {
      const count = 6;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + ringIdx * 0.52;
        const t = ry / 7.2;
        const rAtY = (trunkBotR * (1 - t) + trunkTopR * t) * 0.94;
        const sp = new THREE.Mesh(geoSpike, matSpike);
        sp.scale.setScalar(s * (0.88 + (i % 2) * 0.18));
        sp.position.set(Math.cos(a) * (rAtY + 0.22 * s), ry * s, Math.sin(a) * (rAtY + 0.22 * s));
        sp.rotation.z = -Math.PI / 2;
        sp.rotation.y = -a;
        sp.castShadow = true;
        group.add(sp);
      }
    });

    // 3. 5 Chunky bright-green segmented palm fronds with WHITE SPIKES underneath!
    const frondCount = 5;
    for (let f = 0; f < frondCount; f++) {
      const fAng = (f / frondCount) * Math.PI * 2;
      const frondPivot = new THREE.Group();
      frondPivot.position.y = trunkH - 0.1 * s;
      frondPivot.rotation.y = fAng;

      // 3 angled blocky palm segments radiating outward (sleeker ~3.15 radius so twin palms don't clash!)
      const segs = [
        { len: 1.25, w: 0.68, y: 0.16, x: 0.95, pitch: 0.12 },
        { len: 1.2, w: 0.56, y: 0.2, x: 2.0, pitch: -0.1 },
        { len: 1.05, w: 0.4, y: -0.06, x: 2.9, pitch: -0.32 },
      ];
      segs.forEach((seg, si) => {
        const leaf = new THREE.Mesh(
          new THREE.BoxGeometry(seg.len * s, 0.2 * s, seg.w * s),
          matFrond
        );
        leaf.position.set(seg.x * s, seg.y * s, 0);
        leaf.rotation.z = seg.pitch;
        leaf.castShadow = true;
        frondPivot.add(leaf);

        // Downward/outward white spikes lining the palm fronds
        [-0.28, 0.28].forEach((offsetX) => {
          const fsp = new THREE.Mesh(geoSmallSpike, matSpike);
          fsp.scale.setScalar(s * 0.9);
          fsp.position.set((seg.x + offsetX) * s, (seg.y - 0.3) * s, (si % 2 === 0 ? 0.14 : -0.14) * s);
          fsp.rotation.z = Math.PI + seg.pitch;
          frondPivot.add(fsp);
        });
      });

      group.add(frondPivot);
    }

    return {
      mesh: group,
      x: cfg.x,
      z: cfg.z,
      scale: s,
      hasCoin: !!cfg.hasCoin,
      trunkSpikeR: 1.15 * s,
      trunkSpikeYMax: 1.85 * s,
      trunkSolidR: 0.96 * s,
      trunkH,
      frondR: 3.15 * s,
      frondYMin: 5.95 * s,
      frondYMax: 6.85 * s,
    };
  }

  function buildGiantMushroom(cfg) {
    const group = new THREE.Group();
    const s = cfg.scale || 1;
    group.position.set(cfg.x, 0, cfg.z);

    // 1. Stepping-friendly pale cream stem (height 2.75*s so single jump cleanly lands on the bouncy red top!)
    const stemH = 2.75 * s;
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46 * s, 0.68 * s, stemH, 8),
      matMushStem
    );
    stem.position.y = stemH / 2;
    stem.castShadow = true;
    stem.receiveShadow = true;
    group.add(stem);

    // Spikes around the very base of the stem
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const sp = new THREE.Mesh(geoSmallSpike, matSpike);
      sp.scale.setScalar(s * 0.85);
      sp.position.set(Math.cos(a) * 0.72 * s, 0.55 * s, Math.sin(a) * 0.72 * s);
      sp.rotation.z = -Math.PI / 2;
      sp.rotation.y = -a;
      group.add(sp);
    }

    // 2. Giant slightly tilted red-top / pale-cream-underside cap
    const capGroup = new THREE.Group();
    capGroup.position.y = stemH - 0.08 * s;
    capGroup.rotation.x = cfg.tiltX || 0.06;
    capGroup.rotation.z = cfg.tiltZ || -0.06;

    const capR = 3.05 * s;
    const capDome = new THREE.Mesh(
      new THREE.SphereGeometry(capR, 14, 9, 0, Math.PI * 2, 0, Math.PI * 0.46),
      matMushCap
    );
    capDome.scale.set(1, 0.52, 1);
    capDome.castShadow = true;
    capGroup.add(capDome);

    const capUnder = new THREE.Mesh(new THREE.CircleGeometry(capR * 0.99, 14), matMushUnder);
    capUnder.rotation.x = Math.PI / 2;
    capUnder.position.y = 0.08 * s;
    capGroup.add(capUnder);

    // White conical spikes all around the yellow cap underside
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const rr = (i % 2 === 0 ? 2.5 : 1.7) * s;
      const csp = new THREE.Mesh(geoSmallSpike, matSpike);
      csp.scale.setScalar(s * 0.82);
      csp.position.set(Math.cos(a) * rr, -0.18 * s, Math.sin(a) * rr);
      csp.rotation.x = Math.PI;
      capGroup.add(csp);
    }

    group.add(capGroup);

    return {
      mesh: group,
      capGroup,
      x: cfg.x,
      z: cfg.z,
      scale: s,
      stemSpikeR: 0.88 * s,
      stemSpikeYMax: 1.05 * s,
      stemSolidR: 0.62 * s,
      capR: capR * 0.95,
      capYMin: 1.95 * s,
      capYMid: 2.85 * s,
      capYTop: 3.72 * s,
    };
  }

  // Dry, grippy green mossy safe island floating slightly above the cyan slime!
  function buildSafePad(cfg) {
    const g = new THREE.Group();
    g.position.set(cfg.x, 0, cfg.z);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(cfg.r, cfg.r * 1.08, 0.24, 14), matSafePadRim);
    rim.position.y = 0.12;
    rim.receiveShadow = true;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(cfg.r * 0.94, cfg.r * 0.98, 0.12, 14), matSafePad);
    top.position.y = 0.26;
    top.receiveShadow = true;
    g.add(rim, top);
    return { mesh: g, x: cfg.x, z: cfg.z, r: cfg.r, topY: 0.32 };
  }

  function buildGrassTuft(x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const blades = 7;
    for (let i = 0; i < blades; i++) {
      const h = 0.65 + Math.random() * 0.65;
      const b = new THREE.Mesh(new THREE.ConeGeometry(0.1, h, 3), matGrass);
      const a = (i / blades) * Math.PI * 2;
      b.position.set(Math.cos(a) * 0.25, h * 0.45, Math.sin(a) * 0.25);
      b.rotation.z = (Math.random() - 0.5) * 0.35;
      b.rotation.x = (Math.random() - 0.5) * 0.35;
      g.add(b);
    }
    return g;
  }

  function buildPalmCoin(x, y, z) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Spinning golden coin disc
    const coinPivot = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.28, 22), matGoldCoin);
    disc.rotation.x = Math.PI / 2;
    disc.castShadow = true;
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.34, 16), matGoldRim);
    inner.rotation.x = Math.PI / 2;
    const emblem = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.78, 0.4), matGoldCoin);
    coinPivot.add(disc, inner, emblem);
    group.add(coinPivot);

    // Tall translucent golden beacon pillar so players can spot treetop coins from anywhere!
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.95, 22, 12, 1, true), matCoinBeam);
    beam.position.y = 9.5;
    group.add(beam);

    return {
      group,
      coinPivot,
      beam,
      x,
      baseY: y,
      z,
      collected: false,
    };
  }

  // Exact Realistic Low-Poly 3D Grasshopper matching step_92_shot_4.png!
  // Local orientation: Head faces -Z, tapered abdomen/wings extend to +Z.
  function buildRealisticGrasshopper(playerIdx) {
    const root = new THREE.Group();
    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    // 1. Elongated slightly upward-tilted body + wings (exact silhouette of step_92_shot_4.png!)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.58, 2.35), matHopperBody);
    torso.position.set(0, 0.74, 0.22);
    torso.rotation.x = 0.16; // tail angled slightly upward!
    torso.castShadow = true;
    bodyPivot.add(torso);

    // Tapered abdomen tail tip
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.15, 5), matHopperBody);
    tail.position.set(0, 1.0, 1.72);
    tail.rotation.x = Math.PI / 2 + 0.2;
    tail.castShadow = true;
    bodyPivot.add(tail);

    // Thorax pronotum shield (bulky neck/back collar)
    const pronotum = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.66, 0.82), matHopperBody);
    pronotum.position.set(0, 0.68, -0.68);
    pronotum.rotation.x = 0.06;
    pronotum.castShadow = true;
    bodyPivot.add(pronotum);

    // Angular realistic grasshopper head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.72, 0.66), matHopperBody);
    head.position.set(0, 0.66, -1.28);
    head.rotation.x = -0.18;
    head.castShadow = true;
    bodyPivot.add(head);

    // Glossy round black compound eyes
    [-0.31, 0.31].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), matEye);
      eye.position.set(ex, 0.82, -1.36);
      bodyPivot.add(eye);
    });

    // Thin antennae
    [-0.16, 0.16].forEach((ax) => {
      const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.75, 4), matEye);
      ant.position.set(ax * 1.4, 1.18, -1.65);
      ant.rotation.x = -0.75;
      ant.rotation.z = ax * -0.9;
      bodyPivot.add(ant);
    });

    // 2. Front & Middle slender jointed legs
    const frontLegs = [];
    const legSpecs = [
      { z: -0.82, outX: 0.48, forward: -0.32 }, // Front pair
      { z: -0.18, outX: 0.56, forward: 0.05 },  // Middle pair
    ];
    legSpecs.forEach((ls) => {
      [-1, 1].forEach((side) => {
        const lg = new THREE.Group();
        lg.position.set(side * 0.3, 0.52, ls.z);
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.62, 5), matHopperLeg);
        upper.position.set(side * 0.22, -0.18, ls.forward * 0.4);
        upper.rotation.z = side * 0.65;
        upper.castShadow = true;
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 0.68, 5), matHopperLeg);
        lower.position.set(side * 0.42, -0.35, ls.forward);
        lower.rotation.z = side * -0.15;
        lower.castShadow = true;
        lg.add(upper, lower);
        bodyPivot.add(lg);
        frontLegs.push(lg);
      });
    });

    // 3. Signature Huge High-Arched Hind Jumping Legs (exact bent V silhouette!)
    const hindLegs = [];
    [-1, 1].forEach((side) => {
      const hg = new THREE.Group();
      hg.position.set(side * 0.35, 0.62, 0.25);

      // Femur rising high above the body toward the rear
      const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.095, 1.35, 5), matHopperLeg);
      femur.position.set(side * 0.16, 0.34, 0.42);
      femur.rotation.x = 0.85;
      femur.rotation.z = side * -0.15;
      femur.castShadow = true;

      // Long slender tibia reaching down to the slime floor
      const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.032, 1.5, 5), matHopperLeg);
      tibia.position.set(side * 0.24, 0.04, 1.15);
      tibia.rotation.x = -0.34;
      tibia.castShadow = true;

      hg.add(femur, tibia);
      bodyPivot.add(hg);
      hindLegs.push(hg);
    });

    // Optional cheat 1P/2P badge (hidden by default!)
    const marker = createMarkerSprite(
      playerIdx === 0 ? '1P WASD' : '2P ←↑→',
      playerIdx === 0 ? 'rgba(255, 82, 168, 0.92)' : 'rgba(42, 168, 255, 0.92)'
    );
    marker.visible = false;
    root.add(marker);

    return { root, bodyPivot, frontLegs, hindLegs, marker };
  }

  // =========================================================================
  // GAME STATE & LEVEL MANAGEMENT
  // =========================================================================
  let gameState = 'title'; // 'title' | 'playing' | 'stageClear' | 'ending'
  let playerCount = 1; // 1 = 1인용 (모바일/솔로 편함), 2 = 2인용 (원작 2마리 혼돈)
  let currentStageIdx = 0;
  let clearedStages = new Set();
  let totalDeaths = 0;
  let stageDeaths = 0;
  let views = 15;
  let globalTime = 0;
  let bothDeadTimer = 0;
  let showMarkers = false;
  let pureAnimeMode = false;
  let popupTimeout = null;

  // Camera modes: 0 = Anime Low-Angle, 1 = 3rd-Person Follow, 2 = Free Orbit
  const CAM_MODES = ['애니 로우앵글', '3인칭 추적', '자유 회전'];
  let camMode = 0;
  let camYawOffset = 0;
  let camPitchOffset = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let deathZoomTarget = null;
  let deathZoomTimer = 0;

  let stageGroup = new THREE.Group();
  scene.add(stageGroup);

  let stageData = null;
  let palms = [];
  let mushrooms = [];
  let safePads = [];
  let coins = [];
  let grasshoppers = [];
  let bloodParticles = [];
  let bloodPuddles = [];
  let waterSplashes = [];
  let wallJumpCount = 0;

  const keys = {};
  const prevJump = [false, false];

  // Multi-touch dual virtual gamepad state (for smartphones & tablets!)
  const touchInput = [
    { x: 0, z: 0, jump: false, joyPointerId: null, jumpPointerIds: new Set() },
    { x: 0, z: 0, jump: false, joyPointerId: null, jumpPointerIds: new Set() },
  ];
  let touchPadMode = 'auto'; // 'auto' | 'on' | 'off'
  let isTouchDevice = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  function syncTouchControlsVisibility() {
    if (!touchControlsEl) return;
    touchControlsEl.classList.toggle('mode-1p', playerCount === 1);
    if (joyLabel0) joyLabel0.textContent = playerCount === 1 ? '이동' : '1P';
    if (jumpBtn1) jumpBtn1.innerHTML = playerCount === 1 ? '점프!' : '2P<br />점프';
    if (touchModeBtn) touchModeBtn.textContent = playerCount === 1 ? '🦗 1인용' : '🦗🦗 2인용';
    const shouldShow =
      gameState === 'playing' &&
      (touchPadMode === 'on' || (touchPadMode === 'auto' && isTouchDevice));
    touchControlsEl.classList.toggle('hidden', !shouldShow);
  }

  function setPlayerMode(count) {
    playerCount = count === 2 ? 2 : 1;
    if (modeBtn1p) modeBtn1p.classList.toggle('active', playerCount === 1);
    if (modeBtn2p) modeBtn2p.classList.toggle('active', playerCount === 2);
    if (modeStateEl) modeStateEl.textContent = playerCount === 1 ? '1인용' : '2인용(원작)';
    if (titleHintDesktop) {
      titleHintDesktop.innerHTML = playerCount === 1
        ? '<strong>1인용:</strong> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 또는 <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> 이동 + <kbd>Space</kbd> 점프'
        : '<strong>1P:</strong> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>+<kbd>Space</kbd> · <strong>2P:</strong> <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd>+<kbd>Enter</kbd>';
    }
    if (titleHintMobile) {
      titleHintMobile.innerHTML = playerCount === 1
        ? '📱 <strong>1인용 모드:</strong> 왼손 조이스틱 이동 + 오른손 점프 버튼!'
        : '📱 <strong>2인용 원작 모드:</strong> 양손 듀얼 조이스틱 &amp; 점프 버튼으로 2마리 동시 조작!';
    }
    syncTouchControlsVisibility();
    loadStage(currentStageIdx, gameState === 'playing');
  }

  function setupTouchGamepad() {
    [0, 1].forEach((idx) => {
      const base = document.getElementById(`joy-${idx}`);
      const knob = document.getElementById(`knob-${idx}`);
      const jumpBtn = document.getElementById(`jump-${idx}`);
      if (!base || !knob || !jumpBtn) return;

      const updateStick = (clientX, clientY) => {
        const rect = base.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const maxR = rect.width * 0.36;
        let dx = clientX - cx;
        let dy = clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > maxR) {
          dx = (dx / dist) * maxR;
          dy = (dy / dist) * maxR;
        }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        // Deadzone 12%
        const nx = dx / maxR;
        const ny = dy / maxR;
        touchInput[idx].x = Math.abs(nx) < 0.12 ? 0 : nx;
        touchInput[idx].z = Math.abs(ny) < 0.12 ? 0 : ny;
      };

      const resetStick = () => {
        touchInput[idx].joyPointerId = null;
        touchInput[idx].x = 0;
        touchInput[idx].z = 0;
        knob.style.transform = 'translate(0px, 0px)';
      };

      base.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (touchInput[idx].joyPointerId !== null) return;
        touchInput[idx].joyPointerId = e.pointerId;
        if (base.setPointerCapture) {
          try { base.setPointerCapture(e.pointerId); } catch (_) {}
        }
        updateStick(e.clientX, e.clientY);
      });

      base.addEventListener('pointermove', (e) => {
        if (e.pointerId !== touchInput[idx].joyPointerId) return;
        e.preventDefault();
        e.stopPropagation();
        updateStick(e.clientX, e.clientY);
      });

      const endStick = (e) => {
        if (e.pointerId !== touchInput[idx].joyPointerId) return;
        e.preventDefault();
        resetStick();
      };
      base.addEventListener('pointerup', endStick);
      base.addEventListener('pointercancel', endStick);
      base.addEventListener('lostpointercapture', () => {
        if (touchInput[idx].joyPointerId !== null) resetStick();
      });

      // Jump button (supports short-tap & long-hold variable jump height!)
      jumpBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.kusogeAudio.ensureContext();
        touchInput[idx].jumpPointerIds.add(e.pointerId);
        touchInput[idx].jump = true;
        jumpBtn.classList.add('active');
        if (jumpBtn.setPointerCapture) {
          try { jumpBtn.setPointerCapture(e.pointerId); } catch (_) {}
        }
      });

      const endJump = (e) => {
        if (!touchInput[idx].jumpPointerIds.has(e.pointerId)) return;
        e.preventDefault();
        touchInput[idx].jumpPointerIds.delete(e.pointerId);
        if (touchInput[idx].jumpPointerIds.size === 0) {
          touchInput[idx].jump = false;
          jumpBtn.classList.remove('active');
        }
      };
      jumpBtn.addEventListener('pointerup', endJump);
      jumpBtn.addEventListener('pointercancel', endJump);
    });

    // Quick touch mini-buttons inside viewport
    const tRetry = document.getElementById('touch-retry');
    const tCam = document.getElementById('touch-cam');
    const tMarkers = document.getElementById('touch-markers');
    if (tRetry) {
      tRetry.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (gameState === 'playing') loadStage(currentStageIdx, false);
      });
    }
    if (touchModeBtn) {
      touchModeBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        setPlayerMode(playerCount === 1 ? 2 : 1);
      });
    }
    if (tCam) {
      tCam.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        cycleCamera();
      });
    }
    if (tMarkers) {
      tMarkers.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        toggleMarkers();
      });
    }

    // Auto-detect touch on first touchstart for hybrid laptops/tablets
    window.addEventListener('touchstart', () => {
      if (!isTouchDevice) {
        isTouchDevice = true;
        syncTouchControlsVisibility();
      }
    }, { passive: true, once: true });
  }

  function formatViews(v) {
    if (v >= 1000000) return `${(v / 1000000).toFixed(2)}백만회`;
    if (v >= 10000) return `${(v / 10000).toFixed(1)}만회`;
    return `${Math.floor(v).toLocaleString()}회`;
  }

  function setTelop(entry, showBigPopup = true) {
    if (!entry) return;
    telopBar.className = `telop-bar hud-element speaker-${entry.speaker || 'kanshi'}`;
    speakerEmoji.textContent = entry.emoji || '👺';
    speakerName.textContent = entry.name || '칸시';
    telopText.textContent = entry.text;
    telopEditor.textContent = entry.editor || '';

    if (showBigPopup && entry.popup && !pureAnimeMode) {
      popupTelop.textContent = entry.popup;
      popupTelop.classList.remove('hidden');
      // Retrigger pop animation
      popupTelop.style.animation = 'none';
      void popupTelop.offsetWidth;
      popupTelop.style.animation = '';
      clearTimeout(popupTimeout);
      popupTimeout = setTimeout(() => {
        popupTelop.classList.add('hidden');
      }, 2200);
    }
  }

  function triggerCommentary(cat, showPopup = true) {
    const list = window.ANIME_COMMENTARY[cat];
    if (!list || !list.length) return;
    setTelop(list[Math.floor(Math.random() * list.length)], showPopup);
  }

  function updateHud() {
    uiStage.textContent = `${currentStageIdx + 1} / ${window.STAGES_3D.length}`;
    uiDeaths.textContent = `${totalDeaths}`;
    uiViews.textContent = formatViews(views);
    const collected = coins.filter((c) => c.collected).length;
    uiGoalCount.textContent = `${collected} / ${coins.length}`;
  }

  function buildStageButtons() {
    stageButtonsWrap.innerHTML = '';
    window.STAGES_3D.forEach((st, idx) => {
      const btn = document.createElement('button');
      btn.className = 'stage-btn';
      if (idx === currentStageIdx) btn.classList.add('active');
      if (clearedStages.has(idx)) btn.classList.add('cleared');
      btn.textContent = `ST.${st.id}`;
      btn.addEventListener('click', () => {
        window.kusogeAudio.ensureContext();
        if (gameState === 'title') {
          titleOverlay.classList.add('hidden');
          window.kusogeAudio.startBgm();
        }
        clearOverlay.classList.add('hidden');
        endingOverlay.classList.add('hidden');
        stageDeaths = 0;
        loadStage(idx, true);
      });
      stageButtonsWrap.appendChild(btn);
    });
  }

  function clearGroup(grp) {
    while (grp.children.length > 0) {
      grp.remove(grp.children[0]);
    }
  }

  function spawnBloodBurst(pos, count = 18, speedScale = 1) {
    for (let i = 0; i < count; i++) {
      if (bloodParticles.length > 520) {
        const old = bloodParticles.shift();
        stageGroup.remove(old.mesh);
      }
      const mesh = new THREE.Mesh(
        Math.random() > 0.35 ? geoBloodCube : geoBloodDrop,
        matBloodMats[Math.floor(Math.random() * matBloodMats.length)]
      );
      const sc = 0.65 + Math.random() * 1.15;
      mesh.scale.setScalar(sc);
      mesh.position.set(
        pos.x + (Math.random() - 0.5) * 0.45,
        pos.y + (Math.random() - 0.5) * 0.45,
        pos.z + (Math.random() - 0.5) * 0.45
      );
      stageGroup.add(mesh);
      bloodParticles.push({
        mesh,
        vx: (Math.random() - 0.5) * 5.2 * speedScale,
        vy: (1.2 + Math.random() * 4.5) * speedScale,
        vz: (Math.random() - 0.5) * 5.2 * speedScale,
        rotSpd: (Math.random() - 0.5) * 12,
        life: 1.6 + Math.random() * 1.4,
      });
    }
  }

  function createBloodPuddle(x, z) {
    const geo = new THREE.CircleGeometry(1.0, 14);
    // Ruffle edges slightly for jagged anime blood splatter puddle
    const pos = geo.attributes.position;
    for (let i = 1; i < pos.count; i++) {
      const jitter = 0.72 + Math.random() * 0.55;
      pos.setX(i, pos.getX(i) * jitter);
      pos.setY(i, pos.getY(i) * jitter);
    }
    const mesh = new THREE.Mesh(geo, matBloodPuddle);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.04 + bloodPuddles.length * 0.002, z);
    mesh.scale.setScalar(0.2);
    stageGroup.add(mesh);
    const puddle = { mesh, targetScale: 1.5 + Math.random() * 1.1, curScale: 0.2 };
    bloodPuddles.push(puddle);
    return puddle;
  }

  function spawnSlimeSplash(x, z) {
    if (waterSplashes.length > 90) return;
    const m = new THREE.Mesh(
      geoBloodDrop,
      new THREE.MeshBasicMaterial({ color: 0x9cf7ff, transparent: true, opacity: 0.8 })
    );
    m.position.set(x + (Math.random() - 0.5) * 0.5, 0.12, z + (Math.random() - 0.5) * 0.5);
    stageGroup.add(m);
    waterSplashes.push({
      mesh: m,
      vx: (Math.random() - 0.5) * 2.4,
      vy: 1.5 + Math.random() * 2.2,
      vz: (Math.random() - 0.5) * 2.4,
      life: 0.45,
    });
  }

  function spawnSparkBurst(pos, count = 16, mat = matSparkGold) {
    for (let i = 0; i < count; i++) {
      if (waterSplashes.length > 130) {
        const old = waterSplashes.shift();
        stageGroup.remove(old.mesh);
      }
      const m = new THREE.Mesh(geoBloodCube, mat);
      m.scale.setScalar(0.7 + Math.random() * 0.8);
      m.position.copy(pos);
      stageGroup.add(m);
      const ang = Math.random() * Math.PI * 2;
      const spd = 2.5 + Math.random() * 5.8;
      waterSplashes.push({
        mesh: m,
        vx: Math.cos(ang) * spd,
        vy: 2.2 + Math.random() * 5.2,
        vz: Math.sin(ang) * spd,
        life: 0.65 + Math.random() * 0.35,
      });
    }
  }

  function createGrasshopperEntity(idx, spawn) {
    const built = buildRealisticGrasshopper(idx);
    built.root.position.set(spawn.x, 0, spawn.z);
    built.marker.visible = showMarkers;
    stageGroup.add(built.root);
    return {
      id: idx,
      ...built,
      pos: new THREE.Vector3(spawn.x, 0, spawn.z),
      vx: 0,
      vy: 0,
      vz: 0,
      yaw: 0, // 0 faces -Z into the palm forest
      grounded: true,
      onGrippySurface: false,
      coyote: 0,
      jumpBuf: 0,
      wallCoyote: 0,
      wallNx: 0,
      wallNz: 0,
      wallPalm: null,
      wallJumpGrace: 0,
      wallJumpPalm: null,
      wallSparkTimer: 0,
      sumoCooldown: 0,
      stepSfxTimer: 0,
      alive: true,
      impaled: false,
      flipped: false,
      bleedTimer: 0,
      puddle: null,
      tumbleX: 0,
      tumbleZ: 0,
    };
  }

  function loadStage(idx, announce = true) {
    currentStageIdx = idx;
    stageData = window.STAGES_3D[idx];
    clearGroup(stageGroup);

    palms = [];
    mushrooms = [];
    safePads = [];
    coins = [];
    bloodParticles = [];
    bloodPuddles = [];
    waterSplashes = [];
    bothDeadTimer = 0;
    deathZoomTarget = null;
    deathZoomTimer = 0;

    // Build Safe Grippy Green Moss Islands!
    for (const spc of (stageData.safePads || [])) {
      const sp = buildSafePad(spc);
      stageGroup.add(sp.mesh);
      safePads.push(sp);
    }

    // Build Spiked Palm Trees & place Golden Coins on top of coin palms!
    for (const pc of stageData.palms) {
      const p = buildPalmTree(pc);
      stageGroup.add(p.mesh);
      palms.push(p);
      if (p.hasCoin) {
        const coin = buildPalmCoin(p.x, p.trunkH + 1.55 * p.scale, p.z);
        stageGroup.add(coin.group);
        coins.push(coin);
      }
    }

    // Build Spiked Giant Mushrooms
    for (const mc of stageData.mushrooms) {
      const m = buildGiantMushroom(mc);
      stageGroup.add(m.mesh);
      mushrooms.push(m);
    }

    // Scatter decorative green grass tufts sticking out of the cyan slime floor
    let seed = idx * 1337 + 42;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < stageData.grassCount; i++) {
      const gx = (rand() - 0.5) * 52;
      const gz = 24 - rand() * 64;
      const tooClose = palms.some((p) => Math.hypot(p.x - gx, p.z - gz) < 2.2)
        || mushrooms.some((m) => Math.hypot(m.x - gx, m.z - gz) < 1.8);
      if (!tooClose) {
        stageGroup.add(buildGrassTuft(gx, gz));
      }
    }

    // Spawn 1 grasshopper (1P mode) OR 2 identical 3D grasshoppers (2P original anime mode!)
    if (playerCount === 1) {
      grasshoppers = [
        createGrasshopperEntity(0, { x: 0, z: stageData.spawns[0].z }),
      ];
    } else {
      grasshoppers = [
        createGrasshopperEntity(0, stageData.spawns[0]),
        createGrasshopperEntity(1, stageData.spawns[1]),
      ];
    }

    if (gameState !== 'title') {
      gameState = 'playing';
      if (announce) {
        triggerCommentary(idx === 0 ? 'start' : 'sameColor', true);
      }
    }

    syncTouchControlsVisibility();
    buildStageButtons();
    updateHud();
  }

  function killGrasshopper(g, type, impactPos, extraTarget = null) {
    if (!g.alive) return;
    g.alive = false;
    totalDeaths++;
    stageDeaths++;
    views += Math.floor(180 + Math.random() * 480 + currentStageIdx * 240);
    window.kusogeAudio.playImpale();

    const aliveLeft = grasshoppers.filter((h) => h.alive).length;

    if (type === 'palmFrond') {
      // Exact anime 1:20 iconic scene: dangling impaled high up on palm fronds, spraying vertical blood waterfall!
      g.impaled = true;
      g.pos.copy(impactPos);
      g.vx = 0;
      g.vy = 0;
      g.vz = 0;
      g.root.position.copy(g.pos);
      g.bodyPivot.rotation.set(Math.PI * 0.48, g.yaw, (Math.random() - 0.5) * 0.5);
      g.puddle = createBloodPuddle(g.pos.x, g.pos.z);
      spawnBloodBurst(g.pos, 34, 1.15);
    } else if (type === 'mushroomUnder') {
      // Impaled on mushroom cap underside + permanent red splat decal on yellow underside!
      g.impaled = true;
      g.pos.copy(impactPos);
      g.vx = 0;
      g.vy = 0;
      g.vz = 0;
      g.root.position.copy(g.pos);
      g.bodyPivot.rotation.set(-Math.PI * 0.35, g.yaw, Math.PI * 0.85);
      g.puddle = createBloodPuddle(g.pos.x, g.pos.z);
      spawnBloodBurst(g.pos, 32, 1.1);

      if (extraTarget && extraTarget.capGroup) {
        const splat = new THREE.Mesh(new THREE.CircleGeometry(0.95, 10), matBloodPuddle);
        splat.rotation.x = Math.PI / 2;
        splat.position.set(
          (impactPos.x - extraTarget.x) * 0.55,
          -0.02,
          (impactPos.z - extraTarget.z) * 0.55
        );
        extraTarget.capGroup.add(splat);
      }
    } else if (type === 'trunkPin') {
      // Half the time pinned head-first onto the trunk spikes (step_117_shot_3.png),
      // half the time flipped upside-down onto its back bleeding on the slime floor (step_92_shot_6.png)!
      if (Math.random() < 0.55) {
        g.impaled = true;
        g.pos.copy(impactPos);
        g.pos.y = Math.max(1.05, Math.min(2.35, g.pos.y + 0.6));
        g.vx = 0;
        g.vy = 0;
        g.vz = 0;
        g.root.position.copy(g.pos);
        g.bodyPivot.rotation.set(0.2, g.yaw, 0.25);
        g.puddle = createBloodPuddle(g.pos.x, g.pos.z);
        spawnBloodBurst(g.pos, 32, 1.0);
      } else {
        g.flipped = true;
        // Bounce slightly away from trunk and flip upside down with splayed legs!
        const dx = g.pos.x - (extraTarget ? extraTarget.x : 0);
        const dz = g.pos.z - (extraTarget ? extraTarget.z : 0);
        const len = Math.hypot(dx, dz) || 1;
        g.vx = (dx / len) * 5.2;
        g.vz = (dz / len) * 5.2;
        g.vy = 3.6;
        g.puddle = createBloodPuddle(g.pos.x + (dx / len) * 1.4, g.pos.z + (dz / len) * 1.4);
        spawnBloodBurst(g.pos.clone().add(new THREE.Vector3(0, 0.7, 0)), 30, 1.1);
      }
    }

    // Commentary selection
    const impaledCount = grasshoppers.filter((h) => h.impaled).length;
    if (impaledCount >= 2) {
      triggerCommentary('doubleImpale', true);
    } else if (type === 'palmFrond') {
      triggerCommentary('palmFrondImpale', true);
    } else if (type === 'mushroomUnder') {
      triggerCommentary('mushroomImpale', true);
    } else {
      triggerCommentary('trunkImpale', true);
    }

    // Trigger dramatic anime close-up death zoom when BOTH are dead!
    if (aliveLeft === 0) {
      bothDeadTimer = 2.65;
      deathZoomTarget = g.pos.clone().add(new THREE.Vector3(0, 0.8, 0));
      deathZoomTimer = 2.65;
    }

    updateHud();
  }

  function triggerStageClear() {
    gameState = 'stageClear';
    syncTouchControlsVisibility();
    clearedStages.add(currentStageIdx);
    window.kusogeAudio.playStageClear();

    const milestones = [337282, 680000, 1000000];
    views = Math.max(views + 25000, milestones[currentStageIdx] || views + 100000);
    updateHud();
    buildStageButtons();
    triggerCommentary('clear', true);

    if (currentStageIdx === window.STAGES_3D.length - 1) {
      gameState = 'ending';
      endDeaths.textContent = `${totalDeaths}회`;
      endViews.textContent = formatViews(views);
      endingOverlay.classList.remove('hidden');
    } else {
      clearTitle.textContent = `STAGE ${stageData.id} CLEAR!!`;
      clearSub.textContent = `${stageData.name} 돌파! 칸니코 채널이 떡상 중입니다!`;
      clearStageDeaths.textContent = `${stageDeaths}회`;
      clearViews.textContent = formatViews(views);
      clearOverlay.classList.remove('hidden');
    }
  }

  function getControls(idx) {
    if (playerCount === 1) {
      const ti0 = touchInput[0];
      const ti1 = touchInput[1];
      const kx = ((keys['KeyD'] || keys['ArrowRight']) ? 1 : 0) - ((keys['KeyA'] || keys['ArrowLeft']) ? 1 : 0);
      const kz = ((keys['KeyS'] || keys['ArrowDown']) ? 1 : 0) - ((keys['KeyW'] || keys['ArrowUp']) ? 1 : 0);
      return {
        x: Math.abs(ti0.x) > 0.01 ? ti0.x : kx,
        z: Math.abs(ti0.z) > 0.01 ? ti0.z : kz,
        jump: !!(keys['Space'] || keys['Enter'] || keys['ShiftLeft'] || keys['ShiftRight'] || ti0.jump || ti1.jump),
      };
    }

    const ti = touchInput[idx];
    if (idx === 0) {
      const kx = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);
      const kz = (keys['KeyS'] ? 1 : 0) - (keys['KeyW'] ? 1 : 0);
      return {
        x: Math.abs(ti.x) > 0.01 ? ti.x : kx,
        z: Math.abs(ti.z) > 0.01 ? ti.z : kz,
        jump: !!(keys['Space'] || keys['ShiftLeft'] || ti.jump),
      };
    }
    const kx = (keys['ArrowRight'] ? 1 : 0) - (keys['ArrowLeft'] ? 1 : 0);
    const kz = (keys['ArrowDown'] ? 1 : 0) - (keys['ArrowUp'] ? 1 : 0);
    return {
      x: Math.abs(ti.x) > 0.01 ? ti.x : kx,
      z: Math.abs(ti.z) > 0.01 ? ti.z : kz,
      jump: !!(keys['Enter'] || keys['ShiftRight'] || keys['Numpad0'] || ti.jump),
    };
  }

  // =========================================================================
  // PHYSICS & UPDATE LOOP (Pure Cyan Slime Skating + Twin-Palm Wall-Kick!)
  // =========================================================================
  const GRAVITY = 31;
  const JUMP_VY = 16.6;         // Reaches ~4.45 units -> cleanly clears lower spikes into Wall-Jump zone!
  const WALL_JUMP_VY = 16.4;    // Crisp vertical boost per wall-kick (+4.35 units!)
  const WALL_JUMP_PUSH = 9.8;   // Cleanly crosses the ~3.1-unit gap between twin palm trunks in ~0.32s!
  const SLIME_ACCEL = 19.5;
  const SLIME_MAX_SPD = 14.5;
  const SLIME_FRICTION = 0.984; // Pure ultra-slippery cyan slime skating!
  const GRIP_FRICTION = 0.84;   // Grippy palm leaves ONLY on top of palm crowns!
  const AIR_ACCEL = 17.5;       // Responsive air control for landing on palm crowns!

  function update(dt) {
    globalTime += dt;

    // Animate shimmering cyan slime & drifting sky clouds
    slimeTexture.offset.x += dt * 0.085;
    slimeTexture.offset.y += Math.sin(globalTime * 0.9) * dt * 0.025;

    for (const c of clouds) {
      c.mesh.position.x += c.speed * dt;
      if (c.mesh.position.x > 105) c.mesh.position.x = -105;
    }

    // Animate spinning golden coins on top of palm trees!
    for (const coin of coins) {
      if (coin.collected) continue;
      coin.coinPivot.rotation.y += dt * 2.8;
      coin.group.position.y = coin.baseY + Math.sin(globalTime * 3.2 + coin.x) * 0.32;
      coin.beam.material.opacity = 0.12 + Math.sin(globalTime * 4 + coin.z) * 0.04;
    }

    // Update red 3D voxel blood particles
    for (let i = bloodParticles.length - 1; i >= 0; i--) {
      const bp = bloodParticles[i];
      bp.vy -= 26 * dt;
      bp.mesh.position.x += bp.vx * dt;
      bp.mesh.position.y += bp.vy * dt;
      bp.mesh.position.z += bp.vz * dt;
      bp.mesh.rotation.x += bp.rotSpd * dt;
      bp.mesh.rotation.y += bp.rotSpd * dt;
      if (bp.mesh.position.y < 0.06) {
        bp.mesh.position.y = 0.06;
        bp.vx *= 0.4;
        bp.vz *= 0.4;
        bp.vy = Math.abs(bp.vy) * 0.16;
      }
      bp.life -= dt;
      if (bp.life <= 0) {
        stageGroup.remove(bp.mesh);
        bloodParticles.splice(i, 1);
      }
    }

    // Update growing blood puddles on the cyan slime floor
    for (const pud of bloodPuddles) {
      if (pud.curScale < pud.targetScale) {
        pud.curScale = Math.min(pud.targetScale, pud.curScale + dt * 1.45);
        pud.mesh.scale.setScalar(pud.curScale);
      }
    }

    // Update cyan slime splashes
    for (let i = waterSplashes.length - 1; i >= 0; i--) {
      const ws = waterSplashes[i];
      ws.vy -= 18 * dt;
      ws.mesh.position.x += ws.vx * dt;
      ws.mesh.position.y += ws.vy * dt;
      ws.mesh.position.z += ws.vz * dt;
      ws.life -= dt;
      if (ws.life <= 0 || ws.mesh.position.y < 0) {
        stageGroup.remove(ws.mesh);
        waterSplashes.splice(i, 1);
      }
    }

    // Continuous blood fountain waterfall from any impaled or flipped grasshopper!
    for (const g of grasshoppers) {
      if (!g.alive && (g.impaled || g.flipped)) {
        g.bleedTimer -= dt;
        if (g.bleedTimer <= 0) {
          g.bleedTimer = g.impaled ? 0.032 : 0.085;
          const emitPos = g.pos.clone().add(new THREE.Vector3(0, g.impaled ? -0.15 : 0.45, 0));
          spawnBloodBurst(emitPos, g.impaled ? 3 : 1, g.impaled ? 0.38 : 0.55);
        }
        if (g.flipped) {
          g.vy -= GRAVITY * dt;
          g.pos.x += g.vx * dt;
          g.pos.y += g.vy * dt;
          g.pos.z += g.vz * dt;
          if (g.pos.y <= 0.32) {
            g.pos.y = 0.32;
            g.vy = 0;
            g.vx *= Math.pow(0.92, dt * 60);
            g.vz *= Math.pow(0.92, dt * 60);
          }
          g.root.position.copy(g.pos);
          // Upside-down dead pose with legs pointing straight up into the sky (step_92_shot_6.png!)
          g.bodyPivot.rotation.set(0, g.yaw, Math.PI);
          g.bodyPivot.position.y = 0.85;
        }
      }
    }

    // Title screen scenic camera pan
    if (gameState === 'title') {
      const a = Math.sin(globalTime * 0.25) * 0.35;
      camera.position.set(Math.sin(a) * 16, 4.1 + Math.sin(globalTime * 0.7) * 0.3, 24.5);
      camera.lookAt(0, 3.3, -6);
      return;
    }

    if (gameState !== 'playing') {
      updateCamera(dt);
      return;
    }

    // Auto-reset timer once BOTH grasshoppers have met their gruesome end
    if (bothDeadTimer > 0) {
      bothDeadTimer -= dt;
      if (bothDeadTimer <= 0) {
        loadStage(currentStageIdx, false);
        return;
      }
    }

    // Update each living grasshopper
    for (let i = 0; i < grasshoppers.length; i++) {
      const g = grasshoppers[i];
      if (!g.alive) continue;

      const ctrl = getControls(i);
      const jumpJustPressed = ctrl.jump && !prevJump[i];
      const jumpJustReleased = !ctrl.jump && prevJump[i];
      prevJump[i] = ctrl.jump;

      if (g.sumoCooldown > 0) g.sumoCooldown -= dt;
      if (g.wallCoyote > 0) g.wallCoyote = Math.max(0, g.wallCoyote - dt);
      if (g.wallJumpGrace > 0) g.wallJumpGrace = Math.max(0, g.wallJumpGrace - dt);
      if (g.wallSparkTimer > 0) g.wallSparkTimer = Math.max(0, g.wallSparkTimer - dt);
      g.coyote = g.grounded ? 0.1 : Math.max(0, g.coyote - dt);
      g.jumpBuf = jumpJustPressed ? 0.13 : Math.max(0, g.jumpBuf - dt);

      // Move input relative to world/camera yaw (supports both keyboard & analog mobile joystick!)
      let inX = ctrl.x;
      let inZ = ctrl.z;
      const inLen = Math.hypot(inX, inZ);
      if (inLen > 0) {
        if (inLen > 1) {
          inX /= inLen;
          inZ /= inLen;
        }
        const cosY = Math.cos(camYawOffset);
        const sinY = Math.sin(camYawOffset);
        const wx = inX * cosY + inZ * sinY;
        const wz = -inX * sinY + inZ * cosY;

        const acc = g.grounded ? (g.onGrippySurface ? 32.0 : SLIME_ACCEL) : AIR_ACCEL;
        g.vx += wx * acc * dt;
        g.vz += wz * acc * dt;
      }

      // Slippery cyan slime floor vs. grippy Safe Moss Pads & Palm Tree Crowns!
      const baseFric = g.grounded ? (g.onGrippySurface ? GRIP_FRICTION : SLIME_FRICTION) : 0.985;
      const fric = Math.pow(baseFric, dt * 60);
      g.vx *= fric;
      g.vz *= fric;

      const horizSpd = Math.hypot(g.vx, g.vz);
      const maxSpd = g.grounded && g.onGrippySurface ? 10.5 : SLIME_MAX_SPD;
      if (horizSpd > maxSpd) {
        const s = maxSpd / horizSpd;
        g.vx *= s;
        g.vz *= s;
      }

      // Face movement direction smoothly
      if (horizSpd > 0.6) {
        const targetYaw = Math.atan2(-g.vx, -g.vz);
        let diff = targetYaw - g.yaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        g.yaw += diff * Math.min(1, dt * 8.0);
      }

      // Slime skating splash particles & wet squelch SFX (only when sliding on cyan slime!)
      if (g.grounded && !g.onGrippySurface && horizSpd > 3.2) {
        g.stepSfxTimer -= dt;
        if (g.stepSfxTimer <= 0) {
          g.stepSfxTimer = 0.15;
          spawnSlimeSplash(g.pos.x, g.pos.z);
          if (Math.random() < 0.45) window.kusogeAudio.playSlimeSlide();
        }
      }

      // Jump OR Palm-Trunk WALL-JUMP!
      if (g.jumpBuf > 0) {
        if (g.coyote > 0) {
          g.vy = JUMP_VY;
          g.grounded = false;
          g.onGrippySurface = false;
          g.coyote = 0;
          g.jumpBuf = 0;
          g.tumbleX = (Math.random() - 0.5) * 2.2;
          g.tumbleZ = (Math.random() - 0.5) * 2.5;
          window.kusogeAudio.playJump();
          if (g.pos.y < 0.2) spawnSlimeSplash(g.pos.x, g.pos.z);
        } else if (g.wallCoyote > 0) {
          // TWIN-PALM WALL-JUMP!! Aim-assists gently toward a neighboring palm trunk if one is across the gap!
          let kickNx = g.wallNx;
          let kickNz = g.wallNz;
          let bestScore = -1;
          for (const other of palms) {
            if (other === g.wallPalm) continue;
            const toX = other.x - g.pos.x;
            const toZ = other.z - g.pos.z;
            const d = Math.hypot(toX, toZ);
            if (d > 2.2 && d < 10.5) {
              const dot = (toX / d) * g.wallNx + (toZ / d) * g.wallNz;
              if (dot > 0.35 && dot > bestScore) {
                bestScore = dot;
                kickNx = toX / d;
                kickNz = toZ / d;
              }
            }
          }
          g.vy = WALL_JUMP_VY;
          g.vx = kickNx * WALL_JUMP_PUSH;
          g.vz = kickNz * WALL_JUMP_PUSH;
          g.wallJumpGrace = 0.48; // Protects mid-wall-kick from underside frond spikes while climbing between trees!
          g.wallJumpPalm = g.wallPalm;
          g.wallCoyote = 0;
          g.jumpBuf = 0;
          g.tumbleX = (Math.random() - 0.5) * 1.6;
          g.tumbleZ = (Math.random() - 0.5) * 1.6;
          wallJumpCount++;
          window.kusogeAudio.playWallJump();
          spawnSparkBurst(g.pos.clone().add(new THREE.Vector3(0, 0.7, 0)), 12, matSparkGold);
          if (wallJumpCount === 1 || wallJumpCount % 4 === 0) {
            triggerCommentary('wallJump', true);
          }
        }
      }

      // Early release cuts jump height slightly for fine landing control
      if (jumpJustReleased && g.vy > 6.5) {
        g.vy *= 0.56;
      }

      // Gravity & integrate
      g.vy -= GRAVITY * dt;
      g.pos.x += g.vx * dt;
      g.pos.y += g.vy * dt;
      g.pos.z += g.vz * dt;

      // Ground & Safe Moss Island landing
      g.grounded = false;
      g.onGrippySurface = false;

      // Check Safe Moss Islands first (y = 0.32, grippy!)
      for (const sp of safePads) {
        if (Math.hypot(g.pos.x - sp.x, g.pos.z - sp.z) < sp.r && g.pos.y <= sp.topY + 0.15 && g.vy <= 0.5) {
          g.pos.y = sp.topY;
          g.vy = 0;
          g.grounded = true;
          g.onGrippySurface = true;
          g.tumbleX = 0;
          g.tumbleZ = 0;
          break;
        }
      }

      // Cyan slime floor at y = 0
      if (!g.grounded && g.pos.y <= 0) {
        g.pos.y = 0;
        g.vy = 0;
        g.grounded = true;
        g.onGrippySurface = false;
        g.tumbleX = 0;
        g.tumbleZ = 0;
      }

      // Arena perimeter soft bounce
      const arenaLimX = 34;
      if (g.pos.x < -arenaLimX) { g.pos.x = -arenaLimX; g.vx = Math.abs(g.vx) * 0.6; }
      if (g.pos.x > arenaLimX) { g.pos.x = arenaLimX; g.vx = -Math.abs(g.vx) * 0.6; }
      if (g.pos.z > 28) { g.pos.z = 28; g.vz = -Math.abs(g.vz) * 0.6; }
      if (g.pos.z < -46) { g.pos.z = -46; g.vz = Math.abs(g.vz) * 0.6; }

      // --- COLLISION: SPIKED PALM TREES (Lower Spikes / Safe Wall-Jump Trunk / Safe Grippy Crown / Spiked Underside!) ---
      const hopperY = g.pos.y + 0.65;
      for (const p of palms) {
        const dx = g.pos.x - p.x;
        const dz = g.pos.z - p.z;
        const dist = Math.hypot(dx, dz);

        // 1. Safe GRIPPY Landing on TOP of the Palm Tree Crown / Green Leaves!
        const crownTopY = p.trunkH + 0.05;
        if (dist < p.frondR * 0.96 && g.vy <= 2.4 && g.pos.y <= crownTopY + 0.45 && g.pos.y >= crownTopY - 1.1) {
          g.pos.y = crownTopY;
          g.vy = 0;
          g.grounded = true;
          g.onGrippySurface = true; // Grippy leaves so you never slip off after landing!
          g.tumbleX = 0;
          g.tumbleZ = 0;
          continue;
        }

        // 2. High-altitude spiked palm frond UNDERSIDE (skipped during clean Wall-Jump climbing between palms!)
        if (
          g.wallJumpGrace <= 0 &&
          dist > p.trunkSolidR + 0.55 &&
          dist < p.frondR * 0.85 &&
          g.vy > 1.4 &&
          hopperY >= p.frondYMin &&
          hopperY <= p.frondYMax - 0.25
        ) {
          killGrasshopper(g, 'palmFrond', new THREE.Vector3(g.pos.x, Math.min(p.frondYMax - 0.2, hopperY), g.pos.z), p);
          break;
        }

        // 3. Lower spiked trunk (impales only if you hit the low white spikes!)
        if (dist < p.trunkSpikeR + 0.4 && hopperY <= p.trunkSpikeYMax) {
          const normX = dx / (dist || 1);
          const normZ = dz / (dist || 1);
          const pinPos = new THREE.Vector3(
            p.x + normX * (p.trunkSpikeR + 0.22),
            Math.max(0.75, hopperY),
            p.z + normZ * (p.trunkSpikeR + 0.22)
          );
          killGrasshopper(g, 'trunkPin', pinPos, p);
          break;
        }

        // 4. SAFE SMOOTH BROWN MIDDLE/UPPER TRUNK -> WALL-CLING & WALL-JUMP ZONE!
        if (dist < p.trunkSolidR + 0.78 && hopperY > p.trunkSpikeYMax && g.pos.y < crownTopY - 0.45) {
          const nx = dx / (dist || 1);
          const nz = dz / (dist || 1);
          g.pos.x = p.x + nx * (p.trunkSolidR + 0.78);
          g.pos.z = p.z + nz * (p.trunkSolidR + 0.78);
          const vn = g.vx * nx + g.vz * nz;
          if (vn < 0) {
            g.vx -= vn * nx;
            g.vz -= vn * nz;
          }
          if (g.vy < -2.6) g.vy = -2.6; // Gentle wall-slide grip for easy Wall-Jump timing!
          g.wallCoyote = 0.3;
          g.wallNx = nx;
          g.wallNz = nz;
          g.wallPalm = p;
          if (g.wallSparkTimer <= 0) {
            g.wallSparkTimer = 0.16;
            spawnSlimeSplash(g.pos.x, g.pos.z);
          }
        }
      }
      if (!g.alive) continue;

      // --- COLLISION: SPIKED GIANT MUSHROOMS ---
      for (const m of mushrooms) {
        const dx = g.pos.x - m.x;
        const dz = g.pos.z - m.z;
        const dist = Math.hypot(dx, dz);

        // 1. Top bright-red mushroom cap -> SUPER TRAMPOLINE! (Check BEFORE underside so side-jumps land cleanly!)
        if (dist < m.capR * 0.98 && g.pos.y >= m.capYMid - 0.35 && g.pos.y <= m.capYTop + 0.35 && g.vy <= 1.5) {
          g.pos.y = m.capYTop - 0.15;
          g.vy = 18.8;
          g.grounded = false;
          window.kusogeAudio.playWallJump();
          spawnSparkBurst(g.pos.clone(), 12, matSparkGold);
          triggerCommentary('mushroomBounce', true);
          continue;
        }
        // 2. Lower spiked stem
        if (dist < m.stemSpikeR + 0.42 && hopperY <= m.stemSpikeYMax) {
          const nx = dx / (dist || 1);
          const nz = dz / (dist || 1);
          killGrasshopper(
            g,
            'trunkPin',
            new THREE.Vector3(m.x + nx * (m.stemSpikeR + 0.2), Math.max(0.7, hopperY), m.z + nz * (m.stemSpikeR + 0.2)),
            m
          );
          break;
        }
        // 3. Spiked yellow cap underside (only if jumping straight up underneath the center/rim!)
        if (dist < m.capR * 0.8 && hopperY >= m.capYMin && hopperY <= m.capYMid - 0.15 && g.vy > 1.2) {
          killGrasshopper(g, 'mushroomUnder', new THREE.Vector3(g.pos.x, m.capYMin + 0.35, g.pos.z), m);
          break;
        }
      }
      if (!g.alive) continue;

      // Update visual mesh transform & comical leg animation
      g.root.position.copy(g.pos);
      if (g.grounded) {
        g.bodyPivot.rotation.set(0, g.yaw, Math.sin(globalTime * 16 + g.id) * Math.min(0.12, horizSpd * 0.01));
        g.hindLegs.forEach((hl) => { hl.rotation.x = 0; });
      } else {
        g.bodyPivot.rotation.x += g.tumbleX * dt;
        g.bodyPivot.rotation.z += g.tumbleZ * dt;
        g.bodyPivot.rotation.y = g.yaw;
        g.hindLegs.forEach((hl) => { hl.rotation.x = -0.85; });
      }

      // --- CHECK TREETOP GOLDEN COINS ---
      for (const coin of coins) {
        if (coin.collected) continue;
        const dx = g.pos.x - coin.x;
        const dy = (g.pos.y + 0.7) - coin.group.position.y;
        const dz = g.pos.z - coin.z;
        if (Math.hypot(dx, dy, dz) < 2.35) {
          coin.collected = true;
          coin.group.visible = false;
          views += 12000;
          window.kusogeAudio.playCoin();
          spawnSparkBurst(new THREE.Vector3(coin.x, coin.baseY, coin.z), 28, matSparkGold);
          updateHud();

          const remaining = coins.filter((c) => !c.collected).length;
          if (remaining === 0) {
            triggerStageClear();
            return;
          } else {
            triggerCommentary('coinGet', true);
          }
        }
      }
    }

    // --- INSECT SUMO (곤충 대스모) GRASSHOPPER-TO-GRASSHOPPER COLLISION ---
    if (grasshoppers.length >= 2) {
      const g0 = grasshoppers[0];
      const g1 = grasshoppers[1];
      if (g0.alive && g1.alive) {
        const dx = g0.pos.x - g1.pos.x;
        const dy = g0.pos.y - g1.pos.y;
        const dz = g0.pos.z - g1.pos.z;
        const dist = Math.hypot(dx, dy, dz);
        if (dist < 1.55) {
          const nx = dx / (dist || 1);
          const nz = dz / (dist || 1);
          const sep = (1.58 - dist) * 0.5;
          g0.pos.x += nx * sep;
          g0.pos.z += nz * sep;
          g1.pos.x -= nx * sep;
          g1.pos.z -= nz * sep;
          if (g0.sumoCooldown <= 0 && g1.sumoCooldown <= 0) {
            g0.vx = nx * 11.5;
            g0.vz = nz * 11.5;
            g0.vy = Math.max(g0.vy, 5.2);
            g1.vx = -nx * 11.5;
            g1.vz = -nz * 11.5;
            g1.vy = Math.max(g1.vy, 5.2);
            g0.sumoCooldown = 0.35;
            g1.sumoCooldown = 0.35;
            window.kusogeAudio.playSumoBump();
            triggerCommentary('sumo', true);
          }
        }
      }
    }

    updateCamera(dt);
  }

  // =========================================================================
  // ANIME LOW-ANGLE TRACKING & DEATH ZOOM CAMERA
  // =========================================================================
  const smoothLook = new THREE.Vector3(0, 2, 10);
  const smoothCamPos = new THREE.Vector3(0, 3.8, 25);

  function updateCamera(dt) {
    // Dramatic anime close-up zoom on double death/impalement!
    if (deathZoomTimer > 0 && deathZoomTarget) {
      deathZoomTimer -= dt;
      const desiredPos = new THREE.Vector3(
        deathZoomTarget.x + Math.sin(globalTime * 0.9) * 5.2,
        Math.max(1.4, deathZoomTarget.y + 0.6),
        deathZoomTarget.z + 5.6
      );
      smoothCamPos.lerp(desiredPos, Math.min(1, dt * 4.5));
      smoothLook.lerp(deathZoomTarget, Math.min(1, dt * 6));
      camera.position.copy(smoothCamPos);
      camera.lookAt(smoothLook);
      return;
    }

    // Compute midpoint of active grasshoppers
    const active = grasshoppers.filter((g) => g.alive);
    const list = active.length > 0 ? active : grasshoppers;
    let cx = 0;
    let cy = 0;
    let cz = 0;
    let spread = 0;
    for (const g of list) {
      cx += g.pos.x;
      cy += g.pos.y;
      cz += g.pos.z;
    }
    cx /= list.length;
    cy /= list.length;
    cz /= list.length;
    if (list.length === 2) {
      spread = list[0].pos.distanceTo(list[1].pos);
    }

    let baseDist = 12.2 + Math.min(14, spread * 0.58 + cy * 0.35);
    let baseH = 3.2 + Math.min(7.5, cy * 0.78 + spread * 0.12);
    let lookY = 2.1 + cy * 0.72;

    if (camMode === 1) {
      // 3rd-Person Follow (higher, clearer palm-top view)
      baseDist = 15.8 + Math.min(14, spread * 0.5 + cy * 0.3);
      baseH = 7.8 + Math.min(7.5, cy * 0.75 + spread * 0.15);
      lookY = 2.0 + cy * 0.65;
    } else if (camMode === 2) {
      // Free Orbit
      baseDist = 14.0 + Math.min(12, spread * 0.4);
      baseH = Math.max(1.4, 5.4 + cy * 0.6 + camPitchOffset * 8);
    }

    const desiredPos = new THREE.Vector3(
      cx + Math.sin(camYawOffset) * baseDist,
      baseH,
      cz + Math.cos(camYawOffset) * baseDist
    );
    const desiredLook = new THREE.Vector3(cx, lookY, cz - 3.5);

    smoothCamPos.lerp(desiredPos, Math.min(1, dt * 5.2));
    smoothLook.lerp(desiredLook, Math.min(1, dt * 6.5));

    camera.position.copy(smoothCamPos);
    camera.lookAt(smoothLook);
  }

  // =========================================================================
  // MAIN ANIMATION LOOP
  // =========================================================================
  let lastTs = performance.now();
  function animate(ts) {
    const dt = Math.min((ts - lastTs) / 1000, 0.033);
    lastTs = ts;
    update(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // =========================================================================
  // INPUT & UI EVENTS
  // =========================================================================
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
    keys[e.code] = true;

    if (e.code === 'KeyR' && gameState === 'playing') {
      loadStage(currentStageIdx, false);
    } else if (e.code === 'KeyV') {
      cycleCamera();
    } else if (e.code === 'KeyH') {
      togglePureAnimeMode();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  // Mouse drag to orbit/peek camera
  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    camYawOffset -= dx * 0.008;
    camPitchOffset = Math.max(-0.4, Math.min(0.8, camPitchOffset + dy * 0.006));
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  function cycleCamera() {
    camMode = (camMode + 1) % CAM_MODES.length;
    if (camMode !== 2) {
      camYawOffset = 0;
      camPitchOffset = 0;
    }
    camStateEl.textContent = CAM_MODES[camMode];
  }

  function togglePureAnimeMode() {
    pureAnimeMode = !pureAnimeMode;
    appShell.classList.toggle('pure-anime', pureAnimeMode);
    restoreHudBtn.classList.toggle('hidden', !pureAnimeMode);
    if (pureAnimeMode) popupTelop.classList.add('hidden');
    setTimeout(handleResize, 20);
  }

  function toggleMarkers() {
    showMarkers = !showMarkers;
    markerStateEl.textContent = showMarkers ? 'ON (치트)' : 'OFF (원작)';
    markerStateEl.style.color = showMarkers ? '#ffe066' : '#1bd4ff';
    grasshoppers.forEach((g) => { g.marker.visible = showMarkers; });
  }

  function cycleTouchPad() {
    if (touchPadMode === 'auto') touchPadMode = 'on';
    else if (touchPadMode === 'on') touchPadMode = 'off';
    else touchPadMode = 'auto';
    if (touchStateEl) {
      touchStateEl.textContent = touchPadMode.toUpperCase();
      touchStateEl.style.color = touchPadMode === 'off' ? '#ff6275' : '#1bd4ff';
    }
    syncTouchControlsVisibility();
  }

  document.getElementById('btn-start').addEventListener('click', () => {
    window.kusogeAudio.ensureContext();
    window.kusogeAudio.playStartSplash();
    window.kusogeAudio.startBgm();
    titleOverlay.classList.add('hidden');
    gameState = 'playing';
    syncTouchControlsVisibility();
    triggerCommentary('start', true);
  });

  document.getElementById('btn-next-stage').addEventListener('click', () => {
    clearOverlay.classList.add('hidden');
    stageDeaths = 0;
    loadStage(currentStageIdx + 1, true);
  });

  document.getElementById('btn-replay-stage').addEventListener('click', () => {
    clearOverlay.classList.add('hidden');
    stageDeaths = 0;
    loadStage(currentStageIdx, true);
  });

  document.getElementById('btn-restart-all').addEventListener('click', () => {
    endingOverlay.classList.add('hidden');
    totalDeaths = 0;
    stageDeaths = 0;
    views = 15;
    clearedStages.clear();
    loadStage(0, true);
  });

  document.getElementById('btn-retry').addEventListener('click', () => {
    if (gameState === 'playing') loadStage(currentStageIdx, false);
  });

  document.getElementById('btn-cam').addEventListener('click', cycleCamera);
  document.getElementById('btn-pure').addEventListener('click', togglePureAnimeMode);
  restoreHudBtn.addEventListener('click', togglePureAnimeMode);
  document.getElementById('btn-markers').addEventListener('click', toggleMarkers);
  const btnMode = document.getElementById('btn-mode');
  if (btnMode) btnMode.addEventListener('click', () => setPlayerMode(playerCount === 1 ? 2 : 1));
  if (modeBtn1p) modeBtn1p.addEventListener('click', () => setPlayerMode(1));
  if (modeBtn2p) modeBtn2p.addEventListener('click', () => setPlayerMode(2));
  const btnTouchToggle = document.getElementById('btn-touch-toggle');
  if (btnTouchToggle) btnTouchToggle.addEventListener('click', cycleTouchPad);

  document.getElementById('btn-bgm').addEventListener('click', () => {
    const on = window.kusogeAudio.toggleBgm();
    bgmStateEl.textContent = on ? 'ON' : 'OFF';
    bgmStateEl.style.color = on ? '#1bd4ff' : '#ff6275';
  });

  document.getElementById('btn-sfx').addEventListener('click', () => {
    const on = window.kusogeAudio.toggleSfx();
    sfxStateEl.textContent = on ? 'ON' : 'OFF';
    sfxStateEl.style.color = on ? '#1bd4ff' : '#ff6275';
  });

  // Boot directly into Stage 1 3D arena behind the live dripping-slime title screen!
  setupTouchGamepad();
  loadStage(0, false);
  gameState = 'title';
  syncTouchControlsVisibility();
  triggerCommentary('title', false);
  requestAnimationFrame(animate);
})();
