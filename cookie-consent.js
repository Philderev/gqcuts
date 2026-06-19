// Cookie consent banner for GQ Barbershop.
// Shows once per visitor; remembers their choice in localStorage so it
// doesn't reappear on every page/visit once they've responded.
(function () {
  const STORAGE_KEY = 'gq_cookie_consent';
  const existing = localStorage.getItem(STORAGE_KEY);

  // Already accepted or declined — don't show it again.
  if (existing === 'accepted' || existing === 'declined') return;

  function buildBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
      <div class="cookie-consent-text">
        We use cookies to improve your browsing experience, analyze site traffic,
        and personalize content. By clicking "Accept", you consent to our use of cookies.
        <a href="privacy.html">Learn more</a>
      </div>
      <div class="cookie-consent-actions">
        <button type="button" class="cookie-consent-decline">Decline</button>
        <button type="button" class="cookie-consent-accept cta-btn">Accept</button>
      </div>
    `;
    document.body.appendChild(banner);

    // Animate in on next frame so the transition actually plays
    requestAnimationFrame(() => banner.classList.add('is-visible'));

    banner.querySelector('.cookie-consent-accept').addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      dismiss(banner);
    });

    banner.querySelector('.cookie-consent-decline').addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'declined');
      dismiss(banner);
    });
  }

  function dismiss(banner) {
    banner.classList.remove('is-visible');
    // Wait for the slide-out transition before removing from the DOM
    setTimeout(() => banner.remove(), 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildBanner);
  } else {
    buildBanner();
  }
})();
