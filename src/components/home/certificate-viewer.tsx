"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, X } from "lucide-react";

export interface ViewerDocument {
  title: string;
  file: string; // public path of the original PDF
  downloadName: string;
}

/**
 * Modal PDF viewer built on the native <dialog>: Escape closes it, the page behind is inert while open,
 * and focus returns to the button that opened it. The original PDF is embedded (browser viewer: zoom, scroll,
 * multi-page) with download and open-in-new-tab fallbacks.
 */
export function CertificateViewer({ doc, onClose }: { doc: ViewerDocument | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [missingFile, setMissingFile] = useState<string | null>(null);
  const missing = !!doc && missingFile === doc.file;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (doc && !dialog.open) dialog.showModal();
    if (!doc && dialog.open) dialog.close();
  }, [doc]);

  // Report a clear error instead of an empty frame if the file is not served.
  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    const file = doc.file;
    fetch(file, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && !res.ok) setMissingFile(file);
      })
      .catch(() => {
        if (!cancelled) setMissingFile(file);
      });
    return () => {
      cancelled = true;
    };
  }, [doc]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // backdrop click
      }}
      aria-labelledby="certificate-viewer-title"
      className="m-auto h-[92svh] w-[min(96vw,64rem)] max-w-none overflow-hidden rounded-xl border border-[#168a4a]/30 bg-white p-0 text-[#1A1A1A] shadow-2xl backdrop:bg-black/60 motion-safe:open:animate-[fadeIn_0.2s_ease-out]"
    >
      {doc && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-[#1A1A1A]/10 px-4 py-3 sm:px-5">
            <h3 id="certificate-viewer-title" className="min-w-0 truncate font-sans text-sm font-semibold text-[#0e6337] sm:text-base">
              {doc.title}
            </h3>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={doc.file}
                download={doc.downloadName}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#168a4a] px-3 py-1.5 font-sans text-xs font-semibold text-white transition-colors hover:bg-[#0e6337] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a]"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">Download</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close certificate viewer"
                className="rounded-md border border-[#1A1A1A]/15 p-1.5 text-[#1A1A1A] transition-colors hover:bg-[#eef6ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 bg-[#F8F5F0]">
            {missing ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center font-sans">
                <p className="text-sm font-semibold">This document could not be loaded.</p>
                <p className="text-xs text-[#1A1A1A]/70">Please try again later or contact us for a copy.</p>
              </div>
            ) : (
              <object data={`${doc.file}#toolbar=1&navpanes=0`} type="application/pdf" className="h-full w-full" aria-label={doc.title}>
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center font-sans">
                  <p className="text-sm font-semibold">Your browser cannot display this PDF here.</p>
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#168a4a] px-3 py-1.5 text-xs font-semibold text-[#0e6337] hover:bg-[#eef6ec]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Open the PDF in a new tab
                  </a>
                </div>
              </object>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#1A1A1A]/10 px-4 py-2 font-sans text-xs sm:px-5">
            <span className="text-[#1A1A1A]/65">Original document as supplied.</span>
            <a
              href={doc.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#0e6337] underline-offset-2 hover:underline"
            >
              Open in new tab <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
