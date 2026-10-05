import type { Metadata } from "next";
import { LegalPageLayout, type LegalSection } from "@/components/legal/legal-page-layout";
import { Scale, PackageCheck, AlertTriangle, Truck, RotateCcw, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Statutory Terms & Conditions for Ruchi Foodline (Om Oil & Flour Mills Ltd.). Formulated under the Indian Contract Act 1872, IT Act 2000, Consumer Protection Act 2019, FSSAI Act 2006, and Legal Metrology Act 2009.",
};

const SECTIONS: LegalSection[] = [
  { id: "legal-relationship", title: "Legal Relationship & Acceptance of Terms" },
  { id: "statutory-framework", title: "Statutory Framework & Regulatory Compliance" },
  { id: "user-eligibility", title: "User Eligibility & Account Obligations" },
  { id: "product-pricing", title: "Product Listings, Specifications, Pricing & Taxes" },
  { id: "order-payment", title: "Order Placement, Acceptance & Payment Terms" },
  { id: "shipping-delivery", title: "Shipping, Delivery Logistics & Title Transfer" },
  { id: "cancellation-returns", title: "Cancellations, Non-Returnable FMCG & Damaged Claims" },
  { id: "intellectual-property", title: "Intellectual Property & Brand Ownership Rights" },
  { id: "user-conduct", title: "User Conduct & Prohibited Activities" },
  { id: "liability-disclaimer", title: "Limitation of Liability & Warranties Disclaimer" },
  { id: "indemnification", title: "Legal Indemnification" },
  { id: "force-majeure", title: "Force Majeure" },
  { id: "governing-law", title: "Governing Law & Exclusive Judicial Jurisdiction" },
  { id: "corporate-contact", title: "Corporate Contact Coordinates & Legal Notices" },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      badge="E-Commerce & Consumer Protection Compliant"
      effectiveDate="September 25, 2026"
      version="3.0 (Comprehensive)"
      sections={SECTIONS}
      activeType="terms"
    >
      {/* Preamble / Summary Box */}
      <div className="bg-[#f7f6f2] border border-gray-200 rounded-xl p-5 sm:p-6 text-xs sm:text-sm text-gray-800 space-y-3">
        <div className="flex items-center gap-2 text-[#0e6337] font-serif font-bold text-base">
          <Scale className="w-5 h-5 text-[#168a4a]" />
          <span>Statutory Terms of Service &amp; E-Commerce Contract</span>
        </div>
        <p className="leading-relaxed">
          These Terms &amp; Conditions (&apos;Terms&apos;) constitute a legally binding electronic contract between you (&apos;User&apos;, &apos;Customer&apos;, or &apos;You&apos;)
          and <strong>Om Oil &amp; Flour Mills Ltd.</strong> (&apos;Company&apos;, &apos;Ruchi Foodline&apos;, &apos;We&apos;, &apos;Us&apos;, or &apos;Our&apos;). Accessing, browsing,
          creating an account, or purchasing products through{" "}
          <a href="https://www.ruchifoodline.com" className="text-[#168a4a] hover:underline font-semibold">
            www.ruchifoodline.com
          </a>{" "}
          signifies that you have carefully read, understood, and agreed to be legally bound by these Terms, our Privacy Policy, and all applicable Indian laws and regulations.
        </p>
        <div className="pt-2 border-t border-gray-200/80 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-gray-600">
          <span><strong>CIN:</strong> U15495OR1997PLC004861</span>
          <span><strong>FSSAI Central Lic:</strong> 10012032000096, 12025999000126</span>
          <span><strong>Jurisdiction:</strong> Courts in Cuttack, Odisha, India</span>
        </div>
      </div>

      {/* 1. Legal Relationship & Acceptance of Terms */}
      <section id="legal-relationship" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">01.</span>
          <span>Legal Relationship &amp; Acceptance of Terms</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          These Terms &amp; Conditions constitute a valid electronic agreement in accordance with the Information Technology Act, 2000,
          and the rules made thereunder. By visiting our digital platform or placing an order for goods, you enter into a legally enforceable
          commercial contract with Om Oil &amp; Flour Mills Ltd. If you do not agree with any provision contained herein, please discontinue
          use of the website immediately.
        </p>
      </section>

      {/* 2. Statutory Framework & Regulatory Compliance */}
      <section id="statutory-framework" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">02.</span>
          <span>Statutory Framework &amp; Regulatory Compliance</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          This website and its commercial operations strictly comply with Indian statutory frameworks, including:
        </p>
        <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
          <li>
            <strong>a) The Indian Contract Act, 1872:</strong> As applicable to contractual relationships arising from time to
            time, governing lawful online contract formation, free consent, and legal capacity.
          </li>
          <li>
            <strong>b) The Information Technology Act, 2000:</strong> And other applicable laws and regulations governing electronic
            records, electronic communications, and online commercial transactions.
          </li>
          <li>
            <strong>c) The Consumer Protection Act, 2019:</strong> Read alongside the Consumer Protection (e-Commerce) Rules, 2020,
            as amended from time to time.
          </li>
          <li>
            <strong>d) The Food Safety and Standards Act, 2006:</strong> And applicable rules and regulations made thereunder, including
            food safety, labeling, packaging, hygienic handling, ingredient disclosures, allergen declarations, and quality standards
            under FSSAI License No. 10012032000096 and 12025999000126.
          </li>
          <li>
            <strong>e) The Legal Metrology Act, 2009:</strong> And the Legal Metrology (Packaged Commodities) Rules, 2011, as amended
            from time to time, to the extent applicable to the Company&apos;s packaged products governing net weight declarations, Maximum
            Retail Price (MRP) printing, country of origin, and mandatory package disclosures.
          </li>
          <li>
            <strong>f) Goods and Services Tax (GST) Laws:</strong> Applicable goods and services tax laws and rules, including provisions
            governing the levy, collection, and statutory invoicing of GST.
          </li>
          <li>
            <strong>g) Other Regulatory Frameworks:</strong> All other applicable laws, rules, regulations, and directions relevant
            to the Company&apos;s products, e-commerce operations, and transactions conducted through the website.
          </li>
        </ul>
      </section>

      {/* 3. User Eligibility & Account Obligations */}
      <section id="user-eligibility" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">03.</span>
          <span>User Eligibility &amp; Account Obligations</span>
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>a) Legal Capacity:</strong> Use of the platform is available only to persons who can form legally binding contracts
            under the Indian Contract Act, 1872. Persons who are incompetent to contract (including un-discharged insolvents or minors under
            18 years) are not eligible to register or purchase independently.
          </p>
          <p>
            <strong>b) Account Security:</strong> When registering an account, you agree to provide true, accurate, current, and complete
            personal and contact details, maintain and update your profile promptly, and accept full responsibility for all activities
            occurring under your account password and login credentials.
          </p>
        </div>
      </section>

      {/* 4. Product Listings, Specifications, Pricing & Tax Declarations */}
      <section id="product-pricing" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">04.</span>
          <span>Product Listings, Specifications, Pricing &amp; Tax Declarations</span>
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>a) Product Descriptions:</strong> Om Oil &amp; Flour Mills Ltd. manufactures and distributes packaged spices, durum
            wheat suji pasta, vermicelli, tea, ready mixes, and health staples. While we make every effort to display product specifications,
            net weight, ingredients, and shelf-life accurately, physical packaging received may reflect minor design updates.
          </p>
          <p>
            <strong>b) Pricing &amp; GST:</strong> All prices listed on www.ruchifoodline.com are stated in Indian Rupees (INR) and are
            inclusive of Goods and Services Tax (GST). Prices are subject to revision without prior notice. In the event a product is
            listed at an incorrect price due to a clerical or system error, the Company reserves the right to cancel orders placed for that item,
            issuing a full refund for any payments collected.
          </p>
        </div>
      </section>

      {/* 5. Order Placement, Acceptance & Payment Terms */}
      <section id="order-payment" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">05.</span>
          <span>Order Placement, Acceptance &amp; Payment Terms</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Placement of an e-commerce order constitutes an offer to purchase. Order confirmation emails or SMS messages do not signify final
          acceptance; <strong>final contract formation occurs when the order is dispatched from our central Cuttack warehouse facility</strong>.
          Payment must be cleared in full prior to order dispatch using authorized payment channels (Credit/Debit Cards, Net Banking, UPI, or Wallet services).
        </p>
      </section>

      {/* 6. Shipping, Delivery Logistics & Title Transfer */}
      <section id="shipping-delivery" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">06.</span>
          <span>Shipping, Delivery Logistics &amp; Title Transfer</span>
        </h2>
        <div className="bg-[#f7f6f2] p-4.5 rounded-xl border border-gray-200 flex items-start gap-3 text-xs sm:text-sm text-gray-800">
          <Truck className="w-5 h-5 text-[#168a4a] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            We ship products across serviceable PIN codes in India through contracted third-party logistics partners. Delivery timelines
            stated at checkout are indicative estimates and not strict guarantees. Om Oil &amp; Flour Mills Ltd. shall not be held liable
            for delivery delays caused by courier disruptions, regional strikes, bad weather, or force majeure events. Risk of loss and title
            for purchased items pass to the customer upon physical delivery at the specified shipping address.
          </p>
        </div>
      </section>

      {/* 7. Cancellations, Non-Returnable FMCG Policy & Damaged Claim Protocol */}
      <section id="cancellation-returns" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">07.</span>
          <span>Cancellations, Non-Returnable FMCG Policy &amp; Damaged Claims</span>
        </h2>
        
        <div className="space-y-4 pt-1">
          <div className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-white space-y-2">
            <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#168a4a]" /> a) Order Cancellation Policy
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Customers may cancel orders prior to warehouse dispatch. Once an order is handed over to courier partners, cancellations cannot be processed.
            </p>
          </div>

          <div className="border border-rose-200 rounded-xl p-4 sm:p-5 bg-rose-50/40 space-y-2">
            <h3 className="font-semibold text-sm text-rose-900 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-rose-700" /> b) Non-Returnable FMCG Policy
            </h3>
            <p className="text-xs sm:text-sm text-rose-950 leading-relaxed">
              Because Ruchi Foodline manufactures packaged consumable food items, <strong>delivered products are non-returnable due to health, hygiene, and contamination risks</strong>.
            </p>
          </div>

          <div className="border border-amber-200 rounded-xl p-4 sm:p-5 bg-amber-50/40 space-y-2">
            <h3 className="font-semibold text-sm text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" /> c) Damaged / Defective Claim Protocol
            </h3>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              If a shipment is delivered in a visibly damaged, tampered, expired, or incorrect state, the customer <strong>MUST report the issue to Customer Care within 48 hours of delivery</strong>:
            </p>
            <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs space-y-1 text-gray-800">
              <div><strong>Toll-Free Helpline:</strong> <a href="tel:18003454439" className="text-[#0e6337] font-semibold underline">1800 345 4439</a></div>
              <div><strong>Customer Care Email:</strong> <a href="mailto:customercare@ruchifoodline.com" className="text-[#0e6337] font-semibold underline">customercare@ruchifoodline.com</a></div>
              <div><strong>Mandatory Requirement:</strong> Clear photographic or video unboxing evidence must be submitted.</div>
              <div><strong>Resolution:</strong> Upon internal verification, the Company will process a replacement or full refund within <strong>5–7 business days</strong>.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Intellectual Property & Brand Ownership Rights */}
      <section id="intellectual-property" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">08.</span>
          <span>Intellectual Property &amp; Brand Ownership Rights</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          All materials, trademarks, brand names, product packaging designs, text, graphics, logos, photos, software code, and
          recipes displayed on www.ruchifoodline.com are the exclusive intellectual property of Om Oil &amp; Flour Mills Ltd. registered
          under Trademark Class 30 and applicable copyright laws. Registered trademarks include <strong>&apos;RUCHI&apos;</strong>, <strong>&apos;Ruchi Foodline&apos;</strong>,{" "}
          <strong>&apos;Ruchi Spices&apos;</strong>, <strong>&apos;Ruchi Pasta Village&apos;</strong>, <strong>&apos;Ruchi Prativa Foundation&apos;</strong>, and{" "}
          <strong>&apos;Om Oil &amp; Flour Mills Ltd.&apos;</strong> Unauthorized copying, reproduction, or commercial exploitation is strictly
          prohibited and will invite civil and criminal litigation.
        </p>
      </section>

      {/* 9. User Conduct & Prohibited Activities */}
      <section id="user-conduct" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">09.</span>
          <span>User Conduct &amp; Prohibited Activities</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Users agree not to use the website for any unlawful purpose, including uploading viruses or malware, impersonating any
          person, submitting fake customer reviews, attempting unauthorized server access or scraping, or posting defamatory, abusive,
          or racially offensive content.
        </p>
      </section>

      {/* 10. Limitation of Liability & Warranties Disclaimer */}
      <section id="liability-disclaimer" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">10.</span>
          <span>Limitation of Liability &amp; Warranties Disclaimer</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          To the maximum extent permitted by Indian law, Om Oil &amp; Flour Mills Ltd., its directors, officers, and employees shall not
          be liable for any indirect, incidental, punitive, or consequential damages resulting from website usage or product consumption
          outside prescribed package guidelines. All products are provided on an &apos;as is&apos; and &apos;as available&apos; basis under statutory FSSAI food safety parameters.
        </p>
      </section>

      {/* 11. Legal Indemnification */}
      <section id="indemnification" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">11.</span>
          <span>Legal Indemnification</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          You agree to indemnify, defend, and hold harmless Om Oil &amp; Flour Mills Ltd., its directors, employees, stockists, and affiliates
          against any claims, liabilities, losses, costs, or legal fees arising from your violation of these Terms, misuse of the website,
          or infringement of third-party rights.
        </p>
      </section>

      {/* 12. Force Majeure */}
      <section id="force-majeure" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">12.</span>
          <span>Force Majeure</span>
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          The Company shall not be held liable for failure or delay in fulfilling contractual obligations caused by circumstances beyond
          its reasonable control, including acts of God, pandemics, strikes, power outages, government embargos, or national logistics failures.
        </p>
      </section>

      {/* 13. Governing Law & Exclusive Judicial Jurisdiction */}
      <section id="governing-law" className="scroll-mt-28 space-y-3.5 border-b border-gray-100 pb-8">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">13.</span>
          <span>Governing Law &amp; Exclusive Judicial Jurisdiction</span>
        </h2>
        <div className="bg-[#eef6ec] border border-[#c4d7c0] rounded-xl p-4.5 text-xs sm:text-sm text-[#0e6337]">
          <strong>Exclusive Court Jurisdiction:</strong> These Terms &amp; Conditions shall be governed by and construed in accordance with
          the laws of India. Any legal dispute, statutory claim, or lawsuit arising out of or in connection with these Terms or website
          transactions shall be subject to the <strong>exclusive jurisdiction of competent courts located in Cuttack, Odisha, India</strong>.
        </div>
      </section>

      {/* 14. Corporate Contact Coordinates & Legal Notices */}
      <section id="corporate-contact" className="scroll-mt-28 space-y-3.5">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-sm font-mono text-[#168a4a]">14.</span>
          <span>Corporate Contact Coordinates &amp; Legal Notices</span>
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-gray-700">
          <div className="flex items-center gap-2 text-gray-900 font-semibold text-base">
            <Building2 className="w-5 h-5 text-[#168a4a]" />
            <span>Om Oil &amp; Flour Mills Ltd. (Ruchi Foodline)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-gray-600">
            <div>
              <span className="text-gray-400 block text-[11px] uppercase font-semibold">Corporate Identity Number</span>
              <span className="font-mono font-medium text-gray-900">CIN: U15495OR1997PLC004861</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px] uppercase font-semibold">CRISIL Rating</span>
              <span className="font-semibold text-[#0e6337]">CRISIL SME 2 Rated</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-400 block text-[11px] uppercase font-semibold">FSSAI Central Licenses</span>
              <span className="font-mono text-gray-900">10012032000096, 12025999000126</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-400 block text-[11px] uppercase font-semibold">Registered Office Address</span>
              <span className="font-medium text-gray-800">
                Type-II, No. 8 &amp; B/34 Industrial Estate, Maruti Marg, Khapuria, Cuttack - 753010, Odisha, India
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px] uppercase font-semibold">Toll-Free Helpline</span>
              <a href="tel:18003454439" className="font-semibold text-gray-900 hover:underline">1800 345 4439</a>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px] uppercase font-semibold">Official Email</span>
              <a href="mailto:info@ruchifoodline.com" className="font-semibold text-gray-900 hover:underline">info@ruchifoodline.com</a>
            </div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
