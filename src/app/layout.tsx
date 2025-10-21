"use client";

import "../styles/index.scss";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext"; // ✅ Import du contexte global d'auth

const isDev = process.env.NODE_ENV === "development";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning={isDev}>
      <head>
        {/* ✅ Meta SEO & Responsive */}
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="SkillGro - Plateforme d’apprentissage, de cours en ligne et de recrutement intelligent."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* ✅ PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/assets/img/logo/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/assets/img/logo/logo.svg" />

        {/* ✅ Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&display=swap"
        />

        {/* ✅ Title */}
        <title>SkillGro | Learn. Earn. Grow.</title>
      </head>

      <body suppressHydrationWarning={true}>
        {/* ✅ Fournit à toute l'app : Redux + Auth */}
        <Provider store={store}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Provider>

        {/* ✅ Service Worker Registration */}
        <Script id="pwa-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker
                  .register('/sw.js')
                  .then(reg => console.log('✅ Service Worker enregistré :', reg.scope))
                  .catch(err => console.error('❌ Échec SW :', err));
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
