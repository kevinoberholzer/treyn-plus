/* TREYN+ Service Worker - App aufs Handy (Grundlage für den späteren Wochen-Check per Push)
 *
 * - Seiten (Navigation): zuerst das Netz, ohne Netz die zuletzt geladene index.html
 * - /assets/* (Dateien mit Hash im Namen, Inhalt ändert nie): zuerst der Cache, sonst das Netz
 * - /api/* und /_vercel/*: nie aus dem Cache, der Service Worker greift nicht ein
 * - alles andere (Symbole, Manifest, Bilder): normal übers Netz
 *
 * Version: die App registriert /sw.js?v=<Name der Haupt-Datei dieses Builds>. Jeder Deploy hat einen neuen Namen,
 * darum installiert der Browser beim nächsten Öffnen die neue Version, sie übernimmt sofort (skipWaiting + clients.claim)
 * und löscht die alten Caches. Die Seite selbst kommt immer zuerst vom Netz: eine alte Version kann nie hängen bleiben.
 */
const BUILD = (() => { try { return new URL(self.location.href).searchParams.get("v") || "0"; } catch (e) { return "0"; } })();
const SHELL = "treyn-shell-" + BUILD; // index.html dieses Builds (Rückfall ohne Netz)
const ASSETS = "treyn-assets-1";      // Dateien mit Hash; Nummer nur erhöhen, wenn sich die Logik hier ändert
const INDEX = "/index.html";

// Dateien, die eine index.html bzw. eine CSS-Datei aus /assets/ lädt
function htmlRefs(html) {
  const out = new Set(); const re = /(?:src|href)=["'](\/assets\/[^"'?#]+)["']/g; let m;
  while ((m = re.exec(String(html || "")))) out.add(m[1]);
  return [...out];
}
function cssRefs(css) {
  const out = new Set(); const re = /url\(\s*["']?(\/assets\/[^"')?#]+)/g; let m;
  while ((m = re.exec(String(css || "")))) out.add(m[1]);
  return [...out];
}
const okResponse = (res) => !!res && res.ok && res.type === "basic";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    // Ohne frische index.html keine Installation: dann bleibt die bisherige Version aktiv
    const res = await fetch("/", { cache: "no-store", credentials: "same-origin" });
    if (!okResponse(res) || !(res.headers.get("content-type") || "").includes("text/html")) throw new Error("TREYN+ sw: index.html " + res.status);
    const html = await res.clone().text();
    await (await caches.open(SHELL)).put(INDEX, res);
    // JS und CSS dieses Builds gleich mitnehmen (Schriften kommen beim ersten Gebrauch dazu)
    const assets = await caches.open(ASSETS);
    await Promise.all(htmlRefs(html).map(async (u) => {
      try {
        if (await assets.match(u, { ignoreVary: true })) return;
        const r = await fetch(u, { credentials: "same-origin" });
        if (okResponse(r)) await assets.put(u, r);
      } catch (e) { /* kommt beim ersten Gebrauch */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Alte Versionen weg (nur eigene Caches)
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith("treyn-") && n !== SHELL && n !== ASSETS).map((n) => caches.delete(n)));
    // Dateien mit Hash, die die aktuelle index.html (und ihr CSS) nicht mehr braucht, löschen
    try {
      const shell = await (await caches.open(SHELL)).match(INDEX);
      if (shell) {
        const assets = await caches.open(ASSETS);
        const keep = new Set(htmlRefs(await shell.text()));
        for (const u of [...keep]) {
          if (!u.endsWith(".css")) continue;
          const css = await assets.match(u, { ignoreVary: true });
          if (css) cssRefs(await css.text()).forEach((x) => keep.add(x));
        }
        for (const req of await assets.keys()) {
          const p = new URL(req.url).pathname;
          if (!keep.has(p)) await assets.delete(req);
        }
      }
    } catch (e) { /* Aufräumen ist nicht nötig für den Betrieb */ }
    await self.clients.claim();
  })());
});

// Antwort plus Arbeit danach (Cache schreiben), damit der Browser den Worker nicht zu früh beendet
function respond(event, work) {
  event.respondWith(work.then((x) => x.response));
  event.waitUntil(work.then((x) => x.done).catch(() => {}));
}

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    let done = Promise.resolve();
    if (okResponse(res) && !res.redirected && (res.headers.get("content-type") || "").includes("text/html")) {
      const copy = res.clone();
      done = caches.open(SHELL).then((c) => c.put(INDEX, copy)).catch(() => {});
    }
    return { response: res, done };
  } catch (err) {
    // Kein Netz: zuletzt geladene index.html (die App liest alle Angaben aus dem Speicher des Geräts)
    const cached = (await caches.match(INDEX, { cacheName: SHELL })) || (await caches.match(INDEX));
    if (cached) return { response: cached, done: Promise.resolve() };
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(request, { ignoreVary: true });
  if (hit) return { response: hit, done: Promise.resolve() };
  const res = await fetch(request);
  let done = Promise.resolve();
  if (okResponse(res)) { const copy = res.clone(); done = cache.put(request, copy).catch(() => {}); }
  return { response: res, done };
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;
  const p = url.pathname;
  if (p.startsWith("/api/") || p === "/api" || p.startsWith("/_vercel/")) return; // nie cachen
  if (req.mode === "navigate") {
    // Nur App-Seiten (ohne Dateiendung) fallen ohne Netz auf die App zurück, z. B. nicht /og.png
    if (/\.[a-z0-9]+$/i.test(p) && !p.endsWith(".html")) return;
    respond(event, networkFirst(req));
    return;
  }
  if (p.startsWith("/assets/")) { respond(event, cacheFirst(req)); return; }
});
