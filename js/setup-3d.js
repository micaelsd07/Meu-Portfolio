// Quarto gamer em 3D: ao rolar, a câmera dá zoom até o monitor, que mostra um terminal
// com as informações do Micael. Three.js via CDN; sem WebGL ou com "reduzir movimento",
// a seção fica como uma capa estática.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const section = document.getElementById('setup');
const canvas = document.getElementById('room');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) { renderer = null; }

if (renderer) init();

function init() {
  const small = matchMedia('(max-width: 760px)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0b0a10');
  scene.fog = new THREE.Fog('#0b0a10', 7, 16);
  const camera = new THREE.PerspectiveCamera(small ? 62 : 46, 1, 0.05, 40);

  const ORANGE = new THREE.Color('#ff6b3d');
  const PURPLE = new THREE.Color('#8b5cf6');
  const CYAN = new THREE.Color('#38bdf8');

  // ---------- helpers ----------
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.1, ...extra });
  const glow = (color, intensity = 2) => new THREE.MeshStandardMaterial({ color: '#000', emissive: color, emissiveIntensity: intensity });
  function box(w, h, d, mat, x, y, z, parent = scene) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); parent.add(m); return m;
  }
  function canvasTex(w, h, draw) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d'); draw(ctx, w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return { tex: t, ctx, c };
  }

  // ---------- quarto ----------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#17131d', { roughness: 0.55 }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), std('#1c1824'));
  back.position.set(0, 3, -1.62); scene.add(back);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), std('#18151f'));
  left.rotation.y = Math.PI / 2; left.position.set(-3.3, 3, 0); scene.add(left);
  // tapete
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.6, 48), std('#231d2e', { roughness: 1 }));
  rug.rotation.x = -Math.PI / 2; rug.position.set(0.2, 0.005, 0.4); scene.add(rug);
  // fitas de LED
  box(14, 0.03, 0.03, glow(PURPLE, 3), 0, 3.6, -1.58);
  box(0.03, 0.03, 14, glow(PURPLE, 3), -3.27, 3.6, 0);
  box(14, 0.02, 0.02, glow(ORANGE, 1.6), 0, 0.03, -1.58);

  // ---------- mesa ----------
  const deskMat = std('#2b2633', { roughness: 0.5 });
  box(3.4, 0.06, 1.15, deskMat, 0, 0.76, -0.95);
  const legMat = std('#111015', { metalness: 0.6, roughness: 0.4 });
  [[-1.62, -0.45], [1.62, -0.45], [-1.62, -1.45], [1.62, -1.45]].forEach(([x, z]) => box(0.05, 0.76, 0.05, legMat, x, 0.38, z));
  box(3.4, 0.012, 0.012, glow(ORANGE, 3), 0, 0.725, -0.38); // LED na borda da mesa
  box(1.7, 0.006, 0.55, std('#0d0c12', { roughness: 0.9 }), 0.15, 0.793, -0.62); // mousepad
  box(1.7, 0.004, 0.004, glow(ORANGE, 2.5), 0.15, 0.797, -0.345);

  // ---------- teclado RGB ----------
  const keys = canvasTex(512, 160, (ctx, w, h) => {
    ctx.fillStyle = '#0a0a0e'; ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, w, 0);
    ['#ff3d6e', '#ff8a3d', '#ffd23d', '#3dff9a', '#3dd5ff', '#8b5cf6', '#ff3dd2'].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
    for (let r = 0; r < 5; r++) for (let k = 0; k < 15; k++) {
      ctx.fillStyle = g; ctx.globalAlpha = 0.85;
      ctx.fillRect(8 + k * 33.4, 8 + r * 30, 28, 24);
    }
  });
  const kb = box(0.92, 0.03, 0.3, [legMat, legMat, new THREE.MeshStandardMaterial({ color: '#111', emissive: '#fff', emissiveMap: keys.tex, emissiveIntensity: 1.2 }), legMat, legMat, legMat], 0, 0.81, -0.6);
  // mouse
  const mouse = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 12), std('#121117', { roughness: 0.3 }));
  mouse.scale.set(0.75, 0.45, 1.25); mouse.position.set(0.68, 0.81, -0.6); scene.add(mouse);
  box(0.012, 0.004, 0.05, glow(CYAN, 3), 0.68, 0.833, -0.62);

  // ---------- monitor principal ----------
  const SCREEN = { w: 1.5, h: 0.84, x: 0, y: 1.33, z: -1.17 };
  box(SCREEN.w + 0.06, SCREEN.h + 0.06, 0.04, std('#08080b', { roughness: 0.35, metalness: 0.4 }), SCREEN.x, SCREEN.y, SCREEN.z - 0.025);
  box(0.08, 0.42, 0.06, legMat, 0, 0.99, -1.27);
  box(0.46, 0.02, 0.26, legMat, 0, 0.8, -1.24);
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1600; screenCanvas.height = 896;
  const sctx = screenCanvas.getContext('2d');
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace; screenTex.anisotropy = 8;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN.w, SCREEN.h), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  screen.position.set(SCREEN.x, SCREEN.y, SCREEN.z); scene.add(screen);
  // brilho roxo atrás do monitor
  const halo = canvasTex(256, 256, (ctx, w) => {
    const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, 'rgba(139,92,246,.9)'); g.addColorStop(1, 'rgba(139,92,246,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, w);
  });
  const haloMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), new THREE.MeshBasicMaterial({ map: halo.tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  haloMesh.position.set(0, 1.4, -1.6); scene.add(haloMesh);

  // ---------- monitor vertical com código ----------
  const code = canvasTex(480, 820, (ctx, w, h) => {
    ctx.fillStyle = '#0f1117'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1a1d27'; ctx.fillRect(0, 0, w, 34);
    ctx.font = '500 17px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#8b8fa3'; ctx.fillText('portfolio.ts', 16, 23);
    const lines = [
      ['#c792ea', 'import', '#eef', ' { Dev } ', '#c792ea', 'from', '#c3e88d', " './senai'"],
      [],
      ['#c792ea', 'const', '#82aaff', ' micael', '#eef', ' = new Dev({'],
      ['#eef', '  nome: ', '#c3e88d', "'Micael Silva'"],
      ['#eef', '  curso: ', '#c3e88d', "'ADS'"],
      ['#eef', '  cidade: ', '#c3e88d', "'Taubaté'"],
      ['#eef', '  stack: [', '#c3e88d', "'React'", '#eef', ','],
      ['#c3e88d', "    'Node.js'", '#eef', ', ', '#c3e88d', "'SQL'", '#eef', '],'],
      ['#eef', '  cloud: [', '#c3e88d', "'AWS'", '#eef', ', ', '#c3e88d', "'GCP'", '#eef', '],'],
      ['#eef', '})'],
      [],
      ['#82aaff', 'micael', '#eef', '.', '#ffcb6b', 'buscar', '#eef', '('],
      ['#c3e88d', "  'estágio em TI'"],
      ['#eef', ')'],
      [],
      ['#546e7a', '// pronto para codar :)'],
    ];
    lines.forEach((parts, i) => {
      let x = 54; ctx.fillStyle = '#4b5068'; ctx.fillText(String(i + 1).padStart(2, ' '), 14, 76 + i * 30);
      for (let k = 0; k < parts.length; k += 2) { ctx.fillStyle = parts[k]; ctx.fillText(parts[k + 1], x, 76 + i * 30); x += ctx.measureText(parts[k + 1]).width; }
    });
  });
  const side = new THREE.Group(); side.position.set(-1.28, 1.37, -1.02); side.rotation.y = 0.5; scene.add(side);
  box(0.52, 0.88, 0.035, std('#08080b', { roughness: 0.35 }), 0, 0, -0.02, side);
  const codeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.47, 0.82), new THREE.MeshBasicMaterial({ map: code.tex, toneMapped: false }));
  side.add(codeMesh);
  box(0.06, 0.5, 0.05, legMat, -1.3, 0.95, -1.12);

  // ---------- gabinete com ventoinhas RGB ----------
  const pc = new THREE.Group(); pc.position.set(1.38, 1.15, -1.0); scene.add(pc);
  box(0.34, 0.72, 0.62, std('#0d0c11', { metalness: 0.5, roughness: 0.35 }), 0, 0, 0, pc);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.66), new THREE.MeshStandardMaterial({ color: '#1a1530', emissive: '#2a1a55', emissiveIntensity: 0.8, transparent: true, opacity: 0.85 }));
  glass.position.set(0, 0, 0.312); pc.add(glass);
  const fans = [];
  [0.2, 0, -0.2].forEach((y) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.011, 10, 40), glow(ORANGE, 3));
    ring.position.set(0, y, 0.318); pc.add(ring); fans.push(ring);
    const blades = new THREE.Mesh(new THREE.CircleGeometry(0.07, 6), std('#1b1825', { roughness: 0.6 }));
    blades.position.set(0, y, 0.316); pc.add(blades);
  });

  // ---------- prateleira, letreiro neon e pôster ----------
  box(1.3, 0.04, 0.26, deskMat, -1.35, 2.3, -1.48);
  [['#e85d3f', 0.06, 0.3], ['#3b82f6', 0.05, 0.26], ['#f5c04a', 0.07, 0.32], ['#10b981', 0.05, 0.24], ['#a78bfa', 0.06, 0.28]].forEach(([c, w, h], i) => {
    box(w, h, 0.2, std(c, { roughness: 0.8 }), -1.85 + i * 0.075, 2.32 + h / 2, -1.48);
  });
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.12, 20), std('#d9d2c3'));
  pot.position.set(-0.95, 2.38, -1.48); scene.add(pot);
  const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 1), std('#2f7d4f', { roughness: 0.9, flatShading: true }));
  leaf.position.set(-0.95, 2.53, -1.48); leaf.scale.y = 1.2; scene.add(leaf);

  const neon = canvasTex(512, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = '700 150px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ff6b3d'; ctx.shadowBlur = 40; ctx.fillStyle = '#ffd2c2';
    ctx.fillText('</>', w / 2, h / 2); ctx.shadowBlur = 18; ctx.fillText('</>', w / 2, h / 2);
  });
  const neonMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), new THREE.MeshBasicMaterial({ map: neon.tex, transparent: true, toneMapped: false, depthWrite: false }));
  neonMesh.position.set(1.25, 2.45, -1.6); scene.add(neonMesh);

  const poster = canvasTex(400, 560, (ctx, w, h) => {
    ctx.fillStyle = '#f1eee6'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d1431b'; ctx.fillRect(0, 0, w, 14);
    ctx.fillStyle = '#17160f'; ctx.font = 'italic 500 64px Fraunces, Georgia, serif';
    ctx.fillText('Hello,', 34, 140); ctx.fillText('world.', 34, 210);
    ctx.font = '500 20px "IBM Plex Mono", monospace'; ctx.fillStyle = '#55524a';
    ['SENAI TAUBATÉ', 'ADS / 2026', 'AWS / GOOGLE / CISCO'].forEach((t, i) => ctx.fillText(t, 34, 420 + i * 34));
  });
  const posterMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.87), std('#fff', { map: poster.tex, roughness: 0.9 }));
  posterMesh.rotation.y = Math.PI / 2; posterMesh.position.set(-3.28, 1.95, -0.3); scene.add(posterMesh);

  // ---------- cadeira gamer (afastada para o lado) ----------
  const chair = new THREE.Group(); chair.position.set(1.95, 0, 0.05); chair.rotation.y = -0.6; scene.add(chair);
  const seatMat = std('#16141b', { roughness: 0.6 });
  box(0.56, 0.1, 0.55, seatMat, 0, 0.5, 0, chair);
  box(0.56, 0.85, 0.1, seatMat, 0, 0.98, 0.26, chair);
  box(0.08, 0.86, 0.105, std(ORANGE, { roughness: 0.6 }), -0.17, 0.98, 0.26, chair);
  box(0.08, 0.86, 0.105, std(ORANGE, { roughness: 0.6 }), 0.17, 0.98, 0.26, chair);
  box(0.06, 0.45, 0.06, legMat, 0, 0.24, 0, chair);
  box(0.6, 0.03, 0.06, legMat, 0, 0.03, 0, chair);
  box(0.06, 0.03, 0.6, legMat, 0, 0.03, 0, chair);

  // ---------- luzes ----------
  scene.add(new THREE.AmbientLight('#8c7fb8', 0.55));
  const monitorLight = new THREE.PointLight('#cfe1ff', 6, 4, 2); monitorLight.position.set(0, 1.35, -0.8); scene.add(monitorLight);
  const purple = new THREE.PointLight(PURPLE, 14, 6, 2); purple.position.set(-1.6, 2.9, -1.1); scene.add(purple);
  const orange = new THREE.PointLight(ORANGE, 9, 5, 2); orange.position.set(1.5, 2.3, -1.15); scene.add(orange);
  const fill = new THREE.PointLight('#b9a7ff', 5, 9, 2); fill.position.set(2.5, 2.6, 2.5); scene.add(fill);

  // ---------- tela: terminal que digita conforme a rolagem ----------
  const photo = new Image(); photo.src = 'img/micael-640.webp';
  const LINES = [
    { cmd: 'whoami', out: ['Micael Silva Domiciano'] },
    { cmd: 'cat perfil.txt', out: ['Estudante de ADS no SENAI Taubaté', 'Em busca de estágio em TI'] },
    { cmd: 'ls certificacoes/', out: ['aws-cloud-foundations   google-firebase', 'cisco-linux   cisco-redes   cisco-ia'] },
    { cmd: 'cat stack.txt', out: ['React  TypeScript  Node.js  SQL  Git'] },
    { cmd: './portfolio --abrir', out: [] },
  ];
  let lastKey = '';
  function drawScreen(p, time) {
    const typed = Math.max(0, (p - 0.08) / 0.8) * LINES.length; // quantos comandos já apareceram
    const blink = Math.floor(time / 500) % 2;
    const key = typed.toFixed(2) + blink + (photo.complete ? 1 : 0);
    if (key === lastKey) return; lastKey = key;
    const W = screenCanvas.width, H = screenCanvas.height, c = sctx;
    const bg = c.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#120f1c'); bg.addColorStop(1, '#0b1220');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    // barra superior
    c.fillStyle = 'rgba(255,255,255,.05)'; c.fillRect(0, 0, W, 54);
    c.font = '500 22px "IBM Plex Mono", monospace'; c.fillStyle = '#a9a3c4';
    c.fillText('micael@senai: ~/portfolio', 28, 35);
    [['#ff5f57', 0], ['#febc2e', 1], ['#28c840', 2]].forEach(([col, i]) => { c.fillStyle = col; c.beginPath(); c.arc(W - 120 + i * 34, 27, 9, 0, 7); c.fill(); });
    // foto à direita
    const px = W - 430, py = 110, ps = 330;
    c.save(); c.beginPath(); c.roundRect(px, py, ps, ps, 24); c.clip();
    if (photo.complete && photo.naturalWidth) c.drawImage(photo, px, py, ps, ps); else { c.fillStyle = '#1d1a2a'; c.fillRect(px, py, ps, ps); }
    c.restore();
    c.strokeStyle = '#ff6b3d'; c.lineWidth = 3; c.beginPath(); c.roundRect(px, py, ps, ps, 24); c.stroke();
    c.font = '500 22px "IBM Plex Mono", monospace'; c.fillStyle = '#ff9a73'; c.fillText('Disponível para estágio', px, py + ps + 46);
    c.fillStyle = '#7d779a'; c.fillText('Taubaté, SP', px, py + ps + 82);
    // linhas do terminal
    c.font = '500 30px "IBM Plex Mono", monospace';
    let y = 120;
    for (let i = 0; i < LINES.length; i++) {
      if (typed <= i) break;
      const part = Math.min(1, typed - i);
      const full = LINES[i].cmd;
      const shown = full.slice(0, Math.ceil(full.length * Math.min(1, part * 1.8)));
      c.fillStyle = '#28c840'; c.fillText('➜', 40, y);
      c.fillStyle = '#7dd3fc'; c.fillText('~', 80, y);
      c.fillStyle = '#f3f0ff'; c.fillText(shown, 118, y);
      const done = part * 1.8 >= 1;
      if (!done && blink) { c.fillStyle = '#ff6b3d'; c.fillRect(118 + c.measureText(shown).width + 6, y - 26, 16, 32); }
      y += 46;
      if (done) {
        LINES[i].out.forEach((o, k) => { c.fillStyle = k === 0 && i === 0 ? '#ffb38f' : '#c9c3e6'; c.fillText(o, 118, y); y += 42; });
        y += 14;
      }
    }
    if (typed >= LINES.length - 0.01 && blink) { c.fillStyle = '#ff6b3d'; c.fillRect(118, y - 26, 16, 32); }
    screenTex.needsUpdate = true;
  }

  // ---------- câmera ----------
  const start = new THREE.Vector3(2.7, 2.05, 3.7), mid = new THREE.Vector3(1.0, 1.55, 1.5);
  const lookStart = new THREE.Vector3(-0.15, 1.15, -1.0), lookEnd = new THREE.Vector3(SCREEN.x, SCREEN.y, SCREEN.z);
  const end = new THREE.Vector3(), curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  function fitDistance() {
    const vf = THREE.MathUtils.degToRad(camera.fov) / 2, t = Math.tan(vf);
    const dH = (SCREEN.h / 2) / t, dW = (SCREEN.w / 2) / (t * camera.aspect);
    return Math.min(dH, dW) * 0.9; // um pouco mais perto para a tela cobrir tudo
  }
  function resize() {
    const w = section.clientWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    end.set(SCREEN.x, SCREEN.y, SCREEN.z + fitDistance());
    curve.v2.copy(end);
  }
  window.addEventListener('resize', resize);

  let progress = 0, smooth = 0, mx = 0, my = 0, cmx = 0, cmy = 0;
  function readProgress() {
    const r = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    progress = total > 0 ? THREE.MathUtils.clamp(-r.top / total, 0, 1) : 0;
    if (fade) fade.style.opacity = String(THREE.MathUtils.clamp((progress - 0.88) / 0.12, 0, 1));
  }
  window.addEventListener('scroll', readProgress, { passive: true });
  window.addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });

  const look = new THREE.Vector3(), pos = new THREE.Vector3();
  const ui = section.querySelector('.setup-ui'), fade = section.querySelector('.setup-fade'), bar = section.querySelector('.setup-bar i');
  function frame(time) {
    smooth += (progress - smooth) * (calm ? 1 : 0.09);
    cmx += (mx - cmx) * 0.06; cmy += (my - cmy) * 0.06;
    const e = smooth < 0.5 ? 2 * smooth * smooth : 1 - Math.pow(-2 * smooth + 2, 2) / 2; // ease in-out
    const zoom = THREE.MathUtils.clamp(e / 0.92, 0, 1);
    curve.getPoint(zoom, pos);
    const sway = 1 - zoom; // movimento do mouse some perto da tela
    camera.position.set(pos.x + cmx * 0.35 * sway, pos.y - cmy * 0.2 * sway, pos.z);
    look.lerpVectors(lookStart, lookEnd, Math.min(1, zoom * 1.4));
    camera.lookAt(look);

    fans.forEach((f, i) => { f.material.emissive.setHSL(((time / 4000) + i * 0.12) % 1, 0.9, 0.55); });
    keys.tex.offset.x = (time / 6000) % 1; keys.tex.wrapS = THREE.RepeatWrapping;
    drawScreen(calm ? 1 : smooth, time);
    renderer.render(scene, camera);

    if (ui) { ui.style.opacity = String(Math.max(0, 1 - smooth / 0.18)); ui.style.translate = `0 ${-smooth * 120}px`; }
    if (bar) bar.style.transform = `scaleY(${smooth})`;
  }

  // ---------- ciclo de vida ----------
  let visible = true, raf = 0, running = false;
  function loop(t) { frame(t); raf = requestAnimationFrame(loop); }
  function play() { if (running || calm || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(loop); }
  function pause() { running = false; cancelAnimationFrame(raf); }
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? play() : pause(); }).observe(section);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));

  if (!calm) section.classList.add('on'); // libera a trilha de rolagem
  resize(); readProgress();
  const ready = () => { lastKey = ''; calm ? frame(4000) : play(); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(ready);
  photo.onload = () => { lastKey = ''; if (calm) frame(4000); };
  section.classList.add('ready');

  // menu escuro enquanto a cena está sob ele (faixa do topo da tela)
  new IntersectionObserver((es) => document.body.classList.toggle('on-setup', es[0].isIntersecting), { rootMargin: '0px 0px -92% 0px' }).observe(section);
}
