'use client';
import { PracticeProvider } from './context/PracticeContext';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PracticeProvider>
      {children}
    </PracticeProvider>
  );
}
