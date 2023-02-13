import AppProviders from "~/providers";
import { Inter } from "@next/font/google";
import "./globals.css";
import Navbar from "./navbar";
import Footer from "./footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-base" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <AppProviders>
          <Navbar />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
