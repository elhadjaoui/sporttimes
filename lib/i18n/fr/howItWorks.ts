import type { Dictionary } from '@/lib/i18n';

const howItWorks: Dictionary['howItWorks'] = {
  progressLabel: 'Comment ça marche',
  stepLabel: 'étape 0{n} — 03',
  steps: [
    {
      head: 'Ouvre ta communauté.',
      sub: 'Campus, ville, club, boulot — trouve l’équipe avec qui tu joues vraiment.',
      alt: 'Une page communauté SPORTTIMES montrant des équipes proches, avec des badges public et privé.',
    },
    {
      head: 'La compo se forme.',
      sub: 'Les postes se prennent en temps réel — qui joue, et où.',
      alt: 'Une compo en direct dans l’app SPORTTIMES, qui se remplit en 4-3-3.',
    },
    {
      head: 'Confirmé.',
      sub: 'Un clic. Le capitaine valide. Sois au bon terrain, à la bonne heure.',
      alt: 'Un profil joueur dans l’app SPORTTIMES, avec la place confirmée et les infos du match.',
    },
  ],
  srHeading: '{num}. {head} {sub}',
  chips: [
    { eyebrow: 'Demande', title: 'Acceptée' },
    // DG = défenseur gauche (LB in English).
    { eyebrow: 'Place prise', title: 'Karim · DG' },
    { eyebrow: 'Tu joues', title: 'Confirmé' },
  ],
  ticked: '{title} ✓',
  counter: { eyebrow: 'compo', of: '/11' },
  mobile: {
    eyebrow: 'comment ça marche',
    heading: 'Du groupe au onze confirmé.',
  },
  reducedMotion: {
    heading: 'Tu es dans la compo.',
    body: 'Un clic. Le capitaine valide. Ta photo apparaît dans la compo et tu arrives prêt à jouer.',
  },
};

export default howItWorks;
