"use client";
import { useEffect, useState } from "react";

const MATOMO_URL = "https://matomo.drilex.cz/";
const OWA_URL = "https://owa.drilex.cz/";

function loadMatomo(siteId: string) {
  const w = window as any;
  if (w.__matomoLoaded) return;
  w.__matomoLoaded = true;
  const _paq = (w._paq = w._paq || []);
  _paq.push(["setTrackerUrl", MATOMO_URL + "matomo.php"]);
  _paq.push(["setSiteId", siteId]);
  // enable all available (free) tracking
  _paq.push(["enableLinkTracking"]);
  _paq.push(["enableHeartBeatTimer"]);
  _paq.push(["enableJSErrorTracking"]);
  _paq.push(["trackVisibleContentImpressions"]);
  _paq.push(["trackPageView"]);
  const g = document.createElement("script");
  g.async = true;
  g.src = MATOMO_URL + "matomo.js";
  document.head.appendChild(g);
}

function loadOwa(siteId: string) {
  const w = window as any;
  if (w.__owaLoaded) return;
  w.__owaLoaded = true;
  w.owa_baseUrl = OWA_URL;
  const owa_cmds = (w.owa_cmds = w.owa_cmds || []);
  owa_cmds.push(["setSiteId", siteId]);
  // enable all OWA tracking (incl. clicks + dom stream for heatmaps)
  owa_cmds.push(["trackPageView"]);
  owa_cmds.push(["trackClicks"]);
  owa_cmds.push(["trackDomStream"]);
  const s = document.createElement("script");
  s.async = true;
  s.src = OWA_URL + "modules/base/js/owa.tracker-combined-min.js";
  document.head.appendChild(s);
}

export default function CookieConsent({
  matomoSiteId,
  owaSiteId,
}: {
  matomoSiteId: string;
  owaSiteId: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let consent: string | null = null;
    try {
      consent = localStorage.getItem("drilex_consent");
    } catch {}
    if (consent === "accepted") {
      loadMatomo(matomoSiteId);
      loadOwa(owaSiteId);
    } else if (consent !== "declined") {
      setShow(true);
    }
  }, [matomoSiteId, owaSiteId]);

  const accept = () => {
    try {
      localStorage.setItem("drilex_consent", "accepted");
    } catch {}
    loadMatomo(matomoSiteId);
    loadOwa(owaSiteId);
    setShow(false);
  };
  const decline = () => {
    try {
      localStorage.setItem("drilex_consent", "declined");
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        bottom: 16,
        zIndex: 9999,
        maxWidth: 340,
        background: "#15151f",
        color: "#e6e6f0",
        border: "1px solid #2a2a3a",
        borderRadius: 14,
        padding: "16px 18px",
        boxShadow: "0 8px 30px rgba(0,0,0,.5)",
        fontSize: 13,
        lineHeight: 1.5,
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>🍪 Cookies &amp; soukromí</div>
      <div style={{ color: "#a0a0b8", marginBottom: 12 }}>
        Používáme vlastní analytiku (Matomo &amp; OWA) ke zlepšení webu. Souhlasíš se sběrem
        anonymních statistik?{" "}
        <a href="/gdpr" style={{ color: "#7c3aed", textDecoration: "underline" }}>
          Více info
        </a>
        .
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={accept}
          style={{
            flex: 1,
            background: "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "8px 12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Přijmout
        </button>
        <button
          onClick={decline}
          style={{
            flex: 1,
            background: "transparent",
            color: "#a0a0b8",
            border: "1px solid #2a2a3a",
            borderRadius: 9,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Odmítnout
        </button>
      </div>
    </div>
  );
}