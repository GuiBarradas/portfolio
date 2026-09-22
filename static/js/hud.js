// F3 debug overlay. No framework, no build step. ~2 KB.
(function () {
  var hud = document.getElementById('hud');
  var btn = document.getElementById('hud-toggle');
  if (!hud || !btn) return;

  var es = null;
  var $m = function (k) { return hud.querySelector('[data-m="' + k + '"]'); };
  var $c = function (k) { return hud.querySelector('[data-c="' + k + '"]'); };
  var fmt = function (n, d) { return Number(n).toFixed(d == null ? 1 : d); };
  var hms = function (s) {
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    return (h ? h + 'h ' : '') + (m ? m + 'm ' : '') + x + 's';
  };

  function paintClient() {
    var nav = performance.getEntriesByType('navigation')[0];
    var res = performance.getEntriesByType('resource');
    if (nav) {
      $c('ttfb').textContent = fmt(nav.responseStart - nav.requestStart);
      $c('dom').textContent = fmt(nav.domContentLoadedEventEnd - nav.startTime, 0);
    }
    var total = nav ? nav.transferSize : 0, js = 0;
    res.forEach(function (r) {
      if (r.name.indexOf('/metrics/stream') !== -1) return;
      total += r.transferSize || 0;
      if (r.initiatorType === 'script') js += r.transferSize || 0;
    });
    $c('weight').textContent = fmt(total / 1024);
    $c('js').textContent = fmt(js / 1024);
    $c('reqs').textContent = res.length + 1;
    var fcp = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcp) $c('fcp').textContent = fmt(fcp.startTime, 0);
  }

  function apply(s) {
    $m('uptime').textContent = hms(s.uptime_s);
    $m('requests').textContent = s.requests;
    $m('rps').textContent = fmt(s.rps);
    $m('p50').textContent = fmt(s.p50_ms, 2);
    $m('p99').textContent = fmt(s.p99_ms, 2);
    $m('heap').textContent = fmt(s.heap_mb);
    $m('sys').textContent = fmt(s.sys_mb);
    $m('goroutines').textContent = s.goroutines;
    $m('numgc').textContent = s.num_gc;
    $m('gcpause').textContent = fmt(s.gc_pause_us, 0);
    $m('cpuuser').textContent = s.cpu_user_ms;
    $m('cpusys').textContent = s.cpu_sys_ms;
    $m('binary').textContent = fmt(s.binary_mb);
    $m('go').textContent = s.go;
    $m('numcpu').textContent = s.num_cpu;
    $m('viewers').textContent = s.viewers;
  }

  function open() {
    hud.hidden = false;
    btn.setAttribute('aria-pressed', 'true');
    paintClient();
    if (es) return;
    es = new EventSource('/metrics/stream');
    es.onmessage = function (e) { apply(JSON.parse(e.data)); $c('status').textContent = 'live · sse · 1 msg/s'; };
    es.onerror = function () { $c('status').textContent = 'stream dropped, reconnecting…'; };
  }
  function close() {
    hud.hidden = true;
    btn.setAttribute('aria-pressed', 'false');
    if (es) { es.close(); es = null; }
  }
  function toggle() { hud.hidden ? open() : close(); }

  btn.addEventListener('click', toggle);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'F3') { e.preventDefault(); toggle(); }
    var slot = document.querySelector('.hotbar .slot[data-key="' + e.key + '"]') || document.querySelector('.hotbar .slot[data-key="' + e.key.toUpperCase() + '"]');
    if (slot && slot.tagName === 'A' && !e.metaKey && !e.ctrlKey && !e.altKey) slot.click();
  });

  // keep the hotbar selection in sync with the page and the scroll position
  var slots = Array.prototype.slice.call(document.querySelectorAll('.hotbar a.slot'));
  var here = location.pathname === '/' ? '/#top' : '/' + location.pathname.split('/')[1];   // /articles/x selects articles
  slots.forEach(function (s) { s.classList.toggle('is-selected', s.getAttribute('href') === here); });
  if (location.pathname === '/' && 'IntersectionObserver' in window) {   // section tracking is a home-page thing
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        slots.forEach(function (s) { s.classList.toggle('is-selected', s.getAttribute('href') === '/#' + en.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['top', 'about', 'inventory', 'projects', 'experience', 'contact'].forEach(function (id) {
      var el = document.getElementById(id); if (el) io.observe(el);
    });
  }
})();
