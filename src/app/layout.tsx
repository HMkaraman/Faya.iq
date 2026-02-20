import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "Faya.iq | Premium Beauty & Aesthetic Clinic in Iraq",
    template: "%s | Faya.iq",
  },
  description:
    "Iraq's premier destination for luxury aesthetics. World-class skincare, hair treatments, injectables, laser services, and cosmetic surgery across multiple branches.",
  keywords: [
    "beauty clinic Iraq",
    "aesthetic clinic Baghdad",
    "dermal fillers Iraq",
    "laser hair removal Baghdad",
    "botox Iraq",
    "HydraFacial Iraq",
    "عيادة تجميل العراق",
    "فايا",
    "عيادة جلدية بغداد",
  ],
  openGraph: {
    title: "Faya.iq | Premium Beauty & Aesthetic Clinic",
    description:
      "Experience world-class dermatological care and aesthetic treatments in the heart of Iraq.",
    url: "https://faya.iq",
    siteName: "Faya.iq",
    locale: "en_US",
    alternateLocale: "ar_IQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faya.iq | Premium Beauty & Aesthetic Clinic",
    description:
      "Iraq's premier destination for luxury aesthetics.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
