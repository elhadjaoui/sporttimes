import RootShell from '@/components/ui/RootShell';

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootShell lang="en">{children}</RootShell>;
}
