import React, { useState, useMemo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Mic, Send, ChevronRight, ChevronLeft, Briefcase, Users, CheckCircle2,
  XCircle, Clock, FileText, ArrowLeft, Sparkles, Building2, MapPin,
} from "lucide-react";

/* ---------------------------------------------------------
   1. TAXONOMY — flattened from the provided internship dictionary
--------------------------------------------------------- */
const INTERNSHIP_DICTIONARY = {
  "Engineering & Technology": {
    "Software & Computer Science": ["SDE Intern","Software Engineer Intern","Software Development Intern","Backend Developer Intern","Frontend Developer Intern","Full Stack Developer Intern","Web Developer Intern","Mobile App Developer Intern","Android Developer Intern","iOS Developer Intern","React Developer Intern","Java Developer Intern","Python Developer Intern","C++ Developer Intern","MERN Stack Intern","DevOps Intern","Cloud Engineering Intern","Site Reliability Engineering Intern","Platform Engineering Intern","QA / Testing Intern","Automation Testing Intern","Cybersecurity Intern","Information Security Intern","Ethical Hacking Intern","Network Security Intern","Blockchain Intern","Web3 Intern","Game Development Intern","AR/VR Intern","Systems Engineering Intern"],
    "AI ML & Data": ["AI/ML Intern","Machine Learning Engineer Intern","AI Engineer Intern","Deep Learning Intern","Generative AI Intern","LLM Engineer Intern","NLP Intern","Computer Vision Intern","Robotics AI Intern","Reinforcement Learning Intern","MLOps Intern","Data Scientist Intern","Data Analyst Intern","Data Engineer Intern","Data Science Intern","Business Intelligence Intern","BI Analyst Intern","Analytics Intern","Product Analytics Intern","Marketing Analytics Intern","Risk Analytics Intern","Quantitative Analyst Intern","Research Scientist Intern","AI Research Intern","Data Visualization Intern","Database Intern","Big Data Intern"],
    "Electronics & Circuital": ["Electronics Engineering Intern","Embedded Systems Intern","Embedded Software Intern","VLSI Intern","VLSI Design Intern","RTL Design Intern","Physical Design Intern","Verification Intern","FPGA Intern","ASIC Design Intern","Semiconductor Intern","IC Design Intern","Analog Design Intern","Digital Design Intern","PCB Design Intern","PCB Layout Intern","Circuit Design Intern","Hardware Design Intern","Hardware Testing Intern","Electronics Testing Intern","IoT Intern","IoT Hardware Intern","Firmware Intern","Microcontroller Intern","Communication Systems Intern","Instrumentation Intern","RF Engineering Intern","Signal Processing Intern","Telecommunications Intern","5G Intern","Antenna Design Intern","Sensor Systems Intern"],
    "Mechanical Engineering": {
      "Design & CAD": ["CAD Design Intern","Mechanical Design Intern","Product Design Intern","Industrial Design Intern","3D Modelling Intern","CAD/CAM Intern","SolidWorks Intern","CATIA Intern","AutoCAD Intern","Creo Intern","NX / Siemens Intern","Design Engineering Intern","Machine Design Intern","Tool Design Intern","Fixture Design Intern"],
      "CAE & Simulation": ["CAE Intern","CFD Intern","FEA Intern","Structural Analysis Intern","Thermal Analysis Intern","Computational Mechanics Intern","Simulation Engineering Intern","ANSYS Intern","MATLAB/Simulink Intern","COMSOL Intern"],
      "Manufacturing": ["Manufacturing Engineering Intern","Production Engineering Intern","Process Engineering Intern","Industrial Engineering Intern","Manufacturing Automation Intern","CNC Intern","CNC Programming Intern","Additive Manufacturing Intern","3D Printing Intern","Robotics Manufacturing Intern","Factory Automation Intern","Quality Engineering Intern","Lean Manufacturing Intern","Six Sigma Intern","Maintenance Engineering Intern"],
      "Mechatronics": ["Mechatronics Intern","Control Systems Intern","Automation Intern","Industrial Automation Intern","PLC Programming Intern","SCADA Intern","Motion Control Intern","Machine Automation Intern"],
    },
    "Automotive": ["Automotive Engineering Intern","Automotive Design Intern","Vehicle Dynamics Intern","Vehicle Testing Intern","Powertrain Intern","Engine Development Intern","EV Engineering Intern","EV Battery Intern","Battery Technology Intern","Battery Thermal Management Intern","Electric Motor Intern","Automotive Electronics Intern","ADAS Intern","Autonomous Vehicle Intern","Automotive Software Intern","Automotive Manufacturing Intern","Automotive Quality Intern","Automotive R&D Intern","Chassis Design Intern","Suspension Design Intern","Braking Systems Intern","Thermal Systems Intern","Automotive CAE Intern","Automotive CFD Intern","Automotive Simulation Intern"],
    "Aerospace & Aviation": ["Aerospace Engineering Intern","Aerodynamics Intern","CFD Intern","Propulsion Intern","Aircraft Design Intern","Structural Analysis Intern","Flight Mechanics Intern","UAV/Drone Intern","Avionics Intern","Aerospace Manufacturing Intern","Aerospace Materials Intern","Space Technology Intern","Satellite Systems Intern","Rocket Propulsion Intern","Guidance & Navigation Intern"],
    "Defence": ["Defence Technology Intern","Defence R&D Intern","Missile Systems Intern","Defence Electronics Intern","Defence Manufacturing Intern","Weapons Systems Research Intern","Defence AI Intern","Defence Robotics Intern","Defence Materials Intern","Defence Systems Engineering Intern"],
    "Energy & Power": ["Energy Engineering Intern","Renewable Energy Intern","Solar Engineering Intern","Solar PV Intern","Wind Energy Intern","Battery Technology Intern","Energy Storage Intern","Power Systems Intern","Power Electronics Intern","Electrical Design Intern","EV Infrastructure Intern","Hydrogen Energy Intern","Fuel Cell Intern","Energy Analytics Intern","Energy Management Intern","Sustainability Engineering Intern","Carbon/Climate Technology Intern","Energy Audit Intern"],
    "Civil & Infrastructure": ["Civil Engineering Intern","Structural Engineering Intern","Construction Management Intern","Site Engineering Intern","Geotechnical Engineering Intern","Transportation Engineering Intern","Highway Engineering Intern","Railway Engineering Intern","Metro Infrastructure Intern","Urban Planning Intern","Smart City Intern","BIM Intern","Quantity Surveying Intern","Project Planning Intern","Surveying Intern","Environmental Engineering Intern","Water Resources Intern"],
    "Chemical Engineering": ["Chemical Engineering Intern","Process Engineering Intern","Process Safety Intern","Chemical R&D Intern","Petrochemical Intern","Refinery Intern","Polymer Intern","Process Simulation Intern"],
    "Materials & Metallurgy": ["Materials Science Intern","Metallurgy Intern","Materials Testing Intern","Composite Materials Intern","Nanotechnology Intern","Battery Materials Intern","Semiconductor Materials Intern","Corrosion Engineering Intern"],
    "Industrial Engineering & Operations Research": ["Industrial Engineering Intern","Process Optimization Intern","Operations Research Intern","Optimization Intern","Simulation Intern","Production Planning Intern","Capacity Planning Intern","Quality Engineering Intern","Six Sigma Intern","Lean Manufacturing Intern","Supply Chain Analytics Intern"],
    "Robotics & Automation": ["Robotics Intern","Robotics Software Intern","Robotics Hardware Intern","Automation Intern","Industrial Automation Intern","PLC Programming Intern","SCADA Intern","Mechatronics Intern","Autonomous Systems Intern","Drone/UAV Intern","ROS Intern","Computer Vision Robotics Intern","Robot Simulation Intern","Motion Control Intern","Control Systems Intern","Industrial IoT Intern"],
    "R&D & Research": ["Research Intern","Engineering Research Intern","R&D Intern","Research Assistant","Research Fellow Intern","Computational Research Intern","Simulation Research Intern","AI Research Intern","Materials Research Intern","Energy Research Intern","Manufacturing Research Intern","Robotics Research Intern","Operations Research Intern","Applied Mathematics Intern","Scientific Computing Intern","Laboratory Intern","Product R&D Intern"],
  },
  "Management & Business": {
    "Consulting": ["Consulting Intern","Strategy Consulting Intern","Management Consulting Intern","Business Consulting Intern","Technology Consulting Intern","Operations Consulting Intern","Financial Consulting Intern","Risk Consulting Intern","Sustainability Consulting Intern","Digital Transformation Intern","IT Advisory Intern","Strategy & Operations Intern"],
    "Strategy": ["Strategy Intern","Corporate Strategy Intern","Business Strategy Intern","Growth Strategy Intern","Competitive Strategy Intern","Market Strategy Intern","Strategic Planning Intern","Business Planning Intern"],
    "Product Management": ["Product Management Intern","Associate Product Manager Intern","Product Strategy Intern","Product Operations Intern","Product Analytics Intern","Growth Product Intern","Technical Product Management Intern","Product Research Intern","Product Marketing Intern","Product Strategy & Analytics Intern","Product Design Intern","Product Operations & Strategy Intern"],
    "Business Analytics": ["Business Analyst Intern","Business Analytics Intern","Business Intelligence Intern","Data Analyst Intern","Strategy Analyst Intern","Operations Analyst Intern","Commercial Analyst Intern","Revenue Analyst Intern","Business Insights Intern","Decision Science Intern","Analytics Consultant Intern","Market Intelligence Intern"],
    "Finance": {
      "Corporate Finance": ["Finance Intern","Financial Analyst Intern","Corporate Finance Intern","FP&A Intern","Financial Planning Intern","Treasury Intern","Business Finance Intern","Management Accounting Intern"],
      "Investment Banking": ["Investment Banking Intern","M&A Intern","Valuation Intern","Financial Modelling Intern","Corporate Finance Advisory Intern","Transaction Advisory Intern"],
      "Equity Research": ["Equity Research Intern","Investment Research Intern","Fundamental Research Intern","Industry Research Intern","Stock Research Intern"],
      "Markets": ["Sales & Trading Intern","Equity Markets Intern","Fixed Income Intern","Derivatives Intern","Quantitative Finance Intern","Market Research Intern","Portfolio Management Intern","Asset Management Intern","Wealth Management Intern"],
      "Risk": ["Risk Management Intern","Credit Risk Intern","Market Risk Intern","Operational Risk Intern","Financial Risk Intern","Risk Analytics Intern"],
    },
    "Marketing": ["Marketing Intern","Digital Marketing Intern","Growth Marketing Intern","Performance Marketing Intern","Brand Management Intern","Brand Strategy Intern","Product Marketing Intern","Marketing Analytics Intern","Market Research Intern","Consumer Insights Intern","Category Management Intern","Campaign Management Intern","CRM Marketing Intern","Email Marketing Intern","Affiliate Marketing Intern","Influencer Marketing Intern","SEO Marketing Intern","SEM Intern","Trade Marketing Intern"],
    "Sales & Business Development": ["Sales Intern","Business Development Intern","Business Development & Sales Intern","Growth Intern","Partnerships Intern","Strategic Partnerships Intern","Account Management Intern","Key Account Management Intern","Client Success Intern","Customer Success Intern","Inside Sales Intern","B2B Sales Intern","Enterprise Sales Intern","Pre-Sales Intern","Sales Operations Intern","Revenue Operations Intern"],
    "Operations": ["Operations Intern","Business Operations Intern","Strategy & Operations Intern","Operations Management Intern","Process Improvement Intern","Process Optimization Intern","Operations Analytics Intern","Production Planning Intern","Manufacturing Operations Intern","Service Operations Intern","Project Operations Intern","Program Operations Intern","Business Process Intern","Continuous Improvement Intern"],
    "Supply Chain & Logistics": ["Supply Chain Intern","Supply Chain Analytics Intern","Supply Chain Planning Intern","Demand Planning Intern","Inventory Management Intern","Procurement Intern","Strategic Sourcing Intern","Logistics Intern","Warehouse Management Intern","Distribution Intern","Transportation Planning Intern","Vendor Management Intern","Supplier Quality Intern","Supply Chain Consulting Intern","Operations Research Intern","S&OP Intern"],
    "Human Resources": ["HR Intern","Human Resources Intern","Talent Acquisition Intern","Recruitment Intern","HR Analytics Intern","People Analytics Intern","HR Business Partner Intern","Learning & Development Intern","Employee Engagement Intern","Compensation & Benefits Intern","People Operations Intern","Employer Branding Intern","Organizational Development Intern","HR Consulting Intern"],
    "Entrepreneurship & Startup": ["Startup Intern","Founder's Office Intern","Business Strategy Intern","Venture Building Intern","Entrepreneurship Intern","Startup Operations Intern","Growth Intern","Venture Capital Intern","Investment Intern","Incubation Intern","Accelerator Intern","Innovation Intern","New Business Development Intern","Business Expansion Intern"],
    "Project & Program Management": ["Project Management Intern","Program Management Intern","PMO Intern","Project Coordinator Intern","Program Coordinator Intern","Technical Program Management Intern","Project Planning Intern","Project Operations Intern"],
  },
  "Content Management & Creation": {
    "Content Writing": ["Content Writing Intern","Copywriting Intern","Creative Writing Intern","Technical Writing Intern","Blog Writing Intern","Article Writing Intern","SEO Content Writer Intern","Script Writing Intern","Website Content Intern","Newsletter Writing Intern","Case Study Writing Intern","Ghostwriting Intern","Editorial Intern","Proofreading Intern","Documentation Intern"],
    "Social Media": ["Social Media Intern","Social Media Management Intern","Social Media Marketing Intern","Social Media Content Intern","Instagram Marketing Intern","LinkedIn Content Intern","YouTube Content Intern","Community Management Intern","Social Media Strategy Intern","Social Media Analytics Intern","Influencer Marketing Intern","Creator Partnerships Intern"],
    "Video & Creative Production": ["Content Creator Intern","Video Editing Intern","Video Production Intern","Reels Intern","Short-form Video Intern","YouTube Video Intern","Video Content Intern","Motion Graphics Intern","Animation Intern","Graphic Design Intern","Visual Design Intern","Creative Design Intern","Canva Design Intern","Thumbnail Design Intern","Photography Intern","Videography Intern"],
    "Media & Entertainment": ["Media Intern","Digital Media Intern","Entertainment Intern","Production Intern","Film Production Intern","Creative Production Intern","Podcast Intern","Podcast Production Intern","Scriptwriting Intern","Talent Management Intern","Artist Management Intern","Event Content Intern","PR Intern","Public Relations Intern","Communications Intern"],
    "Content Strategy": ["Content Strategy Intern","Content Marketing Intern","Content Operations Intern","Content Research Intern","Content Marketing Analytics Intern","Editorial Strategy Intern","Brand Content Intern","Brand Communications Intern","Digital Communications Intern","Corporate Communications Intern","Content Partnerships Intern"],
    "SEO & Digital Content": ["SEO Intern","SEO Content Intern","Technical SEO Intern","SEO Analyst Intern","Digital Marketing Intern","Search Marketing Intern","Content SEO Intern","Website Optimization Intern","Google Analytics Intern","Growth SEO Intern"],
    "Design": {
      "UI UX": ["UI/UX Design Intern","UX Research Intern","Product Design Intern","Interaction Design Intern","UI Design Intern","UX Design Intern","Visual Design Intern","Design Research Intern"],
      "Graphic Design": ["Graphic Design Intern","Brand Design Intern","Visual Communication Intern","Creative Design Intern","Presentation Design Intern","Motion Design Intern"],
    },
    "Events PR & Communication": ["Event Management Intern","Event Operations Intern","Event Marketing Intern","Event Production Intern","Public Relations Intern","Corporate Communications Intern","Brand Communications Intern","Media Relations Intern","Community Management Intern","Outreach Intern","Partnerships Intern"],
  },
  "Research": {
    "Engineering Research": ["Engineering Research Intern","Mechanical Research Intern","Electronics Research Intern","Aerospace Research Intern","Automotive Research Intern","Manufacturing Research Intern","Energy Research Intern","Materials Research Intern","Robotics Research Intern"],
    "Computer Science Research": ["AI Research Intern","Machine Learning Research Intern","Computer Vision Research Intern","NLP Research Intern","Systems Research Intern","Algorithms Research Intern","Cybersecurity Research Intern","Data Science Research Intern"],
    "Business & Economics Research": ["Business Research Intern","Economic Research Intern","Financial Research Intern","Market Research Intern","Consumer Research Intern","Industry Research Intern","Policy Research Intern","Business Intelligence Research Intern"],
    "Operations Research": ["Operations Research Intern","Optimization Research Intern","Supply Chain Research Intern","Decision Science Research Intern","Mathematical Optimization Intern","Simulation Research Intern"],
    "Academic Research": ["Research Assistant","Research Intern","Research Fellow Intern","Laboratory Research Intern","Academic Research Intern","Scientific Research Intern","Experimental Research Intern","Computational Research Intern"],
  },
  "Industry Specific": {
    "Automobile": ["Automotive Design Intern","Automotive Manufacturing Intern","Automotive R&D Intern","Automotive Analytics Intern","Automotive Product Intern","Automotive Strategy Intern","Automotive Supply Chain Intern","EV Product Intern","EV Battery Intern"],
    "Electric Vehicles": ["EV Engineering Intern","EV Battery Intern","Battery Management System Intern","Battery Thermal Management Intern","Electric Motor Intern","EV Power Electronics Intern","EV Testing Intern","EV Product Management Intern","EV Supply Chain Intern"],
    "Semiconductor": ["VLSI Intern","RTL Design Intern","Physical Design Intern","Verification Intern","Semiconductor Process Intern","IC Design Intern","Chip Design Intern","Fabrication Intern","Semiconductor Research Intern"],
    "Banking": ["Banking Intern","Credit Analyst Intern","Risk Intern","Investment Banking Intern","Equity Research Intern","Retail Banking Intern","Corporate Banking Intern","Treasury Intern","Financial Analytics Intern"],
    "FinTech": ["FinTech Product Intern","FinTech Analytics Intern","FinTech Data Intern","FinTech Risk Intern","FinTech Strategy Intern","FinTech Operations Intern","FinTech Software Intern"],
    "FMCG": ["Brand Management Intern","Sales Intern","Marketing Intern","Category Management Intern","Supply Chain Intern","Demand Planning Intern","Consumer Insights Intern","FMCG Finance Intern"],
    "E-Commerce": ["E-Commerce Product Intern","E-Commerce Operations Intern","E-Commerce Analytics Intern","E-Commerce Growth Intern","Category Management Intern","Marketplace Intern","Supply Chain Intern","E-Commerce Marketing Intern"],
    "SaaS & Technology": ["SaaS Product Intern","SaaS Sales Intern","SaaS Business Development Intern","SaaS Customer Success Intern","SaaS Marketing Intern","SaaS Operations Intern","SaaS Data Analyst Intern"],
    "Healthcare": ["Healthcare Analytics Intern","Healthcare Operations Intern","Healthcare Product Intern","Healthcare Research Intern","Healthcare Consulting Intern","HealthTech Intern"],
    "Pharma": ["Pharma R&D Intern","Pharma Marketing Intern","Pharma Supply Chain Intern","Pharma Analytics Intern","Clinical Research Intern","Pharma Operations Intern"],
    "EdTech": ["EdTech Product Intern","EdTech Content Intern","EdTech Growth Intern","EdTech Operations Intern","Learning Analytics Intern","Instructional Design Intern"],
    "Agriculture & AgriTech": ["AgriTech Intern","Agricultural Engineering Intern","Agricultural Data Analyst Intern","Precision Agriculture Intern","Agricultural IoT Intern","Agri Supply Chain Intern","Agri Product Intern","Agricultural R&D Intern"],
    "ClimateTech & Sustainability": ["ClimateTech Intern","Sustainability Intern","Carbon Analytics Intern","ESG Intern","Climate Data Intern","Renewable Energy Intern","Environmental Analytics Intern","Sustainable Supply Chain Intern"],
    "SpaceTech": ["Space Technology Intern","Satellite Intern","Space Systems Intern","Aerospace R&D Intern","Propulsion Research Intern","Space Data Analyst Intern","Satellite Data Intern"],
    "Telecommunications": ["Telecom Engineering Intern","Network Engineering Intern","5G Intern","RF Engineering Intern","Telecommunications Analytics Intern","Network Optimization Intern","Wireless Communication Intern"],
    "Logistics": ["Logistics Intern","Logistics Analytics Intern","Transportation Planning Intern","Warehouse Operations Intern","Fleet Management Intern","Supply Chain Intern","Route Optimization Intern"],
    "Real Estate": ["Real Estate Finance Intern","Real Estate Analytics Intern","Real Estate Investment Intern","Real Estate Operations Intern","Property Management Intern","Real Estate Marketing Intern","PropTech Intern"],
    "Sports": ["Sports Analytics Intern","Sports Management Intern","Sports Marketing Intern","Sports Operations Intern","Sports Content Intern","Athlete Management Intern","Sports Business Intern"],
    "Travel & Hospitality": ["Travel Operations Intern","Travel Product Intern","Revenue Management Intern","Hospitality Operations Intern","Hospitality Marketing Intern","Travel Analytics Intern","Hotel Management Intern"],
    "LegalTech": ["LegalTech Product Intern","LegalTech Operations Intern","Legal Research Intern","LegalTech Analytics Intern","Legal Content Intern","Legal Technology Intern"],
  },
};

