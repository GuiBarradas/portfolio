// A real neural network, not a drawing of one. 2-4-4-1 MLP, tanh hidden,
// sigmoid out, trained with plain SGD on XOR, one epoch per frame, in your
// browser. Edges are the live weights (thickness = magnitude, purple = positive,
// grey = negative), pulses are the live activations, the output goes red when
// the prediction is wrong. Click to re-initialise and watch it learn again.
// Rendered on an 80x50 pixel canvas scaled up with image-rendering: pixelated.
(function () {
  var cv = document.getElementById('net'), cap = document.getElementById('net-cap');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PT = (document.documentElement.lang || '').toLowerCase().indexOf('pt') === 0;

  var sizes = [2, 4, 4, 1], LR = 0.4;
  var X = [[0, 0], [0, 1], [1, 0], [1, 1]], Y = [0, 1, 1, 0];
  var w, b, epoch, loss = 1, correct = 0;

  function rnd() { return Math.random() * 2 - 1; }
  function init() {
    w = []; b = []; epoch = 0;
    for (var l = 0; l < sizes.length - 1; l++) {
      w[l] = []; b[l] = [];
      for (var j = 0; j < sizes[l + 1]; j++) {
        w[l][j] = [];
        for (var i = 0; i < sizes[l]; i++) w[l][j][i] = rnd();
        b[l][j] = 0;
      }
    }
  }
  function forward(x) {
    var acts = [x];
    for (var l = 0; l < w.length; l++) {
      var a = [], last = l === w.length - 1;
      for (var j = 0; j < sizes[l + 1]; j++) {
        var z = b[l][j];
        for (var i = 0; i < sizes[l]; i++) z += w[l][j][i] * acts[l][i];
        a[j] = last ? 1 / (1 + Math.exp(-z)) : Math.tanh(z);
      }
      acts.push(a);
    }
    return acts;
  }
  // one epoch of SGD over the four XOR rows; returns mean squared error
  function train() {
    var total = 0; correct = 0;
    for (var s = 0; s < 4; s++) {
      var acts = forward(X[s]), out = acts[acts.length - 1][0], err = out - Y[s];
      total += err * err;
      if ((out > 0.5) === (Y[s] === 1)) correct++;
      var delta = [err * out * (1 - out)];               // dLoss/dz at the output
      for (var l = w.length - 1; l >= 0; l--) {
        var prev = [];
        for (var i = 0; i < sizes[l]; i++) {
          var g = 0;
          for (var j = 0; j < sizes[l + 1]; j++) g += delta[j] * w[l][j][i];
          prev[i] = g * (1 - acts[l][i] * acts[l][i]);  // tanh'
        }
        for (var j = 0; j < sizes[l + 1]; j++) {
          for (var i = 0; i < sizes[l]; i++) w[l][j][i] -= LR * delta[j] * acts[l][i];
          b[l][j] -= LR * delta[j];
        }
        delta = prev;
      }
    }
    epoch++;
    return total / 4;
  }

  // --- pixels ---
  var pos = [];   // pos[l][j] = [x, y] in canvas pixels
  for (var l = 0; l < sizes.length; l++) {
    pos[l] = [];
    for (var j = 0; j < sizes[l]; j++) pos[l][j] = [6 + l * 22, Math.round((H / (sizes[l] + 1)) * (j + 1))];
  }
  function px(x, y, c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
  function line(x0, y0, x1, y1, c, from, to) {   // bresenham; from..to in 0..1 draws a segment only
    var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy;
    var n = Math.max(dx, -dy), k = 0;
    for (;;) {
      var t = n ? k / n : 0;
      if (t >= from && t <= to) px(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
      k++;
    }
  }
  function node(x, y, c) { ctx.fillStyle = '#0b0512'; ctx.fillRect(x - 2, y - 2, 5, 5); ctx.fillStyle = c; ctx.fillRect(x - 1, y - 1, 3, 3); }
  function mix(a, b, t) { return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')'; }
  var DIM = [58, 35, 89], LIT = [196, 181, 253], LIVE = [182, 255, 92];

  var sample = 0, sampleAt = 0, acts = null;
  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    var maxW = 0.01;
    for (var l = 0; l < w.length; l++) for (var j = 0; j < sizes[l + 1]; j++) for (var i = 0; i < sizes[l]; i++) maxW = Math.max(maxW, Math.abs(w[l][j][i]));
    // edges: alpha by |weight|, hue by sign
    for (var l = 0; l < w.length; l++) for (var j = 0; j < sizes[l + 1]; j++) for (var i = 0; i < sizes[l]; i++) {
      var v = w[l][j][i], a = 0.12 + 0.75 * Math.abs(v) / maxW;
      var c = v >= 0 ? 'rgba(139,92,246,' + a + ')' : 'rgba(169,155,196,' + (a * 0.7) + ')';
      line(pos[l][i][0], pos[l][i][1], pos[l + 1][j][0], pos[l + 1][j][1], c, 0, 1);
    }
    // one forward pass every 700 ms, pulses travel layer by layer (170 ms each)
    var t = now - sampleAt;
    if (!acts || t > 700) { sample = (sample + 1) % 4; acts = forward(X[sample]); sampleAt = now; t = 0; }
    var layer = Math.min(Math.floor(t / 170), w.length - 1), frac = (t % 170) / 170;
    for (var j = 0; j < sizes[layer + 1]; j++) for (var i = 0; i < sizes[layer]; i++) {
      var strength = Math.abs(acts[layer][i] * w[layer][j][i]);
      if (strength < 0.15) continue;
      line(pos[layer][i][0], pos[layer][i][1], pos[layer + 1][j][0], pos[layer + 1][j][1],
        'rgba(182,255,92,' + Math.min(0.6, strength * 0.7) + ')', Math.max(0, frac - 0.08), frac);   // soft: the caption keeps the strong green
    }
    // nodes: brightness = activation, reached so far this pass
    for (var l = 0; l < sizes.length; l++) for (var j = 0; j < sizes[l]; j++) {
      var reached = l <= layer + (frac > 0.95 ? 1 : 0) || l === 0;
      var act = l === 0 ? acts[0][j] : Math.abs(acts[l][j]);
      var c = reached ? mix(DIM, LIT, Math.min(1, act)) : mix(DIM, DIM, 0);
      if (l === sizes.length - 1 && reached) {
        var out = acts[l][0], right = (out > 0.5) === (Y[sample] === 1);
        c = right ? mix(DIM, LIVE, Math.abs(out - 0.5) * 2) : '#ff5c5c';
      }
      node(pos[l][j][0], pos[l][j][1], c);
    }
    // the four xor rows as tiny labels: inputs left, target right
    px(1, pos[0][0][1], acts[0][0] ? '#c4b5fd' : '#3a2359');
    px(1, pos[0][1][1], acts[0][1] ? '#c4b5fd' : '#3a2359');
    px(W - 2, pos[3][0][1], Y[sample] ? '#c4b5fd' : '#3a2359');
  }

  function caption() {
    if (!cap) return;
    cap.innerHTML = PT ? 'xor · época <b>' + epoch + '</b> · perda <b>' + loss.toFixed(4) + '</b> · <b>' + correct + '/4</b> certos'
                       : 'xor · epoch <b>' + epoch + '</b> · loss <b>' + loss.toFixed(4) + '</b> · <b>' + correct + '/4</b> right';
  }

  init();
  if (reduce) {                                    // no animation: train, draw once, done
    for (var e = 0; e < 3000; e++) loss = train();
    acts = forward(X[3]); draw(0); caption();
  } else {
    var last = 0;
    function frame(now) {
      loss = train();                              // one epoch per frame: learning you can watch
      draw(now);
      if (now - last > 250) { caption(); last = now; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  cv.addEventListener('click', function () { init(); });
  cv.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); init(); } });
})();
