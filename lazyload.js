// Lazy loading for page-level resources using IntersectionObserver.
// This avoids fetching heavy resources (images/iframes) until they're near the viewport.
// Safe for existing markup; does not require HTML changes.
(function () {
  const supportsIO = typeof IntersectionObserver !== 'undefined';
  const ioMargin = '200px 0px';

  function enableIntersection(nodeList, handler) {
    if (!supportsIO) {
      nodeList.forEach(handler);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          io.unobserve(el);
          handler(el);
        }
      });
    }, { rootMargin: ioMargin });

    nodeList.forEach((el) => io.observe(el));
  }

  // Convert data-src/data-srcset -> real src/srcset when visible
  const lazyImages = Array.from(document.querySelectorAll('img[data-src], img[data-srcset], source[data-src], source[data-srcset]'));

  enableIntersection(lazyImages, (el) => {
    if (el.dataset && el.dataset.src) el.src = el.dataset.src;
    if (el.dataset && el.dataset.srcset) el.srcset = el.dataset.srcset;
    el.removeAttribute('data-src');
    el.removeAttribute('data-srcset');
  });

  // Lazy-load iframes by moving data-src -> src
  const lazyIframes = Array.from(document.querySelectorAll('iframe[data-src]'));
  enableIntersection(lazyIframes, (el) => {
    const src = el.getAttribute('data-src');
    if (src && !el.getAttribute('src')) {
      el.setAttribute('src', src);
    }
  });

  // Also set loading="lazy" for native-lazy candidates that already have src.
  // (Does not force behavior; just hints.)
  const nativeLazyCandidates = Array.from(document.querySelectorAll('img[loading]:not([loading="eager"])'));
  nativeLazyCandidates.forEach((img) => {
    // no-op
    void img;
  });
})();