// flatten dictionary into { category: [keyword tokens] }
function flattenTaxonomy(node, out) {
  Object.entries(node).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      const tokens = new Set();
      key.toLowerCase().split(/[^a-z0-9+]+/).forEach((t) => t && tokens.add(t));
      val.forEach((title) => {
        title.toLowerCase().replace(/intern/g, "").split(/[^a-z0-9+]+/).forEach((t) => {
          if (t && t.length > 1) tokens.add(t);
        });
      });
      out[key] = Array.from(tokens);
    } else {
      flattenTaxonomy(val, out);
    }
  });
  return out;
}
const CATEGORY_KEYWORDS = flattenTaxonomy(INTERNSHIP_DICTIONARY, {});
const ALL_CATEGORIES = Object.keys(CATEGORY_KEYWORDS);

const STOPWORDS = new Set(["a","an","the","and","or","of","in","on","with","to","for","i","am","is","are","my","me","have","has","that","this","where","would","like","can","use","using","together","particularly","interested","comfortable","student","year","second","also","basic"]);

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s+-]/g, " ").split(/\s+/).filter((t) => t && !STOPWORDS.has(t));
}

// heuristic local classifier standing in for the Whisper -> zero-shot pipeline
function classify(text) {
  const tokens = tokenize(text);
  const tokenSet = new Set(tokens);
  const raw = {};
  ALL_CATEGORIES.forEach((cat) => {
    let score = 0;
    CATEGORY_KEYWORDS[cat].forEach((kw) => {
      if (tokenSet.has(kw)) score += kw.length > 5 ? 2.2 : 1.1;
    });
    raw[cat] = score;
  });
  // softmax with temperature for a spread similar to the worked example
  const T = 2.6;
  const vals = Object.values(raw);
  const max = Math.max(...vals, 0);
  const exps = {};
  let sum = 0;
  ALL_CATEGORIES.forEach((cat) => {
    const e = Math.exp((raw[cat] - max) / T);
    exps[cat] = e;
    sum += e;
  });
  const probs = {};
  ALL_CATEGORIES.forEach((cat) => { probs[cat] = exps[cat] / sum; });
  return Object.entries(probs).sort((a, b) => b[1] - a[1]);
}

