import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hehiuwrvjufdafrdecfc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaGl1d3J2anVmZGFmcmRlY2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5ODk3NTAsImV4cCI6MjA5NjU2NTc1MH0.GrtN7SdZwaweRFFx18gMWaIX-Wo3-jKreiVhuEtoNYM"
);

const BASE_PLAN = [
  // Admission
  { id:"qudurat-exam",  title:"Qudurat",                        cat:"admission",  type:"exam",      xp:50,  study_months:1,  start_default:"2026-06", exam_default:"2026-07", detail:"MBA requirement · qiyas.sa" },
  { id:"gmat-exam",     title:"GMAT",                           cat:"admission",  type:"exam",      xp:0,   study_months:3,  start_default:"2026-08", exam_default:"2026-11", detail:"mba.com · study after IELTS" },
  { id:"ielts-exam",    title:"IELTS",                          cat:"admission",  type:"exam",      xp:50,  study_months:null,start_default:null,      exam_default:"2026-11", detail:"2 weeks review only" },
  { id:"mba-app",       title:"MBA Application",                cat:"academic",   type:"milestone", xp:0,   study_months:null,start_default:null,      exam_default:"2026-12", detail:"Submit to KSU" },
  { id:"mba-start",     title:"🎓 MBA STARTS",                  cat:"academic",   type:"milestone", xp:0,   study_months:null,start_default:null,      exam_default:"2027-09", detail:"KSU · 2 years · Finance track · 80,000 SAR" },
  // Management
  { id:"strategy",      title:"Strategy & Business Planning",   cat:"management", type:"course",    xp:50,  study_months:null,start_default:null,      exam_default:"2026-08", detail:"5-day course" },
  { id:"kpi",           title:"KPI / Performance Management",   cat:"management", type:"course",    xp:50,  study_months:null,start_default:null,      exam_default:"2026-12", detail:"5-day course" },
  // Leadership
  { id:"misk-end",      title:"Misk 10X Leaders",               cat:"leadership", type:"milestone", xp:100, study_months:null,start_default:"2026-08", exam_default:"2027-01", detail:"Aug 2026 – Jan 2027 · CMI Certified · 11,500 SAR" },
  // Tech / AI
  { id:"alteryx-core",  title:"Alteryx Designer Core",          cat:"tech",       type:"exam",      xp:100, study_months:1,  start_default:"2026-10", exam_default:"2026-11", detail:"Free · Alteryx Academy · Must Have for CA analytics" },
  { id:"aigp-exam",     title:"AIGP",                           cat:"tech",       type:"exam",      xp:100, study_months:3,  start_default:"2026-09", exam_default:"2026-12", detail:"AI Governance · IAPP · $799 non-member" },
  { id:"pl300-exam",    title:"Power BI PL-300",                cat:"tech",       type:"exam",      xp:100, study_months:3,  start_default:"2026-10", exam_default:"2027-01", detail:"Microsoft · ~$165 · Must Have for CA dashboards" },
  { id:"togaf-exam",    title:"TOGAF Foundation",               cat:"tech",       type:"exam",      xp:100, study_months:3,  start_default:"2027-07", exam_default:"2027-10", detail:"$400 · The Open Group · Part 1" },
  // Audit
  { id:"coso",          title:"COSO Internal Control & ERM",    cat:"audit",      type:"course",    xp:100, study_months:null,start_default:null,      exam_default:"2027-01", detail:"5-day course · company coverage possible" },
  { id:"control",       title:"Control Design & Effectiveness", cat:"audit",      type:"course",    xp:100, study_months:null,start_default:null,      exam_default:"2027-01", detail:"5-day course · company coverage possible" },
  { id:"iia-literacy",  title:"IIA Data Literacy Certificate",  cat:"audit",      type:"exam",      xp:50,  study_months:1,  start_default:"2027-02", exam_default:"2027-03", detail:"IIA · self-paced · member pricing" },
  { id:"iia-analytics", title:"IIA Data Analytics Certificate", cat:"audit",      type:"exam",      xp:50,  study_months:1,  start_default:"2027-03", exam_default:"2027-04", detail:"IIA · 16 CPE hours · Excel, SQL, Power BI, AI" },
  { id:"qaip",          title:"QAIP / Internal Audit Quality",  cat:"audit",      type:"course",    xp:50,  study_months:null,start_default:null,      exam_default:"2027-07", detail:"5-day course · completes audit profile" },
  { id:"cobit",         title:"COBIT Foundation",               cat:"audit",      type:"exam",      xp:50,  study_months:1,  start_default:"2027-10", exam_default:"2027-11", detail:"ISACA · $175 · governance track" },
  // CIA
  { id:"cia1-exam",     title:"CIA Part 1",                     cat:"cia",        type:"exam",      xp:200, study_months:3,  start_default:"2027-01", exam_default:"2027-04", detail:"IIA member $255 · IIA Standards & Ethics & Governance" },
  { id:"cia2-exam",     title:"CIA Part 2",                     cat:"cia",        type:"exam",      xp:200, study_months:3,  start_default:"2027-04", exam_default:"2027-07", detail:"IIA member $255 · Internal Audit Practice" },
  { id:"cia3-exam",     title:"CIA Part 3",                     cat:"cia",        type:"exam",      xp:200, study_months:3,  start_default:"2027-12", exam_default:"2028-03", detail:"IIA member $255 · Business Knowledge · broadest content" },
  { id:"cia-done",      title:"🏆 CIA COMPLETE",                cat:"cia",        type:"milestone", xp:0,   study_months:null,start_default:null,      exam_default:"2028-03", detail:"All 3 parts · 24-month experience ✅ · Official CIA 🎉" },
  { id:"cisa-exam",     title:"CISA",                           cat:"audit",      type:"exam",      xp:150, study_months:3,  start_default:"2029-01", exam_default:"2029-04", detail:"ISACA · $575 member · IT Audit · after CIA + MBA" },
  // Brand Track
  { id:"brand-post-1",  title:"LinkedIn Post #1 — ATHEER PoC", cat:"brand",      type:"brand",     xp:50,  study_months:null,start_default:null,      exam_default:"2026-06", detail:"✅ Done! First public post on AI in Internal Audit · Jun 2026" },
  { id:"brand-post-2",  title:"LinkedIn Post #2 — GenAI in IA",cat:"brand",      type:"brand",     xp:50,  study_months:null,start_default:null,      exam_default:"2026-09", detail:"Q3 2026 · lesson from GenAI in Internal Audit" },
  { id:"brand-session-1",title:"Internal Knowledge Session",   cat:"brand",      type:"brand",     xp:75,  study_months:null,start_default:null,      exam_default:"2026-10", detail:"Lunch & Learn or Knowledge Sharing · internal only" },
  { id:"brand-post-3",  title:"LinkedIn Post #3 — CA Framework",cat:"brand",     type:"brand",     xp:50,  study_months:null,start_default:null,      exam_default:"2026-12", detail:"Q4 2026 · framework from Continuous Auditing" },
  { id:"brand-post-4",  title:"LinkedIn Post #4 — AIGP Lessons",cat:"brand",     type:"brand",     xp:50,  study_months:null,start_default:null,      exam_default:"2027-01", detail:"Q1 2027 · something learned from AIGP journey" },
  { id:"saudi-speakers",title:"Saudi Speakers Fellowship",     cat:"brand",      type:"brand",     xp:100, study_months:null,start_default:"2026-08", exam_default:"2027-02", detail:"saudispeakers.info/fellowship · Opens Aug 8 2026 · Executive Presence & Thought Leadership" },
  { id:"brand-article", title:"Professional Article",          cat:"brand",      type:"brand",     xp:100, study_months:null,start_default:null,      exam_default:"2027-06", detail:"e.g. Continuous Auditing: From Data to Assurance · or AI Governance in IA" },
  { id:"brand-pres-1",  title:"Internal Formal Presentation",  cat:"brand",      type:"brand",     xp:75,  study_months:null,start_default:null,      exam_default:"2027-06", detail:"Real presentation · not a meeting · inside Mobily" },
  { id:"brand-conf-1",  title:"Conference Attendance",         cat:"brand",      type:"brand",     xp:75,  study_months:null,start_default:null,      exam_default:"2027-09", detail:"One professional conference · attendance only · IIA or ISACA" },
  { id:"brand-speaker", title:"Conference Speaker",            cat:"brand",      type:"brand",     xp:150, study_months:null,start_default:null,      exam_default:"2028-06", detail:"Even a small session · after CIA + MBA" },
  { id:"brand-playbook",title:"Publish CA Playbook",           cat:"brand",      type:"brand",     xp:150, study_months:null,start_default:null,      exam_default:"2028-09", detail:"Clean version of the Continuous Auditing Playbook" },
  { id:"brand-webinar", title:"Webinar",                       cat:"brand",      type:"brand",     xp:100, study_months:null,start_default:null,      exam_default:"2028-11", detail:"Online session · Audit + AI topic" },
  // Readings
  { id:"read-iia-std",  title:"IIA Global Standards 2024",     cat:"reading",    type:"reading",   xp:25,  study_months:null,start_default:null,      exam_default:"2026-12", detail:"Read before CIA Part 1 · theiia.org/en/standards/" },
  { id:"read-gtag",     title:"GTAG: Data Analysis for IA",    cat:"reading",    type:"reading",   xp:25,  study_months:null,start_default:null,      exam_default:"2026-11", detail:"Read with Alteryx · theiia.org/gtag" },
  { id:"read-coso-ic",  title:"COSO Internal Control 2013",    cat:"reading",    type:"reading",   xp:25,  study_months:null,start_default:null,      exam_default:"2027-01", detail:"Read with COSO course · coso.org" },
  { id:"read-coso-erm", title:"COSO ERM 2017",                 cat:"reading",    type:"reading",   xp:25,  study_months:null,start_default:null,      exam_default:"2027-01", detail:"Read with COSO course · coso.org" },
  { id:"read-da-gpg",   title:"IIA Data Analytics Skills GPG", cat:"reading",    type:"reading",   xp:25,  study_months:null,start_default:null,      exam_default:"2027-04", detail:"Read with IIA Data Analytics Certificate · May 2026" },
  { id:"read-comp-gpg", title:"IIA Competency Framework GPG",  cat:"reading",    type:"reading",   xp:25,  study_months:null,start_default:null,      exam_default:"2027-04", detail:"Read with CIA Part 1 · theiia.org" },
  { id:"read-ca-guide", title:"IIA CA Practice Guide",         cat:"reading",    type:"reading",   xp:25,  study_months:null,start_default:null,      exam_default:"2027-07", detail:"Read with QAIP · theiia.org/resources" },
  { id:"read-acfe",     title:"ACFE Report to the Nations",    cat:"reading",    type:"reading",   xp:25,  study_months:null,start_default:null,      exam_default:"2027-07", detail:"Read with CIA Part 2 · acfe.com · biennial" },
];

