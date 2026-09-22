// Splash text, like the yellow one next to the Minecraft logo. One per page
// load, then a new one every 10 s (or on click). Keep them short and true.
(function () {
  var el = document.getElementById('splash');
  if (!el) return;
  var lines = [
    'also try Go!',
    '40 KB or it doesn\'t ship',
    '100% real metrics, press F3',
    'now with 8 C418 tracks',
    'started with redstone',
    'don\'t click the red one',
    'rio de janeiro, brasil',
    'not a next.js site',
    'one static binary',
    'zero npm packages',
    'templ, not react',
    'judging code since 2022',
    'click the avatar. sorry.',
    'the radio is live, really',
    'hearts regenerate, be patient',
    'every fifth hit is a crit',
    'ships from a scratch image',
    'pixel art by hand',
    'graceful shutdown included',
    'alligator: 1, me: 1',
    'lvl 24',
    'goroutines: a few',
    'nothing is created, everything is copied',
    'the neural net is real. click it.',
    'hej Mojang! 10 706 km from Rio. will relocate.',
    'the F3 is not a mockup',
    'no cookies, no trackers',
    'hand-drawn sword cursor'
  ];
  var i = Math.floor(Math.random() * lines.length);
  function show() { el.textContent = lines[i]; }
  show();
  function next() {
    i = (i + 1 + Math.floor(Math.random() * (lines.length - 1))) % lines.length; // never the same twice
    show();
  }
  var timer = setInterval(next, 10000);
  el.addEventListener('click', function () {
    next();
    clearInterval(timer);
    timer = setInterval(next, 10000); // a click restarts the 10 s clock
  });
})();
