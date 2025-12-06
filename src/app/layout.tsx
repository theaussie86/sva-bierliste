import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { Header } from "@/components/layout/Header";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "SVA Bierliste",
  description: "Getränkemanagement für den SVA",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${roboto.variable} font-sans antialiased min-h-screen flex flex-col bg-sva-light text-sva-dark`}
      >
        <ServiceWorkerRegister />
        <Header />
        <main className="flex-1">
            {children}
        </main>
      </body>
    </html>
  );
}
