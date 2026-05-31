/**
 * cookie-banner.js — Starke Fuesse
 * DSGVO / TDDDG konform, Google Consent Mode v2
 * Zentral eingebunden auf allen Seiten via <script src="/cookie-banner.js">
 */

(function () {
  'use strict';

  // ── Farben & Fonts passend zum Design ──────────────────────────────────────
  const PETROL   = '#006D7A';
  const PETROL_H = '#005C67';
  const NAVY     = '#050C12';
  const OFF_WHITE= '#F8F8F6';
  const LGREY    = '#E4E0DC';
  const GREY     = '#6B737A';
  const RH       = "'Raleway', sans-serif";
  const RB       = "'Nunito Sans', sans-serif";

  const STORAGE_KEY = 'sf_consent_v1';
  const CONSENT_DURATION_DAYS = 365;

  // ── Consent-Signale lesen ────────────────────────────────────────────────
  function getStoredConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data.expires || Date.now() > data.expires) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data;
    } catch (e) { return null; }
  }

  function saveConsent(analytics, marketing) {
    const expires = Date.now() + CONSENT_DURATION_DAYS * 86400 * 1000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics, marketing, expires }));
  }

  // ── Google Consent Mode v2 ────────────────────────────────────────────────
  function pushConsentDefault() {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('consent', 'default', {
      'ad_storage':         'denied',
      'analytics_storage':  'denied',
      'ad_user_data':       'denied',
      'ad_personalization': 'denied'
    });
  }

  function updateConsent(analytics, marketing) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('consent', 'update', {
      'analytics_storage':  analytics  ? 'granted' : 'denied',
      'ad_storage':         marketing  ? 'granted' : 'denied',
      'ad_user_data':       marketing  ? 'granted' : 'denied',
      'ad_personalization': marketing  ? 'granted' : 'denied'
    });
  }

  // ── Consent Default SOFORT setzen (vor GTM) ──────────────────────────────
  const stored = getStoredConsent();
  if (stored) {
    // Bereits entschieden — direkt korrekte Werte setzen
    updateConsent(stored.analytics, stored.marketing);
  } else {
    // Noch keine Entscheidung — alles denied
    pushConsentDefault();
  }

  // ── Wenn bereits Entscheidung gespeichert: kein Banner zeigen ────────────
  if (stored) {
    injectFooterLink();
    return;
  }

  // ── CSS injizieren ────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #sf-cookie-banner *,#sf-cookie-modal * { box-sizing:border-box; margin:0; padding:0; }

    /* ── BANNER (Ebene 1) ── */
    #sf-cookie-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;
      background: ${NAVY};
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 20px 32px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px;
      font-family: ${RB}; font-size: 14px; color: rgba(255,255,255,0.78);
      line-height: 1.6; animation: sfSlideUp 0.3s ease;
    }
    @keyframes sfSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #sf-cookie-banner .sf-banner-text { flex: 1; min-width: 220px; font-weight: 300; }
    #sf-cookie-banner .sf-banner-text strong {
      font-family: ${RH}; font-weight: 700; font-size: 13px;
      letter-spacing: 0.06em; color: #fff; display: block; margin-bottom: 4px;
    }
    #sf-cookie-banner .sf-banner-actions {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    }
    .sf-btn-accept {
      font-family: ${RH}; font-weight: 700; font-size: 12px;
      letter-spacing: 0.12em; text-transform: uppercase;
      background: ${PETROL}; color: #fff; border: none; cursor: pointer;
      padding: 12px 24px; border-radius: 3px;
      transition: background 0.2s ease, transform 0.2s ease;
      white-space: nowrap;
    }
    .sf-btn-accept:hover { background: ${PETROL_H}; transform: translateY(-1px); }
    .sf-btn-decline {
      font-family: ${RH}; font-weight: 600; font-size: 12px;
      letter-spacing: 0.1em; text-transform: uppercase;
      background: transparent; color: rgba(255,255,255,0.55);
      border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
      padding: 11px 20px; border-radius: 3px;
      transition: border-color 0.2s, color 0.2s;
      white-space: nowrap;
    }
    .sf-btn-decline:hover { border-color: rgba(255,255,255,0.5); color: rgba(255,255,255,0.85); }
    .sf-btn-settings {
      font-family: ${RH}; font-weight: 600; font-size: 11px;
      letter-spacing: 0.08em; text-transform: uppercase;
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,0.38); text-decoration: underline;
      text-underline-offset: 3px; padding: 4px;
      transition: color 0.2s;
    }
    .sf-btn-settings:hover { color: rgba(255,255,255,0.7); }

    /* ── MODAL OVERLAY (Ebene 2) ── */
    #sf-cookie-modal {
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(5,12,18,0.72); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: sfFadeIn 0.25s ease;
    }
    @keyframes sfFadeIn { from { opacity:0; } to { opacity:1; } }
    #sf-cookie-modal .sf-modal-box {
      background: ${OFF_WHITE}; border-radius: 1.5rem;
      max-width: 520px; width: 100%; padding: 40px 44px;
      box-shadow: 0 24px 80px rgba(5,12,18,0.3);
      max-height: 90vh; overflow-y: auto;
    }
    #sf-cookie-modal .sf-modal-label {
      font-family: ${RH}; font-size: 11px; font-weight: 700;
      letter-spacing: 0.26em; text-transform: uppercase;
      color: ${PETROL}; margin-bottom: 14px;
    }
    #sf-cookie-modal h2 {
      font-family: ${RH}; font-size: 1.4rem; font-weight: 700;
      color: ${NAVY}; margin-bottom: 12px; letter-spacing: -0.01em;
    }
    #sf-cookie-modal .sf-modal-intro {
      font-size: 14px; color: rgba(0,0,0,0.6); line-height: 1.75;
      font-weight: 300; margin-bottom: 28px;
    }
    #sf-cookie-modal .sf-modal-intro a {
      color: ${PETROL}; text-decoration: underline; text-underline-offset: 2px;
    }
    /* Categories */
    .sf-cat {
      border: 1px solid ${LGREY}; border-radius: 0.75rem;
      padding: 18px 20px; margin-bottom: 12px; background: #fff;
    }
    .sf-cat-header {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }
    .sf-cat-title {
      font-family: ${RH}; font-size: 13px; font-weight: 700;
      color: ${NAVY};
    }
    .sf-cat-desc {
      font-size: 13px; color: ${GREY}; line-height: 1.6;
      font-weight: 300; margin-top: 8px;
    }
    .sf-cat-badge {
      font-family: ${RH}; font-size: 10px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(0,0,0,0.35); white-space: nowrap;
    }
    /* Toggle */
    .sf-toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
    .sf-toggle input { opacity: 0; width: 0; height: 0; }
    .sf-toggle-slider {
      position: absolute; inset: 0; border-radius: 22px;
      background: ${LGREY}; cursor: pointer;
      transition: background 0.2s ease;
    }
    .sf-toggle-slider:before {
      content: ''; position: absolute;
      width: 16px; height: 16px; border-radius: 50%;
      background: #fff; left: 3px; top: 3px;
      transition: transform 0.2s ease;
      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    }
    .sf-toggle input:checked + .sf-toggle-slider { background: ${PETROL}; }
    .sf-toggle input:checked + .sf-toggle-slider:before { transform: translateX(18px); }
    .sf-toggle input:disabled + .sf-toggle-slider { cursor: not-allowed; background: ${PETROL}; opacity: 0.6; }
    /* Modal Buttons */
    .sf-modal-actions {
      display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap;
    }
    .sf-modal-actions .sf-btn-accept { flex: 1; text-align: center; }
    .sf-modal-actions .sf-btn-save {
      flex: 1; text-align: center;
      font-family: ${RH}; font-weight: 700; font-size: 12px;
      letter-spacing: 0.12em; text-transform: uppercase;
      background: transparent; color: ${NAVY};
      border: 1.5px solid ${LGREY}; cursor: pointer;
      padding: 12px 20px; border-radius: 3px;
      transition: border-color 0.2s, background 0.2s;
    }
    .sf-modal-actions .sf-btn-save:hover {
      border-color: ${PETROL}; background: rgba(0,109,122,0.04);
    }
    /* Footer link */
    .sf-footer-link {
      font-size: 11px; color: rgba(255,255,255,0.4);
      background: none; border: none; cursor: pointer;
      text-decoration: underline; text-underline-offset: 3px;
      font-family: ${RH}; font-weight: 500; letter-spacing: 0.06em;
      transition: color 0.2s; padding: 0;
    }
    .sf-footer-link:hover { color: rgba(255,255,255,0.75); }

    @media (max-width: 600px) {
      #sf-cookie-banner { padding: 18px 20px; }
      #sf-cookie-modal .sf-modal-box { padding: 28px 22px; }
      .sf-modal-actions { flex-direction: column; }
    }
  `;
  document.head.appendChild(style);

  // ── Banner HTML (Ebene 1) ─────────────────────────────────────────────────
  const banner = document.createElement('div');
  banner.id = 'sf-cookie-banner';
  banner.innerHTML = `
    <div class="sf-banner-text">
      <strong>Cookies & Datenschutz</strong>
      Wir nutzen Cookies für Analyse und Werbung. Du kannst selbst entscheiden.
    </div>
    <div class="sf-banner-actions">
      <button class="sf-btn-accept" id="sf-accept-all">Alle akzeptieren</button>
      <button class="sf-btn-decline" id="sf-decline-all">Ablehnen</button>
      <button class="sf-btn-settings" id="sf-open-settings">Einstellungen</button>
    </div>
  `;

  // ── Modal HTML (Ebene 2) ──────────────────────────────────────────────────
  const modal = document.createElement('div');
  modal.id = 'sf-cookie-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="sf-modal-box">
      <div class="sf-modal-label">Datenschutz-Einstellungen</div>
      <h2>Deine Cookie-Auswahl</h2>
      <p class="sf-modal-intro">
        Wir nutzen Cookies und ähnliche Technologien, um unsere Website zu verbessern und dir relevante Inhalte anzuzeigen.
        Du kannst deine Einwilligung jederzeit widerrufen. Mehr dazu in unserer
        <a href="/datenschutz.html">Datenschutzerklärung</a>.
      </p>

      <div class="sf-cat">
        <div class="sf-cat-header">
          <span class="sf-cat-title">Notwendig</span>
          <span class="sf-cat-badge">Immer aktiv</span>
        </div>
        <div class="sf-cat-desc">Technisch erforderliche Cookies für Grundfunktionen der Website (Session, Sicherheit). Keine Deaktivierung möglich.</div>
      </div>

      <div class="sf-cat">
        <div class="sf-cat-header">
          <span class="sf-cat-title">Analyse</span>
          <label class="sf-toggle">
            <input type="checkbox" id="sf-toggle-analytics" />
            <span class="sf-toggle-slider"></span>
          </label>
        </div>
        <div class="sf-cat-desc">Google Analytics 4 — hilft uns zu verstehen, wie Besucher die Website nutzen (anonymisiert).</div>
      </div>

      <div class="sf-cat">
        <div class="sf-cat-header">
          <span class="sf-cat-title">Marketing</span>
          <label class="sf-toggle">
            <input type="checkbox" id="sf-toggle-marketing" />
            <span class="sf-toggle-slider"></span>
          </label>
        </div>
        <div class="sf-cat-desc">Google Ads & Facebook Pixel — ermöglicht personalisierte Werbeanzeigen und Conversion-Tracking.</div>
      </div>

      <div class="sf-modal-actions">
        <button class="sf-btn-save" id="sf-save-selection">Auswahl speichern</button>
        <button class="sf-btn-accept" id="sf-modal-accept-all">Alle akzeptieren</button>
      </div>
    </div>
  `;

  // ── DOM einfügen wenn bereit ──────────────────────────────────────────────
  function init() {
    document.body.appendChild(banner);
    document.body.appendChild(modal);

    // Event Listeners
    document.getElementById('sf-accept-all').addEventListener('click', acceptAll);
    document.getElementById('sf-decline-all').addEventListener('click', declineAll);
    document.getElementById('sf-open-settings').addEventListener('click', openModal);
    document.getElementById('sf-modal-accept-all').addEventListener('click', acceptAll);
    document.getElementById('sf-save-selection').addEventListener('click', saveSelection);

    // Modal schließen bei Klick außerhalb
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });

    injectFooterLink();
  }

  function acceptAll() {
    saveConsent(true, true);
    updateConsent(true, true);
    hideBanner();
    closeModal();
  }

  function declineAll() {
    saveConsent(false, false);
    updateConsent(false, false);
    hideBanner();
    closeModal();
  }

  function saveSelection() {
    const analytics = document.getElementById('sf-toggle-analytics').checked;
    const marketing = document.getElementById('sf-toggle-marketing').checked;
    saveConsent(analytics, marketing);
    updateConsent(analytics, marketing);
    hideBanner();
    closeModal();
  }

  function hideBanner() {
    banner.style.animation = 'sfSlideUp 0.25s ease reverse';
    setTimeout(() => { banner.style.display = 'none'; }, 240);
  }

  function openModal() {
    // Toggles auf gespeicherten Stand setzen
    const s = getStoredConsent();
    document.getElementById('sf-toggle-analytics').checked = s ? s.analytics : false;
    document.getElementById('sf-toggle-marketing').checked = s ? s.marketing : false;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ── Footer-Link "Cookie-Einstellungen" ────────────────────────────────────
  function injectFooterLink() {
    // Warte auf DOM-Bereitschaft
    function tryInject() {
      const footerCopy = document.querySelector('.footer-copy');
      if (!footerCopy) return;
      if (document.getElementById('sf-footer-link')) return; // bereits vorhanden

      const btn = document.createElement('button');
      btn.className = 'sf-footer-link';
      btn.id = 'sf-footer-link';
      btn.textContent = 'Cookie-Einstellungen';
      btn.addEventListener('click', function() {
        if (!document.getElementById('sf-cookie-modal')) {
          // Modal noch nicht im DOM (Banner wurde nie gezeigt) → neu aufbauen
          document.body.appendChild(modal);
        }
        openModal();
      });

      // Dezent nach Copyright einfügen
      footerCopy.insertAdjacentElement('afterend', btn);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryInject);
    } else {
      setTimeout(tryInject, 0);
    }
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