const CAT = {
  admission:  { bg:"#FEF3C7", border:"#D97706", text:"#78350F", dot:"#D97706", label:"Admission",  icon:"🎓" },
  audit:      { bg:"#EDE9FE", border:"#7C3AED", text:"#3B0764", dot:"#7C3AED", label:"Audit",      icon:"🔍" },
  management: { bg:"#DCFCE7", border:"#16A34A", text:"#14532D", dot:"#16A34A", label:"Management", icon:"📊" },
  tech:       { bg:"#DBEAFE", border:"#2563EB", text:"#1E3A8A", dot:"#2563EB", label:"Tech / AI",  icon:"🤖" },
  leadership: { bg:"#FCE7F3", border:"#DB2777", text:"#831843", dot:"#DB2777", label:"Leadership", icon:"👑" },
  cia:        { bg:"#FEE2E2", border:"#DC2626", text:"#7F1D1D", dot:"#DC2626", label:"CIA",        icon:"🏆" },
  academic:   { bg:"#CCFBF1", border:"#0D9488", text:"#134E4A", dot:"#0D9488", label:"Academic",   icon:"🎓" },
  reading:    { bg:"#F0FDF4", border:"#15803D", text:"#14532D", dot:"#15803D", label:"Reading",    icon:"📚" },
  brand:      { bg:"#FFF7ED", border:"#EA580C", text:"#7C2D12", dot:"#EA580C", label:"Brand",      icon:"🌟" },
};

