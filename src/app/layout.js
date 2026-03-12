import './globals.css'

export const metadata = {
  title: 'Boostly by M. Szewczyk - Popeyes Standards',
  description: 'Aplikacja zawierająca standardy pracy w sieci restauracji Popeyes',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#F57C00',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Preload images for instant display */}
        <link rel="preload" as="image" href="/boostly-logo.png" />
        <link rel="preload" as="image" href="/popeyes-logo.png" />
        <link rel="preload" as="image" href="/popeyes-white-logo.png" />
        <link rel="preload" as="image" href="/popeyes-full-logo.png" />
        <link rel="preload" as="image" href="/bk-logo.png" />
        <link rel="preload" as="image" href="/rc-logo.png" />
        <link rel="preload" as="image" href="/rc-full-logo.png" />
        <link rel="preload" as="image" href="/doc-lines-icon.png" />
        <link rel="preload" as="image" href="/catalog-tree-icon.png" />
      </head>
      <body className="bg-background min-h-screen">
        {children}
      </body>
    </html>
  )
}
