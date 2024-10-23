'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./header.jsx";
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body className={`${inter.className} grid grid-rows-layout min-h-screen`}>
        
          <Header /> {}
          <div className="overflow-auto">
            {children}
          </div>

        
      </body>
    </html>
  );
}
