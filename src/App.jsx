import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hehiuwrvjufdafrdecfc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaGl1d3J2anVmZGFmcmRlY2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5ODk3NTAsImV4cCI6MjA5NjU2NTc1MH0.GrtN7SdZwaweRFFx18gMWaIX-Wo3-jKreiVhuEtoNYM"
);

const BASE_PLAN = [
  { id:"qudurat-study", title:"Qudurat — Study",               cat:"admission",  type:"study",     xp:0,   studyMonths:1,  detail:"Start NOW · 1 month prep · qiyas.sa",                        examDefault:"2026-07" },
  { id:"qudurat-exam",  title:"Qudurat — EXAM",                cat:"admission",  type:"exam",      xp:50,  studyMonths:null, detail:"MBA requirement · qiyas.sa",                                examDefault:"2026-07" },
  { id:"aigp-exam",     title:"AIGP",                          cat:"tech",       type:"exam",      xp:100, studyMonths:3,  detail:"AI Governance · IAPP · $799 non-member",                     examDefault:"2026-10" },
  { id:"strategy",      title:"Strategy & Business Planning",  cat:"management", type:"course",    xp:50,  studyMonths:null, detail:"5-day course",                                              examDefault:"2026-08" },
  { id:"misk-end",      title:"Misk 10X Leaders",              cat:"leadership", type:"milestone", xp:100, studyMonths:null, detail:"Aug 2026 – Jan 2027 · CMI Certified · Hybrid · 11,500 SAR",examDefault:"2027-01" },
  { id:"gmat-exam",     title:"GMAT",                          cat:"admission",  type:"exam",      xp:0,   studyMonths:3,  detail:"mba.com · after 3 months study",                             examDefault:"2026-11" },
  { id:"ielts-exam",    title:"IELTS",                         cat:"admission",  type:"exam",      xp:50,  studyMonths:null, detail:"2 weeks review only",                                       examDefault:"2026-11" },
  { id:"cia1-exam",     title:"CIA Part 1",                    cat:"cia",        type:"exam",      xp:200, studyMonths:3,  detail:"IIA member $255 · IIA Standards & Ethics",                   examDefault:"2027-02" },
  { id:"kpi",           title:"KPI / Performance Management",  cat:"management", type:"course",    xp:50,  studyMonths:null, detail:"5-day course",                                              examDefault:"2026-12" },
  { id:"mba-app",       title:"MBA Application",               cat:"academic",   type:"milestone", xp:0,   studyMonths:null, detail:"Submit to KSU",                                             examDefault:"2026-12" },
  { id:"cobit",         title:"COBIT Foundation",              cat:"audit",      type:"exam",      xp:50,  studyMonths:1,  detail:"3 weeks prep · ISACA · $175",                                examDefault:"2027-03" },
  { id:"togaf-exam",    title:"TOGAF Foundation",              cat:"tech",       type:"exam",      xp:100, studyMonths:3,  detail:"$400 · The Open Group · Part 1",                             examDefault:"2027-06" },
  { id:"coso",          title:"COSO Internal Control & ERM",   cat:"audit",      type:"course",    xp:100, studyMonths:null, detail:"5-day course · company coverage possible",                  examDefault:"2027-07" },
  { id:"control",       title:"Control Design & Effectiveness",cat:"audit",      type:"course",    xp:100, studyMonths:null, detail:"5-day course · company coverage possible",                  examDefault:"2027-07" },
  { id:"qaip",          title:"QAIP / Internal Audit Quality", cat:"audit",      type:"course",    xp:50,  studyMonths:null, detail:"5-day course · completes audit profile",                    examDefault:"2027-08" },
  { id:"mba-start",     title:"🎓 MBA STARTS",                 cat:"academic",   type:"milestone", xp:0,   studyMonths:null, detail:"KSU · 2 years · Finance track · 80,000 SAR",               examDefault:"2027-09" },
  { id:"cia2-exam",     title:"CIA Part 2",                    cat:"cia",        type:"exam",      xp:200, studyMonths:3,  detail:"IIA member $255 · overlaps MBA ⚠️",                          examDefault:"2027-12" },
  { id:"cia3-exam",     title:"CIA Part 3",                    cat:"cia",        type:"exam",      xp:200, studyMonths:3,  detail:"IIA member $255 · Business Knowledge",                       examDefault:"2028-03" },
  { id:"cia-done",      title:"🏆 CIA COMPLETE",               cat:"cia",        type:"milestone", xp:0,   studyMonths:null, detail:"All 3 parts · 24-month experience ✅ · Official CIA 🎉",   examDefault:"2028-03" },
];

