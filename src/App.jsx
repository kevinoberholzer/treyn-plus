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
  .mob-nav{display:none;}
  @media(max-width:768px){
    .mob-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:${C.white};border-top:0.5px solid ${C.g200};z-index:200;padding:0 4px 2px;padding-bottom:max(8px,env(safe-area-inset-bottom));}
    .desktop-sidebar{display:none !important;}
    .su{padding-bottom:20px;}
    .fu2,.fu3,.fu4,.fu5{animation:fadeUp .4s ease forwards;opacity:0;}
    button{min-height:40px;}
  }
  @media(min-width:769px){.mob-nav{display:none !important;}}
`;

// ─── SPORT GROUPS ─────────────────────────────────────────────────────────────

const SPORT_GROUPS = [
  {id:"cycling",        label:"Cycling",             icon:"CYCLE", subs:[
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
  {id:"running",        label:"Running",             icon:"RUN",   subs:[
    {id:"run_road",       label:"Strassenlauf",        children:[
      {id:"run_road_5k",    label:"5–10km"},
      {id:"run_road_10k",   label:"10–20km"},
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
      {id:"langlauf_klassisch_mittel",label:"Mittel (15–50km)"},
      {id:"langlauf_klassisch_lang",  label:"Lang (50km+)"},
    ]},
    {id:"langlauf_skating",   label:"Skating",             children:[
      {id:"langlauf_skating_kurz",  label:"Kurz (bis 15km)"},
      {id:"langlauf_skating_mittel",label:"Mittel (15–50km)"},
      {id:"langlauf_skating_lang",  label:"Lang (50km+)"},
    ]},
    {id:"biathlon",           label:"Biathlon",            children:null},
  ]},
  {id:"tennis",         label:"Tennis & Padel",      icon:"TENNIS",subs:[
    {id:"tennis",         label:"Tennis",              children:null},
    {id:"padel",          label:"Padel",               children:null},
  ]},
  {id:"leichtathletik", label:"Leichtathletik",      icon:"ATHLETICS", subs:[
    {id:"la_sprint",      label:"Sprint (100m–400m)",  children:null},
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
  cycling:"Wettkämpfe / Rennen",running:"Wettkämpfe / Rennen",triathlon:"Wettkämpfe / Rennen",schwimmen:"Wettkämpfe",
  fussball:"Wettkämpfe / Spiele",eishockey:"Wettkämpfe / Spiele",
  fitness:"Wettkämpfe",ski_snow:"Wettkämpfe / Rennen",langlauf:"Wettkämpfe / Rennen",
  golf:"Turniere",basketball:"Wettkämpfe / Spiele",american_football:"Wettkämpfe / Spiele",
  handball_vball:"Wettkämpfe / Spiele",tennis:"Wettkämpfe / Spiele",
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

const AFF = {
  iherb:       q    => `https://iherb.com/search?kw=${encodeURIComponent(q)}&rcode=DEIN_CODE`,
  maurten:     slug => `https://www.maurten.com/products/${slug}?ref=DEIN_CODE`,
  mnstry:      slug => `https://mnstry.com/products/${slug}?ref=DEIN_CODE`,
  myprotein:   q    => `https://www.myprotein.com/search?query=${encodeURIComponent(q)}&affil=DEIN_CODE`,
  sponser:     q    => `https://www.sponser.ch/de/search?q=${encodeURIComponent(q)}`,
  esn:         slug => `https://www.esn.com/products/${slug}?ref=DEIN_CODE`,
  morenutrition: slug => `https://www.more-nutrition.de/products/${slug}?ref=DEIN_CODE`,
  galaxus:     q    => `https://www.galaxus.ch/de/s1/producttype/sport-ernaehrung-16?q=${encodeURIComponent(q)}&tagIds=1394`,
  more_sirup:  () => `https://www.more-nutrition.de/collections/sirup?ref=DEIN_CODE`,
  lmnt:        () => `https://drinklmnt.com/?via=DEIN_CODE`,
  erdinger:    () => `https://www.erdinger.de/bierspezialitaeten/erdinger-alkoholfrei.html`,
  athletic:    () => `https://athleticbrewing.com/?ref=DEIN_CODE`,
  therabody:   () => `https://www.therabody.com/de-ch?ref=DEIN_CODE`,
  hyperice:    () => `https://hyperice.com/?ref=DEIN_CODE`,
  blackroll:   () => `https://www.blackroll.com/ch-de?ref=DEIN_CODE`,
  compex:      () => `https://www.compex.com/ch-de?ref=DEIN_CODE`,
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
  // ─── SKI (Alpin, Freeride, Freestyle, Snowboard) ────────────────────────────
  ski:{
    performance:[
      {id:"krea_ski", name:"Kreatin Monohydrat", dose:"5g täglich", when:"Nach Training / Fahrtag", why:"Explosivität und Schnellkraft für kurze maximale Belastungen — perfekt für Alpin.", tags:["Täglich","Kraft"], link:AFF.iherb("creatine monohydrate"), shop:"iHerb", priority:1,
       protocol:{dauer:"Saisonbegleitend", pause:"Keine", timing:"Nach Training oder Abends", hinweis:"Besonders wertvoll in Wettkampfblöcken und intensiven Trainingslagern."}},
      {id:"koff_ski", name:"Koffein 100–200mg", dose:"100–200mg", when:"45 min vor erstem Lauf", why:"Reaktionszeit, Fokus und Kältestress-Pufferung — an Wettkampftagen kritisch.", tags:["Pre-Race","Koffein"], link:AFF.iherb("caffeine"), shop:"iHerb", priority:1,
       protocol:{dauer:"Wettkampf- und Intensivtage", pause:"Koffein-Pause 1 Woche vor Hauptrennen", timing:"45 min vor Start", hinweis:"Kältewetter steigert Koffeinwirkung leicht. Kein Koffein nach 16 Uhr."}},
    ],
    recovery:[
      {id:"whey_ski", name:"Whey Protein Isolat", dose:"25–30g", when:"Nach Fahrtag", why:"Intensive Muskelarbeit (Oberschenkel, Rumpf) — Reparatur nach dem Fahren.", tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Ganzjährig nach intensiven Tagen", pause:"Keine", timing:"Innerhalb 30 min nach letztem Lauf", hinweis:"Mit 50–60g Kohlenhydraten kombinieren."}},
      {id:"koll_ski", name:"Kollagen + Vitamin C", dose:"10–15g", when:"30 min vor erstem Lauf", why:"Knöchel, Knie und Sehnen unter extremer Belastung — Prävention kritisch.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Saisonbegleitend, täglich", pause:"Keine", timing:"30 min VOR dem Fahren", hinweis:"Typ II Kollagen für Gelenkknorpel bevorzugen."}},
    ],
    endurance:[
      {id:"elek_ski", name:"Elektrolyt-Tabs", dose:"1 Tab / 0.5L", when:"Während Fahrtag", why:"Kältewetter täuscht über Flüssigkeitsverlust — Hydration trotzdem kritisch.", tags:["Hydration","Kälte"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:2,
       protocol:{dauer:"Ganzjährig bei intensivem Betrieb", pause:"Keine", timing:"Alle 60–90 min auf der Piste", hinweis:"Im Winter trinken viele zu wenig — Durstgefühl ist gedämpft bei Kälte."}},
    ],
    health:[
      {id:"vd3_ski", name:"Vitamin D3 + K2", dose:"3000–4000 IE", when:"Morgens", why:"Knochen, Muskelkraft, Immunsystem — Ski-Saison = wenig direkte Sonne.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig, Winter: höhere Dosis", pause:"Keine", timing:"Morgens mit fetthaltiger Mahlzeit", hinweis:"Bluttest Oktober und März empfohlen."}},
    ],
  },
  // ─── SKI TOURING / SPLITBOARD ───────────────────────────────────────────────
  ski_touring:{
    performance:[
      {id:"mau_gel_st", name:"Maurten Gel 100", dose:"1 Gel alle 45–60 min", when:"Aufstieg über 90 min", why:"Ausdauerleistung für lange Aufstiege — magenfreundlich auch bei Kälte.", tags:["Aufstieg","Carbs"], link:AFF.maurten("gel-100"), shop:"Maurten", priority:1,
       protocol:{dauer:"Bei Touren, kein Zyklus", pause:"Keine", timing:"Ab 30 min, alle 45–60 min", hinweis:"Bei Kälte Gels nahe am Körper tragen — verhindert Eingefrieren."}},
    ],
    recovery:[
      {id:"koll_st", name:"Kollagen + Vitamin C", dose:"10–15g", when:"30 min vor Tour", why:"Knie und Hüfte unter langen Abstiegen besonders belastet.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig bei intensivem Tourenfahren", pause:"Keine", timing:"30 min VOR der Tour", hinweis:"Abstiege belasten Gelenke stärker als Aufstiege — nicht vergessen."}},
      {id:"whey_st", name:"Whey Protein Isolat", dose:"25–30g", when:"Nach Tour", why:"Lange Ausdauerbelastung mit Kraft-Komponente — Muskelreparatur wichtig.", tags:["Post-Tour","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Nach jeder langen Tour", pause:"Keine", timing:"Innerhalb 30–45 min", hinweis:"Mit Kohlenhydraten kombinieren für maximale Recovery."}},
    ],
    endurance:[
      {id:"elek_st", name:"Elektrolyt-Tabs", dose:"1 Tab / 0.5L", when:"Alle 60 min", why:"Langer Ausdaueroutput bei Kälte — Elektrolyte trotz gedämpftem Durstgefühl.", tags:["Hydration"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:1,
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
      {id:"mau_gel_xl", name:"Maurten Gel 100 CAF 100", dose:"1 Gel alle 30–40 min", when:"Rennen & Intervalle", why:"Koffein + Carbs für maximale Ausdauerleistung — einer der höchsten VO2max-Sportarten.", tags:["Race-Day","Koffein"], link:AFF.maurten("gel-100-caf-100"), shop:"Maurten", priority:1,
       protocol:{dauer:"Wettkampftage", pause:"Nicht täglich", timing:"30–40 min vor Start oder während", hinweis:"Langlauf hat einen der höchsten Energieumsätze aller Sportarten — Kohlenhydrate kritisch."}},
      {id:"rbeete_xl", name:"Rote Beete Nitrat", dose:"400–600mg Nitrat", when:"2–3h vor Training", why:"O2-Effizienz verbessern — bei Langläufern besonders relevant durch Altitude-Einsatz.", tags:["Pre-Training","Natürlich"], link:AFF.iherb("beet root nitrate"), shop:"iHerb", priority:2,
       protocol:{dauer:"6–7 Tage laden, dann täglich", pause:"Keine", timing:"2–3h vor Start", hinweis:"Kein Mundwasser vor Training — hemmt Nitratumwandlung durch Mundbakterien."}},
    ],
    endurance:[
      {id:"mau_320_xl", name:"Maurten Drink Mix 320", dose:"80g / 500ml", when:"Einheiten über 90 min", why:"Höchste Kohlenhydratdichte für Langlauf-typische 2–4h Ausdauereinheiten.", tags:["Training","Carbs"], link:AFF.maurten("drink-mix-320"), shop:"Maurten", priority:1,
       protocol:{dauer:"Bei langen Einheiten", pause:"Keine", timing:"Ab 30 min, 1 Flasche pro Stunde", hinweis:"Bei Kälte: Thermosflasche, GI-Training im Sommer."}},
      {id:"elek_xl", name:"Elektrolyt-Tabs", dose:"1 Tab / 0.5L", when:"Alle 60 min", why:"Hoher Natriumverlust auch bei Kälte — Krampfprävention essentiell.", tags:["Hydration"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Regelmässig alle 60 min", hinweis:"Langlauf hat hohe Schweissraten trotz Kälteempfinden."}},
    ],
    recovery:[
      {id:"whey_xl", name:"Whey Protein Isolat", dose:"25–30g", when:"Direkt nach Einheit", why:"Ganzkörper-Ausdauerbelastung mit hohem Muskelabbau — schnelle Reparatur.", tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Ganzjährig nach Einheiten", pause:"Keine", timing:"Innerhalb 30 min", hinweis:"Mit 60–80g Kohlenhydraten kombinieren."}},
    ],
    health:[
      {id:"eisen_xl", name:"Eisen (Ferrochel)", dose:"25–50mg nach Bluttest", when:"Morgens nüchtern", why:"Langlauf = einer der höchsten Eisenbedarfe aller Sportarten durch hohes Volumen.", tags:["Bluttest","Basis"], link:AFF.iherb("iron ferrochel"), shop:"iHerb", priority:1,
       protocol:{dauer:"3–6 Monate", pause:"Nur bei nachgewiesenem Mangel", timing:"Morgens nüchtern + Vit C", hinweis:"Bluttest zwingend: Ferritin-Zielwert Sportler >50 ng/ml."}},
      {id:"vd3_xl", name:"Vitamin D3 + K2", dose:"3000 IE", when:"Morgens", why:"Knochen und Immunsystem für Wintersport — Mangel im Winter häufig.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Bluttest Oktober und März."}},
    ],
  },
  // ─── TENNIS & PADEL ─────────────────────────────────────────────────────────
  tennis:{
    performance:[
      {id:"krea_ten", name:"Kreatin Monohydrat", dose:"5g täglich", when:"Nach Training", why:"Explosive Schläge und Sprints — Kreatin verbessert Wiederholbarkeit.", tags:["Täglich","Kraft"], link:AFF.iherb("creatine monohydrate"), shop:"iHerb", priority:1,
       protocol:{dauer:"Saisonbegleitend", pause:"Keine", timing:"Nach Training", hinweis:"Besonders wertvoll bei Turnierblöcken mit mehreren Spielen täglich."}},
      {id:"koff_ten", name:"Koffein 100–200mg", dose:"100–150mg", when:"45 min vor Spiel", why:"Reaktionszeit und Konzentration für lange Matches.", tags:["Pre-Match","Koffein"], link:AFF.iherb("caffeine"), shop:"iHerb", priority:1,
       protocol:{dauer:"Spiel- und Intensivtage", pause:"Koffein-Pause an Ruhetagen", timing:"45 min vor Match", hinweis:"Kein Koffein nach 16 Uhr."}},
    ],
    endurance:[
      {id:"elek_ten", name:"Elektrolyt-Tabs", dose:"1–2 Tabs / 0.5L", when:"Während langem Match", why:"Tennis-Matches können 3–5h dauern — Natrium- und Kaliumverlust erheblich.", tags:["Hydration","Match"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:1,
       protocol:{dauer:"Bei Matches über 90 min", pause:"Keine", timing:"Alle 60 min trinken", hinweis:"Seitenwechsel nutzen für Hydration."}},
    ],
    recovery:[
      {id:"koll_ten", name:"Kollagen + Vitamin C", dose:"10–15g", when:"30 min vor Training", why:"Ellbogen, Schulter und Handgelenk unter chronischem Stress — Prävention.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"30 min VOR Training", hinweis:"Tennisellbogen-Prävention: Kollagen + Exzentrische Übungen."}},
      {id:"whey_ten", name:"Whey Protein Isolat", dose:"25g", when:"Nach Training / Match", why:"Muskelreparatur nach schlagintensivem Training.", tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:2,
       protocol:{dauer:"Nach Trainings und Matches", pause:"Keine", timing:"Innerhalb 30 min", hinweis:"Mit Kohlenhydraten kombinieren."}},
    ],
    health:[
      {id:"vd3_ten", name:"Vitamin D3 + K2", dose:"2000 IE", when:"Morgens", why:"Knochen, Muskulatur und Immunsystem — Basis für alle Sportler.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Bluttest nach 3 Monaten."}},
    ],
  },
  // ─── KAMPFSPORT ─────────────────────────────────────────────────────────────
  kampfsport:{
    performance:[
      {id:"krea_ks", name:"Kreatin Monohydrat", dose:"5g täglich", when:"Nach Training", why:"Explosive Kraft und Kraft-Wiederholbarkeit — essentiell im Kampfsport.", tags:["Täglich","Kraft"], link:AFF.iherb("creatine monohydrate"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Nach Training", hinweis:"Bei Gewichtsklassen: Kreatin kann 0.5–1kg Wassereinlagerung verursachen."}},
      {id:"beta_ks", name:"Beta-Alanin", dose:"3.2–4.8g täglich", when:"Aufgeteilt auf 2–3 Dosen", why:"Puffert Laktat bei intensiven Sparring- und Konditionseinheiten.", tags:["Ausdauer","Puffer"], link:AFF.iherb("beta alanine"), shop:"iHerb", priority:1,
       protocol:{dauer:"8–12 Wochen (Kur)", pause:"9 Wochen Pause", timing:"Täglich aufgeteilt", hinweis:"Kribbeln harmlos. Wirkt v.a. bei 1–4 min Belastungen."}},
    ],
    recovery:[
      {id:"whey_ks", name:"Whey Protein Isolat", dose:"30–35g", when:"Direkt post-Training", why:"Hoher Muskelabbau durch Kontaktsport — Reparatur und Aufbau priorisieren.", tags:["Post-Training","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Innerhalb 30 min", hinweis:"Bei 2× täglich Training: nach jeder Einheit Protein."}},
      {id:"koll_ks", name:"Kollagen + Vitamin C", dose:"10–15g", when:"30 min vor Training", why:"Gelenke, Sehnen und Bänder unter extremer Belastung bei Würfen und Schlägen.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"30 min VOR Training", hinweis:"Typ I/II Kollagen für Bänder und Sehnen."}},
    ],
    endurance:[
      {id:"elek_ks", name:"Elektrolyt-Tabs", dose:"1–2 Tabs / 0.5L", when:"Sparring und lange Einheiten", why:"Hohes Schweissvolumen bei Kampfsport-Training — Krämpfe vermeiden.", tags:["Hydration"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:1,
       protocol:{dauer:"Bei Trainingstagen", pause:"Keine", timing:"Während Training", hinweis:"Besonders bei Sauna-Sessions zur Gewichtsreduktion: Elektrolyte danach."}},
    ],
    health:[
      {id:"vd3_ks", name:"Vitamin D3 + K2", dose:"2000–3000 IE", when:"Morgens", why:"Knochen, Immunsystem, Hormonprofil — Basis für Kampfsportler.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Bluttest nach 3 Monaten."}},
    ],
  },
  // ─── MTB ENDURO / DOWNHILL ──────────────────────────────────────────────────
  cycling_mtb:{
    performance:[
      {id:"krea_mtb", name:"Kreatin Monohydrat", dose:"5g täglich", when:"Nach Training / Fahrtag", why:"DH und Enduro: explosive Kraft, Bremsmanöver, Jumps — Kreatin direkt relevant.", tags:["Täglich","Kraft"], link:AFF.iherb("creatine monohydrate"), shop:"iHerb", priority:1,
       protocol:{dauer:"Saisonbegleitend", pause:"Keine", timing:"Nach Fahrtag", hinweis:"Besonders für DH: kurze explosive Läufe profitieren maximal von Kreatin."}},
      {id:"koff_mtb", name:"Koffein 100–200mg", dose:"100–200mg", when:"45 min vor Fahrtag", why:"Fokus, Reaktionszeit und Risikoabschätzung auf technischem Terrain.", tags:["Pre-Ride","Koffein"], link:AFF.iherb("caffeine"), shop:"iHerb", priority:1,
       protocol:{dauer:"Fahrtage", pause:"Ruhetage koffeinfrei", timing:"45 min vor erstem Run", hinweis:"Kein Koffein nach 16 Uhr."}},
    ],
    recovery:[
      {id:"whey_mtb", name:"Whey Protein Isolat", dose:"25–30g", when:"Nach Fahrtag", why:"Explosiver Muskeleinsatz und Sturzrisiko — Reparatur und Aufbau priorisieren.", tags:["Post-Ride","Protein"], link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", priority:1,
       protocol:{dauer:"Nach Fahrtagen", pause:"Keine", timing:"Innerhalb 30 min", hinweis:"Mit 40–60g Kohlenhydraten kombinieren."}},
      {id:"koll_mtb", name:"Kollagen + Vitamin C", dose:"10–15g", when:"30 min vor Fahrtag", why:"Gelenke, Handgelenke und Schultern unter extremer technischer Belastung.", tags:["Gelenke","Prävention"], link:AFF.iherb("collagen vitamin c"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"30 min VOR dem Fahren", hinweis:"Bei Stürzen: Kollagendosis temporär auf 20g erhöhen."}},
    ],
    endurance:[
      {id:"elek_mtb", name:"Elektrolyt-Tabs", dose:"1 Tab / 0.5L", when:"Lange Enduro-Tage", why:"Enduro: Uphills und Stages können 4–6h dauern — Hydration unterschätzt.", tags:["Hydration"], link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", priority:2,
       protocol:{dauer:"Bei Enduro-Events", pause:"Keine", timing:"Alle 60–90 min", hinweis:"DH: kürzere Sessions, weniger Hydrationsbedarf als Enduro."}},
    ],
    health:[
      {id:"vd3_mtb", name:"Vitamin D3 + K2", dose:"2000–3000 IE", when:"Morgens", why:"Knochen und Immunsystem — nach Stürzen und für Knochenstruktur wichtig.", tags:["Basis","Täglich"], link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", priority:1,
       protocol:{dauer:"Ganzjährig", pause:"Keine", timing:"Morgens mit Mahlzeit", hinweis:"Bluttest nach 3 Monaten."}},
    ],
  },
}


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
    suppKey = sportId==="cycling"?"cycling":sportId==="running"?"running":sportId==="triathlon"?"running":(sportId==="fitness"||sportId==="hyrox"||sportId==="crossfit_d"||sportId==="kraft")?"fitness":sportId==="fussball"?"fussball":null;
  }

  const specific = suppKey&&SPORT_SUPP[suppKey]?(SPORT_SUPP[suppKey][goalId]||[]):(GENERIC_SUPP[goalId]||[]);
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
    {text:"Die präziseste Gesundheits- & Leistungsanalyse für Vitamine, Supplemente und Sportnahrung.",size:27,weight:600,tracking:"-.03em",color:C.black,leading:1.2,mb:6,delay:180},
    {text:"Die meisten Sportler raten. TREYN+ berechnet — und erklärt dir als einzige Plattform jeden Wert, damit du weisst was du damit machst. Berechnet aus 50+ Sportdisziplinen · 22 persönlichen Datenpunkten · 16 Berechnungsmodellen · MET-2024 Standard.",size:13,weight:400,color:C.g800,leading:1.6,mb:24,delay:200},
    {text:"56% aller Sportler haben zu wenig Vitamin D im Blut.",size:13,weight:600,color:C.black,leading:1.4,mb:4,highlight:true,delay:220},
    {text:"81% der Fussball- und Basketballspieler: Vitamin D-Mangel — obwohl sie regelmässig Sport treiben. (Frontiers in Nutrition, 2021)",size:13,weight:400,color:C.g600,leading:1.65,mb:18,delay:180},
    {text:"Nur 40% der Freizeitsportler supplementieren überhaupt.",size:13,weight:600,color:C.black,leading:1.4,mb:4,highlight:true,delay:220},
    {text:"Der Rest hofft, dass die Ernährung reicht. Tut sie nicht — besonders nicht bei intensivem Training. (PubMed, 2018)",size:13,weight:400,color:C.g600,leading:1.65,mb:20,delay:180},
    {text:"Auf Basis deiner Daten berechnet TREYN+ deine Bedarfswerte, optimalen Supplemente & Sportnahrung — präziser als jede andere Plattform.",size:13,weight:400,color:C.g800,leading:1.7,mb:4,delay:160},
    {text:"Ab sofort verfügbar in aktuell 22 Ländern.",size:13,weight:400,color:C.g800,leading:1.7,mb:4,delay:160},
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
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <button className="btn btn-neon" style={{fontSize:15,padding:"14px 28px"}} onClick={onNext}>Analyse starten →</button>
                <span style={{fontSize:12,color:C.g600,fontWeight:500}}>Kostenlos starten.</span>
              </div>
            </div>
            <ReviewsRow/>
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
  const isMobile=useWindowWidth()<=768;
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
        <div className="fu4" style={{display:"flex",alignItems:"center",marginBottom:16}}>
          <div style={{height:1,flex:1,background:C.g200}}/>
          <div style={{fontSize:11,color:C.g400,padding:"0 12px"}}>3 Minuten · Magic Link Login</div>
          <div style={{height:1,flex:1,background:C.g200}}/>
        </div>

        {/* Platform Stats */}
        <div className="fu4" style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:6,marginBottom:16}}>
          {[
            {val:"50+",  label:"Sport­dis­zip­linen"},
            {val:"12",   label:"Daten­punkte pro User"},
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
          <button className="btn btn-neon" style={{width:"100%",fontSize:15,padding:"14px",marginBottom:10}} onClick={onNext}>Analyse starten →</button>
          <button onClick={onDemo} style={{width:"100%",padding:"12px",borderRadius:12,border:`1px solid ${C.g200}`,background:"#F8F8F8",color:"#666",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            Demo-Plattform ausprobieren →
          </button>
          <div style={{textAlign:"center",marginTop:8,fontSize:11,color:C.g400}}>Kein Passwort — Login per E-Mail-Link</div>
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

const REVIEWS=[
  {name:"Marco R.",sport:"Rennrad · Ironman",stars:5,text:"Endlich eine Plattform die mir wirklich sagt was ich brauche. Keine generischen Empfehlungen — alles auf mein Gewicht und Training gerechnet. Das Supplement-Timing hat meine Recovery komplett verändert.",date:"März 2025"},
  {name:"Sarah M.",sport:"Marathon · Trail",stars:5,text:"Ich hab 3 Jahre lang Supplements nach Gefühl genommen. Nach TREYN+ weiss ich: ich hatte die Hälfte des Eisens was ich brauchte. Erster Test danach — PR beim Zürich Marathon.",date:"April 2025"},
  {name:"Lukas B.",sport:"Hyrox · CrossFit",stars:5,text:"Die Carb-Berechnung für Wettkampftage ist gold. Ich dachte ich esse genug — war aber 600 kcal zu wenig an jedem Trainingstag. Massiver Unterschied seither.",date:"Februar 2025"},
];

function ReviewStars({n=5,size=12}){
  return <span style={{color:"#F5A623",fontSize:size,letterSpacing:1}}>{"★".repeat(n)}</span>;
}

function ReviewsRow(){
  return (
    <div style={{marginTop:16,display:"flex",alignItems:"center",gap:8}}>
      <ReviewStars n={5} size={11}/>
      <span style={{fontSize:11,color:C.g500,fontWeight:500}}>4.9</span>
      <span style={{fontSize:11,color:C.g400}}>· 87 Google Reviews</span>
    </div>
  );
}

function ReviewsCompact(){
  const r=REVIEWS[0];
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 0",borderTop:`0.5px solid ${C.g100}`}}>
      <ReviewStars n={5} size={10}/>
      <div style={{fontSize:11,color:C.g400,lineHeight:1.5,fontStyle:"italic"}}>"{r.text.slice(0,80)}…" — {r.name}</div>
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
  const [sel,setSel]=useState({});
  const [subSel,setSubSel]=useState({});
  const [childSel,setChildSel]=useState({});
  const [expanded,setExpanded]=useState(null);
  const [subExp,setSubExp]=useState(null);

  const toggleGroup=(id,hasSubs)=>{
    if(hasSubs){
      const isOn=!!sel[id];
      if(isOn&&expanded===id){
        setSel(s=>({...s,[id]:false}));
        setExpanded(null);
        const group=SPORT_GROUPS.find(g=>g.id===id);
        if(group?.subs){
          setSubSel(s=>{const n={...s};group.subs.forEach(sb=>{n[sb.id]=false;});return n;});
          setChildSel(s=>{const n={...s};group.subs.forEach(sb=>{sb.children?.forEach(ch=>{delete n[sb.id+"_"+ch.id];});});return n;});
        }
      } else {
        setExpanded(e=>e===id?null:id);
        setSel(s=>({...s,[id]:true}));
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
      } else {
        // Select: open children picker
        setSubExp(x=>x===sub.id?null:sub.id);
        setSubSel(s=>({...s,[sub.id]:true}));
        setSel(g=>({...g,[groupId]:true}));
      }
    } else {
      setSubSel(s=>({...s,[sub.id]:!s[sub.id]}));
      setSel(g=>({...g,[groupId]:true}));
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

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:C.white,padding:"40px 24px 60px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <Progress step={1} total={6}/>
        <div className="su">
          <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:8,lineHeight:1.2}}>Wähle deine Sportarten.</h2>
          <p style={{fontSize:14,color:C.g600,marginBottom:24,lineHeight:1.65}}>Mehrfach-Auswahl möglich — selektiere alle Sportarten die du regelmässig betreibst. Bei einigen Sportarten öffnen sich die diversen Disziplinen.</p>

          {/* Health-only option */}
          {/* Sport grid */}
          {(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {SPORT_GROUPS.map(s=>{
                const active=!!sel[s.id];
                const hasSubs=s.subs&&s.subs.length>0;
                const isOpen=expanded===s.id;
                const selSubs=hasSubs?s.subs.filter(sb=>subSel[sb.id]||sb.children?.some(ch=>childSel[sb.id+"_"+ch.id])):[];
                return (
                  <div key={s.id} style={{gridColumn:isOpen?"1 / -1":"auto"}}>
                    <div onClick={()=>toggleGroup(s.id,hasSubs)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:isOpen?"13px 13px 0 0":13,cursor:"pointer",transition:"all .15s",border:`1.5px solid ${active?C.neon:C.g200}`,background:active?C.neonDim:C.white}}>
                      <div style={{width:32,height:32,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:active?C.neon:C.g100}}>
                        <SportIcon icon={s.icon} active={active} size={17}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.black}}>{s.label}</div>
                        {selSubs.length>0&&<div style={{fontSize:10,color:"rgba(0,0,0,.5)",marginTop:1}}>{selSubs.map(sb=>sb.label).join(" · ")}</div>}
                        {selSubs.length===0&&hasSubs&&<div style={{fontSize:10,color:active?"rgba(0,0,0,.45)":C.g400,marginTop:1}}>{isOpen?"Disziplin wählen →":"Disziplinen →"}</div>}
                      </div>
                      {hasSubs&&<span style={{fontSize:11,color:"rgba(0,0,0,.4)",transition:"transform .18s",display:"inline-block",transform:isOpen?"rotate(180deg)":"none"}}>▼</span>}
                      {!hasSubs&&active&&<div style={{width:18,height:18,background:C.neon,border:`1.5px solid ${C.black}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.black,flexShrink:0}}>✓</div>}
                    </div>
                    {isOpen&&hasSubs&&(
                      <div style={{padding:"10px 12px",background:C.g100,border:`1.5px solid ${C.neon}`,borderTop:"none",borderRadius:"0 0 13px 13px"}}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                          {s.subs.map(sb=>{
                            const on=!!subSel[sb.id]||(sb.children?.some(ch=>childSel[sb.id+"_"+ch.id]));
                            const isSubEx=subExp===sb.id;
                            return (
                              <div key={sb.id} onClick={e=>toggleSub(e,s.id,sb)} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:100,cursor:"pointer",fontSize:12,fontWeight:500,transition:"all .13s",background:on?C.neon:C.white,color:C.black,border:`1.5px solid ${on?C.neon:C.g200}`}}>
                                {sb.label}
                                {sb.children&&<span style={{fontSize:9,opacity:.55}}>{isSubEx?"▲":"▼"}</span>}
                                {on&&!sb.children&&<span style={{fontSize:9,color:C.black}}>✓</span>}
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

          {totalCount>0&&(
            <div style={{marginTop:10,padding:"10px 14px",background:missingDiscipline.length>0||missingChildren.length>0?"rgba(255,149,0,.08)":C.neonDim,borderRadius:11,border:`1px solid ${missingDiscipline.length>0||missingChildren.length>0?"rgba(255,149,0,.3)":C.neonBorder}`,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:6,height:6,background:missingDiscipline.length>0||missingChildren.length>0?C.orange:C.neon,borderRadius:"50%",animation:"pulse 2s infinite",flexShrink:0}}/>
              <span style={{fontSize:13,color:C.g800}}>
                {missingDiscipline.length>0
                  ? `${missingDiscipline.map(id=>SPORT_GROUPS.find(g=>g.id===id)?.label||id).join(", ")}: bitte noch eine Disziplin wählen`
                  : missingChildren.length>0
                  ? `${missingChildren.join(", ")}: bitte eine Unterkategorie wählen`
                  : `${totalCount} ${totalCount===1?"Sportart":"Sportarten"} gewählt`
                }
              </span>
            </div>
          )}

          <div style={{display:"flex",justifyContent:"flex-end",marginTop:40}}>
            <button className="btn btn-neon" style={{opacity:canNext?1:.4}} disabled={!canNext}
              onClick={()=>onNext({sel,subSel,childSel,primarySport,selectedSports,healthOnly:false})}>
              {canNext?`Weiter mit ${totalCount} ${totalCount===1?"Sportart":"Sportarten"} →`:totalCount===0?"Mindestens 1 wählen":missingChildren.length>0?"Unterkategorie wählen":"Disziplin auswählen"}
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
  sports.forEach(id=>{init[id]={days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:5,compTypes:[],trainingTimes:[],sweatRate:"medium",goal:"performance"};});
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
        <Progress step={2} total={6}/>
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
                        <div style={{fontSize:11,color:C.g400,marginTop:1}}>Nimmst du an {compLabel.toLowerCase() === "rennen" ? "Rennen oder Wettkämpfen" : compLabel.toLowerCase() === "spiele" ? "Spielen oder Turnieren" : "Wettkämpfen, Spielen oder Events"} teil?</div>
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
          {/* Trainingszeit */}
          <div style={{marginTop:28,padding:"20px",borderRadius:14,border:`1px solid ${C.g200}`,background:"#FAFAFA"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:4}}>Wann trainierst du meistens?</div>
            <div style={{fontSize:11,color:C.g400,marginBottom:12}}>Beeinflusst Supplement-Timing. Bis zu 2 Zeiten wählbar.</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[{id:"morning",l:"Morgens (vor 10h)"},{id:"midday",l:"Mittags"},{id:"afternoon",l:"Nachmittags"},{id:"evening",l:"Abends (nach 18h)"}].map(t=>{
                const currentTimes = Object.values(data)[0]?.trainingTimes||[];
                const active = currentTimes.includes(t.id);
                return (
                  <button key={t.id}
                    onClick={()=>setData(d=>{
                      const nd={...d};
                      Object.keys(nd).forEach(id=>{
                        const times=nd[id].trainingTimes||[];
                        let next;
                        if(times.includes(t.id)) next=times.filter(x=>x!==t.id);
                        else if(times.length>=2) next=[times[1],t.id]; // max 2: drop oldest
                        else next=[...times,t.id];
                        nd[id]={...nd[id],trainingTimes:next};
                      });
                      return nd;
                    })}
                    style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${active?"#C8FF00":"#E0E0E0"}`,background:active?"#F5FFE0":"#fff",color:"#0A0A0A",fontSize:12,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s"}}>
                    {t.l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schweissrate */}
          <div style={{marginTop:12,padding:"20px",borderRadius:14,border:`1px solid ${C.g200}`,background:"#FAFAFA"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:4}}>Wie stark schwitzt du beim Sport?</div>
            <div style={{fontSize:11,color:C.g400,marginBottom:12}}>Bestimmt deinen Elektrolyt- und Flüssigkeitsbedarf.</div>
            <div style={{display:"flex",gap:8}}>
              {[{id:"low",l:"Wenig"},{id:"medium",l:"Normal"},{id:"high",l:"Stark"},{id:"very_high",l:"Sehr stark"}].map(s=>(
                <button key={s.id}
                  onClick={()=>setData(d=>{const nd={...d};Object.keys(nd).forEach(id=>{nd[id]={...nd[id],sweatRate:s.id}});return nd;})}
                  style={{flex:1,padding:"8px 4px",borderRadius:10,border:`1.5px solid ${Object.values(data)[0]?.sweatRate===s.id?"#C8FF00":"#E0E0E0"}`,background:Object.values(data)[0]?.sweatRate===s.id?"#F5FFE0":"#fff",color:"#0A0A0A",fontSize:11,fontWeight:Object.values(data)[0]?.sweatRate===s.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s",textAlign:"center"}}>
                  {s.l}
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24}}>
            <button className="btn-ghost" onClick={onBack}>← Zurück</button>
            <button className="btn btn-neon"
              style={{opacity:(()=>{const d=Object.values(data)[0];return d?.trainingTimes?.length>0&&d?.sweatRate?1:.4})()}}
              disabled={(()=>{const d=Object.values(data)[0];return !(d?.trainingTimes?.length>0&&d?.sweatRate);})()}
              onClick={()=>{const d=Object.values(data)[0];if(d?.trainingTimes?.length>0&&d?.sweatRate)onNext(data);}}>
              Weiter →
            </button>
          </div>
          {(()=>{const d=Object.values(data)[0];const missing=[];if(!d?.trainingTimes?.length)missing.push("Trainingszeit");if(!d?.sweatRate)missing.push("Schweissrate");return missing.length>0?(<div style={{marginTop:8,textAlign:"right",fontSize:11,color:"#AAA"}}>Noch ausfüllen: {missing.join(", ")}</div>):null;})()}
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
  const isMobile=useWindowWidth()<=768;
  const [platform,setPlatform]=useState(null);
  const [appleConnecting,setAppleConnecting]=useState(false);
  const [appleConnected,setAppleConnected]=useState(false);
  const [form,setForm]=useState({firstname:"",lastname:"",email:"",country:"Schweiz",gender:"",birthyear:"",weight:"",height:"",rhr:"",sleep:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const handlePlatform=(id)=>{
    setPlatform(id);
    if(id==="apple"){
      setAppleConnecting(true);
      setTimeout(()=>{
        setForm(f=>({...f,firstname:"Kevin",lastname:"Muster",email:"kevin@beispiel.ch",gender:"m",birthyear:"1988",height:"180",weight:"76",country:"Schweiz"}));
        setAppleConnecting(false); setAppleConnected(true);
      },1800);
    } else { setAppleConnected(false); }
  };

  const age=form.birthyear?new Date().getFullYear()-+form.birthyear:null;
  const bmr=calcBMR(form.gender,form.weight,form.height,age);
  const valid=form.firstname&&form.lastname&&form.email.includes("@")&&form.email.includes(".")&&platform&&form.gender&&form.birthyear&&form.weight&&form.height;
  const inp=(val)=>({width:"100%",padding:"12px 14px",border:`1.5px solid ${val?C.neon:C.g200}`,borderRadius:11,fontSize:14,background:val?C.neonDim:C.white,color:C.black,fontFamily:"Inter,sans-serif"});
  const sel={width:"100%",padding:"12px 14px",border:`1.5px solid ${C.g200}`,borderRadius:11,fontSize:14,background:C.white,color:C.black,fontFamily:"Inter,sans-serif",appearance:"none"};

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:C.white,padding:"40px 24px 60px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <Progress step={3} total={6}/>
        <div className="su">
          <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:8,lineHeight:1.2}}>Deine Daten.</h2>
          <p style={{fontSize:14,color:C.g600,marginBottom:24,lineHeight:1.65}}>Körperdaten & Kontakt. Im nächsten Schritt folgen Ziel & Lebensstil.</p>
          <div style={{marginBottom:24}}>
            <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Welche Plattform nutzt du?</div>
            <div style={{fontSize:12,color:C.g400,marginBottom:10,lineHeight:1.5}}>Verbinde eine Plattform um Körperdaten automatisch zu importieren.</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)",gap:7}}>
              {PLATFORMS.map(p=>(
                <div key={p.id} onClick={()=>handlePlatform(p.id)}
                  style={{padding:"11px 10px",borderRadius:11,cursor:"pointer",transition:"all .14s",border:`1.5px solid ${platform===p.id?C.neon:C.g200}`,background:platform===p.id?C.neonDim:C.white,textAlign:"center",position:"relative"}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:3}}>{p.label}</div>
                  <div style={{fontSize:10,color:C.g400,lineHeight:1.3}}>{p.desc}</div>
                  {p.id==="apple"&&appleConnecting&&(<div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.9)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}><div style={{width:16,height:16,border:`2px solid ${C.neon}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><div style={{fontSize:9,color:C.g600}}>Verbinden...</div></div>)}
                  {p.id==="apple"&&appleConnected&&!appleConnecting&&(<div style={{marginTop:5,fontSize:9,color:"#27AE60",fontWeight:600}}>✓ Daten importiert</div>)}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div><div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Vorname *</div><input type="text" value={form.firstname} onChange={e=>set("firstname",e.target.value)} placeholder="Max" style={inp(form.firstname)}/></div>
            <div><div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Nachname *</div><input type="text" value={form.lastname} onChange={e=>set("lastname",e.target.value)} placeholder="Muster" style={inp(form.lastname)}/></div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Herkunft</div>
            <select value={form.country} onChange={e=>set("country",e.target.value)} style={sel}>{COUNTRIES.map(c=><option key={c.v} value={c.v}>{c.flag} {c.v}</option>)}</select>
          </div>
          {platform&&(<>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr 1fr",gap:10,marginBottom:10}}>
              <div><div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Geschlecht *</div><select value={form.gender} onChange={e=>set("gender",e.target.value)} style={sel}><option value="">— wählen</option><option value="m">Männlich</option><option value="f">Weiblich</option></select></div>
              <div><div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Geburtsjahr *</div><input type="number" value={form.birthyear} onChange={e=>set("birthyear",e.target.value)} placeholder="1990" min="1940" max={new Date().getFullYear()-16} style={{...inp(form.birthyear),width:"100%"}}/></div>
              <div><div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Grösse (cm) *</div><input type="number" value={form.height} onChange={e=>set("height",e.target.value)} placeholder="180" style={{...inp(form.height),width:"100%"}}/></div>
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Gewicht (kg) *</div><input type="number" value={form.weight} onChange={e=>set("weight",e.target.value)} placeholder="75" style={{...inp(form.weight),width:"100%"}}/></div>
            <div style={{marginBottom:10,padding:"12px 14px",background:C.g100,borderRadius:11,border:`1px solid ${C.g200}`}}>
              <div style={{fontSize:11,color:C.g400,marginBottom:10}}>Optional — für genauere VO₂max & Erholungs-Berechnungen</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Ruhepuls (bpm)</div><input type="number" value={form.rhr||""} onChange={e=>set("rhr",e.target.value)} placeholder="52" min="30" max="100" style={{...inp(form.rhr),width:"100%"}}/></div>
                <div><div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>Schlaf (h/Nacht)</div><input type="number" value={form.sleep||""} onChange={e=>set("sleep",e.target.value)} placeholder="7.5" min="4" max="12" step="0.5" style={{...inp(form.sleep),width:"100%"}}/></div>
              </div>
            </div>
          </>)}
          {bmr&&(
            <div style={{marginTop:4,marginBottom:10,padding:"16px 18px",background:C.neon,borderRadius:13,animation:"fadeUp .4s ease forwards"}}>
              <div className="mono" style={{color:"rgba(0,0,0,.5)",marginBottom:10}}>Erste Schätzung · wird nach Analyse präzisiert</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><div style={{fontSize:11,color:"rgba(0,0,0,.6)",marginBottom:4}}>Grundumsatz (Ruhe)</div><div style={{fontSize:22,fontWeight:700,color:C.black,letterSpacing:"-.03em"}}>{bmr.toLocaleString("de-CH")}</div><div style={{fontSize:10,color:"rgba(0,0,0,.5)"}}>kcal / Tag</div></div>
                <div><div style={{fontSize:11,color:"rgba(0,0,0,.6)",marginBottom:4}}>Mit Training (Ø)</div><div style={{fontSize:22,fontWeight:700,color:C.black,letterSpacing:"-.03em"}}>{bmr?Math.round(bmr*1.65).toLocaleString("de-CH"):"—"}</div><div style={{fontSize:10,color:"rgba(0,0,0,.5)"}}>kcal / Tag</div></div>
              </div>
            </div>
          )}
          <div style={{marginBottom:24}}>
            <div style={{fontSize:12,color:C.g600,fontWeight:500,marginBottom:6}}>E-Mail *</div>
            <input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="deine@email.ch" style={inp(form.email.includes("@")&&form.email.includes("."))}/>
            <div style={{fontSize:11,color:C.g400,marginTop:5}}>Kein Passwort nötig — wir senden dir bei Bedarf einen Link.</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
            <button className="btn-ghost" onClick={onBack}>← Zurück</button>
            <button className="btn btn-neon" style={{opacity:valid?1:.4}} disabled={!valid} onClick={()=>valid&&onNext({...form,platform})}>Weiter →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 4: LEBENSSTIL ───────────────────────────────────────────────────────

function StepLebensstil({onNext, onBack}) {
  const [form,setForm]=useState({goal:"",injuries:[],stressLevel:null,dietQuality:null,altitude:null,recoveryStatus:null,currentSupps:[],medications:[]});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleArr=(k,v)=>setForm(f=>{
    const curr=(f[k]||[]).filter(x=>x!=="none");
    if(v==="none") return {...f,[k]:["none"]};
    return {...f,[k]:curr.includes(v)?curr.filter(x=>x!==v):[...curr,v]};
  });

  const valid=form.goal&&form.stressLevel&&form.dietQuality&&form.altitude&&form.recoveryStatus&&form.currentSupps.length>0&&form.medications.length>0;

  // Shared styles
  const card={background:C.white,border:`1px solid ${C.g200}`,borderRadius:16,padding:"18px 18px"};
  const Q=({label,sub})=>(<div style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:600,color:C.black,letterSpacing:"-.01em"}}>{label}</div>{sub&&<div style={{fontSize:11,color:C.g400,marginTop:2,lineHeight:1.4}}>{sub}</div>}</div>);
  const ddStyle=(active)=>({width:"100%",padding:"10px 12px",border:`1.5px solid ${active?"#C8FF00":C.g200}`,borderRadius:10,fontSize:13,fontFamily:"Inter,sans-serif",background:active?"#F5FFE0":C.white,color:active?"#0A0A0A":C.g600,appearance:"none",cursor:"pointer"});

  // Compact tile button — used for 2×N grids
  const Tile=({id,label,desc,active,onClick,multi=false})=>(
    <button onClick={onClick} style={{
      padding:"11px 13px",borderRadius:11,
      border:`1.5px solid ${active?"#C8FF00":C.g200}`,
      background:active?"#F5FFE0":C.white,
      cursor:"pointer",fontFamily:"Inter,sans-serif",
      textAlign:"left",transition:"all .13s",
      display:"flex",flexDirection:"column",
      position:"relative",
    }}>
      {multi&&active&&<div style={{position:"absolute",top:8,right:9,width:14,height:14,borderRadius:"50%",background:"#C8FF00",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>}
      <div style={{fontSize:12,fontWeight:600,color:active?C.black:C.black,lineHeight:1.3,paddingRight:multi&&active?18:0}}>{label}</div>
      {desc&&<div style={{fontSize:10,color:active?"#555":C.g400,marginTop:3,lineHeight:1.4}}>{desc}</div>}
    </button>
  );

  // Pill chip — for multi-select tags
  const Chip=({label,active,onClick})=>(
    <button onClick={onClick} style={{
      padding:"6px 13px",borderRadius:100,
      border:`1.5px solid ${active?"#C8FF00":C.g200}`,
      background:active?"#F5FFE0":C.white,
      color:active?"#0A0A0A":C.g600,
      fontSize:12,fontWeight:active?600:400,
      cursor:"pointer",fontFamily:"Inter,sans-serif",
      transition:"all .13s",whiteSpace:"nowrap",
    }}>{label}</button>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"flex-start",justifyContent:"center",background:C.off,padding:"40px 24px 80px"}}>
      <div style={{width:"100%",maxWidth:520}}>
        <Progress step={4} total={6}/>
        <div className="su">
          <h2 style={{fontSize:23,fontWeight:600,letterSpacing:"-.03em",marginBottom:6,lineHeight:1.2}}>Dein Lebensstil.</h2>
          <p style={{fontSize:14,color:C.g600,marginBottom:24,lineHeight:1.65}}>Damit wir deine Empfehlungen wirklich präzise auf dich zuschneiden können.</p>

          {/* ROW 1: Ziel (full width — 6 options in 2×3 grid) */}
          <div style={{...card,marginBottom:10}}>
            <Q label="Primäres Ziel"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {[
                {id:"performance", l:"Leistung steigern",     d:"Schneller, stärker, weiter"},
                {id:"muscle",      l:"Muskelaufbau",           d:"Muskeln aufbauen & definieren"},
                {id:"endurance",   l:"Ausdauer verbessern",    d:"Mehr Volumen, längere Einheiten"},
                {id:"weightloss",  l:"Gewicht reduzieren",     d:"Fett verlieren, lean bleiben"},
                {id:"health",      l:"Gesundheit & Longevity", d:"Vitalität, Prävention"},
                {id:"recovery",    l:"Regeneration",           d:"Erholung & Prävention"},
              ].map(o=><Tile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.goal===o.id} onClick={()=>set("goal",o.id)}/>)}
            </div>
          </div>

          {/* ROW 2: Erholungsstatus (full width — 4 options in 2×2 grid) */}
          <div style={{...card,marginBottom:10}}>
            <Q label="Aktueller Erholungsstatus" sub="Beeinflusst Recovery-Priorität und Magnesiumbedarf."/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {[
                {id:"excellent", l:"Top-Form",              d:"Gut erholt, leistungsbereit"},
                {id:"good",      l:"Normal",                d:"Kein Defizit, solide Basis"},
                {id:"tired",     l:"Akkumulierte Müdigkeit",d:"Harte Woche, leicht überlastet"},
                {id:"recovery",  l:"Verletzung / Pause",   d:"Komme von Verletzung oder Pause"},
              ].map(o=><Tile key={o.id} id={o.id} label={o.l} desc={o.d} active={form.recoveryStatus===o.id} onClick={()=>set("recoveryStatus",o.id)}/>)}
            </div>
          </div>

          {/* ROW 3: Stress + Ernährung side by side */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div style={{...card}}>
              <Q label="Stresslevel" sub="Wie belastet bist du im Alltag ausserhalb des Sports?"/>
              <select value={form.stressLevel||""} onChange={e=>set("stressLevel",+e.target.value||null)} style={ddStyle(form.stressLevel)}>
                <option value="">— wählen</option>
                <option value="1">Sehr niedrig</option>
                <option value="2">Niedrig</option>
                <option value="3">Mittel</option>
                <option value="4">Hoch</option>
                <option value="5">Sehr hoch</option>
              </select>
            </div>
            <div style={{...card}}>
              <Q label="Ernährung" sub="Wie ausgewogen isst du im Alltag?"/>
              <select value={form.dietQuality||""} onChange={e=>set("dietQuality",e.target.value||null)} style={ddStyle(form.dietQuality)}>
                <option value="">— wählen</option>
                <option value="excellent">Sehr ausgewogen</option>
                <option value="good">Gut</option>
                <option value="average">Durchschnittlich</option>
                <option value="poor">Verbesserungswürdig</option>
              </select>
            </div>
          </div>

          {/* ROW 4: Höhe + Verletzungen side by side */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div style={{...card}}>
              <Q label="Trainingshöhe" sub="Wo lebst und trainierst du meistens?"/>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[{id:"low",l:"0–500m",d:"Flachland"},{id:"medium",l:"500–1500m",d:"Mittelland"},{id:"high",l:"1500–2500m",d:"Alpen"},{id:"alpine",l:"2500m+",d:"Hochgebirge"}].map(o=>(
                  <button key={o.id} onClick={()=>set("altitude",o.id)}
                    style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${form.altitude===o.id?"#C8FF00":C.g200}`,background:form.altitude===o.id?"#F5FFE0":C.white,color:form.altitude===o.id?"#0A0A0A":C.g600,fontSize:11,fontWeight:form.altitude===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .13s",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:600}}>{o.l}</span>
                    <span style={{fontSize:10,opacity:.7}}>{o.d}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{...card}}>
              <Q label="Verletzungen?" sub="Aktuelle Beschwerden, mehrere möglich."/>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[{id:"none",l:"Keine"},{id:"knee",l:"Knie"},{id:"back",l:"Rücken"},{id:"shoulder",l:"Schulter"},{id:"ankle",l:"Knöchel / Fuss"},{id:"muscle",l:"Muskel"},{id:"tendon",l:"Sehnen"}].map(o=>{
                  const active=(form.injuries||[]).includes(o.id);
                  return (
                    <button key={o.id} onClick={()=>{if(o.id==="none"){set("injuries",active?[]:["none"]);return;}const curr=(form.injuries||[]).filter(x=>x!=="none");set("injuries",curr.includes(o.id)?curr.filter(x=>x!==o.id):[...curr,o.id]);}}
                      style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${active?"#C8FF00":C.g200}`,background:active?"#F5FFE0":C.white,color:active?"#0A0A0A":C.g600,fontSize:11,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .13s"}}>
                      {o.l}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ROW 5: Supplements + Medikamente side by side */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div style={{...card}}>
              <Q label="Aktuelle Supplements?" sub="Verhindert Doppelempfehlungen, mehrere möglich."/>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[{id:"none",l:"Keine"},{id:"kreatin",l:"Kreatin"},{id:"protein",l:"Protein / Whey"},{id:"vitd",l:"Vitamin D"},{id:"omega3",l:"Omega-3"},{id:"magnesium",l:"Magnesium"},{id:"koffein",l:"Koffein / Pre-WO"},{id:"eisen",l:"Eisen"},{id:"zink",l:"Zink"},{id:"ashwa",l:"Ashwagandha"},{id:"collagen",l:"Kollagen"},{id:"beta_ala",l:"Beta-Alanin"}].map(o=>{
                  const active=(form.currentSupps||[]).includes(o.id);
                  return (
                    <button key={o.id} onClick={()=>{if(o.id==="none"){set("currentSupps",active?[]:["none"]);return;}const curr=(form.currentSupps||[]).filter(x=>x!=="none");set("currentSupps",curr.includes(o.id)?curr.filter(x=>x!==o.id):[...curr,o.id]);}}
                      style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${active?"#C8FF00":C.g200}`,background:active?"#F5FFE0":C.white,color:active?"#0A0A0A":C.g600,fontSize:11,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .13s"}}>
                      {o.l}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{...card}}>
              <Q label="Medikamente?" sub="Für Warnhinweise bei Supplements, mehrere möglich."/>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[{id:"none",l:"Keine"},{id:"blutverd",l:"Blutverdünner"},{id:"schilddruese",l:"Schilddrüse"},{id:"blutdruck",l:"Blutdruck"}].map(o=>{
                  const active=(form.medications||[]).includes(o.id);
                  return (
                    <button key={o.id} onClick={()=>{if(o.id==="none"){set("medications",active?[]:["none"]);return;}const curr=(form.medications||[]).filter(x=>x!=="none");set("medications",curr.includes(o.id)?curr.filter(x=>x!==o.id):[...curr,o.id]);}}
                      style={{width:"100%",padding:"8px 11px",borderRadius:9,border:`1.5px solid ${active?"#C8FF00":C.g200}`,background:active?"#F5FFE0":C.white,color:active?"#0A0A0A":C.g600,fontSize:11,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .13s"}}>
                      {o.l}
                    </button>
                  );
                })}
                {(form.medications||[]).some(m=>m!=="none")&&(form.medications||[]).length>0&&(
                  <div style={{marginTop:4,padding:"8px 10px",background:"#FFF8E1",borderRadius:8,border:"1px solid #FFE082"}}>
                    <div style={{fontSize:10,color:"#856404",lineHeight:1.5}}>⚠ Warnhinweise erscheinen direkt beim Supplement.</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16}}>
            <button className="btn-ghost" onClick={onBack}>← Zurück</button>
            <button className="btn btn-neon" style={{opacity:valid?1:.4}} disabled={!valid} onClick={()=>valid&&onNext(form)}>Weiter →</button>
          </div>
          {!valid&&(()=>{const m=[];if(!form.goal)m.push("Ziel");if(!form.recoveryStatus)m.push("Erholung");if(!form.stressLevel)m.push("Stress");if(!form.dietQuality)m.push("Ernährung");if(!form.altitude)m.push("Höhe");if(!form.currentSupps.length)m.push("Supplements");if(!form.medications.length)m.push("Medikamente");return m.length?<div style={{marginTop:10,fontSize:12,color:C.g400,textAlign:"right"}}>{m.join(" · ")}</div>:null;})()}
        </div>
      </div>
    </div>
  );
}

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────

// ─── SUB-SPORT PROFILES ───────────────────────────────────────────────────────
// Differenzierte Werte pro Sub-Sportart. Felder:
//   met: {low, medium, high, competition}  — überschreibt SPORT_MET
//   protType: "endurance"|"strength"|"team"|"skill"  — überschreibt SPORT_TYPE_MAP
//   suppKey: key in SPORT_SUPP  — überschreibt getSupplements Mapping
//   nutritionKey: key in SPORT_NUTRITION  — überschreibt getSportNutrition
//   sodiumPerL: number  — überschreibt SODIUM_PER_L
//   ironRisk: bool  — überschreibt HIGH_IRON_RISK check
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
  // Road Running — distanzspezifisch
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
  // Triathlon — distanzspezifisch
  tri_sprint:     {met:{low:6.0,medium:9.5, high:13.0,competition:16.0}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_sprint",   sodiumPerL:850, ironRisk:true},
  tri_olympic:    {met:{low:6.0,medium:9.5, high:13.0,competition:16.0}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_olympic",  sodiumPerL:900, ironRisk:true},
  tri_half:       {met:{low:5.5,medium:9.0, high:12.5,competition:15.5}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_half",     sodiumPerL:950, ironRisk:true},
  tri_full:       {met:{low:5.0,medium:8.5, high:12.0,competition:15.0}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_full",     sodiumPerL:1000,ironRisk:true},
  tri_ultra:      {met:{low:4.5,medium:8.0, high:11.0,competition:13.5}, protType:"endurance", suppKey:"running",      nutritionKey:"tri_ultra",    sodiumPerL:1100,ironRisk:true},
  // Schwimmen — distanzspezifisch
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
const SPORT_CONTEXT = {
  cycling_ebike: {
    note: "E-Bike reduziert den Energieaufwand um ca. 60% gegenüber Rennrad — trotzdem echter Kalorienverbrauch, Schweiss und Elektrolytbedarf.",
    protein_note: "Auch E-Bike-Fahrer brauchen Protein für Muskelerhalt und Regeneration.",
    carb_note: "Geringerer Kohlenhydratbedarf als konventionelles Radfahren — aber Elektrolyte bleiben wichtig.",
  },
  cycling_mtb_xc: {
    note: "MTB XC kombiniert Ausdauer und explosive Kraft — einer der energieintensivsten Radsport-Disziplinen.",
    carb_note: "Lange XC-Rennen brauchen kontinuierliche Kohlenhydratzufuhr wie beim Strassenrad.",
  },
  cycling_mtb_end: {
    note: "Enduro verbindet technische Abfahrten mit kraftintensiven Uphills — asymmetrische Belastung mit hohem Regenerationsbedarf.",
    protein_note: "Mehr Protein als XC — explosive Muskelbeanspruchung erhöht den Reparaturbedarf.",
    recovery_note: "Gelenk- und Sehnenbelastung durch technisches Terrain: Kollagen + Omega-3 besonders wertvoll.",
  },
  cycling_mtb_dh: {
    note: "Downhill ist anaerob und explosiv — kurze, maximale Anstrengungen mit hohem Muskelstress.",
    protein_note: "Kraftsport-ähnlicher Proteinbedarf — kurze Runs, hohe neuromuskuläre Belastung.",
    carb_note: "Weniger Ausdauer-Carbs, mehr Kreatin und schnelle Energiequellen für explosive Wiederholungsläufe.",
  },
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
  const goal=profilData?.goal||"performance";
  const stressLevel=+profilData?.stressLevel||3; // 1-5
  const dietQuality=profilData?.dietQuality||"good"; // excellent/good/average/poor
  const altitude=profilData?.altitude||"low"; // low/medium/high/alpine
  const injuries=profilData?.injuries||[];
  const recoveryStatus=profilData?.recoveryStatus||"good"; // excellent/good/tired/recovery
  const currentSupps=profilData?.currentSupps||[]; // already taking
  const medications=profilData?.medications||[]; // medication categories
  const monthlyBudget=profilData?.monthlyBudget||"medium"; // low/medium/high/max
  const bmr=Math.round(calcBMRfn(gender,w,h,age));
  if(healthOnly) return {bmr,withTraining:Math.round(bmr*1.2),trainingExtra:Math.round(bmr*0.2),
    restDay:bmr,trainingDay:Math.round(bmr*1.2),proteinMin:Math.round(w*1.2),proteinMax:Math.round(w*1.4),
    carbsG:Math.round(w*3),natriumMg:0,magnesiumMg:300,sweatLitresPerSession:0,ironRisk:isFemale,isFemale,w,
    waterMl:Math.round(w*35),fatBurnMin:Math.round((220-age)*0.60),fatBurnMax:Math.round((220-age)*0.70)};

  let totalKcal=0, totalSweat=0, totalNa=0, totalMg=0, maxProt=0, maxCarb=0, ironRisk=isFemale, totalDays=0;
  let primaryTrainingTime="mixed";

  // Derive the most specific sport ID to use for calculations
  // If user selected a sub-sport (e.g. cycling_road), use that profile; otherwise use parent
  function resolveSubId(parentId, sportDataRef) {
    const subSel = sportDataRef?.subSel || {};
    const childSel = sportDataRef?.childSel || {};
    const group = (typeof SPORT_GROUPS !== "undefined" ? SPORT_GROUPS : []).find(g=>g.id===parentId);
    if(group?.subs) {
      for(const sub of group.subs) {
        // If this sub has children, check if any child is selected → use child ID
        if(sub.children?.length>0) {
          const selectedChild = sub.children.find(ch=>childSel[sub.id+"_"+ch.id]);
          if(selectedChild) return selectedChild.id;
        }
        // Otherwise check if sub itself is selected
        if(subSel[sub.id] && !sub.children?.length) return sub.id;
      }
    }
    return parentId;
  }

  Object.entries(trainingData||{}).forEach(([id,d])=>{
    const intens=d.intensity||"medium", days=d.days||3, durH=(d.duration||60)/60;

    // Resolve to sub-sport if available
    const resolvedId = resolveSubId(id, sportData);
    const sub = getSubProfile(resolvedId);

    // MET: sub-profile > parent SPORT_MET > fallback
    const metTable = sub?.met || SPORT_MET[id] || SPORT_MET.fussball;
    const met = metTable[intens];

    // Sweat rate multiplier
    const sweatRateKey=d.sweatRate||"medium";
    const sweatMult={low:0.6,medium:1.0,high:1.4,very_high:1.8}[sweatRateKey]||1.0;
    const sweat=(SWEAT_RATE[intens]||0.8)*sweatMult;

    // Sodium: sub-profile > SODIUM_PER_L > fallback
    const naPerL = sub?.sodiumPerL ?? (SODIUM_PER_L[id]||900);

    const kcalS=met*w*durH, sweatS=sweat*durH, naS=sweatS*naPerL, mgS=sweatS*36;
    const compX=d.hasCompetition?(d.compCount||0)*kcalS*0.3/365:0;
    totalKcal+=(kcalS*days)/7+compX; totalSweat+=(sweatS*days)/7;
    totalNa+=(naS*days)/7; totalMg+=(mgS*days)/7; totalDays+=days;
    if(d.trainingTimes?.length) {
      // Priority order: pick earliest session for pre-workout timing
      const ORDER = ["morning","midday","afternoon","evening"];
      const sorted = [...d.trainingTimes].sort((a,b)=>ORDER.indexOf(a)-ORDER.indexOf(b));
      primaryTrainingTime = sorted[0]; // earliest
    } else if(d.trainingTime) primaryTrainingTime=d.trainingTime; // legacy fallback

    // Protein type: sub-profile > SPORT_TYPE_MAP > endurance
    const st = sub?.protType || SPORT_TYPE_MAP[id] || "endurance";
    const pf=(PROTEIN_NEED[st]||PROTEIN_NEED.endurance)[intens]; if(pf>maxProt)maxProt=pf;
    const cf=CARB_NEED[intens]; if(cf>maxCarb)maxCarb=cf;

    // Iron risk: sub-profile flag or HIGH_IRON_RISK list
    if((sub?.ironRisk || HIGH_IRON_RISK.includes(id))&&(intens==="high"||intens==="competition"))ironRisk=true;
  });

  // Goal-based adjustments to macros
  const goalAdj={
    performance: {protMult:1.0, carbMult:1.0, kcalMult:1.0},
    muscle:      {protMult:1.2, carbMult:1.1, kcalMult:1.1},  // more protein + slight surplus
    endurance:   {protMult:0.9, carbMult:1.2, kcalMult:1.05}, // more carbs
    weightloss:  {protMult:1.1, carbMult:0.85,kcalMult:0.9},  // deficit, preserve muscle
    health:      {protMult:0.9, carbMult:1.0, kcalMult:1.0},
    recovery:    {protMult:1.1, carbMult:1.0, kcalMult:1.0},  // more protein for repair
  }[goal]||{protMult:1.0,carbMult:1.0,kcalMult:1.0};

  const daysPerWeek=Math.min(totalDays,7);
  const trainingDayKcal=Math.round((bmr+totalKcal)*goalAdj.kcalMult);
  const sleep = +profilData?.sleep || 7.5;
  const sleepDeficit = sleep < 7 ? (7 - sleep) : 0;
  const waterMl = Math.round(w * 35 + (totalSweat * 1000 * 7) / 7);
  const maxHR = Math.round(220 - age);
  const fatBurnMin = Math.round(maxHR * 0.60);
  const fatBurnMax = Math.round(maxHR * 0.70);

  // Training time → supplement timing recommendations
  const timingRecs={
    morning:  {preWorkout:"6:00–7:00",postWorkout:"8:00–9:00",creatine:"Morgens nüchtern",note:"Nüchterntraining: niedrige Carbs vor, sofort Protein danach"},
    midday:   {preWorkout:"11:00–12:00",postWorkout:"13:00–14:00",creatine:"Mit Mittagessen",note:"Ideales Fenster: Körper ist aufgewärmt, Cortisol niedrig"},
    afternoon:{preWorkout:"15:00–16:00",postWorkout:"17:00–18:00",creatine:"Nachmittags",note:"Peak-Performance-Zeit: optimale Kraft & Koordination"},
    evening:  {preWorkout:"18:00–19:00",postWorkout:"20:00–21:00",creatine:"Mit Abendessen",note:"Kein Koffein nach 16h — beeinträchtigt Schlafqualität"},
  }[primaryTrainingTime]||{preWorkout:"Variabel",postWorkout:"Variabel",creatine:"Täglich gleiche Zeit",note:"Kreatin immer zur selben Zeit einnehmen"};

  const VO2MAX_SPORTS = ["cycling","running","swimming","triathlon","langlauf","rudern","velo"];
  const hasEndurance = Object.keys(trainingData||{}).some(id => VO2MAX_SPORTS.some(s => id.includes(s)));
  let vo2max = null;
  if(hasEndurance) {
    const hrRest = +profilData?.rhr || (isFemale ? 62 : 58);
    const base = 15 * (maxHR / hrRest);
    const genderAdj = isFemale ? -4 : 0;
    const ageAdj = age > 40 ? -(age-40)*0.5 : 0;
    const trainingAdj = Math.min(daysPerWeek * 0.8, 6);
    const intensAdj = maxProt > 1.6 ? 3 : 0;
    vo2max = Math.round(Math.max(25, Math.min(85, base + genderAdj + ageAdj + trainingAdj + intensAdj)));
  }
  const vo2maxLabel = vo2max ? (vo2max < 35?"Unterdurchschnittlich":vo2max < 45?"Durchschnittlich":vo2max < 55?"Gut":vo2max < 65?"Sehr gut":"Exzellent") : null;

  // Stress → cortisol impact on recovery + magnesium need
  const stressMgBonus = (stressLevel-3)*30; // high stress = +60mg Mg, low = -60mg
  const stressAshwaNeeded = stressLevel >= 4;
  const stressRecoveryNote = stressLevel >= 4 ? "Hoher Stress erhöht Cortisol — Ashwagandha, Magnesium und Schlaf sind kritisch für Regeneration." : null;

  // Diet quality → micronutrient risk
  const vitDRisk = dietQuality==="poor"||dietQuality==="average";
  const b12Risk = (dietQuality==="poor")||(profilData?.diet||[]).includes("vegan");
  const ironRiskDiet = dietQuality==="poor"&&isFemale;

  // Altitude → O2 adaptation, iron needs, hydration
  const altitudeMult={low:1.0, medium:1.05, high:1.12, alpine:1.20}[altitude]||1.0;
  const altitudeIronNeeded = altitude==="high"||altitude==="alpine";
  const altitudeHydrationBonus = {low:0, medium:100, high:250, alpine:400}[altitude]||0;
  const altitudeNote = altitude==="high"||altitude==="alpine" ? "Auf dieser Höhe ist dein Eisenstoffwechsel und Hydrationsbedarf erhöht." : null;

  // Injury → specific supplement recs
  const needsCollagen = injuries.some(i=>["knee","ankle","tendon","shoulder"].includes(i));
  const needsOmega3Extra = injuries.some(i=>["back","muscle","shoulder"].includes(i));

  // Recovery status → Magnesium + protein multiplier + ashwagandha priority
  const recoveryMgBonus = {excellent:0, good:0, tired:60, recovery:100}[recoveryStatus]||0;
  const recoveryProtBoost = {excellent:0, good:0, tired:0.1, recovery:0.15}[recoveryStatus]||0;
  const recoveryAshwaNeeded = recoveryStatus==="tired"||recoveryStatus==="recovery";
  const recoveryNote = recoveryStatus==="tired"
    ? "Akkumulierte Müdigkeit: Magnesium, Ashwagandha und mehr Schlaf haben aktuell höchste Priorität."
    : recoveryStatus==="recovery"
    ? "Verletzungs-/Pausenphase: Kollagen, Omega-3 und Protein sind jetzt wichtiger als Performance-Supplements."
    : null;

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

  // Medication → contraindication flags per supplement
  const hasBlutverd     = medications.includes("blutverd");
  const hasSchilddruese = medications.includes("schilddruese");
  const hasBlutdruck    = medications.includes("blutdruck");

  // Medication contraindications map: suppId → warning text
  const MEDI_WARNINGS = {
    omega3:    hasBlutverd  ? "⚠ Blutverdünner: Omega-3 kann die Blutungszeit verlängern — Dosis mit Arzt absprechen." : null,
    ashwa:     hasSchilddruese ? "⚠ Schilddrüsenmedikamente: Ashwagandha beeinflusst Schilddrüsenhormone — Arzt konsultieren." : null,
    ash_cy:    hasSchilddruese ? "⚠ Schilddrüsenmedikamente: Ashwagandha beeinflusst Schilddrüsenhormone — Arzt konsultieren." : null,
    ash_g:     hasSchilddruese ? "⚠ Schilddrüsenmedikamente: Ashwagandha beeinflusst Schilddrüsenhormone — Arzt konsultieren." : null,
    koff_fit:  hasBlutdruck ? "⚠ Blutdruckmedikamente: Koffein kann Blutdruck temporär erhöhen — Rücksprache empfohlen." : null,
    koff_run:  hasBlutdruck ? "⚠ Blutdruckmedikamente: Koffein kann Blutdruck temporär erhöhen — Rücksprache empfohlen." : null,
    koff_g:    hasBlutdruck ? "⚠ Blutdruckmedikamente: Koffein kann Blutdruck temporär erhöhen — Rücksprache empfohlen." : null,
    vitd3:     null,
    krea_cy:   null,
    krea_g:    null,
  };

  // Budget → priority threshold
  const budgetPriorityMax = {low:1, medium:2, high:3, max:99}[monthlyBudget]||2;

  return {
    bmr, withTraining:Math.round(trainingDayKcal*altitudeMult), trainingExtra:Math.round(totalKcal*goalAdj.kcalMult),
    restDay:Math.round(bmr*goalAdj.kcalMult), trainingDay:Math.round(trainingDayKcal*altitudeMult),
    sweatLitresPerSession:+totalSweat.toFixed(1), natriumMg:Math.round(totalNa),
    magnesiumMg:Math.round(200+totalMg+(sleepDeficit*20)+stressMgBonus+recoveryMgBonus),
    protein:Math.round(w*(maxProt+recoveryProtBoost)*goalAdj.protMult),
    proteinMin:Math.round(w*(maxProt+recoveryProtBoost)*goalAdj.protMult),
    proteinMax:Math.round(w*(maxProt+recoveryProtBoost+0.3)*goalAdj.protMult),
    carbsG:Math.round(w*maxCarb*goalAdj.carbMult),
    carbsPerHour:Math.round(maxCarb*10),
    waterMl:Math.round(waterMl+altitudeHydrationBonus),
    fatBurnMin, fatBurnMax, vo2max, vo2maxLabel, sleep,
    ironRisk:ironRisk||altitudeIronNeeded||ironRiskDiet,
    isFemale, w, goal, primaryTrainingTime, timingRecs,
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
  };
}


function calcKcal(profilData, trainingData, sportData) {
  return calcPro(profilData, trainingData, sportData);
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
  // Strassenlauf — distanzspezifisch
  run_short:{
    primary:[
      {id:"sn_koff_5k",name:"Koffein 100mg",dose:"100mg",when:"45 min vor Rennen",why:"5–10km ist hochintensiv und anaerob — Koffein für Reaktion und Pace-Halten kritischer als Carbs.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_5k",name:"Elektrolyt-Tabs",dose:"1 Tab vor Start",when:"Vor Rennen",why:"Kurze Distanz: Hydration vor dem Start wichtiger als während.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  run_hm:{
    primary:[
      {id:"sn_gel_hm",name:"Maurten Gel 100",dose:"1–2 Gels",when:"Ab km 8, alle 45 min",why:"Halbmarathon: 1–2 Gels reichen — Timing und Magenverträglichkeit trainieren.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_hm",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Vor Start und während",why:"90 min Lauf: Natrium- und Kaliumverlust beachten, v.a. bei Hitze.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  run_marathon:{
    primary:[
      {id:"sn_gel_m",name:"Maurten Gel 100",dose:"1 Gel alle 30–35 min",when:"Ab km 10",why:"Marathon: 60–90g Carbs/h nötig — regelmässiges Fueling ab früh, nicht erst wenn Hunger kommt.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_320_m",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Alternierend mit Gels",why:"Flüssige Carbs kombinieren mit Gels für maximale Aufnahme ohne GI-Stress.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_m",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Alle 45–60 min",why:"3–4h Lauf: erheblicher Natriumverlust — Krampfprävention essentiell.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_caf_m",name:"Maurten Gel 100 CAF 100",dose:"1 Gel bei km 30–35",when:"Letzte 10km",why:"Koffein-Gel für die kritische Schlussphase — bekämpft den berühmten Einbruch bei km 32.",link:AFF.maurten("gel-100-caf-100"),shop:"Maurten"},
    ],
  },
  run_ultra:{
    primary:[
      {id:"sn_gel_ul",name:"Maurten Gel 100",dose:"1 Gel alle 45–60 min",when:"Kontinuierlich ab Start",why:"Ultra: niedrigere Intensität erlaubt weniger Carbs — aber Konstanz ist alles.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_real_ul",name:"Echtes Essen (Banane, Reis, Kartoffeln)",dose:"Alle 2–3h",when:"An Verpflegungsstationen",why:"Ab 4h+ versagt der Körper bei reinen Gels — feste, salzige Nahrung ist Pflicht.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_ul",name:"Elektrolyt-Tabs",dose:"1–2 Tabs / 0.5L",when:"Alle 45 min",why:"Ultra: Natriummangel (Hyponatriämie) ist ein reales Risiko — mehr als nur Wasser trinken.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_kof_ul",name:"Koffein-Gel (100mg)",dose:"1 Gel nachts oder bei km 60+",when:"Bei Müdigkeit / Nachtabschnitt",why:"Strategisch einsetzen, nicht früh — maximale Wirkung für die dunkelsten Stunden.",link:AFF.iherb("caffeine gel"),shop:"iHerb"},
    ],
  },
  // Triathlon — distanzspezifisch
  tri_sprint:{
    primary:[
      {id:"sn_koff_tri_s",name:"Koffein 100mg",dose:"100mg",when:"45 min vor Start",why:"Sprint-Tri (ca. 60 min): kein Fueling nötig — Koffein für Intensität ausreichend.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_tri_s",name:"Elektrolyt-Tabs",dose:"1 Tab",when:"Vor Start",why:"Hydration vorbereiten, keine Gels nötig bei dieser Distanz.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  tri_olympic:{
    primary:[
      {id:"sn_gel_tri_o",name:"Maurten Gel 100",dose:"1–2 Gels",when:"Auf der Radstrecke",why:"Olympic (ca. 2h): 1–2 Gels auf dem Rad, nichts auf der Laufstrecke.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_tri_o",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Rad und Lauf",why:"Natrium für Leistungserhalt über alle drei Disziplinen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  tri_half:{
    primary:[
      {id:"sn_gel_tri_h",name:"Maurten Gel 100",dose:"1 Gel alle 40 min",when:"Rad ab km 20",why:"70.3 (ca. 4–5h): 60g Carbs/h anstreben — Magen-Training kritisch im Aufbau.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_160_tri_h",name:"Maurten Drink Mix 160",dose:"40g / 500ml",when:"Auf dem Rad",why:"Flüssige Carbs reduzieren GI-Risiko auf dem Rad gegenüber Gels.",link:AFF.maurten("drink-mix-160"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_tri_h",name:"Elektrolyt-Tabs",dose:"1–2 Tabs / 0.5L",when:"Konstant",why:"4–5h Belastung: Natrium-, Kalium- und Magnesiumverlust erheblich.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  tri_full:{
    primary:[
      {id:"sn_320_tri_f",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Auf dem Rad, alle 45 min",why:"Ironman (8–17h): 80–90g Carbs/h auf dem Rad ist der Schlüssel — mit Hydrogel magenfreundlich.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
      {id:"sn_gel_tri_f",name:"Maurten Gel 100",dose:"1 Gel alle 35–40 min",when:"Auf dem Lauf",why:"Marathon-Teil: weiter mit Gels — festes Essen nur wenn Magen es verlangt.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_tri_f",name:"Elektrolyt-Tabs",dose:"2 Tabs / 0.5L",when:"Konstant alle 45 min",why:"10h+: Elektrolythaushalt ist Hauptursache für DNF — niemals vernachlässigen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_caf_tri_f",name:"Maurten Gel 100 CAF 100",dose:"1–2 Gels",when:"Ab km 25 auf dem Lauf",why:"Koffein für die kritische Schlussphase des Ironman-Laufs.",link:AFF.maurten("gel-100-caf-100"),shop:"Maurten"},
    ],
  },
  tri_ultra:{
    primary:[
      {id:"sn_320_tri_u",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Konstant auf dem Rad",why:"Ultra-Tri (T100, Deca): Magentraining ist trainierbare Fähigkeit — konsequentes Fueling von Stunde 1.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
      {id:"sn_real_tri_u",name:"Echtes Essen",dose:"Alle 2–3h",when:"An Verpflegung",why:"Ab 10h+ wird reines Gel-Fueling psychologisch und physiologisch schwierig.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_tri_u",name:"Elektrolyt-Tabs",dose:"2 Tabs / 0.5L",when:"Alle 30–45 min",why:"Extreme Distanz: Hyponatriämie-Risiko hoch — konsequent salzen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Schwimmen — distanzspezifisch
  swim_sprint:{
    primary:[
      {id:"sn_koff_sw_s",name:"Koffein 100mg",dose:"100mg",when:"45 min vor Start",why:"Sprint/Kurzbahn: hochintensiv, kurz — Koffein für Reaktion und Startpower.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_sw_s",name:"Elektrolyt-Tabs",dose:"1 Tab",when:"Vor dem Training",why:"Schwimmen täuscht über Flüssigkeitsverlust — Schweiss wird weggespült.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  swim_mid:{
    primary:[
      {id:"sn_gel_sw_m",name:"Maurten Gel 100",dose:"1 Gel vor Start",when:"30 min vor längeren Einheiten",why:"Mitteldistanz: Energieversorgung vor dem Start, im Wasser kein Fueling möglich.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_sw_m",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Nach Einheit",why:"Schwimmen: Flüssigkeitsverlust wird unterschätzt — Rehydration nach der Einheit.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  swim_open:{
    primary:[
      {id:"sn_gel_sw_o",name:"Maurten Gel 100",dose:"1–2 Gels",when:"Vor Start, ggf. Pause bei langer Distanz",why:"Open Water / Freiwasser: Fueling nur vor und bei Pausen möglich — Energiereserven vorladen.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_sw_o",name:"Elektrolyt-Tabs",dose:"1–2 Tabs",when:"Vor und nach",why:"Freiwasser: Kälte und Dauer erhöhen Elektrolytverlust — gute Vorbereitung entscheidend.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // MTB Downhill — wenig Ausdauer, mehr Fokus & explosive Energie
  cycling_dh:{
    primary:[
      {id:"sn_koff_dh",name:"Koffein-Gel (100mg)",dose:"1 Gel 45 min vor erstem Run",when:"Wettkampf / Training",why:"Fokus und Reaktionszeit auf technischem Terrain — kein langer Kohlenhydratbedarf bei kurzen Runs.",link:AFF.iherb("caffeine gel"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_dh",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Zwischen Runs",why:"Auch kurze Renntage haben Schweissverlust — Krampfprävention.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Fitness Strength-focused (Powerlifting, Weightlifting, Sprung, Wurf)
  fitness_str:{
    primary:[
      {id:"sn_krea_sn",name:"Kreatin Monohydrat",dose:"5g täglich",when:"Nach Training",why:"Kraftsport-Basisnahrung — verbessert Maximalkraft und Wiederholungen nachweislich.",link:AFF.iherb("creatine monohydrate"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_str",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Bei intensivem Training",why:"Auch Krafttraining erzeugt Schweiss — Hydration nicht vernachlässigen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Fitness (Hyrox, CrossFit)
  fitness:{
    primary:[
      {id:"sn_krea_fit",name:"Kreatin Monohydrat",dose:"5g täglich",when:"Nach Training",why:"Hyrox und CrossFit: explosive Kraft und Wiederholbarkeit — Kreatin ist Basis.",link:AFF.iherb("creatine monohydrate"),shop:"iHerb"},
      {id:"sn_koff_fit",name:"Koffein 100–200mg",dose:"100–200mg",when:"30–45 min vor Training",why:"Maximale Leistung bei hochintensiven WODs und Hyrox-Stationen.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_fit",name:"Elektrolyt-Tabs",dose:"1–2 Tabs / 0.5L",when:"Während Training",why:"Crossfit und Hyrox erzeugen hohe Schweissraten — Hydration entscheidend.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Leichtathletik Sprint
  la_sprint:{
    primary:[
      {id:"sn_koff_sp",name:"Koffein 100–200mg",dose:"100–200mg",when:"45 min vor Start",why:"Reaktionszeit und neuromuskuläre Aktivierung für explosive Kurzbelastungen.",link:AFF.iherb("caffeine"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_sp",name:"Elektrolyt-Tabs",dose:"1 Tab",when:"Nach Einheit",why:"Aufwärmprogramme und Sprints erzeugen mehr Schweiss als wahrgenommen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Ski (Alpin, Freeride, Snowboard)
  ski:{
    primary:[
      {id:"sn_riegel_ski",name:"Energieriegel",dose:"1 Riegel / 2h",when:"Am Berg zwischen Läufen",why:"Kompakt, gefriert nicht wie Gels — ideal für kalte Umgebungen.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_ski",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Mittagspause / zwischendurch",why:"Kälte täuscht über Flüssigkeitsverlust — trotzdem regelmässig trinken.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Skitouren
  ski_touring:{
    primary:[
      {id:"sn_mau_gel_st2",name:"Maurten Gel 100",dose:"1 Gel alle 45–60 min",when:"Aufstieg",why:"Magenfreundlich auch bei Kälte — keine Einfrierproblematik bei Körperwärme.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_riegel_st",name:"Energieriegel",dose:"1 Riegel / 2h",when:"Gipfelpause / Abstieg",why:"Solide Energie für lange Touren — Sättigung wichtiger als bei kurzen Rennen.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_st2",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Alle 60 min",why:"Hoher Schweiss- und Energieverbrauch bei langen Aufstiegen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Langlauf & Biathlon
  langlauf:{
    primary:[
      {id:"sn_mau_gel_xl2",name:"Maurten Gel 100",dose:"1 Gel alle 30–40 min",when:"Einheiten über 60 min",why:"Höchster MET aller Sportarten — kontinuierliche Kohlenhydratzufuhr kritisch.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_mau_320_xl2",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"Lange Einheiten über 2h",why:"Maximale Kohlenhydratdichte für 2–4h Ausdauerbelastungen.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_xl2",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Alle 45–60 min",why:"Hoher Natriumverlust auch bei Kälte — Krampfprävention und Leistungserhalt.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Langlauf Kurzdistanz (bis 15km)
  langlauf_kurz:{
    primary:[
      {id:"sn_koff_xl_k",name:"Koffein-Gel 100mg",dose:"1 Gel 45 min vor Start",when:"Wettkampf / Intensivtraining",why:"Kurzdistanz Langlauf ist hochintensiv — Koffein für maximale Pace und Reaktion.",link:AFF.iherb("caffeine gel"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_xl_k",name:"Elektrolyt-Tabs",dose:"1 Tab vor Start",when:"Vor Rennen",why:"Kurze Distanz: Hydration vor dem Start entscheidend, kein Fueling unterwegs nötig.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Langlauf Mitteldistanz (15–50km, z.B. Engadin)
  langlauf_mittel:{
    primary:[
      {id:"sn_gel_xl_m",name:"Maurten Gel 100",dose:"1 Gel alle 40–45 min",when:"Ab km 10",why:"Mitteldistanz (1.5–3h): 2–4 Gels je nach Tempo — früh starten, nicht erst bei Hunger.",link:AFF.maurten("gel-100"),shop:"Maurten"},
    ],
    secondary:[
      {id:"sn_elek_xl_m",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Alle 45 min",why:"Natrium und Kalium für Leistungserhalt — Kälte täuscht über Schweissverlust.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_320_xl_m",name:"Maurten Drink Mix 320",dose:"80g / 500ml",when:"An Verpflegungsstationen",why:"Flüssige Carbs ergänzen Gels — an Stationen trinken wenn vorhanden.",link:AFF.maurten("drink-mix-320"),shop:"Maurten"},
    ],
  },
  // Langlauf Langdistanz (50km+, z.B. Vasaloppet, Birkebeiner)
  langlauf_lang:{
    primary:[
      {id:"sn_gel_xl_l",name:"Maurten Gel 100",dose:"1 Gel alle 35–40 min",when:"Kontinuierlich ab Start",why:"50km+ Langlauf: höchster Energieumsatz aller Ausdauersportarten — konsequentes Fueling von km 1.",link:AFF.maurten("gel-100"),shop:"Maurten"},
      {id:"sn_real_xl_l",name:"Echtes Essen (Banane, Riegel, Suppe)",dose:"Alle 1.5–2h",when:"An Verpflegungsstationen",why:"Ab 3h+ wird reines Gel-Fueling psychologisch und physiologisch schwierig — feste Nahrung Pflicht.",link:AFF.mnstry("energy-bar"),shop:"MNSTRY"},
    ],
    secondary:[
      {id:"sn_elek_xl_l",name:"Elektrolyt-Tabs",dose:"1–2 Tabs / 0.5L",when:"Alle 30–40 min",why:"Langdistanz: Natriummangel (Hyponatriämie) ist reales Risiko — regelmässig salzen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
      {id:"sn_caf_xl_l",name:"Koffein-Gel 100mg",dose:"1–2 Gels strategisch",when:"Ab km 40, bei Einbruch",why:"Koffein gezielt einsetzen für die kritische Schlussphase — nicht zu früh verbrauchen.",link:AFF.iherb("caffeine gel"),shop:"iHerb"},
    ],
  },
  // Tennis & Padel
  tennis:{
    primary:[
      {id:"sn_banana_ten",name:"Banane / schnelle Carbs",dose:"1 Stück pro Satzpause",when:"Seitenwechsel / Spielpausen",why:"ATP-Standard: Bananen für schnelle Energie bei langen Matches.",link:AFF.iherb("dextrose"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_ten2",name:"Elektrolyt-Tabs",dose:"1–2 Tabs / 0.5L",when:"Während Match",why:"Tennis-Matches bis 5h — Natriumverlust erheblich auf Hartplatz.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Team Sports (Handball, Volleyball)
  team_sport:{
    primary:[
      {id:"sn_krea_team",name:"Kreatin Monohydrat",dose:"5g täglich",when:"Nach Training / Spiel",why:"Sprintwiederholungen und explosive Bewegungen — Kreatin direkt relevant.",link:AFF.iherb("creatine monohydrate"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_team",name:"Elektrolyt-Tabs",dose:"1 Tab / 0.5L",when:"Während Spiel / Training",why:"Hochintensive Teamspiele mit hohem Schweissvolumen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
  // Kampfsport
  kampfsport:{
    primary:[
      {id:"sn_krea_ks2",name:"Kreatin Monohydrat",dose:"5g täglich",when:"Nach Training",why:"Explosive Schläge und Würfe — Kreatin verbessert Kraft-Wiederholbarkeit.",link:AFF.iherb("creatine monohydrate"),shop:"iHerb"},
    ],
    secondary:[
      {id:"sn_elek_ks2",name:"Elektrolyt-Tabs",dose:"1–2 Tabs / 0.5L",when:"Sparring und lange Einheiten",why:"Hohes Schweissvolumen bei Kampfsport — Elektrolyte nicht vernachlässigen.",link:AFF.sponser("elektrolyt tabletten"),shop:"Sponser"},
    ],
  },
};
const genericSportNutrition={
  primary:[{id:"sn_gen",name:"Energie-Gel (Maurten / MNSTRY)",dose:"1 Gel alle 30–45 min",when:"Einheiten über 60 min",why:"Schnell verfügbare Kohlenhydrate für Training und Wettkampf.",link:AFF.maurten("gel-100"),shop:"Maurten"}],
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

function getPersonalizedSupps(profile, sportSupps, basisSupps, proData) {
  const {gender,weight,days,intensity,hasComp,compCount}=profile;
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
  const budgetPriorityMax = proData?.budgetPriorityMax||99;
  const recoveryAshwaNeeded = proData?.recoveryAshwaNeeded||false;
  const recoveryStatus = proData?.recoveryStatus||"good";

  // Suppress helper — returns true if this supplement should be hidden/deprioritised
  function isSuppressed(s) {
    if(suppress.kreatin && (s.id.includes("krea")||s.id.includes("kreatin"))) return true;
    if(suppress.protein  && (s.id.includes("whey")||s.id.includes("protein"))) return true;
    if(suppress.vitd     && (s.id.includes("vd3")||s.id.includes("vitd"))) return true;
    if(suppress.omega3   && (s.id.includes("omega"))) return true;
    if(suppress.magnesium&& (s.id.includes("mag")||s.id.includes("magnesium"))) return true;
    if(suppress.eisen    && (s.id.includes("eisen")||s.id.includes("iron"))) return true;
    if(suppress.zink     && (s.id.includes("zink"))) return true;
    if(suppress.ashwa    && (s.id.includes("ash")||s.id.includes("ashwa"))) return true;
    if(suppress.collagen && (s.id.includes("koll")||s.id.includes("collagen"))) return true;
    if(suppress.beta_ala && (s.id.includes("beta"))) return true;
    if(suppress.koffein  && (s.id.includes("koff")||s.id.includes("mau_caf"))) return true;
    return false;
  }

  const primSupps=[], secSupps=[];
  [...basisSupps,...sportSupps].forEach(s=>{
    // Skip if user already takes this supplement
    if(isSuppressed(s)) {
      // Still show but marked as "bereits vorhanden"
      const mediWarn = MEDI_WARNINGS[s.id]||null;
      secSupps.push({...s,personalWhy:s.why,alreadyTaking:true,mediWarning:mediWarn});
      return;
    }

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
    if((s.id==="kreatin_cy"||s.id==="kreatin_fit"||s.id==="krea_g"||s.id.startsWith("krea_"))&&isCompetitor){
      personalWhy=s.why+` Mit ${compCount} Wettkämpfen/Jahr ist Kreatin für die Regeneration zwischen Starts besonders wertvoll.`;
      boost=true;
    }
    if((s.id==="ashwa_cy"||s.id==="ash_g"||s.id.startsWith("ash_"))&&(isHighLoad||recoveryAshwaNeeded)){
      personalWhy=s.why+(recoveryAshwaNeeded?" Aktuell besonders wichtig: dein Erholungsstatus zeigt erhöhten Cortisolbedarf.":" Sinnvoll bei "+days+"× Training/Woche zur Cortisolregulation.");
      boost=recoveryAshwaNeeded?true:boost; // force boost if recovery needs it
    }
    // Recovery phase: boost collagen + omega3
    if((recoveryStatus==="recovery")&&(s.id.includes("koll")||s.id.includes("omega"))){
      personalWhy=s.why+" Verletzungs-/Pausenphase: Kollagen und Omega-3 haben jetzt höchste Priorität.";
      boost=true;
    }

    // Medication warning
    const mediWarning = MEDI_WARNINGS[s.id]||null;

    // Budget filter: push to sec if priority > budget threshold
    const effPriority = s.priority||3;
    const withinBudget = effPriority <= budgetPriorityMax;

    if((s.priority===1||(boost&&s.priority<=2))&&withinBudget) primSupps.push({...s,personalWhy,mediWarning});
    else secSupps.push({...s,personalWhy,mediWarning,outOfBudget:!withinBudget});
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
  const hasMediWarn=!!s.mediWarning;
  const sc={"Maurten":{bg:C.black,text:C.neon},"MNSTRY":{bg:"#0D0D1A",text:C.neon},"iHerb":{bg:"#2D7C2B",text:"#fff"},"Myprotein":{bg:"#CC0000",text:"#fff"},"Sponser":{bg:"#003087",text:"#fff"}}[s.shop]||{bg:C.black,text:C.white};
  const p=s.protocol;
  const hasCycle=p?.pause&&!p.pause.toLowerCase().includes("keine");
  const hasConflict=interactions.some(i=>i.type==="conflict");
  const hasSynergy=interactions.some(i=>i.type==="synergy");
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
          <span style={{fontSize:10,color:"#1A7A35",fontWeight:600,fontFamily:"JetBrains Mono,monospace"}}>✓ BEREITS IN DEINEM STACK</span>
        </div>
      )}

      {/* Header: Name + Toggle Switch */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:10}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
            {isPrimary&&!s.alreadyTaking&&<span className="chip hi" style={{fontSize:9}}>ZWINGEND</span>}
            {!isPrimary&&!s.alreadyTaking&&<span className="chip" style={{fontSize:9}}>OPTIONAL</span>}
            {hasCycle&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,149,0,.12)",color:C.orange,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>KUR</span>}
            {hasConflict&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,59,48,.1)",color:C.red,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>⚠ INTERAKTION</span>}
            {hasSynergy&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(52,199,89,.1)",color:C.green,fontFamily:"JetBrains Mono,monospace",fontWeight:600}}>✓ SYNERGIE</span>}
            {hasAllergen&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:"rgba(255,59,48,.12)",color:C.red,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>⚠ ALLERGEN</span>}
          </div>
          <div style={{fontSize:15,fontWeight:700,letterSpacing:"-.02em",marginBottom:2}}>{active.name||s.name}</div>
          <div style={{fontSize:11,color:C.g600,fontFamily:"JetBrains Mono,monospace"}}>{active.dose||s.dose} · {s.when}</div>
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

      {/* Why — prominent */}
      <div style={{fontSize:13,color:C.g800,lineHeight:1.65,marginBottom:10,padding:"10px 12px",background:"#FAFAFA",borderRadius:9,borderLeft:`3px solid ${isPrimary?C.neon:C.g300}`}}>
        {showBudget&&s.budget?s.budget.why:(s.personalWhy||s.why)}
      </div>

      {/* Budget/Quality Toggle Switch — nur wenn Budget vorhanden */}
      {s.budget&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:9,background:"#F8F8F8",marginBottom:10}}>
          <span style={{fontSize:11,fontWeight:showBudget?400:700,color:showBudget?C.g400:C.black}}>★ Höchste Qualität</span>
          <div onClick={e=>{e.stopPropagation();setShowBudget(b=>!b);}}
            style={{width:36,height:20,borderRadius:10,background:showBudget?"#4A7000":"#CCC",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
            <div style={{position:"absolute",top:2,left:showBudget?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
          </div>
          <span style={{fontSize:11,fontWeight:showBudget?700:400,color:showBudget?C.black:C.g400}}>💰 Budget</span>
        </div>
      )}
      {showBudget&&s.budget?.price&&<div style={{fontSize:11,color:"#4A7000",fontWeight:600,marginBottom:8}}>Preis: {s.budget.price}</div>}

      {/* Shop buttons */}
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
        <a href={active.link||s.link} target="_blank" rel="noopener noreferrer"
          style={{display:"inline-flex",alignItems:"center",gap:4,background:sc.bg,color:sc.text,padding:"7px 12px",borderRadius:8,fontSize:11,fontWeight:600,textDecoration:"none"}}>
          {active.shop||s.shop} ↗
        </a>
        {!["iHerb","Maurten","MNSTRY","Myprotein","Sponser","ESN","More Nutrition"].includes(active.shop||s.shop)&&(
          <a href={`https://www.galaxus.ch/de/s1/producttype/sport-ernaehrung-16?q=${encodeURIComponent(s.name)}`} target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:4,background:"#F5F5F5",color:"#555",padding:"5px 8px",borderRadius:7,fontSize:9,fontWeight:500,textDecoration:"none"}}>
            Galaxus ↗
          </a>
        )}
        {s.productUrl&&<a href={s.productUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace",textDecoration:"underline",textDecorationStyle:"dotted"}}>Nährwerte ↗</a>}
      </div>

      {s.tags&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{s.tags.map(t=><span key={t} className="chip">{t}</span>)}</div>}

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

function StepWillkommen({onNext}) {
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  const C={neon:"#C8FF00",black:"#0A0A0A",white:"#fff",g200:"#E8E8E8",g400:"#999",g600:"#666",g800:"#333",neonDim:"#F5FFE0",g100:"#F5F5F5",g300:"#D0D0D0"};

  return (
    <div style={{minHeight:"100vh",background:C.white,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,fontFamily:"Inter,sans-serif"}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{marginBottom:48}}><Logo size="lg"/></div>
        <div style={{fontSize:11,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".08em",marginBottom:6}}>FAST BEREIT</div>
        <h2 style={{fontSize:24,fontWeight:600,color:C.black,letterSpacing:"-.03em",lineHeight:1.2,marginBottom:8}}>So funktioniert TREYN+</h2>
        <p style={{fontSize:14,color:C.g600,marginBottom:28,lineHeight:1.7}}>Deine Analyse ist in Kürze bereit. Hier ist was dich erwartet:</p>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:32}}>
          {[
            {icon:"🆓", title:"Basicdaten sofort sichtbar", desc:"Energieverbrauch, Energiebedarf, Protein und Wasser. Keine Kreditkarte nötig, kein aktives Abo."},
            {icon:"🔒", title:"PRO — CHF 12.90 / 6 Monate (CHF 2.15/Mt.)", desc:"Alle Daten, alle Empfehlungen — inkl. Elektrolyte, VO₂max, Kohlenhydrate/h, Produkten, Dosierungen & Tagesplan. Jederzeit aktivierbar."},
            {icon:"🎯", title:"100% auf dich berechnet", desc:"Berechnet aus MET-Compendium 2024 — wissenschaftlicher Standard. Präzise auf dein Gewicht, Sport und Intensität."},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:14,padding:"14px 16px",borderRadius:12,border:"1px solid #EBEBEB",background:"#fff"}}>
              <span style={{fontSize:22,lineHeight:1,flexShrink:0}}>{item.icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:3}}>{item.title}</div>
                <div style={{fontSize:12,color:C.g600,lineHeight:1.6}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onNext} style={{width:"100%",background:"#C8FF00",color:"#000",border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
          Deine kostenlose Analyse entdecken →
        </button>
        <div style={{textAlign:"center",marginTop:8,fontSize:11,color:C.g400}}>Dauert wenige Sekunden.</div>
      </div>
    </div>
  );
}

function StepPraeferenzen({onNext, onBack}) {
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  const [suppForm,setSuppForm]=useState(null);
  const [energieForm,setEnergieForm]=useState([]);
  const [proteinForm,setProteinForm]=useState([]);
  const [recoveryForm,setRecoveryForm]=useState([]);

  const toggleMulti=(arr,setArr,val)=>{
    if(val==="egal"||val==="keine"){ setArr(prev=>prev.includes(val)?[]:([val])); return; }
    setArr(prev=>{
      const without=prev.filter(x=>x!=="egal"&&x!=="keine");
      return without.includes(val)?without.filter(x=>x!==val):[...without,val];
    });
  };

  const Chip=({label,active,onClick})=>(
    <button onClick={onClick}
      style={{padding:"9px 14px",borderRadius:10,border:`1.5px solid ${active?"#C8FF00":"#E8E8E8"}`,background:active?"#F5FFE0":"#fff",color:"#0A0A0A",fontSize:12,fontWeight:active?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s",whiteSpace:"nowrap"}}>
      {label}
    </button>
  );

  const Section=({title,children})=>(
    <div style={{marginBottom:22}}>
      <div style={{fontSize:12,fontWeight:600,color:"#0A0A0A",marginBottom:10}}>{title}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{children}</div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,fontFamily:"Inter,sans-serif"}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{display:"flex",gap:4,marginBottom:32}}>
          {[1,2,3,4,5].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=4?"#C8FF00":"#E8E8E8"}}/>)}
        </div>
        <div style={{fontSize:11,color:"#999",fontFamily:"JetBrains Mono,monospace",letterSpacing:".08em",marginBottom:6}}>SCHRITT 4 VON 5</div>
        <h2 style={{fontSize:24,fontWeight:600,color:"#0A0A0A",letterSpacing:"-.03em",lineHeight:1.2,marginBottom:6}}>Deine Präferenzen</h2>
        <p style={{fontSize:13,color:"#666",marginBottom:28,lineHeight:1.5}}>So stimmen wir alles noch gezielter auf dich ab. Mehrfachauswahl möglich.</p>

        <Section title="Supplements — welche Form bevorzugst du?">
          {[{id:"kapsel",l:"Kapseln"},{id:"pulver",l:"Pulver"},{id:"beides",l:"Beides"}].map(o=>(
            <Chip key={o.id} label={o.l} active={suppForm===o.id} onClick={()=>setSuppForm(suppForm===o.id?null:o.id)}/>
          ))}
        </Section>

        <Section title="Wie nimmst du Energie während dem Training zu dir?">
          {[{id:"gel",l:"Gels"},{id:"riegel",l:"Riegel"},{id:"drink",l:"Drink Mix"},{id:"egal",l:"Egal"}].map(o=>(
            <Chip key={o.id} label={o.l} active={energieForm.includes(o.id)} onClick={()=>toggleMulti(energieForm,setEnergieForm,o.id)}/>
          ))}
        </Section>

        <Section title="Protein — wie nimmst du es am liebsten?">
          {[{id:"shake",l:"Shake / Pulver"},{id:"riegel",l:"Riegel"},{id:"egal",l:"Egal"}].map(o=>(
            <Chip key={o.id} label={o.l} active={proteinForm.includes(o.id)} onClick={()=>toggleMulti(proteinForm,setProteinForm,o.id)}/>
          ))}
        </Section>

        <Section title="Recovery — wie erholst du dich am liebsten?">
          {[{id:"massage",l:"Massage"},{id:"foam",l:"Foam Roll"},{id:"kalt",l:"Kältebad"},{id:"stretching",l:"Stretching"},{id:"kompression",l:"Kompressionsbekleidung"},{id:"sauna",l:"Sauna"},{id:"dampfbad",l:"Dampfbad"},{id:"schlaf",l:"Schlaf"},{id:"keine",l:"Ich regeneriere nicht pro-aktiv"}].map(o=>(
            <Chip key={o.id} label={o.l} active={recoveryForm.includes(o.id)} onClick={()=>toggleMulti(recoveryForm,setRecoveryForm,o.id)}/>
          ))}
        </Section>

        {(()=>{
          const allDone = suppForm && energieForm.length>0 && proteinForm.length>0 && recoveryForm.length>0;
          return (
            <>
              <div style={{display:"flex",gap:10,marginTop:8}}>
                <button onClick={onBack} style={{padding:"12px 20px",borderRadius:12,border:"1px solid #E8E8E8",background:"transparent",color:"#666",fontSize:14,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
                  ← Zurück
                </button>
                <button
                  disabled={!allDone}
                  onClick={()=>onNext({suppForm,energieForm,proteinForm,recoveryForm})}
                  style={{flex:1,background:allDone?"#C8FF00":"#F0F0F0",color:allDone?"#000":"#AAA",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:600,cursor:allDone?"pointer":"default",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
                  Weiter →
                </button>
              </div>
              {!allDone&&<div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#AAA"}}>Bitte alle Felder ausfüllen.</div>}
            </>
          );
        })()}
      </div>
    </div>
  );
}


function StepAllergien({onNext, onBack}) {
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  const [hasAllergies, setHasAllergies] = useState(null);
  const [allergens, setAllergens] = useState([]);
  const [custom, setCustom] = useState("");
  const [diet, setDiet] = useState([]);

  const ALLERGEN_LIST = [
    {id:"gluten",    label:"Gluten",        desc:"Weizen, Roggen, Gerste"},
    {id:"lactose",   label:"Laktose",       desc:"Milch & Milchprodukte"},
    {id:"soy",       label:"Soja",          desc:"Sojaprodukte"},
    {id:"nuts",      label:"Nüsse",         desc:"Alle Nussarten"},
    {id:"egg",       label:"Eier",          desc:"Ei & Eiprodukte"},
    {id:"fish",      label:"Fisch",         desc:"Fisch & Meeresfrüchte"},
    {id:"fructose",  label:"Fruktose",      desc:"Fruchtzucker"},
    {id:"histamine", label:"Histamin",      desc:"Fermentierte Lebensmittel"},
    {id:"crustacean",label:"Krebstiere",    desc:"Garnelen, Hummer, Krabben"},
    {id:"mustard",   label:"Senf",          desc:"Senf & Senfprodukte"},
  ];
  const [customTags, setCustomTags] = useState([]);
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

  const Chip = ({label, desc, active, onClick}) => (
    <button onClick={onClick}
      style={{padding:"10px 12px",borderRadius:10,border:`1.5px solid ${active?"#C8FF00":"#E8E8E8"}`,background:active?"#F5FFE0":"#fff",cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .12s"}}>
      <div style={{fontSize:12,fontWeight:600,color:"#0A0A0A",marginBottom:2}}>{label}</div>
      <div style={{fontSize:10,color:"#AAA"}}>{desc}</div>
    </button>
  );

  return (
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,fontFamily:"Inter,sans-serif"}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{display:"flex",gap:4,marginBottom:32}}>
          {[1,2,3,4,5].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=3?"#C8FF00":"#E8E8E8"}}/>)}
        </div>

        <div style={{fontSize:11,color:"#999",fontFamily:"JetBrains Mono,monospace",letterSpacing:".08em",marginBottom:6}}>SCHRITT 3 VON 5</div>
        <h2 style={{fontSize:24,fontWeight:600,color:"#0A0A0A",letterSpacing:"-.03em",lineHeight:1.2,marginBottom:6}}>Allergien & Ernährung</h2>
        <p style={{fontSize:13,color:"#666",marginBottom:28,lineHeight:1.5}}>So filtern wir Supplements und Sportnahrung korrekt für dich.</p>

        {/* Allergien Toggle */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:12,fontWeight:600,color:"#0A0A0A",marginBottom:10}}>Hast du Allergien oder Unverträglichkeiten?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:hasAllergies===true?16:0}}>
            <button onClick={()=>{setHasAllergies(false);setAllergens([]);}}
              style={{padding:"12px",borderRadius:10,border:`1.5px solid ${hasAllergies===false?"#C8FF00":"#E0E0E0"}`,background:hasAllergies===false?"#F5FFE0":"#fff",color:"#0A0A0A",fontSize:13,fontWeight:hasAllergies===false?700:500,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
              Keine Allergien
            </button>
            <button onClick={()=>setHasAllergies(true)}
              style={{padding:"12px",borderRadius:10,border:`1.5px solid ${hasAllergies===true?"#C8FF00":"#E0E0E0"}`,background:hasAllergies===true?"#F5FFE0":"#fff",color:"#0A0A0A",fontSize:13,fontWeight:hasAllergies===true?700:500,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
              Ich habe Allergien
            </button>
          </div>

          {hasAllergies===true&&(
            <div style={{animation:"fadeUp .25s ease forwards"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                {ALLERGEN_LIST.map(a=><Chip key={a.id} label={a.label} desc={a.desc} active={allergens.includes(a.id)} onClick={()=>toggleAllergen(a.id)}/>)}
              </div>
              {/* Custom tag input */}
              <div style={{display:"flex",gap:8,marginBottom:customTags.length>0?8:0}}>
                <input value={customInput} onChange={e=>setCustomInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addCustom()}
                  placeholder="Weitere Allergie hinzufügen..."
                  style={{flex:1,padding:"10px 14px",borderRadius:10,border:"1px solid #E0E0E0",fontSize:13,fontFamily:"Inter,sans-serif",outline:"none"}}/>
                <button onClick={addCustom} style={{padding:"10px 14px",borderRadius:10,background:"#C8FF00",color:"#000",border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>+</button>
              </div>
              {customTags.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {customTags.map(t=>(
                    <span key={t} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,background:"#F5FFE0",border:"1px solid #C8FF00",fontSize:12,color:"#0A0A0A"}}>
                      {t}
                      <button onClick={()=>setCustomTags(prev=>prev.filter(x=>x!==t))} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#888",padding:0,lineHeight:1}}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ernährung — immer sichtbar, separate Sektion */}
        <div style={{marginBottom:28,paddingTop:20,borderTop:"1px solid #F0F0F0"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#0A0A0A",marginBottom:4}}>Ernährungsweise</div>
          <div style={{fontSize:11,color:"#AAA",marginBottom:10}}>Mehrfachauswahl möglich</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {DIET_LIST.map(d=><Chip key={d.id} label={d.label} desc={d.desc} active={diet.includes(d.id)} onClick={()=>toggleDiet(d.id)}/>)}
          </div>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={onBack}
            style={{padding:"12px 20px",borderRadius:12,border:"1px solid #E8E8E8",background:"transparent",color:"#666",fontSize:14,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            ← Zurück
          </button>
          <button
            onClick={()=>onNext({allergens,customAllergens:[...customTags].join(", "),noAllergens:hasAllergies===false,diet})}
            disabled={hasAllergies===null}
            style={{flex:1,background:hasAllergies!==null?"#C8FF00":"#F0F0F0",color:hasAllergies!==null?"#000":"#AAA",border:"none",borderRadius:12,padding:"12px",fontSize:14,fontWeight:600,cursor:hasAllergies!==null?"pointer":"default",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
            Weiter →
          </button>
        </div>
        {hasAllergies===null&&<div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#AAA"}}>Bitte oben eine Option auswählen.</div>}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function AnalysePreview({sportData,trainingData,profilData,onContinue,onUpgrade}) {
  const [loadPro,setLoadPro]=useState(false);
  const primarySport=sportData?.primarySport;
  const healthOnly=sportData?.healthOnly;
  const sportLabel=SPORT_GROUPS.find(s=>s.id===primarySport)?.label||(healthOnly?"Gesundheit":"Sport");
  const primaryTraining=trainingData?.[primarySport]||{intensity:"medium"};
  const intensityLabel={"low":"Leicht","medium":"Mittel","high":"Intensiv","competition":"Wettkampf"}[primaryTraining.intensity]||"Mittel";
  const fname=profilData?.firstname||"";
  const weight=profilData?.weight||75;
  const basic=calcPro(profilData,trainingData,sportData);
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
              <span style={{fontSize:11,color:"rgba(0,0,0,.4)",fontWeight:400,whiteSpace:"nowrap",marginLeft:12}}>CHF 12.90 / 6 Mt.</span>
            </div>
            <div style={{padding:"14px 16px",background:"#FAFFF0"}}>
              <div style={{marginBottom:8,fontSize:10,color:"#999",letterSpacing:".02em"}}>Zusätzlich zu Basic:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                {["Exakte kcal via MET","Protein exakt","Kohlenhydrate exakt","VO₂max Schätzwert","Wasserverbrauch / Tag","Fettverbrennungszone","Natrium-Verlust","Magnesium","Schweissverlust","Eisenbedarf-Prüfung","Protokolle","Unlimited AI Chat"].map(f=>(
                  <span key={f} style={{fontSize:11,padding:"3px 9px 3px 6px",borderRadius:20,background:"rgba(0,0,0,.06)",color:"#333",display:"inline-flex",alignItems:"center",gap:4}}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="6" fill="#222"/><path d="M3.5 6l2 2 3-3" stroke="#C8FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>{f}</span>
                ))}
              </div>
              <button onClick={scrollToCards} style={{width:"100%",background:C.neon,color:C.black,border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif",letterSpacing:".01em"}}>
                PRO — CHF 12.90 ↓
              </button>
              <div style={{marginTop:8,padding:"11px 14px",borderRadius:10,background:"#F0F0F0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={scrollToCards}>
                <span style={{fontSize:14,fontWeight:500,color:"#555",fontFamily:"Inter,sans-serif"}}>BASIC — CHF 0.00 ↓</span>
              </div>
              <div style={{marginTop:10,marginBottom:10}}>
                <ReviewsCompact/>
              </div>
              <div style={{marginTop:10,padding:"12px 14px",background:"#F5FFE0",borderRadius:10,border:"1px solid #C8FF00"}}>
                <div style={{fontSize:12,color:"#0A0A0A",lineHeight:1.7,fontWeight:400}}>
                  Dein Körper, dein Sport, dein Bedarf — <strong>exakt berechnet</strong>. Die meisten Sportler geben blind CHF 50–100/Monat für Supplements aus, ohne zu wissen was sie wirklich brauchen. <strong>CHF 2.15 im Monat</strong>, um das zu ändern, ist kein Investment — das ist das Günstigste, was du für deine Performance tun kannst.
                </div>
                <div style={{marginTop:8,fontSize:11,color:"#555",display:"flex",alignItems:"center",gap:5}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Einmalig CHF 12.90 für 6 Monate — danach selbst entscheiden. Kein Passwort, kein Abo.
                </div>
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
            <div style={{fontSize:11,color:"#999",fontWeight:400}}>CHF 12.90 <span style={{color:"#BBB"}}>/ 6 Monate · CHF 2.15/Mt.</span></div>
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
              Basic — Kostenlos →
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
            <div style={{fontSize:11,color:"rgba(0,0,0,.45)",fontWeight:400}}>CHF 12.90 <span style={{opacity:.7}}>/ 6 Monate · CHF 2.15/Mt.</span></div>
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
              {loadPro?"...":"Pro — CHF 12.90 "}{!loadPro&&<span style={{fontSize:10,opacity:.7}}>· CHF 2.15/Mt.</span>}{!loadPro&&" →"}
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



// ── BLUR GATE ────────────────────────────────────────────────────────────────

// ── ANALYSING SCREEN ─────────────────────────────────────────────────────────
function AnalysingScreen({onDone, profilData, sportData}) {
  
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const firstname = profilData?.firstname||"";
  const sports = (sportData?.selectedSports||[]);
  const SPORT_NAMES = {cycling_road:"Rennrad",cycling_gravel:"Gravel",cycling_mtb:"MTB",run_road:"Strassenlauf",run_trail:"Traillauf",triathlon:"Triathlon",swimming:"Schwimmen",hyrox:"Hyrox",football:"Fussball",icehockey:"Eishockey",ski_alpine:"Ski Alpin",tennis:"Tennis",basketball:"Basketball"};
  const sportName = SPORT_NAMES[sports[0]]||"deiner Sportart";

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
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.white,padding:40,fontFamily:"Inter,sans-serif"}}>
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
          <span style={{fontSize:12,color:progress<100?C.g600:"#4A7000",fontFamily:"JetBrains Mono,monospace",letterSpacing:".02em",transition:"color .3s"}}>
            {STEPS[step]}
          </span>
        </div>

        {/* What we calculate */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
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
              <span style={{fontSize:11,color:item.done?"#2D4A00":C.g400,fontWeight:item.done?600:400,transition:"color .3s"}}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

function BlurGate({isPro, onUpgrade, label="PRO Feature", children}) {
  // C is already the global constant
  if(isPro) return children;
  return (
    <div style={{position:"relative",borderRadius:12,overflow:"hidden"}}>
      <div style={{filter:"blur(4px)",pointerEvents:"none",userSelect:"none",opacity:.6}}>
        {children}
      </div>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.7)",backdropFilter:"blur(2px)"}}>
        <div style={{textAlign:"center",padding:"16px 20px",background:"#fff",borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,.12)",border:"1px solid #EBEBEB",maxWidth:220}}>
          <div style={{fontSize:18,marginBottom:6}}>🔒</div>
          <div style={{fontSize:12,fontWeight:700,color:"#0A0A0A",marginBottom:4}}>{label}</div>
          <div style={{fontSize:11,color:"#888",marginBottom:12,lineHeight:1.5}}>Nur mit PRO verfügbar</div>
          <button onClick={onUpgrade}
            style={{background:"#C8FF00",color:"#000",border:"none",borderRadius:8,padding:"8px 16px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif",width:"100%"}}>
            Upgrade CHF 12.90 →
          </button>
        </div>
      </div>
    </div>
  );
}

function Results({sportData,trainingData,profilData,allergenData,praeferenzenData,tier,onReset,onUpgrade}) {
  const [tab,setTab]=useState("summary");
  const isMobile=useWindowWidth()<=768;
  const isPro=tier==="pro";
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
    if(form==="gel"&&!wantsGel) return "Gels sind bei dir deaktiviert — du bevorzugst Riegel oder Drinks.";
    if(form==="gel") return "Ideal für dich: kompakt, sofort verfügbar, kein Kauen nötig.";
    if(form==="drink"&&!wantsDrink) return "Drink Mix ausgeblendet — du bevorzugst kompaktere Optionen.";
    if(form==="drink") return "Perfekt: kombiniert Kohlenhydrate und Hydration in einem.";
    if(form==="riegel"&&!wantsRiegel) return "Riegel ausgeblendet — du bevorzugst Gels oder Drinks.";
    if(form==="riegel") return "Gut für längere Einheiten — mehr Sättigung, solider Energieschub.";
    return "";
  };

  const getSuppReason=(form)=>{
    if(form==="kapsel"&&!wantsKapsel) return "Kapseln ausgeblendet — du bevorzugst Pulver.";
    if(form==="pulver"&&!wantsPulver) return "Pulver ausgeblendet — du bevorzugst Kapseln.";
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
  const aiCtx={sportLabel,intensity:primaryTraining.intensity,days:primaryTraining.days||3,duration:primaryTraining.duration||60,weight:profilData?.weight||75,gender:profilData?.gender||"m",hasComp:primaryTraining.hasCompetition,compCount:primaryTraining.compCount||0,proData};

  const NAV_BASIC=[
    {id:"summary",      label:"Summary",         icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>},
    {id:"empfehlungen", label:"Empfehlungen",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, locked:true},
    {id:"profil",       label:"Profil",           icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
  ];
  const NAV_PRO=[
    {id:"summary",      label:"Summary",         icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>},
    {id:"zahlen",       label:"Deine Zahlen",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>},
    {id:"tagesplan",    label:"Tagesplan",       icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
    {id:"empfehlungen", label:"Empfehlungen",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>},
    {id:"protokolle",   label:"Protokolle",      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>},
    {id:"wettkampf",    label:"Wettkampf",       icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>},
    {id:"einkauf",      label:"Einkauf",         icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>},
    {id:"aichat",       label:"AI Chat",         icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>},
    {id:"profil",       label:"Profil",          icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
  ];
  const NAV=isPro?NAV_PRO:NAV_BASIC;
  const AICHAT_NAV={id:"aichat",label:"TREYN AI Chat",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>};
  const PROFIL_NAV={id:"profil",label:"Profil & Zahlung",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>};
  const KONTAKT_NAV={id:"kontakt",label:"Kontakt & Impressum",icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>};

  const NavItem=({item,mobile=false})=>{
    const active=tab===item.id;
    if(mobile) return (
      <button onClick={()=>item.locked?onUpgrade():setTab(item.id)}
        style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"8px 4px 6px",border:"none",cursor:"pointer",background:"transparent",fontFamily:"Inter,sans-serif",borderTop:active?`2px solid ${C.neon}`:"2px solid transparent",transition:"all .14s"}}>
        <span style={{color:active?C.black:item.locked?C.g300:C.g400,display:"flex"}}>{item.icon}</span>
        <span style={{fontSize:9,fontWeight:active?700:400,color:active?C.black:item.locked?C.g300:C.g500,letterSpacing:".01em",whiteSpace:"nowrap"}}>{item.label}</span>
        {item.locked&&<span style={{fontSize:7,color:C.g300,fontFamily:"JetBrains Mono,monospace"}}>PRO</span>}
      </button>
    );
    return (
      <button onClick={()=>item.locked?onUpgrade():setTab(item.id)} style={{
        display:"flex",alignItems:"center",gap:10,width:"100%",
        padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",
        background:active?C.neon:"transparent",
        color:active?C.black:item.locked?C.g300:C.g600,
        fontFamily:"Inter,sans-serif",fontSize:13,fontWeight:active?600:400,
        transition:"all .14s",textAlign:"left",position:"relative",
      }}>
        <span style={{color:active?C.black:item.locked?C.g300:C.g400,flexShrink:0}}>{item.icon}</span>
        {item.label}
        {item.locked&&<span style={{marginLeft:"auto",fontSize:9,padding:"2px 6px",borderRadius:4,background:C.g100,color:C.g400,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>PRO</span>}
      </button>
    );
  };

  const SupplementsContent=({isPro,primSupps,secSupps,allergenData,proData})=>{
    const prefSupp=praeferenzenData?.suppForm||"beides";
    const [showAllPrim,setShowAllPrim]=useState(false);
    const [showAllSec,setShowAllSec]=useState(false);
    const allergenWarnings=(s)=>{
      if(!allergenData?.allergens?.length) return [];
      return ALLERGEN_GROUPS.filter(g=>g.ingredients.some(ing=>
        (s.name||"").toLowerCase().includes(ing.toLowerCase())||
        (s.why||"").toLowerCase().includes(ing.toLowerCase())
      ));
    };
    const interactions=checkInteractions(primSupps.map(s=>s.id));
    const displayPrim=showAllPrim?primSupps:primSupps.slice(0,3);
    const displaySec=showAllSec?secSupps:secSupps.slice(0,2);
    return (
      <div>
        {primSupps.length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:8}}>DEIN STACK · ZWINGEND</div>
            {displayPrim.map((s,i)=><ProductCard key={s.id} s={s} index={i} isPrimary={true} interactions={interactions.filter(x=>x.ids?.includes(s.id))} allergenWarnings={allergenWarnings(s)}/>)}
            {primSupps.length>3&&<button onClick={()=>setShowAllPrim(x=>!x)} style={{width:"100%",padding:"9px",borderRadius:9,border:`1px solid ${C.g200}`,background:C.white,fontSize:12,color:C.g600,cursor:"pointer",fontFamily:"Inter,sans-serif",marginTop:4}}>{showAllPrim?`Weniger anzeigen`:`+ ${primSupps.length-3} weitere anzeigen`}</button>}
          </div>
        )}
        {secSupps.length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:8}}>OPTIONAL · SINNVOLL</div>
            {displaySec.map((s,i)=><ProductCard key={s.id} s={s} index={i} isPrimary={false} interactions={interactions.filter(x=>x.ids?.includes(s.id))} allergenWarnings={allergenWarnings(s)}/>)}
            {secSupps.length>2&&<button onClick={()=>setShowAllSec(x=>!x)} style={{width:"100%",padding:"9px",borderRadius:9,border:`1px solid ${C.g200}`,background:C.white,fontSize:12,color:C.g600,cursor:"pointer",fontFamily:"Inter,sans-serif",marginTop:4}}>{showAllSec?`Weniger anzeigen`:`+ ${secSupps.length-2} weitere anzeigen`}</button>}
          </div>
        )}
      </div>
    );
  };

  const WearablesContent=()=>{
    const WEARABLES=[
      {
        name:"Garmin Forerunner 965",
        badge:"GPS · HRV · VO₂max · TOP PICK",
        affiliate:true,
        category:"Multisport",
        why:"Das beste Multisport-GPS für Ausdauersportler. Misst VO₂max, HRV, Training Readiness und Körperbatteriestand — alles was TREYN+ für präzisere Berechnungen nutzen kann.",
        metrics:["VO₂max","HRV","Schlaf","Training Load","Erholungsstatus"],
        price:"ab CHF 599",
        shops:[
          {name:"Garmin CH",link:"https://www.garmin.com/de-CH/p/735158"},
          {name:"Galaxus",link:"https://www.galaxus.ch/de/s1/product/garmin-forerunner-965",affiliate:true},
        ],
      },
      {
        name:"Garmin Fenix 8",
        badge:"Premium · Outdoor · Multisport",
        affiliate:true,
        category:"Premium GPS",
        why:"Für den Athleten der alles will. Solarladung, Topo-Karten, Tauchen — und alle Gesundheitsmetriken die TREYN+ für optimale Berechnungen braucht.",
        metrics:["VO₂max","HRV","Schlaf","Altitude Training","Körperbatterie"],
        price:"ab CHF 899",
        shops:[
          {name:"Garmin CH",link:"https://www.garmin.com/de-CH/p/994307"},
          {name:"Galaxus",link:"https://www.galaxus.ch/de/s1/product/garmin-fenix-8",affiliate:true},
        ],
      },
      {
        name:"Polar Vantage V3",
        badge:"Polar · Ausdauer · HRV",
        affiliate:true,
        category:"Ausdauer",
        why:"Polars Flaggschiff für Ausdauersportler. Noxim-Technologie misst Sauerstoffsättigung am Handgelenk — einzigartig präzise für Regenerationsberechnungen.",
        metrics:["VO₂max","HRV","Schlaf","Noxim O₂","Running Power"],
        price:"ab CHF 499",
        shops:[
          {name:"Polar CH",link:"https://www.polar.com/de/vantage/v3"},
          {name:"Galaxus",link:"https://www.galaxus.ch/de/s1/product/polar-vantage-v3",affiliate:true},
        ],
      },
      {
        name:"Polar Pacer Pro",
        badge:"Laufen · Leicht · Präzise",
        affiliate:true,
        category:"Running",
        why:"Leichtest mögliche GPS-Uhr für Läufer mit allen wichtigen Metriken. Nur 45g — man vergisst sie beim Training.",
        metrics:["VO₂max","HRV","Laufleistung","Kadenz","Schlaf"],
        price:"ab CHF 299",
        shops:[
          {name:"Polar CH",link:"https://www.polar.com/de/pacer-pro"},
          {name:"Galaxus",link:"https://www.galaxus.ch/de/s1/product/polar-pacer-pro",affiliate:true},
        ],
      },
      {
        name:"WHOOP 4.0",
        badge:"Recovery · HRV · Sleep",
        affiliate:false,
        category:"Recovery Tracker",
        why:"Kein Display, kein Ablenkung — nur Daten. WHOOP misst HRV, Schlafqualität und Strain rund um die Uhr. Die beste Lösung für Recovery-Tracking ohne Uhr.",
        metrics:["HRV","Schlaf","Strain Score","Respiratory Rate","SPO₂"],
        price:"ab CHF 239 + Abo",
        shops:[
          {name:"WHOOP",link:"https://www.whoop.com/de-de/"},
          {name:"Galaxus",link:"https://www.galaxus.ch/de/s1/product/whoop-4",affiliate:true},
        ],
      },
      {
        name:"Oura Ring 4",
        badge:"Ring · Schlaf · HRV",
        affiliate:true,
        category:"Sleep & Recovery",
        why:"Der unauffälligste Tracker der Welt. Als Ring getragen misst er Schlafphasen, HRV und Körpertemperatur mit Laborqualität — ideal für alle die keine Uhr tragen wollen.",
        metrics:["HRV","Schlafphasen","Körpertemperatur","Readiness Score","Zyklusanalyse"],
        price:"ab CHF 349 + Abo",
        shops:[
          {name:"Oura",link:"https://ouraring.com/de"},
          {name:"Zur Rose",link:"https://www.zurrose-shop.ch/de/oura-ring",affiliate:true},
        ],
      },
      {
        name:"Apple Watch Ultra 2",
        badge:"Apple · GPS · LTE",
        affiliate:false,
        category:"Smartwatch",
        why:"Für Apple-Nutzer die alles integriert wollen. Apple Health verbindet direkt mit TREYN+ — Körperdaten fliessen automatisch in deine Analysen.",
        metrics:["VO₂max","HRV","Schlaf","Crasherkennung","Temperatur"],
        price:"ab CHF 899",
        shops:[
          {name:"Apple CH",link:"https://www.apple.com/ch-de/shop/buy-watch/apple-watch-ultra"},
          {name:"Galaxus",link:"https://www.galaxus.ch/de/s1/product/apple-watch-ultra-2",affiliate:true},
        ],
      },
      {
        name:"Fitbit Charge 6",
        badge:"Günstig · Alltag · Google",
        affiliate:true,
        category:"Fitness Tracker",
        why:"Der beste Einstiegs-Tracker. EKG, SpO₂ und Google Maps integriert. Für Sportler die kein Budget für eine Premiumuhr haben aber trotzdem gute Daten wollen.",
        metrics:["Herzfrequenz","Schlaf","SpO₂","EKG","Stress"],
        price:"ab CHF 149",
        shops:[
          {name:"Galaxus",link:"https://www.galaxus.ch/de/s1/product/fitbit-charge-6",affiliate:true},
          {name:"Zur Rose",link:"https://www.zurrose-shop.ch/de/fitbit",affiliate:true},
        ],
      },
    ];

    // Supplements via nu3/Zur Rose
    const BURGERSTEIN=[
      {name:"Burgerstein Sport",desc:"Das Basisprodukt für Breiten- und Leistungssportler — entwickelt mit Sportärzten. Antioxidantien, Vitamine, Mineralien.",price:"CHF 29.90",link:"https://www.nu3.ch/products/burgerstein-sport",shop:"nu3.ch",affiliate:true},
      {name:"Burgerstein Magnesium",desc:"Hochdosiertes Magnesium in optimaler Form — für Muskelkrampfprävention und Regeneration.",price:"CHF 24.90",link:"https://www.nu3.ch/products/burgerstein-magnesium-vital",shop:"nu3.ch",affiliate:true},
      {name:"Burgerstein Omega-3",desc:"Hochreines Fischöl mit Friend of the Sea Zertifikat — entzündungshemmend und herzkardioprotektiv.",price:"CHF 34.90",link:"https://www.zur-rose.ch/de/burgerstein-omega-3",shop:"Zur Rose",affiliate:true},
      {name:"Burgerstein Vitamin D3",desc:"Vitamin D3 in optimaler Dosierung — 70% aller Schweizer sind mangelhaft, Sportler besonders gefährdet.",price:"CHF 19.90",link:"https://www.nu3.ch/products/burgerstein-vitamin-d3",shop:"nu3.ch",affiliate:true},
      {name:"Burgerstein Zink",desc:"Organisches Zink für Immunsystem, Hormonhaushalt und Wundheilung — bei Ausdauersportlern oft defizitär.",price:"CHF 22.90",link:"https://www.zur-rose.ch/de/burgerstein-zink",shop:"Zur Rose",affiliate:true},
    ];

    const [section,setSection]=useState("wearables");

    return (
      <div>
        {/* Section toggle */}
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {[{id:"wearables",l:"Wearables"},{id:"burgerstein",l:"Burgerstein"}].map(s=>(
            <button key={s.id} onClick={()=>setSection(s.id)}
              style={{padding:"6px 16px",borderRadius:100,border:`1.5px solid ${section===s.id?C.black:C.g200}`,background:section===s.id?C.neon:C.white,color:C.black,fontSize:12,fontWeight:section===s.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .13s"}}>
              {s.l}
            </button>
          ))}
        </div>

        {section==="wearables"&&(
          <div>
            {/* Why you need it */}
            <div style={{background:C.neonDim,border:`1px solid ${C.neon}`,borderRadius:12,padding:"14px 16px",marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:6}}>Warum ein Wearable deine TREYN+ Analyse verbessert</div>
              <div style={{fontSize:11,color:"#4A7000",lineHeight:1.7}}>
                TREYN+ berechnet mit MET-Werten und deinen Angaben — das gibt ~85% Genauigkeit. Mit echten Wearable-Daten (HRV, VO₂max, Schlafphasen, Schweissrate) steigt die Präzision auf ~95%. Konkret: ein Garmin oder Polar liefert deinen echten VO₂max-Wert, echte HRV-Trends und präzise Erholungszeiten — alles direkt in deine Berechnungen.
              </div>
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                {["VO₂max (real)","HRV-Trend","Schlafqualität","Schweissrate","Training Load"].map(m=>(
                  <span key={m} style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:C.neon,color:C.black,fontWeight:600}}>{m}</span>
                ))}
              </div>
            </div>

            {/* Product cards */}
            {WEARABLES.map((w,i)=>(
              <div key={i} style={{background:C.white,border:`0.5px solid ${C.g200}`,borderRadius:12,padding:"14px 16px",marginBottom:10,position:"relative"}}>
                {w.affiliate&&w.shops.some(s=>s.affiliate)&&(
                  <div style={{position:"absolute",top:12,right:12,fontSize:8,padding:"2px 7px",borderRadius:4,background:C.neon,color:C.black,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>TOP PICK</div>
                )}
                <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:C.black,paddingRight:w.affiliate?60:0}}>{w.name}</div>
                    <div style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace",marginTop:2}}>{w.badge}</div>
                  </div>
                </div>
                <div style={{fontSize:11,color:C.g600,lineHeight:1.65,marginBottom:10}}>{w.why}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
                  {w.metrics.map(m=><span key={m} style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:C.g100,color:C.g600}}>{m}</span>)}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.black}}>{w.price}</span>
                  <span style={{fontSize:10,color:C.g400}}>{w.category}</span>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {w.shops.map((s,j)=>(
                    <a key={j} href={s.link} target="_blank" rel="noopener noreferrer"
                      style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,background:s.affiliate?C.neon:C.g100,color:C.black,padding:"8px",borderRadius:8,fontSize:10,fontWeight:600,textDecoration:"none"}}>
                      {s.name} →
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {section==="burgerstein"&&(
          <div>
            <div style={{background:C.g100,border:`0.5px solid ${C.g200}`,borderRadius:12,padding:"12px 16px",marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:4}}>Burgerstein — die Schweizer Referenz</div>
              <div style={{fontSize:11,color:C.g600,lineHeight:1.65}}>Official Supplier von Swiss Ski, Swiss Triathlon und Swiss Tennis. Entwickelt von Sportärzten für Sportler — seit 50 Jahren. Erhältlich via nu3.ch und Zur Rose mit schneller CH-Lieferung.</div>
            </div>
            {BURGERSTEIN.map((p,i)=>(
              <div key={i} style={{background:C.white,border:`0.5px solid ${C.g200}`,borderRadius:12,padding:"13px 16px",marginBottom:8}}>
                <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:4}}>{p.name}</div>
                <div style={{fontSize:11,color:C.g600,lineHeight:1.6,marginBottom:10}}>{p.desc}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.black}}>{p.price}</span>
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:4,background:C.neon,color:C.black,padding:"7px 14px",borderRadius:8,fontSize:10,fontWeight:700,textDecoration:"none"}}>
                    {p.shop} →
                  </a>
                </div>
              </div>
            ))}
            <div style={{marginTop:8,padding:"10px 14px",background:C.g100,borderRadius:10,fontSize:11,color:C.g400,lineHeight:1.6}}>
              Burgerstein verkauft ausschliesslich über Apotheken und autorisierte Partner — nu3.ch und Zur Rose sind offizielle Händler mit Schweizer Qualitätsgarantie.
            </div>
          </div>
        )}
      </div>
    );
  };

  const HydrationContent=()=>{
    const DURING=[
      {
        name:"MORE Nutrition Sirup",
        badge:"Ohne Zucker · CH-Bestseller",
        affiliate:true,
        why:"Der einfachste Weg mehr zu trinken — über 30 Geschmäcker, 0 Kalorien. Für alle die Wasser öde finden.",
        science:"Süsser Geschmack erhöht die Trinkmotivation nachweislich um 40–60%. Kein Zucker = kein Insulin-Spike.",
        tags:["Täglich","Ohne Zucker"],
        link:AFF.more_sirup(),
        shop:"MORE Nutrition",
        img:"https://www.more-nutrition.de/cdn/shop/products/MORE_Sirup_Mango-Maracuja_500ml.jpg",
      },
      {
        name:"LMNT Elektrolyt-Packets",
        badge:"1000mg Natrium · Kein Zucker",
        affiliate:true,
        why:"Extrem hochdosiert — 3× mehr Natrium als normale Elektrolyte. Ideal für Intensiv-Sportler und Keto-Athleten.",
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
        why:"Kompaktes Format — einfach in die Trinkflasche, überall dabei. Schweizer Qualitätsstandard.",
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
        why:"Natürlich isotonisch mit Kalium, Magnesium und Natrium. Idealer Ersatz für Sportgetränke — ohne Zucker-Overhead.",
        science:"Ähnliche Elektrolyt-Zusammensetzung wie menschliches Blutplasma. Studien zeigen gleiche Rehydrations-Wirkung wie kommerzielle Sportdrinks.",
        tags:["Natürlich","Kalium"],
        link:"https://www.galaxus.ch/de/s1/product/vita-coco-kokoswasser",
        shop:"Galaxus",
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
        why:"Das beste alkoholfreie Bier das je gemacht wurde — für alle die nach einem harten Training das Bier-Feeling wollen ohne Alkohol.",
        science:"0% Alkohol eliminiert den wichtigsten Recovery-Killer. Alkohol hemmt Proteinsynthese, Testosteron und Schlafqualität — Athletic Brewing gibt dir das Ritual ohne die Kosten.",
        tags:["0% Alkohol","Craft","Recovery"],
        link:AFF.athletic(),
        shop:"Athletic Brewing",
        img:null,
      },
      {
        name:"Schokoladenmilch",
        badge:"Klassiker der Sportwissenschaft",
        affiliate:false,
        why:"Klingt banal — ist aber ernsthaft eines der meistgetesteten Recovery-Getränke der Sportwissenschaft. Günstig, zugänglich, effektiv.",
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
        science:"Intensive Trainingsbelastung erhöht Darmpermeabilität ('Leaky Gut'). Probiotika reduzieren Inflammation und verbessern Nährstoffaufnahme — direkt relevant für Recovery.",
        tags:["Probiotika","Darm","Protein"],
        link:"https://www.migros.ch",
        shop:"Migros / Coop",
        img:null,
      },
    ];

    const ProductCard=({p})=>(
      <div style={{background:C.white,border:`1px solid ${p.highlight?C.neon:C.g200}`,borderRadius:12,padding:"14px 16px",marginBottom:8,position:"relative"}}>
        {p.affiliate&&(
          <div style={{position:"absolute",top:12,right:12,fontSize:8,padding:"2px 7px",borderRadius:4,background:C.neon,color:C.black,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>TOP PICK</div>
        )}
        {p.highlight&&(
          <div style={{marginBottom:8,display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",background:C.neon,borderRadius:100}}>
            <span style={{fontSize:10,fontWeight:700,color:C.black}}>⭐ WISSENSCHAFTLICH BELEGT</span>
          </div>
        )}
        <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:2,paddingRight:p.affiliate?60:0}}>{p.name}</div>
        <div style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace",marginBottom:8}}>{p.badge}</div>
        <div style={{fontSize:11,color:C.g600,lineHeight:1.6,marginBottom:8}}>{p.why}</div>
        <div style={{padding:"8px 12px",background:C.g100,borderRadius:8,marginBottom:10}}>
          <div style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace",marginBottom:3}}>WISSENSCHAFT</div>
          <div style={{fontSize:11,color:C.g600,lineHeight:1.5}}>{p.science}</div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
          {p.tags.map(t=><span key={t} style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:C.g100,color:C.g600}}>{t}</span>)}
        </div>
        <a href={p.link} target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:p.affiliate?C.neon:C.g100,color:C.black,padding:"9px 14px",borderRadius:9,fontSize:11,fontWeight:600,textDecoration:"none"}}>
          <span>{p.shop} →</span>
        </a>
      </div>
    );

    return (
      <div>
        <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:10}}>HYDRATION WÄHREND DEM TAG</div>
        <div style={{fontSize:12,color:C.g600,marginBottom:14,lineHeight:1.6}}>Wasser ist öde? Diese Produkte machen Trinken zum Erlebnis — und sind trotzdem wissenschaftlich sinnvoll.</div>
        {DURING.map((p,i)=><ProductCard key={i} p={p}/>)}

        <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:10,marginTop:20}}>NACH DEM TRAINING</div>
        <div style={{fontSize:12,color:C.g600,marginBottom:14,lineHeight:1.6}}>Recovery-Drinks die wirklich funktionieren — von Wissenschaft belegt, trotzdem Spass.</div>
        {AFTER.map((p,i)=><ProductCard key={i} p={p}/>)}


      </div>
    );
  };

  const FertiggerichteContent=()=>(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {[
        {name:"Löwenanteil",badge:"Bio · High Protein · TOP PICK",desc:"Bio-Fertiggerichte im Glas — 30–42g Protein, 1 Jahr ungekühlt haltbar. Ideal für Sportler.",products:[{l:"Protein",v:"30–42g"},{l:"Zubereitung",v:"3 Min."},{l:"Preis",v:"ab CHF 7.90"}],link:"https://www.loewenanteil.com?ref=TREYN",img:"https://www.loewenanteil.com/cdn/shop/files/LÖW_Produktfoto_Rindfleisch-Eintopf.jpg"},
        {name:"HelloFresh",badge:"Meal Kit · Flexible Lieferung",desc:"Wochentliche Meal Kits mit ausgewogenen Mahlzeiten — einfach zu kochen, sportlergerecht.",products:[{l:"Kalorien",v:"500–800 kcal"},{l:"Protein",v:"25–40g"},{l:"Preis",v:"ab CHF 8.90"}],link:"https://www.hellofresh.ch",img:"https://img.hellofresh.com/hellofresh_s3/image/5f7c6b2f3e36d0000c4e4b1a.jpg"},
      ].map((b,i)=>(
        <div key={i} style={{borderRadius:12,border:`1px solid ${C.g200}`,background:C.white,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{background:C.g100,height:120,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            <img src={b.img} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
          </div>
          <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:2}}>{b.name}</div>
            <div style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace",marginBottom:6}}>{b.badge}</div>
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
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {[
        {name:"Therabody",badge:"Massage Guns · Boots",desc:"Weltmarktführer in Perkussionstherapie. Genutzt von Profiteams in NBA, NFL und Tour de France.",products:[{n:"Theragun PRO Plus",p:"CHF 599"},{n:"Theragun Mini",p:"CHF 199"},{n:"JetBoots PRO",p:"CHF 1'149"}],link:"https://www.therabody.com/de-ch",img:"https://cdn.shopify.com/s/files/1/0624/4657/products/TBY-PRO5-BLK_1.png"},
        {name:"Hyperice",badge:"Kompression · Massage",desc:"Gold Standard für Kompressionsboots — Ironman, NBA und Tour de France. Hypervolt als günstige Alternative.",products:[{n:"Hypervolt 2",p:"CHF 229"},{n:"Normatec 3 Legs",p:"CHF 899"},{n:"Normatec Elite",p:"CHF 1'099"}],link:"https://hyperice.com/",img:"https://hyperice.com/cdn/shop/products/Normatec3Leg_Lifestyle_ProductPage_1.jpg"},
        {name:"Blackroll",badge:"Faszienrollen · Selbstmassage",desc:"Schweizer Marktführer für Faszientherapie. Einsteigerfreundlich — ideal für tägliche Selbstmassage.",products:[{n:"Standard Rolle",p:"CHF 35"},{n:"Massage Gun",p:"CHF 149"},{n:"Ball",p:"CHF 15"}],link:"https://www.blackroll.com/ch-de",img:"https://www.blackroll.com/cdn/shop/products/blackroll-standard-rolle-schwarz_1.jpg"},
        {name:"Compex",badge:"EMS Muskelstimulation",desc:"Pionier in Elektrostimulation — genutzt von Physios und Profiathleten. Aktive Recovery und Muskelaufbau.",products:[{n:"Edge 3.0",p:"CHF 199"},{n:"Performance 3.0",p:"CHF 249"},{n:"Sport Elite 3.0",p:"CHF 349"}],link:"https://www.compex.com/ch-de",img:"https://www.compex.com/medias/sys_master/root/h2e/hef/8796266717214/compex-sp-8-0-wireless.jpg"},
      ].map((b,i)=>(
        <div key={i} style={{borderRadius:12,border:`1px solid ${C.g200}`,background:C.white,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div style={{background:C.g100,height:120,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            <img src={b.img} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
          </div>
          <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.black,marginBottom:2}}>{b.name}</div>
            <div style={{fontSize:9,color:C.g400,fontFamily:"JetBrains Mono,monospace",marginBottom:6}}>{b.badge}</div>
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
  const TagesplanTab=()=>{
    const isMobile=useWindowWidth()<=768;
    const calc=calcPro(profilData,trainingData,sportData);
    const t=calc?.timingRecs||{preWorkout:"—",postWorkout:"—",creatine:"—",note:""};
    const w=+profilData?.weight||75;
    const isEndurance=[...sports].some(s=>["cycling","running","triathlon","swimming","langlauf"].some(x=>s.includes(x)));
    const TIME={morning:"Morgen",midday:"Mittag",afternoon:"Nachmittag",evening:"Abend"}[calc?.primaryTrainingTime]||"Training";

    const PLAN=[
      {
        time:"06:00–07:00",phase:"Aufwachen",
        items:[
          {label:"Wasser",detail:"500ml direkt nach dem Aufstehen — Rehydration nach 7–8h Schlaf",icon:"💧"},
          ...(calc?.vitDRisk?[{label:"Vitamin D3 + K2",detail:`${calc?.altitude==="alpine"?"4000":"2000–3000"} IE mit erstem Essen — fettlöslich, braucht Mahlzeit`,icon:"☀️"}]:[]),
          ...(calc?.suppressMag?[]:[{label:"Omega-3",detail:"2–3g EPA/DHA zu einer Mahlzeit",icon:"🐟"}]),
        ]
      },
      {
        time:t.preWorkout,phase:`Pre-Workout (${TIME})`,
        items:[
          {label:"Mahlzeit / Snack",detail:`${Math.round(calc?.carbsG*0.25)||60}g Kohlenhydrate, 1.5–2h vor Training`,icon:"🍌"},
          ...(!calc?.suppressKoffein?[{label:"Koffein 100–200mg",detail:"45 min vor Training — Leistung +3–5%",icon:"☕"}]:[]),
          {label:"Wasser",detail:"400–600ml in der Stunde vor dem Training",icon:"💧"},
        ]
      },
      {
        time:"Training",phase:"Während Training",
        items:[
          {label:"Wasser + Elektrolyte",detail:`${Math.round((calc?.sweatLitresPerSession||0.8)*500)}–${Math.round((calc?.sweatLitresPerSession||0.8)*700)}ml/h bei intensivem Training`,icon:"⚡"},
          ...(isEndurance&&(trainingData?.[primarySport]?.duration||60)>60?[{label:"Kohlenhydrate",detail:`${calc?.carbsPerHour||45}g/h ab Minute 45 — Gels oder Drink Mix`,icon:"🔋"}]:[]),
        ]
      },
      {
        time:t.postWorkout,phase:"Post-Workout",
        items:[
          {label:"Protein",detail:`${Math.round((calc?.proteinMin||140)*0.25)}–${Math.round((calc?.proteinMax||180)*0.25)}g innerhalb 30 min — anaboles Fenster`,icon:"💪"},
          {label:"Kohlenhydrate",detail:"30–50g für Glykogen-Wiederauffüllung",icon:"🍚"},
          ...(calc?.needsCollagen?[{label:"Kollagen + Vit C",detail:"10–15g vor Training (nicht danach!) — Sehnen & Gelenke",icon:"🦴"}]:[]),
        ]
      },
      {
        time:"12:00–13:00",phase:"Mittag",
        items:[
          {label:"Hauptmahlzeit",detail:`${Math.round((calc?.withTraining||2500)*0.35)} kcal, ${Math.round((calc?.proteinMin||140)*0.3)}g Protein`,icon:"🥗"},
          ...(!calc?.suppressKreatin?[{label:"Kreatin",detail:t.creatine+" · 5g täglich — mit Kohlenhydraten",icon:"💊"}]:[]),
        ]
      },
      {
        time:"18:00–19:00",phase:"Abend",
        items:[
          {label:"Abendmahlzeit",detail:`${Math.round((calc?.withTraining||2500)*0.30)} kcal, proteinreich`,icon:"🍽️"},
          {label:"Magnesium Bisglycinate",detail:`${calc?.magnesiumMg||350}mg — 1h vor Schlaf für beste Schlafwirkung`,icon:"🌙"},
          ...(calc?.stressAshwaNeeded||calc?.recoveryAshwaNeeded?[{label:"Ashwagandha KSM-66",detail:"600mg abends — Cortisol senken, Schlaf verbessern",icon:"🌿"}]:[]),
        ]
      },
      {
        time:"22:00",phase:"Vor dem Schlafen",
        items:[
          {label:"Ziel: 7–9h Schlaf",detail:"Unter 7h = Cortisol hoch, Muskelabbau, schlechtere Regeneration",icon:"😴"},
          ...(calc?.sleep<7?[{label:"⚠ Schlafdefizit erkannt",detail:`Aktuell ${calc?.sleep}h — das ist dein wichtigster Performance-Hebel`,icon:"⚠️"}]:[]),
        ]
      },
    ];

    return (
      <div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:4}}>DEIN TAGESPLAN · {TIME.toUpperCase()}TRAINING</div>
          <div style={{fontSize:12,color:C.g600,lineHeight:1.6}}>Personalisiert auf {w}kg, {calc?.primaryTrainingTime==="morning"?"Morgen":calc?.primaryTrainingTime==="evening"?"Abend":"Mittel"}training und deine aktiven Supplements.</div>
        </div>

        {/* Timeline */}
        <div style={{position:"relative"}}>
          {PLAN.map((block,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:16}}>
              {/* Timeline line */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:44,flexShrink:0}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:i===1?C.neon:C.g200,flexShrink:0,marginTop:4}}/>
                {i<PLAN.length-1&&<div style={{width:1,flex:1,background:C.g100,margin:"4px 0"}}/>}
              </div>
              {/* Content */}
              <div style={{flex:1,paddingBottom:i<PLAN.length-1?8:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.black}}>{block.phase}</div>
                  <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace"}}>{block.time}</div>
                </div>
                <div style={{background:i===1?C.neonDim:C.white,border:`0.5px solid ${i===1?C.neon:C.g200}`,borderRadius:10,padding:"10px 12px",display:"flex",flexDirection:"column",gap:8}}>
                  {block.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                      <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{item.icon}</span>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:C.black}}>{item.label}</div>
                        <div style={{fontSize:11,color:C.g500,lineHeight:1.5,marginTop:1}}>{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily summary */}
        <div style={{background:C.g100,border:`0.5px solid ${C.g200}`,borderRadius:12,padding:"14px 16px",marginTop:8}}>
          <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:10}}>TAGESZIELE</div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:8}}>
            {[
              {l:"Kalorien",v:`${(calc?.withTraining||2500).toLocaleString("de-CH")} kcal`},
              {l:"Protein",v:`${calc?.proteinMin||140}–${calc?.proteinMax||180}g`},
              {l:"Wasser",v:`${((calc?.waterMl||2500)/1000).toFixed(1)}L`},
              {l:"Schlaf",v:`${calc?.sleep||7}h+`},
            ].map(s=>(
              <div key={s.l} style={{textAlign:"center"}}>
                <div style={{fontSize:15,fontWeight:700,color:C.black,letterSpacing:"-.02em"}}>{s.v}</div>
                <div style={{fontSize:10,color:C.g400,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
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
        <div style={{fontSize:12,color:C.g600,marginBottom:16,lineHeight:1.65}}>Einnahme-Protokolle für jedes deiner Supplements — Dauer, Pausen und wichtige Hinweise.</div>
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
                  <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:8,marginBottom:12}}>
                    {[
                      {l:"Einnahme-Timing",v:p.timing},
                      {l:"Dauer",v:p.dauer},
                      ...(p.pause&&p.pause!=="Keine"?[{l:"Pause",v:p.pause}]:[]),
                    ].map(r=>(
                      <div key={r.l} style={{background:C.g100,borderRadius:8,padding:"9px 12px"}}>
                        <div style={{fontSize:10,color:C.g400,marginBottom:3}}>{r.l}</div>
                        <div style={{fontSize:12,fontWeight:500,color:C.black,lineHeight:1.4}}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  {p.hinweis&&(
                    <div style={{padding:"10px 12px",background:"#FFFBF0",border:"0.5px solid #FFE082",borderRadius:8}}>
                      <div style={{fontSize:10,color:"#856404",fontFamily:"JetBrains Mono,monospace",marginBottom:4}}>WICHTIGER HINWEIS</div>
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
    const calc=calcPro(profilData,trainingData,sportData);
    const hasComp=Object.values(trainingData||{}).some(d=>d.hasCompetition);
    const isEndurance=[...sports].some(s=>["cycling","running","triathlon","swimming","langlauf"].some(x=>s.includes(x)));
    const carbLoad=Math.round((calc?.carbsG||250)*1.5);
    const raceCarbs=calc?.carbsPerHour||60;
    const w=+profilData?.weight||75;
    const na=calc?.natriumMg||1200;

    if(!hasComp) return (
      <div style={{padding:"20px 0",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>🏁</div>
        <div style={{fontSize:14,fontWeight:600,color:C.black,marginBottom:6}}>Kein Wettkampf aktiviert</div>
        <div style={{fontSize:12,color:C.g600,lineHeight:1.6}}>Aktiviere "Wettkämpfe" in deinen Trainingsangaben um die Race-Day-Strategie freizuschalten.</div>
      </div>
    );

    const PHASES=[
      {
        label:"3 Tage vorher",icon:"📅",
        items:[
          {title:"Carb-Loading starten",detail:`Kohlenhydrate auf ${carbLoad}g/Tag erhöhen — Glykogenspeicher maximal füllen`,bold:true},
          {title:"Kreatin pausieren",detail:"Letzte Kreatin-Dosis 3 Tage vor Wettkampf — verhindert Magenprobleme"},
          {title:"Koffein reduzieren",detail:"Koffein-Pause 3–5 Tage vor dem Rennen für maximale Wirkung am Wettkampftag"},
          {title:"Schlaf priorisieren",detail:"Mindestens 8h — Schlafdefizit am Renntag lässt sich nicht ausgleichen"},
        ]
      },
      {
        label:"Tag vorher",icon:"🌙",
        items:[
          {title:"Pasta-/Reis-Mahlzeit Abend",detail:`${Math.round(carbLoad*0.6)}g Kohlenhydrate, wenig Fett — leicht verdaulich, kein Risiko`,bold:true},
          {title:"Magnesium + Salz",detail:`${calc?.magnesiumMg||350}mg Magnesium, zusätzliches Natrium im Essen — Krämpfprophylaxe`},
          {title:"Hydration aufbauen",detail:"2.5–3L Wasser über den Tag — kein übermässiges Trinken abends"},
          {title:"Kein neues Essen",detail:"Nur bekannte Lebensmittel — niemals Unbekanntes vor einem Wettkampf"},
        ]
      },
      {
        label:"Race Morning",icon:"☀️",
        items:[
          {title:`${isEndurance?"3h vor Start":"2h vor Start"}: Hauptmahlzeit`,detail:`${Math.round(carbLoad*0.4)}g Kohlenhydrate, ${Math.round(w*0.3)}g Protein — Hafer, Brot, Banane`,bold:true},
          {title:"45 min vor Start: Koffein",detail:`${hasBlutdruck?"⚠ Blutdruckmedikamente beachten — Arzt fragen":"150–200mg Koffein für maximale Wirkung beim Start"}`},
          {title:"30 min vor Start: Gel",detail:isEndurance?`1 Gel (${raceCarbs}g Carbs) für sofortigen Energieschub`:"Optional: 1 Gel oder Banane"},
          {title:"Warm-up Hydration",detail:`400–600ml Wasser mit 1 Elektrolyt-Tab — ${na}mg Natrium laden`},
        ]
      },
      {
        label:"Während Wettkampf",icon:"🏃",
        items:[
          {title:"Kohlenhydrate/Stunde",detail:`${raceCarbs}–${raceCarbs+15}g/h ab Minute 30 — niemals warten bis Hungergefühl`,bold:true},
          {title:"Natrium/Stunde",detail:`${Math.round(na/1000*500)}mg Natrium mit jedem halben Liter — Krämpfe verhindern`},
          {title:"Flüssigkeit",detail:`${Math.round((calc?.sweatLitresPerSession||0.8)*500)}–${Math.round((calc?.sweatLitresPerSession||0.8)*700)}ml/h — Durst als Guideline, nicht überhydrieren`},
          ...(isEndurance?[{title:"Koffein-Gel strategisch",detail:"1 Koffein-Gel (100mg) 20–30 min vor kritischer Phase oder Schlussspurt"}]:[]),
        ]
      },
      {
        label:"Post-Race Recovery",icon:"🏅",
        items:[
          {title:"Sofort: Protein + Carbs",detail:`${Math.round(w*0.4)}g Protein + ${Math.round(calc?.carbsG*0.3)||60}g Kohlenhydrate in den ersten 30 min`,bold:true},
          {title:"Rehydration",detail:`${Math.round((calc?.sweatLitresPerSession||0.8)*1.5)}L Wasser + Elektrolyte für vollständige Rehydration`},
          {title:"Magnesium hochdosiert",detail:`${Math.round((calc?.magnesiumMg||350)*1.5)}mg Magnesium abends — maximale Muskelregeneration`},
          {title:"72h Recovery",detail:"Kein intensives Training 48–72h nach Wettkampf — aktive Regeneration (Schwimmen, Gehen)"},
        ]
      },
    ];

    return (
      <div>
        <div style={{background:C.neonDim,border:`1px solid ${C.neon}`,borderRadius:12,padding:"13px 16px",marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:600,color:C.black,marginBottom:4}}>Race-Day Strategie · {sportLabel}</div>
          <div style={{fontSize:11,color:"#4A7000",lineHeight:1.65}}>Personalisiert auf {w}kg, {raceCarbs}g Carbs/h und {na}mg Natrium/h. Alle Angaben basieren auf deinen Trainingsdaten und MET-2024 Berechnungen.</div>
        </div>

        {PHASES.map((phase,i)=>(
          <div key={i} style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:18}}>{phase.icon}</span>
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
          <div style={{fontSize:11,color:C.g400,lineHeight:1.65}}>Diese Strategie ist eine wissenschaftliche Basis-Empfehlung. Teste alle Protokolle im Training bevor du sie im Wettkampf anwendest — besonders Gel-Frequenz und Flüssigkeitsmenge.</div>
        </div>
      </div>
    );
  };

  const NutritionTab=()=>{
    const [rubrik,setRubrik]=useState("energie");
    const [showAll,setShowAll]=useState(false);
    const [formPref,setFormPref]=useState(null); // gel/riegel/drink
    const [dietPref,setDietPref]=useState(null); // standard/vegan
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
      {id:"energie",  label:"Energie",   icon:"⚡", desc:"Kohlenhydrate für Training & Rennen"},
      {id:"protein",  label:"Protein",   icon:"💪", desc:"Muskelaufbau & Regeneration"},
      {id:"recovery", label:"Recovery",  icon:"🌙", desc:"Gelenke, Schlaf & Erholung"},
    ];

    const ENERGIE_PRODUKTE=[
      {id:"sn_mau_gel",   form:"gel",    diet:"standard", timing:"waehrend", name:"Maurten Gel 100",         dose:"1 Gel alle 30–40 min",  when:"Ab 75 min Training",      why:"Hydrogel-Technologie — minimaler GI-Stress, maximale Aufnahme.", link:AFF.maurten("gel-100"),          shop:"Maurten", price:"~CHF 3.80/Gel"},
      {id:"sn_mau_caf",   form:"gel",    diet:"standard", timing:"waehrend", name:"Maurten Gel 100 CAF",     dose:"1 Gel alle 40–45 min",  when:"Rennen & Intervalle",     why:"Koffein + Kohlenhydrate — für maximale Leistung in Rennsituationen.", link:AFF.maurten("gel-100-caf-100"), shop:"Maurten", price:"~CHF 4.00/Gel"},
      {id:"sn_mn_gel",    form:"gel",    diet:"standard", timing:"waehrend", name:"MNSTRY Intensity Gel",    dose:"1 Gel alle 30–45 min",  when:"Tempoläufe & Rennen",     why:"Natürliche Zutaten, niedriger GI-Stress.", link:AFF.mnstry("intensity-gel"), shop:"MNSTRY", price:"~CHF 3.50/Gel"},
      {id:"sn_mau_320",   form:"drink",  diet:"standard", timing:"waehrend", name:"Maurten Drink Mix 320",   dose:"80g / 500ml · 1 Flasche/h", when:"Ausfahrten über 2h",   why:"Höchste Kohlenhydratdichte ohne Magen-Probleme.", link:AFF.maurten("drink-mix-320"), shop:"Maurten", price:"~CHF 4.50/Port."},
      {id:"sn_sp_elek",   form:"drink",  diet:"standard", timing:"waehrend", name:"Sponser Elektrolyt-Tabs", dose:"1 Tab / 500ml",         when:"Ab 60 min Training",      why:"Natrium, Kalium, Magnesium — Krampfprävention.", link:AFF.sponser("elektrolyt tabletten"), shop:"Sponser", price:"~CHF 0.50/Tab"},
      {id:"sn_mn_carb",   form:"riegel", diet:"vegan",    timing:"vor",      name:"MNSTRY Fast Carb Bar",    dose:"1 Riegel 45 min vor Start", when:"Vor langen Einheiten", why:"Natürliches Carb-Loading — pflanzlich, magenfreundlich.", link:AFF.mnstry("fast-carb-heat"), shop:"MNSTRY", price:"~CHF 4.50/Riegel"},
      {id:"sn_sp_gel",    form:"gel",    diet:"standard", timing:"nach",     name:"Sponser Liquid Energy",   dose:"1 Beutel alle 45 min",  when:"Training & Rennen",       why:"Günstige Alternative mit gutem Kohlenhydratprofil.", link:AFF.sponser("liquid energy"), shop:"Sponser", price:"~CHF 2.20/Port."},
    ];

    const PROTEIN_PRODUKTE=[
      {id:"prot_whey",    form:"shake", diet:"standard", timing:"nach",  name:"Whey Protein Isolat",     dose:"25–30g post-workout",     when:"Innerhalb 30 min nach Training", why:"Schnellste Proteinquelle — maximale Muskelreparatur.", link:AFF.myprotein("whey protein isolate"), shop:"Myprotein", price:"~CHF 1.50/Port."},
      {id:"prot_esn",     form:"shake", diet:"standard", timing:"nach",  name:"ESN Designer Whey",       dose:"25–30g post-workout",     when:"Direkt nach Training",           why:"Marktführer in DACH — hochwertige Zutaten, viele Geschmäcker.", link:AFF.esn("designer-whey-protein"), shop:"ESN", price:"~CHF 1.20/Port."},
      {id:"prot_more",    form:"shake", diet:"standard", timing:"nach",  name:"More Nutrition Total Protein", dose:"25g post-workout",  when:"Post-Workout & Snack",          why:"High-Protein, Low-Carb — ideal für Lifestyle-Athleten.", link:AFF.morenutrition("total-protein"), shop:"More Nutrition", price:"~CHF 1.30/Port."},
      {id:"prot_vegan",   form:"shake", diet:"vegan",    timing:"nach",  name:"Myprotein Vegan Protein", dose:"25g post-workout",        when:"Direkt nach Training",           why:"Erbsen + Reis — vollständiges Aminosäureprofil, pflanzlich.", link:AFF.myprotein("vegan protein blend"), shop:"Myprotein", price:"~CHF 1.40/Port."},
      {id:"prot_riegel",  form:"riegel",diet:"standard", timing:"nach",  name:"Protein Bar (Myprotein)", dose:"1 Riegel post-workout",   when:"Unterwegs / nach Training",      why:"Praktisch für unterwegs — 25g Protein ohne Schütteln.", link:AFF.myprotein("protein bar"), shop:"Myprotein", price:"~CHF 2.50/Riegel"},
      {id:"prot_casein",  form:"shake", diet:"standard", timing:"nacht", name:"Micellar Casein",         dose:"30g vor dem Schlafen",    when:"Abends vor dem Schlafen",        why:"Langsame Freisetzung — Muskelschutz über Nacht.", link:AFF.myprotein("micellar casein"), shop:"Myprotein", price:"~CHF 1.80/Port."},
    ];

    const RECOVERY_PRODUKTE=[
      {id:"rec_mg",       form:"kapsel", timing:"nacht", name:"Magnesium Bisglycinate",   dose:"300–400mg abends",        when:"Täglich vor dem Schlafen", why:"Beste Bioverfügbarkeit — Muskelentspannung, tiefer Schlaf.", link:AFF.iherb("magnesium bisglycinate"), shop:"iHerb", price:"~CHF 0.15/Tag"},
      {id:"rec_kolla",    form:"drink",  timing:"vor",   name:"Kollagen + Vitamin C",     dose:"10–15g vor Training",     when:"Täglich vor Einheit",      why:"Sehnen- und Gelenkschutz — besonders bei hohem Laufvolumen.", link:AFF.iherb("collagen vitamin c"), shop:"iHerb", price:"~CHF 0.60/Tag"},
      {id:"rec_tart",     form:"kapsel", timing:"nach",  name:"Tart Cherry Extrakt",      dose:"480mg täglich",           when:"Nach intensiven Einheiten", why:"Reduziert DOMS um bis zu 20% — natürliches Antioxidans.", link:AFF.iherb("tart cherry"), shop:"iHerb", price:"~CHF 0.40/Tag"},
      {id:"rec_omega",    form:"kapsel", timing:"vor",   name:"Omega-3 (EPA/DHA)",        dose:"2–3g täglich",            when:"Täglich zum Essen",        why:"Entzündungshemmend — verbessert HRV und Erholung.", link:AFF.iherb("omega 3 epa dha"), shop:"iHerb", price:"~CHF 0.30/Tag"},
      {id:"rec_ashwa",    form:"kapsel", timing:"nacht", name:"Ashwagandha KSM-66",       dose:"600mg täglich",           when:"Abends vor dem Schlafen",  why:"Senkt Cortisol — verbessert Schlaftiefe und Erholung.", link:AFF.iherb("ashwagandha ksm-66"), shop:"iHerb", price:"~CHF 0.50/Tag"},
      {id:"rec_vit_d",    form:"kapsel", timing:"vor",   name:"Vitamin D3 + K2",          dose:"2000–4000 IE täglich",    when:"Täglich zum Frühstück",    why:"Immunsystem, Knochen, Hormonstatus — 56% der Sportler mangelversorgt.", link:AFF.iherb("vitamin d3 k2"), shop:"iHerb", price:"~CHF 0.10/Tag"},
    ];

    const SC={"iHerb":{bg:"#2D7C2B",t:"#fff"},"Myprotein":{bg:"#CC0000",t:"#fff"},"Maurten":{bg:"#000",t:C.neon},"MNSTRY":{bg:"#0D0D1A",t:C.neon},"Sponser":{bg:"#003087",t:"#fff"},"ESN":{bg:"#1A1A2E",t:"#fff"},"More Nutrition":{bg:"#E8272A",t:"#fff"}};

    const getItems=()=>{
      let items = rubrik==="energie"?ENERGIE_PRODUKTE:rubrik==="protein"?PROTEIN_PRODUKTE:RECOVERY_PRODUKTE;
      // Filter by onboarding preference — only show what user likes (unless showAll)
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
    const activePrefFilter = rubrik==="energie"&&!prefEnergy.includes("egal")?`Gefiltert nach: ${prefEnergy.join(", ")}`
      :rubrik==="protein"&&!prefProtein.includes("egal")?`Gefiltert nach: ${prefProtein.join(", ")}`
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
            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:9,border:`1.5px solid ${value?C.black:"#E0E0E0"}`,background:value?C.black:"#fff",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .14s"}}>
            <span style={{fontSize:11,fontWeight:600,color:value?"#fff":"#888"}}>{selected?selected.label:label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={value?"#fff":"#AAA"} strokeWidth="2.5" strokeLinecap="round"><path d={isOpen?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/></svg>
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

    return (
      <div>
        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Sportnahrung</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:8}}>Auf deinen Sport und deine Intensität abgestimmt.</p>
        {activePrefFilter&&(
          <div style={{marginBottom:12,padding:"8px 12px",background:C.neonDim,borderRadius:8,border:`1px solid ${C.neon}`,fontSize:11,color:"#4A7000"}}>
            ✓ {activePrefFilter} — basierend auf deiner Präferenz
          </div>
        )}



        {/* Info */}
        <div style={{marginBottom:14,borderRadius:12,border:`1px solid ${C.g200}`,overflow:"hidden"}}>
          <div style={{background:C.g100,padding:"8px 14px",borderBottom:`1px solid ${C.g200}`,display:"flex",alignItems:"center",gap:6}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{fontSize:10,fontWeight:600,color:C.g600,letterSpacing:".04em",textTransform:"uppercase",fontFamily:"JetBrains Mono,monospace"}}>Hinweis</span>
          </div>
          <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:7}}>
            <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <span style={{fontSize:12,flexShrink:0}}>🩺</span>
              <span style={{fontSize:11,color:C.g600,lineHeight:1.6}}>TREYN AI-Empfehlungen sind keine medizinische Beratung. Inhaltsstoffe immer beim Hersteller prüfen. Bei Erkrankungen: Arzt konsultieren.</span>
            </div>
            <div style={{height:1,background:C.g100}}/>
            <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
              <span style={{fontSize:12,flexShrink:0}}>🤝</span>
              <span style={{fontSize:11,color:C.g600,lineHeight:1.6}}>Wir empfehlen alle verfügbaren Produkte für deine Performance — unabhängig von Listung oder Verlinkung.</span>
            </div>
          </div>
        </div>

        {/* 3 Rubriken */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:16}}>
          {RUBRIKEN.map(r=>(
            <button key={r.id} onClick={()=>{setRubrik(r.id);setFormPref(null);setTimingPref(null);setShowAll(false);}}
              style={{padding:"10px 8px",borderRadius:10,border:`1.5px solid ${rubrik===r.id?C.black:"#EBEBEB"}`,background:rubrik===r.id?C.black:"#fff",cursor:"pointer",fontFamily:"Inter,sans-serif",textAlign:"left",transition:"all .14s"}}>
              <div style={{fontSize:16,marginBottom:3}}>{r.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:rubrik===r.id?"#fff":C.black}}>{r.label}</div>
              <div style={{fontSize:10,color:rubrik===r.id?"rgba(255,255,255,.6)":"#AAA",lineHeight:1.4}}>{r.desc}</div>
            </button>
          ))}
        </div>

        {/* Präferenz-Filter — Dropdowns nebeneinander */}
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
              {showAll?"Alle Produkte anzeigen":`Nur deine Präferenz: ${prefEnergy.includes("egal")?prefProtein.join(", "):prefEnergy.join(", ")}`}
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {items.map((p,i)=>{
              const sc=SC[p.shop]||{bg:"#333",t:"#fff"};
              const owned=ownedSn.includes(p.id);
              return (
                <div key={p.id} style={{background:"#fff",borderRadius:12,border:"1px solid #EBEBEB",padding:"14px",boxShadow:"0 1px 4px rgba(0,0,0,.04)",display:"flex",flexDirection:"column"}}>
                  <div style={{flex:1,marginBottom:10}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.black,marginBottom:2,lineHeight:1.3}}>{p.name}</div>
                    <div style={{fontSize:10,color:"#AAA",fontFamily:"JetBrains Mono,monospace",marginBottom:4}}>{p.dose}</div>
                    <div style={{fontSize:11,color:"#888",marginBottom:4}}>{p.when}</div>
                    <div style={{fontSize:11,color:"#555",lineHeight:1.5}}>{p.why}</div>
                    {p.form&&getEnergyReason&&getEnergyReason(p.form)&&(
                      <div style={{marginTop:5,fontSize:10,color:"#4A7000",fontStyle:"italic"}}>{getEnergyReason(p.form)}</div>
                    )}
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid #F5F5F5",marginBottom:8}}>
                    <span style={{fontSize:11,fontWeight:500,color:"#333"}}>{p.price}</span>
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      style={{display:"inline-flex",alignItems:"center",gap:4,background:sc.bg,color:sc.t,padding:"5px 10px",borderRadius:7,fontSize:10,fontWeight:600,textDecoration:"none"}}>
                      {p.shop} ↗
                    </a>
                  </div>
                  <button onClick={()=>toggleOwnedSn(p.id)}
                    style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"7px",borderRadius:8,border:`1.5px solid ${owned?C.neon:"#E8E8E8"}`,background:owned?C.neon:"transparent",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .15s"}}>
                    {owned&&<svg width="11" height="11" viewBox="0 0 8 8" fill="none"><path d="M1 4l2.2 2.2L7 1.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    <span style={{fontSize:10,fontWeight:700,color:owned?"#000":"#888"}}>{owned?"Vorhanden / bestellt":"Ich habe das Produkt bereits"}</span>
                  </button>
                  {owned&&<div style={{marginTop:5,fontSize:10,color:"#4A7000",textAlign:"center"}}>Findest du in <strong>Deinen Plan</strong> — inkl. Tagesplan.</div>}
                </div>
              );
            })}
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
              style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${shopCat===c.id?C.black:C.g200}`,background:shopCat===c.id?C.neon:"transparent",color:shopCat===c.id?C.black:C.g600,fontSize:12,fontWeight:shopCat===c.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s"}}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {items.map((p,i)=>{
            const sc=SC[p.shop]||{bg:"#333",t:"#fff"};
            return (
              <div key={i} style={{background:"#fff",borderRadius:12,border:"1px solid #EBEBEB",padding:"12px 12px",boxShadow:"0 1px 4px rgba(0,0,0,.04)",display:"flex",flexDirection:"column"}}>
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

  // ── SUMMARY TAB ────────────────────────────────────────────────────────────
  const SummaryTab=()=>{
    const isMobile=useWindowWidth()<=768;
    const calc=calcPro(profilData,trainingData,sportData);
    const firstname=profilData?.firstname||"";
    const weight=parseFloat(profilData?.weight||75);
    const age=new Date().getFullYear()-(+profilData?.birthyear||1990);
    const localSports=sportData?.selectedSports||sports||[];
    const SPORT_NAMES={cycling_road:"Rennrad",cycling_gravel:"Gravel",cycling_mtb:"MTB",cycling_mtb_xc:"MTB XC",cycling_mtb_end:"MTB Enduro",cycling_mtb_dh:"MTB DH",run_road:"Strassenlauf",run_road_5k:"5–10km Lauf",run_road_hm:"Halbmarathon",run_road_m:"Marathon",run_road_ultra:"Ultra",run_trail:"Trail",run_trail_ultra:"Ultra Trail",triathlon:"Triathlon",tri_sprint:"Tri Sprint",tri_olympic:"Tri Olympic",tri_half:"70.3 Half",tri_full:"Ironman",swimming:"Schwimmen",swim_sprint:"Schwimmen Sprint",swim_open:"Open Water",football:"Fussball",icehockey:"Eishockey",hyrox:"Hyrox",krafttraining:"Krafttraining",crossfit:"CrossFit",powerlifting:"Powerlifting",ski_alpin:"Ski Alpin",ski_freeride:"Freeride",ski_touring:"Skitouren",snowboard:"Snowboard",langlauf_klassisch:"Langlauf",langlauf_skating:"Skating",biathlon:"Biathlon",tennis:"Tennis",padel:"Padel",basketball:"Basketball",kampfsport:"Kampfsport",handball:"Handball",volleyball:"Volleyball"};
    const sportNames=localSports.map(s=>SPORT_NAMES[s]||s).join(", ");
    const GOAL_LABEL={performance:"Leistung steigern",muscle:"Muskelaufbau",endurance:"Ausdauer verbessern",weightloss:"Gewicht reduzieren",health:"Gesundheit & Longevity",recovery:"Regeneration"}[calc.goal]||"";
    const TIME_LABEL={morning:"Morgentraining",midday:"Mittagstraining",afternoon:"Nachmittagstraining",evening:"Abendtraining"}[calc.primaryTrainingTime]||"Training";
    const STRESS_LABEL={1:"sehr niedrig",2:"niedrig",3:"mittel",4:"hoch",5:"sehr hoch"}[calc.stressLevel]||"mittel";
    const primaryDays=trainingData?.[primarySport]?.days||3;
    const isEndurance=localSports.some(s=>["cycling_road","cycling_gravel","cycling_mtb_xc","run_road","run_road_m","run_road_hm","run_road_ultra","run_trail","run_trail_ultra","triathlon","tri_full","tri_half","swimming","swim_open","langlauf_klassisch","langlauf_skating"].includes(s));

    // Personalized hero text
    const heroLines=(()=>{
      const lines=[];
      if(primaryDays>=5) lines.push(`Du trainierst in den <strong>oberen 10%</strong> — ${primaryDays} intensive Einheiten pro Woche auf ${localSports.length>1?"zwei der anspruchsvollsten Disziplinen":"einer der anspruchsvollsten Disziplinen"}.`);
      else if(primaryDays>=3) lines.push(`Du trainierst regelmässig — <strong>${primaryDays}× pro Woche</strong>, strukturiert und mit klarem Ziel.`);
      else lines.push(`Du trainierst ${primaryDays}× pro Woche — solide Basis mit Potenzial nach oben.`);
      if(calc.withTraining>3000) lines.push(`Dein Energiebedarf liegt <strong>weit über dem Durchschnitt</strong>. Die meisten Athleten in deiner Situation ernähren sich falsch — nicht weil sie es nicht wollen, sondern weil niemand ihnen die richtigen Zahlen gibt. <strong>Das ändern wir.</strong>`);
      else lines.push(`Dein Körper arbeitet hart. Ohne die richtigen Zahlen lässt du Leistung auf dem Tisch. <strong>Das ändern wir.</strong>`);
      return lines;
    })();

    // Warnings
    const WARNINGS=[];
    if(calc.stressLevel>=4) WARNINGS.push({text:`<strong>Stresslevel ${STRESS_LABEL} erkannt.</strong> Cortisol hemmt aktiv deine Regeneration und Muskelproteinsynthese. Das bremst dich mehr als jedes fehlende Supplement — Ashwagandha und erhöhtes Magnesium sind für dich jetzt besonders relevant.`});
    if(calc.needsCollagen&&(calc.injuries||[]).some(x=>x!=="none")) WARNINGS.push({text:`<strong>Gelenke & Sehnen.</strong> Bei deinen Beschwerden ist Kollagen + Vitamin C direkt vor dem Training wissenschaftlich belegt wirksam. 10–15g, 30 min vor der Einheit.`});
    if(calc.ironRisk&&calc.isFemale) WARNINGS.push({text:`<strong>Eisenbedarf erhöht.</strong> Sportlerinnen haben durch Menstruationsverlust und Sport-Hämolyse ein erhöhtes Risiko. Ferritin regelmässig testen — Zielwert: >50 µg/L.`});
    if(calc.sleep<7) WARNINGS.push({text:`<strong>Schlafdefizit erkannt (${calc.sleep}h).</strong> Unter 7h Schlaf erhöht Cortisol, hemmt Muskelproteinsynthese und verlängert Regenerationszeit. Dein wichtigster Hebel.`});

    // Tags from selected sports + training context
    const sportTags=localSports.slice(0,3).map(s=>SPORT_NAMES[s]||s);
    const contextTags=[`${primaryDays}×/Woche`,intensityLabel,TIME_LABEL];

    return (
      <div>
        {/* Progress */}
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".04em"}}>DEINE ANALYSE · BASIC</span>
            <span style={{fontSize:10,color:C.g400}}>30% sichtbar</span>
          </div>
          <div style={{height:3,background:C.g100,borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:"30%",background:C.neon,borderRadius:2}}/>
          </div>
        </div>

        {/* Hero */}
        <div style={{background:C.white,border:`0.5px solid ${C.g200}`,borderRadius:14,padding:"18px 18px 16px",marginBottom:8}}>
          <div style={{fontSize:18,fontWeight:600,color:C.black,letterSpacing:"-.03em",marginBottom:6}}>
            {firstname?`Hallo ${firstname}.`:"Deine Analyse."}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
            {sportTags.map(t=><span key={t} style={{display:"inline-flex",padding:"3px 10px",borderRadius:100,background:C.neon,color:C.black,fontSize:10,fontWeight:700,marginRight:2}}>{t}</span>)}
            {contextTags.map(t=><span key={t} style={{display:"inline-flex",padding:"3px 10px",borderRadius:100,background:C.g100,color:C.g600,fontSize:10,fontWeight:500,marginRight:2}}>{t}</span>)}
          </div>
          <div style={{fontSize:12,color:"#555",lineHeight:1.75}} dangerouslySetInnerHTML={{__html:heroLines.join(" ")}}/>
          <div style={{height:"0.5px",background:C.g100,margin:"12px 0"}}/>
          <div style={{display:"flex"}}>
            {[
              {v:calc.withTraining?.toLocaleString("de-CH")||"—",l:"kcal / Tag"},
              {v:`${calc.proteinMin||"—"}g`,l:"Protein"},
              {v:`${(calc.waterMl/1000).toFixed(1)}L`,l:"Wasser"},
              {v:`${calc.sleep||"—"}h`,l:"Schlaf"},
            ].map((s,i,arr)=>(
              <div key={s.l} style={{flex:1,textAlign:"center",borderLeft:i>0?`0.5px solid ${C.g100}`:"none"}}>
                <div style={{fontSize:15,fontWeight:700,color:C.black,letterSpacing:"-.02em"}}>{s.v}</div>
                <div style={{fontSize:9,color:C.g400,marginTop:1}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8,marginTop:16}}>Basisdaten — sichtbar</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          {[
            {label:"ENERGIEBEDARF",val:calc.withTraining?.toLocaleString("de-CH")||"—",unit:"kcal / Tag",hi:true},
            {label:"PROTEIN",val:`${calc.proteinMin||"—"}–${calc.proteinMax||"—"}g`,unit:"täglich",hi:true},
            {label:"WASSER",val:`${(calc.waterMl/1000).toFixed(1)}L`,unit:"täglich",hi:false},
            {label:"GRUNDUMSATZ",val:calc.bmr?.toLocaleString("de-CH")||"—",unit:"kcal Ruhe",hi:false},
          ].map(m=>(
            <div key={m.label} style={{background:m.hi?C.neon:C.white,border:`0.5px solid ${m.hi?C.neon:C.g200}`,borderRadius:12,padding:14}}>
              <div style={{fontSize:10,color:m.hi?"rgba(0,0,0,.45)":C.g400,marginBottom:4}}>{m.label}</div>
              <div style={{fontSize:20,fontWeight:700,color:C.black,letterSpacing:"-.03em",lineHeight:1}}>{m.val}</div>
              <div style={{fontSize:10,color:m.hi?"rgba(0,0,0,.4)":C.g400,marginTop:2}}>{m.unit}</div>
            </div>
          ))}
        </div>

        {/* 2 insights */}
        {[
          {title:"Energiebedarf",val:`${calc.withTraining?.toLocaleString("de-CH")||"—"} kcal`,text:`Basierend auf ${sportNames}, ${weight}kg und ${primaryDays}× Training. An harten Tagen steigt dein Bedarf auf ~${Math.round((calc.withTraining||3000)*1.1).toLocaleString("de-CH")} kcal — die meisten Athleten unterschätzen das um 400–600 kcal täglich.`},
          {title:"Proteinbedarf",val:`${calc.proteinMin||"—"}–${calc.proteinMax||"—"}g`,text:`Für "${GOAL_LABEL}" brauchst du 1.8–2.2g/kg täglich. Schützt deine Muskelmasse beim intensiven Training. Post-Workout Fenster: innerhalb 30 min nach der Einheit für maximale Proteinsynthese.`},
        ].map((ins,i)=>(
          <div key={i} style={{background:C.white,border:`0.5px solid ${C.g200}`,borderRadius:12,padding:"14px 16px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontSize:13,fontWeight:600,color:C.black}}>{ins.title}</div>
              <div style={{background:C.neon,color:C.black,fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:100,whiteSpace:"nowrap"}}>{ins.val}</div>
            </div>
            <div style={{fontSize:11,color:C.g600,lineHeight:1.65}}>{ins.text}</div>
          </div>
        ))}

        {/* Warnings */}
        {WARNINGS.map((w,i)=>(
          <div key={i} style={{background:"#FFFBF0",border:"0.5px solid #FFE082",borderRadius:10,padding:"11px 14px",marginBottom:8,display:"flex",gap:10}}>
            <div style={{fontSize:14,flexShrink:0}}>⚠</div>
            <div style={{fontSize:11,color:"#7D5A00",lineHeight:1.65}} dangerouslySetInnerHTML={{__html:w.text}}/>
          </div>
        ))}

        {/* Locked 2-col grid */}
        <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8,marginTop:16}}>Vollständige Analyse — gesperrt</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          {[
            {title:"Elektrolyte & Schweiss",rows:[{l:"Natrium/h",v:"████ mg"},{l:"Magnesium",v:"████ mg"},{l:"Schweiss/h",v:"█.█ L"}]},
            {title:"VO₂max & Zonen",rows:[{l:"VO₂max",v:"██ ml/kg"},{l:"Zone 2",v:"███ W"},{l:"Laktatschwelle",v:"███ bpm"}]},
            {title:"Carbs & Energie",rows:[{l:"Carbs/Stunde",v:"██–██ g"},{l:"Carbs/Tag",v:"████ g"},{l:"Pre-Workout",v:"██ g"}]},
            {title:"Supplement-Tagesplan",rows:[{l:"Morgens",v:"██████"},{l:"Pre-Workout",v:"██████"},{l:"Post-Workout",v:"██████"}]},
            {title:"Recovery & Schlaf",rows:[{l:"Magnesium Abends",v:"████ mg"},{l:"Ashwagandha",v:"████ mg"},{l:"HRV-Zielbereich",v:"██–██"}]},
            {title:"Wettkampf-Strategie",rows:[{l:"Carb-Loading",v:"████ g"},{l:"Race-Day Timing",v:"██████"},{l:"Koffein-Einsatz",v:"████ mg"}]},
          ].map((card,i)=>(
            <div key={i} style={{background:C.white,border:`0.5px solid ${C.g200}`,borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"11px 13px 8px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6}}>
                <div style={{fontSize:11,fontWeight:600,color:C.black,lineHeight:1.3}}>{card.title}</div>
                <div style={{fontSize:8,padding:"2px 6px",borderRadius:3,background:C.g100,color:C.g400,fontFamily:"JetBrains Mono,monospace",fontWeight:700,flexShrink:0}}>🔒 PRO</div>
              </div>
              <div style={{borderTop:`0.5px solid #F5F5F3`,padding:"8px 13px 10px",display:"flex",flexDirection:"column",gap:5}}>
                {card.rows.map((r,j)=>(
                  <div key={j} style={{display:"flex",flexDirection:"column",gap:1}}>
                    <div style={{fontSize:10,color:C.g200}}>{r.l}</div>
                    <div style={{fontSize:11,fontWeight:600,background:"#EFEFED",color:"transparent",borderRadius:3,padding:"0 3px",userSelect:"none",letterSpacing:".08em",display:"inline-block"}}>{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Supplement teaser */}
        <div style={{fontSize:10,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8,marginTop:16}}>Empfehlungen — gesperrt</div>
        {[
          {icon:"💊",title:"Supplements — 100% auf dich",sub:"Dosierungen & Timing exakt berechnet",more:"+ 6 weitere Empfehlungen für dich",rows:[{v:"████ ████████████"},{v:"█████ ████████████████"}]},
          {icon:"⚡",title:"Sportnahrung — präzise getimed",sub:"Gels, Drinks & Riegel mit exakten Intervallen",more:"+ Race-Day Ernährungsplan",rows:[{v:"██████████████████"},{v:"███████████████████████"}]},
        ].map((card,i)=>(
          <div key={i} style={{background:C.white,border:`0.5px solid ${C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:8}}>
            <div style={{padding:"12px 14px 10px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:28,height:28,borderRadius:7,background:C.g100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{card.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:C.black}}>{card.title}</div>
                <div style={{fontSize:10,color:C.g400,marginTop:1}}>{card.sub}</div>
              </div>
              <div style={{fontSize:8,padding:"2px 6px",borderRadius:3,background:C.g100,color:C.g400,fontFamily:"JetBrains Mono,monospace",fontWeight:700,flexShrink:0}}>🔒 PRO</div>
            </div>
            <div style={{borderTop:`0.5px solid #F5F5F3`}}>
              {card.rows.map((r,j)=>(
                <div key={j} style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`0.5px solid #F8F8F6`}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#E0E0DE",flexShrink:0}}/>
                    <div style={{fontSize:11,color:C.g200,userSelect:"none",letterSpacing:".02em"}}>{r.v}</div>
                  </div>
                  <div style={{fontSize:10,background:"#EFEFED",color:"transparent",borderRadius:3,padding:"1px 7px",userSelect:"none",letterSpacing:".06em"}}>████ mg</div>
                </div>
              ))}
            </div>
            <div style={{padding:"9px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",background:C.g100,borderTop:`0.5px solid ${C.g200}`}}>
              <div style={{fontSize:11,color:C.black,fontWeight:600}}>{card.more}</div>
              <div style={{fontSize:8,padding:"2px 7px",borderRadius:3,background:C.g200,color:C.g600,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>🔒 PRO</div>
            </div>
          </div>
        ))}

        {/* CTA acid */}
        <div style={{background:C.neon,borderRadius:16,padding:20,marginTop:8}}>
          <div style={{fontSize:10,fontWeight:700,color:"rgba(0,0,0,.4)",letterSpacing:".1em",fontFamily:"JetBrains Mono,monospace",marginBottom:8}}>BEREIT FÜR DIE VOLLSTÄNDIGE ANALYSE?</div>
          <div style={{fontSize:18,fontWeight:700,color:C.black,letterSpacing:"-.04em",lineHeight:1.2,marginBottom:8}}>Alles was du brauchst.<br/>Einmalig. Für 6 Monate.</div>
          <div style={{fontSize:11,color:"rgba(0,0,0,.55)",lineHeight:1.7,marginBottom:14}}>6 gesperrte Datenkarten, alle Supplement-Dosierungen, Sportnahrung mit exakten Intervallen und deine persönliche Race-Day-Strategie — 100% auf dein Gewicht, deine Sportart und deine Intensität berechnet.</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
            {["Elektrolyte, VO₂max & Kohlenhydrate/h","Supplement-Dosierungen & Tagesplan","Sportnahrung mit exakten Timing-Intervallen","Race-Day Strategie für deine Wettkämpfe","Kein Abo — einmalig, jederzeit erneuerbar"].map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:"rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.black,fontWeight:700,flexShrink:0}}>✓</div>
                <div style={{fontSize:12,color:"rgba(0,0,0,.7)"}}>{f}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:14}}>
            <div style={{fontSize:28,fontWeight:700,color:C.black,letterSpacing:"-.04em"}}>CHF 12.90</div>
            <div style={{fontSize:11,color:"rgba(0,0,0,.45)"}}>/ 6 Monate · CHF 2.15/Mt.</div>
          </div>
          <button onClick={onUpgrade} style={{width:"100%",padding:15,borderRadius:11,border:"none",background:C.black,color:C.neon,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif",letterSpacing:"-.01em",marginBottom:8}}>
            Jetzt PRO freischalten →
          </button>
          <button onClick={()=>setTab("verbrauch")} style={{width:"100%",padding:11,borderRadius:11,border:"1px solid rgba(0,0,0,.15)",background:"rgba(255,255,255,.4)",color:"rgba(0,0,0,.45)",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            Kostenlos weiter
          </button>
          <div style={{textAlign:"center",marginTop:10,fontSize:10,color:"rgba(0,0,0,.35)"}}>Kein Passwort · Kein Abo · Jederzeit erneuerbar</div>
        </div>
      </div>
    );
  };
  const VerbrauchTab=()=>{
    const isMobile=useWindowWidth()<=768;
    const [localTraining,setLocalTraining]=useState(()=>JSON.parse(JSON.stringify(trainingData||{})));
    React.useEffect(()=>{ if(trainingData&&Object.keys(trainingData).length>0) setLocalTraining(JSON.parse(JSON.stringify(trainingData))); },[JSON.stringify(trainingData)]);
    const [showEditor,setShowEditor]=useState(false);
    const INTENS=[["low","Leicht"],["medium","Mittel"],["high","Intensiv"],["competition","Wettkampf"]];
    const w=+profilData?.weight||75;
    const age=profilData?.birthyear?new Date().getFullYear()-+profilData.birthyear:30;
    const calc=calcPro(profilData,localTraining,sportData);
    if(!calc||!profilData||!trainingData) return (
      <div style={{padding:24,textAlign:"center"}}>
        <div style={{fontSize:14,color:C.g400,marginBottom:8}}>Daten werden geladen...</div>
        <div style={{fontSize:12,color:C.g300}}>Falls dies bestehen bleibt, bitte Seite neu laden.</div>
      </div>
    );
    // Safe accessors
    const safeNum=(v,fb=0)=>isNaN(+v)||v==null?fb:+v;
    const safeStr=(v,fb="—")=>v==null||v===undefined?fb:String(v);
    const bmr=safeNum(calc.bmr,2000);
    const withTraining=safeNum(calc.withTraining,2500);
    const proteinMin=safeNum(calc.proteinMin,Math.round((+profilData?.weight||75)*1.4));
    const proteinMax=safeNum(calc.proteinMax,Math.round((+profilData?.weight||75)*1.8));
    const carbsG=safeNum(calc.carbsG,Math.round(withTraining*0.5/4));
    const waterMl=safeNum(calc.waterMl,2500);
    const natriumMg=safeNum(calc.natriumMg,1500);
    const magnesiumMg=safeNum(calc.magnesiumMg,350);
    const sweatL=safeNum(calc.sweatLitresPerSession,0.8);
    const totalDays=Object.values(localTraining).reduce((s,d)=>s+(d.days||0),0);
    const totalMin=Object.values(localTraining).reduce((s,d)=>s+(d.days||0)*(d.duration||60),0);

    const Pill=({label,active,onClick})=>(
      <button onClick={onClick} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${active?C.black:C.g200}`,background:active?C.neon:"transparent",color:active?C.black:C.g600,fontSize:11,fontWeight:active?500:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .12s",whiteSpace:"nowrap"}}>
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
            <button onClick={onUpgrade} style={{marginLeft:"auto",fontSize:9,padding:"2px 6px",borderRadius:4,background:C.neon,color:C.black,border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:600}}>PRO →</button>
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

        {/* ── AI SUMMARY ── */}
        {(()=>{
          const AISummary=()=>{
            const [summary,setSummary]=React.useState("");
            const [loading,setLoading]=React.useState(false);
            const [loaded,setLoaded]=React.useState(false);

            const generate=async()=>{
              if(loaded) return;
              setLoading(true);
              const sportsText=(sports||[]).map(id=>{
                const d=localTraining[id]||{};
                return `${id}: ${d.days||3}x/Wo, ${d.duration||60}min, Intensität ${d.intensity||"medium"}`;
              }).join("; ");
              const prompt=`Du bist TREYN AI, ein präziser Sportnutrition-Coach. Bewerte diese Trainingsdaten kurz und direkt auf Deutsch (3-4 Sätze, kein Markdown, keine Aufzählung):

Sportler: ${profilData?.gender==="f"?"weiblich":"männlich"}, ${new Date().getFullYear()-(+profilData?.birthyear||1990)} Jahre, ${profilData?.weight||75}kg, ${profilData?.height||175}cm
Training: ${sportsText}
Grundumsatz: ${calc.bmr} kcal, Tagesbedarf mit Training: ${calc.withTraining} kcal
Protein: ${calc.protein}g/Tag, Kohlenhydrate: ${calc.carbs}g/Tag

Sag dem Sportler direkt wie gut sein Trainingsvolumen ist, ob die Energiezufuhr reicht, und gib einen konkreten Tipp. Persönlich und motivierend, nicht technisch.`;

              try{
                const res=await fetch("https://api.anthropic.com/v1/messages",{
                  method:"POST",
                  headers:{"Content-Type":"application/json"},
                  body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})
                });
                const data=await res.json();
                const text=data.content?.[0]?.text||"";
                setSummary(text);
                setLoaded(true);
              }catch(e){
                setSummary("Analyse konnte nicht geladen werden. Bitte versuche es erneut.");
              }
              setLoading(false);
            };

            React.useEffect(()=>{ generate(); },[]);

            return (
              <div style={{borderRadius:14,border:`1px solid ${C.neonBorder||"#E0FF80"}`,background:C.neonDim,padding:"18px 20px",marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:loading?"#CCC":C.neon,transition:"background .3s"}}/>
                    <span style={{fontSize:11,fontWeight:700,color:"#4A7000",fontFamily:"JetBrains Mono,monospace",letterSpacing:".04em"}}>TREYN AI · DEINE ANALYSE</span>
                  </div>
                  {loaded&&<button onClick={()=>{setLoaded(false);setSummary("");generate();}} style={{background:"none",border:"none",fontSize:10,color:"#AAA",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>↺ Neu</button>}
                </div>
                {loading&&(
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
          };
          return <AISummary/>;
        })()}

        {/* ── ENERGIE ── */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Energie</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <M label="Grundumsatz" value={bmr.toLocaleString("de-CH")} unit="kcal" sub="täglich, ohne Training" desc="Kalorien die dein Körper in Ruhe verbraucht — Atmung, Herzschlag, Organe. Basis für alle Berechnungen." accent/>
          <M label={isPro?"Tagesbedarf (Training)":"Mit Training (Schätzung)"} value={withTraining.toLocaleString("de-CH")} unit="kcal" sub={isPro?"MET-basiert · ±8%":"Schätzung · ±25%"} desc={isPro?"Dein gesamter Tagesbedarf an Trainingstagen. Berechnet via MET-Werte für jede Sportart.":"Geschätzter Tagesbedarf mit Training. Upgrade auf PRO für sportartspezifische Genauigkeit."}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)",gap:8,marginBottom:20}}>
          <M label="Kaloriendefizit Training" value={(withTraining-bmr||0).toLocaleString("de-CH")} unit="kcal" desc="Zusätzliche Kalorien die du durch Training verbrennst. Musst du täglich ersetzen."/>
          <M label="Training / Woche" value={totalDays} unit="×" sub={`${Math.round(totalMin/60)}h total`} desc="Deine gesamten Trainingseinheiten pro Woche über alle Sportarten."/>
          <M label="Kcal / Monat (Training)" value={((withTraining-bmr||0)*totalDays*4).toLocaleString("de-CH")} unit="kcal" desc="Hochgerechneter Kalorienverbrauch durch Training pro Monat."/>
        </div>

        {/* ── MAKROS ── */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Makronährstoffe</div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)",gap:8,marginBottom:20}}>
          <M label="Protein / Tag" value={isPro?`${proteinMin}–${proteinMax}`:`${Math.round(w*1.4)}–${Math.round(w*1.8)}`} unit="g" sub={isPro?"exakt":"Schätzwert"} desc="Eiweissbedarf für Muskelaufbau und -erhalt. Besonders wichtig bei Kraft- und Ausdauersport."/>
          <M label="Kohlenhydrate / Tag" value={isPro?`${carbsG}`:`${Math.round(withTraining*0.45/4)}–${Math.round(withTraining*0.55/4)}`} unit="g" sub={isPro?"exakt":"Schätzwert"} desc="Primärer Energielieferant für intensive Trainings. Füllt deine Glykogenspeicher."/>
          <M label="Fett / Tag" value={Math.round(withTraining*0.25/9)} unit="g" sub="~25% Kalorien" desc="Wichtig für Hormonsynthese, fettlösliche Vitamine und Langzeitenergie."/>
        </div>

        {/* ── ELEKTROLYTE ── */}
        <BlurGate isPro={isPro} onUpgrade={onUpgrade} label="Elektrolyte & Hydration">
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Elektrolyte & Flüssigkeit</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:8}}>
          <M label="Natrium-Verlust / Tag" value={isPro?natriumMg.toLocaleString("de-CH"):"—"} unit={isPro?"mg":""} locked={!isPro} desc="Natrium verlierst du hauptsächlich durch Schweiss. Zu wenig führt zu Krämpfen und Leistungseinbruch."/>
          <M label="Magnesium-Bedarf / Tag" value={isPro?magnesiumMg:"—"} unit={isPro?"mg":""} locked={!isPro} desc="Magnesium ist essenziell für Muskelkontraktion und Regeneration. Sportler verlieren mehr als Nichtsportler."/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:20}}>
          <M label="Wasserverbrauch / Tag" value={isPro?(Math.round(waterMl/100)/10):"—"} unit={isPro?"L":""} locked={!isPro} desc="Dein persönlicher Wasserbedarf inkl. Trainingszuschlag. Sportler brauchen deutlich mehr als der Richtwert von 2L."/>
          <M label="Schweiss / Session" value={isPro?sweatL:"—"} unit={isPro?"L":""} locked={!isPro} desc="Geschätzter Schweissverlust pro Trainingseinheit — wichtig für die richtige Flüssigkeitszufuhr während dem Sport."/>
        </div>

        </BlurGate>
        <BlurGate isPro={isPro} onUpgrade={onUpgrade} label="Leistungszonen & VO₂max">
        {/* ── LEISTUNGSZONEN ── */}
        <div style={{fontSize:11,color:"#AAA",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Leistung & Herzfrequenz-Zonen</div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":isPro&&calc.vo2max?"repeat(4,1fr)":"repeat(3,1fr)",gap:8,marginBottom:20}}>
          <M label="Max. Herzfrequenz" value={220-age} unit="bpm" desc="Deine theoretische maximale Herzfrequenz. Basis für alle Trainingszonenbergechnungen (220 – Alter)."/>
          <M label="Fettverbrennungszone" value={`${Math.round((220-age)*.60)}–${Math.round((220-age)*.70)}`} unit="bpm" desc="In dieser Zone verbrennt dein Körper anteilsmässig am meisten Fett. Ideal für lange, ruhige Ausdauereinheiten."/>
          <M label="Ausdauerzone" value={`${Math.round((220-age)*.70)}–${Math.round((220-age)*.80)}`} unit="bpm" desc="Typische Zone für Grundlagenausdauer. Fordert das Herz-Kreislauf-System ohne zu überlasten."/>
          {isPro&&calc.vo2max&&(
            <M label="VO₂max (geschätzt)" value={calc.vo2max} unit="ml/kg/min" sub={calc.vo2maxLabel} desc="Maximale Sauerstoffaufnahme — der wichtigste Wert für Ausdauerleistung. Geschätzt via Uth-Sørensen Formel." accent/>
          )}
        </div>

        </BlurGate>
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

        {/* ── SUPPLEMENT TIMING ── */}
        {timingRecs?.note&&(
          <div style={{marginBottom:20,padding:"14px 16px",borderRadius:12,background:C.neonDim,border:`1px solid ${C.neon}`}}>
            <div style={{fontSize:10,color:"#4A7000",fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",marginBottom:8}}>SUPPLEMENT-TIMING FÜR DICH · {({morning:"MORGENTRAINING",midday:"MITTAGSTRAINING",afternoon:"NACHMITTAGSTRAINING",evening:"ABENDTRAINING"})[calc?.primaryTrainingTime]||"DEIN TRAINING"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
              {[
                {l:"Pre-Workout",v:timingRecs.preWorkout},
                {l:"Post-Workout",v:timingRecs.postWorkout},
                {l:"Kreatin",v:timingRecs.creatine},
              ].map(({l,v},i)=>v&&(
                <div key={i} style={{background:"rgba(0,0,0,.04)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.black,marginBottom:2}}>{v}</div>
                  <div style={{fontSize:10,color:"#4A7000"}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,color:"#2D4A00",lineHeight:1.5}}>{timingRecs.note}</div>
          </div>
        )}

        {/* ── WOCHENSUMMARY ── */}
        <div style={{padding:"14px 16px",background:"#FAFAFA",borderRadius:11,border:"1px solid #EBEBEB",display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)",gap:12,marginBottom:24,textAlign:"center"}}>
          {[
            {l:"Training / Woche",v:`${totalDays}×`,s:`${Math.round(totalMin/60)} Stunden`},
            {l:"Kcal / Woche",v:((withTraining-bmr)*totalDays).toLocaleString("de-CH"),s:"durch Training"},
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
            <button onClick={onUpgrade} style={{background:"#0A0A0A",color:"#fff",border:"none",borderRadius:9,padding:"9px 14px",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"Inter,sans-serif",flexShrink:0}}>PRO · CHF 12.90 / 6 Mt.</button>
          </div>
        )}
      </div>
    );
  };

  // ── CART TAB ───────────────────────────────────────────────────────────────
  const CartTab=()=>{
    const [cart,setCart]=useState(()=>{
      try{ return JSON.parse(localStorage.getItem("treyn_cart")||"[]"); }catch{ return []; }
    });

    // Collect ALL products from supplements + nutrition + recovery with shop info
    const ALL_PRODUCTS=[
      // Basis Supplements
      ...([...primSupps,...secSupps]).map(s=>({id:s.id,name:s.name,dose:s.dose,shop:s.shop||"iHerb",link:s.link,category:"Supplement",price:s.price||""})),
      // Nutrition
      ...[
        {id:"sn_mau_gel",name:"Maurten Gel 100",dose:"1 Gel alle 30–40 min",shop:"Maurten",link:AFF.maurten("gel-100-box"),category:"Sportnahrung",price:"~CHF 3.80"},
        {id:"sn_mau_320",name:"Maurten Drink Mix 320",dose:"80g/500ml",shop:"Maurten",link:AFF.maurten("drink-mix-320"),category:"Sportnahrung",price:"~CHF 4.50"},
        {id:"sn_mau_caf",name:"Maurten Gel 100 CAF",dose:"1 Gel alle 40–45 min",shop:"Maurten",link:AFF.maurten("gel-100-caf-100"),category:"Sportnahrung",price:"~CHF 4.00"},
        {id:"sn_mn_gel",name:"MNSTRY Intensity Gel",dose:"1 Gel alle 30–45 min",shop:"MNSTRY",link:AFF.mnstry("intensity-gel"),category:"Sportnahrung",price:"~CHF 3.50"},
        {id:"sn_sp_elek",name:"Sponser Elektrolyt-Tabs",dose:"1 Tab/500ml",shop:"Sponser",link:AFF.sponser("elektrolyt tabletten"),category:"Sportnahrung",price:"~CHF 0.50"},
        {id:"prot_whey",name:"Whey Protein Isolat",dose:"25–30g post-workout",shop:"Myprotein",link:AFF.myprotein("whey protein isolate"),category:"Protein",price:"~CHF 1.50"},
        {id:"prot_esn",name:"ESN Designer Whey",dose:"25–30g post-workout",shop:"ESN",link:AFF.esn("designer-whey-protein"),category:"Protein",price:"~CHF 1.20"},
        {id:"prot_more",name:"More Nutrition Total Protein",dose:"25g post-workout",shop:"More Nutrition",link:AFF.morenutrition("total-protein"),category:"Protein",price:"~CHF 1.30"},
        {id:"prot_vegan",name:"Myprotein Vegan Protein",dose:"25g post-workout",shop:"Myprotein",link:AFF.myprotein("vegan protein blend"),category:"Protein",price:"~CHF 1.40"},
        {id:"prot_casein",name:"Micellar Casein",dose:"30g vor dem Schlafen",shop:"Myprotein",link:AFF.myprotein("micellar casein"),category:"Protein",price:"~CHF 1.80"},
        {id:"rec_mg",name:"Magnesium Bisglycinate",dose:"300–400mg abends",shop:"iHerb",link:AFF.iherb("magnesium bisglycinate"),category:"Recovery",price:"~CHF 0.15"},
        {id:"rec_kolla",name:"Kollagen + Vitamin C",dose:"10–15g vor Training",shop:"iHerb",link:AFF.iherb("collagen vitamin c"),category:"Recovery",price:"~CHF 0.60"},
        {id:"rec_tart",name:"Tart Cherry Extrakt",dose:"480mg täglich",shop:"iHerb",link:AFF.iherb("tart cherry"),category:"Recovery",price:"~CHF 0.40"},
        {id:"rec_omega",name:"Omega-3 (EPA/DHA)",dose:"2–3g täglich",shop:"iHerb",link:AFF.iherb("omega 3 epa dha"),category:"Recovery",price:"~CHF 0.30"},
        {id:"rec_ashwa",name:"Ashwagandha KSM-66",dose:"600mg täglich",shop:"iHerb",link:AFF.iherb("ashwagandha ksm-66"),category:"Recovery",price:"~CHF 0.50"},
        {id:"rec_vit_d",name:"Vitamin D3 + K2",dose:"2000–4000 IE täglich",shop:"iHerb",link:AFF.iherb("vitamin d3 k2"),category:"Recovery",price:"~CHF 0.10"},
      ],
      // Recovery Gear
      {id:"rec_therabody",name:"Therabody",dose:"",shop:"Therabody",link:"https://www.therabody.com/de-ch",category:"Recovery Gear",price:""},
      {id:"rec_hyperice",name:"Hyperice / Normatec",dose:"",shop:"Hyperice",link:"https://hyperice.com/",category:"Recovery Gear",price:""},
      {id:"rec_blackroll",name:"Blackroll",dose:"",shop:"Blackroll",link:"https://www.blackroll.com/ch-de",category:"Recovery Gear",price:""},
      {id:"rec_compex",name:"Compex",dose:"",shop:"Compex",link:"https://www.compex.com/ch-de",category:"Recovery Gear",price:""},
    ];

    const owned=JSON.parse(localStorage.getItem("treyn_owned")||"[]");
    const cartItems=ALL_PRODUCTS.filter(p=>owned.includes(p.id)||cart.includes(p.id));

    // Group by shop
    const byShop={};
    cartItems.forEach(p=>{
      if(!byShop[p.shop]) byShop[p.shop]={shop:p.shop,items:[],link:p.link};
      byShop[p.shop].items.push(p);
    });

    const SHOP_COLORS={"Maurten":{bg:"#000",t:"#C8FF00"},"MNSTRY":{bg:"#0D0D1A",t:"#C8FF00"},"iHerb":{bg:"#2D7C2B",t:"#fff"},"Myprotein":{bg:"#CC0000",t:"#fff"},"Sponser":{bg:"#003087",t:"#fff"},"ESN":{bg:"#1A1A2E",t:"#fff"},"More Nutrition":{bg:"#E8272A",t:"#fff"},"Therabody":{bg:"#1A1A1A",t:"#fff"},"Hyperice":{bg:"#0057FF",t:"#fff"},"Blackroll":{bg:"#000",t:"#fff"},"Compex":{bg:"#E31937",t:"#fff"}};

    // Build shop search URL
    const getShopUrl=(shop,items)=>{
      const q=encodeURIComponent(items.map(i=>i.name).join(" "));
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
      return urls[shop]||`https://www.galaxus.ch/de/s1/producttype/sport-ernaehrung-16?q=${q}`;
    };

    if(cartItems.length===0) return (
      <div>
        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Warenkorb</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:24,lineHeight:1.5}}>Alle markierten Produkte gesammelt — direkt zum Partnershop.</p>
        <div style={{padding:"32px 20px",textAlign:"center",background:"#FAFAFA",borderRadius:14,border:"1px solid #EBEBEB"}}>
          <div style={{fontSize:32,marginBottom:12}}>🛒</div>
          <div style={{fontSize:14,fontWeight:500,color:C.black,marginBottom:6}}>Noch keine Produkte im Warenkorb</div>
          <div style={{fontSize:12,color:"#AAA",lineHeight:1.6}}>Markiere Produkte bei Supplements, Sportnahrung oder Recovery mit "Ich habe das Produkt bereits" — sie erscheinen dann automatisch hier.</div>
        </div>
      </div>
    );

    return (
      <div>
        <h2 style={{fontSize:18,fontWeight:500,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Warenkorb</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.5}}>{cartItems.length} Produkte bei {Object.keys(byShop).length} Shops — direkt zur Bestellung.</p>

        {/* Info */}
        <div style={{marginBottom:16,padding:"10px 14px",background:C.neonDim,borderRadius:10,border:`1px solid ${C.neon}`,fontSize:11,color:"#4A7000",lineHeight:1.6}}>
          💡 Klicke auf "Zum Shop" um alle Produkte dieses Anbieters gesammelt zu bestellen. Die Suche wird mit allen Produktnamen vorausgefüllt.
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {Object.values(byShop).map((group,i)=>{
            const sc=SHOP_COLORS[group.shop]||{bg:"#333",t:"#fff"};
            const shopUrl=getShopUrl(group.shop,group.items);
            return (
              <div key={i} style={{borderRadius:14,border:"1px solid #EBEBEB",overflow:"hidden",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
                {/* Shop Header */}
                <div style={{background:sc.bg,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:14,fontWeight:700,color:sc.t,letterSpacing:"-.01em"}}>{group.shop}</span>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"rgba(255,255,255,.15)",color:sc.t,fontFamily:"JetBrains Mono,monospace"}}>{group.items.length} Produkte</span>
                  </div>
                  <a href={shopUrl} target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:5,background:"#C8FF00",color:"#000",padding:"7px 14px",borderRadius:8,fontSize:11,fontWeight:700,textDecoration:"none",flexShrink:0}}>
                    Zum Shop ↗
                  </a>
                </div>
                {/* Products */}
                <div>
                  {group.items.map((p,j)=>(
                    <div key={p.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:j<group.items.length-1?"1px solid #F5F5F5":"none"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:500,color:C.black}}>{p.name}</div>
                        <div style={{display:"flex",gap:6,marginTop:2}}>
                          {p.dose&&<span style={{fontSize:10,color:"#AAA",fontFamily:"JetBrains Mono,monospace"}}>{p.dose}</span>}
                          <span style={{fontSize:10,padding:"1px 6px",borderRadius:6,background:"#F5F5F5",color:"#888",fontFamily:"JetBrains Mono,monospace"}}>{p.category}</span>
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
          <button onClick={()=>{localStorage.setItem("treyn_owned","[]");window.location.reload();}}
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
              <span style={{fontSize:11,color:"#AAA",minWidth:80,flexShrink:0}}>{r.l}</span>
              <span style={{fontSize:11,color:C.black,lineHeight:1.5}}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div style={{marginTop:10,padding:"14px 16px",background:C.g100,borderRadius:12,border:`0.5px solid ${C.g200}`}}>
        <div style={{fontSize:11,fontWeight:600,color:C.g600,marginBottom:6,fontFamily:"JetBrains Mono,monospace",letterSpacing:".04em"}}>© {new Date().getFullYear()} TREYN+ · WBCS GmbH</div>
        <div style={{fontSize:11,color:C.g400,lineHeight:1.7}}>
          Alle Inhalte, Berechnungsmodelle, Algorithmen, Texte und das Design dieser Plattform sind urheberrechtlich geschützt. Jede Vervielfältigung, Nachahmung oder Nutzung — auch auszugsweise oder durch KI-gestützte Tools — ohne ausdrückliche schriftliche Genehmigung der WBCS GmbH ist untersagt. Zuwiderhandlungen werden zivilrechtlich verfolgt.
        </div>
        <div style={{marginTop:10,paddingTop:10,borderTop:`0.5px solid ${C.g200}`,fontSize:10,color:C.g300}}>
          Verstösse melden: info@treyn.ch
        </div>
      </div>
    </div>
  );

  // ── PROFIL TAB ─────────────────────────────────────────────────────────────
  const ProfilTab=()=>{
    const [orders]=useState(()=>{ try{ return parseInt(localStorage.getItem("treyn_orders")||"0"); }catch{ return 0; } });
    const [showPersonal,setShowPersonal]=useState(false);
    const [editMode,setEditMode]=useState(false);
    const [editForm,setEditForm]=useState({
      weight: profilData?.weight||"",
      height: profilData?.height||"",
      sleep:  profilData?.sleep||"",
      rhr:    profilData?.rhr||"",
      stressLevel:    profilData?.stressLevel||3,
      dietQuality:    profilData?.dietQuality||"good",
      altitude:       profilData?.altitude||"low",
      recoveryStatus: profilData?.recoveryStatus||"good",
      currentSupps:   profilData?.currentSupps||[],
      medications:    profilData?.medications||[],
      monthlyBudget:  profilData?.monthlyBudget||"medium",
      goal:           profilData?.goal||"performance",
    });
    const setEF=(k,v)=>setEditForm(f=>({...f,[k]:v}));
    const toggleEFArr=(k,v)=>setEditForm(f=>{
      const curr=(f[k]||[]).filter(x=>x!=="none");
      if(v==="none") return {...f,[k]:["none"]};
      return {...f,[k]:curr.includes(v)?curr.filter(x=>x!==v):[...curr,v]};
    });
    const saveEdit=()=>{
      // Merge edits back into profilData (mutate ref - parent would need callback for persistence)
      Object.assign(profilData,editForm);
      setEditMode(false);
    };

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

        {/* Profil bearbeiten */}
        <div style={{border:`1px solid ${editMode?C.neon:C.g200}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
          <button onClick={()=>setShowPersonal(p=>!p)}
            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:editMode?C.neonDim:C.g100,border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
            <span style={{fontSize:11,fontWeight:600,color:C.black}}>Profil & Angaben</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {!editMode&&<button onClick={e=>{e.stopPropagation();setEditMode(true);setShowPersonal(true);}}
                style={{fontSize:10,padding:"3px 10px",borderRadius:6,background:C.black,color:C.white,border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:500}}>Bearbeiten</button>}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g400} strokeWidth="2" strokeLinecap="round">
                <path d={showPersonal?"M18 15l-6-6-6 6":"M6 9l6 6 6-6"}/>
              </svg>
            </div>
          </button>
          {showPersonal&&(
            <div style={{padding:"14px 16px"}}>
              {/* Static read-only: name, email, country, gender */}
              {[
                {l:"Name",v:`${profilData?.firstname||""} ${profilData?.lastname||""}`.trim()||"—"},
                {l:"E-Mail",v:profilData?.email||"—"},
                {l:"Herkunft",v:profilData?.country||"—"},
                {l:"Geschlecht",v:{m:"Männlich",f:"Weiblich"}[profilData?.gender]||"—"},
              ].map((r,i)=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.g100}`}}>
                  <span style={{fontSize:12,color:C.g600}}>{r.l}</span>
                  <span style={{fontSize:12,fontWeight:500,color:C.black}}>{r.v}</span>
                </div>
              ))}

              {/* Editable fields */}
              {!editMode?(
                // Read-only view of editable fields
                <div style={{marginTop:8}}>
                  {[
                    {l:"Gewicht",v:profilData?.weight?`${profilData.weight} kg`:"—"},
                    {l:"Grösse",v:profilData?.height?`${profilData.height} cm`:"—"},
                    {l:"Schlaf",v:profilData?.sleep?`${profilData.sleep}h/Nacht`:"—"},
                    {l:"Ruhepuls",v:profilData?.rhr?`${profilData.rhr} bpm`:"—"},
                    {l:"Ziel",v:{performance:"Leistung",muscle:"Muskelaufbau",endurance:"Ausdauer",weightloss:"Gewicht",health:"Gesundheit",recovery:"Regeneration"}[profilData?.goal]||"—"},
                    {l:"Stresslevel",v:{1:"Sehr niedrig",2:"Niedrig",3:"Mittel",4:"Hoch",5:"Sehr hoch"}[profilData?.stressLevel]||"—"},
                    {l:"Ernährung",v:{excellent:"Sehr ausgewogen",good:"Gut",average:"Durchschnittlich",poor:"Verbesserungswürdig"}[profilData?.dietQuality]||"—"},
                    {l:"Höhe",v:{low:"0–500m",medium:"500–1500m",high:"1500–2500m",alpine:"2500m+"}[profilData?.altitude]||"—"},
                    {l:"Erholungsstatus",v:{excellent:"Top-Form",good:"Normal",tired:"Müde / überlastet",recovery:"Verletzung / Pause"}[profilData?.recoveryStatus]||"—"},
                    {l:"Budget / Monat",v:{low:"< CHF 30",medium:"CHF 30–80",high:"CHF 80–150",max:"CHF 150+"}[profilData?.monthlyBudget]||"—"},
                    {l:"Aktuelle Supplements",v:(profilData?.currentSupps||[]).includes("none")||!(profilData?.currentSupps||[]).length?"Keine":(profilData?.currentSupps||[]).join(", ")},
                    {l:"Medikamente",v:(profilData?.medications||[]).includes("none")||!(profilData?.medications||[]).length?"Keine":(profilData?.medications||[]).map(m=>({blutverd:"Blutverdünner",schilddruese:"Schilddrüse",blutdruck:"Blutdruck"}[m]||m)).join(", ")},
                  ].map((r,i,arr)=>(
                    <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<arr.length-1?`1px solid ${C.g100}`:"none"}}>
                      <span style={{fontSize:12,color:C.g600}}>{r.l}</span>
                      <span style={{fontSize:12,fontWeight:500,color:C.black,textAlign:"right",maxWidth:"60%"}}>{r.v}</span>
                    </div>
                  ))}
                </div>
              ):(
                // Edit mode
                <div style={{marginTop:12}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    {[{k:"weight",l:"Gewicht (kg)",ph:"100"},{k:"height",l:"Grösse (cm)",ph:"185"},{k:"sleep",l:"Schlaf (h)",ph:"7.5"},{k:"rhr",l:"Ruhepuls (bpm)",ph:"52"}].map(f=>(
                      <div key={f.k}>
                        <div style={{fontSize:11,color:C.g600,marginBottom:4}}>{f.l}</div>
                        <input type="number" value={editForm[f.k]} onChange={e=>setEF(f.k,e.target.value)} placeholder={f.ph}
                          style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${editForm[f.k]?C.neon:C.g200}`,borderRadius:9,fontSize:13,fontFamily:"Inter,sans-serif",background:editForm[f.k]?C.neonDim:C.white}}/>
                      </div>
                    ))}
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
                          style={{flex:1,padding:"6px 2px",borderRadius:8,border:`1.5px solid ${editForm.stressLevel===o.id?C.neon:C.g200}`,background:editForm.stressLevel===o.id?C.neonDim:C.white,fontSize:9,fontWeight:editForm.stressLevel===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ernährungsqualität */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Ernährung</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {[{id:"excellent",l:"Sehr ausgewogen"},{id:"good",l:"Gut"},{id:"average",l:"Durchschnittlich"},{id:"poor",l:"Verbesserungswürdig"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("dietQuality",o.id)}
                          style={{padding:"7px 10px",borderRadius:8,border:`1.5px solid ${editForm.dietQuality===o.id?C.neon:C.g200}`,background:editForm.dietQuality===o.id?C.neonDim:C.white,fontSize:11,fontWeight:editForm.dietQuality===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Erholungsstatus */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Erholungsstatus</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {[{id:"excellent",l:"Top-Form"},{id:"good",l:"Normal"},{id:"tired",l:"Müde / überlastet"},{id:"recovery",l:"Verletzung / Pause"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("recoveryStatus",o.id)}
                          style={{padding:"7px 10px",borderRadius:8,border:`1.5px solid ${editForm.recoveryStatus===o.id?C.neon:C.g200}`,background:editForm.recoveryStatus===o.id?C.neonDim:C.white,fontSize:11,fontWeight:editForm.recoveryStatus===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Höhe */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Trainings-Höhe</div>
                    <div style={{display:"flex",gap:6}}>
                      {[{id:"low",l:"0–500m"},{id:"medium",l:"500–1500m"},{id:"high",l:"1500–2500m"},{id:"alpine",l:"2500m+"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("altitude",o.id)}
                          style={{flex:1,padding:"6px 2px",borderRadius:8,border:`1.5px solid ${editForm.altitude===o.id?C.neon:C.g200}`,background:editForm.altitude===o.id?C.neonDim:C.white,fontSize:10,fontWeight:editForm.altitude===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Monatliches Budget</div>
                    <div style={{display:"flex",gap:6}}>
                      {[{id:"low",l:"< CHF 30"},{id:"medium",l:"CHF 30–80"},{id:"high",l:"CHF 80–150"},{id:"max",l:"CHF 150+"}].map(o=>(
                        <button key={o.id} onClick={()=>setEF("monthlyBudget",o.id)}
                          style={{flex:1,padding:"6px 2px",borderRadius:8,border:`1.5px solid ${editForm.monthlyBudget===o.id?C.neon:C.g200}`,background:editForm.monthlyBudget===o.id?C.neonDim:C.white,fontSize:10,fontWeight:editForm.monthlyBudget===o.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black,textAlign:"center"}}>
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aktuelle Supplements */}
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Aktuelle Supplements</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {["none","kreatin","protein","vitd","omega3","magnesium","koffein","eisen","zink","ashwa","collagen","beta_ala"].map(id=>{
                        const labels={none:"Keine",kreatin:"Kreatin",protein:"Protein/Whey",vitd:"Vit. D",omega3:"Omega-3",magnesium:"Magnesium",koffein:"Koffein",eisen:"Eisen",zink:"Zink",ashwa:"Ashwagandha",collagen:"Kollagen",beta_ala:"Beta-Alanin"};
                        const on=(editForm.currentSupps||[]).includes(id);
                        return <button key={id} onClick={()=>toggleEFArr("currentSupps",id)}
                          style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${on?C.neon:C.g200}`,background:on?C.neonDim:C.white,fontSize:11,fontWeight:on?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black}}>
                          {labels[id]}
                        </button>;
                      })}
                    </div>
                  </div>

                  {/* Medikamente */}
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:11,color:C.g600,marginBottom:6}}>Medikamente</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {[{id:"none",l:"Keine"},{id:"blutverd",l:"Blutverdünner"},{id:"schilddruese",l:"Schilddrüse"},{id:"blutdruck",l:"Blutdruck"}].map(o=>{
                        const on=(editForm.medications||[]).includes(o.id);
                        return <button key={o.id} onClick={()=>toggleEFArr("medications",o.id)}
                          style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${on?C.neon:C.g200}`,background:on?C.neonDim:C.white,fontSize:11,fontWeight:on?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.black}}>
                          {o.l}
                        </button>;
                      })}
                    </div>
                  </div>

                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setEditMode(false)}
                      style={{flex:1,padding:"10px",borderRadius:9,border:`1px solid ${C.g200}`,background:C.white,fontSize:12,cursor:"pointer",fontFamily:"Inter,sans-serif",color:C.g600}}>
                      Abbrechen
                    </button>
                    <button onClick={saveEdit}
                      style={{flex:2,padding:"10px",borderRadius:9,border:"none",background:C.black,color:C.neon,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
                      Speichern & neu berechnen
                    </button>
                  </div>
                </div>
              )}
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
              <div style={{fontSize:11,color:C.g600}}>{isPro?"6 Monate · Aktiv":"Pauschalberechnungen · Kostenlos"}</div>
            </div>
            <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:isPro?C.black:"#F0F0F0",color:isPro?C.neon:"#888",fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>{isPro?"PRO":"BASIC"}</span>
          </div>
          {!isPro&&(
            <button onClick={onUpgrade}
              style={{width:"100%",background:C.black,color:C.neon,border:"none",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
              Upgrade auf PRO — CHF 12.90 / 6 Monate
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

  const EmpfehlungenTab=()=>{
    const isMobile=useWindowWidth()<=768;
    const [subTab,setSubTab]=useState("supplements");
    const prefSupp=praeferenzenData?.suppForm||"beides";
    const SUB=[
      {id:"supplements",l:"Supplements"},
      {id:"nahrung",l:"Sportnahrung"},
      {id:"mahlzeiten",l:"Mahlzeiten"},
      {id:"hydration",l:"Hydration"},
      {id:"recovery",l:"Recovery Gear"},
      {id:"wearables",l:"Wearables"},
    ];
    return (
      <div>
        <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Empfehlungen</h2>
        <p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.6}}>100% auf deine Daten berechnet — Supplements, Sportnahrung, Mahlzeiten & Recovery.</p>
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          {SUB.map(s=>(
            <button key={s.id} onClick={()=>setSubTab(s.id)}
              style={{padding:"6px 16px",borderRadius:100,border:`1.5px solid ${subTab===s.id?C.black:C.g200}`,background:subTab===s.id?C.neon:C.white,color:C.black,fontSize:12,fontWeight:subTab===s.id?600:400,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .13s"}}>
              {s.l}
            </button>
          ))}
        </div>
        {subTab==="supplements"&&(
          <div>
            <p style={{fontSize:12,color:C.g600,marginBottom:12}}>{isPro?"Sport-spezifisch priorisiert nach deinen Berechnungen.":"Empfohlen für deinen Sport und deine Intensität."}</p>
            {prefSupp!=="beides"&&(<div style={{marginBottom:10,padding:"8px 12px",background:C.neonDim,borderRadius:8,border:`1px solid ${C.neon}`,fontSize:11,color:"#4A7000",display:"flex",alignItems:"center",gap:6}}><span>✓</span> Nur <strong>{prefSupp==="kapsel"?"Kapseln / Tabletten":"Pulver"}</strong> — basierend auf deiner Präferenz.</div>)}
            <SupplementsContent isPro={isPro} primSupps={primSupps} secSupps={secSupps} allergenData={allergenData} proData={kcal}/>
          </div>
        )}
        {subTab==="nahrung"&&<NutritionTab/>}
        {subTab==="mahlzeiten"&&(
          <div>
            <p style={{fontSize:12,color:C.g600,marginBottom:16,lineHeight:1.6}}>Ideal für Sportler die nicht gerne kochen — aber trotzdem optimal versorgt sein wollen.</p>
            <FertiggerichteContent/>
          </div>
        )}
        {subTab==="hydration"&&<HydrationContent/>}
        {subTab==="recovery"&&(
          <div>
            <p style={{fontSize:12,color:C.g600,marginBottom:20,lineHeight:1.5}}>Professionelle Recovery-Technologie — empfohlen nach intensiven Trainings.</p>
            <RecoveryContent/>
          </div>
        )}
        {subTab==="wearables"&&<WearablesContent/>}
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:"#FAFAFA",fontFamily:"Inter,sans-serif"}}>
      {/* Top bar */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.g200}`,padding:isMobile?"10px 16px":"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <Logo/>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {fname&&!isMobile&&<span style={{fontSize:13,color:C.g600}}>Hallo, {fname}</span>}
          {isPro&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:C.neon,color:C.black,fontFamily:"JetBrains Mono,monospace",fontWeight:700}}>PRO</span>}
          <button onClick={onReset} style={{fontSize:11,color:C.g400,background:"none",border:`0.5px solid ${C.g200}`,borderRadius:7,padding:"4px 10px",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>↩ Neu</button>
        </div>
      </div>

      {/* Mobile: full width content + bottom nav */}
      {isMobile?(
        <div style={{padding:"16px 16px 90px"}}>
          {tab==="summary"&&<SummaryTab/>}
          {tab==="zahlen"&&(<div><h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Deine Zahlen</h2><p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6}}>Alle Verbrauchs- und Leistungsdaten — exakt berechnet auf dein Profil.</p><VerbrauchTab/></div>)}
          {tab==="tagesplan"&&(<div><h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Tagesplan</h2><p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6}}>Dein personalisierter Tagesplan mit Supplement-Timing.</p><TagesplanTab/></div>)}
          {tab==="empfehlungen"&&<EmpfehlungenTab/>}
          {tab==="protokolle"&&(<div><h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Protokolle</h2><p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.6}}>Einnahme-Protokolle für deine Supplements.</p><ProtokollTab/></div>)}
          {tab==="wettkampf"&&(<div><h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Wettkampf</h2><p style={{fontSize:13,color:C.g600,marginBottom:16,lineHeight:1.6}}>Race-Day Strategie — personalisiert auf dein Profil.</p><WettkampfTab/></div>)}
          {tab==="einkauf"&&(<div><h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Einkauf</h2><p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6}}>Warenkorb und Bluttest.</p><CartTab/><div style={{marginTop:24}}><h3 style={{fontSize:15,fontWeight:600,color:C.black,marginBottom:4}}>Bluttest</h3><BluttestTab/></div></div>)}
          {tab==="aichat"&&(<div><h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>TREYN AI Chat</h2><p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.5}}>Stelle Fragen zu deinen Daten und Empfehlungen.</p><AiChat context={aiCtx} isPro={isPro}/></div>)}
          {tab==="profil"&&(<div><h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Profil</h2><p style={{fontSize:13,color:C.g600,marginBottom:20}}>Deine persönlichen Angaben anpassen.</p><ProfilTab/></div>)}
          {tab==="kontakt"&&<KontaktTab/>}
        </div>
      ):(
        <div style={{display:"flex",maxWidth:1100,margin:"0 auto",padding:"0 16px"}}>

          {/* ── LEFT NAV ─────────────────────────────────────────────────────── */}
          <div className="desktop-sidebar" style={{width:220,flexShrink:0,padding:"24px 12px 24px 0"}}>
            <div style={{position:"sticky",top:64,display:"flex",flexDirection:"column",gap:2,minHeight:"calc(100vh - 88px)"}}>
              <div style={{fontSize:10,fontWeight:700,color:C.g400,fontFamily:"JetBrains Mono,monospace",letterSpacing:".06em",padding:"0 14px",marginBottom:8}}>MEIN PROFIL</div>
              {NAV.map(item=><NavItem key={item.id} item={item}/>)}
              <div style={{flex:1}}/>
              <div style={{paddingTop:8,borderTop:`1px solid ${C.g200}`,marginTop:8,display:"flex",flexDirection:"column",gap:2}}>
                <button onClick={()=>setTab("kontakt")} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",background:tab==="kontakt"?C.neon:"transparent",color:tab==="kontakt"?C.black:C.g500,fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:400,transition:"all .14s",textAlign:"left"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Kontakt & Impressum
                </button>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
          <div style={{flex:1,minWidth:0,padding:"24px 0 80px 24px",borderLeft:`1px solid ${C.g200}`}}>
          {tab==="summary"&&<SummaryTab/>}

          {/* ── DEINE ZAHLEN (PRO only) ──────────────────────────────────── */}
          {tab==="zahlen"&&(<div>
            <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Deine Zahlen</h2>
            <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6}}>Alle Verbrauchs- und Leistungsdaten — exakt berechnet auf dein Profil.</p>
            <VerbrauchTab/>
          </div>)}

          {/* ── TAGESPLAN ────────────────────────────────────────────────── */}
          {tab==="tagesplan"&&(<div>
            <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Tagesplan</h2>
            <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6}}>Dein personalisierter Supplement- und Ernährungsplan für heute.</p>
            <TagesplanTab/>
          </div>)}

          {/* ── EMPFEHLUNGEN ─────────────────────────────────────────────── */}
          {tab==="empfehlungen"&&<EmpfehlungenTab/>}

          {/* ── PROTOKOLLE ───────────────────────────────────────────────── */}
          {tab==="protokolle"&&(<div>
            <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Protokolle</h2>
            <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6}}>Einnahme-Protokolle für deine Supplements — Dauer, Pausen und wichtige Hinweise.</p>
            <ProtokollTab/>
          </div>)}

          {/* ── WETTKAMPF ────────────────────────────────────────────────── */}
          {tab==="wettkampf"&&(<div>
            <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Wettkampf</h2>
            <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6}}>Race-Day Strategie — personalisiert auf dein Gewicht, deine Sportart und Intensität.</p>
            <WettkampfTab/>
          </div>)}

          {/* ── EINKAUF ──────────────────────────────────────────────────── */}
          {tab==="einkauf"&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Einkauf</h2>
              <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.6}}>Dein Warenkorb und Bluttest — alles an einem Ort.</p>
              <CartTab/>
              <div style={{marginTop:24}}>
                <h3 style={{fontSize:15,fontWeight:600,color:C.black,marginBottom:4}}>Bluttest</h3>
                <p style={{fontSize:13,color:C.g600,marginBottom:16}}>Echte Laborwerte direkt in deine Berechnungen importieren.</p>
                <BluttestTab/>
              </div>
            </div>
          )}

          {/* ── AI CHAT ──────────────────────────────────────────────────── */}
          {tab==="aichat"&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>TREYN AI Chat</h2>
              <p style={{fontSize:13,color:C.g600,marginBottom:20,lineHeight:1.5}}>Stelle Fragen zu deinen Daten, Supplements und Ernährung — direkt beantwortet von TREYN AI.</p>
              <AiChat context={aiCtx} isPro={isPro}/>
            </div>
          )}

          {/* ── PROFIL ───────────────────────────────────────────────────── */}
          {tab==="profil"&&(
            <div>
              <h2 style={{fontSize:18,fontWeight:600,color:C.black,marginBottom:4,letterSpacing:"-.02em"}}>Profil</h2>
              <p style={{fontSize:13,color:C.g600,marginBottom:20}}>Deine persönlichen Angaben anpassen.</p>
              <ProfilTab/>
            </div>
          )}

          {/* ── KONTAKT ──────────────────────────────────────────────────── */}
          {tab==="kontakt"&&<KontaktTab/>}
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


export default 
function App() {
  const [phase,setPhase]=useState("intro");
  const [sportData,setSportData]=useState(null);
  const [trainingData,setTrainingData]=useState(null);
  const [profilData,setProfilData]=useState(null);
  const [allergenData,setAllergenData]=useState(null);
  const [praeferenzenData,setPraeferenzenData]=useState(null);
  const [tier,setTier]=useState("basic");
  const [devMode]=useState(()=>new URLSearchParams(window.location.search).get("dev")==="1");

  // Ensure proper mobile viewport
  useEffect(()=>{
    let vp=document.querySelector("meta[name=viewport]");
    if(!vp){vp=document.createElement("meta");vp.name="viewport";document.head.appendChild(vp);}
    vp.content="width=device-width,initial-scale=1,viewport-fit=cover";
  },[]);

  const reset=()=>{setSportData(null);setTrainingData(null);setProfilData(null);setAllergenData(null);setPraeferenzenData(null);setIsDemoMode(false);setTier("basic");setPhase("intro");};

  // Dev shortcut — only active when ?dev=1 in URL
  const DEV_SPORT={primarySport:"cycling",selectedSports:["cycling","running"],sel:{cycling:true,running:true},subSel:{cycling_road:true,run_road:true},childSel:{"run_road_run_road_m":true},healthOnly:false};
  const DEV_TRAINING={cycling:{days:5,intensity:"high",duration:90,hasCompetition:true,compCount:8,compTypes:["Rennen"],trainingTimes:["morning"],sweatRate:"high"},running:{days:3,intensity:"medium",duration:60,hasCompetition:false,compCount:3,compTypes:[],trainingTimes:["morning"],sweatRate:"medium"}};
  const DEV_PROFIL={firstname:"Kevin",lastname:"Oberholzer",email:"kevin@test.ch",gender:"m",birthyear:"1988",height:"192",weight:"100",country:"Schweiz",platform:"wahoo",rhr:"48",sleep:"7",goal:"performance",stressLevel:3,dietQuality:"good",altitude:"low",recoveryStatus:"good",currentSupps:["kreatin"],medications:["none"],monthlyBudget:"high",injuries:[]};
  const DEV_ALLERGEN={allergens:[],noAllergens:true,diet:["none"]};
  const DEV_PRAEF={suppForm:"pulver",energieForm:["gel","drink"],proteinForm:["whey"],recoveryForm:["magnesium"]};
  const devJump=(target,t="basic")=>{
    setSportData(DEV_SPORT);setTrainingData(DEV_TRAINING);setProfilData(DEV_PROFIL);
    setAllergenData(DEV_ALLERGEN);setPraeferenzenData(DEV_PRAEF);setTier(t);setPhase(target);
  };

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
    window.location.href=STRIPE_LINK;
  };

  const [isDemoMode,setIsDemoMode]=useState(false);
  const startDemo=()=>{
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

  return (
    <div style={{minHeight:"100vh",background:C.white,fontFamily:"Inter,sans-serif"}}>
      <style>{css}</style>
      {devMode&&(
        <div style={{position:"fixed",bottom:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
          <div style={{fontSize:9,color:"#999",fontFamily:"JetBrains Mono,monospace",textAlign:"right",marginBottom:2}}>DEV MODE</div>
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
              style={{background:"#0A0A0A",color:"#C8FF00",border:"none",borderRadius:7,padding:"5px 12px",fontSize:11,fontFamily:"JetBrains Mono,monospace",cursor:"pointer",whiteSpace:"nowrap"}}>
              {l}
            </button>
          ))}
        </div>
      )}
      {phase==="intro"      && <Intro           onNext={()=>setPhase("demo")} onDemo={startDemo}/>}
      {phase==="demo"       && <Demo            onNext={()=>{setIsDemoMode(false);setPhase("sport");}} onDemo={launchDemo}/>}
      {phase==="sport"      && <StepSport       onNext={v=>{setSportData(v);setPhase("training");}}/>}
      {phase==="training"   && <StepTraining    sportData={sportData} onBack={()=>setPhase("sport")} onNext={v=>{setTrainingData(v);setPhase("profil");}}/>}
      {phase==="profil"     && <StepProfil      sportData={sportData} trainingData={trainingData} onBack={()=>setPhase("training")} onNext={v=>{setProfilData(v);setPhase("lebensstil");}}/>}
      {phase==="lebensstil" && <StepLebensstil  onBack={()=>setPhase("profil")} onNext={v=>{setProfilData(p=>({...p,...v}));setPhase("allergien");}}/>}
      {phase==="allergien"  && <StepAllergien   onBack={()=>setPhase("lebensstil")} onNext={v=>{setAllergenData(v);setPhase("praeferenzen");}}/>}
      {phase==="praeferenzen" && <StepPraeferenzen onBack={()=>setPhase("allergien")} onNext={v=>{setPraeferenzenData(v);setPhase("willkommen");}}/>}
      {phase==="willkommen" && <StepWillkommen onNext={()=>setPhase("analysing")}/>}
      {phase==="preview"    && <AnalysePreview  sportData={sportData} trainingData={trainingData} profilData={profilData}
        onContinue={()=>{setTier("basic");setPhase("analysing");}}
        onUpgrade={()=>openStripePayment(sportData,trainingData,profilData,allergenData)}/>}
      {phase==="analysing" && <AnalysingScreen onDone={()=>setPhase("results")} profilData={profilData} sportData={sportData}/>}
      {phase==="results"    && isDemoMode&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,background:"#0A0A0A",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>{setIsDemoMode(false);setPhase("demo");}} style={{fontSize:12,color:"rgba(255,255,255,.5)",background:"none",border:"1px solid rgba(255,255,255,.15)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>← Zurück</button>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:C.neon,color:"#000",fontWeight:700,fontFamily:"JetBrains Mono,monospace"}}>DEMO</span>
            <span style={{fontSize:13,color:"#fff"}}>Musterprofil von Alex · Du siehst alle PRO-Features</span>
          </div>
          <button onClick={()=>{setIsDemoMode(false);setPhase("intro");}} style={{fontSize:12,color:C.neon,background:"none",border:`1px solid ${C.neon}`,borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:500}}>Eigene Analyse starten →</button>
        </div>
      )}
      {phase==="results"    && <Results         sportData={sportData} trainingData={trainingData} profilData={profilData} allergenData={allergenData} praeferenzenData={praeferenzenData} tier={tier} onReset={reset}
        onUpgrade={()=>openStripePayment(sportData,trainingData,profilData,allergenData)}/>}
    </div>
  );
}
