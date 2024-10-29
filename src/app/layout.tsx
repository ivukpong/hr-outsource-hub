import type { Metadata } from "next";
import localFont from "next/font/local";
import "react-circular-progressbar/dist/styles.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "GTCO Outsource Hub",
  description: "Built by The Luminaries",
  openGraph: {
    title: "GTCO Outsource Hub", // Optional, but good for consistency
    description: "Built by The Luminaries",
    images: ["/images/og.jpg"],
    type: "website", // Optional: can specify the type of content
    url: "https://hr-outsource-hub.vercel.app/", // Optional: specify the canonical URL
  },
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
        <Toaster
          position="top-right" // You can change this to "bottom-left", etc.
          reverseOrder={false}
          toastOptions={{
            // Default styles for all toasts
            style: {
              padding: "16px",
              fontSize: "16px",
              borderRadius: "8px",
              background: "#1A1A1A", // Dark background by default
              color: "#FFFFFF", // White text by default
            },
            success: {
              duration: 5000,
              style: {
                background: "#4CAF50", // Green background for success
                color: "#FFFFFF", // White text
                border: "1px solid #388E3C",
              },
              iconTheme: {
                primary: "#FFFFFF",
                secondary: "#4CAF50",
              },
            },
            error: {
              duration: 5000,
              style: {
                background: "#F44336", // Red background for errors
                color: "#FFFFFF", // White text
                border: "1px solid #D32F2F",
              },
              iconTheme: {
                primary: "#FFFFFF",
                secondary: "#F44336",
              },
            },
          }}
        />

        {children}
      </body>
    </html>
  );
}
