/* SAHNE 1 — PARALELLER VE KESEN (0–10 s)  Lines a and b, and k across them.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const th = (t) => 60 + 10 * inOut(seg(t, 70.8, 71.8));

  /** which pairs glow when: [start, end, list of angle indices (0-based)] */
  const GROUPS = [
    [28.6, 36.8, [2, 3, 4, 5]], [37.0, 45.8, [0, 1, 6, 7]],
    [46.6, 52.0, [1, 5]], [52.4, 58.0, [2, 5, 3, 4]], [58.4, 64.0, [0, 7, 1, 6]], [64.4, 69.8, [2, 4, 3, 5]],
  ];
  const glow = (t, i) => GROUPS.reduce((h, [a, b, list]) => Math.max(h, list.includes(i) ? win(t, a, b) : 0), 0);

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'a ve b paralel, k doğrusu ikisini de kesiyor'],
      [10.6, 19.8, 'İki kesişim noktasında 8 açı oluşur'],
      [20.0, 27.8, 'Açıları ölçelim'],
      [28.4, 36.8, 'Paralellerin arasındakiler iç açılar'],
      [37.0, 45.8, 'Dışarıdakiler dış açılar'],
      [46.4, 69.8, 'Açıları çiftler hâlinde adlandıralım'],
      [70.4, 79.8, 'k biraz dönse, bir açı 70° olsa?'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), G = L.G, f = F(), a = END(t), g = f.geom(G, th(t));
    // the band between the parallels
    const band = win(t, 28.6, 36.8);
    if (band > 0) { ctx.fillStyle = `rgba(${LI.AMBER_RGB},${0.1 * band})`; ctx.fillRect(G.x0, G.y1, G.x1 - G.x0, G.y2 - G.y1); }
    f.lines(ctx, G, g, [seg(t, 4.6, 5.6), seg(t, 5.2, 6.2), seg(t, 7.0, 8.2)], a * (1 - seg(t, 79.8, 80.6)));
    // a ghost copy of the upper crossing sliding down onto the lower one
    const sl = seg(t, 47.4, 49.4) * (1 - seg(t, 51.4, 52.0));
    if (sl > 0) {
      const m = inOut(seg(t, 47.4, 49.4)), C = [lerp(g.P[0], g.Q[0], m), lerp(g.P[1], g.Q[1], m)], d = [Math.cos(g.th * Math.PI / 180), -Math.sin(g.th * Math.PI / 180)];
      LI.Ink.path(ctx, [[C[0] - 160, C[1]], [C[0] + 160, C[1]]], { w: 4, alpha: 0.5 * sl, color: LI.AMBER_RGB, seed: 1450, taper: [0.1, 0.1] });
      LI.Ink.path(ctx, [[C[0] - d[0] * 120, C[1] - d[1] * 120], [C[0] + d[0] * 120, C[1] + d[1] * 120]], { w: 4, alpha: 0.5 * sl, color: LI.AMBER_RGB, seed: 1451, taper: [0.1, 0.1] });
      A.wedge(ctx, C, G.r * 1.3, 0, g.th, 0.35 * sl);
    }
    if (t > 10.6 && t < 80.4) {
      const fa = a * (1 - seg(t, 79.8, 80.4));
      f.angles(g).forEach(([C, d0, d1], i) => {
        const k = seg(t, 11.0 + i * 0.5, 11.5 + i * 0.5) * fa; if (k <= 0) return;
        const h = glow(t, i);
        if (h > 0) A.wedge(ctx, C, G.r * 1.25, d0, d1, 0.4 * h);
        f.inkArc(ctx, C, G.r * (i % 2 ? 1 : 0.85), d0, d1, k);
        const mid = (d0 + d1) / 2, pt = A.at(C, mid, G.nr), ms = t > 20.4 ? seg(t, 20.4 + i * 0.25, 20.8 + i * 0.25) : 0;
        f.T(ctx, String(i + 1), pt[0], pt[1], Object.assign({ size: G.s, alpha: k }, h > 0.5 ? f.AMB : {}));
        if (ms > 0) { const q = A.at(C, mid, G.nr + 50); f.T(ctx, `${f.measure(g, i)}°`, q[0], q[1], Object.assign({ size: G.s * 0.72, alpha: k * ms * (1 - win(t, 28.4, 69.8) * 0.6) }, f.AMB)); }
      });
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[21.0, 27.8, '1, 4, 5, 8: 120°      2, 3, 6, 7: 60°'], [30.0, 45.8, 'İç açılar: 3, 4, 5, 6'],
      [46.6, 52.0, 'Yöndeş açılar: 1 ve 5, 2 ve 6, 3 ve 7, 4 ve 8'], [52.4, 58.0, 'İç ters açılar: 3 ve 6, 4 ve 5'],
      [58.4, 64.0, 'Dış ters açılar: 1 ve 8, 2 ve 7'], [64.4, 69.8, 'Karşı durumlu açılar: 3 ve 5, 4 ve 6 · 1 ve 7, 2 ve 8'],
      [72.0, 79.8, '2 = 70° ise 3, 6, 7 de 70°']]);
    exprs(ctx, t, at(W, 1), [[23.4, 27.8, 'Sadece iki farklı ölçü var: 60° ve 120°', true], [37.6, 45.8, 'Dış açılar: 1, 2, 7, 8'],
      [48.2, 52.0, 'Aynı yöne bakarlar; ölçüleri eşittir', true], [54.0, 58.0, 'Paralellerin arasında, kesenin iki yanında; eşittir', true],
      [60.0, 64.0, 'Paralellerin dışında, kesenin iki yanında; eşittir', true], [66.0, 69.8, 'Kesenin aynı yanında; toplamları 180°', true],
      [74.0, 79.8, '1, 4, 5, 8: 180° − 70° = 110°', true]]);
    exprs(ctx, t, at(W, 2), [[76.0, 79.8, 'Bir açıyı bilen, sekizini de bilir']]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Yöndeş açılar eşittir', 80.6], ['İç ters ve dış ters açılar eşittir', 81.6], ['Karşı durumlu açıların toplamı 180°', 82.6], ['8 açıda yalnızca iki ölçü var', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.15 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Parallels and a transversal', nameTr: 'Paraleller ve kesen', concept: 'Lines a, b and k', conceptTr: 'a, b ve k doğruları', render });
})(window.LI = window.LI || {});
