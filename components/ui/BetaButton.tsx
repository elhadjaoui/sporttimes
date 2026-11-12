'use client';

import MagneticButton from '@/components/ui/MagneticButton';
import { trackBetaClick, type BetaButtonLocation } from '@/lib/analytics';
import { BETA_PATH } from '@/lib/site';

// The English label serves the pages that only exist in English; the
// homepage passes its own language's label.
export default function BetaButton({
  location,
  variant = 'primary',
  label = 'Join the iOS beta ↗',
}: {
  location: BetaButtonLocation;
  variant?: 'primary' | 'ghost';
  label?: string;
}) {
  // MagneticButton's onClick cancels the navigation, so the click is
  // recorded on a layout-neutral wrapper instead.
  return (
    <span style={{ display: 'contents' }} onClick={() => trackBetaClick(location)}>
      <MagneticButton href={BETA_PATH} variant={variant}>
        {label}
      </MagneticButton>
    </span>
  );
}