const TYPE_META = {
  study:     { label:"Study",     bg:"#F1F5F9", color:"#64748B" },
  exam:      { label:"EXAM",      bg:"#FEE2E2", color:"#DC2626" },
  course:    { label:"Course",    bg:"#DCFCE7", color:"#16A34A" },
  milestone: { label:"Milestone", bg:"#FEF9C3", color:"#D97706" },
  reading:   { label:"Reading",   bg:"#F0FDF4", color:"#15803D" },
  brand:     { label:"Brand",     bg:"#FFF7ED", color:"#EA580C" },
};

// Digital Assurance Leader requirements
const DAL_REQUIRES = [
  { id:"cia-done",      label:"CIA Complete" },
  { id:"aigp-exam",     label:"AIGP" },
  { id:"mba-start",     label:"MBA Started" },
  { id:"brand-playbook",label:"CA Playbook Published" },
  { id:"iia-analytics", label:"Audit Analytics Skills" },
  { id:"togaf-exam",    label:"Technology Governance (TOGAF)" },
  { id:"brand-speaker", label:"Conference Speaker" },
  { id:"brand-article", label:"Professional Article" },
];

const BADGES = [
  // Brand milestones
  { id:"badge-first-post",  icon:"✍️", name:"First Public Post",        desc:"Published first post on AI in Internal Audit · ✅ Jun 2026", requires:["brand-post-1"], color:"#EA580C" },
  { id:"badge-contributor", icon:"🥉", name:"Knowledge Contributor",    desc:"4 LinkedIn posts + 1 internal session",                      requires:["brand-post-1","brand-post-2","brand-post-3","brand-post-4","brand-session-1"], color:"#EA580C" },
  { id:"badge-thought",     icon:"🥈", name:"Emerging Thought Leader",  desc:"Article + formal presentation + conference attendance",       requires:["brand-article","brand-pres-1","brand-conf-1"], color:"#EA580C" },
  { id:"badge-innovation",  icon:"🥇", name:"Audit Innovation Leader",  desc:"Conference speaker + webinar + CA Playbook published",        requires:["brand-speaker","brand-webinar","brand-playbook"], color:"#EA580C" },
  // Professional
  { id:"badge-admission",   icon:"🎓", name:"Admission Master",         desc:"Pass Qudurat, IELTS & GMAT",                                  requires:["qudurat-exam","ielts-exam","gmat-exam"], color:"#D97706" },
  { id:"badge-misk",        icon:"👑", name:"Misk 10X Graduate",        desc:"Complete Misk 10X Leaders program",                           requires:["misk-end"], color:"#DB2777" },
  { id:"badge-speakers",    icon:"🎤", name:"Saudi Speakers Fellow",    desc:"Complete Saudi Speakers Fellowship",                          requires:["saudi-speakers"], color:"#EA580C" },
  { id:"badge-aigp",        icon:"🤖", name:"AI Pioneer",               desc:"Pass AIGP certification",                                     requires:["aigp-exam"], color:"#2563EB" },
  { id:"badge-alteryx",     icon:"⚙️", name:"Alteryx Certified",        desc:"Pass Alteryx Designer Core",                                  requires:["alteryx-core"], color:"#2563EB" },
  { id:"badge-powerbi",     icon:"📊", name:"Power BI Pro",             desc:"Pass PL-300",                                                 requires:["pl300-exam"], color:"#2563EB" },
  { id:"badge-audit",       icon:"🔍", name:"Audit Champion",           desc:"Complete all audit courses & certificates",                   requires:["cobit","coso","control","qaip","iia-literacy","iia-analytics"], color:"#7C3AED" },
  { id:"badge-togaf",       icon:"🏗️", name:"Architect",               desc:"Pass TOGAF Foundation",                                       requires:["togaf-exam"], color:"#2563EB" },
  { id:"badge-reader",      icon:"📚", name:"Knowledge Base",           desc:"Complete all 8 readings",                                     requires:["read-iia-std","read-coso-ic","read-coso-erm","read-gtag","read-ca-guide","read-comp-gpg","read-da-gpg","read-acfe"], color:"#15803D" },
  { id:"badge-cia1",        icon:"⭐", name:"CIA Part 1",               desc:"Pass CIA Part 1",                                             requires:["cia1-exam"], color:"#DC2626" },
  { id:"badge-cia2",        icon:"⭐⭐","name":"CIA Parts 1 & 2",        desc:"Pass CIA Parts 1 and 2",                                      requires:["cia1-exam","cia2-exam"], color:"#DC2626" },
  { id:"badge-cia",         icon:"🏆", name:"CIA Legend",               desc:"Complete all 3 CIA parts",                                    requires:["cia1-exam","cia2-exam","cia3-exam"], color:"#DC2626" },
  { id:"badge-mba",         icon:"🎓", name:"MBA Scholar",              desc:"Start MBA at KSU",                                            requires:["mba-start"], color:"#0D9488" },
];

