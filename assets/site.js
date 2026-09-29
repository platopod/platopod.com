// platopod.com — shared behaviour. Progressive enhancement only: every page
// reads and works with JavaScript off.

// Play videos only while they are on screen, and only if the visitor has not
// asked for less motion; otherwise show them paused with controls.
(function () {
  var vs = [].slice.call(document.querySelectorAll('video.autoplay'));
  if (!vs.length) return;
  var still = window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) { vs.forEach(function (v) { v.setAttribute('controls', ''); }); return; }
  if (!('IntersectionObserver' in window)) {
    vs.forEach(function (v) { v.play().catch(function () {}); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { v.play().catch(function () { v.setAttribute('controls', ''); }); }
      else { v.pause(); }
    });
  }, { threshold: 0.25 });
  vs.forEach(function (v) { io.observe(v); });
})();

// The enquiry form. With JavaScript off it is an ordinary POST to Formspree.
(function () {
  var form = document.getElementById('briefing');
  if (!form) return;
  var note = document.getElementById('note');
  var button = form.querySelector('button[type=submit]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    button.disabled = true;
    note.className = '';
    note.textContent = 'Sending…';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.reset();
      note.textContent = 'Thank you — we will be in touch.';
      button.disabled = false;
    }).catch(function () {
      note.className = 'bad';
      note.textContent = 'That did not send. Please check your connection and try again.';
      button.disabled = false;
    });
  });
})();
