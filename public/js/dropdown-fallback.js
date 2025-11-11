// Dropdown fallback: toggle .show class when bootstrap dropdown is not initialized
document.addEventListener('DOMContentLoaded', function () {
  try {
    var toggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    toggles.forEach(function (t) {
      t.addEventListener('click', function (e) {
        var parent = t.closest('.dropdown');
        if (!parent) return;
        var menu = parent.querySelector('.dropdown-menu');
        if (!menu) return;
        if (menu.classList.contains('show')) {
          menu.classList.remove('show');
          parent.classList.remove('show');
        } else {
          menu.classList.add('show');
          parent.classList.add('show');
        }
      });
    });
  } catch (err) {
    // Silent catch
    console.error('Dropdown fallback error:', err);
  }
});
