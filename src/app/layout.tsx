'use client';

import { DM_Sans, Sora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ClaimsProvider } from '@/context/ClaimsContext';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: '800',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>ClaimPilot — AI-Powered Claims</title>
        <meta name="description" content="AI-powered car insurance claims experience" />
      </head>
      <body className={`${dmSans.variable} ${sora.variable} font-sans antialiased`}>
        <AuthProvider>
          <ClaimsProvider>
            {children}
          </ClaimsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