/* ---------------------------------------------------------
   2. SAMPLE INTERNSHIP POSTINGS
--------------------------------------------------------- */
const POSTINGS = [
  { id: "p1", title: "Manufacturing Engineering Intern", company: "Orbit Manufacturing", location: "Pune", category: "Manufacturing" },
  { id: "p2", title: "CAD & Product Design Intern", company: "Formworks Studio", location: "Bengaluru", category: "Design & CAD" },
  { id: "p3", title: "Supply Chain Analyst Intern", company: "FlowChain Logistics", location: "Gurugram", category: "Supply Chain & Logistics" },
  { id: "p4", title: "Industrial Engineering Intern", company: "Precision Works", location: "Chennai", category: "Industrial Engineering & Operations Research" },
  { id: "p5", title: "Product Management Intern", company: "NextGen Robotics", location: "Remote", category: "Product Management" },
  { id: "p6", title: "Business Analyst Intern", company: "Meridian Consulting", location: "Mumbai", category: "Business Analytics" },
  { id: "p7", title: "Data Analyst Intern", company: "QuantEdge Capital", location: "Remote", category: "AI ML & Data" },
  { id: "p8", title: "Energy Systems Intern", company: "SunGrid Renewables", location: "Ahmedabad", category: "Energy & Power" },
  { id: "p9", title: "Automotive R&D Intern", company: "Velocity Motors", location: "Pune", category: "Automotive" },
  { id: "p10", title: "Consulting Intern", company: "Bridgepoint Advisory", location: "Delhi", category: "Consulting" },
  { id: "p11", title: "Software Engineer Intern", company: "ByteForge", location: "Remote", category: "Software & Computer Science" },
  { id: "p12", title: "Mechatronics Intern", company: "RoboWorks", location: "Hyderabad", category: "Mechatronics" },
  { id: "p13", title: "CAE & Simulation Intern", company: "Apex Dynamics", location: "Pune", category: "CAE & Simulation" },
  { id: "p14", title: "Marketing Intern", company: "Loop Brands", location: "Mumbai", category: "Marketing" },
];

