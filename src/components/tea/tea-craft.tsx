import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, FileCheck2, MapPin, PackageCheck, ShieldCheck, type LucideIcon } from "lucide-react";
import teaLeavesImg from "@/assets/Images/Categories/tea.png";
import leaf1 from "@/assets/Images/Tea/leaf-1.png";
import leaf2 from "@/assets/Images/Tea/leaf-2.png";
import leaf3 from "@/assets/Images/Tea/leaf-3.png";
import leaf4 from "@/assets/Images/Tea/leaf-4.png";
import { FloatingLeaves, type FloatingLeaf } from "./tea-leaves";
import { TEA_BEIGE } from "./tea-story";

// Leaves float above the heading and card row (they overlap the cards' edges; clicks pass through).
const CRAFT_LEAVES: FloatingLeaf[] = [
  { img: leaf4, sizes: "(min-width: 1024px) 112px, 64px", className: "top-2 right-[6%] w-14 sm:w-20 lg:right-[10%] lg:w-28",
    scroll: { fromY: 140, toY: -200, fromX: 30, toX: -30, fromRot: 20, toRot: 48 }, pointer: { depthX: 46, depthY: 36, tiltX: 14, tiltY: 18 } },
  { img: leaf2, sizes: "(min-width: 1024px) 72px, 44px", className: "top-10 left-[8%] w-10 opacity-90 sm:w-12 lg:left-[14%] lg:w-18",
    scroll: { fromY: 110, toY: -160, fromX: -26, toX: 26, fromRot: -30, toRot: 18 }, pointer: { depthX: 30, depthY: 24, tiltX: 10, tiltY: 12 } },
  { img: leaf1, sizes: "(min-width: 1024px) 104px, 60px", className: "bottom-[18%] -left-3 w-14 sm:left-2 sm:w-18 lg:left-6 lg:w-26",
    scroll: { fromY: 160, toY: -220, fromX: -34, toX: 38, fromRot: -40, toRot: 22 }, pointer: { depthX: 48, depthY: 38, tiltX: 14, tiltY: 18 } },
  { img: leaf3, sizes: "(min-width: 1024px) 80px, 48px", className: "bottom-[30%] -right-2 w-11 sm:right-3 sm:w-14 lg:right-8 lg:w-20",
    scroll: { fromY: 130, toY: -190, fromX: 34, toX: -34, fromRot: 34, toRot: -26 }, pointer: { depthX: 38, depthY: 30, tiltX: 12, tiltY: 15 } },
  { img: leaf2, sizes: "(min-width: 1024px) 56px, 36px", className: "bottom-6 left-[46%] w-8 opacity-80 sm:w-10 lg:w-14",
    scroll: { fromY: 90, toY: -140, fromX: 22, toX: -22, fromRot: 26, toRot: -30 }, pointer: { depthX: 24, depthY: 20, tiltX: 8, tiltY: 10 } },
];

// Every fact below comes from the product catalogue (Tea sheet) or the certificates in src/assets/Certifications.
// Icons are plain illustrations, not certification marks.
const FACTS: Array<{ title: string; text: string; Icon: LucideIcon }> = [
  { title: "Hygienically packed", text: "Processed and sealed in protective pouches to hold freshness and aroma.", Icon: PackageCheck },
  { title: "ISO 22000:2018", text: "Our food safety management system is certified to ISO 22000:2018.", Icon: ShieldCheck },
  { title: "FSSAI licensed", text: "Marketed under FSSAI licence 10012032000096.", Icon: FileCheck2 },
  { title: "Best before 12 months", text: "Store in a clean, dry place away from sunlight.", Icon: CalendarClock },
  { title: "Made in India", text: "Marketed by Om Oil & Flour Mills Ltd., Cuttack, Odisha.", Icon: MapPin },
];

// Card placement per breakpoint: 1 column → 2 columns (last card full width) → 3 + 2 centred (tablet) → 5 in a row.
const PLACEMENT = [
  "md:col-span-2 lg:col-span-1",
  "md:col-span-2 lg:col-span-1",
  "md:col-span-2 lg:col-span-1",
  "md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto",
  "min-[440px]:col-span-2 md:col-span-2 lg:col-span-1",
];

/** Section D — the craft behind the cup: centred heading, five compact trust cards, two quiet leaf accents. */
export function TeaCraft() {
  return (
    <section
      data-tea-reveal
      aria-labelledby="tea-craft-heading"
      className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      style={{ backgroundColor: TEA_BEIGE }}
    >
      <FloatingLeaves leaves={CRAFT_LEAVES} />

      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="tea-craft-heading"
            data-reveal="0"
            className="font-serif text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.08] tracking-tight text-[#10331f]"
          >
            The craft behind the cup
          </h2>
          <p data-reveal="1" className="mx-auto mt-4 max-w-md font-sans text-base font-medium leading-relaxed text-[#1A1A1A]/85">
            Thoughtfully packed. Carefully handled. Made for your everyday tea ritual.
          </p>
        </div>

        <div className="relative mt-12 sm:mt-14">
          <ul className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 md:grid-cols-6 lg:grid-cols-5 lg:gap-5">
            {FACTS.map(({ title, text, Icon }, i) => {
              const featured = i === 0;
              return (
                <li key={title} data-reveal={i + 2} className={PLACEMENT[i]}>
                  <div
                    className={`flex h-full flex-col rounded-[14px] p-5 transition-[background-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 sm:p-6 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                      featured
                        ? "bg-[#10331f] text-[#fbf6ea] shadow-[0_10px_30px_-18px_rgba(16,51,31,0.7)]"
                        : "border border-[#10331f]/12 bg-[#fffcf6] text-[#10331f] hover:bg-white hover:shadow-[0_10px_28px_-20px_rgba(16,51,31,0.45)]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                        featured ? "bg-[#fbf6ea]/12 text-[#fbf6ea]" : "bg-[#eef6ec] text-[#0e6337]"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-sans text-base font-semibold leading-snug sm:text-[17px]">{title}</h3>
                    <p
                      className={`mt-2 text-sm font-medium leading-relaxed ${featured ? "text-[#fbf6ea]/90" : "text-[#10331f]/90"}`}
                      style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
                    >
                      {text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/#certifications-heading"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#0e6337] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#168a4a]"
          >
            View our certificates <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Section H — closing brand moment with a single CTA into the tea range. */
export function TeaClosing() {
  return (
    <section data-tea-reveal aria-labelledby="tea-closing-heading" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24" style={{ backgroundColor: TEA_BEIGE }}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="text-center md:text-left">
          <h2
            id="tea-closing-heading"
            data-reveal="0"
            className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-[#1A1A1A]"
          >
            Make room for <span className="text-[#0e6337]">one more cup.</span>
          </h2>
          <p data-reveal="1" className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-[#1A1A1A]/75 md:mx-0">
            Your next cup of RUCHI tea is a few clicks away.
          </p>
          <Link
            data-reveal="2"
            href="/products?category=tea"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#168a4a] px-7 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#0e6337] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a] sm:text-base"
          >
            Shop RUCHI Tea <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div data-reveal="1" className="mx-auto w-full max-w-md">
          <Image
            src={teaLeavesImg}
            alt=""
            sizes="(min-width: 768px) 28rem, 90vw"
            placeholder="blur"
            className="aspect-square h-auto w-full rounded-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
