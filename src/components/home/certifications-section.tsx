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
    id: "ayush-gmp-certificate",
    title: "AYUSH GMP Certificate",
    file: "/documents/certifications/ayush-gmp-certificate.pdf",
    preview: "/documents/certifications/previews/ayush-gmp-certificate.jpg",
    downloadName: "ayush-gmp-certificate.pdf",
    previewAlt: "AYUSH certificate of good manufacturing practices",
  },
  {
    id: "fssai-khapuria",
    title: "FSSAI Licence — Khapuria",
    file: "/documents/certifications/fssai-khapuria.pdf",
    preview: "/documents/certifications/previews/fssai-khapuria.jpg",
    downloadName: "fssai-khapuria.pdf",
    previewAlt: "First page of the FSSAI central licence for the Khapuria facility",
  },
  {
    id: "fssai-ramdaspur",
    title: "FSSAI Licence — Ramdaspur",
    file: "/documents/certifications/fssai-ramdaspur.pdf",
    preview: "/documents/certifications/previews/fssai-ramdaspur.jpg",
    downloadName: "fssai-ramdaspur.pdf",
    previewAlt: "First page of the FSSAI central licence for the Ramdaspur facility",
  },
  {
    id: "halal-certificate",
    title: "Halal Certificate",
    file: "/documents/certifications/halal-certificate.pdf",
    preview: "/documents/certifications/previews/halal-certificate.jpg",
    downloadName: "halal-certificate.pdf",
    previewAlt: "Halal product certificate issued by HCS India for Om Oil & Flour Mills Limited",
  },
  {
    id: "iso-22000-2018",
    title: "ISO 22000:2018",
    file: "/documents/certifications/iso-22000-2018.pdf",
    preview: "/documents/certifications/previews/iso-22000-2018.jpg",
    downloadName: "iso-22000-2018.pdf",
    previewAlt: "ISO 22000:2018 food safety management system certificate",
  },
];

function CertificationCard({ cert, index, onView }: { cert: Certificate; index: number; onView: (c: Certificate, trigger: HTMLButtonElement) => void }) {
  return (
    <article
      data-reveal={index}
      className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#168a4a]/25 bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#168a4a] hover:shadow-[0_6px_20px_rgba(14,99,55,0.10)] max-sm:w-[78%] max-sm:max-w-[300px] max-sm:shrink-0 max-sm:snap-start ${
        index === 4
          ? "col-span-2 sm:col-span-1 max-w-[calc(50%-0.375rem)] xs:max-w-[calc(50%-0.5rem)] sm:max-w-none justify-self-center w-full max-sm:col-span-1 max-sm:w-[78%] max-sm:max-w-[300px]"
          : ""
      }`}
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

      <div className="flex flex-1 flex-col p-3 xs:p-4 sm:p-5">
        <h3 className="font-sans text-xs xs:text-sm sm:text-base font-bold leading-snug text-[#0e6337] sm:text-lg min-h-[2.25rem] xs:min-h-[2.5rem] sm:min-h-[2.75rem] flex items-center">
          {cert.title}
        </h3>

        <div className="mt-auto flex flex-col xs:flex-row gap-1.5 xs:gap-2 pt-3 sm:pt-4">
          <button
            type="button"
            onClick={(e) => onView(cert, e.currentTarget)}
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1 sm:gap-1.5 rounded-md bg-[#168a4a] px-2 py-1.5 xs:px-2.5 xs:py-2 font-sans text-[11px] xs:text-xs font-semibold text-white transition-colors hover:bg-[#0e6337] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a] sm:text-sm"
            aria-label={`View certificate: ${cert.title}`}
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
            <span>View</span>
          </button>
          <a
            href={cert.file}
            download={cert.downloadName}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-md border border-[#168a4a] px-2 py-1.5 xs:px-2.5 xs:py-2 font-sans text-[11px] xs:text-xs font-semibold text-[#0e6337] transition-colors hover:bg-[#eef6ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a] sm:text-sm"
            aria-label={`Download PDF: ${cert.title}`}
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function CertificationsSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<ViewerDocument | null>(null);
  const [active, setActive] = useState(0);

  /**
   * "View" on phones: Android Chrome cannot display a PDF embedded in a page (the viewer stays blank) and iOS Safari
   * shows only a frozen first page, so on small screens — or wherever the browser reports no built-in PDF viewer —
   * the certificate opens in the device's own PDF viewer. Desktop/tablet keep the in-page viewer.
   */
  const view = (c: Certificate) => {
    const noInlinePdf = window.matchMedia("(max-width: 767px)").matches || navigator.pdfViewerEnabled === false;
    if (noInlinePdf) {
      window.open(c.file, "_blank", "noopener");
      return;
    }
    setOpen({ title: c.title, file: c.file, downloadName: c.downloadName });
  };

  // Phone slider: which card is in view (drives the dots).
  const onTrackScroll = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || "0");
    setActive(Math.min(CERTIFICATES.length - 1, Math.max(0, Math.round(track.scrollLeft / step))));
  };
  const goTo = (i: number) => {
    const card = trackRef.current?.children[i] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

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
      id="certifications"
      className="scroll-mt-32 py-8 sm:py-10"
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

        {/* Phones: a horizontal, swipeable track (the next card peeks in). Tablet/desktop: the original grid. */}
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          aria-label="Certificates"
          className="grid grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5 max-sm:flex max-sm:-mx-4 max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory max-sm:scroll-px-4 max-sm:px-4 max-sm:pb-1 max-sm:no-scrollbar max-sm:overscroll-x-contain"
        >
          {CERTIFICATES.map((cert, i) => (
            <CertificationCard key={cert.id} cert={cert} index={i} onView={view} />
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-1 sm:hidden" role="group" aria-label="Choose certificate">
          {CERTIFICATES.map((cert, i) => (
            <button
              key={cert.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${cert.title}`}
              aria-current={i === active}
              className="group flex h-6 min-w-6 items-center justify-center"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-[#168a4a]" : "w-1.5 bg-[#168a4a]/30"}`} />
            </button>
          ))}
        </div>
      </div>

      <CertificateViewer doc={open} onClose={() => setOpen(null)} />
    </section>
  );
}
