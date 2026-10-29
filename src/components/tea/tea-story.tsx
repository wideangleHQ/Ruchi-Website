"use client";

import Image from "next/image";
// Trimmed copy of "Tea and cup.png" (transparent padding removed, artwork untouched).
import teaAndCup from "@/assets/Images/Tea/tea-and-cup-trimmed.png";
import leaf1 from "@/assets/Images/Tea/leaf-1.png";
import leaf2 from "@/assets/Images/Tea/leaf-2.png";
import leaf3 from "@/assets/Images/Tea/leaf-3.png";
import leaf4 from "@/assets/Images/Tea/leaf-4.png";
import { FloatingLeaves, type FloatingLeaf } from "./tea-leaves";

// Continues the Hero's closing beige so the hand-off reads as one surface.
export const TEA_BEIGE = "#F3EBDD";

/** Section A — emotional brand statement, directly after the Hero. */
export function TeaStatement() {
  return (
    <section data-tea-reveal aria-labelledby="tea-statement-heading" className="px-4 py-16 sm:px-6 sm:py-24 lg:py-28" style={{ backgroundColor: TEA_BEIGE }}>
      <div className="mx-auto max-w-3xl text-center">
        <p data-reveal="0" className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#168a4a]">
          Karlo Dosti Sehat Se
        </p>
        <h2
          id="tea-statement-heading"
          data-reveal="1"
          className="mt-5 font-serif text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.1] tracking-tight text-[#1A1A1A]"
        >
          Every cup has a story.
          <br />
          <span className="text-[#0e6337]">Every sip brings us closer.</span>
        </h2>
        <p data-reveal="2" className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-[#1A1A1A]/75 sm:text-lg">
          Since 1976, RUCHI has been part of everyday kitchens. Our tea is made for the moments in between — the first
          cup, the shared break, the cup you pour for a guest.
        </p>
      </div>
    </section>
  );
}

const MOMENTS = [
  { title: "First light", text: "The first cup, before the day asks anything of you." },
  { title: "The tea break", text: "Two cups, a few minutes, and the conversation that needed them." },
  { title: "A guest at the door", text: "In many homes, the kettle goes on before the guest sits down." },
  { title: "Evening, slowly", text: "One more cup as the day winds down." },
];

/**
 * Floating tea leaves for the Ritual section — rendered above the content (see FloatingLeaves).
 * Scroll travel is roughly double the earlier values and the pointer response about 2.5×, for a clearly felt depth.
 */
const RITUAL_LEAVES: FloatingLeaf[] = [
  { img: leaf1, sizes: "(min-width: 1024px) 96px, 64px", className: "top-2 left-1 w-14 sm:top-4 sm:left-4 sm:w-18 lg:top-6 lg:left-8 lg:w-24",
    scroll: { fromY: 150, toY: -230, fromX: -40, toX: 40, fromRot: -35, toRot: 30 }, pointer: { depthX: 46, depthY: 36, tiltX: 14, tiltY: 18 } },
  { img: leaf2, sizes: "(min-width: 1024px) 64px, 40px", className: "top-4 left-[36%] w-9 opacity-85 sm:w-11 lg:top-7 lg:left-[40%] lg:w-16",
    scroll: { fromY: 100, toY: -150, fromX: 30, toX: -30, fromRot: 30, toRot: -22 }, pointer: { depthX: 26, depthY: 20, tiltX: 8, tiltY: 10 } },
  { img: leaf3, sizes: "(min-width: 1024px) 76px, 48px", className: "top-3 right-5 w-10 sm:top-5 sm:right-12 sm:w-12 lg:top-6 lg:right-20 lg:w-18",
    scroll: { fromY: 120, toY: -180, fromX: 36, toX: -32, fromRot: -38, toRot: 28 }, pointer: { depthX: 32, depthY: 26, tiltX: 10, tiltY: 12 } },
  { img: leaf4, sizes: "(min-width: 1024px) 88px, 56px", className: "top-[34%] -left-2 w-12 sm:left-2 sm:w-14 lg:left-6 lg:w-21",
    scroll: { fromY: 160, toY: -220, fromX: -32, toX: 36, fromRot: 35, toRot: -28 }, pointer: { depthX: 42, depthY: 34, tiltX: 12, tiltY: 15 } },
  { img: leaf1, sizes: "(min-width: 1024px) 56px, 36px", className: "top-[44%] left-[44%] w-8 opacity-75 sm:top-[42%] sm:w-10 lg:left-[42%] lg:w-14",
    scroll: { fromY: 90, toY: -130, fromX: -20, toX: 24, fromRot: -28, toRot: 32 }, pointer: { depthX: 22, depthY: 18, tiltX: 7, tiltY: 9 } },
  { img: leaf2, sizes: "(min-width: 1024px) 72px, 44px", className: "top-[38%] -right-2 w-10 sm:right-3 sm:w-12 lg:right-8 lg:w-17",
    scroll: { fromY: 130, toY: -190, fromX: 36, toX: -36, fromRot: 42, toRot: -24 }, pointer: { depthX: 34, depthY: 28, tiltX: 10, tiltY: 12 } },
  { img: leaf3, sizes: "(min-width: 1024px) 92px, 56px", className: "bottom-8 left-2 w-12 sm:bottom-10 sm:left-5 sm:w-16 lg:bottom-12 lg:left-9 lg:w-22",
    scroll: { fromY: 140, toY: -210, fromX: -28, toX: 32, fromRot: -30, toRot: 30 }, pointer: { depthX: 40, depthY: 32, tiltX: 12, tiltY: 15 } },
  { img: leaf4, sizes: "(min-width: 1024px) 100px, 64px", className: "bottom-2 right-2 w-14 sm:bottom-4 sm:right-6 sm:w-17 lg:bottom-6 lg:right-12 lg:w-25",
    scroll: { fromY: 170, toY: -250, fromX: 40, toX: -44, fromRot: 28, toRot: -34 }, pointer: { depthX: 50, depthY: 40, tiltX: 15, tiltY: 18 } },
];

/**
 * Section B — the everyday tea ritual:
 * - Editorial list on the left (~46%), heroic RUCHI pack on the right (~54%).
 * - Floating tea leaves above the content, scrubbed by scroll and following the pointer on desktop.
 */
export function TeaRitual() {
  return (
    <section
      data-tea-reveal
      aria-labelledby="tea-ritual-heading"
      className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-14"
      style={{ backgroundColor: TEA_BEIGE }}
    >
      <FloatingLeaves leaves={RITUAL_LEAVES} />

      {/* =========================================================================
          CONTENT GRID (Text, Moments List & Product Image)
          ========================================================================= */}
      <div className="relative z-20 mx-auto grid w-full max-w-[1400px] items-center gap-x-10 gap-y-8 [grid-template-areas:'head'_'img'_'list'] md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:[grid-template-areas:'head_img'_'list_img'] lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:gap-x-14 xl:gap-x-18">
        <h2
          id="tea-ritual-heading"
          data-reveal="0"
          className="self-end font-serif text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-[#10331f] [grid-area:head]"
        >
          The RUCHI tea ritual
        </h2>

        <div data-reveal="1" className="mx-auto w-full max-w-[28rem] [grid-area:img] sm:max-w-xl md:max-w-none md:scale-105 lg:scale-110 origin-center">
          <Image
            src={teaAndCup}
            alt="A pack of RUCHI Utkal Dust tea beside a red cup and saucer of tea"
            sizes="(min-width: 1280px) 720px, (min-width: 1024px) 55vw, (min-width: 768px) 55vw, 90vw"
            className="h-auto w-full drop-shadow-[0_12px_24px_rgba(20,40,20,0.12)]"
          />
        </div>

        <ol className="self-start [grid-area:list]">
          {MOMENTS.map((m, i) => (
            <li
              key={m.title}
              data-reveal={i + 2}
              className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-t border-[#10331f]/12 py-4 sm:grid-cols-[3.5rem_1fr] sm:py-5 lg:py-5.5"
            >
              <span className="pt-1 font-sans text-sm font-medium tabular-nums tracking-wide text-[#168a4a] sm:text-base">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-sans text-xl font-semibold leading-snug text-[#10331f] sm:text-2xl">{m.title}</h3>
                <p className="mt-1.5 max-w-md font-sans text-base leading-relaxed text-[#1A1A1A]/70 sm:text-[17px]">{m.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
