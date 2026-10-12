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

// Photo strips. They scroll sideways by themselves; this adds a button at each
// end that moves one photograph at a time.
(function () {
  [].slice.call(document.querySelectorAll('.tape')).forEach(function (tape) {
    var wrap = document.createElement('div');
    wrap.className = 'tape-wrap';
    tape.parentNode.insertBefore(wrap, tape);
    wrap.appendChild(tape);
    function button(cls, label, text, dir) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tape-btn ' + cls;
      b.setAttribute('aria-label', label); b.textContent = text;
      b.addEventListener('click', function () {
        var imgs = [].slice.call(tape.querySelectorAll('img'));
        var x = tape.scrollLeft, target = null;
        if (dir > 0) { imgs.some(function (i) { if (i.offsetLeft - tape.offsetLeft > x + 4) { target = i; return true; } }); }
        else { imgs.slice().reverse().some(function (i) { if (i.offsetLeft - tape.offsetLeft < x - 4) { target = i; return true; } }); }
        if (target) tape.scrollTo({ left: target.offsetLeft - tape.offsetLeft, behavior: 'smooth' });
      });
      wrap.appendChild(b);
      return b;
    }
    var prev = button('prev', 'Previous photograph', '\u2190', -1);
    var next = button('next', 'Next photograph', '\u2192', 1);
    function update() {
      prev.disabled = tape.scrollLeft < 4;
      next.disabled = tape.scrollLeft > tape.scrollWidth - tape.clientWidth - 4;
    }
    tape.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
  });
})();
