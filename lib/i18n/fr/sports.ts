// [REVIEW] Draft French copy: the founder reviews it before it ships.
import type { Dictionary } from '@/lib/i18n';

const sports: Dictionary['sports'] = {
  progressLabel: 'Les sports',
  eyebrow: 'un seul moteur',
  headlines: ['Conçu pour le foot.', 'Prêt pour tous les sports collectifs.'],
  headlineCombined: 'Conçu pour le foot. Prêt pour tous les sports collectifs.',
  sub: 'Du futsal à cinq au championnat à onze. Un seul moteur pour tous les sports collectifs.',
  engineLabel: 'moteur',
  engineSpec: ['création de compo', 'planning', 'check-in', 'synchro en direct'],
  status: { live: 'Dispo', soon: 'Bientôt' },
  logoAlt: 'SPORTTIMES',
  items: {
    football: { name: 'Football', formats: '5v5 · 7v7 · 9v9 · 11v11' },
    basketball: { name: 'Basket', formats: '3v3 · 5v5' },
    volleyball: { name: 'Volley', formats: '4v4 · 6v6' },
    handball: { name: 'Handball', formats: '7v7' },
    padel: { name: 'Padel', formats: '2v2' },
    futsal: { name: 'Futsal', formats: '5v5' },
    rugby: { name: 'Rugby', formats: 'à 7 · à 15' },
  },
};

export default sports;
