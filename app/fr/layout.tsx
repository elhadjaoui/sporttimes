import RootShell from '@/components/ui/RootShell';

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootShell locale="fr">{children}</RootShell>;
}
