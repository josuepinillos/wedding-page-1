import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Pinyon_Script } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cinzel",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Josué & Claudia — 20 de Noviembre 2026",
  description: "Nos casamos el 20 de noviembre de 2026. Acompáñanos a celebrar este día tan especial.",
  openGraph: {
    title: "Josué & Claudia — 20 de Noviembre 2026",
    description: "Nos casamos el 20 de noviembre de 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${cinzel.variable} ${pinyon.variable}`}
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
