import './globals.css';

export const metadata = {
  title: 'LibreTranslate',
  description: 'A Dokploy-ready Next.js translation app powered by LibreTranslate-compatible APIs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
