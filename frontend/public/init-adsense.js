// Google AdSense — carga diferida tras load + requestIdleCallback
// Mueve el tiempo de conexión al CDN de Google fuera de la ruta crítica de render.
window.addEventListener('load', function () {
  var delay = 'requestIdleCallback' in window
    ? requestIdleCallback
    : function (fn) { setTimeout(fn, 3000); };
  delay(function () {
    var s = document.createElement('script');
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2971696184390995';
    document.head.appendChild(s);
  });
});
