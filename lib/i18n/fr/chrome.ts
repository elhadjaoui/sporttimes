// [REVIEW] Draft French copy: the founder reviews it before it ships.
import { APP_NAME_DISPLAY } from '@/lib/constants';
import type { Dictionary } from '@/lib/i18n';
import { LAUNCH_LABEL_FR } from '@/lib/site';

const chrome: Dictionary['chrome'] = {
  homeLabel: `${APP_NAME_DISPLAY} — accueil`,
  menu: 'Menu',
  close: 'Fermer',
  navigation: 'Navigation · {count} chapitres',
  defaultTagline: 'Choisis un chapitre.',
  nowShowing: 'À l’affiche',
  madeIn: 'Fait à Ben Guerir',
  launchStatus: `Lancement public ${LAUNCH_LABEL_FR} · bêta iOS ouverte`,
  chapterRange: 'Chapitres · 01 — {count}',
  pressEsc: { before: 'Appuie sur ', key: 'Échap', after: ' pour fermer' },
  chapters: {
    problem: {
      name: 'LE PROBLÈME',
      tagline: 'Ce ne sont pas les joueurs. C’est le groupe.',
    },
    'how-it-works': {
      name: 'LE PRINCIPE',
      tagline: 'Ouvre. Regarde. Confirmé.',
    },
    sports: {
      name: 'LES SPORTS',
      tagline: 'Un seul moteur, tous les sports collectifs.',
    },
    'roadmap-features': {
      name: 'À VENIR',
      tagline: 'Bientôt sur le terrain.',
    },
    download: {
      name: 'LISTE D’ATTENTE',
      tagline: 'Sois le premier sur le terrain.',
    },
  },
};

export default chrome;
