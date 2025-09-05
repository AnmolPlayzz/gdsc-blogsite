import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GDSC Project",
  description: "GDSC project with Google OAuth authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
