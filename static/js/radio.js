// Radio client. The server decides what is on air; this tunes in, and lets you
// wander: << and >> jump within the loop (you fall back to the live schedule
// when that track ends), || pauses, the slider is volume. Press R to toggle.
// The station survives navigation: state is kept in localStorage and the next
// page picks it up (live mode re-syncs by the clock, manual mode resumes where
// it was). If the browser refuses autoplay, the bar asks for one tap.
//
// Phones: one <audio> element for the whole session, unlocked by play() inside
// the tap that turns the radio on. iOS only lets an element play later (next
// track, after a fetch) if it already played once during a user gesture.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var bar = $('radio'), btn = $('radio-toggle'), np = $('radio-np');
  var prev = $('radio-prev'), pause = $('radio-pause'), next = $('radio-next'), vol = $('radio-volume');
  if (!bar || !btn || !np) return;

  var on = false, paused = false, timer = null;
  var audio = new Audio();
  audio.preload = 'auto';
  var SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
  var PT = (document.documentElement.lang || '').toLowerCase().indexOf('pt') === 0;
  var S = PT ? { live: 'ao vivo', next: 'próxima', tuning: 'sintonizando…', none: 'nada programado', offline: 'offline, tentando de novo…', pause: 'pausar', play: 'tocar' }
             : { live: 'live', next: 'next', tuning: 'tuning…', none: 'nothing scheduled', offline: 'offline, retrying…', pause: 'pause', play: 'play' };
  S.resume = PT ? 'toque em qualquer lugar pra retomar o rádio' : 'tap anywhere to resume the radio';
  var playlist = null;   // [{title, artist, url, duration_s}], fetched once
  var current = -1;      // index into playlist
  var live = true;       // following the schedule, or wandering after << / >>
  var volume = 0.5;
  try { volume = Math.min(1, Math.max(0, +localStorage.getItem('radio-vol') || 0.5)); } catch (e) {}
  vol.value = Math.round(volume * 100);
  audio.volume = volume;

  function hasTrack() { return !!audio.getAttribute('src') && audio.getAttribute('src') !== SILENT; }
  function stopAudio() {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    clearTimeout(timer);
  }
  // play() inside a user gesture, on the element we will keep reusing
  function unlock() {
    if (hasTrack()) return;
    audio.src = SILENT;
    audio.play().catch(function () {});
  }

  // --- persistence across pages ---
  var startOffset = 0, startedAt = 0;   // where the current track was asked to start, and when
  function position() {
    if (!hasTrack()) return 0;
    if (audio.currentTime > 0) return audio.currentTime;
    return startOffset + (paused ? 0 : (Date.now() - startedAt) / 1000);   // not loaded yet: extrapolate
  }
  function save() {
    try {
      localStorage.setItem('radio', JSON.stringify({
        on: on, live: live, index: current, paused: paused, pos: position(), at: Date.now()
      }));
    } catch (e) {}
  }
  function saved() {
    try { return JSON.parse(localStorage.getItem('radio') || 'null'); } catch (e) { return null; }
  }
  window.addEventListener('pagehide', save);

  function title(text) {
    np.textContent = text;
    // constant scroll speed regardless of text length: ~70 px/s
    var w = np.parentElement.clientWidth + np.scrollWidth;
    np.style.setProperty('--marquee', Math.max(8, w / 70) + 's');
    np.style.animation = 'none';
    void np.offsetWidth;
    np.style.animation = '';
  }

  function loadPlaylist() {
    if (playlist) return Promise.resolve(playlist);
    return fetch('/radio/playlist', { cache: 'no-store' }).then(function (r) { return r.json(); })
      .then(function (j) { playlist = j.tracks || []; return playlist; });
  }

  function setPaused(p) {
    paused = p;
    pause.textContent = p ? '>' : '||';
    pause.title = p ? S.play : S.pause;
    pause.setAttribute('aria-pressed', p ? 'true' : 'false');
  }

  function play(track, offset, idx) {
    clearTimeout(timer);
    current = idx;
    startOffset = offset || 0; startedAt = Date.now();
    var t0 = Date.now();
    audio.onloadedmetadata = function () {
      if (offset > 0) audio.currentTime = Math.min(offset + (Date.now() - t0) / 1000, Math.max(0, audio.duration - 0.1));
      audio.play().catch(function () {
        // autoplay refused (fresh page, no gesture yet): wait for one, then resume
        title(S.resume);
        var resume = function () {
          document.removeEventListener('click', resume); document.removeEventListener('keydown', resume);
          if (!on) return;
          if (live) { unlock(); tuneLive(); } else audio.play().catch(function () {});
        };
        document.addEventListener('click', resume); document.addEventListener('keydown', resume);
      });
    };
    audio.onended = function () { live = true; tuneLive(); };
    audio.onerror = function () { timer = setTimeout(tuneLive, 3000); };
    audio.src = track.url;
    audio.load();
    setPaused(false);
    var nextTrack = playlist && playlist.length ? playlist[(idx + 1) % playlist.length] : null;
    title((live ? '● ' + S.live + '  ·  ' : '') + track.title + ' — ' + track.artist +
      (nextTrack ? '  ·  ' + S.next + ': ' + nextTrack.title : ''));
    save();
  }

  function tuneLive() {
    if (!on) return;
    live = true;
    Promise.all([loadPlaylist(), fetch('/radio/now', { cache: 'no-store' }).then(function (r) { return r.json(); })])
      .then(function (res) {
        var s = res[1];
        if (!on) return;
        if (!s.url) { stopAudio(); title(S.none); return; }
        play({ title: s.title, artist: s.artist, url: s.url }, s.offset_s, s.index);
      })
      .catch(function () { title(S.offline); timer = setTimeout(tuneLive, 3000); });
  }

  function jump(step) {
    if (!on) return;
    loadPlaylist().then(function (p) {
      if (!p.length) return;
      live = false;
      var idx = ((current < 0 ? 0 : current) + step + p.length) % p.length;
      play(p[idx], 0, idx);
    });
  }

  function togglePause() {
    if (!on || !hasTrack()) return;
    if (paused) {
      setPaused(false);
      if (live) tuneLive(); else audio.play().catch(function () {});   // live radio does not wait for you
    } else {
      setPaused(true);
      audio.pause();
    }
    save();
  }

  function onAir(restore) {
    on = true;
    btn.setAttribute('aria-pressed', 'true');
    bar.hidden = false;
    document.body.classList.add('radio-on');
    title(S.tuning);
    if (restore && !restore.live && restore.index >= 0) {
      // manual mode on the previous page: pick the same track up where it was
      loadPlaylist().then(function (p) {
        var t = p[restore.index];
        if (!t) return tuneLive();
        live = false;
        var offset = (restore.pos || 0) + (restore.paused ? 0 : (Date.now() - restore.at) / 1000);
        if (offset >= t.duration_s) return tuneLive();
        play(t, offset, restore.index);
        if (restore.paused) togglePause();
      });
      return;
    }
    tuneLive();
  }
  function off() {
    on = false;
    setPaused(false);
    btn.setAttribute('aria-pressed', 'false');
    stopAudio();
    bar.hidden = true;
    document.body.classList.remove('radio-on');
    save();
  }

  // was it on when the last page was left? then it is still on.
  var last = saved();
  if (last && last.on) onAir(last);

  btn.addEventListener('click', function () { if (on) { off(); } else { unlock(); onAir(); } });
  prev.addEventListener('click', function () { jump(-1); });
  next.addEventListener('click', function () { jump(1); });
  pause.addEventListener('click', togglePause);
  vol.addEventListener('input', function () {
    volume = vol.value / 100;
    audio.volume = volume;
    try { localStorage.setItem('radio-vol', volume); } catch (e) {}
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey && e.target.tagName !== 'INPUT') btn.click();
  });
})();
