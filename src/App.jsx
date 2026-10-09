import React, { useState, useEffect, useRef } from "react";

const C = {
  black:"#0A0A0A", white:"#FFFFFF", off:"#F7F7F5",
  neon:"#C8FF00", neonDim:"rgba(200,255,0,0.10)", neonBorder:"rgba(200,255,0,0.30)",
  g100:"#F2F2F0", g200:"#E5E5E2", g300:"#C9C9C6", g400:"#ADADAA", g500:"#8C8C89", g600:"#6B6B68", g700:"#4A4A48", g800:"#2A2A28",
  red:"#FF3B30", blue:"#007AFF", green:"#34C759", orange:"#FF9500", purple:"#AF52DE",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html{-webkit-text-size-adjust:100%;text-size-adjust:100%;}
  body{font-family:'Inter',sans-serif;background:${C.white};color:${C.black};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-size:15px;font-weight:400;letter-spacing:-.01em;overflow-wrap:break-word;-webkit-hyphens:auto;hyphens:auto;}
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
  .mono{font-family:'Inter',sans-serif;font-size:11px;color:${C.g400};letter-spacing:normal;font-weight:500;}
  .chip{display:inline-flex;align-items:center;gap:4px;background:${C.g100};color:${C.g600};font-size:11px;font-weight:500;padding:3px 8px;border-radius:100px;font-family:'Inter',sans-serif;letter-spacing:normal;}
  .chip.hi{background:${C.neonDim};color:${C.black};border:1px solid ${C.neonBorder};}
  input[type=text],input[type=email],input[type=number],select{font-family:'Inter',sans-serif;outline:none;transition:border-color .14s;}
  input[type=range]{-webkit-appearance:none;width:100%;height:3px;background:${C.g200};border-radius:2px;outline:none;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:${C.black};border-radius:50%;cursor:pointer;}
  .mob-nav{display:none;}
  @media(max-width:768px){
    .mob-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:${C.white};border-top:0.5px solid ${C.g200};z-index:200;padding:0 4px 2px;padding-bottom:max(8px,env(safe-area-inset-bottom));}
    .desktop-sidebar{display:none !important;}
    .su{padding-bottom:20px;}
    .fu2,.fu3,.fu4,.fu5{animation:fadeUp .4s ease forwards;opacity:0;}
    button:not(.icon-btn){min-height:40px;}
  }
  /* iPhone/iPad zoomen beim Antippen von Feldern unter 16px automatisch hinein */
  @media(max-width:768px),(hover:none) and (pointer:coarse){
    input,select,textarea{font-size:16px !important;}
  }
  @media(min-width:769px){.mob-nav{display:none !important;}}
`;

// ─── SPORT GROUPS ─────────────────────────────────────────────────────────────

const SPORT_GROUPS = [
  {id:"cycling",        label:"Radsport",            icon:"CYCLE", subs:[
    {id:"cycling_road",   label:"Rennrad",             children:null},
    {id:"cycling_gravel", label:"Gravel",              children:null},
    {id:"cycling_mtb",    label:"MTB",                 children:[
      {id:"cycling_mtb_xc",  label:"XC"},
      {id:"cycling_mtb_end", label:"Enduro"},
      {id:"cycling_mtb_dh",  label:"Downhill"},
    ]},
    {id:"cycling_track",  label:"Bahn",                children:null},
    {id:"cycling_ebike",  label:"E-Bike",              children:null},
  ]},
  {id:"running",        label:"Laufen",              icon:"RUN",   subs:[
    {id:"run_road",       label:"Strassenlauf",        children:[
      {id:"run_road_5k",    label:"5-10km"},
      {id:"run_road_10k",   label:"10-20km"},
      {id:"run_road_hm",    label:"Halbmarathon"},
      {id:"run_road_m",     label:"Marathon"},
      {id:"run_road_ultra", label:"Ultra"},
    ]},
    {id:"run_trail",      label:"Trail Running",       children:[
      {id:"run_trail_short", label:"Short (bis 30km)"},
      {id:"run_trail_ultra", label:"Ultra (30km+)"},
    ]},
    {id:"run_track",      label:"Bahnlauf",            children:null},
  ]},
  {id:"triathlon",      label:"Triathlon",           icon:"TRI",   subs:[
    {id:"tri_sprint",     label:"Sprint",              children:null},
    {id:"tri_olympic",    label:"Olympische Distanz",  children:null},
    {id:"tri_half",       label:"70.3 Half",           children:null},
    {id:"tri_full",       label:"Ironman Full",        children:null},
    {id:"tri_ultra",      label:"Ultra (T100 / Deca)", children:null},
  ]},
  {id:"swimming",       label:"Schwimmen",           icon:"SWIM",  subs:[
    {id:"swim_sprint",    label:"Sprint / Kurzbahn",   children:null},
    {id:"swim_mid",       label:"Mitteldistanz",       children:null},
    {id:"swim_open",      label:"Freiwasser / Open Water", children:null},
  ]},
  {id:"football",       label:"Fussball",            icon:"FOOT",  subs:null},
  {id:"icehockey",      label:"Eishockey",           icon:"ICE",   subs:null},
  {id:"fitness",        label:"Hyrox & Kraftsport",  icon:"GYM",   subs:[
    {id:"hyrox",          label:"Hyrox",               children:null},
    {id:"krafttraining",  label:"Krafttraining",       children:null},
    {id:"crossfit",       label:"CrossFit",            children:null},
    {id:"powerlifting",   label:"Powerlifting",        children:null},
  ]},
  {id:"ski_snow",       label:"Ski & Snowboard",     icon:"SKI",   subs:[
    {id:"ski_alpin",      label:"Ski Alpin",           children:null},
    {id:"ski_freeride",   label:"Freeride & Freestyle",children:null},
    {id:"ski_touring",    label:"Skitouren / Splitboard",children:null},
    {id:"snowboard",      label:"Snowboard",           children:null},
  ]},
  {id:"langlauf",       label:"Langlauf & Biathlon", icon:"XC",    subs:[
    {id:"langlauf_klassisch", label:"Langlauf Klassisch", children:[
      {id:"langlauf_klassisch_kurz",  label:"Kurz (bis 15km)"},
      {id:"langlauf_klassisch_mittel",label:"Mittel (15-50km)"},
      {id:"langlauf_klassisch_lang",  label:"Lang (50km+)"},
    ]},
    {id:"langlauf_skating",   label:"Skating",             children:[
      {id:"langlauf_skating_kurz",  label:"Kurz (bis 15km)"},
      {id:"langlauf_skating_mittel",label:"Mittel (15-50km)"},
      {id:"langlauf_skating_lang",  label:"Lang (50km+)"},
    ]},
    {id:"biathlon",           label:"Biathlon",            children:null},
  ]},
  {id:"tennis",         label:"Tennis & Padel",      icon:"TENNIS",subs:[
    {id:"tennis",         label:"Tennis",              children:null},
    {id:"padel",          label:"Padel",               children:null},
  ]},
  {id:"leichtathletik", label:"Leichtathletik",      icon:"ATHLETICS", subs:[
    {id:"la_sprint",      label:"Sprint (100m-400m)",  children:null},
    {id:"la_mittel",      label:"Mittelstrecke",       children:null},
    {id:"la_lang",        label:"Langstrecke (5km+)",  children:null},
    {id:"la_wurf",        label:"Wurf & Stoss",        children:null},
    {id:"la_sprung",      label:"Sprung",              children:null},
    {id:"la_mehr",        label:"Mehrkampf",           children:null},
  ]},
  {id:"golf",           label:"Golf",                icon:"GOLF",  subs:null},
  {id:"klettern",       label:"Klettern",            icon:"CLIMB", subs:null},
  {id:"kampfsport",     label:"Kampfsport",          icon:"FIGHT", subs:[
    {id:"boxing",         label:"Boxen",               children:null},
    {id:"mma",            label:"MMA",                 children:null},
    {id:"wrestling",      label:"Ringen / Grappling",  children:null},
    {id:"judo",           label:"Judo",                children:null},
    {id:"karate",         label:"Karate / Taekwondo",  children:null},
    {id:"bjj",            label:"Brazilian Jiu-Jitsu", children:null},
  ]},
  {id:"basketball",     label:"Basketball",          icon:"BALL",  subs:null},
  {id:"handball_vball", label:"Hand- & Volleyball",  icon:"HBALL", subs:[
    {id:"handball",       label:"Handball",            children:null},
    {id:"volleyball",     label:"Volleyball",          children:null},
    {id:"beachvolley",    label:"Beach Volleyball",    children:null},
  ]},
];

// Sport-spezifische Wettkampf-Typen
const COMPETITION_TYPES = {
  cycling:["Gran Fondo","Strassenrennen","Zeitfahren","Kriterium","Gravel Race","Etappenrennen"],
  running:["5K / 10K","Halbmarathon","Marathon","Trail Run","Ultra"],
  triathlon:["Sprint","Olympische Distanz","70.3 Half","Ironman Full","T100"],
  swimming:["Pool-Wettkampf","Open Water Event"],
  football:["Liga-Spiele","Pokalspiele","Freundschaftsspiele","Turniere"],
  icehockey:["Liga-Spiele","Playoff-Spiele","Turniere"],
  fitness:["HYROX Rennen","CrossFit Open","Powerlifting Meet","Wettkampf"],
  ski_snow:["Rennen Alpin","Freeride Contest","Freestyle Contest","Skitouren-Event","Halfpipe Contest"],
  langlauf:["Skimarathon","Staffelrennen","Biathlon-Wettkampf"],
  golf:["Turniere","Club-Meisterschaft","Stroke Play","Match Play"],
  basketball:["Liga-Spiele","Playoff-Spiele","Turniere"],
  american_football:["Liga-Spiele","Playoff-Spiele","Turniere"],
  handball_vball:["Liga-Spiele","Pokalspiele","Turniere","Beach Volleyball Turnier"],
  tennis:["ATP/WTA Turnier","ITF Turnier","Club-Meisterschaft","Doppel"],
  leichtathletik:["Meetings","Meisterschaften","Strassenläufe","Mehrkampf"],
  kampfsport:["Kämpfe","Turniere","Meisterschaften"],
  klettern:["Boulder","Lead","Speed"],
};

const COMPETITION_LABEL = {
  cycling:"Wettkämpfe / Rennen",running:"Wettkämpfe / Rennen",triathlon:"Wettkämpfe / Rennen",swimming:"Wettkämpfe",
  football:"Wettkämpfe / Spiele",icehockey:"Wettkämpfe / Spiele",
  fitness:"Wettkämpfe",ski_snow:"Wettkämpfe / Rennen",langlauf:"Wettkämpfe / Rennen",
  golf:"Turniere",basketball:"Wettkämpfe / Spiele",american_football:"Wettkämpfe / Spiele",
  handball_vball:"Wettkämpfe / Spiele",tennis:"Wettkämpfe / Spiele",
  leichtathletik:"Wettkämpfe",kampfsport:"Wettkämpfe",klettern:"Wettkämpfe",
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────

function SportIcon({icon, active, size=18}) {
  const col = active ? C.black : C.g600;
  const s = size;
  const icons = {
    CYCLE:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 6l-3 5h8"/><path d="M12 17.5l3-5.5 3 5.5"/></svg>,
    CYCLING:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 6l-3 5h8"/><path d="M12 17.5l3-5.5 3 5.5"/></svg>,
    RUN:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="4" r="1.5"/><path d="M5 21l4-5 3 3 2-5"/><path d="M17 13l-3.5-5L16 4"/><path d="M10 8l2 5"/></svg>,
    TRI:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M5 16l4-8 3 3 3-3 4 8"/><path d="M9 6.5l3-2.5 3 2.5"/></svg>,
    SWIM:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c1 0 2 .5 3 .5S7 12 8 12s2 .5 3 .5S13 12 14 12s2 .5 3 .5S19 12 20 12s2 .5 2 .5"/><path d="M2 17c1 0 2 .5 3 .5S7 17 8 17s2 .5 3 .5S13 17 14 17s2 .5 3 .5S19 17 20 17s2 .5 2 .5"/><path d="M7.5 12V8l4-2.5 2.5 4.5"/><circle cx="7.5" cy="6" r="1"/></svg>,
    SKI:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="17" cy="4.5" r="1.5"/><path d="M3 20.5l5.5-7 3.5 3 3-5.5 5 8.5"/><path d="M3 20.5h18"/></svg>,
    GYM:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h-2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2"/><path d="M17.5 6.5h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2"/><line x1="6.5" y1="9" x2="17.5" y2="9"/><line x1="6.5" y1="7" x2="6.5" y2="11"/><line x1="17.5" y1="7" x2="17.5" y2="11"/><line x1="12" y1="6" x2="12" y2="12"/></svg>,
    XC:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="17" cy="4" r="1.5"/><path d="M4 20l5-14M20 20l-5-14"/><path d="M4 20l5-14 3 6 3-6 5 14"/><path d="M7.5 13h9"/></svg>,
    FOOT:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5"/><polygon points="12,5.5 13.8,8.3 12,11.5 10.2,8.3" strokeLinejoin="round"/><polygon points="5.2,9.8 8.4,9.2 10.2,11.8 8,13.8 5.2,12.8" strokeLinejoin="round"/><polygon points="18.8,9.8 15.6,9.2 13.8,11.8 16,13.8 18.8,12.8" strokeLinejoin="round"/><polygon points="7.5,17.2 8,13.8 10.5,14.8 11,18" strokeLinejoin="round"/><polygon points="16.5,17.2 16,13.8 13.5,14.8 13,18" strokeLinejoin="round"/></svg>,
    ICE:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5.5" y1="4.5" x2="16.5" y2="15.5"/><path d="M15.5 14.5L19 16.5 18 20 14.5 19 Z"/><ellipse cx="11" cy="17" rx="5.5" ry="2" /></svg>,
    BALL:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a14.5 14.5 0 0 0 0 18M3 12h18"/><path d="M3.4 9h17.2M3.4 15h17.2"/></svg>,
    HBALL:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c0 5-4.5 8.5-9 9"/><path d="M12 3c0 5 4.5 8.5 9 9"/><path d="M3.5 14.5c4 .5 7 3.5 8.5 6.5"/><path d="M20.5 14.5c-4 .5-7 3.5-8.5 6.5"/></svg>,
    VBALL:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c0 5-4.5 8.5-9 9"/><path d="M12 3c0 5 4.5 8.5 9 9"/><path d="M3.5 14.5c4 .5 7 3.5 8.5 6.5"/><path d="M20.5 14.5c-4 .5-7 3.5-8.5 6.5"/></svg>,
    BBALL:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a14.5 14.5 0 0 0 0 18M3 12h18"/><path d="M3.4 9h17.2M3.4 15h17.2"/></svg>,
    NFL:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)"/><path d="M9.5 6.5l5 11M14.5 6.5l-5 11"/><path d="M7 10l10 4M7 14l10-4"/></svg>,
    HAND:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>,
    GOLF:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18V3l7 4-7 4"/><path d="M5 21c0-2 3-3 7-3s7 1 7 3"/><line x1="12" y1="18" x2="12" y2="15"/></svg>,
    TENNIS:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c2 3 2 6 0 9s-2 6 0 9"/><path d="M3 12c3 2 6 2 9 0s6-2 9 0"/></svg>,
    ATHLETICS:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="1.5"/><path d="M8 21l4-10 4 10"/><path d="M6 9h12"/><path d="M9 21h6"/></svg>,
    CLIMB:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="4" r="1.5"/><path d="M10 6v6l-3 4"/><path d="M10 12l3 3"/><path d="M7 10l6 1"/><path d="M13 15l2 6"/><path d="M7 20l3-6"/></svg>,
    FIGHT:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 5c1-1.5 3-1.5 4 0s1 3-.5 4l-8 8c-1.5 1.5-3.5 1.5-4.5.5s-1-3 .5-4.5l8-8z"/><path d="M8 12l-3 3c-1 1-1 2.5 0 3.5"/><path d="M20 8l1.5-1.5"/></svg>,
  };
  return icons[icon] || <svg width={s} height={s} viewBox="0 0 24 24"/>;
}

// ─── AFFILIATE LINKS ──────────────────────────────────────────────────────────

// Country detection - reads from profilData at runtime, falls back to CH
const getUserCountry=()=>{
  try{
    const pd=window.__TREYN_PROFIL__;
    return pd?.country||"Schweiz";
  }catch{return "Schweiz";}
};

// Country groups
const CH_COUNTRIES=["Schweiz"];
const DACH_COUNTRIES=["Schweiz","Deutschland","Österreich"];
const EU_COUNTRIES=["Schweiz","Deutschland","Österreich"]; // Only supported countries

// Build locale-aware shop links
const getShopLinks=(supp,country)=>{
  const isCH=CH_COUNTRIES.includes(country);
  const isDAch=DACH_COUNTRIES.includes(country);
  const isEU=EU_COUNTRIES.includes(country);
  return {isCH,isDAch,isEU};
};

const AFF = {
  // Global - works everywhere
  iherb:       q    => `https://iherb.com/search?kw=${encodeURIComponent(q)}&rcode=DEIN_CODE`,
  maurten:     slug => `https://www.maurten.com/products/${slug}?ref=DEIN_CODE`,
  mnstry:      slug => `https://mnstry.com/products/${slug}?ref=DEIN_CODE`,
  // Myprotein - locale-aware
  myprotein:   (q,country="Schweiz") => {
    const locale=CH_COUNTRIES.includes(country)?"de-ch":"de-de";
    return `https://www.myprotein.com/${locale}/search?query=${encodeURIComponent(q)}&affil=DEIN_CODE`;
  },
  // CH-only shops - fallback to iHerb for non-CH
  sponser:     (q,country="Schweiz") => CH_COUNTRIES.includes(country)
    ? `https://www.sponser.ch/de/search?q=${encodeURIComponent(q)}&ref=DEIN_CODE`
    : `https://iherb.com/search?kw=${encodeURIComponent(q)}&rcode=DEIN_CODE`,
  bodylab24:   (slug,country="Schweiz") => CH_COUNTRIES.includes(country)
    ? `https://www.bodylab24.ch/shop/${slug}`
    : `https://iherb.com/search?kw=${encodeURIComponent(slug)}&rcode=DEIN_CODE`,
  zur_rose:    (slug,country="Schweiz") => CH_COUNTRIES.includes(country)
    ? `https://www.zurrose-shop.ch/de/${slug}?ref=DEIN_CODE`
    : `https://iherb.com/search?kw=${encodeURIComponent(slug)}&rcode=DEIN_CODE`,
  nu3:         (slug,country="Schweiz") => DACH_COUNTRIES.includes(country)
    ? `https://www.nu3.ch/${slug}?ref=DEIN_CODE`
    : `https://iherb.com/search?kw=${encodeURIComponent(slug)}&rcode=DEIN_CODE`,
  // ESN / More - DE-focused, good for DACH
  esn:         (slug,country="Schweiz") => DACH_COUNTRIES.includes(country)
    ? `https://www.esn.com/products/${slug}?ref=DEIN_CODE`
    : `https://iherb.com/search?kw=${encodeURIComponent(slug)}&rcode=DEIN_CODE`,
  morenutrition: (slug,country="Schweiz") => DACH_COUNTRIES.includes(country)
    ? `https://www.more-nutrition.de/products/${slug}?ref=DEIN_CODE`
    : `https://iherb.com/search?kw=${encodeURIComponent(slug)}&rcode=DEIN_CODE`,
  // Hydration
  more_sirup:  (country="Schweiz") => DACH_COUNTRIES.includes(country)
    ? `https://www.more-nutrition.de/collections/sirup?ref=DEIN_CODE`
    : `https://iherb.com/search?kw=flavor+drops&rcode=DEIN_CODE`,
  lmnt:        () => `https://drinklmnt.com/?via=DEIN_CODE`,
  erdinger:    () => `https://www.erdinger.de/bierspezialitaeten/erdinger-alkoholfrei.html`,
  athletic:    () => `https://athleticbrewing.com/?ref=DEIN_CODE`,
  // Recovery gear - global sites
  therabody:   (country="Schweiz") => CH_COUNTRIES.includes(country)
    ? `https://www.therabody.com/de-ch?ref=DEIN_CODE`
    : DACH_COUNTRIES.includes(country)
    ? `https://www.therabody.com/de-de?ref=DEIN_CODE`
    : `https://www.therabody.com?ref=DEIN_CODE`,
  hyperice:    () => `https://hyperice.com/?ref=DEIN_CODE`,
  blackroll:   (country="Schweiz") => CH_COUNTRIES.includes(country)
    ? `https://www.blackroll.com/ch-de?ref=DEIN_CODE`
    : `https://www.blackroll.com/de?ref=DEIN_CODE`,
  compex:      (country="Schweiz") => CH_COUNTRIES.includes(country)
    ? `https://www.compex.com/ch-de?ref=DEIN_CODE`
    : `https://www.compex.com/de-de?ref=DEIN_CODE`,
  // New brands
  sis:         (slug,country="Schweiz") => EU_COUNTRIES.includes(country)||CH_COUNTRIES.includes(country)
    ? `https://www.scienceinsport.com/eu/${slug}?awc=DEIN_AWIN_CODE`
    : `https://www.scienceinsport.com/${slug}?awc=DEIN_AWIN_CODE`,
  foodspring:  (slug,country="Schweiz") => DACH_COUNTRIES.includes(country)
    ? `https://www.foodspring.ch/${slug}?awc=DEIN_AWIN_CODE`
    : `https://www.foodspring.com/${slug}?awc=DEIN_AWIN_CODE`,
  ers226:      (slug) => `https://www.226ers.com/en/${slug}`,
  naak:        (slug) => `https://www.naak.com/${slug}`,
  skyr:        (slug) => `https://www.skyr.com/${slug}`,
  huel:        (slug,country="Schweiz") => DACH_COUNTRIES.includes(country)
    ? `https://huel.com/de/${slug}?ref=DEIN_CODE`
    : `https://huel.com/${slug}?ref=DEIN_CODE`,
  baouw:       (slug) => `https://www.baouw.com/en/${slug}`,
  veloforte:   (slug) => `https://veloforte.com/${slug}?ref=DEIN_CODE`,
};

const BASIS = [
  {id:"vitd3",    name:"Vitamin D3 + K2",      dose:"2000-4000 IE täglich",when:"Morgens, mit Fett",    why:"Immunsystem, Knochen, Hormonstatus - 70% der CH-Bevölkerung mangelhaft",   tags:["Täglich","Basis"],      link:AFF.iherb("vitamin d3 k2"),            shop:"iHerb",priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine Pause nötig", timing:"Morgens mit einer fetthaltigen Mahlzeit (Vit D ist fettlöslich)", hinweis:"Im Sommer Dosis auf 1000 IE reduzieren bei regelmässiger Sonne. Bluttest (25-OH-Vit D) nach 3 Monaten empfohlen. Zielwert: 40-60 ng/ml."}},
  {id:"omega3",barcode:"4260591610032",budget:{name:"Bodylab24 Omega-3",dose:"3 Kapseln täglich",when:"Zu einer Mahlzeit",why:"Günstige, solide Omega-3 Quelle - EPA/DHA Ratio etwas tiefer als Premium, aber deutlich günstiger.",price:"~CHF 0.20/Tag",shop:"Bodylab24",link:"https://www.bodylab24.ch/shop/omega-3-kapseln"},   name:"Omega-3 (EPA/DHA)",     dose:"2-3g täglich",        when:"Zu einer Mahlzeit",    why:"Entzündungshemmend, Herzgesundheit, HRV-Verbesserung",                    tags:["Täglich","Basis"],      link:AFF.iherb("omega 3 epa dha"),          shop:"iHerb",priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine Pause nötig", timing:"Zu einer Mahlzeit (reduziert Fischgeschmack und verbessert Absorption)", hinweis:"Mindestens 4 Wochen bis messbare Wirkung. Bei Blutverdünnern (ASS, Marcumar) Arzt konsultieren. Omega-3 Index Bluttest nach 3 Monaten empfohlen."}},
  {id:"magnesium",barcode:"076280172171",budget:{name:"Bodylab24 Magnesium",dose:"300-400mg täglich",when:"Abends, 1h vor Schlaf",why:"Magnesiumoxid statt Bisglycinate - günstige Option, etwas schlechtere Bioverfügbarkeit.",price:"~CHF 0.08/Tag",shop:"Bodylab24",link:"https://www.bodylab24.ch/shop/magnesium"},name:"Magnesium Bisglycinate",dose:"300-400mg täglich",   when:"Abends, 1h vor Schlaf",why:"Schlafqualität, Muskelentspannung, Krampfprävention",                    tags:["Täglich","Abends"],     link:AFF.iherb("magnesium bisglycinate"),   shop:"iHerb",priority:1,
   protocol:{dauer:"Ganzjährig (erhöhter Bedarf bei Sportlern)", pause:"Keine Pause nötig", timing:"1 Stunde vor dem Schlafengehen für beste Schlafwirkung", hinweis:"Bisglycinate hat deutlich bessere Bioverfügbarkeit als Magnesiumoxid. Einschleichen mit 150mg/Tag in Woche 1, dann volldosieren. Nicht gleichzeitig mit Zink oder Eisen nehmen."}},
];

const SPORT_SUPP = {
  cycling:{
    performance:[
      {id:"mau_caf",  name:"Maurten Gel 100 CAF 100",dose:"1-2 Gels/h",             when:"Rennen / Intervalle",         why:"Koffein + Kohlenhydrate für maximale Leistung. Offizielle Tour de France Nahrung.", tags:["Race-Day","Koffein"],      link:AFF.maurten("gel-100-caf-100"),       shop:"Maurten",  priority:1,
       protocol:{dauer:"Nur an Wettkampf-/Intervall-Tagen", pause:"Nicht täglich verwenden, um keine Koffeintoleranz aufzubauen", timing:"45 min vor oder während hochintensiver Phase", hinweis:"Max. 1-2 pro Einheit. Kein Koffein später als 6 Stunden vor dem Schlafen - bei Abendtraining Koffein weglassen oder klein dosieren. An Ruhetagen kein Koffein für bessere Wirkung am Renntag."}},
      {id:"beta_cy",budget:{name:"iHerb Now Foods Beta-Alanin",dose:"3.2g täglich",when:"Aufgeteilt auf 2 Dosen",why:"Reines Beta-Alanin Pulver - kein Unterschied zur Markenware beim Wirkstoff.",price:"~CHF 0.30/Tag",shop:"iHerb",link:"https://www.iherb.com/pr/now-sports-nutrition-beta-alanine-pure-powder"},  name:"Beta-Alanin",             dose:"3.2-6.4g täglich",       when:"Aufgeteilt auf 2-4 Dosen",   why:"Puffert Laktat, verzögert Ermüdung bei hochintensiven Intervallen",             tags:["Pre-Workout","Ausdauer"],  link:AFF.iherb("beta alanine"),            shop:"iHerb",    priority:2,
       protocol:{dauer:"8-12 Wochen (Kur)", pause:"9 Wochen Pause nach 12-Wochen-Zyklus - dann neu starten", timing:"Dosis aufteilen: z.B. 3× 1.6g täglich, um Kribbeln (Parästhesie) zu minimieren", hinweis:"Wirkung tritt nach 3-4 Wochen spürbar ein, optimal nach 12 Wochen (maximale Carnosin-Sättigung). Kribbeln ist harmlos. Nicht mit Herzmedikamenten oder Potenzmitteln kombinieren."}},
      {id:"eisen_cy", name:"Eisen (Ferrochel)",        dose:"25-50mg - nur nach Bluttest",when:"Morgens nüchtern + Vit C",   why:"Sauerstofftransport - kritisch für Radfahrer. Nur nach ärztlichem Bluttest!",   tags:["Basis","Bluttest"],       link:AFF.iherb("iron ferrochel"),          shop:"iHerb",    priority:2, bluttest:true,
       protocol:{dauer:"3-6 Monate (bis Ferritin normalisiert)", pause:"Nur bei nachgewiesenem Mangel nehmen - Überdosierung gefährlich", timing:"Morgens nüchtern + 50mg Vitamin C für optimale Absorption", hinweis:"ZWINGEND: Nur nach Bluttest nehmen (Ferritin < 30 ng/ml als Sportler). Nicht mit Magnesium, Calcium oder Kaffee nehmen (1h Abstand). Kontrollbluttest nach 3 Monaten."}},
    ],
    endurance:[
      {id:"mau_320",  name:"Maurten Drink Mix 320",   dose:"80g / 500ml",            when:"Ausfahrten über 2h",          why:"Hohe Kohlenhydratdichte ohne GI-Probleme dank Hydrogel-Technologie",            tags:["Training","Kohlenhydrate"],link:AFF.maurten("drink-mix-320"),         shop:"Maurten",  priority:1,
       protocol:{dauer:"Bei langen Einheiten, kein Zyklus nötig", pause:"Keine", timing:"1 Flasche pro Stunde ab Minute 30. Erst trainieren, dann im Rennen anwenden.", hinweis:"GI-Training notwendig - Darm muss Kohlenhydratmengen lernen. Erst mit kleineren Mengen beginnen (160er), dann auf 320 steigern."}},
      {id:"elek_cy",  name:"Sponser Elektrolyt-Tabs", dose:"1 Tab / 500ml", kh:0, khTyp:"Elektrolyte",          when:"Während Training, Sommer",    why:"Natrium, Kalium, Magnesium - Krampfprävention und Leistungserhalt",             tags:["Hydration","Sommer"],     link:AFF.sponser("elektrolyt tabletten"),  shop:"Sponser",  priority:2,
       protocol:{dauer:"Ganzjährig bei intensivem Training", pause:"Keine", timing:"Bei Einheiten über 60 min oder ab 20°C Aussentemperatur", hinweis:"Bei sehr salzigem Schweiss (weisse Ränder auf Trikot) Dosierung auf 2 Tabs erhöhen."}},
    ],
    recovery:[
      {id:"whey_cy",budget:{name:"Bodylab24 Whey Protein",dose:"25-30g",when:"Innerhalb 30 min post-ride",why:"Konzentrat statt Isolat - etwas mehr Laktose, aber gute Qualität für deutlich weniger Geld.",price:"~CHF 1.20/Portion",shop:"Bodylab24",link:"https://www.bodylab24.ch/shop/whey-protein"},  name:"Whey Protein Isolat",     dose:"25-30g",                 when:"Innerhalb 30 min post-ride",  why:"Muskelreparatur und -aufbau. Schnellste Absorption aller Proteinquellen.",      tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"),shop:"Myprotein",priority:1,
       protocol:{dauer:"Ganzjährig, täglich nach Training", pause:"Keine", timing:"Innerhalb 30 Minuten nach der Einheit für optimales anaboles Fenster", hinweis:"Mit Kohlenhydraten kombinieren (Banane, Haferflocken) für bessere Aufnahme. Bei Laktoseintoleranz: Isolat statt Konzentrat wählen."}},
      {id:"ash_cy",budget:{name:"Lee-Sport Bio Ashwagandha",dose:"600mg täglich",when:"Abends",why:"Ohne KSM-66 Patentierung - ähnliche Wirkung bei deutlich tieferem Preis. Gute Wahl für Einsteiger.",price:"~CHF 0.35/Tag",shop:"vitafy.ch",link:"https://www.vitafy.de/lee-sport-bio-ashwagandha"},   name:"Ashwagandha KSM-66",      dose:"600mg täglich",          when:"Abends",                      why:"Senkt Cortisol, verbessert Schlaftiefe und Regeneration - klinisch belegt",     tags:["Abends","Adaptogen"],     link:AFF.iherb("ashwagandha ksm-66"),      shop:"iHerb",    priority:2,
       protocol:{dauer:"8-12 Wochen (Kur)", pause:"2-4 Wochen Pause nach 12 Wochen", timing:"Abends zur Schlafförderung, oder morgens zur Cortisol-Regulation - konsistent bleiben", hinweis:"Wirkung spürbar nach 4-8 Wochen. Nur KSM-66 oder Sensoril-Extrakt (5% Withanolide). Nicht bei Schilddrüsenerkrankungen ohne Arztabsprache. Nicht in der Schwangerschaft."}},
    ],
    health:[
      {id:"zink_cy",  name:"Zink 15mg",               dose:"15mg täglich",           when:"Abends, nicht mit Eisen",     why:"Immunabwehr, Testosteron, Wundheilung - bei Ausdauersportlern oft defizitär",  tags:["Täglich","Immunsystem"],  link:AFF.iherb("zinc 15mg"),               shop:"iHerb",    priority:2,
       protocol:{dauer:"3 Monate, dann Pause", pause:"4 Wochen Pause nach 3 Monaten - Kupfer-Haushalt überwachen", timing:"Abends, mindestens 2h Abstand zu Eisen und Calcium", hinweis:"Zink und Eisen konkurrieren - nie gleichzeitig nehmen. Bei >40mg/Tag sinkt Kupferspiegel. Bluttest nach 3 Monaten empfohlen."}},
      {id:"krea_cy",budget:{name:"Bulk Kreatin Monohydrat",dose:"5g täglich",when:"Täglich, nach Training",why:"Kreatin Monohydrat ist Kreatin Monohydrat - kein Preisunterschied beim Wirkstoff, nur bei Verpackung.",price:"~CHF 0.15/Tag",shop:"Bulk Nutrients",link:"https://www.bulknutrients.com.au/products/creatine-monohydrate"},  name:"Kreatin Monohydrat",       dose:"5g täglich",             when:"Täglich, nach Training",      why:"Verbessert Sprintleistung und Regeneration - am besten erforschtes Supplement", tags:["Täglich","Kraft"],        link:AFF.iherb("creatine monohydrate"),    shop:"iHerb",    priority:2,
       protocol:{dauer:"Ganzjährig möglich (kein Zyklus nötig)", pause:"Keine Pause wissenschaftlich notwendig - optional 4 Wochen/Jahr pausieren", timing:"Täglich 5g, Zeitpunkt weniger kritisch - am besten nach Training mit Kohlenhydraten", hinweis:"Keine Ladephase nötig - 3-5g täglich füllt Speicher in 3-4 Wochen. Leichte Gewichtszunahme (0.5-1kg Wassereinlagerung) ist normal. 3-5L Wasser täglich trinken."}},
    ],
  },
  running:{
    performance:[
      {id:"koff_run", name:"Koffein 100-200mg",       dose:"100-200mg",              when:"30-45 min vor Wettkampf",     why:"Kognitive Leistung + Ausdauer - bestens erforschtes Performance-Supplement",   tags:["Pre-Race","Koffein"],     link:AFF.iherb("caffeine 100mg"),          shop:"iHerb",    priority:1,
       protocol:{dauer:"Nur an Wettkampf- und Intervall-Tagen", pause:"Koffein-Pause 1 Woche vor Hauptrennen für maximale Wirkung", timing:"30-45 min vor dem Start oder der intensiven Phase", hinweis:"Kein Koffein später als 6 Stunden vor dem Schlafen - bei Abendtraining Koffein weglassen oder klein dosieren. Nüchterneinnahme kann GI-Probleme verursachen - mit kleinem Snack nehmen. Toleranz senken durch koffeinfreie Tage."}},
      {id:"mn_gel",   name:"MNSTRY Intensity Gel",    dose:"1 Gel alle 30-45 min",   when:"Tempo- oder Wettkampf",        why:"Magenfreundlich, natürliche Zutaten - genutzt von Canyon//SRAM und EF-Team", tags:["Race-Day","Carbs"],       link:AFF.mnstry("intensity-gel"),          shop:"MNSTRY",   priority:1,
       protocol:{dauer:"Nur bei Einheiten über 60 min", pause:"Keine", timing:"Erstes Gel nach 30-45 min, dann alle 30-45 min", hinweis:"GI-Training: Gels zuerst im Training testen, nie erstmals im Rennen. Mit Wasser einnehmen - niemals mit Sportgetränk (zu viel Zucker gleichzeitig)."}},
      {id:"eisen_run",name:"Eisen (Ferrochel)",        dose:"Nach Bluttest",          when:"Morgens nüchtern",             why:"Läufer haben erhöhten Eisenbedarf durch Fussstoss-Hämolyse - testen lassen",  tags:["Basis","Bluttest"],       link:AFF.iherb("iron ferrochel"),          shop:"iHerb",    priority:2, bluttest:true,
       protocol:{dauer:"3-6 Monate bis Normalisierung", pause:"Nur mit nachgewiesenem Mangel - Überdosierung toxisch", timing:"Morgens nüchtern + Vitamin C, 1h vor dem Frühstück", hinweis:"Fussstoss-Hämolyse betrifft v.a. Langstreckenläufer. Ferritin-Zielwert für Sportler: 50-100 ng/ml. Kaffee, Calcium und Magnesium mit 2h Abstand."}},
    ],
    endurance:[
      {id:"mau_160",  name:"Maurten Drink Mix 160",   dose:"40g / 500ml",            when:"Ab 60 min aufwärts",           why:"Ideal für Läufer - weniger dicht als 320, perfekt für Trainings und Rennen",  tags:["Training","Kohlenhydrate"],link:AFF.maurten("drink-mix-160"),         shop:"Maurten",  priority:1,
       protocol:{dauer:"Bei Einheiten über 60 min, kein Zyklus", pause:"Keine", timing:"Ab Minute 30-45, alle 30 min", hinweis:"GI-Test im Training notwendig - Darm muss Kohlenhydrate bei Lauftempo lernen. Viele Läufer vertragen beim Laufen weniger als beim Radfahren."}},
      {id:"rbeete",   name:"Rote Beete Nitrat",       dose:"400-600mg Nitrat",       when:"2-3h vor Training",            why:"Verbessert O2-Effizienz um 1-3% - besonders bei langen Einheiten relevant",   tags:["Pre-Training","Natürlich"],link:AFF.iherb("beet root nitrate"),       shop:"iHerb",    priority:2,
       protocol:{dauer:"6-7 Tage kontinuierlich laden, dann täglich", pause:"Keine langfristige Pause nötig", timing:"2-3 Stunden vor Wettkampf/Training, Peakwirkung nach 2-3h", hinweis:"Gepresster Rote-Beete-Saft (ca. 500ml) oder konzentrierte Shots. Kein Mundwasser verwenden - es zerstört die Nitratumwandlung durch Mundbakterien. Rote Verfärbung von Urin und Stuhl ist harmlos."}},
    ],
    recovery:[
      {id:"koll_run", name:"Kollagen + Vitamin C",    dose:"10-15g + 50mg Vit C",    when:"30 min vor Training",          why:"Sehnen- und Gelenkschutz - besonders wichtig für Läufer",                     tags:["Gelenke","Prävention"],   link:AFF.iherb("collagen vitamin c"),      shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig bei intensivem Lauftraining", pause:"Keine", timing:"30 min VOR dem Training (nicht danach) - Kollagen braucht Vorlaufzeit zur Synthese", hinweis:"Vitamin C gleichzeitig nehmen (erhöht Kollagensynthese). Typ I/II Kollagen bevorzugen. Wirkung auf Sehnen nach 3-6 Monaten messbar."}},
      {id:"tart_run", name:"Tart Cherry Extrakt",     dose:"480mg täglich",          when:"Nach langen Einheiten",        why:"Signifikante DOMS-Reduktion in mehreren RCTs belegt",                          tags:["Post-Training","DOMS"],   link:AFF.iherb("tart cherry"),             shop:"iHerb",    priority:2,
       protocol:{dauer:"Während harter Trainingsblöcke (2-7 Tage)", pause:"Keine Dauereinnahme nötig - situativ bei hartem Training", timing:"2× täglich (morgens + abends) in Phasen mit hoher Belastung", hinweis:"Besonders wirksam bei Wettkampfblöcken. Kann Schlaf verbessern (Melatonin-Gehalt). Fruchtsaft-Alternative: 300ml Kirschsaft 2× täglich."}},
    ],
    health:[
      {id:"vd3_run",  name:"Vitamin D3 + K2",         dose:"2000-4000 IE",           when:"Morgens",                      why:"Stressbruchprävention und Muskelfunktion - Läufer besonders gefährdet",        tags:["Basis","Knochen"],        link:AFF.iherb("vitamin d3 k2"),           shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Läufer haben erhöhtes Stressfraktur-Risiko - Vit D + Calcium-Versorgung kritisch. Bluttest alle 6 Monate."}},
    ],
  },
  fitness:{
    performance:[
      {id:"krea_fit", name:"Kreatin Monohydrat",      dose:"5g täglich",             when:"Post-Training",                why:"HYROX & CrossFit brauchen Kraft UND Ausdauer - Kreatin verbessert beides",    tags:["Täglich","Kraft"],        link:AFF.iherb("creatine monohydrate"),    shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig möglich", pause:"Keine Pause wissenschaftlich notwendig", timing:"Nach Training am effektivsten - Muskel ist aufnahmefähiger post-Workout", hinweis:"Keine Ladephase nötig. 5g täglich füllt Speicher in 3-4 Wochen. 0.5-1kg Gewichtszunahme durch Wassereinlagerung normal. 3-5L Wasser/Tag."}},
      {id:"koff_fit", name:"Koffein 200mg",           dose:"200mg",                  when:"30-40 min vor WOD",            why:"Fokus, Ausdauer und Kraftleistung für 60-90 min maximale Belastungen",         tags:["Pre-WOD","Koffein"],      link:AFF.iherb("caffeine 200mg"),          shop:"iHerb",    priority:1,
       protocol:{dauer:"Nur an Trainingstagen", pause:"1 Woche Koffein-Pause alle 6-8 Wochen empfohlen um Toleranz zu senken", timing:"30-40 min vor WOD, nüchtern oder leichter Snack", hinweis:"Kein Koffein später als 6 Stunden vor dem Schlafen (schlechter Schlaf = schlechtere Recovery) - bei Abendtraining Koffein weglassen oder klein dosieren. Nüchterneinnahme kann Magenprobleme verursachen."}},
    ],
    endurance:[
      {id:"beta_fit", name:"Beta-Alanin",             dose:"3.2-4.8g täglich",       when:"Täglich, aufgeteilt",          why:"Puffert Laktat bei hochintensiven MetCon-Einheiten und HYROX-Stationen",      tags:["Täglich","MetCon"],       link:AFF.iherb("beta alanine"),            shop:"iHerb",    priority:1,
       protocol:{dauer:"8-12 Wochen (Kur)", pause:"9 Wochen Pause nach 12-Wochen-Zyklus", timing:"Dosis aufteilen: 2-3× täglich je 1.6g - Kribbeln (Parästhesie) ist harmlos", hinweis:"Wirkt v.a. bei Belastungen von 1-4 Minuten - ideal für MetCons und HYROX-Stationen. Wirkung nach 3-4 Wochen spürbar, optimal nach 12 Wochen."}},
    ],
    recovery:[
      {id:"whey_fit", name:"Whey Protein Isolat",     dose:"30-35g",                 when:"Direkt post-WOD",              why:"Starker Muskelabbau durch kombinierte Kraft+Ausdauer-Belastung reparieren",   tags:["Post-WOD","Protein"],     link:AFF.myprotein("whey protein isolate"),shop:"Myprotein",priority:1,
       protocol:{dauer:"Ganzjährig, nach jeder Einheit", pause:"Keine", timing:"Innerhalb 30 min post-WOD mit 30-50g Kohlenhydraten kombinieren", hinweis:"Bei 2× täglich Training: auch post-Einheit 2 supplementieren. Casein vor Schlaf optional für nächtliche Regeneration."}},
      {id:"koll_fit", name:"Kollagen + Vitamin C",    dose:"10-15g",                 when:"Vor Training",                 why:"Sehnen und Gelenke schützen - bei CrossFit und HYROX stark belastet",         tags:["Gelenke","Prävention"],   link:AFF.iherb("collagen vitamin c"),      shop:"iHerb",    priority:2,
       protocol:{dauer:"Ganzjährig bei intensivem Training", pause:"Keine", timing:"30 min VOR der Einheit - nicht danach", hinweis:"Typ I/II Kollagen. Vitamin C gleichzeitig essenziell für Synthese. Bei akuten Sehnenreizungen Dosis auf 20g erhöhen."}},
    ],
    health:[
      {id:"vd3_fit",  name:"Vitamin D3 + K2",         dose:"3000 IE",                when:"Morgens",                      why:"Knochen, Testosteron, Immunsystem - Basis für jeden Kraftsportler",           tags:["Basis","Täglich"],        link:AFF.iherb("vitamin d3 k2"),           shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"K2 (MK-7 Form) sichert korrekte Kalziumeinlagerung in Knochen statt Arterien. Bluttest nach 3 Monaten."}},
    ],
  },
  fussball:{
    performance:[
      {id:"krea_fb",  name:"Kreatin Monohydrat",      dose:"5g täglich",             when:"Post-Training",                why:"Verbessert Sprintleistung und Explosivität - direkt relevant für Fussball",   tags:["Täglich","Sprint"],       link:AFF.iherb("creatine monohydrate"),    shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig oder in Saison-Blöcken", pause:"Optional 4 Wochen in der Saisonpause", timing:"Nach Training oder Spiel, mit Kohlenhydraten", hinweis:"Besonders wirksam für Sprintwiederholungen - exakt das Anforderungsprofil Fussball. 0.5-1kg Gewichtszunahme normal."}},
      {id:"koff_fb",  name:"Koffein 100-200mg",       dose:"100-200mg",              when:"60 min vor Spiel",             why:"Reaktionszeit, Ausdauer und Konzentration im Spiel verbessern",                tags:["Pre-Game","Koffein"],     link:AFF.iherb("caffeine"),                shop:"iHerb",    priority:1,
       protocol:{dauer:"Nur an Spieltagen und intensiven Trainingstagen", pause:"An Ruhetagen kein Koffein für bessere Wirkung", timing:"60 min vor Spielbeginn", hinweis:"Kein Koffein später als 6 Stunden vor dem Schlafen. Bei Abendspielen Koffein weglassen oder klein dosieren."}},
    ],
    recovery:[
      {id:"whey_fb",  name:"Whey Protein Isolat",     dose:"25-30g",                 when:"Direkt nach Spiel / Training", why:"Muskelschaden durch Zweikämpfe und Sprints reparieren",                       tags:["Post-Game","Protein"],    link:AFF.myprotein("whey protein isolate"),shop:"Myprotein",priority:1,
       protocol:{dauer:"Ganzjährig nach Spielen und intensiven Einheiten", pause:"Keine", timing:"Innerhalb 30-45 min post-Game", hinweis:"Mit schnellen Kohlenhydraten (60-80g) kombinieren für Glykogenauffüllung + Proteinaufnahme."}},
      {id:"carb_fb",  name:"Schnelle Kohlenhydrate",  dose:"60-80g innerhalb 30 min",when:"Direkt nach Spiel",            why:"Glykogenspeicher auffüllen - wichtig bei mehreren Spielen pro Woche",         tags:["Post-Game","Carbs"],      link:AFF.iherb("dextrose"),                shop:"iHerb",    priority:1,
       protocol:{dauer:"Nach jedem Spiel und harten Training", pause:"Keine", timing:"Direkt im Anschluss ans Spiel (innerhalb 30 min)", hinweis:"Bei >2 Spielen/Woche: Glykogenauffüllung kritisch. Dextrose, Maltodextrin oder Bananen/Weissbrot als Alternative."}},
    ],
    endurance:[
      {id:"beta_fb",  name:"Beta-Alanin",             dose:"3.2-4.8g täglich",       when:"Täglich",                      why:"Puffert Laktat in der Schlussphase des Spiels wenn Ermüdung einsetzt",        tags:["Ausdauer","Spätphase"],   link:AFF.iherb("beta alanine"),            shop:"iHerb",    priority:2,
       protocol:{dauer:"8-12 Wochen (Kur), idealerweise Vorsaison", pause:"9 Wochen Pause nach 12 Wochen", timing:"Täglich aufgeteilt auf 2-3 Dosen à 1.6g", hinweis:"Wirkt v.a. in der Schlussphase des Spiels (70.-90. Minute) wenn Laktat steigt. Kribbeln ist harmlos und verschwindet bei aufgeteilter Dosis."}},
    ],
    health:[
      {id:"vd3_fb",   name:"Vitamin D3",              dose:"2000-4000 IE",           when:"Morgens",                      why:"Verletzungsprävention, Immunsystem, Muskelfunktion",                          tags:["Basis","Täglich"],        link:AFF.iherb("vitamin d3"),              shop:"iHerb",    priority:1,
       protocol:{dauer:"Ganzjährig (Wintersaison besonders wichtig)", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Fussballer trainieren oft in Hallen (Winter) - Vit D-Mangel besonders verbreitet. Bluttest Oktober und März empfohlen."}},
    ],
  },
  // ─── SKI (Alpin, Freeride, Freestyle, Snowboard) ────────────────────────────
  ski:{
    performance:[
      {id:"krea_ski", name:"Kreatin Monohydrat", dose:"5g täglich", when:"Nach Training / Fahrtag", why:"Explosivität und Schnellkraft für kurze maximale Belastungen - perfekt für Alpin.", tags:["Täglich","Kraft"], link:AFF.iherb("creatine monohydrate"), shop:"iHerb", priority:1,
       protocol:{dauer:"Saisonbegleitend", pause:"Keine", timing:"Nach Training oder Abends", hinweis:"Besonders wertvoll in Wettkampfblöcken und intensiven Trainingslagern."}},
      {id:"koff_ski", name:"Koffein 100-200mg", dose:"100-200mg", when:"45 min vor erstem Lauf", why:"Reaktionszeit, Fokus und Kältestress-Pufferung - an Wettkampftagen kritisch.", tags:["Pre-Race","Koffein"], link:AFF.iherb("caffeine"), shop:"iHerb", priority:1,
       protocol:{dauer:"Wettkampf- und Intensivtage", pause:"Koffein-Pause 1 Woche vor Hauptrennen", timing:"45 min vor Start", hinweis:"Kältewetter steigert Koffeinwirkung leicht. Kein Koffein später als 6 Stunden vor dem Schlafen."}},
    ],
    recovery:[
      {id:"whey_ski", name:"Whey Protein Isolat", dose:"25-30g", when:"Nach Fahrtag", why:"Intensive Muskelarbeit (Oberschenkel, Rumpf) - Reparatur nach dem Fahren.", tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Ganzjährig nach intensiven Tagen", pause:"Keine", timing:"Innerhalb 30 min nach letztem Lauf", hinweis:"Mit 50-60g Kohlenhydraten kombinieren."}},
      {id:"koll_ski", name:"Kollagen + Vitamin C", dose:"10-15g", when:"30 min vor erstem Lauf", why:"Knöchel, Knie und Sehnen unter extremer Belastung - Prävention kritisch.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Saisonbegleitend, täglich", pause:"Keine", timing:"30 min VOR dem Fahren", hinweis:"Typ II Kollagen für Gelenkknorpel bevorzugen."}},
    ],
    endurance:[
      {id:"elek_ski", name:"Elektrolyt-Tabs", dose:"1 Tab / 0.5L", when:"Während Fahrtag", why:"Kältewetter täuscht über Flüssigkeitsverlust - Hydration trotzdem kritisch.", tags:["Hydration","Kälte"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:2,
       protocol:{dauer:"Ganzjährig bei intensivem Betrieb", pause:"Keine", timing:"Alle 60-90 min auf der Piste", hinweis:"Im Winter trinken viele zu wenig - Durstgefühl ist gedämpft bei Kälte."}},
    ],
    health:[
      {id:"vd3_ski", name:"Vitamin D3 + K2", dose:"3000-4000 IE", when:"Morgens", why:"Knochen, Muskelkraft, Immunsystem - Ski-Saison = wenig direkte Sonne.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig, Winter: höhere Dosis", pause:"Keine", timing:"Morgens mit fetthaltiger Mahlzeit", hinweis:"Bluttest Oktober und März empfohlen."}},
    ],
  },
  // ─── SKI TOURING / SPLITBOARD ───────────────────────────────────────────────
  ski_touring:{
    performance:[
      {id:"mau_gel_st", name:"Maurten Gel 100", dose:"1 Gel alle 45-60 min", when:"Aufstieg über 90 min", why:"Ausdauerleistung für lange Aufstiege - magenfreundlich auch bei Kälte.", tags:["Aufstieg","Carbs"], link:AFF.maurten("gel-100"), shop:"Maurten", priority:1,
       protocol:{dauer:"Bei Touren, kein Zyklus", pause:"Keine", timing:"Ab 30 min, alle 45-60 min", hinweis:"Bei Kälte Gels nahe am Körper tragen - verhindert Einfrieren."}},
    ],
    recovery:[
      {id:"koll_st", name:"Kollagen + Vitamin C", dose:"10-15g", when:"30 min vor Tour", why:"Knie und Hüfte unter langen Abstiegen besonders belastet.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig bei intensivem Tourenfahren", pause:"Keine", timing:"30 min VOR der Tour", hinweis:"Abstiege belasten Gelenke stärker als Aufstiege - nicht vergessen."}},
      {id:"whey_st", name:"Whey Protein Isolat", dose:"25-30g", when:"Nach Tour", why:"Lange Ausdauerbelastung mit Kraft-Komponente - Muskelreparatur wichtig.", tags:["Post-Tour","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Nach jeder langen Tour", pause:"Keine", timing:"Innerhalb 30-45 min", hinweis:"Mit Kohlenhydraten kombinieren für maximale Recovery."}},
    ],
    endurance:[
      {id:"elek_st", name:"Elektrolyt-Tabs", dose:"1 Tab / 0.5L", when:"Alle 60 min", why:"Langer Ausdaueroutput bei Kälte - Elektrolyte trotz gedämpftem Durstgefühl.", tags:["Hydration"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:1,
       protocol:{dauer:"Bei Touren", pause:"Keine", timing:"Regelmässig alle 60 min", hinweis:"Thermosflaschen verwenden um Einfrieren zu vermeiden."}},
    ],
    health:[
      {id:"vd3_st", name:"Vitamin D3 + K2", dose:"3000 IE", when:"Morgens", why:"Knochen und Muskeln für Skitouren-Belastung vorbereiten.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Besonders im Winter erhöhen."}},
    ],
  },
  // ─── LANGLAUF & BIATHLON ────────────────────────────────────────────────────
  langlauf:{
    performance:[
      {id:"mau_gel_xl", name:"Maurten Gel 100 CAF 100", dose:"1 Gel alle 30-40 min", when:"Rennen & Intervalle", why:"Koffein + Carbs für maximale Ausdauerleistung - eine der Sportarten mit der höchsten VO2max.", tags:["Race-Day","Koffein"], link:AFF.maurten("gel-100-caf-100"), shop:"Maurten", priority:1,
       protocol:{dauer:"Wettkampftage", pause:"Nicht täglich", timing:"30-40 min vor Start oder während", hinweis:"Langlauf hat einen der höchsten Energieumsätze aller Sportarten - Kohlenhydrate kritisch."}},
      {id:"rbeete_xl", name:"Rote Beete Nitrat", dose:"400-600mg Nitrat", when:"2-3h vor Training", why:"O2-Effizienz verbessern - bei Langläufern besonders relevant durch Altitude-Einsatz.", tags:["Pre-Training","Natürlich"], link:AFF.iherb("beet root nitrate"), shop:"iHerb", priority:2,
       protocol:{dauer:"6-7 Tage laden, dann täglich", pause:"Keine", timing:"2-3h vor Start", hinweis:"Kein Mundwasser vor Training - hemmt Nitratumwandlung durch Mundbakterien."}},
    ],
    endurance:[
      {id:"mau_320_xl", name:"Maurten Drink Mix 320", dose:"80g / 500ml", when:"Einheiten über 90 min", why:"Höchste Kohlenhydratdichte für Langlauf-typische 2-4h Ausdauereinheiten.", tags:["Training","Carbs"], link:AFF.maurten("drink-mix-320"), shop:"Maurten", priority:1,
       protocol:{dauer:"Bei langen Einheiten", pause:"Keine", timing:"Ab 30 min, 1 Flasche pro Stunde", hinweis:"Bei Kälte: Thermosflasche, GI-Training im Sommer."}},
      {id:"elek_xl", name:"Elektrolyt-Tabs", dose:"1 Tab / 0.5L", when:"Alle 60 min", why:"Hoher Natriumverlust auch bei Kälte - Krampfprävention essentiell.", tags:["Hydration"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Regelmässig alle 60 min", hinweis:"Langlauf hat hohe Schweissraten trotz Kälteempfinden."}},
    ],
    recovery:[
      {id:"whey_xl", name:"Whey Protein Isolat", dose:"25-30g", when:"Direkt nach Einheit", why:"Ganzkörper-Ausdauerbelastung mit hohem Muskelabbau - schnelle Reparatur.", tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Ganzjährig nach Einheiten", pause:"Keine", timing:"Innerhalb 30 min", hinweis:"Mit 60-80g Kohlenhydraten kombinieren."}},
    ],
    health:[
      {id:"eisen_xl", name:"Eisen (Ferrochel)", dose:"25-50mg nach Bluttest", when:"Morgens nüchtern", why:"Langlauf = einer der höchsten Eisenbedarfe aller Sportarten durch hohes Volumen.", tags:["Bluttest","Basis"], link:AFF.iherb("iron ferrochel"), shop:"iHerb", priority:2, bluttest:true,
       protocol:{dauer:"3-6 Monate", pause:"Nur bei nachgewiesenem Mangel", timing:"Morgens nüchtern + Vit C", hinweis:"Bluttest zwingend: Ferritin-Zielwert Sportler >50 ng/ml."}},
      {id:"vd3_xl", name:"Vitamin D3 + K2", dose:"3000 IE", when:"Morgens", why:"Knochen und Immunsystem für Wintersport - Mangel im Winter häufig.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Bluttest Oktober und März."}},
    ],
  },
  // ─── TENNIS & PADEL ─────────────────────────────────────────────────────────
  tennis:{
    performance:[
      {id:"krea_ten", name:"Kreatin Monohydrat", dose:"5g täglich", when:"Nach Training", why:"Explosive Schläge und Sprints - Kreatin verbessert Wiederholbarkeit.", tags:["Täglich","Kraft"], link:AFF.iherb("creatine monohydrate"), shop:"iHerb", priority:1,
       protocol:{dauer:"Saisonbegleitend", pause:"Keine", timing:"Nach Training", hinweis:"Besonders wertvoll bei Turnierblöcken mit mehreren Spielen täglich."}},
      {id:"koff_ten", name:"Koffein 100-200mg", dose:"100-150mg", when:"45 min vor Spiel", why:"Reaktionszeit und Konzentration für lange Matches.", tags:["Pre-Match","Koffein"], link:AFF.iherb("caffeine"), shop:"iHerb", priority:1,
       protocol:{dauer:"Spiel- und Intensivtage", pause:"Koffein-Pause an Ruhetagen", timing:"45 min vor Match", hinweis:"Kein Koffein später als 6 Stunden vor dem Schlafen."}},
    ],
    endurance:[
      {id:"elek_ten", name:"Elektrolyt-Tabs", dose:"1-2 Tabs / 0.5L", when:"Während langem Match", why:"Tennis-Matches können 3-5h dauern - Natrium- und Kaliumverlust erheblich.", tags:["Hydration","Match"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:1,
       protocol:{dauer:"Bei Matches über 90 min", pause:"Keine", timing:"Alle 60 min trinken", hinweis:"Seitenwechsel nutzen für Hydration."}},
    ],
    recovery:[
      {id:"koll_ten", name:"Kollagen + Vitamin C", dose:"10-15g", when:"30 min vor Training", why:"Ellbogen, Schulter und Handgelenk unter chronischem Stress - Prävention.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"30 min VOR Training", hinweis:"Tennisellbogen-Prävention: Kollagen + exzentrische Übungen."}},
      {id:"whey_ten", name:"Whey Protein Isolat", dose:"25g", when:"Nach Training / Match", why:"Muskelreparatur nach schlagintensivem Training.", tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:2,
       protocol:{dauer:"Nach Trainings und Matches", pause:"Keine", timing:"Innerhalb 30 min", hinweis:"Mit Kohlenhydraten kombinieren."}},
    ],
    health:[
      {id:"vd3_ten", name:"Vitamin D3 + K2", dose:"2000 IE", when:"Morgens", why:"Knochen, Muskulatur und Immunsystem - Basis für alle Sportler.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Bluttest nach 3 Monaten."}},
    ],
  },
  // ─── KAMPFSPORT ─────────────────────────────────────────────────────────────
  kampfsport:{
    performance:[
      {id:"krea_ks", name:"Kreatin Monohydrat", dose:"5g täglich", when:"Nach Training", why:"Explosive Kraft und Kraft-Wiederholbarkeit - essentiell im Kampfsport.", tags:["Täglich","Kraft"], link:AFF.iherb("creatine monohydrate"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Nach Training", hinweis:"Bei Gewichtsklassen: Kreatin kann 0.5-1kg Wassereinlagerung verursachen."}},
      {id:"beta_ks", name:"Beta-Alanin", dose:"3.2-4.8g täglich", when:"Aufgeteilt auf 2-3 Dosen", why:"Puffert Laktat bei intensiven Sparring- und Konditionseinheiten.", tags:["Ausdauer","Puffer"], link:AFF.iherb("beta alanine"), shop:"iHerb", priority:1,
       protocol:{dauer:"8-12 Wochen (Kur)", pause:"9 Wochen Pause", timing:"Täglich aufgeteilt", hinweis:"Kribbeln harmlos. Wirkt v.a. bei 1-4 min Belastungen."}},
    ],
    recovery:[
      {id:"whey_ks", name:"Whey Protein Isolat", dose:"30-35g", when:"Direkt post-Training", why:"Hoher Muskelabbau durch Kontaktsport - Reparatur und Aufbau priorisieren.", tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Innerhalb 30 min", hinweis:"Bei 2× täglich Training: nach jeder Einheit Protein."}},
      {id:"koll_ks", name:"Kollagen + Vitamin C", dose:"10-15g", when:"30 min vor Training", why:"Gelenke, Sehnen und Bänder unter extremer Belastung bei Würfen und Schlägen.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"30 min VOR Training", hinweis:"Typ I/II Kollagen für Bänder und Sehnen."}},
    ],
    endurance:[
      {id:"elek_ks", name:"Elektrolyt-Tabs", dose:"1-2 Tabs / 0.5L", when:"Sparring und lange Einheiten", why:"Hohes Schweissvolumen bei Kampfsport-Training - Krämpfe vermeiden.", tags:["Hydration"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:1,
       protocol:{dauer:"Bei Trainingstagen", pause:"Keine", timing:"Während Training", hinweis:"Besonders bei Sauna-Sessions zur Gewichtsreduktion: Elektrolyte danach."}},
    ],
    health:[
      {id:"vd3_ks", name:"Vitamin D3 + K2", dose:"2000-3000 IE", when:"Morgens", why:"Knochen, Immunsystem, Hormonprofil - Basis für Kampfsportler.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Bluttest nach 3 Monaten."}},
    ],
  },
  // ─── MTB ENDURO / DOWNHILL ──────────────────────────────────────────────────
  cycling_mtb:{
    performance:[
      {id:"krea_mtb", name:"Kreatin Monohydrat", dose:"5g täglich", when:"Nach Training / Fahrtag", why:"DH und Enduro: explosive Kraft, Bremsmanöver, Jumps - Kreatin direkt relevant.", tags:["Täglich","Kraft"], link:AFF.iherb("creatine monohydrate"), shop:"iHerb", priority:1,
       protocol:{dauer:"Saisonbegleitend", pause:"Keine", timing:"Nach Fahrtag", hinweis:"Besonders für DH: kurze explosive Läufe profitieren maximal von Kreatin."}},
      {id:"koff_mtb", name:"Koffein 100-200mg", dose:"100-200mg", when:"45 min vor Fahrtag", why:"Fokus, Reaktionszeit und Risikoabschätzung auf technischem Terrain.", tags:["Pre-Ride","Koffein"], link:AFF.iherb("caffeine"), shop:"iHerb", priority:1,
       protocol:{dauer:"Fahrtage", pause:"Ruhetage koffeinfrei", timing:"45 min vor erstem Run", hinweis:"Kein Koffein später als 6 Stunden vor dem Schlafen."}},
    ],
    recovery:[
      {id:"whey_mtb", name:"Whey Protein Isolat", dose:"25-30g", when:"Nach Fahrtag", why:"Explosiver Muskeleinsatz und Sturzrisiko - Reparatur und Aufbau priorisieren.", tags:["Post-Ride","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Nach Fahrtagen", pause:"Keine", timing:"Innerhalb 30 min", hinweis:"Mit 40-60g Kohlenhydraten kombinieren."}},
      {id:"koll_mtb", name:"Kollagen + Vitamin C", dose:"10-15g", when:"30 min vor Fahrtag", why:"Gelenke, Handgelenke und Schultern unter extremer technischer Belastung.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"30 min VOR dem Fahren", hinweis:"Bei Stürzen: Kollagendosis temporär auf 20g erhöhen."}},
    ],
    endurance:[
      {id:"elek_mtb", name:"Elektrolyt-Tabs", dose:"1 Tab / 0.5L", when:"Lange Enduro-Tage", why:"Enduro: Uphills und Stages können 4-6h dauern - Hydration unterschätzt.", tags:["Hydration"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:2,
       protocol:{dauer:"Bei Enduro-Events", pause:"Keine", timing:"Alle 60-90 min", hinweis:"DH: kürzere Sessions, weniger Hydrationsbedarf als Enduro."}},
    ],
    health:[
      {id:"vd3_mtb", name:"Vitamin D3 + K2", dose:"2000-3000 IE", when:"Morgens", why:"Knochen und Immunsystem - nach Stürzen und für Knochenstruktur wichtig.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Bluttest nach 3 Monaten."}},
    ],
  },
}


const GENERIC_SUPP = {
  performance:[
    {id:"krea_g",name:"Kreatin Monohydrat",dose:"5g täglich",        when:"Nach Training",       why:"Kraft, Explosivität, Regeneration - am besten erforschtes Supplement",tags:["Täglich","Kraft"],   link:AFF.iherb("creatine monohydrate"),   shop:"iHerb",    priority:1,
     protocol:{dauer:"Ganzjährig möglich", pause:"Keine wissenschaftlich notwendig", timing:"Nach Training mit Kohlenhydraten", hinweis:"5g täglich ohne Ladephase. 3-4 Wochen bis volle Wirkung."}},
    {id:"koff_g",name:"Koffein 100-200mg", dose:"100-200mg",         when:"45 min vor Training", why:"Ausdauer, Kraft, Reaktionszeit, Fettverbrennung",                    tags:["Pre-Training"],      link:AFF.iherb("caffeine"),               shop:"iHerb",    priority:1,
     protocol:{dauer:"Trainingstage, nicht täglich", pause:"Regelmässige koffeinfreie Tage für Toleranzreduktion", timing:"45 min vor Training", hinweis:"Kein Koffein später als 6 Stunden vor dem Schlafen - bei Abendtraining Koffein weglassen oder klein dosieren."}},
  ],
  endurance:[
    {id:"beta_g",name:"Beta-Alanin",       dose:"3.2-4.8g täglich",  when:"Aufgeteilt auf Tages-Dosen",why:"Puffert Laktat, verzögert Ermüdung bei hochintensiven Einheiten",   tags:["Täglich","Ausdauer"],link:AFF.iherb("beta alanine"),           shop:"iHerb",    priority:1,
     protocol:{dauer:"8-12 Wochen (Kur)", pause:"9 Wochen Pause nach 12 Wochen Einnahme", timing:"Dosis auf 2-3 Einnahmen aufteilen für weniger Kribbeln", hinweis:"Kribbeln (Parästhesie) harmlos. Nicht mit Herzmedikamenten kombinieren."}},
  ],
  recovery:[
    {id:"whey_g",name:"Whey Protein Isolat",dose:"25-30g",           when:"Innerhalb 30 min post-Training",why:"Muskelreparatur und -aufbau",                                   tags:["Post-Training"],     link:AFF.myprotein("whey protein isolate"),shop:"Myprotein",priority:1,
     protocol:{dauer:"Ganzjährig nach Trainingseinheiten", pause:"Keine", timing:"Innerhalb 30 min nach Training, mit Kohlenhydraten", hinweis:"Mit Wasser oder Milch mischen. Isolat bei Laktoseintoleranz."}},
    {id:"ash_g", name:"Ashwagandha KSM-66",dose:"600mg",             when:"Abends",              why:"Cortisol senken, Schlaf und Recovery verbessern",                    tags:["Abends"],            link:AFF.iherb("ashwagandha"),            shop:"iHerb",    priority:2,
     protocol:{dauer:"8-12 Wochen (Kur)", pause:"2-4 Wochen Pause nach 12 Wochen", timing:"Abends 1-2h vor Schlaf", hinweis:"Nur KSM-66 oder Sensoril-Extrakt. Nicht bei Schilddrüsenerkrankungen ohne Arztabsprache."}},
  ],
  health:[
    {id:"vd3_g", name:"Vitamin D3 + K2",   dose:"2000-4000 IE",      when:"Morgens",             why:"Immunsystem, Knochen, Hormonstatus - Basis für alle Sportler",       tags:["Basis","Täglich"],   link:AFF.iherb("vitamin d3 k2"),          shop:"iHerb",    priority:1,
     protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit (fettlöslich)", hinweis:"Bluttest nach 3 Monaten empfohlen. Zielwert: 40-60 ng/ml."}},
  ],
};

const HEALTH_ONLY_SUPP = [
  {id:"vd3_h",  name:"Vitamin D3 + K2",      dose:"2000 IE täglich",       when:"Morgens",           why:"Immunsystem, Knochen, Hormonstatus - 70% der CH-Bevölkerung mangelhaft",    tags:["Täglich","Basis"],        link:AFF.iherb("vitamin d3 k2"),          shop:"iHerb",    priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Fett", hinweis:"Im Sommer Dosis auf 1000 IE senken. Bluttest alle 6 Monate."}},
  {id:"omega_h",name:"Omega-3 (EPA/DHA)",     dose:"2g täglich",            when:"Zu einer Mahlzeit", why:"Herzgesundheit, Entzündungshemmend, kognitive Funktion",                   tags:["Täglich","Herz"],         link:AFF.iherb("omega 3 epa dha"),        shop:"iHerb",    priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Mit Hauptmahlzeit", hinweis:"Bei Blutverdünnern Arzt konsultieren. 4 Wochen bis Wirkung."}},
  {id:"mag_h",  name:"Magnesium Bisglycinate",keyIngredient:"300mg Mg",dose:"300mg täglich",         when:"Abends",            why:"Schlafqualität, Muskelentspannung, Stressbewältigung",                     tags:["Täglich","Abends"],       link:AFF.iherb("magnesium bisglycinate"),shop:"iHerb",    priority:1,
   protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"1h vor Schlaf", hinweis:"Nicht gleichzeitig mit Zink nehmen. Bisglycinate deutlich besser verfügbar als Oxid."}},
  {id:"zink_h", name:"Zink 15mg",             dose:"15mg täglich",          when:"Abends",            why:"Immunabwehr, Hautgesundheit, Hormonstatus",                                tags:["Täglich","Immunsystem"],  link:AFF.iherb("zinc 15mg"),              shop:"iHerb",    priority:2,
   protocol:{dauer:"3 Monate", pause:"4 Wochen Pause nach 3 Monaten", timing:"Abends, 2h Abstand zu Eisen/Calcium", hinweis:"Langzeit >40mg/Tag senkt Kupferspiegel."}},
  {id:"vitb_h", name:"Vitamin B-Komplex",     dose:"1 Kapsel täglich",      when:"Morgens",           why:"Energie, Nervensystem, Blutbildung",                                       tags:["Morgens","Energie"],      link:AFF.iherb("vitamin b complex"),      shop:"iHerb",    priority:2,
   protocol:{dauer:"3-6 Monate, dann neu evaluieren", pause:"1-2 Wochen Pause alle 3 Monate", timing:"Morgens mit Frühstück (färbt Urin gelb - normal)", hinweis:"Bei pflanzlicher Ernährung: besonders B12 einzeln prüfen. B12 Bluttest nach 3 Monaten."}},
];

function getSupplements(sportId, intensity, healthOnly, subSel, childSel={}) {
  if(healthOnly) return {basis:[], specific:HEALTH_ONLY_SUPP};
  const gm = {low:"health",medium:"endurance",high:"performance",competition:"performance"};
  const goalId = gm[intensity]||"health";

  // Try to find active sub-sport for this parent and get its suppKey
  let suppKey = null;
  if(subSel) {
    const group = (typeof SPORT_GROUPS !== "undefined" ? SPORT_GROUPS : []).find(g=>g.id===sportId);
    if(group?.subs) {
      // First check children (deeper level)
      let resolvedSub = null;
      for(const sub of group.subs) {
        if(sub.children?.length>0) {
          const selectedChild = sub.children.find(ch=>childSel[sub.id+"_"+ch.id]);
          if(selectedChild) { resolvedSub = {id:selectedChild.id}; break; }
        } else if(subSel[sub.id]) { resolvedSub = sub; break; }
      }
      if(resolvedSub) {
        const subProf = getSubProfile(resolvedSub.id);
        if(subProf?.suppKey) suppKey = subProf.suppKey;
      }
    }
  }

  // Fallback to old mapping if no sub-sport suppKey found
  if(!suppKey) {
    suppKey = sportId==="cycling"?"cycling":sportId==="running"?"running":sportId==="triathlon"?"running":(sportId==="fitness"||sportId==="hyrox"||sportId==="crossfit_d"||sportId==="kraft")?"fitness":(sportId==="football"||sportId==="fussball")?"fussball":null;
  }

  const lists = suppKey&&SPORT_SUPP[suppKey]?SPORT_SUPP[suppKey]:GENERIC_SUPP;
  // Recovery-Liste immer mitnehmen, aber als OPTIONAL (priority 2). Hochgestuft wird sie in getPersonalizedSupps
  // (Whey ab 85 kg, Ashwagandha bei Erholungs-/Schlafbedarf, Kollagen bei Verletzung).
  const recovery = goalId!=="recovery"?(lists.recovery||[]).map(s=>({...s,priority:Math.max(2,s.priority||2)})):[];
  const specific = [...(lists[goalId]||[]),...recovery];
  return {basis:BASIS, specific};
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────

// Schreibweise: keine Gedankenstriche, nur Bindestriche (auch in KI-Antworten)
const noDash=t=>typeof t==="string"?t.replace(/[ \u00a0][\u2014\u2013][ \u00a0]/g," - ").replace(/[\u2014\u2013]/g,"-"):t;

// Browser-Verlauf: jede Seite und jeder Reiter ist ein Eintrag, damit Zurück (Browser/Handy) zum letzten Screen führt
const NAVH={stack:[],idx:-1,gen:Date.now()}; // gen: Einträge aus früheren Sitzungen (Neuladen, «Neu») haben keine Daten mehr
// Unter-Reiter-Gedächtnis: überlebt das Neu-Aufbauen von Komponenten (z. B. Handy drehen, PRO freischalten)
const UI_STATE={};
// Zurück/Vorwärts: Browser soll die alte Scroll-Position nicht selbst wiederherstellen, die App scrollt nach oben
try{ if(typeof window!=="undefined"&&window.history&&"scrollRestoration" in window.history) window.history.scrollRestoration="manual"; }catch{}
const navPush=(phase,tab)=>{
  NAVH.stack=NAVH.stack.slice(0,NAVH.idx+1); NAVH.stack.push(phase); NAVH.idx=NAVH.stack.length-1;
  try{ window.history.pushState({treyn:1,phase,tab,idx:NAVH.idx,gen:NAVH.gen},""); }catch{}
};
const navReplace=(phase,tab)=>{
  if(NAVH.idx<0){NAVH.stack=[phase];NAVH.idx=0;} else NAVH.stack[NAVH.idx]=phase;
  try{ window.history.replaceState({treyn:1,phase,tab,idx:NAVH.idx,gen:NAVH.gen},""); }catch{}
};

function Logo({size="md"}) {
  // Wortmarke TREYN + Acid-Feld mit schwarzem Plus (kein schwarzes Icon mehr)
  const s=size==="lg"?{f:22,p:21,r:6}:size==="sm"?{f:13,p:13,r:4}:{f:17,p:17,r:5};
  return (
    <div style={{display:"flex",alignItems:"center",gap:Math.round(s.f*.24)}} role="img" aria-label="TREYN+">
      <span style={{fontSize:s.f,fontWeight:600,letterSpacing:"-.03em",fontFamily:"'Inter',sans-serif",lineHeight:1}}>TREYN</span>
      <span style={{width:s.p,height:s.p,background:C.neon,borderRadius:s.r,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <svg width={Math.round(s.p*.62)} height={Math.round(s.p*.62)} viewBox="0 0 10 10" fill="none"><path d="M5 1.2v7.6M1.2 5h7.6" stroke={C.black} strokeWidth="1.9" strokeLinecap="round"/></svg>
      </span>
    </div>
  );
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────

// Startseite: der Bildschirm folgt dem getippten Text automatisch. Scrollt der Nutzer selbst, hört das Mitscrollen auf.
const TW_FOLLOW={on:true};
function TypeWriter({lines, onDone, speed=20, onCountryClick, lang="de"}) {
  const endRef=useRef(null);
  useEffect(()=>{
    TW_FOLLOW.on=true;
    const stop=()=>{TW_FOLLOW.on=false;};
    window.addEventListener("wheel",stop,{passive:true});
    window.addEventListener("touchmove",stop,{passive:true});
    window.addEventListener("keydown",stop);
    return ()=>{window.removeEventListener("wheel",stop);window.removeEventListener("touchmove",stop);window.removeEventListener("keydown",stop);};
  },[]);
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

  // Neue Zeichen bleiben sichtbar: liegt das Textende unter dem Bildschirmrand, wird nachgescrollt
  useEffect(()=>{
    if(!TW_FOLLOW.on||!endRef.current) return;
    const r=endRef.current.getBoundingClientRect();
    const over=r.bottom-(window.innerHeight-32);
    if(over>0) window.scrollBy({top:over,behavior:"smooth"});
  },[displayed]);

  const renderText=(l)=>{
    const clickText="3 Ländern";
    if(done&&l.text.includes(clickText)&&onCountryClick){
      const parts=l.text.split(clickText);
      return <>{parts[0]}<span onClick={onCountryClick} style={{fontWeight:700,color:C.black,textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:3,cursor:"pointer"}}>{clickText}</span>{parts[1]}</>;
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
      <div ref={endRef} style={{height:1}}/>
    </div>
  );
}

// ─── REVIEW-DATEN ─────────────────────────────────────────────────────────────
// Nur echte, nachprüfbare Bewertungen eintragen. Solange leer, zeigt die App nichts an.
// REVIEW_SUMMARY z. B. {rating:"4.9",count:87,source:"Google-Bewertungen",url:"https://..."}
// REVIEWS-Eintrag z. B. {name:"Vorname N.",sport:"Rennrad",stars:5,text:"...",date:"Monat Jahr"}
const REVIEW_SUMMARY=null;
const REVIEWS=[];

// ─── INTRO ────────────────────────────────────────────────────────────────────

// ─── WHY TREYN ─────────────────────────────────────────────────────────────
function WhyTREYN({onNext}) {
  const isMobile=useWindowWidth()<=768;
  React.useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[]);

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:isMobile?"flex-start":"center",background:C.white,padding:isMobile?"32px 20px 40px":"40px",fontFamily:"Inter,sans-serif",overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:520}}>

        {/* Header */}
        <div style={{marginBottom:isMobile?24:40,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo size="lg"/>
        </div>

        {/* Title */}
        <h1 style={{fontSize:isMobile?22:28,fontWeight:600,color:C.black,letterSpacing:"-.03em",lineHeight:1.2,marginBottom:8}}>
          Was, Wie und Wann - kein Raten.<br/>Volles Verständnis über dein Training.
        </h1>
        <p style={{fontSize:14,color:C.g600,lineHeight:1.7,marginBottom:32}}>
          Die präziseste Analyse auf dem Markt - massgeschneidert auf dich.
        </p>

        {/* Key Point 1 - Acid */}
        <div style={{background:C.neon,borderRadius:12,padding:isMobile?"12px 14px":"14px 18px",marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:C.black,letterSpacing:"-.01em",marginBottom:4}}>
            Das richtige Gel, Protein oder Magnesium - zur richtigen Zeit.
          </div>
          <div style={{fontSize:12,color:"rgba(0,0,0,.65)",lineHeight:1.65}}>
            TREYN+ berechnet alles exakt - Sport, Intensität, Gewicht, Schlaf, Job, Körperzusammensetzung. Kein anderes Tool macht das.
          </div>
        </div>

        {/* Key Point 2 - Acid */}
        <div style={{background:C.neonDim,border:`1px solid ${C.neonBorder}`,borderRadius:12,padding:isMobile?"12px 14px":"14px 18px",marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"#3A6000",letterSpacing:"-.01em",marginBottom:4}}>
            Aus 22 Datenpunkten. 50+ Sportdisziplinen. 16 Berechnungsmodelle. MET-2024 Standard.
          </div>
          <div style={{fontSize:12,color:C.g700,lineHeight:1.65}}>
            Erfahre alles über deinen Körper, deine Leistung und optimale Verbrauchswerte. Job-Aktivität, Sonnenlicht, Koffein-Toleranz, Zyklusphase, Schlafqualität - alles einberechnet. Präziser als jede andere Plattform.
          </div>
        </div>

        {/* Key Point 3 - Plan */}
        <div style={{background:C.white,border:`1px solid ${C.g200}`,borderRadius:12,padding:isMobile?"12px 14px":"14px 18px",marginBottom:28}}>
          <div style={{fontSize:isMobile?10:11,fontWeight:700,color:C.black,marginBottom:10,letterSpacing:"-.01em"}}>Du erhältst einen vollständigen, übersichtlichen Plan.</div>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
            {[
              {title:"Alle Zahlen",desc:"Kalorien, Protein, Elektrolyte, VO₂max + 8 weitere"},
              {title:"Supplemente",desc:"Dosis, Timing & Begründung"},
              {title:"Sportnahrung",desc:"Gel, Riegel oder Drink"},
              {title:"Tagesplan",desc:"Trainings- & Ruhetage"},
              {title:"Wettkampf",desc:"Race-Day Strategie"},
            ].map((item,i)=>(
              <div key={i} style={{background:C.g100,borderRadius:8,padding:"6px 10px"}}>
                <span style={{fontSize:11,color:C.black,lineHeight:1.5}}>
                  <span style={{fontWeight:700}}>{item.title}:</span> {item.desc}
                </span>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:C.g400,borderTop:`1px solid ${C.g200}`,paddingTop:8}}>
            Auf dich berechnet - kein generischer Plan.
          </div>
        </div>

        {/* Trennlinie */}
        <div style={{width:1,height:isMobile?16:24,background:C.g200,margin:isMobile?"0 0 14px 1px":"0 0 20px 1px"}}/>

        {/* CTA */}
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button className="btn btn-neon" style={{fontSize:15,padding:"14px 28px",width:isMobile?"100%":"auto"}} onClick={onNext}>
            Analyse starten →
          </button>
          {!isMobile&&<span style={{fontSize:12,color:C.g500,fontWeight:500}}>Kostenlos starten</span>}
        </div>
        {isMobile&&<div style={{marginTop:8,fontSize:12,color:C.g500,textAlign:"center"}}>Kostenlos starten</div>}

      </div>
    </div>
  );
}


function Intro({onNext, onDemo}) {
  const isMobile=useWindowWidth()<=768;
  const [logoVisible,setLogoVisible]=useState(false);
  const [typing,setTyping]=useState(false);
  const [btnVisible,setBtnVisible]=useState(false);
  const [showCountries,setShowCountries]=useState(false);
  const btnRef=useRef(null);
  useEffect(()=>{
    if(!btnVisible||!TW_FOLLOW.on) return;
    const t=setTimeout(()=>{ btnRef.current?.scrollIntoView({behavior:"smooth",block:"end"}); },350);
    return ()=>clearTimeout(t);
  },[btnVisible]);
  useEffect(()=>{
    const t1=setTimeout(()=>setLogoVisible(true),300);
    const t2=setTimeout(()=>setTyping(true),800);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);

  const COUNTRIES_LIST=[
    {name:"Schweiz"},
    {name:"Deutschland"},
    {name:"Österreich"},
  ];

  const DE_LINES=[
    {text:"Die präziseste Analyse für Vitamine, Supplemente & Sportnahrung. Berechnet aus deinen Daten.",size:27,weight:600,tracking:"-.03em",color:C.black,leading:1.2,mb:6,delay:180},
    {text:"Die meisten Sportler raten. TREYN+ berechnet und erklärt dir jeden Wert. Aus 50+ Disziplinen · 22 Datenpunkten · 16 Berechnungsmodellen · MET-2024 Standard.",size:13,weight:400,color:C.g800,leading:1.6,mb:24,delay:200},
    {text:"56% aller Sportler haben zu wenig Vitamin D im Blut.",size:13,weight:600,color:C.black,leading:1.4,mb:4,highlight:true,delay:220},
    {text:"81% der Fussball- und Basketballspieler: Vitamin D-Mangel - obwohl sie regelmässig Sport treiben. (Frontiers in Nutrition, 2021)",size:13,weight:400,color:C.g600,leading:1.65,mb:18,delay:180},
    {text:"Nur 40% der Freizeitsportler supplementieren überhaupt.",size:13,weight:600,color:C.black,leading:1.4,mb:4,highlight:true,delay:220},
    {text:"Der Rest hofft, dass die Ernährung reicht. Tut sie nicht - besonders nicht bei intensivem Training. (PubMed, 2018)",size:13,weight:400,color:C.g600,leading:1.65,mb:20,delay:180},
    {text:"Anhand deiner Daten berechnet TREYN+ deine Bedarfswerte, Supplemente & Sportnahrung - präziser als jede andere Plattform. Verfügbar in der Schweiz, Deutschland und Österreich.",size:13,weight:400,color:C.g800,leading:1.7,mb:4,delay:160},
  ];
  const lines=DE_LINES;

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:isMobile?"flex-start":"center",background:C.white,padding:isMobile?"32px 20px 40px":40}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div style={{marginBottom:isMobile?32:52,opacity:logoVisible?1:0,transform:logoVisible?"scale(1) translateY(0)":"scale(0.75) translateY(10px)",transition:"all .55s cubic-bezier(.34,1.56,.64,1)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo size="lg"/>
            <span style={{fontSize:11,fontWeight:600,fontFamily:"Inter,sans-serif",background:"#F0F0EE",color:"#888",padding:"3px 8px",borderRadius:5}}>Beta</span>
          </div>
        </div>
        {typing&&<TypeWriter lines={lines} speed={13} onDone={()=>setBtnVisible(true)} onCountryClick={()=>setShowCountries(true)}/>}
        {btnVisible&&(
          <>
            <div ref={btnRef} style={{animation:"fadeUp .5s .1s ease forwards",opacity:0,marginTop:24,scrollMarginBottom:24}}>
              <div style={{width:1,height:28,background:C.g200,margin:"0 0 22px 1px"}}/>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <button className="btn btn-neon" style={{fontSize:15,padding:"14px 28px",width:isMobile?"100%":"auto"}} onClick={onNext}>Analyse starten →</button>
                {!isMobile&&<span style={{fontSize:12,color:C.g600,fontWeight:500}}>Kostenlos starten</span>}
              </div>
              {isMobile&&<div style={{marginTop:8,fontSize:12,color:C.g600,textAlign:"center"}}>Kostenlos starten</div>}
            </div>
            {REVIEW_SUMMARY&&(
              <div style={{marginTop:20,paddingTop:16,borderTop:`0.5px solid ${C.g100}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <ReviewStars n={5} size={11}/>
                  <span style={{fontSize:11,color:C.g500,fontWeight:500}}>{REVIEW_SUMMARY.rating}</span>
                  <span style={{fontSize:11,color:C.g400}}>· {REVIEW_SUMMARY.count} {REVIEW_SUMMARY.source||"Bewertungen"}</span>
                </div>
              </div>
            )}
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
                <div style={{fontSize:11,color:C.g400,marginTop:2}}>CH · DE · AT</div>
              </div>
              <button className="icon-btn" aria-label="Schliessen" onClick={()=>setShowCountries(false)} style={{width:26,height:26,borderRadius:"50%",border:`1px solid ${C.g200}`,background:C.g100,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif"}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.g600} strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6}}>
              {COUNTRIES_LIST.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",padding:"7px 10px",borderRadius:8,background:i===0?C.neonDim:C.g100,border:i===0?`1px solid ${C.neonBorder}`:"none"}}>
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

function Demo({onNext, onDemo, lang="de"}) {
  setGlobalLang(lang);
  const isMobile=useWindowWidth()<=768;
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:isMobile?"flex-start":"center",background:C.white,padding:isMobile?"32px 20px 40px":"40px 24px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div className="fu" style={{marginBottom:isMobile?28:40}}><Logo size="lg"/></div>
        <h2 className="fu2" style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:6,lineHeight:1.2,color:C.black}}>Deine Analyse in 5 Schritten.</h2>
        <p className="fu3" style={{fontSize:14,color:C.g600,marginBottom:28,lineHeight:1.65}}>5 Minuten Eingabe. Deine Angaben bleiben lokal in deinem Browser gespeichert. Aus einer riesigen Datenbank & Shops empfehlen wir die für dich besten Produkte.</p>
        <div className="fu3" style={{display:"grid",gridTemplateColumns:isMobile?"repeat(5,minmax(64px,1fr))":"repeat(5,minmax(0,1fr))",gap:6,marginBottom:20,overflowX:isMobile?"auto":"visible",paddingBottom:isMobile?6:0}}>
          {/* Step 1 */}
          <div style={{background:C.white,borderRadius:12,border:`0.5px solid ${C.g200}`,padding:"12px 10px"}}>
            <div style={{background:C.black,color:C.neon,fontSize:10,fontWeight:700,width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>1</div>
            <div style={{fontSize:11,fontWeight:500,color:C.black,marginBottom:8,lineHeight:1.3}}>Sportarten</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <div style={{fontSize:10,color:C.black,padding:"3px 6px",background:C.neon,borderRadius:5,fontWeight:600,textAlign:"center"}}>Radsport ✓</div>
              <div style={{fontSize:10,color:C.g400,padding:"3px 6px",border:`0.5px solid ${C.g200}`,borderRadius:5,textAlign:"center"}}>Laufen</div>
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
            <div style={{fontSize:9,color:C.g400}}>Jahrgang 1990</div>
          </div>
          {/* Step 4 */}
          <div style={{background:C.white,borderRadius:12,border:`0.5px solid ${C.g400}`,padding:"12px 10px"}}>
            <div style={{background:C.black,color:C.neon,fontSize:10,fontWeight:700,width:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>4</div>
            <div style={{fontSize:11,fontWeight:500,color:C.black,marginBottom:8,lineHeight:1.3}}>Analyse</div>
            <div style={{marginBottom:5}}>
              <div style={{fontSize:9,color:C.g400,marginBottom:2}}>Grundumsatz</div>
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
            <div style={{fontSize:9,background:C.neon,color:C.black,padding:"3px 6px",borderRadius:4,fontWeight:600,textAlign:"center"}}>6 Produkte ↗</div>
          </div>
        </div>
        <div className="fu4" style={{display:"flex",alignItems:"center",marginBottom:16}}>
          <div style={{height:1,flex:1,background:C.g200}}/>
          <div style={{fontSize:11,color:C.g400,padding:"0 12px"}}>5 Minuten Eingabe</div>
          <div style={{height:1,flex:1,background:C.g200}}/>
        </div>

        {/* Platform Stats */}
        <div className="fu4" style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(4,minmax(0,1fr))",gap:6,marginBottom:16}}>
          {[
            {val:"50+",  label:"Sport­dis­zip­linen"},
            {val:"22",   label:"Daten­punkte pro User"},
            {val:"16",   label:"Berechnungs­modelle"},
            {val:"MET",  label:"2024 Standard"},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"10px 6px",borderRadius:10,background:"#F8F8F8",border:`1px solid ${C.g200}`}}>
              <div style={{fontSize:16,fontWeight:700,color:C.black,letterSpacing:"-.02em"}}>{s.val}</div>
              <div style={{fontSize:9,color:C.g600,lineHeight:1.4,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="fu5">
          <button className="btn btn-neon" style={{width:"100%",fontSize:15,padding:"14px"}} onClick={onNext}>Kostenlose Analyse starten →</button>
        </div>
      </div>
    </div>
  );
}


// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w,setW]=useState(()=>typeof window!=="undefined"?window.innerWidth:1024);
  useEffect(()=>{
    const fn=()=>setW(window.innerWidth);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);
  return w;
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

function ReviewStars({n=5,size=12}){
  return (
    <span role="img" aria-label={`${n} von 5 Sternen`} style={{display:"inline-flex",alignItems:"center",gap:1,flexShrink:0}}>
      {Array.from({length:n},(_,i)=>(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#F5A623" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>
      ))}
    </span>
  );
}

function ReviewsRow(){
  if(!REVIEW_SUMMARY) return null;
  return (
    <div style={{marginTop:16,display:"flex",alignItems:"center",gap:8}}>
      <ReviewStars n={5} size={11}/>
      <span style={{fontSize:11,color:C.g500,fontWeight:500}}>{REVIEW_SUMMARY.rating}</span>
      <span style={{fontSize:11,color:C.g400}}>· {REVIEW_SUMMARY.count} {REVIEW_SUMMARY.source||"Bewertungen"}</span>
    </div>
  );
}

function ReviewsCompact(){
  const r=(REVIEWS||[])[0];
  if(!r?.text) return null;
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 0",borderTop:`0.5px solid ${C.g100}`}}>
      <ReviewStars n={5} size={10}/>
      <div style={{fontSize:11,color:C.g400,lineHeight:1.5,fontStyle:"italic"}}>"{r.text.slice(0,80)}…" - {r.name}</div>
    </div>
  );
}


// ─── i18n TRANSLATION SYSTEM ──────────────────────────────────────────────────
const TRANSLATIONS={
  de:{
    // NAV & GLOBAL
    nav_neue_analyse:"Neue Analyse",
    nav_pro:"PRO",
    nav_hallo:"Hallo",
    nav_unternehmen:"Für Unternehmen →",

    // INTRO
    intro_start:"Analyse starten →",
    intro_free:"Kostenlos starten",
    intro_b2b:"Für Unternehmen →",
    intro_countries:"Verfügbare Länder",
    intro_countries_sub:"CH · DE · AT",
    intro_close:"Schliessen",

    // DEMO
    demo_title:"So funktioniert TREYN+",
    demo_basic_title:"Basicdaten - sofort sichtbar",
    demo_basic_desc:"Energieverbrauch, Wasser & Trainingseinheiten/Jahr - sofort sichtbar. Keine Kreditkarte.",
    demo_pro_title:"PRO - alles freigeschaltet",
    demo_pro_desc:"Alle Daten, alle Empfehlungen - inkl. Elektrolyte, VO₂max, Kohlenhydrate/h, Produkten, Dosierungen & Tagesplan. Jederzeit aktivierbar.",
    demo_cta:"Kostenlose Analyse entdecken →",

    // ONBOARDING STEPS
    step_weiter:"Weiter →",
    step_zurueck:"← Zurück",
    step_sport_title:"Welche Sportarten betreibst du?",
    step_sport_sub:"Mehrfachauswahl möglich - wähle alle aktiven Sportarten.",
    step_training_title:"Wie trainierst du?",
    step_profil_title:"Dein Profil",
    step_lebensstil_title:"Lebensstil & Kontext",
    step_allergien_title:"Allergien & Ernährung",
    step_praeferenzen_title:"Deine Präferenzen",
    step_willkommen_title:"Bereit.",

    // RESULTS NAV
    tab_summary:"Übersicht",
    tab_zahlen:"Deine Zahlen",
    tab_tagesplan:"Tagesplan",
    tab_empfehlungen:"Empfehlungen",
    tab_protokolle:"Protokolle",
    tab_wettkampf:"Wettkampf",
    tab_einkauf:"Einkauf",
    tab_aichat:"AI Chat",
    tab_profil:"Profil",
    tab_kontakt:"Kontakt & Impressum",

    // SUMMARY
    summary_progress_label:"Deine Analyse · Basic",
    summary_progress_pct:"30% sichtbar",
    summary_locked:"Vollständige Analyse - gesperrt",
    summary_upgrade_title:"Alles was du brauchst. Einmalig. Für 6 Monate.",
    summary_upgrade_price:"CHF 12.90",
    summary_upgrade_period:"/ 6 Monate · CHF 2.15/Mt.",
    summary_upgrade_cta:"Jetzt PRO freischalten →",
    summary_free_cta:"Kostenlos weiter",
    summary_no_sub:"Kein Passwort · Kein Abo · Jederzeit erneuerbar",

    // EMPFEHLUNGEN TABS
    emp_supplements:"Supplements",
    emp_nahrung:"Sportnahrung",
    emp_mahlzeiten:"Mahlzeiten",
    emp_hydration:"Hydration",
    emp_recovery:"Recovery Gear",
    emp_wearables:"Wearables",

    // WEARABLES
    wear_why_title:"Warum ein Wearable deine TREYN+ Analyse verbessert",
    wear_science:"TREYN+ berechnet mit MET-Werten und deinen Angaben. Mit echten Wearable-Daten (HRV, VO₂max, Schlafphasen) wird die Berechnung noch präziser.",

    // HYDRATION
    hyd_during:"Hydration während dem Tag",
    hyd_during_sub:"Wasser ist öde? Diese Produkte machen Trinken zum Erlebnis.",
    hyd_after:"Nach dem Training",
    hyd_after_sub:"Recovery-Drinks die wirklich funktionieren.",
    hyd_science:"Wissenschaft",

    // COMMON
    top_pick:"Top Pick",
    pro_locked:"PRO",
    affiliate_badge:"Top Pick",
    discover:"Entdecken ↗",
    buy:"Kaufen →",
    more_show:"weitere anzeigen",
    less_show:"Weniger anzeigen",
    mandatory:"Zwingend",
    optional:"Optional",

    // PROFIL
    profil_title:"Profil",
    profil_sub:"Deine persönlichen Angaben anpassen.",
    profil_personal:"Persönliche Daten",
    profil_edit:"Bearbeiten",
    profil_save:"Speichern",
    profil_cancel:"Abbrechen",
    profil_abo:"Abo-Status",
    profil_basic:"Basic",
    profil_upgrade:"Auf PRO upgraden",

    // KONTAKT
    kontakt_title:"Kontakt & Impressum",
    kontakt_sub:"Fragen, Feedback oder rechtliche Informationen.",
    kontakt_datenschutz:"Datenschutz",
    kontakt_nutzung:"Nutzungsbedingungen",
    kontakt_violations:"Verstösse melden:",
    kontakt_b2b_title:"Für Unternehmen & Partner",
    kontakt_b2b_sub:"Widget · API · White-Label",
    kontakt_b2b_btn:"Mehr →",

    // TAGESPLAN
    tagesplan_title:"Tagesplan",
    tagesplan_sub:"Dein personalisierter Supplement- und Ernährungsplan.",
    tagesplan_ziele:"Tagesziele",

    // PROTOKOLLE
    protokoll_title:"Protokolle",
    protokoll_sub:"Einnahme-Protokolle für deine Supplements.",
    protokoll_timing:"Einnahme-Timing",
    protokoll_dauer:"Dauer",
    protokoll_pause:"Pause",
    protokoll_hinweis:"Wichtiger Hinweis",

    // WETTKAMPF
    wettkampf_title:"Wettkampf",
    wettkampf_sub:"Race-Day Strategie - personalisiert auf dein Profil.",
    wettkampf_no_comp:"Kein Wettkampf aktiviert",
    wettkampf_no_comp_desc:"Aktiviere 'Wettkämpfe' in deinen Trainingsangaben.",

    // EINKAUF
    einkauf_title:"Einkauf",
    einkauf_sub:"Dein Warenkorb und Bluttest - alles an einem Ort.",
    einkauf_bluttest:"Bluttest",
    einkauf_bluttest_sub:"Echte Laborwerte direkt in deine Berechnungen.",

    // AI CHAT
    aichat_title:"TREYN AI Chat",
    aichat_sub:"Stelle Fragen zu deinen Daten, Supplements und Ernährung.",

    // UPGRADE
    upgrade_title:"PRO freischalten",
    upgrade_per_month:"/ Mt.",
    sport_cycling:"Rennrad",
    sport_running:"Laufen",
    sport_triathlon:"Triathlon", 
    sport_swimming:"Schwimmen",
    sport_fitness:"Fitness",
    sport_ski:"Ski",
    summary_hello:"Hallo",
    summary_your_analysis:"Deine Analyse",
    summary_energy:"Energie",
    summary_protein:"Protein",
    summary_water:"Wasser",
    summary_sleep:"Schlaf",
    summary_per_day:"/ Tag",
    summary_daily:"täglich",
    summary_rest_day:"Ruhetag",
    summary_training_day:"Trainingstag",
    summary_unlocked:"Bereit für die vollständige Analyse?",
    summary_unlock_desc:"8 weitere Werte, 198 Supplement-Optionen, Tagesplan, Race-Day Strategie - vollständig berechnet auf deinen Körper, dein Training und deinen Lifestyle.",
    summary_one_time:"Einmalig · Jederzeit erneuerbar",
    summary_no_cc:"Kein Passwort · Kein Abo · Jederzeit erneuerbar",
    intensity_low:"Leicht",
    intensity_medium:"Mittel",
    intensity_high:"Intensiv",
    intensity_competition:"Wettkampf",
    time_morning:"Morgentraining",
    time_midday:"Mittagstraining",
    time_afternoon:"Nachmittagstraining",
    time_evening:"Abendtraining",
    zahlen_energie:"Energie",
    zahlen_makros:"Makronährstoffe",
    zahlen_grundumsatz:"Grundumsatz",
    zahlen_tagesbedarf:"Tagesbedarf (Training)",
    zahlen_protein:"Protein / Tag",
    zahlen_carbs:"Kohlenhydrate / Day",
    zahlen_fat:"Fett / Tag",
    zahlen_elektrolyte:"Elektrolyte & Flüssigkeit",
    zahlen_leistung:"Leistung & Herzfrequenz-Zonen",
    zahlen_sport:"Deine Sportarten",
    zahlen_anpassen:"Anpassen",
    zahlen_fertig:"✓ Fertig",
    zahlen_weekly:"× / Woche",
    zahlen_kcal:"kcal",
    zahlen_training_weekly:"Training / Woche",
    race_3days:"3 Tage vorher",
    race_day_before:"Tag vorher",
    race_morning:"Race Morning",
    race_during:"Während Wettkampf",
    race_after:"Post-Race Recovery",
    race_note:"Diese Strategie ist eine wissenschaftliche Basis-Empfehlung. Teste alle Protokolle im Training bevor du sie im Wettkampf anwendest.",
    plan_wakeup:"Aufwachen",
    plan_preworkout:"Pre-Workout",
    plan_training:"Training",
    plan_postworkout:"Post-Workout",
    plan_lunch:"Mittag",
    plan_evening:"Abend",
    plan_sleep:"Vor dem Schlafen",
    kontakt_contact:"Kontakt",
    kontakt_privacy:"Datenschutz",
    kontakt_terms:"Nutzungsbedingungen",
    profil_status:"Abo-Status",
    profil_age:"Jahre",
    profil_height:"cm",
    profil_weight:"kg",
    // SPORT GROUPS
    sport_cycling:"Radsport",sport_running:"Laufen",sport_triathlon:"Triathlon",
    sport_swimming:"Schwimmen",sport_fitness:"Fitness",sport_ski:"Ski",
    sport_langlauf:"Langlauf",sport_tennis:"Tennis / Padel",
    sport_leichtathletik:"Leichtathletik",sport_kampfsport:"Kampfsport",
    sport_basketball:"Basketball",sport_handball:"Hand-/Volleyball",
    sport_golf:"Golf",sport_klettern:"Klettern",

    // STEP SPORT
    step_sport_title:"Welche Sportarten betreibst du?",
    step_sport_sub:"Mehrfachauswahl möglich - wähle alle aktiven Sportarten.",
    step_sport_hint:"Tippe auf eine Sportart um Details zu wählen.",
    step_sport_next1:"Disziplin wählen →",
    step_sport_next:"Weiter →",
    step_sport_back:"← Zurück",
    step_sport_missing:"Bitte wähle eine Disziplin:",
    step_sport_health:"Nur Gesundheit & Allgemein",
    step_sport_health_sub:"Keine spezifischen Sportarten - Fokus auf Grundgesundheit",

    // STEP TRAINING
    step_training_title:"Wie trainierst du?",
    step_training_days:"Trainingstage / Woche",
    step_training_duration:"Dauer pro Einheit",
    step_training_intensity:"Intensität",
    step_training_intensity_low:"Leicht",
    step_training_intensity_low_desc:"Erholung, Basis",
    step_training_intensity_medium:"Mittel",
    step_training_intensity_medium_desc:"Normales Training",
    step_training_intensity_high:"Intensiv",
    step_training_intensity_high_desc:"Strukturiert, hart",
    step_training_intensity_comp:"Wettkampf",
    step_training_intensity_comp_desc:"Rennen, Wettkämpfe",
    step_training_comp:"Wettkämpfe?",
    step_training_comp_yes:"Ja",
    step_training_comp_no:"Nein",
    step_training_comp_count:"Wettkämpfe pro Jahr",
    step_training_time:"Trainingszeit",
    step_training_time_morning:"Morgens (6-10h)",
    step_training_time_midday:"Mittags (11-14h)",
    step_training_time_afternoon:"Nachmittags (15-18h)",
    step_training_time_evening:"Abends (19-22h)",
    step_training_sweat:"Schweissrate",
    step_training_sweat_low:"Niedrig",
    step_training_sweat_medium:"Mittel",
    step_training_sweat_high:"Hoch",
    step_training_sweat_very_high:"Sehr hoch",
    step_training_minutes:"Minuten",

    // STEP PROFIL
    step_profil_title:"Dein Profil",
    step_profil_firstname:"Vorname",
    step_profil_lastname:"Nachname",
    step_profil_email:"E-Mail",
    step_profil_country:"Land",
    step_profil_platform:"Wearable / Plattform",
    step_profil_gender:"Geschlecht",
    step_profil_gender_m:"Männlich",
    step_profil_gender_f:"Weiblich",
    step_profil_gender_d:"Divers",
    step_profil_birthyear:"Geburtsjahr",
    step_profil_weight:"Gewicht (kg)",
    step_profil_height:"Grösse (cm)",
    step_profil_rhr:"Ruhepuls (optional)",
    step_profil_sleep:"Schlaf pro Nacht (h)",
    step_profil_optional:"optional",
    step_profil_import:"Daten importieren",

    // STEP LEBENSSTIL
    step_ls_title:"Lebensstil & Kontext",
    step_ls_goal:"Primäres Ziel",
    step_ls_goal_performance:"Leistung steigern",
    step_ls_goal_muscle:"Muskelaufbau",
    step_ls_goal_endurance:"Ausdauer verbessern",
    step_ls_goal_weightloss:"Gewicht reduzieren",
    step_ls_goal_health:"Gesundheit & Longevity",
    step_ls_goal_recovery:"Regeneration",
    step_ls_recovery:"Erholungsstatus",
    step_ls_recovery_excellent:"Ausgezeichnet",
    step_ls_recovery_good:"Gut",
    step_ls_recovery_tired:"Müde / akkumuliert",
    step_ls_recovery_injured:"Verletzung / Pause",
    step_ls_stress:"Stresslevel",
    step_ls_stress_low:"Sehr niedrig",
    step_ls_stress_medium:"Mittel",
    step_ls_stress_high:"Hoch",
    step_ls_diet:"Ernährungsqualität",
    step_ls_diet_poor:"Wenig ausgewogen",
    step_ls_diet_average:"Durchschnittlich",
    step_ls_diet_good:"Gut ausgewogen",
    step_ls_diet_excellent:"Sehr gut / Profi",
    step_ls_altitude:"Trainingsumgebung",
    step_ls_altitude_low:"Unter 800m",
    step_ls_altitude_medium:"800-1500m",
    step_ls_altitude_high:"1500-2500m",
    step_ls_altitude_alpine:"2500m+",
    step_ls_injuries:"Verletzungen / Beschwerden",
    step_ls_injuries_none:"Keine",
    step_ls_injuries_knee:"Knie",
    step_ls_injuries_back:"Rücken",
    step_ls_injuries_shoulder:"Schulter",
    step_ls_injuries_ankle:"Sprunggelenk",
    step_ls_injuries_tendon:"Sehnen",
    step_ls_injuries_muscle:"Muskel",
    step_ls_supps:"Aktuelle Supplements",
    step_ls_supps_none:"Keine",
    step_ls_meds:"Medikamente",
    step_ls_meds_none:"Keine",
    step_ls_meds_blood:"Blutverdünner",
    step_ls_meds_thyroid:"Schilddrüse",
    step_ls_meds_bp:"Blutdruck",
    step_ls_budget:"Monatliches Budget",
    step_ls_budget_low:"Bis CHF 30",
    step_ls_budget_medium:"CHF 30-80",
    step_ls_budget_high:"CHF 80-150",
    step_ls_budget_max:"Kein Limit",

    // STEP ALLERGIEN
    step_al_title:"Allergien & Ernährung",
    step_al_sub:"Damit TREYN+ kompatible Produkte empfiehlt.",
    step_al_none:"Keine Allergien / Unverträglichkeiten",
    step_al_diet_title:"Ernährungsform",
    step_al_diet_none:"Keine Einschränkung",
    step_al_diet_vegan:"Vegan",
    step_al_diet_vegetarian:"Vegetarisch",
    step_al_diet_glutenfree:"Glutenfrei",
    step_al_diet_lactosefree:"Laktosefrei",
    step_al_diet_keto:"Keto / Low Carb",
    step_al_diet_halal:"Halal",

    // STEP PRAEFERENZEN
    step_pref_title:"Deine Präferenzen",
    step_pref_supp_form:"Supplement-Form",
    step_pref_supp_kapsel:"Kapseln / Tabletten",
    step_pref_supp_pulver:"Pulver",
    step_pref_supp_beides:"Beides",
    step_pref_energy_form:"Sportnahrung bevorzugt",
    step_pref_protein_form:"Protein-Präferenz",
    step_pref_protein_whey:"Whey",
    step_pref_protein_plant:"Pflanzlich",
    step_pref_protein_both:"Beides",

    // STEP WILLKOMMEN
    step_welcome_title:"Bereit.",
    step_welcome_sub:"Deine Analyse wird jetzt berechnet.",
    step_welcome_basic:"Basicdaten sofort sichtbar",
    step_welcome_basic_desc:"Energieverbrauch, Wasser & Trainingseinheiten - kostenlos.",
    step_welcome_pro:"PRO freischalten",
    step_welcome_pro_desc:"Alle Empfehlungen, Dosierungen & Tagesplan.",
    step_welcome_cta:"Analyse ansehen →",
    step_welcome_calculating:"Berechne dein Profil...",

    // ANALYSE PREVIEW
    preview_title:"Deine Analyse ist bereit.",
    preview_upgrade:"PRO freischalten - CHF 12.90 / 6 Mt.",
    preview_free:"Kostenlos weiter",
    preview_features_title:"Was du mit PRO bekommst:",
    preview_no_sub:"Kein Abo · Einmalig · Jederzeit erneuerbar",
  },

  en:{
    // NAV & GLOBAL
    nav_neue_analyse:"New Analysis",
    nav_pro:"PRO",
    nav_hallo:"Hi",
    nav_unternehmen:"For Business →",

    // INTRO
    intro_start:"Start analysis →",
    intro_free:"Free to start.",
    intro_b2b:"For Business →",
    intro_countries:"Available countries",
    intro_countries_sub:"CH · DE · AT",
    intro_close:"Close",

    // DEMO
    demo_title:"How TREYN+ works",
    demo_basic_title:"Basic data - instantly visible",
    demo_basic_desc:"Energy expenditure & basal metabolic rate - instantly. No credit card.",
    demo_pro_title:"PRO - everything unlocked",
    demo_pro_desc:"All data, all recommendations - incl. electrolytes, VO₂max, carbs/h, products, dosages & daily plan. Unlock anytime.",
    demo_cta:"Discover your free analysis →",

    // ONBOARDING STEPS
    step_weiter:"Continue →",
    step_zurueck:"← Back",
    step_sport_title:"Which sports do you practise?",
    step_sport_sub:"Multiple selection - choose all active sports.",
    step_training_title:"How do you train?",
    step_profil_title:"Your Profile",
    step_lebensstil_title:"Lifestyle & Context",
    step_allergien_title:"Allergies & Nutrition",
    step_praeferenzen_title:"Your Preferences",
    step_willkommen_title:"Ready.",

    // RESULTS NAV
    tab_summary:"Summary",
    tab_zahlen:"Your Numbers",
    tab_tagesplan:"Daily Plan",
    tab_empfehlungen:"Recommendations",
    tab_protokolle:"Protocols",
    tab_wettkampf:"Race Day",
    tab_einkauf:"Shop",
    tab_aichat:"AI Chat",
    tab_profil:"Profile",
    tab_kontakt:"Contact & Legal",

    // SUMMARY
    summary_progress_label:"Your analysis · Basic",
    summary_progress_pct:"30% visible",
    summary_locked:"Full analysis - locked",
    summary_upgrade_title:"Everything you need. Once. For 6 months.",
    summary_upgrade_price:"CHF 12.90",
    summary_upgrade_period:"/ 6 months · CHF 2.15/mo.",
    summary_upgrade_cta:"Unlock PRO now →",
    summary_free_cta:"Continue free",
    summary_no_sub:"No password · No subscription · Renew anytime",

    // EMPFEHLUNGEN TABS
    emp_supplements:"Supplements",
    emp_nahrung:"Sports Nutrition",
    emp_mahlzeiten:"Meals",
    emp_hydration:"Hydration",
    emp_recovery:"Recovery Gear",
    emp_wearables:"Wearables",

    // WEARABLES
    wear_why_title:"Why a wearable improves your TREYN+ analysis",
    wear_science:"TREYN+ calculates with MET values and your inputs. With real wearable data (HRV, VO₂max, sleep stages) the calculation becomes even more precise.",

    // HYDRATION
    hyd_during:"Hydration during the day",
    hyd_during_sub:"Water boring? These products make drinking enjoyable.",
    hyd_after:"After training",
    hyd_after_sub:"Recovery drinks that actually work.",
    hyd_science:"Science",

    // COMMON
    top_pick:"Top Pick",
    pro_locked:"PRO",
    affiliate_badge:"Top Pick",
    discover:"Discover ↗",
    buy:"Buy →",
    more_show:"show more",
    less_show:"Show less",
    mandatory:"Essential",
    optional:"Optional",

    // PROFIL
    profil_title:"Profile",
    profil_sub:"Update your personal details.",
    profil_personal:"Personal Data",
    profil_edit:"Edit",
    profil_save:"Save",
    profil_cancel:"Cancel",
    profil_abo:"Subscription",
    profil_basic:"Basic",
    profil_upgrade:"Upgrade to PRO",

    // KONTAKT
    kontakt_title:"Contact & Legal",
    kontakt_sub:"Questions, feedback or legal information.",
    kontakt_datenschutz:"Privacy Policy",
    kontakt_nutzung:"Terms of Use",
    kontakt_violations:"Report violations:",
    kontakt_b2b_title:"For Business & Partners",
    kontakt_b2b_sub:"Widget · API · White-Label",
    kontakt_b2b_btn:"More →",

    // TAGESPLAN
    tagesplan_title:"Daily Plan",
    tagesplan_sub:"Your personalised supplement and nutrition plan.",
    tagesplan_ziele:"Daily targets",

    // PROTOKOLLE
    protokoll_title:"Protocols",
    protokoll_sub:"Intake protocols for your supplements.",
    protokoll_timing:"Timing",
    protokoll_dauer:"Duration",
    protokoll_pause:"Break",
    protokoll_hinweis:"Important note",

    // WETTKAMPF
    wettkampf_title:"Race Day",
    wettkampf_sub:"Race-day strategy - personalised to your profile.",
    wettkampf_no_comp:"No competition activated",
    wettkampf_no_comp_desc:"Enable 'Competitions' in your training details.",

    // EINKAUF
    einkauf_title:"Shop",
    einkauf_sub:"Your cart and blood test - all in one place.",
    einkauf_bluttest:"Blood Test",
    einkauf_bluttest_sub:"Real lab values directly in your calculations.",

    // AI CHAT
    aichat_title:"TREYN AI Chat",
    aichat_sub:"Ask questions about your data, supplements and nutrition.",

    // UPGRADE
    upgrade_title:"Unlock PRO",
    upgrade_per_month:"/ mo.",
    // SPORT NAMES (shown in SummaryTab tags)
    sport_cycling:"Cycling",
    sport_running:"Running", 
    sport_triathlon:"Triathlon",
    sport_swimming:"Swimming",
    sport_fitness:"Fitness",
    sport_ski:"Skiing",

    // SUMMARY visible strings
    summary_hello:"Hello",
    summary_your_analysis:"Your Analysis",
    summary_energy:"Energy",
    summary_protein:"Protein",
    summary_water:"Water",
    summary_sleep:"Sleep",
    summary_per_day:"per day",
    summary_daily:"daily",
    summary_rest_day:"rest day",
    summary_training_day:"training day",
    summary_unlocked:"Bereit für die vollständige Analyse?",
    summary_unlock_desc:"All locked data cards, supplement dosages, sports nutrition with exact intervals and your personal race-day strategy - 100% calculated for your weight, sport and intensity.",
    summary_one_time:"One-time · Renewable anytime",
    summary_no_cc:"No password · No subscription · Renew anytime",

    // INTENSITY LABELS
    intensity_low:"Easy",
    intensity_medium:"Moderate",
    intensity_high:"Intense",
    intensity_competition:"Race",

    // TRAINING TIME
    time_morning:"Morning training",
    time_midday:"Midday training",
    time_afternoon:"Afternoon training",
    time_evening:"Evening training",

    // DEINE ZAHLEN visible strings
    zahlen_energie:"Energy",
    zahlen_makros:"Macronutrients",
    zahlen_grundumsatz:"Basal metabolic rate",
    zahlen_tagesbedarf:"Daily requirement (training)",
    zahlen_protein:"Protein / day",
    zahlen_carbs:"Carbohydrates / day",
    zahlen_fat:"Fat / day",
    zahlen_elektrolyte:"Electrolytes & Fluids",
    zahlen_leistung:"Performance & Heart Rate Zones",
    zahlen_sport:"Your Sports",
    zahlen_anpassen:"Adjust",
    zahlen_fertig:"✓ Done",
    zahlen_weekly:"× / week",
    zahlen_kcal:"kcal",
    zahlen_training_weekly:"Training / week",

    // WETTKAMPF phases
    race_3days:"3 days before",
    race_day_before:"Day before",
    race_morning:"Race Morning",
    race_during:"During race",
    race_after:"Post-Race Recovery",
    race_note:"This strategy is a science-based recommendation. Test all protocols in training before applying them in competition.",

    // TAGESPLAN phases  
    plan_wakeup:"Wake up",
    plan_preworkout:"Pre-Workout",
    plan_training:"Training",
    plan_postworkout:"Post-Workout",
    plan_lunch:"Lunch",
    plan_evening:"Evening",
    plan_sleep:"Before sleep",

    // KONTAKT
    kontakt_contact:"Contact",
    kontakt_privacy:"Privacy Policy",
    kontakt_terms:"Terms of Use",

    // PROFIL visible
    profil_status:"Subscription Status",
    profil_age:"years",
    profil_height:"cm",
    profil_weight:"kg",
    // SPORT GROUPS
    sport_cycling:"Cycling",sport_running:"Running",sport_triathlon:"Triathlon",
    sport_swimming:"Swimming",sport_fitness:"Fitness",sport_ski:"Skiing",
    sport_langlauf:"Cross-Country Skiing",sport_tennis:"Tennis / Padel",
    sport_leichtathletik:"Athletics",sport_kampfsport:"Martial Arts",
    sport_basketball:"Basketball",sport_handball:"Handball / Volleyball",
    sport_golf:"Golf",sport_klettern:"Climbing",

    // STEP SPORT
    step_sport_title:"Which sports do you practise?",
    step_sport_sub:"Multiple selection - choose all active sports.",
    step_sport_hint:"Tap a sport to choose your discipline.",
    step_sport_next1:"Choose discipline →",
    step_sport_next:"Continue →",
    step_sport_back:"← Back",
    step_sport_missing:"Please select a discipline:",
    step_sport_health:"Health & General only",
    step_sport_health_sub:"No specific sports - focus on general health",

    // STEP TRAINING
    step_training_title:"How do you train?",
    step_training_days:"Training days / week",
    step_training_duration:"Duration per session",
    step_training_intensity:"Intensity",
    step_training_intensity_low:"Easy",
    step_training_intensity_low_desc:"Recovery, base",
    step_training_intensity_medium:"Moderate",
    step_training_intensity_medium_desc:"Regular training",
    step_training_intensity_high:"Intense",
    step_training_intensity_high_desc:"Structured, hard",
    step_training_intensity_comp:"Race",
    step_training_intensity_comp_desc:"Competitions, races",
    step_training_comp:"Competitions?",
    step_training_comp_yes:"Yes",
    step_training_comp_no:"No",
    step_training_comp_count:"Competitions per year",
    step_training_time:"Training time",
    step_training_time_morning:"Morning (6-10am)",
    step_training_time_midday:"Midday (11am-2pm)",
    step_training_time_afternoon:"Afternoon (3-6pm)",
    step_training_time_evening:"Evening (7-10pm)",
    step_training_sweat:"Sweat rate",
    step_training_sweat_low:"Low",
    step_training_sweat_medium:"Medium",
    step_training_sweat_high:"High",
    step_training_sweat_very_high:"Very high",
    step_training_minutes:"minutes",

    // STEP PROFIL
    step_profil_title:"Your Profile",
    step_profil_firstname:"First name",
    step_profil_lastname:"Last name",
    step_profil_email:"Email",
    step_profil_country:"Country",
    step_profil_platform:"Wearable / Platform",
    step_profil_gender:"Gender",
    step_profil_gender_m:"Male",
    step_profil_gender_f:"Female",
    step_profil_gender_d:"Other",
    step_profil_birthyear:"Birth year",
    step_profil_weight:"Weight (kg)",
    step_profil_height:"Height (cm)",
    step_profil_rhr:"Resting heart rate (optional)",
    step_profil_sleep:"Sleep per night (h)",
    step_profil_optional:"optional",
    step_profil_import:"Import data",

    // STEP LEBENSSTIL
    step_ls_title:"Lifestyle & Context",
    step_ls_goal:"Primary goal",
    step_ls_goal_performance:"Improve performance",
    step_ls_goal_muscle:"Build muscle",
    step_ls_goal_endurance:"Improve endurance",
    step_ls_goal_weightloss:"Lose weight",
    step_ls_goal_health:"Health & Longevity",
    step_ls_goal_recovery:"Recovery",
    step_ls_recovery:"Recovery status",
    step_ls_recovery_excellent:"Excellent",
    step_ls_recovery_good:"Good",
    step_ls_recovery_tired:"Tired / accumulated",
    step_ls_recovery_injured:"Injury / break",
    step_ls_stress:"Stress level",
    step_ls_stress_low:"Very low",
    step_ls_stress_medium:"Medium",
    step_ls_stress_high:"High",
    step_ls_diet:"Diet quality",
    step_ls_diet_poor:"Poorly balanced",
    step_ls_diet_average:"Average",
    step_ls_diet_good:"Well balanced",
    step_ls_diet_excellent:"Very good / Pro",
    step_ls_altitude:"Training environment",
    step_ls_altitude_low:"Below 800m",
    step_ls_altitude_medium:"800-1500m",
    step_ls_altitude_high:"1500-2500m",
    step_ls_altitude_alpine:"2500m+",
    step_ls_injuries:"Injuries / complaints",
    step_ls_injuries_none:"None",
    step_ls_injuries_knee:"Knee",
    step_ls_injuries_back:"Back",
    step_ls_injuries_shoulder:"Shoulder",
    step_ls_injuries_ankle:"Ankle",
    step_ls_injuries_tendon:"Tendons",
    step_ls_injuries_muscle:"Muscle",
    step_ls_supps:"Current supplements",
    step_ls_supps_none:"None",
    step_ls_meds:"Medications",
    step_ls_meds_none:"None",
    step_ls_meds_blood:"Blood thinners",
    step_ls_meds_thyroid:"Thyroid",
    step_ls_meds_bp:"Blood pressure",
    step_ls_budget:"Monthly budget",
    step_ls_budget_low:"Up to CHF 30",
    step_ls_budget_medium:"CHF 30-80",
    step_ls_budget_high:"CHF 80-150",
    step_ls_budget_max:"No limit",

    // STEP ALLERGIEN
    step_al_title:"Allergies & Nutrition",
    step_al_sub:"So TREYN+ recommends compatible products.",
    step_al_none:"No allergies / intolerances",
    step_al_diet_title:"Dietary preference",
    step_al_diet_none:"No restriction",
    step_al_diet_vegan:"Vegan",
    step_al_diet_vegetarian:"Vegetarian",
    step_al_diet_glutenfree:"Gluten-free",
    step_al_diet_lactosefree:"Lactose-free",
    step_al_diet_keto:"Keto / Low Carb",
    step_al_diet_halal:"Halal",

    // STEP PRAEFERENZEN
    step_pref_title:"Your Preferences",
    step_pref_supp_form:"Supplement form",
    step_pref_supp_kapsel:"Capsules / Tablets",
    step_pref_supp_pulver:"Powder",
    step_pref_supp_beides:"Both",
    step_pref_energy_form:"Sports nutrition preference",
    step_pref_protein_form:"Protein preference",
    step_pref_protein_whey:"Whey",
    step_pref_protein_plant:"Plant-based",
    step_pref_protein_both:"Both",

    // STEP WILLKOMMEN
    step_welcome_title:"Ready.",
    step_welcome_sub:"Your analysis is being calculated.",
    step_welcome_basic:"Basic data instantly visible",
    step_welcome_basic_desc:"Energy expenditure & basal rate - instant and free.",
    step_welcome_pro:"Unlock PRO",
    step_welcome_pro_desc:"All recommendations, dosages & daily plan.",
    step_welcome_cta:"View analysis →",
    step_welcome_calculating:"Calculating your profile...",

    // ANALYSE PREVIEW
    preview_title:"Your analysis is ready.",
    preview_upgrade:"Unlock PRO - CHF 12.90 / 6 mo.",
    preview_free:"Continue free",
    preview_features_title:"What you get with PRO:",
    preview_no_sub:"No subscription · One-time · Renew anytime",
  },
    en:{
      nav_neue_analyse:"New Analysis",
      nav_pro:"PRO",
      nav_hallo:"Hello",
      nav_unternehmen:"For Companies →",
      intro_start:"Start Analysis →",
      intro_free:"Start for Free",
      intro_b2b:"For Companies →",
      intro_countries:"Available Countries",
      intro_countries_sub:"CH · DE · AT",
      intro_close:"Close",
      demo_title:"How TREYN+ Works",
      demo_basic_title:"Basic Data - instantly visible",
      demo_basic_desc:"Energy consumption & basal metabolic rate. No credit card, no subscription.",
      demo_pro_title:"PRO - everything unlocked",
      demo_pro_desc:"All data, all recommendations - incl. electrolytes, VO₂max, carbs/h, products, dosages & daily plan.",
      demo_cta:"Discover Free Analysis →",
      step_weiter:"Continue →",
      step_zurueck:"← Back",
      step_sport_title:"Which sports do you do?",
      step_sport_sub:"Multiple selection - choose all active sports.",
      step_ls_goal:"Primary Goal",
      step_ls_goal_performance:"Improve Performance",
      step_ls_goal_muscle:"Build Muscle",
      step_ls_goal_endurance:"Improve Endurance",
      step_ls_goal_weightloss:"Lose Weight",
      step_ls_goal_health:"Health & Longevity",
      step_ls_goal_recovery:"Better Recovery",
      step_ls_job:"Activity Level at Work",
      step_ls_job_sedentary:"Sedentary",
      step_ls_job_sedentary_desc:"Office, home office - minimal movement",
      step_ls_job_light:"Lightly Active",
      step_ls_job_light_desc:"Teacher, doctor - standing but little walking",
      step_ls_job_moderate:"Moderately Active",
      step_ls_job_moderate_desc:"Waiter, salesperson - regularly walking",
      step_ls_job_very:"Very Active",
      step_ls_job_very_desc:"Construction, crafts - physical labour",
      step_ls_sleep_hours:"Sleep Duration",
      step_ls_sleep_5:"≤ 5h",
      step_ls_sleep_5_desc:"Chronically low",
      step_ls_sleep_6:"6h",
      step_ls_sleep_6_desc:"Too little",
      step_ls_sleep_7:"7h",
      step_ls_sleep_7_desc:"OK",
      step_ls_sleep_8:"8h+",
      step_ls_sleep_8_desc:"Optimal",
      step_ls_water:"Daily Water Intake",
      step_ls_water_low:"< 1L",
      step_ls_water_low_desc:"Too little",
      step_ls_water_med:"1-2L",
      step_ls_water_med_desc:"Average",
      step_ls_water_good:"2-3L",
      step_ls_water_good_desc:"Good",
      step_ls_water_high:"> 3L",
      step_ls_water_high_desc:"Very good",
      step_ls_sun:"Daily Sunlight",
      step_ls_sun_none:"Barely / indoors",
      step_ls_sun_none_desc:"Office, indoor training, rarely outside",
      step_ls_sun_low:"< 30 min",
      step_ls_sun_low_desc:"Short commute, occasionally outside",
      step_ls_sun_mod:"30-60 min",
      step_ls_sun_mod_desc:"Lunch outside, outdoor training",
      step_ls_sun_high:"> 60 min",
      step_ls_sun_high_desc:"Lots of outdoor training, garden",
      step_ls_caffeine:"Daily Caffeine",
      step_ls_caf_none:"No Caffeine",
      step_ls_caf_none_desc:"Caffeine-free, no tea",
      step_ls_caf_low:"1-2 Coffees",
      step_ls_caf_low_desc:"~100-200mg daily",
      step_ls_caf_med:"3-4 Coffees",
      step_ls_caf_med_desc:"~300-400mg daily",
      step_ls_caf_high:"> 4 Coffees",
      step_ls_caf_high_desc:"> 400mg - high tolerance",
      step_ls_body:"Body Composition",
      step_ls_body_lean:"Very Muscular / Lean",
      step_ls_body_lean_desc:"Low body fat, high muscle mass",
      step_ls_body_athletic:"Athletic",
      step_ls_body_athletic_desc:"Normal athletic body",
      step_ls_body_avg:"Average",
      step_ls_body_avg_desc:"Normal body composition",
      step_ls_body_higher:"Higher Body Fat",
      step_ls_body_higher_desc:"Some excess weight, weight loss goal",
      step_ls_cycle:"Cycle Phase",
      step_ls_cycle_sub:"Affects iron, magnesium and calorie needs significantly",
      step_ls_cycle_follikel:"Follicular Phase",
      step_ls_cycle_follikel_desc:"Day 1-14 - after period, more energy",
      step_ls_cycle_ovulation:"Ovulation",
      step_ls_cycle_ovulation_desc:"Day 14-16 - peak form",
      step_ls_cycle_luteal:"Luteal Phase",
      step_ls_cycle_luteal_desc:"Day 15-28 - more hunger, more magnesium",
      step_ls_cycle_period:"Period",
      step_ls_cycle_period_desc:"Highest iron loss",
      step_ls_cycle_pcos:"PCOS",
      step_ls_cycle_pcos_desc:"Polycystic ovary syndrome",
      step_ls_cycle_menopause:"Menopause / Post",
      step_ls_cycle_menopause_desc:"Different hormonal profile",
      step_ls_stress:"Stress Level",
      step_ls_altitude:"Training Altitude",
      step_ls_altitude_low:"Lowland (< 500m)",
      step_ls_altitude_medium:"Mid-altitude (500-1500m)",
      step_ls_altitude_high:"Alpine (1500-2500m)",
      step_ls_altitude_alpine:"High Alpine (> 2500m)",
      step_ls_recovery:"Recovery Status",
      step_ls_recovery_excellent:"Excellent",
      step_ls_recovery_good:"Good",
      step_ls_recovery_tired:"Tired",
      step_ls_recovery_injured:"Injured / Recovery",
      step_ls_diet:"Diet Quality",
      step_ls_diet_excellent:"Excellent - very clean",
      step_ls_diet_good:"Good - mostly clean",
      step_ls_diet_average:"Average - some processed food",
      step_ls_diet_poor:"Poor - lots of processed food",
      step_ls_injuries:"Current Injuries",
      step_ls_injuries_none:"None",
      step_ls_injuries_knee:"Knee",
      step_ls_injuries_back:"Back",
      step_ls_injuries_shoulder:"Shoulder",
      step_ls_injuries_ankle:"Ankle / Foot",
      step_ls_injuries_muscle:"Muscle",
      step_ls_injuries_tendon:"Tendons",
      step_ls_supps:"Current Supplements",
      step_ls_meds:"Medications",
      step_ls_meds_none:"None",
      step_ls_meds_blutverd:"Blood thinners",
      step_ls_meds_blutdruck:"Blood pressure medication",
      step_ls_meds_schilddruese:"Thyroid medication",
      step_al_title:"Allergies & Intolerances",
      step_al_sub:"So we can exclude unsuitable products.",
      step_al_none:"No allergies",
      step_al_gluten:"Gluten",
      step_al_lactose:"Lactose",
      step_al_nuts:"Nuts",
      step_al_soy:"Soy",
      step_al_egg:"Eggs",
      step_al_fish:"Fish / Seafood",
      step_pref_title:"Your Preferences",
      step_pref_sub:"So your recommendations fit your lifestyle.",
      step_pref_supp_form:"Supplement Form",
      step_pref_form_kapsel:"Capsules",
      step_pref_form_pulver:"Powder",
      step_pref_form_beides:"Both",
      step_pref_energie_form:"Energy Product Form",
      step_pref_gel:"Gel",
      step_pref_riegel:"Bar",
      step_pref_drink:"Drink",
      step_pref_budget:"Monthly Budget (Supplements)",
      step_pref_budget_low:"< CHF 30",
      step_pref_budget_medium:"CHF 30-80",
      step_pref_budget_high:"CHF 80-150",
      step_pref_budget_max:"> CHF 150",
      step_pref_diet_pref:"Diet",
      step_pref_standard:"Standard",
      step_pref_vegan:"Vegan",
      step_pref_vegetarian:"Vegetarian",
      step_pref_keto:"Keto / Low Carb",
      step_will_cta:"Discover Free Analysis →",
      tab_summary:"Summary",
      tab_zahlen:"Your Numbers",
      tab_tagesplan:"Daily Plan",
      tab_empfehlung:"Recommendations",
      tab_protokoll:"Protocols",
      tab_wettkampf:"Race Day",
      tab_einkauf:"Shop",
      tab_aichat:"AI Chat",
      tab_profil:"Profile",
      summary_upgrade_title:"Unlock PRO",
      summary_upgrade_desc:"Your analysis is ready. All values precisely calculated for you.",
      summary_upgrade_price:"CHF 12.90",
      summary_upgrade_period:"/ 6 months · CHF 2.15/mo.",
      summary_upgrade_cta:"Unlock PRO Now →",
      zahlen_bmr:"Basal Metabolic Rate",
      zahlen_training_day:"Training Day",
      zahlen_rest_day:"Rest Day",
      zahlen_water_training:"Water Training Day",
      zahlen_water_rest:"Water Rest Day",
      zahlen_natrium:"Sodium",
      zahlen_magnesium:"Magnesium",
      zahlen_sweat:"Sweat / Session",
      zahlen_vo2max:"VO₂max (est.)",
      zahlen_fat_burn:"Fat Burn Zone",
      plan_title:"Daily Plan",
      plan_training_day:"Training Day",
      plan_rest_day:"Rest Day",
      plan_morning:"Morning",
      plan_pre_workout:"Pre-Workout",
      plan_during:"During Training",
      plan_post_workout:"Post-Workout",
      plan_evening:"Evening",
      emp_title:"Recommendations",
      emp_sub:"100% calculated on your data - supplements, sports nutrition, meals & recovery.",
      emp_supplements:"Supplements",
      emp_nahrung:"Sports Nutrition",
      emp_mahlzeiten:"Meals",
      emp_hydration:"Hydration",
      emp_recovery:"Recovery Gear",
      emp_wearables:"Wearables",
      emp_bluttest:"Blood Test",
      emp_mandatory:"Essential",
      emp_optional:"Optional",
      emp_buy:"Buy ↗",
      emp_owned:"✓ In Cart",
      emp_add:"+ Add to Cart",
      race_title:"Race Day Strategy",
      race_no_comp:"No upcoming competitions selected.",
      race_carb_load:"Carb Loading",
      race_race_morning:"Race Morning",
      race_during:"During Race",
      race_after:"Recovery",
      protokoll_title:"Supplement Protocols",
      protokoll_sub:"Exact intake timing for your supplements.",
      protokoll_empty:"No supplements with protocol data.",
      protokoll_empty_sub:"Go to Recommendations and add supplements.",
      profil_title:"My Profile",
      profil_edit:"Edit",
      profil_save:"Save",
      profil_cancel:"Cancel",
      profil_orders:"Your Orders",
      profil_no_orders:"No orders yet.",
      profil_reset:"Reset Analysis",
      profil_delete:"Delete Account",
      einkauf_title:"Shopping Cart",
      einkauf_sub:"All products grouped by shop - order together and save shipping.",
      einkauf_empty:"Your cart is empty.",
      einkauf_empty_sub:"Go to Recommendations and add products.",
      einkauf_order:"Order at",
      einkauf_remove:"Remove",
      aichat_title:"AI Chat",
      aichat_placeholder:"Ask anything about your analysis...",
      aichat_send:"Send",
      aichat_loading:"Thinking...",
      aichat_error:"Connection error.",
      aichat_sub:"Powered by Claude · Answers based on your personal data",
      bluttest_title:"Blood Test",
      bluttest_sub:"Real lab values - imported directly into your calculations.",
      bluttest_order:"Order Blood Test",
      bluttest_why:"Why a blood test?",
      bluttest_why_desc:"TREYN+ calculates with estimates. Real lab values make the calculation even more precise.",
      wear_title:"Wearables",
      wear_sub:"Why a wearable improves your TREYN+ analysis",
      wear_add:"+ Add to Cart",
      wear_buy:"Buy ↗",
      upgrade_title:"Unlock PRO",
      upgrade_cta:"Unlock PRO →",
      upgrade_no_sub:"One-time payment · No subscription",
      intensity_low:"Light",
      intensity_medium:"Moderate",
      intensity_high:"Intense",
      intensity_competition:"Competition",
      time_morning:"Morning",
      time_midday:"Midday",
      time_afternoon:"Afternoon",
      time_evening:"Evening",
      time_pre:"Pre-Workout",
      time_post:"Post-Workout",
      time_during:"During",
      general_loading:"Calculating...",
      general_error:"Something went wrong.",
      general_pro_only:"PRO only",
      general_unlock:"Unlock",
      general_close:"Close",
      general_save:"Save",
      general_cancel:"Cancel",
      general_back:"Back",
      general_next:"Continue →",
      general_done:"Done",
      general_per_week:"× per week",
      general_per_day:"per day",
      general_per_hour:"per hour",
      general_per_session:"per session",
      general_minutes:"min",
      general_kcal:"kcal",
      general_gram:"g",
      general_liter:"L",
      general_mg:"mg",
      general_beta:"Beta",
      general_top_pick:"Top Pick",
      general_recommended:"Recommended",
      general_mandatory:"Essential",
      general_optional:"Optional · useful",
      general_show_more:"+ show more",
      general_show_less:"Show less",
      general_buy:"Buy ↗",
      general_cart:"Add to Cart",
      general_in_cart:"✓ In Cart",
      step_profil_title:"Your Data",
      step_profil_sub:"Body data & contact. Goals & lifestyle follow.",
      step_profil_firstname:"First Name",
      step_profil_lastname:"Last Name",
      step_profil_email:"Email",
      step_profil_gender:"Gender",
      step_profil_male:"Male",
      step_profil_female:"Female",
      step_profil_country:"Country",
      step_profil_birthyear:"Year of Birth",
      step_profil_weight:"Body Weight (kg)",
      step_profil_height:"Height (cm)",
      step_profil_rhr:"Resting Heart Rate",
      step_profil_sleep:"Sleep quality",
    },
};

// Global translation - simple module-level approach
// ── LANGUAGE SYSTEM ─────────────────────────────────────────────────────────
// Auto-detect from country, persist in localStorage, manual toggle
const _getLang=()=>{
  try{
    const stored=localStorage.getItem("treyn_lang");
    if(stored==="en"||stored==="de") return stored;
  }catch{}
  return "de"; // Default DE for CH/DE/AT
};
let _currentLang=_getLang();
const setGlobalLang=(l)=>{
  _currentLang=l;
  try{localStorage.setItem("treyn_lang",l);}catch{}
};
const t=(key,vars={})=>{
  const str=TRANSLATIONS[_currentLang]?.[key]||TRANSLATIONS["de"]?.[key]||key;
  return Object.entries(vars).reduce((s,[k,v])=>s.replace(`{${k}}`,v),str);
};
// Lang context removed - using global setGlobalLang instead

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

// Letzter Stand der Fortschrittsleiste über alle Onboarding-Schritte hinweg:
// ein neuer Schritt zeichnet zuerst den alten Stand und wächst dann animiert auf den neuen.
let _onbProgressLast=0;

// Fester Kopf aller Onboarding-Schritte: Logo links, "Schritt X von Y" rechts, darunter die Leiste.
// Bleibt beim Scrollen oben stehen (sticky, nimmt seinen eigenen Platz ein - überdeckt nichts).
function Progress({step=1,total=6,done=false}) {
  const isMobile=useWindowWidth()<=768;
  const tot=Number(total)>0?Number(total):1;
  const cur=Math.max(0,Math.min(tot,Number(step)||0));
  const target=done?1:cur/tot;
  const [width,setWidth]=useState(()=>_onbProgressLast);
  useEffect(()=>{
    _onbProgressLast=target;
    // Zwei Frames warten, damit der alte Stand sichtbar gezeichnet ist und die Transition läuft
    let raf2=0;
    const raf1=requestAnimationFrame(()=>{ raf2=requestAnimationFrame(()=>setWidth(target)); });
    const fallback=setTimeout(()=>setWidth(target),80); // falls der Browser keine Frames liefert (z. B. Tab im Hintergrund)
    return ()=>{ cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); clearTimeout(fallback); };
  },[target]);
  const gutter=isMobile?16:24;
  return (
    <div style={{position:"sticky",top:0,zIndex:100,background:C.white,borderBottom:`1px solid ${C.g200}`}}>
      <div style={{maxWidth:520+gutter*2,marginLeft:"auto",marginRight:"auto",paddingTop:"max(12px, env(safe-area-inset-top))",paddingBottom:12,paddingLeft:gutter,paddingRight:gutter}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:10}}>
          <Logo/>
          <span style={{fontSize:12,fontWeight:500,color:C.g600,whiteSpace:"nowrap"}}>{done?"Fertig":`Schritt ${cur} von ${tot}`}</span>
        </div>
        <div role="progressbar" aria-label="Fortschritt" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(target*100)}
          style={{height:4,background:C.g200,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${Math.round(width*1000)/10}%`,background:C.neon,borderRadius:2,transition:"width .7s cubic-bezier(.16,1,.3,1)"}}/>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING-BAUSTEINE (Vorbild: "Dein Lebensstil") ───────────────────────

const ONB_CARD={background:C.white,border:`1px solid ${C.g200}`,borderRadius:16,padding:"18px 18px"};
const ONB_SEL="#F5FFE0";

// Seitenrahmen: hellgrauer Hintergrund, fester Kopf, Inhalt oben beginnend
function OnbShell({step=1,total=6,done=false,children}) {
  const isMobile=useWindowWidth()<=768;
  const gutter=isMobile?16:24;
  return (
    <div style={{minHeight:"100vh",background:C.off,fontFamily:"Inter,sans-serif",color:C.black}}>
      {/* Fokussierte Felder nicht unter den festen Kopf scrollen */}
      <style>{`html{scroll-padding-top:80px;}`}</style>
      <Progress step={step} total={total} done={done}/>
      <div style={{display:"flex",justifyContent:"center",paddingTop:isMobile?24:36,paddingBottom:80,paddingLeft:gutter,paddingRight:gutter}}>
        <div className="su" style={{width:"100%",maxWidth:520,minWidth:0}}>{children}</div>
      </div>
    </div>
  );
}

function OnbTitle({title,sub}) {
  return (
    <>
      <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:6,lineHeight:1.2,color:C.black}}>{title}</h2>
      {sub&&<p style={{fontSize:14,color:C.g600,marginBottom:24,lineHeight:1.65}}>{sub}</p>}
    </>
  );
}

// Fragen-Titel einer Karte
function OnbQ({label,sub}) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:600,color:C.black,letterSpacing:"-.01em"}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:C.g500,marginTop:2,lineHeight:1.4}}>{sub}</div>}
    </div>
  );
}

// Weisse Karte für eine Fragen-Gruppe
function OnbCard({label,sub,style,children}) {
  return (
    <div style={{...ONB_CARD,marginBottom:10,...(style||{})}}>
      {label&&<OnbQ label={label} sub={sub}/>}
      {children}
    </div>
  );
}

// Runder Acid-Haken für gewählte Kacheln
function OnbCheck({size=14}) {
  return (
    <span aria-hidden="true" style={{width:size,height:size,borderRadius:"50%",background:C.neon,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width={Math.round(size*.57)} height={Math.round(size*.57)} viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  );
}

// Pfeil zum Auf- und Zuklappen
function OnbChevron({open=false,size=12,color=C.g500}) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink:0,transition:"transform .18s",transform:open?"rotate(180deg)":"none"}}>
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Auswahl-Kachel: Titel + optional kleine Beschreibung; gewählt = hell-acid mit Acid-Rand
function OnbTile({label,desc,note,active,onClick,multi=false,disabled=false}) {
  return (
    <button type="button" onClick={disabled?undefined:onClick} disabled={disabled} aria-disabled={disabled} aria-pressed={!!active} style={{
      padding:"11px 13px",borderRadius:11,
      border:`1.5px solid ${active?C.neon:C.g200}`,
      background:active?ONB_SEL:C.white,
      cursor:disabled?"default":"pointer",fontFamily:"Inter,sans-serif",
      textAlign:"left",transition:"all .13s",
      display:"flex",flexDirection:"column",
      position:"relative",minWidth:0,
      opacity:disabled?.4:1,color:C.black,
    }}>
      {multi&&active&&<span style={{position:"absolute",top:8,right:9,display:"flex"}}><OnbCheck size={14}/></span>}
      <span style={{display:"block",fontSize:12,fontWeight:600,color:C.black,lineHeight:1.3,paddingRight:multi&&active?18:0,overflowWrap:"anywhere"}}>{label}</span>
      {desc&&<span style={{display:"block",fontSize:10,color:active?"#555":C.g400,marginTop:3,lineHeight:1.4,overflowWrap:"anywhere"}}>{desc}</span>}
      {note&&<span style={{display:"block",fontSize:10,color:C.g600,fontWeight:600,marginTop:5,lineHeight:1.3,overflowWrap:"anywhere"}}>{note}</span>}
    </button>
  );
}

// Kleiner Auswahl-Pill für Mehrfach-Tags
function OnbChip({label,active,onClick}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={!!active} style={{
      display:"inline-flex",alignItems:"center",gap:5,
      padding:"6px 13px",borderRadius:100,
      border:`1.5px solid ${active?C.neon:C.g200}`,
      background:active?ONB_SEL:C.white,
      color:active?C.black:C.g600,
      fontSize:12,fontWeight:active?600:400,
      cursor:"pointer",fontFamily:"Inter,sans-serif",
      transition:"all .13s",whiteSpace:"nowrap",
    }}>{label}{active&&<span style={{fontSize:10,color:C.black}}>✓</span>}</button>
  );
}

// Knopfleiste unten: Zurück + Weiter, gleiche Höhe, Weiter füllt die Breite
function OnbNav({onBack,onNext,canNext=true,label="Weiter →",hint=null}) {
  const ok=!!canNext;
  return (
    <div style={{marginTop:20}}>
      <div style={{display:"flex",gap:10,alignItems:"stretch"}}>
        {onBack&&(
          <button type="button" className="btn" onClick={onBack}
            style={{minHeight:50,padding:"0 18px",background:C.white,color:C.g700,border:`1.5px solid ${C.g200}`,flexShrink:0}}>
            {"← Zurück"}
          </button>
        )}
        <button type="button" className="btn btn-neon" disabled={!ok} aria-disabled={!ok}
          onClick={()=>{ if(ok&&onNext) onNext(); }}
          style={{flex:1,minWidth:0,minHeight:50,padding:"0 16px",fontSize:15,fontWeight:600,lineHeight:1.25,textAlign:"center",opacity:ok?1:.4,cursor:ok?"pointer":"default"}}>
          {label}
        </button>
      </div>
      {hint&&<div style={{marginTop:10,fontSize:12,color:C.g500,textAlign:"center",lineHeight:1.5}}>{hint}</div>}
    </div>
  );
}

// ─── STEP 1: SPORT ────────────────────────────────────────────────────────────

function StepSport({onNext, initial}) {
  const isMobile=useWindowWidth()<=768;
  const [sel,setSel]=useState(()=>({...(initial?.sel||{})}));
  const [subSel,setSubSel]=useState(()=>({...(initial?.subSel||{})}));
  const [childSel,setChildSel]=useState(()=>({...(initial?.childSel||{})}));
  const [expanded,setExpanded]=useState(null);
  const [subExp,setSubExp]=useState(null);

  // Hat die Rubrik eine Auswahl? (optional ohne eine bestimmte Disziplin)
  const groupHasSel=(id,exceptSub=null)=>{
    const g=SPORT_GROUPS.find(x=>x.id===id);
    return !!g?.subs?.some(sb=>sb.id!==exceptSub&&(subSel[sb.id]||sb.children?.some(ch=>childSel[sb.id+"_"+ch.id])));
  };
  const toggleGroup=(id,hasSubs)=>{
    if(hasSubs){
      // Antippen klappt nur auf/zu - die Auswahl bleibt. Ohne Auswahl ist die Sportart nicht gewählt.
      if(expanded===id){
        setExpanded(null);
        if(!groupHasSel(id)) setSel(s=>({...s,[id]:false}));
      } else {
        if(expanded&&!groupHasSel(expanded)){ const prev=expanded; setSel(s=>({...s,[prev]:false})); }
        setExpanded(id);
      }
    } else {
      setSel(s=>({...s,[id]:!s[id]}));
      setExpanded(null);
    }
  };
  const toggleSub=(e,groupId,sub)=>{
    e.stopPropagation();
    if(sub.children){
      const isOn=subSel[sub.id]||sub.children.some(ch=>childSel[sub.id+"_"+ch.id]);
      if(isOn){
        // Deselect: clear sub + all its children
        setSubSel(s=>({...s,[sub.id]:false}));
        setChildSel(s=>{const n={...s};sub.children.forEach(ch=>{delete n[sub.id+"_"+ch.id];});return n;});
        setSubExp(x=>x===sub.id?null:x);
        if(!groupHasSel(groupId,sub.id)) setSel(g=>({...g,[groupId]:false}));
      } else {
        // Select: open children picker
        setSubExp(x=>x===sub.id?null:sub.id);
        setSubSel(s=>({...s,[sub.id]:true}));
        setSel(g=>({...g,[groupId]:true}));
      }
    } else {
      const turnOn=!subSel[sub.id];
      setSubSel(s=>({...s,[sub.id]:turnOn}));
      if(turnOn) setSel(g=>({...g,[groupId]:true}));
      else if(!groupHasSel(groupId,sub.id)) setSel(g=>({...g,[groupId]:false}));
    }
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

  // Subs with children that are selected but missing a child selection
  const missingChildren = selectedSports.flatMap(id=>{
    const s=SPORT_GROUPS.find(g=>g.id===id);
    if(!s?.subs) return [];
    return s.subs.filter(sb=>
      sb.children?.length>0 &&
      subSel[sb.id] &&
      !sb.children.some(ch=>childSel[sb.id+"_"+ch.id])
    ).map(sb=>sb.label);
  });

  const canNext=totalCount>0&&missingDiscipline.length===0&&missingChildren.length===0;
  const warn=missingDiscipline.length>0||missingChildren.length>0;

  return (
    <OnbShell step={1} total={6}>
      <OnbTitle title="Wähle deine Sportarten." sub="Mehrfach-Auswahl möglich - selektiere alle Sportarten die du regelmässig betreibst. Bei einigen Sportarten öffnen sich die diversen Disziplinen."/>

      <OnbCard>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7}}>
          {SPORT_GROUPS.map(s=>{
            const active=!!sel[s.id];
            const hasSubs=s.subs&&s.subs.length>0;
            const isOpen=expanded===s.id;
            const selSubs=hasSubs?s.subs.filter(sb=>subSel[sb.id]||sb.children?.some(ch=>childSel[sb.id+"_"+ch.id])):[];
            // Hell-Acid erst, wenn die Auswahl in der Rubrik vollständig übernommen ist
            const done=hasSubs?selSubs.length>0&&selSubs.every(sb=>!sb.children?.length||sb.children.some(ch=>childSel[sb.id+"_"+ch.id])):active;
            const pending=active&&!done&&!isOpen;
            const frame=done?C.neon:C.black;
            return (
              <div key={s.id} style={{gridColumn:isOpen?"1 / -1":"auto",minWidth:0}}>
                <button type="button" onClick={()=>toggleGroup(s.id,hasSubs)} aria-expanded={hasSubs?isOpen:undefined} aria-pressed={hasSubs?undefined:!!done}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:isMobile?8:10,padding:isMobile?"10px":"11px 13px",borderRadius:isOpen?"11px 11px 0 0":11,cursor:"pointer",transition:"all .13s",border:`1.5px solid ${done?C.neon:isOpen?C.black:C.g200}`,background:done?ONB_SEL:C.white,fontFamily:"Inter,sans-serif",textAlign:"left",color:C.black}}>
                  <span style={{width:isMobile?26:32,height:isMobile?26:32,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:done?C.neon:C.g100}}>
                    <SportIcon icon={s.icon} active={done} size={isMobile?15:17}/>
                  </span>
                  <span style={{display:"block",flex:1,minWidth:0}}>
                    <span style={{display:"block",fontSize:13,fontWeight:600,color:C.black,lineHeight:1.3,overflowWrap:"anywhere"}}>{s.label}</span>
                    {selSubs.length>0&&<span style={{display:"block",fontSize:10,color:done?"#3A6000":pending?C.orange:"rgba(0,0,0,.5)",marginTop:2,lineHeight:1.35,overflowWrap:"anywhere"}}>{selSubs.map(sb=>sb.label).join(" · ")}{pending?" - Unterkategorie wählen":""}</span>}
                    {selSubs.length===0&&hasSubs&&<span style={{display:"block",fontSize:10,color:pending?C.orange:isOpen?C.g600:C.g400,marginTop:2,lineHeight:1.35}}>{isOpen||pending?"Disziplin wählen →":"Disziplinen →"}</span>}
                  </span>
                  {hasSubs&&!(done&&!isOpen)&&<OnbChevron open={isOpen} size={12}/>}
                  {done&&!isOpen&&<OnbCheck size={18}/>}
                </button>
                {isOpen&&hasSubs&&(
                  <div style={{padding:"10px 12px",background:C.off,borderLeft:`1.5px solid ${frame}`,borderRight:`1.5px solid ${frame}`,borderBottom:`1.5px solid ${frame}`,borderTop:"none",borderRadius:"0 0 11px 11px"}}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {s.subs.map(sb=>{
                        const on=!!subSel[sb.id]||(sb.children?.some(ch=>childSel[sb.id+"_"+ch.id]));
                        const isSubEx=subExp===sb.id;
                        return (
                          <button type="button" key={sb.id} onClick={e=>toggleSub(e,s.id,sb)} aria-pressed={!!on} aria-expanded={sb.children?isSubEx:undefined}
                            style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 13px",borderRadius:100,cursor:"pointer",fontSize:12,fontWeight:on?600:500,transition:"all .13s",background:on?ONB_SEL:C.white,color:C.black,border:`1.5px solid ${on?C.neon:C.g200}`,fontFamily:"Inter,sans-serif"}}>
                            {sb.label}
                            {sb.children&&<OnbChevron open={isSubEx} size={10}/>}
                            {on&&!sb.children&&<span style={{fontSize:10,color:C.black}}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    {s.subs.map(sb=>{
                      if(subExp!==sb.id||!sb.children)return null;
                      return (
                        <div key={sb.id+"_ch"} style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8,paddingTop:8,borderTop:`1px solid ${C.g200}`}}>
                          <span style={{fontSize:11,fontWeight:500,color:C.g500,width:"100%"}}>{sb.label}</span>
                          {sb.children.map(ch=>{const ck=sb.id+"_"+ch.id;const con=!!childSel[ck];return(
                            <button type="button" key={ch.id} onClick={e=>toggleChild(e,sb.id,ch.id)} aria-pressed={con}
                              style={{padding:"5px 12px",borderRadius:100,cursor:"pointer",fontSize:11,fontWeight:con?600:500,transition:"all .13s",background:con?ONB_SEL:C.white,color:C.black,border:`1.5px solid ${con?C.neon:C.g200}`,fontFamily:"Inter,sans-serif"}}>
                              {ch.label}{con&&" ✓"}
                            </button>
                          );})}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {totalCount>0&&(
          <div style={{marginTop:10,padding:"10px 13px",background:warn?"rgba(255,149,0,.08)":C.neonDim,borderRadius:11,border:`1px solid ${warn?"rgba(255,149,0,.3)":C.neonBorder}`,display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:6,height:6,background:warn?C.orange:C.neon,borderRadius:"50%",animation:"pulse 2s infinite",flexShrink:0}}/>
            <span style={{fontSize:13,color:C.g800,lineHeight:1.45}}>
              {missingDiscipline.length>0
                ? `${missingDiscipline.map(id=>SPORT_GROUPS.find(g=>g.id===id)?.label||id).join(", ")}: bitte noch eine Disziplin wählen`
                : missingChildren.length>0
                ? `${missingChildren.join(", ")}: bitte eine Unterkategorie wählen`
                : `${totalCount} ${totalCount===1?"Sportart":"Sportarten"} gewählt`
              }
            </span>
          </div>
        )}
      </OnbCard>

      <OnbNav canNext={canNext}
        onNext={()=>onNext({sel,subSel,childSel,primarySport,selectedSports,healthOnly:false})}
        label={canNext?`Weiter mit ${totalCount} ${totalCount===1?"Sportart":"Sportarten"} →`:totalCount===0?"Mindestens 1 wählen":missingChildren.length>0?"Unterkategorie wählen":"Disziplin auswählen"}/>
    </OnbShell>
  );
}

// ─── STEP 2: TRAINING ─────────────────────────────────────────────────────────

function StepTraining({sportData,onNext,onBack,initial}) {
  const isMobile=useWindowWidth()<=768;

  const sports=sportData?.selectedSports||[];
  const [data,setData]=useState(()=>{
    // Gespeicherte Angaben übernehmen (z. B. nach "Zurück"); neue Sportarten erhalten Standardwerte
    const prev=initial||{};
    const firstPrev=sports.map(id=>prev[id]).find(Boolean)||Object.values(prev)[0]||{};
    const shared={trainingTimes:Array.isArray(firstPrev.trainingTimes)?firstPrev.trainingTimes:[],sweatRate:firstPrev.sweatRate||"medium"};
    const init={};
    sports.forEach(id=>{init[id]={days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:5,compTypes:[],goal:"performance",...(prev[id]||{}),...shared};});
    return init;
  });
  const upd=(sportId,field,val)=>setData(d=>({...d,[sportId]:{...d[sportId],[field]:val}}));
  const toggleCompType=(sportId,type)=>{
    const cur=data[sportId]?.compTypes||[];
    const next=cur.includes(type)?cur.filter(t=>t!==type):[...cur,type];
    upd(sportId,"compTypes",next);
  };
  // Trainingszeit gilt für alle Sportarten gemeinsam, max. 2 (älteste fällt weg)
  const toggleTime=(tid)=>setData(d=>{
    const nd={...d};
    Object.keys(nd).forEach(id=>{
      const times=nd[id].trainingTimes||[];
      let next;
      if(times.includes(tid)) next=times.filter(x=>x!==tid);
      else if(times.length>=2) next=[times[1],tid]; // max 2: drop oldest
      else next=[...times,tid];
      nd[id]={...nd[id],trainingTimes:next};
    });
    return nd;
  });
  const setSweat=(sid)=>setData(d=>{const nd={...d};Object.keys(nd).forEach(id=>{nd[id]={...nd[id],sweatRate:sid}});return nd;});

  const INTENSITY=[
    {id:"low",label:"Leicht",desc:"Erholung, Basis"},
    {id:"medium",label:"Mittel",desc:"Normales Training"},
    {id:"high",label:"Intensiv",desc:"Strukturiert, hart"},
    {id:"competition",label:"Wettkampf",desc:"Rennen & Spiele"},
  ];
  const TIMES=[{id:"morning",l:"Morgens",d:"vor 10h"},{id:"midday",l:"Mittags"},{id:"afternoon",l:"Nachmittags"},{id:"evening",l:"Abends",d:"nach 18h"}];
  const SWEAT=[{id:"low",l:"Wenig"},{id:"medium",l:"Normal"},{id:"high",l:"Stark"},{id:"very_high",l:"Sehr stark"}];

  const first=Object.values(data)[0];
  const currentTimes=first?.trainingTimes||[];
  const canNext=!!(first?.trainingTimes?.length>0&&first?.sweatRate);
  const missing=[];
  if(!first?.trainingTimes?.length)missing.push("Trainingszeit");
  if(!first?.sweatRate)missing.push("Schweissrate");

  const rowLbl={fontSize:12,color:C.g600,fontWeight:500};

  return (
    <OnbShell step={2} total={6}>
      <OnbTitle title="Dein Training." sub="Fülle für jede Sportart aus - so berechnet TREYN+ die optimalen Mengen."/>

      {sports.map(id=>{
        const s=SPORT_GROUPS.find(g=>g.id===id);
        const d=data[id]||{days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:5,compTypes:[]};
        const compLabel=COMPETITION_LABEL[id]||"Wettkämpfe";
        const compTypes=COMPETITION_TYPES[id]||[];
        return (
          <div key={id} style={{...ONB_CARD,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:32,height:32,borderRadius:8,background:C.g100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <SportIcon icon={s?.icon||"GYM"} active={false} size={16}/>
              </div>
              <span style={{fontSize:15,fontWeight:600,letterSpacing:"-.01em",overflowWrap:"anywhere"}}>{s?.label||id}</span>
            </div>

            {/* Einheiten pro Woche - max 7 */}
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:8}}>
                <span style={rowLbl}>Einheiten pro Woche</span>
                <span style={{fontSize:13,fontWeight:600}}>{d.days}×</span>
              </div>
              <input type="range" min="1" max="7" step="1" value={d.days} onChange={e=>upd(id,"days",+e.target.value)} aria-label={`Einheiten pro Woche ${s?.label||id}`}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:10,color:C.g400}}>1×</span><span style={{fontSize:10,color:C.g400}}>7×</span>
              </div>
            </div>

            {/* Durchschnittliche Einheitsdauer */}
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:8}}>
                <span style={rowLbl}>Durchschnittliche Einheitsdauer (Ø)</span>
                <span style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>{d.duration} min</span>
              </div>
              <input type="range" min="20" max="360" step="10" value={d.duration} onChange={e=>upd(id,"duration",+e.target.value)} aria-label={`Einheitsdauer ${s?.label||id}`}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:10,color:C.g400}}>20 min</span><span style={{fontSize:10,color:C.g400}}>6h</span>
              </div>
            </div>

            {/* Intensität */}
            <div style={{marginBottom:16}}>
              <div style={{...rowLbl,marginBottom:8}}>Intensität</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7}}>
                {INTENSITY.map(inten=>(
                  <OnbTile key={inten.id} label={inten.label} desc={inten.desc} active={d.intensity===inten.id} onClick={()=>upd(id,"intensity",inten.id)}/>
                ))}
              </div>
            </div>

            {/* Wettkämpfe / Rennen / Spiele */}
            <div style={{padding:"12px 13px",background:C.off,borderRadius:11}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:d.hasCompetition?14:0}}>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600}}>{compLabel}</div>
                  <div style={{fontSize:11,color:C.g500,marginTop:2,lineHeight:1.4}}>Nimmst du an {compLabel.includes("Rennen") ? "Rennen oder Wettkämpfen" : compLabel.includes("Spiele") ? "Spielen oder Turnieren" : compLabel.includes("Turniere") ? "Turnieren" : "Wettkämpfen oder Events"} teil?</div>
                </div>
                <button type="button" className="icon-btn" role="switch" aria-checked={!!d.hasCompetition} aria-label={compLabel}
                  onClick={()=>upd(id,"hasCompetition",!d.hasCompetition)}
                  style={{width:44,height:26,minHeight:26,padding:0,border:"none",background:d.hasCompetition?C.black:C.g200,borderRadius:100,position:"relative",cursor:"pointer",transition:"background .18s",flexShrink:0}}>
                  <span style={{width:20,height:20,background:C.white,borderRadius:"50%",position:"absolute",top:3,left:d.hasCompetition?21:3,transition:"left .18s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
                </button>
              </div>

              {d.hasCompetition&&(
                <>
                  {/* Anzahl pro Jahr */}
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:6}}>
                      <span style={{fontSize:11,color:C.g600}}>Ø Anzahl pro Jahr</span>
                      <span style={{fontSize:12,fontWeight:600}}>{d.compCount}</span>
                    </div>
                    <input type="range" min="1" max="50" step="1" value={d.compCount} onChange={e=>upd(id,"compCount",+e.target.value)} aria-label={`Anzahl ${compLabel} pro Jahr`}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                      <span style={{fontSize:10,color:C.g400}}>1</span><span style={{fontSize:10,color:C.g400}}>50+</span>
                    </div>
                  </div>

                  {/* Wettkampf-Typen Multi-Select */}
                  {compTypes.length>0&&(
                    <div>
                      <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Art der {compLabel}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {compTypes.map(type=>(
                          <OnbChip key={type} label={type} active={(d.compTypes||[]).includes(type)} onClick={()=>toggleCompType(id,type)}/>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Trainingszeit */}
      <OnbCard label="Wann trainierst du meistens?" sub="Beeinflusst Supplement-Timing. Bis zu 2 Zeiten wählbar.">
        <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(4,minmax(0,1fr))",gap:7}}>
          {TIMES.map(tm=>(
            <OnbTile key={tm.id} label={tm.l} desc={tm.d} multi active={currentTimes.includes(tm.id)} onClick={()=>toggleTime(tm.id)}/>
          ))}
        </div>
      </OnbCard>

      {/* Schweissrate */}
      <OnbCard label="Wie stark schwitzt du beim Sport?" sub="Bestimmt deinen Elektrolyt- und Flüssigkeitsbedarf.">
        <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(4,minmax(0,1fr))",gap:7}}>
          {SWEAT.map(sw=>(
            <OnbTile key={sw.id} label={sw.l} active={first?.sweatRate===sw.id} onClick={()=>setSweat(sw.id)}/>
          ))}
        </div>
      </OnbCard>

      <OnbNav onBack={onBack} canNext={canNext}
        onNext={()=>{ if(canNext) onNext(data); }}
        hint={missing.length>0?`Noch ausfüllen: ${missing.join(", ")}`:null}/>
    </OnbShell>
  );
}

// ─── STEP 3: PROFIL ───────────────────────────────────────────────────────────

const COUNTRIES=[
  {v:"Schweiz"},{v:"Deutschland"},{v:"Österreich"},
];
const PLATFORMS=[
  {id:"apple",  label:"Apple Health", desc:"Grösse, Gewicht, HRV, Aktivität"},
  {id:"whoop",  label:"WHOOP",        desc:"Recovery, Strain, Sleep, HRV"},
  {id:"garmin", label:"Garmin",       desc:"HR, Power, Sleep, HRV, VO2max"},
  {id:"polar",  label:"Polar",        desc:"HR, VO2max, Recovery, Training"},
  {id:"manual", label:"Manuell",      desc:"Daten selbst eingeben"},
];
// Eigener Pfeil für Auswahlfelder (appearance:none entfernt den Browser-Pfeil)
const SELECT_ARROW_STYLE={
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B68' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",backgroundSize:"12px 12px",
};

// Grundumsatz nach Mifflin-St Jeor (gleiche Formel wie calcBMRfn).
// Eingaben werden auf plausible Bereiche begrenzt (Gewicht 35-200 kg, Grösse 120-230 cm, Alter 16-90).
function calcBMR(gender,weight,height,age){
  if(!weight||!height||!age)return null;
  const w=treynNum(weight), hRaw=treynNum(height), a=treynNum(age);
  if(w==null||hRaw==null||a==null||w<=0||hRaw<=0)return null;
  return Math.round(calcBMRfn(gender,w,hRaw,a));
}

function StepProfil({sportData,trainingData,onNext,onBack,initial}) {

  const isMobile=useWindowWidth()<=768;
  // Gerätewahl ohne Import: es werden nie Werte ins Formular geschrieben (Import folgt später)
  const [platform,setPlatform]=useState(()=>initial?.platform||null);
  const [form,setForm]=useState(()=>({
    firstname:initial?.firstname||"",lastname:initial?.lastname||"",email:initial?.email||"",
    country:initial?.country||"Schweiz",gender:initial?.gender||"",birthyear:initial?.birthyear||"",
    weight:initial?.weight||"",height:initial?.height||"",rhr:initial?.rhr||"",
  }));
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  // Plausibilitätsprüfung
  const yearNow=new Date().getFullYear();
  const maxBirthyear=yearNow-16;
  const num=(v)=>{const n=parseFloat(String(v??"").replace(",","."));return Number.isFinite(n)?n:NaN;};
  const byNum=num(form.birthyear), hNum=num(form.height), wNum=num(form.weight);
  const byOk=Number.isInteger(byNum)&&byNum>=1940&&byNum<=maxBirthyear;
  const hOk=hNum>=120&&hNum<=230;
  const wOk=wNum>=30&&wNum<=250;
  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email||"").trim());
  const bodyOk=!!form.gender&&byOk&&hOk&&wOk;

  // Vorschau mit derselben Rechnung wie die Basic-Übersicht
  const basicPreview=bodyOk?calcBasic({...(initial||{}),...form},trainingData,sportData?.healthOnly):null;
  const bmr=basicPreview?.bmr||null;
  const valid=!!(form.firstname.trim()&&form.lastname.trim()&&emailOk&&bodyOk);
  const missing=[];
  if(!form.firstname.trim())missing.push("Vorname");
  if(!form.lastname.trim())missing.push("Nachname");
  if(!form.gender)missing.push("Geschlecht");
  if(!byOk)missing.push("Geburtsjahr");
  if(!hOk)missing.push("Grösse");
  if(!wOk)missing.push("Gewicht");
  if(!emailOk)missing.push("E-Mail");

  const inp=(ok,bad)=>({width:"100%",padding:"11px 13px",border:`1.5px solid ${bad?C.orange:ok?C.neon:C.g200}`,borderRadius:10,fontSize:14,background:ok&&!bad?ONB_SEL:C.white,color:C.black,fontFamily:"Inter,sans-serif"});
  const sel={width:"100%",padding:"11px 34px 11px 13px",border:`1.5px solid ${C.g200}`,borderRadius:10,fontSize:14,backgroundColor:C.white,color:C.black,fontFamily:"Inter,sans-serif",appearance:"none",WebkitAppearance:"none",cursor:"pointer",...SELECT_ARROW_STYLE};
  const lbl={fontSize:12,color:C.g600,fontWeight:500,marginBottom:6};
  const hint=(text)=>(<div style={{fontSize:11,color:C.orange,marginTop:5,lineHeight:1.4}}>{text}</div>);

  return (
    <OnbShell step={3} total={6}>
      <OnbTitle title="Deine Daten." sub="Körperdaten & Kontakt. Im nächsten Schritt folgen Ziel & Lebensstil."/>

      {/* Gerät (optional) */}
      <OnbCard label="Welches Gerät nutzt du?" sub="Optional · Der automatische Import ist bald verfügbar. Bis dahin trägst du deine Daten unten selbst ein.">
        <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(3,minmax(0,1fr))",gap:7}}>
          {PLATFORMS.map(p=>(
            <OnbTile key={p.id} label={p.label} desc={p.desc} note={p.id!=="manual"?"Import bald verfügbar":null}
              active={platform===p.id} onClick={()=>setPlatform(cur=>cur===p.id?null:p.id)}/>
          ))}
        </div>
      </OnbCard>

      {/* Name & Wohnland */}
      <OnbCard label="Name & Wohnland">
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,marginBottom:10}}>
          <div style={{minWidth:0}}><div style={lbl}>Vorname *</div><input type="text" autoComplete="given-name" value={form.firstname} onChange={e=>set("firstname",e.target.value)} placeholder="Max" style={inp(!!form.firstname.trim(),false)}/></div>
          <div style={{minWidth:0}}><div style={lbl}>Nachname *</div><input type="text" autoComplete="family-name" value={form.lastname} onChange={e=>set("lastname",e.target.value)} placeholder="Muster" style={inp(!!form.lastname.trim(),false)}/></div>
        </div>
        <div>
          <div style={lbl}>Wohnland</div>
          <select value={form.country} onChange={e=>set("country",e.target.value)} style={sel} aria-label="Wohnland">{COUNTRIES.map(c=><option key={c.v} value={c.v}>{c.v}</option>)}</select>
        </div>
      </OnbCard>

      {/* Körperdaten */}
      <OnbCard label="Körperdaten">
        <div style={{marginBottom:12}}>
          <div style={lbl}>Geschlecht *</div>
          <div role="group" aria-label="Geschlecht" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7}}>
            {[{id:"m",l:"Männlich"},{id:"f",l:"Weiblich"}].map(o=>(
              <OnbTile key={o.id} label={o.l} active={form.gender===o.id} onClick={()=>set("gender",o.id)}/>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(3,minmax(0,1fr))",gap:10,marginBottom:12}}>
          <div style={{minWidth:0}}><div style={lbl}>Geburtsjahr *</div><input type="number" inputMode="numeric" value={form.birthyear} onChange={e=>set("birthyear",e.target.value)} placeholder="1990" min="1940" max={maxBirthyear} style={inp(byOk,!!form.birthyear&&!byOk)}/>
            {!!form.birthyear&&!byOk&&hint(`Bitte ein Jahr zwischen 1940 und ${maxBirthyear} eingeben.`)}</div>
          <div style={{minWidth:0}}><div style={lbl}>Grösse (cm) *</div><input type="number" inputMode="numeric" value={form.height} onChange={e=>set("height",e.target.value)} placeholder="180" min="120" max="230" style={inp(hOk,!!form.height&&!hOk)}/>
            {!!form.height&&!hOk&&hint("Bitte in Zentimetern angeben (120-230), z. B. 180.")}</div>
          <div style={{minWidth:0}}><div style={lbl}>Gewicht (kg) *</div><input type="number" inputMode="decimal" value={form.weight} onChange={e=>set("weight",e.target.value)} placeholder="75" min="30" max="250" style={inp(wOk,!!form.weight&&!wOk)}/>
            {!!form.weight&&!wOk&&hint("Bitte in Kilogramm angeben (30-250).")}</div>
        </div>
        <div style={{padding:"12px 13px",background:C.off,borderRadius:11}}>
          <div style={{fontSize:11,color:C.g500,marginBottom:10,lineHeight:1.4}}>Optional - für genauere VO₂max & Erholungs-Berechnungen</div>
          <div><div style={lbl}>Ruhepuls (bpm)</div><input type="number" inputMode="numeric" value={form.rhr||""} onChange={e=>set("rhr",e.target.value)} placeholder="52" min="30" max="100" style={inp(!!form.rhr,false)}/></div>
        </div>
      </OnbCard>

      {bmr&&(
        <div style={{marginBottom:10,padding:"16px 18px",background:C.neon,borderRadius:16,animation:"fadeUp .4s ease forwards"}}>
          <div style={{fontSize:12,fontWeight:500,color:"rgba(0,0,0,.55)",marginBottom:10}}>Schätzung · mit PRO exakt berechnet</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
            <div><div style={{fontSize:11,color:"rgba(0,0,0,.6)",marginBottom:4}}>Grundumsatz (Ruhe)</div><div style={{fontSize:22,fontWeight:700,color:C.black,letterSpacing:"-.03em"}}>{bmr.toLocaleString("de-CH")}</div><div style={{fontSize:10,color:"rgba(0,0,0,.5)"}}>kcal / Tag</div></div>
            <div><div style={{fontSize:11,color:"rgba(0,0,0,.6)",marginBottom:4}}>Mit Training</div><div style={{fontSize:22,fontWeight:700,color:C.black,letterSpacing:"-.03em"}}>{basicPreview?.withTraining?basicPreview.withTraining.toLocaleString("de-CH"):"-"}</div><div style={{fontSize:10,color:"rgba(0,0,0,.5)"}}>kcal / Tag</div></div>
          </div>
        </div>
      )}

      {/* Kontakt */}
      <OnbCard label="Kontakt">
        <div style={lbl}>E-Mail *</div>
        <input type="email" autoComplete="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="deine@email.ch" style={inp(emailOk,!!form.email.trim()&&!emailOk&&form.email.includes("."))}/>
        {!!form.email.trim()&&!emailOk&&form.email.includes(".")&&hint("Bitte eine gültige E-Mail eingeben, z. B. name@beispiel.ch.")}
        <div style={{fontSize:11,color:C.g500,marginTop:6}}>Kein Passwort und kein Konto nötig.</div>
      </OnbCard>

      <OnbNav onBack={onBack} canNext={valid}
        onNext={()=>{ if(valid) onNext({...form,firstname:form.firstname.trim(),lastname:form.lastname.trim(),email:form.email.trim(),platform}); }}
        hint={!valid&&missing.length>0?`Noch ausfüllen: ${missing.join(", ")}`:null}/>
    </OnbShell>
  );
}

// ─── STEP 4: LEBENSSTIL ───────────────────────────────────────────────────────

function StepLebensstil({onNext, onBack, gender="", initial}) {
  const isMobile=useWindowWidth()<=768;
  const [form,setForm]=useState(()=>{
    // Gespeicherte Antworten übernehmen (z. B. nach "Zurück")
    const p=initial||{};
    const arr=(v)=>Array.isArray(v)?v:[];
    return {
      goal:p.goal||"",challenges:arr(p.challenges).slice(0,3),injuries:arr(p.injuries),
      stressLevel:p.stressLevel??null,dietQuality:p.dietQuality??null,altitude:p.altitude??null,
      recoveryStatus:p.recoveryStatus??null,currentSupps:arr(p.currentSupps),medications:arr(p.medications),
      jobActivity:p.jobActivity??null,sleepHours:p.sleepHours!=null?String(p.sleepHours):null,
      waterIntake:p.waterIntake??null,sunExposure:p.sunExposure??null,caffeineDaily:p.caffeineDaily??null,
      cyclePhase:p.cyclePhase??null,bodyComposition:p.bodyComposition??null,
    };
  });
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleArr=(k,v)=>setForm(f=>{
    const curr=(f[k]||[]).filter(x=>x!=="none");
    if(v==="none") return {...f,[k]:["none"]};
    return {...f,[k]:curr.includes(v)?curr.filter(x=>x!==v):[...curr,v]};
  });

  const valid=form.goal&&form.stressLevel&&form.dietQuality&&form.altitude&&form.recoveryStatus&&form.currentSupps.length>0&&form.medications.length>0&&form.jobActivity;

  // Karten, Fragen-Titel und Kacheln: gemeinsame Onboarding-Bausteine (OnbQ, OnbTile, ONB_CARD)
  const ddStyle=(active)=>({width:"100%",padding:"10px 32px 10px 12px",border:`1.5px solid ${active?"#C8FF00":C.g200}`,borderRadius:10,fontSize:13,fontFamily:"Inter,sans-serif",backgroundColor:active?"#F5FFE0":C.white,color:active?"#0A0A0A":C.g600,appearance:"none",WebkitAppearance:"none",cursor:"pointer",...SELECT_ARROW_STYLE});

  const missingLs=[];
  if(!form.goal)missingLs.push("Ziel");
  if(!form.jobActivity)missingLs.push("Alltag (Job)");
  if(!form.recoveryStatus)missingLs.push("Erholung");
  if(!form.stressLevel)missingLs.push("Stress");
  if(!form.dietQuality)missingLs.push("Ernährung");
  if(!form.altitude)missingLs.push("Höhe");
  if(!(form.currentSupps||[]).length)missingLs.push("Supplements");
  if(!(form.medications||[]).length)missingLs.push("Medikamente");

  return (
    <OnbShell step={4} total={6}>
      <OnbTitle title="Dein Lebensstil." sub="Damit wir deine Empfehlungen wirklich präzise auf dich zuschneiden können."/>

      {/* ROW 1: Ziel (full width - 6 options in 2×3 grid) */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Primäres Ziel"}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:7}}>
          {[
            {id:"performance", l:"Leistung steigern",     d:"Schneller, stärker, weiter"},
            {id:"muscle",      l:"Muskelaufbau",           d:"Muskeln aufbauen & definieren"},
            {id:"endurance",   l:"Ausdauer verbessern",    d:"Mehr Volumen, längere Einheiten"},
            {id:"weightloss",  l:"Gewicht reduzieren",     d:"Fett verlieren, lean bleiben"},
            {id:"health",      l:"Gesundheit & Longevity", d:"Vitalität, Prävention"},
            {id:"recovery",    l:"Regeneration",           d:"Erholung & Prävention"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.goal===o.id} onClick={()=>set("goal",o.id)}/>)}
        </div>
      </div>


      {/* ROW: Grösste Herausforderung (optional, max 3) */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Grösste Herausforderung"} sub={`Optional · ${(form.challenges||[]).length}/3 gewählt${(form.challenges||[]).length>=3?" - zum Wechseln zuerst eine Auswahl entfernen":""}`}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:7}}>
          {[
            {id:"sleep",      l:"Schlaf",              d:"Zu wenig oder schlechte Schlafqualität"},
            {id:"stress",     l:"Stress & Cortisol",   d:"Hohes Stresslevel, Erholung fällt schwer"},
            {id:"recovery",   l:"Regeneration",        d:"Körper erholt sich zu langsam"},
            {id:"weight",     l:"Gewicht halten",      d:"Trotz Training schwer zu kontrollieren"},
            {id:"energy",     l:"Energie & Fokus",     d:"Müdigkeit, mentale Erschöpfung"},
            {id:"joints",     l:"Gelenke & Sehnen",    d:"Schmerzen oder Verletzungsanfälligkeit"},
          ].map(o=>{
            const active=(form.challenges||[]).includes(o.id);
            const atMax=(form.challenges||[]).length>=3&&!active;
            return <OnbTile key={o.id} id={o.id} label={o.l} desc={o.d}
              active={active}
              multi
              disabled={atMax}
              onClick={()=>{
                const arr=form.challenges||[];
                const on=arr.includes(o.id);
                if(on) set("challenges",arr.filter(c=>c!==o.id));
                else if(arr.length<3) set("challenges",[...arr,o.id]);
              }}
            />;
          })}
        </div>
      </div>

      {/* JOB AKTIVITÄT */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Aktivität im Alltag (Job)"} sub={"Ausserhalb des Trainings - beeinflusst deinen Gesamtenergiebedarf massiv"}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:7}}>
          {[
            {id:"sedentary",   l:"Sitzend",          d:"Büro, Homeoffice, Computer - kaum Bewegung"},
            {id:"light",       l:"Leicht aktiv",     d:"Lehrer, Arzt, stehend aber wenig laufend"},
            {id:"moderate",    l:"Mässig aktiv",     d:"Kellner, Verkäufer, regelmässig gehend"},
            {id:"very_active", l:"Sehr aktiv",       d:"Bauarbeiter, Handwerker, körperliche Arbeit"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.jobActivity===o.id} onClick={()=>set("jobActivity",o.id)}/>)}
        </div>
      </div>

      {/* SCHLAFDAUER */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Schlafdauer"} sub={"Durchschnittliche Stunden pro Nacht"}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(4,minmax(0,1fr))",gap:7}}>
          {[
            {id:"5",l:"≤ 5h",d:"Chronisch wenig"},
            {id:"6",l:"6h",d:"Zu wenig"},
            {id:"7",l:"7h",d:"Ok"},
            {id:"8",l:"8h+",d:"Optimal"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.sleepHours===o.id} onClick={()=>set("sleepHours",o.id)}/>)}
        </div>
      </div>

      {/* WASSERMENGE */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Tägliche Wassermenge"} sub={"Ohne Training - wie viel trinkst du im Alltag?"}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(4,minmax(0,1fr))",gap:7}}>
          {[
            {id:"low",    l:"< 1L",   d:"Zu wenig"},
            {id:"medium", l:"1-2L",   d:"Durchschnitt"},
            {id:"good",   l:"2-3L",   d:"Gut"},
            {id:"high",   l:"> 3L",   d:"Sehr gut"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.waterIntake===o.id} onClick={()=>set("waterIntake",o.id)}/>)}
        </div>
      </div>

      {/* SONNENLICHT */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Sonnenlicht täglich"} sub={"Direktes Sonnenlicht auf der Haut - beeinflusst Vitamin D stark"}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:7}}>
          {[
            {id:"none",     l:"Kaum / indoor",  d:"Büro, training indoor, wenig draussen"},
            {id:"low",      l:"< 30 min",        d:"Kurzer Weg, gelegentlich draussen"},
            {id:"moderate", l:"30-60 min",       d:"Mittagspause draussen, Outdoor-Training"},
            {id:"high",     l:"> 60 min",        d:"Viel Outdoor-Training, Garten, Handwerk"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.sunExposure===o.id} onClick={()=>set("sunExposure",o.id)}/>)}
        </div>
      </div>

      {/* KOFFEIN */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Täglicher Koffein-Konsum"} sub={"Kaffee, Tee, Energy Drinks - beeinflusst Pre-Workout Empfehlungen"}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:7}}>
          {[
            {id:"none",   l:"Kein Koffein",     d:"Kaffee-frei, kein Tee"},
            {id:"low",    l:"1-2 Tassen Kaffee",d:"~100-200mg täglich"},
            {id:"medium", l:"3-4 Tassen",       d:"~300-400mg täglich"},
            {id:"high",   l:"> 4 Tassen",       d:"> 400mg - hohe Toleranz"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.caffeineDaily===o.id} onClick={()=>set("caffeineDaily",o.id)}/>)}
        </div>
      </div>

      {/* KÖRPERZUSAMMENSETZUNG */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Körperbau"} sub={"Selbsteinschätzung - beeinflusst Proteinbedarf"}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:7}}>
          {[
            {id:"lean",     l:"Sehr muskulös / lean", d:"Wenig Körperfett, viel Muskelmasse"},
            {id:"athletic", l:"Athletisch",            d:"Normaler Sportler-Körper"},
            {id:"average",  l:"Durchschnitt",          d:"Normale Körperzusammensetzung"},
            {id:"higher_bf",l:"Etwas mehr KFA",        d:"Etwas Übergewicht, Abnehm-Ziel"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.bodyComposition===o.id} onClick={()=>set("bodyComposition",o.id)}/>)}
        </div>
      </div>

      {/* ZYKLUS - nur bei Frauen */}
      {gender==="f"&&(
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label={"Aktuelle Zyklusphase"} sub={"Beeinflusst Eisen-, Magnesium- und Kalorienbedarf stark - kann jederzeit im Profil angepasst werden"}/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:7}}>
          {[
            {id:"follikel",  l:"Follikelphase",     d:"Tag 6-13 - nach der Periode, mehr Energie"},
            {id:"ovulation", l:"Ovulation",         d:"Tag 14-16 - Hochform, Peak-Performance"},
            {id:"luteal",    l:"Lutealphase",       d:"Tag 17-28 - mehr Hunger, mehr Magnesium"},
            {id:"period",    l:"Periode",           d:"Tag 1-5 - höchster Eisenverlust, mehr Bedarf"},
            {id:"pcos",      l:"PCOS",              d:"Polyzystisches Ovarsyndrom"},
            {id:"menopause", l:"Menopause / Post",  d:"Andere Hormonlage"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.cyclePhase===o.id} onClick={()=>set("cyclePhase",o.id)}/>)}
        </div>
      </div>
      )}

      {/* ROW 2: Erholungsstatus (full width - 4 options in 2×2 grid) */}
      <div style={{...ONB_CARD,marginBottom:10}}>
        <OnbQ label="Aktueller Erholungsstatus" sub="Beeinflusst Recovery-Priorität und Magnesiumbedarf."/>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:7}}>
          {[
            {id:"excellent", l:"Top-Form",              d:"Gut erholt, leistungsbereit"},
            {id:"good",      l:"Normal",                d:"Kein Defizit, solide Basis"},
            {id:"tired",     l:"Akkumulierte Müdigkeit",d:"Harte Woche, leicht überlastet"},
            {id:"recovery",  l:"Verletzung / Pause",   d:"Komme von Verletzung oder Pause"},
          ].map(o=><OnbTile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.recoveryStatus===o.id} onClick={()=>set("recoveryStatus",o.id)}/>)}
        </div>
      </div>

      {/* ROW 3: Stress + Ernährung side by side */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:10,marginBottom:10}}>
        <div style={{...ONB_CARD}}>
          <OnbQ label={"Stresslevel"} sub="Wie belastet bist du im Alltag ausserhalb des Sports?"/>
          <select value={form.stressLevel||""} onChange={e=>set("stressLevel",+e.target.value||null)} style={ddStyle(form.stressLevel)} aria-label="Stresslevel">
            <option value="">- wählen</option>
            <option value="1">Sehr niedrig</option>
            <option value="2">Niedrig</option>
            <option value="3">Mittel</option>
            <option value="4">Hoch</option>
            <option value="5">Sehr hoch</option>
          </select>
        </div>
        <div style={{...ONB_CARD}}>
          <OnbQ label="Ernährung" sub="Wie ausgewogen isst du im Alltag?"/>
          <select value={form.dietQuality||""} onChange={e=>set("dietQuality",e.target.value||null)} style={ddStyle(form.dietQuality)} aria-label="Ernährung">
            <option value="">- wählen</option>
            <option value="excellent">Sehr ausgewogen</option>
            <option value="good">Gut</option>
            <option value="average">Durchschnittlich</option>
            <option value="poor">Verbesserungswürdig</option>
          </select>
        </div>
      </div>

      {/* ROW 4: Höhe + Verletzungen side by side */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:10,marginBottom:10}}>
        <div style={{...ONB_CARD}}>
          <OnbQ label="Trainingshöhe" sub="Wo lebst und trainierst du meistens?"/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[{id:"low",l:"0-500m",d:"Flachland"},{id:"medium",l:"500-1500m",d:"Mittelland"},{id:"high",l:"1500-2500m",d:"Alpen"},{id:"alpine",l:"2500m+",d:"Hochgebirge"}].map(o=>(
              <button type="button" key={o.id} onClick={()=>set("altitude",o.id)} aria-pressed={form.altitude===o.id}
                style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${form.altitude===o.id?"#C8FF00":C.g200}`,background:form.altitude===o.id?"#F5FFE0":C.white,color:form.altitude===o.id?"#0A0A0A":C.g600,fontSize:11,fontWeight:form.altitude===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .13s",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:600}}>{o.l}</span>
                <span style={{fontSize:10,opacity:.7}}>{o.d}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{...ONB_CARD}}>
          <OnbQ label="Verletzungen?" sub="Aktuelle Beschwerden, mehrere möglich."/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[{id:"none",l:"Keine"},{id:"knee",l:"Knie"},{id:"back",l:"Rücken"},{id:"shoulder",l:"Schulter"},{id:"ankle",l:"Knöchel / Fuss"},{id:"muscle",l:"Muskel"},{id:"tendon",l:"Sehnen"}].map(o=>{
              const active=(form.injuries||[]).includes(o.id);
              return (
                <button type="button" key={o.id} aria-pressed={active} onClick={()=>{if(o.id==="none"){set("injuries",active?[]:["none"]);return;}const curr=(form.injuries||[]).filter(x=>x!=="none");set("injuries",curr.includes(o.id)?curr.filter(x=>x!==o.id):[...curr,o.id]);}}
                  style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${active?"#C8FF00":C.g200}`,background:active?"#F5FFE0":C.white,color:active?"#0A0A0A":C.g600,fontSize:11,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .13s"}}>
                  {o.l}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 5: Supplements + Medikamente side by side */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:10,marginBottom:10}}>
        <div style={{...ONB_CARD}}>
          <OnbQ label="Aktuelle Supplements?" sub="Verhindert Doppelempfehlungen, mehrere möglich."/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[{id:"none",l:"Keine"},{id:"kreatin",l:"Kreatin"},{id:"protein",l:"Protein / Whey"},{id:"vitd",l:"Vitamin D"},{id:"omega3",l:"Omega-3"},{id:"magnesium",l:"Magnesium"},{id:"koffein",l:"Koffein / Pre-WO"},{id:"eisen",l:"Eisen"},{id:"zink",l:"Zink"},{id:"ashwa",l:"Ashwagandha"},{id:"collagen",l:"Kollagen"},{id:"beta_ala",l:"Beta-Alanin"}].map(o=>{
              const active=(form.currentSupps||[]).includes(o.id);
              return (
                <button type="button" key={o.id} aria-pressed={active} onClick={()=>{if(o.id==="none"){set("currentSupps",active?[]:["none"]);return;}const curr=(form.currentSupps||[]).filter(x=>x!=="none");set("currentSupps",curr.includes(o.id)?curr.filter(x=>x!==o.id):[...curr,o.id]);}}
                  style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${active?"#C8FF00":C.g200}`,background:active?"#F5FFE0":C.white,color:active?"#0A0A0A":C.g600,fontSize:11,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .13s"}}>
                  {o.l}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{...ONB_CARD}}>
          <OnbQ label="Medikamente?" sub="Für Warnhinweise bei Supplements, mehrere möglich."/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[{id:"none",l:"Keine"},{id:"blutverd",l:"Blutverdünner"},{id:"schilddruese",l:"Schilddrüse"},{id:"blutdruck",l:"Blutdruck"}].map(o=>{
              const active=(form.medications||[]).includes(o.id);
              return (
                <button type="button" key={o.id} aria-pressed={active} onClick={()=>{if(o.id==="none"){set("medications",active?[]:["none"]);return;}const curr=(form.medications||[]).filter(x=>x!=="none");set("medications",curr.includes(o.id)?curr.filter(x=>x!==o.id):[...curr,o.id]);}}
                  style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${active?"#C8FF00":C.g200}`,background:active?"#F5FFE0":C.white,color:active?"#0A0A0A":C.g600,fontSize:11,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .13s"}}>
                  {o.l}
                </button>
              );
            })}
            {(form.medications||[]).some(m=>m!=="none")&&(form.medications||[]).length>0&&(
              <div style={{marginTop:4,padding:"8px 10px",background:"#FFF8E1",borderRadius:8,border:"1px solid #FFE082"}}>
                <div style={{fontSize:10,color:"#856404",lineHeight:1.5}}>Warnhinweise erscheinen direkt beim Supplement.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <OnbNav onBack={onBack} canNext={!!valid}
        onNext={()=>{ if(valid) onNext(form); }}
        hint={!valid&&missingLs.length>0?`Noch ausfüllen: ${missingLs.join(" · ")}`:null}/>
    </OnbShell>
  );
}

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────

// ─── SUB-SPORT PROFILES ───────────────────────────────────────────────────────
// Differenzierte Werte pro Sub-Sportart. Felder:
//   met: {low, medium, high, competition}  - überschreibt SPORT_MET
//   protType: "endurance"|"strength"|"team"|"skill"  - überschreibt SPORT_TYPE_MAP
//   suppKey: key in SPORT_SUPP  - überschreibt getSupplements Mapping
//   nutritionKey: key in SPORT_NUTRITION  - überschreibt getSportNutrition
//   sodiumPerL: number  - überschreibt SODIUM_PER_L
//   ironRisk: bool  - überschreibt HIGH_IRON_RISK check
const SUB_SPORT_PROFILE = {
  // ─── CYCLING ────────────────────────────────────────────────────────────────
  cycling_road:   {met:{low:4.5,medium:8.0,high:11.0,competition:14.5}, protType:"endurance", suppKey:"cycling",      nutritionKey:"cycling",      sodiumPerL:950, ironRisk:true},
  cycling_gravel: {met:{low:4.0,medium:7.5,high:10.5,competition:13.5}, protType:"endurance", suppKey:"cycling",      nutritionKey:"cycling",      sodiumPerL:900, ironRisk:true},
  cycling_mtb_xc: {met:{low:5.0,medium:8.5,high:12.0,competition:15.0}, protType:"strength",  suppKey:"cycling",      nutritionKey:"cycling",      sodiumPerL:1000,ironRisk:true},
  cycling_mtb_end:{met:{low:4.5,medium:7.5,high:11.0,competition:13.0}, protType:"strength",  suppKey:"cycling_mtb",  nutritionKey:"cycling",      sodiumPerL:900, ironRisk:false},
  cycling_mtb_dh: {met:{low:3.5,medium:5.5,high:8.0, competition:10.0}, protType:"strength",  suppKey:"cycling_mtb",  nutritionKey:"cycling_dh",   sodiumPerL:750, ironRisk:false},
  cycling_track:  {met:{low:4.0,medium:7.0,high:11.5,competition:15.0}, protType:"strength",  suppKey:"cycling",      nutritionKey:"cycling",      sodiumPerL:900, ironRisk:true},
  cycling_ebike:  {met:{low:2.5,medium:4.0,high:6.0, competition:8.0},  protType:"endurance", suppKey:"cycling",      nutritionKey:"cycling",      sodiumPerL:700, ironRisk:false},
  // ─── RUNNING ────────────────────────────────────────────────────────────────
  run_road:       {met:{low:5.5,medium:9.0,high:12.5,competition:16.0}, protType:"endurance", suppKey:"running",      nutritionKey:"running",      sodiumPerL:900, ironRisk:true},
  // Road Running - distanzspezifisch
  run_road_5k:    {met:{low:5.5,medium:10.0,high:14.0,competition:17.0}, protType:"strength",  suppKey:"running",      nutritionKey:"run_short",    sodiumPerL:800, ironRisk:false},
  run_road_10k:   {met:{low:5.5,medium:9.5, high:13.0,competition:16.0}, protType:"endurance", suppKey:"running",      nutritionKey:"run_short",    sodiumPerL:850, ironRisk:true},
  run_road_hm:    {met:{low:5.0,medium:9.0, high:12.5,competition:15.5}, protType:"endurance", suppKey:"running",      nutritionKey:"run_hm",       sodiumPerL:900, ironRisk:true},
  run_road_m:     {met:{low:4.5,medium:8.5, high:12.0,competition:15.0}, protType:"endurance", suppKey:"running",      nutritionKey:"run_marathon",  sodiumPerL:950, ironRisk:true},
  run_road_ultra: {met:{low:4.0,medium:7.5, high:10.5,competition:13.0}, protType:"endurance", suppKey:"running",      nutritionKey:"run_ultra",    sodiumPerL:1100,ironRisk:true},
  // Trail Running
  run_trail:      {met:{low:5.0,medium:8.5,high:12.0,competition:15.0}, protType:"endurance", suppKey:"running",      nutritionKey:"running",      sodiumPerL:950, ironRisk:true},
  run_trail_short:{met:{low:5.0,medium:8.5, high:12.0,competition:15.0}, protType:"endurance", suppKey:"running",      nutritionKey:"run_hm",       sodiumPerL:950, ironRisk:true},
  run_trail_ultra:{met:{low:4.0,medium:7.5, high:10.0,competition:12.5}, protType:"endurance", suppKey:"running",      nutritionKey:"run_ultra",    sodiumPerL:1100,ironRisk:true},
  run_track:      {met:{low:5.0,medium:9.5,high:14.0,competition:17.0}, protType:"strength",  suppKey:"running",      nutritionKey:"running",      sodiumPerL:850, ironRisk:true},
  // Triathlon - distanzspezifisch
  tri_sprint:     {met:{low:6.0,medium:9.5, high:13.0,competition:16.0}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_sprint",   sodiumPerL:850, ironRisk:true},
  tri_olympic:    {met:{low:6.0,medium:9.5, high:13.0,competition:16.0}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_olympic",  sodiumPerL:900, ironRisk:true},
  tri_half:       {met:{low:5.5,medium:9.0, high:12.5,competition:15.5}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_half",     sodiumPerL:950, ironRisk:true},
  tri_full:       {met:{low:5.0,medium:8.5, high:12.0,competition:15.0}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_full",     sodiumPerL:1000,ironRisk:true},
  tri_ultra:      {met:{low:4.5,medium:8.0, high:11.0,competition:13.5}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_ultra",    sodiumPerL:1100,ironRisk:true},
  // Schwimmen - distanzspezifisch
  swim_sprint:    {met:{low:5.0,medium:7.5, high:10.0,competition:12.5}, protType:"strength",  suppKey:"running",      nutritionKey:"swim_sprint",  sodiumPerL:600, ironRisk:false},
  swim_mid:       {met:{low:5.0,medium:8.0, high:11.0,competition:13.5}, protType:"endurance", suppKey:"running",      nutritionKey:"swim_mid",     sodiumPerL:650, ironRisk:true},
  swim_open:      {met:{low:5.0,medium:8.5, high:11.5,competition:14.0}, protType:"endurance", suppKey:"running",      nutritionKey:"swim_open",    sodiumPerL:750, ironRisk:true},
  // ─── FITNESS ────────────────────────────────────────────────────────────────
  hyrox:          {met:{low:5.0,medium:8.0,high:11.0,competition:13.5}, protType:"strength",  suppKey:"fitness",      nutritionKey:"fitness",      sodiumPerL:1000,ironRisk:false},
  krafttraining:  {met:{low:3.5,medium:5.5,high:7.5, competition:9.5},  protType:"strength",  suppKey:"fitness",      nutritionKey:"fitness_str",  sodiumPerL:800, ironRisk:false},
  weightlifting:  {met:{low:3.5,medium:5.0,high:7.0, competition:9.0},  protType:"strength",  suppKey:"fitness",      nutritionKey:"fitness_str",  sodiumPerL:800, ironRisk:false},
  powerlifting:   {met:{low:3.0,medium:4.5,high:6.5, competition:8.5},  protType:"strength",  suppKey:"fitness",      nutritionKey:"fitness_str",  sodiumPerL:750, ironRisk:false},
  crossfit:       {met:{low:5.0,medium:8.0,high:11.5,competition:14.0}, protType:"strength",  suppKey:"fitness",      nutritionKey:"fitness",      sodiumPerL:1000,ironRisk:false},
  // ─── SKI ────────────────────────────────────────────────────────────────────
  ski_alpin:      {met:{low:4.5,medium:7.0,high:9.5, competition:12.0}, protType:"strength",  suppKey:"ski",          nutritionKey:"ski",          sodiumPerL:700, ironRisk:false},
  ski_freeride:   {met:{low:4.0,medium:6.5,high:9.0, competition:11.0}, protType:"strength",  suppKey:"ski",          nutritionKey:"ski",          sodiumPerL:650, ironRisk:false},
  ski_touring:    {met:{low:6.0,medium:9.0,high:12.0,competition:14.0}, protType:"endurance", suppKey:"ski_touring",  nutritionKey:"ski_touring",  sodiumPerL:900, ironRisk:true},
  snowboard:      {met:{low:3.5,medium:6.0,high:8.5, competition:11.0}, protType:"strength",  suppKey:"ski",          nutritionKey:"ski",          sodiumPerL:650, ironRisk:false},
  // ─── LANGLAUF distanzspezifisch ─────────────────────────────────────────────
  langlauf_klassisch:         {met:{low:6.5,medium:10.5,high:14.0,competition:17.5},protType:"endurance",suppKey:"langlauf",nutritionKey:"langlauf",       sodiumPerL:900, ironRisk:true},
  langlauf_klassisch_kurz:    {met:{low:7.0,medium:11.5,high:15.0,competition:18.0},protType:"endurance",suppKey:"langlauf",nutritionKey:"langlauf_kurz",  sodiumPerL:850, ironRisk:true},
  langlauf_klassisch_mittel:  {met:{low:6.5,medium:10.5,high:14.0,competition:17.0},protType:"endurance",suppKey:"langlauf",nutritionKey:"langlauf_mittel",sodiumPerL:900, ironRisk:true},
  langlauf_klassisch_lang:    {met:{low:6.0,medium:9.5, high:13.0,competition:16.0},protType:"endurance",suppKey:"langlauf",nutritionKey:"langlauf_lang",  sodiumPerL:1000,ironRisk:true},
  langlauf_skating:           {met:{low:7.0,medium:11.0,high:14.5,competition:18.0},protType:"endurance",suppKey:"langlauf",nutritionKey:"langlauf",       sodiumPerL:950, ironRisk:true},
  langlauf_skating_kurz:      {met:{low:7.5,medium:12.0,high:15.5,competition:18.5},protType:"endurance",suppKey:"langlauf",nutritionKey:"langlauf_kurz",  sodiumPerL:900, ironRisk:true},
  langlauf_skating_mittel:    {met:{low:7.0,medium:11.0,high:14.5,competition:17.5},protType:"endurance",suppKey:"langlauf",nutritionKey:"langlauf_mittel",sodiumPerL:950, ironRisk:true},
  langlauf_skating_lang:      {met:{low:6.5,medium:10.0,high:13.5,competition:16.5},protType:"endurance",suppKey:"langlauf",nutritionKey:"langlauf_lang",  sodiumPerL:1050,ironRisk:true},
  biathlon:          {met:{low:6.0,medium:9.5, high:13.0,competition:16.0},protType:"endurance",suppKey:"langlauf",   nutritionKey:"langlauf",     sodiumPerL:850, ironRisk:true},
  // ─── TENNIS / PADEL ─────────────────────────────────────────────────────────
  tennis:         {met:{low:4.0,medium:6.5,high:8.5, competition:10.5}, protType:"skill",     suppKey:"tennis",       nutritionKey:"tennis",       sodiumPerL:800, ironRisk:false},
  padel:          {met:{low:3.5,medium:6.0,high:8.0, competition:10.0}, protType:"skill",     suppKey:"tennis",       nutritionKey:"tennis",       sodiumPerL:750, ironRisk:false},
  // ─── LEICHTATHLETIK ─────────────────────────────────────────────────────────
  la_sprint:      {met:{low:5.0,medium:9.0,high:13.0,competition:16.0}, protType:"strength",  suppKey:"fitness",      nutritionKey:"la_sprint",    sodiumPerL:850, ironRisk:false},
  la_mittel:      {met:{low:5.5,medium:9.5,high:13.0,competition:16.0}, protType:"strength",  suppKey:"running",      nutritionKey:"running",      sodiumPerL:900, ironRisk:true},
  la_lang:        {met:{low:5.5,medium:9.0,high:12.5,competition:15.5}, protType:"endurance", suppKey:"running",      nutritionKey:"running",      sodiumPerL:900, ironRisk:true},
  la_wurf:        {met:{low:3.0,medium:5.0,high:7.0, competition:9.0},  protType:"strength",  suppKey:"fitness",      nutritionKey:"fitness_str",  sodiumPerL:700, ironRisk:false},
  la_sprung:      {met:{low:4.0,medium:6.5,high:9.0, competition:11.0}, protType:"strength",  suppKey:"fitness",      nutritionKey:"fitness_str",  sodiumPerL:750, ironRisk:false},
  la_mehr:        {met:{low:5.0,medium:8.0,high:11.0,competition:13.5}, protType:"strength",  suppKey:"fitness",      nutritionKey:"running",      sodiumPerL:850, ironRisk:false},
  // ─── KAMPFSPORT ─────────────────────────────────────────────────────────────
  boxing:         {met:{low:5.0,medium:8.5,high:12.0,competition:14.0}, protType:"strength",  suppKey:"kampfsport",   nutritionKey:"kampfsport",   sodiumPerL:1000,ironRisk:false},
  mma:            {met:{low:5.5,medium:9.0,high:12.5,competition:14.5}, protType:"strength",  suppKey:"kampfsport",   nutritionKey:"kampfsport",   sodiumPerL:1050,ironRisk:false},
  wrestling:      {met:{low:5.0,medium:8.5,high:12.0,competition:14.0}, protType:"strength",  suppKey:"kampfsport",   nutritionKey:"kampfsport",   sodiumPerL:1000,ironRisk:false},
  judo:           {met:{low:4.5,medium:8.0,high:11.5,competition:13.5}, protType:"strength",  suppKey:"kampfsport",   nutritionKey:"kampfsport",   sodiumPerL:950, ironRisk:false},
  karate:         {met:{low:4.5,medium:7.5,high:11.0,competition:13.0}, protType:"strength",  suppKey:"kampfsport",   nutritionKey:"kampfsport",   sodiumPerL:900, ironRisk:false},
  bjj:            {met:{low:4.5,medium:8.0,high:11.5,competition:13.5}, protType:"strength",  suppKey:"kampfsport",   nutritionKey:"kampfsport",   sodiumPerL:950, ironRisk:false},
  // ─── HANDBALL / VOLLEYBALL ──────────────────────────────────────────────────
  handball:       {met:{low:5.0,medium:7.5,high:10.0,competition:12.0}, protType:"team",      suppKey:"fussball",     nutritionKey:"team_sport",   sodiumPerL:900, ironRisk:false},
  volleyball:     {met:{low:4.0,medium:6.5,high:9.0, competition:11.0}, protType:"team",      suppKey:"fussball",     nutritionKey:"team_sport",   sodiumPerL:800, ironRisk:false},
  beachvolley:    {met:{low:5.0,medium:7.5,high:10.0,competition:12.0}, protType:"team",      suppKey:"fussball",     nutritionKey:"team_sport",   sodiumPerL:950, ironRisk:false},
};

// Helper: gibt Sub-Profil zurück wenn vorhanden, sonst null
function getSubProfile(sportId) { return SUB_SPORT_PROFILE[sportId]||null; }

// MET-Werte pro Sportart (Gruppen-ID aus SPORT_GROUPS). Unterdisziplinen in SUB_SPORT_PROFILE haben Vorrang.
// fussball / eishockey / schwimmen bleiben als Alias fuer alte Rueckfall-Stellen erhalten.
const SPORT_MET = {
  cycling:          {low:4.0, medium:7.5, high:10.5, competition:14.0},
  running:          {low:5.5, medium:9.0, high:12.0, competition:16.0},
  triathlon:        {low:6.0, medium:9.5, high:13.0, competition:16.5},
  swimming:         {low:4.5, medium:7.0, high:9.5,  competition:12.0},
  ski_snow:         {low:4.0, medium:6.0, high:8.5,  competition:11.0},
  fitness:          {low:4.5, medium:7.0, high:9.5,  competition:12.5},
  langlauf:         {low:6.5, medium:10.0,high:13.5, competition:17.0},
  football:         {low:5.0, medium:7.5, high:9.5,  competition:11.0},
  icehockey:        {low:5.5, medium:8.0, high:10.5, competition:12.5},
  basketball:       {low:4.5, medium:7.0, high:9.0,  competition:11.0},
  american_football:{low:4.0, medium:6.5, high:8.5,  competition:10.5},
  handball_vball:   {low:4.5, medium:7.0, high:9.0,  competition:11.0},
  tennis:           {low:4.0, medium:6.5, high:8.5,  competition:10.5},
  golf:             {low:3.0, medium:4.5, high:5.5,  competition:6.0},
  klettern:         {low:5.0, medium:7.0, high:8.5,  competition:10.0},
  kampfsport:       {low:5.0, medium:8.0, high:11.5, competition:13.5},
  leichtathletik:   {low:5.0, medium:8.5, high:12.0, competition:14.5},
  // Alias (alte Schluessel)
  fussball:         {low:5.0, medium:7.5, high:9.5,  competition:11.0},
  eishockey:        {low:5.5, medium:8.0, high:10.5, competition:12.5},
  schwimmen:        {low:4.5, medium:7.0, high:9.5,  competition:12.0},
};
// Schweiss in Liter pro Stunde bei normaler Schweissneigung
const SWEAT_RATE = {low:0.5, medium:0.9, high:1.4, competition:2.0};
const SODIUM_PER_L = {
  cycling:950, running:900, triathlon:900, swimming:700, ski_snow:600,
  fitness:950, langlauf:850, football:900, icehockey:850, basketball:900,
  american_football:950, handball_vball:900, tennis:900, golf:600,
  klettern:800, kampfsport:950, leichtathletik:850,
  // Alias (alte Schluessel)
  fussball:900, eishockey:850, schwimmen:700,
};
const PROTEIN_NEED = {
  endurance:{low:1.2, medium:1.4, high:1.6, competition:1.8},
  strength: {low:1.6, medium:1.8, high:2.0, competition:2.2},
  team:     {low:1.4, medium:1.6, high:1.8, competition:2.0},
  skill:    {low:1.2, medium:1.4, high:1.5, competition:1.6},
};
const SPORT_CONTEXT = {
  cycling_ebike: {
    note: "E-Bike reduziert den Energieaufwand um ca. 60% gegenüber Rennrad - trotzdem echter Kalorienverbrauch, Schweiss und Elektrolytbedarf.",
    protein_note: "Auch E-Bike-Fahrer brauchen Protein für Muskelerhalt und Regeneration.",
    carb_note: "Geringerer Kohlenhydratbedarf als konventionelles Radfahren - aber Elektrolyte bleiben wichtig.",
  },
  cycling_mtb_xc: {
    note: "MTB XC kombiniert Ausdauer und explosive Kraft - einer der energieintensivsten Radsport-Disziplinen.",
    carb_note: "Lange XC-Rennen brauchen kontinuierliche Kohlenhydratzufuhr wie beim Strassenrad.",
  },
  cycling_mtb_end: {
    note: "Enduro verbindet technische Abfahrten mit kraftintensiven Uphills - asymmetrische Belastung mit hohem Regenerationsbedarf.",
    protein_note: "Mehr Protein als XC - explosive Muskelbeanspruchung erhöht den Reparaturbedarf.",
    recovery_note: "Gelenk- und Sehnenbelastung durch technisches Terrain: Kollagen + Omega-3 besonders wertvoll.",
  },
  cycling_mtb_dh: {
    note: "Downhill ist anaerob und explosiv - kurze, maximale Anstrengungen mit hohem Muskelstress.",
    protein_note: "Kraftsport-ähnlicher Proteinbedarf - kurze Runs, hohe neuromuskuläre Belastung.",
    carb_note: "Weniger Ausdauer-Carbs, mehr Kreatin und schnelle Energiequellen für explosive Wiederholungsläufe.",
  },
};

const SPORT_TYPE_MAP = {
  cycling:"endurance", running:"endurance", triathlon:"endurance", swimming:"endurance", langlauf:"endurance",
  fitness:"strength", klettern:"strength", kampfsport:"strength", leichtathletik:"strength",
  football:"team", icehockey:"team", basketball:"team", american_football:"team", handball_vball:"team",
  tennis:"skill", golf:"skill", ski_snow:"skill",
  // Alias (alte Schluessel)
  schwimmen:"endurance", fussball:"team", eishockey:"team",
};
// Richtwert Kohlenhydrate g/kg nach Intensitaet (Referenz). calcPro rechnet zusaetzlich mit den Trainingsstunden pro Tag.
const CARB_NEED = {low:3, medium:5, high:7, competition:10};
const HIGH_IRON_RISK = ["running","triathlon","langlauf","cycling","swimming","schwimmen"];

// ─── Eingaben absichern ──────────────────────────────────────────────────────
// Zahl aus Text lesen ("75", "75,5"), sonst null
function treynNum(v){
  if(v==null||v==="")return null;
  const n=parseFloat(String(v).replace(",","."));
  return Number.isFinite(n)?n:null;
}
function treynClamp(v,min,max){ return Math.min(max,Math.max(min,v)); }
// Gewicht 35-200 kg, Grösse 120-230 cm (Meter-Eingabe wie 1.80 wird umgerechnet), Alter 16-90.
// Zweistelliges Geburtsjahr ("88") wird als 1988 bzw. 20xx gelesen.
function sanitizeBody(profilData){
  const gender=profilData?.gender==="f"?"f":"m";
  let w=treynNum(profilData?.weight); if(w==null||w<=0)w=75;
  w=treynClamp(w,35,200);
  let h=treynNum(profilData?.height); if(h==null||h<=0)h=175;
  if(h>=1.2&&h<=2.3)h=h*100;
  h=treynClamp(h,120,230);
  const year=new Date().getFullYear();
  let by=treynNum(profilData?.birthyear), age=30;
  if(by!=null&&by>0){
    by=Math.round(by);
    if(by<100) by+= by>year%100 ? 1900 : 2000;
    age=year-by;
  }
  age=treynClamp(age,16,90);
  return {gender,w,h,age};
}

// Grundumsatz nach Mifflin-St Jeor: Mann 10*kg + 6.25*cm - 5*Alter + 5, Frau ... - 161
function calcBMRfn(gender,w,h,age) {
  let ww=treynNum(w); if(ww==null||ww<=0)ww=75; ww=treynClamp(ww,35,200);
  let hh=treynNum(h); if(hh==null||hh<=0)hh=175; if(hh>=1.2&&hh<=2.3)hh=hh*100; hh=treynClamp(hh,120,230);
  let aa=treynNum(age); if(aa==null)aa=30; aa=treynClamp(aa,16,90);
  const base=10*ww+6.25*hh-5*aa;
  return gender==="f"?base-161:base+5;
}

// Unterdisziplin aufloesen: gewaehltes Kind > gewaehlte Unterdisziplin > Gruppe
function resolveSubId(parentId, sportDataRef) {
  const subSel = sportDataRef?.subSel || {};
  const childSel = sportDataRef?.childSel || {};
  const group = (typeof SPORT_GROUPS !== "undefined" ? SPORT_GROUPS : []).find(g=>g.id===parentId);
  if(group?.subs) {
    for(const sub of group.subs) {
      if(sub.children?.length>0) {
        const selectedChild = sub.children.find(ch=>childSel[sub.id+"_"+ch.id]);
        if(selectedChild) return selectedChild.id;
        if(subSel[sub.id] && SUB_SPORT_PROFILE[sub.id]) return sub.id;
      } else if(subSel[sub.id]) return sub.id;
    }
  }
  return parentId;
}

// MET-Tabelle einer Sportart (gleiche Quelle fuer alle Anzeigen): Unterdisziplin > Gruppe > Fussball
function getSportMetTable(parentId, sportDataRef){
  const sub=getSubProfile(resolveSubId(parentId, sportDataRef));
  return sub?.met || SPORT_MET[parentId] || SPORT_MET.football;
}

function calcBasic(profilData, trainingData, healthOnly) {
  const {gender,w,h,age}=sanitizeBody(profilData);
  const bmr=Math.round(calcBMRfn(gender,w,h,age));
  const sessionsPerYear=Object.values(trainingData||{}).reduce((s,d)=>s+(+d?.days||0),0)*52;
  const waterMl=Math.round(w*35);
  if(healthOnly) return {bmr, withTraining:Math.round(bmr*1.2), trainingExtra:Math.round(bmr*0.2), waterMl, sessionsPerYear};
  const extra=Math.round(bmr*0.5);
  return {bmr, withTraining:bmr+extra, trainingExtra:extra, waterMl, sessionsPerYear};
}

function calcPro(profilData, trainingData, sportData) {
  const healthOnly=!!sportData?.healthOnly;
  const {gender,w,h,age}=sanitizeBody(profilData);
  const isFemale=gender==="f";
  const goal=profilData?.goal||"performance";
  const stressLevel=treynClamp(Math.round(treynNum(profilData?.stressLevel)||3),1,5); // 1-5
  const dietQuality=profilData?.dietQuality||"good"; // excellent/good/average/poor
  const altitude=profilData?.altitude||"low"; // low/medium/high/alpine
  const injuries=Array.isArray(profilData?.injuries)?profilData.injuries:[];
  const recoveryStatus=profilData?.recoveryStatus||"good"; // excellent/good/tired/recovery
  const challenges=Array.isArray(profilData?.challenges)?profilData.challenges:[];
  const currentSupps=Array.isArray(profilData?.currentSupps)?profilData.currentSupps:[]; // already taking
  const medications=Array.isArray(profilData?.medications)?profilData.medications:[]; // medication categories
  const monthlyBudget=profilData?.monthlyBudget||"medium"; // low/medium/high/max

  // Medication flags (frueh, weil Koffein sie braucht)
  const hasBlutverd     = medications.includes("blutverd");
  const hasSchilddruese = medications.includes("schilddruese");
  const hasBlutdruck    = medications.includes("blutdruck");

  // ── PRECISION INPUTS ─────────────────────────────────────────────────────
  const jobActivity=profilData?.jobActivity||"sedentary";
  const waterIntake=profilData?.waterIntake||"medium";
  const sunExposure=profilData?.sunExposure||"low";
  const caffeineDaily=profilData?.caffeineDaily||"low";
  const bodyComposition=profilData?.bodyComposition||"athletic";
  const cyclePhase=isFemale?(profilData?.cyclePhase||null):null;

  // NEAT - Non-Exercise Activity Thermogenesis
  const neatKcal={sedentary:250,light:500,moderate:800,very_active:1200}[jobActivity]||250;

  // Sleep: eine Quelle (Lebensstil-Kachel sleepHours, sonst Profilfeld sleep, sonst 7)
  const sleepHours=treynClamp(treynNum(profilData?.sleepHours)||treynNum(profilData?.sleep)||7,3,12);
  const sleep=sleepHours;
  const sleepDeficit=sleep<7?+(7-sleep).toFixed(1):0;
  const sleepMgBonus=sleep<=5?120:sleep<7?Math.round((7-sleep)*60):0; // 6h = +60mg, ≤5h = +120mg
  const sleepAshwaNeeded=sleep<=6;

  // Water
  const waterBonus={low:600,medium:200,good:0,high:-200}[waterIntake]??200;
  const waterDeficit=waterIntake==="low";

  // Vitamin D: Sonnenlicht und Ernaehrung zusammen
  const vitDNeed={none:"critical",low:"high",moderate:"moderate",high:"low"}[sunExposure]||"high";
  const vitDSunDose={critical:4000,high:2000,moderate:1000,low:0}[vitDNeed]??2000;
  const vitDDietAdd={poor:1000,average:500}[dietQuality]||0;
  const vitDDose=vitDSunDose>0?Math.min(4000,vitDSunDose+vitDDietAdd):(vitDDietAdd>0?1000:0);
  const vitDRisk=vitDNeed==="critical"||vitDNeed==="high"||dietQuality==="poor"||dietQuality==="average";

  // Caffeine: Dosis in mg nach Gewohnheit (mg/kg), begrenzt 50-250mg
  const caffeineNone=caffeineDaily==="none";
  const caffeineToleranceHigh=caffeineDaily==="high";
  const caffeineSensitive=caffeineNone||hasBlutdruck;
  const caffeineMgPerKg={none:1.0,low:2.0,medium:2.5,high:3.0}[caffeineDaily]||2.0;
  let caffeinePreWorkoutDose=Math.round(treynClamp(w*caffeineMgPerKg,50,250)/25)*25;
  if(caffeineSensitive) caffeinePreWorkoutDose=Math.min(caffeinePreWorkoutDose,100);
  // Spaeter Koffein stoert den Schlaf: bei Schlafproblemen frueher aufhoeren
  const caffeineCutoff=(challenges.includes("sleep")||sleep<7)?"14:00":"16:00";

  // Body composition protein multiplier
  const bodyCompProtMult={lean:1.3,athletic:1.1,average:1.0,higher_bf:0.9}[bodyComposition]||1.0;
  const isLean=bodyComposition==="lean";

  // Cycle (women only)
  const isLuteal=cyclePhase==="luteal";
  const isPeriod=cyclePhase==="period";
  const isPCOS=cyclePhase==="pcos";
  const cycleMgBonus=isFemale?(isLuteal?80:isPeriod?60:isPCOS?40:0):0;
  const cycleIronBoost=isFemale&&(isPeriod||isPCOS);
  const cycleKcalBonus=isFemale?(isLuteal?200:isPeriod?150:0):0;

  const bmr=Math.round(calcBMRfn(gender,w,h,age));

  // ── SPORTARTEN ───────────────────────────────────────────────────────────
  const INTENS_OK=["low","medium","high","competition"];
  const CARB_INTENS_F={low:0.8, medium:1.0, high:1.1, competition:1.15};
  const entries=healthOnly?[]:Object.entries(trainingData||{}).filter(([id,d])=>d&&typeof d==="object"&&!String(id).startsWith("_"));
  const primarySport=healthOnly?null:((sportData?.primarySport&&entries.some(([id])=>id===sportData.primarySport))?sportData.primarySport:(entries[0]?.[0]||sportData?.primarySport||null));

  let weekKcal=0, weekSweatL=0, weekNa=0, weekMg=0, compKcalDay=0, weekHours=0, weekCarbF=0;
  let maxProt=0, ironRisk=isFemale, totalDays=0;
  let primaryTrainingTime="mixed", primaryTimeSet=false;
  let prim=null;
  const sportBreakdown=[];

  entries.forEach(([id,d])=>{
    const intens=INTENS_OK.includes(d.intensity)?d.intensity:"medium";
    const daysRaw=treynNum(d.days);
    const days=daysRaw==null?3:treynClamp(Math.round(daysRaw),0,7);
    const durationMin=treynClamp(treynNum(d.duration)||60,10,600);
    const durH=durationMin/60;

    // Resolve to sub-sport if available
    const resolvedId = resolveSubId(id, sportData);
    const sub = getSubProfile(resolvedId);

    // MET: sub-profile > parent SPORT_MET > fallback
    const metTable = sub?.met || SPORT_MET[id] || SPORT_MET.football;
    const met = metTable[intens] || metTable.medium || 7;

    // Sweat rate (L/h), begrenzt auf 2.5 L/h
    const sweatRateKey=d.sweatRate||"medium";
    const sweatMult={low:0.6,medium:1.0,high:1.4,very_high:1.8}[sweatRateKey]||1.0;
    const sweatLh=Math.min(2.5,(SWEAT_RATE[intens]||0.9)*sweatMult);

    // Sodium: sub-profile > SODIUM_PER_L > fallback
    const naPerL = sub?.sodiumPerL ?? (SODIUM_PER_L[id]||900);

    const kcalS=met*w*durH, sweatS=sweatLh*durH, naS=sweatS*naPerL, mgS=sweatS*36;
    if(d.hasCompetition) compKcalDay+=(treynClamp(treynNum(d.compCount)||0,0,100))*kcalS*0.3/365;
    weekKcal+=kcalS*days; weekSweatL+=sweatS*days; weekNa+=naS*days; weekMg+=mgS*days;
    weekHours+=durH*days; weekCarbF+=durH*days*(CARB_INTENS_F[intens]||1);
    totalDays+=days;

    const kcalPerSession=Math.round(kcalS);
    sportBreakdown.push({id, subId:resolvedId, days, durationMin, intensity:intens, met, kcalPerSession});
    if(id===primarySport) prim={id, intens, durationMin, durH, sweatLh, sweatS, naPerL, naS, kcalPerSession};

    // Training time: Hauptsportart zuerst, sonst erste Angabe
    const times=Array.isArray(d.trainingTimes)?d.trainingTimes:[];
    if(times.length&&(!primaryTimeSet||id===primarySport)) {
      const ORDER = ["morning","midday","afternoon","evening"];
      const sorted = [...times].sort((a,b)=>ORDER.indexOf(a)-ORDER.indexOf(b));
      primaryTrainingTime = sorted[0]; // earliest
      primaryTimeSet = id===primarySport || primaryTimeSet;
    } else if(!times.length&&d.trainingTime&&!primaryTimeSet) primaryTrainingTime=d.trainingTime; // legacy fallback

    // Protein type: sub-profile > SPORT_TYPE_MAP > endurance
    const st = sub?.protType || SPORT_TYPE_MAP[id] || "endurance";
    const pf=(PROTEIN_NEED[st]||PROTEIN_NEED.endurance)[intens]; if(pf>maxProt)maxProt=pf;

    // Iron risk: sub-profile flag hat Vorrang, sonst HIGH_IRON_RISK
    const ironSport = sub ? !!sub.ironRisk : HIGH_IRON_RISK.includes(id);
    if(ironSport&&(intens==="high"||intens==="competition"))ironRisk=true;
  });
  if(!maxProt) maxProt=healthOnly?1.2:PROTEIN_NEED.endurance.medium;

  // Goal-based adjustments to macros
  const goalAdj={
    performance: {protMult:1.0, carbMult:1.0, kcalMult:1.0},
    muscle:      {protMult:1.2, carbMult:1.1, kcalMult:1.1},  // more protein + slight surplus
    endurance:   {protMult:0.9, carbMult:1.2, kcalMult:1.05}, // more carbs
    weightloss:  {protMult:1.1, carbMult:0.85,kcalMult:0.9},  // deficit, preserve muscle
    health:      {protMult:0.9, carbMult:1.0, kcalMult:1.0},
    recovery:    {protMult:1.1, carbMult:1.0, kcalMult:1.0},  // more protein for repair
  }[goal]||{protMult:1.0,carbMult:1.0,kcalMult:1.0};

  // Altitude → O2 adaptation, iron needs, hydration
  const altitudeMult={low:1.0, medium:1.05, high:1.12, alpine:1.20}[altitude]||1.0;
  const altitudeIronNeeded = altitude==="high"||altitude==="alpine";
  const altitudeHydrationBonus = {low:0, medium:100, high:250, alpine:400}[altitude]||0;
  const altitudeNote = altitude==="high"||altitude==="alpine" ? "Auf dieser Höhe ist dein Eisenstoffwechsel und Hydrationsbedarf erhöht." : null;

  // ── ENERGIE ──────────────────────────────────────────────────────────────
  // Trainingstag = echter Tag mit Training (Wochenverbrauch / Anzahl Trainingstage), nicht Wochenschnitt
  const daysPerWeek=Math.min(totalDays,7);
  const sportDayKcal=daysPerWeek>0?weekKcal/daysPerWeek:0;
  const toTarget=(burn)=>Math.max(bmr,Math.round(burn*altitudeMult*goalAdj.kcalMult+cycleKcalBonus));
  const restDay=toTarget(bmr+neatKcal);
  const withTraining=daysPerWeek>0?toTarget(bmr+neatKcal+sportDayKcal):restDay;
  const avgDayKcal=toTarget(bmr+neatKcal+weekKcal/7+compKcalDay);
  const trainingExtra=Math.round(sportDayKcal);

  const maxHR = Math.round(220 - age);
  const fatBurnMin = Math.round(maxHR * 0.60);
  const fatBurnMax = Math.round(maxHR * 0.70);

  // ── SCHWEISS & NATRIUM ───────────────────────────────────────────────────
  // Pro Einheit und pro Stunde der Hauptsportart; Tageswerte als Wochenschnitt
  const sweatRateLh=prim?+prim.sweatLh.toFixed(2):0;
  const sweatLitresPerSession=prim?+prim.sweatS.toFixed(1):0;
  const natriumMg=prim?Math.round(prim.naS):0;
  const natriumPerHourMg=prim?Math.round(prim.sweatLh*prim.naPerL):0;
  const natriumDayMg=Math.round(weekNa/7);
  const sweatDayL=+(weekSweatL/7).toFixed(2);
  const sweatTrainingDayL=daysPerWeek>0?weekSweatL/daysPerWeek:0;

  // ── WASSER ───────────────────────────────────────────────────────────────
  const neatWaterMl=Math.round(neatKcal*0.3);
  const waterRestMl=Math.round(Math.max(w*35, w*35+waterBonus+altitudeHydrationBonus+neatWaterMl));
  const waterMl=Math.round(waterRestMl+sweatTrainingDayL*1000);

  // ── PROTEIN (begrenzt auf max 2.4 bzw. 2.7 g/kg) ─────────────────────────
  // Recovery status → protein boost
  const recoveryProtBoost = {excellent:0, good:0, tired:0.1, recovery:0.15}[recoveryStatus]||0;
  const protGkg=(maxProt+recoveryProtBoost)*goalAdj.protMult*bodyCompProtMult;
  const protGkgMax=(maxProt+recoveryProtBoost+0.3)*goalAdj.protMult*bodyCompProtMult;
  const proteinMin=Math.round(w*Math.min(protGkg,2.4));
  const proteinMax=Math.max(proteinMin,Math.round(w*Math.min(protGkgMax,2.7)));
  const protein=proteinMin;

  // ── KOHLENHYDRATE ────────────────────────────────────────────────────────
  // Richtwert nach Trainingsstunden pro Trainingstag (ca. 3-12 g/kg), dann so begrenzt,
  // dass Protein + Kohlenhydrate + ca. 25% Fett ungefaehr withTraining ergeben.
  const hoursPerTrainingDay=daysPerWeek>0?weekHours/daysPerWeek:0;
  const carbIntensF=weekHours>0?weekCarbF/weekHours:1;
  const carbHoursBase=3+2.5*Math.min(hoursPerTrainingDay,3)+(hoursPerTrainingDay>3?(Math.min(hoursPerTrainingDay,5)-3)*0.75:0);
  const carbGuideGkg=treynClamp(carbHoursBase*carbIntensF*goalAdj.carbMult,3,12);
  const proteinMid=(proteinMin+proteinMax)/2;
  const carbRoomGkg=Math.max(0,(withTraining*0.75-proteinMid*4)/4/w);
  const carbsGkg=Math.max(2.5,Math.min(carbGuideGkg,carbRoomGkg));
  const carbsG=Math.round(w*carbsGkg);
  // Fett = Rest, mindestens 0.6 g/kg, hoechstens ca. 35% der kcal
  const fatG=treynClamp(Math.round((withTraining-proteinMid*4-carbsG*4)/9),Math.round(w*0.6),Math.max(Math.round(w*0.6),Math.round(withTraining*0.35/9)));
  // KH pro Trainingsstunde der Hauptsportart (unter 45 min nicht noetig), max 90 g/h
  const carbsPerHour=(()=>{
    if(!prim) return 0;
    const dm=prim.durationMin;
    if(dm<45) return 0;
    const base=dm<75?20:dm<=150?30+(dm-75)/75*30:Math.min(90,60+(dm-150)/90*30);
    const f={low:0.7,medium:0.9,high:1.0,competition:1.0}[prim.intens]||0.9;
    return Math.min(90,Math.round(base*f/5)*5);
  })();
  const raceCarbsPerHour=Math.min(120,Math.round(w*0.9));
  const carbLoadG=Math.round(w*Math.min(12,Math.max(8,(carbsG/w)*1.5)));

  // Training time → supplement timing recommendations
  const timingRecs={
    morning:  {preWorkout:"06:00-07:00",postWorkout:"08:00-09:00",creatine:"Nach dem Training mit Kohlenhydraten",note:"Nüchterntraining: niedrige Carbs vor, sofort Protein danach"},
    midday:   {preWorkout:"11:00-12:00",postWorkout:"13:00-14:00",creatine:"Nach dem Training mit Kohlenhydraten",note:"Ideales Fenster: Körper ist aufgewärmt, Cortisol niedrig"},
    afternoon:{preWorkout:"15:00-16:00",postWorkout:"17:00-18:00",creatine:"Nach dem Training mit Kohlenhydraten",note:"Peak-Performance-Zeit: optimale Kraft & Koordination"},
    evening:  {preWorkout:"18:00-19:00",postWorkout:"20:00-21:00",creatine:"Nach dem Training mit Kohlenhydraten",note:"Kein Koffein am Abend - beeinträchtigt die Schlafqualität"},
  }[primaryTrainingTime]||{preWorkout:"Variabel",postWorkout:"Variabel",creatine:"Täglich gleiche Zeit",note:"Kreatin immer zur selben Zeit einnehmen"};

  const VO2MAX_SPORTS = ["cycling","running","swimming","triathlon","langlauf","rudern","velo"];
  const hasEndurance = entries.some(([id]) => VO2MAX_SPORTS.some(s => id.includes(s)));
  let vo2max = null;
  if(hasEndurance) {
    const hrRest = treynClamp(treynNum(profilData?.rhr) || (isFemale ? 62 : 58),30,110);
    const base = 15 * (maxHR / hrRest);
    const genderAdj = isFemale ? -4 : 0;
    const ageAdj = age > 40 ? -(age-40)*0.5 : 0;
    const trainingAdj = Math.min(daysPerWeek * 0.8, 6);
    const intensAdj = maxProt > 1.6 ? 3 : 0;
    vo2max = Math.round(Math.max(25, Math.min(85, base + genderAdj + ageAdj + trainingAdj + intensAdj)));
  }
  const vo2maxLabel = vo2max ? (vo2max < 35?"Unterdurchschnittlich":vo2max < 45?"Durchschnittlich":vo2max < 55?"Gut":vo2max < 65?"Sehr gut":"Exzellent") : null;

  // Stress → cortisol impact on recovery + magnesium need (Herausforderung "Stress" zaehlt mit)
  const stressMgBonus = (stressLevel-3)*30; // high stress = +60mg Mg, low = -60mg
  const stressAshwaNeeded = stressLevel >= 4 || challenges.includes("stress");
  const stressRecoveryNote = stressLevel >= 4 ? "Hoher Stress erhöht Cortisol - Ashwagandha, Magnesium und Schlaf sind kritisch für Regeneration." : null;

  // Diet quality → micronutrient risk
  const b12Risk = (dietQuality==="poor")||(profilData?.diet||[]).includes("vegan");
  const ironRiskDiet = dietQuality==="poor"&&isFemale;

  // Injury → specific supplement recs (Herausforderung "Gelenke & Sehnen" zaehlt mit)
  const needsCollagen = injuries.some(i=>["knee","ankle","tendon","shoulder"].includes(i)) || challenges.includes("joints");
  const needsOmega3Extra = injuries.some(i=>["back","muscle","shoulder"].includes(i));

  // Recovery status → Magnesium + ashwagandha priority
  const recoveryMgBonus = {excellent:0, good:0, tired:60, recovery:100}[recoveryStatus]||0;
  const recoveryAshwaNeeded = recoveryStatus==="tired"||recoveryStatus==="recovery";
  const recoveryNote = recoveryStatus==="tired"
    ? "Akkumulierte Müdigkeit: Magnesium, Ashwagandha und mehr Schlaf haben aktuell höchste Priorität."
    : recoveryStatus==="recovery"
    ? "Verletzungs-/Pausenphase: Kollagen, Omega-3 und Protein sind jetzt wichtiger als Performance-Supplements."
    : null;

  // Magnesium als Supplement-Dosis: begrenzt auf 200-400 mg pro Tag
  const magnesiumMg=Math.round(treynClamp(200+weekMg/7+sleepMgBonus+stressMgBonus+recoveryMgBonus+cycleMgBonus,200,400)/10)*10;

  // Current supplements → suppress duplicate recommendations
  const alreadyHas = (id) => currentSupps.includes(id)||currentSupps.includes("none")===false&&false;
  const suppressKreatin = currentSupps.includes("kreatin");
  const suppressProtein  = currentSupps.includes("protein");
  const suppressVitD     = currentSupps.includes("vitd");
  const suppressOmega3   = currentSupps.includes("omega3");
  const suppressMag      = currentSupps.includes("magnesium");
  const suppressEisen    = currentSupps.includes("eisen");
  const suppressZink     = currentSupps.includes("zink");
  const suppressAshwa    = currentSupps.includes("ashwa");
  const suppressCollagen = currentSupps.includes("collagen");
  const suppressBetaAla  = currentSupps.includes("beta_ala");
  const suppressKoffein  = currentSupps.includes("koffein");

  // Medication contraindications map: suppId → warning text
  const MEDI_WARNINGS = {
    omega3:    hasBlutverd  ? "Blutverdünner: Omega-3 kann die Blutungszeit verlängern - Dosis mit Arzt absprechen." : null,
    ashwa:     hasSchilddruese ? "Schilddrüsenmedikamente: Ashwagandha beeinflusst Schilddrüsenhormone - Arzt konsultieren." : null,
    ash_cy:    hasSchilddruese ? "Schilddrüsenmedikamente: Ashwagandha beeinflusst Schilddrüsenhormone - Arzt konsultieren." : null,
    ash_g:     hasSchilddruese ? "Schilddrüsenmedikamente: Ashwagandha beeinflusst Schilddrüsenhormone - Arzt konsultieren." : null,
    koff_fit:  hasBlutdruck ? "Blutdruckmedikamente: Koffein kann Blutdruck temporär erhöhen - Rücksprache empfohlen." : null,
    koff_run:  hasBlutdruck ? "Blutdruckmedikamente: Koffein kann Blutdruck temporär erhöhen - Rücksprache empfohlen." : null,
    koff_g:    hasBlutdruck ? "Blutdruckmedikamente: Koffein kann Blutdruck temporär erhöhen - Rücksprache empfohlen." : null,
    vitd3:     null,
    krea_cy:   null,
    krea_g:    null,
  };

  // Budget → priority threshold
  const budgetPriorityMax = {low:1, medium:2, high:3, max:99}[monthlyBudget]||2;

  return {
    bmr, totalDays:daysPerWeek, sessionsPerWeek:totalDays,
    // Energie: withTraining = ein Trainingstag, avgDayKcal = Wochenschnitt, restDay = Ruhetag
    withTraining, trainingDay:withTraining, avgDayKcal, restDay, trainingExtra,
    // Schweiss & Natrium (Hauptsportart pro Einheit / pro Stunde, Tag = Wochenschnitt)
    sweatLitresPerSession, sweatRateLh, sweatDayL,
    natriumMg, natriumPerHourMg, natriumDayMg,
    magnesiumMg,
    protein, proteinMin, proteinMax,
    carbsG, carbsPerHour, raceCarbsPerHour, carbLoadG, fatG,
    waterMl, waterRestMl,
    fatBurnMin, fatBurnMax, vo2max, vo2maxLabel,
    sleep, sleepDeficit,
    ironRisk:ironRisk||altitudeIronNeeded||ironRiskDiet||cycleIronBoost,
    isFemale, w, age, goal, challenges, primaryTrainingTime, timingRecs,
    primarySport, sportBreakdown, healthOnly,
    // Existing insight flags
    stressAshwaNeeded, stressRecoveryNote, vitDRisk, b12Risk,
    altitudeIronNeeded, altitudeNote, needsCollagen, needsOmega3Extra,
    stressLevel, dietQuality, altitude, injuries,
    // New insight flags
    recoveryStatus, recoveryNote, recoveryAshwaNeeded, recoveryProtBoost,
    currentSupps, medications, monthlyBudget, budgetPriorityMax,
    suppressKreatin, suppressProtein, suppressVitD, suppressOmega3,
    suppressMag, suppressEisen, suppressZink, suppressAshwa,
    suppressCollagen, suppressBetaAla, suppressKoffein,
    hasBlutverd, hasSchilddruese, hasBlutdruck,
    MEDI_WARNINGS,
    // Precision inputs
    neatKcal, vitDDose, vitDNeed,
    caffeinePreWorkoutDose, caffeineToleranceHigh, caffeineSensitive, caffeineNone, caffeineCutoff,
    sleepHours, sleepMgBonus, sleepAshwaNeeded,
    waterDeficit, waterIntake, waterBonus,
    cyclePhase, cycleIronBoost, cycleMgBonus, cycleKcalBonus,
    isLean, bodyComposition, jobActivity,
  };
}


function calcKcal(profilData, trainingData, sportData) {
  return calcPro(profilData, trainingData, sportData);
}

function buildProfile(sportData, trainingData, profilData) {
  const healthOnly=sportData?.healthOnly, primarySport=sportData?.primarySport;
  const td=trainingData?.[primarySport]||{};
  return {healthOnly, primarySport, weight:sanitizeBody(profilData).w, gender:profilData?.gender||"m",
    days:Object.values(trainingData||{}).reduce((s,x)=>s+(x?.days||0),0)||td.days||3, intensity:td.intensity||"medium", duration:td.duration||60,
    hasComp:td.hasCompetition||false, compCount:td.compCount||0};
}

const SPORT_NUTRITION = {
  cycling:{
    primary:[
      {id:"sn_mau_320",barcode:"73160700",name:"Maurten Drink Mix 320",dose:"80g / 500ml - 1 Flasche/h",when:"Ausfahrten über 2h",why:"Konstante Kohlenhydratzufuhr mit Hydrogel-Technologie - reduziert GI-Stress bei hoher Intensität.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
      {id:"sn_mau_caf_2",name:"Maurten Gel 100 CAF 100",dose:"1 Gel alle 40-45 min",when:"Rennen & intensive Einheiten",why:"Koffein + Kohlenhydrate für maximale Leistung - unverzichtbar bei Wettkämpfen.",link:AFF.maurten("gel-100-caf-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_mn_heat_2",name:"MNSTRY Fast Carb Heat",dose:"1 Portion 30 min vor Start",when:"Vor Touren über 3h",why:"Optionale Kohlenhydrat-Aufladung für sehr lange Einheiten.",link:AFF.mnstry("fast-carb-heat"),shop:"MNSTRY"},
      {id:"sn_elek_2",name:"Sponser Elektrolyt-Tabs",dose:"1 Tab / 500ml",when:"Sommer & intensive Einheiten",why:"Natriumverlust ausgleichen - besonders sinnvoll ab 25°C.",link:AFF.sponser("elektrolyt"),shop:"Sponser"},
    ],
  },
  running:{
    primary:[
      {id:"sn_mau_gel_r",name:"Maurten Gel 100",dose:"1 Gel alle 30-40 min",when:"Läufe ab 75 min",why:"Magenfreundliche Energieversorgung durch Hydrogel-Technologie.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_mn_gel_r",name:"MNSTRY Intensity Gel",dose:"1 Gel alle 30-45 min",when:"Tempoläufe & Rennen",why:"Natürliche Zutaten, geringe GI-Belastung.",link:AFF.mnstry("intensity-gel"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_mau_160",name:"Maurten Drink Mix 160",dose:"40g / 500ml",when:"Mittellange Läufe (60-90 min)",why:"Optional für Läufe wenn du Kohlenhydrate trinken statt essen willst.",link:AFF.maurten("drink-mix-160"),shop:"Maurten"},
    ],
  },
  // Strassenlauf - distanzspezifisch
  run_short:{
    primary:[
      {id:"sn_koff_5k",name:"Koffein 100mg",dose:"100mg",when:"45 min vor Rennen",why:"5-10km ist hochintensiv und anaerob - Koffein für Reaktion und Pace-Halten kritischer als Carbs.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_5k",name:"Elektrolyt-Tabs",dose:"1 Tab vor Start",when:"Vor Rennen",why:"Kurze Distanz: Hydration vor dem Start wichtiger als während.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  run_hm:{
    primary:[
      {id:"sn_gel_hm",name:"Maurten Gel 100",dose:"1-2 Gels",when:"Ab km 8, alle 45 min",why:"Halbmarathon: 1-2 Gels reichen - Timing und Magenverträglichkeit trainieren.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_hm",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Vor Start und während",why:"90 min Lauf: Natrium- und Kaliumverlust beachten, v.a. bei Hitze.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  run_marathon:{
    primary:[
      {id:"sn_gel_m",name:"Maurten Gel 100",dose:"1 Gel alle 30-35 min",when:"Ab km 10",why:"Marathon: 60-90g Carbs/h nötig - regelmässiges Fueling ab früh, nicht erst wenn Hunger kommt.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_320_m",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Alternierend mit Gels",why:"Flüssige Carbs kombinieren mit Gels für maximale Aufnahme ohne GI-Stress.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_m",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Alle 45-60 min",why:"3-4h Lauf: erheblicher Natriumverlust - Krampfprävention essentiell.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_caf_m",name:"Maurten Gel 100 CAF 100",dose:"1 Gel bei km 30-35",when:"Letzte 10km",why:"Koffein-Gel für die kritische Schlussphase - bekämpft den berühmten Einbruch bei km 32.",link:AFF.maurten("gel-100-caf-100"),shop:"Maurten"},
    ],
  },
  run_ultra:{
    primary:[
      {id:"sn_gel_ul",name:"Maurten Gel 100",dose:"1 Gel alle 45-60 min",when:"Kontinuierlich ab Start",why:"Ultra: niedrigere Intensität erlaubt weniger Carbs - aber Konstanz ist alles.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_real_ul",name:"Echtes Essen (Banane, Reis, Kartoffeln)",dose:"Alle 2-3h",when:"An Verpflegungsstationen",why:"Ab 4h+ versagt der Körper bei reinen Gels - feste, salzige Nahrung ist Pflicht.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_ul",name:"Elektrolyt-Tabs",dose:"1-2 Tabs / 0.5L",when:"Alle 45 min",why:"Ultra: Natriummangel (Hyponatriämie) ist ein reales Risiko - mehr als nur Wasser trinken.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_kof_ul",name:"Koffein-Gel (100mg)",dose:"1 Gel nachts oder bei km 60+",when:"Bei Müdigkeit / Nachtabschnitt",why:"Strategisch einsetzen, nicht früh - maximale Wirkung für die dunkelsten Stunden.",link:AFF.iherb("caffeine gel"),shop:"iHerb"},
    ],
  },
  // Triathlon - distanzspezifisch
  tri_sprint:{
    primary:[
      {id:"sn_koff_tri_s",name:"Koffein 100mg",dose:"100mg",when:"45 min vor Start",why:"Sprint-Tri (ca. 60 min): kein Fueling nötig - Koffein für Intensität ausreichend.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_tri_s",name:"Elektrolyt-Tabs",dose:"1 Tab",when:"Vor Start",why:"Hydration vorbereiten, keine Gels nötig bei dieser Distanz.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  tri_olympic:{
    primary:[
      {id:"sn_gel_tri_o",name:"Maurten Gel 100",dose:"1-2 Gels",when:"Auf der Radstrecke",why:"Olympic (ca. 2h): 1-2 Gels auf dem Rad, nichts auf der Laufstrecke.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_tri_o",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Rad und Lauf",why:"Natrium für Leistungserhalt über alle drei Disziplinen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  tri_half:{
    primary:[
      {id:"sn_gel_tri_h",name:"Maurten Gel 100",dose:"1 Gel alle 40 min",when:"Rad ab km 20",why:"70.3 (ca. 4-5h): 60g Carbs/h anstreben - Magen-Training kritisch im Aufbau.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_160_tri_h",name:"Maurten Drink Mix 160",dose:"40g / 500ml",when:"Auf dem Rad",why:"Flüssige Carbs reduzieren GI-Risiko auf dem Rad gegenüber Gels.",link:AFF.maurten("drink-mix-160"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_tri_h",name:"Elektrolyt-Tabs",dose:"1-2 Tabs / 0.5L",when:"Konstant",why:"4-5h Belastung: Natrium-, Kalium- und Magnesiumverlust erheblich.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  tri_full:{
    primary:[
      {id:"sn_320_tri_f",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Auf dem Rad, alle 45 min",why:"Ironman (8-17h): 80-90g Carbs/h auf dem Rad ist der Schlüssel - mit Hydrogel magenfreundlich.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
      {id:"sn_gel_tri_f",name:"Maurten Gel 100",dose:"1 Gel alle 35-40 min",when:"Auf dem Lauf",why:"Marathon-Teil: weiter mit Gels - festes Essen nur wenn Magen es verlangt.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_tri_f",name:"Elektrolyt-Tabs",dose:"2 Tabs / 0.5L",when:"Konstant alle 45 min",why:"10h+: Elektrolythaushalt ist Hauptursache für DNF - niemals vernachlässigen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_caf_tri_f",name:"Maurten Gel 100 CAF 100",dose:"1-2 Gels",when:"Ab km 25 auf dem Lauf",why:"Koffein für die kritische Schlussphase des Ironman-Laufs.",link:AFF.maurten("gel-100-caf-100"),shop:"Maurten"},
    ],
  },
  tri_ultra:{
    primary:[
      {id:"sn_320_tri_u",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Konstant auf dem Rad",why:"Ultra-Tri (T100, Deca): Magentraining ist trainierbare Fähigkeit - konsequentes Fueling von Stunde 1.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
      {id:"sn_real_tri_u",name:"Echtes Essen",dose:"Alle 2-3h",when:"An Verpflegung",why:"Ab 10h+ wird reines Gel-Fueling psychologisch und physiologisch schwierig.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_tri_u",name:"Elektrolyt-Tabs",dose:"2 Tabs / 0.5L",when:"Alle 30-45 min",why:"Extreme Distanz: Hyponatriämie-Risiko hoch - konsequent salzen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Schwimmen - distanzspezifisch
  swim_sprint:{
    primary:[
      {id:"sn_koff_sw_s",name:"Koffein 100mg",dose:"100mg",when:"45 min vor Start",why:"Sprint/Kurzbahn: hochintensiv, kurz - Koffein für Reaktion und Startpower.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_sw_s",name:"Elektrolyt-Tabs",dose:"1 Tab",when:"Vor dem Training",why:"Schwimmen täuscht über Flüssigkeitsverlust - Schweiss wird weggespült.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  swim_mid:{
    primary:[
      {id:"sn_gel_sw_m",name:"Maurten Gel 100",dose:"1 Gel vor Start",when:"30 min vor längeren Einheiten",why:"Mitteldistanz: Energieversorgung vor dem Start, im Wasser kein Fueling möglich.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_sw_m",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Nach Einheit",why:"Schwimmen: Flüssigkeitsverlust wird unterschätzt - Rehydration nach der Einheit.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  swim_open:{
    primary:[
      {id:"sn_gel_sw_o",name:"Maurten Gel 100",dose:"1-2 Gels",when:"Vor Start, ggf. Pause bei langer Distanz",why:"Open Water / Freiwasser: Fueling nur vor und bei Pausen möglich - Energiereserven vorladen.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_sw_o",name:"Elektrolyt-Tabs",dose:"1-2 Tabs",when:"Vor und nach",why:"Freiwasser: Kälte und Dauer erhöhen Elektrolytverlust - gute Vorbereitung entscheidend.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // MTB Downhill - wenig Ausdauer, mehr Fokus & explosive Energie
  cycling_dh:{
    primary:[
      {id:"sn_koff_dh",name:"Koffein-Gel (100mg)",dose:"1 Gel 45 min vor erstem Run",when:"Wettkampf / Training",why:"Fokus und Reaktionszeit auf technischem Terrain - kein langer Kohlenhydratbedarf bei kurzen Runs.",link:AFF.iherb("caffeine gel"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_dh",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Zwischen Runs",why:"Auch kurze Renntage haben Schweissverlust - Krampfprävention.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Fitness Strength-focused (Powerlifting, Weightlifting, Sprung, Wurf)
  fitness_str:{
    primary:[
      {id:"sn_krea_sn",name:"Kreatin Monohydrat",dose:"5g täglich",when:"Nach Training",why:"Kraftsport-Basisnahrung - verbessert Maximalkraft und Wiederholungen nachweislich.",link:AFF.iherb("creatine monohydrate"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_str",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Bei intensivem Training",why:"Auch Krafttraining erzeugt Schweiss - Hydration nicht vernachlässigen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Fitness (Hyrox, CrossFit)
  fitness:{
    primary:[
      {id:"sn_krea_fit",name:"Kreatin Monohydrat",dose:"5g täglich",when:"Nach Training",why:"Hyrox und CrossFit: explosive Kraft und Wiederholbarkeit - Kreatin ist Basis.",link:AFF.iherb("creatine monohydrate"),shop:"iHerb"},
      {id:"sn_koff_fit",name:"Koffein 100-200mg",dose:"100-200mg",when:"30-45 min vor Training",why:"Maximale Leistung bei hochintensiven WODs und Hyrox-Stationen.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_fit",name:"Elektrolyt-Tabs",dose:"1-2 Tabs / 0.5L",when:"Während Training",why:"Crossfit und Hyrox erzeugen hohe Schweissraten - Hydration entscheidend.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Leichtathletik Sprint
  la_sprint:{
    primary:[
      {id:"sn_koff_sp",name:"Koffein 100-200mg",dose:"100-200mg",when:"45 min vor Start",why:"Reaktionszeit und neuromuskuläre Aktivierung für explosive Kurzbelastungen.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_sp",name:"Elektrolyt-Tabs",dose:"1 Tab",when:"Nach Einheit",why:"Aufwärmprogramme und Sprints erzeugen mehr Schweiss als wahrgenommen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Ski (Alpin, Freeride, Snowboard)
  ski:{
    primary:[
      {id:"sn_riegel_ski",name:"Energieriegel",dose:"1 Riegel / 2h",when:"Am Berg zwischen Läufen",why:"Kompakt, gefriert nicht wie Gels - ideal für kalte Umgebungen.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_ski",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Mittagspause / zwischendurch",why:"Kälte täuscht über Flüssigkeitsverlust - trotzdem regelmässig trinken.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Skitouren
  ski_touring:{
    primary:[
      {id:"sn_mau_gel_st2",name:"Maurten Gel 100",dose:"1 Gel alle 45-60 min",when:"Aufstieg",why:"Magenfreundlich auch bei Kälte - keine Einfrierproblematik bei Körperwärme.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_riegel_st",name:"Energieriegel",dose:"1 Riegel / 2h",when:"Gipfelpause / Abstieg",why:"Solide Energie für lange Touren - Sättigung wichtiger als bei kurzen Rennen.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_st2",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Alle 60 min",why:"Hoher Schweiss- und Energieverbrauch bei langen Aufstiegen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Langlauf & Biathlon
  langlauf:{
    primary:[
      {id:"sn_mau_gel_xl2",name:"Maurten Gel 100",dose:"1 Gel alle 30-40 min",when:"Einheiten über 60 min",why:"Höchster MET aller Sportarten - kontinuierliche Kohlenhydratzufuhr kritisch.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_mau_320_xl2",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Lange Einheiten über 2h",why:"Maximale Kohlenhydratdichte für 2-4h Ausdauerbelastungen.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_xl2",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Alle 45-60 min",why:"Hoher Natriumverlust auch bei Kälte - Krampfprävention und Leistungserhalt.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Langlauf Kurzdistanz (bis 15km)
  langlauf_kurz:{
    primary:[
      {id:"sn_koff_xl_k",name:"Koffein-Gel 100mg",dose:"1 Gel 45 min vor Start",when:"Wettkampf / Intensivtraining",why:"Kurzdistanz Langlauf ist hochintensiv - Koffein für maximale Pace und Reaktion.",link:AFF.iherb("caffeine gel"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_xl_k",name:"Elektrolyt-Tabs",dose:"1 Tab vor Start",when:"Vor Rennen",why:"Kurze Distanz: Hydration vor dem Start entscheidend, kein Fueling unterwegs nötig.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Langlauf Mitteldistanz (15-50km, z.B. Engadin)
  langlauf_mittel:{
    primary:[
      {id:"sn_gel_xl_m",name:"Maurten Gel 100",dose:"1 Gel alle 40-45 min",when:"Ab km 10",why:"Mitteldistanz (1.5-3h): 2-4 Gels je nach Tempo - früh starten, nicht erst bei Hunger.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_xl_m",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Alle 45 min",why:"Natrium und Kalium für Leistungserhalt - Kälte täuscht über Schweissverlust.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_320_xl_m",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"An Verpflegungsstationen",why:"Flüssige Carbs ergänzen Gels - an Stationen trinken wenn vorhanden.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
    ],
  },
  // Langlauf Langdistanz (50km+, z.B. Vasaloppet, Birkebeiner)
  langlauf_lang:{
    primary:[
      {id:"sn_gel_xl_l",name:"Maurten Gel 100",dose:"1 Gel alle 35-40 min",when:"Kontinuierlich ab Start",why:"50km+ Langlauf: höchster Energieumsatz aller Ausdauersportarten - konsequentes Fueling von km 1.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_real_xl_l",name:"Echtes Essen (Banane, Riegel, Suppe)",dose:"Alle 1.5-2h",when:"An Verpflegungsstationen",why:"Ab 3h+ wird reines Gel-Fueling psychologisch und physiologisch schwierig - feste Nahrung Pflicht.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_xl_l",name:"Elektrolyt-Tabs",dose:"1-2 Tabs / 0.5L",when:"Alle 30-40 min",why:"Langdistanz: Natriummangel (Hyponatriämie) ist reales Risiko - regelmässig salzen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_caf_xl_l",name:"Koffein-Gel 100mg",dose:"1-2 Gels strategisch",when:"Ab km 40, bei Einbruch",why:"Koffein gezielt einsetzen für die kritische Schlussphase - nicht zu früh verbrauchen.",link:AFF.iherb("caffeine gel"),shop:"iHerb"},
    ],
  },
  // Tennis & Padel
  tennis:{
    primary:[
      {id:"sn_banana_ten",name:"Banane / schnelle Carbs",dose:"1 Stück pro Satzpause",when:"Seitenwechsel / Spielpausen",why:"ATP-Standard: Bananen für schnelle Energie bei langen Matches.",link:AFF.iherb("dextrose"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_ten2",name:"Elektrolyt-Tabs",dose:"1-2 Tabs / 0.5L",when:"Während Match",why:"Tennis-Matches bis 5h - Natriumverlust erheblich auf Hartplatz.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Team Sports (Handball, Volleyball)
  team_sport:{
    primary:[
      {id:"sn_krea_team",name:"Kreatin Monohydrat",dose:"5g täglich",when:"Nach Training / Spiel",why:"Sprintwiederholungen und explosive Bewegungen - Kreatin direkt relevant.",link:AFF.iherb("creatine monohydrate"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_team",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Während Spiel / Training",why:"Hochintensive Teamspiele mit hohem Schweissvolumen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Kampfsport
  kampfsport:{
    primary:[
      {id:"sn_krea_ks2",name:"Kreatin Monohydrat",dose:"5g täglich",when:"Nach Training",why:"Explosive Schläge und Würfe - Kreatin verbessert Kraft-Wiederholbarkeit.",link:AFF.iherb("creatine monohydrate"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_ks2",name:"Elektrolyt-Tabs",dose:"1-2 Tabs / 0.5L",when:"Sparring und lange Einheiten",why:"Hohes Schweissvolumen bei Kampfsport - Elektrolyte nicht vernachlässigen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
};
const genericSportNutrition={
  primary:[{id:"sn_gen",name:"Energie-Gel (Maurten / MNSTRY)",dose:"1 Gel alle 30-45 min",when:"Einheiten über 60 min",why:"Schnell verfügbare Kohlenhydrate für Training und Wettkampf.",link:AFF.maurten("gel-100"),shop:"Maurten"}],
  secondary:[{id:"sn_elek_g",name:"Elektrolyt-Tabletten",dose:"1 Tab / 500ml",when:"Bei starkem Schwitzen",why:"Natriumverlust ausgleichen.",link:AFF.iherb("electrolyte"),shop:"iHerb"}],
};
function getSportNutrition(id, subSel, childSel={}) {
  // Try to find active sub-sport nutritionKey - check children first
  if(subSel) {
    const group = (typeof SPORT_GROUPS !== "undefined" ? SPORT_GROUPS : []).find(g=>g.id===id);
    if(group?.subs) {
      let resolvedId = null;
      for(const sub of group.subs) {
        if(sub.children?.length>0) {
          const selectedChild = sub.children.find(ch=>childSel[sub.id+"_"+ch.id]);
          if(selectedChild) { resolvedId = selectedChild.id; break; }
        } else if(subSel[sub.id]) { resolvedId = sub.id; break; }
      }
      if(resolvedId) {
        const subProf = getSubProfile(resolvedId);
        if(subProf?.nutritionKey && SPORT_NUTRITION[subProf.nutritionKey]) {
          return SPORT_NUTRITION[subProf.nutritionKey];
        }
      }
    }
  }
  return SPORT_NUTRITION[id]||(id==="triathlon"?SPORT_NUTRITION.cycling:genericSportNutrition);
}

// ─── WIRKSTOFF-SCHLÜSSEL ─────────────────────────────────────────────────────
// Ordnet jedem Supplement seine Wirkstoffe zu (gleiche Schlüssel wie currentSupps im Onboarding).
// Wird für «Nimmst du schon», Medikamenten-Warnungen und Interaktionen gebraucht.
const SUPP_KEYS = {
  kreatin:   s=>/krea/.test(s.id),
  protein:   s=>/whey|(^|_)prot/.test(s.id),
  vitd:      s=>/vd3|vitd/.test(s.id),
  omega3:    s=>/omega/.test(s.id),
  magnesium: s=>/(^|_)mag/.test(s.id),
  eisen:     s=>/eisen|iron/.test(s.id),
  zink:      s=>/zink/.test(s.id),
  ashwa:     s=>/(^|_)ash/.test(s.id),
  collagen:  s=>/koll|collagen/.test(s.id),
  beta_ala:  s=>/beta/.test(s.id),
  koffein:   s=>/koff|(^|_)kof_|(^|_)caf/.test(s.id)||/koffein|\bCAF\b/i.test(s.name||""),
};
function suppKeysOf(supp) {
  const s = typeof supp==="string" ? {id:supp} : {...(supp||{}), id:String(supp?.id||"")};
  return Object.keys(SUPP_KEYS).filter(k=>SUPP_KEYS[k](s));
}
// Nimmt der User diesen Wirkstoff schon? (currentSupps aus dem Onboarding)
function isAlreadyTaking(supp, currentSupps) {
  const cur = Array.isArray(currentSupps) ? currentSupps : [];
  return suppKeysOf(supp).some(k=>cur.includes(k));
}
// Medikamenten-Warnungen nach Wirkstoff (gleiche Texte wie MEDI_WARNINGS in calcPro, gilt für alle Varianten)
const MEDI_RULES = [
  {med:"blutverd",     key:"omega3",  msg:"Blutverdünner: Omega-3 kann die Blutungszeit verlängern - Dosis mit Arzt absprechen."},
  {med:"schilddruese", key:"ashwa",   msg:"Schilddrüsenmedikamente: Ashwagandha beeinflusst Schilddrüsenhormone - Arzt konsultieren."},
  {med:"blutdruck",    key:"koffein", msg:"Blutdruckmedikamente: Koffein kann Blutdruck temporär erhöhen - Rücksprache empfohlen."},
];
function getMediWarning(supp, medications) {
  const meds = Array.isArray(medications) ? medications : [];
  if(!meds.length) return null;
  const keys = suppKeysOf(supp);
  const hits = MEDI_RULES.filter(r=>meds.includes(r.med)&&keys.includes(r.key)).map(r=>r.msg);
  return hits.length ? hits.join(" ") : null;
}

// Shop-Link passend zum Land (die Links in den Daten sind mit dem Standardland Schweiz gebaut)
function localizeShop(s, country="Schweiz") {
  const shop = s?.shop||"iHerb", link = s?.link||"#";
  const isCH = CH_COUNTRIES.includes(country), isDACH = DACH_COUNTRIES.includes(country);
  if(isCH) return {link, shop};
  if(shop==="Myprotein") return {link:String(link).replace("/de-ch/","/de-de/"), shop};
  const chOnly = ["Bodylab24","Sponser","Zur Rose","nu3.ch"];
  const dachOnly = ["ESN","More Nutrition","nu3"];
  if(chOnly.includes(shop)||(dachOnly.includes(shop)&&!isDACH)) {
    const name = String(s?.name||"");
    const q = /elektrolyt/i.test(name) ? "electrolyte tablets" : name.replace(/^(Sponser|Bodylab24)\s+/i,"");
    return {link:AFF.iherb(q), shop:"iHerb"};
  }
  return {link, shop};
}

function getPersonalizedSupps(profile, sportSupps, basisSupps, proData) {
  const {gender,weight,days,intensity,hasComp,compCount}=profile||{};
  const isFemale=gender==="f", isHeavy=weight>85;
  const isHighLoad=days>=5||intensity==="high"||intensity==="competition";
  const isCompetitor=hasComp&&compCount>5, isPro=!!proData;
  const ironRisk=proData?.ironRisk||false, highMg=(proData?.magnesiumMg||0)>350;

  // New: suppress, medication, budget, recovery from proData
  const suppress = {
    kreatin:  proData?.suppressKreatin||false,
    protein:  proData?.suppressProtein||false,
    vitd:     proData?.suppressVitD||false,
    omega3:   proData?.suppressOmega3||false,
    magnesium:proData?.suppressMag||false,
    eisen:    proData?.suppressEisen||false,
    zink:     proData?.suppressZink||false,
    ashwa:    proData?.suppressAshwa||false,
    collagen: proData?.suppressCollagen||false,
    beta_ala: proData?.suppressBetaAla||false,
    koffein:  proData?.suppressKoffein||false,
  };
  const MEDI_WARNINGS = proData?.MEDI_WARNINGS||{};
  const medications = proData?.medications||[];
  const budgetPriorityMax = proData?.budgetPriorityMax||99;
  const recoveryAshwaNeeded = proData?.recoveryAshwaNeeded||false;
  const ashwaNeeded = recoveryAshwaNeeded||!!proData?.sleepAshwaNeeded||!!proData?.stressAshwaNeeded;
  const ashwaReason = recoveryAshwaNeeded?" Aktuell besonders wichtig: dein Erholungsstatus zeigt erhöhten Cortisolbedarf."
    : proData?.sleepAshwaNeeded?" Aktuell besonders wichtig: du schläfst wenig - Ashwagandha kann die Schlaftiefe verbessern."
    : proData?.stressAshwaNeeded?" Aktuell besonders wichtig: dein Stresslevel ist hoch - Ashwagandha senkt Cortisol."
    : null;
  const recoveryStatus = proData?.recoveryStatus||"good";
  const needsCollagen = !!proData?.needsCollagen;

  // Suppress helper - returns true if this supplement should be hidden/deprioritised
  function isSuppressed(s) {
    return suppKeysOf(s).some(k=>suppress[k]);
  }
  const mediFor = (s) => MEDI_WARNINGS[s.id]||getMediWarning(s, medications)||null;

  // Doppelte entfernen: gleiche id nur einmal; Vitamin D aus BASIS (vitd3) ersetzt die sportspezifische Variante (vd3_*),
  // übernimmt aber deren Begründung
  const merged=[...(basisSupps||[]),...(sportSupps||[])].filter(s=>s&&s.id);
  const hasBasisD=merged.some(s=>s.id==="vitd3");
  const sportD=merged.find(s=>s.id.startsWith("vd3_"));
  const seen=new Set();
  const input=merged.filter(s=>{
    if(seen.has(s.id)) return false;
    if(hasBasisD&&s.id.startsWith("vd3_")) return false;
    seen.add(s.id);
    return true;
  }).map(s=>s.id==="vitd3"&&sportD?{...s,why:sportD.why}:s);

  const primSupps=[], secSupps=[];
  input.forEach(s=>{
    // Skip if user already takes this supplement
    if(isSuppressed(s)) {
      // Still show but marked as "bereits vorhanden"
      secSupps.push({...s,personalWhy:s.why,alreadyTaking:true,mediWarning:mediFor(s)});
      return;
    }

    let personalWhy=s.why, boost=false;
    if(s.id==="vitd3"||s.id.startsWith("vd3_")){
      personalWhy=`70% der CH-Bevölkerung ist Vitamin D-mangelhaft.${isHighLoad?" Bei deiner Trainingsbelastung steigt der Bedarf durch Knochenumbau und Immunstress.":""}${isPro?` Empfohlene Dosis: ${isHighLoad?"3000-4000":"2000"} IE/Tag.`:""}`;
      boost=true;
    }
    if(s.id.startsWith("eisen_")&&(isFemale||ironRisk)){
      personalWhy=s.why+(isFemale?" Frauen haben generell erhöhten Eisenbedarf.":"")+(ironRisk&&isPro?" Deine Sportart erhöht den Eisenverlust durch Hämolyse - Bluttest zwingend.":"");
      boost=true;
    }
    if((s.id==="magnesium"||s.id==="mag_h")&&(isHighLoad||highMg)){
      personalWhy=s.why+(isPro&&highMg?` Dein berechneter Magnesiumverlust: ${proData.magnesiumMg}mg/Tag - Supplementierung zwingend.`:` Bei ${days}× Training/Woche verlierst du deutlich mehr Magnesium über Schweiss.`);
      boost=true;
    }
    if(s.id.startsWith("whey_")&&isHeavy){
      personalWhy=s.why+(isPro?` Bei ${weight}kg und ${proData?.proteinMin||Math.round(weight*1.4)}g Proteinbedarf täglich: 30-35g pro Portion.`:` Bei ${weight}kg empfehlen sich 30-35g pro Portion.`);
      boost=true;
    }
    if((s.id==="kreatin_cy"||s.id==="kreatin_fit"||s.id==="krea_g"||s.id.startsWith("krea_"))&&isCompetitor){
      personalWhy=s.why+` Mit ${compCount} Wettkämpfen/Jahr ist Kreatin für die Regeneration zwischen Starts besonders wertvoll.`;
      boost=true;
    }
    if((s.id==="ashwa_cy"||s.id==="ash_g"||s.id.startsWith("ash_"))&&(isHighLoad||ashwaNeeded)){
      personalWhy=s.why+(ashwaReason||" Sinnvoll bei "+days+"× Training/Woche zur Cortisolregulation.");
      boost=ashwaNeeded?true:boost; // force boost if recovery needs it
    }
    // Recovery phase: boost collagen + omega3
    if((recoveryStatus==="recovery")&&(s.id.includes("koll")||s.id.includes("omega"))){
      personalWhy=s.why+" Verletzungs-/Pausenphase: Kollagen und Omega-3 haben jetzt höchste Priorität.";
      boost=true;
    } else if(needsCollagen&&s.id.includes("koll")){
      personalWhy=s.why+" Bei deinen Gelenk- oder Sehnenbeschwerden besonders sinnvoll.";
      boost=true;
    }

    // Medication warning
    const mediWarning = mediFor(s);

    // Budget filter: push to sec if priority > budget threshold
    const effPriority = s.priority||3;
    const withinBudget = effPriority <= budgetPriorityMax;

    if((s.priority===1||(boost&&s.priority<=2))&&withinBudget) primSupps.push({...s,personalWhy,mediWarning});
    else secSupps.push({...s,personalWhy,mediWarning,outOfBudget:!withinBudget});
  });
  return {primSupps,secSupps};
}

// ─── SUPPLEMENT INTERAKTIONEN ────────────────────────────────────────────────

// Wissenschaftlich belegte Interaktionen zwischen Wirkstoffen (Schlüssel aus SUPP_KEYS, gilt für alle Varianten)
// type: "conflict" = nicht gleichzeitig, "warning" = zeitlich trennen, "synergy" = zusammen einnehmen
// short = kurzer Hinweis für die kompakte Karte
const INTERACTIONS = {
  eisen:    [{with:["zink"],type:"conflict",short:"2h Abstand zu Zink",msg:"Eisen und Zink nicht gleichzeitig - sie konkurrieren um denselben Aufnahmeweg im Darm. Mind. 2h Abstand."},
             {with:["magnesium"],type:"conflict",short:"2h Abstand zu Magnesium",msg:"Eisen und Magnesium nicht gleichzeitig einnehmen. Mind. 2h Abstand."},
             {with:["koffein"],type:"warning",short:"1h Abstand zu Koffein",msg:"Kaffee und Koffein hemmen die Eisenaufnahme. Mind. 1h Abstand."}],
  zink:     [{with:["eisen"],type:"conflict",short:"2h Abstand zu Eisen",msg:"Nicht gleichzeitig mit Eisen einnehmen - konkurrieren um Aufnahme. Mind. 2h Abstand."},
             {with:["magnesium"],type:"warning",short:"Getrennt von Magnesium",msg:"Zink tagsüber, Magnesium abends - bei normalen Dosen (15mg Zink) kein Problem, aber zeitliche Trennung empfohlen."}],
  magnesium:[{with:["eisen"],type:"conflict",short:"2h Abstand zu Eisen",msg:"Magnesium und Eisen nicht gleichzeitig einnehmen. Mind. 2h Abstand."},
             {with:["zink"],type:"warning",short:"Getrennt von Zink",msg:"Magnesium abends, Zink tagsüber - bei normalen Dosen unproblematisch, zeitliche Trennung für optimale Absorption."}],
  koffein:  [{with:["eisen"],type:"warning",short:"1h Abstand zu Eisen",msg:"Koffein hemmt die Eisenaufnahme. Mind. 1h Abstand zum Eisen."},
             {with:["kreatin"],type:"warning",short:"Getrennt von Kreatin",msg:"Koffein kann die Wirksamkeit von Kreatin leicht verringern. Zeitliche Trennung sinnvoll."}],
  kreatin:  [{with:["koffein"],type:"warning",short:"Getrennt von Koffein",msg:"Koffein + Kreatin: leicht verminderter Effekt. Wenn möglich getrennt einnehmen."}],
  // SYNERGIEN - zusammen einnehmen
  vitd:     [{with:["omega3"],type:"synergy",short:"Zusammen mit Omega-3",msg:"Vitamin D3 ist fettlöslich - zusammen mit Omega-3 oder einer fetthaltigen Mahlzeit einnehmen für optimale Absorption."}],
  omega3:   [{with:["vitd"],type:"synergy",short:"Zusammen mit Vitamin D3",msg:"Omega-3 zusammen mit Vitamin D3 und einer Mahlzeit einnehmen - verbessert die Aufnahme von Vitamin D3."}],
};

// Get all interactions for a supplement given current active supplements (ids oder Supplement-Objekte)
function getSupplementInteractions(supp, allActive) {
  const selfId = typeof supp==="string" ? supp : supp?.id;
  const ownKeys = suppKeysOf(supp);
  const otherKeys = new Set();
  (allActive||[]).forEach(a=>{
    const aid = typeof a==="string" ? a : a?.id;
    if(!aid||aid===selfId) return;
    suppKeysOf(a).forEach(k=>otherKeys.add(k));
  });
  const results = [], seenMsg = new Set();
  ownKeys.forEach(k=>{
    (INTERACTIONS[k]||[]).forEach(({with: targets, type, msg, short})=>{
      if((targets||[]).some(t=>otherKeys.has(t))&&!seenMsg.has(msg)) {
        seenMsg.add(msg);
        results.push({type, msg, short});
      }
    });
  });
  return results;
}

// ─── ALLERGIEN ───────────────────────────────────────────────────────────────
// Ältere gespeicherte Angaben nutzten englische ids - werden auf ALLERGEN_GROUPS-ids umgeschlüsselt
const ALLERGEN_ALIAS = {lactose:"laktose",soy:"soja",nuts:"nüsse",egg:"eier",fish:"fisch",crustacean:"fisch",fructose:"fruktose",histamine:"histamin",mustard:"senf"};
// Ernährungsweise (allergenData.diet) → ALLERGEN_GROUPS-id
const DIET_TO_GROUP = {vegan:"vegan",vegetarian:"vegetarisch",vegetarisch:"vegetarisch",pescatarian:"pescetarisch",pescetarisch:"pescetarisch",glutenfree:"gluten",glutenfrei:"gluten",lactosefree:"laktose",laktosefrei:"laktose",keto:"keto",lowcarb:"keto",halal:"halal",koscher:"koscher"};
// Kurztexte für die kompakte Karte
const ALLERGEN_SHORT = {gluten:"Gluten",laktose:"Laktose",soja:"Soja","nüsse":"Nüsse",eier:"Ei",fisch:"Fisch",sesam:"Sesam",senf:"Senf",koffein:"Koffein",beta_ala:"Beta-Alanin",fruktose:"Fruktose",histamin:"Histamin"};
const ALLERGEN_CONDITION = {blutverd:"Vorsicht bei Blutverdünnern",schilddr:"Vorsicht bei Schilddrüsenerkrankung",nierenprob:"Vorsicht bei Nierenerkrankung"};
const ALLERGEN_DIET_HINT = {vegan:"Nicht vegan",vegetarisch:"Evtl. nicht vegetarisch",pescetarisch:"Evtl. nicht pescetarisch",keto:"Enthält Kohlenhydrate",halal:"Evtl. nicht halal",koscher:"Evtl. nicht koscher"};
// Feste Zuordnung Supplement → Gruppen (zusätzlich zur Suche im Namen)
const SUPP_ALLERGEN_MAP = {
  "whey_cy":["laktose"],"whey_fit":["laktose"],"whey_g":["laktose"],"whey_fb":["laktose"],"whey_run":["laktose"],
  "omega3":["fisch"],"omega_h":["fisch"],
  "koff_fit":["koffein"],"koff_run":["koffein"],"koff_fb":["koffein"],"koff_g":["koffein"],
  "mau_caf":["koffein"],"sn_mau_caf":["koffein"],
  "beta_cy":["beta_ala"],"beta_fit":["beta_ala"],"beta_fb":["beta_ala"],"beta_g":["beta_ala"],"beta_run":["beta_ala"],
  "ash_cy":["schilddr"],"ash_g":["schilddr"],
  "koll_run":["fisch","eier"],"koll_fit":["fisch"],
};
// Regeln nach Wirkstoff, damit auch alle anderen Varianten (whey_ski, koll_ten, koff_mtb, bs_omega3 ...) erfasst sind
const SUPP_ALLERGEN_RULES = [
  {test:(s,k)=>/whey/.test(s.id), groups:["laktose","vegan"]},
  {test:(s,k)=>k.includes("omega3")&&!/vegan/.test(s.id), groups:["fisch","vegan","vegetarisch"]},
  {test:(s,k)=>k.includes("omega3"), groups:["blutverd"]},
  {test:(s,k)=>k.includes("collagen"), groups:["fisch","vegan","vegetarisch","pescetarisch","halal","koscher"]},
  {test:(s,k)=>k.includes("koffein"), groups:["koffein"]},
  {test:(s,k)=>k.includes("beta_ala"), groups:["beta_ala"]},
  {test:(s,k)=>k.includes("ashwa"), groups:["schilddr"]},
  {test:(s,k)=>k.includes("kreatin")||k.includes("protein"), groups:["nierenprob"]},
  {test:(s,k)=>/^(mau_|mn_|carb_|sn_mau|sn_mn|sn_gel)/.test(s.id), groups:["keto"]},
];

// Prüft ein Supplement nur gegen die Allergien, Ernährungsweise und eigenen Einträge, die der User gewählt hat
function checkAllergens(suppId, suppName, allergenData) {
  const id = String(suppId||"").toLowerCase();
  const name = String(suppName||"").toLowerCase();
  const selected = new Set();
  (Array.isArray(allergenData?.allergens)?allergenData.allergens:[]).forEach(a=>{ if(a) selected.add(ALLERGEN_ALIAS[a]||a); });
  const dietArr = Array.isArray(allergenData?.diet) ? allergenData.diet : (allergenData?.diet ? [allergenData.diet] : []);
  dietArr.forEach(d=>{ const g=DIET_TO_GROUP[d]; if(g) selected.add(g); });
  // Eigene Einträge (Array oder kommagetrennter Text)
  const customRaw = allergenData?.customAllergens;
  const customList = (Array.isArray(customRaw) ? customRaw : String(customRaw||"").split(","))
    .map(x=>String(x||"").trim()).filter(x=>x.length>=3);
  const customMapped = new Set();
  customList.forEach(c=>{
    const cl = c.toLowerCase();
    ALLERGEN_GROUPS.filter(g=>ALLERGEN_SHORT[g.id]).forEach(g=>{
      const hit = g.label.toLowerCase().includes(cl) || (g.ingredients||[]).some(ing=>{const il=ing.toLowerCase(); return il.includes(cl)||(il.length>=4&&cl.includes(il));});
      if(hit) { selected.add(g.id); customMapped.add(cl); }
    });
  });
  if(!selected.size && !customList.length) return [];

  const keys = suppKeysOf({id, name:suppName});
  const fixed = SUPP_ALLERGEN_MAP[id] || [];
  const ruleGroups = new Set();
  SUPP_ALLERGEN_RULES.forEach(r=>{ if(r.test({id,name:suppName},keys)) r.groups.forEach(g=>ruleGroups.add(g)); });

  const warnings = [], seen = new Set();
  selected.forEach(aid=>{
    const group = ALLERGEN_GROUPS.find(g=>g.id===aid);
    if(!group||seen.has(aid)) return;
    // Check if any ingredient matches supplement name or id
    const match = (group.ingredients||[]).some(ing=>{
      const il = ing.toLowerCase(), slug = il.replace(/[^a-z]/g,'');
      return name.includes(il) || (slug.length>=4 && id.includes(slug));
    });
    if(!(match || fixed.includes(aid) || ruleGroups.has(aid))) return;
    seen.add(aid);
    const isDiet = group.category==="diet";
    const short = ALLERGEN_CONDITION[aid] || (isDiet ? (ALLERGEN_DIET_HINT[aid]||`Evtl. nicht ${group.label}`) : `Enthält evtl. ${ALLERGEN_SHORT[aid]||group.label}`);
    const msg = ALLERGEN_CONDITION[aid]
      ? `${short} - kläre die Einnahme vorher mit deinem Arzt.`
      : isDiet
      ? `${short} - prüfe die Inhaltsstoffe beim Hersteller.`
      : `Enthält möglicherweise ${group.label} - prüfe die Inhaltsstoffe beim Hersteller.`;
    warnings.push({type:"allergen", id:aid, allergen:group.label, short, msg});
  });
  // Eigene Einträge, die zu keiner Gruppe passen: direkt im Namen suchen
  customList.forEach(c=>{
    const cl = c.toLowerCase();
    if(customMapped.has(cl)||seen.has("custom_"+cl)) return; // schon über eine Gruppe geprüft
    const cslug = cl.replace(/[^a-z]/g,'');
    if(name.includes(cl)||(cslug.length>=4&&id.includes(cslug))) {
      seen.add("custom_"+cl);
      warnings.push({type:"allergen", id:"custom_"+cl, allergen:c, short:`Enthält evtl. ${c}`, msg:`Enthält möglicherweise ${c} - prüfe die Inhaltsstoffe beim Hersteller.`});
    }
  });
  return warnings;
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

// Unscharfer Platzhalter für PRO-Inhalte (Dosierung, Timing, Begründung) - keine echten Werte im Code der Seite
function ProLock({w=70,lines=1}) {
  return (
    <span title="Nur mit PRO" style={{display:"inline-flex",flexDirection:"column",gap:4,verticalAlign:"middle",maxWidth:"100%"}}>
      {Array.from({length:lines}).map((_,i)=>(
        <span key={i} style={{display:"inline-block",width:i===lines-1&&lines>1?Math.round(w*0.6):w,maxWidth:"100%",height:9,borderRadius:3,background:"#E6E6E3",filter:"blur(1.5px)",userSelect:"none"}}/>
      ))}
    </span>
  );
}

function ProductCard({s,index,isPrimary,interactions=[],allergenWarnings=[],compact=false,locked=false,country}) {
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
  const hasAllergen=(allergenWarnings||[]).length>0;
  const hasMediWarn=!!s.mediWarning;
  const bluttest=!!s.bluttest; // Eisen: nie ZWINGEND, nur nach Bluttest
  const cardCountry=country||window.__TREYN_PROFIL__?.country||"Schweiz";
    const ownedLabel="✓ Gemerkt";
  const sc={bg:C.neonDim,text:C.black};
  const p=s.protocol;
  const hasCycle=p?.pause&&!p.pause.toLowerCase().includes("keine");
  const hasConflict=interactions.some(i=>i.type==="conflict");
  const hasSynergy=interactions.some(i=>i.type==="synergy");
  if(compact) {
    const shopInfo=localizeShop(s,cardCountry);
    return (
    <div style={{border:`1px solid ${hasMediWarn?"rgba(255,149,0,.5)":isPrimary&&!bluttest?C.g400:C.g200}`,borderRadius:12,padding:"12px 14px",background:C.white,animation:`fadeUp .35s ${index*0.05}s ease forwards`,opacity:0,display:"flex",flexDirection:"column",gap:6,minWidth:0}}>
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        {s.alreadyTaking
          ? <span style={{fontSize:9,padding:"2px 7px",borderRadius:100,background:"rgba(52,199,89,.12)",color:"#1A7A35",fontFamily:"Inter,sans-serif",fontWeight:600}}>✓ Nimmst du schon</span>
          : bluttest
          ? <span className="chip" style={{fontSize:9,background:"rgba(255,149,0,.12)",color:"#8A5700",fontWeight:600}}>Nur nach Bluttest</span>
          : isPrimary
          ? <span className="chip hi" style={{fontSize:9}}>Zwingend</span>
          : <span className="chip" style={{fontSize:9}}>Optional</span>}
      </div>
      <div style={{fontSize:13,fontWeight:700,color:C.black,letterSpacing:"-.02em",lineHeight:1.3,overflowWrap:"anywhere"}}>{s.name}</div>
      {/* Sicherheitshinweise: auch in Basic lesbar */}
      {hasMediWarn&&(
        <div style={{fontSize:10,lineHeight:1.45,padding:"6px 8px",borderRadius:6,background:"rgba(255,149,0,.1)",border:"1px solid rgba(255,149,0,.3)",color:"#8A5700",fontWeight:500,overflowWrap:"anywhere"}}>{s.mediWarning}</div>
      )}
      {hasAllergen&&(
        <div title={(allergenWarnings||[]).map(w=>w.msg).join(" ")} style={{fontSize:10,lineHeight:1.45,padding:"5px 8px",borderRadius:6,background:"rgba(255,59,48,.08)",border:"1px solid rgba(255,59,48,.2)",color:"#C0392B",fontWeight:600,overflowWrap:"anywhere"}}>
          {(allergenWarnings||[]).map(w=>w.short||w.allergen).join(" · ")}
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        {locked?<ProLock w={64}/>:<div style={{fontSize:10,color:C.g500,fontFamily:"Inter,sans-serif",fontWeight:600,overflowWrap:"anywhere"}}>{s.dose}</div>}
        {!locked&&s.keyIngredient&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:C.neonDim,color:"#3A6000",fontFamily:"Inter,sans-serif",fontWeight:500}}>{s.keyIngredient}</span>}
        {locked&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:C.g100,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:600}}>PRO</span>}
      </div>
      <div style={{fontSize:11,color:C.g700,lineHeight:1.5,borderLeft:`3px solid ${isPrimary?C.neon:C.g200}`,paddingLeft:8,background:"#FAFAFA",borderRadius:"0 6px 6px 0",padding:"6px 8px",overflowWrap:"anywhere"}}>{locked?<ProLock w={110} lines={2}/>:<>{s.why?.slice(0,80)}{s.why?.length>80?"…":""}</>}</div>
      {!locked&&(interactions||[]).length>0&&(
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          {(interactions||[]).map((ia,i)=>(
            <div key={i} title={ia.msg} style={{fontSize:10,lineHeight:1.4,fontWeight:600,overflowWrap:"anywhere",color:ia.type==="conflict"?"#C0392B":ia.type==="synergy"?"#1A7A35":"#8A5700"}}>
              {ia.type==="synergy"?"✓ ":""}{ia.short||ia.msg}
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:6,marginTop:2,flexWrap:"wrap"}}>
        <a href={shopInfo.link} target="_blank" rel="noopener noreferrer"
          style={{flex:"999 1 60px",textAlign:"center",padding:"7px 6px",borderRadius:8,background:C.neon,color:C.black,fontSize:11,fontWeight:700,textDecoration:"none"}}>
          Kaufen ↗
        </a>
        <button onClick={toggleOwned} style={{flex:"1 0 auto",padding:"7px 10px",borderRadius:8,border:`1px solid ${owned?"rgba(52,199,89,.4)":C.g200}`,background:owned?"rgba(52,199,89,.08)":"transparent",fontSize:10,cursor:"pointer",fontFamily:"Inter,sans-serif",color:owned?"#1A7A35":C.g500}}>
          {owned?ownedLabel:"+ Merken"}
        </button>
      </div>
    </div>
    );
  }
  return (
    <div style={{border:`1px solid ${hasMediWarn?"rgba(255,149,0,.5)":hasAllergen?"rgba(255,59,48,.35)":s.alreadyTaking?"rgba(52,199,89,.35)":isPrimary?C.g400:C.g200}`,borderRadius:14,padding:"16px 18px",marginBottom:9,background:hasMediWarn?"rgba(255,149,0,.03)":hasAllergen?"rgba(255,59,48,.02)":s.alreadyTaking?"rgba(52,199,89,.03)":C.white,animation:`fadeUp .35s ${index*0.05}s ease forwards`,opacity:0}}>

      {/* Medication warning banner */}
      {hasMediWarn&&(
        <div style={{marginBottom:10,padding:"8px 12px",background:"rgba(255,149,0,.1)",borderRadius:8,border:"1px solid rgba(255,149,0,.3)"}}>
          <div style={{fontSize:11,color:"#8A5700",lineHeight:1.5,fontWeight:500}}>{s.mediWarning}</div>
        </div>
      )}

      {/* Already taking badge */}
      {s.alreadyTaking&&(
        <div style={{marginBottom:8,display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",background:"rgba(52,199,89,.12)",borderRadius:6,border:"1px solid rgba(52,199,89,.3)"}}>
          <span style={{fontSize:10,color:"#1A7A35",fontWeight:600,fontFamily:"Inter,sans-serif"}}>✓ Bereits in deinem Stack</span>
        </div>
      )}

      {/* Header: Name + Toggle Switch */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:10}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
            {bluttest&&!s.alreadyTaking&&<span className="chip" style={{fontSize:9,background:"rgba(255,149,0,.12)",color:"#8A5700",fontWeight:600}}>Nur nach Bluttest</span>}
            {isPrimary&&!bluttest&&!s.alreadyTaking&&<span className="chip hi" style={{fontSize:9}}>Zwingend</span>}
            {!isPrimary&&!bluttest&&!s.alreadyTaking&&<span className="chip" style={{fontSize:9}}>Optional</span>}
            {hasCycle&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,149,0,.12)",color:C.orange,fontFamily:"Inter,sans-serif",fontWeight:600}}>Kur</span>}
            {hasConflict&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,59,48,.1)",color:C.red,fontFamily:"Inter,sans-serif",fontWeight:600}}>Interaktion</span>}
            {hasSynergy&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(52,199,89,.1)",color:C.green,fontFamily:"Inter,sans-serif",fontWeight:600}}>✓ Synergie</span>}
            {hasAllergen&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,59,48,.12)",color:C.red,fontFamily:"Inter,sans-serif",fontWeight:600}}>Allergen</span>}
          </div>
          <div style={{fontSize:15,fontWeight:700,letterSpacing:"-.02em",marginBottom:2}}>{active.name||s.name}</div>
          <div style={{fontSize:11,color:C.g600,fontFamily:"Inter,sans-serif"}}>{active.dose||s.dose} · {s.when}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
          {s.barcode&&(
            <div style={{width:44,height:44,borderRadius:8,border:"1px solid #EBEBEB",background:"#FAFAFA",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {imgUrl&&!imgErr?(
                <img src={imgUrl} alt={s.name} onError={()=>setImgErr(true)} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
              ):(
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="1.5" strokeLinecap="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Why - prominent */}
      <div style={{fontSize:13,color:C.g800,lineHeight:1.65,marginBottom:10,padding:"10px 12px",background:"#FAFAFA",borderRadius:9,borderLeft:`3px solid ${isPrimary?C.neon:C.g300}`}}>
        {showBudget&&s.budget?s.budget.why:(s.personalWhy||s.why)}
      </div>

      {/* Budget/Quality Toggle Switch - nur wenn Budget vorhanden */}
      {s.budget&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:9,background:"#F8F8F8",marginBottom:10}}>
          <span style={{fontSize:11,fontWeight:showBudget?400:700,color:showBudget?C.g400:C.black}}>Höchste Qualität</span>
          <div onClick={e=>{e.stopPropagation();setShowBudget(b=>!b);}}
            style={{width:36,height:20,borderRadius:10,background:showBudget?"#4A7000":"#CCC",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
            <div style={{position:"absolute",top:2,left:showBudget?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
          </div>
          <span style={{fontSize:11,fontWeight:showBudget?700:400,color:showBudget?C.black:C.g400}}>Budget</span>
        </div>
      )}
      {showBudget&&s.budget?.price&&<div style={{fontSize:11,color:"#4A7000",fontWeight:600,marginBottom:8}}>Preis: {s.budget.price}</div>}

      {/* Shop buttons - country-aware */}
      {(()=>{
        const country=cardCountry;
        const isCH=["Schweiz"].includes(country);
        const isDAch=["Schweiz","Deutschland","Österreich"].includes(country);
        const shopId=active.shop||s.shop;
        const shopLink=active.link||s.link;
        const chOnly=["Bodylab24","Sponser","Zur Rose","nu3.ch"];
        const dachOnly=["ESN","More Nutrition","nu3"];
        const needsSwap=(chOnly.includes(shopId)&&!isCH)||(dachOnly.includes(shopId)&&!isDAch);
        const finalLink=needsSwap?AFF.iherb(s.name):shopLink;
        const finalShop=needsSwap?"iHerb":shopId;
        const finalSc=needsSwap?{bg:"#2D7C2B",text:"#fff"}:sc;
        return (
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <a href={finalLink} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:4,background:finalSc.bg,color:finalSc.text,padding:"7px 12px",borderRadius:8,fontSize:11,fontWeight:600,textDecoration:"none"}}>
              {finalShop} ↗
            </a>

            {!isCH&&!["iHerb","Maurten","MNSTRY","Myprotein"].includes(finalShop)&&(
              <a href={AFF.iherb(s.name)} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:4,background:"#F5F5F5",color:"#555",padding:"5px 8px",borderRadius:7,fontSize:9,fontWeight:500,textDecoration:"none"}}>
                iHerb ↗
              </a>
            )}
            {s.productUrl&&<a href={s.productUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:9,color:C.g400,fontFamily:"Inter,sans-serif",textDecoration:"underline",textDecorationStyle:"dotted"}}>Nährwerte ↗</a>}
          </div>
        );
      })()}

      {s.tags&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{(s.tags||[]).map(t=><span key={t} className="chip">{t}</span>)}</div>}

      {/* Allergen warnings */}
      {(allergenWarnings||[]).map((w,i)=>(
        <div key={i} style={{display:"flex",gap:8,padding:"8px 11px",borderRadius:8,background:"rgba(255,59,48,.06)",border:"1px solid rgba(255,59,48,.2)",marginBottom:6}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.red,marginBottom:1}}>{w.allergen} - mögliche Unverträglichkeit</div>
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
              <div style={{display:"grid",gridTemplateColumns:"auto minmax(0,1fr)",gap:"6px 12px"}}>
                {[
                  ["Einnahmedauer",p.dauer],
                  ["Pause",p.pause],
                  ["Timing",p.timing],
                ].map(([l,v])=>(
                  <React.Fragment key={l}>
                    <span style={{fontSize:10,fontWeight:500,color:C.g400,fontFamily:"Inter,sans-serif",whiteSpace:"nowrap",paddingTop:1}}>{l}</span>
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

      {/* Owned toggle - ganz unten, full-width */}
      <button onClick={toggleOwned}
        style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%",marginTop:12,padding:"8px",borderRadius:9,border:`1.5px solid ${owned?C.neon:C.g200}`,background:owned?C.neon:"transparent",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .15s"}}>
        {owned?(
          <svg width="13" height="13" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.2 2.2L7 1.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ):(
          <div style={{width:13,height:13,borderRadius:"50%",border:`1.5px solid ${C.g300||C.g400}`,flexShrink:0}}/>
        )}
        <span style={{fontSize:11,fontWeight:700,color:owned?"#000":C.g500}}>{owned?ownedLabel:"+ Merken"}</span>
      </button>
      {owned&&!locked&&<div style={{marginTop:6,fontSize:10,color:"#4A7000",textAlign:"center",lineHeight:1.5}}>Findest du im Reiter <strong>Einkauf</strong>.</div>}
    </div>
  );
}

function SectionHeader({label,count,color}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,marginTop:4}}>
      <div style={{width:3,height:20,background:color||C.neon,borderRadius:2,flexShrink:0}}/>
      <span style={{fontSize:13,fontWeight:600,color:C.black}}>{label}</span>
      <span style={{fontSize:11,color:C.g400,fontFamily:"Inter,sans-serif"}}>{count}</span>
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
  // Automatisch ans Ende des Chatfensters scrollen (nur das Fenster, nicht die Seite)
  const listRef=React.useRef(null);
  useEffect(()=>{
    const el=listRef.current;
    if(el) el.scrollTop=el.scrollHeight;
  },[messages,loading]);
  // KI-Antwort bereinigen: Schweizer ss, kein Markdown, keine langen Striche
  const cleanAi=(t)=>{
    if(typeof t!=="string"||!t.trim()) return "";
    return noDash(t)
      .replace(/ß/g,"ss")
      .replace(/\*\*|__/g,"")
      .replace(/^#{1,6}\s*/gm,"")
      .replace(/^\s*[*•]\s+/gm,"- ")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{2712}\u{2714}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]+[ \t]?/gu,"")
      .trim();
  };

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
      const sys=`Du bist TREYN AI, Supplement- und Sportnahrungsberater. Deutsch, präzise, keine Emojis, max 150 Wörter. Schweizer Rechtschreibung (ss statt ß). Kein Markdown, keine Sternchen, keine Überschriften. Für Aufzählungen neue Zeilen mit "- " verwenden.
Profil: Sport: ${context.sportLabel} · Intensität: ${context.intensity} · ${context.days}×/Woche Ø ${context.duration}min · ${context.weight}kg · ${context.gender==="f"?"Weiblich":"Männlich"} · Wettkämpfe: ${context.hasComp?`${context.compCount}/Jahr`:"Nein"}${pd?`
Pro-Berechnungen: kcal Ruhetag ${pd.restDay} / Trainingstag ${pd.trainingDay??pd.withTraining} · Protein ${pd.proteinMin}-${pd.proteinMax}g/Tag · Carbs ${pd.carbsG}g am Trainingstag · Natrium-Verlust ${pd.natriumMg}mg pro Einheit · Magnesium ${pd.magnesiumMg}mg/Tag`:""}`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:sys,
          messages:[...messages.map(m=>({role:m.role,content:m.content})),{role:"user",content:userMsg}]})});
      const data=await res.json().catch(()=>null);
      const answer=res.ok?cleanAi(data?.content?.[0]?.text):"";
      setMessages(m=>[...m,{role:"assistant",content:answer||"Die Antwort konnte gerade nicht erstellt werden. Bitte versuche es später erneut."}]);
    }catch(e){setMessages(m=>[...m,{role:"assistant",content:"Verbindung fehlgeschlagen. Bitte prüfe deine Internetverbindung und versuche es erneut."}]);}
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
          <span style={{fontSize:11,fontFamily:"Inter,sans-serif",fontWeight:500,color:isLimited?C.orange:C.g400}}>
            {isLimited?"Limit erreicht":remaining===1?"Noch 1 Frage heute":`Noch ${remaining} Fragen heute`}
          </span>
        )}
      </div>

      {isLimited&&(
        <div style={{padding:"16px 18px",background:"rgba(255,149,0,.06)",borderBottom:`1px solid rgba(255,149,0,.15)`}}>
          <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:4}}>Tageslimit erreicht</div>
          <div style={{fontSize:11,color:C.g600,lineHeight:1.55}}>Du hast heute 3 Fragen gestellt. Morgen stehen dir wieder 3 Fragen zur Verfügung - oder upgrade auf PRO für unlimitierten AI Chat.</div>
        </div>
      )}

      {!isLimited&&messages.length===0&&<div style={{padding:"14px 16px",background:C.g100}}>
        <div style={{fontSize:12,color:C.g600,marginBottom:10}}>Schnellfragen:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {SUGG.map(q=><button key={q} onClick={()=>setInput(q)} style={{fontSize:11,padding:"5px 11px",borderRadius:100,border:`1px solid ${C.g200}`,background:C.white,cursor:"pointer",color:C.g800,fontFamily:"Inter,sans-serif"}}>{q}</button>)}
        </div>
      </div>}

      {messages.length>0&&<div ref={listRef} style={{maxHeight:320,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",background:m.role==="user"?C.black:C.g100,color:m.role==="user"?C.white:C.black,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>
              {m.role==="assistant"&&<div style={{marginBottom:5,color:"#4A7000",fontSize:10,fontWeight:500,fontFamily:"Inter,sans-serif"}}>TREYN AI</div>}
              {m.content}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{padding:"10px 14px",borderRadius:"12px 12px 12px 4px",background:C.g100,fontSize:13,color:C.g400}}><div style={{fontSize:10,fontWeight:500,color:"#4A7000",marginBottom:4,fontFamily:"Inter,sans-serif"}}>TREYN AI</div>Analysiere...</div></div>}
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

// Gedächtnis für den Profil-Reiter: ProfilTab wird in Results bei jedem Neu-Rendern
// (z.B. Handy drehen, nach dem Speichern) neu aufgebaut. Offen/Bearbeiten/Entwurf bleiben so erhalten.
const PROFIL_UI={open:false,edit:false,form:null,base:null,savedAt:0,loyalty:false};

// ─── BLUTTEST UPLOAD ─────────────────────────────────────────────────────────

function BluttestUpload({isPro}) {
  const [stage,setStage]=useState("idle"); // idle | loading | done | error
  const [errType,setErrType]=useState("read"); // read | type | size | network | service
  const [labValues,setLabValues]=useState(null);
  const [dragOver,setDragOver]=useState(false);
  const fileRef=React.useRef();

  const MARKER_ICONS={
    "Vitamin D":"D","Eisen":"Fe","Ferritin":"Ft","Magnesium":"Mg",
    "Omega-3":"Ω3","Vitamin B12":"B12","Zink":"Zn","Testosteron":"T",
    "Cortisol":"Crt","Hämoglobin":"Hb","TSH":"TSH","CRP":"CRP",
  };

  const fail=(type)=>{setErrType(type);setStage("error");};
  const analyseFile=async(file)=>{
    if(!file) return;
    if(!/\.pdf$/i.test(file.name||"")&&file.type!=="application/pdf"){ fail("type"); return; }
    if(file.size>20*1024*1024){ fail("size"); return; }
    setStage("loading");
    let res;
    try{
      const base64=await new Promise((ok,rej)=>{
        const r=new FileReader();
        r.onload=()=>ok(String(r.result||"").split(",")[1]||"");
        r.onerror=rej;
        r.readAsDataURL(file);
      });

      res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`Du extrahierst Laborwerte aus Bluttest-PDF-Berichten (z.B. cerascreen, yourself.health, Synlab). 
Antworte NUR mit einem gültigen JSON-Objekt, kein Markdown, keine Erklärungen.
Format: {"marker_name": {"value": Zahl, "unit": "Einheit", "status": "optimal|niedrig|erhöht|mangel"}}
Beispiel: {"Vitamin D": {"value": 42, "unit": "ng/ml", "status": "optimal"}}
Erkenne alle vorhandenen Marker - Vitamin D, Eisen, Ferritin, Magnesium, Omega-3, Vitamin B12, Zink, Testosteron, Cortisol, TSH, CRP, Hämoglobin, etc.
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

    }catch(e){
      // fetch selbst ist fehlgeschlagen: keine Verbindung (oder Datei nicht lesbar)
      fail(res===undefined&&e instanceof TypeError?"network":"read");
      return;
    }
    if(!res.ok){ fail("service"); return; }
    try{
      const data=await res.json();
      const text=data?.content?.[0]?.text||"{}";
      const clean=text.replace(/```json|```/g,"").trim();
      const jsonPart=(clean.match(/\{[\s\S]*\}/)||["{}"])[0];
      const parsed=JSON.parse(jsonPart);
      const valid=Object.fromEntries(Object.entries(parsed||{}).filter(([,v])=>v&&typeof v==="object"&&v.value!==undefined&&v.value!==null&&v.value!==""));
      if(Object.keys(valid).length===0){ fail("read"); return; }
      setLabValues(valid);
      setStage("done");
    }catch(e){
      fail("read");
    }
  };
  const ERR_TEXT={
    read:{t:"Auslesen fehlgeschlagen",d:"In diesem PDF wurden keine Laborwerte erkannt. Bitte lade einen Laborbericht als PDF hoch (cerascreen, yourself.health, Synlab o.ä.)."},
    type:{t:"Kein PDF",d:"Bitte wähle eine PDF-Datei aus. Fotos oder andere Formate werden nicht unterstützt."},
    size:{t:"Datei zu gross",d:"Das PDF ist grösser als 20 MB. Bitte lade eine kleinere Datei hoch."},
    network:{t:"Verbindung fehlgeschlagen",d:"Die Auswertung konnte nicht erreicht werden. Bitte prüfe deine Internetverbindung und versuche es später erneut. An deiner Datei liegt es nicht."},
    service:{t:"Auswertung gerade nicht verfügbar",d:"Der Auswertungsdienst antwortet im Moment nicht. Bitte versuche es später erneut. An deiner Datei liegt es nicht."},
  };
  const err=ERR_TEXT[errType]||ERR_TEXT.read;

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
        <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:C.neonDim,color:"#4A7000",fontFamily:"Inter,sans-serif",fontWeight:600,border:`1px solid ${C.neon}`}}>Empfohlen</span>
      </div>

      <div style={{padding:"16px 18px",background:C.white}}>

        {/* Intro */}
        <p style={{fontSize:13,color:C.g800,lineHeight:1.65,marginBottom:8}}>
          TREYN AI liest deinen Laborbericht (PDF) aus und zeigt dir deine Werte übersichtlich an. Dass die Werte automatisch in deine Supplement-Empfehlungen einfliessen, ist bald verfügbar.
        </p>
        <p style={{fontSize:11,color:C.g600,lineHeight:1.6,marginBottom:14}}>
          Hinweis: Zur Auswertung wird das PDF an Anthropic (USA) übermittelt. Es enthält Gesundheitsdaten. Lade es nur hoch, wenn du damit einverstanden bist.
        </p>

        {/* cerascreen CTA */}
        <div style={{background:C.g100,borderRadius:11,padding:"12px 14px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:11,fontWeight:600,color:C.black,marginBottom:3}}>cerascreen® - Empfohlener Testpartner</div>
            <div style={{fontSize:11,color:C.g600}}>19 europäische Länder · CH, DE, AT · Ergebnis in 2-3 Werktagen als PDF</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
              {["Vitamin D","Eisen","Magnesium","Omega-3","B12","Zink","Testosteron"].map(t=>(
                <span key={t} style={{display:"inline-flex",alignItems:"center",background:C.white,color:C.g600,fontSize:10,fontWeight:500,padding:"3px 8px",borderRadius:100,fontFamily:"Inter,sans-serif"}}>{t}</span>
              ))}
            </div>
          </div>
          <a href={(window.__TREYN_PROFIL__?.country||"Schweiz")==="Schweiz"?"https://www.cerascreen.ch/products/kombi-paket-sportliche-leistungsfaehigkeit":"https://www.cerascreen.de/collections/sport"} target="_blank" rel="noopener noreferrer"
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
            <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:4}}>{err.t}</div>
            <div style={{fontSize:12,color:C.g600,marginBottom:12,lineHeight:1.55}}>{err.d}</div>
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
                  {Object.keys(labValues).length} Laborwerte erkannt
                </span>
              </div>
              <button onClick={()=>{setStage("idle");setLabValues(null);}} className="btn-ghost" style={{fontSize:11,padding:"5px 10px"}}>Neu hochladen</button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7,marginBottom:14}}>
              {Object.entries(labValues).map(([name,v])=>(
                <div key={name} style={{padding:"11px 13px",borderRadius:11,background:C.g100,border:`1px solid ${C.g200}`,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,flexWrap:"wrap",marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:600,color:C.black,overflowWrap:"anywhere"}}>{noDash(String(name)).replace(/ß/g,"ss")}</span>
                    <span style={{fontSize:10,padding:"2px 7px",borderRadius:6,background:statusCol(v.status)+"22",color:statusCol(v.status),fontFamily:"Inter,sans-serif",fontWeight:600}}>
                      {statusLabel(v.status)}
                    </span>
                  </div>
                  <div style={{fontSize:16,fontWeight:700,color:statusCol(v.status),letterSpacing:"-.02em"}}>
                    {typeof v.value==="object"?"-":String(v.value)} <span style={{fontSize:10,fontWeight:400,color:C.g400}}>{typeof v.unit==="string"?v.unit:""}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{padding:"11px 14px",background:C.neonDim,borderRadius:10,border:`1px solid ${C.neonBorder}`,fontSize:12,color:C.g800,lineHeight:1.6}}>
              ✓ Deine Werte wurden erkannt. Besprich auffällige Werte mit deiner Ärztin oder deinem Arzt. Dass deine Empfehlungen automatisch an deine Blutwerte angepasst werden, ist bald verfügbar.
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
  {id:"gluten",     label:"Gluten / Zöliakie",       ingredients:["Gluten","Weizen","Gerste","Roggen","Hafer"]},
  {id:"laktose",    label:"Laktose / Milch",          ingredients:["Molke","Whey","Casein","Laktose","Milchprotein","Milch"]},
  {id:"soja",       label:"Soja",                     ingredients:["Soja","Sojaprotein","Sojalecithin"]},
  {id:"nüsse",      label:"Nüsse / Erdnüsse",         ingredients:["Erdnuss","Mandel","Cashew","Walnuss","Haselnuss","Pekannuss","Pistazie"]},
  {id:"eier",       label:"Eier",                     ingredients:["Eier","Eiprotein","Albumin"]},
  {id:"fisch",      label:"Fisch / Meeresfrüchte",    ingredients:["Fisch","Krustentiere","Omega-3 (Fisch)","Krabben","Garnelen"]},
  {id:"sesam",      label:"Sesam",                    ingredients:["Sesam","Tahini","Sesamöl"]},
  {id:"senf",       label:"Senf",                     ingredients:["Senf","Senfmehl"]},
  {id:"koffein",    label:"Koffein-Sensitivität",     ingredients:["Koffein","Guarana","Teein","Matcha"]},
  {id:"beta_ala",   label:"Beta-Alanin (Kribbeln)",   ingredients:["Beta-Alanin"]},
  {id:"fruktose",   label:"Fruktose-Intoleranz",      ingredients:["Fruktose","Fruchtzucker","Agavensirup"]},
  {id:"histamin",   label:"Histamin-Intoleranz",      ingredients:["Histamin","Rotwein","fermentiert"]},
  {id:"blutverd",   label:"Blutverdünner (ASS/Marcumar)", ingredients:["Omega-3","Vitamin E","Ginkgo"]},
  {id:"schilddr",   label:"Schilddrüsenerkrankung",   ingredients:["Ashwagandha","Jod","Selen"]},
  {id:"nierenprob", label:"Nierenerkrankung",         ingredients:["Kreatin","Protein","Kalium","Phosphor"]},
  // Ernährungsweise
  {id:"alles",         label:"Esse alles",              ingredients:[], category:"diet"},
  {id:"vegan",         label:"Vegan",                  ingredients:["Whey","Casein","Kollagen","Fischöl","Omega-3 (Fisch)","Gelatine","Honig"], category:"diet"},
  {id:"vegetarisch",   label:"Vegetarisch",             ingredients:["Gelatine","Fischöl","Kollagen (Tier)","Fisch"], category:"diet"},
  {id:"pescetarisch",  label:"Pescetarisch",            ingredients:["Fleisch","Rinderkollagen","Whey vom Rind"], category:"diet"},
  {id:"keto",          label:"Keto / Low Carb",         ingredients:["Maltodextrin","Dextrose","Traubenzucker","Fruktose"], category:"diet"},
  {id:"halal",         label:"Halal",                   ingredients:["Schweinegelatine","Alkohol","Schweinefett"], category:"diet"},
  {id:"koscher",       label:"Koscher",                 ingredients:["Schweinegelatine","Milch+Fleisch kombiniert"], category:"diet"},
  {id:"glutenfrei",    label:"Glutenfrei (Präferenz)",  ingredients:["Gluten","Weizen","Gerste","Roggen","Hafer"], category:"diet"},
];

function StepWillkommen({onNext, priceStr="CHF 12.90"}) {
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  const items=[
    {title:"Basicdaten sofort sichtbar", desc:"4 Werte sofort: Energieverbrauch, Grundumsatz, Wasser & Trainingseinheiten/Jahr."},
    {title:`PRO - ${priceStr} / 6 Monate`, desc:"Alle Daten, alle Empfehlungen - inkl. Elektrolyte, VO₂max, Kohlenhydrate/h, Produkten, Dosierungen & Tagesplan.", pro:true},
    {title:"Auf dich berechnet", desc:"Berechnet aus MET-Compendium 2024 - wissenschaftlicher Standard. Präzise auf deine Daten, Gewicht, Sport, Lifestyle und Intensität."},
  ];

  return (
    <OnbShell done>
      <OnbTitle title="So funktioniert TREYN+" sub="Deine Analyse ist in Kürze bereit. Hier ist, was dich erwartet:"/>
      {items.map((item,i)=>(
        <div key={i} style={{...ONB_CARD,marginBottom:10,...(item.pro?{background:ONB_SEL,border:`1px solid ${C.neon}`}:{})}}>
          <div style={{fontSize:14,fontWeight:600,color:C.black,letterSpacing:"-.01em",lineHeight:1.35,marginBottom:4}}>{item.title}</div>
          <div style={{fontSize:13,color:C.g600,lineHeight:1.6}}>{item.desc}</div>
        </div>
      ))}
      <OnbNav onNext={()=>onNext&&onNext()} label="Kostenlose Analyse entdecken →" hint="Dauert wenige Sekunden."/>
    </OnbShell>
  );
}

function StepPraeferenzen({onNext, onBack, initial}) {
  const isMobile=useWindowWidth()<=768;
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  // Gespeicherte Auswahl übernehmen (z. B. nach "Zurück"); ältere Daten können Einzelwerte statt Listen enthalten
  const asList=(v)=>Array.isArray(v)?v:(v?[v]:[]);
  const [suppForm,setSuppForm]=useState(()=>initial?.suppForm||null);
  const [energieForm,setEnergieForm]=useState(()=>asList(initial?.energieForm));
  const [proteinForm,setProteinForm]=useState(()=>asList(initial?.proteinForm));
  const [recoveryForm,setRecoveryForm]=useState(()=>asList(initial?.recoveryForm));

  const toggleMulti=(arr,setArr,val)=>{
    if(val==="egal"||val==="keine"){ setArr(prev=>prev.includes(val)?[]:([val])); return; }
    setArr(prev=>{
      const without=prev.filter(x=>x!=="egal"&&x!=="keine");
      return without.includes(val)?without.filter(x=>x!==val):[...without,val];
    });
  };

  const allDone = !!(suppForm && energieForm.length>0 && proteinForm.length>0 && recoveryForm.length>0);
  const missing=[];
  if(!suppForm)missing.push("Supplements");
  if(!energieForm.length)missing.push("Energie");
  if(!proteinForm.length)missing.push("Protein");
  if(!recoveryForm.length)missing.push("Recovery");

  const grid=(cols)=>({display:"grid",gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,gap:7});

  return (
    <OnbShell step={6} total={6}>
      <OnbTitle title="Deine Präferenzen." sub="So stimmen wir alles noch gezielter auf dich ab."/>

      <OnbCard label="Supplements - welche Form bevorzugst du?">
        <div style={grid(3)}>
          {[{id:"kapsel",l:"Kapseln"},{id:"pulver",l:"Pulver"},{id:"beides",l:"Beides"}].map(o=>(
            <OnbTile key={o.id} label={o.l} active={suppForm===o.id} onClick={()=>setSuppForm(suppForm===o.id?null:o.id)}/>
          ))}
        </div>
      </OnbCard>

      <OnbCard label="Wie nimmst du Energie während dem Training zu dir?" sub="Mehrfachauswahl möglich">
        <div style={grid(isMobile?2:4)}>
          {[{id:"gel",l:"Gels"},{id:"riegel",l:"Riegel"},{id:"drink",l:"Drink Mix"},{id:"egal",l:"Egal"}].map(o=>(
            <OnbTile key={o.id} label={o.l} multi active={energieForm.includes(o.id)} onClick={()=>toggleMulti(energieForm,setEnergieForm,o.id)}/>
          ))}
        </div>
      </OnbCard>

      <OnbCard label="Protein - wie nimmst du es am liebsten?" sub="Mehrfachauswahl möglich">
        <div style={grid(3)}>
          {[{id:"shake",l:"Shake / Pulver"},{id:"riegel",l:"Riegel"},{id:"egal",l:"Egal"}].map(o=>(
            <OnbTile key={o.id} label={o.l} multi active={proteinForm.includes(o.id)} onClick={()=>toggleMulti(proteinForm,setProteinForm,o.id)}/>
          ))}
        </div>
      </OnbCard>

      <OnbCard label="Recovery - wie erholst du dich am liebsten?" sub="Mehrfachauswahl möglich">
        <div style={grid(isMobile?2:3)}>
          {[{id:"massage",l:"Massage"},{id:"foam",l:"Foam Roll"},{id:"kalt",l:"Kältebad"},{id:"stretching",l:"Stretching"},{id:"kompression",l:"Kompressionswear"},{id:"sauna",l:"Sauna"},{id:"dampfbad",l:"Dampfbad"},{id:"schlaf",l:"Schlaf"},{id:"keine",l:"Ich regeneriere zu wenig"}].map(o=>(
            <OnbTile key={o.id} label={o.l} multi active={recoveryForm.includes(o.id)} onClick={()=>toggleMulti(recoveryForm,setRecoveryForm,o.id)}/>
          ))}
        </div>
      </OnbCard>

      <OnbNav onBack={onBack} canNext={allDone}
        onNext={()=>{ if(allDone) onNext({suppForm,energieForm,proteinForm,recoveryForm}); }}
        hint={!allDone?`Noch ausfüllen: ${missing.join(" · ")}`:null}/>
    </OnbShell>
  );
}


function StepAllergien({onNext, onBack, initial}) {
  useEffect(()=>{ window.scrollTo(0,0); },[]);

  // Kacheln; "group" ist die id aus ALLERGEN_GROUPS und wird gespeichert
  const ALLERGEN_LIST = [
    {id:"gluten",     group:"gluten",   label:"Gluten",        desc:"Weizen, Roggen, Gerste"},
    {id:"laktose",    group:"laktose",  label:"Laktose",       desc:"Milch & Milchprodukte"},
    {id:"soja",       group:"soja",     label:"Soja",          desc:"Sojaprodukte"},
    {id:"nüsse",      group:"nüsse",    label:"Nüsse",         desc:"Alle Nussarten"},
    {id:"eier",       group:"eier",     label:"Eier",          desc:"Ei & Eiprodukte"},
    {id:"fisch",      group:"fisch",    label:"Fisch",         desc:"Fisch & Meeresfrüchte"},
    {id:"fruktose",   group:"fruktose", label:"Fruktose",      desc:"Fruchtzucker"},
    {id:"histamin",   group:"histamin", label:"Histamin",      desc:"Fermentierte Lebensmittel"},
    {id:"krebstiere", group:"fisch",    label:"Krebstiere",    desc:"Garnelen, Hummer, Krabben"},
    {id:"senf",       group:"senf",     label:"Senf",          desc:"Senf & Senfprodukte"},
  ];
  // Ältere gespeicherte ids (englisch) auf die heutigen Kacheln abbilden
  const LEGACY_IDS={lactose:"laktose",soy:"soja",nuts:"nüsse",egg:"eier",fish:"fisch",fructose:"fruktose",histamine:"histamin",crustacean:"krebstiere",mustard:"senf"};
  const chipIds=ALLERGEN_LIST.map(a=>a.id);
  const toTextList=(v)=>Array.isArray(v)?v.map(x=>String(x).trim()).filter(Boolean):(typeof v==="string"?v.split(",").map(x=>x.trim()).filter(Boolean):[]);

  const initChips=(()=>{
    const src=Array.isArray(initial?.allergenChips)?initial.allergenChips:(Array.isArray(initial?.allergens)?initial.allergens:[]);
    return [...new Set(src.map(id=>LEGACY_IDS[id]||id).filter(id=>chipIds.includes(id)))];
  })();
  const initCustom=toTextList(initial?.customAllergens);

  const [hasAllergies, setHasAllergies] = useState(()=>{
    if(!initial) return null;
    if(initial.noAllergens) return false;
    return (initChips.length>0||initCustom.length>0)?true:null;
  });
  const [allergens, setAllergens] = useState(initChips);
  const [diet, setDiet] = useState(()=>Array.isArray(initial?.diet)?initial.diet:[]);
  const [customTags, setCustomTags] = useState(initCustom);
  const [customInput, setCustomInput] = useState("");
  const addCustom = () => {
    const val = customInput.trim();
    if(val && !customTags.includes(val)){ setCustomTags(prev=>[...prev,val]); }
    setCustomInput("");
  };

  const DIET_LIST = [
    {id:"none",        label:"Keine Einschränkungen", desc:"Isst Fleisch und alles"},
    {id:"vegan",       label:"Vegan",                 desc:"Keine tierischen Produkte"},
    {id:"vegetarian",  label:"Vegetarisch",           desc:"Kein Fleisch"},
    {id:"pescatarian", label:"Pescetarisch",          desc:"Fisch, kein Fleisch"},
    {id:"glutenfree",  label:"Glutenfrei",            desc:"Strikt glutenfrei"},
    {id:"lactosefree", label:"Laktosefrei",           desc:"Keine Milchprodukte"},
    {id:"lowcarb",     label:"Low Carb",              desc:"Reduzierte Kohlenhydrate"},
    {id:"keto",        label:"Keto",                  desc:"Sehr wenig Kohlenhydrate"},
    {id:"halal",       label:"Halal",                 desc:"Nach islamischen Richtlinien"},
    {id:"koscher",     label:"Koscher",               desc:"Nach jüdischen Speisegesetzen"},
  ];

  const toggleAllergen = (id) => setAllergens(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  const toggleDiet = (id) => {
    if(id==="none"){ setDiet(prev=>prev.includes("none")?[]:["none"]); return; }
    setDiet(prev=>{
      const without=prev.filter(x=>x!=="none");
      return without.includes(id)?without.filter(x=>x!==id):[...without,id];
    });
  };
  const chooseNone = () => { setHasAllergies(false); setAllergens([]); setCustomTags([]); setCustomInput(""); };

  const pendingCustom = customInput.trim();
  const hasAnyAllergy = allergens.length>0 || customTags.length>0 || pendingCustom.length>0;
  const canNext = hasAllergies===false || (hasAllergies===true && hasAnyAllergy);
  const handleNext = () => {
    if(!canNext) return;
    const finalCustom = hasAllergies===true ? (pendingCustom&&!customTags.includes(pendingCustom)?[...customTags,pendingCustom]:customTags) : [];
    const chips = hasAllergies===true ? allergens : [];
    const groups = [...new Set(chips.map(id=>ALLERGEN_LIST.find(a=>a.id===id)?.group).filter(Boolean))];
    onNext({allergens:groups,allergenChips:chips,customAllergens:finalCustom,noAllergens:hasAllergies===false,diet});
  };

  const grid2={display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:7};
  const hint = hasAllergies===null
    ? "Bitte oben eine Option auswählen."
    : (hasAllergies===true&&!hasAnyAllergy ? "Bitte mindestens eine Allergie wählen oder eintragen." : null);

  return (
    <OnbShell step={5} total={6}>
      <OnbTitle title="Allergien & Ernährung." sub="So filtern wir Supplements und Sportnahrung korrekt für dich."/>

      {/* Allergien */}
      <OnbCard label="Hast du Allergien oder Unverträglichkeiten?">
        <div style={grid2}>
          <OnbTile label="Keine Allergien" active={hasAllergies===false} onClick={chooseNone}/>
          <OnbTile label="Ich habe Allergien" active={hasAllergies===true} onClick={()=>setHasAllergies(true)}/>
        </div>

        {hasAllergies===true&&(
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.g100}`,animation:"fadeUp .25s ease forwards"}}>
            <div style={{...grid2,marginBottom:10}}>
              {ALLERGEN_LIST.map(a=><OnbTile key={a.id} label={a.label} desc={a.desc} multi active={allergens.includes(a.id)} onClick={()=>toggleAllergen(a.id)}/>)}
            </div>
            {/* Eigene Einträge */}
            <div style={{display:"flex",gap:8,marginBottom:customTags.length>0?8:0}}>
              <input type="text" value={customInput} onChange={e=>setCustomInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addCustom();}}}
                placeholder="Weitere Allergie hinzufügen..." aria-label="Weitere Allergie"
                style={{flex:1,minWidth:0,padding:"10px 13px",borderRadius:10,border:`1.5px solid ${C.g200}`,fontSize:13,fontFamily:"Inter,sans-serif",outline:"none",background:C.white,color:C.black}}/>
              <button type="button" onClick={addCustom} aria-label="Allergie hinzufügen" style={{padding:"0 16px",borderRadius:10,background:C.neon,color:C.black,border:"none",fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif",flexShrink:0}}>+</button>
            </div>
            {customTags.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {customTags.map(tag=>(
                  <span key={tag} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,background:ONB_SEL,border:`1px solid ${C.neon}`,fontSize:12,color:C.black,maxWidth:"100%",overflowWrap:"anywhere"}}>
                    {tag}
                    <button className="icon-btn" aria-label={`${tag} entfernen`} onClick={()=>setCustomTags(prev=>prev.filter(x=>x!==tag))} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#888",padding:0,lineHeight:1}}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </OnbCard>

      {/* Ernährung - immer sichtbar, eigene Karte */}
      <OnbCard label="Ernährungsweise" sub="Optional · Mehrfachauswahl möglich">
        <div style={grid2}>
          {DIET_LIST.map(d=><OnbTile key={d.id} label={d.label} desc={d.desc} multi active={diet.includes(d.id)} onClick={()=>toggleDiet(d.id)}/>)}
        </div>
      </OnbCard>

      <OnbNav onBack={onBack} canNext={canNext} onNext={handleNext} hint={hint}/>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </OnbShell>
  );
}

function AnalysePreview({sportData,trainingData,profilData,onContinue,onUpgrade,priceStr="CHF 12.90"}) {

  const [loadPro,setLoadPro]=useState(false);
  const healthOnly=sportData?.healthOnly;
  const fname=String(profilData?.firstname||"").trim();
  const basic=calcBasic(profilData,trainingData,healthOnly);
  const isMobile=useWindowWidth()<=768;
  // Zurueck von Stripe (Browser-Cache): Knopf wieder freigeben
  useEffect(()=>{
    const reset=(e)=>{ if(e?.persisted) setLoadPro(false); };
    window.addEventListener("pageshow",reset);
    return ()=>window.removeEventListener("pageshow",reset);
  },[]);
  const openPro=()=>{
    if(loadPro) return;
    setLoadPro(true);
    try{ onUpgrade?.(); }catch(e){ setLoadPro(false); }
  };

  // Die 4 freien Basiswerte (gleiche Rechnung wie im Profil)
  const waterL=Math.round((basic?.waterMl||75*35)/100)/10;
  const FREE=[
    {label:"Grundumsatz",val:(basic?.bmr||0).toLocaleString("de-CH"),unit:"kcal / Tag"},
    {label:"Mit Training",val:(basic?.withTraining||0).toLocaleString("de-CH"),unit:"kcal / Tag"},
    {label:"Wasser / Tag",val:`~${waterL} L`,unit:"Schätzwert"},
    {label:"Trainingseinheiten",val:(basic?.sessionsPerYear||0).toLocaleString("de-CH"),unit:"pro Jahr"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.off,display:"flex",justifyContent:"center",alignItems:"flex-start",padding:isMobile?"32px 16px 64px":"40px 24px 80px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div className="fu" style={{marginBottom:28}}><Logo/></div>

        <div className="fu2" style={{marginBottom:20}}>
          <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",lineHeight:1.2,color:C.black,marginBottom:6}}>
            {fname?`Deine Analyse ist fertig, ${fname}.`:"Deine Analyse ist fertig."}
          </h2>
          <p style={{fontSize:14,color:C.g600,lineHeight:1.65}}>
            4 Basiswerte sind frei. Alles Weitere schaltest du mit PRO frei.
          </p>
        </div>

        {/* 4 freie Basiswerte */}
        <div className="fu3" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,marginBottom:14}}>
          {FREE.map(c=>(
            <div key={c.label} style={{padding:isMobile?"14px":"16px",background:C.white,borderRadius:14,border:`1px solid ${C.g200}`,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,color:C.g500,marginBottom:6,fontFamily:"Inter,sans-serif",overflowWrap:"anywhere"}}>{c.label}</div>
              <div style={{fontSize:isMobile?22:24,fontWeight:600,color:C.black,letterSpacing:"-.03em",lineHeight:1}}>{c.val}</div>
              <div style={{fontSize:11,color:C.g400,marginTop:5}}>{c.unit}</div>
            </div>
          ))}
        </div>

        {/* Gesperrt-Hinweis */}
        <div className="fu3" style={{display:"flex",alignItems:"flex-start",gap:8,padding:"0 2px",marginBottom:22}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:2}} aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style={{fontSize:13,color:C.g600,lineHeight:1.55}}>Protein, Kohlenhydrate, Elektrolyte, Supplements und Tagesplan sind gesperrt.</span>
        </div>

        {/* PRO */}
        <div className="fu3" style={{background:"#F5FFE0",border:`2px solid ${C.neon}`,borderRadius:16,padding:isMobile?"18px":"20px 22px",marginBottom:10}}>
          <div style={{fontSize:18,fontWeight:600,color:C.black,letterSpacing:"-.02em",lineHeight:1.25,marginBottom:6}}>PRO freischalten</div>
          <p style={{fontSize:14,color:C.g700,lineHeight:1.6,marginBottom:16}}>
            {`Alle Werte exakt berechnet, Supplements und Sportnahrung mit Dosierung, Tagesplan und Wettkampf. ${priceStr} einmalig, 6 Monate.`}
          </p>
          <button onClick={openPro} disabled={loadPro}
            style={{width:"100%",background:loadPro?C.g200:C.neon,color:C.black,border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:600,cursor:loadPro?"default":"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s",boxShadow:loadPro?"none":"0 2px 10px rgba(0,0,0,.08)"}}>
            {loadPro?"Einen Moment...":"PRO freischalten"}
          </button>
        </div>

        {/* Kostenlos weiter */}
        <button className="fu3" onClick={onContinue}
          style={{width:"100%",background:C.white,color:C.g700,border:`1.5px solid ${C.g200}`,borderRadius:12,padding:"13px",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
          Kostenloses Profil ansehen
        </button>
      </div>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────

// ── SPORT-HELFER (Anzeige) ───────────────────────────────────────────────────
// Unterdisziplin wie in calcPro aufloesen (resolveSubId), damit Anzeige und Rechnung denselben MET nutzen
function resolveSportSubId(parentId, sd) {
  const subSel=sd?.subSel||{}, childSel=sd?.childSel||{};
  const group=(SPORT_GROUPS||[]).find(g=>g.id===parentId);
  for(const sub of (group?.subs||[])) {
    if(sub.children?.length>0) {
      const ch=sub.children.find(c=>childSel[sub.id+"_"+c.id]);
      if(ch) return ch.id;
    }
    if(subSel[sub.id] && !sub.children?.length) return sub.id;
  }
  return parentId;
}
function sportMetTable(parentId, sd) {
  return getSubProfile(resolveSportSubId(parentId,sd))?.met || SPORT_MET[parentId] || SPORT_MET.fussball;
}
// Anzeigename: gewaehlte Unterdisziplin(en) (z. B. "Rennrad"), sonst Name der Gruppe; null wenn unbekannt
function sportDisplayName(id, sd) {
  if(!id) return null;
  const groups=SPORT_GROUPS||[];
  const group=groups.find(g=>g.id===id);
  if(group) {
    const subSel=sd?.subSel||{}, childSel=sd?.childSel||{};
    const picked=(group.subs||[]).filter(sub=>subSel[sub.id]||(sub.children||[]).some(c=>childSel[sub.id+"_"+c.id])).map(sub=>sub.label);
    if(picked.length>0&&picked.length<=2) return picked.join(" & ");
    return group.label;
  }
  for(const g of groups) for(const sub of (g.subs||[])) {
    if(sub.id===id) return sub.label;
    const ch=(sub.children||[]).find(c=>c.id===id);
    if(ch) return `${sub.label} ${ch.label}`;
  }
  return null;
}

// ── KI-ZUSAMMENFASSUNG "Deine Zahlen" ────────────────────────────────────────
// Ausserhalb von Results definiert: wird nicht bei jedem Rendern neu angelegt.
// Anfrage erst 1.5 s nach der letzten Aenderung, Ergebnis je Datenstand zwischengespeichert.
const AI_SUMMARY_CACHE={};
const AI_SUMMARY_PENDING={};
function VerbrauchAISummary({profilData, training, sportIds, sportData, calc}) {
  const sportsText=(sportIds&&sportIds.length?sportIds:Object.keys(training||{})).map(id=>{
    const d=(training||{})[id]||{};
    return `${sportDisplayName(id,sportData)||id}: ${d.days||3}x/Wo, ${d.duration||60}min, Intensität ${d.intensity||"medium"}`;
  }).join("; ");
  const prompt=`Du bist TREYN AI, ein präziser Sportnutrition-Coach. Bewerte diese Trainingsdaten kurz und direkt auf Deutsch (3-4 Sätze, kein Markdown, keine Aufzählung):

Sportler: ${profilData?.gender==="f"?"weiblich":"männlich"}, ${new Date().getFullYear()-(+profilData?.birthyear||1990)} Jahre, ${profilData?.weight||75}kg, ${profilData?.height||175}cm
Training: ${sportsText}
Grundumsatz: ${calc?.bmr} kcal, Tagesbedarf an einem Trainingstag: ${calc?.withTraining} kcal
Protein: ${calc?.proteinMin||Math.round((+profilData?.weight||75)*1.6)}g/Tag, Kohlenhydrate: ${calc?.carbsG||Math.round((calc?.withTraining||2500)*0.5/4)}g/Tag

Sag dem Sportler direkt wie gut sein Trainingsvolumen ist, ob die Energiezufuhr reicht, und gib einen konkreten Tipp. Persönlich und motivierend, nicht technisch.`;
  const key=prompt;
  const [summary,setSummary]=useState(()=>AI_SUMMARY_CACHE[key]||"");
  const [loading,setLoading]=useState(false);
  const keyRef=useRef(key);
  keyRef.current=key;

  const run=async(k,p)=>{
    setLoading(true);
    if(!AI_SUMMARY_PENDING[k]) {
      AI_SUMMARY_PENDING[k]=(async()=>{
        try{
          const res=await fetch("https://api.anthropic.com/v1/messages",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:p}]})
          });
          const data=await res.json();
          return noDash(data?.content?.[0]?.text)||"";
        }catch(e){ return ""; }
      })().finally(()=>{ delete AI_SUMMARY_PENDING[k]; });
    }
    const text=await AI_SUMMARY_PENDING[k];
    if(keyRef.current!==k) return; // Daten wurden inzwischen geaendert
    if(text){ AI_SUMMARY_CACHE[k]=text; setSummary(text); }
    else setSummary("Analyse konnte nicht geladen werden. Bitte versuche es erneut.");
    setLoading(false);
  };

  useEffect(()=>{
    if(AI_SUMMARY_CACHE[key]){ setSummary(AI_SUMMARY_CACHE[key]); setLoading(false); return; }
    const tm=setTimeout(()=>{ run(key,prompt); },1500);
    return ()=>clearTimeout(tm);
  },[key]);

  const loaded=!!AI_SUMMARY_CACHE[key];
  return (
    <div style={{borderRadius:14,border:`1px solid ${C.neonBorder||"#E0FF80"}`,background:C.neonDim,padding:"18px 20px",marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:loading?"#CCC":C.neon,transition:"background .3s"}}/>
          <span style={{fontSize:12,fontWeight:500,color:"#4A7000",fontFamily:"Inter,sans-serif"}}>TREYN AI · Deine Analyse</span>
        </div>
        {(loaded||summary)&&!loading&&<button onClick={()=>{ delete AI_SUMMARY_CACHE[key]; run(key,prompt); }} style={{background:"none",border:"none",fontSize:10,color:"#AAA",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>↺ Neu</button>}
      </div>
      {(loading||(!summary&&!loaded))&&(
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#4A7000",opacity:.4,animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}
          <span style={{fontSize:12,color:"#4A7000",marginLeft:6}}>Analysiere deine Daten...</span>
        </div>
      )}
      {!loading&&summary&&(
        <p style={{fontSize:13,color:"#2D4A00",lineHeight:1.7,margin:0}}>{summary}</p>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </div>
  );
}



// ── BLUR GATE ────────────────────────────────────────────────────────────────

// ── ANALYSING SCREEN ─────────────────────────────────────────────────────────
function AnalysingScreen({onDone, profilData, sportData}) {
  
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const firstname = profilData?.firstname||"";
  const sports = (sportData?.selectedSports||[]);
  const sportName = sportDisplayName(sportData?.primarySport||sports[0], sportData)||"deine Sportart";

  const STEPS = [
    "Körperdaten werden verarbeitet...",
    `Trainingsvolumen für ${sportName} berechnen...`,
    "Energiebedarf & Grundumsatz kalkulieren...",
    "Supplement-Profil personalisieren...",
    "Sportnahrung abstimmen...",
    "Elektrolyte & Hydration berechnen...",
    "TREYN AI analysiert deine Werte...",
    "Alles bereit.",
  ];

  useEffect(()=>{
    const duration = 3800;
    const interval = 80;
    let elapsed = 0;
    const timer = setInterval(()=>{
      elapsed += interval;
      const pct = Math.min((elapsed/duration)*100, 100);
      setProgress(pct);
      setStep(Math.min(Math.floor((pct/100)*STEPS.length), STEPS.length-1));
      if(elapsed >= duration){ clearInterval(timer); setTimeout(onDone, 400); }
    }, interval);
    return ()=>clearInterval(timer);
  },[]);

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.white,padding:"40px 20px",fontFamily:"Inter,sans-serif"}}>
      <div style={{width:"100%",maxWidth:480}}>
        {/* Logo */}
        <div style={{marginBottom:52}}><Logo size="lg"/></div>

        {/* Greeting */}
        <div style={{fontSize:26,fontWeight:600,color:C.black,letterSpacing:"-.03em",lineHeight:1.2,marginBottom:6}}>
          {firstname?`${firstname}, deine Analyse läuft.`:"Deine Analyse läuft."}
        </div>
        <div style={{fontSize:14,color:C.g600,marginBottom:40,lineHeight:1.6}}>
          TREYN AI verarbeitet deine Daten und berechnet deinen persönlichen Plan.
        </div>

        {/* Progress bar */}
        <div style={{height:3,background:C.g200,borderRadius:2,marginBottom:16,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,background:C.neon,borderRadius:2,transition:"width .12s ease"}}/>
        </div>

        {/* Step text */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:40}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:progress<100?C.neon:"#4A7000",flexShrink:0,
            animation:progress<100?"pulse 1s infinite":"none"}}/>
          <span style={{fontSize:13,fontWeight:500,color:progress<100?C.g600:"#4A7000",fontFamily:"Inter,sans-serif",transition:"color .3s"}}>
            {STEPS[step]}
          </span>
        </div>

        {/* What we calculate */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          {[
            {label:"Grundumsatz",done:progress>15},
            {label:"Tagesbedarf",done:progress>25},
            {label:"Proteinbedarf",done:progress>35},
            {label:"Kohlenhydrate",done:progress>45},
            {label:"Elektrolyte",done:progress>55},
            {label:"Supplements",done:progress>65},
            {label:"Sportnahrung",done:progress>75},
            {label:"Recovery",done:progress>85},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",borderRadius:8,background:item.done?C.neonDim:"#FAFAFA",border:`1px solid ${item.done?C.neon:C.g200}`,transition:"all .4s"}}>
              <div style={{width:14,height:14,borderRadius:"50%",background:item.done?C.black:C.g200,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .3s"}}>
                {item.done&&<svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.2 2.2L7 1.5" stroke={C.neon} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{fontSize:11,color:item.done?"#2D4A00":C.g400,fontWeight:item.done?600:400,transition:"color .3s",minWidth:0,overflowWrap:"anywhere"}}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

// maxHeight (optional): zeigt bei langen Inhalten (z. B. Tagesplan) nur einen Ausschnitt, damit die Karte im Blick bleibt
function BlurGate({isPro, onUpgrade, label="PRO Feature", priceStr="CHF 12.90", maxHeight=null, children}) {
  // C is already the global constant
  if(isPro) return children;
  return (
    <div style={{position:"relative",borderRadius:12,overflow:"hidden",...(maxHeight?{maxHeight}:{})}}>
      <div aria-hidden="true" style={{filter:"blur(4px)",pointerEvents:"none",userSelect:"none",opacity:.6}}>
        {children}
      </div>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(255,255,255,.7)",backdropFilter:"blur(2px)"}}>
        <div style={{textAlign:"center",padding:"18px 20px",background:"#fff",borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,.12)",border:"1px solid #EBEBEB",maxWidth:260,width:"100%",fontFamily:"Inter,sans-serif"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div style={{fontSize:13,fontWeight:600,color:"#0A0A0A",marginBottom:4}}>{label}</div>
          <div style={{fontSize:12,fontWeight:400,color:"#888",marginBottom:12,lineHeight:1.5}}>Nur mit PRO verfügbar</div>
          <button onClick={onUpgrade}
            style={{background:"#C8FF00",color:"#000",border:"none",borderRadius:8,padding:"9px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif",width:"100%"}}>
            Upgrade {priceStr} →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── RESULTS-REITER ───────────────────────────────────────────────────────────
// Vier Reiter fuer Basic und PRO gleich. Alte ids (aus aelteren Verlaufs-Eintraegen oder Knoepfen) werden umgelenkt.
const RESULTS_TABS=["summary","plan","produkte","profil","aichat","kontakt"];
const RESULTS_TAB_ALIAS={zahlen:"summary",tagesplan:"plan",wettkampf:"plan",empfehlungen:"produkte",einkauf:"produkte"};
const normResultsTab=t=>{ const n=RESULTS_TAB_ALIAS[t]||t; return RESULTS_TABS.includes(n)?n:"summary"; };

function Results({sportData,trainingData,profilData,allergenData,praeferenzenData,tier,onReset,onUpgrade,onTrainingChange,onProfilChange,onEditSports}) {
  const [tab,setTabRaw]=useState(()=>{try{const st=window.history.state;return st?.treyn&&st.gen===NAVH.gen&&st.phase==="results"&&st.tab?normResultsTab(st.tab):"summary";}catch{return "summary";}});
  // Neu zeichnen, wenn ein Unter-Reiter im selben Reiter umgestellt wird (z. B. setTab("einkauf") waehrend Produkte offen ist)
  const [,setViewTick]=useState(0);
  const setTab=raw=>{
    // Alte ids oeffnen direkt den passenden Unter-Reiter
    if(raw==="einkauf") UI_STATE.empfSub="merkliste";
    if(raw==="wettkampf") UI_STATE.activeSection="wettkampf";
    const t=normResultsTab(raw);
    if(t===tab){
      if(raw!==t){ setViewTick(x=>x+1); window.scrollTo({top:0,behavior:"instant"}); }
      return;
    }
    setTabRaw(t); navPush("results",t);
  };
  useEffect(()=>{
    const onPop=e=>{ const st=e.state; if(st?.treyn&&st.gen===NAVH.gen&&st.phase==="results") setTabRaw(normResultsTab(st.tab||"summary")); };
    window.addEventListener("popstate",onPop);
    return ()=>window.removeEventListener("popstate",onPop);
  },[]);
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[tab]);
  // false, sobald Results verschwindet (z. B. "Neu"): dann keine offenen Reiter-Aenderungen mehr an App melden
  const resultsMountedRef=useRef(true);
  React.useLayoutEffect(()=>{ resultsMountedRef.current=true; return ()=>{ resultsMountedRef.current=false; }; },[]);
  const isMobile=useWindowWidth()<=768;
  const isPro=tier==="pro";
  // Expose country for AFF locale routing
  useEffect(()=>{window.__TREYN_PROFIL__=profilData;},[profilData]);
  const userCountry=profilData?.country||"Schweiz";
  const isEUR=["Deutschland","Österreich"].includes(userCountry);
  const PRICE_STR=isEUR?"EUR 9.90":"CHF 12.90";
  const PRICE_PERIOD=isEUR?"/ 6 Monate · EUR 1.65/Mt.":"/ 6 Monate · CHF 2.15/Mt.";
  const PRICE_MONTH=isEUR?"EUR 1.65":"CHF 2.15";
  const ProUnlockBanner=({text})=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",background:C.neonDim,border:`1px solid ${C.neonBorder}`,borderRadius:12,padding:"10px 14px",marginBottom:14}}>
      <div style={{fontSize:12,color:"#333",lineHeight:1.5,flex:"1 1 200px",minWidth:0}}>{text}</div>
      <button onClick={onUpgrade} style={{background:C.neon,color:C.black,border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif",whiteSpace:"nowrap"}}>{`PRO freischalten - ${PRICE_STR}`}</button>
    </div>
  );
  const isCH=["Schweiz"].includes(userCountry);
  const isDAch=["Schweiz","Deutschland","Österreich"].includes(userCountry);
  // Shop availability label
  const shopAvail=(shopId)=>{
    const CH_ONLY=["Bodylab24","Sponser","Zur Rose","nu3.ch"];
    const DACH_ONLY=["ESN","More Nutrition","nu3"];
    if(CH_ONLY.includes(shopId)&&!isCH) return "iHerb";
    if(DACH_ONLY.includes(shopId)&&!isDAch) return "iHerb";
    return shopId;
  };


  const healthOnly=sportData?.healthOnly;
  const primarySport=sportData?.primarySport;
  const sports=sportData?.selectedSports||[];

  // Präferenzen aus praeferenzenData ableiten
  const {energieForm:_eF=[],suppForm:_sF=null}=praeferenzenData||{};
  const energieFormArr=Array.isArray(_eF)?_eF:(_eF?[_eF]:[]);
  const wantsGel=energieFormArr.includes("gel");
  const wantsDrink=energieFormArr.includes("drink");
  const wantsRiegel=energieFormArr.includes("riegel");
  const wantsKapsel=_sF==="kapsel"||_sF==="beides";
  const wantsPulver=_sF==="pulver"||_sF==="beides";

  // Why explanation per format
  const getEnergyReason=(form)=>{
    if(form==="gel"&&!wantsGel) return "Gels sind bei dir deaktiviert - du bevorzugst Riegel oder Drinks.";
    if(form==="gel") return "Ideal für dich: kompakt, sofort verfügbar, kein Kauen nötig.";
    if(form==="drink"&&!wantsDrink) return "Drink Mix ausgeblendet - du bevorzugst kompaktere Optionen.";
    if(form==="drink") return "Perfekt: kombiniert Kohlenhydrate und Hydration in einem.";
    if(form==="riegel"&&!wantsRiegel) return "Riegel ausgeblendet - du bevorzugst Gels oder Drinks.";
    if(form==="riegel") return "Gut für längere Einheiten - mehr Sättigung, solider Energieschub.";
    return "";
  };

  const getSuppReason=(form)=>{
    if(form==="kapsel"&&!wantsKapsel) return "Kapseln ausgeblendet - du bevorzugst Pulver.";
    if(form==="pulver"&&!wantsPulver) return "Pulver ausgeblendet - du bevorzugst Kapseln.";
    return "";
  };
  const sportLabel=SPORT_GROUPS.find(s=>s.id===primarySport)?.label||(healthOnly?"Gesundheit":"Sport");
  const primaryTraining=trainingData?.[primarySport]||{intensity:"medium"};
  const {basis,specific}=getSupplements(primarySport,primaryTraining.intensity,healthOnly,sportData?.subSel,sportData?.childSel||{});
  const profile=buildProfile(sportData,trainingData,profilData);
  const proData=isPro?calcPro(profilData,trainingData,sportData):null;
  const kcal=proData||calcPro(profilData,trainingData,sportData);
  const {primSupps,secSupps}=getPersonalizedSupps(profile,[...specific,...basis],[],proData);
  const sportNutrition=healthOnly?{primary:[],secondary:[]}:getSportNutrition(primarySport,sportData?.subSel,sportData?.childSel||{});
  const fname=profilData?.firstname||"";
  const intensityLabel={"low":"Leicht","medium":"Mittel","high":"Intensiv","competition":"Wettkampf"}[primaryTraining.intensity]||"Mittel";
  const aiCtx={sportLabel,intensity:primaryTraining.intensity,days:Object.values(trainingData||{}).reduce((s,d)=>s+(d?.days||0),0)||primaryTraining.days||3,duration:primaryTraining.duration||60,weight:profilData?.weight||75,gender:profilData?.gender||"m",hasComp:primaryTraining.hasCompetition,compCount:primaryTraining.compCount||0,proData};

  // Navigation fuer Basic und PRO gleich: 4 Reiter, nichts gesperrt (gesperrte Inhalte zeigen die Seiten selbst)
  const NAV=[
    {id:"summary",  label:"Übersicht", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>},
    {id:"plan",     label:"Plan",      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
    {id:"produkte", label:"Produkte",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>},
    {id:"profil",   label:"Profil",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
  ];
  const AICHAT_NAV={id:"aichat",label:"TREYN AI Chat",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>};
  const PROFIL_NAV={id:"profil",label:"Profil & Zahlung",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>};
  const KONTAKT_NAV={id:"kontakt",label:"Kontakt & Impressum",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>};

  const NavItem=({item,mobile=false})=>{
    const active=tab===item.id;
    if(mobile) return (
      <button onClick={()=>{setTab(item.id);window.scrollTo({top:0,behavior:"instant"});}} aria-current={active?"page":undefined}
        style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"8px 4px 6px",border:"none",cursor:"pointer",background:"transparent",fontFamily:"Inter,sans-serif",borderTop:active?`2px solid ${C.neon}`:"2px solid transparent",transition:"all .14s"}}>
        <span style={{color:active?C.black:C.g400,display:"flex"}}>{item.icon}</span>
        <span style={{fontSize:10,fontWeight:active?600:500,color:active?C.black:C.g500,whiteSpace:"nowrap"}}>{item.label}</span>
      </button>
    );
    return (
      <button onClick={()=>{setTab(item.id);window.scrollTo({top:0,behavior:"instant"});}} aria-current={active?"page":undefined} style={{
        display:"flex",alignItems:"center",gap:10,width:"100%",
        padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",
        background:active?C.neon:item.id==="aichat"?C.neonDim:"transparent",
        color:active?C.black:C.g600,
        fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:active?600:400,
        transition:"all .14s",textAlign:"left",position:"relative",
      }}>
        <span style={{color:active?C.black:C.g400,flexShrink:0}}>{item.icon}</span>
        {item.label}
      </button>
    );
  };

  // Interaction checker - returns warnings for supplement combinations
  const checkInteractions=(suppIds)=>{
    const warnings=[];
    if(suppIds.includes("koffein")&&suppIds.includes("beta_ala")) warnings.push({ids:["koffein","beta_ala"],text:"Koffein + Beta-Alanin: Kribbeln (Parästhesien) kann sich verstärken. Einzeln einnehmen."});
    if(suppIds.includes("eisen")&&suppIds.includes("kalk")) warnings.push({ids:["eisen","kalk"],text:"Eisen + Kalzium: Nicht gleichzeitig einnehmen - hemmen gegenseitig die Aufnahme."});
    if(suppIds.includes("zink")&&suppIds.includes("kalk")) warnings.push({ids:["zink","kalk"],text:"Zink + Kalzium: Zeitversetzt einnehmen für optimale Absorption."});
    return warnings;
  };
  const SupplementsContent=({isPro,primSupps,secSupps,allergenData,proData})=>{
    const [showAllPrim,setShowAllPrim]=useState(false);
    const prefSupp=praeferenzenData?.suppForm||"beides";
    const country=profilData?.country||"Schweiz";
    const isCH=["Schweiz"].includes(country);
    const [showAllSec,setShowAllSec]=useState(false);
    // Merken/Warenkorb für die Burgerstein-Karten (gleicher Speicher wie alle anderen Karten)
    const [ownedIds,setOwnedIds]=useState(()=>{ try{ return JSON.parse(localStorage.getItem("treyn_owned")||"[]"); }catch{ return []; } });
    const toggleOwnedId=(id)=>{
      try{
        const list=JSON.parse(localStorage.getItem("treyn_owned")||"[]");
        const next=list.includes(id)?list.filter(x=>x!==id):[...list,id];
        localStorage.setItem("treyn_owned",JSON.stringify(next));
        setOwnedIds(next);
      }catch{}
    };
    // Angaben aus dem Onboarding - gelten auch in Basic, weil Sicherheitshinweise nie gesperrt sind
    const meds=(profilData?.medications||[]).filter(m=>m&&m!=="none");
    const curSupps=(profilData?.currentSupps||[]).filter(x=>x&&x!=="none");
    const dietArr=Array.isArray(allergenData?.diet)?allergenData.diet:(allergenData?.diet?[allergenData.diet]:[]);
    const isVegan=dietArr.includes("vegan");
    // Vegan: Whey durch pflanzliches Protein und Fisch-Omega-3 durch Algenöl ersetzen
    const swapWhy=(s,newWhy)=>{
      const pw=s.personalWhy||"";
      const extra=s.why&&pw.startsWith(s.why)?pw.slice(s.why.length):"";
      return newWhy+extra;
    };
    const veganSwap=(s)=>{
      if(!isVegan||!s?.id) return s;
      if(/whey/.test(s.id)){
        const why="Erbsen + Reis - vollständiges Aminosäureprofil, pflanzlich.";
        return {...s,id:"prot_vegan",name:"Myprotein Vegan Protein",why,personalWhy:swapWhy(s,why),link:AFF.myprotein("vegan protein blend"),shop:"Myprotein",budget:null,barcode:null,keyIngredient:null,tags:["Post-Training","Vegan"]};
      }
      if(/omega/.test(s.id)){
        const why="EPA/DHA aus Algen statt Fisch - die pflanzliche Alternative zu Fischöl.";
        return {...s,id:"omega3_vegan",name:"Omega-3 aus Algenöl (vegan)",why,personalWhy:swapWhy(s,why),link:AFF.iherb("algae omega 3"),shop:"iHerb",budget:null,barcode:null,tags:["Täglich","Vegan"]};
      }
      return s;
    };
    const enrich=(s)=>{
      const v=veganSwap(s);
      return {...v,mediWarning:v.mediWarning||getMediWarning(v,meds),alreadyTaking:!!v.alreadyTaking||isAlreadyTaking(v,curSupps)};
    };
    const seenIds=new Set();
    const uniq=(arr)=>arr.filter(s=>{ if(!s?.id||seenIds.has(s.id)) return false; seenIds.add(s.id); return true; });
    const primAll=uniq((primSupps||[]).map(enrich));
    const secAll=uniq((secSupps||[]).map(enrich));
    // Was der User schon nimmt, gehört nicht unter ZWINGEND (in PRO sortiert das getPersonalizedSupps schon so)
    const primList=primAll.filter(s=>!s.alreadyTaking);
    const secList=[...primAll.filter(s=>s.alreadyTaking),...secAll];
    // Nur die gewählten Allergien, die Ernährungsweise und eigene Einträge prüfen
    const allergenWarnings=(s)=>{
      const w=checkAllergens(s.id,s.name,allergenData);
      // Medikamente stehen schon in der orangen Box - nicht doppelt anzeigen
      if(!s.mediWarning) return w;
      return w.filter(x=>!((x.id==="blutverd"&&meds.includes("blutverd"))||(x.id==="schilddr"&&meds.includes("schilddruese"))));
    };
    const allActive=[...primList,...secList];
    const interactionsFor=(s)=>getSupplementInteractions(s,allActive);
    const displayPrim=showAllPrim?primList:primList.slice(0,3);
    const displaySec=showAllSec?secList:secList.slice(0,2);
    const ashwaInStack=primList.some(s=>suppKeysOf(s).includes("ashwa"));
    const nPrim=primList.length;
    const BURGERSTEIN=[
      {id:"bs_sport",name:"Burgerstein Sport",dose:"1 Tablette täglich",when:"Zum Frühstück",why:"Das Basisprodukt für Sportler - Antioxidantien, Vitamine, Mineralien. Entwickelt mit Sportärzten.",price:"CHF 29.90",link:AFF.nu3("products/burgerstein-sport",country),shop:"nu3.ch"},
      {id:"bs_magnesium",name:"Burgerstein Magnesium",dose:"300-400mg abends",when:"Vor dem Schlafen",why:"Hochdosiertes Magnesium in optimaler Form - Muskelkrampfprävention und Regeneration.",price:"CHF 24.90",link:AFF.nu3("products/burgerstein-magnesium-vital",country),shop:"nu3.ch"},
      {id:"bs_omega3",name:"Burgerstein Omega-3",dose:"2-3g täglich",when:"Zum Essen",why:"Hochreines Fischöl - entzündungshemmend, herzschützend, HRV-verbessernd.",price:"CHF 34.90",link:AFF.zur_rose("burgerstein-omega-3",country),shop:isCH?"Zur Rose":"iHerb"},
      {id:"bs_vitd",name:"Burgerstein Vitamin D3",dose:"2000-4000 IE täglich",when:"Zum Frühstück",why:"Vitamin D3 in optimaler Dosierung - 70% aller Schweizer mangelhaft versorgt.",price:"CHF 19.90",link:AFF.nu3("products/burgerstein-vitamin-d3",country),shop:"nu3.ch"},
      {id:"bs_zink",name:"Burgerstein Zink",dose:"15mg täglich",when:"Zum Essen",why:"Organisches Zink für Immunsystem, Hormonhaushalt & Wundheilung - oft defizitär bei Ausdauersport.",price:"CHF 22.90",link:AFF.zur_rose("burgerstein-zink",country),shop:isCH?"Zur Rose":"iHerb"},
    ];
    return (
      <div>
        {!isPro&&<ProUnlockBanner text="Dosierung, Timing und Begründung für jedes Supplement sind mit PRO freigeschaltet."/>}
        {/* Summary */}
        {isPro&&nPrim>0&&(
          <div style={{background:C.neonDim,border:`1px solid ${C.neonBorder}`,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:11,fontFamily:"Inter,sans-serif",fontWeight:500,color:"#4A7000",marginBottom:5}}>Dein Supplement-Stack</div>
            <div style={{fontSize:12,color:"#333",lineHeight:1.7,marginBottom:4}}>
              {`${nPrim===1?"1 essentielles Supplement":`${nPrim} essentielle Supplements`} - berechnet auf dein Gewicht, Sport und Lifestyle.`}
            </div>
            {proData?.vitDRisk&&<div style={{fontSize:11,color:"#3A6000"}}>Vitamin D Risiko erkannt - Supplement besonders wichtig für dich.</div>}
            {proData?.ironRisk&&<div style={{fontSize:11,color:"#3A6000"}}>Erhöhtes Eisenrisiko - Blutspiegel prüfen empfohlen.</div>}
            {proData?.sleepAshwaNeeded&&<div style={{fontSize:11,color:"#3A6000"}}>{ashwaInStack?"Schlafdefizit erkannt - Ashwagandha & Magnesium priorisiert.":"Schlafdefizit erkannt - Magnesium priorisiert."}</div>}
          </div>
        )}
        {nPrim>0&&(
          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:8}}>Dein Stack · zwingend</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
              {displayPrim.map((s,i)=><ProductCard key={s.id} s={s} index={i} isPrimary={true} compact={true} locked={!isPro} country={country} interactions={interactionsFor(s)} allergenWarnings={allergenWarnings(s)}/>)}
            </div>
            {nPrim>3&&<button onClick={()=>setShowAllPrim(x=>!x)} style={{width:"100%",padding:"9px",borderRadius:9,border:`1px solid ${C.g200}`,background:C.white,fontSize:12,color:C.g600,cursor:"pointer",fontFamily:"Inter,sans-serif",marginTop:4}}>{showAllPrim?`Weniger anzeigen`:`+ ${nPrim-3} weitere anzeigen`}</button>}
          </div>
        )}
        {secList.length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{fontSize:12,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:8}}>Optional · sinnvoll</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
              {displaySec.map((s,i)=><ProductCard key={s.id} s={s} index={i} isPrimary={false} compact={true} locked={!isPro} country={country} interactions={interactionsFor(s)} allergenWarnings={allergenWarnings(s)}/>)}
            </div>
            {secList.length>2&&<button onClick={()=>setShowAllSec(x=>!x)} style={{width:"100%",padding:"9px",borderRadius:9,border:`1px solid ${C.g200}`,background:C.white,fontSize:12,color:C.g600,cursor:"pointer",fontFamily:"Inter,sans-serif",marginTop:4}}>{showAllSec?`Weniger anzeigen`:`+ ${secList.length-2} weitere anzeigen`}</button>}
          </div>
        )}

        {/* Burgerstein - Schweizer Referenz */}
        <div style={{marginBottom:8}}>
          <div style={{fontSize:12,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:8}}>Burgerstein · Swiss Quality</div>
          <div style={{background:C.g100,border:`0.5px solid ${C.g200}`,borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:11,color:C.g600,lineHeight:1.6}}>
            Official Supplier von Swiss Ski, Swiss Triathlon & Swiss Tennis. Entwickelt von Sportärzten - seit 50 Jahren. Erhältlich via nu3.ch und Zur Rose.
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
            {BURGERSTEIN.map((p)=>{
              const on=ownedIds.includes(p.id);
              const mw=getMediWarning(p,meds);
              const aw=checkAllergens(p.id,p.name,allergenData).filter(x=>!(mw&&((x.id==="blutverd"&&meds.includes("blutverd"))||(x.id==="schilddr"&&meds.includes("schilddruese")))));
              const taking=isAlreadyTaking(p,curSupps);
              return (
              <div key={p.id} style={{background:C.white,border:`0.5px solid ${mw?"rgba(255,149,0,.5)":C.g200}`,borderRadius:11,padding:"12px 14px",display:"flex",flexDirection:"column",gap:6,minWidth:0}}>
                {taking&&<span style={{alignSelf:"flex-start",fontSize:9,padding:"2px 7px",borderRadius:100,background:"rgba(52,199,89,.12)",color:"#1A7A35",fontFamily:"Inter,sans-serif",fontWeight:600}}>✓ Nimmst du schon</span>}
                <div style={{fontSize:13,fontWeight:700,color:C.black,lineHeight:1.3,overflowWrap:"anywhere"}}>{p.name}</div>
                {mw&&<div style={{fontSize:10,lineHeight:1.45,padding:"6px 8px",borderRadius:6,background:"rgba(255,149,0,.1)",border:"1px solid rgba(255,149,0,.3)",color:"#8A5700",fontWeight:500,overflowWrap:"anywhere"}}>{mw}</div>}
                {aw.length>0&&<div title={aw.map(w=>w.msg).join(" ")} style={{fontSize:10,lineHeight:1.45,padding:"5px 8px",borderRadius:6,background:"rgba(255,59,48,.08)",border:"1px solid rgba(255,59,48,.2)",color:"#C0392B",fontWeight:600,overflowWrap:"anywhere"}}>{aw.map(w=>w.short||w.allergen).join(" · ")}</div>}
                {isPro?<div style={{fontSize:10,color:C.g500,fontFamily:"Inter,sans-serif"}}>{p.dose}</div>:<ProLock w={64}/>}
                <div style={{fontSize:11,color:C.g700,lineHeight:1.5,borderLeft:`3px solid ${C.neon}`,paddingLeft:8,background:"#FAFAFA",borderRadius:"0 6px 6px 0",padding:"6px 8px",overflowWrap:"anywhere"}}>{isPro?p.why:<ProLock w={110} lines={2}/>}</div>
                <span style={{fontSize:11,fontWeight:600,color:C.black,marginTop:2}}>{p.price}</span>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    style={{flex:"999 1 60px",textAlign:"center",padding:"7px 8px",borderRadius:8,background:C.neon,color:C.black,fontSize:10,fontWeight:700,textDecoration:"none"}}>
                    {p.shop} ↗
                  </a>
                  <button onClick={()=>toggleOwnedId(p.id)} style={{flex:"1 0 auto",padding:"7px 10px",borderRadius:8,border:`1px solid ${on?"rgba(52,199,89,.4)":C.g200}`,background:on?"rgba(52,199,89,.08)":"transparent",fontSize:10,cursor:"pointer",fontFamily:"Inter,sans-serif",color:on?"#1A7A35":C.g500}}>
                    {on?"✓ Gemerkt":"+ Merken"}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── WEARABLES DATA (shared between WearablesContent + CartTab) ──────────────
  const WEARABLES=[
    {
      name:"Ultrahuman Ring PRO",
      badge:"Top Pick · Kein Abo · 15 Tage Akku", // Affiliate-Provision (20%) nur intern, nie im sichtbaren Text
      affiliate:true,
      category:"Sleep & Recovery",
      why:"Der beste Ring ohne Abo. 15 Tage Akku, On-Device AI, kein Monatsabo - einmalig kaufen, fertig.",
      metrics:["HRV","Schlafphasen","Körpertemperatur","Stress Score","Glucose-Integration"],
      price:"ab CHF 399",
      shops:[{name:"Ultrahuman",link:"https://www.ultrahuman.com/ring-pro/?ref=DEIN_CODE",affiliate:true}],
    },
    {
      name:"Garmin Forerunner 965",
      badge:"GPS · HRV · VO₂max · Top Pick",
      affiliate:true,
      category:"Multisport",
      why:"Das beste Multisport-GPS für Ausdauersportler. Misst VO₂max, HRV, Training Readiness und Körperbatteriestand.",
      metrics:["VO₂max","HRV","Schlaf","Training Load","Erholungsstatus"],
      price:"ab CHF 599",
      shops:[{name:"Garmin CH",link:"https://www.garmin.com/de-CH/p/735158",affiliate:true}],
    },
    {
      name:"Garmin Fenix 8",
      badge:"Premium · Outdoor · Multisport",
      affiliate:true,
      category:"Premium GPS",
      why:"Für den Athleten der alles will. Solarladung, Topo-Karten und alle Gesundheitsmetriken.",
      metrics:["VO₂max","HRV","Schlaf","Altitude Training","Körperbatterie"],
      price:"ab CHF 899",
      shops:[{name:"Garmin CH",link:"https://www.garmin.com/de-CH/p/994307",affiliate:true}],
    },
    {
      name:"Polar Vantage V3",
      badge:"Polar · Ausdauer · HRV",
      affiliate:true,
      category:"Ausdauer",
      why:"Polars Flaggschiff. Noxim-Technologie misst Sauerstoffsättigung am Handgelenk - einzigartig präzise.",
      metrics:["VO₂max","HRV","Schlaf","Noxim O₂","Running Power"],
      price:"ab CHF 499",
      shops:[{name:"Polar CH",link:"https://www.polar.com/de/vantage/v3",affiliate:true}],
    },
    {
      name:"Polar Pacer Pro",
      badge:"Laufen · Leicht · Präzise",
      affiliate:true,
      category:"Running",
      why:"Sehr leichte GPS-Uhr für Läufer. Nur 45g - man vergisst sie beim Training.",
      metrics:["VO₂max","HRV","Laufleistung","Kadenz","Schlaf"],
      price:"ab CHF 299",
      shops:[{name:"Polar CH",link:"https://www.polar.com/de/pacer-pro",affiliate:true}],
    },
    {
      name:"Oura Ring 4",
      badge:"Ring · Schlaf · HRV · Marktführer",
      affiliate:true,
      category:"Sleep & Recovery",
      why:"Der Marktführer. Als Ring getragen misst er Schlafphasen, HRV und Körpertemperatur mit Laborqualität.",
      metrics:["HRV","Schlafphasen","Körpertemperatur","Readiness Score","Zyklusanalyse"],
      price:"ab CHF 349 + Abo",
      shops:[{name:"Oura",link:"https://ouraring.com/de"},{name:"Zur Rose",link:"https://www.zurrose-shop.ch/de/oura-ring",affiliate:true}],
    },
  ];

  const WearablesContent=()=>{
    const [cartTick,setCartTick]=useState(0);
    // WEARABLES defined in Results scope above
    const _dummy_=[{
        name:"Ultrahuman Ring PRO_SKIP",
        badge:"Top Pick · Kein Abo · 15 Tage Akku",
        affiliate:true,
        category:"Sleep & Recovery",
        why:"Der beste Ring ohne Abo. 15 Tage Akku, On-Device AI, kein Monatsabo - einmalig kaufen, fertig.",
        metrics:["HRV","Schlafphasen","Körpertemperatur","Stress Score","Glucose-Integration"],
        price:"ab CHF 399",
        shops:[
          {name:"Ultrahuman",link:"https://www.ultrahuman.com/ring-pro/?ref=DEIN_CODE",affiliate:true},
        ],
      },
    ];


    return (
      <div>
        {/* Why you need it */}
        <div style={{background:C.neonDim,border:`1px solid ${C.neon}`,borderRadius:12,padding:"14px 16px",marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:6}}>Warum ein Wearable deine TREYN+ Analyse verbessert</div>
          <div style={{fontSize:11,color:"#4A7000",lineHeight:1.7}}>
            TREYN+ berechnet mit MET-Werten und deinen Angaben. Mit echten Wearable-Daten (HRV, VO₂max, Schlafphasen, Schweissrate) wird die Berechnung noch präziser.
          </div>
          <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
            {["VO₂max (real)","HRV-Trend","Schlafqualität","Schweissrate","Training Load"].map(m=>(
              <span key={m} style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:C.neon,color:C.black,fontWeight:600}}>{m}</span>
            ))}
          </div>
        </div>

        {/* Product cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
        {WEARABLES.map((w,i)=>{
          const wid=`wear_${w.name.replace(/\s/g,"_")}`;
          const on=(()=>{try{return JSON.parse(localStorage.getItem("treyn_owned")||"[]").includes(wid);}catch{return false;}})();
          return (
          <div key={i} style={{background:C.white,border:`1px solid ${i===0?C.neon:C.g200}`,borderRadius:14,overflow:"hidden",display:"flex",flexDirection:"column",minWidth:0}}>
            {/* Header */}
            <div style={{background:i===0?C.neonDim:C.g100,borderBottom:`0.5px solid ${i===0?C.neonBorder:C.g200}`,padding:"8px 14px"}}>
              <div style={{fontSize:10,fontFamily:"Inter,sans-serif",color:i===0?"#4A7000":C.g400,fontWeight:i===0?600:500,overflowWrap:"anywhere"}}>{w.badge}</div>
            </div>
            <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column",gap:8}}>

              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"4px 8px",flexWrap:"wrap"}}>
                <div style={{fontSize:14,fontWeight:700,color:C.black,letterSpacing:"-.02em",lineHeight:1.2,minWidth:0,overflowWrap:"anywhere"}}>{w.name}</div>
                <div style={{fontSize:12,fontWeight:600,color:C.black}}>{w.price}</div>
              </div>
              <div style={{fontSize:11,color:C.g600,lineHeight:1.6}}>{w.why}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {(w.metrics||[]).map(m=>(
                  <span key={m} style={{fontSize:9,padding:"2px 7px",borderRadius:100,background:"#F5F5F5",color:"#555",fontFamily:"Inter,sans-serif",fontWeight:500}}>{m}</span>
                ))}
              </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {(w.shops||[]).map((sh,j)=>(
                <a key={j} href={sh.link} target="_blank" rel="noopener noreferrer"
                  style={{flex:"1 1 auto",minWidth:0,textAlign:"center",padding:"8px 6px",borderRadius:8,background:C.neonDim,color:C.black,border:`1px solid ${C.neonBorder}`,fontSize:11,fontWeight:sh.affiliate?700:400,textDecoration:"none",overflowWrap:"anywhere"}}>
                  {sh.name} ↗
                </a>
              ))}
              <button title={on?"Gemerkt - antippen zum Entfernen":"Merken"} aria-label={on?"Gemerkt":"Merken"} onClick={()=>{
                try{
                  const list=JSON.parse(localStorage.getItem("treyn_owned")||"[]");
                  const next=list.includes(wid)?list.filter(x=>x!==wid):[...list,wid];
                  localStorage.setItem("treyn_owned",JSON.stringify(next));
                  // Force re-render
                  setCartTick(t=>t+1);
                }catch{}
              }} style={{padding:"8px 10px",borderRadius:8,border:`1px solid ${on?"rgba(52,199,89,.4)":C.g200}`,background:on?"rgba(52,199,89,.08)":"transparent",fontSize:10,cursor:"pointer",fontFamily:"Inter,sans-serif",flexShrink:0,color:on?"#1A7A35":C.g500}}>
                {on?"✓":"+"}
              </button>
            </div>
          </div>
        </div>
          );
        })}
        </div>
      </div>
    );
  };

  const HydrationContent=()=>{
    const DURING=[
      {
        name:"MORE Nutrition Sirup",
        badge:"Ohne Zucker · CH-Bestseller",
        affiliate:true,
        why:"Der einfachste Weg mehr zu trinken - über 30 Geschmäcker, 0 Kalorien. Für alle die Wasser öde finden.",
        science:"Süsser Geschmack erhöht die Trinkmotivation nachweislich um 40-60%. Kein Zucker = kein Insulin-Spike.",
        tags:["Täglich","Ohne Zucker"],
        link:AFF.more_sirup(),
        shop:"MORE Nutrition",
        img:"https://www.more-nutrition.de/cdn/shop/products/MORE_Sirup_Mango-Maracuja_500ml.jpg",
      },      {
        name:"Garmin Forerunner 965",
        badge:"GPS · HRV · VO₂max · Top Pick",
        affiliate:true,
        category:"Multisport",
        why:"Das beste Multisport-GPS für Ausdauersportler. Misst VO₂max, HRV, Training Readiness und Körperbatteriestand - alles was TREYN+ für präzisere Berechnungen nutzen kann.",
        metrics:["VO₂max","HRV","Schlaf","Training Load","Erholungsstatus"],
        price:"ab CHF 599",
        shops:[
          {name:"Garmin CH",link:"https://www.garmin.com/de-CH/p/735158",affiliate:true},
        ],
      },
      {
        name:"Garmin Fenix 8",
        badge:"Premium · Outdoor · Multisport",
        affiliate:true,
        category:"Premium GPS",
        why:"Für den Athleten der alles will. Solarladung, Topo-Karten, Tauchen - und alle Gesundheitsmetriken die TREYN+ für optimale Berechnungen braucht.",
        metrics:["VO₂max","HRV","Schlaf","Altitude Training","Körperbatterie"],
        price:"ab CHF 899",
        shops:[
          {name:"Garmin CH",link:"https://www.garmin.com/de-CH/p/994307",affiliate:true},
        ],
      },
      {
        name:"Polar Vantage V3",
        badge:"Polar · Ausdauer · HRV",
        affiliate:true,
        category:"Ausdauer",
        why:"Polars Flaggschiff für Ausdauersportler. Noxim-Technologie misst Sauerstoffsättigung am Handgelenk - einzigartig präzise für Regenerationsberechnungen.",
        metrics:["VO₂max","HRV","Schlaf","Noxim O₂","Running Power"],
        price:"ab CHF 499",
        shops:[
          {name:"Polar CH",link:"https://www.polar.com/de/vantage/v3",affiliate:true},
        ],
      },
      {
        name:"Polar Pacer Pro",
        badge:"Laufen · Leicht · Präzise",
        affiliate:true,
        category:"Running",
        why:"Leichtest mögliche GPS-Uhr für Läufer mit allen wichtigen Metriken. Nur 45g - man vergisst sie beim Training.",
        metrics:["VO₂max","HRV","Laufleistung","Kadenz","Schlaf"],
        price:"ab CHF 299",
        shops:[
          {name:"Polar CH",link:"https://www.polar.com/de/pacer-pro",affiliate:true},
        ],
      },
      {
        name:"Oura Ring 4",
        badge:"Ring · Schlaf · HRV · Marktführer",
        affiliate:true,
        category:"Sleep & Recovery",
        why:"Der Marktführer. Als Ring getragen misst er Schlafphasen, HRV und Körpertemperatur mit Laborqualität - ideal für alle die keine Uhr tragen wollen.",
        metrics:["HRV","Schlafphasen","Körpertemperatur","Readiness Score","Zyklusanalyse"],
        price:"ab CHF 349 + Abo",
        shops:[
          {name:"Oura",link:"https://ouraring.com/de"},
          {name:"Zur Rose",link:"https://www.zurrose-shop.ch/de/oura-ring",affiliate:true},
        ],
      },

      {
        name:"LMNT Elektrolyt-Packets",
        badge:"1000mg Natrium · Kein Zucker",
        affiliate:true,
        why:"Extrem hochdosiert - 3× mehr Natrium als normale Elektrolyte. Ideal für Intensiv-Sportler und Keto-Athleten.",
        science:"Natrium ist der stärkste Hydrations-Trigger. Mehr Natrium = mehr Trinkbereitschaft = bessere Hydration.",
        tags:["Elektrolyte","High Sodium"],
        link:AFF.lmnt(),
        shop:"LMNT",
        img:"https://drinklmnt.com/cdn/shop/files/LMNT-Sparkling_Citrus_Salt_12-Pack.png",
      },
      {
        name:"Sponser Elektrolyt-Tabs",
        badge:"Bewährt · Schweizer Qualität",
        affiliate:false,
        why:"Kompaktes Format - einfach in die Trinkflasche, überall dabei. Schweizer Qualitätsstandard.",
        science:"Elektrolyt-Balance verbessert Flüssigkeitstransport in die Zellen. Ohne Elektrolyte bleibt Wasser im Darm.",
        tags:["Elektrolyte","Kompakt"],
        link:AFF.sponser("elektrolyt tabletten"),
        shop:"Sponser",
        img:null,
      },
      {
        name:"Kokoswasser",
        badge:"Natürlich · Isotonisch",
        affiliate:false,
        why:"Natürlich isotonisch mit Kalium, Magnesium und Natrium. Idealer Ersatz für Sportgetränke - ohne Zucker-Overhead.",
        science:"Ähnliche Elektrolyt-Zusammensetzung wie menschliches Blutplasma. Studien zeigen gleiche Rehydrations-Wirkung wie kommerzielle Sportdrinks.",
        tags:["Natürlich","Kalium"],
        link:AFF.iherb("vita coco coconut water"),
        shop:"iHerb",
        img:null,
      },
    ];
    const AFTER=[
      {
        name:"Erdinger Alkoholfrei",
        badge:"Isotonisch · Polyphenole · Bestseller",
        affiliate:false,
        why:"Das bekannteste Recovery-Getränk der Sportwelt. Schmeckt nach Bier, enthält aber alles was dein Körper nach dem Training braucht.",
        science:"FC Bayern München Studie: Sportler die Erdinger AF tranken hatten 3× weniger Infekte in der Saison. Isotonisch, B-Vitamine, Polyphenole, 0% Alkohol.",
        tags:["Recovery","Isotonisch","Polyphenole"],
        link:AFF.erdinger(),
        shop:"Erdinger",
        img:"https://www.erdinger.de/typo3temp/assets/_processed_/1/6/csm_ERDINGER_Weissbier_alkoholfrei_Flasche_2020_RGB_300dpi_3db53a2b78.jpg",
        highlight:true,
      },
      {
        name:"Athletic Brewing Co.",
        badge:"Craft Bier · 0% Alkohol",
        affiliate:true,
        why:"Das beste alkoholfreie Bier das je gemacht wurde - für alle die nach einem harten Training das Bier-Feeling wollen ohne Alkohol.",
        science:"0% Alkohol eliminiert den wichtigsten Recovery-Killer. Alkohol hemmt Proteinsynthese, Testosteron und Schlafqualität - Athletic Brewing gibt dir das Ritual ohne die Kosten.",
        tags:["0% Alkohol","Craft","Recovery"],
        link:AFF.athletic(),
        shop:"Athletic Brewing",
        img:null,
      },
      {
        name:"Schokoladenmilch",
        badge:"Klassiker der Sportwissenschaft",
        affiliate:false,
        why:"Klingt banal - ist aber ernsthaft eines der meistgetesteten Recovery-Getränke der Sportwissenschaft. Günstig, zugänglich, effektiv.",
        science:"Ideales 1:4 Protein-zu-Carb-Verhältnis für Muskelreparatur und Glykogen-Wiederauffüllung. Studien zeigen: gleich effektiv wie kommerzielle Recovery-Drinks.",
        tags:["Protein","Carbs","Günstig"],
        link:"https://www.migros.ch",
        shop:"Migros / Coop",
        img:null,
      },
      {
        name:"Kefir",
        badge:"Probiotika · Protein · Unterschätzt",
        affiliate:false,
        why:"Für Sportler die ihren Darm ernst nehmen. Kefir enthält mehr Probiotika als Joghurt und liefert gleichzeitig Protein und Elektrolyte.",
        science:"Intensive Trainingsbelastung erhöht Darmpermeabilität ('Leaky Gut'). Probiotika reduzieren Inflammation und verbessern Nährstoffaufnahme - direkt relevant für Recovery.",
        tags:["Probiotika","Darm","Protein"],
        link:"https://www.migros.ch",
        shop:"Migros / Coop",
        img:null,
      },
    ];

    const ProductCard=({p})=>(
      <div style={{background:C.white,border:`1px solid ${p.highlight?C.neon:C.g200}`,borderRadius:12,padding:"14px 16px",marginBottom:8,position:"relative"}}>
        {p.affiliate&&(
          <div style={{position:"absolute",top:12,right:12,fontSize:9,padding:"2px 7px",borderRadius:4,background:C.neon,color:C.black,fontFamily:"Inter,sans-serif",fontWeight:600}}>Top Pick</div>
        )}
        {p.highlight&&(
          <div style={{marginBottom:8,display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",background:C.neon,borderRadius:100}}>
            <span style={{fontSize:10,fontWeight:600,color:C.black}}>Wissenschaftlich belegt</span>
          </div>
        )}
        <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:2,paddingRight:p.affiliate?60:0}}>{p.name}</div>
        <div style={{fontSize:10,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:8}}>{p.badge}</div>
        <div style={{fontSize:11,color:C.g600,lineHeight:1.6,marginBottom:8}}>{p.why}</div>
        <div style={{padding:"8px 12px",background:C.g100,borderRadius:8,marginBottom:10}}>
          <div style={{fontSize:10,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:3}}>{"Wissenschaft"}</div>
          <div style={{fontSize:11,color:C.g600,lineHeight:1.5}}>{p.science}</div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
          {(p.tags||[]).map(t=><span key={t} style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:C.g100,color:C.g600}}>{t}</span>)}
        </div>
        <a href={p.link} target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:p.affiliate?C.neon:C.g100,color:C.black,padding:"9px 14px",borderRadius:9,fontSize:11,fontWeight:600,textDecoration:"none"}}>
          <span>{p.shop} →</span>
        </a>
      </div>
    );

    return (
      <div>
        <div style={{fontSize:12,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:10}}>{"Hydration während dem Tag"}</div>
        <div style={{fontSize:12,color:C.g600,marginBottom:14,lineHeight:1.6}}>{"Wasser ist öde? Diese Produkte machen Trinken zum Erlebnis."}</div>
        {DURING.map((p,i)=><ProductCard key={i} p={p}/>)}

        <div style={{fontSize:12,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:10,marginTop:20}}>{"Nach dem Training"}</div>
        <div style={{fontSize:12,color:C.g600,marginBottom:14,lineHeight:1.6}}>{"Recovery-Drinks die wirklich funktionieren."}</div>
        {AFTER.map((p,i)=><ProductCard key={i} p={p}/>)}


      </div>
    );
  };

  const FertiggerichteContent=()=>(
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
      {[
        {name:"Löwenanteil",badge:"Bio · High Protein · Top Pick",desc:"Bio-Fertiggerichte im Glas - 30-42g Protein, 1 Jahr ungekühlt haltbar. Ideal für Sportler.",products:[{l:"Protein",v:"30-42g"},{l:"Zubereitung",v:"3 Min."},{l:"Preis",v:"ab CHF 7.90"}],link:"https://www.loewenanteil.com?ref=TREYN",img:"https://www.loewenanteil.com/cdn/shop/files/LÖW_Produktfoto_Rindfleisch-Eintopf.jpg"},
        {name:"HelloFresh",badge:"Meal Kit · Flexible Lieferung",desc:"Wochentliche Meal Kits mit ausgewogenen Mahlzeiten - einfach zu kochen, sportlergerecht.",products:[{l:"Kalorien",v:"500-800 kcal"},{l:"Protein",v:"25-40g"},{l:"Preis",v:"ab CHF 8.90"}],link:"https://www.hellofresh.ch",img:"https://img.hellofresh.com/hellofresh_s3/image/5f7c6b2f3e36d0000c4e4b1a.jpg"},
      ].map((b,i)=>(
        <div key={i} style={{borderRadius:12,border:`1px solid ${C.g200}`,background:C.white,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{background:C.g100,height:120,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            <img src={b.img} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
          </div>
          <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:2}}>{b.name}</div>
            <div style={{fontSize:10,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:6}}>{b.badge}</div>
            <div style={{fontSize:11,color:C.g600,lineHeight:1.5,marginBottom:10,flex:1}}>{b.desc}</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
              {b.products.map(p=><div key={p.l} style={{display:"flex",justifyContent:"space-between",background:C.g100,borderRadius:7,padding:"4px 8px"}}><span style={{fontSize:10,color:C.g600}}>{p.l}</span><span style={{fontSize:10,fontWeight:600,color:C.black}}>{p.v}</span></div>)}
            </div>
            <a href={b.link} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:C.neon,color:C.black,padding:"8px",borderRadius:8,fontSize:10,fontWeight:700,textDecoration:"none"}}>Entdecken ↗</a>
          </div>
        </div>
      ))}
    </div>
  );

  const RecoveryContent=()=>(
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
      {[
        {name:"Therabody",badge:"Massage Guns · Boots",desc:"Weltmarktführer in Perkussionstherapie. Genutzt von Profiteams in NBA, NFL und Tour de France.",products:[{n:"Theragun PRO Plus",p:"CHF 599"},{n:"Theragun Mini",p:"CHF 199"},{n:"JetBoots PRO",p:"CHF 1'149"}],link:AFF.therabody(profilData?.country||"Schweiz"),img:"https://cdn.shopify.com/s/files/1/0624/4657/products/TBY-PRO5-BLK_1.png"},
        {name:"Hyperice",badge:"Kompression · Massage",desc:"Gold Standard für Kompressionsboots - Ironman, NBA und Tour de France. Hypervolt als günstige Alternative.",products:[{n:"Hypervolt 2",p:"CHF 229"},{n:"Normatec 3 Legs",p:"CHF 899"},{n:"Normatec Elite",p:"CHF 1'099"}],link:AFF.hyperice(),img:"https://hyperice.com/cdn/shop/products/Normatec3Leg_Lifestyle_ProductPage_1.jpg"},
        {name:"Blackroll",badge:"Faszienrollen · Selbstmassage",desc:"Schweizer Marktführer für Faszientherapie. Einsteigerfreundlich - ideal für tägliche Selbstmassage.",products:[{n:"Standard Rolle",p:"CHF 35"},{n:"Massage Gun",p:"CHF 149"},{n:"Ball",p:"CHF 15"}],link:AFF.blackroll(profilData?.country||"Schweiz"),img:"https://www.blackroll.com/cdn/shop/products/blackroll-standard-rolle-schwarz_1.jpg"},
        {name:"Compex",badge:"EMS Muskelstimulation",desc:"Pionier in Elektrostimulation - genutzt von Physios und Profiathleten. Aktive Recovery und Muskelaufbau.",products:[{n:"Edge 3.0",p:"CHF 199"},{n:"Performance 3.0",p:"CHF 249"},{n:"Sport Elite 3.0",p:"CHF 349"}],link:AFF.compex(profilData?.country||"Schweiz"),img:"https://www.compex.com/medias/sys_master/root/h2e/hef/8796266717214/compex-sp-8-0-wireless.jpg"},
      ].map((b,i)=>(
        <div key={i} style={{borderRadius:12,border:`1px solid ${C.g200}`,background:C.white,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{background:C.g100,height:120,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            <img src={b.img} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
          </div>
          <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:2}}>{b.name}</div>
            <div style={{fontSize:10,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:6}}>{b.badge}</div>
            <div style={{fontSize:11,color:C.g600,lineHeight:1.5,marginBottom:10,flex:1}}>{b.desc}</div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:10}}>
              {b.products.map(p=><div key={p.n} style={{display:"flex",justifyContent:"space-between",background:C.g100,borderRadius:7,padding:"4px 8px"}}><span style={{fontSize:10,color:C.g600}}>{p.n}</span><span style={{fontSize:10,fontWeight:600,color:C.black}}>{p.p}</span></div>)}
            </div>
            <a href={b.link} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:C.neon,color:C.black,padding:"8px",borderRadius:8,fontSize:10,fontWeight:700,textDecoration:"none"}}>Entdecken ↗</a>
          </div>
        </div>
      ))}
    </div>
  );

  // ── TAGESPLAN TAB ──────────────────────────────────────────────────────────

  // ── TAGESPLAN WRAPPER (inline nav for Tagesplan / Protokolle / Wettkampf) ──
  const TagesplanWrapper=({trainingData})=>{
    // Unter-Reiter merkt sich die Auswahl in UI_STATE (überlebt Handy drehen / Neuzeichnen von Results)
    const [activeSectionRaw,setActiveSectionRaw]=useState(()=>UI_STATE.activeSection||"plan");
    const setActiveSection=v=>{UI_STATE.activeSection=v;setActiveSectionRaw(v);};
    const hasComp=Object.values(trainingData||{}).some(d=>d?.hasCompetition);
    const sections=[
      {id:"plan",      l:"Tagesplan"},
      {id:"protokoll", l:"Protokolle"},
      ...(hasComp?[{id:"wettkampf", l:"Wettkampf"}]:[]),
    ];
    const activeSection=sections.some(s=>s.id===activeSectionRaw)?activeSectionRaw:"plan";
    return (
      <div>
        <div style={{marginBottom:20}}>
          <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Tagesplan</h2>
          <p style={{fontSize:13,color:C.g600,marginBottom:14,lineHeight:1.6}}>Tagesplan, Supplement-Timing{hasComp?" & Race-Day Strategie":""}</p>
          {/* Inline section nav */}
          <div style={{display:"flex",gap:6,borderBottom:`1px solid ${C.g200}`,paddingBottom:0,overflowX:"auto"}}>
            {sections.map(s=>(
              <button key={s.id} onClick={()=>{setActiveSection(s.id);window.scrollTo({top:0,behavior:"instant"});}}
                style={{padding:"8px 14px",border:"none",borderBottom:`2px solid ${activeSection===s.id?C.black:"transparent"}`,background:"transparent",color:activeSection===s.id?C.black:C.g400,fontSize:13,fontWeight:activeSection===s.id?700:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s",marginBottom:-1,whiteSpace:"nowrap",flexShrink:0}}>
                {s.l}
              </button>
            ))}
          </div>
        </div>
        {activeSection==="plan"&&<TagesplanTab/>}
        {activeSection==="protokoll"&&<ProtokollTab/>}
        {activeSection==="wettkampf"&&hasComp&&(
          <div>
            <p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.6}}>Race-Day Strategie - personalisiert auf dein Gewicht, deine Sportart und Intensität.</p>
            <WettkampfTab/>
          </div>
        )}
      </div>
    );
  };

  // ── Gemeinsame Helfer für Tagesplan und Wettkampf ──
  // Werte für genau EINE Sportart (Umschalter im Tagesplan, Wettkampf-Sportart)
  const sportCalc=(sid)=>{
    const td=sid?(trainingData||{})[sid]:null;
    const calc=td?calcPro(profilData,{[sid]:td},{...(sportData||{}),primarySport:sid}):calcPro(profilData,trainingData,sportData);
    const intens=td?.intensity||"medium";
    const sweatMult={low:0.6,medium:1.0,high:1.4,very_high:1.8}[td?.sweatRate||"medium"]||1.0;
    const rateLh=Math.max(0.3,(+(calc?.sweatRateLh??((SWEAT_RATE[intens]||0.9)*sweatMult)))||0.9);
    const naH=Math.round((+calc?.natriumPerHourMg)||rateLh*(SODIUM_PER_L[sid]||900));
    const durMin=(+td?.duration)||60;
    return {calc,td,intens,rateLh,naH,durMin};
  };
  // Trinkmenge pro Stunde: ca. 60-80% des Schweissverlusts, max. 1L/h
  const fluidRange=(rateLh)=>{
    const r50=v=>Math.round(v/50)*50;
    const lo=Math.max(200,r50(Math.min(900,rateLh*600)));
    const hi=Math.max(lo+100,r50(Math.min(1000,rateLh*800)));
    return [lo,hi];
  };

  const TagesplanTab=()=>{
    const isMobile=useWindowWidth()<=768;
    const allSports=(sports||[]);
    // Auswahl in UI_STATE merken (überlebt Handy drehen)
    const [sportSel,setSportSel]=useState(()=>UI_STATE.tagesplanSport||primarySport||allSports[0]);
    const [isRestDay,setIsRestDayRaw]=useState(()=>!!UI_STATE.tagesplanRest);
    const setActiveSport=s=>{UI_STATE.tagesplanSport=s;setSportSel(s);};
    const setIsRestDay=v=>{UI_STATE.tagesplanRest=v;setIsRestDayRaw(v);};
    const activeSport=allSports.includes(sportSel)?sportSel:(primarySport||allSports[0]);
    // calcAll: ganze Woche (Tages-Supplements, Ruhetag) · calc: nur die gewählte Sportart (Trainingstag)
    const calcAll=calcPro(profilData,trainingData,sportData);
    const {calc,td:activeTD,rateLh}=sportCalc(activeSport);
    const w=+profilData?.weight||75;
    const activeDuration=(+activeTD?.duration)||60;
    const activeIntensity=activeTD?.intensity||"medium";
    const isEndurance=["cycling","running","triathlon","swimming","langlauf"].some(x=>activeSport?.includes(x));
    const sportLabel=SPORT_GROUPS.find(s=>s.id===activeSport)?.label||activeSport||"Sport";

    // Trainingszeit der gewählten Sportart (früheste angegebene Zeit)
    const T_ORDER=["morning","midday","afternoon","evening"];
    const tTimes=[...(activeTD?.trainingTimes||[])].filter(x=>T_ORDER.includes(x)).sort((a,b)=>T_ORDER.indexOf(a)-T_ORDER.indexOf(b));
    const ptt=tTimes[0]||activeTD?.trainingTime||calc?.primaryTrainingTime;
    const T_START={morning:7*60,midday:12*60,afternoon:16*60,evening:19*60};
    const knownTime=T_START[ptt]!=null;
    const TIME_LABEL={morning:"Morgentraining",midday:"Mittagstraining",afternoon:"Nachmittagstraining",evening:"Abendtraining"}[ptt]||"Training";

    // Zeitachse: Uhrzeiten in Minuten, alles zweistellig
    const hm=m=>{const x=((Math.round(m)%1440)+1440)%1440;return `${String(Math.floor(x/60)).padStart(2,"0")}:${String(x%60).padStart(2,"0")}`;};
    const span=(a,b)=>`${hm(a)}-${hm(b)}`;
    const ts=knownTime?T_START[ptt]:17*60;
    const te=ts+Math.max(15,Math.min(activeDuration,360));
    const isMorning=ts<9*60;
    const wake=isMorning?ts-60:6*60+30;
    const preStart=isMorning?ts-45:ts-120;
    const postEnd=te+60;
    const overlapsTraining=(a,b)=>a<postEnd&&b>preStart;

    // Tages-Supplements (gleich für alle Trainingstage)
    const vitDDose=+(calcAll?.vitDDose??0)||0;
    const vitDItem=vitDDose>0?{label:"Vitamin D3 + K2",detail:`${vitDDose} IE zum ersten Essen - fettlöslich, braucht Mahlzeit`}:null;
    const omegaItem=calcAll?.suppressOmega3?null:{label:"Omega-3",detail:`2-3g EPA/DHA zu einer Mahlzeit${calcAll?.MEDI_WARNINGS?.omega3?` · ${calcAll.MEDI_WARNINGS.omega3}`:""}`};
    const kreatinItem=calcAll?.suppressKreatin?null:{label:"Kreatin",detail:"5g täglich - nach dem Training zusammen mit Kohlenhydraten"};
    const ashwaItem=(calcAll?.stressAshwaNeeded||calcAll?.recoveryAshwaNeeded)?{label:"Ashwagandha KSM-66",detail:`600mg abends - Cortisol senken, Schlaf verbessern${calcAll?.MEDI_WARNINGS?.ashwa?` · ${calcAll.MEDI_WARNINGS.ashwa}`:""}`}:null;
    const sleepH=+(calcAll?.sleepHours??calcAll?.sleep??7)||7;

    // Koffein: nicht bei "kein Koffein", Arzt-Hinweis bei Blutdruck-Medikament, nicht nach 16 Uhr
    const cafNone=calcAll?.caffeineNone??(profilData?.caffeineDaily==="none");
    const cafBlutdruck=calcAll?.hasBlutdruck??(profilData?.medications||[]).includes("blutdruck");
    const cafDose=(+calcAll?.caffeinePreWorkoutDose)||150;
    const cafItem=cafNone?null
      :cafBlutdruck?{label:"Koffein",detail:"Blutdruckmedikamente: Koffein kann den Blutdruck erhöhen - nur nach Rücksprache mit deinem Arzt"}
      :(ts-45)>=16*60?{label:"Kein Koffein",detail:"Koffein nach 16 Uhr stört deinen Schlaf - bei diesem Training weglassen"}
      :calcAll?.suppressKoffein?null
      :calcAll?.caffeineSensitive?{label:"Koffein",detail:"Bei dir lieber weglassen oder nur wenig - zuerst im Training testen"}
      :{label:`Koffein ${cafDose}mg`,detail:"45 min vor Training - Leistung +3-5%"};

    // Mahlzeiten: kollidiert eine mit dem Training, wird sie mit dem Post-Workout zusammengelegt
    const pMin=calc?.proteinMin||140, pMax=calc?.proteinMax||180;
    const kcalDay=calc?.withTraining||2500;
    const MEALS=[
      {key:"breakfast",phase:"Frühstück",meal:"Frühstück",s:wake+30,e:wake+75,share:0.20,
        detail:k=>`${k} kcal, ${Math.round(pMin*0.25)}g Protein - z. B. Haferflocken, Eier, Skyr`},
      {key:"lunch",phase:"Mittag",meal:"Mittagessen",item:"Hauptmahlzeit",s:12*60,e:13*60,share:0.30,
        detail:k=>`${k} kcal, ${Math.round(pMin*0.3)}g Protein`},
      {key:"dinner",phase:"Abend",meal:"Abendessen",item:"Abendmahlzeit",s:18*60+30,e:19*60+30,share:0.30,
        detail:k=>`${k} kcal, proteinreich`},
    ];
    let merged=null;
    let lastMealEnd=0;
    const mealBlocks=[];
    MEALS.forEach(m0=>{
      const m={...m0};
      const collides=overlapsTraining(m.s,m.e)||(isMorning&&m.key==="breakfast");
      if(collides&&!merged){merged=m;return;}
      if(collides){const len=m.e-m.s;m.s=postEnd+90;m.e=m.s+len;}
      lastMealEnd=Math.max(lastMealEnd,m.e);
      const kc=Math.round(kcalDay*m.share);
      mealBlocks.push({s:m.s,time:span(m.s,m.e),phase:m.phase,items:[
        {label:m.item||m.meal,detail:m.detail(kc)},
        ...(m.key==="breakfast"?[vitDItem,omegaItem]:[]),
      ].filter(Boolean)});
    });

    // Schlafenszeit: frühestens 22:00, sonst nach Post-Workout bzw. letzter Mahlzeit
    const bed=Math.max(22*60,postEnd+60,lastMealEnd+90);

    const preItems=[
      {label:"Mahlzeit / Snack",detail:isMorning?`${Math.round(w*0.5)}g Kohlenhydrate, 30-45 min vor Training - leicht verdaulich, z. B. Banane`:`${Math.round((calc?.carbsG||240)*0.25)}g Kohlenhydrate, 1.5-2h vor Training`},
      cafItem,
      {label:"Wasser",detail:"400-600ml in der Stunde vor dem Training"},
      ...(calcAll?.needsCollagen?[{label:"Kollagen + Vit C",detail:"10-15g, 30-60 min vor dem Training - Sehnen & Gelenke"}]:[]),
    ].filter(Boolean);
    const [flLo,flHi]=fluidRange(rateLh);
    const postItems=merged?[
      {label:merged.item||merged.meal,detail:`${Math.round(kcalDay*merged.share)} kcal innerhalb 30-60 min nach dem Training - mit Kohlenhydraten für die Glykogen-Wiederauffüllung`},
      {label:"Protein",detail:`${Math.round(pMin*0.25)}-${Math.round(pMax*0.25)}g mit dieser Mahlzeit - anaboles Fenster`},
      ...(merged.key==="breakfast"?[vitDItem,omegaItem]:[]),
      kreatinItem,
    ]:[
      {label:"Protein",detail:`${Math.round(pMin*0.25)}-${Math.round(pMax*0.25)}g innerhalb 30 min - anaboles Fenster`},
      {label:"Kohlenhydrate",detail:"30-50g für Glykogen-Wiederauffüllung"},
      kreatinItem,
    ];

    const PLAN=[
      {s:wake,time:hm(wake),phase:"Aufwachen",items:[
        {label:"Wasser",detail:"500ml direkt nach dem Aufstehen - Rehydration nach 7-8h Schlaf"},
      ]},
      ...mealBlocks,
      {s:preStart,time:span(preStart,ts),phase:"Pre-Workout",items:preItems},
      {s:ts,time:span(ts,te),phase:"Training",hl:true,items:[
        {label:"Wasser + Elektrolyte",detail:`${flLo}-${flHi}ml/h - dein Schweissverlust liegt bei ca. ${rateLh.toFixed(1)}L/h`},
        ...(isEndurance&&activeDuration>60?[{label:"Kohlenhydrate",detail:`${calc?.carbsPerHour||45}g/h ab Minute 30 - Gels oder Drink Mix`}]:[]),
      ]},
      {s:te,time:span(te,postEnd),phase:merged?`Post-Workout & ${merged.meal}`:"Post-Workout",items:postItems.filter(Boolean)},
      {s:bed-60,time:span(bed-60,bed),phase:"Vor dem Schlafen",items:[
        {label:"Magnesium Bisglycinate",detail:`${calcAll?.magnesiumMg||350}mg - 1h vor Schlaf für beste Schlafwirkung`},
        ashwaItem,
        {label:"Ziel: 7-9h Schlaf",detail:"Unter 7h = Cortisol hoch, Muskelabbau, schlechtere Regeneration"},
        ...(sleepH<7?[{label:"Schlafdefizit erkannt",warn:true,detail:`Aktuell ${sleepH}h - das ist dein wichtigster Performance-Hebel`}]:[]),
      ].filter(Boolean)},
    ].sort((a,b)=>a.s-b.s);

    return (
      <div>
        {/* Sport + Ruhetag Switcher */}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {allSports.map(s=>{
              const label=SPORT_GROUPS.find(g=>g.id===s)?.label||s;
              const active=activeSport===s&&!isRestDay;
              return (
                <button key={s} onClick={()=>{setActiveSport(s);setIsRestDay(false);}}
                  style={{padding:"6px 14px",borderRadius:100,border:`1.5px solid ${active?C.black:C.g200}`,background:active?C.neon:C.white,color:C.black,fontSize:12,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s"}}>
                  {label}
                </button>
              );
            })}
            <button onClick={()=>setIsRestDay(true)}
              style={{padding:"6px 14px",borderRadius:100,border:`1.5px solid ${isRestDay?C.black:C.g200}`,background:isRestDay?"#F0F0F0":C.white,color:C.black,fontSize:12,fontWeight:isRestDay?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s"}}>
              Ruhetag
            </button>
          </div>
          <div style={{fontSize:12,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:4,overflowWrap:"anywhere"}}>
            {isRestDay?"Ruhetag · Regeneration & Ernährung":`Tagesplan · ${sportLabel} · ${activeIntensity==="high"||activeIntensity==="competition"?"Intensiv":activeIntensity==="low"?"Leicht":"Mittel"} · ${activeDuration}min`}
          </div>
          <div style={{fontSize:12,color:C.g600,lineHeight:1.6}}>{isRestDay?"Weniger Kalorien, mehr Regeneration - kein Training heute.":knownTime?`Personalisiert auf ${w}kg, ${TIME_LABEL}.`:`Personalisiert auf ${w}kg. Keine feste Trainingszeit angegeben - Beispiel mit Training um 17:00.`}</div>
        </div>

        {/* Ruhetag Plan */}
        {isRestDay&&(
          <div style={{marginBottom:16}}>
            {[
              {time:"06:00-08:00",phase:"Aufwachen & Frühstück",items:[
                {label:"Wasser",detail:"500ml direkt - Rehydration"},
                {label:"Protein-Frühstück",detail:`${Math.round((calcAll?.proteinMin||140)*0.25)}g Protein - Eier, Quark, Skyr`},
                ...(vitDItem?[vitDItem]:[]),
              ]},
              {time:"12:00-13:00",phase:"Mittag - leichter",items:[
                {label:"Leichtere Mahlzeit",detail:`${Math.round((calcAll?.restDay||1800)*0.35)} kcal - weniger Carbs als Trainingstag`},
                ...(calcAll?.suppressKreatin?[]:[{label:"Kreatin",detail:"5g täglich - auch an Ruhetagen"}]),
                ...(calcAll?.suppressOmega3?[]:[{label:"Omega-3",detail:`2-3g EPA/DHA${calcAll?.MEDI_WARNINGS?.omega3?` · ${calcAll.MEDI_WARNINGS.omega3}`:""}`}]),
              ]},
              {time:"15:00-17:00",phase:"Aktive Erholung",items:[
                {label:"Spaziergang 20-30 min",detail:"Fördert Durchblutung und Regeneration ohne Belastung"},
                {label:"Dehnen / Mobility",detail:"10-15 min - Schwerpunkt auf beanspruchte Muskelgruppen"},
              ]},
              {time:"18:00-19:00",phase:"Abendessen",items:[
                {label:"Hauptmahlzeit",detail:`${Math.round((calcAll?.restDay||1800)*0.35)} kcal, proteinreich`},
                {label:"Magnesium",detail:`${calcAll?.magnesiumMg||350}mg - Ruhetag ideal für Supplementierung`},
                ...((calcAll?.stressAshwaNeeded||calcAll?.recoveryAshwaNeeded)?[{label:"Ashwagandha",detail:`600mg - Cortisol abbauen${calcAll?.MEDI_WARNINGS?.ashwa?` · ${calcAll.MEDI_WARNINGS.ashwa}`:""}`}]:[]),
              ]},
              {time:"22:00",phase:"Schlaf - Priorität",items:[
                {label:"Mindestens 8-9h anstreben",detail:"Regeneration findet im Schlaf statt - Ruhetag = optimale Recovery-Chance"},
                {label:"Casein optional",detail:"30g vor dem Schlafen - langsame Proteinfreisetzung über Nacht"},
              ]},
            ].map((block,i,arr)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:14}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:44,flexShrink:0}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:C.g200,flexShrink:0,marginTop:4}}/>
                  {i<arr.length-1&&<div style={{width:1,flex:1,background:C.g100,margin:"4px 0"}}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",columnGap:8,rowGap:2,marginBottom:6}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.black}}>{block.phase}</div>
                    <div style={{fontSize:10,color:C.g400,fontFamily:"Inter,sans-serif"}}>{block.time}</div>
                  </div>
                  <div style={{background:C.white,border:`0.5px solid ${C.g200}`,borderRadius:10,padding:"10px 12px",display:"flex",flexDirection:"column",gap:8}}>
                    {(block.items||[]).map((item,j)=>(
                      <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                        <div style={{minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:C.black}}>{item.label}</div>
                          <div style={{fontSize:11,color:C.g500,lineHeight:1.5,marginTop:1}}>{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Ruhetag Kalorienziel */}
            <div style={{background:C.g100,border:`0.5px solid ${C.g200}`,borderRadius:12,padding:"12px 16px",marginTop:4}}>
              <div style={{fontSize:12,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:8}}>Ruhetag-Ziele</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8,textAlign:"center"}}>
                {[
                  {l:"Kalorien",v:`${calcAll?.restDay?.toLocaleString("de-CH")||"-"} kcal`,s:`~${Math.round((calcAll?.withTraining||2500)-(calcAll?.restDay||1800))} kcal unter Trainingstag`},
                  {l:"Protein",v:`${Math.round((calcAll?.proteinMin||140)*0.85)}-${Math.round((calcAll?.proteinMax||180)*0.85)}g`,s:"leicht reduziert"},
                  {l:"Wasser",v:`${(Math.max(Math.round(w*35),(+calcAll?.waterRestMl)||0)/1000).toFixed(1)}L`,s:"ohne Schweissverlust"},
                ].map(({l,v,s},i)=>(
                  <div key={i} style={{minWidth:0,overflowWrap:"anywhere"}}>
                    <div style={{fontSize:10,color:C.g400,marginBottom:2}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:600,color:C.black}}>{v}</div>
                    <div style={{fontSize:9,color:C.g300}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trainingstag Timeline */}
        {!isRestDay&&(
        <div style={{position:"relative"}}>
          {PLAN.map((block,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:16}}>
              {/* Timeline line */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:44,flexShrink:0}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:block.hl?C.neon:C.g200,flexShrink:0,marginTop:4}}/>
                {i<PLAN.length-1&&<div style={{width:1,flex:1,background:C.g100,margin:"4px 0"}}/>}
              </div>
              {/* Content */}
              <div style={{flex:1,minWidth:0,paddingBottom:i<PLAN.length-1?8:0}}>
                <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",columnGap:8,rowGap:2,marginBottom:6}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.black}}>{block.phase}</div>
                  <div style={{fontSize:10,color:C.g400,fontFamily:"Inter,sans-serif"}}>{block.time}</div>
                </div>
                <div style={{background:block.hl?C.neonDim:C.white,border:`0.5px solid ${block.hl?C.neon:C.g200}`,borderRadius:10,padding:"10px 12px",display:"flex",flexDirection:"column",gap:8}}>
                  {(block.items||[]).map((item,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:600,color:item.warn?"#8A5700":C.black}}>{item.label}</div>
                        <div style={{fontSize:11,color:C.g500,lineHeight:1.5,marginTop:1}}>{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Daily summary - only on training day */}
        {!isRestDay&&<div style={{background:C.g100,border:`0.5px solid ${C.g200}`,borderRadius:12,padding:"14px 16px",marginTop:8}}>
          <div style={{fontSize:12,color:C.g400,fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:10}}>Tagesziele</div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(4,minmax(0,1fr))",gap:8}}>
            {[
              {l:"Kalorien",v:`${(calc?.withTraining||2500).toLocaleString("de-CH")} kcal`},
              {l:"Protein",v:`${calc?.proteinMin||140}-${calc?.proteinMax||180}g`},
              {l:"Wasser",v:`${((calc?.waterMl||2500)/1000).toFixed(1)}L`},
              {l:"Schlaf",v:"7-9h"},
            ].map(s=>(
              <div key={s.l} style={{textAlign:"center",minWidth:0,overflowWrap:"anywhere"}}>
                <div style={{fontSize:15,fontWeight:700,color:C.black,letterSpacing:"-.02em"}}>{s.v}</div>
                <div style={{fontSize:10,color:C.g400,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    );
  };

  // ── PROTOKOLLE TAB ─────────────────────────────────────────────────────────
  const ProtokollTab=()=>{
    const isMobile=useWindowWidth()<=768;
    const [open,setOpen]=useState(null);
    const allSupps=[...primSupps,...secSupps].filter(s=>s.protocol);

    if(!allSupps.length) return (
      <div style={{padding:24,textAlign:"center",color:C.g400,fontSize:13}}>Keine Supplement-Protokolle für dein Profil verfügbar.</div>
    );

    return (
      <div>
        <div style={{fontSize:12,color:C.g600,marginBottom:16,lineHeight:1.65}}>Einnahme-Protokolle für jedes deiner Supplements - Dauer, Pausen und wichtige Hinweise.</div>
        {allSupps.map((s,i)=>{
          const p=s.protocol;
          const isOpen=open===i;
          return (
            <div key={i} style={{border:`0.5px solid ${C.g200}`,borderRadius:12,marginBottom:8,overflow:"hidden"}}>
              <div onClick={()=>setOpen(isOpen?null:i)}
                style={{padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",background:isOpen?C.neonDim:C.white}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:C.black}}>{s.name}</div>
                  <div style={{fontSize:11,color:C.g400,marginTop:2}}>{s.dose} · {p?.timing||"Täglich"}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round" style={{transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}><path d="M6 9l6 6 6-6"/></svg>
              </div>
              {isOpen&&(
                <div style={{padding:"12px 16px",background:C.white,borderTop:`0.5px solid ${C.g200}`}}>
                  <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:8,marginBottom:12}}>
                    {[
                      {l:"Einnahme-Timing",v:p.timing},
                      {l:"Dauer",v:p.dauer},
                      ...(p.pause&&p.pause!=="Keine"?[{l:"Pause",v:p.pause}]:[]),
                    ].map(r=>(
                      <div key={r.l} style={{background:C.g100,borderRadius:8,padding:"9px 12px",minWidth:0,overflowWrap:"anywhere"}}>
                        <div style={{fontSize:10,color:C.g400,marginBottom:3}}>{r.l}</div>
                        <div style={{fontSize:12,fontWeight:500,color:C.black,lineHeight:1.4}}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  {p.hinweis&&(
                    <div style={{padding:"10px 12px",background:"#FFFBF0",border:"0.5px solid #FFE082",borderRadius:8}}>
                      <div style={{fontSize:10,color:"#856404",fontFamily:"Inter,sans-serif",fontWeight:500,marginBottom:4}}>{"Wichtiger Hinweis"}</div>
                      <div style={{fontSize:11,color:"#7D5A00",lineHeight:1.65}}>{p.hinweis}</div>
                    </div>
                  )}
                  {s.link&&(
                    <a href={s.link} target="_blank" rel="noopener noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:10,background:C.neon,color:C.black,padding:"7px 14px",borderRadius:8,fontSize:11,fontWeight:600,textDecoration:"none"}}>
                      {s.shop||"Kaufen"} →
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── WETTKAMPF TAB ──────────────────────────────────────────────────────────
  const WettkampfTab=()=>{
    const isMobile=useWindowWidth()<=768;
    // Wettkampf-Sportart = Sportart mit hasCompetition (Hauptsportart zuerst)
    const compSports=Object.keys(trainingData||{}).filter(id=>trainingData?.[id]?.hasCompetition).sort((a,b)=>(b===primarySport)-(a===primarySport));
    const [compSel,setCompSel]=useState(()=>UI_STATE.wettkampfSport||compSports[0]);
    const compSport=compSports.includes(compSel)?compSel:compSports[0];
    const setCompSport=s=>{UI_STATE.wettkampfSport=s;setCompSel(s);};
    const hasComp=compSports.length>0;
    // calcAll: Tagesdosen (Magnesium, Koffein-Profil) · calc: nur die Wettkampf-Sportart
    const calcAll=calcPro(profilData,trainingData,sportData);
    const {calc,rateLh,naH,durMin}=sportCalc(compSport);
    const compLabel=SPORT_GROUPS.find(s=>s.id===compSport)?.label||compSport||"Sport";
    const isEndurance=["cycling","running","triathlon","swimming","langlauf"].some(x=>compSport?.includes(x));
    const w=+profilData?.weight||75;
    // Carb-Loading immer im Bereich 8-12 g/kg
    const carbLoad=Math.round(Math.min(w*12,Math.max(w*8,(+calc?.carbLoadG)||((calc?.carbsG||w*6)*1.5))));
    const raceCarbs=(+calc?.raceCarbsPerHour)||Math.min(Math.round(w*0.9),120);
    const raceCarbsMax=Math.max(raceCarbs,Math.min(Math.round(w*1.1),120));
    const meds=profilData?.medications||[];
    const hasBlutdruck=meds.includes("blutdruck");
    const hasBlutverd=meds.includes("blutverd");
    const cafNone=calcAll?.caffeineNone??(profilData?.caffeineDaily==="none");
    const cafSensitive=!!calcAll?.caffeineSensitive;
    const cafDose=(+calcAll?.caffeinePreWorkoutDose)||150;
    // Renndauer = Trainingsdauer der Wettkampf-Sportart (genauere Angabe gibt es noch nicht)
    const raceH=Math.max(0.5,durMin/60);
    const [flLo,flHi]=fluidRange(rateLh);
    const flMid=Math.round((flLo+flHi)/2);
    const naBottle=Math.round(naH*500/Math.max(1,flMid)/10)*10;
    const sweatLoss=Math.round(rateLh*raceH*10)/10;
    const deficit=Math.max(0,rateLh*raceH-(flMid/1000)*raceH);
    const rehydL=Math.max(0.5,Math.round(deficit*1.5*10)/10);

    if(!hasComp) return (
      <div style={{padding:"20px 0",textAlign:"center"}}>
        <div style={{fontSize:14,fontWeight:600,color:C.black,marginBottom:6}}>{"Kein Wettkampf aktiviert"}</div>
        <div style={{fontSize:12,color:C.g600,lineHeight:1.6}}>{"Aktiviere Wettkämpfe in deinen Trainingsangaben."}</div>
      </div>
    );

    const PHASES=[
      {
        label:"3 Tage vorher",
        items:[
          {title:"Carb-Loading starten",detail:`Kohlenhydrate auf ${carbLoad}g/Tag erhöhen (${Math.round(carbLoad/w*10)/10}g/kg) - Glykogenspeicher maximal füllen`,bold:true},
          {title:"Kreatin pausieren",detail:"Letzte Kreatin-Dosis 3 Tage vor Wettkampf - verhindert Magenprobleme"},
          ...(cafNone?[]:[{title:"Koffein reduzieren",detail:"Koffein-Pause 3-5 Tage vor dem Rennen für maximale Wirkung am Wettkampftag"}]),
          {title:"Schlaf priorisieren",detail:"Mindestens 8h - Schlafdefizit am Renntag lässt sich nicht ausgleichen"},
        ]
      },
      {
        label:"Tag vorher",
        items:[
          {title:"Pasta-/Reis-Mahlzeit Abend",detail:`${Math.round(w*2)}-${Math.round(w*3)}g Kohlenhydrate (2-3g/kg), wenig Fett - leicht verdaulich, kein Risiko`,bold:true},
          {title:"Magnesium + Salz",detail:`${calcAll?.magnesiumMg||350}mg Magnesium, zusätzliches Natrium im Essen - Krampfprophylaxe`},
          {title:"Hydration aufbauen",detail:"2.5-3L Wasser über den Tag - kein übermässiges Trinken abends"},
          {title:"Kein neues Essen",detail:"Nur bekannte Lebensmittel - niemals Unbekanntes vor einem Wettkampf"},
        ]
      },
      {
        label:"Race Morning",
        items:[
          {title:`${isEndurance?"3h vor Start":"2h vor Start"}: Hauptmahlzeit`,detail:`${isEndurance?`${Math.round(w*2)}-${Math.round(w*3)}`:`${Math.round(w*1)}-${Math.round(w*2)}`}g Kohlenhydrate, ${Math.round(w*0.3)}g Protein - Hafer, Brot, Banane`,bold:true},
          ...(cafNone?[]:[{title:"45 min vor Start: Koffein",detail:hasBlutdruck?"Blutdruckmedikamente: Koffein kann den Blutdruck erhöhen - nur nach Rücksprache mit deinem Arzt":cafSensitive?"Bei dir lieber weglassen - am Wettkampftag nichts Neues ausprobieren":`${cafDose}mg Koffein für maximale Wirkung beim Start`}]),
          {title:"30 min vor Start: Gel",detail:isEndurance?"1 Gel (ca. 20-40g Carbs) für sofortigen Energieschub":"Optional: 1 Gel oder Banane"},
          {title:"Warm-up Hydration",detail:"400-600ml Wasser mit 1 Elektrolyt-Tab - Natrium vorladen"},
        ]
      },
      {
        label:"Während Wettkampf",
        items:[
          {title:"Kohlenhydrate/Stunde",detail:`${raceCarbs}-${raceCarbsMax}g/h ab Minute 30 - niemals warten bis Hungergefühl. Bei 90min+ auf 2:1 Glucose:Fruktose Mix wechseln`,bold:true},
          {title:"Natrium/Stunde",detail:`ca. ${naH}mg Natrium pro Stunde - bei ${flMid}ml/h Trinkmenge sind das ca. ${naBottle}mg pro 500ml Flasche (Elektrolyt-Tab oder Drink Mix)`},
          {title:"Flüssigkeit",detail:`${flLo}-${flHi}ml/h - Durst als Guideline, nicht überhydrieren`},
          ...(isEndurance&&!cafNone&&!cafSensitive?[{title:"Koffein-Gel strategisch",detail:hasBlutdruck?"Blutdruckmedikamente: Koffein-Gels nur nach Rücksprache mit deinem Arzt":"1 Koffein-Gel (100mg) 20-30 min vor kritischer Phase oder Schlussspurt"}]:[]),
        ]
      },
      {
        label:"Post-Race Recovery",
        items:[
          {title:"Sofort: Protein + Carbs",detail:`${Math.round(w*0.4)}g Protein + ${Math.round(calc?.carbsG*0.3)||60}g Kohlenhydrate in den ersten 30 min`,bold:true},
          {title:"Rehydration",detail:`${rehydL}L Wasser + Elektrolyte in den Stunden danach - 150% von dem, was du im Rennen nicht nachgetrunken hast (Schweissverlust ca. ${sweatLoss}L). Tipp: vor und nach dem Rennen wiegen - pro kg weniger 1.5L trinken.`},
          {title:"Magnesium abends",detail:`${calcAll?.magnesiumMg||350}mg Magnesium - deine berechnete Tagesdosis, nicht mehr (GI-Risiko bei Überdosierung)`},
          {title:"72h Recovery",detail:"Kein intensives Training 48-72h nach Wettkampf - aktive Regeneration (Schwimmen, Gehen)"},
        ]
      },
    ];

    return (
      <div>
        {compSports.length>1&&(
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            {compSports.map(s=>{
              const label=SPORT_GROUPS.find(g=>g.id===s)?.label||s;
              const active=compSport===s;
              return (
                <button key={s} onClick={()=>setCompSport(s)}
                  style={{padding:"6px 14px",borderRadius:100,border:`1.5px solid ${active?C.black:C.g200}`,background:active?C.neon:C.white,color:C.black,fontSize:12,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s"}}>
                  {label}
                </button>
              );
            })}
          </div>
        )}
        <div style={{background:C.neonDim,border:`1px solid ${C.neon}`,borderRadius:12,padding:"13px 16px",marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:4,overflowWrap:"anywhere"}}>Race-Day Strategie · {compLabel}</div>
          <div style={{fontSize:11,color:"#4A7000",lineHeight:1.65}}>Personalisiert auf {w}kg, {raceCarbs}g Carbs/h und {naH}mg Natrium/h. Gerechnet mit {durMin} min Renndauer (deine Trainingsdauer). Alle Angaben basieren auf deinen Trainingsdaten und MET-2024 Berechnungen.</div>
        </div>

        {PHASES.map((phase,i)=>(
          <div key={i} style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{fontSize:13,fontWeight:700,color:C.black}}>{phase.label}</div>
            </div>
            <div style={{background:C.white,border:`0.5px solid ${C.g200}`,borderRadius:12,overflow:"hidden"}}>
              {phase.items.map((item,j)=>(
                <div key={j} style={{padding:"10px 14px",borderBottom:j<phase.items.length-1?`0.5px solid ${C.g100}`:"none"}}>
                  <div style={{fontSize:12,fontWeight:item.bold?700:600,color:item.bold?C.black:C.black,marginBottom:3}}>{item.title}</div>
                  <div style={{fontSize:11,color:C.g500,lineHeight:1.55}}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{padding:"12px 14px",background:C.g100,borderRadius:10,border:`0.5px solid ${C.g200}`,marginTop:8}}>
          <div style={{fontSize:11,color:C.g400,lineHeight:1.65}}>{"Diese Strategie ist eine wissenschaftliche Basis-Empfehlung. Teste alle Protokolle im Training bevor du sie im Wettkampf anwendest."}</div>
        </div>
      </div>
    );
  };

  // Produktlisten Sportnahrung - geteilt von NutritionTab und CartTab (Einkauf), damit beide dieselben ids kennen
  const SN_ENERGIE_PRODUKTE=[
      {id:"sn_mau_gel",   form:"gel",    diet:"standard", timing:"waehrend", kh:40, khTyp:"2:1 Glukose:Fruktose", name:"Maurten Gel 100",         dose:"1 Gel alle 30-40 min",  when:"Ab 75 min Training",      why:"Hydrogel-Technologie - minimaler GI-Stress, maximale Aufnahme.", link:AFF.maurten("gel-100"),          shop:"Maurten", price:"~CHF 3.80/Gel"},
      {id:"sn_mau_caf",   form:"gel",    diet:"standard", timing:"waehrend", kh:40, khTyp:"2:1 + 100mg Koffein",  name:"Maurten Gel 100 CAF",     dose:"1 Gel alle 40-45 min",  when:"Rennen & Intervalle",     why:"Koffein + Kohlenhydrate - für maximale Leistung in Rennsituationen.", link:AFF.maurten("gel-100-caf-100"), shop:"Maurten", price:"~CHF 4.00/Gel"},
      {id:"sn_mn_gel",    form:"gel",    diet:"standard", timing:"waehrend", kh:38, khTyp:"Maltodextrin+Fruktose", name:"MNSTRY Intensity Gel",    dose:"1 Gel alle 30-45 min",  when:"Tempoläufe & Rennen",     why:"Natürliche Zutaten, niedriger GI-Stress.", link:AFF.mnstry("intensity-gel"), shop:"MNSTRY", price:"~CHF 3.50/Gel"},
      {id:"sn_mau_320",   form:"drink",  diet:"standard", timing:"waehrend", name:"Maurten Drink Mix 320",   dose:"80g / 500ml · 1 Flasche/h", kh:80, khTyp:"Trinken 2:1", when:"Ausfahrten über 2h",   why:"Höchste Kohlenhydratdichte ohne Magen-Probleme.", link:AFF.maurten("drink-mix-320"), shop:"Maurten", price:"~CHF 4.50/Port."},
      {id:"sn_sp_elek",   form:"drink",  diet:"standard", timing:"waehrend", name:"Sponser Elektrolyt-Tabs", dose:"1 Tab / 500ml", kh:0, khTyp:"Elektrolyte",         when:"Ab 60 min Training",      why:"Natrium, Kalium, Magnesium - Krampfprävention.", link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", price:"~CHF 0.50/Tab"},
      {id:"sn_mn_carb",   form:"riegel", diet:"vegan",    timing:"vor",      name:"MNSTRY Fast Carb Bar",    dose:"1 Riegel 45 min vor Start", when:"Vor langen Einheiten", why:"Natürliches Carb-Loading - pflanzlich, magenfreundlich.", link:AFF.mnstry("fast-carb-heat"), shop:"MNSTRY", price:"~CHF 4.50/Riegel"},
      {id:"sn_sp_gel",    form:"gel",    diet:"standard", timing:"nach",     name:"Sponser Liquid Energy",   dose:"1 Beutel alle 45 min",  when:"Training & Rennen",       why:"Günstige Alternative mit gutem Kohlenhydratprofil.", link:AFF.sponser("liquid energy"), shop:"Sponser", price:"~CHF 2.20/Port."},
  ];
  const SN_PROTEIN_PRODUKTE=[
      {id:"prot_whey",    form:"shake", diet:"standard", timing:"nach",  name:"Whey Protein Isolat",     dose:"25-30g post-workout",     when:"Innerhalb 30 min nach Training", why:"Schnellste Proteinquelle - maximale Muskelreparatur.", link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", price:"~CHF 1.50/Port."},
      {id:"prot_esn",     form:"shake", diet:"standard", timing:"nach",  name:"ESN Designer Whey",       dose:"25-30g post-workout",     when:"Direkt nach Training",           why:"Marktführer in DACH - hochwertige Zutaten, viele Geschmäcker.", link:AFF.esn("designer-whey-protein"), shop:"ESN", price:"~CHF 1.20/Port."},
      {id:"prot_more",    form:"shake", diet:"standard", timing:"nach",  name:"More Nutrition Total Protein", dose:"25g post-workout",  when:"Post-Workout & Snack",          why:"High-Protein, Low-Carb - ideal für Lifestyle-Athleten.", link:AFF.morenutrition("total-protein"), shop:"More Nutrition", price:"~CHF 1.30/Port."},
      {id:"prot_vegan",   form:"shake", diet:"vegan",    timing:"nach",  name:"Myprotein Vegan Protein", dose:"25g post-workout",        when:"Direkt nach Training",           why:"Erbsen + Reis - vollständiges Aminosäureprofil, pflanzlich.", link:AFF.myprotein("vegan protein blend"), shop:"Myprotein", price:"~CHF 1.40/Port."},
      {id:"prot_riegel",  form:"riegel",diet:"standard", timing:"nach",  name:"Protein Bar (Myprotein)", dose:"1 Riegel post-workout",   when:"Unterwegs / nach Training",      why:"Praktisch für unterwegs - 25g Protein ohne Schütteln.", link:AFF.myprotein("protein bar"), shop:"Myprotein", price:"~CHF 2.50/Riegel"},
      {id:"prot_casein",  form:"shake", diet:"standard", timing:"nacht", name:"Micellar Casein",         dose:"30g vor dem Schlafen",    when:"Abends vor dem Schlafen",        why:"Langsame Freisetzung - Muskelschutz über Nacht.", link:AFF.myprotein("micellar casein"), shop:"Myprotein", price:"~CHF 1.80/Port."},
  ];
  const SN_RECOVERY_PRODUKTE=[
      {id:"rec_mg",       form:"kapsel", timing:"nacht", name:"Magnesium Bisglycinate",   dose:"300-400mg abends",        when:"Täglich vor dem Schlafen", why:"Beste Bioverfügbarkeit - Muskelentspannung, tiefer Schlaf.", link:AFF.iherb("magnesium bisglycinate"), shop:"iHerb", price:"~CHF 0.15/Tag"},
      {id:"rec_kolla",    form:"drink",  timing:"vor",   name:"Kollagen + Vitamin C",     dose:"10-15g vor Training",     when:"Täglich vor Einheit",      why:"Sehnen- und Gelenkschutz - besonders bei hohem Laufvolumen.", link:AFF.iherb("collagen vitamin c"), shop:"iHerb", price:"~CHF 0.60/Tag"},
      {id:"rec_tart",     form:"kapsel", timing:"nach",  name:"Tart Cherry Extrakt",      dose:"480mg täglich",           when:"Nach intensiven Einheiten", why:"Reduziert DOMS um bis zu 20% - natürliches Antioxidans.", link:AFF.iherb("tart cherry"), shop:"iHerb", price:"~CHF 0.40/Tag"},
      {id:"rec_omega",    form:"kapsel", timing:"vor",   name:"Omega-3 (EPA/DHA)",        dose:"2-3g täglich",            when:"Täglich zum Essen",        why:"Entzündungshemmend - verbessert HRV und Erholung.", link:AFF.iherb("omega 3 epa dha"), shop:"iHerb", price:"~CHF 0.30/Tag"},
      {id:"rec_ashwa",    form:"kapsel", timing:"nacht", name:"Ashwagandha KSM-66",       dose:"600mg täglich",           when:"Abends vor dem Schlafen",  why:"Senkt Cortisol - verbessert Schlaftiefe und Erholung.", link:AFF.iherb("ashwagandha ksm-66"), shop:"iHerb", price:"~CHF 0.50/Tag"},
      {id:"rec_vit_d",    form:"kapsel", timing:"vor",   name:"Vitamin D3 + K2",          dose:"2000-4000 IE täglich",    when:"Täglich zum Frühstück",    why:"Immunsystem, Knochen, Hormonstatus - 56% der Sportler mangelversorgt.", link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", price:"~CHF 0.10/Tag"},
  ];
  const NutritionTab=()=>{
    const {energieForm:_nEF=[],proteinForm:_nPF=[],recoveryForm:_nRF=[]}=praeferenzenData||{};
    const calc=calcPro(profilData,trainingData,sportData);
    // Eine Quelle fuer g/h: calcPro (carbsPerHour = Training, raceCarbsPerHour = Wettkampf)
    const _snW=+profilData?.weight||75;
    const carbsH=Number.isFinite(calc?.carbsPerHour)?calc.carbsPerHour:60;
    const raceCarbs=Number.isFinite(calc?.raceCarbsPerHour)?calc.raceCarbsPerHour:Math.min(120,Math.round(_snW*0.9));
    const hasCompSn=!!primaryTraining?.hasCompetition;
    const energyLine=(carbsH>0?`${carbsH}g Kohlenhydrate pro Trainingsstunde`:"Bei deinen Einheiten brauchst du unterwegs kaum Kohlenhydrate")
      +(hasCompSn?`, im Wettkampf bis ${raceCarbs}g pro Stunde`:"")
      +((carbsH>0||hasCompSn)?". Starte ab Minute 30 - nie warten, bis Hunger kommt.":".");
    const prefEnergy=Array.isArray(_nEF)?_nEF:(_nEF?[_nEF]:["egal"]);
    const prefProtein=Array.isArray(_nPF)?_nPF:(_nPF?[_nPF]:["egal"]);
    const prefRecovery=Array.isArray(_nRF)?_nRF:(_nRF?[_nRF]:["egal"]);
    const [rubrik,setRubrikRaw]=useState(()=>UI_STATE.rubrik||"energie");
    const setRubrik=v=>{ UI_STATE.rubrik=v; setRubrikRaw(v); };
    const [showAll,setShowAll]=useState(false);
    const [formPref,setFormPref]=useState(null); // gel/riegel/drink
    const [dietPref,setDietPref]=useState(()=>{ const d=allergenData?.diet; return (Array.isArray(d)?d:[d]).includes("vegan")?"vegan":null; }); // standard/vegan
    const [timingPref,setTimingPref]=useState(null); // vor/waehrend/nach
    const [ownedSn,setOwnedSn]=useState(()=>{ try{ return JSON.parse(localStorage.getItem("treyn_owned")||"[]"); }catch{ return []; } });
    const toggleOwnedSn=(id)=>{
      try{
        const list=JSON.parse(localStorage.getItem("treyn_owned")||"[]");
        const next=list.includes(id)?list.filter(x=>x!==id):[...list,id];
        localStorage.setItem("treyn_owned",JSON.stringify(next));
        setOwnedSn(next);
      }catch{}
    };

    const RUBRIKEN=[
      {id:"energie",  label:"Energie",   desc:"Kohlenhydrate für Training & Rennen"},
      {id:"protein",  label:"Protein",   desc:"Muskelaufbau & Regeneration"},
      {id:"recovery", label:"Recovery",  desc:"Gelenke, Schlaf & Erholung"},
    ];

    const ENERGIE_PRODUKTE=SN_ENERGIE_PRODUKTE;
    const PROTEIN_PRODUKTE=SN_PROTEIN_PRODUKTE;
    const RECOVERY_PRODUKTE=SN_RECOVERY_PRODUKTE;

    // Sportspezifische Auswahl aus getSportNutrition (primary = empfohlen, secondary = optional)
    const sportItems=[
      ...(sportNutrition?.primary||[]).map(p=>({...p,_prio:"primary"})),
      ...(sportNutrition?.secondary||[]).map(p=>({...p,_prio:"secondary"})),
    ].filter(p=>p&&p.id);

    // Merkliste erreichbar? (alter Reiter "einkauf" oder neuer Reiter "produkte")
    const hasEinkauf=(NAV||[]).some(n=>n?.id==="einkauf"||n?.id==="produkte"||n?.id==="merkliste");

    // Formhinweis nur in der Rubrik Energie; bei "egal" nur positive Texte
    const egalEnergy=prefEnergy.length===0||prefEnergy.includes("egal");
    const energyHint=(p)=>{
      if(rubrik!=="energie"||!p?.form) return "";
      if(!egalEnergy&&!prefEnergy.includes(p.form)) return "Nicht deine bevorzugte Form.";
      if(p.form==="gel") return egalEnergy?"Kompakt, sofort verfügbar, kein Kauen nötig.":"Ideal für dich: kompakt, sofort verfügbar, kein Kauen nötig.";
      if(p.form==="drink") return (p.kh||0)>0?"Kombiniert Kohlenhydrate und Flüssigkeit in einem.":"";
      if(p.form==="riegel") return "Gut für längere Einheiten - mehr Sättigung, solider Energieschub.";
      return "";
    };
    const PREF_LABEL={gel:"Gels",riegel:"Riegel",drink:"Drink Mix",shake:"Shake / Pulver",egal:"Egal"};
    const prefText=(arr)=>(arr||[]).map(x=>PREF_LABEL[x]||x).join(", ");

    const getItems=()=>{
      let items = rubrik==="energie"?ENERGIE_PRODUKTE:rubrik==="protein"?PROTEIN_PRODUKTE:RECOVERY_PRODUKTE;
      // Filter by onboarding preference - only show what user likes (unless showAll)
      if(!formPref && !showAll) {
        if(rubrik==="energie" && !prefEnergy.includes("egal"))
          items=items.filter(p=>!p.form||prefEnergy.includes(p.form));
        if(rubrik==="protein" && !prefProtein.includes("egal"))
          items=items.filter(p=>!p.form||prefProtein.includes(p.form));
        if(rubrik==="recovery" && !prefRecovery.includes("egal")&&!prefRecovery.includes("keine"))
          items=items.filter(p=>!p.form||prefRecovery.some(r=>p.form?.includes(r)));
      }
      if(formPref) items=items.filter(p=>p.form===formPref);
      if(dietPref) items=items.filter(p=>!p.diet||p.diet===dietPref);
      if(timingPref) items=items.filter(p=>!p.timing||p.timing===timingPref);
      if(items.length===0) items = rubrik==="energie"?ENERGIE_PRODUKTE:rubrik==="protein"?PROTEIN_PRODUKTE:RECOVERY_PRODUKTE;
      return items;
    };
    // Show active preference filter as info
    const egalProtein=prefProtein.length===0||prefProtein.includes("egal");
    const activePrefFilter = rubrik==="energie"&&!egalEnergy?`Gefiltert nach: ${prefText(prefEnergy)}`
      :rubrik==="protein"&&!egalProtein?`Gefiltert nach: ${prefText(prefProtein)}`
      :null;

    const items=getItems();

    // Form filters per rubrik
    const FORM_OPTS={
      energie: [{id:"gel",label:"Gel"},{id:"drink",label:"Drink"},{id:"riegel",label:"Riegel"}],
      protein: [{id:"shake",label:"Shake"},{id:"riegel",label:"Riegel"}],
      recovery:[{id:"kapsel",label:"Kapsel"},{id:"drink",label:"Drink"}],
    };
    const TIMING_OPTS={
      energie: [{id:"vor",label:"Vor Training"},{id:"waehrend",label:"Während Training"},{id:"nach",label:"Nach Training"}],
      protein: [{id:"nach",label:"Nach Training"},{id:"nacht",label:"Vor Schlaf"}],
      recovery:[{id:"vor",label:"Morgens/Täglich"},{id:"nach",label:"Post-Workout"},{id:"nacht",label:"Abends"}],
    };

    const [openDropdown,setOpenDropdown]=useState(null);

    const Dropdown=({id,label,value,options,onSelect})=>{
      const isOpen=openDropdown===id;
      const selected=options.find(o=>o.id===value);
      return (
        <div style={{flex:1,position:"relative"}}>
          <button onClick={()=>setOpenDropdown(isOpen?null:id)}
            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:9,border:`1.5px solid ${value?C.black:C.g200}`,background:value?C.neon:C.white,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
            <span style={{fontSize:11,fontWeight:600,color:value?C.black:C.g400}}>{selected?selected.label:label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={value?C.black:C.g300} strokeWidth="2.5" strokeLinecap="round"><path d={isOpen?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/></svg>
          </button>
          {isOpen&&(
            <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",borderRadius:10,border:"1px solid #E0E0E0",boxShadow:"0 4px 16px rgba(0,0,0,.1)",zIndex:100,overflow:"hidden"}}>
              <div onClick={()=>{onSelect(null);setOpenDropdown(null);}}
                style={{padding:"9px 12px",fontSize:11,color:"#AAA",cursor:"pointer",borderBottom:"1px solid #F5F5F5",background:!value?"#F8F8F8":"#fff"}}>
                Alle
              </div>
              {options.map(o=>(
                <div key={o.id} onClick={()=>{onSelect(o.id);setOpenDropdown(null);}}
                  style={{padding:"9px 12px",fontSize:11,fontWeight:value===o.id?600:400,color:value===o.id?C.black:"#555",cursor:"pointer",background:value===o.id?C.neonDim:"#fff",borderBottom:"1px solid #F8F8F8"}}>
                  {o.label}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    // Produktkarte (Funktion statt Komponente, damit nichts neu aufgebaut wird); Basic: Dosierung/Timing/Begruendung gesperrt
    const renderSnCard=(p)=>{
      const owned=ownedSn.includes(p.id);
      const hint=isPro?energyHint(p):"";
      return (
        <div key={p.id} style={{background:"#fff",borderRadius:12,border:"1px solid #EBEBEB",padding:"14px",boxShadow:"0 1px 4px rgba(0,0,0,.04)",display:"flex",flexDirection:"column",minWidth:0}}>
          <div style={{flex:1,marginBottom:10,minWidth:0}}>
            {p._prio&&<div style={{fontSize:11,fontWeight:500,fontFamily:"Inter,sans-serif",color:p._prio==="primary"?"#4A7000":C.g400,marginBottom:4}}>{p._prio==="primary"?"Empfohlen":"Optional"}</div>}
            <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:3,lineHeight:1.3,overflowWrap:"anywhere"}}>{p.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginBottom:4}}>
              {isPro?<span style={{fontSize:11,color:"#888",fontFamily:"Inter,sans-serif"}}>{p.dose}</span>:<ProLock w={64}/>}
              {p.kh>0&&<span style={{fontSize:10,padding:"1px 7px",borderRadius:6,background:C.neonDim,color:"#3A6000",fontFamily:"Inter,sans-serif",fontWeight:600}}>{p.kh}g KH</span>}
              {p.khTyp&&<span style={{fontSize:10,padding:"1px 7px",borderRadius:6,background:"#F0F0F0",color:"#666",fontFamily:"Inter,sans-serif",fontWeight:500}}>{p.khTyp}</span>}
            </div>
            {isPro?<div style={{fontSize:11,color:"#888",marginBottom:4}}>{p.when}</div>:<div style={{marginBottom:6}}><ProLock w={80}/></div>}
            {isPro?<div style={{fontSize:11,color:"#555",lineHeight:1.5}}>{p.why}</div>:<ProLock w={120} lines={2}/>}
            {hint&&(
              <div style={{marginTop:5,fontSize:10,color:"#4A7000",fontStyle:"italic"}}>{hint}</div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6,paddingTop:10,borderTop:"1px solid #F5F5F5",marginBottom:8}}>
            <span style={{fontSize:11,fontWeight:500,color:"#333"}}>{p.price||""}</span>
            <a href={p.link} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:4,background:C.neonDim,color:C.black,padding:"5px 10px",borderRadius:7,fontSize:10,fontWeight:600,textDecoration:"none"}}>
              {p.shop} ↗
            </a>
          </div>
          <button onClick={()=>toggleOwnedSn(p.id)}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"7px",borderRadius:8,border:`1.5px solid ${owned?C.neon:"#E8E8E8"}`,background:owned?C.neon:"transparent",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .15s"}}>
            {owned&&<svg width="11" height="11" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.2 2.2L7 1.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            <span style={{fontSize:10,fontWeight:700,color:owned?"#000":"#888"}}>{owned?"✓ Gemerkt":"+ Merken"}</span>
          </button>
          {owned&&<div style={{marginTop:5,fontSize:10,color:"#4A7000",textAlign:"center"}}>{hasEinkauf?<>Findest du in der <strong>Merkliste</strong> unter Produkte.</>:<>Mit PRO findest du alles gesammelt in der <strong>Merkliste</strong>.</>}</div>}
        </div>
      );
    };

    return (
      <div>
        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Sportnahrung</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:10}}>{sportItems.length>0?"Oben die Auswahl für deinen Sport, darunter weitere Produkte nach Rubrik.":"Produkte nach Rubrik - filtere nach Format, Zeitpunkt und Ernährung."}</p>
        {isPro&&(
          <div style={{background:C.neonDim,border:`1px solid ${C.neonBorder}`,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:500,fontFamily:"Inter,sans-serif",color:"#4A7000",marginBottom:5}}>Dein Energie-Bedarf</div>
            <div style={{fontSize:12,color:"#333",lineHeight:1.7,marginBottom:4}}>
              {energyLine}
            </div>
            <div style={{fontSize:11,color:"#3A6000"}}>Gel bei hoher Intensität · Riegel nur unter 70% HFmax · Drink reduziert Gel-Bedarf</div>
          </div>
        )}
        {!isPro&&<ProUnlockBanner text="Dosierung, Timing und Begründung für jedes Produkt sind mit PRO freigeschaltet."/>}
        {activePrefFilter&&(
          <div style={{marginBottom:12,padding:"8px 12px",background:C.neonDim,borderRadius:8,border:`1px solid ${C.neon}`,fontSize:11,color:"#4A7000"}}>
            ✓ {activePrefFilter} - basierend auf deiner Präferenz
          </div>
        )}



        {/* Info */}
        <div style={{marginBottom:14,borderRadius:12,border:`1px solid ${C.g200}`,overflow:"hidden"}}>
          <div style={{background:C.g100,padding:"8px 14px",borderBottom:`1px solid ${C.g200}`,display:"flex",alignItems:"center",gap:6}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{fontSize:12,fontWeight:500,color:C.g600,fontFamily:"Inter,sans-serif"}}>Hinweis</span>
          </div>
          <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:7}}>
            <div>
              <span style={{fontSize:11,color:C.g600,lineHeight:1.6}}>TREYN AI-Empfehlungen sind keine medizinische Beratung. Inhaltsstoffe immer beim Hersteller prüfen. Bei Erkrankungen: Arzt konsultieren.</span>
            </div>
            <div style={{height:1,background:C.g100}}/>
            <div>
              <span style={{fontSize:11,color:C.g600,lineHeight:1.6}}>Wir empfehlen alle verfügbaren Produkte für deine Performance - unabhängig von Listung oder Verlinkung.</span>
            </div>
          </div>
        </div>

        {/* Für deinen Sport - aus getSportNutrition */}
        {sportItems.length>0&&(
          <div style={{marginBottom:18}}>
            <div style={{fontSize:12,fontWeight:500,color:C.g400,fontFamily:"Inter,sans-serif",marginBottom:4}}>Für deinen Sport</div>
            <div style={{fontSize:12,color:C.g600,lineHeight:1.5,marginBottom:10}}>{sportLabel&&sportLabel!=="Sport"?`Ausgewählt für ${sportLabel}.`:"Ausgewählt für deinen Sport."}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
              {sportItems.map(p=>renderSnCard(p))}
            </div>
          </div>
        )}

        {/* 3 Rubriken */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,marginBottom:16}}>
          {RUBRIKEN.map(r=>(
            <button key={r.id} onClick={()=>{setRubrik(r.id);setFormPref(null);setTimingPref(null);setShowAll(false);}}
              style={{padding:"10px 8px",borderRadius:10,border:`1.5px solid ${rubrik===r.id?C.black:C.g200}`,background:rubrik===r.id?C.neon:C.white,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .14s"}}>
              <div style={{fontSize:12,fontWeight:700,color:C.black,marginBottom:2}}>{r.label}</div>
              <div style={{fontSize:10,color:rubrik===r.id?"rgba(0,0,0,.5)":"#AAA",lineHeight:1.4}}>{r.desc}</div>
            </button>
          ))}
        </div>

        {/* Präferenz-Filter - Dropdowns nebeneinander */}
        <div style={{display:"flex",gap:6,marginBottom:16}} onClick={e=>e.stopPropagation()}>
          <Dropdown id="form" label="Format" value={formPref}
            options={FORM_OPTS[rubrik]||[]}
            onSelect={setFormPref}/>
          <Dropdown id="timing" label="Zeitpunkt" value={timingPref}
            options={TIMING_OPTS[rubrik]||[]}
            onSelect={setTimingPref}/>
          {rubrik!=="recovery"&&(
            <Dropdown id="diet" label="Ernährung" value={dietPref}
              options={[{id:"standard",label:"Standard"},{id:"vegan",label:"Vegan"}]}
              onSelect={setDietPref}/>
          )}
        </div>

        {/* Präferenz Toggle */}
        {activePrefFilter&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,padding:"8px 12px",borderRadius:9,background:showAll?"#F5F5F5":C.neonDim,border:`1px solid ${showAll?"#E0E0E0":C.neon}`,transition:"all .2s"}}>
            <span style={{fontSize:11,color:showAll?"#888":"#4A7000",fontWeight:500}}>
              {showAll?"Alle Produkte anzeigen":`Nur deine Präferenz: ${rubrik==="energie"?prefText(prefEnergy):prefText(prefProtein)}`}
            </span>
            <div onClick={()=>setShowAll(s=>!s)}
              style={{width:36,height:20,borderRadius:10,background:showAll?"#CCC":C.black,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:showAll?2:18,width:16,height:16,borderRadius:"50%",background:showAll?"#fff":C.neon,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
            </div>
          </div>
        )}

        {/* Produkte */}
        {items.length===0?(
          <div style={{padding:"24px",textAlign:"center",background:"#FAFAFA",borderRadius:12,border:"1px solid #EBEBEB"}}>
            <div style={{fontSize:13,color:"#AAA"}}>Keine Produkte für diese Filterauswahl.</div>
            <button onClick={()=>{setFormPref(null);setTimingPref(null);setDietPref(null);}} style={{marginTop:8,background:"none",border:"none",color:C.g600,fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Filter zurücksetzen</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
            {items.map(p=>renderSnCard(p))}
          </div>
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
      {name:"Omega-3 (EPA/DHA)",dose:"2-3g täglich",shop:"iHerb",price:"~CHF 0.30/Tag",link:AFF.iherb("omega 3 epa dha"),desc:"Entzündungshemmend, Herzgesundheit, HRV-Verbesserung",tags:["Basis","Täglich"]},
      {name:"Magnesium Bisglycinate",dose:"300-400mg täglich",shop:"iHerb",price:"~CHF 0.15/Tag",link:AFF.iherb("magnesium bisglycinate"),desc:"Schlafqualität, Muskelentspannung, Krampfprävention",tags:["Basis","Abends"]},
      {name:"Vitamin D3 + K2",dose:"2000-4000 IE täglich",shop:"iHerb",price:"~CHF 0.10/Tag",link:AFF.iherb("vitamin d3 k2"),desc:"Immunsystem, Knochen, Hormonstatus",tags:["Basis","Täglich"]},
      {name:"Ashwagandha KSM-66",dose:"600mg täglich",shop:"iHerb",price:"~CHF 0.50/Tag",link:AFF.iherb("ashwagandha ksm-66"),desc:"Senkt Cortisol, verbessert Schlaftiefe und Regeneration",tags:["Adaptogen","Abends"]},
      {name:"Whey Protein Isolat",dose:"25-30g post-workout",shop:"Myprotein",price:"~CHF 1.50/Portion",link:AFF.myprotein("whey protein isolate"),desc:"Muskelreparatur und -aufbau nach dem Training",tags:["Protein","Post-Training"]},
      {name:"ESN Designer Whey",dose:"25-30g post-workout",shop:"ESN",price:"~CHF 1.20/Portion",link:AFF.esn("designer-whey-protein"),desc:"Marktführer in DE/CH/AT - hochwertige Zutaten, viele Geschmacksrichtungen",tags:["Protein","Post-Training"]},
      {name:"More Nutrition Total Protein",dose:"25g post-workout",shop:"More Nutrition",price:"~CHF 1.30/Portion",link:AFF.morenutrition("total-protein"),desc:"High-Protein, Low-Carb - beliebt bei Fitness & Lifestyle Athleten",tags:["Protein","Low-Carb"]},
      {name:"Kreatin Monohydrat",dose:"5g täglich",shop:"iHerb",price:"~CHF 0.20/Tag",link:AFF.iherb("creatine monohydrate"),desc:"Sprintleistung und Regeneration - bestens erforscht",tags:["Kraft","Täglich"]},
      {name:"Beta-Alanin",dose:"3.2-6.4g täglich",shop:"iHerb",price:"~CHF 0.30/Tag",link:AFF.iherb("beta alanine"),desc:"Puffert Laktat, verzögert Ermüdung bei Intervallen",tags:["Ausdauer","Pre-Workout"]},
      {name:"Zink 15mg",dose:"15mg täglich",shop:"iHerb",price:"~CHF 0.10/Tag",link:AFF.iherb("zinc 15mg"),desc:"Immunabwehr, Testosteron, Wundheilung",tags:["Immunsystem","Täglich"]},
      {name:"Kollagen + Vitamin C",dose:"10-15g vor Training",shop:"iHerb",price:"~CHF 0.60/Tag",link:AFF.iherb("collagen vitamin c"),desc:"Sehnen- und Gelenkschutz",tags:["Gelenke","Prävention"]},
      {name:"Tart Cherry Extrakt",dose:"480mg täglich",shop:"iHerb",price:"~CHF 0.40/Tag",link:AFF.iherb("tart cherry"),desc:"DOMS-Reduktion nach langen Einheiten",tags:["Recovery","Post-Training"]},
      {name:"Rote Beete Nitrat",dose:"400-600mg Nitrat",shop:"iHerb",price:"~CHF 0.50/Tag",link:AFF.iherb("beet root nitrate"),desc:"Verbessert O2-Effizienz um 1-3%",tags:["Ausdauer","Pre-Training"]},
    ];
    const SPORT=[
      {name:"Maurten Gel 100",dose:"1 Gel alle 30-45 min",shop:"Maurten",price:"~CHF 4.00",link:AFF.maurten("gel-100-box"),desc:"Hydrogel-Technologie - minimaler GI-Stress",tags:["Race-Day","Kohlenhydrate"],affiliate:true},
      {name:"Maurten Gel 100 CAF",dose:"1 Gel bei Rennen",shop:"Maurten",price:"~CHF 4.50",link:AFF.maurten("gel-100-caf-100"),desc:"Koffein + Kohlenhydrate für maximale Leistung",tags:["Race-Day","Koffein"],affiliate:true},
      {name:"Maurten Drink Mix 320",dose:"80g / 500ml",shop:"Maurten",price:"~CHF 4.50",link:AFF.maurten("drink-mix-320"),desc:"Hohe Kohlenhydratdichte ohne GI-Probleme",tags:["Ausdauer","Kohlenhydrate"],affiliate:true},
      {name:"MNSTRY Intensity Gel",dose:"1 Gel alle 30-45 min",shop:"MNSTRY",price:"~CHF 3.50",link:AFF.mnstry("intensity-gel"),desc:"Magenfreundlich - genutzt von Canyon//SRAM & EF Education",tags:["Race-Day","Carbs"],affiliate:true},
      {name:"SiS Beta Fuel Gel",dose:"1 Gel alle 30-40 min",shop:"SiS",price:"~CHF 3.80",link:AFF.sis("collections/gels"),desc:"40g Kohlenhydrate, 2:1 Maltodextrin:Fructose - für Einheiten über 90 min",tags:["Ausdauer","80g Carbs"],affiliate:true},
      {name:"SiS GO Isotonic Gel",dose:"1 Gel alle 20-30 min",shop:"SiS",price:"~CHF 2.80",link:AFF.sis("collections/gels"),desc:"Kein Wasser nötig - isotonisch, sofort verfügbar",tags:["Einsteiger","Isotonisch"],affiliate:true},
      {name:"226ERS Sub9 Gel",dose:"1 Gel alle 30-45 min",shop:"226ERS",price:"~CHF 3.20",link:AFF.ers226("collections/gels"),desc:"Speziell für Ironman & Ultra - bis zu 60g Carbs/h möglich",tags:["Ultra","Triathlon"],affiliate:false},
      {name:"226ERS High Energy Bar",dose:"1 Riegel alle 45-60 min",shop:"226ERS",price:"~CHF 2.80",link:AFF.ers226("collections/bars"),desc:"Bio-Zutaten, hohe Kohlenhydratdichte - ideal für lange Ausfahrten",tags:["Riegel","Bio"],affiliate:false},
      {name:"Näak Ultra Energy Bar",dose:"1 Riegel alle 60 min",shop:"Näak",price:"~CHF 4.50",link:AFF.naak("collections/energy-bars"),desc:"Grillen-Protein + pflanzliche Kohlenhydrate - nachhaltig und effektiv",tags:["Nachhaltig","Ultra"],affiliate:false},
      {name:"Veloforte Di Bosco",dose:"1 Riegel alle 45 min",shop:"Veloforte",price:"~CHF 3.90",link:AFF.veloforte("products/di-bosco"),desc:"Echte Lebensmittel, kein künstlicher Beigeschmack - Wildblaubeere & Haselnuss",tags:["Rennrad","Real Food"],affiliate:true},
      {name:"BAOUW Energieriegel",dose:"1 Riegel alle 45-60 min",shop:"BAOUW",price:"~CHF 3.50",link:AFF.baouw("collections/all"),desc:"100% natürliche Zutaten, keine Zusatzstoffe - für sensible Mägen",tags:["Natürlich","Vegan"],affiliate:false},
      {name:"Sponser Elektrolyt-Tabs",dose:"1 Tab / 500ml",shop:"Sponser",price:"~CHF 0.50",link:AFF.sponser("elektrolyt tabletten"),desc:"Natrium, Kalium, Magnesium - Krampfprävention. Schweizer Qualität.",tags:["Hydration","Sommer"],affiliate:false},
      {name:"Koffein 100-200mg",dose:"30-45 min vor Wettkampf",shop:"iHerb",price:"~CHF 0.15",link:AFF.iherb("caffeine 100mg"),desc:"Kognitive Leistung + Ausdauer",tags:["Pre-Race","Koffein"],affiliate:true},
    ];
    const FERTIG=[
      {name:"Löwenanteil",desc:"Bio-Fertiggerichte im Glas - 30-42g Protein, 1 Jahr ungekühlt haltbar",price:"ab CHF 7.90 / Glas",link:"https://www.loewenanteil.com?ref=TREYN",tags:["Bio","High Protein","Top Pick"],affiliate:true},
      {name:"Huel",desc:"Vollwertige Mahlzeiten & Shakes - alle 26 Vitamine & Mineralien",price:"ab CHF 2.50 / Mahlzeit",link:AFF.huel("collections/all"),tags:["Vegan","Vollwertig"],affiliate:true},
      {name:"Foodspring",desc:"Sport-Nutrition Mahlzeiten - Protein-Porridge, Recovery Shakes",price:"ab CHF 4.90 / Portion",link:AFF.foodspring("collections/all"),tags:["Sport","CH/DE/AT"],affiliate:true},
      {name:"Saturo",desc:"Flüssige Vollmahlzeiten - sofort trinkfertig, 0 Min. Zubereitung",price:"ab CHF 3.50 / Flasche",link:"https://saturo.com/de?ref=TREYN",tags:["Vegan","Sofort"],affiliate:false},
    ];
    const SC={};
    const items=shopCat==="supplements"?SUPPS:shopCat==="sportnahrung"?SPORT:FERTIG;
    return (
      <div>
        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Shop</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.5}}>Alle Affiliate-Produkte auf einen Blick - direkt beim Anbieter kaufen.</p>
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setShopCat(c.id)}
              style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${shopCat===c.id?C.black:C.g200}`,background:shopCat===c.id?C.neon:"transparent",color:shopCat===c.id?C.black:C.g600,fontSize:12,fontWeight:shopCat===c.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s"}}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          {items.map((p,i)=>{
            const sc=SC[p.shop]||{bg:"#333",t:"#fff"};
            return (
              <div key={i} style={{background:"#fff",borderRadius:12,border:"1px solid #EBEBEB",padding:"12px 12px",boxShadow:"0 1px 4px rgba(0,0,0,.04)",display:"flex",flexDirection:"column"}}>
                <div style={{flex:1,marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:2,lineHeight:1.3}}>{p.name}</div>
                  {p.dose&&<div style={{fontSize:11,color:"#888",fontFamily:"Inter,sans-serif",marginBottom:4}}>{p.dose}</div>}
                  <div style={{fontSize:11,color:"#666",lineHeight:1.5,marginBottom:8}}>{p.desc}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {(p.tags||[]).map(t=><span key={t} style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:t==="Top Pick"?C.neonDim:"#F5F5F5",color:t==="Top Pick"?"#4A7000":"#666",fontFamily:"Inter,sans-serif",fontWeight:t==="Top Pick"?600:500,border:t==="Top Pick"?`1px solid ${C.neon}`:"none"}}>{t}</span>)}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,paddingTop:10,borderTop:"1px solid #F5F5F5"}}>
                  <span style={{fontSize:11,fontWeight:500,color:"#333"}}>{p.price}</span>
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:4,background:C.neonDim,color:C.black,padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:600,textDecoration:"none",flexShrink:0,whiteSpace:"nowrap"}}>
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

  // ── SUMMARY TAB ────────────────────────────────────────────────────────────
  // ÜBERSICHT:
  // Eine Seite fuer Basic und PRO (fruehere Reiter "Summary" und "Deine Zahlen" zusammengefuehrt).
  // Basic: genau 4 offene Basiswerte (calcBasic), alle anderen Werte gesperrt (kein echter Wert im Code). PRO: alles offen.
  const SummaryTab=()=>{
    const isMobile=useWindowWidth()<=768;
    const [localTraining,setLocalTrainingRaw]=useState(()=>JSON.parse(JSON.stringify(trainingData||{})));
    React.useEffect(()=>{ if(trainingData&&Object.keys(trainingData).length>0) setLocalTrainingRaw(JSON.parse(JSON.stringify(trainingData))); },[JSON.stringify(trainingData||{})]);
    const [showEditor,setShowEditor]=useState(false);
    // Aenderungen unter "Anpassen" an App weitergeben (onTrainingChange), damit alle Reiter dieselben Daten nutzen.
    // Uebernommen wird bei "Fertig" und beim Verlassen des Reiters (nicht bei jedem Slider-Schritt).
    const dirtyRef=useRef(false);
    const localRef=useRef(localTraining);
    localRef.current=localTraining;
    const onChangeRef=useRef(onTrainingChange);
    onChangeRef.current=onTrainingChange;
    const setLocalTraining=fn=>{ dirtyRef.current=true; setLocalTrainingRaw(fn); };
    const commitTraining=()=>{
      if(!dirtyRef.current) return;
      dirtyRef.current=false;
      if(typeof onChangeRef.current==="function") onChangeRef.current(JSON.parse(JSON.stringify(localRef.current||{})));
    };
    React.useEffect(()=>()=>{ if(resultsMountedRef.current) commitTraining(); },[]);
    const calc=calcPro(profilData,localTraining,sportData);
    if(!calc||!profilData) return (
      <div style={{padding:24,textAlign:"center"}}>
        <div style={{fontSize:14,color:C.g400,marginBottom:8}}>Daten werden geladen...</div>
        <div style={{fontSize:12,color:C.g300}}>Falls dies bestehen bleibt, bitte Seite neu laden.</div>
      </div>
    );

    const INTENS=[["low","Leicht"],["medium","Mittel"],["high","Intensiv"],["competition","Wettkampf"]];
    const INTENS_LABEL={low:"Leicht",medium:"Mittel",high:"Intensiv",competition:"Wettkampf"};
    const w=+profilData?.weight||75;
    const age=profilData?.birthyear?new Date().getFullYear()-+profilData.birthyear:30;
    const firstname=profilData?.firstname||"";
    const timingRecs=calc?.timingRecs||{preWorkout:"-",postWorkout:"-",creatine:"-",note:""};
    const trainingEntries=Object.entries(localTraining||{});

    // Safe accessors
    const safeNum=(v,fb=0)=>v==null||isNaN(+v)?fb:+v;
    const fmt=v=>safeNum(v,0).toLocaleString("de-CH");
    const bmr=safeNum(calc.bmr,2000);
    const withTraining=safeNum(calc.withTraining,2500);
    const restDayKcal=safeNum(calc.restDay,bmr)||bmr;
    const proteinMin=safeNum(calc.proteinMin,Math.round(w*1.4));
    const proteinMax=safeNum(calc.proteinMax,Math.round(w*1.8));
    const carbsG=safeNum(calc.carbsG,Math.round(withTraining*0.5/4));
    const waterMl=safeNum(calc.waterMl,2500);
    // Ruhetag: Grundbedarf (nie unter 35 ml/kg), nicht Trainingstag x 0.6
    const waterRestMl=Math.max(Math.round(w*35),safeNum(calc?.waterRestMl,Math.round(w*35)));
    const natriumMg=safeNum(calc.natriumMg,1500); // pro Einheit der Hauptsportart
    const natriumPerHourMg=safeNum(calc?.natriumPerHourMg,0);
    const magnesiumMg=safeNum(calc.magnesiumMg,350);
    const sweatL=Math.round(safeNum(calc.sweatLitresPerSession,0.8)*10)/10;
    const sweatRateLh=Math.round(safeNum(calc?.sweatRateLh,0)*10)/10;
    const totalDays=trainingEntries.reduce((s,[,d])=>s+(d?.days||0),0);
    const totalMin=trainingEntries.reduce((s,[,d])=>s+(d?.days||0)*(d?.duration||60),0);
    const trainingDays=Math.min(totalDays,7);
    // kcal pro Einheit: aus calcPro (sportBreakdown), sonst gleiche Herleitung wie calcPro (Unterdisziplin-MET)
    const breakdown=Array.isArray(calc?.sportBreakdown)?calc.sportBreakdown:[];
    const kcalPerSession=(id,d)=>{
      const b=breakdown.find(x=>x?.id===id);
      if(b&&b.kcalPerSession!=null&&!isNaN(+b.kcalPerSession)) return Math.round(+b.kcalPerSession);
      const met=(sportMetTable(id,sportData)||{})[d?.intensity||"medium"]||5;
      return Math.round(met*w*(d?.duration||60)/60);
    };
    // Reiner Trainingsverbrauch (ohne Job/NEAT, Ziel-, Hoehen- oder Zyklus-Faktor)
    const weekTrainingKcal=trainingEntries.reduce((s,[id,d])=>s+kcalPerSession(id,d)*(d?.days||0),0);
    const monthTrainingKcal=Math.round(weekTrainingKcal*4.33);
    const extraPerTrainingDay=breakdown.length&&calc?.trainingExtra!=null&&!isNaN(+calc.trainingExtra)
      ? Math.round(+calc.trainingExtra)
      : (trainingDays?Math.round(weekTrainingKcal/trainingDays):0);
    const primId=calc?.primarySport||primarySport;
    const primName=sportDisplayName(primId,sportData)||"Hauptsportart";
    const maxHr=220-age;

    // Basic: Pauschal-Rechnung, genau 4 offene Werte
    const basicCalc=calcBasic(profilData,localTraining,sportData?.healthOnly)||{};
    const basicBmr=safeNum(basicCalc.bmr,bmr);
    const basicWith=safeNum(basicCalc.withTraining,withTraining);
    const waterEstL=Math.round(safeNum(basicCalc.waterMl,w*35)/100)/10;
    const sessionsYear=safeNum(basicCalc.sessionsPerYear,totalDays*52);

    // Kopf: Sportarten-Chips (gewaehlte Unterdisziplin, sonst Gruppe), in PRO dazu Zyklus und Job
    const localSports=(sportData?.selectedSports||sports||[]).length?(sportData?.selectedSports||sports||[]):trainingEntries.map(([id])=>id);
    const sportTags=localSports.slice(0,4).map(s=>sportDisplayName(s,sportData)||"Sport");
    if(!sportTags.length&&sportData?.healthOnly) sportTags.push("Gesundheit");
    const cycleLabel=isPro&&calc?.cyclePhase?{follikel:"Follikelphase",ovulation:"Ovulation",luteal:"Luteal +200 kcal",period:"Periode",pcos:"PCOS",menopause:"Menopause"}[calc.cyclePhase]:null;
    const neatTag=isPro&&calc?.neatKcal>=500?`Job +${calc.neatKcal} kcal`:null;
    const contextTags=[...(cycleLabel?[cycleLabel]:[]),...(neatTag?[neatTag]:[])];

    // Hinweise (farbige Box als Signal)
    const STRESS_LABEL={1:"sehr niedrig",2:"niedrig",3:"mittel",4:"hoch",5:"sehr hoch"}[calc.stressLevel]||"mittel";
    const sleepH=+(calc?.sleepHours??calc?.sleep)||7;
    const WARNINGS=[];
    if(calc.stressLevel>=4) WARNINGS.push(`<strong>Stresslevel ${STRESS_LABEL} erkannt.</strong> Cortisol hemmt aktiv deine Regeneration und Muskelproteinsynthese. Das bremst dich mehr als jedes fehlende Supplement - Ashwagandha und erhöhtes Magnesium sind für dich jetzt besonders relevant.`);
    if(calc.needsCollagen&&(calc.injuries||[]).some(x=>x!=="none")) WARNINGS.push(isPro
      ?`<strong>Gelenke & Sehnen.</strong> Bei deinen Beschwerden ist Kollagen + Vitamin C direkt vor dem Training wissenschaftlich belegt wirksam. 10-15g, 30 min vor der Einheit.`
      :`<strong>Gelenke & Sehnen.</strong> Bei deinen Beschwerden lohnt sich gezielte Unterstützung für Sehnen und Gelenke. Was, wie viel und wann, siehst du mit PRO.`);
    if(calc.ironRisk&&calc.isFemale) WARNINGS.push(`<strong>Eisenbedarf erhöht.</strong> Sportlerinnen haben durch Menstruationsverlust und Sport-Hämolyse ein erhöhtes Risiko. Ferritin regelmässig testen - Zielwert: >50 µg/L.`);
    if(sleepH<7) WARNINGS.push(`<strong>Schlafdefizit erkannt (${sleepH}h).</strong> Unter 7h Schlaf erhöht Cortisol, hemmt Muskelproteinsynthese und verlängert Regenerationszeit. Dein wichtigster Hebel.`);

    const TIME_LABEL=({morning:"Morgentraining",midday:"Mittagstraining",afternoon:"Nachmittagstraining",evening:"Abendtraining"})[calc?.primaryTrainingTime]||"Dein Training";
    const grid3=isMobile?"repeat(2,minmax(0,1fr))":"repeat(3,minmax(0,1fr))";
    const grayText="#AAA";

    const lockIcon=(
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}} aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    );
    // Abschnitts-Titel: Inter 500, grau, normale Schreibweise. lockedGroup: kleines PRO-Schild rechts
    const groupLabel=(text,lockedGroup=false,mt=0)=>(
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:8,marginTop:mt}}>
        <div style={{fontSize:12,fontWeight:500,color:grayText,fontFamily:"Inter,sans-serif",minWidth:0}}>{text}</div>
        {lockedGroup&&<div style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:600,color:C.g500,background:C.g100,borderRadius:100,padding:"2px 8px",flexShrink:0,fontFamily:"Inter,sans-serif"}}>{lockIcon}PRO</div>}
      </div>
    );

    const Pill=({label,active,onClick})=>(
      <button onClick={onClick} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${active?C.black:C.g200}`,background:active?C.neon:"transparent",color:active?C.black:C.g600,fontSize:11,fontWeight:active?500:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s",whiteSpace:"nowrap"}}>
        {label}
      </button>
    );

    // Wertekarte. locked: unscharfer Platzhalter statt Wert, Klick fuehrt zu PRO
    const M=({label,value,unit,sub,desc,locked,accent,ph="0000"})=>locked?(
      <button type="button" onClick={onUpgrade} aria-label={`${label}: mit PRO freischalten`}
        style={{display:"block",width:"100%",minWidth:0,textAlign:"left",background:"#FFFFFF",borderRadius:12,padding:"14px 16px",border:"1px solid #E8E8E8",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,marginBottom:6}}>
          <span style={{fontSize:11,fontWeight:500,color:grayText,minWidth:0,overflowWrap:"anywhere"}}>{label}</span>
          {lockIcon}
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:3,lineHeight:1.1}}>
          <span aria-hidden="true" style={{fontSize:22,fontWeight:300,color:"#0A0A0A",letterSpacing:"-.03em",filter:"blur(6px)",userSelect:"none"}}>{ph}</span>
          {unit&&<span style={{fontSize:12,color:grayText,fontWeight:400}}>{unit}</span>}
        </div>
      </button>
    ):(
      <div style={{background:"#FFFFFF",borderRadius:12,padding:"14px 16px",border:"1px solid #E8E8E8",boxShadow:"0 1px 4px rgba(0,0,0,.05)",minWidth:0}}>
        <div style={{fontSize:11,fontWeight:500,color:grayText,marginBottom:6,overflowWrap:"anywhere"}}>{label}</div>
        <div style={{fontSize:22,fontWeight:300,color:accent?"#4A7000":"#0A0A0A",letterSpacing:"-.03em",lineHeight:1.1,overflowWrap:"anywhere"}}>
          {value}<span style={{fontSize:12,color:grayText,marginLeft:3,fontWeight:400}}>{unit}</span>
        </div>
        {sub&&<div style={{fontSize:10,color:grayText,marginTop:2}}>{sub}</div>}
        {desc&&<div style={{fontSize:10,color:"#BBB",marginTop:6,lineHeight:1.5,paddingTop:6,borderTop:"1px solid #F0F0F0"}}>{desc}</div>}
      </div>
    );

    // Werte-Gruppen: PRO offen, Basic gesperrt (ohne echte Werte)
    const energieCards=isPro?[
      {label:"Grundumsatz",value:fmt(bmr),unit:"kcal",sub:"täglich, ohne Training",desc:"Kalorien die dein Körper in Ruhe verbraucht - Atmung, Herzschlag, Organe. Basis für alle Berechnungen."},
      {label:"Trainingstag",value:fmt(withTraining),unit:"kcal",sub:"MET-basiert · exakt",desc:"Gesamtbedarf an Trainingstagen - Grundumsatz plus Kalorienverbrauch durch Sport.",accent:true},
      {label:"Ruhetag",value:fmt(restDayKcal),unit:"kcal",sub:"ohne Sportverbrauch",desc:"An Ruhetagen deutlich weniger - nur Grundumsatz plus leichte Alltagsaktivität."},
      {label:"Mehrverbrauch durch Training",value:fmt(extraPerTrainingDay),unit:"kcal",sub:"pro Trainingstag",desc:"Zusätzliche Kalorien, die du an einem Trainingstag durch Sport verbrennst. Die solltest du an diesen Tagen zusätzlich essen."},
      {label:"Training / Woche",value:totalDays,unit:"×",sub:`${Math.round(totalMin/60)}h total`,desc:"Deine gesamten Trainingseinheiten pro Woche über alle Sportarten."},
      {label:"Kcal / Monat (Training)",value:fmt(monthTrainingKcal),unit:"kcal",desc:"Hochgerechneter Kalorienverbrauch nur durch Training pro Monat (Woche × 4.33)."},
    ]:[
      {label:"Ruhetag",unit:"kcal",locked:true},
      {label:"Mehrverbrauch durch Training",unit:"kcal",locked:true,ph:"000"},
      {label:"Kcal / Monat (Training)",unit:"kcal",locked:true,ph:"00 000"},
    ];
    const makroCards=isPro?[
      {label:"Protein / Tag",value:`${proteinMin}-${proteinMax}`,unit:"g",sub:"exakt",desc:"Eiweissbedarf für Muskelaufbau und -erhalt. Besonders wichtig bei Kraft- und Ausdauersport."},
      {label:"Kohlenhydrate / Tag",value:`${carbsG}`,unit:"g",sub:"exakt",desc:"Primärer Energielieferant für intensive Trainings. Füllt deine Glykogenspeicher."},
      {label:"Fett / Tag",value:Math.round(withTraining*0.25/9),unit:"g",sub:"~25% Kalorien",desc:"Wichtig für Hormonsynthese, fettlösliche Vitamine und Langzeitenergie."},
    ]:[
      {label:"Protein / Tag",unit:"g",locked:true,ph:"000"},
      {label:"Kohlenhydrate / Tag",unit:"g",locked:true,ph:"000"},
      {label:"Fett / Tag",unit:"g",locked:true,ph:"00"},
    ];
    const elektrolytCards=isPro?[
      {label:"Natrium-Verlust / Einheit",value:fmt(natriumMg),unit:"mg",sub:natriumPerHourMg?`${fmt(natriumPerHourMg)} mg pro Stunde · ${primName}`:`Hauptsportart: ${primName}`,desc:"Natrium verlierst du hauptsächlich durch Schweiss. Zu wenig führt zu Krämpfen und Leistungseinbruch."},
      {label:"Magnesium-Bedarf / Tag",value:magnesiumMg,unit:"mg",desc:"Magnesium ist essenziell für Muskelkontraktion und Regeneration. Sportler verlieren mehr als Nichtsportler."},
    ]:[
      {label:"Natrium-Verlust / Einheit",unit:"mg",locked:true},
      {label:"Magnesium-Bedarf / Tag",unit:"mg",locked:true,ph:"000"},
    ];
    const wasserCards=isPro?[
      {label:"Wasser Trainingstag",value:Math.round(waterMl/100)/10,unit:"L",sub:sweatRateLh?`Schweiss: ca. ${sweatRateLh} L pro Stunde`:`Schweiss: ca. ${sweatL} L pro Einheit`,desc:"Gesamter Wasserbedarf an Trainingstagen inkl. Schweissverlust beim Training.",accent:true},
      {label:"Wasser Ruhetag",value:Math.round(waterRestMl/100)/10,unit:"L",desc:"Grundbedarf an Tagen ohne Training, mindestens 35 ml pro kg Körpergewicht."},
    ]:[
      {label:"Wasser Trainingstag",unit:"L",locked:true,ph:"0.0"},
      {label:"Wasser Ruhetag",unit:"L",locked:true,ph:"0.0"},
    ];
    const leistungCards=isPro?[
      {label:"Max. Herzfrequenz",value:maxHr,unit:"bpm",desc:"Deine theoretische maximale Herzfrequenz. Basis für alle Trainingszonen-Berechnungen (220 - Alter)."},
      {label:"Fettverbrennungszone",value:`${Math.round(maxHr*.60)}-${Math.round(maxHr*.70)}`,unit:"bpm",desc:"In dieser Zone verbrennt dein Körper anteilsmässig am meisten Fett. Ideal für lange, ruhige Ausdauereinheiten."},
      {label:"Ausdauerzone",value:`${Math.round(maxHr*.70)}-${Math.round(maxHr*.80)}`,unit:"bpm",desc:"Typische Zone für Grundlagenausdauer. Fordert das Herz-Kreislauf-System ohne zu überlasten."},
      ...(calc?.vo2max?[{label:"VO₂max (geschätzt)",value:calc.vo2max,unit:"ml/kg/min",sub:calc.vo2maxLabel,desc:"Maximale Sauerstoffaufnahme - der wichtigste Wert für Ausdauerleistung. Geschätzt via Uth-Sørensen Formel.",accent:true}]:[]),
    ]:[
      {label:"Max. Herzfrequenz",unit:"bpm",locked:true,ph:"000"},
      {label:"Fettverbrennungszone",unit:"bpm",locked:true,ph:"000-000"},
      {label:"Ausdauerzone",unit:"bpm",locked:true,ph:"000-000"},
      ...(calc?.vo2max?[{label:"VO₂max (geschätzt)",unit:"ml/kg/min",locked:true,ph:"00"}]:[]),
    ];
    const cardGrid=(cards,cols,mb=20)=>(
      <div style={{display:"grid",gridTemplateColumns:cols,gap:8,marginBottom:mb}}>
        {cards.map(c=><M key={c.label} {...c}/>)}
      </div>
    );

    return (
      <div>
        {/* ── KOPF ── */}
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
            <div style={{minWidth:0}}>
              <h2 style={{fontSize:20,fontWeight:600,color:C.black,letterSpacing:"-.03em",margin:0,lineHeight:1.2,overflowWrap:"anywhere"}}>{firstname?`Hallo ${firstname}.`:"Deine Übersicht."}</h2>
              <div style={{fontSize:12,color:grayText,marginTop:4}}>{age} Jahre · {profilData?.height||"-"} cm · {w} kg</div>
            </div>
            <div style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:isPro?C.neon:"#F0F0F0",color:isPro?"#000":"#888",fontWeight:600,whiteSpace:"nowrap",flexShrink:0,fontFamily:"Inter,sans-serif"}}>
              {isPro?"PRO · exakt berechnet":"Basic · Schätzung"}
            </div>
          </div>
          {(sportTags.length>0||contextTags.length>0)&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>
              {sportTags.map((s,i)=><span key={`s${i}`} style={{display:"inline-flex",padding:"4px 11px",borderRadius:100,background:C.neon,color:C.black,fontSize:11,fontWeight:600}}>{s}</span>)}
              {contextTags.map((s,i)=><span key={`c${i}`} style={{display:"inline-flex",padding:"4px 11px",borderRadius:100,background:C.g100,color:C.g600,fontSize:11,fontWeight:500}}>{s}</span>)}
            </div>
          )}
        </div>

        {/* ── BASIC: 4 offene Basiswerte + eine Upgrade-Karte ── */}
        {!isPro&&(<>
          {groupLabel("Deine Basiswerte")}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,minmax(0,1fr))":"repeat(4,minmax(0,1fr))",gap:8,marginBottom:10}}>
            {[
              {label:"Grundumsatz",val:fmt(basicBmr),unit:"kcal / Tag",hi:false},
              {label:"Mit Training",val:fmt(basicWith),unit:"kcal / Tag",hi:true},
              {label:"Wasser",val:`~${waterEstL} L`,unit:"Schätzwert pro Tag",hi:false},
              {label:"Trainingseinheiten",val:fmt(sessionsYear),unit:"pro Jahr",hi:true},
            ].map(m=>(
              <div key={m.label} style={{background:m.hi?C.neon:C.white,border:`1px solid ${m.hi?C.neon:"#E8E8E8"}`,borderRadius:12,padding:14,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:500,color:m.hi?"rgba(0,0,0,.5)":grayText,marginBottom:6}}>{m.label}</div>
                <div style={{fontSize:22,fontWeight:600,color:C.black,letterSpacing:"-.03em",lineHeight:1,overflowWrap:"anywhere"}}>{m.val}</div>
                <div style={{fontSize:10,color:m.hi?"rgba(0,0,0,.45)":grayText,marginTop:4,overflowWrap:"anywhere"}}>{m.unit}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#F5FFE0",border:`1px solid ${C.neonBorder}`,borderRadius:14,padding:"14px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{flex:"1 1 220px",minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,color:C.black,letterSpacing:"-.01em",lineHeight:1.35}}>{`Alle Werte mit PRO sehen - ${PRICE_STR}`}</div>
              <div style={{fontSize:12,color:C.g600,lineHeight:1.5,marginTop:3}}>Protein, Kohlenhydrate, Elektrolyte, Wasser, Herzfrequenz-Zonen und dein Tagesplan - exakt auf dich berechnet. Einmalig für 6 Monate, kein Abo.</div>
            </div>
            <button onClick={onUpgrade} style={{background:C.neon,color:C.black,border:"none",borderRadius:10,padding:"10px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif",whiteSpace:"nowrap",flexShrink:0,width:isMobile?"100%":"auto"}}>
              PRO freischalten →
            </button>
          </div>
        </>)}

        {/* ── PRO: KI-Zusammenfassung (stabile Komponente ausserhalb von Results, laedt nicht bei jedem Klick neu) ── */}
        {isPro&&<VerbrauchAISummary profilData={profilData} training={localTraining} sportIds={sports} sportData={sportData} calc={calc}/>}

        {/* ── HINWEISE ── */}
        {WARNINGS.map((txt,i)=>(
          <div key={i} style={{background:"#FFFBF0",border:"1px solid #FFE082",borderRadius:10,padding:"11px 14px",marginBottom:8,fontSize:12,color:"#7D5A00",lineHeight:1.65}} dangerouslySetInnerHTML={{__html:txt}}/>
        ))}
        {WARNINGS.length>0&&<div style={{height:12}}/>}

        {/* ── SPORTARTEN (editierbar) ── */}
        {trainingEntries.length>0&&(<>
          <div style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <div style={{fontSize:12,fontWeight:500,color:grayText,fontFamily:"Inter,sans-serif"}}>Deine Sportarten</div>
            <button onClick={()=>{ if(showEditor){ setShowEditor(false); commitTraining(); } else setShowEditor(true); }} style={{fontSize:11,color:showEditor?"#0A0A0A":"#888",background:showEditor?C.neonDim:"#F5F5F5",border:`1px solid ${showEditor?C.neon:"#E8E8E8"}`,borderRadius:20,padding:"3px 12px",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:showEditor?600:400,transition:"all .12s"}}>
              {showEditor?"✓ Fertig":"Anpassen"}
            </button>
          </div>
          <div style={{borderRadius:12,border:"1px solid #EBEBEB",overflow:"hidden",marginBottom:24,background:"#fff"}}>
            {trainingEntries.map(([id,d],i,arr)=>(
              <div key={id} style={{padding:"12px 16px",borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,marginBottom:showEditor?10:0}}>
                  <div style={{minWidth:0}}>
                    <span style={{fontSize:14,fontWeight:500,color:"#0A0A0A",marginRight:10}}>{sportDisplayName(id,sportData)||"Sport"}</span>
                    <span style={{fontSize:11,color:grayText,display:"inline-block"}}>{INTENS_LABEL[d?.intensity]||"Mittel"} · {d?.days||0}× / Woche{isPro?` · ~${kcalPerSession(id,d)} kcal pro Einheit`:""}</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:400,color:"#0A0A0A",flexShrink:0}}>{d?.duration||60} min</span>
                </div>
                {showEditor&&(
                  <div style={{paddingTop:10,borderTop:"1px solid #F5F5F5"}}>
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:10,color:"#AAA",marginBottom:4}}>Intensität</div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {INTENS.map(([v,l])=><Pill key={v} label={l} active={d?.intensity===v} onClick={()=>setLocalTraining(t=>({...t,[id]:{...t[id],intensity:v}}))}/>)}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:isMobile?"minmax(0,1fr)":"repeat(2,minmax(0,1fr))",gap:12}}>
                      <div>
                        <div style={{fontSize:10,color:"#AAA",marginBottom:4}}>Einheiten / Woche</div>
                        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                          {[1,2,3,4,5,6,7].map(n=>(
                            <button key={n} className="icon-btn" onClick={()=>setLocalTraining(t=>({...t,[id]:{...t[id],days:n}}))}
                              style={{width:isMobile?32:26,height:isMobile?32:26,borderRadius:6,border:`1px solid ${d?.days===n?"#0A0A0A":"#E0E0E0"}`,background:d?.days===n?"#0A0A0A":"transparent",color:d?.days===n?"#fff":"#888",fontSize:12,fontWeight:d?.days===n?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:10,color:"#AAA",marginBottom:4}}>Ø Dauer: <strong style={{color:"#555"}}>{d?.duration||60} min</strong></div>
                        <input type="range" min="20" max="300" step="10" value={d?.duration||60} onChange={e=>setLocalTraining(t=>({...t,[id]:{...t[id],duration:+e.target.value}}))} style={{width:"100%"}}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {showEditor&&(
              <div style={{padding:"10px 16px",background:"#FAFAFA",borderTop:"1px solid #F5F5F5",fontSize:10,color:"#888",lineHeight:1.5}}>
                Änderungen gelten nach «Fertig» für deine ganze Analyse (Übersicht, Plan, Produkte).
              </div>
            )}
          </div>
        </>)}

        {/* ── ENERGIE ── */}
        {groupLabel("Energie",!isPro)}
        {cardGrid(energieCards,grid3)}

        {/* ── MAKROS ── */}
        {groupLabel("Makronährstoffe",!isPro)}
        {cardGrid(makroCards,grid3)}

        {/* ── ELEKTROLYTE & FLÜSSIGKEIT ── */}
        {groupLabel("Elektrolyte & Flüssigkeit",!isPro)}
        {cardGrid(elektrolytCards,"repeat(2,minmax(0,1fr))",8)}
        {isPro&&calc?.waterDeficit&&<div style={{background:"#FFF8E1",border:"1px solid #FFD54F",borderRadius:10,padding:"10px 14px",marginBottom:8,fontSize:11,color:"#7A5200",lineHeight:1.5}}>Du trinkst im Alltag eher wenig. Nimm die Werte unten als Ziel, verteil das Trinken über den Tag und starte gut hydriert ins Training.</div>}
        {cardGrid(wasserCards,"repeat(2,minmax(0,1fr))")}

        {/* ── LEISTUNG & HERZFREQUENZ-ZONEN ── */}
        {groupLabel("Leistung & Herzfrequenz-Zonen",!isPro)}
        {cardGrid(leistungCards,isMobile?"repeat(2,minmax(0,1fr))":leistungCards.length>3?"repeat(4,minmax(0,1fr))":"repeat(3,minmax(0,1fr))")}

        {/* ── KOHLENHYDRATE IM TRAINING ── */}
        {trainingEntries.length>0&&(<>
          {groupLabel("Kohlenhydrate im Training",!isPro)}
          {isPro?(
            <div style={{borderRadius:12,border:"1px solid #EBEBEB",overflow:"hidden",marginBottom:24,background:"#fff"}}>
              {trainingEntries.map(([id,d],i,arr)=>{
                const dur=d?.duration||60;
                const intens=d?.intensity||"medium";
                // g/h: Hauptsportart aus calcPro (carbsPerHour, gleicher Wert wie in den anderen Reitern),
                // weitere Sportarten als Richtwert nach Dauer und Intensitaet
                let carbPerH=0;
                if(id===primId&&calc?.carbsPerHour!=null&&!isNaN(+calc.carbsPerHour)) carbPerH=Math.max(0,Math.min(90,Math.round(+calc.carbsPerHour)));
                else if(dur<60) carbPerH=0;
                else if(dur<=90&&intens==="low") carbPerH=20;
                else if(dur<=90) carbPerH=45;
                else if(dur<=150) carbPerH=60;
                else carbPerH=80;
                // Strategie passend zum g/h-Wert
                let strategy="", method="", note="";
                if(carbPerH<=0){
                  strategy="Kein Zusatz nötig"; method="Wasser reicht";
                  note="Bei kurzen Einheiten reichen deine Glykogenspeicher vollständig aus.";
                } else if(carbPerH<=30){
                  strategy="Wenig Kohlenhydrate"; method="Elektrolytgetränk";
                  note="Leichte bis moderate Belastung - kleiner Zuschuss stabilisiert Blutzucker.";
                } else if(carbPerH<=50){
                  strategy="Moderat nachladen"; method="Isotonisches Getränk oder 1 Gel";
                  note="Pro Stunde: 1 Gel (25-30g) + Wasser oder isotonisches Sportgetränk (500ml).";
                } else if(carbPerH<=70){
                  strategy="Regelmässig nachladen"; method="Getränk + Gel kombinieren";
                  note="Pro Stunde: 1 Gel + 400-500ml Sportgetränk. Alle 20-30 min aufnehmen.";
                } else {
                  strategy="Maximales Nachladen (2:1)"; method="Glukose + Fruktose Mix";
                  note="Über 60g/h: Glukose+Fruktose 2:1 für max. 90g/h Aufnahme. Maurten Drink Mix oder ähnlich.";
                }
                const totalCarbTraining=Math.round(carbPerH*(dur/60));
                if(carbPerH===0&&intens==="low") return null;
                return (
                  <div key={id} style={{padding:"14px 16px",borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:500,color:"#0A0A0A",minWidth:0}}>{sportDisplayName(id,sportData)||"Sport"}</span>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:16,fontWeight:300,color:carbPerH>60?"#4A7000":"#0A0A0A",letterSpacing:"-.02em"}}>{totalCarbTraining}g</div>
                        <div style={{fontSize:10,color:grayText}}>pro Session</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,marginBottom:8}}>
                      {[
                        {l:"Pro Stunde",v:`${carbPerH}g`},
                        {l:"Strategie",v:strategy},
                        {l:"Am besten via",v:method},
                      ].map(({l,v},j)=>(
                        <div key={j} style={{padding:"8px 10px",background:"#FFFFFF",borderRadius:8,border:"1px solid #EBEBEB",minWidth:0}}>
                          <div style={{fontSize:10,fontWeight:500,color:grayText,marginBottom:2,overflowWrap:"anywhere"}}>{l}</div>
                          <div style={{fontSize:11,fontWeight:500,color:"#333",overflowWrap:"anywhere"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:10,color:grayText,lineHeight:1.5,paddingTop:6,borderTop:"1px solid #F5F5F5"}}>{note}</div>
                  </div>
                );
              })}
              <div style={{padding:"10px 16px",background:C.neonDim,borderTop:`1px solid ${C.neonBorder}`,fontSize:10,color:"#4A7000",lineHeight:1.5,fontWeight:500}}>
                Richtwerte nach ACSM & IOC. Bei Rennen oder Wettkämpfen 20-30% mehr einplanen. Verträglichkeit individuell testen.
              </div>
            </div>
          ):(
            <button type="button" onClick={onUpgrade} aria-label="Kohlenhydrate im Training: mit PRO freischalten"
              style={{display:"block",width:"100%",textAlign:"left",borderRadius:12,border:"1px solid #EBEBEB",overflow:"hidden",marginBottom:24,background:"#fff",padding:0,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
              {trainingEntries.map(([id],i,arr)=>(
                <div key={id} style={{padding:"12px 16px",borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                  <span style={{fontSize:13,fontWeight:500,color:"#0A0A0A",minWidth:0,overflowWrap:"anywhere"}}>{sportDisplayName(id,sportData)||"Sport"}</span>
                  <span style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <ProLock w={56}/>
                    <span style={{fontSize:10,color:grayText}}>g pro Session</span>
                  </span>
                </div>
              ))}
            </button>
          )}
        </>)}

        {/* ── SUPPLEMENT-TIMING ── */}
        {timingRecs?.note&&(isPro?(
          <div style={{marginBottom:20,padding:"14px 16px",borderRadius:12,background:C.neonDim,border:`1px solid ${C.neon}`}}>
            <div style={{fontSize:12,fontWeight:500,color:"#4A7000",fontFamily:"Inter,sans-serif",marginBottom:8}}>{`Supplement-Timing für dich · ${TIME_LABEL}`}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8,marginBottom:8}}>
              {[
                {l:"Pre-Workout",v:timingRecs.preWorkout},
                {l:"Post-Workout",v:timingRecs.postWorkout},
                {l:"Kreatin",v:timingRecs.creatine},
              ].map(({l,v},i)=>v&&(
                <div key={i} style={{background:"rgba(0,0,0,.04)",borderRadius:8,padding:"8px 10px",textAlign:"center",minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.black,marginBottom:2,overflowWrap:"anywhere"}}>{v}</div>
                  <div style={{fontSize:10,color:"#4A7000",overflowWrap:"anywhere"}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,color:"#2D4A00",lineHeight:1.5}}>{timingRecs.note}</div>
          </div>
        ):(<>
          {groupLabel("Supplement-Timing für dich",true)}
          <button type="button" onClick={onUpgrade} aria-label="Supplement-Timing: mit PRO freischalten"
            style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8,width:"100%",marginBottom:20,padding:"14px 16px",borderRadius:12,background:"#fff",border:"1px solid #EBEBEB",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            {["Pre-Workout","Post-Workout","Kreatin"].map(l=>(
              <span key={l} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,minWidth:0}}>
                <ProLock w={52}/>
                <span style={{fontSize:10,color:grayText,overflowWrap:"anywhere"}}>{l}</span>
              </span>
            ))}
          </button>
        </>))}
      </div>
    );
  };

  // ── CART TAB ───────────────────────────────────────────────────────────────
  const CartTab=()=>{
    const [cart,setCart]=useState(()=>{
      try{ return JSON.parse(localStorage.getItem("treyn_cart")||"[]"); }catch{ return []; }
    });
    const [,setCartTick]=useState(0);

    // Burgerstein (Daten wie in SupplementsContent, ids laut Vertrag)
    const BURGERSTEIN_PRODUKTE=[
      {id:"bs_sport",     name:"Burgerstein Sport",      dose:"1 Tablette täglich",   shop:"nu3.ch",   price:"CHF 29.90", link:"https://www.nu3.ch/products/burgerstein-sport"},
      {id:"bs_magnesium", name:"Burgerstein Magnesium",  dose:"300-400mg abends",     shop:"nu3.ch",   price:"CHF 24.90", link:"https://www.nu3.ch/products/burgerstein-magnesium-vital"},
      {id:"bs_omega3",    name:"Burgerstein Omega-3",    dose:"2-3g täglich",         shop:"Zur Rose", price:"CHF 34.90", link:"https://www.zur-rose.ch/de/burgerstein-omega-3"},
      {id:"bs_vitd",      name:"Burgerstein Vitamin D3", dose:"2000-4000 IE täglich", shop:"nu3.ch",   price:"CHF 19.90", link:"https://www.nu3.ch/products/burgerstein-vitamin-d3"},
      {id:"bs_zink",      name:"Burgerstein Zink",       dose:"15mg täglich",         shop:"Zur Rose", price:"CHF 22.90", link:"https://www.zur-rose.ch/de/burgerstein-zink"},
    ];

    // Alle Produkte aus denselben Listen wie die Karten (Supplements, Burgerstein, Sportnahrung, Wearables, Recovery Gear)
    const toCartItem=(category)=>(p)=>({id:p?.id,name:p?.name||"",dose:p?.dose||"",shop:p?.shop||"iHerb",link:p?.link||"#",category,price:p?.price||""});
    const RAW_PRODUCTS=[
      ...[...(primSupps||[]),...(secSupps||[])].map(toCartItem("Supplement")),
      ...BURGERSTEIN_PRODUKTE.map(toCartItem("Supplement")),
      ...(SN_ENERGIE_PRODUKTE||[]).map(toCartItem("Sportnahrung")),
      ...(SN_PROTEIN_PRODUKTE||[]).map(toCartItem("Protein")),
      ...(SN_RECOVERY_PRODUKTE||[]).map(toCartItem("Recovery")),
      ...[...(sportNutrition?.primary||[]),...(sportNutrition?.secondary||[])].map(toCartItem("Sportnahrung")),
      // Wearables
      ...(WEARABLES||[]).map(w=>({id:`wear_${(w?.name||"").replace(/\s/g,"_")}`,name:w?.name||"",dose:"",shop:w?.shops?.[0]?.name||"Shop",link:w?.shops?.[0]?.link||"#",category:"Wearable",price:w?.price||""})),
      // Recovery Gear
      {id:"rec_therabody",name:"Therabody",dose:"",shop:"Therabody",link:"https://www.therabody.com/de-ch",category:"Recovery Gear",price:""},
      {id:"rec_hyperice",name:"Hyperice / Normatec",dose:"",shop:"Hyperice",link:"https://hyperice.com/",category:"Recovery Gear",price:""},
      {id:"rec_blackroll",name:"Blackroll",dose:"",shop:"Blackroll",link:"https://www.blackroll.com/ch-de",category:"Recovery Gear",price:""},
      {id:"rec_compex",name:"Compex",dose:"",shop:"Compex",link:"https://www.compex.com/ch-de",category:"Recovery Gear",price:""},
    ];
    // Doppelte ids nur einmal (erste Fundstelle gewinnt)
    const seenCartIds=new Set();
    const ALL_PRODUCTS=RAW_PRODUCTS.filter(p=>{
      if(!p?.id||seenCartIds.has(p.id)) return false;
      seenCartIds.add(p.id); return true;
    });

    let owned=[];
    try{ const parsed=JSON.parse(localStorage.getItem("treyn_owned")||"[]"); owned=Array.isArray(parsed)?parsed:[]; }catch{ owned=[]; }
    const cartList=Array.isArray(cart)?cart:[];
    const cartItems=ALL_PRODUCTS.filter(p=>owned.includes(p.id)||cartList.includes(p.id));

    // Group by shop
    const byShop={};
    cartItems.forEach(p=>{
      if(!byShop[p.shop]) byShop[p.shop]={shop:p.shop,items:[],link:p.link};
      byShop[p.shop].items.push(p);
    });
    const shopCount=Object.keys(byShop).length;

    // Shop-Link: bekannte Shops gesammelt, sonst der Link des ersten Produkts
    const getShopUrl=(shop,items)=>{
      const q=encodeURIComponent((items||[]).map(i=>i.name).join(" "));
      const urls={
        "Maurten":"https://www.maurten.com/collections/all?ref=TREYN",
        "MNSTRY":"https://mnstry.com/collections/all?ref=TREYN",
        "iHerb":`https://www.iherb.com/search?kw=${q}&rcode=DEIN_CODE`,
        "Myprotein":`https://www.myprotein.com/search?query=${q}&affil=DEIN_CODE`,
        "Sponser":"https://www.sponser.ch/de?ref=TREYN",
        "ESN":"https://www.esn.com/collections/all?ref=TREYN",
        "More Nutrition":"https://www.more-nutrition.de/collections/all?ref=TREYN",
        "Therabody":"https://www.therabody.com/de-ch/collections/all",
        "Hyperice":"https://hyperice.com/collections/all",
        "Blackroll":"https://www.blackroll.com/ch-de/collections/all",
        "Compex":"https://www.compex.com/ch-de/collections/all",
      };
      return urls[shop]||items?.[0]?.link||"#";
    };

    // Alles leeren ohne Neuladen - die Analyse bleibt erhalten
    const clearAll=()=>{
      if(!window.confirm("Alle Produkte aus der Merkliste entfernen? Deine Analyse und deine Angaben bleiben erhalten.")) return;
      try{ localStorage.setItem("treyn_owned","[]"); localStorage.setItem("treyn_cart","[]"); }catch{}
      setCart([]);
      setCartTick(t=>t+1);
    };

    if(cartItems.length===0) return (
      <div>
        <h3 style={{fontSize:15,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.01em"}}>Merkliste</h3>
        <p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.5}}>Alle gemerkten Produkte gesammelt - direkt zum Partnershop.</p>
        <div style={{padding:"28px 20px",textAlign:"center",background:"#FAFAFA",borderRadius:14,border:"1px solid #EBEBEB"}}>
          <div style={{fontSize:14,fontWeight:500,color:C.black,marginBottom:6}}>Noch nichts gemerkt</div>
          <div style={{fontSize:12,color:"#AAA",lineHeight:1.6}}>Tippe bei einem Produkt auf «+ Merken» - es erscheint dann automatisch hier, nach Shop sortiert.</div>
        </div>
      </div>
    );

    return (
      <div>
        <h3 style={{fontSize:15,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.01em"}}>Merkliste</h3>
        <p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.5}}>{`${cartItems.length} ${cartItems.length===1?"Produkt":"Produkte"} bei ${shopCount} ${shopCount===1?"Shop":"Shops"} - direkt zur Bestellung.`}</p>

        {/* Info */}
        <div style={{marginBottom:16,padding:"10px 14px",background:C.neonDim,borderRadius:10,border:`1px solid ${C.neon}`,fontSize:11,color:"#4A7000",lineHeight:1.6}}>
          «Zum Shop» öffnet den Anbieter, damit du dort alles in einer Bestellung kaufen kannst. Bei iHerb und Myprotein ist die Suche mit deinen Produkten vorausgefüllt. Mit «direkt» öffnest du ein einzelnes Produkt.
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {Object.values(byShop).map((group,i)=>{
            const shopUrl=getShopUrl(group.shop,group.items);
            const n=group.items.length;
            return (
              <div key={i} style={{borderRadius:14,border:"1px solid #EBEBEB",overflow:"hidden",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
                {/* Shop Header */}
                <div style={{background:C.neon,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",minWidth:0}}>
                    <span style={{fontSize:14,fontWeight:700,color:C.black,letterSpacing:"-.01em",overflowWrap:"anywhere"}}>{group.shop}</span>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"rgba(0,0,0,.08)",color:C.black,fontFamily:"Inter,sans-serif",fontWeight:500}}>{`${n} ${n===1?"Produkt":"Produkte"}`}</span>
                  </div>
                  <a href={shopUrl} target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:5,background:C.white,color:C.black,padding:"7px 14px",borderRadius:8,fontSize:11,fontWeight:700,textDecoration:"none",flexShrink:0}}>
                    Zum Shop ↗
                  </a>
                </div>
                {/* Products */}
                <div>
                  {group.items.map((p,j)=>(
                    <div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:j<group.items.length-1?"1px solid #F5F5F5":"none"}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:500,color:C.black,overflowWrap:"anywhere"}}>{p.name}</div>
                        <div style={{display:"flex",gap:6,marginTop:2,flexWrap:"wrap"}}>
                          {isPro&&p.dose&&<span style={{fontSize:11,color:"#888",fontFamily:"Inter,sans-serif"}}>{p.dose}</span>}
                          <span style={{fontSize:10,padding:"1px 7px",borderRadius:6,background:"#F5F5F5",color:"#888",fontFamily:"Inter,sans-serif",fontWeight:500}}>{p.category}</span>
                          {p.price&&<span style={{fontSize:10,color:"#4A7000",fontWeight:600}}>{p.price}</span>}
                        </div>
                      </div>
                      <a href={p.link} target="_blank" rel="noopener noreferrer"
                        style={{fontSize:10,color:"#AAA",textDecoration:"none",flexShrink:0,marginLeft:8}}>
                        direkt ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Clear button */}
        <div style={{marginTop:16,textAlign:"center"}}>
          <button onClick={clearAll}
            style={{background:"transparent",border:"1px solid #EBEBEB",color:"#AAA",borderRadius:8,padding:"8px 16px",fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            Alle Markierungen entfernen
          </button>
        </div>
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
      {id:"sn_mau_gel",name:"Maurten Gel 100",dose:"1 Gel alle 30-40 min",when:"Während Training",protocol:{timing:"Während Training · alle 30-40 min"}},
      {id:"sn_mau_320",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Während Training",protocol:{timing:"Während Training · pro Stunde"}},
      {id:"sn_mau_caf_2",name:"Maurten Gel 100 CAF",dose:"1 Gel alle 40-45 min",when:"Während Training",protocol:{timing:"Während Training · bei Rennen"}},
      {id:"sn_mn_gel",name:"MNSTRY Intensity Gel",dose:"1 Gel alle 30-45 min",when:"Während Training",protocol:{timing:"Während Training"}},
      {id:"sn_mn_heat_2",name:"MNSTRY Fast Carb Heat",dose:"1 Portion",when:"Vor Training",protocol:{timing:"30 min vor Training"}},
      {id:"sn_elek_2",name:"Sponser Elektrolyt-Tabs",dose:"1 Tab / 500ml",when:"Während Training",protocol:{timing:"Während Training · zum Wasser"}},
      {id:"sn_sp_gel",name:"Sponser Liquid Energy",dose:"1 Beutel alle 45 min",when:"Während Training",protocol:{timing:"Während Training"}},
    ];
    SN_DATA.forEach(s=>{ if(!seen.has(s.id)){ seen.add(s.id); allSupps.push({...s,tags:["Sportnahrung"]}); } });

    const ownedSupps=allSupps.filter(s=>owned.includes(s.id));

    // Tagesplan: group by timing
    const TIMING_ORDER=[
      {key:"morgens",    label:"Morgens",           desc:"Am besten nüchtern oder zum Frühstück"},
      {key:"mittags",    label:"Mittags / Training",desc:"Rund ums Training oder zur Mittagsmahlzeit"},
      {key:"abends",     label:"Abends",            desc:"Abends, 1-2h vor dem Schlafen"},
      {key:"training",   label:"Während Training",  desc:"Direkt während der Einheit"},
      {key:"post",       label:"Nach Training",     desc:"Innerhalb 30 Min. nach dem Training"},
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
        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Deine Produkte</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:24,lineHeight:1.5}}>Hier siehst du alle Produkte, die du gemerkt hast - mit Einnahme-Zeitpunkt.</p>
        <div style={{padding:"32px 20px",textAlign:"center",background:"#FAFAFA",borderRadius:14,border:"1px solid #EBEBEB"}}>
          <div style={{fontSize:14,fontWeight:500,color:C.black,marginBottom:6}}>Noch keine Produkte erfasst</div>
          <div style={{fontSize:12,color:"#AAA",lineHeight:1.6}}>Tippe bei einem Produkt auf «+ Merken» - es erscheint dann automatisch hier mit Einnahme-Zeitpunkt.</div>
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
        {/* TREYN Score Hero - kompakt */}
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
            <div style={{fontSize:10,color:"#4A7000"}}>{nextLevel?`Noch ${nextLevel.min-score} bis ${nextLevel.next}`:"Maximum erreicht"}</div>
            <div style={{display:"flex",gap:14}}>
              {[
                {l:"Erfasst",v:score},
                {l:"Pflicht",v:`${primOwned}/${primSupps.length}`},
                {l:"Komplett",v:`${primSupps.length>0?Math.round((primOwned/primSupps.length)*100):0}%`},
              ].map(({l,v},i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#0A0A0A"}}>{v}</div>
                  <div style={{fontSize:10,color:"#4A7000",fontWeight:500}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Deine Produkte</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.5}}>{score} Produkt{score!==1?"e":""} · automatisch aus deinen Markierungen</p>

        {/* Tagesplan */}
        <div style={{fontSize:12,fontWeight:500,color:"#AAA",marginBottom:10,fontFamily:"Inter,sans-serif"}}>Einnahme nach Tageszeit</div>
        <div style={{borderRadius:14,border:"1px solid #EBEBEB",overflow:"hidden",marginBottom:28,background:"#fff"}}>
          {TIMING_ORDER.filter(t=>byTiming[t.key]?.length>0).map((timing,i,arr)=>(
            <div key={timing.key} style={{borderBottom:i<arr.length-1?"1px solid #F5F5F5":"none"}}>
              {/* Time header */}
              <div style={{padding:"10px 16px 8px",background:"#FAFAFA",borderBottom:"1px solid #F5F5F5",display:"flex",alignItems:"center",gap:8}}>
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
        <div style={{fontSize:12,fontWeight:500,color:"#AAA",marginBottom:10,fontFamily:"Inter,sans-serif"}}>Alle Produkte ({ownedSupps.length})</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>
          {ownedSupps.map((s,i)=>(
            <div key={s.id} style={{background:"#fff",borderRadius:11,border:"1px solid #EBEBEB",padding:"12px 14px",boxShadow:"0 1px 3px rgba(0,0,0,.04)"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#0A0A0A",marginBottom:2,lineHeight:1.3}}>{s.name}</div>
              <div style={{fontSize:11,color:"#888",fontFamily:"Inter,sans-serif",marginBottom:6}}>{s.dose}</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.neon,flexShrink:0}}/>
                <div style={{fontSize:10,color:"#888"}}>{TIMING_ORDER.find(t=>t.key===getTiming(s))?.label||""}</div>
              </div>
              {s.tags&&<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:6}}>{s.tags.slice(0,2).map(t=><span key={t} style={{fontSize:10,padding:"1px 6px",borderRadius:6,background:"#F5F5F5",color:"#888",fontFamily:"Inter,sans-serif",fontWeight:500}}>{t}</span>)}</div>}
            </div>
          ))}
        </div>

        <div style={{marginTop:16,padding:"10px 14px",background:"#FAFAFA",borderRadius:10,border:"1px solid #EBEBEB",fontSize:11,color:"#AAA",lineHeight:1.6}}>
          Produkte hinzufügen: Tippe bei einem Produkt auf «+ Merken». Entfernen kannst du es am selben Ort.
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
          <span style={{fontSize:11,fontWeight:600,color:C.black}}>{"Kontakt"}</span>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{fontSize:12,color:"#333",lineHeight:1.9,marginBottom:12}}>
            <div style={{fontWeight:700,color:C.black,fontSize:13,marginBottom:4}}>WBCS GmbH</div>
            <div>Berufsschulstrasse 18</div>
            <div>8866 Ziegelbrücke, Schweiz</div>
            <div style={{marginTop:6,color:C.g600}}>Geschäftsführer: Kevin Oberholzer</div>
          </div>
          <a href="mailto:info@treynplus.com"
            style={{display:"inline-flex",alignItems:"center",gap:6,background:C.neon,color:"#000",padding:"8px 16px",borderRadius:9,fontSize:11,fontWeight:700,textDecoration:"none"}}>
            info@treynplus.com
          </a>
        </div>
      </div>

      {/* Datenschutz */}
      <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
        <div style={{background:C.g100,padding:"12px 16px",borderBottom:`1px solid ${C.g200}`}}>
          <span style={{fontSize:11,fontWeight:600,color:C.black}}>{"Datenschutz"}</span>
        </div>
        <div style={{padding:"16px",fontSize:11,color:C.g600,lineHeight:1.8}}>
          <strong style={{color:C.black,fontWeight:600}}>Speicherung.</strong> Es gibt kein Konto und keine Registrierung. Deine Angaben (Sport, Training, Körperdaten, Ernährung, Allergien) werden nur lokal in deinem Browser auf diesem Gerät gespeichert, nicht auf einem Server von TREYN+. Mit «Alle Angaben löschen» im Profil entfernst du sie wieder.
          <br/><br/>
          <strong style={{color:C.black,fontWeight:600}}>KI-Funktionen.</strong> Für den AI Chat, die KI-Einschätzung deines Trainings und die Bluttest-Auswertung nutzt TREYN+ den Dienst Anthropic (USA). Dabei werden deine Frage bzw. Angaben aus deinem Profil (z. B. Sportart, Training, Gewicht, Geschlecht) übermittelt, bei der Bluttest-Auswertung das hochgeladene PDF. Dieses enthält Gesundheitsdaten und meist auch deinen Namen. Name und E-Mail aus deinem Profil werden nicht mitgeschickt.
          <br/><br/>
          <strong style={{color:C.black,fontWeight:600}}>Weitere Anbieter.</strong> Schriften werden von Google Fonts (Google, USA) geladen, einzelne Produktbilder von Open Food Facts. Dabei wird deine IP-Adresse an diese Anbieter übermittelt. Die Zahlung für PRO läuft über Stripe, TREYN+ sieht keine Kartendaten.
          <br/><br/>
          <strong style={{color:C.black,fontWeight:600}}>Affiliate-Links.</strong> Links zu Partnershops (z. B. iHerb, Maurten) enthalten einen Partner-Parameter, damit der Shop die Provision zuordnen kann. Was der Shop danach erfasst, regelt seine eigene Datenschutzerklärung. TREYN+ selbst setzt keine Cookies und nutzt keine Analyse-Tools.
          <br/><br/>
          Fragen zum Datenschutz, Auskunft oder Löschung: <span style={{color:C.black,fontWeight:600}}>info@treynplus.com</span>
        </div>
      </div>

      {/* Nutzungsbedingungen */}
      <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
        <div style={{background:C.g100,padding:"12px 16px",borderBottom:`1px solid ${C.g200}`}}>
          <span style={{fontSize:11,fontWeight:600,color:C.black}}>{"Nutzungsbedingungen"}</span>
        </div>
        <div style={{padding:"16px",fontSize:11,color:C.g600,lineHeight:1.8}}>
          TREYN+ ist eine digitale Ernährungs- und Supplement-Empfehlungsplattform. Alle Empfehlungen basieren auf allgemeinen Ernährungsrichtlinien und ersetzen keine medizinische Beratung. Die Nutzung erfolgt auf eigene Verantwortung.
          <br/><br/>
          WBCS GmbH übernimmt keine Haftung für Schäden, die durch die Anwendung der Empfehlungen entstehen. Mit der Nutzung der Plattform stimmst du diesen Bedingungen zu. Änderungen dieser Bedingungen werden hier veröffentlicht.
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
            {l:"Geschäftsführer",v:"Kevin Oberholzer"},
            {l:"E-Mail",v:"info@treynplus.com"},
            {l:"Rechtsform",v:"GmbH, Handelsregister Kanton Glarus"},
            // UID: echte Nummer (Format CHE-123.456.789) eintragen, dann erscheint die Zeile. Leer = ausgeblendet.
            {l:"UID",v:""},
            {l:"Affiliate-Hinweis",v:"Diese Plattform enthält Affiliate-Links. Bei Käufen über diese Links erhalten wir eine Provision - für dich entstehen keine Mehrkosten."},
          ].filter(r=>r.v).map((r,i,arr)=>(
            <div key={r.l} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.g100}`:"none"}}>
              <span style={{fontSize:11,color:"#AAA",minWidth:80,flexShrink:0}}>{r.l}</span>
              <span style={{fontSize:11,color:C.black,lineHeight:1.5,minWidth:0,overflowWrap:"anywhere"}}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div style={{marginTop:10,padding:"14px 16px",background:C.g100,borderRadius:12,border:`0.5px solid ${C.g200}`}}>
        <div style={{fontSize:11,fontWeight:500,color:C.g600,marginBottom:6,fontFamily:"Inter,sans-serif"}}>© {new Date().getFullYear()} TREYN+ · WBCS GmbH</div>
        <div style={{fontSize:11,color:C.g400,lineHeight:1.7}}>
          Alle Inhalte, Berechnungsmodelle, Algorithmen, Texte und das Design dieser Plattform sind urheberrechtlich geschützt. Jede Vervielfältigung, Nachahmung oder Nutzung - auch auszugsweise oder durch KI-gestützte Tools - ohne ausdrückliche schriftliche Genehmigung der WBCS GmbH ist untersagt. Zuwiderhandlungen werden zivilrechtlich verfolgt.
        </div>
        <div style={{marginTop:10,paddingTop:10,borderTop:`0.5px solid ${C.g200}`,fontSize:10,color:C.g300}}>
          {"Verstösse melden:"} info@treynplus.com
        </div>
      </div>

      {/* B2B Link */}
      <div style={{marginTop:16,padding:"12px 16px",border:`0.5px solid ${C.g200}`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:2}}>{"Für Unternehmen & Partner"}</div>
          <div style={{fontSize:11,color:C.g400}}>{"Widget · API · White-Label"}</div>
        </div>
        <a href="https://www.treyn.ch/business" target="_blank" rel="noopener noreferrer"
          style={{fontSize:11,padding:"6px 14px",borderRadius:7,background:C.neon,color:C.black,fontWeight:600,textDecoration:"none",flexShrink:0}}>
          Mehr →
        </a>
      </div>
    </div>
  );

  // ── PROFIL TAB ─────────────────────────────────────────────────────────────
  const ProfilTab=()=>{
    const [orders]=useState(()=>{ try{ return parseInt(localStorage.getItem("treyn_orders")||"0")||0; }catch{ return 0; } });
    const isFemale=profilData?.gender==="f";
    const profSports=(sportData?.selectedSports||[]).length?(sportData?.selectedSports||[]):Object.keys(trainingData||{});

    // Optionen exakt wie im Onboarding (StepLebensstil / StepTraining)
    const OPT_JOB=[
      {id:"sedentary",   l:"Sitzend",          d:"Büro, Homeoffice, Computer - kaum Bewegung"},
      {id:"light",       l:"Leicht aktiv",     d:"Lehrer, Arzt, stehend aber wenig laufend"},
      {id:"moderate",    l:"Mässig aktiv",     d:"Kellner, Verkäufer, regelmässig gehend"},
      {id:"very_active", l:"Sehr aktiv",       d:"Bauarbeiter, Handwerker, körperliche Arbeit"},
    ];
    const OPT_SLEEP=[
      {id:"5",l:"≤ 5h",d:"Chronisch wenig"},
      {id:"6",l:"6h",d:"Zu wenig"},
      {id:"7",l:"7h",d:"Ok"},
      {id:"8",l:"8h+",d:"Optimal"},
    ];
    const OPT_WATER=[
      {id:"low",    l:"< 1L",   d:"Zu wenig"},
      {id:"medium", l:"1-2L",   d:"Durchschnitt"},
      {id:"good",   l:"2-3L",   d:"Gut"},
      {id:"high",   l:"> 3L",   d:"Sehr gut"},
    ];
    const OPT_SUN=[
      {id:"none",     l:"Kaum / indoor",  d:"Büro, training indoor, wenig draussen"},
      {id:"low",      l:"< 30 min",        d:"Kurzer Weg, gelegentlich draussen"},
      {id:"moderate", l:"30-60 min",       d:"Mittagspause draussen, Outdoor-Training"},
      {id:"high",     l:"> 60 min",        d:"Viel Outdoor-Training, Garten, Handwerk"},
    ];
    const OPT_CAFF=[
      {id:"none",   l:"Kein Koffein",     d:"Kaffee-frei, kein Tee"},
      {id:"low",    l:"1-2 Tassen Kaffee",d:"~100-200mg täglich"},
      {id:"medium", l:"3-4 Tassen",       d:"~300-400mg täglich"},
      {id:"high",   l:"> 4 Tassen",       d:"> 400mg - hohe Toleranz"},
    ];
    const OPT_BODY=[
      {id:"lean",     l:"Sehr muskulös / lean", d:"Wenig Körperfett, viel Muskelmasse"},
      {id:"athletic", l:"Athletisch",            d:"Normaler Sportler-Körper"},
      {id:"average",  l:"Durchschnitt",          d:"Normale Körperzusammensetzung"},
      {id:"higher_bf",l:"Etwas mehr KFA",        d:"Etwas Übergewicht, Abnehm-Ziel"},
    ];
    const OPT_CYCLE=[
      {id:"follikel",  l:"Follikelphase",     d:"Tag 1-14 - nach Periode, mehr Energie"},
      {id:"ovulation", l:"Ovulation",         d:"Tag 14-16 - Hochform, Peak-Performance"},
      {id:"luteal",    l:"Lutealphase",       d:"Tag 15-28 - mehr Hunger, mehr Magnesium"},
      {id:"period",    l:"Periode",           d:"Höchster Eisenverlust, mehr Bedarf"},
      {id:"pcos",      l:"PCOS",              d:"Polyzystisches Ovarsyndrom"},
      {id:"menopause", l:"Menopause / Post",  d:"Andere Hormonlage"},
    ];
    const OPT_INJ=[{id:"none",l:"Keine"},{id:"knee",l:"Knie"},{id:"back",l:"Rücken"},{id:"shoulder",l:"Schulter"},{id:"ankle",l:"Knöchel / Fuss"},{id:"muscle",l:"Muskel"},{id:"tendon",l:"Sehnen"}];
    const OPT_INT=[
      {id:"low",l:"Leicht",d:"Erholung, Basis"},
      {id:"medium",l:"Mittel",d:"Normales Training"},
      {id:"high",l:"Hart",d:"Strukturiert, hart"},
      {id:"competition",l:"Wettkampf",d:"Rennen & Spiele"},
    ];
    const SUPP_LABELS={none:"Keine",kreatin:"Kreatin",protein:"Protein/Whey",vitd:"Vit. D",omega3:"Omega-3",magnesium:"Magnesium",koffein:"Koffein",eisen:"Eisen",zink:"Zink",ashwa:"Ashwagandha",collagen:"Kollagen",beta_ala:"Beta-Alanin"};
    const MED_LABELS={none:"Keine",blutverd:"Blutverdünner",schilddruese:"Schilddrüse",blutdruck:"Blutdruck"};
    const lbl=(opts,id)=>((opts||[]).find(o=>o.id===id)||{}).l;
    const sportName=(id)=>SPORT_GROUPS.find(g=>g.id===id)?.label||id;
    // Schlaf: eine Quelle (sleepHours als Kachel). Alte Zahl (sleep) wird auf die Kachel abgebildet.
    const sleepToTile=(v)=>{ const n=parseFloat(String(v??"").replace(",",".")); if(!n) return ""; return String(Math.min(8,Math.max(5,Math.round(n)))); };

    const freshForm=()=>{
      const tr={};
      (profSports||[]).forEach(id=>{
        const d=trainingData?.[id]||{};
        tr[id]={days:+d.days||3,duration:+d.duration||60,intensity:d.intensity||"medium",hasCompetition:!!d.hasCompetition,compCount:+d.compCount||5,compTypes:Array.isArray(d.compTypes)?d.compTypes:[]};
      });
      return {
        weight: profilData?.weight||"",
        height: profilData?.height||"",
        rhr:    profilData?.rhr||"",
        sleepHours:     profilData?.sleepHours?String(profilData.sleepHours):sleepToTile(profilData?.sleep),
        stressLevel:    profilData?.stressLevel||3,
        dietQuality:    profilData?.dietQuality||"good",
        altitude:       profilData?.altitude||"low",
        recoveryStatus: profilData?.recoveryStatus||"good",
        currentSupps:   profilData?.currentSupps||[],
        medications:    profilData?.medications||[],
        monthlyBudget:  profilData?.monthlyBudget||"medium",
        goal:           profilData?.goal||"performance",
        jobActivity:    profilData?.jobActivity||null,
        waterIntake:    profilData?.waterIntake||null,
        sunExposure:    profilData?.sunExposure||null,
        caffeineDaily:  profilData?.caffeineDaily||null,
        bodyComposition:profilData?.bodyComposition||null,
        cyclePhase:     profilData?.cyclePhase||null,
        injuries:       profilData?.injuries||[],
        training:       tr,
      };
    };

    // Gedächtnis (PROFIL_UI): Entwurf nur behalten, solange die Daten dieselben sind
    if(!PROFIL_UI.base||PROFIL_UI.base[0]!==profilData||PROFIL_UI.base[1]!==trainingData){
      PROFIL_UI.base=[profilData,trainingData];
      PROFIL_UI.edit=false;
      PROFIL_UI.form=null;
      if(Date.now()-(PROFIL_UI.savedAt||0)>5000) PROFIL_UI.open=false;
    }
    const [showPersonal,setShowPersonal]=useState(()=>!!PROFIL_UI.open);
    const [editMode,setEditMode]=useState(()=>!!PROFIL_UI.edit&&!!PROFIL_UI.form);
    const [editForm,setEditForm]=useState(()=>PROFIL_UI.edit&&PROFIL_UI.form?PROFIL_UI.form:freshForm());
    const [savedAt,setSavedAt]=useState(()=>PROFIL_UI.savedAt||0);
    useEffect(()=>{ if(editMode) PROFIL_UI.form=editForm; },[editForm,editMode]);

    const togglePersonal=()=>{ const v=!showPersonal; PROFIL_UI.open=v; setShowPersonal(v); };
    const startEdit=()=>{
      const f=freshForm();
      PROFIL_UI.open=true; PROFIL_UI.edit=true; PROFIL_UI.form=f; PROFIL_UI.savedAt=0;
      setEditForm(f); setSavedAt(0); setShowPersonal(true); setEditMode(true);
    };
    const cancelEdit=()=>{ PROFIL_UI.edit=false; PROFIL_UI.form=null; setEditMode(false); };

    const setEF=(k,v)=>setEditForm(f=>({...f,[k]:v}));
    const toggleEFArr=(k,v)=>setEditForm(f=>{
      const curr=(f[k]||[]).filter(x=>x!=="none");
      if(v==="none") return {...f,[k]:["none"]};
      return {...f,[k]:curr.includes(v)?curr.filter(x=>x!==v):[...curr,v]};
    });
    const setTR=(id,k,v)=>setEditForm(f=>{
      const tr=f.training||{};
      return {...f,training:{...tr,[id]:{...(tr[id]||{}),[k]:v}}};
    });
    const toggleCompType=(id,type)=>setEditForm(f=>{
      const tr=f.training||{};
      const cur=(tr[id]?.compTypes)||[];
      const next=cur.includes(type)?cur.filter(t=>t!==type):[...cur,type];
      return {...f,training:{...tr,[id]:{...(tr[id]||{}),compTypes:next}}};
    });

    const numOr=(v,old)=>{ const n=parseFloat(String(v??"").replace(",",".")); return n>0?String(n):(old??""); };
    const saveEdit=()=>{
      const {training,...prof}=editForm;
      const patch={...prof,
        weight:numOr(prof.weight,profilData?.weight),
        height:numOr(prof.height,profilData?.height),
        rhr:String(prof.rhr??"").trim()===""?"":numOr(prof.rhr,profilData?.rhr),
      };
      // Schlaf vereinheitlichen: die Kachel (sleepHours) gilt, die alte Zahl (sleep) wird angeglichen.
      // Nur aus der alten Zahl abgeleitet und nicht geändert: nichts überschreiben (7.5h bleibt 7.5h).
      const tileFromSleep=sleepToTile(profilData?.sleep);
      if(!patch.sleepHours||(!profilData?.sleepHours&&patch.sleepHours===tileFromSleep)) delete patch.sleepHours;
      else if(tileFromSleep!==patch.sleepHours) patch.sleep=patch.sleepHours;
      if(!isFemale) delete patch.cyclePhase;
      if(typeof onProfilChange==="function") onProfilChange(patch);
      if(typeof onTrainingChange==="function"&&Object.keys(training||{}).length){
        const nextTD={...(trainingData||{})};
        Object.entries(training||{}).forEach(([id,t])=>{ nextTD[id]={...(trainingData?.[id]||{}),...(t||{})}; });
        onTrainingChange(nextTD);
      }
      const now=Date.now();
      PROFIL_UI.edit=false; PROFIL_UI.form=null; PROFIL_UI.open=true; PROFIL_UI.savedAt=now;
      setSavedAt(now); setShowPersonal(true); setEditMode(false);
    };
    const justSaved=!editMode&&savedAt>0&&Date.now()-savedAt<15000;

    const TIERS=[
      {min:0,  max:9,   id:"none",     label:null,       color:C.g400},
      {min:10, max:19,  id:"silver",   label:"Silver",   color:"#8A9BA8"},
      {min:20, max:49,  id:"gold",     label:"Gold",     color:"#B8922A"},
      {min:50, max:99,  id:"platinum", label:"Platinum", color:"#6B7FA3"},
      {min:100,max:9999,id:"black",    label:"Black",    color:C.black},
    ];
    const currentTier=TIERS.slice().reverse().find(t=>orders>=t.min)||TIERS[0];
    const nextTier=TIERS.find(t=>t.min>orders);
    const hasStatus=currentTier.id!=="none";
    const progress=nextTier?((orders-(currentTier?.min||0))/(nextTier.min-(currentTier?.min||0)))*100:100;

    // Kleine Bausteine für das Formular (als Funktionen, nicht als Komponenten: Eingaben verlieren so nicht den Fokus)
    const secTitle=(t,first=false)=>(<div style={{fontSize:12,fontWeight:500,color:C.g400,fontFamily:"Inter,sans-serif",margin:first?"0 0 10px":"18px 0 10px",paddingTop:first?0:12,borderTop:first?"none":`1px solid ${C.g100}`}}>{t}</div>);
    const fLabel=(t,sub)=>(<div style={{fontSize:11,color:C.g600,marginBottom:6,lineHeight:1.4}}>{t}{sub&&<span style={{color:C.g400}}>{` · ${sub}`}</span>}</div>);
    const optTiles=(k,opts,cols=2)=>(
      <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,gap:6}}>
        {(opts||[]).map(o=>{
          const on=editForm[k]===o.id;
          return (
            <button key={o.id} type="button" onClick={()=>setEF(k,o.id)}
              style={{minWidth:0,padding:"8px 10px",borderRadius:9,border:`1.5px solid ${on?C.neon:C.g200}`,background:on?"#F5FFE0":C.white,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"left",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <span style={{fontSize:11,fontWeight:on?700:600,lineHeight:1.3,overflowWrap:"anywhere"}}>{o.l}</span>
              {o.d&&<span style={{fontSize:10,color:on?"#555":C.g400,marginTop:2,lineHeight:1.35,overflowWrap:"anywhere"}}>{o.d}</span>}
            </button>
          );
        })}
      </div>
    );
    const chip=(key,label,on,onClick)=>(
      <button key={key} type="button" onClick={onClick}
        style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${on?C.neon:C.g200}`,background:on?C.neonDim:C.white,fontSize:11,fontWeight:on?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black}}>
        {label}
      </button>
    );
    const rowBtn={display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:C.white,cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:500,color:C.black,textAlign:"left"};
    const chevronR=<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M9 6l6 6-6 6"/></svg>;

    const sleepRead=profilData?.sleepHours?`${lbl(OPT_SLEEP,String(profilData.sleepHours))||profilData.sleepHours+"h"} pro Nacht`:(profilData?.sleep?`${profilData.sleep}h/Nacht`:"-");
    const injRead=(profilData?.injuries||[]).filter(x=>x!=="none");
    const fullName=`${profilData?.firstname||""} ${profilData?.lastname||""}`.trim();
    const initials=`${String(profilData?.firstname||"").charAt(0)}${String(profilData?.lastname||"").charAt(0)}`.toUpperCase();
    const summaryLine=[
      profilData?.weight?`${profilData.weight} kg`:"",
      profilData?.height?`${profilData.height} cm`:"",
      (profSports||[]).map(id=>sportName(id)).join(", "),
    ].filter(Boolean).join(" · ");
    const groupTitle=(t,first=false)=>(<div style={{fontSize:12,fontWeight:500,color:C.g400,fontFamily:"Inter,sans-serif",margin:first?"10px 0 2px":"18px 0 2px"}}>{t}</div>);
    const readRows=(rows)=>(rows||[]).map((r,i,arr)=>(
      <div key={`${r.l}-${i}`} style={{display:"flex",justifyContent:"space-between",gap:12,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.g100}`:"none"}}>
        <span style={{fontSize:12,color:C.g600,flexShrink:0}}>{r.l}</span>
        <span style={{fontSize:12,fontWeight:500,color:C.black,textAlign:"right",maxWidth:"60%",minWidth:0,overflowWrap:"anywhere"}}>{r.v}</span>
      </div>
    ));
    const [showLoyalty,setShowLoyaltyRaw]=useState(()=>!!PROFIL_UI.loyalty);
    const toggleLoyalty=()=>{ const v=!showLoyalty; PROFIL_UI.loyalty=v; setShowLoyaltyRaw(v); };
    const RESET_MSG="Alle Angaben löschen? Dein Profil, dein Training, deine Allergien und Präferenzen sowie dein PRO-Zugang werden auf diesem Gerät gelöscht. Das kann nicht rückgängig gemacht werden.";

    return (
      <div>
        {/* 1. Kopf: Name und Zugang (Basic mit Upgrade) */}
        <div style={{border:`1.5px solid ${isPro?C.neon:C.g200}`,borderRadius:14,background:isPro?"#F5FFE0":C.white,padding:"16px",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div aria-hidden="true" style={{width:44,height:44,borderRadius:"50%",background:isPro?C.neon:C.g100,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:15,fontWeight:600,color:C.black}}>
              {initials||<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.g600} strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:17,fontWeight:600,color:C.black,letterSpacing:"-.01em",lineHeight:1.25,overflowWrap:"anywhere"}}>{fullName||"Dein Profil"}</div>
              <div style={{fontSize:12,color:C.g600,marginTop:2}}>{isPro?"TREYN+ PRO · aktiv":"TREYN+ Basic · kostenlos"}</div>
            </div>
            <span style={{fontSize:11,padding:"3px 9px",borderRadius:6,background:isPro?C.black:"#F0F0F0",color:isPro?C.neon:"#888",fontFamily:"Inter,sans-serif",fontWeight:600,flexShrink:0}}>{isPro?"PRO":"Basic"}</span>
          </div>
          {isPro?(
            <div style={{marginTop:12,fontSize:11,color:C.g600,lineHeight:1.5}}>PRO läuft 6 Monate, keine automatische Verlängerung.</div>
          ):(
            <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.g100}`}}>
              <div style={{fontSize:12,color:C.g800,lineHeight:1.55,marginBottom:10}}>In Basic siehst du Schätzwerte. Mit PRO wird alles exakt für dich berechnet - mit Dosierung, Timing und Begründung.</div>
              <button type="button" onClick={onUpgrade}
                style={{width:"100%",background:C.neon,color:C.black,border:"none",borderRadius:10,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
                {`Upgrade auf PRO - ${PRICE_STR}`}
              </button>
              <div style={{fontSize:11,color:C.g400,marginTop:8,lineHeight:1.5,textAlign:"center"}}>Einmalzahlung für 6 Monate, keine automatische Verlängerung.</div>
            </div>
          )}
        </div>

        {/* 2. Deine Angaben: ansehen und bearbeiten */}
        <div style={{border:`1px solid ${editMode?C.neon:C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:16,background:C.white}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:editMode?C.neonDim:C.white,paddingRight:12}}>
            <button type="button" onClick={togglePersonal} aria-expanded={showPersonal}
              style={{flex:1,minWidth:0,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"14px 16px",background:"transparent",border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left"}}>
              <span style={{minWidth:0}}>
                <span style={{display:"block",fontSize:14,fontWeight:600,color:C.black}}>Deine Angaben</span>
                {!showPersonal&&summaryLine&&<span style={{display:"block",fontSize:11,color:C.g400,marginTop:2,overflowWrap:"anywhere"}}>{summaryLine}</span>}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}>
                <path d={showPersonal?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/>
              </svg>
            </button>
            {!editMode&&<button type="button" onClick={startEdit}
              style={{fontSize:12,padding:"6px 12px",borderRadius:8,background:C.white,color:C.black,border:`1px solid ${C.g200}`,cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:500,flexShrink:0}}>Bearbeiten</button>}
          </div>
          {showPersonal&&(
            <div style={{padding:"2px 16px 16px",borderTop:`1px solid ${C.g100}`}}>
              {justSaved&&(
                <div style={{marginTop:12,padding:"9px 12px",borderRadius:9,background:"#F5FFE0",border:`1px solid ${C.neonBorder}`,fontSize:11,color:C.g800,lineHeight:1.5}}>
                  ✓ Gespeichert. Deine Werte wurden mit den neuen Angaben neu berechnet.
                </div>
              )}
              {/* Person: fest aus dem Onboarding, nicht bearbeitbar */}
              {groupTitle("Person",true)}
              {readRows([
                {l:"Name",v:fullName||"-"},
                {l:"E-Mail",v:profilData?.email||"-"},
                {l:"Herkunft",v:profilData?.country||"-"},
                {l:"Geschlecht",v:{m:"Männlich",f:"Weiblich"}[profilData?.gender]||"-"},
              ])}

              {/* Bearbeitbare Angaben: Lesen in derselben Reihenfolge wie das Formular */}
              {!editMode?(
                <div>
                  {groupTitle("Basisdaten")}
                  {readRows([
                    {l:"Gewicht",v:profilData?.weight?`${profilData.weight} kg`:"-"},
                    {l:"Grösse",v:profilData?.height?`${profilData.height} cm`:"-"},
                    {l:"Ruhepuls",v:profilData?.rhr?`${profilData.rhr} bpm`:"-"},
                    {l:"Schlaf",v:sleepRead},
                    {l:"Ziel",v:{performance:"Leistung",muscle:"Muskelaufbau",endurance:"Ausdauer",weightloss:"Gewicht",health:"Gesundheit",recovery:"Regeneration"}[profilData?.goal]||"-"},
                    {l:"Stresslevel",v:{1:"Sehr niedrig",2:"Niedrig",3:"Mittel",4:"Hoch",5:"Sehr hoch"}[profilData?.stressLevel]||"-"},
                    {l:"Ernährung",v:{excellent:"Sehr ausgewogen",good:"Gut",average:"Durchschnittlich",poor:"Verbesserungswürdig"}[profilData?.dietQuality]||"-"},
                    {l:"Erholungsstatus",v:{excellent:"Top-Form",good:"Normal",tired:"Müde / überlastet",recovery:"Verletzung / Pause"}[profilData?.recoveryStatus]||"-"},
                    {l:"Höhe",v:{low:"0-500m",medium:"500-1500m",high:"1500-2500m",alpine:"2500m+"}[profilData?.altitude]||"-"},
                    {l:"Budget / Monat",v:{low:"< CHF 30",medium:"CHF 30-80",high:"CHF 80-150",max:"CHF 150+"}[profilData?.monthlyBudget]||"-"},
                  ])}

                  {groupTitle("Alltag & Körper")}
                  {readRows([
                    {l:"Alltag (Job)",v:lbl(OPT_JOB,profilData?.jobActivity)||"-"},
                    {l:"Wasser im Alltag",v:lbl(OPT_WATER,profilData?.waterIntake)||"-"},
                    {l:"Sonnenlicht",v:lbl(OPT_SUN,profilData?.sunExposure)||"-"},
                    {l:"Koffein",v:lbl(OPT_CAFF,profilData?.caffeineDaily)||"-"},
                    {l:"Körperbau",v:lbl(OPT_BODY,profilData?.bodyComposition)||"-"},
                    ...(isFemale?[{l:"Zyklusphase",v:lbl(OPT_CYCLE,profilData?.cyclePhase)||"-"}]:[]),
                    {l:"Verletzungen",v:injRead.length?injRead.map(x=>lbl(OPT_INJ,x)||x).join(", "):"Keine"},
                  ])}

                  {/* Training je Sportart */}
                  {(profSports||[]).length>0&&(
                    <div>
                      {groupTitle("Training")}
                      {readRows((profSports||[]).map(id=>{
                        const d=trainingData?.[id]||{};
                        const parts=[`${+d.days||3}× pro Woche`,`${+d.duration||60} min`,lbl(OPT_INT,d.intensity||"medium")||"Mittel"];
                        if(d.hasCompetition) parts.push(`${+d.compCount||0} ${(COMPETITION_LABEL[id]||"Wettkämpfe").split(" / ")[0]}/Jahr`);
                        return {l:sportName(id),v:parts.join(" · ")};
                      }))}
                    </div>
                  )}

                  {groupTitle("Supplements & Medikamente")}
                  {readRows([
                    {l:"Aktuelle Supplements",v:(profilData?.currentSupps||[]).includes("none")||!(profilData?.currentSupps||[]).length?"Keine":(profilData?.currentSupps||[]).map(id=>SUPP_LABELS[id]||id).join(", ")},
                    {l:"Medikamente",v:(profilData?.medications||[]).includes("none")||!(profilData?.medications||[]).length?"Keine":(profilData?.medications||[]).map(m=>MED_LABELS[m]||m).join(", ")},
                  ])}

                  <button type="button" onClick={startEdit}
                    style={{width:"100%",marginTop:14,padding:"10px",borderRadius:9,border:`1px solid ${C.g200}`,background:C.white,color:C.black,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
                    Angaben bearbeiten
                  </button>
                </div>
              ):(
                // Edit mode
                <div style={{marginTop:16,paddingTop:12,borderTop:`1px solid ${C.g100}`}}>
                  {secTitle("Basisdaten",true)}
                  {/* Körperdaten */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:8,marginBottom:10}}>
                    {[{k:"weight",l:"Gewicht (kg)",ph:"75"},{k:"height",l:"Grösse (cm)",ph:"180"},{k:"rhr",l:"Ruhepuls (bpm)",ph:"52"}].map(f=>(
                      <div key={f.k} style={{minWidth:0}}>
                        <div style={{fontSize:11,color:C.g600,marginBottom:4,lineHeight:1.3}}>{f.l}</div>
                        <input type="number" inputMode="decimal" value={editForm[f.k]??""} onChange={e=>setEF(f.k,e.target.value)} placeholder={f.ph}
                          style={{width:"100%",minWidth:0,padding:"9px 11px",border:`1.5px solid ${editForm[f.k]?C.neon:C.g200}`,borderRadius:9,fontSize:13,fontFamily:"Inter,sans-serif",background:editForm[f.k]?C.neonDim:C.white,boxSizing:"border-box"}}/>
                      </div>
                    ))}
                  </div>

                  {/* Schlafdauer - gleiche Auswahl wie im Onboarding, eine einzige Schlafangabe */}
                  <div style={{marginBottom:10}}>
                    {fLabel("Schlafdauer","Durchschnittliche Stunden pro Nacht")}
                    {optTiles("sleepHours",OPT_SLEEP,2)}
                  </div>

                  {/* Ziel */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Primäres Ziel</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {[{id:"performance",l:"Leistung"},{id:"muscle",l:"Muskel"},{id:"endurance",l:"Ausdauer"},{id:"weightloss",l:"Gewicht"},{id:"health",l:"Gesundheit"},{id:"recovery",l:"Regeneration"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("goal",o.id)}
                          style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${editForm.goal===o.id?C.neon:C.g200}`,background:editForm.goal===o.id?C.neonDim:C.white,fontSize:11,fontWeight:editForm.goal===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stresslevel */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Stresslevel</div>
                    <div style={{display:"flex",gap:6}}>
                      {[{id:1,l:"Sehr niedrig"},{id:2,l:"Niedrig"},{id:3,l:"Mittel"},{id:4,l:"Hoch"},{id:5,l:"Sehr hoch"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("stressLevel",o.id)}
                          style={{flex:1,minWidth:0,padding:"6px 2px",borderRadius:8,border:`1.5px solid ${editForm.stressLevel===o.id?C.neon:C.g200}`,background:editForm.stressLevel===o.id?C.neonDim:C.white,fontSize:9,fontWeight:editForm.stressLevel===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ernährungsqualität */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Ernährung</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6}}>
                      {[{id:"excellent",l:"Sehr ausgewogen"},{id:"good",l:"Gut"},{id:"average",l:"Durchschnittlich"},{id:"poor",l:"Verbesserungswürdig"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("dietQuality",o.id)}
                          style={{minWidth:0,padding:"7px 10px",borderRadius:8,border:`1.5px solid ${editForm.dietQuality===o.id?C.neon:C.g200}`,background:editForm.dietQuality===o.id?C.neonDim:C.white,fontSize:11,fontWeight:editForm.dietQuality===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center",overflowWrap:"anywhere"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Erholungsstatus */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Erholungsstatus</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6}}>
                      {[{id:"excellent",l:"Top-Form"},{id:"good",l:"Normal"},{id:"tired",l:"Müde / überlastet"},{id:"recovery",l:"Verletzung / Pause"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("recoveryStatus",o.id)}
                          style={{minWidth:0,padding:"7px 10px",borderRadius:8,border:`1.5px solid ${editForm.recoveryStatus===o.id?C.neon:C.g200}`,background:editForm.recoveryStatus===o.id?C.neonDim:C.white,fontSize:11,fontWeight:editForm.recoveryStatus===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center",overflowWrap:"anywhere"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Höhe */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Trainings-Höhe</div>
                    <div style={{display:"flex",gap:6}}>
                      {[{id:"low",l:"0-500m"},{id:"medium",l:"500-1500m"},{id:"high",l:"1500-2500m"},{id:"alpine",l:"2500m+"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("altitude",o.id)}
                          style={{flex:1,minWidth:0,padding:"6px 2px",borderRadius:8,border:`1.5px solid ${editForm.altitude===o.id?C.neon:C.g200}`,background:editForm.altitude===o.id?C.neonDim:C.white,fontSize:10,fontWeight:editForm.altitude===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center",overflowWrap:"anywhere"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Monatliches Budget</div>
                    <div style={{display:"flex",gap:6}}>
                      {[{id:"low",l:"< CHF 30"},{id:"medium",l:"CHF 30-80"},{id:"high",l:"CHF 80-150"},{id:"max",l:"CHF 150+"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("monthlyBudget",o.id)}
                          style={{flex:1,minWidth:0,padding:"6px 2px",borderRadius:8,border:`1.5px solid ${editForm.monthlyBudget===o.id?C.neon:C.g200}`,background:editForm.monthlyBudget===o.id?C.neonDim:C.white,fontSize:10,fontWeight:editForm.monthlyBudget===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center",overflowWrap:"anywhere"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Präzisions-Angaben - gleiche Auswahl wie im Onboarding */}
                  {secTitle("Alltag & Körper")}
                  <div style={{marginBottom:10}}>
                    {fLabel("Aktivität im Alltag (Job)","ausserhalb des Trainings")}
                    {optTiles("jobActivity",OPT_JOB,2)}
                  </div>
                  <div style={{marginBottom:10}}>
                    {fLabel("Tägliche Wassermenge","ohne Training")}
                    {optTiles("waterIntake",OPT_WATER,2)}
                  </div>
                  <div style={{marginBottom:10}}>
                    {fLabel("Sonnenlicht täglich","beeinflusst Vitamin D")}
                    {optTiles("sunExposure",OPT_SUN,2)}
                  </div>
                  <div style={{marginBottom:10}}>
                    {fLabel("Täglicher Koffein-Konsum","Kaffee, Tee, Energy Drinks")}
                    {optTiles("caffeineDaily",OPT_CAFF,2)}
                  </div>
                  <div style={{marginBottom:10}}>
                    {fLabel("Körperbau","Selbsteinschätzung")}
                    {optTiles("bodyComposition",OPT_BODY,2)}
                  </div>
                  {isFemale&&(
                    <div style={{marginBottom:10}}>
                      {fLabel("Aktuelle Zyklusphase","beeinflusst Eisen-, Magnesium- und Kalorienbedarf")}
                      {optTiles("cyclePhase",OPT_CYCLE,2)}
                    </div>
                  )}
                  <div style={{marginBottom:10}}>
                    {fLabel("Verletzungen / Beschwerden","mehrere möglich")}
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {OPT_INJ.map(o=>chip(o.id,o.l,(editForm.injuries||[]).includes(o.id),()=>toggleEFArr("injuries",o.id)))}
                    </div>
                  </div>

                  {/* Training je Sportart */}
                  {(profSports||[]).length>0&&secTitle("Training")}
                  {typeof onEditSports==="function"&&(
                    <button type="button" onClick={()=>onEditSports()} style={{width:"100%",marginBottom:10,padding:"9px 12px",borderRadius:9,border:`1px solid ${C.g200}`,background:C.white,color:C.black,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left"}}>
                      Sportarten ändern → <span style={{color:C.g400,fontWeight:400}}>deine übrigen Angaben bleiben erhalten</span>
                    </button>
                  )}
                  {(profSports||[]).map(id=>{
                    const t=(editForm.training||{})[id]||{days:3,duration:60,intensity:"medium",hasCompetition:false,compCount:5,compTypes:[]};
                    const compLabel=COMPETITION_LABEL[id]||"Wettkämpfe";
                    const compTypes=COMPETITION_TYPES[id]||[];
                    return (
                      <div key={id} style={{border:`1px solid ${C.g200}`,borderRadius:11,padding:"12px 12px",marginBottom:10}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:10}}>{sportName(id)}</div>
                        <div style={{marginBottom:12}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <span style={{fontSize:11,color:C.g600}}>Einheiten pro Woche</span>
                            <span style={{fontSize:12,fontWeight:600}}>{t.days}×</span>
                          </div>
                          <input type="range" min="1" max="7" step="1" value={t.days} onChange={e=>setTR(id,"days",+e.target.value)} style={{width:"100%"}} aria-label={`Einheiten pro Woche ${sportName(id)}`}/>
                        </div>
                        <div style={{marginBottom:12}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <span style={{fontSize:11,color:C.g600}}>Durchschnittliche Dauer (Ø)</span>
                            <span style={{fontSize:12,fontWeight:600}}>{t.duration} min</span>
                          </div>
                          <input type="range" min="20" max="360" step="10" value={t.duration} onChange={e=>setTR(id,"duration",+e.target.value)} style={{width:"100%"}} aria-label={`Dauer ${sportName(id)}`}/>
                        </div>
                        <div style={{marginBottom:10}}>
                          <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Intensität</div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6}}>
                            {OPT_INT.map(o=>{
                              const on=t.intensity===o.id;
                              return (
                                <button key={o.id} type="button" onClick={()=>setTR(id,"intensity",o.id)}
                                  style={{minWidth:0,padding:"8px 10px",borderRadius:9,border:`1.5px solid ${on?C.neon:C.g200}`,background:on?"#F5FFE0":C.white,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"left",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                                  <span style={{fontSize:11,fontWeight:on?700:600}}>{o.l}</span>
                                  <span style={{fontSize:10,color:on?"#555":C.g400,marginTop:2}}>{o.d}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{padding:"10px 12px",background:C.g100,borderRadius:10}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                            <span style={{fontSize:11,fontWeight:500,color:C.black}}>{compLabel}</span>
                            <button type="button" className="icon-btn" role="switch" aria-checked={!!t.hasCompetition} aria-label={compLabel}
                              onClick={()=>setTR(id,"hasCompetition",!t.hasCompetition)}
                              style={{width:44,height:26,minHeight:26,padding:0,background:t.hasCompetition?C.black:C.g200,borderRadius:100,position:"relative",cursor:"pointer",transition:"background .18s",flexShrink:0,border:"none"}}>
                              <span style={{width:20,height:20,background:C.white,borderRadius:"50%",position:"absolute",top:3,left:t.hasCompetition?21:3,transition:"left .18s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
                            </button>
                          </div>
                          {t.hasCompetition&&(
                            <div style={{marginTop:10}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                                <span style={{fontSize:11,color:C.g600}}>Ø Anzahl pro Jahr</span>
                                <span style={{fontSize:12,fontWeight:600}}>{t.compCount}</span>
                              </div>
                              <input type="range" min="1" max="50" step="1" value={t.compCount} onChange={e=>setTR(id,"compCount",+e.target.value)} style={{width:"100%"}} aria-label={`Anzahl ${compLabel} pro Jahr`}/>
                              {compTypes.length>0&&(
                                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
                                  {compTypes.map(type=>chip(type,type,(t.compTypes||[]).includes(type),()=>toggleCompType(id,type)))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Aktuelle Supplements */}
                  {secTitle("Supplements & Medikamente")}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Aktuelle Supplements</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {["none","kreatin","protein","vitd","omega3","magnesium","koffein","eisen","zink","ashwa","collagen","beta_ala"].map(id=>
                        chip(id,SUPP_LABELS[id],(editForm.currentSupps||[]).includes(id),()=>toggleEFArr("currentSupps",id))
                      )}
                    </div>
                  </div>

                  {/* Medikamente */}
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Medikamente</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {[{id:"none",l:"Keine"},{id:"blutverd",l:"Blutverdünner"},{id:"schilddruese",l:"Schilddrüse"},{id:"blutdruck",l:"Blutdruck"}].map(o=>
                        chip(o.id,o.l,(editForm.medications||[]).includes(o.id),()=>toggleEFArr("medications",o.id))
                      )}
                    </div>
                  </div>

                  <div style={{display:"flex",gap:8}}>
                    <button type="button" onClick={cancelEdit}
                      style={{flex:1,padding:"10px",borderRadius:9,border:`1px solid ${C.g200}`,background:C.white,fontSize:12,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.g600}}>
                      Abbrechen
                    </button>
                    <button type="button" onClick={saveEdit}
                      style={{flex:2,padding:"10px",borderRadius:9,border:"none",background:C.black,color:C.neon,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
                      Speichern & neu berechnen
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Mehr: AI Chat (PRO), Kontakt & Impressum, Loyalty (zugeklappt) */}
        <div style={{fontSize:12,fontWeight:500,color:C.g400,fontFamily:"Inter,sans-serif",margin:"0 2px 8px"}}>Mehr</div>
        <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:16,background:C.white}}>
          {isPro&&(
            <button type="button" onClick={()=>setTab("aichat")} style={{...rowBtn,borderBottom:`1px solid ${C.g100}`}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.g600} strokeWidth="1.8" strokeLinecap="round" style={{flexShrink:0}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span style={{flex:1,minWidth:0}}>AI Chat</span>
              <span style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:C.black,color:C.neon,fontFamily:"Inter,sans-serif",fontWeight:600,flexShrink:0}}>PRO</span>
              {chevronR}
            </button>
          )}
          <button type="button" onClick={()=>setTab("kontakt")} style={{...rowBtn,borderBottom:`1px solid ${C.g100}`}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.g600} strokeWidth="1.8" strokeLinecap="round" style={{flexShrink:0}}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span style={{flex:1,minWidth:0}}>Kontakt & Impressum</span>
            {chevronR}
          </button>
          <button type="button" onClick={toggleLoyalty} aria-expanded={showLoyalty} style={rowBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.g600} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style={{flexShrink:0}}>TREYN Loyalty</span>
            <span style={{flex:1,fontSize:11,color:C.g400,fontWeight:400,minWidth:0,textAlign:"right",overflowWrap:"anywhere"}}>{`${hasStatus?currentTier.label:"Kein Status"} · ${orders} ${orders===1?"Bestellung":"Bestellungen"}`}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><path d={showLoyalty?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/></svg>
          </button>
          {showLoyalty&&(
            <div style={{padding:"4px 16px 14px",borderTop:`1px solid ${C.g100}`}}>
              <div style={{fontSize:11,color:C.g600,lineHeight:1.5,margin:"10px 0"}}>Stufen nach Anzahl Bestellungen. Bestellungen werden noch nicht automatisch gezählt.</div>
              {nextTier&&(
                <div style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:4}}>
                    <span style={{fontSize:11,color:C.g600}}>Nächste Stufe: <strong style={{color:C.black,fontWeight:600}}>{nextTier.label}</strong></span>
                    <span style={{fontSize:11,color:C.g400}}>{orders}/{nextTier.min}</span>
                  </div>
                  <div style={{height:4,background:C.g100,borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.min(Math.max(progress,0),100)}%`,background:C.neon,borderRadius:2,transition:"width .6s ease"}}/>
                  </div>
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:6}}>
                {TIERS.filter(t=>t.id!=="none").map(t=>(
                  <div key={t.id} style={{borderRadius:9,border:`1px solid ${t.id===currentTier.id?C.neon:C.g200}`,background:t.id===currentTier.id?C.neonDim:C.white,padding:"8px 10px",display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:t.color,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.black}}>{t.label}</div>
                      <div style={{fontSize:10,color:C.g400}}>{`ab ${t.min} Bestellungen`}</div>
                    </div>
                    {t.id===currentTier.id&&<span style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:C.neon,color:C.black,fontFamily:"Inter,sans-serif",fontWeight:600,flexShrink:0}}>Aktiv</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Haftungsausschluss (klein) */}
        <div style={{margin:"0 2px 16px",fontSize:10,color:C.g400,lineHeight:1.6}}>
          <span style={{fontWeight:500,color:C.g600}}>Haftungsausschluss. </span>
          TREYN+ liefert Ernährungsempfehlungen auf Basis deiner Angaben - kein Ersatz für medizinische Beratung. Prüfe Inhaltsstoffe, Allergene und Wechselwirkungen immer direkt beim Hersteller. Bei Erkrankungen oder Medikamenten: Arzt konsultieren.
        </div>

        {/* 5. Alle Angaben löschen (ganz unten, mit Rückfrage) */}
        <div style={{marginBottom:20}}>
          <button type="button" onClick={()=>{ if(onReset(RESET_MSG)){ try{ ["treyn_owned","treyn_cart","treyn_orders","treyn_analyse_purchased"].forEach(k=>localStorage.removeItem(k)); }catch{} } }}
            style={{width:"100%",background:"transparent",color:"#E53E3E",border:"1px solid rgba(229,62,62,.25)",borderRadius:9,padding:"9px",fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            Alle Angaben löschen
          </button>
          <div style={{fontSize:10,color:C.g400,marginTop:6,lineHeight:1.5,textAlign:"center"}}>
            Löscht Profil, Training und PRO-Zugang auf diesem Gerät. Vorher kommt eine Rückfrage.
          </div>
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
      window.open((profilData?.country||"Schweiz")==="Schweiz"?"https://www.cerascreen.ch/products/kombi-paket-sportliche-leistungsfaehigkeit":"https://www.cerascreen.de/collections/sport","_blank");
    };

    return (
      <div>
        {/* How it works */}
        <div style={{border:`1px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
          <div style={{background:C.neonDim,padding:"12px 16px",borderBottom:`1px solid ${C.neonBorder}`}}>
            <span style={{fontSize:12,fontWeight:600,color:C.black}}>So funktioniert der Bluttest</span>
          </div>
          <div style={{padding:"16px",background:C.white}}>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {n:"1",t:"Bluttest bestellen",d:"Wir vermitteln dir einen At-Home Bluttest via cerascreen® - dem führenden Bluttest-Anbieter in 19 europäischen Ländern. Fingerprick-Methode, du schickst die Probe per Post ein."},
                {n:"2",t:"Ergebnis erhalten",d:"cerascreen® wertet deine Probe im zertifizierten Fachlabor aus. Das Ergebnis erhältst du als PDF innerhalb von 2-3 Werktagen per E-Mail."},
                {n:"3",t:"PDF hier hochladen",d:"Hast du dein Ergebnis? Lade das PDF direkt hier hoch. TREYN AI liest alle Laborwerte automatisch aus - Vitamin D, Eisen, Magnesium, Omega-3 und mehr. Keine manuelle Eingabe nötig."},
                {n:"4",t:"Deine Werte im Überblick",d:"Du siehst deine echten Laborwerte übersichtlich auf einen Blick. In die Berechnung und die Supplement-Empfehlungen fliessen sie noch nicht automatisch ein - das ist bald verfügbar."},
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
                <div style={{fontSize:11,color:C.g600}}>19 europäische Länder · CH, DE, AT · Zertifiziertes Fachlabor · 250'000+ Tests/Jahr</div>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:14}}>
              {["Vitamin D","Eisen & Ferritin","Magnesium","Omega-3","Vitamin B12","Zink","Testosteron","Cortisol"].map(t=>(
                <span key={t} style={{display:"inline-flex",alignItems:"center",background:C.white,color:C.g600,fontSize:10,fontWeight:500,padding:"3px 8px",borderRadius:100,fontFamily:"Inter,sans-serif"}}>{t}</span>
              ))}
            </div>
            {blutPurchased?(
              <div style={{padding:"10px 12px",background:C.white,borderRadius:9,border:`1px solid ${C.neonBorder}`,fontSize:12,color:C.g800,marginBottom:10}}>
                ✓ Bluttest bestellt - du erhältst dein Kit per Post. Nach Eingang des Ergebnisses (2-3 Werktage) das PDF unten hochladen.
              </div>
            ):(
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:C.black,letterSpacing:"-.02em"}}>ca. CHF 80-120 <span style={{fontSize:10,fontWeight:400,color:C.g600}}>· bei cerascreen®</span></div>
                    <div style={{fontSize:10,color:C.g600}}>Sportler-Paket: Vitamin D, B12, Omega-3, Testosteron</div>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {["Kreditkarte","TWINT","Apple Pay"].map(m=>(
                      <span key={m} style={{fontSize:10,padding:"2px 7px",borderRadius:6,background:"rgba(0,0,0,.08)",color:C.black,fontFamily:"Inter,sans-serif",fontWeight:500}}>{m}</span>
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

        {/* PDF Upload - kostenlos, für alle */}
        <div style={{marginBottom:4}}>
          <div style={{fontSize:12,fontWeight:500,color:"#666",marginBottom:10}}>Ergebnisse hochladen & Werte anzeigen</div>
          <div style={{padding:"10px 14px",background:"#FAFAFA",borderRadius:10,border:"1px solid #EBEBEB",marginBottom:10}}>
            <div style={{fontSize:11,color:"#888",lineHeight:1.5,marginBottom:8}}>TREYN AI liest dein PDF automatisch aus und zeigt dir deine Laborwerte im Überblick. In deine Empfehlungen fliessen sie noch nicht automatisch ein - bald verfügbar.</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {["Vitamin D","Eisen & Ferritin","Magnesium","Omega-3","Vitamin B12","Zink","Testosteron","Cortisol"].map(t=>(
                <span key={t} style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"#F0F0F0",color:"#666",fontFamily:"Inter,sans-serif",fontWeight:500}}>{t}</span>
              ))}
            </div>
          </div>
          <BluttestUpload isPro={true}/>
        </div>
      </div>
    );
  };

  const EmpfehlungenTab=()=>{
    // PRODUKTE: Unterreiter-Stand in UI_STATE.empfSub, damit setTab("einkauf") direkt die Merkliste oeffnet
    const isMobile=useWindowWidth()<=768;
    const SUB=[
      {id:"supplements",l:"Supplements"},
      {id:"ernaehrung",l:"Ernährung"},
      {id:"recovery",l:"Recovery"},
      {id:"tracking",l:"Tracking"},
      {id:"bluttest",l:"Bluttest"},
      {id:"merkliste",l:"Merkliste"},
    ];
    const HIDDEN_SUB=["mahlzeiten","hydration"]; // ohne eigenen Knopf, aber weiter erreichbar
    const [subTabRaw,setSubTabRaw]=useState(()=>UI_STATE.empfSub||"supplements");
    const subTab=SUB.some(s=>s.id===subTabRaw)||HIDDEN_SUB.includes(subTabRaw)?subTabRaw:"supplements";
    const setSubTab=v=>{ UI_STATE.empfSub=v; setSubTabRaw(v); };
    const prefSupp=praeferenzenData?.suppForm||"beides";
    return (
      <div>
        <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Produkte</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.6}}>Passend zu deinem Sport und deinen Daten. Was du dir merkst, findest du in der Merkliste.</p>
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          {SUB.map(s=>(
            <button key={s.id} onClick={()=>{setSubTab(s.id);window.scrollTo({top:0,behavior:"instant"});}} aria-pressed={subTab===s.id}
              style={{padding:isMobile?"6px 14px":"6px 16px",borderRadius:100,border:`1.5px solid ${subTab===s.id?C.black:C.g200}`,background:subTab===s.id?C.neon:C.white,color:C.black,fontSize:12,fontWeight:subTab===s.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .13s"}}>
              {s.l}
            </button>
          ))}
        </div>
        {subTab==="supplements"&&(
          <div>
            <p style={{fontSize:12,color:C.g600,marginBottom:12}}>{isPro?"Sport-spezifisch priorisiert nach deinen Berechnungen.":"Empfohlen für deinen Sport und deine Intensität."}</p>
            {prefSupp!=="beides"&&(<div style={{marginBottom:10,padding:"8px 12px",background:C.neonDim,borderRadius:8,border:`1px solid ${C.neon}`,fontSize:11,color:"#4A7000",display:"flex",alignItems:"center",gap:6}}><span>✓</span> Deine Präferenz: <strong>{prefSupp==="kapsel"?"Kapseln / Tabletten":"Pulver"}</strong> - achte beim Kauf auf diese Form.</div>)}
            <SupplementsContent isPro={isPro} primSupps={primSupps} secSupps={secSupps} allergenData={allergenData} proData={kcal}/>
          </div>
        )}
        {subTab==="ernaehrung"&&<NutritionTab/>}
        {subTab==="mahlzeiten"&&(
          <div>
            <p style={{fontSize:12,color:C.g600,marginBottom:16,lineHeight:1.6}}>Ideal für Sportler die nicht gerne kochen - aber trotzdem optimal versorgt sein wollen.</p>
            <FertiggerichteContent/>
          </div>
        )}
        {subTab==="hydration"&&<HydrationContent/>}
        {subTab==="recovery"&&(
          <div>
            <p style={{fontSize:12,color:C.g600,marginBottom:16,lineHeight:1.5}}>Professionelle Recovery-Technologie - empfohlen nach intensiven Trainings.</p>
            <RecoveryContent/>
          </div>
        )}
        {subTab==="tracking"&&(
          <div>
            <p style={{fontSize:12,color:C.g600,marginBottom:16,lineHeight:1.5}}>Wearables für präziseres Tracking - machen deine TREYN+ Analyse noch genauer.</p>
            <WearablesContent/>
          </div>
        )}
        {subTab==="bluttest"&&(
          <div>
            <div style={{background:C.neonDim,border:`1px solid ${C.neonBorder}`,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:500,fontFamily:"Inter,sans-serif",color:"#4A7000",marginBottom:5}}>Warum ein Bluttest?</div>
              <div style={{fontSize:12,color:"#333",lineHeight:1.7,marginBottom:4}}>
                TREYN+ rechnet mit Schätzwerten. Ein Bluttest zeigt dir deine echten Werte. Kostet einmalig ca. CHF 80-120 bei cerascreen®.
              </div>
              <div style={{fontSize:11,color:"#3A6000"}}>Besonders wichtig für: Vitamin D, Ferritin (Eisen), Magnesium, Omega-3 Index.</div>
            </div>
            <BluttestTab/>
          </div>
        )}
        {/* Merkliste: CartTab bringt eigenen Titel und Text mit (fuer Basic und PRO) */}
        {subTab==="merkliste"&&<CartTab/>}
      </div>
    );
  };

  // ── ANSICHT JE REITER (mobil und desktop gleich) ─────────────────────────────
  const h2Style={fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"};
  const introStyle={fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6};
  const hasCompPlan=Object.values(trainingData||{}).some(d=>d?.hasCompetition);
  const view=(
    <>
      {tab==="summary"&&<SummaryTab/>}

      {/* Plan: Tagesplan / Protokolle / Wettkampf. Basic sieht ihn unscharf */}
      {tab==="plan"&&(isPro?<TagesplanWrapper trainingData={trainingData}/>:(
        <div>
          <h2 style={h2Style}>Plan</h2>
          <p style={introStyle}>{`Dein Tagesplan mit Supplement-Timing für Trainings- und Ruhetage${hasCompPlan?" und deine Race-Day Strategie":""}.`}</p>
          <BlurGate isPro={false} onUpgrade={onUpgrade} label="Tagesplan mit PRO" priceStr={PRICE_STR} maxHeight={isMobile?560:680}>
            <TagesplanWrapper trainingData={trainingData}/>
          </BlurGate>
        </div>
      ))}

      {tab==="produkte"&&<EmpfehlungenTab/>}

      {tab==="aichat"&&(
        <div>
          <h2 style={h2Style}>TREYN AI Chat</h2>
          <p style={{...introStyle,lineHeight:1.5}}>Stelle Fragen zu deinen Daten, Supplements und Ernährung - direkt beantwortet von TREYN AI.</p>
          <AiChat context={aiCtx} isPro={isPro}/>
        </div>
      )}

      {tab==="profil"&&(
        <div>
          <h2 style={h2Style}>Profil</h2>
          <p style={{...introStyle,lineHeight:1.5}}>Deine persönlichen Angaben anpassen.</p>
          <ProfilTab/>
        </div>
      )}

      {tab==="kontakt"&&<KontaktTab/>}
    </>
  );

  return (
    <div style={{minHeight:"100vh",background:C.off,fontFamily:"Inter,sans-serif"}}>
      {/* Top bar */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.g200}`,padding:isMobile?"10px 16px":"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <Logo/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {fname&&!isMobile&&<span style={{fontSize:13,color:C.g600}}>{"Hallo"}, {fname}</span>}
          {isPro&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:C.neon,color:C.black,fontFamily:"Inter,sans-serif",fontWeight:600}}>PRO</span>}
          <button onClick={()=>onReset()} style={{fontSize:11,color:C.g400,background:"none",border:`0.5px solid ${C.g200}`,borderRadius:7,padding:"4px 10px",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>↩ {"Neu"}</button>
        </div>
      </div>

      {/* Mobile: full width content + bottom nav */}
      {isMobile?(
        <div style={{padding:"16px 16px 90px"}}>
          {view}
        </div>
      ):(
        <div style={{display:"flex",maxWidth:1100,margin:"0 auto",padding:"0 16px"}}>

          {/* ── LEFT NAV ─────────────────────────────────────────────────────── */}
          <div className="desktop-sidebar" style={{width:220,flexShrink:0,padding:"24px 12px 24px 0"}}>
            <div style={{position:"sticky",top:64,display:"flex",flexDirection:"column",gap:2,minHeight:"calc(100vh - 88px)"}}>
              <div style={{fontSize:12,fontWeight:500,color:C.g400,fontFamily:"Inter,sans-serif",padding:"0 14px",marginBottom:8}}>Mein Profil</div>
              {NAV.map(item=><NavItem key={item.id} item={item}/>)}
              <div style={{flex:1}}/>
              <div style={{paddingTop:8,borderTop:`1px solid ${C.g200}`,marginTop:8,display:"flex",flexDirection:"column",gap:2}}>
                {isPro&&<button onClick={()=>{setTab("aichat");window.scrollTo({top:0,behavior:"instant"});}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",background:tab==="aichat"?C.neon:C.neonDim,color:tab==="aichat"?C.black:C.g600,fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:400,transition:"all .14s",textAlign:"left"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  AI Chat
                  <span style={{marginLeft:"auto",fontSize:9,padding:"1px 6px",borderRadius:3,background:C.black,color:C.neon,fontFamily:"Inter,sans-serif",fontWeight:600}}>PRO</span>
                </button>}

                <button onClick={()=>{setTab("kontakt");window.scrollTo({top:0,behavior:"instant"});}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",background:tab==="kontakt"?C.neon:"transparent",color:tab==="kontakt"?C.black:C.g500,fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:400,transition:"all .14s",textAlign:"left"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Kontakt & Impressum
                </button>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
          <div style={{flex:1,minWidth:0,padding:"24px 0 80px 24px",borderLeft:`1px solid ${C.g200}`}}>
            {view}
          </div>
        </div>
      )} {/* end desktop layout */}

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────────────────── */}
      <div className="mob-nav">
        {NAV.map(item=><NavItem key={item.id} item={item} mobile={true}/>)}
      </div>
    </div>
  );
}


// ─── LOKALES SPEICHERN ─────────────────────────────────────────────────────
// Angaben, Tarif und Ergebnis-Seite bleiben im Browser (localStorage), damit Neuladen nichts löscht
const STATE_KEY="treyn_state";
const loadSavedState=()=>{
  try{
    const raw=window.localStorage.getItem(STATE_KEY);
    if(!raw) return null;
    const s=JSON.parse(raw);
    return s&&typeof s==="object"&&!Array.isArray(s)?s:null;
  }catch{ return null; }
};
const clearSavedState=()=>{ try{ window.localStorage.removeItem(STATE_KEY); }catch{} };

// ─── ERROR BOUNDARY ────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError:false, error:null, info:null};
  }
  static getDerivedStateFromError(error) {
    return {hasError:true, error};
  }
  componentDidCatch(error, info) {
    this.setState({info});
    // Log to console for debugging
    console.error("TREYN+ Error:", error, info);
  }
  render() {
    if(this.state.hasError) {
      const err = String(this.state.error?.message||"Unbekannter Fehler");
      let hasSaved=false;
      try{ hasSaved=!!window.localStorage.getItem(STATE_KEY); }catch{}
      const restart=()=>{
        let ok=false;
        try{ ok=window.confirm("Neu starten? Deine Angaben und dein PRO-Zugang auf diesem Gerät werden gelöscht."); }catch{}
        if(!ok) return;
        clearSavedState();
        try{ window.sessionStorage.removeItem("treyn_pre_payment"); }catch{}
        window.location.reload();
      };
      return (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#FAFAFA",fontFamily:"Inter,sans-serif",padding:"24px"}}>
          <div style={{maxWidth:400,width:"100%",textAlign:"center"}}>
            <div style={{width:48,height:48,borderRadius:14,background:"#C8FF00",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div style={{fontSize:18,fontWeight:700,color:"#0A0A0A",marginBottom:8,letterSpacing:"-.02em"}}>Kurzer Aussetzer.</div>
            <div style={{fontSize:13,color:"#666",lineHeight:1.7,marginBottom:24}}>
              {hasSaved
                ? "Etwas ist schiefgelaufen. Deine Angaben sind in diesem Browser gespeichert und werden nach dem Neuladen wieder geladen."
                : "Etwas ist schiefgelaufen. Bitte neu laden und die Analyse erneut starten."}
            </div>
            <div style={{fontSize:11,color:"#999",fontFamily:"Inter,sans-serif",marginBottom:20,padding:"8px 12px",background:"#F5F5F5",borderRadius:8,wordBreak:"break-all"}}>
              {err.slice(0,120)}
            </div>
            <button onClick={()=>window.location.reload()} style={{width:"100%",padding:"14px",borderRadius:12,background:"#C8FF00",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif",color:"#0A0A0A"}}>
              Neu laden →
            </button>
            {hasSaved&&(
              <button onClick={restart} style={{width:"100%",marginTop:10,padding:"12px",borderRadius:12,background:"transparent",border:"1.5px solid #E5E5E2",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif",color:"#6B6B68"}}>
                Hilft das nicht? Angaben löschen und neu starten
              </button>
            )}
            <div style={{marginTop:12,fontSize:11,color:"#AAA"}}>
              Falls der Fehler bleibt: <a href="mailto:info@treynplus.com" style={{color:"#0A0A0A",fontWeight:600}}>info@treynplus.com</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


function App() {
  // Gespeicherter Stand (einmal beim Start gelesen)
  const [saved]=useState(loadSavedState);
  const savedHasData=!!(saved?.sportData&&saved?.trainingData&&saved?.profilData);
  const [phase,setPhase]=useState(()=>savedHasData&&(saved?.phase==="results"||saved?.phase==="preview")?saved.phase:"intro");
  const fromPop=useRef(false);
  const phaseRef=useRef(phase);
  useEffect(()=>{
    phaseRef.current=phase;
    if(fromPop.current){fromPop.current=false;return;}
    if(NAVH.idx<0) return navReplace(phase);
    const cur=NAVH.stack[NAVH.idx];
    if(cur==="analysing") return navReplace(phase); // Analyse-Animation nicht als Zurück-Ziel
    if(cur===phase) return;
    navPush(phase);
  },[phase]);
  useEffect(()=>{
    const onPop=e=>{
      const st=e.state;
      if(!st?.treyn||st.gen!==NAVH.gen){ if(phaseRef.current!=="intro"){fromPop.current=true;setPhase("intro");} NAVH.stack=[];NAVH.idx=-1;navReplace("intro"); return; }
      NAVH.idx=st.idx;
      const target=st.phase==="analysing"?"willkommen":st.phase;
      if(target!==phaseRef.current){ fromPop.current=true; setPhase(target); }
    };
    window.addEventListener("popstate",onPop);
    return ()=>window.removeEventListener("popstate",onPop);
  },[]);
  // «← Zurück»-Knöpfe: wenn der vorherige Verlaufseintrag diese Seite ist, echt zurückgehen (sonst neue Seite)
  const goBack=p=>{ if(NAVH.idx>0&&NAVH.stack[NAVH.idx-1]===p) window.history.back(); else setPhase(p); };

  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[phase]);
  const [sportData,setSportData]=useState(()=>saved?.sportData??null);
  const [trainingData,setTrainingData]=useState(()=>saved?.trainingData??null);
  const [profilData,setProfilData]=useState(()=>saved?.profilData??null);
  const [selectedCountry,setSelectedCountry]=useState(()=>saved?.profilData?.country||"Schweiz");
  const isEUR_global=["Deutschland","Österreich"].includes(selectedCountry);
  const PRICE_GLOBAL=isEUR_global?"EUR 9.90":"CHF 12.90";
  const PERIOD_GLOBAL=isEUR_global?"/ 6 Monate · EUR 1.65/Mt.":"/ 6 Monate · CHF 2.15/Mt.";
  const [allergenData,setAllergenData]=useState(()=>saved?.allergenData??null);
  const [praeferenzenData,setPraeferenzenData]=useState(()=>saved?.praeferenzenData??null);
  const [tier,setTier]=useState(()=>saved?.tier==="pro"?"pro":"basic");
  const [isDemoMode,setIsDemoMode]=useState(false);
  const preDemo=useRef(null); // eigene Angaben vor dem Demo, werden beim Verlassen zurückgeholt
  const [devMode]=useState(()=>new URLSearchParams(window.location.search).get("dev")==="1");

  // Nach PRO-Freischaltung an den Anfang, damit man die neuen Werte sieht
  const tierRef=useRef(tier);
  useEffect(()=>{
    if(tierRef.current===tier) return;
    tierRef.current=tier;
    if(tier==="pro") window.scrollTo({top:0,behavior:"instant"});
  },[tier]);

  // Speichern: bei jeder Änderung in localStorage (Musterdaten aus dem Demo nie)
  useEffect(()=>{
    if(isDemoMode) return;
    try{
      const empty=!sportData&&!trainingData&&!profilData&&!allergenData&&!praeferenzenData&&tier!=="pro";
      if(empty){ window.localStorage.removeItem(STATE_KEY); return; }
      const st={v:1,sportData,trainingData,profilData,allergenData,praeferenzenData,tier};
      if(phase==="preview"||phase==="results") st.phase=phase;
      window.localStorage.setItem(STATE_KEY,JSON.stringify(st));
    }catch{}
  },[sportData,trainingData,profilData,allergenData,praeferenzenData,tier,phase,isDemoMode]);

  // Ensure proper mobile viewport
  useEffect(()=>{
    let vp=document.querySelector("meta[name=viewport]");
    if(!vp){vp=document.createElement("meta");vp.name="viewport";document.head.appendChild(vp);}
    vp.content="width=device-width,initial-scale=1,viewport-fit=cover";
  },[]);

  const reset=()=>{
    NAVH.gen=Date.now(); clearSavedState();
    try{ Object.keys(UI_STATE).forEach(k=>{ delete UI_STATE[k]; }); }catch{}
    try{ window.sessionStorage.removeItem("treyn_pre_payment"); }catch{}
    preDemo.current=null;
    setSportData(null);setTrainingData(null);setProfilData(null);setAllergenData(null);setPraeferenzenData(null);setSelectedCountry("Schweiz");setIsDemoMode(false);setTier("basic");setPhase("intro");
  };
  // Rückfrage vor dem Zurücksetzen («↩ Neu» ohne Text, «Konto löschen» mit eigenem Text). Gibt true zurück, wenn zurückgesetzt wurde.
  const confirmReset=msg=>{
    const text=typeof msg==="string"&&msg.trim()?msg:"Neue Analyse starten? Deine Angaben und dein PRO-Zugang auf diesem Gerät werden gelöscht.";
    let ok=false;
    try{ ok=window.confirm(text); }catch{ ok=false; }
    if(!ok) return false;
    reset();
    return true;
  };

  // Dev shortcut - only active when ?dev=1 in URL
  const DEV_SPORT={primarySport:"cycling",selectedSports:["cycling","running"],sel:{cycling:true,running:true},subSel:{cycling_road:true,run_road:true},childSel:{"run_road_run_road_m":true},healthOnly:false};
  const DEV_TRAINING={cycling:{days:5,intensity:"high",duration:90,hasCompetition:true,compCount:8,compTypes:["Rennen"],trainingTimes:["morning"],sweatRate:"high"},running:{days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:3,compTypes:[],trainingTimes:["morning"],sweatRate:"medium"}};
  const DEV_PROFIL={firstname:"Kevin",lastname:"Oberholzer",email:"kevin@test.ch",gender:"m",birthyear:"1988",height:"192",weight:"100",country:"Schweiz",platform:"wahoo",rhr:"48",sleep:"7",goal:"performance",stressLevel:3,dietQuality:"good",altitude:"low",recoveryStatus:"good",jobActivity:"sedentary",sleepHours:"7",waterIntake:"medium",sunExposure:"low",caffeineDaily:"medium",bodyComposition:"athletic",cyclePhase:null,currentSupps:["kreatin"],medications:["none"],monthlyBudget:"high",injuries:[]};
  const DEV_ALLERGEN={allergens:[],noAllergens:true,diet:["none"]};
  const DEV_PRAEF={suppForm:"pulver",energieForm:["gel","drink"],proteinForm:["whey"],recoveryForm:["magnesium"]};
  const devJump=(target,t="basic")=>{
    setSportData(DEV_SPORT);setTrainingData(DEV_TRAINING);setProfilData(DEV_PROFIL);
    setAllergenData(DEV_ALLERGEN);setPraeferenzenData(DEV_PRAEF);setTier(t);setPhase(target);
  };

  React.useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.get("pro")==="success"){
      window.history.replaceState(window.history.state,"",window.location.pathname);
      try{
        const pre=window.sessionStorage.getItem("treyn_pre_payment");
        if(pre){
          const {sd,td,pd,ad,pf}=JSON.parse(pre)||{};
          if(sd)setSportData(sd); if(td)setTrainingData(td);
          if(pd){ setProfilData(pd); setSelectedCountry(pd.country||"Schweiz"); }
          if(ad)setAllergenData(ad); if(pf)setPraeferenzenData(pf);
          window.sessionStorage.removeItem("treyn_pre_payment");
          setTier("pro"); setPhase((sd&&td&&pd)||savedHasData?"results":"intro");
          return;
        }
      }catch{}
      setTier("pro"); setPhase(savedHasData?"results":"intro");
    }
  },[]);

  const openStripePayment=(sd,td,pd,ad,pf)=>{
    // CH → CHF 12.90 | DE/AT → EUR 9.90
    const country=pd?.country||"Schweiz";
    const isEUR=["Deutschland","Österreich"].includes(country);
    const STRIPE_CHF="https://buy.stripe.com/DEIN_PAYMENT_LINK_CHF"; // CHF 12.90
    const STRIPE_EUR="https://buy.stripe.com/DEIN_PAYMENT_LINK_EUR"; // EUR 9.90
    const STRIPE_LINK=isEUR?STRIPE_EUR:STRIPE_CHF;
    const isPlaceholder=STRIPE_LINK.includes("DEIN_PAYMENT_LINK");
    if(isPlaceholder){
      if(sd)setSportData(sd); if(td)setTrainingData(td); if(pd)setProfilData(pd); if(ad)setAllergenData(ad); if(pf)setPraeferenzenData(pf);
      setTier("pro"); setPhase("results"); return;
    }
    try{ window.sessionStorage.setItem("treyn_pre_payment",JSON.stringify({sd,td,pd,ad,pf})); }catch{}
    window.location.href=STRIPE_LINK;
  };

  const startDemo=()=>{
    if(!isDemoMode) preDemo.current={sportData,trainingData,profilData,allergenData,praeferenzenData,tier};
    setIsDemoMode(true);
    setSportData({primarySport:"cycling",selectedSports:["cycling","running"],sel:{cycling:true,running:true},subSel:{road:true,gravel:true,run_road:true},childSel:{},healthOnly:false});
    setTrainingData({
      cycling:{days:5,intensity:"high",duration:120,hasCompetition:true,compCount:12,compTypes:["Rennen"]},
      running:{days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:0,compTypes:[]},
    });
    setProfilData({firstname:"Selina",lastname:"Demo",email:"selina@demo.ch",gender:"f",birthyear:"1993",height:"168",weight:"62",country:"Schweiz",platform:"garmin",rhr:"58",sleep:"7.5"});
    setAllergenData({allergens:[],customAllergens:"",noAllergens:true});
    setPraeferenzenData({suppForm:"beides",energieForm:"gel",proteinForm:"shake"});
    setTier("pro");
    setPhase("demo");
  };
  const launchDemo=()=>{
    setPhase("results");
  };
  // Demo verlassen: Musterdaten weg, eigene Angaben und eigener Tarif zurück
  const exitDemo=()=>{
    if(!isDemoMode) return;
    const s=preDemo.current||{};
    preDemo.current=null;
    setSportData(s.sportData??null); setTrainingData(s.trainingData??null); setProfilData(s.profilData??null);
    setAllergenData(s.allergenData??null); setPraeferenzenData(s.praeferenzenData??null);
    setTier(s.tier==="pro"?"pro":"basic");
    setIsDemoMode(false);
  };

  return (
    <div style={{minHeight:"100vh",background:C.white,fontFamily:"Inter,sans-serif"}}>
      <style>{css}</style>
      {devMode&&(
        <div style={{position:"fixed",bottom:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
          <div style={{fontSize:10,color:"#999",fontFamily:"Inter,sans-serif",fontWeight:500,textAlign:"right",marginBottom:2}}>Dev Mode</div>
          {[
            {l:"→ Sport",       t:"sport"},
            {l:"→ Training",    t:"training"},
            {l:"→ Profil",      t:"profil"},
            {l:"→ Lebensstil",  t:"lebensstil"},
            {l:"→ Allergien",   t:"allergien"},
            {l:"→ Präferenzen", t:"praeferenzen"},
            {l:"→ Results BASIC",t:"results",tier:"basic"},
            {l:"→ Results PRO",  t:"results",tier:"pro"},
          ].map(({l,t,tier:tr})=>(
            <button key={l} onClick={()=>devJump(t,tr||"basic")}
              style={{background:"#0A0A0A",color:"#C8FF00",border:"none",borderRadius:7,padding:"5px 12px",fontSize:11,fontFamily:"Inter,sans-serif",fontWeight:500,cursor:"pointer",whiteSpace:"nowrap"}}>
              {l}
            </button>
          ))}
        </div>
      )}
      {phase==="intro"      && <Intro           onNext={()=>setPhase("why")} onDemo={startDemo}/>}
      {phase==="why"        && <WhyTREYN         onNext={()=>setPhase("demo")}/>}
      {phase==="demo"       && <Demo            onNext={()=>{exitDemo();setPhase("sport");}} onDemo={launchDemo}/>}
      {phase==="sport"      && <StepSport       initial={sportData} onNext={v=>{setSportData(v);setPhase("training");}}/>}
      {phase==="training"   && <StepTraining    initial={trainingData} sportData={sportData} onBack={()=>goBack("sport")} onNext={v=>{setTrainingData(v);setPhase("profil");}}/>}
      {phase==="profil"     && <StepProfil      initial={profilData} sportData={sportData} trainingData={trainingData} onBack={()=>goBack("training")} onNext={v=>{setProfilData(p=>({...(p||{}),...(v||{})}));setSelectedCountry(v?.country||"Schweiz");setPhase("lebensstil");}}/>}
      {phase==="lebensstil" && <StepLebensstil  initial={profilData} gender={profilData?.gender||""} onBack={()=>goBack("profil")} onNext={v=>{setProfilData(p=>({...p,...v}));setPhase("allergien");}}/>}
      {phase==="allergien"  && <StepAllergien   initial={allergenData} onBack={()=>goBack("lebensstil")} onNext={v=>{setAllergenData(v);setPhase("praeferenzen");}}/>}
      {phase==="praeferenzen" && <StepPraeferenzen initial={praeferenzenData} onBack={()=>goBack("allergien")} onNext={v=>{setPraeferenzenData(v);setPhase("willkommen");}}/>}
      {phase==="willkommen" && <StepWillkommen priceStr={PRICE_GLOBAL} onNext={()=>setPhase("analysing")}/>}
      {phase==="preview"    && <AnalysePreview  priceStr={PRICE_GLOBAL} sportData={sportData} trainingData={trainingData} profilData={profilData}
        onContinue={()=>{setTier("basic");setPhase("results");}}
        onUpgrade={()=>openStripePayment(sportData,trainingData,profilData,allergenData,praeferenzenData)}/>}
      {phase==="analysing" && <AnalysingScreen onDone={()=>setPhase(tier==="pro"?"results":"preview")} profilData={profilData} sportData={sportData}/>}
      {phase==="results"    && isDemoMode&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,background:"#0A0A0A",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setPhase("demo")} style={{fontSize:12,color:"rgba(255,255,255,.5)",background:"none",border:"1px solid rgba(255,255,255,.15)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>{"← Zurück"}</button>
            <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:C.neon,color:"#000",fontWeight:600,fontFamily:"Inter,sans-serif"}}>Demo</span>
            <span style={{fontSize:13,color:"#fff"}}>Musterprofil von Selina · Du siehst alle PRO-Features</span>
          </div>
          <button onClick={()=>{exitDemo();setPhase("intro");}} style={{fontSize:12,color:C.neon,background:"none",border:`1px solid ${C.neon}`,borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:500}}>Eigene Analyse starten →</button>
        </div>
      )}
      {phase==="results"    && <Results         sportData={sportData} trainingData={trainingData} profilData={profilData} allergenData={allergenData} praeferenzenData={praeferenzenData} tier={tier} onReset={confirmReset}
        onTrainingChange={setTrainingData}
        onEditSports={()=>setPhase("sport")}
        onProfilChange={p=>{ if(!p) return; setProfilData(prev=>({...(prev||{}),...p})); if(p.country) setSelectedCountry(p.country); }}
        onUpgrade={()=>openStripePayment(sportData,trainingData,profilData,allergenData,praeferenzenData)}/>}
    </div>
  );
}

function AppWithBoundary() {
  return (
    <ErrorBoundary>
      <App/>
    </ErrorBoundary>
  );
}
export default AppWithBoundary;
