import type { Dictionary } from '@/lib/i18n';
import { LAUNCH_LABEL_FR } from '@/lib/site';

const download: Dictionary['download'] = {
  progressLabel: 'Sois prévenu',
  screenshotAlt: 'Une vue jour de match SPORTTIMES avec ta compo confirmée',
  eyebrow: 'Sois prévenu',
  headline: 'Sois le premier sur le terrain.',
  intro: `La bêta iOS est ouverte. Le lancement public est prévu au ${LAUNCH_LABEL_FR}. Laisse ton e-mail et on t’enverra un seul message le jour du lancement.`,
  waitlist: {
    label: 'Ton e-mail',
    placeholder: 'ton@email.com',
    cta: 'Rejoins la liste d’attente',
    submitting: 'Envoi…',
    success: 'Tu es sur la liste. On t’écrit dès l’ouverture.',
    invalid: 'Ça ne ressemble pas à un e-mail.',
    error: 'Oups, ça n’a pas marché. Tu réessaies ?',
  },
  emailNote: 'On t’écrira seulement pour le lancement.',
  launch: `Lancement public · ${LAUNCH_LABEL_FR}`,
  badges: {
    appStore: {
      label: `App Store — ${LAUNCH_LABEL_FR}`,
      status: LAUNCH_LABEL_FR,
    },
    googlePlay: { label: 'Google Play — bientôt', status: 'Bientôt' },
  },
};

export default download;
