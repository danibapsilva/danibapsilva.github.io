import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/reveal";
import { Spotlight } from "@/components/spotlight";
import { PERSON } from "@/lib/content";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const SITE = "https://danibapsilva.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${PERSON.name}`, template: `%s · ${PERSON.name}` },
  description: PERSON.intro,
  openGraph: { type: "website", url: SITE, title: PERSON.name, description: PERSON.intro, siteName: PERSON.name },
  twitter: { card: "summary", title: PERSON.name, description: PERSON.intro },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e11" },
  ],
};

// Before paint: apply the saved theme (if the toggle picked one) and mark that JS runs, so nothing flashes.
const BOOT = `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* the site has its own dark mode: Dark Reader leaves it alone (and stops rewriting its markup) */}
        <meta name="darkreader-lock" />
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body className="relative">
        <div className="page-glow" aria-hidden="true" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-[720px] px-5 sm:px-6">
          {children}
        </main>
        <Footer />
        <Reveal />
        <Spotlight />
      </body>
    </html>
  );
}
