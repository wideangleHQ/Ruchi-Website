import type { Metadata } from "next";
import { LegalPageLayout, type LegalSection } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Statutory Privacy Policy for Ruchi Foodline (Om Oil & Flour Mills Ltd.). Formulated under the DPDP Act 2023, IT Act 2000, and applicable Indian e-commerce regulations.",
};

const SECTIONS: LegalSection[] = [
  { id: "legislative-framework", title: "Legislative Framework & Statutory Scope" },
  { id: "statutory-definitions", title: "Statutory Definitions" },
  { id: "data-categories", title: "Categories of Personal Data Collected" },
  { id: "lawful-grounds", title: "Lawful Grounds & Purpose of Data Processing" },
  { id: "cookies-analytics", title: "Cookie Architecture & Digital Analytics" },
  { id: "information-sharing", title: "Information Sharing, Disclosures & Partners" },
  { id: "cross-border", title: "Cross-Border Data Transfers" },
  { id: "data-security", title: "Data Security, Safeguards & Infrastructure" },
  { id: "data-retention", title: "Data Retention & Archival Protocol" },
  { id: "data-principal-rights", title: "Statutory Rights of the Data Principal" },
  { id: "children-policy", title: "Children's Data Protection Policy" },
  { id: "grievance-officer", title: "Statutory Grievance Redressal Officer" },
  { id: "corporate-contact", title: "Corporate Entity & Official Contact Coordinates" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Statutory Privacy Policy"
      effectiveDate="September 25, 2026"
      version="3.0 (Comprehensive)"
      sections={SECTIONS}
      activeType="privacy"
    >
      {/* Preamble / Summary Box */}
      <div className="bg-[#f7f6f2] border border-gray-200 rounded-xl p-5 sm:p-6 text-xs sm:text-sm text-gray-900 font-medium space-y-3">
        <h2 className="text-[#0e6337] font-serif font-bold text-base">
          Commitment to Data Privacy &amp; Consumer Trust
        </h2>
        <p className="leading-relaxed font-medium text-gray-900">
          This Privacy Policy explains how <strong className="font-bold text-gray-900">Om Oil &amp; Flour Mills Ltd.</strong> (“Company”, “we”, “our” or “us”),
          operating under the brand <strong className="font-bold text-gray-900">RUCHI &amp; FROZIT</strong>, collects, uses, processes, stores, shares, and protects
          personal data in connection with its website (
          <a href="https://www.ruchifoodline.com" className="text-[#168a4a] hover:underline font-bold">
            www.ruchifoodline.com
          </a>
          ), digital storefronts, customer support services, and related commercial activities. This Policy shall be read
          strictly together with the applicable Terms &amp; Conditions and statutory provisions of applicable Indian laws.
        </p>
        <div className="pt-2 border-t border-gray-200/80 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-gray-800 font-medium">
          <span><strong className="font-bold text-gray-900">CIN:</strong> U15495OR1997PLC004861</span>
          <span><strong className="font-bold text-gray-900">FSSAI Central Lic:</strong> 10012032000096, 12025999000126</span>
          <span><strong className="font-bold text-gray-900">Certifications:</strong> ISO 22000:2018 | ISO 9002 | CRISIL SME 2</span>
        </div>
      </div>

      {/* 1. Legislative Framework & Statutory Scope */}
      <section id="legislative-framework" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">01.</span>
          <span>Legislative Framework &amp; Statutory Scope</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          Om Oil &amp; Flour Mills Ltd. (“Company”, “we”, “our”, or “us”), operating under the registered brand trademarks{" "}
          <strong className="font-bold text-gray-900">Ruchi Foodline</strong> and <strong className="font-bold text-gray-900">Frozit</strong>, recognizes the critical importance of digital privacy,
          data security, and consumer trust. This Privacy Policy constitutes a formal, legally binding electronic record in
          the form of an electronic contract under the Information Technology Act, 2000, governing the collection, storage,
          processing, transfer, utilization, and protection of digital personal data acquired through our official website
          (www.ruchifoodline.com), mobile portals, digital storefronts, e-commerce channels, and customer support infrastructure.
        </p>
        <p className="text-sm font-bold text-gray-900">
          This policy is strictly formulated pursuant to Indian statutory provisions, including:
        </p>
        <ul className="space-y-2 text-sm text-gray-900 font-medium list-disc pl-5">
          <li>
            <strong className="font-bold text-gray-900">a) Digital Personal Data Protection (DPDP) Act, 2023:</strong> Governing lawful processing of digital
            personal data, consent architecture, data principal rights, and data fiduciary obligations.
          </li>
          <li>
            <strong className="font-bold text-gray-900">b) Information Technology Act, 2000:</strong> Read alongside the Information Technology (Reasonable Security
            Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
          </li>
          <li>
            <strong className="font-bold text-gray-900">c) Consumer Protection (e-Commerce) Rules, 2020:</strong> Governing direct selling, price disclosures, and
            customer grievance mechanisms.
          </li>
          <li>
            <strong className="font-bold text-gray-900">d) Food Safety and Standards Act, 2006 (FSSAI):</strong> Read with FSSAI License No. 10012032000096 and
            12025999000126, governing batch traceability, consumer feedback, and food quality standards.
          </li>
        </ul>
      </section>

      {/* 2. Statutory Definitions */}
      <section id="statutory-definitions" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">02.</span>
          <span>Statutory Definitions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 font-medium">
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">a) Data Fiduciary</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              <strong className="font-bold text-gray-900">Om Oil &amp; Flour Mills Ltd.</strong>, which determines the purpose and means of processing digital personal data.
            </p>
          </div>
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">b) Data Principal / User</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              The individual natural person to whom personal data relates and who accesses www.ruchifoodline.com or purchases products.
            </p>
          </div>
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">c) Personal Data</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              Any data about an individual who is identifiable by or in relation to such data.
            </p>
          </div>
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">d) Processing</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              Any automated operation performed on digital personal data, including collection, recording, organization,
              structuring, storage, adaptation, retrieval, consultation, use, disclosure, or erasure.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Categories of Personal Data Collected */}
      <section id="data-categories" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">03.</span>
          <span>Categories of Personal Data Collected</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          To deliver a seamless e-commerce purchasing experience, maintain supply chain traceability, and satisfy statutory tax
          and corporate auditing mandates, we collect the following categories of data:
        </p>
        <div className="space-y-3 pt-1 text-sm text-gray-900 font-medium">
          <div className="border-l-2 border-[#168a4a] pl-3.5 leading-relaxed">
            <strong className="font-bold text-gray-900">a) Identity &amp; Demographic Information:</strong> Full legal name, salutation, gender, date of birth, and
            language preferences provided during account creation or guest checkout.
          </div>
          <div className="border-l-2 border-[#168a4a] pl-3.5 leading-relaxed">
            <strong className="font-bold text-gray-900">b) Contact Coordinates:</strong> Primary mobile telephone number, secondary phone contacts, active email
            address, physical delivery addresses, billing addresses, landmark details, and postal PIN codes across serviceable Indian territories.
          </div>
          <div className="border-l-2 border-[#168a4a] pl-3.5 leading-relaxed">
            <strong className="font-bold text-gray-900">c) Financial &amp; Transactional Data:</strong> Order reference numbers, tax invoices, GST numbers (for
            business buyers), payment mode selection, transaction status tokens, and payment aggregator reference IDs. Complete credit/debit card numbers or net banking passwords are <em className="font-bold text-gray-900 not-italic">NEVER</em> stored on our infrastructure.
          </div>
          <div className="border-l-2 border-[#168a4a] pl-3.5 leading-relaxed">
            <strong className="font-bold text-gray-900">d) Technical &amp; Telemetry Data:</strong> IP address, device hardware identifiers, operating system version,
            browser type, geographic location indicators, session duration, clickstream navigation patterns, and referring URLs collected automatically.
          </div>
          <div className="border-l-2 border-[#168a4a] pl-3.5 leading-relaxed">
            <strong className="font-bold text-gray-900">e) Customer Service Records:</strong> Written correspondence, WhatsApp chat logs, survey responses, review submissions,
            and voice call recordings conducted via our Toll-Free Helpline (1800 345 4439).
          </div>
          <div className="border-l-2 border-amber-600 bg-amber-50/50 p-3 rounded-r-lg text-xs leading-relaxed text-amber-950 font-medium">
            <strong className="font-bold text-amber-950">f) Principles of Data Minimization:</strong> The Company shall collect and process personal data that is
            strictly necessary for the explicit, legitimate purposes specified in this Privacy Policy and for providing,
            administering, securing, and improving its products and services. The categories of data collected may vary depending upon the specific services or features utilized by the Data Principal.
          </div>
        </div>
      </section>

      {/* 4. Lawful Grounds & Purpose of Data Processing */}
      <section id="lawful-grounds" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">04.</span>
          <span>Lawful Grounds &amp; Purpose of Data Processing</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          We process your personal data strictly for predefined, legitimate, and lawful operational purposes:
        </p>
        <ul className="space-y-2.5 text-sm text-gray-900 font-medium list-disc pl-5">
          <li>
            <strong className="font-bold text-gray-900">a) Contractual Order Fulfillment:</strong> Processing product orders across spices, pasta, vermicelli, tea,
            ready mixes, and staples; issuing GST-compliant tax invoices; coordinating delivery with contracted logistics
            partners; and transmitting SMS/email tracking alerts.
          </li>
          <li>
            <strong className="font-bold text-gray-900">b) Statutory Compliance &amp; Auditing:</strong> Maintaining corporate financial ledgers, filing statutory GST
            returns, satisfying FSSAI food safety batch traceability protocols, and complying with statutory audit requirements
            under the Companies Act, 2013.
          </li>
          <li>
            <strong className="font-bold text-gray-900">c) Customer Support &amp; Dispute Resolution:</strong> Investigating shipment damage claims, resolving transit
            delays, executing spot replacements or refunds, addressing product usage inquiries, and mitigating customer complaints.
          </li>
          <li>
            <strong className="font-bold text-gray-900">d) Cyber Security &amp; Fraud Mitigation:</strong> Preventing fraudulent payment attempts, verifying user
            accounts, mitigating cybersecurity threats, diagnosing website server faults, and optimizing digital loading performance.
          </li>
          <li>
            <strong className="font-bold text-gray-900">e) Consensual Marketing &amp; Promotions:</strong> Transmitting marketing newsletters, seasonal festival discounts,
            new product launch announcements, and promotional offers across our product divisions, subject to your explicit opt-in consent.
          </li>
        </ul>
      </section>

      {/* 5. Cookie Architecture & Digital Analytics */}
      <section id="cookies-analytics" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">05.</span>
          <span>Cookie Architecture &amp; Digital Analytics</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          www.ruchifoodline.com utilizes cookies, web beacons, and pixel tags to distinguish your session from other visitors,
          remember active shopping cart contents, retain login sessions, analyze user navigation flows, and measure promotional
          campaign effectiveness. You may manage cookie preferences through your browser settings; however, disabling essential
          operational cookies may restrict shopping cart operations and secure account checkout features.
        </p>
      </section>

      {/* 6. Information Sharing, Disclosures & Operational Partners */}
      <section id="information-sharing" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">06.</span>
          <span>Information Sharing, Disclosures &amp; Operational Partners</span>
        </h2>
        <div className="bg-[#eef6ec] border border-[#c4d7c0] rounded-xl p-4 text-xs sm:text-sm text-[#0e6337] font-bold">
          Non-Monetization Pledge: Om Oil &amp; Flour Mills Ltd. NEVER sells, rents, leases, or trades personal data to third-party commercial brokers.
        </div>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          Data disclosures occur strictly under the following operational guidelines:
        </p>
        <ul className="space-y-2.5 text-sm text-gray-900 font-medium list-disc pl-5">
          <li>
            <strong className="font-bold text-gray-900">a) Logistics &amp; Fulfillment Partners:</strong> Sharing delivery addresses, contact numbers, and recipient
            names with contracted third-party logistics aggregators (such as Shiprocket and authorized courier partners) solely to
            execute door-step order delivery.
          </li>
          <li>
            <strong className="font-bold text-gray-900">b) Payment Gateways:</strong> Transmitting transaction parameters to PCI-DSS certified payment aggregators and
            banking gateways to securely process online payments.
          </li>
          <li>
            <strong className="font-bold text-gray-900">c) Enterprise Technology Vendors:</strong> Utilizing enterprise cloud hosting facilities, ERP software systems,
            data backup servers, and customer relationship management (CRM) software operating under strict non-disclosure contracts.
          </li>
          <li>
            <strong className="font-bold text-gray-900">d) Statutory Authorities:</strong> Disclosing personal data when compelled by court orders, judicial summons,
            police investigations, GST authorities, FSSAI officials, or regulatory mandates under Indian law to protect legal rights or public safety.
          </li>
        </ul>
      </section>

      {/* 7. Cross-Border Data Transfers */}
      <section id="cross-border" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">07.</span>
          <span>Cross-Border Data Transfers</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          While Ruchi Foodline&apos;s primary enterprise databases reside securely within cloud infrastructure located in India,
          certain technical services (such as international Content Delivery Networks or cloud security engines) may involve
          encrypted data transmission across international borders. In such instances, Om Oil &amp; Flour Mills Ltd. ensures that
          cross-border data flows comply strictly with the DPDP Act 2023, ensuring recipient entities enforce equivalent statutory safeguards.
        </p>
      </section>

      {/* 8. Data Security, Safeguards & Infrastructure Standards */}
      <section id="data-security" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">08.</span>
          <span>Data Security, Safeguards &amp; Infrastructure Standards</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          We enforce technical, administrative, and physical security measures to safeguard personal data:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1 font-medium">
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">SSL 256-Bit Encryption</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              All website communications and checkout transactions are encrypted using industry-standard Secure Socket Layer (SSL) 256-bit encryption.
            </p>
          </div>
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">Multi-Layer Firewalls</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              Corporate databases operate behind multi-layered firewalls with strict role-based access restrictions limited to authorized personnel.
            </p>
          </div>
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">Corporate Governance</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              ISO 22000:2018 and ISO 9002 certifications alongside a CRISIL SME 2 financial rating, reinforcing integrity across operations.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Data Retention & Archival Protocol */}
      <section id="data-retention" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">09.</span>
          <span>Data Retention &amp; Archival Protocol</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          Personal data shall be retained only for such period as may be reasonably necessary to fulfill the operational and statutory
          purposes for which it was collected, provide services, resolve disputes, maintain complete business and transaction records,
          comply with applicable statutory, legal, tax, accounting, and regulatory requirements, or otherwise as permitted or required by applicable law.
        </p>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          Upon expiry of the applicable statutory or operational retention period, personal data shall be securely deleted, permanently
          anonymized, or otherwise disposed of in strict accordance with applicable law and the Company&apos;s internal data retention
          protocols. <strong className="font-bold text-gray-900">Customer transaction logs and tax invoices are retained for a minimum statutory period of 8 years</strong> under applicable Indian tax statutes.
        </p>
      </section>

      {/* 10. Statutory Rights of the Data Principal */}
      <section id="data-principal-rights" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">10.</span>
          <span>Statutory Rights of the Data Principal</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          Under the Digital Personal Data Protection Act, 2023, users (Data Principals) possess clear statutory rights regarding their personal information:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 font-medium">
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">a) Right to Access &amp; Summary</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              Request a summary of personal data held by us and the processing activities conducted on such data.
            </p>
          </div>
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">b) Right to Correction &amp; Erasure</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              Request correction of inaccurate or incomplete data, or request erasure of personal data that is no longer required for statutory processing.
            </p>
          </div>
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">c) Right to Withdraw Consent</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              Withdraw consent for marketing communications or data processing at any time, without affecting the lawfulness of prior processing.
            </p>
          </div>
          <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-200 space-y-1">
            <h3 className="font-bold text-sm text-gray-900 mb-1">d) Right to Nominate</h3>
            <p className="text-xs text-gray-900 font-medium leading-relaxed">
              Nominate another natural person to exercise your data principal rights in the event of death or incapacity.
            </p>
          </div>
        </div>
      </section>

      {/* 11. Children's Data Protection Policy */}
      <section id="children-policy" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">11.</span>
          <span>Children&apos;s Data Protection Policy</span>
        </h2>
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
          The Ruchi Foodline website is designed for general commercial audiences and is intended for use by individuals
          aged <strong className="font-bold text-amber-950">18 years or older</strong>. We do not knowingly collect or process personal data belonging to minors
          without verifiable parental consent. If a parent or guardian discovers that a minor has submitted personal data,
          please contact our Grievance Officer immediately for prompt data erasure.
        </div>
      </section>

      {/* 12. Statutory Grievance Redressal Officer */}
      <section id="grievance-officer" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">12.</span>
          <span>Statutory Grievance Redressal Officer</span>
        </h2>
        <p className="text-sm text-gray-900 font-medium leading-relaxed">
          In accordance with the Information Technology Act, 2000, and the DPDP Act, 2023, the contact details of the
          Statutory Grievance Redressal Officer for Om Oil &amp; Flour Mills Ltd. are as follows:
        </p>
        <div className="bg-[#f7f6f2] border border-gray-200 rounded-xl p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-gray-900 font-medium">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <span className="text-gray-600 block text-[11px] uppercase tracking-wider font-bold">Grievance Officer</span>
              <span className="font-bold text-gray-900">Corporate Legal &amp; Data Protection Division</span>
            </div>
            <div>
              <span className="text-gray-600 block text-[11px] uppercase tracking-wider font-bold">Entity Name</span>
              <span className="font-bold text-gray-900">Om Oil &amp; Flour Mills Ltd. (Ruchi Foodline)</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-600 block text-[11px] uppercase tracking-wider font-bold">Registered Address</span>
              <span className="font-medium text-gray-900">
                Type-II, No. 8, Industrial Estate, Khapuria, Madhupatna, Cuttack - 753010, Odisha, India
              </span>
            </div>
            <div>
              <span className="text-gray-600 block text-[11px] uppercase tracking-wider font-bold">Toll-Free Helpline</span>
              <a href="tel:18003454439" className="font-bold text-[#0e6337] hover:underline">1800 345 4439</a>
            </div>
            <div>
              <span className="text-gray-600 block text-[11px] uppercase tracking-wider font-bold">Official Email</span>
              <a href="mailto:info@ruchifoodline.com" className="font-bold text-[#0e6337] hover:underline">info@ruchifoodline.com</a>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Corporate Contact Coordinates */}
      <section id="corporate-contact" className="scroll-mt-28 space-y-3.5 font-medium">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a] font-bold">13.</span>
          <span>Corporate Entity &amp; Official Contact Coordinates</span>
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-gray-900 font-medium">
          <h3 className="text-gray-900 font-bold text-base">
            Om Oil &amp; Flour Mills Ltd. (Ruchi Foodline)
          </h3>
          <div className="space-y-1.5 pt-1 text-gray-900 font-medium">
            <div>
              <span>Address: Type-II, No. 8 &amp; B/18 Industrial Estate, Khapuria, Cuttack - 753010, Odisha, India</span>
            </div>
            <div>
              <span>Toll-Free: <a href="tel:18003454439" className="text-gray-900 font-bold hover:underline">1800 345 4439</a></span>
            </div>
            <div>
              <span>Email: <a href="mailto:info@ruchifoodline.com" className="text-gray-900 font-bold hover:underline">info@ruchifoodline.com</a></span>
            </div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
