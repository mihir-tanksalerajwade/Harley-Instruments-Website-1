import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import {
  Shield,
  Layers,
  Sparkles,
  Award,
  Calendar,
  Globe,
  Wrench,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Zap,
  ZapOff,
  Magnet,
  Tv,
  ShieldCheck,
  Building,
  User,
  Activity,
  ChevronDown,
  Menu,
  X,
  Lock,
  Unlock,
  ArrowRight,
  Archive,
  Terminal,
  FileSpreadsheet
} from "lucide-react";
import { WebsiteData, InquiryLead, ProductService } from "./types";
import { defaultWebsiteData } from "./defaultData";
import LeadCaptureForm from "./components/LeadCaptureForm";
import AdminPanel from "./components/AdminPanel";
import Modal from "./components/Modal";

// Interactive custom dynamic rendering of Lucide icons based on string names
function SmartIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Shield className={className} />;
  }
  return <IconComponent className={className} />;
}

const defaultInquiries: InquiryLead[] = [
  {
    id: "HR-2026-1987",
    timestamp: "6/11/2026, 10:15:22 AM",
    fullName: "Dr. Arisudan Sharma",
    email: "a.sharma@iitd.ac.in",
    phone: "+91 11 2659 1234",
    organization: "IIT Delhi",
    department: "Department of Physics (Nanotech Lab)",
    productInterest: "Thin Film Deposition Machines",
    message: "We need an active consultation regarding a custom 3-source RF sputtering assembly for research on high-Tc superconductor thin films. We require base pressure levels of < 2 x 10^-8 Torr and substrate heating up to 800°C.",
    status: "New",
    adminNotes: "Assigned to material science team lead. Needs callback on Friday."
  },
  {
    id: "HR-2026-4402",
    timestamp: "6/10/2026, 04:30:11 PM",
    fullName: "Dr. Neha Shah",
    email: "neha.shah@tifr.res.in",
    phone: "+91 22 2278 2000",
    organization: "TIFR Mumbai",
    department: "Palaeomagnetic & Electron Microscopy Unit",
    productInterest: "Magnetic Field Cancellation Systems & Surveys",
    message: "Our new high-magnification TEM installation is suffering from magnetic field interference from nearby heavy electrical machinery. We require an electromagnetic zoning survey and Helmholtz cable configurations proposal.",
    status: "Under Review",
    adminNotes: "Survey scope prepared. Sent pricing estimate for Pune engineers dispatch."
  }
];

