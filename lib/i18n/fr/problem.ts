import type { Dictionary } from '@/lib/i18n';

const problem: Dictionary['problem'] = {
  progressLabel: 'Le problème',
  eyebrow: 'le problème',
  headline: {
    before: 'Les matchs meurent dans le ',
    accent: 'groupe',
    after: ', pas sur le terrain.',
  },
  sub: 'Les groupes de discussion n’ont pas été faits pour ça. Fais glisser pour voir ce qui aurait dû être là.',
  calm: {
    eyebrow: 'la méthode sporttimes',
    title: '11/11 en quelques secondes.',
    sub: 'Vois qui joue. Regarde la compo se remplir. Sois là.',
    confirmed: 'match confirmé',
    count: '11/11',
    details: {
      when: { label: 'quand', value: 'Dimanche · 18h30' },
      where: { label: 'où', value: 'Terrain Est' },
      format: { label: 'format', value: '4-3-3 · 11v11' },
    },
    screenshotAlt:
      'Un écran de match SPORTTIMES montrant l’organisateur, les infos du coup d’envoi et une compo de 19 joueurs sur 22.',
  },
  chaos: {
    eyebrow: 'la méthode du groupe',
    title: '{count} messages. Pas de compo.',
    sub: 'Les plans se perdent dans des fils que personne n’arrive vraiment à lire.',
    groupInitials: 'UG',
    groupName: 'United Group',
    groupStatus: '{count} non lus · toujours pas de compo',
    today: 'AUJOURD’HUI',
    unknownSender: '+212 6…',
    // Casual chat messages, same order as the English ones.
    messages: [
      'qui est chaud ce soir ??',
      'je croyais que c’était vendredi maintenant',
      'je peux pas venir dsl 🙏',
      'annulé ?',
      '+3 ?',
      '🤷',
      'c’est qui le capitaine déjà',
      'il manque encore 2 joueurs ⚠️',
      'terrain est ou sud ?',
      'attends — ça tient toujours ?',
    ],
    composer: 'Écris un message…',
  },
  sliderLabel: 'Révèle le calme en faisant glisser la poignée',
  statsLabel: 'Avant et après en un coup d’œil',
  stats: {
    messages: { label: 'Messages', before: '{count} non lus', after: '0' },
    lineup: { label: 'Compo', before: 'inconnue', after: '11 / 11' },
    organizers: {
      label: 'Organisateurs',
      before: 'épuisés',
      after: 'tranquilles',
    },
  },
};

export default problem;
