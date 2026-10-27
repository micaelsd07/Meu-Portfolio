// Fundo 3D: rede de dados com pacotes trafegando e um núcleo geométrico.
// WebGL puro, sem bibliotecas. Pausa quando a aba está escondida e respeita "reduzir movimento".
(function () {
  var canvas = document.getElementById('bg3d');
  if (!canvas) return;
  var gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) return;

  var calm = matchMedia('(prefers-reduced-motion: reduce)');
  var small = matchMedia('(max-width: 760px)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  // ---------- Shaders ----------
  var vs = 'attribute vec3 p;uniform mat4 m;uniform float s;varying float f;' +
    'void main(){vec4 c=m*vec4(p,1.);gl_Position=c;gl_PointSize=s*(14./c.w);f=clamp(1.-(c.w-12.)/30.,.4,1.);}';
  var fs = 'precision mediump float;uniform vec4 col;uniform float pt;varying float f;' +
    'void main(){float a=1.;if(pt>.5){vec2 d=gl_PointCoord-.5;float r=dot(d,d);if(r>.25)discard;a=1.-smoothstep(.12,.25,r);}' +
    'gl_FragColor=vec4(col.rgb,col.a*f*a);}';
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  var prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  var aP = gl.getAttribLocation(prog, 'p');
  var uM = gl.getUniformLocation(prog, 'm');
  var uS = gl.getUniformLocation(prog, 's');
  var uC = gl.getUniformLocation(prog, 'col');
  var uPt = gl.getUniformLocation(prog, 'pt');
  gl.enableVertexAttribArray(aP);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function buffer(data, dynamic) {
    var b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    return b;
  }

  // ---------- Rede (nós e conexões) ----------
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  var N = small ? 70 : 150;
  var nodes = [];
  for (var i = 0; i < N; i++) {
    nodes.push([(rnd() - .5) * 26, (rnd() - .5) * 18, (rnd() - .5) * 22 - 4]);
  }
  var edges = [], deg = new Array(N).fill(0);
  for (i = 0; i < N; i++) {
    for (var j = i + 1; j < N; j++) {
      var dx = nodes[i][0] - nodes[j][0], dy = nodes[i][1] - nodes[j][1], dz = nodes[i][2] - nodes[j][2];
      if (dx * dx + dy * dy + dz * dz < 17 && deg[i] < 4 && deg[j] < 4) { edges.push([i, j]); deg[i]++; deg[j]++; }
    }
  }
  var nodeArr = new Float32Array(N * 3);
  nodes.forEach(function (n, k) { nodeArr.set(n, k * 3); });
  var edgeArr = new Float32Array(edges.length * 6);
  edges.forEach(function (e, k) { edgeArr.set(nodes[e[0]], k * 6); edgeArr.set(nodes[e[1]], k * 6 + 3); });
  var bNodes = buffer(nodeArr), bEdges = buffer(edgeArr);

  // ---------- Pacotes de dados ----------
  var P = small ? 26 : 60;
  var packets = [];
  for (i = 0; i < P; i++) packets.push({ e: Math.floor(rnd() * edges.length), t: rnd(), v: .18 + rnd() * .35, dir: rnd() > .5 ? 1 : -1 });
  var packArr = new Float32Array(P * 3);
  var bPack = buffer(packArr, true);

  // ---------- Núcleo (icosaedro em arame, dois tamanhos) ----------
  var t = (1 + Math.sqrt(5)) / 2;
  var V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  var F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  var seen = {}, ico = [];
  F.forEach(function (f) {
    [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]].forEach(function (e) {
      var k = Math.min(e[0], e[1]) + '-' + Math.max(e[0], e[1]);
      if (!seen[k]) { seen[k] = 1; ico.push(V[e[0]], V[e[1]]); }
    });
  });
  var icoArr = new Float32Array(ico.length * 3);
  ico.forEach(function (v, k) { icoArr.set(v, k * 3); });
  var bIco = buffer(icoArr);
  var icoVerts = new Float32Array(36);
  V.forEach(function (v, k) { icoVerts.set(v, k * 3); });
  var bIcoV = buffer(icoVerts);

  // ---------- Matrizes ----------
  function mul(a, b) {
    var o = new Float32Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return o;
  }
  function persp(fov, asp, n, f) {
    var q = 1 / Math.tan(fov / 2), nf = 1 / (n - f);
    return new Float32Array([q / asp, 0, 0, 0, 0, q, 0, 0, 0, 0, (f + n) * nf, -1, 0, 0, 2 * f * n * nf, 0]);
  }
  function tr(x, y, z) { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]); }
  function sc(s) { return new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]); }
  function rx(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); }
  function ry(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); }

  // ---------- Cores do tema ----------
  var probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  document.body.appendChild(probe);
  var ink = [0, 0, 0], accent = [1, .3, .1], dark = false;
  function rgb(v) { probe.style.color = v; var m = getComputedStyle(probe).color.match(/[\d.]+/g); return [m[0] / 255, m[1] / 255, m[2] / 255]; }
  function readColors() {
    ink = rgb('var(--ink)'); accent = rgb('var(--accent)');
    dark = (ink[0] + ink[1] + ink[2]) > 1.5;
    if (calm.matches) draw(0);
  }

  // ---------- Interação ----------
  var mx = 0, my = 0, cmx = 0, cmy = 0, scroll = 0, cscroll = 0, W = 0, H = 0, proj;
  addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  function readScroll() { var max = document.documentElement.scrollHeight - innerHeight; scroll = max > 0 ? scrollY / max : 0; }
  addEventListener('scroll', function () { readScroll(); if (calm.matches) draw(0); }, { passive: true });
  function resize() {
    W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    proj = persp(.9, W / H, .1, 80);
    if (calm.matches) draw(0);
  }
  addEventListener('resize', resize);

  function set(buf, col, a, point, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4f(uC, col[0], col[1], col[2], a);
    gl.uniform1f(uPt, point ? 1 : 0);
    gl.uniform1f(uS, (size || 1) * dpr);
  }

  // ---------- Desenho ----------
  var last = 0;
  function draw(time) {
    var dt = Math.min((time - last) / 1000, .05); last = time;
    cmx += (mx - cmx) * .05; cmy += (my - cmy) * .05;
    cscroll += (scroll - cscroll) * .08;
    var sec = time / 1000;

    // pacotes andam pelas conexões
    if (!calm.matches) {
      for (var k = 0; k < P; k++) {
        var q = packets[k];
        q.t += q.v * dt;
        if (q.t > 1) {
          q.t = 0;
          var end = edges[q.e][q.dir > 0 ? 1 : 0];
          var next = [];
          for (var z = 0; z < edges.length; z++) if (edges[z][0] === end || edges[z][1] === end) next.push(z);
          q.e = next[Math.floor(Math.random() * next.length)];
          q.dir = edges[q.e][0] === end ? 1 : -1;
        }
      }
    }
    for (k = 0; k < P; k++) {
      var p = packets[k], e = edges[p.e], a = nodes[e[0]], b = nodes[e[1]], u = p.dir > 0 ? p.t : 1 - p.t;
      packArr[k * 3] = a[0] + (b[0] - a[0]) * u; packArr[k * 3 + 1] = a[1] + (b[1] - a[1]) * u; packArr[k * 3 + 2] = a[2] + (b[2] - a[2]) * u;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, bPack);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, packArr);

    // câmera: rolagem atravessa a rede, mouse inclina
    var spin = calm.matches ? 0 : sec * .02;
    var view = mul(tr(0, cscroll * 3, -16 + cscroll * 9), mul(rx(.12 + cmy * .25 + cscroll * .35), ry(spin + cmx * .35 + cscroll * 1.4)));
    var mvp = mul(proj, view);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(uM, false, mvp);
    set(bEdges, ink, dark ? .3 : .24, false); gl.drawArrays(gl.LINES, 0, edges.length * 2);
    set(bNodes, ink, dark ? .75 : .6, true, 6); gl.drawArrays(gl.POINTS, 0, N);
    set(bPack, accent, 1, true, 10); gl.drawArrays(gl.POINTS, 0, P);

    // núcleo: dois icosaedros girando em sentidos opostos
    var cx = small ? 0 : 1.2, cy = small ? -4.5 : -4.2;
    var core = mul(tr(cx, cy, -1), mul(ry(sec * .25), mul(rx(sec * .15), sc(2.6))));
    gl.uniformMatrix4fv(uM, false, mul(mvp, core));
    set(bIco, accent, dark ? .75 : .65, false); gl.drawArrays(gl.LINES, 0, ico.length);
    set(bIcoV, accent, 1, true, 9); gl.drawArrays(gl.POINTS, 0, 12);
    var inner = mul(tr(cx, cy, -1), mul(ry(-sec * .4), mul(rx(-sec * .2), sc(1.35))));
    gl.uniformMatrix4fv(uM, false, mul(mvp, inner));
    set(bIco, ink, dark ? .45 : .35, false); gl.drawArrays(gl.LINES, 0, ico.length);
  }

  var running = false, raf = 0;
  function loop(time) { draw(time); raf = requestAnimationFrame(loop); }
  function start() { if (running || calm.matches || document.hidden) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  calm.addEventListener('change', function () { if (calm.matches) { stop(); draw(0); } else start(); });

  // tema: reage ao botão e à preferência do sistema
  new MutationObserver(readColors).observe(document.querySelector('meta[name="color-scheme"]'), { attributes: true });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);

  readScroll(); resize(); readColors();
  if (calm.matches) draw(0); else start();
  canvas.classList.add('on');
})();
