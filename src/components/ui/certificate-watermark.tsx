/** Watermark wording — change here to update every certificate display. */
export const CERTIFICATE_WATERMARK_LINES = ["RUCHI", "FOODLINE", "PVT LTD."] as const;

/**
 * Large diagonal watermark laid over a certificate image or PDF viewer. Put it inside a `relative` box.
 *  - Display only: the original PDF files and their downloads are never modified.
 *  - Sized in container units (`cqw`), so it scales with the box — small on a card thumbnail, large in the viewer.
 *  - `pointer-events-none`: the PDF underneath can still be scrolled, zoomed and clicked.
 *  - `mix-blend-multiply`: tints the page instead of covering it, so the certificate text underneath stays readable.
 *  - Hidden from assistive technology (decorative; the certificate's own title is the accessible name).
 */
export function CertificateWatermark() {
  return (
    <div aria-hidden="true" className="@container pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center overflow-hidden mix-blend-multiply">
      <div className="-rotate-[28deg] text-center font-sans text-[14cqw] font-extrabold leading-[1.05] tracking-[0.06em] text-[#0e6337]/[0.2] whitespace-nowrap">
        {CERTIFICATE_WATERMARK_LINES.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  );
}
