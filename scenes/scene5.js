/* SAHNE 5 — BİR AÇIDAN HEPSİNE (70–80 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 5, start: 70, end: 80, name: 'From one angle to all', nameTr: 'Bir açıdan hepsine', concept: '70° and 110°', conceptTr: '70° ve 110°', render });
})(window.LI = window.LI || {});
