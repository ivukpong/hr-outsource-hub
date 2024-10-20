import type { Metadata } from "next";
import localFont from "next/font/local";
import "react-circular-progressbar/dist/styles.css";
import "./globals.css";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "GTCO Outsource Hub",
  description: "Built by The Luminaries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        ></link>
        <link rel="icon" type="image/png" href="/images/logo.png" />
      </head>
      <body
        className={`${satoshi.className} antialiased text-dark dark:text-white`}
      >
        <div id="modal-root"></div>
        {children}
      </body>
    </html>
  );
}
