import React, { useState, useRef } from "react";
import { WebsiteData, ProductService, TrustPoint, InquiryLead, Statistic } from "../types";
import {
  Lock,
  Unlock,
  Sliders,
  Database,
  Users,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Upload,
  FileText,
  Mail,
  User,
  Building,
  Calendar,
  Check,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";

interface AdminPanelProps {
  data: WebsiteData;
  onUpdateData: (newData: WebsiteData) => void;
  inquiries: InquiryLead[];
  onUpdateInquiries: (newInquiries: InquiryLead[]) => void;
  onResetToDefault: () => void;
}

export default function AdminPanel({
  data,
  onUpdateData,
  inquiries,
  onUpdateInquiries,
  onResetToDefault
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"general" | "products" | "about" | "inquiries" | "backup">("general");

  // Local state for edits before saving
  const [heroForm, setHeroForm] = useState(data.hero);
  const [aboutForm, setAboutForm] = useState(data.about);
  const [productsForm, setProductsForm] = useState<ProductService[]>(data.products);
  const [trustForm, setTrustForm] = useState<TrustPoint[]>(data.trustPoints);
  const [contactForm, setContactForm] = useState(data.contact);

  // Search/Filter for CRM Inquiries
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("All");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryLead | null>(null);
  const [adminNotesText, setAdminNotesText] = useState("");

  // Product under editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProductForm, setNewProductForm] = useState<Partial<ProductService>>({
    title: "",
    category: "equipment",
    shortDesc: "",
    fullDesc: "",
    specifications: [],
    iconName: "Layers"
  });
  const [showAddNewProduct, setShowAddNewProduct] = useState(false);

  // General state feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "1987") {
      setIsAuthenticated(true);
      setPasscodeError(false);
      // Synchronize edit forms
      setHeroForm(data.hero);
      setAboutForm(data.about);
      setProductsForm(data.products);
      setTrustForm(data.trustPoints);
      setContactForm(data.contact);
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 2000);
    }
  };

  const handleSaveGeneral = () => {
    const updated: WebsiteData = {
      ...data,
      hero: { ...heroForm },
      contact: { ...contactForm }
    };
    onUpdateData(updated);
    triggerSuccessFeedback("General configuration updated successfully!");
  };

  const triggerSuccessFeedback = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  // Products CRUD
  const handleProductEditChange = (id: string, field: keyof ProductService, value: any) => {
    setProductsForm(prev =>
      prev.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleProductSpecsChange = (id: string, bulletText: string) => {
    const specsArray = bulletText.split("\n").filter(line => line.trim().length > 0);
    setProductsForm(prev =>
      prev.map(p => (p.id === id ? { ...p, specifications: specsArray } : p))
    );
  };

  const saveProductEdits = () => {
    onUpdateData({
      ...data,
      products: [...productsForm]
    });
    setEditingProductId(null);
    triggerSuccessFeedback("Products & Services definitions synchronized with live system.");
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title || !newProductForm.shortDesc) return;

    const newRow: ProductService = {
      id: `prod-${Date.now()}`,
      title: newProductForm.title,
      category: newProductForm.category || "equipment",
      shortDesc: newProductForm.shortDesc,
      fullDesc: newProductForm.fullDesc || newProductForm.shortDesc,
      specifications: newProductForm.specifications || [],
      iconName: newProductForm.iconName || "Layers"
    };

    const updatedList = [...productsForm, newRow];
    setProductsForm(updatedList);
    onUpdateData({
      ...data,
      products: updatedList
    });

    // Reset Form
    setNewProductForm({
      title: "",
      category: "equipment",
      shortDesc: "",
      fullDesc: "",
      specifications: [],
      iconName: "Layers"
    });
    setShowAddNewProduct(false);
    triggerSuccessFeedback(`Added new system: ${newRow.title}`);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this scientific system/service description? This will remove it from the live visitor equipment menu.")) {
      const updatedList = productsForm.filter(p => p.id !== id);
      setProductsForm(updatedList);
      onUpdateData({
        ...data,
        products: updatedList
      });
      triggerSuccessFeedback("Product entry deleted.");
    }
  };

  // About and Trust points
  const handleAboutSave = () => {
    onUpdateData({
      ...data,
      about: { ...aboutForm },
      trustPoints: [...trustForm]
    });
    triggerSuccessFeedback("Heritage story & core competence metrics synchronized successfully.");
  };

  const handleAboutParagraphChange = (index: number, val: string) => {
    const updatedParagraphs = [...aboutForm.paragraphs];
    updatedParagraphs[index] = val;
    setAboutForm({
      ...aboutForm,
      paragraphs: updatedParagraphs
    });
  };

  const handleTrustChange = (id: string, field: keyof TrustPoint, val: string) => {
    setTrustForm(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const handleMilestoneChange = (index: number, field: "year" | "title" | "desc", val: string) => {
    const updatedMilestones = [...aboutForm.milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: val };
    setAboutForm({
      ...aboutForm,
      milestones: updatedMilestones
    });
  };

  const handleAddMilestone = () => {
    const updatedMilestones = [
      ...aboutForm.milestones,
      { year: "2026", title: "New Milestone Title", desc: "Brief explanation of scientific expansion." }
    ];
    setAboutForm({
      ...aboutForm,
      milestones: updatedMilestones
    });
  };

  const handleDeleteMilestone = (index: number) => {
    const updatedMilestones = aboutForm.milestones.filter((_, i) => i !== index);
    setAboutForm({
      ...aboutForm,
      milestones: updatedMilestones
    });
  };

  // Inquiry CRM Status edit
  const handleUpdateInquiryStatus = (id: string, newStatus: InquiryLead["status"]) => {
    const list = inquiries.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: newStatus };
      }
      return inq;
    });
    onUpdateInquiries(list);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
    triggerSuccessFeedback(`Inquiry status updated to: ${newStatus}`);
  };

  const handleSaveInquiryNotes = (id: string) => {
    const list = inquiries.map(inq => {
      if (inq.id === id) {
        return { ...inq, adminNotes: adminNotesText };
      }
      return inq;
    });
    onUpdateInquiries(list);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, adminNotes: adminNotesText });
    }
    triggerSuccessFeedback("Administrative notes saved.");
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm("Verify: Permanently delete this lead ticket from Pune storage?")) {
      const list = inquiries.filter(i => i.id !== id);
      onUpdateInquiries(list);
      setSelectedInquiry(null);
      triggerSuccessFeedback("Inquiry purged successfully.");
    }
  };

  // Export / Import JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ data, inquiries }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `harley_scientific_cms_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.data && parsed.data.hero && parsed.data.products) {
          onUpdateData(parsed.data);
          if (parsed.inquiries) {
            onUpdateInquiries(parsed.inquiries);
          }
          // Reset internal buffers
          setHeroForm(parsed.data.hero);
          setAboutForm(parsed.data.about);
          setProductsForm(parsed.data.products);
          setTrustForm(parsed.data.trustPoints);
          setContactForm(parsed.data.contact);

          triggerSuccessFeedback("Configuration system loaded & restored successfully.");
        } else {
          alert("Invalid backup schema. Required nodes omitted.");
        }
      } catch (err) {
        alert("Corrupt JSON structure. Refused.");
      }
    };
    fileReader.readAsText(files[0]);
  };

  const triggerResetEverything = () => {
    if (window.confirm("Are you absolutely sure you want to revert ALL sections, products, contact details, and images back to the original 1987 corporate default? Any custom-written technical changes will be immediately erased.")) {
      onResetToDefault();
      setIsAuthenticated(false);
      triggerSuccessFeedback("Website reset to corporate defaults.");
    }
  };

  // Filter inquiries list
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch =
      inq.fullName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.organization.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.message.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.productInterest.toLowerCase().includes(inquirySearch.toLowerCase());

    const matchesStatus = inquiryStatusFilter === "All" || inq.status === inquiryStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl text-slate-200">
      {/* CMS BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-900/40 text-blue-400 border border-blue-500/20">
            <Sliders className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg tracking-wide text-slate-100 flex items-center gap-2">
              HARLEY CMS ADMINISTRATION
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400">Manage products specifications, catalog items, and client inquiries securely.</p>
          </div>
        </div>

        <div>
          {isAuthenticated ? (
            <button
              onClick={() => setIsAuthenticated(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-md text-xs font-mono transition-all text-slate-300 pointer-events-auto cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              LOCK TERMINAL
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              TERMINAL ENCRYPTED
            </span>
          )}
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-400 text-xs px-6 py-3 flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{saveSuccessMsg}</span>
        </div>
      )}

      {/* RENDER LOGIN SCREEN IF NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <div className="p-8 max-w-md mx-auto text-center" id="admin-passcode-view">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-900/10 border border-blue-500/20 text-blue-400 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-semibold font-display text-slate-100 mb-1">
            Access System Configurator
          </h4>
          <p className="text-xs text-slate-400 mb-6">
            Enter the Harley B2B secure control PIN. Standard updates and submissions are stored in local physical storage.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Pin Number (Hint: Year Established 1987)"
                  className={`w-full text-center px-4 py-3 bg-slate-950 border rounded-lg text-slate-100 placeholder-slate-500 font-mono tracking-widest focus:outline-none focus:ring-1 text-sm ${
                    passcodeError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-800 focus:border-blue-600 focus:ring-blue-600"
                  }`}
                />
              </div>
              {passcodeError && (
                <p className="text-red-400 text-xs mt-1 animate-shake">Incorrect PIN passcode. Please check correct founding year.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 active:bg-blue-850 rounded-lg text-white font-medium text-sm gap-2 inline-flex items-center justify-center transition-colors pointer-events-auto cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              Unlock System Dashboard
            </button>
          </form>
          <div className="mt-6 p-2 bg-slate-950/50 border border-slate-850 rounded text-[11px] text-slate-400">
            <strong>Security Standard Check:</strong> Defaults PIN is <code className="text-blue-400">1987</code>. No external database provisioning is required for client side evaluation.
          </div>
        </div>
      ) : (
        /* LOGGED IN TERMINAL CMS PANEL */
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* SIDEBAR TABS */}
          <div className="w-full md:w-56 bg-slate-950 border-r border-slate-800/80 p-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded font-medium transition-colors text-left shrink-0 pb-2 ${
                activeTab === "general"
                  ? "bg-blue-900/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>General Copy & CTA</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded font-medium transition-colors text-left shrink-0 pb-2 ${
                activeTab === "products"
                  ? "bg-blue-900/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Products & Services</span>
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded font-medium transition-colors text-left shrink-0 pb-2 ${
                activeTab === "about"
                  ? "bg-blue-900/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>About Us Story</span>
            </button>

            <button
              onClick={() => setActiveTab("inquiries")}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded font-medium transition-colors text-left shrink-0 pb-2 ${
                activeTab === "inquiries"
                  ? "bg-blue-900/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Client Inquiries (CRM)</span>
              </span>
              {inquiries.filter(i => i.status === "New").length > 0 && (
                <span className="bg-red-500 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full leading-none">
                  {inquiries.filter(i => i.status === "New").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("backup")}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded font-medium transition-colors text-left shrink-0 pb-2 ${
                activeTab === "backup"
                  ? "bg-blue-900/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>System & Backups</span>
            </button>
          </div>

          {/* ACTIVE TAB WORKSPACE */}
          <div className="flex-1 p-6 bg-slate-900/30">
            {/* GENERAL COPY TAB */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 font-display border-b border-slate-800 pb-2 mb-4">
                    Hero Frame Messaging Block
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Hero Top Badge Text</label>
                      <input
                        type="text"
                        value={heroForm.badge}
                        onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Hero Bold Headline</label>
                      <textarea
                        rows={2}
                        value={heroForm.title}
                        onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Hero Sub-paragraph Description</label>
                      <textarea
                        rows={3}
                        value={heroForm.subtitle}
                        onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Call-to-Action Buttons Copy</label>
                      <input
                        type="text"
                        value={heroForm.ctaText}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-100 font-display border-b border-slate-800 pb-2 mb-4">
                    Official Contact Coordinates & Hours
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Corporate Email Address</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Primary Sales Phone</label>
                      <input
                        type="text"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={contactForm.linkedin}
                        onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Weekdays Timing Description</label>
                      <input
                        type="text"
                        value={contactForm.workingHoursWeekdays}
                        onChange={(e) => setContactForm({ ...contactForm, workingHoursWeekdays: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Saturday Operations</label>
                      <input
                        type="text"
                        value={contactForm.workingHoursSaturday}
                        onChange={(e) => setContactForm({ ...contactForm, workingHoursSaturday: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Physical Office Address</label>
                      <textarea
                        rows={2}
                        value={contactForm.address}
                        onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setHeroForm(data.hero);
                      setContactForm(data.contact);
                    }}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={handleSaveGeneral}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save General Configuration
                  </button>
                </div>
              </div>
            )}

            {/* PRODUCTS & SERVICES TAB */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 font-display">
                      Specialized System Inventory
                    </h4>
                    <p className="text-xs text-slate-400">Add, edit, or purge catalog equipment units listed on Harley.</p>
                  </div>
                  <button
                    onClick={() => setShowAddNewProduct(!showAddNewProduct)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Corporate Entry
                  </button>
                </div>

                {/* ADD NEW PRODUCT FORM COVERS */}
                {showAddNewProduct && (
                  <form onSubmit={handleAddNewProduct} className="p-4 bg-slate-950/60 border border-emerald-500/20 rounded-lg space-y-4">
                    <h5 className="text-xs uppercase font-mono tracking-wider text-emerald-400">Add Corporate Entry</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={newProductForm.title}
                          onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                          placeholder="e.g. Laser Micromachining V2"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Category *</label>
                        <select
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                        >
                          <option value="equipment">Fine Scientific Equipment (Hardware)</option>
                          <option value="service">Technical Services (SLA/Laboratories)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Brief Pitch Summary *</label>
                      <input
                        type="text"
                        required
                        value={newProductForm.shortDesc}
                        onChange={(e) => setNewProductForm({ ...newProductForm, shortDesc: e.target.value })}
                        placeholder="1-sentence snippet summarizing the product to show on cards."
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Deep Technical Presentation (Large Paragraph)</label>
                      <textarea
                        rows={3}
                        value={newProductForm.fullDesc}
                        onChange={(e) => setNewProductForm({ ...newProductForm, fullDesc: e.target.value })}
                        placeholder="Comprehensive specifications or capability explanations for client query view..."
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Select Icon Type</label>
                      <select
                        value={newProductForm.iconName}
                        onChange={(e) => setNewProductForm({ ...newProductForm, iconName: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      >
                        <option value="Layers">Layers (Deposition Coating)</option>
                        <option value="Maximize-2">Maximize/Grid (Slicing/Sawing)</option>
                        <option value="Zap">Zap (Plasma/Electromagnetic Energy)</option>
                        <option value="Magnet">Magnet (Cancellation Interference)</option>
                        <option value="Sparkles">Sparkles (Quality/Services)</option>
                        <option value="Tv">Tv (Sample Polishing Screens)</option>
                        <option value="ShieldCheck">ShieldCheck (SLA calibration contracts)</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddNewProduct(false)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-slate-400 text-xs rounded transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded font-semibold transition-colors cursor-pointer"
                      >
                        Insert Into Live List
                      </button>
                    </div>
                  </form>
                )}

                {/* EDITING CATALOG ITEMS LIST */}
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                  {productsForm.map((prod) => (
                    <div
                      key={prod.id}
                      className={`p-3 bg-slate-950 border rounded-lg transition-all ${
                        editingProductId === prod.id ? "border-blue-600 bg-slate-950" : "border-slate-850"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded ${
                            prod.category === "equipment" ? "bg-blue-900/40 text-blue-400 border border-blue-500/20" : "bg-purple-900/40 text-purple-400 border border-purple-500/20"
                          }`}>
                            {prod.category === "equipment" ? "Precision System" : "Scientific Labor"}
                          </span>
                          <h5 className="font-semibold text-slate-200 mt-1 font-display">{prod.title}</h5>
                          <p className="text-xs text-slate-400 font-sans mt-0.5">{prod.shortDesc}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProductId(editingProductId === prod.id ? null : prod.id)}
                            className="p-1 px-2.5 bg-slate-850 hover:bg-slate-800 text-xs text-slate-300 rounded hover:text-white transition-colors cursor-pointer"
                          >
                            {editingProductId === prod.id ? "Minimize" : "Configure Details"}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1 px-1.5 bg-red-950/40 text-red-400 hover:bg-red-900 hover:text-white rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED INNER FORM */}
                      {editingProductId === prod.id && (
                        <div className="mt-4 pt-4 border-t border-slate-900 space-y-3 animate-fadeIn">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">Edit Name</label>
                              <input
                                type="text"
                                value={prod.title}
                                onChange={(e) => handleProductEditChange(prod.id, "title", e.target.value)}
                                className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs focus:ring-1 focus:ring-blue-600 outline-none text-slate-100"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-0.5">Change Icon</label>
                              <select
                                value={prod.iconName}
                                onChange={(e) => handleProductEditChange(prod.id, "iconName", e.target.value)}
                                className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                              >
                                <option value="Layers">Layers (Deposition Coating)</option>
                                <option value="Maximize-2">Maximize/Grid (Slicing/Sawing)</option>
                                <option value="Zap">Zap (Plasma/Electromagnetic Energy)</option>
                                <option value="Magnet">Magnet (Cancellation Interference)</option>
                                <option value="Sparkles">Sparkles (Quality/Services)</option>
                                <option value="Tv">Tv (Sample Polishing Screens)</option>
                                <option value="ShieldCheck">ShieldCheck (SLA calibration contracts)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Short Description</label>
                            <input
                              type="text"
                              value={prod.shortDesc}
                              onChange={(e) => handleProductEditChange(prod.id, "shortDesc", e.target.value)}
                              className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs focus:ring-1 focus:ring-blue-600 text-slate-100 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Long Description Text</label>
                            <textarea
                              rows={3}
                              value={prod.fullDesc}
                              onChange={(e) => handleProductEditChange(prod.id, "fullDesc", e.target.value)}
                              className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs focus:ring-1 focus:ring-blue-600 text-slate-100 outline-none resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">
                              Technical Specifications List (One spec per line)
                            </label>
                            <textarea
                              rows={4}
                              defaultValue={prod.specifications.join("\n")}
                              onBlur={(e) => handleProductSpecsChange(prod.id, e.target.value)}
                              placeholder={`Vacuum Range: < 10^-8 Torr\nPower Feed: RF Magnetron 300W\nCustom chambers configurations`}
                              className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono focus:ring-1 focus:ring-blue-600 text-slate-200 outline-none resize-none"
                            />
                            <p className="text-[10px] text-slate-500 italic mt-0.5">
                              * Simply click outside or hit &apos;Save Technical Catalog&apos; to process line separations.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    onClick={saveProductEdits}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Technical Catalog
                  </button>
                </div>
              </div>
            )}

            {/* ABOUT US STORY TAB */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 font-display border-b border-slate-800 pb-2 mb-4">
                    Enterprise Heritage Settings
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">About Section Top Badge</label>
                      <input
                        type="text"
                        value={aboutForm.badge}
                        onChange={(e) => setAboutForm({ ...aboutForm, badge: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Main Focus Title</label>
                      <input
                        type="text"
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1 font-mono">Sub-headline Story Heading</label>
                      <input
                        type="text"
                        value={aboutForm.storyHeading}
                        onChange={(e) => setAboutForm({ ...aboutForm, storyHeading: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs text-slate-300 font-mono">Story Narrative Paragraphs (3 Blocks)</label>
                      {aboutForm.paragraphs.map((p, index) => (
                        <div key={index}>
                          <span className="text-[10px] text-slate-500 block">Paragraph Block #{index + 1}</span>
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => handleAboutParagraphChange(index, e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-600 outline-none resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-100 font-display border-b border-slate-800 pb-2 mb-4 flex items-center justify-between">
                    <span>Corporate History Milestones Timeline</span>
                    <button
                      onClick={handleAddMilestone}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-755 text-[11px] rounded transition-transform cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Milestone
                    </button>
                  </h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {aboutForm.milestones.map((ms, index) => (
                      <div key={index} className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex flex-col gap-2 relative">
                        <button
                          onClick={() => handleDeleteMilestone(index)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1 rounded hover:bg-slate-900 transition-colors"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-500 block font-mono">Year</label>
                            <input
                              type="text"
                              value={ms.year}
                              onChange={(e) => handleMilestoneChange(index, "year", e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs outline-none focus:border-blue-600"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="text-[10px] text-slate-500 block font-mono">Summary Event Headline</label>
                            <input
                              type="text"
                              value={ms.title}
                              onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block font-mono">Detailed Milestone Description</label>
                          <input
                            type="text"
                            value={ms.desc}
                            onChange={(e) => handleMilestoneChange(index, "desc", e.target.value)}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-100 font-display border-b border-slate-800 pb-2 mb-4">
                    Core B2B Trust Points Row
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trustForm.map((tp) => (
                      <div key={tp.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-mono font-bold text-slate-400">Card ID: {tp.id}</span>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Service Headline</label>
                          <input
                            type="text"
                            value={tp.title}
                            onChange={(e) => handleTrustChange(tp.id, "title", e.target.value)}
                            className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs focus:ring-1 focus:ring-blue-600 outline-none text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Service Explanation</label>
                          <textarea
                            rows={2}
                            value={tp.description}
                            onChange={(e) => handleTrustChange(tp.id, "description", e.target.value)}
                            className="w-full px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-xs focus:ring-1 focus:ring-blue-600 outline-none text-slate-100 resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setAboutForm(data.about);
                      setTrustForm(data.trustPoints);
                    }}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={handleAboutSave}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Story & Trust Data
                  </button>
                </div>
              </div>
            )}

            {/* INQUIRIES REGISTER CRM TAB */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 font-display">
                      Client Consultations Terminal
                    </h4>
                    <p className="text-xs text-slate-400">
                      High-end client contact submissions registered on Pune electronic records.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search inquiries..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 outline-none w-40"
                    />
                    <select
                      value={inquiryStatusFilter}
                      onChange={(e) => setInquiryStatusFilter(e.target.value)}
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 outline-none"
                    >
                      <option value="All">All Leads</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* INQUIRIES LIST PANEL */}
                  <div className="col-span-1 lg:col-span-5 space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {filteredInquiries.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950/20 border border-slate-850 rounded-lg text-slate-400">
                        <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-xs">No scientific submissions match requirements.</p>
                      </div>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setAdminNotesText(inq.adminNotes || "");
                          }}
                          className={`p-3 border rounded-lg transition-all cursor-pointer text-left ${
                            selectedInquiry?.id === inq.id
                              ? "bg-blue-950/40 border-blue-500/40"
                              : "bg-slate-950/50 border-slate-850 hover:bg-slate-90/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400 font-semibold">{inq.id}</span>
                            <span className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded ${
                              inq.status === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              inq.status === 'Contacted' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              inq.status === 'Under Review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              inq.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <h5 className="font-semibold text-xs text-slate-200 mt-1 truncate">{inq.fullName}</h5>
                          <p className="text-[11px] text-slate-400 truncate">{inq.organization}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                            <span>{inq.timestamp.split(",")[0]}</span>
                            <span className="truncate max-w-[120px] text-right">{inq.productInterest}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* ACTIVE LEAD MANAGEMENT VIEW */}
                  <div className="col-span-1 lg:col-span-7 bg-slate-950/50 border border-slate-850 rounded-lg p-4 min-h-[300px] overflow-hidden flex flex-col">
                    {selectedInquiry ? (
                      <div className="space-y-4 flex-1 flex flex-col justify-between" id="crm-active-panel">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                            <div>
                              <span className="text-xs font-mono text-emerald-400 font-semibold mb-0.5 block">
                                Verification ID: {selectedInquiry.id}
                              </span>
                              <h5 className="text-md font-bold text-slate-200 flex items-center gap-1.5 font-display">
                                <User className="w-4 h-4 text-blue-400" />
                                {selectedInquiry.fullName}
                              </h5>
                            </div>
                            <button
                              onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                              className="p-1.5 bg-red-950/40 text-red-500 hover:bg-red-900 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Building className="w-3.5 h-3.5" /> Institution:
                            </span>
                            <strong className="text-slate-300 truncate">{selectedInquiry.organization}</strong>

                            <span className="text-slate-500">Department:</span>
                            <span className="text-slate-300 truncate">{selectedInquiry.department}</span>

                            <span className="text-slate-500 flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" /> Email Coordination:
                            </span>
                            <a
                              href={`mailto:${selectedInquiry.email}`}
                              className="text-blue-400 hover:underline font-mono truncate"
                            >
                              {selectedInquiry.email}
                            </a>

                            <span className="text-slate-500">Contact Telephone:</span>
                            <span className="text-slate-300 font-mono">{selectedInquiry.phone}</span>

                            <span className="text-slate-500">Product of Interest:</span>
                            <strong className="text-amber-400 font-medium truncate">{selectedInquiry.productInterest}</strong>

                            <span className="text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> Date Submitted:
                            </span>
                            <span className="text-slate-400 font-mono">{selectedInquiry.timestamp}</span>
                          </div>

                          <div className="mt-3 p-3 bg-slate-950/80 border border-slate-900 rounded-lg text-xs">
                            <h6 className="font-mono text-[10px] uppercase text-indigo-400 font-semibold mb-1">
                              User Consultation Proposal Summary
                            </h6>
                            <p className="text-slate-300 font-sans leading-relaxed break-words whitespace-pre-wrap">
                              {selectedInquiry.message}
                            </p>
                          </div>
                        </div>

                        {/* CRM WORKFLOW ACTIONS & ADMIN NOTES */}
                        <div className="pt-4 mt-4 border-t border-slate-900 space-y-3">
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase font-mono mb-1">
                              Change Lead Pipeline Status
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {(["New", "Contacted", "Under Review", "Resolved", "Archived"] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, st)}
                                  className={`px-2.5 py-1 text-[10px] font-mono rounded border transition-colors cursor-pointer ${
                                    selectedInquiry.status === st
                                      ? "bg-blue-600 text-white border-blue-500"
                                      : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase font-mono mb-1">
                              Internal Administration Remonstrance & Planning Notes
                            </label>
                            <div className="flex gap-2">
                              <textarea
                                rows={2}
                                value={adminNotesText}
                                onChange={(e) => setAdminNotesText(e.target.value)}
                                placeholder="Add comments here (e.g. 'Sent catalog specs on Monday' / 'Scheduled call with Dr. Rajesh on Friday')..."
                                className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded placeholder-slate-600 text-slate-200 outline-none resize-none"
                              />
                              <button
                                onClick={() => handleSaveInquiryNotes(selectedInquiry.id)}
                                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-xs shrink-0 inline-flex flex-col items-center justify-center transition-colors cursor-pointer"
                              >
                                <Save className="w-4 h-4 mb-0.5" />
                                <span>Save Notes</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center py-12">
                        <Users className="w-12 h-12 text-slate-700 mb-3" />
                        <h5 className="font-display font-semibold text-slate-400">Select Lead Ticket</h5>
                        <p className="text-xs max-w-xs mx-auto mt-1 text-slate-500">
                          Click on any incoming client consultation proposal to inspect details, set working statuses, or add engineering notes.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* BACKUP & RESTORE TAB */}
            {activeTab === "backup" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 font-display border-b border-slate-800 pb-2 mb-4 animate-fadeIn">
                    Regulatory Data Safeguard & Backups
                  </h4>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Protect your website, specifications layout, catalogs, contact credentials, and lead pipeline records.
                    Since Harley stores everything safely inside offline-first reactive slots, we offer seamless physical backups.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-lg text-center space-y-3">
                      <Download className="w-8 h-8 text-blue-500 mx-auto" />
                      <h5 className="text-slate-200 text-xs font-semibold uppercase tracking-wider font-mono">
                        Download Active JSON Backup
                      </h5>
                      <p className="text-slate-400 text-[11px]">
                        Save your entire content portfolio, services catalog, and client leads queue directly as a local .json file.
                      </p>
                      <button
                        onClick={handleExportData}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Download Backup
                      </button>
                    </div>

                    <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-lg text-center space-y-3">
                      <Upload className="w-8 h-8 text-purple-500 mx-auto" />
                      <h5 className="text-slate-200 text-xs font-semibold uppercase tracking-wider font-mono">
                        Restore Local Backups
                      </h5>
                      <p className="text-slate-400 text-[11px]">
                        Restore previous setups by uploading a saved Harley .json backup. Active modifications will be overwritten.
                      </p>
                      <div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          ref={fileInputRef}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Backup File
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-950/20 border border-red-500/10 rounded-lg space-y-2">
                  <h4 className="text-xs uppercase font-mono text-red-400 font-bold flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" /> Revert Workspace Defaults
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    If you wish to purge all local modifications and clear out temporary scientific data, you can revert all text, milestones, and catalog entries to the 1987 established defaults.
                  </p>
                  <button
                    onClick={triggerResetEverything}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded text-[11px] font-semibold transition-colors mt-2 cursor-pointer"
                  >
                    Reset System to Defaults
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
