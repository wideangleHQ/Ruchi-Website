import localFont from "next/font/local";
import { Playfair_Display, Poppins } from "next/font/google";

export const poppinsMedium = localFont({
  src: "../assets/fonts/Poppins/Poppins-Medium.ttf",
  weight: "500",
  style: "normal",
  variable: "--font-poppins-medium",
  display: "swap",
});

// Self-hosted at build time (no render-blocking request to fonts.googleapis.com). Same families as before.
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"], // no thin/regular weights anywhere on the site
  variable: "--font-poppins",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
