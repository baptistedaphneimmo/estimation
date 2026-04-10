// ═══════════════════════════════════════════
// TRACKING — Baptiste & Daphné Immobilier
// GA4 · Google Ads · Clarity · Conversion Calendly
// Activé uniquement après consentement (via cookies.js)
// ═══════════════════════════════════════════

// Suivi conversion Calendly → Google Ads
// Déclenché quand un RDV est pris via l'iframe Calendly
window.addEventListener('message', function(e) {
  if (e.data && e.data.event && e.data.event === 'calendly.event_scheduled') {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-17870834052/Kd-vCIqK-v4bEISTvclC'
      });
    }
  }
});
