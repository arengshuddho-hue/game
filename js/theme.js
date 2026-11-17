/* Dark / Light theme switcher. Loaded in <head> so the saved theme applies before paint (no flash). */
(function () {
  var KEY = 'detective-desk-theme';

  function saved() {
    try { return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'; }
    catch (e) { return 'dark'; }
  }

  function paintButtons(theme) {
    var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.textContent = theme === 'dark' ? '☀' : '☾';
      b.setAttribute('aria-label', label);
      b.title = label;
    });
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    paintButtons(theme);
  }

  apply(saved());

  document.addEventListener('DOMContentLoaded', function () {
    paintButtons(saved());

    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.theme-toggle');
      if (!btn) return;

      var next = saved() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (err) {}

      // Smooth colour fade only during the switch
      var root = document.documentElement;
      root.classList.add('theme-switching');
      apply(next);
      setTimeout(function () { root.classList.remove('theme-switching'); }, 500);
    });
  });
})();