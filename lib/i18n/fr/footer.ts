// [REVIEW] Draft French copy: the founder reviews it before it ships.
import type { Dictionary } from '@/lib/i18n';

const footer: Dictionary['footer'] = {
  progressLabel: 'Pied de page',
  tagline: 'Vois la compo · Rejoins le match',
  social: {
    Instagram: 'Instagram',
    TikTok: 'TikTok',
    YouTube: 'YouTube — bientôt',
  },
  soon: 'bientôt',
  playMore: {
    label: 'Joue plus.',
    lines: ['Joue', 'plus.'],
  },
  eyebrow: 'Le match avant le match · {year}',
  stats: {
    live: 'Sport dispo',
    soon: 'Bientôt',
    ahead: 'Matchs à venir',
  },
  joinBeta: 'Rejoins la bêta ↗',
  copyright: '© {year} SPORTTIMES',
  // Both pages exist in English only.
  links: {
    privacy: 'Confidentialité',
    terms: 'Conditions',
  },
  email: {
    copyLabel: 'Copier {email}',
    copied: 'Copié !',
    clickToCopy: 'Clique pour copier',
  },
};

export default footer;
