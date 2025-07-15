import { Lexend, Comfortaa } from "next/font/google";
import Header from "@/components/header";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

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
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <title>Greenleaf | Environmentally friendly job board</title>
      </head>
      <body
        className={`${body.variable} ${brand.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
