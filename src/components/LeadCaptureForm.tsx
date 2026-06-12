import React, { useState } from "react";
import { ProductService, InquiryLead } from "../types";
import { Send, CheckCircle, ShieldAlert } from "lucide-react";

interface LeadCaptureFormProps {
  products: ProductService[];
  selectedProductDefault?: string;
  onSubmitSuccess: (inquiry: InquiryLead) => void;
  onClose?: () => void;
}

export default function LeadCaptureForm({
  products,
  selectedProductDefault = "",
  onSubmitSuccess,
  onClose
}: LeadCaptureFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [productInterest, setProductInterest] = useState(selectedProductDefault);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCode, setSubmissionCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !organization || !message) {
      setErrorMsg("Please fill in all mandatory fields (Name, Email, Organization, Inquiry details).");
      return;
    }

    if (!consent) {
      setErrorMsg("Please check the consent box to authorize contact.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    // Simulate database secure sync
    setTimeout(() => {
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const ticketId = `HR-2026-${codeNum}`;

      const newInquiry: InquiryLead = {
        id: ticketId,
        timestamp: new Date().toLocaleString(),
        fullName,
        email,
        phone: phone || "N/A",
        organization,
        department: department || "General Science Group",
        productInterest: productInterest || "General Inquiry",
        message,
        status: "New"
      };

      onSubmitSuccess(newInquiry);
      setSubmissionCode(ticketId);
      setIsSubmitting(false);

      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setOrganization("");
      setDepartment("");
      setMessage("");
      setConsent(false);
    }, 1200);
  };

  if (submissionCode) {
    return (
      <div className="text-center py-8 px-4" id="submission-success-view">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-semibold text-slate-100 font-display mb-2">
          Inquiry Successfully Logged
        </h4>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Thank you. Your request has been registered in our B2B technical tracking system under reference code:
        </p>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 inline-block font-mono text-emerald-400 text-lg tracking-wider mb-6">
          {submissionCode}
        </div>
        <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
          A physical apparatus systems specialist will contact you directly at your email ({email || "provided email"}) within 8 working hours.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => setSubmissionCode("")}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm"
          >
            Submit Another Query
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
            >
              Close Window
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="scientific-lead-form">
      {errorMsg && (
        <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="full-name">
            Contact Person *
          </label>
          <input
            id="full-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Dr. Rajesh Kumar"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="email">
            Professional Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="r.kumar@iitp.ac.in"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="phone">
            Direct Phone Number
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98450 12345"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="product-interest">
            System / Service of Interest
          </label>
          <select
            id="product-interest"
            value={productInterest}
            onChange={(e) => setProductInterest(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all"
          >
            <option value="">-- General Technical Consultation --</option>
            {products.map((p) => (
              <option key={p.id} value={p.title}>
                {p.title} ({p.category === "equipment" ? "System" : "Service"})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="org">
            Scientific Institution / Company *
          </label>
          <input
            id="org"
            type="text"
            required
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="IIT Bombay / DRDO / NCL"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="dept">
            Research Department / Branch
          </label>
          <input
            id="dept"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Condensed Matter Physics Lab"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="msg">
          Required Specifications / Project Proposal Details *
        </label>
        <textarea
          id="msg"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe sample materials, required thin film thicknesses, target vacuum ranges, vacuum chambers specs, or electromagnetic interference levels of concern..."
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all resize-none"
        />
      </div>

      <div className="flex items-start gap-2 pt-2">
        <input
          id="consent-checkbox"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-blue-600"
        />
        <label htmlFor="consent-checkbox" className="text-xs text-slate-400 cursor-pointer">
          I authorize Harley Systems and its NABL-certified engineering directors to contact me and keep my contact credentials safely logged in Pune according to ISO-compliant B2B research standards.
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-850">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all font-medium text-sm disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Processing Securely...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Secure Transmission
            </>
          )}
        </button>
      </div>
    </form>
  );
}
