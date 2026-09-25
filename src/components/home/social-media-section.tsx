import Image from "next/image";
import Link from "next/link";
import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import teaImg from "@/assets/Images/Categories/Tea.png";
import vermicelliImg from "@/assets/Images/Categories/Vermicelli.png";
import wholeSpicesImg from "@/assets/Images/Categories/Whole Spices.png";

const POSTS = [
  { image: basicSpicesImg, alt: "Ruchi basic spices" },
  { image: blendedSpicesImg, alt: "Ruchi blended masalas" },
  { image: teaImg, alt: "Ruchi tea" },
  { image: pastaImg, alt: "Ruchi pasta" },
  { image: vermicelliImg, alt: "Ruchi vermicelli" },
  { image: wholeSpicesImg, alt: "Ruchi whole spices" },
];

export function SocialMediaSection() {
  return (
    <section className="py-5 sm:py-7 lg:py-9 bg-transparent" aria-label="Follow the Ruchi journey">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 lg:mb-7">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text">
            Follow the Ruchi Journey
          </h2>
          <p className="mt-2 text-sm text-muted-text max-w-lg mx-auto">
            A closer look at the spices, blends, and kitchens Ruchi Foodline is part of every day.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {POSTS.map((post, idx) => (
            <Link
              key={idx}
              href="/products"
              className="group relative block aspect-square overflow-hidden rounded-[10px] sm:rounded-[12px] border border-border/60"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 33vw"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
