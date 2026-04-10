// ═══════════════════════════════════════════
// BANDEAU COOKIES — Baptiste & Daphné Immobilier
// ═══════════════════════════════════════════

var CONSENT_KEY = 'bd_cookie_consent';

function getSessionId() {
  var sid = sessionStorage.getItem('bd_sid');
  if (!sid) {
    sid = 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2,8);
    sessionStorage.setItem('bd_sid', sid);
  }
  return sid;
}

// ── Activation des outils
function activateAnalytics() {
  if (window._gaLoaded) return; window._gaLoaded = true;
  var s = document.createElement('script'); s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-41DC15H7KJ';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date()); gtag('config', 'G-41DC15H7KJ');
}

function activateAds() {
  if (window._adsLoaded) return; window._adsLoaded = true;
  var s = document.createElement('script'); s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17870834052';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date()); gtag('config', 'AW-17870834052');
}

function activateClarity() {
  if (window._clarityLoaded) return; window._clarityLoaded = true;
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r); t.async=1;
    t.src='https://www.clarity.ms/tag/'+i;
    y=l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t,y);
  })(window,document,'clarity','script','vnvyypfvt5');
}

// ── Log Google Forms
function logToSheet(prefs, decision) {
  var formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSedRoADTym4LVkXkdJ13hhbVig5mW-bO00qhG-ibnmuAhfXLA/formResponse';
  var params = [
    'entry.839408998='  + encodeURIComponent(getSessionId()),
    'entry.1724484721=' + encodeURIComponent(decision),
    'entry.1435701037=' + encodeURIComponent(prefs.analytics ? 'Oui' : 'Non'),
    'entry.1901302805=' + encodeURIComponent(prefs.ads       ? 'Oui' : 'Non'),
    'entry.203643052='  + encodeURIComponent(prefs.clarity   ? 'Oui' : 'Non'),
    'entry.1764155101=' + encodeURIComponent(window.location.pathname)
  ].join('&');
  fetch(formUrl, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  }).catch(function(){});
}

function applyAndLog(prefs, decision) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(Object.assign({}, prefs, { ts: Date.now() })));
  if (prefs.analytics) activateAnalytics();
  if (prefs.ads)       activateAds();
  if (prefs.clarity)   activateClarity();
  logToSheet(prefs, decision);
}

function hideBanner() {
  document.getElementById('cookie-banner').classList.remove('visible');
}

function bannerAccept() {
  applyAndLog({ analytics: true, ads: true, clarity: true }, 'accept_all');
  hideBanner();
}

function bannerRefuse() {
  applyAndLog({ analytics: false, ads: false, clarity: false }, 'refuse_all');
  hideBanner();
}

function openCustom() {
  document.getElementById('banner-main').style.display = 'none';
  document.getElementById('banner-custom').classList.add('open');
}

function closeCustom() {
  document.getElementById('banner-custom').classList.remove('open');
  document.getElementById('banner-main').style.display = '';
}

function saveCustom() {
  var prefs = {
    analytics: document.getElementById('c-ga').checked,
    ads:       document.getElementById('c-ads').checked,
    clarity:   document.getElementById('c-clarity').checked
  };
  applyAndLog(prefs, 'custom');
  hideBanner();
}

// ── Init au chargement
(function(){
  try {
    var saved = JSON.parse(localStorage.getItem(CONSENT_KEY));
    if (saved) {
      if (saved.analytics) activateAnalytics();
      if (saved.ads)       activateAds();
      if (saved.clarity)   activateClarity();
      var alreadyLogged = sessionStorage.getItem('bd_session_logged');
      if (!alreadyLogged) {
        sessionStorage.setItem('bd_session_logged', '1');
        logToSheet(saved, 'returning');
      }
      return;
    }
  } catch(e) {}
  // Afficher le bandeau après 1.2s si pas de consentement enregistré
  setTimeout(function(){
    document.getElementById('cookie-banner').classList.add('visible');
  }, 1200);
})();
