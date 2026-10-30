import { Box, Handshake, Landmark, Package, ShieldCheck, type LucideIcon } from "lucide-react";
import { WorldMap3D } from "./world-map-3d";
import { GB_COLORS, TRUST } from "./content";

const ICONS: LucideIcon[] = [Landmark, Package, ShieldCheck, Box, Handshake];

/**
 * Section 02 — brand story with five trust pillars (left, ~48%) and the 3D world map (right, ~52%).
 * Entrance is the page's CSS scroll reveal ([data-tea-reveal] / [data-reveal]), which is reduced-motion safe;
 * the map's pointer tilt lives in WorldMap3D (ignored on touch, off under prefers-reduced-motion).
 */
export function GlobalBusinessTrust() {
  return (
    <section
      data-tea-reveal
      aria-labelledby="gb-trust-heading"
      className="flex items-center overflow-x-clip bg-white px-4 py-14 sm:px-6 sm:py-16 lg:min-h-[85vh] lg:px-8 lg:py-6"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 md:gap-12 lg:grid-cols-[48fr_52fr] lg:gap-12 xl:gap-16">
        <div>
          <p data-reveal="0" className="font-sans text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: GB_COLORS.green }}>
            {TRUST.eyebrow}
          </p>
          <h2
            id="gb-trust-heading"
            data-reveal="0"
            className="mt-3 font-serif text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.08] tracking-tight"
            style={{ color: GB_COLORS.maroon }}
          >
            {TRUST.heading}
          </h2>
          <p data-reveal="1" className="mt-4 max-w-lg font-sans text-base leading-relaxed sm:text-lg" style={{ color: `${GB_COLORS.charcoal}cc` }}>
            {TRUST.story}
          </p>

          <ol className="mt-6 space-y-4 lg:space-y-3.5">
            {TRUST.pillars.map((p, i) => {
              const Icon = ICONS[i];
              return (
                <li key={p.title} data-reveal={i + 2} className="flex gap-4">
                  <span
                    className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${GB_COLORS.green}26`, color: GB_COLORS.green }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans text-base font-semibold sm:text-[17px]" style={{ color: GB_COLORS.charcoal }}>
                      <span className="mr-2 font-bold tabular-nums" style={{ color: GB_COLORS.green }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p.title}
                    </h3>
                    <p className="mt-1 font-sans text-sm leading-relaxed sm:text-[15px]" style={{ color: `${GB_COLORS.charcoal}b3` }}>
                      {p.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div data-reveal="1" className="min-w-0">
          <WorldMap3D priority />
        </div>
      </div>
    </section>
  );
}
