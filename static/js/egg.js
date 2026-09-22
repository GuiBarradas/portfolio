// The "don't click" slot. Unlocked the first time the avatar respawns and
// remembered in localStorage. Opens a modal with the official Minecraft Classic.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var btn = $('egg-toggle'), modal = $('egg'), frame = $('egg-frame'), close = $('egg-close');
  if (!btn || !modal || !frame || !close) return;
  var KEY = 'egg-unlocked', SRC = 'https://classic.minecraft.net/';

  function unlock() {
    btn.hidden = false;
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  try { if (localStorage.getItem(KEY)) btn.hidden = false; } catch (e) {}
  document.addEventListener('avatar:respawn', unlock);

  function open() {
    modal.hidden = false;
    document.body.classList.add('egg-open');
    btn.classList.add('is-opened');
    if (!frame.querySelector('iframe')) {
      var f = document.createElement('iframe');
      f.src = SRC;
      f.title = 'Minecraft Classic';
      f.allow = 'pointer-lock; fullscreen; gamepad';
      f.referrerPolicy = 'no-referrer';
      frame.appendChild(f);
    }
    close.focus();
  }
  function shut() {
    modal.hidden = true;
    document.body.classList.remove('egg-open');
    var f = frame.querySelector('iframe');
    if (f) f.remove();   // stop the game, free the gpu
    btn.focus();
  }

  btn.addEventListener('click', function () { modal.hidden ? open() : shut(); });
  close.addEventListener('click', shut);
  modal.addEventListener('click', function (e) { if (e.target === modal) shut(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) shut(); });
})();
