import React, { useState, useEffect } from "react";

const C = {
  black:"#0A0A0A", white:"#FFFFFF", off:"#F7F7F5",
  neon:"#C8FF00", neonDim:"rgba(200,255,0,0.10)", neonBorder:"rgba(200,255,0,0.30)",
  g100:"#F2F2F0", g200:"#E5E5E2", g400:"#ADADAA", g600:"#6B6B68", g800:"#2A2A28",
  red:"#FF3B30", blue:"#007AFF", green:"#34C759", orange:"#FF9500", purple:"#AF52DE",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;background:${C.white};color:${C.black};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-size:15px;font-weight:400;letter-spacing:-.01em;}
  ::-webkit-scrollbar{width:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .fu{animation:fadeUp .4s ease forwards;}
  .fu2{animation:fadeUp .4s .07s ease forwards;opacity:0;}
  .fu3{animation:fadeUp .4s .14s ease forwards;opacity:0;}
  .fu4{animation:fadeUp .4s .21s ease forwards;opacity:0;}
  .fu5{animation:fadeUp .4s .28s ease forwards;opacity:0;}
  .su{animation:slideUp .45s cubic-bezier(.16,1,.3,1) forwards;}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;border-radius:12px;padding:12px 22px;font-family:'Inter',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .16s;letter-spacing:-.01em;}
  .btn-black{background:${C.black};color:${C.white};}
  .btn-black:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.18);}
  .btn-neon{background:${C.neon};color:${C.black};}
  .btn-neon:hover{box-shadow:0 6px 28px rgba(200,255,0,.45);transform:translateY(-1px);}
  .btn-ghost{background:transparent;color:${C.g600};border:1.5px solid ${C.g200};border-radius:10px;padding:9px 16px;font-family:'Inter',sans-serif;font-size:13px;cursor:pointer;transition:all .14s;}
  .btn-ghost:hover{border-color:${C.g400};color:${C.black};background:${C.g100};}
  .mono{font-family:'JetBrains Mono',monospace;font-size:10px;color:${C.g400};letter-spacing:.1em;text-transform:uppercase;font-weight:500;}
  .chip{display:inline-flex;align-items:center;gap:4px;background:${C.g100};color:${C.g600};font-size:11px;font-weight:500;padding:3px 8px;border-radius:100px;font-family:'JetBrains Mono',monospace;letter-spacing:.02em;}
  .chip.hi{background:${C.neonDim};color:${C.black};border:1px solid ${C.neonBorder};}
  input[type=text],input[type=email],input[type=number],select{font-family:'Inter',sans-serif;outline:none;transition:border-color .14s;}
  input[type=range]{-webkit-appearance:none;width:100%;height:3px;background:${C.g200};border-radius:2px;outline:none;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:${C.black};border-radius:50%;cursor:pointer;}
`;

// ─── SPORT GROUPS ─────────────────────────────────────────────────────────────

const SPORT_GROUPS = [
  {id:"cycling", label:"Cycling", icon:"CYCLING", subs:[
    {id:"road",    label:"Strasse",children:null},
    {id:"gravel",  label:"Gravel", children:null},
    {id:"mtb",     label:"MTB",    children:[{id:"mtb_xc",label:"XC"},{id:"mtb_enduro",label:"Enduro"},{id:"mtb_dh",label:"Downhill"}]},
    {id:"track_cy",label:"Bahn",   children:null},
  ]},
  {id:"running", label:"Running", icon:"RUN", subs:[
    {id:"run_road", label:"Strasse",children:[{id:"run_short",label:"Kurzdistanz"},{id:"run_half",label:"Halbmarathon"},{id:"run_marathon",label:"Marathon"},{id:"run_ultra",label:"Ultra 50–100K+"}]},
    {id:"run_trail",label:"Trail",  children:[{id:"trail_short",label:"Kurzdistanz"},{id:"trail_ultra",label:"Ultra 50–100K+"}]},
    {id:"run_track",label:"Bahn",   children:null},
  ]},
  {id:"triathlon", label:"Triathlon", icon:"TRI", subs:[
    {id:"sprint", label:"Sprint", children:null},
    {id:"olympic",label:"Olympia",children:null},
    {id:"t100",   label:"T100",   children:null},
    {id:"ironman",label:"Ironman",children:[{id:"tri_703",label:"70.3 — Half"},{id:"tri_full",label:"140.6 — Full"},{id:"tri_ultra",label:"Ultra Triathlon"}]},
  ]},
  {id:"schwimmen", label:"Schwimmen", icon:"SWIM", subs:[
    {id:"pool",     label:"Pool (25–50m)",children:null},
    {id:"openwater",label:"Open Water",   children:null},
  ]},
  {id:"fitness", label:"Hyrox & Kraftsport", icon:"GYM", subs:[
    {id:"hyrox",       label:"HYROX",        children:null},
    {id:"crossfit_d",  label:"CrossFit",     children:null},
    {id:"kraft",       label:"Krafttraining",children:null},
    {id:"powerlifting",label:"Powerlifting", children:null},
  ]},
  {id:"fussball",          label:"Fussball",          icon:"FOOT",  subs:null},
  {id:"eishockey",         label:"Eishockey",         icon:"ICE",   subs:null},
  {id:"ski_snow", label:"Ski / Snowboard", icon:"SKI", subs:[
    {id:"ski_alpin",   label:"Alpin",                   children:null},
    {id:"ski_freeride",label:"Freeride",                children:null},
    {id:"ski_free",    label:"Freestyle",               children:null},
    {id:"ski_touring", label:"Ski Touring / Splitboard",children:null},
  ]},
  {id:"langlauf", label:"Langlauf & Biathlon", icon:"XC", subs:[
    {id:"classic", label:"Classic", children:null},
    {id:"skating", label:"Skating", children:null},
    {id:"biathlon",label:"Biathlon",children:null},
  ]},
  {id:"tennis",            label:"Tennis",            icon:"TENNIS",subs:null},
  {id:"handball_vball", label:"Handball & Volleyball", icon:"HAND", subs:[
    {id:"handball",   label:"Handball",        children:null},
    {id:"volleyball", label:"Volleyball",      children:null},
  ]},
  {id:"basketball",        label:"Basketball",        icon:"BBALL", subs:null},
];

// Sport-spezifische Wettkampf-Typen
const COMPETITION_TYPES = {
  cycling:["Gran Fondo","Strassenrennen","Zeitfahren","Kriterium","Gravel Race","Etappenrennen"],
  running:["5K / 10K","Halbmarathon","Marathon","Trail Run","Ultra"],
  triathlon:["Sprint","Olympische Distanz","70.3 Half","Ironman Full","T100"],
  schwimmen:["Pool-Wettkampf","Open Water Event"],
  fussball:["Liga-Spiele","Pokalspiele","Freundschaftsspiele","Turniere"],
  eishockey:["Liga-Spiele","Playoff-Spiele","Turniere"],
  fitness:["HYROX Rennen","CrossFit Open","Powerlifting Meet","Wettkampf"],
  ski_snow:["Rennen Alpin","Freeride Contest","Freestyle Contest","Skitouren-Event","Halfpipe Contest"],
  langlauf:["Skimarathon","Staffelrennen","Biathlon-Wettkampf"],
  golf:["Turniere","Club-Meisterschaft","Stroke Play","Match Play"],
  basketball:["Liga-Spiele","Playoff-Spiele","Turniere"],
  american_football:["Liga-Spiele","Playoff-Spiele","Turniere"],
  handball_vball:["Liga-Spiele","Pokalspiele","Turniere","Beach Volleyball Turnier"],
  tennis:["ATP/WTA Turnier","ITF Turnier","Club-Meisterschaft","Doppel"],
};

const COMPETITION_LABEL = {
  cycling:"Rennen",running:"Rennen",triathlon:"Rennen",schwimmen:"Wettkämpfe",
  fussball:"Spiele & Turniere",eishockey:"Spiele & Turniere",
  fitness:"Wettkämpfe",ski_snow:"Rennen & Contests",langlauf:"Rennen",
  golf:"Turniere",basketball:"Spiele & Turniere",american_football:"Spiele & Turniere",
  handball_vball:"Spiele & Turniere",tennis:"Turniere",
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────

function SportIcon({icon, active, size=18}) {
  const col = active ? C.black : C.g600;
  const s = size;
  const icons = {
    CYCLING:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 6l-3 5h8"/><path d="M12 17.5l3-5.5 3 5.5"/></svg>,
    RUN:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="4" r="1.5"/><path d="M5 21l4-5 3 3 2-5"/><path d="M17 13l-3.5-5L16 4"/><path d="M10 8l2 5"/></svg>,
    TRI:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M5 16l4-8 3 3 3-3 4 8"/><path d="M9 6.5l3-2.5 3 2.5"/></svg>,
    SWIM:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c1 0 2 .5 3 .5S7 12 8 12s2 .5 3 .5S13 12 14 12s2 .5 3 .5S19 12 20 12s2 .5 2 .5"/><path d="M2 17c1 0 2 .5 3 .5S7 17 8 17s2 .5 3 .5S13 17 14 17s2 .5 3 .5S19 17 20 17s2 .5 2 .5"/><path d="M7.5 12V8l4-2.5 2.5 4.5"/><circle cx="7.5" cy="6" r="1"/></svg>,
    SKI:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="17" cy="4.5" r="1.5"/><path d="M3 20.5l5.5-7 3.5 3 3-5.5 5 8.5"/><path d="M3 20.5h18"/></svg>,
    GYM:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h-2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2"/><path d="M17.5 6.5h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2"/><line x1="6.5" y1="9" x2="17.5" y2="9"/><line x1="6.5" y1="7" x2="6.5" y2="11"/><line x1="17.5" y1="7" x2="17.5" y2="11"/><line x1="12" y1="6" x2="12" y2="12"/></svg>,
    XC:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="17" cy="4" r="1.5"/><path d="M4 20l5-14M20 20l-5-14"/><path d="M4 20l5-14 3 6 3-6 5 14"/><path d="M7.5 13h9"/></svg>,
    FOOT:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5"/><polygon points="12,5.5 13.8,8.3 12,11.5 10.2,8.3" strokeLinejoin="round"/><polygon points="5.2,9.8 8.4,9.2 10.2,11.8 8,13.8 5.2,12.8" strokeLinejoin="round"/><polygon points="18.8,9.8 15.6,9.2 13.8,11.8 16,13.8 18.8,12.8" strokeLinejoin="round"/><polygon points="7.5,17.2 8,13.8 10.5,14.8 11,18" strokeLinejoin="round"/><polygon points="16.5,17.2 16,13.8 13.5,14.8 13,18" strokeLinejoin="round"/></svg>,
    ICE:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5.5" y1="4.5" x2="16.5" y2="15.5"/><path d="M15.5 14.5L19 16.5 18 20 14.5 19 Z"/><ellipse cx="11" cy="17" rx="5.5" ry="2" /></svg>,
    VBALL:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c0 5-4.5 8.5-9 9"/><path d="M12 3c0 5 4.5 8.5 9 9"/><path d="M3.5 14.5c4 .5 7 3.5 8.5 6.5"/><path d="M20.5 14.5c-4 .5-7 3.5-8.5 6.5"/></svg>,
    BBALL:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a14.5 14.5 0 0 0 0 18M3 12h18"/><path d="M3.4 9h17.2M3.4 15h17.2"/></svg>,
    NFL:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)"/><path d="M9.5 6.5l5 11M14.5 6.5l-5 11"/><path d="M7 10l10 4M7 14l10-4"/></svg>,
    HAND:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>,
    GOLF:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18V3l7 4-7 4"/><path d="M5 21c0-2 3-3 7-3s7 1 7 3"/><line x1="12" y1="18" x2="12" y2="15"/></svg>,
    TENNIS:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c2 3 2 6 0 9s-2 6 0 9"/><path d="M3 12c3 2 6 2 9 0s6-2 9 0"/></svg>,
  };
  return icons[icon] || <svg width={s} height={s} viewBox="0 0 24 24"/>;
}

// ─── AFFILIATE LINKS ──────────────────────────────────────────────────────────

const AFF = {
  iherb:     q    => `https://iherb.com/search?kw=${encodeURIComponent(q)}&rcode=DEIN_CODE`,
  maurten:   slug => `https://www.maurten.com/products/${slug}?ref=DEIN_CODE`,
  mnstry:    slug => `https://mnstry.com/products/${slug}?ref=DEIN_CODE`,
  myprotein: q    => `https://www.myprotein.com/search?query=${encodeURIComponent(q)}&affil=DEIN_CODE`,
  sponser:   q    => `https://www.sponser.ch/de/search?q=${encodeURIComponent(q)}`,
};

