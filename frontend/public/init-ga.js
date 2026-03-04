// Activate Google Fonts stylesheet preloads (avoids inline onload= handler)
document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function (l) {
  l.rel = 'stylesheet';
});

// Google Analytics 4 — dataLayer init + deferred script load
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');

window.addEventListener('load', function () {
  var delay = 'requestIdleCallback' in window
    ? requestIdleCallback
    : function (fn) { setTimeout(fn, 3000); };
  delay(function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(s);
  });
});
