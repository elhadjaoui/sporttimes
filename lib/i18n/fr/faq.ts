// [REVIEW] Draft French copy: the founder reviews it before it ships.
// The app itself is in English, so its labels (Join Match, Team vs Team,
// +, Create Community, Public, Private) are quoted as the app shows them.
import type { Dictionary } from '@/lib/i18n';

const faq: Dictionary['faq'] = {
  progressLabel: 'FAQ',
  eyebrow: 'FAQ',
  headline: 'Questions avant le coup d’envoi.',
  questions: [
    {
      question: 'C’est gratuit ?',
      answer: 'L’app de base est gratuite.',
    },
    {
      question: 'À quels sports je peux jouer ?',
      answer:
        'Le foot est dispo aujourd’hui. Le basket, le volley, le handball, le padel, le futsal et le rugby arrivent bientôt.',
    },
    {
      question: 'Comment je rejoins un match ?',
      answer:
        'Rejoins la communauté, ouvre le match et regarde la compo. Appuie sur « Join Match ». Dès que l’organisateur accepte, tu es dans le match.',
    },
    {
      question: 'Comment les capitaines acceptent les joueurs ?',
      answer:
        'L’organisateur du match reçoit ta demande, puis l’accepte ou la refuse. Dans les matchs « Team vs Team », le capitaine d’une équipe lance le défi pour toute son équipe, et l’organisateur accepte ou refuse le défi.',
    },
    {
      question: 'C’est dispo sur Android ?',
      // A space sits on each side of the link.
      answer: {
        before:
          'Pas encore. SPORTTIMES est uniquement sur iOS pour l’instant, et Google Play arrive bientôt.',
        link: 'Rejoins la liste d’attente',
        after: 'et on t’envoie un e-mail au lancement.',
      },
    },
    {
      question: 'Comment je crée une communauté ?',
      answer:
        'Appuie sur +, choisis « Create Community », donne-lui un nom et choisis « Public » ou « Private ». Tout le monde peut rejoindre une communauté publique en un clic. Les communautés privées ont besoin de ton accord.',
    },
  ],
};

export default faq;
