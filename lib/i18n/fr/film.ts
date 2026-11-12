// [REVIEW] Draft French copy: the founder reviews it before it ships.
import type { Dictionary } from '@/lib/i18n';

const film: Dictionary['film'] = {
  progressLabel: 'Le film',
  eyebrow: 'le film de lancement',
  // Digits, not "Quatre-vingt-treize": the first part never wraps and the
  // spelled-out number is too wide for the column.
  headline: {
    first: '93',
    middle: ' secondes avant le',
    accent: 'coup d’envoi.',
  },
  sub: 'Trouve un match. Vois qui joue. Organise le tien, ou défie une autre équipe. Toute l’app, du début à la fin.',
  runtime: { before: 'Durée ', after: '' },
  youtube: 'Voir sur YouTube ↗',
  videoLabel: 'Film de lancement SPORTTIMES',
  poster: {
    play: 'Lire le film de lancement SPORTTIMES, {duration}',
    replay: 'Revoir le film de lancement SPORTTIMES, {duration}',
    watch: 'Voir le film',
    watchAgain: 'Revoir le film',
    meta: '{runtime} · Son activé',
  },
  controls: {
    play: 'Lecture',
    pause: 'Pause',
    mute: 'Couper le son',
    unmute: 'Activer le son',
    fullScreen: 'Plein écran',
    exitFullScreen: 'Quitter le plein écran',
    seek: 'Position dans le film',
    seekValue: '{current} sur {total}',
  },
  duration: {
    minutes: { one: '{count} minute', other: '{count} minutes' },
    seconds: { one: '{count} seconde', other: '{count} secondes' },
    minutesAndSeconds: '{minutes} et {seconds}',
  },
  chaptersLabel: 'Chapitres du film',
  playFrom: 'Lire à partir de {time} : {title}',
  chapters: [
    'Coup d’envoi',
    'Trouver un match',
    'Organiser ou défier',
    'Notes des joueurs',
    'Ta communauté',
    'La suite',
  ],
};

export default film;
