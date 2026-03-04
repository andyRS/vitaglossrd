// Google AdSense — deferred after load + requestIdleCallback
// Prevents blocking main thread during LCP / TBT window
(function () {
  var delay = 'requestIdleCallback' in window
    ? requestIdleCallback
    : function (fn) { setTimeout(fn, 3000); };
  window.addEventListener('load', function () {
    delay(function () {
      var s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9316456690005068';
      document.head.appendChild(s);
    });
  });
})();
