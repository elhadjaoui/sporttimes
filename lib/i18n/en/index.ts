import chrome from './chrome';
import download from './download';
import faq from './faq';
import film from './film';
import footer from './footer';
import hero from './hero';
import howItWorks from './howItWorks';
import problem from './problem';
import roadmap from './roadmap';
import sports from './sports';

const en = {
  chrome,
  hero,
  problem,
  film,
  howItWorks,
  sports,
  roadmap,
  faq,
  download,
  footer,
} as const;

export default en;