const REWARDS = [
  { xp:500,  icon:"🧖‍♀️", title:"Luxury Spa Day",  bg:"#DCFCE7", color:"#14532D", border:"#16A34A" },
  { xp:1000, icon:"💛",  title:"Gold Bracelet",   bg:"#FEF9C3", color:"#78350F", border:"#D97706" },
  { xp:2000, icon:"✈️",  title:"Trip 🏆",          bg:"#EDE9FE", color:"#3B0764", border:"#7C3AED" },
];

const addMonths = (ym, n) => {
  const [y,m] = ym.split("-").map(Number);
  const d = new Date(y, m-1+n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
};
const ymLabel = (ym) => {
  if (!ym) return "";
  const [y,m] = ym.split("-").map(Number);
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m-1]+" "+y;
};
const getStart = (p, overrides) => {
  if (overrides[p.id+"_start"]) return overrides[p.id+"_start"];
  const examMonth = overrides[p.id] || p.exam_default;
  if (p.start_default) return p.start_default;
  if (p.study_months) return addMonths(examMonth, -p.study_months);
  return null;
};
const buildCalendar = (plan, overrides) => {
  const entries = [];
  plan.forEach(p => {
    const examMonth = overrides[p.id] || p.exam_default;
    const startMonth = getStart(p, overrides);
    entries.push({ ...p, month: examMonth, examMonth, isStudy: false });
    if (startMonth && startMonth < examMonth) {
      let cur = startMonth; let idx = 1;
      while (cur < examMonth) {
        entries.push({ ...p, id:`${p.id}-s${idx}`, month:cur, title:`${p.title} — Study`, type:"study", xp:0, isStudy:true, parentId:p.id });
        cur = addMonths(cur,1); idx++;
      }
    }
  });
  return entries.sort((a,b) => a.month.localeCompare(b.month) || (a.isStudy?-1:1));
};
const getAllMonths = (plan, overrides) => {
  const set = new Set();
  plan.forEach(p => {
    const examMonth = overrides[p.id] || p.exam_default;
    const startMonth = getStart(p, overrides);
    set.add(examMonth);
    if (startMonth) { let cur=startMonth; while(cur<=examMonth){set.add(cur);cur=addMonths(cur,1);} }
  });
  return [...set].sort();
};
const monthOptions = [];
for(let y=2026;y<=2030;y++) for(let m=1;m<=12;m++)
  monthOptions.push(`${y}-${String(m).padStart(2,"0")}`);
const TOTAL_POSSIBLE = BASE_PLAN.filter(p=>p.xp>0).reduce((a,b)=>a+b.xp,0);

