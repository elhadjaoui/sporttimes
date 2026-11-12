// [REVIEW] Draft French copy: the founder reviews it before it ships.
// No dates: nothing here may promise a release the app hasn't scheduled.
import type { Dictionary } from '@/lib/i18n';

const roadmap: Dictionary['roadmap'] = {
  progressLabel: 'À venir',
  eyebrow: 'Feuille de route',
  headline: { before: '', accent: 'Bientôt', after: ' sur le terrain.' },
  magnetLabel: 'Détails : {name}',
  tooltipMeta: '{seq} · {status}',
  cardMeta: { before: '{seq} · ', after: '' },
  features: {
    'more-sports': {
      name: 'Plus de sports',
      status: 'Bientôt',
      summary: 'Le catalogue grandit avec la communauté.',
      bullets: [
        'Le foot est dispo aujourd’hui',
        'Six autres sports annoncés pour bientôt',
        'Basket, Volley, Handball, Padel, Futsal, Rugby',
        'Le même moteur de compo, tous les formats',
      ],
      statusNote: 'Pas encore de dates.',
    },
    tournaments: {
      name: 'Tournois',
      status: 'Prévu',
      summary:
        'Organise des tournois complets dans ta communauté — sans tableur.',
      bullets: [
        'Élimination directe, double élimination, poules',
        'Têtes de série selon l’historique des matchs',
        'Tableau en direct, visible par tous',
        'Affiche de finale à partager',
      ],
      statusNote: 'Pas encore de date.',
    },
    'match-chat': {
      name: 'Chat du match',
      status: 'Prévu',
      summary:
        'Une discussion pour un seul match — elle se tait au coup de sifflet final.',
      bullets: [
        'S’ouvre dès que le match est créé',
        'S’archive après le coup de sifflet final',
        'Désistements et confirmations en direct',
        'Fini les groupes qui envahissent ta vie',
      ],
      statusNote: 'Pas encore de date.',
    },
  },
  laterLabel: 'Plus tard',
  later: [
    'Créateur de match IA',
    'Capitaine IA',
    'Boutique SPORTTIMES',
    'Réservation de terrain',
  ],
};

export default roadmap;
