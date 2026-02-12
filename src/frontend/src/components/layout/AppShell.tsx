import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export default function AppShell({ children, className = '' }: AppShellProps) {
  return (
    <div className={`container max-w-2xl mx-auto px-4 py-6 ${className}`}>
      {children}
    </div>
  );
}