export default function App() {
  // Global CMS website data structure state
  const [siteData, setSiteData] = useState<WebsiteData>(() => {
    const stored = localStorage.getItem("harley_website_data");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultWebsiteData;
      }
    }
    return defaultWebsiteData;
  });

  // Global Leads tracking state
  const [inquiriesList, setInquiriesList] = useState<InquiryLead[]>(() => {
    const stored = localStorage.getItem("harley_inquiries_data");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultInquiries;
      }
    }
    return defaultInquiries;
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem("harley_website_data", JSON.stringify(siteData));
  }, [siteData]);

  useEffect(() => {
    localStorage.setItem("harley_inquiries_data", JSON.stringify(inquiriesList));
  }, [inquiriesList]);

  // Modals / Menu Toggles
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductService | null>(null);
  const [showInquiryModalProduct, setShowInquiryModalProduct] = useState<string | null>(null);
  const [showGenericQuoteModal, setShowGenericQuoteModal] = useState(false);

  // Filter systems on live view
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<"all" | "equipment" | "service">("all");

  const handleResetToDefaultAll = () => {
    localStorage.removeItem("harley_website_data");
    localStorage.removeItem("harley_inquiries_data");
    setSiteData(defaultWebsiteData);
    setInquiriesList(defaultInquiries);
  };

  const handleInquirySubmission = (newInquiry: InquiryLead) => {
    setInquiriesList((prev) => [newInquiry, ...prev]);
  };

  const filteredSystems = siteData.products.filter((p) => {
    if (selectedCategoryTab === "all") return true;
    return p.category === selectedCategoryTab;
  });

  return (
    <div className="min-h-screen bg-[#020412] text-white font-sans selection:bg-[#0b16a7] selection:text-white border-t-4 border-[#0b16a7]" id="harley-app-root">
      
      {/* ELITE NAV HEADER */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#0b16a7]/20 via-[#020412]/95 to-[#020412]/80 backdrop-blur-md border-b border-[#0b16a7]/30 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Brand Title */}
          <a href="#" className="flex items-baseline gap-3 group" id="brand-logo-trigger">
            <span className="text-3xl font-bold tracking-tighter text-white hover:text-blue-400 transition-colors">HARLEY</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#0b16a7] font-semibold hidden sm:inline-block">
              Scientific & Research Equipment
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">Solutions</a>
            <a href="#products" className="hover:text-white transition-colors">Services</a>
            <a href="#why-choose" className="hover:text-white transition-colors">Expertise</a>
            <a href="#contact" className="hover:text-white transition-colors font-mono font-semibold tracking-normal text-blue-400">Pune Center</a>
            <button
              onClick={() => setIsAdminPortalOpen(true)}
              className="px-3 py-1.5 rounded-sm bg-[#080a1a] border border-[#0b16a7]/30 text-slate-300 hover:text-white hover:border-[#0b16a7] transition-all font-mono inline-flex items-center gap-1.5 cursor-pointer text-[10px] uppercase tracking-wider"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Admin Terminal</span>
            </button>
          </nav>

          {/* Right Action Trigger */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setShowGenericQuoteModal(true)}
              className="bg-[#0b16a7] hover:bg-blue-700 px-6 py-2.5 rounded-sm text-[12px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-900/20 text-white pointer-events-auto cursor-pointer"
            >
              Email Us
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-1"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-b border-[#0b16a7]/30 bg-[#080a1a] px-6 py-6 space-y-4 text-xs font-semibold uppercase tracking-widest text-gray-400 relative z-30"
          >
            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block hover:text-white transition-colors py-1"
            >
              Solutions
            </a>
            <a
              href="#products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block hover:text-white transition-colors py-1"
            >
              Services
            </a>
            <a
              href="#why-choose"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block hover:text-white transition-colors py-1"
            >
              Expertise
            </a>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block hover:text-white transition-colors py-1 text-blue-400"
            >
              Pune Center
            </a>
            <div className="pt-4 border-t border-[#0b16a7]/20 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAdminPortalOpen(true);
                }}
                className="w-full text-center py-2.5 bg-[#020412] border border-[#0b16a7]/30 hover:border-blue-500 hover:text-white text-[10px] uppercase tracking-wider rounded-sm transition-all font-mono flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-550" />
                Admin Terminal
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowGenericQuoteModal(true);
                }}
                className="w-full text-center py-2.5 bg-[#0b16a7] hover:bg-blue-700 text-[10px] rounded-sm text-white transition-all uppercase tracking-widest font-bold shadow-lg shadow-blue-900/20"
              >
                Email Us
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION CONTAINER */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-32 border-b border-[#0b16a7]/20 bg-[#020412]" id="hero">
        {/* Wireframe background rings from the Immersive UI design theme */}
        <div className="absolute right-[-5%] top-[-10%] w-[600px] h-[600px] rounded-full border border-[#0b16a7]/20 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[420px] h-[420px] rounded-full border border-[#0b16a7]/10 flex items-center justify-center">
            <div className="w-[200px] h-[200px] bg-[#0b16a7]/5 blur-3xl rounded-full"></div>
          </div>
        </div>

        {/* Background circuit grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0b16a7_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero text space */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 bg-[#0b16a7]/30 border border-[#0b16a7] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-blue-300 rounded-sm">
              {siteData.hero.badge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight text-white">
              {siteData.hero.title}
            </h1>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed uppercase tracking-tight max-w-2xl">
              {siteData.hero.subtitle}
            </p>

            {/* Prompt email cta block */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => setShowGenericQuoteModal(true)}
                className="bg-[#0b16a7] hover:bg-blue-700 px-8 py-3.5 rounded-sm text-[12px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-900/20 text-white flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{siteData.hero.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#products"
                className="bg-[#080a1a] border border-[#0b16a7]/30 text-gray-300 hover:text-white hover:border-[#0b16a7] transition-all px-8 py-3.5 rounded-sm text-[12px] font-bold uppercase tracking-wider text-center"
              >
                Browse Spec Archive
              </a>
            </div>

            {/* Micro Stats Rows */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#0b16a7]/20">
              {siteData.hero.statistics.map((st, i) => (
                <div key={i} className="bg-[#080a1a] border border-white/5 p-4 rounded-sm flex flex-col justify-between">
                  <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{st.value}</div>
                  <div className="text-[9px] uppercase tracking-wider text-[#0b16a7] font-bold font-mono leading-tight mt-1">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Right Visualizer block (The generated photo!) */}
          <div className="lg:col-span-5 relative z-10">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#0b16a7] to-indigo-950 rounded-sm opacity-25 blur-lg" />
            
            {/* Visual Glass Box */}
            <div className="relative bg-[#080a1a] border border-[#0b16a7]/40 rounded-sm p-3 overflow-hidden shadow-2xl">
              {/* Outer bezel styling */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#020412] rounded-sm border-b border-[#0b16a7]/30 text-[9px] font-mono text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
                  <span>CALIBRATED FEED: PVD_UHV_SYS_AUTO</span>
                </span>
                <span className="text-[#0b16a7] font-semibold">NABL ISO REGISTERED</span>
              </div>

              {/* Generated Image rendering */}
              <div className="aspect-[4/3] rounded-sm overflow-hidden relative group mt-2">
                <img
                  src={siteData.hero.imageSrc}
                  alt="Harley Advanced Science Sputtering System"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                
                {/* Tech HUD overlay labels */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020412]/90 via-transparent to-transparent flex flex-col justify-end p-4">
                  <div className="bg-[#080a1a] p-3 rounded-sm border border-[#0b16a7]/40 text-[10px] font-mono max-w-[280px]">
                    <div className="flex items-center justify-between text-blue-300 font-bold">
                      <span>SECURE MONITOR</span>
                      <span>SYS ACTIVE</span>
                    </div>
                    <p className="text-gray-400 text-[9px] mt-1 leading-normal uppercase">
                      Precision instrumentation systems configured for multi-institution research labs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT HERITAGE SECTION */}
      <section className="py-20 bg-[#080a1a] border-b border-[#0b16a7]/20 relative" id="about">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Company Story Copy Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block px-3 py-1 bg-[#0b16a7]/30 border border-[#0b16a7] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-blue-300 rounded-sm">
              {siteData.about.badge}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              {siteData.about.title}
            </h2>

            <h3 className="text-sm md:text-base font-semibold text-blue-300 border-l-2 border-[#0b16a7] pl-4 py-1 uppercase tracking-wider">
              &ldquo;{siteData.about.storyHeading}&rdquo;
            </h3>

            <div className="space-y-4 text-gray-300 text-sm leading-relaxed tracking-wide">
              {siteData.about.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Quality badges block */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#0b16a7]/20">
              <div className="p-3 bg-[#020412] border border-[#0b16a7]/30 rounded-sm flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.15em] leading-none">
                  ISO 9001 COMPLIANT
                </span>
              </div>
              <div className="p-3 bg-[#020412] border border-[#0b16a7]/30 rounded-sm flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.15em] leading-none">
                  NABL CALIBRATED
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Interactive Milestones Timeline block */}
          <div className="lg:col-span-6">
            <div className="bg-[#020412] border border-[#0b16a7]/35 rounded-sm p-6 shadow-xl relative">
              <h4 className="font-bold text-white text-md mb-6 border-b border-[#0b16a7]/20 pb-3 flex items-center justify-between uppercase tracking-widest">
                <span>Milestones Portfolio Evolution</span>
                <span className="font-mono text-[9px] text-[#0b16a7] font-bold tracking-widest">EST. 1987</span>
              </h4>

              <div className="relative pl-6 border-l border-[#0b16a7]/20 space-y-8">
                {siteData.about.milestones.map((ms, idx) => (
                  <div key={idx} className="relative group text-left">
                    {/* Tick ball */}
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-sm bg-[#080a1a] border-2 border-[#0b16a7]/40 group-hover:border-blue-400 transition-colors z-10" />
                    
                    {/* Glowing highlight anchor */}
                    <div className="text-[10px] font-mono font-bold text-blue-400 tracking-widest uppercase">{ms.year}</div>
                    <h5 className="font-semibold text-white text-sm font-display mt-0.5 group-hover:text-blue-300 transition-colors">
                      {ms.title}
                    </h5>
                    <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                      {ms.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS & SERVICES SECTION */}
      <section className="py-20 bg-[#020412] border-b border-[#0b16a7]/20" id="products">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Grid Header and Filters */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-[#0b16a7]/20 pb-8">
            <div className="space-y-2 text-left">
              <span className="text-xs uppercase font-mono tracking-widest text-blue-400 font-bold block">
                SPECIALIZED SCIENTIFIC INSTRUMENTATION CATALOG
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                Systems & Engineering Portfolio
              </h2>
              <p className="text-xs text-gray-400 max-w-lg uppercase tracking-wider">
                High-magnification, vacuum chambers, electromagnetic insulation, and plasma preparative capabilities engineered since 1987.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#080a1a] rounded-sm border border-[#0b16a7]/30">
              <button
                onClick={() => setSelectedCategoryTab("all")}
                className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                  selectedCategoryTab === "all"
                    ? "bg-[#0b16a7] text-white shadow-lg shadow-blue-900/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                All Entries
              </button>
              <button
                onClick={() => setSelectedCategoryTab("equipment")}
                className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                  selectedCategoryTab === "equipment"
                    ? "bg-[#0b16a7] text-white shadow-lg shadow-blue-900/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Hardware Units
              </button>
              <button
                onClick={() => setSelectedCategoryTab("service")}
                className={`px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                  selectedCategoryTab === "service"
                    ? "bg-[#0b16a7] text-white shadow-lg shadow-blue-900/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Contract Services
              </button>
            </div>
          </div>

          {/* Products Dynamic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="products-catalog-grid">
            {filteredSystems.map((prod) => (
              <div
                key={prod.id}
                className="group flex flex-col justify-between p-6 bg-[#080a1a] border border-white/5 hover:border-[#0b16a7]/50 rounded-sm shadow-md transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_30px_rgba(11,22,167,0.15)] text-left"
              >
                <div>
                  {/* Category Stamp */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-sm font-bold tracking-widest ${
                      prod.category === "equipment" ? "bg-[#0b16a7]/20 text-blue-300 border border-[#0b16a7]/40" : "bg-purple-950/40 text-purple-300 border border-purple-900/40"
                    }`}>
                      {prod.category === "equipment" ? "Fine System" : "Field Service"}
                    </span>
                    <div className="p-1.5 bg-[#020412] rounded-sm text-[#0b16a7] group-hover:text-blue-300 group-hover:bg-[#0b16a7]/20 border border-[#0b16a7]/20 transition-colors">
                      <SmartIcon name={prod.iconName} className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-md tracking-tight leading-snug group-hover:text-blue-300 transition-colors">
                    {prod.title}
                  </h3>

                  <p className="text-gray-400 text-xs mt-3 leading-relaxed line-clamp-3">
                    {prod.shortDesc}
                  </p>
                </div>

                {/* Card Action footer trigger */}
                <div className="mt-6 pt-4 border-t border-[#0b16a7]/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#0b16a7] font-bold group-hover:text-blue-300 transition-colors">
                    Analyze Specs
                  </span>
                  <button
                    onClick={() => setSelectedProductDetails(prod)}
                    className="p-1 rounded-sm bg-[#020412] hover:bg-[#0b16a7]/20 border border-[#0b16a7]/30 group-hover:border-[#0b16a7] transition-all text-gray-400 hover:text-white cursor-pointer"
                    aria-label={`View ${prod.title} technical specifications`}
                  >
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHOOSE US BENTO STRENGTHS */}
      <section className="py-20 bg-[#080a1a] border-b border-[#0b16a7]/20" id="why-choose">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl text-left space-y-2 mb-12">
            <div className="inline-block px-3 py-1 bg-[#0b16a7]/30 border border-[#0b16a7] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-blue-300 rounded-sm">
              Why Choose Harley
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Why Materials Physicists Rely On Harley
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed uppercase tracking-widest font-mono text-[11px] mt-1">
              Serving the academic and semiconductor industry ecosystem since 1987.
            </p>
          </div>

          {/* Bento dynamic grid boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteData.trustPoints.map((tp, idx) => (
              <div
                key={tp.id}
                className="p-6 bg-[#020412] border border-[#0b16a7]/30 rounded-sm relative overflow-hidden group hover:border-[#0b16a7] transition-all text-left shadow-lg"
              >
                {/* Visual grid count background indicator */}
                <div className="absolute right-4 top-2 text-6xl font-extrabold text-[#0b16a7]/10 group-hover:text-[#0b16a7]/30 transition-colors select-none">
                  0{idx + 1}
                </div>

                <div className="w-10 h-10 bg-[#080a1a] border border-[#0b16a7]/30 rounded-sm flex items-center justify-center text-blue-400 mb-6 group-hover:text-white transition-colors">
                  <SmartIcon name={tp.iconName} className="w-5 h-5" />
                </div>

                <h3 className="font-bold text-white text-sm tracking-wide mb-2 group-hover:text-blue-300 transition-colors uppercase">
                  {tp.title}
                </h3>

                <p className="text-gray-450 text-xs leading-relaxed font-sans">
                  {tp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION, SYSTEM MAP, & ACTIVE INTERACTIVE CONSULT FORM */}
      <section className="py-20 bg-[#020412] border-b border-[#0b16a7]/20" id="contact">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Coordinates Details Column */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-block px-3 py-1 bg-[#0b16a7]/30 border border-[#0b16a7] text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 rounded-sm">
              PHYSICAL COORDINATES & SLA HOURS
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Connect With Harley Officers
            </h2>
            <p className="text-gray-405 text-sm leading-relaxed max-w-md">
              Reach out directly to schedule diagnostic surveys or request installation calibrations at Pune. First contact via Secure Mail channels is prioritized.
            </p>

            <div className="space-y-4 pt-4 border-t border-[#0b16a7]/20">
              
              {/* Coordinates: Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#080a1a] border border-[#0b16a7]/30 rounded-sm text-blue-400">
                  <MapPin className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0b16a7] font-mono">Headquarters Location</h4>
                  <p className="text-gray-200 font-sans text-xs max-w-xs mt-1 leading-normal uppercase">
                    {siteData.contact.address}
                  </p>
                </div>
              </div>

              {/* Coordinates: Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#080a1a] border border-[#0b16a7]/30 rounded-sm text-blue-400">
                  <Mail className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0b16a7] font-mono">Mail Channels (Preferred)</h4>
                  <p className="text-gray-200 font-sans text-xs mt-1">
                    <a href={`mailto:${siteData.contact.email}`} className="text-blue-400 hover:text-white transition-colors font-mono font-bold tracking-wider">
                      {siteData.contact.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Coordinates: Phone */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#080a1a] border border-[#0b16a7]/30 rounded-sm text-blue-400">
                  <Phone className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0b16a7] font-mono">Direct Communication (Phone)</h4>
                  <p className="text-gray-200 font-sans text-xs mt-1 font-mono tracking-wide">
                    {siteData.contact.phone}
                  </p>
                </div>
              </div>

              {/* Coordinates: Hours */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#080a1a] border border-[#0b16a7]/30 rounded-sm text-blue-400">
                  <Clock className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0b16a7] font-mono">Calibration & SLA Engineering Hours</h4>
                  <p className="text-gray-200 font-sans text-xs mt-1 uppercase">
                    {siteData.contact.workingHoursWeekdays}
                  </p>
                  <p className="text-gray-400 font-sans text-[11px] italic mt-0.5 uppercase">
                    {siteData.contact.workingHoursSaturday}
                  </p>
                </div>
              </div>

              {/* Coordinates: LinkedIn */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#080a1a] border border-[#0b16a7]/30 rounded-sm text-blue-400">
                  <Linkedin className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#0b16a7] font-mono">Corporate LinkedIn Network</h4>
                  <p className="text-gray-200 font-sans text-xs mt-1 leading-normal">
                    <a
                      href={siteData.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-white inline-flex items-center gap-1 font-mono font-semibold"
                    >
                      Connect On LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Micro aesthetic vector grid map box */}
            <div className="pt-4">
              <div className="h-28 rounded-sm bg-[#080a1a] border border-[#0b16a7]/30 p-3 relative overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-0 bg-[radial-gradient(#0b16a7_0.75px,transparent_0.75px)] opacity-30 [background-size:12px_12px]" />
                <div className="absolute top-2 left-2 text-[9px] font-mono text-blue-400 bg-[#020412] px-1.5 py-0.5 border border-[#0b16a7]/30 rounded-sm font-bold tracking-wider">
                  PUNE_COORDINATES // Lat. 18.4907° N, Long. 73.8641° E
                </div>
                {/* Visual locator pin representation */}
                <div className="absolute left-1/2 top-1/2 -mt-3 -ml-3 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500 animate-ping" />
                <div className="absolute left-1/2 top-1/2 -mt-1.5 -ml-1.5 w-3 h-3 rounded-full bg-blue-600 border border-white" />
                
                <p className="text-[10px] text-gray-300 font-mono z-10 font-bold px-1 relative uppercase tracking-wider">
                  ELECTRONIC ESTATE, SATARA ROAD
                </p>
              </div>
            </div>
          </div>

          {/* Interactive quotation and consulting lead form */}
          <div className="lg:col-span-7 bg-[#080a1a] border border-[#0b16a7]/30 p-6 md:p-8 rounded-sm shadow-xl space-y-4">
            <div className="text-left border-b border-[#0b16a7]/20 pb-4">
              <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-wider">
                Initiate Instant Technical Consultation
              </h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-mono text-[10px]">
                Authorized materials physicists and instrument procurement directors will map your requirements instantly.
              </p>
            </div>

            <LeadCaptureForm
              products={siteData.products}
              onSubmitSuccess={handleInquirySubmission}
            />
          </div>
        </div>
      </section>

      {/* FULL CMS SECTION IN WORKSPACE RENDER BLOCK */}
      <section className="py-20 bg-[#020412]/50 border-t border-[#0b16a7]/30" id="administrative-console">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <Terminal className="w-8 h-8 text-[#0b16a7] mx-auto" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
              Corporate Configuration Terminal
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans uppercase tracking-wider">
              To fully comply with design requests: All website copy, catalog products, detailed technical specs lists, milestones timeline, and contact cards will adapt dynamically on editing. Passcode Defaults: <code className="bg-[#080a1a] p-1 px-2.5 rounded-sm text-blue-300 font-mono border border-[#0b16a7]/30">1987</code>
            </p>
          </div>

          <AdminPanel
            data={siteData}
            onUpdateData={setSiteData}
            inquiries={inquiriesList}
            onUpdateInquiries={setInquiriesList}
            onResetToDefault={handleResetToDefaultAll}
          />
        </div>
      </section>

      {/* CORPORATE FOOTER */}
      <footer className="bg-[#05081a] border-t border-[#0b16a7]/30 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#0b16a7]/20 pb-12">
          {/* Logo and Copyright */}
          <div className="md:col-span-4 space-y-3 text-left">
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-white text-xl tracking-tighter">HARLEY</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#0b16a7] font-bold">
                ESTABLISHED 1987
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-450 uppercase tracking-wide">
              Highly specialized technical representation, system servicing, and contract physics diagnostics. Operating since 1987.
            </p>
            <p className="text-[10px] font-mono tracking-widest text-[#0b16a7] uppercase font-bold">
              &copy; 1987 - 2026 Harley Scientific India Ltd.
            </p>
          </div>

          {/* Quick specs list */}
          <div className="md:col-span-4 text-left grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-mono text-[10px] text-[#0b16a7] uppercase tracking-widest font-bold mb-3">Core Hardware</h5>
              <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                <li>Deposition Coaters</li>
                <li>Reciprocating saws</li>
                <li>Plasma Cleaners</li>
                <li>Pulsed station lasers</li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono text-[10px] text-[#0b16a7] uppercase tracking-widest font-bold mb-3">Field Services</h5>
              <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                <li>Electromagnetic surveys</li>
                <li>Active isolation setups</li>
                <li>Calibrations & SLAs</li>
                <li>TEM specimen prep</li>
              </ul>
            </div>
          </div>

          {/* Address, timings and Linkedin link */}
          <div className="md:col-span-4 text-left space-y-2">
            <h5 className="font-mono text-[10px] text-[#0b16a7] uppercase tracking-widest font-bold mb-1">Corporate coordinates</h5>
            <p className="text-[10px] text-slate-400 leading-normal uppercase tracking-widest font-mono">
              {siteData.contact.address}
            </p>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              <span>{siteData.contact.workingHoursWeekdays}</span>
              <span className="block italic">{siteData.contact.workingHoursSaturday}</span>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white p-1.5 bg-[#020412] border border-[#0b16a7]/20 rounded-sm hover:border-[#0b16a7] transition-all flex items-center justify-center"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteData.contact.email}`}
                className="text-slate-400 hover:text-white p-1.5 bg-[#020412] border border-[#0b16a7]/20 rounded-sm hover:border-[#0b16a7] transition-all flex items-center justify-center animate-pulse"
                aria-label="Email address"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer legalities */}
        <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-[#0b16a7]/80 uppercase font-bold tracking-widest">
          <div className="flex flex-wrap gap-4 items-center">
            <a href="#about" className="hover:text-white transition-colors">Corporate Integrity Charter</a>
            <span>·</span>
            <a href="#products" className="hover:text-white transition-colors">OEM calibration warranties</a>
            <span>·</span>
            <a href="#contact" className="hover:text-white transition-colors">Privacy & regulations</a>
          </div>
          <div className="text-gray-600 font-normal normal-case">
            Built with dynamic offline capabilities. Compliant for immediate industrial preview.
          </div>
        </div>
      </footer>

      {/* REUSABLE PRODUCT DETAIL SPECS MODAL */}
      <Modal
        isOpen={selectedProductDetails !== null}
        onClose={() => {
          setSelectedProductDetails(null);
          setShowInquiryModalProduct(null);
        }}
        title={selectedProductDetails?.title ? `${selectedProductDetails.title} — Active Design Specifications` : ""}
        maxWidth="lg"
      >
        {selectedProductDetails && (
          <div className="space-y-6 text-left" id="selected-product-modal-view">
            {/* Split layout inside detail view */}
            <div className="flex items-center gap-3">
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                selectedProductDetails.category === "equipment" ? "bg-blue-900/45 text-blue-400 border border-blue-500/20" : "bg-purple-900/40 text-purple-400 border border-purple-500/20"
              }`}>
                {selectedProductDetails.category === "equipment" ? "Fine System Unit" : "Scientific Consulting SLA"}
              </span>
              <div className="p-1 px-2.5 bg-slate-950 rounded text-xs text-slate-400 flex items-center gap-1 font-mono border border-slate-800">
                <SmartIcon name={selectedProductDetails.iconName} className="w-3.5 h-3.5 text-blue-400" />
                <span>INDEX_CODE: {selectedProductDetails.id}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-200 font-display">Technical System Capabilities</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans font-normal">
                {selectedProductDetails.fullDesc}
              </p>
            </div>

            {/* List specifications */}
            {selectedProductDetails.specifications && selectedProductDetails.specifications.length > 0 && (
              <div className="space-y-3 p-4 bg-slate-950 border border-slate-850 rounded-lg">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Lab Verification Matrix
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {selectedProductDetails.specifications.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span className="font-sans font-medium">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* NESTED TRIGGER Quote request in standard view */}
            {showInquiryModalProduct === selectedProductDetails.title ? (
              <div className="pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
                <div className="text-left">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono mb-1">
                    Direct Quote Request Form
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Submit coordinates to obtain custom NABL parameters or physical on-site evaluations for {selectedProductDetails.title}.
                  </p>
                </div>

                <LeadCaptureForm
                  products={siteData.products}
                  selectedProductDefault={selectedProductDetails.title}
                  onSubmitSuccess={handleInquirySubmission}
                  onClose={() => setShowInquiryModalProduct(null)}
                />
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedProductDetails(null);
                    setShowInquiryModalProduct(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs"
                >
                  Close Specification Archive
                </button>
                <button
                  onClick={() => setShowInquiryModalProduct(selectedProductDetails.title)}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Initiate Quote Request
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* COMPACT GENERIC EMAIL INQUIRY FORM MODAL */}
      <Modal
        isOpen={showGenericQuoteModal}
        onClose={() => setShowGenericQuoteModal(false)}
        title="Immediate Technical Inquiry Coordination"
        maxWidth="lg"
      >
        <div className="space-y-4 font-normal text-left" id="generic-quote-modal">
          <div className="p-3 bg-blue-950/25 border border-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center gap-2 mb-2 leading-relaxed">
            <ShieldCheck className="w-5 h-5 shrink-0 text-blue-400" />
            <p>
              Your contact will route directly to Harley&apos;s Pune administration board, operating since 1987. No technical details will be shared externally.
            </p>
          </div>

          <LeadCaptureForm
            products={siteData.products}
            onSubmitSuccess={handleInquirySubmission}
            onClose={() => setShowGenericQuoteModal(false)}
          />
        </div>
      </Modal>

      {/* FLOATING ACTION PASSCODE TRIGGER ICON FOR CONVENIENCE */}
      <button
        onClick={() => {
          setIsAdminPortalOpen(true);
          const el = document.getElementById("administrative-console");
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="fixed bottom-4 right-4 z-30 p-3.5 bg-gradient-to-tr from-slate-900 to-slate-950 hover:from-blue-900/80 hover:to-indigo-950/80 border border-slate-800 hover:border-blue-500/40 rounded-full text-slate-400 hover:text-blue-400 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
        title="Access Administrative Terminal"
        aria-label="Open CMS Control Panel"
      >
        <Lock className="w-4 h-4" />
      </button>
    </div>
  );
}
