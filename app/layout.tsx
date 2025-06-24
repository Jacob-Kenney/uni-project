import { Lexend, Comfortaa } from "next/font/google";
import Header from "@/components/header";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

// Define fonts
const body = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"]
})
const brand = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"]
})

// Layout template
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${brand.variable} antialiased`}
      >
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
