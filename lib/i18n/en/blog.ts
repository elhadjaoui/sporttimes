// The blog index, article pages and their share images.
const blog = {
  eyebrow: 'Blog',
  index: {
    // Search result title: 60 characters or fewer.
    title: 'Football guides for players and organisers — SPORTTIMES',
    description:
      'Guides for football players and organisers: how to organise a match, fill a lineup, pick fair teams and keep a group playing every week.',
    heading: 'Guides for players and organisers.',
    lede: 'How to organise a match, fill the lineup and keep your group playing.',
  },
  backToHome: '← Back to home',
  backToBlog: '← Blog',
  published: 'Published {date}',
  updated: 'Updated {date}',
  draft: 'Draft · not on the live site yet',
  // Link to the same article in the other language, written in that language.
  otherLanguage: { label: 'Lire en français →', lang: 'fr' },
  cta: {
    eyebrow: 'Try it',
    heading: 'Organise your next match in the app.',
    body: 'The iOS beta is open now. On Android? Join the waitlist and we’ll email you at launch.',
    joinBeta: 'Join the iOS beta ↗',
    waitlist: 'Join the Android waitlist',
  },
  // Breadcrumb trail in search results.
  breadcrumbHome: 'Home',
  // Lime second line of an article's share image.
  shareKicker: 'sporttimes.app/blog',
  shareAlt: 'A SPORTTIMES guide',
  feedTitle: 'SPORTTIMES blog',
} as const;

export default blog;
