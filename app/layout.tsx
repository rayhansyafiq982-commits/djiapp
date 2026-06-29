import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = {
  title: "DJI Absensi",
  description: "Sistem Absensi & Manajemen Kinerja Dapur Jamu Ibu",
  manifest: "/manifest.json",
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="theme-color" content="#1a6b3a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin:0, padding:0, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
