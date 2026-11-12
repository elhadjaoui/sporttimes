// The FAQ (components/sections/FAQ.tsx). Answers quote the app's own
// labels (Join Match, Team vs Team, +, Create Community, Public, Private).
// Keep those as the app shows them.
const faq = {
  progressLabel: 'FAQ',
  eyebrow: 'FAQ',
  headline: 'Questions before kickoff.',
  // In display order.
  questions: [
    {
      question: 'Is it free?',
      answer: 'The core app is free.',
    },
    {
      question: 'Which sports can I play?',
      answer:
        'Football is live today. Basketball, volleyball, handball, padel, futsal and rugby are coming soon.',
    },
    {
      question: 'How do I join a match?',
      answer:
        "Join the community, open the match and see the lineup. Tap Join Match. Once the host accepts, you're in.",
    },
    {
      question: 'How do captains approve players?',
      answer:
        "The match host gets your request and accepts or declines it. In Team vs Team matches, a team's captain challenges for the whole team, and the host accepts or declines the challenge.",
    },
    {
      question: 'Is it on Android?',
      // The link goes to the waitlist. A space sits on each side of it.
      answer: {
        before:
          'Not yet. SPORTTIMES is iOS only for now, and Google Play is coming soon.',
        link: 'Join the waitlist',
        after: "and we'll email you about the launch.",
      },
    },
    {
      question: 'How do I start a community?',
      answer:
        'Tap +, choose Create Community, give it a name and pick Public or Private. Anyone can join a Public community in one tap. Private communities need your approval.',
    },
  ],
} as const;

export default faq;
