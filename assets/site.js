// platopod.com — shared behaviour. Progressive enhancement only: every page
// reads and works with JavaScript off.

// Play videos only while they are on screen, and only if the visitor has not
// asked for less motion. Every video keeps its controls, so it can be paused,
// and one the visitor has paused stays paused.
(function () {
  var vs = [].slice.call(document.querySelectorAll('video.autoplay'));
  if (!vs.length) return;
  var still = window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) return;
  if (!('IntersectionObserver' in window)) {
    vs.forEach(function (v) { v.play().catch(function () {}); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        v._seen = true;
        if (!v._held) v.play().catch(function () {});
      } else {
        v._seen = false;
        v.pause();
      }
    });
  }, { threshold: 0.25 });
  vs.forEach(function (v) {
    v.addEventListener('pause', function () { if (v._seen) v._held = true; });
    v.addEventListener('play', function () { v._held = false; });
    io.observe(v);
  });
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
      if (r.status === 422) {
        note.className = 'bad';
        note.textContent = 'That did not send. Please check the email address and try again.';
        button.disabled = false;
        return;
      }
      if (!r.ok) throw new Error(r.status);
      form.reset();
      note.textContent = 'Thank you. We will be in touch.';
      button.disabled = false;
    }).catch(function () {
      note.className = 'bad';
      note.textContent = 'That did not send. Please try again in a moment.';
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
    var prev = button('prev', 'Previous picture', '\u2190', -1);
    var next = button('next', 'Next picture', '\u2192', 1);
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

// Code tabs: one pane per language. With JavaScript off every pane shows
// under its own label.
(function () {
  [].slice.call(document.querySelectorAll('.codetabs')).forEach(function (box, n) {
    var panes = [].slice.call(box.querySelectorAll('.codepane'));
    var bar = document.createElement('div');
    bar.className = 'tabs';
    bar.setAttribute('role', 'tablist');
    var tabs = panes.map(function (pane, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.id = 'code-' + n + '-' + i;
      b.setAttribute('role', 'tab');
      b.textContent = pane.getAttribute('data-lang');
      pane.setAttribute('role', 'tabpanel');
      pane.setAttribute('aria-labelledby', b.id);
      b.addEventListener('click', function () { show(i); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { var j = (i + d + panes.length) % panes.length; show(j); tabs[j].focus(); }
      });
      bar.appendChild(b);
      return b;
    });
    function show(i) {
      panes.forEach(function (p, j) { p.hidden = j !== i; });
      tabs.forEach(function (t, j) {
        t.setAttribute('aria-selected', j === i ? 'true' : 'false');
        t.tabIndex = j === i ? 0 : -1;
      });
    }
    box.insertBefore(bar, box.firstChild);
    box.classList.add('on');
    show(0);
  });
})();