const SAMPLE_TRANSCRIPT = "Hello, my name is Rahul Sharma. I am a second-year Mechanical Engineering student. I have worked on a solar-powered cold storage project, where I handled the mechanical design and thermal analysis. I am comfortable with SolidWorks, AutoCAD, Excel and basic Python. I am particularly interested in manufacturing, product development, operations and supply-chain optimization. I would like an internship where I can use my engineering knowledge together with analytical and problem-solving skills.";

const NAVY = "#1F2937";
const STEEL = "#3B6E8F";
const TERRA = "#C1592B";

function pct(x) { return `${Math.round(x * 100)}%`; }

/* ---------------------------------------------------------
   3. SMALL PIECES
--------------------------------------------------------- */
function ProbabilityChart({ scores, top = 10, barColor = STEEL }) {
  const data = scores.slice(0, top).map(([name, val]) => ({ name, value: val }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(260, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EB" horizontal={false} />
        <XAxis type="number" domain={[0, "dataMax"]} tickFormatter={(v) => `${Math.round(v * 100)}%`} tick={{ fontSize: 11, fill: "#6B7280" }} />
        <YAxis type="category" dataKey="name" width={190} tick={{ fontSize: 12, fill: "#374151" }} />
        <Tooltip formatter={(v) => [`${(v * 100).toFixed(1)}%`, "match"]} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? barColor : `${barColor}${Math.max(30, 90 - i * 8).toString(16)}`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function StatusPill({ status }) {
  const map = {
    Submitted: { bg: "#EEF2F6", text: "#3B6E8F", icon: Clock },
    Shortlisted: { bg: "#E7F3EA", text: "#1F7A3D", icon: CheckCircle2 },
    Rejected: { bg: "#FBEAE4", text: "#B23B1B", icon: XCircle },
  };
  const s = map[status] || map.Submitted;
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded" style={{ background: s.bg, color: s.text }}>
      <Icon size={13} /> {status}
    </span>
  );
}

/* ---------------------------------------------------------
   4. VOICE / TEXT CAPTURE
--------------------------------------------------------- */
function CaptureBox({ value, onChange, placeholder, accent = STEEL }) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition));
  const recRef = useRef(null);

  const toggleMic = () => {
    if (!supported) return;
    if (listening) {
      recRef.current && recRef.current.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + " ";
      onChange(text.trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">Voice message transcript</span>
        <button
          onClick={toggleMic}
          disabled={!supported}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderColor: accent, color: listening ? "#fff" : accent, background: listening ? accent : "transparent" }}
          title={supported ? "Record with your microphone" : "Speech recognition not available in this browser — type below instead"}
        >
          <Mic size={13} /> {listening ? "Listening…" : "Record"}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full text-sm p-3 border rounded-md focus:outline-none focus:ring-2"
        style={{ borderColor: "#D8DCE1", ["--tw-ring-color"]: accent + "55" }}
      />
      <p className="text-xs text-gray-400 mt-1">Recording relies on your browser's microphone permission — if it isn't available here, type or paste the message instead.</p>
    </div>
  );
}

