"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Camera, ChevronDown, ChevronUp } from "lucide-react";

import imgInnovator from "@/assets/Awards/Business Innovator Award 2022.jpg";
import imgOdiaTv from "@/assets/Awards/Odia TV Award by Mr. Joel Oram.jpg";
import imgGoldenJubilee from "@/assets/Awards/PICT-10.jpg";
import imgUtkalPerforming from "@/assets/Awards/PICT-14.jpg";
import imgDisplayStall from "@/assets/Awards/PICT-17.jpg";
import imgUtkalExport from "@/assets/Awards/PICT-18.jpg";
import imgOasme from "@/assets/Awards/PICT-19.jpg";
import imgSmeForum from "@/assets/Awards/PICT-23.jpg";
import imgWtc from "@/assets/Awards/PICT-26.jpg";
import imgOdishaBusiness from "@/assets/Awards/PICT-27.jpg";
import imgSwaviman from "@/assets/Awards/PICT-3.jpg";
import imgEntrepreneurMag from "@/assets/Awards/PICT-30(a).jpg";
import imgPhd from "@/assets/Awards/PICT-35.jpg";
import imgSambad from "@/assets/Awards/PICT-36.jpg";
import imgTimesBusiness from "@/assets/Awards/PICT-39.jpg";
import imgChinta from "@/assets/Awards/PICT-4.jpg";
import imgNewsMaker from "@/assets/Awards/PICT-54.jpg";
import imgOtv from "@/assets/Awards/PICT-55.jpg";
import imgSocialActivist from "@/assets/Awards/PICT-6.jpg";
import imgThinkOdisha from "@/assets/Awards/PICT-8.jpg";
import imgExpoOrissa from "@/assets/Awards/PICT-9.jpg";
import imgSpicesBoard from "@/assets/Awards/Spices Board Certificate.jpg";

interface AwardItem {
  /** YYYY-MM-DD as printed in the source list; 00 marks an unknown month/day. */
  date: string;
  title: string;
  by: string;
  img?: StaticImageData;
}

