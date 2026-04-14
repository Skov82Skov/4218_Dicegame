import './globals.css';
import React from 'react';

export const metadata = {
  title: '4218',
  description: 'Sprint 1 starter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
