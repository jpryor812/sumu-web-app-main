import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://getsumu.xyz'),
  title: {
    default: "Sumu | Create Together, Grow Together.",
    template: "%s | Sumu"
  },
  description: "Sumu is a premium content platform for creators with the lowest platform fees, no transaction fees, and rewards in real money or ownership in Sumu itself!",
  keywords: [
    'creator platform',
    'content monetization',
    'creator economy',
    'platform fees',
    'creator rewards',
    'digital content',
    'content creators',
    'Sumu platform'
  ],
  authors: [{ name: 'Sumu Team' }],
  creator: 'Sumu',
  publisher: 'Sumu',
  icons: {
    icon: [
      { url: "/sumu-vert-square.png" },
      { url: "/sumu-vert-square.png", type: "image/png" },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'Sumu',
    title: 'Sumu | Create Together, Grow Together',
    description: 'Join the first creator platform where every creator is rewarded for the success of all creators. Industry-low 4.9% fees.',
    url: 'https://getsumu.xyz',
    images: [{
      url: 'https://getsumu.xyz/social-share-page.png',  // Your optimized sharing image
      width: 1200,
      height: 630,
      alt: 'Sumu - Create Together, Grow Together',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sumu | Create Together, Grow Together',
    description: 'Join the first creator platform where every creator is rewarded for the success of all creators.',
    creator: '@get_sumu',
    images: ['https://getsumu.xyz/social-share-page.png'], // Your optimized Twitter image
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://getsumu.xyz',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
