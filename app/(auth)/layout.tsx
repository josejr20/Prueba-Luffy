import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticación - Luffy Streaming',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}