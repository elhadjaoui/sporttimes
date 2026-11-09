'use client';

import MagneticButton from '@/components/ui/MagneticButton';
import { trackBetaClick, type BetaButtonLocation } from '@/lib/analytics';
import { BETA_PATH } from '@/lib/site';

export default function BetaButton({
  location,
  variant = 'primary',
}: {
  location: BetaButtonLocation;
  variant?: 'primary' | 'ghost';
}) {
  // MagneticButton's onClick cancels the navigation, so the click is
  // recorded on a layout-neutral wrapper instead.
  return (
    <span style={{ display: 'contents' }} onClick={() => trackBetaClick(location)}>
      <MagneticButton href={BETA_PATH} variant={variant}>
        Join the iOS beta ↗
      </MagneticButton>
    </span>
  );
}