export default function App() {
  const [done, setDone]             = useState({});
  const [overrides, setOverrides]   = useState({});
  const [expanded, setExpanded]     = useState({});
  const [filter, setFilter]         = useState("all");
  const [view, setView]             = useState("calendar");
  const [loaded, setLoaded]         = useState(false);
  const [syncStatus, setSyncStatus] = useState("synced");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("pdp_progress").select("*").eq("id","ghada").single();
      if (data) { setDone(data.done||{}); setOverrides(data.overrides||{}); }
      // Auto-unlock first post
      setDone(d => ({ ...d, "brand-post-1": true }));
      setLoaded(true);
    })();
  }, []);

  const saveProgress = async (newDone, newOverrides) => {
    setSyncStatus("saving");
    await supabase.from("pdp_progress").upsert({ id:"ghada", done:newDone, overrides:newOverrides, updated_at:new Date().toISOString() });
    setSyncStatus("synced");
  };

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next); saveProgress(next, overrides);
  };
  const updateOverride = (id, val) => {
    const next = { ...overrides, [id]: val };
    setOverrides(next); saveProgress(done, next);
  };
  const removeOverride = (id) => {
    const next = { ...overrides };
    delete next[id]; delete next[id+"_start"];
    setOverrides(next); saveProgress(done, next);
  };

  const calendar   = useMemo(() => buildCalendar(BASE_PLAN, overrides), [overrides]);
  const allMonths  = useMemo(() => getAllMonths(BASE_PLAN, overrides), [overrides]);
  const earnedXP   = BASE_PLAN.filter(p=>done[p.id]&&p.xp>0).reduce((a,b)=>a+b.xp,0);
  const pct        = Math.round((earnedXP/TOTAL_POSSIBLE)*100);
  const unlockedB  = (b) => b.requires.every(r=>done[r]);
  const unlockedR  = (r) => earnedXP>=r.xp;
  const dalProgress = DAL_REQUIRES.filter(r=>done[r.id]).length;
  const dalPct     = Math.round((dalProgress/DAL_REQUIRES.length)*100);
  const dalDone    = dalProgress === DAL_REQUIRES.length;
  const years      = [...new Set(allMonths.map(m=>m.split("-")[0]))].sort();

  const getMonthItems = (monthId) => {
    const items = calendar.filter(p=>p.month===monthId);
    if (filter==="all") return items;
    if (filter==="exam") return items.filter(i=>i.type==="exam");
    if (filter==="reading") return items.filter(i=>i.cat==="reading");
    if (filter==="brand") return items.filter(i=>i.cat==="brand");
    return items.filter(i=>i.cat===filter);
  };
  const getLoad = (monthId) => {
    const items = calendar.filter(p=>p.month===monthId);
    const active = items.filter(i=>i.type==="exam"||i.type==="reading"||i.type==="brand").length;
    if (items.length>=4||active>=3) return { bg:"#FEE2E2", border:"#DC2626", label:"Heavy ⚠️" };
    if (items.length>=2||active>=1) return { bg:"#FEF9C3", border:"#D97706", label:"Medium" };
    return { bg:"#F0FDF4", border:"#16A34A", label:"Light" };
  };

  if (!loaded) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"system-ui",flexDirection:"column",gap:12 }}>
      <div style={{ width:40,height:40,border:"3px solid #EDE9FE",borderTop:"3px solid #7C3AED",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily:"system-ui,sans-serif",background:"#F8FAFC",minHeight:"100vh",paddingBottom:48 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#7C3AED,#2563EB)",padding:"22px 18px 18px",color:"#fff" }}>
        <div style={{ maxWidth:860,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10,letterSpacing:2,opacity:0.7,marginBottom:3,textTransform:"uppercase" }}>Professional Development Plan</div>
              <div style={{ fontSize:20,fontWeight:800,marginBottom:10 }}>Ghada · 2026 – 2029</div>
            </div>
            <div style={{ fontSize:10,display:"flex",alignItems:"center",gap:5,opacity:0.8,marginTop:4 }}>
              {syncStatus==="saving"
                ?<><div style={{ width:8,height:8,borderRadius:"50%",border:"1.5px solid #fff",borderTop:"1.5px solid transparent",animation:"spin 0.8s linear infinite" }}/>Saving…</>
                :<><div style={{ width:8,height:8,borderRadius:"50%",background:"#34D399" }}/>Synced</>}
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.2)",borderRadius:20,height:10,marginBottom:6,overflow:"hidden" }}>
            <div style={{ height:"100%",borderRadius:20,background:"#FCD34D",width:`${pct}%`,transition:"width 0.5s" }}/>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,opacity:0.85,marginBottom:12 }}>
            <span>⚡ {earnedXP} / {TOTAL_POSSIBLE} XP</span><span>{pct}%</span>
          </div>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {[
              ["⚡ "+earnedXP,"XP","rgba(252,211,77,0.25)","#FCD34D"],
              [Object.values(done).filter(Boolean).length+"/"+BASE_PLAN.length,"Done","rgba(52,211,153,0.25)","#34D399"],
              [BADGES.filter(b=>unlockedB(b)).length+"/"+BADGES.length,"Badges","rgba(244,114,182,0.25)","#F472B6"],
              [dalPct+"%","DAL Progress","rgba(234,88,12,0.25)","#FED7AA"],
            ].map(([v,l,bg,c])=>(
              <div key={l} style={{ background:bg,borderRadius:9,padding:"6px 11px" }}>
                <div style={{ fontSize:14,fontWeight:800,color:c }}>{v}</div>
                <div style={{ fontSize:9,opacity:0.8 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background:"#fff",borderBottom:"1px solid #E2E8F0",overflowX:"auto" }}>
        <div style={{ maxWidth:860,margin:"0 auto",display:"flex",minWidth:"max-content" }}>
          {[["calendar","📅 Calendar"],["badges","🏅 Badges"],["rewards","🎁 Rewards"],["settings","⚙️ Settings"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:"11px 16px",border:"none",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap",color:view===v?"#7C3AED":"#64748B",borderBottom:view===v?"2px solid #7C3AED":"2px solid transparent" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:860,margin:"0 auto",padding:"18px 14px" }}>

        {/* ══ CALENDAR ══ */}
        {view==="calendar" && (<>
          <div style={{ display:"flex",gap:7,flexWrap:"wrap",marginBottom:16 }}>
            {[["all","All"],["exam","🎯 Exams"],["brand","🌟 Brand"],["reading","📚 Readings"],["cia","🏆 CIA"],["tech","🤖 Tech/AI"],["audit","🔍 Audit"],["admission","🎓 Admission"]].map(([id,l])=>(
              <button key={id} onClick={()=>setFilter(id)} style={{ padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:filter===id?"#7C3AED":"#EDE9FE",color:filter===id?"#fff":"#4C1D95" }}>{l}</button>
            ))}
          </div>
          {years.map(year=>{
            const yearMonths = allMonths.filter(m=>m.startsWith(year));
            return (
              <div key={year} style={{ marginBottom:26 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                  <div style={{ background:year==="2026"?"#7C3AED":year==="2027"?"#2563EB":year==="2028"?"#DC2626":"#0D9488",color:"#fff",borderRadius:7,padding:"3px 13px",fontWeight:800,fontSize:13 }}>{year}</div>
                  {year==="2027"&&<span style={{ fontSize:10,color:"#0D9488",fontWeight:600,background:"#CCFBF1",padding:"2px 7px",borderRadius:7 }}>🎓 MBA Sep</span>}
                  {year==="2028"&&<span style={{ fontSize:10,color:"#DC2626",fontWeight:600,background:"#FEE2E2",padding:"2px 7px",borderRadius:7 }}>🏆 CIA Mar</span>}
                  <div style={{ flex:1,height:1,background:"#E2E8F0" }}/>
                  <span style={{ fontSize:10,color:"#78350F",background:"#FEF9C3",padding:"2px 7px",borderRadius:7,fontWeight:600 }}>
                    ⚡{BASE_PLAN.filter(p=>p.xp>0&&done[p.id]&&(overrides[p.id]||p.exam_default).startsWith(year)).reduce((a,b)=>a+b.xp,0)}/{BASE_PLAN.filter(p=>p.xp>0&&(overrides[p.id]||p.exam_default).startsWith(year)).reduce((a,b)=>a+b.xp,0)}
                  </span>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:9 }}>
                  {yearMonths.map(monthId=>{
                    const items=getMonthItems(monthId);
                    const allItems=calendar.filter(p=>p.month===monthId);
                    const load=getLoad(monthId);
                    const isEmpty=allItems.length===0;
                    const doneCount=allItems.filter(i=>done[i.isStudy?i.parentId:i.id]).length;
                    return (
                      <div key={monthId} style={{ background:"#fff",borderRadius:11,border:`1.5px solid ${isEmpty?"#E2E8F0":load.border}`,overflow:"hidden",opacity:isEmpty?0.3:1,boxShadow:isEmpty?"none":"0 1px 4px rgba(0,0,0,0.05)" }}>
                        <div style={{ background:isEmpty?"#F8FAFC":load.bg,padding:"9px 12px",borderBottom:`1px solid ${isEmpty?"#E2E8F0":load.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                          <div style={{ fontWeight:700,fontSize:13,color:isEmpty?"#94A3B8":"#0F172A" }}>{ymLabel(monthId)}</div>
                          {!isEmpty&&<div style={{ display:"flex",gap:5,alignItems:"center" }}>
                            {doneCount>0&&<span style={{ fontSize:9,background:"#DCFCE7",color:"#14532D",fontWeight:700,padding:"1px 5px",borderRadius:6 }}>✓{doneCount}/{allItems.length}</span>}
                            <span style={{ fontSize:9,color:load.border,fontWeight:600 }}>{load.label}</span>
                          </div>}
                        </div>
                        {!isEmpty&&items.length>0&&(
                          <div style={{ padding:"7px 8px",display:"flex",flexDirection:"column",gap:5 }}>
                            {items.map(item=>{
                              const cc=CAT[item.cat]||CAT.audit;
                              const tc=TYPE_META[item.type]||TYPE_META.study;
                              const checkId=item.isStudy?item.parentId:item.id;
                              const isDone=!!done[checkId];
                              const isExp=!!expanded[item.id];
                              return (
                                <div key={item.id} style={{ background:isDone?"#F0FDF4":isExp?cc.bg:"#F8FAFC",border:`1px solid ${isDone?"#16A34A":isExp?cc.border:"#E2E8F0"}`,borderLeft:`3px solid ${isDone?"#16A34A":cc.dot}`,borderRadius:8,padding:"7px 8px",opacity:isDone?0.75:1 }}>
                                  <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                                    {!item.isStudy?(
                                      <div onClick={()=>toggle(item.id)} style={{ width:17,height:17,borderRadius:4,flexShrink:0,border:`1.5px solid ${isDone?"#16A34A":cc.dot}`,background:isDone?"#16A34A":"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:10,color:"#fff",fontWeight:800 }}>{isDone&&"✓"}</div>
                                    ):(
                                      <div style={{ width:17,height:17,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ width:5,height:5,borderRadius:"50%",background:isDone?"#16A34A":cc.dot }}/></div>
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
            {/* Digital Assurance Leader — Final Achievement */}
            <div style={{ background: dalDone?"linear-gradient(135deg,#FFF7ED,#FEF3C7)":"#F8FAFC", border:`2px solid ${dalDone?"#EA580C":"#E2E8F0"}`, borderRadius:16, padding:"20px 18px", marginBottom:24, boxShadow:dalDone?"0 8px 24px rgba(234,88,12,0.2)":"none" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
                <div style={{ fontSize:36, filter:dalDone?"none":"grayscale(1) opacity(0.3)" }}>🌟</div>
                <div>
                  <div style={{ fontWeight:800,fontSize:16,color:dalDone?"#7C2D12":"#94A3B8" }}>Digital Assurance Leader</div>
                  <div style={{ fontSize:11,color:dalDone?"#EA580C":"#CBD5E1",marginTop:2 }}>The ultimate achievement — combines everything</div>
                </div>
                {dalDone&&<div style={{ marginLeft:"auto",fontSize:24 }}>🎉</div>}
              </div>
              {/* Progress bar */}
              <div style={{ background:"#E2E8F0",borderRadius:20,height:8,marginBottom:10,overflow:"hidden" }}>
                <div style={{ height:"100%",borderRadius:20,background:dalDone?"linear-gradient(90deg,#EA580C,#F59E0B)":"#EA580C",width:`${dalPct}%`,transition:"width 0.5s" }}/>
              </div>
              <div style={{ fontSize:10,color:"#94A3B8",marginBottom:12,textAlign:"right" }}>{dalProgress}/{DAL_REQUIRES.length} requirements · {dalPct}%</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                {DAL_REQUIRES.map(r=>(
                  <div key={r.id} style={{ display:"flex",alignItems:"center",gap:5,background:done[r.id]?"#DCFCE7":"#F1F5F9",borderRadius:20,padding:"4px 10px" }}>
                    <span style={{ fontSize:10 }}>{done[r.id]?"✅":"⬜"}</span>
                    <span style={{ fontSize:10,fontWeight:600,color:done[r.id]?"#14532D":"#94A3B8" }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize:12,color:"#64748B",marginBottom:16 }}><strong style={{ color:"#7C3AED" }}>{BADGES.filter(b=>unlockedB(b)).length}/{BADGES.length}</strong> badges unlocked</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:10 }}>
              {BADGES.map(b=>{
                const unlocked=unlockedB(b); const progress=b.requires.filter(r=>done[r]).length;
                return (
                  <div key={b.id} style={{ background:unlocked?"#fff":"#F8FAFC",border:`2px solid ${unlocked?b.color:"#E2E8F0"}`,borderRadius:14,padding:"16px 14px",textAlign:"center",boxShadow:unlocked?`0 4px 14px ${b.color}25`:"none",transition:"all 0.2s" }}>
                    <div style={{ fontSize:32,marginBottom:7,filter:unlocked?"none":"grayscale(1) opacity(0.25)" }}>{b.icon}</div>
                    <div style={{ fontWeight:800,fontSize:12,color:unlocked?b.color:"#94A3B8",marginBottom:3 }}>{b.name}</div>
                    <div style={{ fontSize:10,color:unlocked?"#64748B":"#CBD5E1",marginBottom:9,lineHeight:1.4 }}>{b.desc}</div>
                    {unlocked?<div style={{ fontSize:10,fontWeight:700,color:b.color,background:b.color+"15",borderRadius:20,padding:"3px 10px",display:"inline-block" }}>✓ Unlocked!</div>:(
                      <div>
                        <div style={{ height:4,background:"#E2E8F0",borderRadius:4,marginBottom:4,overflow:"hidden" }}><div style={{ height:"100%",background:b.color,borderRadius:4,width:`${(progress/b.requires.length)*100}%` }}/></div>
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
              <div style={{ background:"#F1F5F9",borderRadius:20,height:11,overflow:"hidden",marginBottom:3 }}><div style={{ height:"100%",borderRadius:20,background:"linear-gradient(90deg,#FCD34D,#F59E0B)",width:`${pct}%`,transition:"width 0.5s" }}/></div>
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
                    {!unlocked&&<div style={{ marginTop:7 }}>
                      <div style={{ background:"#E2E8F0",borderRadius:20,height:5,overflow:"hidden" }}><div style={{ height:"100%",background:r.border,borderRadius:20,width:`${Math.min((earnedXP/r.xp)*100,100)}%` }}/></div>
                      <div style={{ fontSize:10,color:"#94A3B8",marginTop:3 }}>{r.xp-earnedXP} XP to go</div>
                    </div>}
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
            <div style={{ fontSize:12,color:"#64748B",marginBottom:4 }}>Edit <strong>start date</strong> or <strong>exam/target month</strong> — calendar updates automatically.</div>
            <div style={{ fontSize:11,color:"#94A3B8",marginBottom:18 }}>Changes sync to all your devices.</div>
            {Object.entries(CAT).map(([catId,cc])=>{
              const catItems=BASE_PLAN.filter(p=>p.cat===catId);
              if(!catItems.length) return null;
              return (
                <div key={catId} style={{ marginBottom:20 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:10,paddingBottom:7,borderBottom:`2px solid ${cc.border}` }}>
                    <span style={{ fontSize:15 }}>{cc.icon}</span>
                    <span style={{ fontWeight:700,fontSize:12,color:cc.text }}>{cc.label}</span>
                  </div>
                  {catItems.map(p=>{
                    const curExam=overrides[p.id]||p.exam_default;
                    const curStart=overrides[p.id+"_start"]||(p.start_default?p.start_default:(p.study_months?addMonths(curExam,-p.study_months):null));
                    const modified=!!(overrides[p.id]||overrides[p.id+"_start"]);
                    const hasStudy=!!(p.study_months||p.start_default);
                    return (
                      <div key={p.id} style={{ background:"#fff",border:`1px solid ${modified?cc.border:"#E2E8F0"}`,borderLeft:`3px solid ${modified?cc.dot:"#E2E8F0"}`,borderRadius:10,padding:"10px 12px",marginBottom:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap" }}>
                        <div style={{ flex:1,minWidth:140 }}>
                          <div style={{ fontSize:12,fontWeight:600,color:"#0F172A" }}>{p.title}</div>
                          <div style={{ fontSize:10,color:"#94A3B8",marginTop:1 }}>{p.type}{modified&&<span style={{ color:cc.dot,marginLeft:5,fontWeight:600 }}>· modified</span>}</div>
                        </div>
                        <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
                          {hasStudy&&curStart&&(
                            <div>
                              <div style={{ fontSize:9,color:"#94A3B8",marginBottom:2,textAlign:"center" }}>Start</div>
                              <select value={curStart} onChange={e=>updateOverride(p.id+"_start",e.target.value)} style={{ border:"1.5px solid #E2E8F0",borderRadius:7,padding:"5px 7px",fontSize:11,fontWeight:600,color:"#334155",background:"#F8FAFC",cursor:"pointer",outline:"none" }}>
                                {monthOptions.map(m=><option key={m} value={m}>{ymLabel(m)}</option>)}
                              </select>
                            </div>
                          )}
                          {hasStudy&&curStart&&<span style={{ fontSize:11,color:"#CBD5E1" }}>→</span>}
                          <div>
                            <div style={{ fontSize:9,color:"#94A3B8",marginBottom:2,textAlign:"center" }}>{p.type==="exam"?"Exam":p.type==="milestone"?"Target":p.type==="reading"?"Read by":"Month"}</div>
                            <select value={curExam} onChange={e=>updateOverride(p.id,e.target.value)} style={{ border:`1.5px solid ${cc.border}`,borderRadius:7,padding:"5px 7px",fontSize:11,fontWeight:600,color:cc.text,background:cc.bg,cursor:"pointer",outline:"none" }}>
                              {monthOptions.map(m=><option key={m} value={m}>{ymLabel(m)}</option>)}
                            </select>
                          </div>
                          {modified&&<button onClick={()=>removeOverride(p.id)} style={{ border:"none",background:"#FEE2E2",color:"#DC2626",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600 }}>Reset</button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div style={{ marginTop:20,paddingTop:16,borderTop:"1px solid #E2E8F0",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ fontSize:11,color:"#94A3B8" }}>{Object.keys(overrides).length} custom setting(s)</div>
              {Object.keys(overrides).length>0&&<button onClick={()=>{setOverrides({});saveProgress(done,{});}} style={{ border:"1.5px solid #DC2626",background:"#FEE2E2",color:"#DC2626",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:600 }}>Reset all</button>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
