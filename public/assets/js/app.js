
(function(){
  function normalizeHomeLink(){
    document.querySelectorAll('.logo').forEach(function(logo){
      if (logo.closest('a') || logo.querySelector('a')) return;
      var content = logo.innerHTML;
      logo.innerHTML = '<a href="/" aria-label="Retour à l\'accueil IronMarkGear">' + content + '</a>';
    });
  }
  function enhanceCartLink(){
    document.querySelectorAll('nav a').forEach(function(a){
      var href = (a.getAttribute('href') || '').toLowerCase();
      var label = (a.textContent || '').trim().toLowerCase();
      if ((href.indexOf('panier') !== -1 || label === 'panier') && !a.classList.contains('cart-nav-link')) {
        a.classList.add('cart-nav-link');
        a.innerHTML = '<span class="cart-icon" aria-hidden="true">🛒</span><span>Panier</span>';
      }
    });
  }
  document.addEventListener('DOMContentLoaded', function(){
    normalizeHomeLink();
    enhanceCartLink();
  });
})();
