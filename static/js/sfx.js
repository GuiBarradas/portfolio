// Sound effects, avatar hit points, death and respawn. No framework, no build step.
// The sounds are the game's own, copied by scripts/mc_sfx.py into static/sfx/.
(function () {
  var files = {
    click: '/static/sfx/click.ogg?v=2', hurt: '/static/sfx/hurt.ogg?v=2',
    death: '/static/sfx/death.ogg?v=1', fall: '/static/sfx/fall.ogg?v=1'
  };
  var real = {};   // name -> HTMLAudioElement; kept referenced so the browser does not GC it mid-load

  Object.keys(files).forEach(function (k) {
    var a = new Audio();
    a.preload = 'auto';
    a.src = files[k];
    real[k] = a;
  });
  // no readiness check: phones ignore preload, so the first play() is what loads the file
  function play(k) {
    var a = real[k];
    if (!a) return;
    try { a.currentTime = 0; } catch (e) {}
    a.play().catch(function () {});   // autoplay policy: stay silent
  }

  // Every tile-ish thing clicks: hotbar slots (radio included), buttons, cards, inventory slots, links.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('.slot, .btn, .rbtn, .card, .inv-slot, .links a');
    if (el) play('click');
  });

  // Avatar: hover shows a sword (css). Hits flash red, knock back, go "oof" and cost HP.
  // At 0 HP the avatar falls over minecraft-style, turns to smoke and the death screen shows.
  var avatar = document.querySelector('.avatar-frame');
  var img = avatar && avatar.querySelector('img');
  var hpEl = document.getElementById('hp');
  var death = document.getElementById('death');
  if (!avatar || !img || !hpEl || !death) return;

  var MAX = 100, hp = MAX, hits = 0, dead = false, hitTimer = null, lastHit = 0;

  // --- hearts: 10 of them, 10 HP each, drawn as 9x8 pixel art from these rows ---
  var ROWS = ['.BB...BB.', 'BHRB.BHRB', 'BRRRBRRRB', 'BRRRRRRRB', '.BRRRRRB.', '..BRRRB..', '...BRB...', '....B....'];
  var INK = { B: '%230b0512', R: '%23ff1f1f', H: '%23ff8f8f', E: '%23311a31' };
  function heartSVG(rightEmpty, allEmpty) {
    var s = '';
    ROWS.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var c = row[x];
        if (c === '.') continue;
        if (c !== 'B' && (allEmpty || (rightEmpty && x >= 4))) c = 'E';
        s += "<rect x='" + x + "' y='" + y + "' width='1' height='1' fill='" + INK[c] + "'/>";
      }
    });
    return "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='16' viewBox='0 0 9 8' shape-rendering='crispEdges'>" + s + '</svg>")';
  }
  var HEART = { full: heartSVG(false, false), half: heartSVG(true, false), empty: heartSVG(false, true) };
  for (var i = 0; i < MAX / 10; i++) {
    var h = document.createElement('i');
    h.style.setProperty('--jit', (Math.random() * 0.5).toFixed(2) + 's');   // low-health shake is out of step per heart, like the game
    hpEl.appendChild(h);
  }
  var hearts = hpEl.children;

  // regen bounce: each heart hops in turn, left to right, while health is coming back
  function wave() {
    for (var i = 0; i < hearts.length; i++) {
      (function (h, delay) {
        setTimeout(function () { h.classList.remove('is-regen'); void h.offsetWidth; h.classList.add('is-regen'); }, delay);
      })(hearts[i], i * 45);
    }
  }
  function regenerating() { return !dead && hp < MAX && Date.now() - lastHit >= 6000; }
  setInterval(function () { if (regenerating()) wave(); }, 700);

  function renderHP() {
    for (var i = 0; i < hearts.length; i++) {
      var left = hp - i * 10;
      hearts[i].style.backgroundImage = left >= 10 ? HEART.full : left >= 5 ? HEART.half : HEART.empty;
    }
    hpEl.setAttribute('aria-label', (document.documentElement.lang || '').indexOf('pt') === 0 ? 'Vida: ' + hp + ' de ' + MAX : 'Health: ' + hp + ' of ' + MAX);
    hpEl.classList.toggle('is-low', hp > 0 && hp <= 20);
  }
  renderHP();

  // regen: like a fed player, half a heart every 1.5 s once you leave him alone for 6 s
  setInterval(function () {
    if (!regenerating()) return;
    hp = Math.min(MAX, hp + 5);
    renderHP();
  }, 1500);

  function hit(x, y) {
    if (dead) return;
    hits++;
    lastHit = Date.now();
    var crit = hits % 5 === 0;
    var dmg = crit ? 25 : 5 * (1 + (hits % 3));
    hp = Math.max(0, hp - dmg);
    renderHP();
    hpEl.classList.remove('is-hurt'); void hpEl.offsetWidth; hpEl.classList.add('is-hurt');   // hearts flash white
    setTimeout(function () { hpEl.classList.remove('is-hurt'); }, 350);
    play(hp === 0 ? 'death' : 'hurt');   // the killing blow gets the deeper oof

    avatar.classList.remove('is-hit');
    void img.offsetWidth; // restart the css animation
    avatar.classList.add('is-hit');
    clearTimeout(hitTimer);
    hitTimer = setTimeout(function () { avatar.classList.remove('is-hit'); }, 500);

    var tag = document.createElement('span');
    tag.className = 'dmg' + (crit ? ' dmg-crit' : '');
    tag.textContent = (crit ? 'crit! ' : '') + '-' + dmg;
    var r = img.getBoundingClientRect();
    tag.style.left = (x == null ? r.width / 2 : x - r.left) + 'px';
    tag.style.top = (y == null ? r.height / 3 : y - r.top) + 'px';
    avatar.appendChild(tag);
    setTimeout(function () { tag.remove(); }, 700);

    if (hp === 0) die();
  }

  function smoke() {
    var r = img.getBoundingClientRect();
    for (var i = 0; i < 16; i++) {
      var p = document.createElement('span');
      p.className = 'smoke';
      var size = 10 + Math.floor(Math.random() * 3) * 6;
      p.style.width = p.style.height = size + 'px';
      p.style.left = (r.width * (0.15 + Math.random() * 0.7)) + 'px';
      p.style.top = (r.height * (0.35 + Math.random() * 0.55)) + 'px';
      p.style.animationDelay = (Math.random() * 250) + 'ms';
      avatar.appendChild(p);
      p.addEventListener('animationend', function (e) { e.target.remove(); });
    }
  }

  function die() {
    dead = true;
    avatar.classList.remove('is-hit');
    avatar.classList.add('is-dead');
    setTimeout(function () { play('fall'); smoke(); }, 650);   // thud + smoke once he is on the ground
    setTimeout(function () {                   // then the red screen
      document.getElementById('death-score').textContent = hits;
      death.hidden = false;
      document.getElementById('respawn').focus();
    }, 1400);
  }

  function respawn() {
    death.hidden = true;
    avatar.classList.remove('is-dead', 'is-hit');
    avatar.classList.add('is-respawn');
    setTimeout(function () { avatar.classList.remove('is-respawn'); }, 400);
    hp = MAX; dead = false; lastHit = 0;
    renderHP();
    img.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('avatar:respawn'));   // egg.js listens
  }

  document.getElementById('respawn').addEventListener('click', respawn);
  document.getElementById('title-screen').addEventListener('click', function () {
    location.hash = '';
    location.reload();
  });
  img.addEventListener('click', function (e) { hit(e.clientX, e.clientY); });   // click, not pointerdown: a touch pointerdown is not a user gesture for audio
  img.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(); }
  });
  img.addEventListener('dragstart', function (e) { e.preventDefault(); });
})();
