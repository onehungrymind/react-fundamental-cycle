import type { ReactNode } from "react";
import "./globals.css";
export const metadata = {
  title: "React Fundamental Cycle",
  description: "Learn React by building a master-detail app",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