const CAT = {
  admission:  { bg:"#FEF3C7", border:"#D97706", text:"#78350F", dot:"#D97706", label:"Admission",  icon:"🎓" },
  audit:      { bg:"#EDE9FE", border:"#7C3AED", text:"#3B0764", dot:"#7C3AED", label:"Audit",      icon:"🔍" },
  management: { bg:"#DCFCE7", border:"#16A34A", text:"#14532D", dot:"#16A34A", label:"Management", icon:"📊" },
  tech:       { bg:"#DBEAFE", border:"#2563EB", text:"#1E3A8A", dot:"#2563EB", label:"Tech / AI",  icon:"🤖" },
  leadership: { bg:"#FCE7F3", border:"#DB2777", text:"#831843", dot:"#DB2777", label:"Leadership", icon:"👑" },
  cia:        { bg:"#FEE2E2", border:"#DC2626", text:"#7F1D1D", dot:"#DC2626", label:"CIA",        icon:"🏆" },
  academic:   { bg:"#CCFBF1", border:"#0D9488", text:"#134E4A", dot:"#0D9488", label:"Academic",   icon:"🎓" },
};

const TYPE_META = {
  study:     { label:"Study",     bg:"#F1F5F9", color:"#64748B" },
  exam:      { label:"EXAM",      bg:"#FEE2E2", color:"#DC2626" },
  course:    { label:"Course",    bg:"#DCFCE7", color:"#16A34A" },
  milestone: { label:"Milestone", bg:"#FEF9C3", color:"#D97706" },
};

const BADGES = [
  { id:"badge-admission", icon:"🎓", name:"Admission Master",  desc:"Pass Qudurat, IELTS & GMAT",   requires:["qudurat-exam","ielts-exam","gmat-exam"] },
  { id:"badge-misk",      icon:"👑", name:"Misk 10X Graduate", desc:"Complete Misk 10X Leaders",    requires:["misk-end"] },
  { id:"badge-aigp",      icon:"🤖", name:"AI Pioneer",        desc:"Pass AIGP",                    requires:["aigp-exam"] },
  { id:"badge-audit",     icon:"🔍", name:"Audit Champion",    desc:"Complete all audit courses",   requires:["cobit","coso","control","qaip"] },
  { id:"badge-togaf",     icon:"🏗️", name:"Architect",         desc:"Pass TOGAF Foundation",        requires:["togaf-exam"] },
  { id:"badge-cia1",      icon:"⭐", name:"CIA Part 1",        desc:"Pass CIA Part 1",              requires:["cia1-exam"] },
  { id:"badge-cia2",      icon:"⭐⭐","name":"CIA Parts 1 & 2", desc:"Pass CIA Parts 1 and 2",       requires:["cia1-exam","cia2-exam"] },
  { id:"badge-cia",       icon:"🏆", name:"CIA Legend",        desc:"Complete all 3 CIA parts",     requires:["cia1-exam","cia2-exam","cia3-exam"] },
  { id:"badge-mba",       icon:"🎓", name:"MBA Scholar",       desc:"Start MBA at KSU",             requires:["mba-start"] },
];

const REWARDS = [
  { xp:500,  icon:"🧖‍♀️", title:"Luxury Spa Day",  bg:"#DCFCE7", color:"#14532D", border:"#16A34A" },
  { xp:1000, icon:"💛",  title:"Gold Bracelet",   bg:"#FEF9C3", color:"#78350F", border:"#D97706" },
  { xp:2000, icon:"✈️",  title:"Trip 🏆",          bg:"#EDE9FE", color:"#3B0764", border:"#7C3AED" },
];

const TOTAL_POSSIBLE = BASE_PLAN.filter(p=>p.xp>0).reduce((a,b)=>a+b.xp,0);

const addMonths = (ym, n) => {
  const [y,m] = ym.split("-").map(Number);
  const d = new Date(y, m-1+n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
};

const ymLabel = (ym) => {
  const [y,m] = ym.split("-").map(Number);
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m-1]+" "+y;
};

