import React from "react";

export function AboutCertifications() {
  const certifications = [
    {
      code: "ISO 22000:2018",
      name: "Food Safety Management System",
      issuer: "International Organization for Standardization",
      desc: "Global benchmark for food safety hazard controls, hygiene parameters, and traceability.",
    },
    {
      code: "ISO 9002",
      name: "Quality Management System",
      issuer: "Quality Assurance Standard",
      desc: "Consistent production control and continuous processing quality across manufacturing lines.",
    },
    {
      code: "AGMARK Standards",
      name: "Grading & Purity Verification",
      issuer: "Directorate of Marketing & Inspection, Govt. of India",
      desc: "Strict compliance with Indian agricultural grading rules, aroma standards, and moisture controls.",
    },
    {
      code: "FSSAI Central Licenses",
      name: "Lic. No. 10012032000096 & 12025999000126",
      issuer: "Food Safety & Standards Authority of India",
      desc: "Mandatory statutory compliance under Food Safety and Standards Act, 2006.",
    },
    {
      code: "Spices House Certificate",
      name: "Spices Board of India Accreditation (1998)",
      issuer: "Ministry of Commerce & Industry, Govt. of India",
      desc: "Recognized processing facility for export-grade pure whole and ground Indian spices.",
    },
    {
      code: "CRISIL SME 2",
      name: "High Financial & Operational Governance",
      issuer: "CRISIL Credit Rating Agency",
      desc: "Reflecting high financial stability, audit transparency, and sound management practices.",
    },
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center py-8 sm:py-12 bg-white border-b border-gray-200/80" aria-label="Quality and Certifications">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Quality Assurance &amp; Certifications
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Strict adherence to national and global regulatory frameworks, verified by statutory certifications.
          </p>
        </div>

        {/* 6 Certification Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="bg-[#f7f6f2] hover:bg-white rounded-xl p-5 sm:p-6 border border-gray-200/80 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-xs font-bold text-[#0e6337] mb-2">
                  {cert.code}
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 mb-1 leading-snug">
                  {cert.name}
                </h3>
                <div className="text-[11px] font-semibold text-gray-500 mb-2">
                  {cert.issuer}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {cert.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Legal Footer Note */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div>
            <span>
              <strong>Om Oil &amp; Flour Mills Ltd.</strong> | CIN: U15495OR1997PLC004861
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Khapuria &amp; Ramdaspur, Cuttack</span>
            <span className="text-[#0e6337] font-semibold">Toll-Free: 1800 345 4439</span>
          </div>
        </div>

      </div>
    </section>
  );
}
