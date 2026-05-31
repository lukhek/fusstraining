/**
 * cookie-banner.js — Starke Fuesse
 * DSGVO / TDDDG konform · Google Consent Mode v2
 * Design: Ruhig, minimal, hohe Akzeptanzrate
 */

(function () {
  'use strict';

  const PETROL    = '#006D7A';
  const PETROL_H  = '#005C67';
  const NAVY      = '#050C12';
  const OFF_WHITE = '#F8F8F6';
  const LGREY     = '#E4E0DC';
  const GREY      = '#6B737A';
  const RH        = "'Raleway', sans-serif";
  const RB        = "'Nunito Sans', sans-serif";

  const STORAGE_KEY          = 'sf_consent_v1';
  const CONSENT_DURATION_MS  = 365 * 86400 * 1000;

  // ── Storage ───────────────────────────────────────────────────────────────
  function getStoredConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d.expires || Date.now() > d.expires) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return d;
    } catch (e) { return null; }
  }

  function saveConsent(analytics, marketing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      analytics, marketing,
      expires: Date.now() + CONSENT_DURATION_MS
    }));
  }

  // ── Google Consent Mode v2 ────────────────────────────────────────────────
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function setConsent(analytics, marketing) {
    gtag('consent', 'update', {
      analytics_storage:  analytics ? 'granted' : 'denied',
      ad_storage:         marketing ? 'granted' : 'denied',
      ad_user_data:       marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    });
  }

  // Sofort: alles denied (vor GTM)
  gtag('consent', 'default', {
    analytics_storage:  'denied',
    ad_storage:         'denied',
    ad_user_data:       'denied',
    ad_personalization: 'denied'
  });

  // Bereits gespeicherte Entscheidung anwenden
  const stored = getStoredConsent();
  if (stored) {
    setConsent(stored.analytics, stored.marketing);
  }

  // ── CSS ───────────────────────────────────────────────────────────────────
  const css = `
    #sf-banner, #sf-modal, #sf-modal * { box-sizing: border-box; }

    /* ── BANNER ── */
    #sf-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      width: min(680px, calc(100vw - 32px));
      background: #fff;
      border: 1px solid ${LGREY};
      border-radius: 1.25rem;
      box-shadow: 0 8px 48px rgba(5,12,18,0.13), 0 2px 8px rgba(5,12,18,0.06);
      padding: 24px 28px;
      font-family: ${RB};
      animation: sfUp 0.35s cubic-bezier(.22,.68,0,1.2) both;
    }
    @keyframes sfUp {
      from { opacity: 0; transform: translateX(-50%) translateY(16px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    #sf-banner .sf-top {
      display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px;
    }
    #sf-banner .sf-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(0,109,122,0.08);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 1px;
      font-size: 17px;
    }
    #sf-banner .sf-text-wrap {}
    #sf-banner .sf-title {
      font-family: ${RH};
      font-size: 14px;
      font-weight: 700;
      color: ${NAVY};
      letter-spacing: 0.01em;
      margin-bottom: 5px;
    }
    #sf-banner .sf-text {
      font-size: 13px;
      color: rgba(0,0,0,0.58);
      line-height: 1.65;
      font-weight: 300;
    }
    #sf-banner .sf-text a {
      color: ${PETROL};
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    #sf-banner .sf-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    /* Primär: Akzeptieren — rechts, auffällig */
    #sf-banner .sf-btn-accept {
      flex: 1;
      min-width: 140px;
      font-family: ${RH};
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: ${PETROL};
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 13px 20px;
      cursor: pointer;
      transition: background 0.18s ease, transform 0.18s ease;
      text-align: center;
    }
    #sf-banner .sf-btn-accept:hover {
      background: ${PETROL_H};
      transform: translateY(-1px);
    }
    /* Ablehnen — links, dezent aber gleich groß */
    #sf-banner .sf-btn-decline {
      flex: 1;
      min-width: 120px;
      font-family: ${RH};
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background: transparent;
      color: ${GREY};
      border: 1.5px solid ${LGREY};
      border-radius: 6px;
      padding: 12px 16px;
      cursor: pointer;
      transition: border-color 0.18s, color 0.18s;
      text-align: center;
    }
    #sf-banner .sf-btn-decline:hover {
      border-color: #bbb;
      color: ${NAVY};
    }
    /* Einstellungen — zentriert unter den Buttons */
    #sf-banner .sf-settings-row {
      text-align: center;
      margin-top: 10px;
    }
    #sf-banner .sf-btn-settings {
      font-family: ${RH};
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.06em;
      color: rgba(0,0,0,0.32);
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;
      padding: 2px 4px;
      transition: color 0.15s;
    }
    #sf-banner .sf-btn-settings:hover { color: ${PETROL}; }

    /* ── MODAL ── */
    #sf-modal {
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(5,12,18,0.55);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: sfFade 0.22s ease both;
    }
    @keyframes sfFade { from { opacity:0; } to { opacity:1; } }
    #sf-modal .sf-box {
      background: ${OFF_WHITE};
      border-radius: 1.5rem;
      max-width: 500px; width: 100%;
      padding: 40px 40px 36px;
      box-shadow: 0 32px 80px rgba(5,12,18,0.22);
      max-height: 90vh; overflow-y: auto;
    }
    #sf-modal .sf-m-label {
      font-family: ${RH}; font-size: 10px; font-weight: 700;
      letter-spacing: 0.28em; text-transform: uppercase;
      color: ${PETROL}; margin-bottom: 12px;
    }
    #sf-modal h2 {
      font-family: ${RH}; font-size: 1.35rem; font-weight: 700;
      color: ${NAVY}; margin-bottom: 10px; letter-spacing: -0.01em;
    }
    #sf-modal .sf-m-intro {
      font-size: 13px; color: rgba(0,0,0,0.55); line-height: 1.72;
      font-weight: 300; margin-bottom: 28px;
    }
    #sf-modal .sf-m-intro a { color: ${PETROL}; text-decoration: underline; }

    .sf-cat {
      border: 1px solid ${LGREY};
      border-radius: 0.85rem;
      padding: 16px 18px;
      margin-bottom: 10px;
      background: #fff;
    }
    .sf-cat-row {
      display: flex; align-items: center;
      justify-content: space-between; gap: 12px;
    }
    .sf-cat-name {
      font-family: ${RH}; font-size: 13px; font-weight: 700; color: ${NAVY};
    }
    .sf-cat-desc {
      font-size: 12px; color: ${GREY}; line-height: 1.6;
      font-weight: 300; margin-top: 7px;
    }
    .sf-badge {
      font-family: ${RH}; font-size: 10px; font-weight: 700;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(0,0,0,0.3); white-space: nowrap;
    }
    /* Toggle */
    .sf-tgl { position: relative; width: 42px; height: 24px; flex-shrink: 0; }
    .sf-tgl input { opacity:0; width:0; height:0; position:absolute; }
    .sf-tgl-track {
      position: absolute; inset: 0; border-radius: 24px;
      background: ${LGREY}; cursor: pointer;
      transition: background 0.2s;
    }
    .sf-tgl-track:before {
      content:''; position:absolute;
      width: 18px; height: 18px; border-radius: 50%;
      background: #fff; left: 3px; top: 3px;
      transition: transform 0.2s;
      box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    }
    .sf-tgl input:checked ~ .sf-tgl-track { background: ${PETROL}; }
    .sf-tgl input:checked ~ .sf-tgl-track:before { transform: translateX(18px); }
    .sf-tgl input:disabled ~ .sf-tgl-track { cursor: not-allowed; background: ${PETROL}; opacity: 0.5; }

    .sf-m-actions {
      display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap;
    }
    .sf-m-save {
      flex: 1; font-family: ${RH}; font-weight: 700; font-size: 12px;
      letter-spacing: 0.1em; text-transform: uppercase;
      background: transparent; color: ${NAVY};
      border: 1.5px solid ${LGREY}; border-radius: 6px;
      padding: 13px 16px; cursor: pointer;
      transition: border-color 0.18s, background 0.18s;
      text-align: center;
    }
    .sf-m-save:hover { border-color: ${PETROL}; background: rgba(0,109,122,0.04); }
    .sf-m-accept {
      flex: 1; font-family: ${RH}; font-weight: 700; font-size: 12px;
      letter-spacing: 0.12em; text-transform: uppercase;
      background: ${PETROL}; color: #fff; border: none; border-radius: 6px;
      padding: 13px 16px; cursor: pointer;
      transition: background 0.18s;
      text-align: center;
    }
    .sf-m-accept:hover { background: ${PETROL_H}; }

    /* Footer Link */
    .sf-footer-link {
      background: none; border: none; cursor: pointer;
      font-family: ${RH}; font-size: 11px; font-weight: 500;
      color: rgba(255,255,255,0.42);
      text-decoration: underline; text-underline-offset: 3px;
      letter-spacing: 0.05em; padding: 0;
      transition: color 0.18s;
    }
    .sf-footer-link:hover { color: rgba(255,255,255,0.75); }

    @media (max-width: 560px) {
      #sf-banner { padding: 20px 18px; bottom: 12px; border-radius: 1rem; }
      #sf-banner .sf-actions { flex-direction: column; }
      #sf-banner .sf-btn-accept,
      #sf-banner .sf-btn-decline { min-width: 0; width: 100%; }
      #sf-banner .sf-btn-accept { order: -1; }
      #sf-modal .sf-box { padding: 28px 22px; }
      .sf-m-actions { flex-direction: column; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Modal (Ebene 2) ───────────────────────────────────────────────────────
  const modal = document.createElement('div');
  modal.id = 'sf-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="sf-box">
      <div class="sf-m-label">Datenschutz-Einstellungen</div>
      <h2>Deine Auswahl</h2>
      <p class="sf-m-intro">
        Wir setzen Cookies ein, um die Website zu verbessern und dir passende Inhalte zu zeigen.
        Du entscheidest, was du erlaubst. Mehr dazu in unserer
        <a href="/datenschutz.html">Datenschutzerklärung</a>.
      </p>

      <div class="sf-cat">
        <div class="sf-cat-row">
          <span class="sf-cat-name">Notwendig</span>
          <span class="sf-badge">Immer aktiv</span>
        </div>
        <div class="sf-cat-desc">Technisch erforderlich für Grundfunktionen der Website. Nicht deaktivierbar.</div>
      </div>

      <div class="sf-cat">
        <div class="sf-cat-row">
          <span class="sf-cat-name">Analyse</span>
          <label class="sf-tgl">
            <input type="checkbox" id="sf-chk-analytics" />
            <span class="sf-tgl-track"></span>
          </label>
        </div>
        <div class="sf-cat-desc">Google Analytics 4 — hilft uns zu verstehen, welche Inhalte dir am meisten nützen (anonymisiert).</div>
      </div>

      <div class="sf-cat">
        <div class="sf-cat-row">
          <span class="sf-cat-name">Marketing</span>
          <label class="sf-tgl">
            <input type="checkbox" id="sf-chk-marketing" />
            <span class="sf-tgl-track"></span>
          </label>
        </div>
        <div class="sf-cat-desc">Google Ads & Facebook Pixel — ermöglicht relevante Werbung und Conversion-Messung.</div>
      </div>

      <div class="sf-m-actions">
        <button class="sf-m-save" id="sf-save">Auswahl speichern</button>
        <button class="sf-m-accept" id="sf-modal-accept">Alle akzeptieren</button>
      </div>
    </div>
  `;

  // ── Banner (Ebene 1) ──────────────────────────────────────────────────────
  const banner = document.createElement('div');
  banner.id = 'sf-banner';
  banner.innerHTML = `
    <div class="sf-top">
      <div class="sf-icon">🍪</div>
      <div class="sf-text-wrap">
        <div class="sf-title">Cookies & Datenschutz</div>
        <div class="sf-text">
          Wir nutzen Cookies, um dir die beste Erfahrung auf unserer Website zu bieten
          und relevante Inhalte anzuzeigen. Du kannst jederzeit widerrufen.
          <a href="/datenschutz.html">Mehr erfahren</a>
        </div>
      </div>
    </div>
    <div class="sf-actions">
      <button class="sf-btn-decline" id="sf-decline">Ablehnen</button>
      <button class="sf-btn-accept" id="sf-accept">Alle akzeptieren</button>
    </div>
    <div class="sf-settings-row">
      <button class="sf-btn-settings" id="sf-settings">Einstellungen anpassen</button>
    </div>
  `;

  // ── Aktionen ──────────────────────────────────────────────────────────────
  function acceptAll() {
    saveConsent(true, true);
    setConsent(true, true);
    hideBanner();
    closeModal();
  }

  function declineAll() {
    saveConsent(false, false);
    setConsent(false, false);
    hideBanner();
    closeModal();
  }

  function saveSelection() {
    const a = document.getElementById('sf-chk-analytics').checked;
    const m = document.getElementById('sf-chk-marketing').checked;
    saveConsent(a, m);
    setConsent(a, m);
    hideBanner();
    closeModal();
  }

  function hideBanner() {
    banner.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(-50%) translateY(12px)';
    setTimeout(() => banner.remove(), 260);
  }

  function openModal() {
    const s = getStoredConsent();
    document.getElementById('sf-chk-analytics').checked = s ? s.analytics : false;
    document.getElementById('sf-chk-marketing').checked = s ? s.marketing : false;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ── Footer-Link injizieren ────────────────────────────────────────────────
  function injectFooterLink() {
    if (document.getElementById('sf-footer-btn')) return;
    const footerCopy = document.querySelector('.footer-copy');
    if (!footerCopy) return;
    const btn = document.createElement('button');
    btn.className = 'sf-footer-link';
    btn.id = 'sf-footer-btn';
    btn.textContent = 'Cookie-Einstellungen';
    btn.addEventListener('click', function () {
      if (!document.body.contains(modal)) document.body.appendChild(modal);
      openModal();
    });
    footerCopy.insertAdjacentElement('afterend', btn);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    if (!stored) document.body.appendChild(banner);
    document.body.appendChild(modal);

    document.getElementById('sf-accept').addEventListener('click', acceptAll);
    document.getElementById('sf-decline').addEventListener('click', declineAll);
    document.getElementById('sf-settings').addEventListener('click', openModal);
    document.getElementById('sf-modal-accept').addEventListener('click', acceptAll);
    document.getElementById('sf-save').addEventListener('click', saveSelection);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    injectFooterLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
