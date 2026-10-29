"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, Eye } from "lucide-react";
import { CertificateViewer, type ViewerDocument } from "./certificate-viewer";

interface Certificate {
  id: string;
  title: string;
  file: string;
  preview: string;
  downloadName: string;
  previewAlt: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: "fssai-ramdaspur",
    title: "FSSAI Licence — Ramdaspur",
    file: "/documents/certifications/fssai-ramdaspur.pdf",
    preview: "/documents/certifications/previews/fssai-ramdaspur.jpg",
    downloadName: "RUCHI-FSSAI-Ramdaspur.pdf",
    previewAlt: "First page of the FSSAI central licence for the Ramdaspur facility",
  },
  {
    id: "iso-22000",
    title: "ISO 22000:2018",
    file: "/documents/certifications/iso-22000-2018.pdf",
    preview: "/documents/certifications/previews/iso-22000-2018.jpg",
    downloadName: "RUCHI-ISO-22000-2018.pdf",
    previewAlt: "ISO 22000:2018 food safety management system certificate",
  },
  {
    id: "halal",
    title: "Halal Certificate",
    file: "/documents/certifications/halal-certificate.pdf",
    preview: "/documents/certifications/previews/halal-certificate.jpg",
    downloadName: "RUCHI-Halal-Certificate.pdf",
    previewAlt: "Halal product certificate issued by HCS India for Om Oil & Flour Mills Limited",
  },
  {
    id: "ayush-gmp",
    title: "AYUSH GMP Certificate",
    file: "/documents/certifications/ayush-gmp-certificate.pdf",
    preview: "/documents/certifications/previews/ayush-gmp-certificate.jpg",
    downloadName: "RUCHI-AYUSH-GMP.pdf",
    previewAlt: "AYUSH certificate of good manufacturing practices",
  },
  {
    id: "fssai-khapuria",
    title: "FSSAI Licence — Khapuria",
    file: "/documents/certifications/fssai-khapuria.pdf",
    preview: "/documents/certifications/previews/fssai-khapuria.jpg",
    downloadName: "RUCHI-FSSAI-Khapuria.pdf",
    previewAlt: "First page of the FSSAI central licence for the Khapuria facility",
  },
];

function CertificationCard({ cert, index, onView }: { cert: Certificate; index: number; onView: (c: Certificate, trigger: HTMLButtonElement) => void }) {
  return (
    <article
      data-reveal={index}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#168a4a]/25 bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#168a4a] hover:shadow-[0_6px_20px_rgba(14,99,55,0.10)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[#168a4a]/15 bg-[#eef6ec]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cert.preview}
          alt={cert.previewAlt}
          width={900}
          height={1273}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-sans text-base font-bold leading-snug text-[#0e6337] sm:text-lg">{cert.title}</h3>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <button
            type="button"
            onClick={(e) => onView(cert, e.currentTarget)}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#168a4a] px-3 py-2 font-sans text-xs font-semibold text-white transition-colors hover:bg-[#0e6337] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a] sm:text-sm"
            aria-label={`View certificate: ${cert.title}`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" /> View
          </button>
          <a
            href={cert.file}
            download={cert.downloadName}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[#168a4a] px-3 py-2 font-sans text-xs font-semibold text-[#0e6337] transition-colors hover:bg-[#eef6ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a] sm:text-sm"
            aria-label={`Download PDF: ${cert.title}`}
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Download
          </a>
        </div>
      </div>
    </article>
  );
}

export function CertificationsSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<ViewerDocument | null>(null);

  // Gentle fade-up on entering the viewport; content stays visible without JS or with reduced motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const pending = items.filter((el) => el.getBoundingClientRect().top >= window.innerHeight);
    pending.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.animate(
            [
              { opacity: 0, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 450, delay: Number(el.dataset.reveal) * 80, easing: "ease-out", fill: "backwards" }
          );
          el.style.opacity = "";
          el.style.transform = "";
          io.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="py-8 sm:py-10"
      aria-labelledby="certifications-heading"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <h2
            id="certifications-heading"
            className="font-serif text-[clamp(1.75rem,3.4vw,3rem)] font-bold leading-tight tracking-tight text-[#0e6337]"
          >
            Quality You Can Trust
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#1A1A1A]/80 sm:text-base">
            Our commitment to food safety, responsible manufacturing, and consistent quality is reflected in the standards and
            licences that guide our operations.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
          {CERTIFICATES.map((cert, i) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={i}
              onView={(c) => setOpen({ title: c.title, file: c.file, downloadName: c.downloadName })}
            />
          ))}
        </div>
      </div>

      <CertificateViewer doc={open} onClose={() => setOpen(null)} />
    </section>
  );
}
