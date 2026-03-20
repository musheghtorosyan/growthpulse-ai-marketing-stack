import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: "GrowthPulse AI",
  description: "Your marketing stack, diagnosed in minutes.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "GrowthPulse AI",
    description: "Your marketing stack, diagnosed in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {GA4_MEASUREMENT_ID ? (
        <Script strategy="afterInteractive" id="ga4-loader">
          {`
            (function(){
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              var d=document, s=d.createElement('script'); s.async=true;
              s.src='https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}';
              d.head.appendChild(s);
            })();
          `}
        </Script>
      ) : null}
      {GA4_MEASUREMENT_ID ? (
        <Script strategy="afterInteractive" id="ga4-config">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag('js', new Date());
            window.gtag('config', '${GA4_MEASUREMENT_ID}', { anonymize_ip: true });
          `}
        </Script>
      ) : null}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
