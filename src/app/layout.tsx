import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/navbar/NavBar";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "NXBlogs",
  description: "GDSC project with Google OAuth authentication",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();
  
  return (
    <html lang="en">
      <body>
        <NavBar user={user} />
        <main style={{ paddingTop: '80px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
