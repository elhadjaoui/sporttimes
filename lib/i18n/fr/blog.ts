import type { Dictionary } from '@/lib/i18n';

// The blog index, article pages and their share images.
const blog: Dictionary['blog'] = {
  eyebrow: 'Blog',
  index: {
    title: 'Guides foot pour joueurs et organisateurs — SPORTTIMES',
    description:
      'Des guides pour les joueurs et les organisateurs : organiser un match de foot, remplir une compo, faire des équipes équilibrées et jouer chaque semaine.',
    heading: 'Des guides pour joueurs et organisateurs.',
    lede: 'Organiser un match, remplir la compo et faire jouer ton groupe chaque semaine.',
  },
  backToHome: '← Retour à l’accueil',
  backToBlog: '← Blog',
  published: 'Publié le {date}',
  updated: 'Mis à jour le {date}',
  draft: 'Brouillon · pas encore sur le site',
  otherLanguage: { label: 'Read in English →', lang: 'en' },
  cta: {
    eyebrow: 'Essaie',
    heading: 'Organise ton prochain match dans l’appli.',
    body: 'La bêta iOS est ouverte. Sur Android ? Inscris-toi sur la liste d’attente et on t’écrit au lancement.',
    joinBeta: 'Rejoindre la bêta iOS ↗',
    waitlist: 'Liste d’attente Android',
  },
  breadcrumbHome: 'Accueil',
  shareKicker: 'sporttimes.app/fr/blog',
  shareAlt: 'Un guide SPORTTIMES',
  feedTitle: 'Blog SPORTTIMES',
};

export default blog;