// Source: "Laurels & Awards bagged by Ruchi" (src/assets/Awards). Typos in the original corrected; wording otherwise kept.
// Photo-only entry: "Best Display Stall Award" has no line in the list and is taken from the caption printed on its photo.
const AWARDS: AwardItem[] = [
  { date: "1986-00-00", title: "Best Successful Enterprise & Industrial Peace and Promotion Unit Award", by: "OASME (Odisha Assembly of Small and Medium Enterprises)" },
  { date: "1988-00-00", title: "Rotary International Award (R.R. Sikka Memorial Award) for the Best Maintained Factory", by: "Presented by Shri Narendra Kumar Mishra, I.A.S." },
  { date: "1988-00-00", title: "Best Successful Enterprise & Industrial Peace and Promotion Unit Award", by: "OASME (Odisha Assembly of Small and Medium Enterprises)" },
  { date: "1989-00-00", title: "Quality Award", by: "State Bank of India & Odisha Small Industries Corporation (OSIC)" },
  { date: "1996-00-00", title: "Chalachitra Jagat Prativa Samman", by: "Shri Hemananda Biswal, Deputy Chief Minister of Odisha" },
  { date: "1996-00-00", title: "Best Successful Enterprise & Industrial Peace and Promotion Unit Award", by: "OASME (Odisha Assembly of Small and Medium Enterprises)" },
  { date: "1997-00-00", title: "Best Export Award", by: "OASME, presented by His Excellency Shri Gopal Ramanujam, Hon'ble Governor of Odisha" },
  { date: "1998-00-00", title: "Best Export Award", by: "EPM, Govt. of Odisha, presented by Shri Niranjan Pattnaik, Hon'ble Minister, Industry, Odisha" },
  { date: "1998-04-24", title: "Spices House Certificate", by: "Spices Board, Govt. of India, presented by Shri Sudhansu Bhusan Mishra, IAS, Chief Secretary of Odisha", img: imgSpicesBoard },
  { date: "1999-00-00", title: "1st SWAVIMAN Samman", by: "Govt. of Odisha, presented by Dr. Giridhara Gomango, Hon'ble Chief Minister of Odisha", img: imgSwaviman },
  { date: "1999-00-00", title: "Outstanding Entrepreneur of the Year", by: "EDI" },
  { date: "2000-04-19", title: "'Chinta-O-Chetana' Award", by: "Shri Sarat Kumar Kar, Hon'ble Speaker, and Shri Biswabhusan Harichandan, Hon'ble Minister, Revenue, Govt. of Odisha", img: imgChinta },
  { date: "2000-04-22", title: "Rotary International Award (Gopal Pattnaik Memorial Award)", by: "Rotary Club of Cuttack" },
  { date: "2000-08-12", title: "Biju Pattnaik Memorial Award", by: "OASME, presented by His Excellency Shri M. M. Rajendran, Hon'ble Governor of Odisha" },
  { date: "2000-12-24", title: "'Chalachitra Jagat' Millennium Award", by: "Shri Sarat Kumar Kar, Hon'ble Speaker, Odisha" },
  { date: "2001-01-01", title: "AGMARK Certification", by: "Ministry of Agriculture, Govt. of India" },
  { date: "2001-05-06", title: "Best Entrepreneur Award", by: "New Thinking Forum, Khurdha, presented by Shri Janaki Ballav Pattnaik, Former Chief Minister of Odisha" },
  { date: "2001-08-19", title: "ISO 9002 Certification", by: "Presented by Shri Debi Prasad Bagchi, I.A.S., Chief Secretary of Odisha" },
  { date: "2001-11-00", title: "Best Export Award", by: "Shri Biswa Bhusan Harichandan, Hon'ble Minister, Revenue, Govt. of Odisha" },
  { date: "2002-03-00", title: "Best Successful & Proven Entrepreneur Award", by: "Odisha State Financial Corporation (OSFC), presented by Shri Kanak Vardhan Singh Deo, Hon'ble Minister, Industry, Govt. of Odisha" },
  { date: "2002-03-00", title: "Rajiv Gandhi Award in the Field of Commercial Business Organisation", by: "Rajiv Gandhi Forum, Odisha" },
  { date: "2003-10-16", title: "Best Entrepreneur Award", by: "Odisha Union of Working Journalists, presented by Justice Shri Laxmikanta Mohapatra, Hon'ble Judge, Odisha High Court" },
  { date: "2003-12-30", title: "Utkal Sammilani Satabdi Samman", by: "Utkal Sammilani Centenary Committee, presented by Shri Sarat Kumar Kar, Hon'ble Speaker, Odisha Legislative Assembly" },
  { date: "2004-01-04", title: "Vaisha Shree Samman", by: "All India Vaish Federation, presented by Shri Beda Prakash Agarwal, Hon'ble Minister, Rural Development, Govt. of Odisha" },
  { date: "2004-01-04", title: "State Safety Award", by: "Govt. of Odisha, presented by Shri Danda Nirodha Mishra, I.A.S., Labour Commissioner" },
  { date: "2004-09-30", title: "Best Entrepreneur Award, Golden Jubilee Celebration of State Social Welfare Board", by: "Presented by Shri Naveen Patnaik, Hon'ble Chief Minister of Odisha", img: imgGoldenJubilee },
  { date: "2005-00-00", title: "Best Women Entrepreneur Award", by: "Shri Rameswar Thakur, Hon'ble Governor of Odisha" },
  { date: "2005-09-26", title: "HACCP Certification", by: "Presented by the General Manager, \"The Samaja\"" },
  { date: "2006-00-00", title: "Best Display of SISI Stall Award", by: "Expo-Orissa 2006" },
  { date: "2007-11-02", title: "Expo-Orissa Award for Excellence in Entrepreneurship", by: "Presented by Shri Naveen Patnaik, Hon'ble Chief Minister, Odisha", img: imgExpoOrissa },
  { date: "2008-02-11", title: "Best Entrepreneur Award", by: "Matrubhasa Prachar Samiti, presented by Sri Prafulla Chandra Ghadei, Hon'ble Minister, Finance, Govt. of Odisha" },
  { date: "2008-08-14", title: "The Times of India – Think Odisha Leadership Award 2008", by: "Presented by Shri Naveen Patnaik, Hon'ble Chief Minister, Odisha", img: imgThinkOdisha },
  { date: "2008-09-28", title: "Best Social Activist Award", by: "Deaf Association of Odisha, presented by His Excellency Shri Murlidhar Chandrakant Bhandare, Hon'ble Governor, Odisha", img: imgSocialActivist },
  { date: "2009-01-30", title: "Felicitation for Best Entrepreneurship", by: "Banki Autonomous College, Banki, Cuttack" },
  { date: "2009-11-28", title: "Best Entrepreneur Award of the State", by: "Odisha Commerce Association, Ravenshaw University, Cuttack, presented by Justice Shri Indrajit Mohanty, Hon'ble Judge, Odisha High Court" },
  { date: "2010-11-24", title: "'Saphala Sadhaba Pua Samman'", by: "Sri Soumya R. Patnaik, Chairman, Kanak TV" },
  { date: "2011-03-11", title: "Best Food Processing Unit Award", by: "NSIC, MSME International Trade Fair 2011, presented by Shri Pyarimohan Mohapatra, M.P. (Rajya Sabha)" },
  { date: "2012-02-23", title: "Best Performing Unit Award", by: "Utkal Chamber of Commerce & Industry, presented by Shri Prafulla Chandra Ghadai, Hon'ble Minister, Finance, Govt. of Odisha", img: imgUtkalPerforming },
  { date: "2012-04-28", title: "ACRUX Showcase Odisha Award 2012 for Global Business Leadership", by: "Sri Srimoy Kar, Resident Editor, The New Indian Express" },
  { date: "2012-10-27", title: "Odisha Citizen Award 2012", by: "Odisha Television Ltd., presented by Sri Surya Narayan Patra, Hon'ble Revenue Minister, and Sri Bijay Mohanty, Eminent Actor" },
  { date: "2013-12-06", title: "Felicitation", by: "KIST, by the Managing Director, Nilachal Ispat Nigam Ltd." },
  { date: "2014-00-00", title: "Best Display Stall Award in the Food Processing Sector", by: "Odisha MSME International Trade Fair 2014", img: imgDisplayStall },
  { date: "2014-02-22", title: "Best Export / Foreign Exchange Earner Award", by: "Utkal Chamber of Commerce & Industries Ltd.", img: imgUtkalExport },
  { date: "2014-12-13", title: "Best Corporate Award 2014", by: "Odia Television, presented by Sri Jual Oram, Hon'ble Union Minister", img: imgOdiaTv },
  { date: "2015-08-12", title: "Best Industry Award for the year 2014-15", by: "OASME, presented by Mr. Jogendra Behera, Hon'ble Minister, MSME, Pension & Public Grievances, Govt. of Odisha", img: imgOasme },
  { date: "2016-06-22", title: "Brands of Odisha Award 2016", by: "Ad.Guru Prahallad Kakar, Odisha Live TV" },
  { date: "2017-04-13", title: "'Bhubaneswar Gourav Samman'", by: "Sri Dharmendra Pradhan, Hon'ble Minister of State for Petroleum and Natural Gas, on the 69th Capital Foundation Day, Bhubaneswar" },
  { date: "2017-05-06", title: "Best Entrepreneur Award", by: "India SME Forum, presented by Sri Kalraj Mishra, Hon'ble Minister, MSME, Govt. of India", img: imgSmeForum },
  { date: "2017-05-19", title: "MSME Export Achievement Award", by: "World Trade Center, presented by Sri R. Balakrishnan, Development Commissioner and Addl. Chief Secretary, Odisha", img: imgWtc },
  { date: "2017-06-02", title: "Guru Gangadhar Smruti Samman", by: "Odisha Dance Academy" },
  { date: "2017-09-20", title: "Odisha Business Award 2017 for Best Industry in F&B Category", by: "Kanak News & Sambad Group, presented by Shri Akash Das Nayak, Hon'ble MLA", img: imgOdishaBusiness },
  { date: "2017-00-00", title: "'AARYA Award'", by: "Parichaya Foundation, presented by Nobel laureate Shri Kailash Satyarthi" },
  { date: "2018-03-10", title: "MSME Excellence Award 2018 in Large Enterprise Category", by: "Presented by Prafulla Samal, Minister, W & CD, MSME, Govt. of Odisha" },
  { date: "2018-06-07", title: "Best Business Entrepreneur of the City Award (2017)", by: "92.7 Big FM" },
  { date: "2018-06-16", title: "Shrie Award 2018 to Sri Sarat Kumar Sahoo", by: "Parichay Foundation, Bhubaneswar, presented by Sri Prabhu Chawala, Editorial Advisor, The New Indian Express" },
  { date: "2018-07-16", title: "Entrepreneur of the Year, Service Business Award 2018", by: "Mr. Gaurav Marya, Chairman, Franchise India, and Ms. Ritu Marya, Editor in Chief, Entrepreneur Magazine", img: imgEntrepreneurMag },
  { date: "2018-09-03", title: "Dadhichi Award 2018", by: "Dadhichi Group of Institution, presented by Prof. Ganeshi Lal, Hon'ble Governor of Odisha" },
  { date: "2018-11-06", title: "Chandra Madhaba Mishra Silpa Samman 2018", by: "Samaja O Sanskruti Socio-Cultural Organisation, presented by Hon'ble MLA Dhenkanal Saroj Samal" },
  { date: "2018-11-16", title: "Odisha Living Legend Youth Inspiration Award 2018, Business Leadership Category", by: "Odisha Diary Foundation, presented by Hon'ble Health Minister Sri Pratap Jena" },
  { date: "2018-12-16", title: "Doctor of Philosophy in Industrial Management", by: "Ballsbridge University, India Habitat Centre, New Delhi", img: imgPhd },
  { date: "2019-01-19", title: "Brands of Odisha Pride of India, SAMBAD Corporate Excellence Awards 2019", by: "SAMBAD Group, presented by Hon'ble Chief Minister of Odisha Sj. Naveen Patnaik at Mayfair Resorts, Bhubaneswar", img: imgSambad },
  { date: "2019-02-25", title: "Times Business Awards 2019 — Visionary Leader in the Spice Sector", by: "The Times of India", img: imgTimesBusiness },
  { date: "2019-03-06", title: "Bhubaneswar Leadership Awards 2019 for Best CSR Practices", by: "World CSR Federation" },
  { date: "2019-09-03", title: "Dadhichi Silpa Jyoti Samman 2019 to Dr. Sarat Kumar Sahoo, MD, OFML (RUCHI)", by: "Presented by Shri Raghunandan Das, Minister, Irrigation, I & P.R., Odisha" },
  { date: "2019-09-23", title: "Dhaneswar Rath Smruti Samman 2019 to Dr. Sarat Kumar Sahoo", by: "DRIEMS University" },
  { date: "2019-09-30", title: "Deekhya Ratna Samman 2019 to Dr. Sarat Kumar Sahoo", by: "Deekhya Foundation, presented by H.E. Prof. Ganeshi Lal, Hon'ble Governor, Odisha" },
  { date: "2020-03-08", title: "Young Woman Achievers Award 2020 to Rashmi Sahoo", by: "Bharatiya Academi, Bhubaneswar" },
  { date: "2020-12-19", title: "News Maker 2020 Award to Dr. Sarat Kumar Sahoo for his service during the Covid-19 pandemic", by: "Kanak News", img: imgNewsMaker },
  { date: "2021-03-06", title: "FLO Odisha Women's Award 2021", by: "Federation of Indian Chambers of Commerce & Industry (FICCI), presented by Sri Naveen Patnaik, Hon'ble Chief Minister of Odisha" },
  { date: "2021-03-09", title: "MSME Stall of the Year 2021 Award", by: "MSME Trade Fair, Bhubaneswar, presented by His Excellency Governor of Odisha Prof. Ganeshi Lal" },
  { date: "2021-03-12", title: "Business Eminence Awards 2021 to Dr. Sarat Kumar Sahoo", by: "Dharitri – Odisha Post" },
  { date: "2021-09-01", title: "Times Helping Hand Award 2021 to Ruchi Foodline", by: "Times Group, for notable social work during the COVID-19 pandemic" },
  { date: "2022-02-26", title: "Best Female Entrepreneur Award to Mrs. Rashmi Sahoo, Director", by: "Mycitylinks Corporate Icon Award 2022, presented by actress Mandira Bedi at Konark Eco Retreat" },
  { date: "2022-03-07", title: "Business Innovator Award to Dr. Sarat Kumar Sahoo", by: "Agri Vision 2022, International Conference on Agriculture for Sustainable Future, Ravenshaw University", img: imgInnovator },
  { date: "2022-05-14", title: "Spice Icon Award 2022 to Ruchi Foodline", by: "Global Spice Summit & Excellence Award" },
  { date: "2022-05-30", title: "Most Promising Brand Award, Ready-to-Eat Category, Eastern India", by: "Times Business Awards 2022, presented by Mr. Sonu Sood" },
  { date: "2023-08-26", title: "OTV Business Odisha Award 2023 — Leading Manufacturer of Food Products", by: "Odisha Television (OTV)", img: imgOtv },
  { date: "2024-09-29", title: "Times Icons of Odisha 2024 Award", by: "The Times of India" },
  { date: "2025-08-12", title: "Satya Swain Memorial Lifetime Achievement Award", by: "OASME, Cuttack" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(date: string) {
  const [y, m, d] = date.split("-");
  if (m === "00") return y;
  return `${d === "00" ? "" : `${Number(d)} `}${MONTHS[Number(m) - 1]} ${y}`;
}

export function AboutAwards() {
  // Newest first; the reverse keeps later list entries ahead of earlier ones on the same date (sort is stable).
  const awards = useMemo(() => [...AWARDS].reverse().sort((a, b) => b.date.localeCompare(a.date)), []);
  const photos = useMemo(() => awards.flatMap((a, i) => (a.img ? [i] : [])), [awards]);

  const [active, setActive] = useState(0); // index into `photos`
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const railRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const locked = useRef(false);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  // The photo whose list entry sits nearest the middle of the viewport becomes the active slide.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (locked.current) return;
      const mid = window.innerHeight * 0.5;
      let best = -1;
      let bestDistance = Infinity;
      photos.forEach((awardIndex, i) => {
        const box = itemRefs.current[awardIndex]?.getBoundingClientRect();
        if (!box) return;
        const distance = Math.abs(box.top + box.height / 2 - mid);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      if (best >= 0) setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [photos]);

  // The site header is sticky and its height changes by breakpoint, so the slider parks just below it.
  useEffect(() => {
    const header = document.querySelector("header");
    const apply = () => stickyRef.current?.style.setProperty("--hdr", `${header?.getBoundingClientRect().height ?? 96}px`);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Keep the active thumbnail centred inside the vertical rail without moving the page.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRefs.current[active];
    if (!rail || !thumb) return;
    rail.scrollTo({ top: thumb.offsetTop - rail.clientHeight / 2 + thumb.clientHeight / 2, behavior: "smooth" });
  }, [active]);

  const goTo = (photoIndex: number) => {
    const next = (photoIndex + photos.length) % photos.length;
    setActive(next);
    locked.current = true;
    window.setTimeout(() => (locked.current = false), 1200);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    itemRefs.current[photos[next]]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  const current = awards[photos[active]];

  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-white" aria-label="Awards and Recognitions">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-6 sm:mb-8 lg:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Awards &amp; Institutional Recognitions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Laurels since {awards[awards.length - 1].date.slice(0, 4)} — from state governments, trade bodies and industry summits for enterprise,
            export, quality and leadership.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-12">
          {/* Sticky vertical slider: thumbnail rail + photo stage, driven by scroll position or the controls */}
          <div ref={stickyRef} className="sticky top-[calc(var(--hdr,4.5rem)+0.5rem)] z-10 -mx-4 bg-white px-4 pb-3 pt-2 sm:-mx-6 sm:px-6 lg:top-[calc(var(--hdr,7rem)+1rem)] lg:mx-0 lg:px-0 lg:pb-0 lg:pt-0">
            <div className="flex gap-3">
              <div
                ref={railRef}
                role="tablist"
                aria-orientation="vertical"
                aria-label="Award photographs"
                className="relative hidden h-[min(calc(100svh-var(--hdr,7rem)-8rem),32rem)] w-16 shrink-0 flex-col gap-2 overflow-y-auto overscroll-contain sm:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {photos.map((awardIndex, i) => {
                  const a = awards[awardIndex];
                  return (
                    <button
                      key={awardIndex}
                      ref={(el) => {
                        thumbRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={`${formatDate(a.date)}: ${a.title}`}
                      onClick={() => goTo(i)}
                      className={`relative aspect-square w-full shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-[border-color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a] ${
                        i === active ? "border-[#168a4a] opacity-100" : "border-transparent opacity-55 hover:opacity-100"
                      }`}
                    >
                      <Image src={a.img!} alt="" fill sizes="64px" className="object-cover" />
                    </button>
                  );
                })}
              </div>

              <div className="min-w-0 flex-1">
                <div className="relative h-[34svh] overflow-hidden rounded-xl border border-gray-200 bg-[#f4f7f3] sm:h-[min(calc(100svh-var(--hdr,7rem)-8rem),32rem)]">
                  {photos.map((awardIndex, i) => {
                    // Only the neighbours of the active slide are mounted; the rest load as the reader nears them.
                    if (Math.abs(i - active) > 1) return null;
                    const a = awards[awardIndex];
                    return (
                      <Image
                        key={awardIndex}
                        src={a.img!}
                        alt={`${a.title}, ${formatDate(a.date)}`}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className={`object-contain p-2 transition-opacity duration-500 motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`}
                      />
                    );
                  })}
                </div>

                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0" aria-live="polite">
                    <p className="font-mono text-sm font-bold text-[#0e6337] tabular-nums">{formatDate(current.date)}</p>
                    <p className="mt-0.5 line-clamp-2 font-serif text-sm font-bold leading-snug text-gray-900 sm:text-base">{current.title}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="mr-1 font-mono text-xs text-gray-500 tabular-nums">
                      {active + 1}/{photos.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => goTo(active - 1)}
                      aria-label="Previous award photograph"
                      className="cursor-pointer rounded-md border border-[#168a4a]/40 p-1.5 text-[#0e6337] transition-colors hover:bg-[#eef6ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a]"
                    >
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo(active + 1)}
                      aria-label="Next award photograph"
                      className="cursor-pointer rounded-md border border-[#168a4a]/40 p-1.5 text-[#0e6337] transition-colors hover:bg-[#eef6ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a]"
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full chronological list, newest first */}
          <ol className="mt-4 border-t border-gray-200 lg:mt-0">
            {awards.map((award, i) => {
              const photoIndex = award.img ? photos.indexOf(i) : -1;
              const isActive = photoIndex === active;
              return (
                <li
                  key={`${award.date}-${i}`}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-photo={photoIndex >= 0 ? photoIndex : undefined}
                  onClick={photoIndex >= 0 ? () => setActive(photoIndex) : undefined}
                  className={`grid grid-cols-[4.75rem_1fr] gap-x-4 border-b border-gray-200 py-4 pl-3 transition-colors sm:grid-cols-[5.5rem_1fr] sm:py-5 ${
                    photoIndex >= 0 ? "cursor-pointer border-l-2" : "border-l-2 border-l-transparent"
                  } ${isActive ? "border-l-[#168a4a] bg-[#f4f9f2]" : photoIndex >= 0 ? "border-l-[#168a4a]/30" : ""}`}
                >
                  <span className="pt-0.5 font-mono text-xs font-bold text-[#0e6337] tabular-nums sm:text-sm">{formatDate(award.date)}</span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-bold leading-snug text-gray-900 sm:text-lg">
                      {award.title}
                      {photoIndex >= 0 && <Camera className="ml-2 inline h-3.5 w-3.5 -translate-y-px text-[#168a4a]" aria-label="Photograph available" />}
                    </h3>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-gray-600 sm:text-[13px]">{award.by}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