/* ---------------------------------------------------------
   5. STUDENT SIDE
--------------------------------------------------------- */
function StudentApp({ applications, setApplications }) {
  const [profileTranscript, setProfileTranscript] = useState("");
  const [profileScores, setProfileScores] = useState(null);
  const [view, setView] = useState("intro"); // intro | home | applications
  const [applyPosting, setApplyPosting] = useState(null);
  const [applyTranscript, setApplyTranscript] = useState("");
  const [applyScores, setApplyScores] = useState(null);
  const [applyStep, setApplyStep] = useState(1);

  const runProfileAnalysis = () => {
    if (!profileTranscript.trim()) return;
    setProfileScores(classify(profileTranscript));
    setView("home");
  };

  const recommended = useMemo(() => {
    if (!profileScores) return [];
    const map = Object.fromEntries(profileScores);
    return [...POSTINGS]
      .map((p) => ({ ...p, match: map[p.category] || 0 }))
      .sort((a, b) => b.match - a.match);
  }, [profileScores]);

  const startApply = (posting) => {
    setApplyPosting(posting);
    setApplyTranscript("");
    setApplyScores(null);
    setApplyStep(1);
  };

  const runApplyAnalysis = () => {
    if (!applyTranscript.trim()) return;
    setApplyScores(classify(applyTranscript));
    setApplyStep(2);
  };

  const submitApplication = () => {
    const map = Object.fromEntries(applyScores);
    setApplications((prev) => [
      ...prev,
      {
        id: `a${Date.now()}`,
        postingId: applyPosting.id,
        studentName: "Rahul Sharma",
        transcript: applyTranscript,
        scores: applyScores,
        matchForRole: map[applyPosting.category] || 0,
        status: "Submitted",
      },
    ]);
    setApplyPosting(null);
    setView("applications");
  };

  /* ---- intro: record profile voice message ---- */
  if (view === "intro") {
    return (
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide" style={{ color: STEEL }}>
            <Sparkles size={14} /> Step 1 of 2
          </div>
          <h1 className="text-2xl font-semibold mt-2" style={{ color: NAVY }}>Tell us about yourself</h1>
          <p className="text-sm text-gray-500 mt-1">Record a short voice message — or type it below — about your background, skills and what kind of internship you're looking for. We'll match you against internship categories.</p>
        </div>
        <CaptureBox value={profileTranscript} onChange={setProfileTranscript} placeholder="e.g. Hello, my name is... I am a student of... I have worked on..." accent={STEEL} />
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={runProfileAnalysis}
            disabled={!profileTranscript.trim()}
            className="inline-flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-md disabled:opacity-40"
            style={{ background: STEEL }}
          >
            <Send size={14} /> Analyze my message
          </button>
          <button
            onClick={() => setProfileTranscript(SAMPLE_TRANSCRIPT)}
            className="text-xs text-gray-500 underline underline-offset-2"
          >
            Use example message
          </button>
        </div>
      </div>
    );
  }

  /* ---- apply flow overlay ---- */
  if (applyPosting) {
    const map = applyScores ? Object.fromEntries(applyScores) : null;
    return (
      <div className="max-w-xl mx-auto py-10 px-4">
        <button onClick={() => setApplyPosting(null)} className="inline-flex items-center gap-1 text-xs text-gray-500 mb-4">
          <ArrowLeft size={13} /> Back to internships
        </button>
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: STEEL }}>Applying to</p>
          <h2 className="text-xl font-semibold" style={{ color: NAVY }}>{applyPosting.title}</h2>
          <p className="text-sm text-gray-500">{applyPosting.company} · {applyPosting.location}</p>
        </div>

        {applyStep === 1 && (
          <>
            <p className="text-sm text-gray-600 mb-3">Record a voice message specific to this role — why you want it and what makes you a fit. This is scored separately from your profile message.</p>
            <CaptureBox value={applyTranscript} onChange={setApplyTranscript} placeholder="Why are you a good fit for this specific role?" accent={STEEL} />
            <button
              onClick={runApplyAnalysis}
              disabled={!applyTranscript.trim()}
              className="inline-flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-md mt-4 disabled:opacity-40"
              style={{ background: STEEL }}
            >
              <Send size={14} /> Analyze application message
            </button>
          </>
        )}

        {applyStep === 2 && applyScores && (
          <>
            <div className="border rounded-md p-4 mb-4" style={{ borderColor: "#D8DCE1" }}>
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm text-gray-600">Match for this role</span>
                <span className="text-2xl font-semibold" style={{ color: STEEL }}>{pct(map[applyPosting.category] || 0)}</span>
              </div>
              <ProbabilityChart scores={applyScores} top={8} barColor={STEEL} />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setApplyStep(1)} className="inline-flex items-center gap-1 text-sm text-gray-500 px-3 py-2">
                <ChevronLeft size={14} /> Re-record
              </button>
              <button
                onClick={submitApplication}
                className="inline-flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-md"
                style={{ background: NAVY }}
              >
                Submit application <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ---- home / applications shell ---- */
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: NAVY }}>Rahul's internship match</h1>
          <p className="text-sm text-gray-500">Based on your recorded profile message</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-md p-1">
          <button onClick={() => setView("home")} className={`text-sm px-3 py-1.5 rounded ${view === "home" ? "bg-white shadow-sm font-medium" : "text-gray-500"}`} style={view === "home" ? { color: NAVY } : {}}>Matches</button>
          <button onClick={() => setView("applications")} className={`text-sm px-3 py-1.5 rounded ${view === "applications" ? "bg-white shadow-sm font-medium" : "text-gray-500"}`} style={view === "applications" ? { color: NAVY } : {}}>My applications ({applications.length})</button>
        </div>
      </div>

      {view === "home" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <div className="border rounded-md p-4" style={{ borderColor: "#D8DCE1" }}>
              <h3 className="text-sm font-medium mb-3" style={{ color: NAVY }}>Your class probabilities</h3>
              <ProbabilityChart scores={profileScores} top={13} barColor={STEEL} />
              <button onClick={() => setView("intro")} className="text-xs text-gray-500 underline underline-offset-2 mt-3">Re-record profile message</button>
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-sm font-medium mb-3" style={{ color: NAVY }}>Recommended internships</h3>
            <div className="space-y-2">
              {recommended.map((p) => (
                <div key={p.id} className="flex items-center justify-between border rounded-md p-3" style={{ borderColor: "#E4E7EB" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: NAVY }}>{p.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <Building2 size={12} /> {p.company}
                      <MapPin size={12} className="ml-1" /> {p.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: STEEL }}>{pct(p.match)}</span>
                    <button onClick={() => startApply(p)} className="text-xs font-medium text-white px-3 py-1.5 rounded" style={{ background: NAVY }}>Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "applications" && (
        <div className="space-y-2">
          {applications.length === 0 && <p className="text-sm text-gray-500">No applications submitted yet — apply to a recommended internship from the Matches tab.</p>}
          {applications.map((a) => {
            const posting = POSTINGS.find((p) => p.id === a.postingId);
            return (
              <div key={a.id} className="border rounded-md p-3 flex items-center justify-between" style={{ borderColor: "#E4E7EB" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: NAVY }}>{posting.title}</p>
                  <p className="text-xs text-gray-500">{posting.company} · match {pct(a.matchForRole)}</p>
                </div>
                <StatusPill status={a.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   6. RECRUITER SIDE
--------------------------------------------------------- */
function RecruiterApp({ applications, setApplications }) {
  const [selectedPosting, setSelectedPosting] = useState(POSTINGS[0].id);
  const [expanded, setExpanded] = useState(null);

  const postingApps = applications.filter((a) => a.postingId === selectedPosting);
  const posting = POSTINGS.find((p) => p.id === selectedPosting);

  const setStatus = (id, status) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: NAVY }}>Recruiter dashboard</h1>
        <p className="text-sm text-gray-500">Review applicants by class-probability match for each posting</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {POSTINGS.map((p) => {
          const count = applications.filter((a) => a.postingId === p.id).length;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPosting(p.id)}
              className="text-xs px-3 py-1.5 rounded border"
              style={selectedPosting === p.id
                ? { background: TERRA, borderColor: TERRA, color: "#fff" }
                : { borderColor: "#D8DCE1", color: "#44494F" }}
            >
              {p.title} {count > 0 && <span className="opacity-80">· {count}</span>}
            </button>
          );
        })}
      </div>

      <div className="border rounded-md p-4 mb-5" style={{ borderColor: "#D8DCE1", background: "#FBF6F3" }}>
        <div className="flex items-center gap-2">
          <Briefcase size={16} style={{ color: TERRA }} />
          <span className="text-sm font-medium" style={{ color: NAVY }}>{posting.title}</span>
          <span className="text-xs text-gray-500">{posting.company} · {posting.location} · category: {posting.category}</span>
        </div>
      </div>

      {postingApps.length === 0 && (
        <div className="text-sm text-gray-500 border rounded-md p-6 text-center" style={{ borderColor: "#E4E7EB" }}>
          No applicants for this posting yet. Switch to the student view and apply to see them appear here.
        </div>
      )}

      <div className="space-y-3">
        {postingApps
          .slice()
          .sort((a, b) => b.matchForRole - a.matchForRole)
          .map((a) => (
            <div key={a.id} className="border rounded-md" style={{ borderColor: "#E4E7EB" }}>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: "#EEF2F6", color: STEEL }}>
                    {a.studentName.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: NAVY }}>{a.studentName}</p>
                    <p className="text-xs text-gray-500">Role match: <span className="font-semibold" style={{ color: TERRA }}>{pct(a.matchForRole)}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={a.status} />
                  <button onClick={() => setExpanded(expanded === a.id ? null : a.id)} className="text-xs text-gray-500 flex items-center gap-1 px-2 py-1 border rounded" style={{ borderColor: "#D8DCE1" }}>
                    <FileText size={12} /> {expanded === a.id ? "Hide" : "Details"}
                  </button>
                </div>
              </div>

              {expanded === a.id && (
                <div className="border-t p-4 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: "#E4E7EB" }}>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Application transcript</p>
                    <p className="text-sm text-gray-700 leading-relaxed border rounded p-3" style={{ borderColor: "#E4E7EB", background: "#FAFAFA" }}>{a.transcript}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Class probabilities</p>
                    <ProbabilityChart scores={a.scores} top={6} barColor={TERRA} />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 pt-1">
                    <button onClick={() => setStatus(a.id, "Shortlisted")} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded text-white" style={{ background: "#1F7A3D" }}>
                      <CheckCircle2 size={13} /> Shortlist
                    </button>
                    <button onClick={() => setStatus(a.id, "Rejected")} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded text-white" style={{ background: "#B23B1B" }}>
                      <XCircle size={13} /> Reject
                    </button>
                    {a.status !== "Submitted" && (
                      <button onClick={() => setStatus(a.id, "Submitted")} className="text-xs text-gray-500 px-2 py-1.5">Reset status</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   7. ROOT — role switcher
--------------------------------------------------------- */
export default function App() {
  const [role, setRole] = useState("student");
  const [applications, setApplications] = useState([]);

  return (
    <div className="min-h-screen bg-white font-sans" style={{ color: "#1F2937" }}>
      <div className="border-b" style={{ borderColor: "#E4E7EB" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center text-white text-xs font-semibold" style={{ background: NAVY }}>IM</div>
            <span className="text-sm font-medium" style={{ color: NAVY }}>Intern Match</span>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setRole("student")}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded"
              style={role === "student" ? { background: "#fff", color: STEEL, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" } : { color: "#6B7280" }}
            >
              <Users size={13} /> Applicant
            </button>
            <button
              onClick={() => setRole("recruiter")}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded"
              style={role === "recruiter" ? { background: "#fff", color: TERRA, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" } : { color: "#6B7280" }}
            >
              <Briefcase size={13} /> Recruiter
            </button>
          </div>
        </div>
      </div>

      {role === "student"
        ? <StudentApp applications={applications} setApplications={setApplications} />
        : <RecruiterApp applications={applications} setApplications={setApplications} />}
    </div>
  );
}
