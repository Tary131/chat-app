import { Toaster } from '@/components/ui/toaster';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Toaster />
    </>
  );
}