const buildCalendar = (overrides) => {
  const entries = [];
  BASE_PLAN.forEach(p => {
    const examMonth = overrides[p.id] || p.examDefault;
    entries.push({ ...p, month:examMonth, examMonth, isStudy:false });
    if (p.studyMonths) {
      for (let i=p.studyMonths; i>=1; i--) {
        entries.push({ ...p, id:`${p.id}-s${i}`, month:addMonths(examMonth,-i),
          title:`${p.title} — Study (${p.studyMonths-i+1}/${p.studyMonths})`,
          type:"study", xp:0, isStudy:true, parentId:p.id });
      }
    }
  });
  return entries.sort((a,b)=>a.month.localeCompare(b.month));
};

const getAllMonths = (overrides) => {
  const set = new Set();
  BASE_PLAN.forEach(p => {
    const em = overrides[p.id]||p.examDefault;
    set.add(em);
    if (p.studyMonths) for(let i=1;i<=p.studyMonths;i++) set.add(addMonths(em,-i));
  });
  return [...set].sort();
};

export default function App() {
  const [done, setDone]           = useState({});
  const [overrides, setOverrides] = useState({});
  const [expanded, setExpanded]   = useState({});
  const [filter, setFilter]       = useState("all");
  const [view, setView]           = useState("calendar");
  const [loaded, setLoaded]       = useState(false);
  const [saving, setSaving]       = useState(false);
  const [syncStatus, setSyncStatus] = useState("synced");

  // Load from Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("pdp_progress").select("*").eq("id","ghada").single();
      if (data) {
        setDone(data.done || {});
        setOverrides(data.overrides || {});
      }
      setLoaded(true);
    })();
  }, []);

  const save = async (newDone, newOverrides) => {
    setSyncStatus("saving");
    await supabase.from("pdp_progress").upsert({
      id:"ghada", done:newDone, overrides:newOverrides, updated_at:new Date().toISOString()
    });
    setSyncStatus("synced");
  };

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    save(next, overrides);
  };

  const updateOverride = (id, val) => {
    const next = { ...overrides, [id]: val };
    setOverrides(next);
    save(done, next);
  };

  const removeOverride = (id) => {
    const next = { ...overrides };
    delete next[id];
    setOverrides(next);
    save(done, next);
  };

  const calendar   = useMemo(() => buildCalendar(overrides), [overrides]);
  const allMonths  = useMemo(() => getAllMonths(overrides), [overrides]);
  const earnedXP   = BASE_PLAN.filter(p=>done[p.id]&&p.xp>0).reduce((a,b)=>a+b.xp,0);
  const pct        = Math.round((earnedXP/TOTAL_POSSIBLE)*100);
  const unlockedB  = (b) => b.requires.every(r=>done[r]);
  const unlockedR  = (r) => earnedXP>=r.xp;
  const years      = [...new Set(allMonths.map(m=>m.split("-")[0]))].sort();

  const getMonthItems = (monthId) => {
    const items = calendar.filter(p=>p.month===monthId);
    if (filter==="all") return items;
    if (filter==="exam") return items.filter(i=>i.type==="exam");
    return items.filter(i=>i.cat===filter);
  };

  const getLoad = (monthId) => {
    const items = calendar.filter(p=>p.month===monthId);
    const exams = items.filter(i=>i.type==="exam").length;
    if (items.length>=3||exams>=2) return { bg:"#FEE2E2", border:"#DC2626", label:"Heavy ⚠️" };
    if (items.length===2||exams===1) return { bg:"#FEF9C3", border:"#D97706", label:"Medium" };
    return { bg:"#F0FDF4", border:"#16A34A", label:"Light" };
  };

  const monthOptions = [];
  for(let y=2026;y<=2029;y++) for(let m=1;m<=12;m++)
    monthOptions.push(`${y}-${String(m).padStart(2,"0")}`);

  if (!loaded) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontFamily:"system-ui", flexDirection:"column", gap:12 }}>
      <div style={{ width:40, height:40, border:"3px solid #EDE9FE", borderTop:"3px solid #7C3AED", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <div style={{ color:"#7C3AED", fontSize:13 }}>Loading your plan…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", background:"#F8FAFC", minHeight:"100vh", paddingBottom:48 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#7C3AED,#2563EB)", padding:"22px 18px 18px", color:"#fff" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:2, opacity:0.7, marginBottom:3, textTransform:"uppercase" }}>Professional Development Plan</div>
              <div style={{ fontSize:20, fontWeight:800, marginBottom:10 }}>Ghada · 2026 – 2028</div>
            </div>
            <div style={{ fontSize:10, display:"flex", alignItems:"center", gap:5, opacity:0.8 }}>
              {syncStatus==="saving" ? (
                <><div style={{ width:8,height:8,borderRadius:"50%",border:"1.5px solid #fff",borderTop:"1.5px solid transparent",animation:"spin 0.8s linear infinite" }}/>Saving…</>
              ) : (
                <><div style={{ width:8,height:8,borderRadius:"50%",background:"#34D399" }}/>Synced</>
              )}
            </div>
          </div>

          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, height:10, marginBottom:6, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:20, background:"#FCD34D", width:`${pct}%`, transition:"width 0.5s" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, opacity:0.85, marginBottom:12 }}>
            <span>⚡ {earnedXP} / {TOTAL_POSSIBLE} XP</span>
            <span>{pct}%</span>
          </div>

          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {[
              ["⚡ "+earnedXP,"XP","rgba(252,211,77,0.25)","#FCD34D"],
              [Object.values(done).filter(Boolean).length+"/"+BASE_PLAN.length,"Done","rgba(52,211,153,0.25)","#34D399"],
              [BADGES.filter(b=>unlockedB(b)).length+"/"+BADGES.length,"Badges","rgba(244,114,182,0.25)","#F472B6"],
              [REWARDS.filter(r=>unlockedR(r)).length+"/"+REWARDS.length,"Rewards","rgba(167,139,250,0.25)","#A78BFA"],
            ].map(([v,l,bg,c]) => (
              <div key={l} style={{ background:bg, borderRadius:9, padding:"6px 11px" }}>
                <div style={{ fontSize:14, fontWeight:800, color:c }}>{v}</div>
                <div style={{ fontSize:9, opacity:0.8 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", overflowX:"auto" }}>
        <div style={{ maxWidth:860, margin:"0 auto", display:"flex", minWidth:"max-content" }}>
          {[["calendar","📅 Calendar"],["badges","🏅 Badges"],["rewards","🎁 Rewards"],["settings","⚙️ Settings"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{
              padding:"11px 16px", border:"none", background:"transparent", cursor:"pointer",
              fontSize:12, fontWeight:600, whiteSpace:"nowrap",
              color:view===v?"#7C3AED":"#64748B",
              borderBottom:view===v?"2px solid #7C3AED":"2px solid transparent",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"18px 14px" }}>

        {/* ══ CALENDAR ══ */}
        {view==="calendar" && (<>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:16 }}>
            {[["all","All"],["exam","🎯 Exams"],["admission","🎓 Admission"],["cia","🏆 CIA"],["tech","🤖 Tech/AI"],["leadership","👑 Misk"],["audit","🔍 Audit"]].map(([id,l])=>(
              <button key={id} onClick={()=>setFilter(id)} style={{
                padding:"5px 12px", borderRadius:20, border:"none", cursor:"pointer",
                fontSize:11, fontWeight:600,
                background:filter===id?"#7C3AED":"#EDE9FE",
                color:filter===id?"#fff":"#4C1D95",
              }}>{l}</button>
            ))}
          </div>

          {years.map(year=>{
            const yearMonths = allMonths.filter(m=>m.startsWith(year));
            return (
              <div key={year} style={{ marginBottom:26 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ background:year==="2026"?"#7C3AED":year==="2027"?"#2563EB":"#DC2626", color:"#fff", borderRadius:7, padding:"3px 13px", fontWeight:800, fontSize:13 }}>{year}</div>
                  {year==="2027"&&<span style={{ fontSize:10, color:"#0D9488", fontWeight:600, background:"#CCFBF1", padding:"2px 7px", borderRadius:7 }}>🎓 MBA Sep</span>}
                  {year==="2028"&&<span style={{ fontSize:10, color:"#DC2626", fontWeight:600, background:"#FEE2E2", padding:"2px 7px", borderRadius:7 }}>🏆 CIA Mar</span>}
                  <div style={{ flex:1, height:1, background:"#E2E8F0" }}/>
                  <span style={{ fontSize:10, color:"#78350F", background:"#FEF9C3", padding:"2px 7px", borderRadius:7, fontWeight:600 }}>
                    ⚡{BASE_PLAN.filter(p=>p.xp>0&&done[p.id]&&(overrides[p.id]||p.examDefault).startsWith(year)).reduce((a,b)=>a+b.xp,0)}/{BASE_PLAN.filter(p=>p.xp>0&&(overrides[p.id]||p.examDefault).startsWith(year)).reduce((a,b)=>a+b.xp,0)}
                  </span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:9 }}>
                  {yearMonths.map(monthId=>{
                    const items = getMonthItems(monthId);
                    const allItems = calendar.filter(p=>p.month===monthId);
                    const load = getLoad(monthId);
                    const isEmpty = allItems.length===0;
                    const doneCount = allItems.filter(i=>done[i.isStudy?i.parentId:i.id]).length;

                    return (
                      <div key={monthId} style={{
                        background:"#fff", borderRadius:11,
                        border:`1.5px solid ${isEmpty?"#E2E8F0":load.border}`,
                        overflow:"hidden", opacity:isEmpty?0.3:1,
                        boxShadow:isEmpty?"none":"0 1px 4px rgba(0,0,0,0.05)",
                      }}>
                        <div style={{ background:isEmpty?"#F8FAFC":load.bg, padding:"9px 12px", borderBottom:`1px solid ${isEmpty?"#E2E8F0":load.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ fontWeight:700, fontSize:13, color:isEmpty?"#94A3B8":"#0F172A" }}>{ymLabel(monthId)}</div>
                          {!isEmpty&&(
                            <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                              {doneCount>0&&<span style={{ fontSize:9, background:"#DCFCE7", color:"#14532D", fontWeight:700, padding:"1px 5px", borderRadius:6 }}>✓{doneCount}/{allItems.length}</span>}
                              <span style={{ fontSize:9, color:load.border, fontWeight:600 }}>{load.label}</span>
                            </div>
                          )}
                        </div>

                        {!isEmpty&&items.length>0&&(
                          <div style={{ padding:"7px 8px", display:"flex", flexDirection:"column", gap:5 }}>
                            {items.map(item=>{
                              const cc=CAT[item.cat]; const tc=TYPE_META[item.type];
                              const checkId=item.isStudy?item.parentId:item.id;
                              const isDone=!!done[checkId];
                              const isExp=!!expanded[item.id];
                              return (
                                <div key={item.id} style={{
                                  background:isDone?"#F0FDF4":isExp?cc.bg:"#F8FAFC",
                                  border:`1px solid ${isDone?"#16A34A":isExp?cc.border:"#E2E8F0"}`,
                                  borderLeft:`3px solid ${isDone?"#16A34A":cc.dot}`,
                                  borderRadius:8, padding:"7px 8px", opacity:isDone?0.75:1,
                                }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                                    {!item.isStudy?(
                                      <div onClick={()=>toggle(item.id)} style={{
                                        width:17,height:17,borderRadius:4,flexShrink:0,
                                        border:`1.5px solid ${isDone?"#16A34A":cc.dot}`,
                                        background:isDone?"#16A34A":"#fff",
                                        display:"flex",alignItems:"center",justifyContent:"center",
                                        cursor:"pointer",fontSize:10,color:"#fff",fontWeight:800,
                                      }}>{isDone&&"✓"}</div>
                                    ):(
                                      <div style={{ width:17,height:17,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                                        <div style={{ width:5,height:5,borderRadius:"50%",background:isDone?"#16A34A":cc.dot }}/>
                                      </div>
                                    )}
                                    <div onClick={()=>setExpanded(e=>({...e,[item.id]:!e[item.id]}))} style={{ flex:1,cursor:"pointer" }}>
                                      <div style={{ fontSize:11,fontWeight:item.isStudy?400:600,color:isDone?"#94A3B8":"#0F172A",textDecoration:isDone&&!item.isStudy?"line-through":"none",lineHeight:1.3 }}>{item.title}</div>
                                    </div>
                                    <div style={{ display:"flex",gap:3,flexShrink:0 }}>
                                      <span style={{ fontSize:8,fontWeight:700,padding:"2px 4px",borderRadius:3,background:tc.bg,color:tc.color }}>{tc.label}</span>
                                      {item.xp>0&&<span style={{ fontSize:8,fontWeight:700,padding:"2px 4px",borderRadius:3,background:"#FEF9C3",color:"#78350F" }}>⚡{item.xp}</span>}
                                    </div>
                                  </div>
                                  {isExp&&<div style={{ marginTop:5,paddingTop:5,borderTop:`1px solid ${cc.border}30`,fontSize:10,color:"#64748B",lineHeight:1.5 }}>{item.detail}</div>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {isEmpty&&<div style={{ padding:"8px",textAlign:"center",fontSize:10,color:"#CBD5E1" }}>Free</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>)}

        {/* ══ BADGES ══ */}
        {view==="badges"&&(
          <div>
            <div style={{ fontSize:12,color:"#64748B",marginBottom:16 }}>
              <strong style={{ color:"#7C3AED" }}>{BADGES.filter(b=>unlockedB(b)).length}/{BADGES.length}</strong> unlocked
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10 }}>
              {BADGES.map(b=>{
                const unlocked=unlockedB(b); const progress=b.requires.filter(r=>done[r]).length;
                return (
                  <div key={b.id} style={{ background:unlocked?"#fff":"#F8FAFC",border:`2px solid ${unlocked?"#7C3AED":"#E2E8F0"}`,borderRadius:14,padding:"16px 14px",textAlign:"center",boxShadow:unlocked?"0 4px 14px rgba(124,58,237,0.15)":"none" }}>
                    <div style={{ fontSize:34,marginBottom:7,filter:unlocked?"none":"grayscale(1) opacity(0.25)" }}>{b.icon}</div>
                    <div style={{ fontWeight:800,fontSize:12,color:unlocked?"#3B0764":"#94A3B8",marginBottom:3 }}>{b.name}</div>
                    <div style={{ fontSize:10,color:unlocked?"#64748B":"#CBD5E1",marginBottom:9,lineHeight:1.4 }}>{b.desc}</div>
                    {unlocked?(
                      <div style={{ fontSize:10,fontWeight:700,color:"#3B0764",background:"#EDE9FE",borderRadius:20,padding:"3px 10px",display:"inline-block" }}>✓ Unlocked!</div>
                    ):(
                      <div>
                        <div style={{ height:4,background:"#E2E8F0",borderRadius:4,marginBottom:4,overflow:"hidden" }}>
                          <div style={{ height:"100%",background:"#7C3AED",borderRadius:4,width:`${(progress/b.requires.length)*100}%` }}/>
                        </div>
                        <div style={{ fontSize:9,color:"#94A3B8" }}>{progress}/{b.requires.length} · 🔒</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ REWARDS ══ */}
        {view==="rewards"&&(
          <div>
            <div style={{ background:"#fff",border:"1px solid #E2E8F0",borderRadius:11,padding:"14px 16px",marginBottom:18 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:7 }}>
                <span style={{ fontWeight:700,color:"#0F172A",fontSize:12 }}>⚡ XP Progress</span>
                <span style={{ fontWeight:700,color:"#78350F",fontSize:12 }}>{earnedXP}/{TOTAL_POSSIBLE}</span>
              </div>
              <div style={{ background:"#F1F5F9",borderRadius:20,height:11,overflow:"hidden",marginBottom:3 }}>
                <div style={{ height:"100%",borderRadius:20,background:"linear-gradient(90deg,#FCD34D,#F59E0B)",width:`${pct}%`,transition:"width 0.5s" }}/>
              </div>
              <div style={{ fontSize:10,color:"#94A3B8",textAlign:"right" }}>{pct}%</div>
            </div>
            {REWARDS.map(r=>{
              const unlocked=unlockedR(r);
              return (
                <div key={r.xp} style={{ background:unlocked?r.bg:"#F8FAFC",border:`2px solid ${unlocked?r.border:"#E2E8F0"}`,borderRadius:13,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,marginBottom:10,boxShadow:unlocked?`0 4px 16px ${r.border}25`:"none" }}>
                  <div style={{ fontSize:40,filter:unlocked?"none":"grayscale(1) opacity(0.2)" }}>{r.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800,fontSize:16,color:unlocked?r.color:"#94A3B8" }}>{r.title}</div>
                    <div style={{ fontSize:11,color:unlocked?r.color:"#CBD5E1",marginTop:2 }}>Unlock at ⚡{r.xp} XP</div>
                    {!unlocked&&(
                      <div style={{ marginTop:7 }}>
                        <div style={{ background:"#E2E8F0",borderRadius:20,height:5,overflow:"hidden" }}>
                          <div style={{ height:"100%",background:r.border,borderRadius:20,width:`${Math.min((earnedXP/r.xp)*100,100)}%` }}/>
                        </div>
                        <div style={{ fontSize:10,color:"#94A3B8",marginTop:3 }}>{r.xp-earnedXP} XP to go</div>
                      </div>
                    )}
                  </div>
                  {unlocked&&<div style={{ fontSize:24 }}>🎉</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {view==="settings"&&(
          <div>
            <div style={{ fontSize:12,color:"#64748B",marginBottom:4 }}>Change the exam/completion month — study months auto-adjust.</div>
            <div style={{ fontSize:11,color:"#94A3B8",marginBottom:18 }}>Changes sync to all your devices automatically.</div>

            {Object.entries(CAT).map(([catId,cc])=>{
              const catItems=BASE_PLAN.filter(p=>p.cat===catId);
              if(!catItems.length) return null;
              return (
                <div key={catId} style={{ marginBottom:18 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:9,paddingBottom:7,borderBottom:`2px solid ${cc.border}` }}>
                    <span style={{ fontSize:15 }}>{cc.icon}</span>
                    <span style={{ fontWeight:700,fontSize:12,color:cc.text }}>{cc.label}</span>
                  </div>
                  {catItems.map(p=>{
                    const cur=overrides[p.id]||p.examDefault;
                    const modified=!!overrides[p.id]&&overrides[p.id]!==p.examDefault;
                    return (
                      <div key={p.id} style={{ background:"#fff",border:`1px solid ${modified?cc.border:"#E2E8F0"}`,borderLeft:`3px solid ${modified?cc.dot:"#E2E8F0"}`,borderRadius:10,padding:"10px 12px",marginBottom:7,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
                        <div style={{ flex:1,minWidth:140 }}>
                          <div style={{ fontSize:12,fontWeight:600,color:"#0F172A" }}>{p.title}</div>
                          <div style={{ fontSize:10,color:"#94A3B8",marginTop:1 }}>
                            {p.studyMonths?`${p.studyMonths}mo study → exam`:p.type}
                            {modified&&<span style={{ color:cc.dot,marginLeft:5,fontWeight:600 }}>· modified</span>}
                          </div>
                        </div>
                        <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                          {p.studyMonths&&(
                            <div style={{ fontSize:10,color:"#64748B",textAlign:"center" }}>
                              <div style={{ fontSize:9,color:"#94A3B8" }}>Study from</div>
                              <div style={{ fontWeight:600 }}>{ymLabel(addMonths(cur,-p.studyMonths))}</div>
                            </div>
                          )}
                          {p.studyMonths&&<span style={{ fontSize:11,color:"#CBD5E1" }}>→</span>}
                          <div>
                            <div style={{ fontSize:9,color:"#94A3B8",marginBottom:2,textAlign:"center" }}>
                              {p.type==="exam"?"Exam":p.type==="milestone"?"Target":"Month"}
                            </div>
                            <select value={cur} onChange={e=>updateOverride(p.id,e.target.value)} style={{ border:`1.5px solid ${cc.border}`,borderRadius:7,padding:"5px 7px",fontSize:11,fontWeight:600,color:cc.text,background:cc.bg,cursor:"pointer",outline:"none" }}>
                              {monthOptions.map(m=><option key={m} value={m}>{ymLabel(m)}</option>)}
                            </select>
                          </div>
                          {modified&&(
                            <button onClick={()=>removeOverride(p.id)} style={{ border:"none",background:"#FEE2E2",color:"#DC2626",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600 }}>Reset</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <div style={{ marginTop:20,paddingTop:16,borderTop:"1px solid #E2E8F0",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ fontSize:11,color:"#94A3B8" }}>{Object.keys(overrides).length} custom date(s)</div>
              {Object.keys(overrides).length>0&&(
                <button onClick={()=>{setOverrides({});save(done,{});}} style={{ border:"1.5px solid #DC2626",background:"#FEE2E2",color:"#DC2626",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:600 }}>Reset all</button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
