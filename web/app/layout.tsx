import { SITE_DEFAULTS } from "@/lib/constants";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import classNames from "classnames";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_DEFAULTS.title,
  description: SITE_DEFAULTS.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={classNames("max-h-screen overflow-hidden	", inter.className)}
      >
        {children}
      </body>
    </html>
  );
}
