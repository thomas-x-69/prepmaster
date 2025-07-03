import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrepMaster - AWS Cloud Practitioner Certification Preparation",
  description:
    "Master the AWS Cloud Practitioner certification with comprehensive practice questions, detailed explanations, and interactive learning. Created by Thomas Ashraf.",
  keywords: [
    "AWS Cloud Practitioner",
    "AWS certification",
    "cloud computing",
    "AWS exam preparation",
    "cloud fundamentals",
    "AWS services",
    "certification practice",
    "exam prep",
    "AWS training",
  ],
  authors: [{ name: "Thomas Ashraf" }],
  creator: "Thomas Ashraf",
  publisher: "Thomas Ashraf",
  openGraph: {
    title: "PrepMaster - AWS Cloud Practitioner Certification Prep",
    description:
      "Master the AWS Cloud Practitioner certification with comprehensive practice questions and interactive learning",
    url: "https://github.com/thomas-x-69/prepmaster",
    siteName: "PrepMaster",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PrepMaster - AWS Cloud Practitioner Certification Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepMaster - AWS Cloud Practitioner Certification Prep",
    description:
      "Master the AWS Cloud Practitioner certification with comprehensive practice questions",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: "width=device-width, initial-scale=1",
  // themeColor: "#f97316",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
