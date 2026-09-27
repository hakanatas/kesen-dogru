/* ─────────────────────────────────────────────────────────────
   The film's continuous state as pure functions of time.
   Two parallel lines a and b, a transversal k: eight angles, only two
   different measures. Inside and outside angles; corresponding,
   alternate interior, alternate exterior and same-side angles.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, outBack, outCubic, inOut, hump } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;

  const T = (ctx, s, x, y, o = {}) => A.text(ctx, s, x, y, Object.assign({ size: 48 }, o));
  const AMB = { color: A.amber };
  /** text width in the brush font */
  function width(ctx, s, size) { ctx.save(); ctx.font = `${size}px "LI Brush", "Comic Sans MS", cursive`; const w = ctx.measureText(s).width; ctx.restore(); return w; }
  /** write text, shrinking it to fit width w */
  function fit(ctx, s, x, y, size, w, o = {}) { const m = width(ctx, s, size); T(ctx, s, x, y, Object.assign({ size: m > w ? size * w / m : size }, o)); }
  /** a hand-drawn check mark at (x, y) */
  function tick(ctx, x, y, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x, y], [x + 12, y + 14], [x + 38, y - 20]], { w: 7, p, alpha: a, color: LI.AMBER_RGB, seed: 401, taper: [0.05, 0.3] });
  }
  /** a hand-drawn cross over (x, y) */
  function cross(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, color: LI.AMBER_RGB, seed: 411, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, color: LI.AMBER_RGB, seed: 412, taper: [0.1, 0.3] });
  }

  /** text whose last k characters can glow amber (h: 0..1) */
  function hotTail(ctx, s, x, y, size, k, h, o = {}) {
    const w = width(ctx, s, size), head = s.slice(0, s.length - k), tail = s.slice(s.length - k), wh = width(ctx, head, size);
    const a = o.alpha ?? 1, base = Object.assign({}, o, { size, align: 'left' });
    if (head) T(ctx, head, x - w / 2, y, base);
    if (h < 1) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, { alpha: a * (1 - h) }));
    if (h > 0) T(ctx, tail, x - w / 2 + wh, y, Object.assign({}, base, AMB, { alpha: a * h }));
  }
  /** the big number, digit by digit; hot(i) → 0..1 amber for digit i (spaces skipped) */
  const NUMBER = '2,375';
  function bigNum(ctx, NUM, a, p, hot) {
    if (a <= 0) return;
    const w = width(ctx, NUMBER, NUM.s); let x = NUM.x - w / 2, di = 0;
    [...NUMBER].forEach((ch, j) => {
      const cw = width(ctx, ch, NUM.s);
      if (/[0-9]/.test(ch)) {
        const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2), h = hot(di++);
        if (k > 0) {
          const y = NUM.y - 20 * (1 - outBack(k)) - 10 * h;
          if (h < 1) T(ctx, ch, x + cw / 2, y, { size: NUM.s, alpha: a * k * (1 - h) });
          if (h > 0) T(ctx, ch, x + cw / 2, y, Object.assign({ size: NUM.s * (1 + 0.08 * h), alpha: a * k * h }, AMB));
        }
      }
      else if (ch !== ' ') { const k = seg(p, j / NUMBER.length * 0.8, j / NUMBER.length * 0.8 + 0.2); if (k > 0) T(ctx, ch, x + cw / 2, NUM.y, { size: NUM.s, alpha: a * k }); }
      x += cw;
    });
  }
  /* ── fractions and expressions ──────────────────────────── */
  /** width of one expression item (a string, or {n, d} for a fraction) */
  function itemW(ctx, it, s) { return typeof it === 'string' ? width(ctx, it, s) : Math.max(width(ctx, String(it.n), s * 0.72), width(ctx, String(it.d), s * 0.72)) + s * 0.25; }
  /** a row of text and stacked fractions, centred at x */
  function expr(ctx, items, x, y, s, o = {}) {
    const a = o.alpha ?? 1, col = o.color ? { color: o.color } : {};
    let w = items.reduce((u, it) => u + itemW(ctx, it, s), 0);
    const sc = o.w && w > o.w ? o.w / w : 1; s *= sc; w *= sc;
    let cx = x - w / 2;
    items.forEach((it) => {
      const iw = itemW(ctx, it, s);
      if (typeof it === 'string') T(ctx, it, cx, y, Object.assign({ size: s, alpha: a, align: 'left', halo: o.halo }, col));
      else {
        const fc = it.hot ? AMB : col, m = cx + iw / 2;
        T(ctx, String(it.n), m, y - s * 0.42, Object.assign({ size: s * 0.72, alpha: a }, fc));
        ctx.strokeStyle = it.hot ? `rgba(${LI.AMBER_RGB},${a})` : `rgba(${LI.INK_RGB},${0.85 * a})`; ctx.lineWidth = Math.max(2.5, s * 0.055);
        ctx.beginPath(); ctx.moveTo(cx + s * 0.1, y + 2); ctx.lineTo(cx + iw - s * 0.1, y + 2); ctx.stroke();
        T(ctx, String(it.d), m, y + s * 0.46, Object.assign({ size: s * 0.72, alpha: a }, fc));
      }
      cx += iw;
    });
  }
  const fr = (n, d, hot) => ({ n, d, hot });

  /* ── two parallels and a transversal ────────────────────── */
  /** geometry for transversal angle th (degrees): the two crossing points */
  function geom(G, th) {
    const P = [G.px, G.y1], dx = (G.y2 - G.y1) / Math.tan(th * Math.PI / 180), Q = [G.px - dx, G.y2];
    return { P, Q, th };
  }
  /** the 8 angles: [corner, from, to] in math degrees; 1–4 at P, 5–8 at Q (1 top-left, 2 top-right, 3 bottom-left, 4 bottom-right) */
  function angles(g) {
    const th = g.th, sp = [[th, 180], [0, th], [180, 180 + th], [180 + th, 360]];
    return [0, 1].flatMap((k) => sp.map(([a0, a1]) => [k ? g.Q : g.P, a0, a1]));
  }
  const measure = (g, i) => { const [, a0, a1] = angles(g)[i]; return Math.round(a1 - a0); };
  /** an ink arc (not a measurement) */
  function inkArc(ctx, C, r, d0, d1, a) {
    if (a <= 0) return; ctx.strokeStyle = `rgba(${LI.INK_RGB},${0.6 * a})`; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, -d1 * Math.PI / 180, -d0 * Math.PI / 180); ctx.stroke();
  }
  /** the lines, drawn to k (line a, line b, transversal) */
  function lines(ctx, G, g, k, a, ghost) {
    if (a <= 0) return;
    const ln = (p, q, kk, seed, al = a) => { if (kk > 0) Ink.path(ctx, [p, q], { w: 6, p: kk, alpha: al, seed, taper: [0.05, 0.05], wob: 0.15 }); };
    ln([G.x0, G.y1], [G.x1, G.y1], k[0], 1401); ln([G.x0, G.y2], [G.x1, G.y2], k[1], 1402);
    const d = [Math.cos(g.th * Math.PI / 180), -Math.sin(g.th * Math.PI / 180)];
    ln([g.Q[0] - d[0] * G.ext, g.Q[1] - d[1] * G.ext], [g.P[0] + d[0] * G.ext, g.P[1] + d[1] * G.ext], k[2], 1403);
    // parallel marks
    [G.y1, G.y2].forEach((y, i) => { const g2 = seg(k[i], 0.8, 1); if (g2 > 0) { const x = G.x0 + 90;
      [0, 18].forEach((o, j) => Ink.path(ctx, [[x + o - 10, y - 12], [x + o + 4, y], [x + o - 10, y + 12]], { w: 3.5, alpha: a * g2, seed: 1410 + i * 2 + j, taper: [0, 0] })); } });
    if (seg(k[0], 0.9, 1) > 0) T(ctx, 'a', G.x1 + 28, G.y1, { size: 40, alpha: a * seg(k[0], 0.9, 1) });
    if (seg(k[1], 0.9, 1) > 0) T(ctx, 'b', G.x1 + 28, G.y2, { size: 40, alpha: a * seg(k[1], 0.9, 1) });
    if (seg(k[2], 0.9, 1) > 0) { const e = [g.P[0] + d[0] * (G.ext + 30), g.P[1] + d[1] * (G.ext + 30)]; T(ctx, 'k', e[0], e[1], { size: 40, alpha: a * seg(k[2], 0.9, 1) }); }
  }

  /** an ink (not amber) cross for "not divisible" */
  function crossInk(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, seed: 421, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, seed: 422, taper: [0.1, 0.3] });
  }

  /** Nokta, as a function of time */
  function nokta(t, env) {
    const L = KD.L(env);
    const p = { x: L.nx, y: L.gy, s: L.s, mouth: 0.4, brow: 0.1 };
    const g = outCubic(seg(t, 1.3, 2.3));
    p.born = { body: lerp(0.3, 1, g), legs: outCubic(seg(t, 2.0, 2.6)), arms: outCubic(seg(t, 2.3, 2.8)), tuft: outBack(seg(t, 2.5, 2.9)) };
    if (t < 3.0) { p.sq = lerp(0.4, 1, clamp(LI.E.spring(seg(t, 1.3, 3.0) * 2, 8, 3.4), 0, 1.3)); p.drop = 1 - g; p.wobble = 1 - seg(t, 1.3, 2.8); }
    p.eyeOpen = outCubic(seg(t, 2.8, 3.1));
    KD.look(p, [L.G.px - 60, (L.G.y1 + L.G.y2) / 2]);
    if ((t > 20.4 && t < 28) || (t > 70.4 && t < 80)) KD.look(p, [L.W.x, L.W.y[1]]);
    if (t > 80 && t < 84) KD.look(p, [L.SUM.x, L.SUM.y[1]]);
    if (t > 2.9 && t < 5.6) { p.hold = 'brush'; p.brushAng = -0.8 + 0.3 * Math.sin(t * 9); p.hands = { R: [1.35, -0.2 + 0.15 * Math.sin(t * 9)] }; }
    const pointing = (a, b) => { if (t > a && t < b) { p.point = 'R'; p.hands = { L: [-1.2, 0.55], R: [1.5, -0.35] }; } };
    pointing(11.0, 12.6); pointing(28.8, 30.4); pointing(37.2, 38.8); pointing(47.0, 48.6); pointing(52.6, 54.2); pointing(58.6, 60.2); pointing(64.6, 66.2); pointing(80.6, 82.4);
    const think = seg(t, 70.6, 71.0) * (1 - seg(t, 72.6, 72.9));
    if (think > 0) { p.hands = { L: [-1.2, 0.55], R: [0.75, -1.05 + 0.08 * Math.sin(t * 14)] }; p.brow = -0.5 * think; p.mouth = 0; p.lookY -= 0.3; }
    if (t > 48.6 && t < 49.8) { p.mouthOpen = 0.55; p.eyeScale = 1.1; }
    const joy = (a, b) => { if (t > a && t < b) { p.squint = 1; p.mouth = 1; p.sq = 1 + 0.1 * hump(t, a, a + 0.6); p.y -= 26 * hump(t, a, a + 0.6); p.hands = { L: [-1.3, -0.35], R: [1.3, -0.35] }; } };
    joy(25.6, 27.2); joy(67.6, 69.2); joy(77.6, 79.2);
    if (t > 84.0) {
      const j = (t - 84.0) % 1.4;
      p.squint = 1; p.mouth = 1; p.turn = 0.15; p.lookX = 0.3; p.lookY = 0;
      p.sq = 1 + 0.1 * Math.sin(Math.PI * clamp(j / 0.6)); p.y -= 40 * Math.sin(Math.PI * clamp(j / 0.6));
      p.hands = { L: [-1.35, -0.6 - 0.2 * Math.sin(t * 6)], R: [1.35, -0.6 + 0.2 * Math.sin(t * 6)] };
      if (t > 89.2) { p.squint = 0; p.lookX = 0; p.lookY = 0.2; p.turn = 0; p.y = L.gy; p.sq = 1; p.hands = { L: [-1.2, 0.55], R: [1.2, -1.0 + 0.25 * Math.sin(t * 10)] }; }
    }
    p.blink = Math.max(hump(t, 5.8, 5.95), hump(t, 18.0, 18.15), hump(t, 33.0, 33.15), hump(t, 50.0, 50.15), hump(t, 70.0, 70.15), hump(t, 81.0, 81.15));
    return p;
  }

  function base(ctx, env, t, cam, drawBefore) {
    const L = KD.L(env);
    LI.Ambient.specks(ctx, env, cam, t, { alpha: 0.22, n: 18, depth: 0.4, seed: 21 });
    LI.Camera.apply(ctx, env, cam);
    KD.ground(ctx, env, L.nx, L.gy);
    if (drawBefore) drawBefore();
    LI.Nokta.draw(ctx, LI.Nokta.follow((tt) => nokta(tt, env), t), t);
    if (t < 1.35 && t > 0.3) { const f = seg(t, 0.3, 1.3); Ink.dot(ctx, L.nx, lerp(-700, L.gy - 14, f * f), 15, { seed: 2, bleed: 0 }); }
    if (t > 1.3) Ink.drops(ctx, L.nx, L.gy - 4, t - 1.3, { n: 9, seed: 5, ground: L.gy + 4, scale: 0.8, alpha: 1 - seg(t, 4, 8) * 0.6 });
    return L;
  }

  LI.Film = { T, AMB, width, fit, tick, cross, crossInk, expr, fr, geom, angles, measure, inkArc, lines, nokta, base };
})(window.LI = window.LI || {});
