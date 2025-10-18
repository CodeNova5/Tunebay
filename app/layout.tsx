import Script from 'next/script';

export default function RootLayout({ children }) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body>
        {isDev && (
          <>
            <Script src="https://cdn.jsdelivr.net/npm/eruda" strategy="afterInteractive" />
            <Script id="eruda-init" strategy="afterInteractive">
              {`eruda.init();`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}