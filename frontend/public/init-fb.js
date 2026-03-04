// Meta Pixel — stub + deferred fbevents.js load
// fbq() queues calls internally; fbevents.js downloads only after load + idle
!function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'TU_PIXEL_ID');
fbq('track', 'PageView');

window.addEventListener('load', function () {
  var delay = 'requestIdleCallback' in window
    ? requestIdleCallback
    : function (fn) { setTimeout(fn, 3000); };
  delay(function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
  });
});
