// app/layout.tsx
import ErudaClient from './ErudaClient';

export const metadata = {
  title: 'Tunebay',
  description: 'Stream and discover music',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErudaClient />
        {children}
      </body>
    </html>
  );
}