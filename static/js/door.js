// The oak door. Click: the real door sound, the leaf swings open on its left
// hinge, the dark doorway grows until it fills the screen, then we navigate.
// Chrome continues the doorway into the next page (cross-document view
// transition, see @view-transition in the css); other browsers just arrive.
(function () {
  var doors = document.querySelectorAll('a.door');
  if (!doors.length) return;
  var snd = { open: new Audio('/static/sfx/door_open.ogg'), close: new Audio('/static/sfx/door_close.ogg') };
  snd.open.preload = snd.close.preload = 'auto';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  doors.forEach(function (door) {
    door.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // let "open in new tab" be
      e.preventDefault();
      var href = door.getAttribute('href');
      if (reduce || door.classList.contains('is-opening')) { location.href = href; return; }
      try { (door.classList.contains('door-back') ? snd.close : snd.open).play(); } catch (err) {}
      door.classList.add('is-opening');                                        // leaf swings
      setTimeout(function () { door.classList.add('is-entering'); }, 420);     // doorway swallows the screen
      setTimeout(function () { location.href = href; }, 900);
    });
  });
})();