const BASIS = [
  {id:"vitd3",    name:"Vitamin D3 + K2",      dose:"2000–4000 IE täglich",when:"Morgens, mit Fett",    why:"Immunsystem, Knochen, Hormonstatus — 70% der CH-Bevölkerung mangelhaft",   tags:["Täglich","Basis"],      link:AFF.iherb("vitamin d3 k2"),            shop:"iHerb",priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine Pause nötig", timing:"Morgens mit einer fetthaltigen Mahlzeit (Vit D ist fettlöslich)", hinweis:"Im Sommer Dosis auf 1000 IE reduzieren bei regelmässiger Sonne. Bluttest (25-OH-Vit D) nach 3 Monaten empfohlen. Zielwert: 40–60 ng/ml."}},
  {id:"omega3",barcode:"4260591610032",budget:{name:"Bodylab24 Omega-3",dose:"3 Kapseln täglich",when:"Zu einer Mahlzeit",why:"Günstige, solide Omega-3 Quelle — EPA/DHA Ratio etwas tiefer als Premium, aber deutlich günstiger.",price:"~CHF 0.20/Tag",shop:"Bodylab24",link:"https://www.bodylab24.ch/shop/omega-3-kapseln"},   name:"Omega-3 (EPA/DHA)",     dose:"2–3g täglich",        when:"Zu einer Mahlzeit",    why:"Entzündungshemmend, Herzgesundheit, HRV-Verbesserung",                    tags:["Täglich","Basis"],      link:AFF.iherb("omega 3 epa dha"),          shop:"iHerb",priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine Pause nötig", timing:"Zu einer Mahlzeit (reduziert Fischgeschmack und verbessert Absorption)", hinweis:"Mindestens 4 Wochen bis messbare Wirkung. Bei Blutverdünnern (ASS, Marcumar) Arzt konsultieren. Omega-3 Index Bluttest nach 3 Monaten empfohlen."}},
  {id:"magnesium",barcode:"076280172171",budget:{name:"Bodylab24 Magnesium",dose:"300–400mg täglich",when:"Abends, 1h vor Schlaf",why:"Magnesiumoxid statt Bisglycinate — günstige Option, etwas schlechtere Bioverfügbarkeit.",price:"~CHF 0.08/Tag",shop:"Bodylab24",link:"https://www.bodylab24.ch/shop/magnesium"},name:"Magnesium Bisglycinate",dose:"300–400mg täglich",   when:"Abends, 1h vor Schlaf",why:"Schlafqualität, Muskelentspannung, Krampfprävention",                    tags:["Täglich","Abends"],     link:AFF.iherb("magnesium bisglycinate"),   shop:"iHerb",priority:1,
   protocol:{dauer:"Ganzjährig (erhöhter Bedarf bei Sportlern)", pause:"Keine Pause nötig", timing:"1 Stunde vor dem Schlafengehen für beste Schlafwirkung", hinweis:"Bisglycinate hat deutlich bessere Bioverfügbarkeit als Magnesiumoxid. Einschleichen mit 150mg/Tag in Woche 1, dann volldosieren. Nicht gleichzeitig mit Zink oder Eisen nehmen."}},
];

const SPORT_SUPP = {
  cycling:{
    performance:[
      {id:"mau_caf",  name:"Maurten Gel 100 CAF 100",dose:"1–2 Gels/h",             when:"Rennen / Intervalle",         why:"Koffein + Kohlenhydrate für maximale Leistung. Offizielle Tour de France Nahrung.", tags:["Race-Day","Koffein"],      link:AFF.maurten("gel-100-caf-100"),       shop:"Maurten",  priority:1,
       protocol:{dauer:"Nur an Wettkampf-/Intervall-Tagen", pause:"Nicht täglich verwenden — Koffeintoleranz aufbauen vermeiden", timing:"45 min vor oder während hochintensiver Phase", hinweis:"Max. 1–2 pro Einheit. Koffein-Cutoff 6h vor Schlaf. An Ruhetagen kein Koffein für bessere Wirkung am Renntag."}},
      {id:"beta_cy",budget:{name:"iHerb Now Foods Beta-Alanin",dose:"3.2g täglich",when:"Aufgeteilt auf 2 Dosen",why:"Reines Beta-Alanin Pulver — kein Unterschied zur Markenware beim Wirkstoff.",price:"~CHF 0.30/Tag",shop:"iHerb",link:"https://www.iherb.com/pr/now-sports-nutrition-beta-alanine-pure-powder"},  name:"Beta-Alanin",             dose:"3.2–6.4g täglich",       when:"Aufgeteilt auf 2–4 Dosen",   why:"Puffert Laktat, verzögert Ermüdung bei hochintensiven Intervallen",             tags:["Pre-Workout","Ausdauer"],  link:AFF.iherb("beta alanine"),            shop:"iHerb",    priority:2,
       protocol:{dauer:"8–12 Wochen (Kur)", pause:"9 Wochen Pause nach 12-Wochen-Zyklus — dann neu starten", timing:"Dosis aufteilen: z.B. 3× 1.6g täglich, um Kribbeln (Parästhesie) zu minimieren", hinweis:"Wirkung tritt nach 3–4 Wochen spürbar ein, optimal nach 12 Wochen (maximale Carnosin-Sättigung). Kribbeln ist harmlos. Nicht mit Herzmedikamenten oder Potenzmitteln kombinieren."}},
      {id:"eisen_cy", name:"Eisen (Ferrochel)",        dose:"25–50mg — nur nach Bluttest",when:"Morgens nüchtern + Vit C",   why:"Sauerstofftransport — kritisch für Radfahrer. Nur nach ärztlichem Bluttest!",   tags:["Basis","Bluttest"],       link:AFF.iherb("iron ferrochel"),          shop:"iHerb",    priority:2,
       protocol:{dauer:"3–6 Monate (bis Ferritin normalisiert)", pause:"Nur bei nachgewiesenem Mangel nehmen — Überdosierung gefährlich", timing:"Morgens nüchtern + 50mg Vitamin C für optimale Absorption", hinweis:"ZWINGEND: Nur nach Bluttest nehmen (Ferritin < 30 ng/ml als Sportler). Nicht mit Magnesium, Calcium oder Kaffee nehmen (1h Abstand). Kontrollbluttest nach 3 Monaten."}},
    ],
    endurance:[
      {id:"mau_320",  name:"Maurten Drink Mix 320",   dose:"80g / 500ml",            when:"Ausfahrten über 2h",          why:"Hohe Kohlenhydratdichte ohne GI-Probleme dank Hydrogel-Technologie",            tags:["Training","Kohlenhydrate"],link:AFF.maurten("drink-mix-320"),         shop:"Maurten",  priority:1,
       protocol:{dauer:"Bei langen Einheiten, kein Zyklus nötig", pause:"Keine", timing:"1 Flasche pro Stunde ab Minute 30. Erst trainieren, dann im Rennen anwenden.", hinweis:"GI-Training notwendig — Darm muss Kohlenhydratmengen lernen. Erst mit kleineren Mengen beginnen (160er), dann auf 320 steigern."}},
      {id:"elek_cy",  name:"Sponser Elektrolyt-Tabs", dose:"1 Tab / 500ml",          when:"Während Training, Sommer",    why:"Natrium, Kalium, Magnesium — Krampfprävention und Leistungserhalt",             tags:["Hydration","Sommer"],     link:AFF.sponser("elektrolyt tabletten"),  shop:"Sponser",  priority:2,
       protocol:{dauer:"Ganzjährig bei intensivem Training", pause:"Keine", timing:"Bei Einheiten über 60 min oder ab 20°C Aussentemperatur", hinweis:"Bei sehr salzigem Schweiss (weisse Ränder auf Trikot) Dosierung auf 2 Tabs erhöhen."}},
    ],
    recovery:[
      {id:"whey_cy",budget:{name:"Bodylab24 Whey Protein",dose:"25–30g",when:"Innerhalb 30 min post-ride",why:"Konzentrat statt Isolat — etwas mehr Laktose, aber gute Qualität für deutlich weniger Geld.",price:"~CHF 1.20/Portion",shop:"Bodylab24",link:"https://www.bodylab24.ch/shop/whey-protein"},  name:"Whey Protein Isolat",     dose:"25–30g",                 when:"Innerhalb 30 min post-ride",  why:"Muskelreparatur und -aufbau. Schnellste Absorption aller Proteinquellen.",      tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"),shop:"Myprotein",priority:1,
       protocol:{dauer:"Ganzjährig, täglich nach Training", pause:"Keine", timing:"Innerhalb 30 Minuten nach der Einheit für optimales anaboles Fenster", hinweis:"Mit Kohlenhydraten kombinieren (Banana, Haferflocken) für bessere Aufnahme. Bei Laktoseintoleranz: Isolat statt Konzentrat wählen."}},
      {id:"ash_cy",budget:{name:"Lee-Sport Bio Ashwagandha",dose:"600mg täglich",when:"Abends",why:"Ohne KSM-66 Patentierung — ähnliche Wirkung bei deutlich tieferem Preis. Gute Wahl für Einsteiger.",price:"~CHF 0.35/Tag",shop:"vitafy.ch",link:"https://www.vitafy.de/lee-sport-bio-ashwagandha"},   name:"Ashwagandha KSM-66",      dose:"600mg täglich",          when:"Abends",                      why:"Senkt Cortisol, verbessert Schlaftiefe und Regeneration — klinisch belegt",     tags:["Abends","Adaptogen"],     link:AFF.iherb("ashwagandha ksm-66"),      shop:"iHerb",    priority:2,
       protocol:{dauer:"8–12 Wochen (Kur)", pause:"2–4 Wochen Pause nach 12 Wochen", timing:"Abends zur Schlafförderung, oder morgens zur Cortisol-Regulation — konsistent bleiben", hinweis:"Wirkung spürbar nach 4–8 Wochen. Nur KSM-66 oder Sensoril-Extrakt (5% Withanolide). Nicht bei Schilddrüsenerkrankungen ohne Arztabsprache. Nicht in der Schwangerschaft."}},
    ],
    health:[
      {id:"zink_cy",  name:"Zink 15mg",               dose:"15mg täglich",           when:"Abends, nicht mit Eisen",     why:"Immunabwehr, Testosteron, Wundheilung — bei Ausdauersportlern oft defizitär",  tags:["Täglich","Immunsystem"],  link:AFF.iherb("zinc 15mg"),               shop:"iHerb",    priority:2,
       protocol:{dauer:"3 Monate, dann Pause", pause:"4 Wochen Pause nach 3 Monaten — Kupfer-Haushalt überwachen", timing:"Abends, mindestens 2h Abstand zu Eisen und Calcium", hinweis:"Zink und Eisen konkurrieren — nie gleichzeitig nehmen. Bei >40mg/Tag sinkt Kupferspiegel. Bluttest nach 3 Monaten empfohlen."}},
      {id:"krea_cy",budget:{name:"Bulk Kreatin Monohydrat",dose:"5g täglich",when:"Täglich, nach Training",why:"Kreatin Monohydrat ist Kreatin Monohydrat — kein Preisunterschied beim Wirkstoff, nur bei Verpackung.",price:"~CHF 0.15/Tag",shop:"Bulk Nutrients",link:"https://www.bulknutrients.com.au/products/creatine-monohydrate"},  name:"Kreatin Monohydrat",       dose:"5g täglich",             when:"Täglich, nach Training",      why:"Verbessert Sprintleistung und Regeneration — am besten erforschtes Supplement", tags:["Täglich","Kraft"],        link:AFF.iherb("creatine monohydrate"),    shop:"iHerb",    priority:2,
       protocol:{dauer:"Ganzjährig möglich (kein Zyklus nötig)", pause:"Keine Pause wissenschaftlich notwendig — optional 4 Wochen/Jahr pausieren", timing:"Täglich 5g, Zeitpunkt weniger kritisch — am besten nach Training mit Kohlenhydraten", hinweis:"Keine Ladephase nötig — 3–5g täglich füllt Speicher in 3–4 Wochen. Leichte Gewichtszunahme (0.5–1kg Wassereinlagerung) ist normal. 3–5L Wasser täglich trinken."}},
    ],
  },
  running:{
    performance:[
      {id:"koff_run", name:"Koffein 100–200mg",       dose:"100–200mg",              when:"30–45 min vor Wettkampf",     why:"Kognitive Leistung + Ausdauer — bestens erforschtes Performance-Supplement",   tags:["Pre-Race","Koffein"],     link:AFF.iherb("caffeine 100mg"),          shop:"iHerb",    priority:1,
       protocol:{dauer:"Nur an Wettkampf- und Intervall-Tagen", pause:"Koffein-Pause 1 Woche vor Hauptrennen für maximale Wirkung", timing:"30–45 min vor dem Start oder der intensiven Phase", hinweis:"Koffein 6h vor Schlaf stoppen. Nüchterneinnahme kann GI-Probleme verursachen — mit kleinem Snack nehmen. Toleranz senken durch koffeinfreie Tage."}},
      {id:"mn_gel",   name:"MNSTRY Intensity Gel",    dose:"1 Gel alle 30–45 min",   when:"Tempo- oder Wettkampf",        why:"Magenfreundlich, natürliche Zutaten — genutzt von Canyon//SRAM und EF-Team", tags:["Race-Day","Carbs"],       link:AFF.mnstry("intensity-gel"),          shop:"MNSTRY",   priority:1,
       protocol:{dauer:"Nur bei Einheiten über 60 min", pause:"Keine", timing:"Erstes Gel nach 30–45 min, dann alle 30–45 min", hinweis:"GI-Training: Gels zuerst im Training testen, nie erstmals im Rennen. Mit Wasser einnehmen — niemals mit Sportgetränk (zu viel Zucker gleichzeitig)."}},
      {id:"eisen_run",name:"Eisen (Ferrochel)",        dose:"Nach Bluttest",          when:"Morgens nüchtern",             why:"Läufer haben erhöhten Eisenbedarf durch Fussstoss-Hämolyse — testen lassen",  tags:["Basis","Bluttest"],       link:AFF.iherb("iron ferrochel"),          shop:"iHerb",    priority:1,
       protocol:{dauer:"3–6 Monate bis Normalisierung", pause:"Nur mit nachgewiesenem Mangel — Überdosierung toxisch", timing:"Morgens nüchtern + Vitamin C, 1h vor dem Frühstück", hinweis:"Fussstoss-Hämolyse betrifft v.a. Langstreckenläufer. Ferritin-Zielwert für Sportler: 50–100 ng/ml. Kaffee, Calcium und Magnesium um 2h Abstand."}},
    ],
    endurance:[
      {id:"mau_160",  name:"Maurten Drink Mix 160",   dose:"40g / 500ml",            when:"Ab 60 min aufwärts",           why:"Ideal für Läufer — weniger dicht als 320, perfekt für Trainings und Rennen",  tags:["Training","Kohlenhydrate"],link:AFF.maurten("drink-mix-160"),         shop:"Maurten",  priority:1,
       protocol:{dauer:"Bei Einheiten über 60 min, kein Zyklus", pause:"Keine", timing:"Ab Minute 30–45, alle 30 min", hinweis:"GI-Test im Training notwendig — Darm muss Kohlenhydrate bei Lauftempo lernen. Viele Läufer vertragen beim Laufen weniger als beim Radfahren."}},
      {id:"rbeete",   name:"Rote Beete Nitrat",       dose:"400–600mg Nitrat",       when:"2–3h vor Training",            why:"Verbessert O2-Effizienz um 1–3% — besonders bei langen Einheiten relevant",   tags:["Pre-Training","Natürlich"],link:AFF.iherb("beet root nitrate"),       shop:"iHerb",    priority:2,
       protocol:{dauer:"6–7 Tage kontinuierlich laden, dann täglich", pause:"Keine langfristige Pause nötig", timing:"2–3 Stunden vor Wettkampf/Training, Peakwirkung nach 2–3h", hinweis:"Gepresster Rote-Beete-Saft (ca. 500ml) oder konzentrierte Shots. Mund mit Mundwasser vermeiden — zerstört Nitratlumwandlung durch Mundbakterien. Rote Verfärbung von Urin und Stuhl ist harmlos."}},
    ],
    recovery:[
      {id:"koll_run", name:"Kollagen + Vitamin C",    dose:"10–15g + 50mg Vit C",    when:"30 min vor Training",          why:"Sehnen- und Gelenkschutz — besonders wichtig für Läufer",                     tags:["Gelenke","Prävention"],   link:AFF.iherb("collagen vitamin c"),      shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig bei intensivem Lauftraining", pause:"Keine", timing:"30 min VOR dem Training (nicht danach) — Kollagen braucht Vorlaufzeit zur Synthese", hinweis:"Vitamin C gleichzeitig nehmen (erhöht Kollagensynthese). Typ I/II Kollagen bevorzugen. Wirkung auf Sehnen nach 3–6 Monaten messbar."}},
      {id:"tart_run", name:"Tart Cherry Extrakt",     dose:"480mg täglich",          when:"Nach langen Einheiten",        why:"Signifikante DOMS-Reduktion in mehreren RCTs belegt",                          tags:["Post-Training","DOMS"],   link:AFF.iherb("tart cherry"),             shop:"iHerb",    priority:2,
       protocol:{dauer:"Während harter Trainingsblöcke (2–7 Tage)", pause:"Keine Dauereinnahme nötig — situativ bei hartem Training", timing:"2× täglich (morgens + abends) in Phasen mit hoher Belastung", hinweis:"Besonders wirksam bei Wettkampfblöcken. Kann Schlaf verbessern (Melatonin-Gehalt). Fruchtsaft-Alternative: 300ml Kirschsaft 2× täglich."}},
    ],
    health:[
      {id:"vd3_run",  name:"Vitamin D3 + K2",         dose:"2000–4000 IE",           when:"Morgens",                      why:"Stressbruchprävention und Muskelfunktion — Läufer besonders gefährdet",        tags:["Basis","Knochen"],        link:AFF.iherb("vitamin d3 k2"),           shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Läufer haben erhöhtes Stressfraktur-Risiko — Vit D + Calcium-Versorgung kritisch. Bluttest alle 6 Monate."}},
    ],
  },
  fitness:{
    performance:[
      {id:"krea_fit", name:"Kreatin Monohydrat",      dose:"5g täglich",             when:"Post-Training",                why:"HYROX & CrossFit brauchen Kraft UND Ausdauer — Kreatin verbessert beides",    tags:["Täglich","Kraft"],        link:AFF.iherb("creatine monohydrate"),    shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig möglich", pause:"Keine Pause wissenschaftlich notwendig", timing:"Nach Training am effektivsten — Muskel ist aufnahmefähiger post-Workout", hinweis:"Keine Ladephase nötig. 5g täglich füllt Speicher in 3–4 Wochen. 0.5–1kg Gewichtszunahme durch Wassereinlagerung normal. 3–5L Wasser/Tag."}},
      {id:"koff_fit", name:"Koffein 200mg",           dose:"200mg",                  when:"30–40 min vor WOD",            why:"Fokus, Ausdauer und Kraftleistung für 60–90 min maximale Belastungen",         tags:["Pre-WOD","Koffein"],      link:AFF.iherb("caffeine 200mg"),          shop:"iHerb",    priority:1,
       protocol:{dauer:"Nur an Trainingstagen", pause:"1 Woche Koffein-Pause alle 6–8 Wochen empfohlen um Toleranz zu senken", timing:"30–40 min vor WOD, nüchtern oder leichter Snack", hinweis:"Kein Koffein nach 14 Uhr (schlechter Schlaf = schlechtere Recovery). Nüchterneinnahme kann Magenprobleme verursachen."}},
    ],
    endurance:[
      {id:"beta_fit", name:"Beta-Alanin",             dose:"3.2–4.8g täglich",       when:"Täglich, aufgeteilt",          why:"Puffert Laktat bei hochintensiven MetCon-Einheiten und HYROX-Stationen",      tags:["Täglich","MetCon"],       link:AFF.iherb("beta alanine"),            shop:"iHerb",    priority:1,
       protocol:{dauer:"8–12 Wochen (Kur)", pause:"9 Wochen Pause nach 12-Wochen-Zyklus", timing:"Dosis aufteilen: 2–3× täglich je 1.6g — Kribbeln (Parästhesie) ist harmlos", hinweis:"Wirkt v.a. bei Belastungen von 1–4 Minuten — ideal für MetCons und HYROX-Stationen. Wirkung nach 3–4 Wochen spürbar, optimal nach 12 Wochen."}},
    ],
    recovery:[
      {id:"whey_fit", name:"Whey Protein Isolat",     dose:"30–35g",                 when:"Direkt post-WOD",              why:"Starker Muskelabbau durch kombinierte Kraft+Ausdauer-Belastung reparieren",   tags:["Post-WOD","Protein"],     link:AFF.myprotein("whey protein isolate"),shop:"Myprotein",priority:1,
       protocol:{dauer:"Ganzjährig, nach jeder Einheit", pause:"Keine", timing:"Innerhalb 30 min post-WOD mit 30–50g Kohlenhydraten kombinieren", hinweis:"Bei 2× täglich Training: auch post-Einheit 2 supplementieren. Casein vor Schlaf optional für nächtliche Regeneration."}},
      {id:"koll_fit", name:"Kollagen + Vitamin C",    dose:"10–15g",                 when:"Vor Training",                 why:"Sehnen und Gelenke schützen — bei CrossFit und HYROX stark belastet",         tags:["Gelenke","Prävention"],   link:AFF.iherb("collagen vitamin c"),      shop:"iHerb",    priority:2,
       protocol:{dauer:"Ganzjährig bei intensivem Training", pause:"Keine", timing:"30 min VOR der Einheit — nicht danach", hinweis:"Typ I/II Kollagen. Vitamin C gleichzeitig essenziell für Synthese. Bei akuten Sehnenreizungen Dosis auf 20g erhöhen."}},
    ],
    health:[
      {id:"vd3_fit",  name:"Vitamin D3 + K2",         dose:"3000 IE",                when:"Morgens",                      why:"Knochen, Testosteron, Immunsystem — Basis für jeden Kraftsportler",           tags:["Basis","Täglich"],        link:AFF.iherb("vitamin d3 k2"),           shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"K2 (MK-7 Form) sichert korrekte Kalziumeinlagerung in Knochen statt Arterien. Bluttest nach 3 Monaten."}},
    ],
  },
  fussball:{
    performance:[
      {id:"krea_fb",  name:"Kreatin Monohydrat",      dose:"5g täglich",             when:"Post-Training",                why:"Verbessert Sprintleistung und Explosivität — direkt relevant für Fussball",   tags:["Täglich","Sprint"],       link:AFF.iherb("creatine monohydrate"),    shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig oder in Saison-Blöcken", pause:"Optional 4 Wochen in der Saisonpause", timing:"Nach Training oder Spiel, mit Kohlenhydraten", hinweis:"Besonders wirksam für Sprintwiederholungen — exakt das Anforderungsprofil Fussball. 0.5–1kg Gewichtszunahme normal."}},
      {id:"koff_fb",  name:"Koffein 100–200mg",       dose:"100–200mg",              when:"60 min vor Spiel",             why:"Reaktionszeit, Ausdauer und Konzentration im Spiel verbessern",                tags:["Pre-Game","Koffein"],     link:AFF.iherb("caffeine"),                shop:"iHerb",    priority:1,
       protocol:{dauer:"Nur an Spieltagen und intensiven Trainingstagen", pause:"An Ruhetagen kein Koffein für bessere Wirkung", timing:"60 min vor Spielbeginn", hinweis:"Bei Abendspielen: kein Koffein nach 20 Uhr wegen Schlafqualität. Koffein-Cutoff 6h vor Schlaf."}},
    ],
    recovery:[
      {id:"whey_fb",  name:"Whey Protein Isolat",     dose:"25–30g",                 when:"Direkt nach Spiel / Training", why:"Muskelschaden durch Zweikämpfe und Sprints reparieren",                       tags:["Post-Game","Protein"],    link:AFF.myprotein("whey protein isolate"),shop:"Myprotein",priority:1,
       protocol:{dauer:"Ganzjährig nach Spielen und intensiven Einheiten", pause:"Keine", timing:"Innerhalb 30–45 min post-Game", hinweis:"Mit schnellen Kohlenhydraten (60–80g) kombinieren für Glykogenauffüllung + Proteinaufnahme."}},
      {id:"carb_fb",  name:"Schnelle Kohlenhydrate",  dose:"60–80g innerhalb 30 min",when:"Direkt nach Spiel",            why:"Glykogenspeicher auffüllen — wichtig bei mehreren Spielen pro Woche",         tags:["Post-Game","Carbs"],      link:AFF.iherb("dextrose"),                shop:"iHerb",    priority:1,
       protocol:{dauer:"Nach jedem Spiel und harten Training", pause:"Keine", timing:"Direkt im Anschluss ans Spiel (innerhalb 30 min)", hinweis:"Bei >2 Spielen/Woche: Glykogenauffüllung kritisch. Dextrose, Maltodextrin oder Bananen/Weissbrot als Alternative."}},
    ],
    endurance:[
      {id:"beta_fb",  name:"Beta-Alanin",             dose:"3.2–4.8g täglich",       when:"Täglich",                      why:"Puffert Laktat in der Schlussphase des Spiels wenn Ermüdung einsetzt",        tags:["Ausdauer","Spätphase"],   link:AFF.iherb("beta alanine"),            shop:"iHerb",    priority:2,
       protocol:{dauer:"8–12 Wochen (Kur), idealerweise Vorsaison", pause:"9 Wochen Pause nach 12 Wochen", timing:"Täglich aufgeteilt auf 2–3 Dosen à 1.6g", hinweis:"Wirkt v.a. in der Schlussphase des Spiels (70.–90. Minute) wenn Laktat steigt. Kribbeln ist harmlos und verschwindet bei aufgeteilter Dosis."}},
    ],
    health:[
      {id:"vd3_fb",   name:"Vitamin D3",              dose:"2000–4000 IE",           when:"Morgens",                      why:"Verletzungsprävention, Immunsystem, Muskelfunktion",                          tags:["Basis","Täglich"],        link:AFF.iherb("vitamin d3"),              shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig (Wintersaison besonders wichtig)", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Fussballer trainieren oft in Hallen (Winter) — Vit D-Mangel besonders verbreitet. Bluttest Oktober und März empfohlen."}},
    ],
  },
};

const GENERIC_SUPP = {
  performance:[
    {id:"krea_g",name:"Kreatin Monohydrat",dose:"5g täglich",        when:"Nach Training",       why:"Kraft, Explosivität, Regeneration — am besten erforschtes Supplement",tags:["Täglich","Kraft"],   link:AFF.iherb("creatine monohydrate"),   shop:"iHerb",    priority:1,
     protocol:{dauer:"Ganzjährig möglich", pause:"Keine wissenschaftlich notwendig", timing:"Nach Training mit Kohlenhydraten", hinweis:"5g täglich ohne Ladephase. 3–4 Wochen bis Volle Wirkung."}},
    {id:"koff_g",name:"Koffein 100–200mg", dose:"100–200mg",         when:"45 min vor Training", why:"Ausdauer, Kraft, Reaktionszeit, Fettverbrennung",                    tags:["Pre-Training"],      link:AFF.iherb("caffeine"),               shop:"iHerb",    priority:1,
     protocol:{dauer:"Trainingstage, nicht täglich", pause:"Regelmässige koffeinfreie Tage für Toleranzreduktion", timing:"45 min vor Training, kein Koffein nach 14 Uhr", hinweis:"Koffein 6h vor Schlaf stoppen."}},
  ],
  endurance:[
    {id:"beta_g",name:"Beta-Alanin",       dose:"3.2–4.8g täglich",  when:"Aufgeteilt auf Tages-Dosen",why:"Puffert Laktat, verzögert Ermüdung bei hochintensiven Einheiten",   tags:["Täglich","Ausdauer"],link:AFF.iherb("beta alanine"),           shop:"iHerb",    priority:1,
     protocol:{dauer:"8–12 Wochen (Kur)", pause:"9 Wochen Pause nach 12 Wochen Einnahme", timing:"Dosis auf 2–3 Einnahmen aufteilen für weniger Kribbeln", hinweis:"Kribbeln (Parästhesie) harmlos. Nicht mit Herzmedikamenten kombinieren."}},
  ],
  recovery:[
    {id:"whey_g",name:"Whey Protein Isolat",dose:"25–30g",           when:"Innerhalb 30 min post-Training",why:"Muskelreparatur und -aufbau",                                   tags:["Post-Training"],     link:AFF.myprotein("whey protein isolate"),shop:"Myprotein",priority:1,
     protocol:{dauer:"Ganzjährig nach Trainingseinheiten", pause:"Keine", timing:"Innerhalb 30 min nach Training, mit Kohlenhydraten", hinweis:"Mit Wasser oder Milch mischen. Isolat bei Laktoseintoleranz."}},
    {id:"ash_g", name:"Ashwagandha KSM-66",dose:"600mg",             when:"Abends",              why:"Cortisol senken, Schlaf und Recovery verbessern",                    tags:["Abends"],            link:AFF.iherb("ashwagandha"),            shop:"iHerb",    priority:2,
     protocol:{dauer:"8–12 Wochen (Kur)", pause:"2–4 Wochen Pause nach 12 Wochen", timing:"Abends 1–2h vor Schlaf", hinweis:"Nur KSM-66 oder Sensoril-Extrakt. Nicht bei Schilddrüsenerkrankungen ohne Arztabsprache."}},
  ],
  health:[
    {id:"vd3_g", name:"Vitamin D3 + K2",   dose:"2000–4000 IE",      when:"Morgens",             why:"Immunsystem, Knochen, Hormonstatus — Basis für alle Sportler",       tags:["Basis","Täglich"],   link:AFF.iherb("vitamin d3 k2"),          shop:"iHerb",    priority:1,
     protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit (fettlöslich)", hinweis:"Bluttest nach 3 Monaten empfohlen. Zielwert: 40–60 ng/ml."}},
  ],
};

const HEALTH_ONLY_SUPP = [
  {id:"vd3_h",  name:"Vitamin D3 + K2",      dose:"2000 IE täglich",       when:"Morgens",           why:"Immunsystem, Knochen, Hormonstatus — 70% der CH-Bevölkerung mangelhaft",    tags:["Täglich","Basis"],        link:AFF.iherb("vitamin d3 k2"),          shop:"iHerb",    priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Fett", hinweis:"Im Sommer Dosis auf 1000 IE senken. Bluttest alle 6 Monate."}},
  {id:"omega_h",name:"Omega-3 (EPA/DHA)",     dose:"2g täglich",            when:"Zu einer Mahlzeit", why:"Herzgesundheit, Entzündungshemmend, kognitive Funktion",                   tags:["Täglich","Herz"],         link:AFF.iherb("omega 3 epa dha"),        shop:"iHerb",    priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Mit Hauptmahlzeit", hinweis:"Bei Blutverdünnern Arzt konsultieren. 4 Wochen bis Wirkung."}},
  {id:"mag_h",  name:"Magnesium Bisglycinate",dose:"300mg täglich",         when:"Abends",            why:"Schlafqualität, Muskelentspannung, Stressbewältigung",                     tags:["Täglich","Abends"],       link:AFF.iherb("magnesium bisglycinate"),shop:"iHerb",    priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"1h vor Schlaf", hinweis:"Nicht gleichzeitig mit Zink nehmen. Bisglycinate deutlich besser verfügbar als Oxid."}},
  {id:"zink_h", name:"Zink 15mg",             dose:"15mg täglich",          when:"Abends",            why:"Immunabwehr, Hautgesundheit, Hormonstatus",                                tags:["Täglich","Immunsystem"],  link:AFF.iherb("zinc 15mg"),              shop:"iHerb",    priority:2,
   protocol:{dauer:"3 Monate", pause:"4 Wochen Pause nach 3 Monaten", timing:"Abends, 2h Abstand zu Eisen/Calcium", hinweis:"Langzeit >40mg/Tag senkt Kupferspiegel."}},
  {id:"vitb_h", name:"Vitamin B-Komplex",     dose:"1 Kapsel täglich",      when:"Morgens",           why:"Energie, Nervensystem, Blutbildung",                                       tags:["Morgens","Energie"],      link:AFF.iherb("vitamin b complex"),      shop:"iHerb",    priority:2,
   protocol:{dauer:"3–6 Monate, dann neu evaluieren", pause:"1–2 Wochen Pause alle 3 Monate", timing:"Morgens mit Frühstück (färbt Urin gelb — normal)", hinweis:"Bei pflanzlicher Ernährung: besonders B12 einzeln prüfen. B12 Bluttest nach 3 Monaten."}},
];

function getSupplements(sportId, intensity, healthOnly) {
  if(healthOnly) return {basis:[], specific:HEALTH_ONLY_SUPP};
  const gm = {low:"health",medium:"endurance",high:"performance",competition:"performance"};
  const goalId = gm[intensity]||"health";
  const key = sportId==="cycling"?"cycling":sportId==="running"?"running":sportId==="triathlon"?"running":(sportId==="fitness"||sportId==="hyrox"||sportId==="crossfit_d"||sportId==="kraft")?"fitness":sportId==="fussball"?"fussball":null;
  const specific = key&&SPORT_SUPP[key]?(SPORT_SUPP[key][goalId]||[]):(GENERIC_SUPP[goalId]||[]);
  return {basis:BASIS, specific};
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────

function Logo({size="md"}) {
  const s = size==="lg"?{b:38,f:22,g:13}:size==="sm"?{b:22,f:13,g:8}:{b:30,f:17,g:10};
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:s.b,height:s.b,background:C.black,borderRadius:s.b*.28,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <div style={{width:s.g,height:s.g,background:C.neon,borderRadius:2,transform:"rotate(45deg)"}}/>
      </div>
      <span style={{fontSize:s.f,fontWeight:600,letterSpacing:"-.03em",fontFamily:"'Inter',sans-serif"}}>TREYN <span style={{color:C.neon}}>+</span></span>
    </div>
  );
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────

function TypeWriter({lines, onDone, speed=20, onCountryClick}) {
  const [lineIdx,setLineIdx]=useState(0);
  const [charIdx,setCharIdx]=useState(0);
  const [displayed,setDisplayed]=useState([]);
  const [cursor,setCursor]=useState(true);
  const [done,setDone]=useState(false);
  useEffect(()=>{const iv=setInterval(()=>setCursor(c=>!c),530);return()=>clearInterval(iv);},[]);
  useEffect(()=>{
    if(lineIdx>=lines.length){setDone(true);setTimeout(()=>onDone&&onDone(),600);return;}
    const line=lines[lineIdx];
    if(charIdx<line.text.length){
      const t=setTimeout(()=>{
        setDisplayed(d=>{const copy=[...d];if(!copy[lineIdx])copy[lineIdx]={...line,text:""};copy[lineIdx]={...line,text:line.text.slice(0,charIdx+1)};return copy;});
        setCharIdx(c=>c+1);
      },line.pause||speed+(Math.random()*14-7));
      return()=>clearTimeout(t);
    }else{const t=setTimeout(()=>{setLineIdx(l=>l+1);setCharIdx(0);},line.delay||280);return()=>clearTimeout(t);}
  },[lineIdx,charIdx,lines]);

  const renderText=(l)=>{
    if(done&&l.text.includes("22 Ländern")&&onCountryClick){
      const parts=l.text.split("22 Ländern");
      return <>{parts[0]}<span onClick={onCountryClick} style={{fontWeight:700,color:C.black,textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:3,cursor:"pointer"}}>22 Ländern</span>{parts[1]}</>;
    }
    return l.text;
  };

  return (
    <div style={{minHeight:220,display:"flex",flexDirection:"column"}}>
      {displayed.map((l,i)=>(
        <div key={i} style={{fontSize:l.size||14,fontWeight:l.weight||400,color:l.highlight?C.black:(l.color||C.black),letterSpacing:l.tracking||"-.01em",lineHeight:l.leading||1.7,marginBottom:l.mb||8,fontFamily:"'Inter',sans-serif",...(l.highlight?{display:"inline-block",background:C.neon,padding:"2px 10px 3px",borderRadius:6,marginLeft:-2}:{})}}>
          {renderText(l)}{i===lineIdx-1&&!done&&<span style={{opacity:cursor?1:0,color:l.highlight?C.black:C.neon,fontWeight:700,marginLeft:1}}>|</span>}
        </div>
      ))}
    </div>
  );
}

// ─── INTRO ────────────────────────────────────────────────────────────────────

function Intro({onNext, onDemo}) {
  const [logoVisible,setLogoVisible]=useState(false);
  const [typing,setTyping]=useState(false);
  const [btnVisible,setBtnVisible]=useState(false);
  const [showCountries,setShowCountries]=useState(false);
  useEffect(()=>{
    const t1=setTimeout(()=>setLogoVisible(true),300);
    const t2=setTimeout(()=>setTyping(true),800);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);

  const COUNTRIES_LIST=[
    {flag:"🇨🇭",name:"Schweiz"},
    {flag:"🇩🇪",name:"Deutschland"},{flag:"🇦🇹",name:"Österreich"},
    {flag:"🇫🇷",name:"Frankreich"},{flag:"🇮🇹",name:"Italien"},
    {flag:"🇪🇸",name:"Spanien"},{flag:"🇵🇹",name:"Portugal"},
    {flag:"🇳🇱",name:"Niederlande"},{flag:"🇧🇪",name:"Belgien"},
    {flag:"🇱🇺",name:"Luxemburg"},{flag:"🇩🇰",name:"Dänemark"},
    {flag:"🇸🇪",name:"Schweden"},{flag:"🇳🇴",name:"Norwegen"},
    {flag:"🇫🇮",name:"Finnland"},{flag:"🇵🇱",name:"Polen"},
    {flag:"🇨🇿",name:"Tschechien"},{flag:"🇭🇺",name:"Ungarn"},
    {flag:"🇷🇴",name:"Rumänien"},{flag:"🇬🇷",name:"Griechenland"},
    {flag:"🇮🇪",name:"Irland"},{flag:"🇬🇧",name:"Vereinigtes Königreich"},
    {flag:"🇺🇸",name:"USA"},
  ];

  const lines=[
    {text:"Die präziseste Plattform für Leistungsdaten, Supplements & Sportnahrung auf dem Markt. Vollkommen automatisiert.",size:26,weight:600,tracking:"-.03em",color:C.black,leading:1.2,mb:6,delay:180},
    {text:"Gemessen aus deinen Gesundheits- & Leistungsdaten. Wissenschaftlich belegt.",size:13,weight:400,color:C.g800,leading:1.6,mb:24,delay:200},
    {text:"56% aller Sportler haben zu wenig Vitamin D im Blut.",size:13,weight:600,color:C.black,leading:1.4,mb:4,highlight:true,delay:220},
    {text:"81% der Fussball- und Basketballspieler: Vitamin D-Mangel — obwohl sie regelmässig Sport treiben. (Frontiers in Nutrition, 2021)",size:13,weight:400,color:C.g600,leading:1.65,mb:18,delay:180},
    {text:"Nur 40% der Freizeitsportler supplementieren überhaupt.",size:13,weight:600,color:C.black,leading:1.4,mb:4,highlight:true,delay:220},
    {text:"Der Rest hofft, dass die Ernährung reicht. Tut sie nicht — besonders nicht bei intensivem Training. (PubMed, 2018)",size:13,weight:400,color:C.g600,leading:1.65,mb:20,delay:180},
    {text:"Auf Basis deiner Daten berechnet TREYN+ die optimalen Supplemente & Sportnahrung. Ab sofort verfügbar in 22 Ländern.",size:13,weight:400,color:C.g800,leading:1.7,mb:4,delay:160},
  ];

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.white,padding:40}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div style={{marginBottom:52,opacity:logoVisible?1:0,transform:logoVisible?"scale(1) translateY(0)":"scale(0.75) translateY(10px)",transition:"all .55s cubic-bezier(.34,1.56,.64,1)"}}>
          <Logo size="lg"/>
        </div>
        {typing&&<TypeWriter lines={lines} speed={13} onDone={()=>setBtnVisible(true)} onCountryClick={()=>setShowCountries(true)}/>}
        {btnVisible&&(
          <>
            <div style={{animation:"fadeUp .5s .1s ease forwards",opacity:0,marginTop:24}}>
              <div style={{width:1,height:28,background:C.g200,margin:"0 0 22px 1px"}}/>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button className="btn btn-neon" style={{fontSize:15,padding:"14px 28px"}} onClick={onNext}>Analyse starten →</button>
                <button onClick={onDemo} style={{padding:"14px 20px",borderRadius:12,border:"1px solid #E0E0E0",background:"#F5F5F5",color:"#666",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>Demo ansehen</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Countries modal */}
      {showCountries&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setShowCountries(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)"}}/>
          <div style={{position:"relative",background:C.white,borderRadius:18,padding:"22px",maxWidth:400,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.black}}>Verfügbare Länder</div>
                <div style={{fontSize:11,color:C.g400,marginTop:2}}>22 Länder · CH, EU & USA</div>
              </div>
              <button onClick={()=>setShowCountries(false)} style={{width:26,height:26,borderRadius:"50%",border:`1px solid ${C.g200}`,background:C.g100,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif"}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.g600} strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {COUNTRIES_LIST.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,background:i===0?C.neonDim:C.g100,border:i===0?`1px solid ${C.neonBorder}`:"none"}}>
                  <span style={{fontSize:16}}>{c.flag}</span>
                  <span style={{fontSize:12,fontWeight:i===0?700:400,color:C.black}}>{c.name}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>setShowCountries(false)}
              style={{width:"100%",background:C.black,color:C.white,border:"none",borderRadius:10,padding:"11px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif",marginTop:16}}>
              Schliessen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DEMO ─────────────────────────────────────────────────────────────────────

function Demo({onNext, onDemo}) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.white,padding:"40px 24px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div className="fu" style={{marginBottom:40}}><Logo size="lg"/></div>
        <div className="fu2"><span className="mono">So funktioniert es</span></div>
        <h2 className="fu2" style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:6,lineHeight:1.2,color:C.black}}>Deine Analyse in 5 Schritten.</h2>
        <p className="fu3" style={{fontSize:14,color:C.g600,marginBottom:28,lineHeight:1.65}}>3 Minuten Eingabe. Lebenslanges Profil — automatisch aktualisiert. Aus einer riesigen Datenbank & Partnershops empfehlen wir die für dich besten Produkte.</p>
        <div className="fu3" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:20}}>
          {/* Step 1 */}
          <div style={{background:C.white,borderRadius:12,border:`0.5px solid ${C.g200}`,padding:"12px 10px"}}>
            <div style={{background:C.black,color:C.neon,fontSize:10,fontWeight:700,width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>1</div>
            <div style={{fontSize:11,fontWeight:500,color:C.black,marginBottom:8,lineHeight:1.3}}>Sportarten</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <div style={{fontSize:10,color:C.black,padding:"3px 6px",background:C.neon,borderRadius:5,fontWeight:600,textAlign:"center"}}>Cycling ✓</div>
              <div style={{fontSize:10,color:C.g400,padding:"3px 6px",border:`0.5px solid ${C.g200}`,borderRadius:5,textAlign:"center"}}>Running</div>
              <div style={{fontSize:10,color:C.g400,padding:"3px 6px",border:`0.5px solid ${C.g200}`,borderRadius:5,textAlign:"center"}}>Gravel</div>
            </div>
          </div>
          {/* Step 2 */}
          <div style={{background:C.white,borderRadius:12,border:`0.5px solid ${C.g200}`,padding:"12px 10px"}}>
            <div style={{background:C.black,color:C.neon,fontSize:10,fontWeight:700,width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>2</div>
            <div style={{fontSize:11,fontWeight:500,color:C.black,marginBottom:8,lineHeight:1.3}}>Training</div>
            <div style={{fontSize:10,color:C.g600,marginBottom:4}}>5× / Woche</div>
            <div style={{height:3,background:C.g200,borderRadius:2,marginBottom:5,overflow:"hidden"}}><div style={{height:"100%",width:"70%",background:C.neon,borderRadius:2}}/></div>
            <div style={{fontSize:10,color:C.g600,marginBottom:5}}>90 min Ø</div>
            <div style={{fontSize:10,fontWeight:600,padding:"3px 6px",background:C.black,color:C.neon,borderRadius:5,textAlign:"center"}}>Intensiv</div>
          </div>
          {/* Step 3 */}
          <div style={{background:C.white,borderRadius:12,border:`0.5px solid ${C.g200}`,padding:"12px 10px"}}>
            <div style={{background:C.black,color:C.neon,fontSize:10,fontWeight:700,width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>3</div>
            <div style={{fontSize:11,fontWeight:500,color:C.black,marginBottom:8,lineHeight:1.3}}>Profil</div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:C.neon,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>K</div>
              <span style={{fontSize:10,color:C.black,fontWeight:500}}>Kevin M.</span>
            </div>
            <div style={{fontSize:9,color:C.g400,marginBottom:2}}>178 cm · 74 kg</div>
            <div style={{fontSize:9,color:C.g400}}>Apple Health ✓</div>
          </div>
          {/* Step 4 */}
          <div style={{background:C.white,borderRadius:12,border:`0.5px solid ${C.g400}`,padding:"12px 10px"}}>
            <div style={{background:C.black,color:C.neon,fontSize:10,fontWeight:700,width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>4</div>
            <div style={{fontSize:11,fontWeight:500,color:C.black,marginBottom:8,lineHeight:1.3}}>Analyse</div>
            <div style={{marginBottom:5}}>
              <div style={{fontSize:9,color:C.g400,marginBottom:2}}>Ruhe kcal</div>
              <div style={{fontSize:11,fontWeight:600,color:C.black}}>1'890</div>
            </div>
            <div style={{marginBottom:5}}>
              <div style={{fontSize:9,color:C.g400,marginBottom:2}}>Mit Training</div>
              <div style={{fontSize:11,fontWeight:600,color:C.neon,background:C.black,borderRadius:4,padding:"1px 5px",display:"inline-block"}}>3'240</div>
            </div>
            <div style={{fontSize:9,color:C.g400,lineHeight:1.4}}>Protein · Carbs · Vit D</div>
          </div>
          {/* Step 5 */}
          <div style={{background:C.black,borderRadius:12,padding:"12px 10px"}}>
            <div style={{background:C.neon,color:C.black,fontSize:10,fontWeight:700,width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>5</div>
            <div style={{fontSize:11,fontWeight:500,color:C.white,marginBottom:8,lineHeight:1.3}}>Produkte</div>
            <div style={{fontSize:10,color:C.neon,fontWeight:600,marginBottom:3}}>Maurten Gel</div>
            <div style={{fontSize:10,color:C.neon,fontWeight:600,marginBottom:3}}>Beta-Alanin</div>
            <div style={{fontSize:9,color:C.g600,marginBottom:6}}>+ 4 weitere</div>
            <div style={{fontSize:9,background:C.neon,color:C.black,padding:"3px 6px",borderRadius:4,fontWeight:600,textAlign:"center"}}>6 Picks ↗</div>
          </div>
        </div>
        <div className="fu4" style={{display:"flex",alignItems:"center",marginBottom:20}}>
          <div style={{height:1,flex:1,background:C.g200}}/>
          <div style={{fontSize:11,color:C.g400,padding:"0 12px"}}>3 Minuten · Magic Link Login</div>
          <div style={{height:1,flex:1,background:C.g200}}/>
        </div>
        <div className="fu5">
          <button className="btn btn-neon" style={{width:"100%",fontSize:15,padding:"14px"}} onClick={onNext}>Analyse starten →</button>
          <div style={{textAlign:"center",marginTop:10,fontSize:11,color:C.g400}}>Kein Passwort — Login per E-Mail-Link</div>
          <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.g200}`}}>
            <button onClick={onDemo} style={{width:"100%",padding:"12px",borderRadius:12,border:"1px solid #E0E0E0",background:"#F8F8F8",color:"#666",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
              Demo-Dashboard ansehen →
            </button>
            <div style={{textAlign:"center",marginTop:6,fontSize:10,color:C.g400}}>Musterprofil · Alle PRO-Features sichtbar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

function Progress({step,total}) {
  return (
    <div style={{marginBottom:36}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <Logo/><span className="mono" style={{fontSize:10,color:C.black}}>{step}/{total}</span>
      </div>
      <div style={{height:2,background:C.g200,borderRadius:1}}>
        <div style={{height:"100%",width:`${(step/total)*100}%`,background:C.neon,borderRadius:1,transition:"width .4s cubic-bezier(.16,1,.3,1)"}}/>
      </div>
    </div>
  );
}

// ─── STEP 1: SPORT ────────────────────────────────────────────────────────────

function StepSport({onNext}) {
  const [healthOnly,setHealthOnly]=useState(false);
  const [sel,setSel]=useState({});
  const [subSel,setSubSel]=useState({});
  const [childSel,setChildSel]=useState({});
  const [expanded,setExpanded]=useState(null);
  const [subExp,setSubExp]=useState(null);

  const toggleGroup=(id,hasSubs)=>{
    if(healthOnly)return;
    if(hasSubs){setExpanded(e=>e===id?null:id);setSel(s=>({...s,[id]:true}));}
    else{setSel(s=>({...s,[id]:!s[id]}));setExpanded(null);}
  };
  const toggleSub=(e,groupId,sub)=>{
    e.stopPropagation();
    if(sub.children){setSubExp(x=>x===sub.id?null:sub.id);setSubSel(s=>({...s,[sub.id]:true}));setSel(g=>({...g,[groupId]:true}));}
    else{setSubSel(s=>({...s,[sub.id]:!s[sub.id]}));setSel(g=>({...g,[groupId]:true}));}
  };
  const toggleChild=(e,subId,childId)=>{
    e.stopPropagation();
    const key=subId+"_"+childId;
    setChildSel(s=>({...s,[key]:!s[key]}));
    setSubSel(ss=>({...ss,[subId]:true}));
  };

  const totalCount=Object.values(sel).filter(Boolean).length;
  const selectedSports=Object.entries(sel).filter(([,v])=>v).map(([k])=>k);
  const primarySport=selectedSports[0]||null;

  // Sports with subs need at least one sub or child selected
  const missingDiscipline = selectedSports.filter(id=>{
    const s=SPORT_GROUPS.find(g=>g.id===id);
    if(!s?.subs||s.subs.length===0) return false;
    const hasSub=s.subs.some(sb=>
      subSel[sb.id]||
      (sb.children&&sb.children.some(ch=>childSel[sb.id+"_"+ch.id]))
    );
    return !hasSub;
  });

  const canNext=healthOnly||(totalCount>0&&missingDiscipline.length===0);

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:C.white,padding:"40px 24px 60px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <Progress step={1} total={5}/>
        <div className="su">
          <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:8,lineHeight:1.2}}>Wähle deine Sportarten.</h2>
          <p style={{fontSize:14,color:C.g600,marginBottom:24,lineHeight:1.65}}>Mehrfach-Auswahl möglich — selektiere alle Sportarten die du regelmässig betreibst. Bei einigen Sportarten öffnen sich die diversen Disziplinen.</p>

          {/* Health-only option */}
          <div onClick={()=>{setHealthOnly(h=>!h);if(!healthOnly){setSel({});setExpanded(null);}}}
            style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",border:`1.5px solid ${healthOnly?C.neon:C.g200}`,borderRadius:12,cursor:"pointer",background:healthOnly?C.neonDim:C.white,transition:"all .14s",marginBottom:16}}>
            <div style={{width:32,height:32,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:healthOnly?"rgba(0,0,0,.08)":C.g100}}>
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={healthOnly?C.black:C.g600} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:C.black}}>Ich treibe keinen Sport</div>
              <div style={{fontSize:11,color:C.g600,marginTop:2}}>Ich möchte Supplements aus gesundheitlichen Gründen — ohne Sportbezug</div>
            </div>
            {healthOnly&&<div style={{width:18,height:18,background:C.black,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.neon,flexShrink:0}}>✓</div>}
          </div>

          {/* Sport grid */}
          {!healthOnly&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {SPORT_GROUPS.map(s=>{
                const active=!!sel[s.id];
                const hasSubs=s.subs&&s.subs.length>0;
                const isOpen=expanded===s.id;
                const selSubs=hasSubs?s.subs.filter(sb=>subSel[sb.id]||sb.children?.some(ch=>childSel[sb.id+"_"+ch.id])):[];
                return (
                  <div key={s.id} style={{gridColumn:isOpen?"1 / -1":"auto"}}>
                    <div onClick={()=>toggleGroup(s.id,hasSubs)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:isOpen?"13px 13px 0 0":13,cursor:"pointer",transition:"all .15s",border:`1.5px solid ${active?C.neon:C.g200}`,background:active?C.neon:C.white}}>
                      <div style={{width:32,height:32,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:active?"rgba(0,0,0,.08)":C.g100}}>
                        <SportIcon icon={s.icon} active={active} size={17}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.black}}>{s.label}</div>
                        {selSubs.length>0&&<div style={{fontSize:10,color:"rgba(0,0,0,.5)",marginTop:1}}>{selSubs.map(sb=>sb.label).join(" · ")}</div>}
                        {selSubs.length===0&&hasSubs&&<div style={{fontSize:10,color:active?"rgba(0,0,0,.45)":C.g400,marginTop:1}}>{isOpen?"Disziplin wählen →":"Disziplinen →"}</div>}
                      </div>
                      {hasSubs&&<span style={{fontSize:11,color:"rgba(0,0,0,.4)",transition:"transform .18s",display:"inline-block",transform:isOpen?"rotate(180deg)":"none"}}>▼</span>}
                      {!hasSubs&&active&&<div style={{width:18,height:18,background:C.black,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.neon,flexShrink:0}}>✓</div>}
                    </div>
                    {isOpen&&hasSubs&&(
                      <div style={{padding:"10px 12px",background:C.g100,border:`1.5px solid ${C.neon}`,borderTop:"none",borderRadius:"0 0 13px 13px"}}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                          {s.subs.map(sb=>{
                            const on=!!subSel[sb.id]||(sb.children?.some(ch=>childSel[sb.id+"_"+ch.id]));
                            const isSubEx=subExp===sb.id;
                            return (
                              <div key={sb.id} onClick={e=>toggleSub(e,s.id,sb)} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:100,cursor:"pointer",fontSize:12,fontWeight:500,transition:"all .13s",background:on?C.black:C.white,color:on?C.neon:C.black,border:`1.5px solid ${on?C.black:C.g200}`}}>
                                {sb.label}
                                {sb.children&&<span style={{fontSize:9,opacity:.55}}>{isSubEx?"▲":"▼"}</span>}
                                {on&&!sb.children&&<span style={{fontSize:9,color:C.neon}}>✓</span>}
                              </div>
                            );
                          })}
                        </div>
                        {s.subs.map(sb=>{
                          if(subExp!==sb.id||!sb.children)return null;
                          return (
                            <div key={sb.id+"_ch"} style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.g200}`}}>
                              <span style={{fontSize:10,color:C.g400,width:"100%",fontFamily:"JetBrains Mono,monospace",letterSpacing:".04em"}}>{sb.label.toUpperCase()}</span>
                              {sb.children.map(ch=>{const ck=sb.id+"_"+ch.id;const con=!!childSel[ck];return(<div key={ch.id} onClick={e=>toggleChild(e,sb.id,ch.id)} style={{padding:"5px 12px",borderRadius:100,cursor:"pointer",fontSize:11,fontWeight:500,transition:"all .13s",background:con?C.neon:C.white,color:C.black,border:`1px solid ${con?C.neon:C.g200}`}}>{ch.label}{con&&" ✓"}</div>);})}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!healthOnly&&totalCount>0&&(
            <div style={{marginTop:10,padding:"10px 14px",background:missingDiscipline.length>0?"rgba(255,149,0,.08)":C.neonDim,borderRadius:11,border:`1px solid ${missingDiscipline.length>0?"rgba(255,149,0,.3)":C.neonBorder}`,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:6,height:6,background:missingDiscipline.length>0?C.orange:C.neon,borderRadius:"50%",animation:"pulse 2s infinite",flexShrink:0}}/>
              <span style={{fontSize:13,color:C.g800}}>
                {missingDiscipline.length>0
                  ? `${missingDiscipline.map(id=>SPORT_GROUPS.find(g=>g.id===id)?.label||id).join(", ")}: bitte noch eine Disziplin wählen`
                  : `${totalCount} ${totalCount===1?"Sportart":"Sportarten"} gewählt`
                }
              </span>
            </div>
          )}

          <div style={{display:"flex",justifyContent:"flex-end",marginTop:40}}>
            <button className="btn btn-black" style={{opacity:canNext?1:.4}} disabled={!canNext}
              onClick={()=>onNext({sel,subSel,childSel,primarySport,selectedSports,healthOnly})}>
              {healthOnly?"Weiter →":canNext?`Weiter mit ${totalCount} ${totalCount===1?"Sportart":"Sportarten"} →`:totalCount===0?"Mindestens 1 wählen":"Disziplin auswählen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: TRAINING ─────────────────────────────────────────────────────────

function StepTraining({sportData,onNext,onBack}) {
  const sports=sportData?.selectedSports||[];
  const init={};
  sports.forEach(id=>{init[id]={days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:5,compTypes:[]};});
  const [data,setData]=useState(init);
  const upd=(sportId,field,val)=>setData(d=>({...d,[sportId]:{...d[sportId],[field]:val}}));
  const toggleCompType=(sportId,type)=>{
    const cur=data[sportId]?.compTypes||[];
    const next=cur.includes(type)?cur.filter(t=>t!==type):[...cur,type];
    upd(sportId,"compTypes",next);
  };

  const INTENSITY=[
    {id:"low",label:"Leicht",desc:"Erholung, Basis"},
    {id:"medium",label:"Mittel",desc:"Normales Training"},
    {id:"high",label:"Hart",desc:"Intensiv, strukturiert"},
    {id:"competition",label:"Wettkampf",desc:"Rennen & Spiele"},
  ];

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:C.white,padding:"40px 24px 60px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <Progress step={2} total={5}/>
        <div className="su">
          <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:8,lineHeight:1.2}}>Dein Training.</h2>
          <p style={{fontSize:14,color:C.g600,marginBottom:32,lineHeight:1.65}}>Fülle für jede Sportart aus — so berechnet TREYN+ die optimalen Mengen.</p>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {sports.map(id=>{
              const s=SPORT_GROUPS.find(g=>g.id===id);
              const d=data[id]||{days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:5,compTypes:[]};
              const compLabel=COMPETITION_LABEL[id]||"Wettkämpfe";
              const compTypes=COMPETITION_TYPES[id]||[];
              return (
                <div key={id} style={{border:`1px solid ${C.g200}`,borderRadius:14,padding:"18px 20px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                    <div style={{width:32,height:32,borderRadius:8,background:C.g100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <SportIcon icon={s?.icon||"GYM"} active={false} size={16}/>
                    </div>
                    <span style={{fontSize:15,fontWeight:600}}>{s?.label||id}</span>
                  </div>

                  {/* Einheiten pro Woche — max 7 */}
                  <div style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:12,color:C.g600,fontWeight:500}}>Einheiten pro Woche</span>
                      <span style={{fontSize:13,fontWeight:600}}>{d.days}×</span>
                    </div>
                    <input type="range" min="1" max="7" step="1" value={d.days} onChange={e=>upd(id,"days",+e.target.value)}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                      <span style={{fontSize:10,color:C.g400}}>1×</span><span style={{fontSize:10,color:C.g400}}>7×</span>
                    </div>
                  </div>

                  {/* Durchschnittliche Einheitsdauer */}
                  <div style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:12,color:C.g600,fontWeight:500}}>Durchschnittliche Einheitsdauer (Ø)</span>
                      <span style={{fontSize:13,fontWeight:600}}>{d.duration} min</span>
                    </div>
                    <input type="range" min="20" max="360" step="10" value={d.duration} onChange={e=>upd(id,"duration",+e.target.value)}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                      <span style={{fontSize:10,color:C.g400}}>20 min</span><span style={{fontSize:10,color:C.g400}}>6h</span>
                    </div>
                  </div>

                  {/* Intensität */}
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:8}}>Intensität</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {INTENSITY.map(inten=>(
                        <div key={inten.id} onClick={()=>upd(id,"intensity",inten.id)}
                          style={{padding:"9px 12px",borderRadius:10,cursor:"pointer",transition:"all .13s",border:`1.5px solid ${d.intensity===inten.id?C.neon:C.g200}`,background:d.intensity===inten.id?C.neonDim:C.white}}>
                          <div style={{fontSize:12,fontWeight:600}}>{inten.label}</div>
                          <div style={{fontSize:10,color:C.g400,marginTop:2}}>{inten.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wettkämpfe / Rennen / Spiele */}
                  <div style={{padding:"12px 14px",background:C.g100,borderRadius:11}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:d.hasCompetition?14:0}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:500}}>{compLabel}</div>
                        <div style={{fontSize:11,color:C.g400,marginTop:1}}>Regelmässige {compLabel.toLowerCase()} oder Events</div>
                      </div>
                      <div onClick={()=>upd(id,"hasCompetition",!d.hasCompetition)}
                        style={{width:44,height:26,background:d.hasCompetition?C.black:C.g200,borderRadius:100,position:"relative",cursor:"pointer",transition:"background .18s",flexShrink:0}}>
                        <div style={{width:20,height:20,background:C.white,borderRadius:"50%",position:"absolute",top:3,left:d.hasCompetition?21:3,transition:"left .18s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
                      </div>
                    </div>

                    {d.hasCompetition&&(
                      <>
                        {/* Anzahl pro Jahr */}
                        <div style={{marginBottom:12}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <span style={{fontSize:11,color:C.g600}}>Ø Anzahl pro Jahr</span>
                            <span style={{fontSize:12,fontWeight:600}}>{d.compCount}</span>
                          </div>
                          <input type="range" min="1" max="50" step="1" value={d.compCount} onChange={e=>upd(id,"compCount",+e.target.value)}/>
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                            <span style={{fontSize:10,color:C.g400}}>1</span><span style={{fontSize:10,color:C.g400}}>50+</span>
                          </div>
                        </div>

                        {/* Wettkampf-Typen Multi-Select */}
                        {compTypes.length>0&&(
                          <div>
                            <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Art der {compLabel}</div>
                            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                              {compTypes.map(type=>{
                                const on=(d.compTypes||[]).includes(type);
                                return (
                                  <div key={type} onClick={()=>toggleCompType(id,type)}
                                    style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 11px",borderRadius:100,cursor:"pointer",fontSize:11,fontWeight:500,transition:"all .13s",background:on?C.black:C.white,color:on?C.neon:C.black,border:`1.5px solid ${on?C.black:C.g200}`}}>
                                    {type}{on&&<span style={{fontSize:9,color:C.neon}}>✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:40}}>
            <button className="btn-ghost" onClick={onBack}>← Zurück</button>
            <button className="btn btn-black" onClick={()=>onNext(data)}>Weiter →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: PROFIL ───────────────────────────────────────────────────────────

const COUNTRIES=[
  {v:"Schweiz",flag:"🇨🇭"},{v:"Deutschland",flag:"🇩🇪"},{v:"Österreich",flag:"🇦🇹"},
  {v:"Frankreich",flag:"🇫🇷"},{v:"Italien",flag:"🇮🇹"},{v:"Spanien",flag:"🇪🇸"},
  {v:"Portugal",flag:"🇵🇹"},{v:"Niederlande",flag:"🇳🇱"},{v:"Belgien",flag:"🇧🇪"},
  {v:"Luxemburg",flag:"🇱🇺"},{v:"Dänemark",flag:"🇩🇰"},{v:"Schweden",flag:"🇸🇪"},
  {v:"Norwegen",flag:"🇳🇴"},{v:"Finnland",flag:"🇫🇮"},{v:"Polen",flag:"🇵🇱"},
  {v:"Tschechien",flag:"🇨🇿"},{v:"Ungarn",flag:"🇭🇺"},{v:"Rumänien",flag:"🇷🇴"},
  {v:"Griechenland",flag:"🇬🇷"},{v:"Irland",flag:"🇮🇪"},{v:"Vereinigtes Königreich",flag:"🇬🇧"},
  {v:"USA",flag:"🇺🇸"},
];
const PLATFORMS=[
  {id:"apple",  label:"Apple Health", desc:"Grösse, Gewicht, HRV, Aktivität"},
  {id:"whoop",  label:"WHOOP",        desc:"Recovery, Strain, Sleep, HRV"},
  {id:"garmin", label:"Garmin",       desc:"HR, Power, Sleep, HRV, VO2max"},
  {id:"polar",  label:"Polar",        desc:"HR, VO2max, Recovery, Training"},
  {id:"manual", label:"Manuell",      desc:"Daten selbst eingeben"},
];

function calcBMR(gender,weight,height,age){
  if(!weight||!height||!age)return null;
  const w=+weight,h=+height,a=+age;
  if(gender==="f") return Math.round(447.593+(9.247*w)+(3.098*h)-(4.330*a));
  return Math.round(88.362+(13.397*w)+(4.799*h)-(5.677*a));
}

function StepProfil({sportData,trainingData,onNext,onBack}) {
  const [platform,setPlatform]=useState(null);
  const [appleConnecting,setAppleConnecting]=useState(false);
  const [appleConnected,setAppleConnected]=useState(false);
  const [form,setForm]=useState({firstname:"",lastname:"",email:"",country:"Schweiz",gender:"",birthyear:"",weight:"",height:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const handlePlatform=(id)=>{
    setPlatform(id);
    if(id==="apple"){
      setAppleConnecting(true);
      setTimeout(()=>{
        // Simulate Apple Health data pull
        setForm(f=>({...f,
          firstname:"Kevin",
          lastname:"Muster",
          email:"kevin@beispiel.ch",
          gender:"m",
          birthyear:"1988",
          height:"180",
          weight:"76",
          country:"Schweiz",
        }));
        setAppleConnecting(false);
        setAppleConnected(true);
      },1800);
    } else {
      setAppleConnected(false);
    }
  };

  const isManual=platform==="manual";
  const isAuto=platform&&platform!=="manual";

  const age=form.birthyear?new Date().getFullYear()-+form.birthyear:null;
  const bmr=calcBMR(form.gender,form.weight,form.height,age);

  const inp=(val)=>({width:"100%",padding:"12px 14px",border:`1.5px solid ${val?C.neon:C.g200}`,borderRadius:11,fontSize:14,background:val?C.neonDim:C.white,color:C.black,fontFamily:"Inter,sans-serif"});
  const sel={width:"100%",padding:"12px 14px",border:`1.5px solid ${C.g200}`,borderRadius:11,fontSize:14,background:C.white,color:C.black,fontFamily:"Inter,sans-serif",appearance:"none"};

  const valid=form.firstname&&form.lastname&&form.email.includes("@")&&form.email.includes(".")&&platform;

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:C.white,padding:"40px 24px 60px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <Progress step={3} total={5}/>
        <div className="su">
          <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:8,lineHeight:1.2}}>Deine Daten.</h2>
          <p style={{fontSize:14,color:C.g600,marginBottom:24,lineHeight:1.65}}>Gib deine Personalien & Daten ein. Mit deiner E-Mail speichern wir dein Profil, du kannst es jederzeit per Link aufrufen, ohne Passwort.</p>

          {/* Plattformen 3-spaltig kompakt */}
          <div style={{marginBottom:24}}>
            <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Welche Plattform nutzt du?</div>
            <div style={{fontSize:12,color:C.g400,marginBottom:10,lineHeight:1.5}}>Wenn du eine Plattform verbindest, beziehen wir Gewicht, Grösse, HRV und weitere Körperdaten automatisch — du musst nichts manuell eingeben.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
              {PLATFORMS.map(p=>(
                <div key={p.id} onClick={()=>handlePlatform(p.id)}
                  style={{padding:"11px 10px",borderRadius:11,cursor:"pointer",transition:"all .14s",border:`1.5px solid ${platform===p.id?C.neon:C.g200}`,background:platform===p.id?C.neonDim:C.white,textAlign:"center",position:"relative"}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:3}}>{p.label}</div>
                  <div style={{fontSize:10,color:C.g400,lineHeight:1.3}}>{p.desc}</div>
                  {p.id==="apple"&&appleConnecting&&(
                    <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.9)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}>
                      <div style={{width:16,height:16,border:`2px solid ${C.neon}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                      <div style={{fontSize:9,color:C.g600}}>Verbinden...</div>
                    </div>
                  )}
                  {p.id==="apple"&&appleConnected&&!appleConnecting&&(
                    <div style={{marginTop:5,fontSize:9,color:"#27AE60",fontWeight:600}}>✓ Daten importiert</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Name */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div>
              <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Vorname *</div>
              <input type="text" value={form.firstname} onChange={e=>set("firstname",e.target.value)} placeholder="Max" style={inp(form.firstname)}/>
            </div>
            <div>
              <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Nachname *</div>
              <input type="text" value={form.lastname} onChange={e=>set("lastname",e.target.value)} placeholder="Muster" style={inp(form.lastname)}/>
            </div>
          </div>

          {/* Herkunft direkt nach Name */}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Herkunft</div>
            <select value={form.country} onChange={e=>set("country",e.target.value)} style={sel}>
              {COUNTRIES.map(c=><option key={c.v} value={c.v}>{c.flag} {c.v}</option>)}
            </select>
          </div>

          {/* Körperdaten */}
          {(isManual||platform)&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
                <div>
                  <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Geschlecht</div>
                  <select value={form.gender} onChange={e=>set("gender",e.target.value)} style={sel}>
                    <option value="">— wählen</option>
                    <option value="m">Männlich</option>
                    <option value="f">Weiblich</option>
                  </select>
                </div>
                <div>
                  <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Geburtsjahr</div>
                  <input type="number" value={form.birthyear} onChange={e=>set("birthyear",e.target.value)} placeholder="Eingeben" min="1940" max={new Date().getFullYear()-16} style={{...inp(form.birthyear),width:"100%"}}/>
                </div>
                <div>
                  <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Grösse (cm)</div>
                  <input type="number" value={form.height} onChange={e=>set("height",e.target.value)} placeholder="Eingeben" style={{...inp(form.height),width:"100%"}}/>
                </div>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Gewicht (kg)</div>
                <input type="number" value={form.weight} onChange={e=>set("weight",e.target.value)} placeholder="Eingeben" style={{...inp(form.weight),width:"100%"}}/>
              </div>

              {/* Optional performance fields */}
              <div style={{marginBottom:10,padding:"12px 14px",background:C.g100,borderRadius:11,border:`1px solid ${C.g200}`}}>
                <div style={{fontSize:11,color:C.g400,marginBottom:10}}>Optional — für genauere VO₂max & Erholungs-Berechnungen</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div>
                    <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Ruhepuls (bpm)</div>
                    <input type="number" value={form.rhr||""} onChange={e=>set("rhr",e.target.value)} placeholder="z.B. 52" min="30" max="100" style={{...inp(form.rhr),width:"100%"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Schlaf (Stunden/Nacht)</div>
                    <input type="number" value={form.sleep||""} onChange={e=>set("sleep",e.target.value)} placeholder="z.B. 7.5" min="4" max="12" step="0.5" style={{...inp(form.sleep),width:"100%"}}/>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Live kcal preview */}
          {bmr&&(
            <div style={{marginTop:4,marginBottom:10,padding:"16px 18px",background:C.neon,borderRadius:13,animation:"fadeUp .4s ease forwards"}}>
              <div className="mono" style={{color:"rgba(0,0,0,.5)",marginBottom:10}}>Erste Schätzung · wird nach Analyse präzisiert</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:11,color:"rgba(0,0,0,.6)",marginBottom:4}}>Grundumsatz (Ruhe)</div>
                  <div style={{fontSize:22,fontWeight:700,color:C.black,letterSpacing:"-.03em"}}>{bmr.toLocaleString("de-CH")}</div>
                  <div style={{fontSize:10,color:"rgba(0,0,0,.5)"}}>kcal / Tag</div>
                </div>
                <div>
                  <div style={{fontSize:11,color:"rgba(0,0,0,.6)",marginBottom:4}}>Mit Training (Ø)</div>
                  <div style={{fontSize:22,fontWeight:700,color:C.black,letterSpacing:"-.03em"}}>{Math.round(bmr*1.65).toLocaleString("de-CH")}</div>
                  <div style={{fontSize:10,color:"rgba(0,0,0,.5)"}}>kcal / Tag</div>
                </div>
              </div>
              <div style={{marginTop:10,fontSize:11,color:"rgba(0,0,0,.55)",lineHeight:1.5}}>Genaue Werte — nach Sportart, Trainingstag und Ruhephase — werden nach der Analyse angezeigt.</div>
            </div>
          )}

          {/* E-Mail am Schluss */}
          <div style={{marginBottom:4}}>
            <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>E-Mail *</div>
            <input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="deine@email.ch" style={inp(form.email.includes("@")&&form.email.includes("."))}/>
            <div style={{fontSize:11,color:C.g400,marginTop:5}}>Wir speichern dein Profil unter dieser Adresse — du kannst es jederzeit per Link abrufen, kein Passwort nötig.</div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32}}>
            <button className="btn-ghost" onClick={onBack}>← Zurück</button>
            <button className="btn btn-black" style={{opacity:valid?1:.4}} disabled={!valid} onClick={()=>valid&&onNext({...form,platform})}>
              Berechnungen anzeigen →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────

const SPORT_MET = {
  cycling:          {low:4.0, medium:7.5, high:10.5, competition:14.0},
  running:          {low:5.5, medium:9.0, high:12.0, competition:16.0},
  triathlon:        {low:6.0, medium:9.5, high:13.0, competition:16.5},
  schwimmen:        {low:4.5, medium:7.0, high:9.5,  competition:12.0},
  ski_snow:         {low:4.0, medium:6.0, high:8.5,  competition:11.0},
  fitness:          {low:4.5, medium:7.0, high:9.5,  competition:12.5},
  langlauf:         {low:6.5, medium:10.0,high:13.5, competition:17.0},
  fussball:         {low:5.0, medium:7.5, high:9.5,  competition:11.0},
  eishockey:        {low:5.5, medium:8.0, high:10.5, competition:12.5},
  basketball:       {low:4.5, medium:7.0, high:9.0,  competition:11.0},
  american_football:{low:4.0, medium:6.5, high:8.5,  competition:10.5},
  handball_vball:   {low:4.5, medium:7.0, high:9.0,  competition:11.0},
  tennis:           {low:4.0, medium:6.5, high:8.5,  competition:10.5},
  golf:             {low:3.0, medium:4.5, high:5.5,  competition:6.0},
};
const SWEAT_RATE = {low:0.5, medium:0.9, high:1.4, competition:2.0};
const SODIUM_PER_L = {
  cycling:950, running:900, triathlon:900, schwimmen:700, ski_snow:600,
  fitness:950, langlauf:850, fussball:900, eishockey:850, basketball:900,
  american_football:950, handball_vball:900, tennis:900, golf:600,
};
const PROTEIN_NEED = {
  endurance:{low:1.2, medium:1.4, high:1.6, competition:1.8},
  strength: {low:1.6, medium:1.8, high:2.0, competition:2.2},
  team:     {low:1.4, medium:1.6, high:1.8, competition:2.0},
  skill:    {low:1.2, medium:1.4, high:1.5, competition:1.6},
};
const SPORT_TYPE_MAP = {
  cycling:"endurance", running:"endurance", triathlon:"endurance", schwimmen:"endurance", langlauf:"endurance",
  fitness:"strength",
  fussball:"team", eishockey:"team", basketball:"team", american_football:"team", handball_vball:"team",
  tennis:"skill", golf:"skill", ski_snow:"skill",
};
const CARB_NEED = {low:3, medium:5, high:7, competition:10};
const HIGH_IRON_RISK = ["running","triathlon","langlauf","cycling","schwimmen"];

function calcBMRfn(gender,w,h,age) {
  return gender==="f"?447.593+(9.247*w)+(3.098*h)-(4.330*age):88.362+(13.397*w)+(4.799*h)-(5.677*age);
}

function calcBasic(profilData, trainingData, healthOnly) {
  const gender=profilData?.gender||"m", w=+profilData?.weight||75, h=+profilData?.height||175;
  const age=profilData?.birthyear?new Date().getFullYear()-+profilData.birthyear:30;
  const bmr=Math.round(calcBMRfn(gender,w,h,age));
  if(healthOnly) return {bmr, withTraining:Math.round(bmr*1.2), trainingExtra:Math.round(bmr*0.2)};
  const extra=Math.round(bmr*0.5);
  return {bmr, withTraining:bmr+extra, trainingExtra:extra};
}

function calcPro(profilData, trainingData, sportData) {
  const healthOnly=sportData?.healthOnly;
  const gender=profilData?.gender||"m", w=+profilData?.weight||75, h=+profilData?.height||175;
  const age=profilData?.birthyear?new Date().getFullYear()-+profilData.birthyear:30;
  const isFemale=gender==="f";
  const bmr=Math.round(calcBMRfn(gender,w,h,age));
  if(healthOnly) return {bmr,withTraining:Math.round(bmr*1.2),trainingExtra:Math.round(bmr*0.2),
    restDay:bmr,trainingDay:Math.round(bmr*1.2),proteinMin:Math.round(w*1.2),proteinMax:Math.round(w*1.4),
    carbsG:Math.round(w*3),natriumMg:0,magnesiumMg:300,sweatLitresPerSession:0,ironRisk:isFemale,isFemale,w,
    waterMl:Math.round(w*35),fatBurnMin:Math.round((220-age)*0.60),fatBurnMax:Math.round((220-age)*0.70)};
  let totalKcal=0, totalSweat=0, totalNa=0, totalMg=0, maxProt=0, maxCarb=0, ironRisk=isFemale, totalDays=0;
  Object.entries(trainingData||{}).forEach(([id,d])=>{
    const intens=d.intensity||"medium", days=d.days||3, durH=(d.duration||60)/60;
    const met=(SPORT_MET[id]||SPORT_MET.fussball)[intens];
    const sweat=SWEAT_RATE[intens], naPerL=SODIUM_PER_L[id]||900;
    const kcalS=met*w*durH, sweatS=sweat*durH, naS=sweatS*naPerL, mgS=sweatS*36;
    const compX=d.hasCompetition?(d.compCount||0)*kcalS*0.3/365:0;
    totalKcal+=(kcalS*days)/7+compX; totalSweat+=(sweatS*days)/7;
    totalNa+=(naS*days)/7; totalMg+=(mgS*days)/7; totalDays+=days;
    const st=SPORT_TYPE_MAP[id]||"endurance";
    const pf=(PROTEIN_NEED[st]||PROTEIN_NEED.endurance)[intens]; if(pf>maxProt)maxProt=pf;
    const cf=CARB_NEED[intens]; if(cf>maxCarb)maxCarb=cf;
    if(HIGH_IRON_RISK.includes(id)&&(intens==="high"||intens==="competition"))ironRisk=true;
  });
  const daysPerWeek=Math.min(totalDays,7);
  const trainingDayKcal=Math.round(bmr+(totalKcal*7/Math.max(daysPerWeek,1)));
  const sleep = +profilData?.sleep || 7.5;
  const sleepDeficit = sleep < 7 ? (7 - sleep) : 0; // hours below optimal
  const waterMl = Math.round(w * 35 + (totalSweat * 1000 * 7) / 7);
  const maxHR = Math.round(220 - age);
  const fatBurnMin = Math.round(maxHR * 0.60);
  const fatBurnMax = Math.round(maxHR * 0.70);
  // VO2max estimation — Uth-Sørensen formula adjusted for training volume
  const VO2MAX_SPORTS = ["cycling","running","swimming","triathlon","langlauf","rudern","velo"];
  const hasEndurance = Object.keys(trainingData||{}).some(id => VO2MAX_SPORTS.some(s => id.includes(s)));
  let vo2max = null;
  if(hasEndurance) {
    const hrRest = +profilData?.rhr || (isFemale ? 62 : 58); // use real RHR if available
    const base = 15 * (maxHR / hrRest); // Uth formula
    const genderAdj = isFemale ? -4 : 0;
    const ageAdj = age > 40 ? -(age-40)*0.5 : 0;
    const trainingAdj = Math.min(daysPerWeek * 0.8, 6);
    const intensAdj = maxProt > 1.6 ? 3 : 0; // high intensity proxy
    vo2max = Math.round(Math.max(25, Math.min(85, base + genderAdj + ageAdj + trainingAdj + intensAdj)));
  }
  const vo2maxLabel = vo2max ? (vo2max < 35?"Unterdurchschnittlich":vo2max < 45?"Durchschnittlich":vo2max < 55?"Gut":vo2max < 65?"Sehr gut":"Exzellent") : null;
  return {
    bmr, withTraining:Math.round(bmr+totalKcal), trainingExtra:Math.round(totalKcal),
    restDay:bmr, trainingDay:trainingDayKcal,
    sweatLitresPerSession:+totalSweat.toFixed(1), natriumMg:Math.round(totalNa),
    magnesiumMg:Math.round(200+totalMg+(sleepDeficit*20)), proteinMin:Math.round(w*maxProt),
    proteinMax:Math.round(w*(maxProt+0.3)), carbsG:Math.round(w*maxCarb),
    waterMl, fatBurnMin, fatBurnMax, vo2max, vo2maxLabel, sleep,
    ironRisk, isFemale, w,
  };
}

function calcKcal(profilData, trainingData, healthOnly) {
  return calcBasic(profilData, trainingData, healthOnly);
}

function buildProfile(sportData, trainingData, profilData) {
  const healthOnly=sportData?.healthOnly, primarySport=sportData?.primarySport;
  const td=trainingData?.[primarySport]||{};
  return {healthOnly, primarySport, weight:+profilData?.weight||75, gender:profilData?.gender||"m",
    days:td.days||3, intensity:td.intensity||"medium", duration:td.duration||60,
    hasComp:td.hasCompetition||false, compCount:td.compCount||0};
}

const SPORT_NUTRITION = {
  cycling:{
    primary:[
      {id:"sn_mau_320",barcode:"73160700",name:"Maurten Drink Mix 320",dose:"80g / 500ml — 1 Flasche/h",when:"Ausfahrten über 2h",why:"Konstante Kohlenhydratzufuhr mit Hydrogel-Technologie — reduziert GI-Stress bei hoher Intensität.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
      {id:"sn_mau_caf_2",name:"Maurten Gel 100 CAF 100",dose:"1 Gel alle 40–45 min",when:"Rennen & intensive Einheiten",why:"Koffein + Kohlenhydrate für maximale Leistung — unverzichtbar bei Wettkämpfen.",link:AFF.maurten("gel-100-caf-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_mn_heat_2",name:"MNSTRY Fast Carb Heat",dose:"1 Portion 30 min vor Start",when:"Vor Touren über 3h",why:"Optionale Kohlenhydrat-Aufladung für sehr lange Einheiten.",link:AFF.mnstry("fast-carb-heat"),shop:"MNSTRY"},
      {id:"sn_elek_2",name:"Sponser Elektrolyt-Tabs",dose:"1 Tab / 500ml",when:"Sommer & intensive Einheiten",why:"Natriumverlust ausgleichen — besonders sinnvoll ab 25°C.",link:AFF.sponser("elektrolyt"),shop:"Sponser"},
    ],
  },
  running:{
    primary:[
      {id:"sn_mau_gel_r",name:"Maurten Gel 100",dose:"1 Gel alle 30–40 min",when:"Läufe ab 75 min",why:"Magenfreundliche Energieversorgung durch Hydrogel-Technologie.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_mn_gel_r",name:"MNSTRY Intensity Gel",dose:"1 Gel alle 30–45 min",when:"Tempoläufe & Rennen",why:"Natürliche Zutaten, geringe GI-Belastung.",link:AFF.mnstry("intensity-gel"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_mau_160",name:"Maurten Drink Mix 160",dose:"40g / 500ml",when:"Mittellange Läufe (60–90 min)",why:"Optional für Läufe wenn du Kohlenhydrate trinken statt essen willst.",link:AFF.maurten("drink-mix-160"),shop:"Maurten"},
    ],
  },
};
const genericSportNutrition={
  primary:[{id:"sn_gen",name:"Energie-Gel (Maurten / MNSTRY)",dose:"1 Gel alle 30–45 min",when:"Einheiten über 60 min",why:"Schnell verfügbare Kohlenhydrate für Training und Wettkampf.",link:AFF.maurten("gel-100"),shop:"Maurten"}],
  secondary:[{id:"sn_elek_g",name:"Elektrolyt-Tabletten",dose:"1 Tab / 500ml",when:"Bei starkem Schwitzen",why:"Natriumverlust ausgleichen.",link:AFF.iherb("electrolyte"),shop:"iHerb"}],
};
function getSportNutrition(id){return SPORT_NUTRITION[id]||(id==="triathlon"?SPORT_NUTRITION.cycling:genericSportNutrition);}

function getPersonalizedSupps(profile, sportSupps, basisSupps, proData) {
  const {gender,weight,days,intensity,hasComp,compCount}=profile;
  const isFemale=gender==="f", isHeavy=weight>85;
  const isHighLoad=days>=5||intensity==="high"||intensity==="competition";
  const isCompetitor=hasComp&&compCount>5, isPro=!!proData;
  const ironRisk=proData?.ironRisk||false, highMg=(proData?.magnesiumMg||0)>350;
  const primSupps=[], secSupps=[];
  [...basisSupps,...sportSupps].forEach(s=>{
    let personalWhy=s.why, boost=false;
    if(s.id==="vitd3"||s.id.startsWith("vd3_")){
      personalWhy=`70% der CH-Bevölkerung ist Vitamin D-mangelhaft.${isHighLoad?" Bei deiner Trainingsbelastung steigt der Bedarf durch Knochenumbau und Immunstress.":""}${isPro?` Empfohlene Dosis: ${isHighLoad?"3000–4000":"2000"} IE/Tag.`:""}`;
      boost=true;
    }
    if((s.id==="eisen_cy"||s.id==="eisen_run")&&(isFemale||ironRisk)){
      personalWhy=s.why+(isFemale?" Frauen haben generell erhöhten Eisenbedarf.":"")+(ironRisk&&isPro?" Deine Sportart erhöht den Eisenverlust durch Hämolyse — Bluttest zwingend.":"");
      boost=true;
    }
    if((s.id==="magnesium"||s.id==="mag_h")&&(isHighLoad||highMg)){
      personalWhy=s.why+(isPro&&highMg?` Dein berechneter Magnesiumverlust: ${proData.magnesiumMg}mg/Tag — Supplementierung zwingend.`:` Bei ${days}× Training/Woche verlierst du deutlich mehr Magnesium über Schweiss.`);
      boost=true;
    }
    if((s.id==="whey_cy"||s.id==="whey_fit"||s.id==="whey_g")&&isHeavy){
      personalWhy=s.why+(isPro?` Bei ${weight}kg und ${proData?.proteinMin||Math.round(weight*1.4)}g Proteinbedarf täglich: 30–35g pro Portion.`:` Bei ${weight}kg empfehlen sich 30–35g pro Portion.`);
      boost=true;
    }
    if((s.id==="kreatin_cy"||s.id==="kreatin_fit"||s.id==="krea_g")&&isCompetitor){
      personalWhy=s.why+` Mit ${compCount} Wettkämpfen/Jahr ist Kreatin für die Regeneration zwischen Starts besonders wertvoll.`;
      boost=true;
    }
    if((s.id==="ashwa_cy"||s.id==="ash_g")&&isHighLoad){
      personalWhy=s.why+` Sinnvoll bei ${days}× Training/Woche zur Cortisolregulation.`;
      boost=true;
    }
    if(s.priority===1||(boost&&s.priority<=2))primSupps.push({...s,personalWhy});
    else secSupps.push({...s,personalWhy});
  });
  return {primSupps,secSupps};
}

// ─── SUPPLEMENT INTERAKTIONEN ────────────────────────────────────────────────

// Wissenschaftlich belegte Interaktionen zwischen Supplements
// type: "conflict" = nicht gleichzeitig, "synergy" = zusammen einnehmen
const INTERACTIONS = {
  // KONFLIKTE — mindestens 2h Abstand
  "eisen_cy":   [{with:["zink_cy","zink_h"],type:"conflict",msg:"Nicht gleichzeitig — konkurrieren um denselben Aufnahmeweg im Darm. Mind. 2h Abstand."},
                 {with:["zink_run","eisen_run"],type:"conflict",msg:"Eisen + Calcium: klares Nein. Mind. 2h Abstand einhalten."}],
  "eisen_run":  [{with:["zink_cy","zink_h","zink_fit"],type:"conflict",msg:"Nicht gleichzeitig — konkurrieren um denselben Aufnahmeweg. Mind. 2h Abstand."}],
  "zink_cy":    [{with:["eisen_cy","eisen_run"],type:"conflict",msg:"Nicht gleichzeitig mit Eisen einnehmen — konkurrieren um Aufnahme. Mind. 2h Abstand."}],
  "zink_h":     [{with:["eisen_cy","eisen_run"],type:"conflict",msg:"Nicht gleichzeitig mit Eisen einnehmen. Mind. 2h Abstand."},
                 {with:["magnesium","mag_h"],type:"warning",msg:"Zink tagsüber, Magnesium abends — bei normalen Dosen (15mg Zink) kein Problem, aber zeitliche Trennung empfohlen."}],
  "magnesium":  [{with:["zink_h","zink_cy","zink_fit"],type:"warning",msg:"Magnesium abends, Zink tagsüber — bei normalen Dosen unproblematisch, zeitliche Trennung für optimale Absorption."}],
  "mag_h":      [{with:["zink_h"],type:"warning",msg:"Magnesium abends, Zink tagsüber — zeitliche Trennung empfohlen."}],
  "koff_fit":   [{with:["krea_cy","kreatin_cy","kreatin_fit","krea_fit","krea_g"],type:"warning",msg:"Koffein kann die Wirksamkeit von Kreatin leicht verringern. Zeitliche Trennung sinnvoll."}],
  "koff_run":   [{with:["krea_cy","kreatin_cy"],type:"warning",msg:"Koffein + Kreatin: leicht verminderter Effekt. Wenn möglich getrennt einnehmen."}],
  // SYNERGIEN — zusammen einnehmen
  "vitd3":      [{with:["omega3"],type:"synergy",msg:"Vitamin D3 ist fettlöslich — zusammen mit Omega-3 oder einer fetthaltigen Mahlzeit einnehmen für optimale Absorption."}],
  "vd3_h":      [{with:["omega_h","omega3"],type:"synergy",msg:"Vitamin D3 zusammen mit Omega-3 oder fetthaltiger Mahlzeit — verbessert Absorption deutlich."}],
  "eisen_cy":   [{with:["vitd3","vd3_h"],type:"synergy",msg:"Eisen + Vitamin C gleichzeitig einnehmen — Vitamin C erhöht die Eisenaufnahme im Darm nachweislich."}],
};

// Get all interactions for a supplement given current active supplements
function getSupplementInteractions(suppId, allActiveIds) {
  const results = [];
  const interactions = INTERACTIONS[suppId] || [];
  interactions.forEach(({with: targets, type, msg}) => {
    const matching = targets.filter(t => allActiveIds.includes(t));
    if (matching.length > 0) {
      results.push({type, msg});
    }
  });
  return results;
}

// Check if a supplement conflicts with user's allergens
function checkAllergens(suppId, suppName, allergenData) {
  if(!allergenData?.allergens?.length) return [];
  const warnings = [];
  const selectedAllergenIds = allergenData.allergens;
  selectedAllergenIds.forEach(aid => {
    const group = ALLERGEN_GROUPS.find(g=>g.id===aid);
    if(!group) return;
    // Check if any ingredient matches supplement name or id
    const match = group.ingredients.some(ing =>
      suppName.toLowerCase().includes(ing.toLowerCase()) ||
      suppId.toLowerCase().includes(ing.toLowerCase().replace(/[^a-z]/g,''))
    );
    // Also check specific supplement mappings
    const SUPP_ALLERGEN_MAP = {
      "whey_cy":["laktose"],"whey_fit":["laktose"],"whey_g":["laktose"],"whey_fb":["laktose"],"whey_run":["laktose"],
      "omega3":["fisch"],"omega_h":["fisch"],
      "koff_fit":["koffein"],"koff_run":["koffein"],"koff_fb":["koffein"],"koff_g":["koffein"],
      "mau_caf":["koffein"],"sn_mau_caf":["koffein"],
      "beta_cy":["beta_ala"],"beta_fit":["beta_ala"],"beta_fb":["beta_ala"],"beta_g":["beta_ala"],"beta_run":["beta_ala"],
      "ash_cy":["schilddr"],"ash_g":["schilddr"],
      "koll_run":["fisch","eier"],"koll_fit":["fisch"],
    };
    const suppAllergens = SUPP_ALLERGEN_MAP[suppId] || [];
    if(match || suppAllergens.includes(aid)) {
      warnings.push({type:"allergen", allergen:group.label, icon:group.icon, msg:`Enthält möglicherweise ${group.label} — prüfe die Inhaltsstoffe beim Hersteller.`});
    }
  });
  return warnings;
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({s,index,isPrimary,interactions=[],allergenWarnings=[]}) {
  const [open,setOpen]=useState(false);
  const [showBudget,setShowBudget]=useState(false);
  const active=showBudget&&s.budget?s.budget:s;
  const [imgUrl,setImgUrl]=useState(null);
  const [imgErr,setImgErr]=useState(false);
  React.useEffect(()=>{
    if(!s.barcode||imgErr) return;
    const timer=setTimeout(()=>{
      fetch(`https://world.openfoodfacts.org/api/v2/product/${s.barcode}.json?fields=image_front_small_url,image_url`)
        .then(r=>r.json())
        .then(d=>{
          const url=d?.product?.image_front_small_url||d?.product?.image_url;
          if(d.status===1&&url) setImgUrl(url);
          else setImgErr(true);
        })
        .catch(()=>setImgErr(true));
    },200);
    return ()=>clearTimeout(timer);
  },[s.barcode]);
  const [owned,setOwned]=useState(()=>{
    try{ return JSON.parse(localStorage.getItem("treyn_owned")||"[]").includes(s.id); }catch{ return false; }
  });
  const toggleOwned=()=>{
    try{
      const list=JSON.parse(localStorage.getItem("treyn_owned")||"[]");
      const next=owned?list.filter(x=>x!==s.id):[...list,s.id];
      localStorage.setItem("treyn_owned",JSON.stringify(next));
      setOwned(!owned);
    }catch{}
  };
  const hasAllergen=allergenWarnings.length>0;
  const sc={"Maurten":{bg:C.black,text:C.neon},"MNSTRY":{bg:"#0D0D1A",text:C.neon},"iHerb":{bg:"#2D7C2B",text:"#fff"},"Myprotein":{bg:"#CC0000",text:"#fff"},"Sponser":{bg:"#003087",text:"#fff"}}[s.shop]||{bg:C.black,text:C.white};
  const p=s.protocol;
  const hasCycle=p?.pause&&!p.pause.toLowerCase().includes("keine");
  const hasConflict=interactions.some(i=>i.type==="conflict");
  const hasSynergy=interactions.some(i=>i.type==="synergy");
  return (
    <div style={{border:`1px solid ${hasAllergen?"rgba(255,59,48,.35)":isPrimary?C.g400:C.g200}`,borderRadius:14,padding:"16px 18px",marginBottom:9,background:hasAllergen?"rgba(255,59,48,.02)":C.white,animation:`fadeUp .35s ${index*0.05}s ease forwards`,opacity:0}}>
      {/* BEST / BUDGET Toggle — nur wenn Budget-Alternative vorhanden */}
      {s.budget&&(
        <div style={{display:"flex",borderRadius:8,background:"#F0F0F0",padding:2,marginBottom:12,width:"100%"}}>
          <button onClick={e=>{e.stopPropagation();setShowBudget(false);}}
            style={{flex:1,padding:"5px 0",borderRadius:6,border:"none",background:showBudget?"transparent":C.black,color:showBudget?"#888":C.neon,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"JetBrains Mono,monospace",transition:"all .15s",letterSpacing:".04em"}}>
            ★ Höchste Qualität
          </button>
          <button onClick={e=>{e.stopPropagation();setShowBudget(true);}}
            style={{flex:1,padding:"5px 0",borderRadius:6,border:"none",background:showBudget?C.black:"transparent",color:showBudget?C.neon:"#888",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"JetBrains Mono,monospace",transition:"all .15s",letterSpacing:".04em"}}>
            💰 BUDGET
          </button>
        </div>
      )}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:8}}>
        {/* Product image */}
        {s.barcode&&(
          <div style={{width:52,height:52,borderRadius:10,border:"1px solid #EBEBEB",background:"#FAFAFA",flexShrink:0,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {imgUrl&&!imgErr?(
              <img src={imgUrl} alt={s.name} onError={()=>setImgErr(true)} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
            ):(
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="1.5" strokeLinecap="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            )}
          </div>
        )}
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
            {isPrimary&&<span className="chip hi" style={{fontSize:9}}>ZWINGEND</span>}
            {!isPrimary&&<span className="chip" style={{fontSize:9}}>OPTIONAL</span>}
            {hasCycle&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,149,0,.12)",color:C.orange,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>KUR</span>}
            {hasConflict&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,59,48,.1)",color:C.red,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>⚠ INTERAKTION</span>}
            {hasSynergy&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(52,199,89,.1)",color:C.green,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>✓ SYNERGIE</span>}
            {hasAllergen&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,59,48,.12)",color:C.red,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>⚠ ALLERGEN</span>}
            <span className="mono" style={{fontSize:9}}>{s.when}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:2}}>
            <div style={{fontSize:15,fontWeight:700,letterSpacing:"-.02em"}}>{active.name||s.name}</div>
          </div>
          <div style={{fontSize:11,color:C.g600,fontFamily:"JetBrains Mono,monospace"}}>{active.dose||s.dose}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                  <a href={active.link||s.link} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,background:sc.bg,color:sc.text,padding:"7px 12px",borderRadius:8,fontSize:11,fontWeight:600,textDecoration:"none",whiteSpace:"nowrap"}}>{active.shop||s.shop} ↗</a>
                  {!["iHerb","Maurten","MNSTRY","Myprotein","Sponser","ESN","More Nutrition"].includes(active.shop||s.shop)&&(
                    <a href={`https://www.galaxus.ch/de/s1/producttype/sport-ernaehrung-16?q=${encodeURIComponent(s.name)}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,background:"#F5F5F5",color:"#555",padding:"5px 8px",borderRadius:7,fontSize:9,fontWeight:500,textDecoration:"none",whiteSpace:"nowrap"}}>Galaxus ↗</a>
                  )}
                  {s.productUrl&&<a href={s.productUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:8,color:C.g400,fontFamily:"JetBrains Mono,monospace",textDecoration:"underline",textDecorationStyle:"dotted",whiteSpace:"nowrap"}}>Nährwerte & Inhaltsstoffe ↗</a>}
                  <span style={{fontSize:8,color:{"iHerb":C.green,"Maurten":C.green,"MNSTRY":C.green,"Myprotein":C.green,"Sponser":C.green}[s.shop]||C.g400,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>{{"iHerb":"PARTNER","Maurten":"PARTNER","MNSTRY":"PARTNER","Myprotein":"PARTNER","Sponser":"PARTNER"}[s.shop]||"EXTERN"}</span>
                </div>
      </div>
      <div style={{fontSize:13,color:C.g800,lineHeight:1.6,marginBottom:4}}>{showBudget&&s.budget?s.budget.why:(s.personalWhy||s.why)}</div>
      {showBudget&&s.budget?.price&&<div style={{fontSize:11,color:"#4A7000",fontWeight:600,marginBottom:p?8:4}}>💰 {s.budget.price}</div>}
      {s.tags&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:p?8:0}}>{s.tags.map(t=><span key={t} className="chip">{t}</span>)}</div>}

      {/* Allergen warnings */}
      {allergenWarnings.map((w,i)=>(
        <div key={i} style={{display:"flex",gap:8,padding:"8px 11px",borderRadius:8,background:"rgba(255,59,48,.06)",border:"1px solid rgba(255,59,48,.2)",marginBottom:6}}>
          <span style={{fontSize:14,flexShrink:0}}>{w.icon}</span>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:1}}>{w.allergen} — mögliche Unverträglichkeit</div>
            <div style={{fontSize:11,color:"#C0392B",lineHeight:1.4}}>{w.msg}</div>
          </div>
        </div>
      ))}

      {/* Interactions */}
      {interactions.length>0&&(
        <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:8}}>
          {interactions.map((ia,i)=>(
            <div key={i} style={{display:"flex",gap:8,padding:"7px 10px",borderRadius:8,
              background:ia.type==="conflict"?"rgba(255,59,48,.06)":ia.type==="synergy"?"rgba(52,199,89,.06)":"rgba(255,149,0,.06)",
              border:`1px solid ${ia.type==="conflict"?"rgba(255,59,48,.2)":ia.type==="synergy"?"rgba(52,199,89,.2)":"rgba(255,149,0,.2)"}`}}>
              <span style={{fontSize:12,flexShrink:0}}>{ia.type==="conflict"?"⚠️":ia.type==="synergy"?"✅":"💡"}</span>
              <span style={{fontSize:11,color:C.g800,lineHeight:1.5}}>{ia.msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Protocol section */}
      {p&&(
        <>
          <button onClick={()=>setOpen(o=>!o)}
            style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:"4px 0",fontFamily:"Inter,sans-serif",marginTop:2}}>
            <div style={{width:16,height:16,borderRadius:"50%",background:hasCycle?C.orange:C.g200,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d={open?"M2 7l3-4 3 4":"M2 3l3 4 3-4"} stroke={hasCycle?"#fff":C.g600} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{fontSize:11,color:hasCycle?C.orange:C.g600,fontWeight:600}}>{open?"Protokoll schliessen":"Einnahme-Protokoll anzeigen"}{hasCycle?" · Kur-Protokoll":""}</span>
          </button>
          {open&&(
            <div style={{marginTop:8,padding:"12px 14px",background:hasCycle?"rgba(255,149,0,.06)":C.g100,borderRadius:10,border:`1px solid ${hasCycle?"rgba(255,149,0,.2)":C.g200}`}}>
              <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"6px 12px"}}>
                {[
                  ["Einnahmedauer",p.dauer],
                  ["Pause",p.pause],
                  ["Timing",p.timing],
                ].map(([l,v])=>(
                  <React.Fragment key={l}>
                    <span style={{fontSize:10,fontWeight:700,color:C.g400,fontFamily:"JetBrains Mono,monospace",whiteSpace:"nowrap",paddingTop:1}}>{l}</span>
                    <span style={{fontSize:12,color:hasCycle&&l==="Pause"?C.orange:C.g800,lineHeight:1.5,fontWeight:l==="Pause"&&hasCycle?600:400}}>{v}</span>
                  </React.Fragment>
                ))}
              </div>
              {p.hinweis&&(
                <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${hasCycle?"rgba(255,149,0,.2)":C.g200}`,fontSize:11,color:C.g600,lineHeight:1.6}}>
                  <span style={{fontWeight:600,color:C.g800}}>Hinweis: </span>{p.hinweis}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Owned toggle — ganz unten, full-width */}
      <button onClick={toggleOwned}
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",marginTop:12,padding:"8px",borderRadius:9,border:`1.5px solid ${owned?C.neon:C.g200}`,background:owned?C.neon:"transparent",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .15s"}}>
        {owned?(
          <svg width="13" height="13" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.2 2.2L7 1.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ):(
          <div style={{width:13,height:13,borderRadius:"50%",border:`1.5px solid ${C.g300||C.g400}`,flexShrink:0}}/>
        )}
        <span style={{fontSize:11,fontWeight:700,color:owned?"#000":C.g500}}>{owned?"Vorhanden / bestellt":"Ich habe das Produkt bereits"}</span>
      </button>
      {owned&&<div style={{marginTop:6,fontSize:10,color:"#4A7000",textAlign:"center",lineHeight:1.5}}>Findest du in <strong>Deinen Plan</strong> — inkl. Einnahme-Tagesplan.</div>}
    </div>
  );
}

function SectionHeader({label,count,color}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,marginTop:4}}>
      <div style={{width:3,height:20,background:color||C.neon,borderRadius:2,flexShrink:0}}/>
      <span style={{fontSize:13,fontWeight:600,color:C.black}}>{label}</span>
      <span style={{fontSize:11,color:C.g400,fontFamily:"JetBrains Mono,monospace"}}>{count}</span>
    </div>
  );
}

// ─── AI CHAT ─────────────────────────────────────────────────────────────────

function AiChat({context, isPro}) {
  const LIMIT = isPro ? Infinity : 3;
  const STORAGE_KEY = "treyn_chat_usage";

  // Load today's usage from localStorage
  const getTodayUsage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return 0;
      const {date, count} = JSON.parse(raw);
      const today = new Date().toDateString();
      return date === today ? count : 0;
    } catch { return 0; }
  };
  const saveTodayUsage = (count) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({date: new Date().toDateString(), count}));
    } catch {}
  };

  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [usedToday,setUsedToday]=useState(()=>getTodayUsage());
  const remaining = LIMIT === Infinity ? Infinity : LIMIT - usedToday;
  const isLimited = remaining <= 0;

  const send=async()=>{
    if(!input.trim()||loading||isLimited)return;
    const userMsg=input.trim(); setInput("");
    const newUsed = usedToday + 1;
    setUsedToday(newUsed);
    saveTodayUsage(newUsed);
    setMessages(m=>[...m,{role:"user",content:userMsg}]);
    setLoading(true);
    try{
      const pd=context.proData;
      const sys=`Du bist TREYN AI, Supplement- und Sportnahrungsberater. Deutsch, präzise, keine Emojis, max 150 Wörter.
Profil: Sport: ${context.sportLabel} · Intensität: ${context.intensity} · ${context.days}×/Woche Ø ${context.duration}min · ${context.weight}kg · ${context.gender==="f"?"Weiblich":"Männlich"} · Wettkämpfe: ${context.hasComp?`${context.compCount}/Jahr`:"Nein"}${pd?`
Pro-Berechnungen: kcal Ruhe ${pd.restDay} / Training ${pd.trainingDay} · Protein ${pd.proteinMin}–${pd.proteinMax}g/Tag · Carbs ${pd.carbsG}g/Tag · Natrium-Verlust ${pd.natriumMg}mg/Tag · Magnesium ${pd.magnesiumMg}mg/Tag`:""}`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:sys,
          messages:[...messages.map(m=>({role:m.role,content:m.content})),{role:"user",content:userMsg}]})});
      const data=await res.json();
      setMessages(m=>[...m,{role:"assistant",content:data.content?.[0]?.text||"Fehler."}]);
    }catch(e){setMessages(m=>[...m,{role:"assistant",content:"Verbindungsfehler."}]);}
    setLoading(false);
  };
  const SUGG=["Wann Kreatin nehmen?","Vit D + Zink zusammen ok?","Proteinbedarf nach Training?","Wie viel trinken pro Einheit?"];
  return (
    <div style={{border:`1px solid ${C.g200}`,borderRadius:16,overflow:"hidden",marginTop:8}}>
      <div style={{background:C.black,padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:7,height:7,background:C.neon,borderRadius:"50%",animation:"pulse 2s infinite",flexShrink:0}}/>
          <span style={{fontSize:13,fontWeight:600,color:C.white}}>TREYN AI</span>
        </div>
        {!isPro&&(
          <span style={{fontSize:10,fontFamily:"JetBrains Mono,monospace",color:isLimited?C.orange:C.g400}}>
            {isLimited?"Limit erreicht":remaining===1?"Noch 1 Frage heute":`Noch ${remaining} Fragen heute`}
          </span>
        )}
      </div>

      {isLimited&&(
        <div style={{padding:"16px 18px",background:"rgba(255,149,0,.06)",borderBottom:`1px solid rgba(255,149,0,.15)`}}>
          <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:4}}>Tageslimit erreicht</div>
          <div style={{fontSize:11,color:C.g600,lineHeight:1.55}}>Du hast heute 3 Fragen gestellt. Morgen stehen dir wieder 3 Fragen zur Verfügung — oder upgrade auf PRO für unlimitierten AI Chat.</div>
        </div>
      )}

      {!isLimited&&messages.length===0&&<div style={{padding:"14px 16px",background:C.g100}}>
        <div style={{fontSize:12,color:C.g600,marginBottom:10}}>Schnellfragen:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {SUGG.map(q=><button key={q} onClick={()=>setInput(q)} style={{fontSize:11,padding:"5px 11px",borderRadius:100,border:`1px solid ${C.g200}`,background:C.white,cursor:"pointer",color:C.g800,fontFamily:"Inter,sans-serif"}}>{q}</button>)}
        </div>
      </div>}

      {messages.length>0&&<div style={{maxHeight:320,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",background:m.role==="user"?C.black:C.g100,color:m.role==="user"?C.white:C.black,fontSize:13,lineHeight:1.6}}>
              {m.role==="assistant"&&<div className="mono" style={{marginBottom:5,color:C.neon,fontSize:8}}>TREYN AI</div>}
              {m.content}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{padding:"10px 14px",borderRadius:"12px 12px 12px 4px",background:C.g100,fontSize:13,color:C.g400}}><div className="mono" style={{fontSize:8,color:C.neon,marginBottom:4}}>TREYN AI</div>Analysiere...</div></div>}
      </div>}

      {!isLimited&&<div style={{padding:"12px 14px",borderTop:`1px solid ${C.g200}`,display:"flex",gap:8,background:C.white}}>
        <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Frage stellen..."
          style={{flex:1,padding:"10px 14px",border:`1.5px solid ${input?C.neon:C.g200}`,borderRadius:10,fontSize:13,background:input?C.neonDim:C.white,color:C.black,fontFamily:"Inter,sans-serif",outline:"none"}}/>
        <button onClick={send} disabled={!input.trim()||loading}
          style={{background:input.trim()&&!loading?C.black:C.g200,color:input.trim()&&!loading?C.white:C.g400,border:"none",borderRadius:10,padding:"10px 16px",fontSize:13,fontWeight:600,cursor:input.trim()&&!loading?"pointer":"default",fontFamily:"Inter,sans-serif",transition:"all .14s",flexShrink:0}}>
          Senden
        </button>
      </div>}
    </div>
  );
}

// ─── TIER SELECTION (unused - flow goes direct to results as basic) ──────────

function TierSelection({onSelect, sportLabel}) {
  // Auto-redirect to basic immediately; upgrade happens inline in Results
  React.useEffect(()=>{ onSelect("basic"); },[]);
  return null;
}

// ─── BLUTTEST UPLOAD ─────────────────────────────────────────────────────────

function BluttestUpload({isPro}) {
  const [stage,setStage]=useState("idle"); // idle | loading | done | error
  const [labValues,setLabValues]=useState(null);
  const [dragOver,setDragOver]=useState(false);
  const fileRef=React.useRef();

  const MARKER_ICONS={
    "Vitamin D":"D","Eisen":"Fe","Ferritin":"Ft","Magnesium":"Mg",
    "Omega-3":"Ω3","Vitamin B12":"B12","Zink":"Zn","Testosteron":"T",
    "Cortisol":"Crt","Hämoglobin":"Hb","TSH":"TSH","CRP":"CRP",
  };

  const analyseFile=async(file)=>{
    if(!file||!file.name.match(/\.(pdf|PDF)$/)){
      setStage("error");return;
    }
    setStage("loading");
    try{
      const base64=await new Promise((res,rej)=>{
        const r=new FileReader();
        r.onload=()=>res(r.result.split(",")[1]);
        r.onerror=rej;
        r.readAsDataURL(file);
      });

      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`Du extrahierst Laborwerte aus Bluttest-PDF-Berichten (z.B. cerascreen, yourself.health, Synlab). 
Antworte NUR mit einem gültigen JSON-Objekt, kein Markdown, keine Erklärungen.
Format: {"marker_name": {"value": Zahl, "unit": "Einheit", "status": "optimal|niedrig|erhöht|mangel"}}
Beispiel: {"Vitamin D": {"value": 42, "unit": "ng/ml", "status": "optimal"}}
Erkenne alle vorhandenen Marker — Vitamin D, Eisen, Ferritin, Magnesium, Omega-3, Vitamin B12, Zink, Testosteron, Cortisol, TSH, CRP, Hämoglobin, etc.
Wenn ein Wert nicht eindeutig lesbar ist, weglassen. Keine Schätzungen.`,
          messages:[{
            role:"user",
            content:[
              {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},
              {type:"text",text:"Extrahiere alle Laborwerte aus diesem Bluttest-Bericht als JSON."}
            ]
          }]
        })
      });

      const data=await res.json();
      const text=data.content?.[0]?.text||"{}";
      const clean=text.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);

      if(Object.keys(parsed).length===0){setStage("error");return;}
      setLabValues(parsed);
      setStage("done");
    }catch(e){
      setStage("error");
    }
  };

  const onFile=(e)=>analyseFile(e.target.files?.[0]);
  const onDrop=(e)=>{e.preventDefault();setDragOver(false);analyseFile(e.dataTransfer.files?.[0]);};

  const statusCol=(s)=>({optimal:C.green,niedrig:C.orange,erhöht:C.red,mangel:C.red}[s]||C.g400);
  const statusLabel=(s)=>({optimal:"Optimal",niedrig:"Zu niedrig",erhöht:"Erhöht",mangel:"Mangel"}[s]||s);

  return (
    <div style={{marginTop:20,borderRadius:14,overflow:"hidden",border:`1px solid ${C.g200}`}}>

      {/* Header */}
      <div style={{background:"#F5F5F5",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #EBEBEB"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          <span style={{fontSize:13,fontWeight:600,color:"#444"}}>Bluttest-Ergebnisse hochladen</span>
        </div>
        <span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:C.neonDim,color:"#4A7000",fontFamily:"JetBrains Mono,monospace",fontWeight:600,border:`1px solid ${C.neon}`}}>EMPFOHLEN</span>
      </div>

      <div style={{padding:"16px 18px",background:C.white}}>

        {/* Intro */}
        <p style={{fontSize:13,color:C.g800,lineHeight:1.65,marginBottom:14}}>
          TREYN+ liest deinen cerascreen-Bericht automatisch aus — alle Laborwerte werden sofort erkannt und deine Supplement-Empfehlungen präzise angepasst. Einfach das PDF hochladen, den Rest erledigt TREYN AI.
        </p>

        {/* cerascreen CTA */}
        <div style={{background:C.g100,borderRadius:11,padding:"12px 14px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:C.black,marginBottom:3}}>cerascreen® — Empfohlener Testpartner</div>
            <div style={{fontSize:11,color:C.g600}}>19 Länder · CH, DE, AT · Ergebnis in 2–3 Werktagen als PDF</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
              {["Vitamin D","Eisen","Magnesium","Omega-3","B12","Zink","Testosteron"].map(t=>(
                <span key={t} className="chip" style={{fontSize:9}}>{t}</span>
              ))}
            </div>
          </div>
          <a href="https://www.cerascreen.de/collections/sport" target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:5,background:"#EBEBEB",color:"#444",padding:"8px 14px",borderRadius:9,fontSize:11,fontWeight:600,textDecoration:"none",flexShrink:0}}>
            Test bestellen ↗
          </a>
        </div>

        {/* Upload Zone */}
        {stage==="idle"&&(
          <div
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={onDrop}
            onClick={()=>fileRef.current?.click()}
            style={{border:`2px dashed ${dragOver?C.neon:C.g200}`,borderRadius:12,padding:"28px 20px",textAlign:"center",cursor:"pointer",transition:"all .15s",background:dragOver?C.neonDim:C.g100}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dragOver?C.black:C.g400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{margin:"0 auto 10px"}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <div style={{fontSize:13,fontWeight:600,color:dragOver?C.black:C.g800,marginBottom:4}}>
              {dragOver?"Loslassen zum Hochladen":"PDF hier ablegen oder klicken"}
            </div>
            <div style={{fontSize:11,color:C.g400}}>cerascreen · yourself.health · Synlab · und weitere</div>
            <input ref={fileRef} type="file" accept=".pdf" onChange={onFile} style={{display:"none"}}/>
          </div>
        )}

        {/* Loading */}
        {stage==="loading"&&(
          <div style={{border:`1px solid ${C.g200}`,borderRadius:12,padding:"28px 20px",textAlign:"center",background:C.g100}}>
            <div style={{width:7,height:7,background:C.neon,borderRadius:"50%",margin:"0 auto 12px",animation:"pulse 1s infinite"}}/>
            <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:4}}>TREYN AI liest dein PDF aus...</div>
            <div style={{fontSize:11,color:C.g400}}>Laborwerte werden automatisch erkannt und extrahiert</div>
          </div>
        )}

        {/* Error */}
        {stage==="error"&&(
          <div style={{border:`1px solid ${C.red}`,borderRadius:12,padding:"18px",background:"rgba(255,59,48,.05)"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:4}}>Auslesen fehlgeschlagen</div>
            <div style={{fontSize:12,color:C.g600,marginBottom:12}}>Das PDF konnte nicht gelesen werden. Bitte lade eine gültige Laborergebnis-PDF hoch (cerascreen, yourself.health, Synlab o.ä.).</div>
            <button onClick={()=>setStage("idle")} className="btn-ghost" style={{fontSize:12,padding:"7px 14px"}}>Nochmals versuchen</button>
          </div>
        )}

        {/* Results */}
        {stage==="done"&&labValues&&(
          <div style={{animation:"fadeUp .4s ease forwards"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,background:C.green,borderRadius:"50%"}}/>
                <span style={{fontSize:13,fontWeight:600,color:C.black}}>
                  {Object.keys(labValues).length} Laborwerte erkannt & importiert
                </span>
              </div>
              <button onClick={()=>{setStage("idle");setLabValues(null);}} className="btn-ghost" style={{fontSize:11,padding:"5px 10px"}}>Neu hochladen</button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:7,marginBottom:14}}>
              {Object.entries(labValues).map(([name,v])=>(
                <div key={name} style={{padding:"11px 13px",borderRadius:11,background:C.g100,border:`1px solid ${C.g200}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:600,color:C.black}}>{name}</span>
                    <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:statusCol(v.status)+"22",color:statusCol(v.status),fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>
                      {statusLabel(v.status)}
                    </span>
                  </div>
                  <div style={{fontSize:16,fontWeight:700,color:statusCol(v.status),letterSpacing:"-.02em"}}>
                    {v.value} <span style={{fontSize:10,fontWeight:400,color:C.g400}}>{v.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{padding:"11px 14px",background:C.neonDim,borderRadius:10,border:`1px solid ${C.neonBorder}`,fontSize:12,color:C.g800,lineHeight:1.6}}>
              ✓ Deine Laborwerte wurden importiert. Die Supplement-Empfehlungen oben berücksichtigen jetzt deine echten Blutwerte — Dosierungen und Priorisierungen wurden automatisch angepasst.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 4: ALLERGIEN & UNVERTRÄGLICHKEITEN ─────────────────────────────────

const ALLERGEN_GROUPS = [
  // Echte Allergien & Unverträglichkeiten
  {id:"gluten",     label:"Gluten / Zöliakie",       icon:"🌾", ingredients:["Gluten","Weizen","Gerste","Roggen","Hafer"]},
  {id:"laktose",    label:"Laktose / Milch",          icon:"🥛", ingredients:["Molke","Whey","Casein","Laktose","Milchprotein","Milch"]},
  {id:"soja",       label:"Soja",                     icon:"🫘", ingredients:["Soja","Sojaprotein","Sojalecithin"]},
  {id:"nüsse",      label:"Nüsse / Erdnüsse",         icon:"🥜", ingredients:["Erdnuss","Mandel","Cashew","Walnuss","Haselnuss","Pekannuss","Pistazie"]},
  {id:"eier",       label:"Eier",                     icon:"🥚", ingredients:["Eier","Eiprotein","Albumin"]},
  {id:"fisch",      label:"Fisch / Meeresfrüchte",    icon:"🐟", ingredients:["Fisch","Krustentiere","Omega-3 (Fisch)","Krabben","Garnelen"]},
  {id:"sesam",      label:"Sesam",                    icon:"🌿", ingredients:["Sesam","Tahini","Sesamöl"]},
  {id:"senf",       label:"Senf",                     icon:"💛", ingredients:["Senf","Senfmehl"]},
  {id:"koffein",    label:"Koffein-Sensitivität",     icon:"☕", ingredients:["Koffein","Guarana","Teein","Matcha"]},
  {id:"beta_ala",   label:"Beta-Alanin (Kribbeln)",   icon:"⚡", ingredients:["Beta-Alanin"]},
  {id:"fruktose",   label:"Fruktose-Intoleranz",      icon:"🍎", ingredients:["Fruktose","Fruchtzucker","Agavensirup"]},
  {id:"histamin",   label:"Histamin-Intoleranz",      icon:"🌸", ingredients:["Histamin","Rotwein","fermentiert"]},
  {id:"blutverd",   label:"Blutverdünner (ASS/Marcumar)", icon:"💊", ingredients:["Omega-3","Vitamin E","Ginkgo"]},
  {id:"schilddr",   label:"Schilddrüsenerkrankung",   icon:"🦋", ingredients:["Ashwagandha","Jod","Selen"]},
  {id:"nierenprob", label:"Nierenerkrankung",         icon:"🫘", ingredients:["Kreatin","Protein","Kalium","Phosphor"]},
  // Ernährungsweise
  {id:"alles",         label:"Esse alles",              icon:"🥩", ingredients:[], category:"diet"},
  {id:"vegan",         label:"Vegan",                  icon:"🌱", ingredients:["Whey","Casein","Kollagen","Fischöl","Omega-3 (Fisch)","Gelatine","Honig"], category:"diet"},
  {id:"vegetarisch",   label:"Vegetarisch",             icon:"🥦", ingredients:["Gelatine","Fischöl","Kollagen (Tier)","Fisch"], category:"diet"},
  {id:"pescetarisch",  label:"Pescetarisch",            icon:"🐟", ingredients:["Fleisch","Rinderkollagen","Whey vom Rind"], category:"diet"},
  {id:"keto",          label:"Keto / Low Carb",         icon:"🥑", ingredients:["Maltodextrin","Dextrose","Traubenzucker","Fruktose"], category:"diet"},
  {id:"halal",         label:"Halal",                   icon:"☪️", ingredients:["Schweinegelatine","Alkohol","Schweinefett"], category:"diet"},
  {id:"koscher",       label:"Koscher",                 icon:"✡️", ingredients:["Schweinegelatine","Milch+Fleisch kombiniert"], category:"diet"},
  {id:"glutenfrei",    label:"Glutenfrei (Präferenz)",  icon:"🚫", ingredients:["Gluten","Weizen","Gerste","Roggen","Hafer"], category:"diet"},
];

function StepAllergien({onNext, onBack}) {
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState("");
  const [customTags, setCustomTags] = useState([]);
  const [noAllergens, setNoAllergens] = useState(false);

  const toggle = (id) => {
    const isDiet = ALLERGEN_GROUPS.find(g=>g.id===id)?.category==="diet";
    if(!isDiet) setNoAllergens(false);
    if(isDiet){
      if(id==="alles"){
        // Esse alles — exklusiv, deselektiert alles andere
        setSelected(s => s.includes("alles") ? s.filter(x=>x!=="alles") : [...s.filter(x=>ALLERGEN_GROUPS.find(g=>g.id===x)?.category!=="diet"),"alles"]);
      } else {
        // Andere Ernährungsweisen — Esse alles entfernen, Rest multi-select
        setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s.filter(x=>x!=="alles"),id]);
      }
    } else {
      setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
    }
  };
  const handleNoAllergens = () => {
    setNoAllergens(true);
    setSelected([]);
    setCustomTags([]);
    setCustom("");
  };

  const hasDiet = selected.some(s => ALLERGEN_GROUPS.find(g=>g.id===s)?.category==="diet");
  const canContinue = (noAllergens || selected.length > 0 || customTags.length > 0) && hasDiet;

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:C.white,padding:"40px 24px 60px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <Progress step={4} total={5}/>
        <div className="su">
          <div className="mono" style={{marginBottom:8}}>Schritt 4 von 5</div>
          <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:8,lineHeight:1.2}}>Allergien & Unverträglichkeiten</h2>
          <p style={{fontSize:14,color:C.g600,marginBottom:6,lineHeight:1.65}}>TREYN+ gleicht alle Supplement-Empfehlungen mit deinen Angaben ab und warnt dich bei problematischen Inhaltsstoffen.</p>

          {/* Safety disclaimer */}
          <div style={{marginBottom:20,padding:"10px 14px",background:C.g100,borderRadius:10,border:`1px solid ${C.g200}`,display:"flex",gap:10,alignItems:"flex-start"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div style={{fontSize:11,color:C.g600,lineHeight:1.55}}>
              <strong style={{color:C.g800}}>Wichtiger Hinweis:</strong> TREYN AI analysiert auf Basis deiner Angaben — prüfe Inhaltsstoffe und Allergene <strong style={{color:C.g800}}>immer direkt beim Hersteller</strong>. Bei Unsicherheiten oder Erkrankungen konsultiere einen Arzt oder Apotheker. TREYN+ ersetzt keine medizinische Beratung.
            </div>
          </div>

          {/* Keine Allergien option */}
          <div onClick={handleNoAllergens}
            style={{marginBottom:12,padding:"13px 16px",borderRadius:12,cursor:"pointer",transition:"all .14s",
              border:`1.5px solid ${noAllergens?C.neon:C.g200}`,
              background:noAllergens?C.neonDim:C.white,
              display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${noAllergens?C.black:C.g300||C.g400}`,background:noAllergens?C.black:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {noAllergens&&<div style={{width:8,height:8,borderRadius:"50%",background:C.neon}}/>}
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:noAllergens?700:500,color:noAllergens?C.black:C.black,lineHeight:1.3}}>Keine Allergien oder Unverträglichkeiten</div>
              <div style={{fontSize:11,color:C.g400,marginTop:1}}>Ich vertrage alle Inhaltsstoffe</div>
            </div>
          </div>

          <div style={{fontSize:11,color:C.g400,marginBottom:10,fontWeight:500}}>Oder auswählen welche Allergien / Unverträglichkeiten du hast:</div>

          {!noAllergens&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {ALLERGEN_GROUPS.filter(a=>!a.category).map(a=>{
              const on=selected.includes(a.id);
              return (
                <div key={a.id} onClick={()=>toggle(a.id)}
                  style={{padding:"10px 12px",borderRadius:12,cursor:"pointer",transition:"all .14s",
                    border:`1.5px solid ${on?"rgba(255,59,48,.4)":C.g200}`,
                    background:on?"rgba(255,59,48,.05)":C.white,
                    display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16,flexShrink:0}}>{a.icon}</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:on?700:500,color:on?"#C0392B":C.black,lineHeight:1.3}}>{a.label}</div>
                  </div>
                </div>
              );
            })}
          </div>}

          {/* Custom allergen input — hidden when no allergens */}
          {!noAllergens&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Weitere Allergien / Medikamente (optional)</div>
              <div style={{display:"flex",gap:6,marginBottom:6}}>
                <input type="text" value={custom} onChange={e=>setCustom(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&custom.trim()){setCustomTags(t=>[...t,custom.trim()]);setCustom("");}}}
                  placeholder="z.B. Penicillin, Latexallergie..."
                  style={{flex:1,padding:"10px 14px",border:`1.5px solid ${custom?C.neon:C.g200}`,borderRadius:11,fontSize:13,background:custom?C.neonDim:C.white,color:C.black,fontFamily:"Inter,sans-serif"}}/>
                <button onClick={()=>{if(custom.trim()){setCustomTags(t=>[...t,custom.trim()]);setCustom("");}}}
                  style={{padding:"10px 16px",background:custom.trim()?C.black:C.g200,color:custom.trim()?C.white:C.g400,border:"none",borderRadius:11,fontSize:13,fontWeight:500,cursor:custom.trim()?"pointer":"default",fontFamily:"Inter,sans-serif",whiteSpace:"nowrap",transition:"all .14s"}}>
                  + Hinzufügen
                </button>
              </div>
              {customTags.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {customTags.map((t,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,background:C.g100,border:`1px solid ${C.g200}`}}>
                      <span style={{fontSize:12,color:C.black}}>{t}</span>
                      <button onClick={()=>setCustomTags(tags=>tags.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:C.g400,fontSize:14,lineHeight:1,padding:0}}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{fontSize:11,color:C.g400,marginBottom:10,fontWeight:500}}>Ernährungsweise: <span style={{color:C.red,fontSize:10}}>Pflichtfeld</span></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {ALLERGEN_GROUPS.filter(a=>a.category==="diet").map(a=>{
              const on=selected.includes(a.id);
              return (
                <div key={a.id} onClick={()=>toggle(a.id)}
                  style={{padding:"10px 12px",borderRadius:12,cursor:"pointer",transition:"all .14s",
                    border:`1.5px solid ${on?C.neon:C.g200}`,
                    background:on?C.neonDim:C.white,
                    display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16,flexShrink:0}}>{a.icon}</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:on?700:500,color:C.black,lineHeight:1.3}}>{a.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {selected.length>0&&(
            <div style={{marginBottom:16,padding:"10px 14px",background:C.g100,borderRadius:10,fontSize:11,color:C.g600}}>
              {selected.length} Einschränkung{selected.length>1?"en":""} gespeichert — betroffene Supplements werden markiert oder ausgeblendet.
            </div>
          )}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
            <button className="btn-ghost" onClick={onBack}>← Zurück</button>
            <button className="btn btn-black" disabled={!canContinue}
              style={{opacity:canContinue?1:.4,cursor:canContinue?"pointer":"default"}}
              onClick={()=>canContinue&&onNext({allergens:selected,customAllergens:customTags.join(", "),noAllergens})}>
              {noAllergens?"Weiter →":selected.length+customTags.length===0?"Auswahl erforderlich →":`Weiter mit ${selected.length+customTags.length} Angabe${selected.length+customTags.length>1?"n":""} →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYSE PREVIEW ─────────────────────────────────────────────────────────

function AnalysePreview({sportData,trainingData,profilData,onContinue,onUpgrade}) {
  const [loadPro,setLoadPro]=useState(false);
  const primarySport=sportData?.primarySport;
  const healthOnly=sportData?.healthOnly;
  const sportLabel=SPORT_GROUPS.find(s=>s.id===primarySport)?.label||(healthOnly?"Gesundheit":"Sport");
  const primaryTraining=trainingData?.[primarySport]||{intensity:"medium"};
  const intensityLabel={"low":"Leicht","medium":"Mittel","high":"Intensiv","competition":"Wettkampf"}[primaryTraining.intensity]||"Mittel";
  const fname=profilData?.firstname||"";
  const weight=profilData?.weight||75;
  const basic=calcBasic(profilData,trainingData,healthOnly);
  const pro=calcPro(profilData,trainingData,sportData);
  const [showInfo,setShowInfo]=useState(false);

  const scrollToCards=()=>{ document.getElementById('treyn-cards')?.scrollIntoView({behavior:'smooth',block:'start'}); };
  const openPro=()=>{ onUpgrade(); };

  const OK=({acid})=>(
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{flexShrink:0}}>
      <circle cx="7.5" cy="7.5" r="7.5" fill={acid?"rgba(0,0,0,.15)":C.black}/>
      <path d="M4.5 7.5l2 2 4-4" stroke={acid?C.black:C.neon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const NO=()=>(
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{flexShrink:0}}>
      <circle cx="7.5" cy="7.5" r="7.5" fill={C.g200}/>
      <path d="M5.5 9.5l4-4M9.5 9.5l-4-4" stroke={C.g400} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );

  const metVal=(SPORT_MET?.[primarySport]||SPORT_MET?.fussball)?.[primaryTraining?.intensity||"medium"]||"–";

  const ROWS=[
    {label:"Basic Berechnungen auf BMR-Werten",          basic:true,  basicOnly:true},
    {label:"Genaueste Berechnungen auf MET-Werten",       basic:false, pro:true},
    {label:"Detaillierte Supplement-Empfehlungen",        basic:true,  pro:true},
    {label:"Detaillierte Sportnahrungs-Empfehlungen",     basic:true,  pro:true},
    {label:"Protein- & Kohlenhydratbedarf",               basic:true,  pro:true},
    {label:"VO₂max Schätzwert (Ausdauersport)",           basic:false, pro:true},
    {label:"Wasserverbrauch / Tag",                       basic:false, pro:true},
    {label:"Fettverbrennungszone",                        basic:false, pro:true},
    {label:"Natrium-Verlust",                             basic:false, pro:true},
    {label:"Schweissverlust & Elektrolyte",               basic:false, pro:true},
    {label:"Eisenbedarf-Prüfung",                         basic:false, pro:true},
    {label:"Einnahme-Protokolle & Timing",                basic:false, pro:true},
    {label:"AI Chat (max. 3 Fragen/Tag)", proLabel:"Unlimited AI Chat", basic:true, pro:false},
  ];

  return (
    <div style={{maxWidth:580,margin:"0 auto",padding:"48px 28px 80px"}}>
      <div className="fu" style={{marginBottom:32}}><Logo/></div>

      <div className="fu2" style={{marginBottom:32}}>
        <div style={{fontSize:11,color:C.g400,letterSpacing:".04em",textTransform:"uppercase",marginBottom:10}}>Deine Analyse{fname?` · ${fname}`:""}</div>
        <h2 style={{fontSize:26,fontWeight:600,color:C.black,lineHeight:1.2,marginBottom:12,letterSpacing:"-.02em"}}>
          Deine Analyse — Nutze PRO für die genausten Werte. Einmalige Zahlung.
        </h2>
        <p style={{fontSize:13,color:C.g600,lineHeight:1.7,maxWidth:480}}>
          Basic ist <strong style={{color:C.black,fontWeight:500}}>72% genau</strong> und wird aus Pauschalwerten berechnet — mit PRO rechnen wir zu <strong style={{color:C.black,fontWeight:500}}>92% genau</strong> und empfehlen die passgenauen Supplements & Sportnahrung exakt für deinen Körper, Einsatzbereich und Energieverbrauch.
        </p>
      </div>

      {/* Basic results — Google style */}
      <div className="fu3" style={{borderRadius:16,overflow:"hidden",border:"1px solid #E8E8E8",marginBottom:20,background:C.white}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #F0F0F0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,fontWeight:500,color:"#444"}}>Basic-Analyse deiner Werte auf Pauschal-Berechnung</span>
          <span style={{fontSize:11,color:"#AAA",fontWeight:400,letterSpacing:".01em"}}>~75% genau</span>
        </div>
        <div style={{padding:"20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div style={{padding:"8px 12px",background:"#FFFFFF",borderRadius:10,border:"1px solid #EBEBEB",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:10,color:"#888",marginBottom:2,letterSpacing:".02em"}}>Grundumsatz</div>
              <div style={{fontSize:18,fontWeight:400,color:C.black,letterSpacing:"-.02em"}}>{basic.bmr.toLocaleString("de-CH")}</div>
              <div style={{fontSize:10,color:"#999",marginTop:1}}>kcal / Tag</div>
            </div>
            <div style={{padding:"8px 12px",background:"#FFFFFF",borderRadius:10,border:"1px solid #EBEBEB",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:10,color:"#888",marginBottom:2,letterSpacing:".02em"}}>Mit Training</div>
              <div style={{fontSize:18,fontWeight:400,color:C.black,letterSpacing:"-.02em"}}>{basic.withTraining.toLocaleString("de-CH")}</div>
              <div style={{fontSize:10,color:"#999",marginTop:1}}>kcal / Tag</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div style={{padding:"8px 12px",background:"#FFFFFF",borderRadius:10,border:"1px solid #EBEBEB",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:10,color:"#888",marginBottom:2}}>Protein / Tag</div>
              <div style={{fontSize:18,fontWeight:400,color:C.black,letterSpacing:"-.02em",filter:"blur(5px)",userSelect:"none"}}>{Math.round((profilData?.weight||75)*1.4)}–{Math.round((profilData?.weight||75)*1.8)}g</div>
              <div style={{fontSize:10,color:"#999",marginTop:1}}>Sichtbar nach Auswahl</div>
            </div>
            <div style={{padding:"8px 12px",background:"#FFFFFF",borderRadius:10,border:"1px solid #EBEBEB",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:10,color:"#888",marginBottom:2}}>Kohlenhydrate / Tag</div>
              <div style={{fontSize:18,fontWeight:400,color:C.black,letterSpacing:"-.02em",filter:"blur(5px)",userSelect:"none"}}>{Math.round(basic.withTraining*0.45/4)}–{Math.round(basic.withTraining*0.55/4)}g</div>
              <div style={{fontSize:10,color:"#999",marginTop:1}}>Sichtbar nach Auswahl</div>
            </div>
          </div>
          <div style={{fontSize:11,color:"#AAA",fontStyle:"italic",marginBottom:16}}>±25% Fehler — pauschale Berechnung ohne sport-spezifische MET-Werte.</div>

          {/* PRO-only preview cards — blurred */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16}}>
            <div style={{padding:"8px 12px",background:"#FFFFFF",borderRadius:10,border:"1px solid #EBEBEB",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:10,color:"#888",marginBottom:2}}>Wasserverbrauch / Tag</div>
              <div style={{fontSize:18,fontWeight:400,color:C.black,letterSpacing:"-.02em",filter:"blur(5px)",userSelect:"none"}}>{pro?.waterMl?Math.round(pro.waterMl/100)/10:2.8}L</div>
              <div style={{fontSize:10,color:"#999",marginTop:1}}>Nur mit PRO</div>
            </div>
            <div style={{padding:"8px 12px",background:"#FFFFFF",borderRadius:10,border:"1px solid #EBEBEB",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:10,color:"#888",marginBottom:2}}>Fettverbrennung</div>
              <div style={{fontSize:18,fontWeight:400,color:C.black,letterSpacing:"-.02em",filter:"blur(5px)",userSelect:"none"}}>{pro?.fatBurnMin||110}–{pro?.fatBurnMax||128} bpm</div>
              <div style={{fontSize:10,color:"#999",marginTop:1}}>Nur mit PRO</div>
            </div>
          </div>

          {/* PRO locked */}
          <div style={{borderRadius:12,overflow:"hidden",border:`1.5px solid ${C.neon}`}}>
            <div style={{background:C.neon,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span style={{fontSize:12,fontWeight:500,color:C.black}}>Nur mit PRO · ~92% Genauigkeit</span>
              </div>
              <span style={{fontSize:11,color:"rgba(0,0,0,.4)",fontWeight:400,whiteSpace:"nowrap",marginLeft:12}}>CHF 9.90 / 6 Mt.</span>
            </div>
            <div style={{padding:"14px 16px",background:"#FAFFF0"}}>
              <div style={{marginBottom:8,fontSize:10,color:"#999",letterSpacing:".02em"}}>Zusätzlich zu Basic:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                {["Exakte kcal via MET","Protein exakt","Kohlenhydrate exakt","VO₂max Schätzwert","Wasserverbrauch / Tag","Fettverbrennungszone","Natrium-Verlust","Magnesium","Schweissverlust","Eisenbedarf-Prüfung","Protokolle","Unlimited AI Chat"].map(f=>(
                  <span key={f} style={{fontSize:11,padding:"3px 9px 3px 6px",borderRadius:20,background:"rgba(0,0,0,.06)",color:"#333",display:"inline-flex",alignItems:"center",gap:4}}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="6" fill="#222"/><path d="M3.5 6l2 2 3-3" stroke="#C8FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>{f}</span>
                ))}
              </div>
              <button onClick={scrollToCards} style={{width:"100%",background:C.neon,color:C.black,border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif",letterSpacing:".01em"}}>
                PRO — CHF 9.90 ↓
              </button>
              <div style={{marginTop:8,padding:"11px 14px",borderRadius:10,background:"#F0F0F0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={scrollToCards}>
                <span style={{fontSize:14,fontWeight:500,color:"#555",fontFamily:"Inter,sans-serif"}}>BASIC — CHF 6.90 ↓</span>
              </div>
              <div style={{marginTop:10,padding:"10px 12px",background:"#FAFAFA",borderRadius:8,border:"1px solid #F0F0F0",display:"flex",gap:10,alignItems:"flex-start"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:1}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div style={{fontSize:11,color:"#888",lineHeight:1.6}}><strong style={{color:"#333",fontWeight:600}}>Einmalige Zahlung für 6 Monate.</strong> Danach selbst entscheiden ob du verlängerst. Kein Passwort — per E-Mail-Link zu deinem Profil.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info card with info button */}
      <div className="fu3" style={{padding:"14px 16px",borderRadius:11,border:`1px solid ${C.g200}`,background:C.white,marginBottom:18}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
          <p style={{fontSize:12,color:C.g800,lineHeight:1.65,margin:0,flex:1}}>
            Basic schätzt deinen Bedarf pauschal — mit einem Basiswert für deine Sportarten, Intensität und Körperwerte. PRO berechnet exakt mit{" "}
            <span onClick={()=>setShowInfo(true)} style={{color:C.black,fontWeight:700,textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:3,cursor:"pointer"}}>
              MET-Werten (Compendium 2024)
            </span>
            {" "}— sport-spezifisch für deinen Körper. Nur so können wir dir die 100% passenden Supplements und Sportnahrung empfehlen.
          </p>
          <button onClick={()=>setShowInfo(true)}
            style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${C.g200}`,background:"rgba(255,255,255,.8)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,fontFamily:"Inter,sans-serif"}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setShowInfo(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)"}}/>
          <div style={{position:"relative",background:C.white,borderRadius:18,padding:"22px",maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}} onClick={e=>e.stopPropagation()}>

            {/* Header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
              <div style={{fontSize:14,fontWeight:700,color:C.black}}>Wie wir berechnen</div>
              <button onClick={()=>setShowInfo(false)} style={{width:26,height:26,borderRadius:"50%",border:`1px solid ${C.g200}`,background:C.g100,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif"}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.g600} strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* BASIC block */}
            <div style={{marginBottom:10,borderRadius:11,overflow:"hidden",border:`1px solid ${C.g200}`}}>
              <div style={{background:C.g100,padding:"8px 12px",borderBottom:`1px solid ${C.g200}`}}>
                <span style={{fontSize:10,fontWeight:700,color:C.black,fontFamily:"JetBrains Mono,monospace",letterSpacing:".04em"}}>BASIC — PAUSCHALBERECHNUNG</span>
              </div>
              <div style={{padding:"12px"}}>
                <p style={{fontSize:12,color:C.g800,lineHeight:1.6,margin:"0 0 10px"}}>
                  Berechnung mit der Mifflin-St. Jeor Formel × pauschaler Aktivitätsfaktor. Gleich für alle Sportarten und Intensitäten.
                </p>
                <div style={{background:C.g100,borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:C.black,fontWeight:600}}>BMR × 1.5</span>
                  <span style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace"}}>±25% Fehler</span>
                </div>
              </div>
            </div>

            {/* PRO block */}
            <div style={{marginBottom:14,borderRadius:11,overflow:"hidden",border:`1.5px solid ${C.neonBorder}`}}>
              <div style={{background:C.neon,padding:"8px 12px"}}>
                <span style={{fontSize:10,fontWeight:700,color:C.black,fontFamily:"JetBrains Mono,monospace",letterSpacing:".04em"}}>PRO — MET-WERTE (COMPENDIUM 2024)</span>
              </div>
              <div style={{padding:"12px",background:C.neonDim}}>
                <p style={{fontSize:12,color:C.g800,lineHeight:1.6,margin:"0 0 10px"}}>
                  MET-Wert (Metabolic Equivalent of Task) deiner Sportart und Intensität aus dem wissenschaftlichen Standard für Energieverbrauch — exakt berechnet für deinen Körper.
                </p>
                <div style={{background:"rgba(200,255,0,.2)",borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:C.black,fontWeight:600}}>MET {metVal} × {weight}kg × h</span>
                  <span style={{fontSize:10,color:C.black,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>±8% Fehler</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.g100,borderRadius:10,marginBottom:16}}>
              <div style={{textAlign:"center",flexShrink:0}}>
                <div style={{fontSize:18,fontWeight:800,color:C.black,letterSpacing:"-.03em",lineHeight:1}}>3×</div>
                <div style={{fontSize:8,color:C.g400,fontFamily:"JetBrains Mono,monospace"}}>GENAUER</div>
              </div>
              <div style={{width:1,height:28,background:C.g200,flexShrink:0}}/>
              <div style={{fontSize:11,color:C.g600,lineHeight:1.5}}>PRO reduziert den Berechnungsfehler von ±25% auf ±8% — sport-spezifisch für {sportLabel}.</div>
            </div>

            <button onClick={()=>setShowInfo(false)}
              style={{width:"100%",background:C.black,color:C.white,border:"none",borderRadius:10,padding:"11px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
              Verstanden
            </button>
          </div>
        </div>
      )}

      <div id="treyn-cards" className="fu3" style={{scrollMarginTop:"24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18,alignItems:"start"}}>
        {/* BASIC */}
        <div style={{border:"1px solid #E8E8E8",borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{background:"#FFFFFF",padding:"14px 16px",borderBottom:"1px solid #EBEBEB"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:22,fontWeight:600,color:C.black,letterSpacing:"-.02em",lineHeight:1}}>BASIC</div>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:"#EFEFEF",color:"#888",fontWeight:500,marginTop:3}}>~75% genau</span>
            </div>
            <div style={{fontSize:11,color:"#999",fontWeight:400}}>CHF 6.90 <span style={{color:"#BBB"}}>/ 6 Monate · CHF 1.15/Mt.</span></div>
          </div>
          <div style={{padding:"14px 16px",flex:1}}>
            <div style={{fontSize:10,color:"#888",marginBottom:2}}>Kcal Schätzung</div>
            <div style={{fontSize:22,fontWeight:400,color:C.black,letterSpacing:"-.02em",lineHeight:1,marginBottom:1}}>{basic.withTraining.toLocaleString("de-CH")}</div>
            <div style={{fontSize:10,color:"#999",marginBottom:14}}>BMR × 1.5 pauschal</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {ROWS.map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                  {r.basic ? <OK acid={false}/> : <NO/>}
                  <span style={{fontSize:11,color:r.basic?C.black:"#CCCCCC",lineHeight:1.4}}>{r.basicLabel||r.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"10px 13px 13px"}}>
            <button onClick={onContinue}
              style={{width:"100%",background:"#EBEBEB",color:"#555",border:"none",borderRadius:9,padding:"11px",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
              Basic — CHF 6.90 →
            </button>
            <div style={{textAlign:"center",fontSize:10,color:"#AAA",marginTop:5}}>6 Monate Zugang · jederzeit erneuerbar</div>
          </div>
        </div>

        {/* PRO */}
        <div style={{borderRadius:16,overflow:"hidden",border:`1.5px solid ${C.neon}`,display:"flex",flexDirection:"column",boxShadow:"0 4px 20px rgba(200,255,0,.15)"}}>
          <div style={{background:C.neon,padding:"14px 16px",borderBottom:"1px solid rgba(0,0,0,.08)"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:22,fontWeight:600,color:C.black,letterSpacing:"-.02em",lineHeight:1}}>PRO</div>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,background:"rgba(0,0,0,.12)",color:C.black,fontWeight:600,marginTop:3}}>~92% genau</span>
            </div>
            <div style={{fontSize:11,color:"rgba(0,0,0,.45)",fontWeight:400}}>CHF 9.90 <span style={{opacity:.7}}>/ 6 Monate · CHF 1.65/Mt.</span></div>
          </div>
          <div style={{padding:"14px 16px",flex:1,background:C.white}}>
            <div style={{fontSize:10,color:"#888",marginBottom:2}}>Kcal Exaktberechnung</div>
            <div style={{fontSize:22,fontWeight:400,color:C.black,letterSpacing:"-.02em",lineHeight:1,marginBottom:1}}>{pro.withTraining.toLocaleString("de-CH")}</div>
            <div style={{fontSize:10,color:"#999",marginBottom:14}}>MET-Werte (Compendium 2024)</div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {ROWS.filter(r=>!r.basicOnly).map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                  <OK acid={false}/>
                  <span style={{fontSize:11,color:C.black,fontWeight:400,lineHeight:1.4}}>
                    {r.proLabel||r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:"10px 13px 14px",background:C.white}}>
            <button onClick={openPro} disabled={loadPro}
              style={{width:"100%",background:loadPro?C.g200:C.neon,color:C.black,border:"none",borderRadius:9,padding:"12px",fontSize:13,fontWeight:800,cursor:loadPro?"default":"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s",marginBottom:6}}>
              {loadPro?"...":"Pro — CHF 9.90 →"}
            </button>
            <div style={{textAlign:"center",fontSize:10,color:"#888",marginTop:2}}>6 Monate Zugang · jederzeit erneuerbar</div>
          </div>
        </div>
      </div>

      </div>{/* end treyn-cards */}

      {/* Blood test premium tier */}

    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────

function Results({sportData,trainingData,profilData,allergenData,tier,onReset,onUpgrade}) {
  const [tab,setTab]=useState("verbrauch");
  const isPro=tier==="pro";
  const healthOnly=sportData?.healthOnly;
  const primarySport=sportData?.primarySport;
  const sportLabel=SPORT_GROUPS.find(s=>s.id===primarySport)?.label||(healthOnly?"Gesundheit":"Sport");
  const primaryTraining=trainingData?.[primarySport]||{intensity:"medium"};
  const {basis,specific}=getSupplements(primarySport,primaryTraining.intensity,healthOnly);
  const profile=buildProfile(sportData,trainingData,profilData);
  const proData=isPro?calcPro(profilData,trainingData,sportData):null;
  const kcal=isPro?proData:calcBasic(profilData,trainingData,healthOnly);
  const {primSupps,secSupps}=getPersonalizedSupps(profile,[...specific,...basis],[],proData);
  const sportNutrition=healthOnly?{primary:[],secondary:[]}:getSportNutrition(primarySport);
  const fname=profilData?.firstname||"";
  const intensityLabel={"low":"Leicht","medium":"Mittel","high":"Intensiv","competition":"Wettkampf"}[primaryTraining.intensity]||"Mittel";
  const aiCtx={sportLabel,intensity:primaryTraining.intensity,days:primaryTraining.days||3,duration:primaryTraining.duration||60,weight:profilData?.weight||75,gender:profilData?.gender||"m",hasComp:primaryTraining.hasCompetition,compCount:primaryTraining.compCount||0,proData};

  const NAV=[
    {id:"verbrauch",   label:"Deine Daten",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>},
    {id:"produkte",      label:"Deinen Plan", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>},
    {id:"supplements", label:"Supplements", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>},
    {id:"nutrition",   label:"Sportnahrung",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>},
    {id:"fertiggerichte",label:"Fertiggerichte", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/><path d="M12 12l4-4"/></svg>},
    {id:"recovery",       label:"Recovery Gear",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>},
    {id:"bluttest",      label:"Bluttest",      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>, badge:true, upgrade:true},
  ];
  const PROFIL_NAV={id:"profil",label:"Profil & Zahlung",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>};
  const KONTAKT_NAV={id:"kontakt",label:"Kontakt & Impressum",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>};

  const NavItem=({item})=>{
    const active=tab===item.id;
    return (
      <button onClick={()=>setTab(item.id)} style={{
        display:"flex",alignItems:"center",gap:10,width:"100%",
        padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",
        background:active?C.neon:"transparent",
        color:active?C.black:C.g600,
        fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:active?600:400,
        transition:"all .14s",textAlign:"left",position:"relative",
      }}>
        <span style={{color:active?C.black:C.g400,flexShrink:0}}>{item.icon}</span>
        {item.label}
        {item.upgrade&&<span style={{
          marginLeft:"auto",fontSize:8,padding:"2px 6px",borderRadius:4,
          background:C.neon,color:C.black,fontFamily:"JetBrains Mono,monospace",
          fontWeight:700,
        }}>UPGRADE</span>}
      </button>
    );
  };

  const NutritionTab=()=>{
            const [filter,setFilter]=useState("optimal");
            const [ownedSn,setOwnedSn]=useState(()=>{ try{ return JSON.parse(localStorage.getItem("treyn_owned")||"[]"); }catch{ return []; } });
            const toggleOwnedSn=(id)=>{
              try{
                const list=JSON.parse(localStorage.getItem("treyn_owned")||"[]");
                const next=list.includes(id)?list.filter(x=>x!==id):[...list,id];
                localStorage.setItem("treyn_owned",JSON.stringify(next));
                setOwnedSn(next);
              }catch{}
            };
            const FILTERS=[
              {id:"optimal",  label:"Optimalste Produkte",   desc:"Wissenschaftlich beste Wirkung"},
              {id:"budget",   label:"Günstigste Alternative",desc:"Ähnliche Wirkung, tieferer Preis"},
              {id:"premium",  label:"Hochwertigste Auswahl", desc:"Beste verfügbare Qualität"},
            ];

            // Extended nutrition data with budget/premium alternatives
            const ALL_NUTRITION={
              cycling:{
                optimal:[
                  {id:"sn_mau_320",barcode:"73160700",name:"Maurten Drink Mix 320",dose:"80g / 500ml · 1 Flasche/h",when:"Ausfahrten über 2h",why:"Hydrogel-Technologie — minimaler GI-Stress, maximale Kohlenhydrataufnahme. Offizielle Tour de France Nahrung.",link:AFF.maurten("drink-mix-320"),shop:"Maurten",price:"~CHF 4.50/Portion",isPartner:true},
                  {id:"sn_mau_caf_2",name:"Maurten Gel 100 CAF 100",dose:"1 Gel alle 40–45 min",when:"Rennen & Intervalle",why:"Koffein + Kohlenhydrate für maximale Leistung in Rennsituationen.",link:AFF.maurten("gel-100-caf-100"),shop:"Maurten",price:"~CHF 4.00/Gel",isPartner:true},
                ],
                budget:[
                  {id:"sn_sp_gel",name:"Sponser Liquid Energy",dose:"1 Beutel alle 45 min",when:"Training & Rennen",why:"Günstigere Alternative mit ähnlichem Kohlenhydratprofil. Gute Verträglichkeit.",link:AFF.sponser("liquid energy"),shop:"Sponser",price:"~CHF 2.20/Portion",isPartner:true},
                  {id:"sn_elek_2",name:"Sponser Elektrolyt-Tabs",dose:"1 Tab / 500ml",when:"Training ab 60 min",why:"Kostengünstige Elektrolytversorgung — Natrium, Kalium, Magnesium.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser",price:"~CHF 0.50/Tab",isPartner:true},
                ],
                premium:[
                  {id:"sn_mau_320p",name:"Maurten Drink Mix 320 CAF",dose:"80g / 500ml",when:"Wettkampf & harte Intervalle",why:"Premium-Version mit Koffein — maximale Performance für Entscheidungsmomente.",link:AFF.maurten("drink-mix-320"),shop:"Maurten",price:"~CHF 5.50/Portion",isPartner:true},
                  {id:"sn_mn_heat_2",name:"MNSTRY Fast Carb Heat",dose:"1 Portion 30 min vor Start",when:"Vor langen Touren (3h+)",why:"Premium Kohlenhydrat-Loading mit natürlichen Zutaten. Genutzt von EF Education.",link:AFF.mnstry("fast-carb-heat"),shop:"MNSTRY",price:"~CHF 5.00/Portion",isPartner:true},
                ],
              },
              running:{
                optimal:[
                  {id:"sn_mau_gel",barcode:"73160717",name:"Maurten Gel 100",dose:"1 Gel alle 30–40 min",when:"Läufe ab 75 min",why:"Magenfreundlichste Option am Markt durch Hydrogel. Ideal für empfindliche Läufermägen.",link:AFF.maurten("gel-100"),shop:"Maurten",price:"~CHF 3.80/Gel",isPartner:true},
                  {id:"sn_mn_gel",name:"MNSTRY Intensity Gel",dose:"1 Gel alle 30–45 min",when:"Tempoläufe & Rennen",why:"Natürliche Zutaten, niedriger GI-Stress — Favorit der Trail-Running Community.",link:AFF.mnstry("intensity-gel"),shop:"MNSTRY",price:"~CHF 3.50/Gel",isPartner:true},
                ],
                budget:[
                  {id:"sn_sp_run",name:"Sponser Liquid Energy BCAA",dose:"1 Beutel alle 45 min",when:"Läufe ab 60 min",why:"Günstig, mit BCAAs für Muskelschutz. Gute Alternative für Trainingseinheiten.",link:AFF.sponser("liquid energy bcaa"),shop:"Sponser",price:"~CHF 2.00/Portion",isPartner:true},
                ],
                premium:[
                  {id:"sn_mau_gel_p",name:"Maurten Gel 100 CAF 100",dose:"1 Gel alle 30 min",when:"Wettkampf",why:"Koffein-Boost im Gel-Format — für maximale Rennendspur.",link:AFF.maurten("gel-100-caf-100"),shop:"Maurten",price:"~CHF 4.00/Gel",isPartner:true},
                ],
              },
            };

            const getNutrition=()=>{
              const sport=primarySport;
              const data=ALL_NUTRITION[sport]||ALL_NUTRITION.cycling;
              return data[filter]||data.optimal||[];
            };

            const items=getNutrition();

            return (
              <div>
                <h2 style={{fontSize:18,fontWeight:700,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Sportnahrung</h2>
                <p style={{fontSize:13,color:C.g600,marginBottom:14}}>Auf deinen Sport und deine Intensität abgestimmt.</p>

                {/* AI Disclaimer */}
              <div style={{marginBottom:12,padding:"10px 14px",background:C.g100,borderRadius:10,border:`1px solid ${C.g200}`,display:"flex",gap:10,alignItems:"flex-start"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div style={{fontSize:11,color:C.g600,lineHeight:1.6}}>
                  Ernährungsempfehlungen von TREYN AI — keine medizinische Beratung. Inhaltsstoffe & Wechselwirkungen immer beim Hersteller prüfen. Bei Erkrankungen oder Medikamenten: Arzt konsultieren.
                </div>
              </div>


              {/* Philosophy banner */}
                <div style={{marginBottom:16,padding:"12px 14px",background:C.g100,borderRadius:11,border:`1px solid ${C.g200}`,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div style={{fontSize:11,color:C.g600,lineHeight:1.6}}>
                    Wir arbeiten mit ausgewählten Partnershops & Brands zusammen — empfehlen aber alle verfügbaren Supplements & Sportnahrung für deine bestmögliche Performance, unabhängig ob ein Produkt bei uns gelistet ist oder extern verlinkt wird.
                  </div>
                </div>

                {/* Filter */}
                <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
                  {FILTERS.map(f=>(
                    <button key={f.id} onClick={()=>setFilter(f.id)}
                      style={{padding:"8px 14px",borderRadius:9,border:`1.5px solid ${filter===f.id?C.neon:C.g200}`,background:filter===f.id?C.neonDim:C.white,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
                      <div style={{fontSize:12,fontWeight:filter===f.id?700:500,color:filter===f.id?C.black:C.g800}}>{f.label}</div>
                      <div style={{fontSize:10,color:C.g400,marginTop:1}}>{f.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Products */}
                {items.length>0?(
                  items.map((s,i)=>(
                    <div key={s.id} style={{border:`1px solid ${C.g200}`,borderRadius:14,padding:"16px 18px",marginBottom:9,background:C.white,animation:`fadeUp .3s ${i*0.05}s ease forwards`,opacity:0}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:8}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                            <span className="chip" style={{background:"rgba(255,149,0,.1)",color:C.orange,border:"1px solid rgba(255,149,0,.25)",fontSize:9}}>SPORTNAHRUNG</span>
                            <span className="mono" style={{fontSize:9}}>{s.when}</span>
                            {s.price&&<span style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace"}}>{s.price}</span>}
                          </div>
                          <div style={{fontSize:15,fontWeight:700,letterSpacing:"-.02em",marginBottom:2}}>{s.name}</div>
                          <div style={{fontSize:11,color:C.g600,fontFamily:"JetBrains Mono,monospace"}}>{s.dose}</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                          <a href={s.link} target="_blank" rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:4,background:{"Maurten":C.black,"MNSTRY":"#0D0D1A"}[s.shop]||"#2D7C2B",color:{"Maurten":C.neon,"MNSTRY":C.neon}[s.shop]||"#fff",padding:"7px 12px",borderRadius:8,fontSize:11,fontWeight:600,textDecoration:"none",whiteSpace:"nowrap"}}>
                            {s.shop} ↗
                          </a>
                          <span style={{fontSize:8,color:s.isPartner?C.green:C.g400,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>{s.isPartner?"PARTNER":"EXTERN"}</span>
                        </div>
                      </div>
                      <div style={{fontSize:13,color:C.g800,lineHeight:1.6,marginBottom:8}}>{s.why}</div>
                      <button onClick={()=>toggleOwnedSn(s.id)}
                        style={{display:"inline-flex",alignItems:"center",gap:6,background:ownedSn.includes(s.id)?C.neonDim:"transparent",border:`1px solid ${ownedSn.includes(s.id)?C.neon:C.g200}`,borderRadius:7,padding:"4px 10px",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
                        <div style={{width:13,height:13,borderRadius:"50%",background:ownedSn.includes(s.id)?C.black:C.g100,border:`1.5px solid ${ownedSn.includes(s.id)?C.black:C.g400}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {ownedSn.includes(s.id)&&<svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke={C.neon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{fontSize:10,fontWeight:600,color:ownedSn.includes(s.id)?C.black:C.g600}}>{ownedSn.includes(s.id)?"Vorhanden / bestellt":"Ich habe das Produkt bereits"}</span>
                      </button>
                    </div>
                  ))
                ):(
                  <div style={{padding:"20px",textAlign:"center",color:C.g400,fontSize:13}}>Keine Produkte für diese Auswahl verfügbar.</div>
                )}


              </div>
            );
  };

  const ShopTab=()=>{
    const [shopCat,setShopCat]=useState("supplements");
    const CATS=[
      {id:"supplements",label:"Supplements"},
      {id:"sportnahrung",label:"Sportnahrung"},
      {id:"fertiggerichte",label:"Fertiggerichte"},
    ];
    const SUPPS=[
      {name:"Omega-3 (EPA/DHA)",dose:"2–3g täglich",shop:"iHerb",price:"~CHF 0.30/Tag",link:AFF.iherb("omega 3 epa dha"),desc:"Entzündungshemmend, Herzgesundheit, HRV-Verbesserung",tags:["Basis","Täglich"]},
      {name:"Magnesium Bisglycinate",dose:"300–400mg täglich",shop:"iHerb",price:"~CHF 0.15/Tag",link:AFF.iherb("magnesium bisglycinate"),desc:"Schlafqualität, Muskelentspannung, Krampfprävention",tags:["Basis","Abends"]},
      {name:"Vitamin D3 + K2",dose:"2000–4000 IE täglich",shop:"iHerb",price:"~CHF 0.10/Tag",link:AFF.iherb("vitamin d3 k2"),desc:"Immunsystem, Knochen, Hormonstatus",tags:["Basis","Täglich"]},
      {name:"Ashwagandha KSM-66",dose:"600mg täglich",shop:"iHerb",price:"~CHF 0.50/Tag",link:AFF.iherb("ashwagandha ksm-66"),desc:"Senkt Cortisol, verbessert Schlaftiefe und Regeneration",tags:["Adaptogen","Abends"]},
      {name:"Whey Protein Isolat",dose:"25–30g post-workout",shop:"Myprotein",price:"~CHF 1.50/Portion",link:AFF.myprotein("whey protein isolate"),desc:"Muskelreparatur und -aufbau nach dem Training",tags:["Protein","Post-Training"]},
      {name:"ESN Designer Whey",dose:"25–30g post-workout",shop:"ESN",price:"~CHF 1.20/Portion",link:AFF.esn("designer-whey-protein"),desc:"Marktführer in DE/CH/AT — hochwertige Zutaten, viele Geschmacksrichtungen",tags:["Protein","Post-Training"]},
      {name:"More Nutrition Total Protein",dose:"25g post-workout",shop:"More Nutrition",price:"~CHF 1.30/Portion",link:AFF.morenutrition("total-protein"),desc:"High-Protein, Low-Carb — beliebt bei Fitness & Lifestyle Athleten",tags:["Protein","Low-Carb"]},
      {name:"Kreatin Monohydrat",dose:"5g täglich",shop:"iHerb",price:"~CHF 0.20/Tag",link:AFF.iherb("creatine monohydrate"),desc:"Sprintleistung und Regeneration — bestens erforscht",tags:["Kraft","Täglich"]},
      {name:"Beta-Alanin",dose:"3.2–6.4g täglich",shop:"iHerb",price:"~CHF 0.30/Tag",link:AFF.iherb("beta alanine"),desc:"Puffert Laktat, verzögert Ermüdung bei Intervallen",tags:["Ausdauer","Pre-Workout"]},
      {name:"Zink 15mg",dose:"15mg täglich",shop:"iHerb",price:"~CHF 0.10/Tag",link:AFF.iherb("zinc 15mg"),desc:"Immunabwehr, Testosteron, Wundheilung",tags:["Immunsystem","Täglich"]},
      {name:"Kollagen + Vitamin C",dose:"10–15g vor Training",shop:"iHerb",price:"~CHF 0.60/Tag",link:AFF.iherb("collagen vitamin c"),desc:"Sehnen- und Gelenkschutz",tags:["Gelenke","Prävention"]},
      {name:"Tart Cherry Extrakt",dose:"480mg täglich",shop:"iHerb",price:"~CHF 0.40/Tag",link:AFF.iherb("tart cherry"),desc:"DOMS-Reduktion nach langen Einheiten",tags:["Recovery","Post-Training"]},
      {name:"Rote Beete Nitrat",dose:"400–600mg Nitrat",shop:"iHerb",price:"~CHF 0.50/Tag",link:AFF.iherb("beet root nitrate"),desc:"Verbessert O2-Effizienz um 1–3%",tags:["Ausdauer","Pre-Training"]},
    ];
    const SPORT=[
      {name:"Maurten Gel 100",dose:"1 Gel alle 30–45 min",shop:"Maurten",price:"~CHF 4.00",link:AFF.maurten("gel-100-box"),desc:"Hydrogel-Technologie — minimaler GI-Stress",tags:["Race-Day","Kohlenhydrate"]},
      {name:"Maurten Gel 100 CAF",dose:"1 Gel bei Rennen",shop:"Maurten",price:"~CHF 4.50",link:AFF.maurten("gel-100-caf-100"),desc:"Koffein + Kohlenhydrate für maximale Leistung",tags:["Race-Day","Koffein"]},
      {name:"Maurten Drink Mix 320",dose:"80g / 500ml",shop:"Maurten",price:"~CHF 4.50",link:AFF.maurten("drink-mix-320"),desc:"Hohe Kohlenhydratdichte ohne GI-Probleme",tags:["Ausdauer","Kohlenhydrate"]},
      {name:"MNSTRY Intensity Gel",dose:"1 Gel alle 30–45 min",shop:"MNSTRY",price:"~CHF 3.50",link:AFF.mnstry("intensity-gel"),desc:"Magenfreundlich — genutzt von Canyon//SRAM",tags:["Race-Day","Carbs"]},
      {name:"Sponser Elektrolyt-Tabs",dose:"1 Tab / 500ml",shop:"Sponser",price:"~CHF 0.50",link:AFF.sponser("elektrolyt tabletten"),desc:"Natrium, Kalium, Magnesium — Krampfprävention",tags:["Hydration","Sommer"]},
      {name:"Koffein 100–200mg",dose:"30–45 min vor Wettkampf",shop:"iHerb",price:"~CHF 0.15",link:AFF.iherb("caffeine 100mg"),desc:"Kognitive Leistung + Ausdauer",tags:["Pre-Race","Koffein"]},
    ];
    const FERTIG=[
      {name:"Löwenanteil",desc:"Bio-Fertiggerichte im Glas — 30–42g Protein, 1 Jahr ungekühlt haltbar",price:"ab CHF 7.90 / Glas",link:"https://www.loewenanteil.com?ref=TREYN",tags:["Bio","High Protein","TOP PICK"]},
      {name:"Huel",desc:"Vollwertige Mahlzeiten & Shakes — alle 26 Vitamine & Mineralien",price:"ab CHF 2.50 / Mahlzeit",link:"https://huel.com/ch?ref=TREYN",tags:["Vegan","Vollwertig"]},
      {name:"Foodspring",desc:"Sport-Nutrition Mahlzeiten — Protein-Porridge, Recovery Shakes",price:"ab CHF 4.90 / Portion",link:"https://www.foodspring.ch?ref=TREYN",tags:["Sport","CH/DE/AT"]},
      {name:"Saturo",desc:"Flüssige Vollmahlzeiten — sofort trinkfertig, 0 Min. Zubereitung",price:"ab CHF 3.50 / Flasche",link:"https://saturo.com/de?ref=TREYN",tags:["Vegan","Sofort"]},
    ];
    const SC={"iHerb":{bg:"#2D7C2B",t:"#fff"},"Myprotein":{bg:"#CC0000",t:"#fff"},"Maurten":{bg:"#000",t:C.neon},"MNSTRY":{bg:"#0D0D1A",t:C.neon},"Sponser":{bg:"#003087",t:"#fff"},"ESN":{bg:"#1A1A2E",t:"#fff"},"More Nutrition":{bg:"#E8272A",t:"#fff"}};
    const items=shopCat==="supplements"?SUPPS:shopCat==="sportnahrung"?SPORT:FERTIG;
    return (
      <div>
        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Shop</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.5}}>Alle Affiliate-Produkte auf einen Blick — direkt beim Anbieter kaufen.</p>
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setShopCat(c.id)}
              style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${shopCat===c.id?"#0A0A0A":"#E0E0E0"}`,background:shopCat===c.id?"#0A0A0A":"transparent",color:shopCat===c.id?"#fff":"#666",fontSize:12,fontWeight:shopCat===c.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s"}}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {items.map((p,i)=>{
            const sc=SC[p.shop]||{bg:"#333",t:"#fff"};
            return (
              <div key={i} style={{background:"#fff",borderRadius:12,border:"1px solid #EBEBEB",padding:"14px 16px",boxShadow:"0 1px 4px rgba(0,0,0,.04)",display:"flex",flexDirection:"column"}}>
                <div style={{flex:1,marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:2,lineHeight:1.3}}>{p.name}</div>
                  {p.dose&&<div style={{fontSize:10,color:"#AAA",fontFamily:"JetBrains Mono,monospace",marginBottom:4}}>{p.dose}</div>}
                  <div style={{fontSize:11,color:"#666",lineHeight:1.5,marginBottom:8}}>{p.desc}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {p.tags.map(t=><span key={t} style={{fontSize:9,padding:"2px 6px",borderRadius:8,background:t==="TOP PICK"?C.neonDim:"#F5F5F5",color:t==="TOP PICK"?"#4A7000":"#666",fontFamily:"JetBrains Mono,monospace",border:t==="TOP PICK"?`1px solid ${C.neon}`:"none"}}>{t}</span>)}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,paddingTop:10,borderTop:"1px solid #F5F5F5"}}>
                  <span style={{fontSize:11,fontWeight:500,color:"#333"}}>{p.price}</span>
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:4,background:sc.bg,color:sc.t,padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:600,textDecoration:"none",flexShrink:0,whiteSpace:"nowrap"}}>
                    {p.shop||"Bestellen"} ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:16,fontSize:10,color:"#AAA",lineHeight:1.6,textAlign:"center"}}>Alle Preise sind Richtwerte und können beim Anbieter variieren.</div>
      </div>
    );
  };

  // ── VERBRAUCH TAB ──────────────────────────────────────────────────────────
  const VerbrauchTab=()=>{
    const [localTraining,setLocalTraining]=useState(()=>JSON.parse(JSON.stringify(trainingData||{})));
    React.useEffect(()=>{ if(trainingData&&Object.keys(trainingData).length>0) setLocalTraining(JSON.parse(JSON.stringify(trainingData))); },[JSON.stringify(trainingData)]);
    const [showEditor,setShowEditor]=useState(false);
    const INTENS=[["low","Leicht"],["medium","Mittel"],["high","Intensiv"],["competition","Wettkampf"]];
    const w=+profilData?.weight||75;
    const age=profilData?.birthyear?new Date().getFullYear()-+profilData.birthyear:30;
    const calc=isPro?calcPro(profilData,localTraining,sportData):calcBasic(profilData,localTraining,healthOnly);
    if(!calc) return <div style={{padding:24,color:C.g400}}>Lädt...</div>;
    const totalDays=Object.values(localTraining).reduce((s,d)=>s+(d.days||0),0);
    const totalMin=Object.values(localTraining).reduce((s,d)=>s+(d.days||0)*(d.duration||60),0);

    const Pill=({label,active,onClick})=>(
      <button onClick={onClick} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${active?"#0A0A0A":"#E0E0E0"}`,background:active?"#0A0A0A":"transparent",color:active?"#fff":"#888",fontSize:11,fontWeight:active?500:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s",whiteSpace:"nowrap"}}>
        {label}
      </button>
    );

    // Metric card with description
    const M=({label,value,unit,sub,desc,locked,accent})=>(
      <div style={{background:"#FFFFFF",borderRadius:12,padding:"14px 16px",border:"1px solid #E8E8E8",boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
        <div style={{fontSize:10,color:"#AAA",marginBottom:6,letterSpacing:".02em"}}>{label}</div>
        {locked?(
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{fontSize:11,color:"#CCC"}}>Nur mit PRO</span>
            <button onClick={onUpgrade} style={{marginLeft:"auto",fontSize:9,padding:"2px 6px",borderRadius:4,background:C.neon,color:"#000",border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:600}}>↑</button>
          </div>
        ):(
          <>
            <div style={{fontSize:22,fontWeight:300,color:accent?"#4A7000":"#0A0A0A",letterSpacing:"-.03em",lineHeight:1.1}}>
              {value}<span style={{fontSize:12,color:"#AAA",marginLeft:3,fontWeight:400}}>{unit}</span>
            </div>
            {sub&&<div style={{fontSize:10,color:"#AAA",marginTop:2}}>{sub}</div>}
            {desc&&<div style={{fontSize:10,color:"#BBB",marginTop:6,lineHeight:1.5,paddingTop:6,borderTop:"1px solid #F0F0F0"}}>{desc}</div>}
          </>
        )}
      </div>
    );

    return (
      <div>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div>
            <div style={{fontSize:20,fontWeight:500,color:"#0A0A0A",letterSpacing:"-.02em"}}>{profilData?.firstname||"Dein Profil"}</div>
            <div style={{fontSize:12,color:"#AAA",marginTop:2}}>{age} Jahre · {profilData?.height||"—"} cm · {w} kg</div>
          </div>
          <div style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:isPro?C.neon:"#F0F0F0",color:isPro?"#000":"#888",fontWeight:600}}>
            {isPro?"PRO · ~92% genau":"BASIC · ~72% genau"}
          </div>
        </div>

        {/* ── SPORTARTEN (zuoberst, editierbar) ── */}
        <div style={{marginBottom:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase"}}>Deine Sportarten</div>
          <button onClick={()=>setShowEditor(e=>!e)} style={{fontSize:11,color:showEditor?"#0A0A0A":"#888",background:showEditor?C.neonDim:"#F5F5F5",border:`1px solid ${showEditor?C.neon:"#E8E8E8"}`,borderRadius:20,padding:"3px 12px",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:showEditor?600:400,transition:"all .12s"}}>
            {showEditor?"✓ Fertig":"Anpassen"}
          </button>
        </div>
        <div style={{borderRadius:12,border:"1px solid #EBEBEB",overflow:"hidden",marginBottom:24,background:"#fff"}}>
          {Object.entries(localTraining).map(([id,d],i,arr)=>{
            const s=SPORT_GROUPS.find(g=>g.id===id);
            const met=(SPORT_MET[id]||SPORT_MET.fussball)[d.intensity||"medium"];
            const kcalSess=Math.round(met*w*(d.duration||60)/60);
            return (
              <div key={id} style={{padding:"12px 16px",borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showEditor?10:0}}>
                  <div>
                    <span style={{fontSize:14,fontWeight:500,color:"#0A0A0A"}}>{s?.label||id}</span>
                    <span style={{fontSize:11,color:"#AAA",marginLeft:10}}>{{"low":"Leicht","medium":"Mittel","high":"Intensiv","competition":"Wettkampf"}[d.intensity]||"Mittel"} · {d.days}× / Woche · ~{kcalSess} kcal</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:400,color:"#0A0A0A"}}>{d.duration} min</span>
                </div>
                {showEditor&&(
                  <div style={{paddingTop:10,borderTop:"1px solid #F5F5F5"}}>
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:10,color:"#CCC",marginBottom:4}}>Intensität</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {INTENS.map(([v,l])=><Pill key={v} label={l} active={d.intensity===v} onClick={()=>setLocalTraining(t=>({...t,[id]:{...t[id],intensity:v}}))}/>)}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div>
                        <div style={{fontSize:10,color:"#CCC",marginBottom:4}}>Einheiten / Woche</div>
                        <div style={{display:"flex",gap:3}}>
                          {[1,2,3,4,5,6,7].map(n=>(
                            <button key={n} onClick={()=>setLocalTraining(t=>({...t,[id]:{...t[id],days:n}}))}
                              style={{width:26,height:26,borderRadius:6,border:`1px solid ${d.days===n?"#0A0A0A":"#E0E0E0"}`,background:d.days===n?"#0A0A0A":"transparent",color:d.days===n?"#fff":"#888",fontSize:12,fontWeight:d.days===n?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:"#CCC",marginBottom:4}}>Ø Dauer: <strong style={{color:"#555"}}>{d.duration} min</strong></div>
                        <input type="range" min="20" max="300" step="10" value={d.duration||60} onChange={e=>setLocalTraining(t=>({...t,[id]:{...t[id],duration:+e.target.value}}))} style={{width:"100%"}}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── ENERGIE ── */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Energie</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <M label="Grundumsatz" value={calc.bmr.toLocaleString("de-CH")} unit="kcal" sub="täglich, ohne Training" desc="Kalorien die dein Körper in Ruhe verbraucht — Atmung, Herzschlag, Organe. Basis für alle Berechnungen." accent/>
          <M label={isPro?"Tagesbedarf (Training)":"Mit Training (Schätzung)"} value={calc.withTraining.toLocaleString("de-CH")} unit="kcal" sub={isPro?"MET-basiert · ±8%":"Schätzung · ±25%"} desc={isPro?"Dein gesamter Tagesbedarf an Trainingstagen. Berechnet via MET-Werte für jede Sportart.":"Geschätzter Tagesbedarf mit Training. Upgrade auf PRO für sportartspezifische Genauigkeit."}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
          <M label="Kaloriendefizit Training" value={(calc.withTraining-calc.bmr).toLocaleString("de-CH")} unit="kcal" desc="Zusätzliche Kalorien die du durch Training verbrennst. Musst du täglich ersetzen."/>
          <M label="Training / Woche" value={totalDays} unit="×" sub={`${Math.round(totalMin/60)}h total`} desc="Deine gesamten Trainingseinheiten pro Woche über alle Sportarten."/>
          <M label="Kcal / Monat (Training)" value={((calc.withTraining-calc.bmr)*totalDays*4).toLocaleString("de-CH")} unit="kcal" desc="Hochgerechneter Kalorienverbrauch durch Training pro Monat."/>
        </div>

        {/* ── MAKROS ── */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Makronährstoffe</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
          <M label="Protein / Tag" value={isPro?`${calc.proteinMin}–${calc.proteinMax}`:`${Math.round(w*1.4)}–${Math.round(w*1.8)}`} unit="g" sub={isPro?"exakt":"Schätzwert"} desc="Eiweissbedarf für Muskelaufbau und -erhalt. Besonders wichtig bei Kraft- und Ausdauersport."/>
          <M label="Kohlenhydrate / Tag" value={isPro?`${calc.carbsG}`:`${Math.round(calc.withTraining*0.45/4)}–${Math.round(calc.withTraining*0.55/4)}`} unit="g" sub={isPro?"exakt":"Schätzwert"} desc="Primärer Energielieferant für intensive Trainings. Füllt deine Glykogenspeicher."/>
          <M label="Fett / Tag" value={Math.round(calc.withTraining*0.25/9)} unit="g" sub="~25% Kalorien" desc="Wichtig für Hormonsynthese, fettlösliche Vitamine und Langzeitenergie."/>
        </div>

        {/* ── ELEKTROLYTE ── */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Elektrolyte & Flüssigkeit</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:8}}>
          <M label="Natrium-Verlust / Tag" value={isPro?calc.natriumMg.toLocaleString("de-CH"):"—"} unit={isPro?"mg":""} locked={!isPro} desc="Natrium verlierst du hauptsächlich durch Schweiss. Zu wenig führt zu Krämpfen und Leistungseinbruch."/>
          <M label="Magnesium-Bedarf / Tag" value={isPro?calc.magnesiumMg:"—"} unit={isPro?"mg":""} locked={!isPro} desc="Magnesium ist essenziell für Muskelkontraktion und Regeneration. Sportler verlieren mehr als Nichtsportler."/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:20}}>
          <M label="Wasserverbrauch / Tag" value={isPro&&calc.waterMl?(Math.round(calc.waterMl/100)/10):"—"} unit={isPro?"L":""} locked={!isPro} desc="Dein persönlicher Wasserbedarf inkl. Trainingszuschlag. Sportler brauchen deutlich mehr als der Richtwert von 2L."/>
          <M label="Schweiss / Session" value={isPro&&calc.sweatLitresPerSession?calc.sweatLitresPerSession:"—"} unit={isPro?"L":""} locked={!isPro} desc="Geschätzter Schweissverlust pro Trainingseinheit — wichtig für die richtige Flüssigkeitszufuhr während dem Sport."/>
        </div>

        {/* ── LEISTUNGSZONEN ── */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Leistung & Herzfrequenz-Zonen</div>
        <div style={{display:"grid",gridTemplateColumns:isPro&&calc.vo2max?"repeat(4,1fr)":"repeat(3,1fr)",gap:8,marginBottom:20}}>
          <M label="Max. Herzfrequenz" value={220-age} unit="bpm" desc="Deine theoretische maximale Herzfrequenz. Basis für alle Trainingszonenbergechnungen (220 – Alter)."/>
          <M label="Fettverbrennungszone" value={`${Math.round((220-age)*.60)}–${Math.round((220-age)*.70)}`} unit="bpm" desc="In dieser Zone verbrennt dein Körper anteilsmässig am meisten Fett. Ideal für lange, ruhige Ausdauereinheiten."/>
          <M label="Ausdauerzone" value={`${Math.round((220-age)*.70)}–${Math.round((220-age)*.80)}`} unit="bpm" desc="Typische Zone für Grundlagenausdauer. Fordert das Herz-Kreislauf-System ohne zu überlasten."/>
          {isPro&&calc.vo2max&&(
            <M label="VO₂max (geschätzt)" value={calc.vo2max} unit="ml/kg/min" sub={calc.vo2maxLabel} desc="Maximale Sauerstoffaufnahme — der wichtigste Wert für Ausdauerleistung. Geschätzt via Uth-Sørensen Formel." accent/>
          )}
        </div>

        {/* ── KOHLENHYDRATE IM TRAINING ── */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Kohlenhydrate im Training</div>
        <div style={{borderRadius:12,border:"1px solid #EBEBEB",overflow:"hidden",marginBottom:24,background:"#fff"}}>
          {Object.entries(localTraining).map(([id,d],i,arr)=>{
            const dur=d.duration||60;
            const intens=d.intensity||"medium";
            // Carb need per hour based on intensity and duration
            let carbPerH=0, strategy="", method="", note="";
            if(dur<60){
              carbPerH=0; strategy="Kein Zusatz nötig"; method="Wasser reicht";
              note="Bei unter 60 Minuten reichen deine Glykogenspeicher vollständig aus.";
            } else if(dur<=90&&intens==="low"){
              carbPerH=20; strategy="Wenig Kohlenhydrate"; method="Elektrolytgetränk";
              note="Leichte bis moderate Belastung — kleiner Zuschuss stabilisiert Blutzucker.";
            } else if(dur<=90){
              carbPerH=45; strategy="Moderat nachladen"; method="Isotonisches Getränk oder 1 Gel";
              note="Pro Stunde: 1 Gel (25–30g) + Wasser oder isotonisches Sportgetränk (500ml).";
            } else if(dur<=150){
              carbPerH=60; strategy="Regelmässig nachladen"; method="Getränk + Gel kombinieren";
              note="Pro Stunde: 1 Gel + 400–500ml Sportgetränk. Alle 20–30 min aufnehmen.";
            } else {
              carbPerH=80; strategy="Maximales Nachladen (2:1)"; method="Glukose + Fruktose Mix";
              note="Über 2.5h: Glukose+Fruktose 2:1 für max. 90g/h Aufnahme. Maurten Drink Mix oder ähnlich.";
            }
            const totalCarbTraining=Math.round(carbPerH*(dur/60));
            const s=SPORT_GROUPS.find(g=>g.id===id);
            if(carbPerH===0&&intens==="low") return null;
            return (
              <div key={id} style={{padding:"14px 16px",borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:13,fontWeight:500,color:"#0A0A0A"}}>{s?.label||id}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:16,fontWeight:300,color:carbPerH>60?"#4A7000":"#0A0A0A",letterSpacing:"-.02em"}}>{totalCarbTraining}g</div>
                    <div style={{fontSize:10,color:"#AAA"}}>pro Session</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:8}}>
                  {[
                    {l:"Pro Stunde",v:`${carbPerH}g`},
                    {l:"Strategie",v:strategy},
                    {l:"Am besten via",v:method},
                  ].map(({l,v},j)=>(
                    <div key={j} style={{padding:"8px 10px",background:"#FFFFFF",borderRadius:8,border:"1px solid #EBEBEB"}}>
                      <div style={{fontSize:9,color:"#AAA",marginBottom:2,letterSpacing:".03em"}}>{l.toUpperCase()}</div>
                      <div style={{fontSize:11,fontWeight:500,color:"#333"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:10,color:"#AAA",lineHeight:1.5,paddingTop:6,borderTop:"1px solid #F5F5F5"}}>{note}</div>
              </div>
            );
          })}
          <div style={{padding:"10px 16px",background:C.neonDim,border:`1px solid ${C.neon}`,fontSize:10,color:"#4A7000",lineHeight:1.5,fontWeight:500}}>
            💡 Richtwerte nach ACSM & IOC. Bei Rennen oder Wettkämpfen 20–30% mehr einplanen. Verträglichkeit individuell testen.
          </div>
        </div>

        {/* ── WOCHENSUMMARY ── */}
        <div style={{padding:"14px 16px",background:"#FAFAFA",borderRadius:11,border:"1px solid #EBEBEB",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24,textAlign:"center"}}>
          {[
            {l:"Training / Woche",v:`${totalDays}×`,s:`${Math.round(totalMin/60)} Stunden`},
            {l:"Kcal / Woche",v:((calc.withTraining-calc.bmr)*totalDays).toLocaleString("de-CH"),s:"durch Training"},
            {l:"Kcal / Monat",v:((calc.withTraining-calc.bmr)*totalDays*4).toLocaleString("de-CH"),s:"hochgerechnet"},
          ].map(({l,v,s},i)=>(
            <div key={i}>
              <div style={{fontSize:10,color:"#AAA",marginBottom:3}}>{l}</div>
              <div style={{fontSize:16,fontWeight:400,color:"#0A0A0A",letterSpacing:"-.02em"}}>{v}</div>
              <div style={{fontSize:10,color:"#CCC"}}>{s}</div>
            </div>
          ))}
        </div>

        {!isPro&&(
          <div style={{padding:"14px 16px",background:"#FAFAFA",borderRadius:12,border:"1px solid #EBEBEB",display:"flex",alignItems:"center",gap:14}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:500,color:"#0A0A0A",marginBottom:2}}>Präzisere Werte mit PRO</div>
              <div style={{fontSize:11,color:"#888",lineHeight:1.5}}>Natrium, Magnesium, Schweiss, Wasser, VO₂max, exakter Protein- & Kohlenhydratbedarf.</div>
            </div>
            <button onClick={onUpgrade} style={{background:"#0A0A0A",color:"#fff",border:"none",borderRadius:9,padding:"9px 14px",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif",flexShrink:0}}>PRO · CHF 5.90 / Mt.</button>
          </div>
        )}
      </div>
    );
  };

  // ── PRODUKTE TAB ───────────────────────────────────────────────────────────
  const ProduktTab=()=>{
    const [owned]=useState(()=>{ try{ return JSON.parse(localStorage.getItem("treyn_owned")||"[]"); }catch{ return []; } });

    // Build full supplement list from recommended supplements + nutrition products
    const allSupps=[];
    const seen=new Set();
    [...primSupps,...secSupps].forEach(s=>{
      if(!seen.has(s.id)){ seen.add(s.id); allSupps.push(s); }
    });
    // Also pull in nutrition products that are marked as owned
    const SN_DATA=[
      {id:"sn_mau_gel",name:"Maurten Gel 100",dose:"1 Gel alle 30–40 min",when:"Während Training",protocol:{timing:"Während Training · alle 30–40 min"}},
      {id:"sn_mau_320",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Während Training",protocol:{timing:"Während Training · pro Stunde"}},
      {id:"sn_mau_caf_2",name:"Maurten Gel 100 CAF",dose:"1 Gel alle 40–45 min",when:"Während Training",protocol:{timing:"Während Training · bei Rennen"}},
      {id:"sn_mn_gel",name:"MNSTRY Intensity Gel",dose:"1 Gel alle 30–45 min",when:"Während Training",protocol:{timing:"Während Training"}},
      {id:"sn_mn_heat_2",name:"MNSTRY Fast Carb Heat",dose:"1 Portion",when:"Vor Training",protocol:{timing:"30 min vor Training"}},
      {id:"sn_elek_2",name:"Sponser Elektrolyt-Tabs",dose:"1 Tab / 500ml",when:"Während Training",protocol:{timing:"Während Training · zum Wasser"}},
      {id:"sn_sp_gel",name:"Sponser Liquid Energy",dose:"1 Beutel alle 45 min",when:"Während Training",protocol:{timing:"Während Training"}},
    ];
    SN_DATA.forEach(s=>{ if(!seen.has(s.id)){ seen.add(s.id); allSupps.push({...s,tags:["Sportnahrung"]}); } });

    const ownedSupps=allSupps.filter(s=>owned.includes(s.id));

    // Tagesplan: group by timing
    const TIMING_ORDER=[
      {key:"morgens",    label:"Morgens",          icon:"🌅", desc:"Am besten nüchtern oder zum Frühstück"},
      {key:"mittags",    label:"Mittags / Training",icon:"⚡", desc:"Rund ums Training oder zur Mittagsmahlzeit"},
      {key:"abends",     label:"Abends",            icon:"🌙", desc:"Abends, 1–2h vor dem Schlafen"},
      {key:"training",   label:"Während Training",  icon:"🏃", desc:"Direkt während der Einheit"},
      {key:"post",       label:"Nach Training",     icon:"💪", desc:"Innerhalb 30 Min. nach dem Training"},
    ];

    const getTiming=(s)=>{
      const w=(s.protocol?.timing||s.when||"").toLowerCase();
      if(w.includes("während training")||w.includes("während dem sport")) return "training";
      if(w.includes("post")||w.includes("nach dem training")||w.includes("innerhalb 30")) return "post";
      if(w.includes("morgens")||w.includes("nüchtern")||w.includes("früh")) return "morgens";
      if(w.includes("abends")||w.includes("vor schlaf")||w.includes("nacht")) return "abends";
      if(w.includes("vor training")||w.includes("pre")||w.includes("30-45 min vor")) return "mittags";
      return "morgens"; // default
    };

    const byTiming={};
    ownedSupps.forEach(s=>{ const t=getTiming(s); if(!byTiming[t]) byTiming[t]=[]; byTiming[t].push(s); });

    if(ownedSupps.length===0) return (
      <div>
        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Deinen Plan</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:24,lineHeight:1.5}}>Hier siehst du alle Supplements die du besitzt oder bestellt hast — inklusive Tagesplan.</p>
        <div style={{padding:"32px 20px",textAlign:"center",background:"#FAFAFA",borderRadius:14,border:"1px solid #EBEBEB"}}>
          <div style={{fontSize:32,marginBottom:12}}>📦</div>
          <div style={{fontSize:14,fontWeight:500,color:C.black,marginBottom:6}}>Noch keine Produkte erfasst</div>
          <div style={{fontSize:12,color:"#AAA",lineHeight:1.6}}>Gehe zu Supplements und markiere Produkte mit "Ich habe das Produkt bereits" — sie erscheinen dann automatisch hier mit Einnahme-Tagesplan.</div>
        </div>
      </div>
    );

    const LEVELS=[
      {min:0,  max:2,  label:"Beginner",     color:"#AAA",     next:"Fortgeschritten"},
      {min:3,  max:5,  label:"Fortgeschritten",color:"#4A7000", next:"Pro"},
      {min:6,  max:9,  label:"Pro",           color:"#0066CC", next:"Elite"},
      {min:10, max:99, label:"Elite",          color:C.black,   next:null},
    ];
    const score=ownedSupps.length;
    const level=LEVELS.slice().reverse().find(l=>score>=l.min)||LEVELS[0];
    const nextLevel=LEVELS.find(l=>l.min>score);
    const progress=nextLevel?Math.round(((score-level.min)/(nextLevel.min-level.min))*100):100;
    const primOwned=ownedSupps.filter(s=>primSupps.some(p=>p.id===s.id)).length;

    return (
      <div>
        {/* TREYN Score Hero — kompakt */}
        <div style={{borderRadius:12,border:`1px solid ${C.neon}`,background:C.neonDim,padding:"14px 18px",marginBottom:24}}>
          {/* Top row: score + level */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"baseline",gap:6}}>
              <div style={{fontSize:36,fontWeight:300,color:"#0A0A0A",letterSpacing:"-.05em",lineHeight:1}}>{score}</div>
              <div style={{fontSize:12,color:"#4A7000",fontWeight:500}}>TREYN Score</div>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:level.color,letterSpacing:"-.01em"}}>{level.label}</div>
          </div>
          {/* Progress bar */}
          <div style={{height:4,background:"rgba(0,0,0,.1)",borderRadius:2,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",width:`${progress}%`,background:"#4A7000",borderRadius:2,transition:"width .6s ease"}}/>
          </div>
          {/* Bottom row: stats */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:10,color:"#4A7000"}}>{nextLevel?`Noch ${nextLevel.min-score} bis ${nextLevel.next}`:"Maximum erreicht 🏆"}</div>
            <div style={{display:"flex",gap:14}}>
              {[
                {l:"Erfasst",v:score},
                {l:"Pflicht",v:`${primOwned}/${primSupps.length}`},
                {l:"Komplett",v:`${primSupps.length>0?Math.round((primOwned/primSupps.length)*100):0}%`},
              ].map(({l,v},i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#0A0A0A"}}>{v}</div>
                  <div style={{fontSize:9,color:"#4A7000",letterSpacing:".02em"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Deinen Plan</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.5}}>{score} Produkt{score!==1?"e":""} · automatisch aus deinen Markierungen</p>

        {/* Tagesplan */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>Dein Tagesplan</div>
        <div style={{borderRadius:14,border:"1px solid #EBEBEB",overflow:"hidden",marginBottom:28,background:"#fff"}}>
          {TIMING_ORDER.filter(t=>byTiming[t.key]?.length>0).map((timing,i,arr)=>(
            <div key={timing.key} style={{borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none"}}>
              {/* Time header */}
              <div style={{padding:"10px 16px 8px",background:"#FAFAFA",borderBottom:"1px solid #F5F5F5",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>{timing.icon}</span>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#0A0A0A"}}>{timing.label}</div>
                  <div style={{fontSize:10,color:"#AAA"}}>{timing.desc}</div>
                </div>
              </div>
              {/* Products in this slot */}
              {byTiming[timing.key].map((s,j)=>(
                <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:j<byTiming[timing.key].length-1?"1px solid #F8F8F8":"none"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:C.neon,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:"#0A0A0A"}}>{s.name}</div>
                    <div style={{fontSize:11,color:"#AAA"}}>{s.dose}</div>
                  </div>
                  <div style={{fontSize:10,color:"#888",textAlign:"right",maxWidth:100,lineHeight:1.4}}>
                    {(s.protocol?.timing||s.when||"").split("(")[0].trim()}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Alle Produkte */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>Alle Produkte ({ownedSupps.length})</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {ownedSupps.map((s,i)=>(
            <div key={s.id} style={{background:"#fff",borderRadius:11,border:"1px solid #EBEBEB",padding:"12px 14px",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#0A0A0A",marginBottom:2,lineHeight:1.3}}>{s.name}</div>
              <div style={{fontSize:10,color:"#AAA",fontFamily:"JetBrains Mono,monospace",marginBottom:6}}>{s.dose}</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.neon,flexShrink:0}}/>
                <div style={{fontSize:10,color:"#888"}}>{getTiming(s)==="morgens"?"🌅":getTiming(s)==="abends"?"🌙":getTiming(s)==="training"?"🏃":getTiming(s)==="post"?"💪":"⚡"} {TIMING_ORDER.find(t=>t.key===getTiming(s))?.label}</div>
              </div>
              {s.tags&&<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:6}}>{s.tags.slice(0,2).map(t=><span key={t} style={{fontSize:8,padding:"1px 5px",borderRadius:6,background:"#F5F5F5",color:"#888",fontFamily:"JetBrains Mono,monospace"}}>{t}</span>)}</div>}
            </div>
          ))}
        </div>

        <div style={{marginTop:16,padding:"10px 14px",background:"#FAFAFA",borderRadius:10,border:"1px solid #EBEBEB",fontSize:11,color:"#AAA",lineHeight:1.6}}>
          Produkte als vorhanden markieren: Gehe zu Supplements → klicke "Ich habe das Produkt bereits". Neue Bestellungen werden nach Anbindung von Supabase automatisch erkannt.
        </div>
      </div>
    );
  };

  // ── KONTAKT TAB ────────────────────────────────────────────────────────────
  const KontaktTab=()=>(
    <div>
      <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Kontakt & Impressum</h2>
      <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.5}}>Fragen, Feedback oder rechtliche Informationen.</p>

      {/* Kontakt */}
      <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
        <div style={{background:C.g100,padding:"12px 16px",borderBottom:`1px solid ${C.g200}`}}>
          <span style={{fontSize:11,fontWeight:600,color:C.black}}>Kontakt</span>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{fontSize:12,color:"#333",lineHeight:1.9,marginBottom:12}}>
            <div style={{fontWeight:700,color:C.black,fontSize:13,marginBottom:4}}>WBCS GmbH</div>
            <div>Berufsschulstrasse 18</div>
            <div>8866 Ziegelbrücke, Schweiz</div>
            <div style={{marginTop:6,color:C.g600}}>Inhaber: Kevin Oberholzer</div>
          </div>
          <a href="mailto:info@treyn.ch"
            style={{display:"inline-flex",alignItems:"center",gap:6,background:C.neon,color:"#000",padding:"8px 16px",borderRadius:9,fontSize:11,fontWeight:700,textDecoration:"none"}}>
            ✉ info@treyn.ch
          </a>
        </div>
      </div>

      {/* Datenschutz */}
      <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
        <div style={{background:C.g100,padding:"12px 16px",borderBottom:`1px solid ${C.g200}`}}>
          <span style={{fontSize:11,fontWeight:600,color:C.black}}>Datenschutz</span>
        </div>
        <div style={{padding:"16px",fontSize:11,color:C.g600,lineHeight:1.8}}>
          TREYN+ erhebt ausschliesslich die Daten, die du bei der Registrierung und Nutzung angibst (Sport, Körperdaten, Ernährungspräferenzen). Diese Daten werden verschlüsselt gespeichert und nicht an Dritte weitergegeben.
          <br/><br/>
          Affiliate-Links zu Partnershops (iHerb, Maurten etc.) werden beim Klick mit einem Tracking-Parameter versehen — dies ist für die Provisionszuordnung notwendig. Es werden keine Cookies ohne deine Zustimmung gesetzt.
          <br/><br/>
          Du hast jederzeit das Recht auf Auskunft, Berichtigung oder Löschung deiner Daten. Anfragen an: <span style={{color:C.black,fontWeight:600}}>info@treyn.ch</span>
        </div>
      </div>

      {/* Nutzungsbedingungen */}
      <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
        <div style={{background:C.g100,padding:"12px 16px",borderBottom:`1px solid ${C.g200}`}}>
          <span style={{fontSize:11,fontWeight:600,color:C.black}}>Nutzungsbedingungen</span>
        </div>
        <div style={{padding:"16px",fontSize:11,color:C.g600,lineHeight:1.8}}>
          TREYN+ ist eine digitale Ernährungs- und Supplement-Empfehlungsplattform. Alle Empfehlungen basieren auf allgemeinen Ernährungsrichtlinien und ersetzen keine medizinische Beratung. Die Nutzung erfolgt auf eigene Verantwortung.
          <br/><br/>
          WBCS GmbH übernimmt keine Haftung für Schäden, die durch die Anwendung der Empfehlungen entstehen. Mit der Nutzung der Plattform stimmst du diesen Bedingungen zu. Änderungen werden per E-Mail kommuniziert.
        </div>
      </div>

      {/* Impressum */}
      <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{background:C.g100,padding:"12px 16px",borderBottom:`1px solid ${C.g200}`}}>
          <span style={{fontSize:11,fontWeight:600,color:C.black}}>Impressum</span>
        </div>
        <div style={{padding:"16px"}}>
          {[
            {l:"Betreiber",v:"WBCS GmbH"},
            {l:"Adresse",v:"Berufsschulstrasse 18, 8866 Ziegelbrücke"},
            {l:"Inhaber",v:"Kevin Oberholzer"},
            {l:"E-Mail",v:"info@treyn.ch"},
            {l:"Rechtsform",v:"GmbH, Handelsregister Kanton Glarus"},
            {l:"Affiliate-Hinweis",v:"Diese Plattform enthält Affiliate-Links. Bei Käufen über diese Links erhalten wir eine Provision — für dich entstehen keine Mehrkosten."},
          ].map((r,i,arr)=>(
            <div key={r.l} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.g100}`:"none"}}>
              <span style={{fontSize:11,color:"#AAA",minWidth:110,flexShrink:0}}>{r.l}</span>
              <span style={{fontSize:11,color:C.black,lineHeight:1.5}}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── PROFIL TAB ─────────────────────────────────────────────────────────────
  const ProfilTab=()=>{
    const [orders]=useState(()=>{ try{ return parseInt(localStorage.getItem("treyn_orders")||"0"); }catch{ return 0; } });
    const [showPersonal,setShowPersonal]=useState(false);

    const TIERS=[
      {min:0,  max:9,   id:"none",     label:null,       badge:"◈", color:C.g400},
      {min:10, max:19,  id:"silver",   label:"SILVER",   badge:"◈", color:"#8A9BA8"},
      {min:20, max:49,  id:"gold",     label:"GOLD",     badge:"◈", color:"#B8922A"},
      {min:50, max:99,  id:"platinum", label:"PLATINUM", badge:"◈", color:"#6B7FA3"},
      {min:100,max:9999,id:"black",    label:"BLACK",    badge:"◈", color:C.black},
    ];
    const currentTier=TIERS.slice().reverse().find(t=>orders>=t.min)||TIERS[0];
    const nextTier=TIERS.find(t=>t.min>orders);
    const hasStatus=currentTier.id!=="none";
    const progress=nextTier?((orders-(currentTier?.min||0))/(nextTier.min-(currentTier?.min||0)))*100:100;

    return (
      <div>
        {/* Loyalty Card — kompakt */}
        <div style={{borderRadius:12,border:`1.5px solid ${currentTier.id==="black"?C.black:C.g200}`,overflow:"hidden",marginBottom:12}}>
          <div style={{background:currentTier.id==="black"?C.black:C.g100,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".08em",marginBottom:2}}>TREYN LOYALTY</div>
              <div style={{fontSize:18,fontWeight:800,color:currentTier.id==="black"?C.white:C.black,letterSpacing:".04em"}}>{hasStatus?currentTier.label:"Kein Status"}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:24,fontWeight:800,color:currentTier.id==="black"?C.white:C.black,letterSpacing:"-.04em",lineHeight:1}}>{orders}</div>
              <div style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace"}}>BESTELLUNGEN</div>
            </div>
          </div>
          {nextTier&&(
            <div style={{padding:"10px 16px",background:C.white}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:10,color:C.g600}}>Nächste Stufe: <strong style={{color:C.black}}>{nextTier.label}</strong></span>
                <span style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace"}}>{orders}/{nextTier.min}</span>
              </div>
              <div style={{height:4,background:C.g100,borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(Math.max(progress,0),100)}%`,background:C.neon,borderRadius:2,transition:"width .6s ease"}}/>
              </div>
            </div>
          )}
        </div>

        {/* Tier overview — 2 Karten nebeneinander */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {TIERS.filter(t=>t.id!=="none").map((t,i)=>(
            <div key={i} style={{borderRadius:10,border:`1.5px solid ${t.id===currentTier.id?C.neon:"#EBEBEB"}`,background:t.id===currentTier.id?C.neonDim:"#fff",padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18,color:t.color,lineHeight:1}}>◈</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:"#0A0A0A",letterSpacing:".03em"}}>{t.label}</div>
                <div style={{fontSize:9,color:"#AAA"}}>ab {t.min} Best.</div>
              </div>
              {t.id===currentTier.id&&<span style={{fontSize:8,padding:"2px 5px",borderRadius:4,background:C.black,color:C.neon,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>AKTIV</span>}
              {orders<t.min&&<span style={{fontSize:9,color:"#CCC",fontFamily:"JetBrains Mono,monospace"}}>–{t.min-orders}</span>}
            </div>
          ))}
        </div>

        {/* Persönliche Daten — ausklappbar */}
        <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
          <button onClick={()=>setShowPersonal(p=>!p)}
            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:C.g100,border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            <span style={{fontSize:11,fontWeight:600,color:C.black}}>Persönliche Daten</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round">
              <path d={showPersonal?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/>
            </svg>
          </button>
          {showPersonal&&(
            <div>
              {[
                {l:"Name",v:`${profilData?.firstname||""} ${profilData?.lastname||""}`.trim()||"—"},
                {l:"E-Mail",v:profilData?.email||"—"},
                {l:"Herkunft",v:profilData?.country||"—"},
                {l:"Geschlecht",v:{m:"Männlich",f:"Weiblich"}[profilData?.gender]||"—"},
                {l:"Grösse",v:profilData?.height?`${profilData.height} cm`:"—"},
                {l:"Gewicht",v:profilData?.weight?`${profilData.weight} kg`:"—"},
              ].map((r,i,arr)=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 16px",borderBottom:i<arr.length-1?`1px solid ${C.g100}`:"none"}}>
                  <span style={{fontSize:12,color:C.g600}}>{r.l}</span>
                  <span style={{fontSize:12,fontWeight:500,color:C.black}}>{r.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal disclaimer */}
        <div style={{marginBottom:12,padding:"12px 14px",background:C.g100,borderRadius:10,border:`1px solid ${C.g200}`}}>
          <div style={{fontSize:10,fontWeight:600,color:C.g600,marginBottom:4,letterSpacing:".03em",textTransform:"uppercase"}}>Haftungsausschluss</div>
          <div style={{fontSize:10,color:C.g400,lineHeight:1.7}}>
            TREYN+ liefert Ernährungsempfehlungen auf Basis deiner Angaben — kein Ersatz für medizinische Beratung. Prüfe Inhaltsstoffe, Allergene und Wechselwirkungen immer direkt beim Hersteller. Bei Erkrankungen oder Medikamenten: Arzt konsultieren.
          </div>
        </div>

        {/* Abo verwalten */}
        <div style={{border:`1.5px solid ${isPro?C.neon:C.g200}`,borderRadius:12,padding:"16px 18px",background:isPro?C.neonDim:"#fff",marginBottom:8}}>
          <div style={{fontSize:10,color:"#AAA",fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:6}}>DEIN ABO</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isPro?0:12}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.black,marginBottom:2}}>{isPro?"TREYN+ PRO":"TREYN+ Basic"}</div>
              <div style={{fontSize:11,color:C.g600}}>{isPro?"6 Monate · Aktiv":"Pauschalberechnungen · CHF 6.90 / 6 Mt."}</div>
            </div>
            <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:isPro?C.black:"#F0F0F0",color:isPro?C.neon:"#888",fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>{isPro?"PRO":"BASIC"}</span>
          </div>
          {!isPro&&(
            <button onClick={onUpgrade}
              style={{width:"100%",background:C.black,color:C.neon,border:"none",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
              Upgrade auf PRO — CHF 9.90 / 6 Monate
            </button>
          )}
        </div>

        {/* Abo kündigen / löschen */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          <button style={{background:"transparent",color:C.g600,border:`1px solid ${C.g200}`,borderRadius:9,padding:"9px",fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            Abo kündigen
          </button>
          <button onClick={onReset}
            style={{background:"transparent",color:"#E53E3E",border:"1px solid rgba(229,62,62,.25)",borderRadius:9,padding:"9px",fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            Konto löschen
          </button>
        </div>

      </div>
    );
  };

  // ── BLUTTEST TAB ───────────────────────────────────────────────────────────
  const BluttestTab=()=>{
    const [blutPurchased,setBlutPurchased]=useState(false);
    const [loadBlut,setLoadBlut]=useState(false);
    const [analysePurchased,setAnalysePurchased]=useState(()=>{
      try{
        if(window.location.search.includes("analyse=success")){ localStorage.setItem("treyn_analyse_purchased","1"); return true; }
        return localStorage.getItem("treyn_analyse_purchased")==="1";
      }catch{ return false; }
    });

    const buyBluttest=()=>{
      window.open("https://www.cerascreen.ch/products/kombi-paket-sportliche-leistungsfaehigkeit","_blank");
    };

    return (
      <div>
        {/* How it works */}
        <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
          <div style={{background:C.neon,padding:"12px 16px"}}>
            <span style={{fontSize:12,fontWeight:600,color:C.black}}>So funktioniert die Bluttest-Kopplung</span>
          </div>
          <div style={{padding:"16px",background:C.white}}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {n:"1",t:"Bluttest bestellen",d:"Wir vermitteln dir einen At-Home Bluttest via cerascreen® — dem führenden Bluttest-Anbieter in 19 europäischen Ländern. Fingerprick-Methode, du schickst die Probe per Post ein."},
                {n:"2",t:"Ergebnis erhalten",d:"cerascreen® wertet deine Probe im zertifizierten Fachlabor aus. Das Ergebnis erhältst du als PDF innerhalb von 2–3 Werktagen per E-Mail."},
                {n:"3",t:"PDF hier hochladen",d:"Hast du dein Ergebnis? Lade das PDF direkt hier hoch. TREYN AI liest alle Laborwerte automatisch aus — Vitamin D, Eisen, Magnesium, Omega-3 und mehr. Keine manuelle Eingabe nötig."},
                {n:"4",t:"Werte werden überschrieben — höchste Genauigkeit",d:"Deine bisherigen Schätzwerte werden durch die echten Laborwerte ersetzt. Supplement-Empfehlungen, Priorisierungen und Dosierungen passen sich sofort an. Dies ist die höchste Genauigkeit die TREYN+ bieten kann."},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:C.neon,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,fontWeight:800,color:C.black}}>{s.n}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:C.black,marginBottom:2}}>{s.t}</div>
                    <div style={{fontSize:11,color:C.g600,lineHeight:1.55}}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* cerascreen Partnership */}
        <div style={{border:`1.5px solid ${C.neonBorder}`,borderRadius:12,overflow:"hidden",marginBottom:16,background:C.neonDim}}>
          <div style={{padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:C.black,marginBottom:2}}>In Partnerschaft mit cerascreen®</div>
                <div style={{fontSize:11,color:C.g600}}>19 EU-Länder · CH, DE, AT · Zertifiziertes Fachlabor · 250'000+ Tests/Jahr</div>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
              {["Vitamin D","Eisen & Ferritin","Magnesium","Omega-3","Vitamin B12","Zink","Testosteron","Cortisol"].map(t=>(
                <span key={t} className="chip" style={{fontSize:9}}>{t}</span>
              ))}
            </div>
            {blutPurchased?(
              <div style={{padding:"10px 12px",background:C.white,borderRadius:9,border:`1px solid ${C.neonBorder}`,fontSize:12,color:C.g800,marginBottom:10}}>
                ✓ Bluttest bestellt — du erhältst dein Kit per Post. Nach Eingang des Ergebnisses (2–3 Werktage) das PDF unten hochladen.
              </div>
            ):(
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:C.black,letterSpacing:"-.02em"}}>ab CHF 60.– <span style={{fontSize:10,fontWeight:400,color:C.g600}}>· bei cerascreen®</span></div>
                    <div style={{fontSize:10,color:C.g600}}>Sportler-Paket: Vitamin D, B12, Omega-3, Testosteron</div>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    {["Kreditkarte","TWINT","Apple Pay"].map(m=>(
                      <span key={m} style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:"rgba(0,0,0,.08)",color:C.black,fontFamily:"JetBrains Mono,monospace"}}>{m}</span>
                    ))}
                  </div>
                </div>
                <button onClick={buyBluttest} disabled={loadBlut}
                  style={{width:"100%",background:loadBlut?C.g200:C.neon,color:loadBlut?C.g400:C.black,border:"none",borderRadius:10,padding:"12px",fontSize:13,fontWeight:700,cursor:loadBlut?"default":"pointer",fontFamily:"Inter,sans-serif",transition:"all .15s"}}>
                  {loadBlut?"Weiterleitung...":"Bluttest bei cerascreen® bestellen ↗"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PDF Upload — kostenlos, für alle */}
        <div style={{marginBottom:4}}>
          <div style={{fontSize:12,fontWeight:500,color:"#666",marginBottom:10}}>Ergebnisse hochladen & automatisch einpflegen</div>
          <div style={{padding:"10px 14px",background:"#FAFAFA",borderRadius:10,border:"1px solid #EBEBEB",marginBottom:10}}>
            <div style={{fontSize:11,color:"#888",lineHeight:1.5,marginBottom:8}}>TREYN AI liest dein PDF automatisch aus — alle Laborwerte werden direkt in dein Profil eingespeist und deine Supplement-Empfehlungen passen sich sofort an.</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {["Vitamin D","Eisen & Ferritin","Magnesium","Omega-3","Vitamin B12","Zink","Testosteron","Cortisol"].map(t=>(
                <span key={t} style={{fontSize:9,padding:"2px 7px",borderRadius:10,background:"#F0F0F0",color:"#666",fontFamily:"JetBrains Mono,monospace"}}>{t}</span>
              ))}
            </div>
          </div>
          <BluttestUpload isPro={true}/>
        </div>
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:"#FAFAFA",fontFamily:"Inter,sans-serif"}}>
      {/* Top bar */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.g200}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <Logo/>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {fname&&<span style={{fontSize:13,color:C.g600}}>Hallo, {fname}</span>}
          {isPro&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:C.neon,color:C.black,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>PRO</span>}
        </div>
      </div>

      <div style={{display:"flex",maxWidth:1100,margin:"0 auto",padding:"0 16px"}}>

        {/* ── LEFT NAV ─────────────────────────────────────────────────────── */}
        <div style={{width:220,flexShrink:0,padding:"24px 12px 24px 0"}}>
          <div style={{position:"sticky",top:64,display:"flex",flexDirection:"column",gap:2,minHeight:"calc(100vh - 88px)"}}>
            <div style={{fontSize:10,fontWeight:700,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",padding:"0 14px",marginBottom:8}}>MEIN PROFIL</div>
            {NAV.map(item=><NavItem key={item.id} item={item}/>)}
            <div style={{flex:1}}/>
            <div style={{padding:"12px 14px",borderRadius:10,background:C.g100,marginTop:8}}>
              <div style={{fontSize:10,color:C.g400,marginBottom:4,fontFamily:"JetBrains Mono,monospace"}}>{sportLabel} · {intensityLabel}</div>
              <div style={{fontSize:12,fontWeight:600,color:C.black}}>{kcal.withTraining.toLocaleString("de-CH")} kcal</div>
              <div style={{fontSize:10,color:C.g400}}>Trainingstag Ø</div>
            </div>
            <div style={{paddingTop:8,borderTop:`1px solid ${C.g200}`,marginTop:8,display:"flex",flexDirection:"column",gap:2}}>
              <NavItem item={PROFIL_NAV}/>
              <NavItem item={KONTAKT_NAV}/>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <div style={{flex:1,minWidth:0,padding:"24px 0 80px 24px",borderLeft:`1px solid ${C.g200}`}}>
          {tab==="supplements"&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:700,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Supplements</h2>
              <p style={{fontSize:13,color:C.g600,marginBottom:12}}>{isPro?"Sport-spezifisch priorisiert nach deinen Berechnungen.":"Empfohlen für deinen Sport und deine Intensität."}</p>

              {/* AI Disclaimer */}
              <div style={{marginBottom:12,padding:"10px 14px",background:C.g100,borderRadius:10,border:`1px solid ${C.g200}`,display:"flex",gap:10,alignItems:"flex-start"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div style={{fontSize:11,color:C.g600,lineHeight:1.6}}>
                  Ernährungsempfehlungen von TREYN AI — keine medizinische Beratung. Inhaltsstoffe & Wechselwirkungen immer beim Hersteller prüfen. Bei Erkrankungen oder Medikamenten: Arzt konsultieren.
                </div>
              </div>


              {/* Philosophy banner */}
              <div style={{marginBottom:20,padding:"12px 14px",background:C.g100,borderRadius:11,border:`1px solid ${C.g200}`,display:"flex",gap:10,alignItems:"flex-start"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div>
                  <div style={{fontSize:11,color:C.g600,lineHeight:1.6}}>Wir arbeiten mit ausgewählten Partnershops & Brands zusammen — empfehlen aber alle verfügbaren Supplements & Sportnahrung für deine bestmögliche Performance, unabhängig ob ein Produkt bei uns gelistet ist oder extern verlinkt wird.</div>
                </div>
              </div>
              {primSupps.length>0&&<>
                <SectionHeader label="Zwingend empfohlen" count={`${primSupps.length} Produkte`} color={C.neon}/>
                <div style={{marginBottom:12,padding:"10px 14px",background:C.neonDim,borderRadius:10,border:`1px solid ${C.neonBorder}`,fontSize:12,color:C.g800}}>
                  {isPro?"Priorisiert auf Basis sport-spezifischer Berechnungen.":"Empfohlen für deinen Sport und deine Intensität."}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{(()=>{const allIds=[...primSupps,...secSupps].map(s=>s.id);return primSupps.map((s,i)=><ProductCard key={s.id} s={s} index={i} isPrimary={true} interactions={getSupplementInteractions(s.id,allIds.filter(id=>id!==s.id))} allergenWarnings={checkAllergens(s.id,s.name,allergenData)}/>);})()}</div>
              </>}
              {secSupps.length>0&&<>
                <div style={{marginTop:24,marginBottom:12}}>
                  <SectionHeader label="Sinnvoll, aber optional" count={`${secSupps.length} Produkte`} color={C.g400}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{(()=>{const allIds=[...primSupps,...secSupps].map(s=>s.id);return secSupps.map((s,i)=><ProductCard key={s.id} s={s} index={i} isPrimary={false} interactions={getSupplementInteractions(s.id,allIds.filter(id=>id!==s.id))} allergenWarnings={checkAllergens(s.id,s.name,allergenData)}/>);})()}</div>
              </>}
              <div style={{marginTop:20,padding:"12px 14px",background:C.g100,borderRadius:11,fontSize:11,color:C.g600,lineHeight:1.6}}>
                <strong style={{color:C.g800}}>Hinweis:</strong> Alle Empfehlungen sind Schätzwerte. Eisen nur nach ärztlichem Bluttest supplementieren.
              </div>
              <div style={{marginTop:20}}><AiChat context={aiCtx} isPro={isPro}/></div>
            </div>
          )}
          {tab==="verbrauch"&&<VerbrauchTab/>}
          {tab==="nutrition"&&<NutritionTab/>}
          {tab==="fertiggerichte"&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Fertiggerichte</h2>
              <p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.6}}>Ideal für Sportler die nicht gerne kochen — aber trotzdem optimal versorgt sein wollen.</p>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {
                    name:"Löwenanteil",
                    badge:"Bio · High Protein",
                    img:"https://www.loewenanteil.com/cdn/shop/files/LÖW_Produktfoto_Rindfleisch-Eintopf.jpg",
                    products:[{l:"Protein",v:"30–42g"},{l:"Zubereitung",v:"3 Min."},{l:"Preis",v:"ab CHF 7.90"}],
                    tags:["Bio","High Protein","Kein Kühlschrank"],
                    link:"https://www.loewenanteil.com?ref=TREYN",
                  },
                  {
                    name:"Huel",
                    badge:"Vollwertige Mahlzeit · 26 Vitamine",
                    img:"https://huel.com/cdn/shop/files/Huel-Black-Edition-Chocolate-Lifestyle.jpg",
                    products:[{l:"Protein",v:"20–40g"},{l:"Zubereitung",v:"2 Min."},{l:"Preis",v:"ab CHF 2.50"}],
                    tags:["Vollwertig","Vegan","26 Vitamine"],
                    link:"https://huel.com/ch?ref=TREYN",
                  },
                  {
                    name:"Foodspring",
                    badge:"Sport Nutrition · CH/DE/AT",
                    img:"https://www.foodspring.ch/cdn/shop/products/protein-porridge.jpg",
                    products:[{l:"Protein",v:"20–35g"},{l:"Zubereitung",v:"3–5 Min."},{l:"Preis",v:"ab CHF 4.90"}],
                    tags:["Sport","Bio","CH/DE/AT"],
                    link:"https://www.foodspring.ch?ref=TREYN",
                  },
                  {
                    name:"Saturo",
                    badge:"Liquid Meal · Sofort trinkfertig",
                    img:"https://saturo.com/cdn/shop/products/saturo-drink-original.jpg",
                    products:[{l:"Protein",v:"20g"},{l:"Zubereitung",v:"0 Min."},{l:"Preis",v:"ab CHF 3.50"}],
                    tags:["Sofort","Vegan","EU-weit"],
                    link:"https://saturo.com/de?ref=TREYN",
                  },
                ].map((b,i)=>(
                  <div key={i} style={{borderRadius:12,border:"1px solid #EBEBEB",background:"#fff",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,.04)",display:"flex",flexDirection:"column"}}>
                    {/* Product image */}
                    <div style={{background:"#F8F8F8",height:120,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                      <img src={b.img} alt={b.name}
                        style={{width:"100%",height:"100%",objectFit:"cover"}}
                        onError={e=>{e.target.style.display="none";e.target.parentNode.style.background="#F0F0F0";}}/>
                    </div>
                    <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#0A0A0A",marginBottom:2}}>{b.name}</div>
                      <div style={{fontSize:9,color:"#AAA",fontFamily:"JetBrains Mono,monospace",marginBottom:8}}>{b.badge}</div>
                      {/* Stats */}
                      <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:8}}>
                        {b.products.map(p=>(
                          <div key={p.l} style={{display:"flex",justifyContent:"space-between",background:"#F8F8F8",borderRadius:6,padding:"3px 8px"}}>
                            <span style={{fontSize:10,color:"#888"}}>{p.l}</span>
                            <span style={{fontSize:10,fontWeight:600,color:"#0A0A0A"}}>{p.v}</span>
                          </div>
                        ))}
                      </div>
                      {/* Tags */}
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10,flex:1}}>
                        {b.tags.map(t=><span key={t} style={{fontSize:9,padding:"2px 6px",borderRadius:7,background:"#F0F0F0",color:"#666",fontFamily:"JetBrains Mono,monospace"}}>{t}</span>)}
                      </div>
                      <a href={b.link} target="_blank" rel="noopener noreferrer"
                        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:C.neon,color:"#000",padding:"8px",borderRadius:8,fontSize:10,fontWeight:700,textDecoration:"none"}}>
                        Entdecken ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{marginTop:12,padding:"10px 14px",background:C.g100,borderRadius:10,border:`1px solid ${C.g200}`,fontSize:11,color:C.g400,lineHeight:1.6}}>
                Wir arbeiten mit ausgewählten Partnershops zusammen — empfehlen aber alle verfügbaren Fertiggerichte für deine bestmögliche Performance.
              </div>
            </div>
          )}
          {tab==="recovery"&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Recovery Gear</h2>
              <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.5}}>Professionelle Recovery-Technologie — empfohlen nach intensiven Trainings.</p>

              {/* Brand overview */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                {[
                  {
                    name:"Therabody",
                    badge:"Massage Guns · Boots",
                    img:"https://cdn.shopify.com/s/files/1/0624/4657/products/TBY-PRO5-BLK_1.png",
                    imgFallback:"https://images.ctfassets.net/e4jnsuoywi72/6YVrOqAB8TJlKGiP2h3dFI/d6b3e8c7e1e8f6d9e9e9e9e9/theragun-pro.png",
                    desc:"Weltmarktführer in Perkussionstherapie. Genutzt von Profiteams in NBA, NFL und Tour de France.",
                    products:[{n:"Theragun PRO Plus",p:"CHF 599"},{n:"Theragun Mini",p:"CHF 199"},{n:"JetBoots PRO",p:"CHF 1'149"}],
                    link:"https://www.therabody.com/de-ch",
                  },
                  {
                    name:"Hyperice / Normatec",
                    badge:"Massage Guns · Boots",
                    img:"https://hyperice.com/cdn/shop/products/Normatec3Leg_Lifestyle_ProductPage_1.jpg",
                    imgFallback:null,
                    desc:"Gold Standard für Kompressionsboots — Ironman, NBA und Tour de France. Hypervolt als günstige Alternative.",
                    products:[{n:"Hypervolt 2",p:"CHF 229"},{n:"Normatec 3 Legs",p:"CHF 899"},{n:"Normatec Elite",p:"CHF 1'099"}],
                    link:"https://hyperice.com/",
                  },
                  {
                    name:"Blackroll",
                    badge:"Faszienrollen · Selbstmassage",
                    img:"https://www.blackroll.com/cdn/shop/products/blackroll-standard-rolle-schwarz_1.jpg",
                    imgFallback:null,
                    desc:"Schweizer Marktführer für Faszientherapie. Einsteigerfreundlich — ideal für tägliche Selbstmassage.",
                    products:[{n:"Standard Rolle",p:"CHF 35"},{n:"Massage Gun",p:"CHF 149"},{n:"Ball",p:"CHF 15"}],
                    link:"https://www.blackroll.com/ch-de",
                  },
                  {
                    name:"Compex",
                    badge:"EMS Muskelstimulation",
                    img:"https://www.compex.com/medias/sys_master/root/h2e/hef/8796266717214/compex-sp-8-0-wireless.jpg",
                    imgFallback:null,
                    desc:"Pionier in Elektrostimulation — genutzt von Physios und Profiathleten. Aktive Recovery und Muskelaufbau.",
                    products:[{n:"Edge 3.0",p:"CHF 199"},{n:"Performance 3.0",p:"CHF 249"},{n:"Sport Elite 3.0",p:"CHF 349"}],
                    link:"https://www.compex.com/ch-de",
                  },
                ].map((b,i)=>(
                  <div key={i} style={{borderRadius:12,border:"1px solid #EBEBEB",background:"#fff",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,.04)",display:"flex",flexDirection:"column"}}>
                    {/* Product image */}
                    <div style={{background:"#F8F8F8",height:130,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                      <img src={b.img} alt={b.name}
                        style={{width:"100%",height:"100%",objectFit:"cover"}}
                        onError={e=>{e.target.style.display="none";e.target.parentNode.style.background="#F0F0F0";}}/>
                    </div>
                    {/* Content */}
                    <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#0A0A0A",marginBottom:2}}>{b.name}</div>
                      <div style={{fontSize:9,color:"#AAA",fontFamily:"JetBrains Mono,monospace",marginBottom:6}}>{b.badge}</div>
                      <div style={{fontSize:11,color:"#555",lineHeight:1.5,marginBottom:10,flex:1}}>{b.desc}</div>
                      {/* Product chips */}
                      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
                        {b.products.map(p=>(
                          <div key={p.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#F8F8F8",borderRadius:7,padding:"4px 8px"}}>
                            <span style={{fontSize:10,color:"#555"}}>{p.n}</span>
                            <span style={{fontSize:10,fontWeight:600,color:"#0A0A0A"}}>{p.p}</span>
                          </div>
                        ))}
                      </div>
                      <a href={b.link} target="_blank" rel="noopener noreferrer"
                        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:C.neon,color:"#000",padding:"8px",borderRadius:8,fontSize:10,fontWeight:700,textDecoration:"none"}}>
                        Entdecken ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
          {tab==="bluttest"&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:700,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Bluttest</h2>
              <p style={{fontSize:13,color:C.g600,marginBottom:20}}>Echte Laborwerte direkt in deine Berechnungen importieren.</p>
              <BluttestTab/>
            </div>
          )}
          {tab==="produkte"&&<ProduktTab/>}
          {tab==="kontakt"&&<KontaktTab/>}
          {tab==="profil"&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:700,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Profil & Zahlung</h2>
              <p style={{fontSize:13,color:C.g600,marginBottom:20}}>Deine persönlichen Daten und Abo-Übersicht.</p>
              <ProfilTab/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function App() {
  const [phase,setPhase]=useState("intro");
  const [sportData,setSportData]=useState(null);
  const [trainingData,setTrainingData]=useState(null);
  const [profilData,setProfilData]=useState(null);
  const [allergenData,setAllergenData]=useState(null);
  const [tier,setTier]=useState("basic");
  const reset=()=>{setSportData(null);setTrainingData(null);setProfilData(null);setAllergenData(null);setTier("basic");setPhase("intro");};

  React.useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.get("pro")==="success"){
      window.history.replaceState({},"",window.location.pathname);
      try{
        const saved=sessionStorage.getItem("treyn_pre_payment");
        if(saved){
          const {sd,td,pd,ad}=JSON.parse(saved);
          setSportData(sd); setTrainingData(td); setProfilData(pd); if(ad)setAllergenData(ad);
          setTier("pro"); setPhase("results");
          sessionStorage.removeItem("treyn_pre_payment");
          return;
        }
      }catch{}
      setTier("pro"); setPhase("results");
    }
  },[]);

  const openStripePayment=(sd,td,pd,ad)=>{
    const STRIPE_LINK="https://buy.stripe.com/DEIN_PAYMENT_LINK_BASIC_390";
    const isPlaceholder=STRIPE_LINK.includes("DEIN_PAYMENT_LINK");
    if(isPlaceholder){
      if(sd)setSportData(sd); if(td)setTrainingData(td); if(pd)setProfilData(pd); if(ad)setAllergenData(ad);
      setTier("pro"); setPhase("results"); return;
    }
    try{ sessionStorage.setItem("treyn_pre_payment",JSON.stringify({sd,td,pd,ad})); }catch{}
    const base=window.location.origin+window.location.pathname;
    window.location.href=`${STRIPE_LINK}?success_url=${encodeURIComponent(base+"?pro=success")}`;
  };

  const [isDemoMode,setIsDemoMode]=useState(false);
  const devSkip=()=>{ setPhase("preview"); };
  const startDemo=()=>{
    setIsDemoMode(true);
    setSportData({primarySport:"cycling",selectedSports:["cycling","running"],sel:{cycling:true,running:true},subSel:{road:true,gravel:true,run_road:true},childSel:{},healthOnly:false});
    setTrainingData({
      cycling:{days:5,intensity:"high",duration:120,hasCompetition:true,compCount:12,compTypes:["Rennen"]},
      running:{days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:0,compTypes:[]},
    });
    setProfilData({firstname:"Alex",lastname:"Demo",email:"alex@demo.ch",gender:"m",birthyear:"1990",height:"178",weight:"72",country:"Schweiz",platform:"garmin",rhr:"52",sleep:"7.5"});
    setAllergenData({allergens:[],customAllergens:"",noAllergens:true});
    setTier("pro");
    setPhase("demo");
  };
  const launchDemo=()=>{
    setPhase("results");
  };

  return (
    <div style={{minHeight:"100vh",background:C.white,fontFamily:"Inter,sans-serif"}}>
      <style>{css}</style>
      {phase==="intro"&&<button onClick={devSkip} style={{position:"fixed",bottom:20,right:20,zIndex:9999,background:C.black,color:C.neon,border:"none",borderRadius:8,padding:"8px 14px",fontSize:11,fontFamily:"JetBrains Mono,monospace",cursor:"pointer",opacity:.8}}>⚡ Zur Analyse</button>}
      {phase==="intro"      && <Intro           onNext={()=>setPhase("demo")} onDemo={startDemo}/>}
      {phase==="demo"       && <Demo            onNext={()=>{setIsDemoMode(false);setPhase("sport");}} onDemo={isDemoMode?launchDemo:startDemo}/>}
      {phase==="sport"      && <StepSport       onNext={v=>{setSportData(v);setPhase(v.healthOnly?"profil":"training");}}/>}
      {phase==="training"   && <StepTraining    sportData={sportData} onBack={()=>setPhase("sport")} onNext={v=>{setTrainingData(v);setPhase("profil");}}/>}
      {phase==="profil"     && <StepProfil      sportData={sportData} trainingData={trainingData} onBack={()=>setPhase(sportData?.healthOnly?"sport":"training")} onNext={v=>{setProfilData(v);setPhase("allergien");}}/>}
      {phase==="allergien"  && <StepAllergien   onBack={()=>setPhase("profil")} onNext={v=>{setAllergenData(v);setPhase("preview");}}/>}
      {phase==="preview"    && <AnalysePreview  sportData={sportData} trainingData={trainingData} profilData={profilData}
        onContinue={()=>{setTier("basic");setPhase("results");}}
        onUpgrade={()=>openStripePayment(sportData,trainingData,profilData,allergenData)}/>}
      {phase==="results"    && isDemoMode&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,background:"#0A0A0A",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.neon,color:"#000",fontWeight:700,fontFamily:"JetBrains Mono,monospace"}}>DEMO</span>
            <span style={{fontSize:13,color:"#fff"}}>Musterprofil von Alex · Du siehst alle PRO-Features</span>
          </div>
          <button onClick={()=>{setIsDemoMode(false);setPhase("intro");}} style={{fontSize:12,color:C.neon,background:"none",border:`1px solid ${C.neon}`,borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:500}}>Eigene Analyse starten →</button>
        </div>
      )}
      {phase==="results"    && <Results         sportData={sportData} trainingData={trainingData} profilData={profilData} allergenData={allergenData} tier={tier} onReset={reset}
        onUpgrade={()=>openStripePayment(sportData,trainingData,profilData,allergenData)}/>}
    </div>
  );
}
