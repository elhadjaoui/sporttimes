// {count} is the unread count, one number (UNREAD_COUNT in
// components/sections/Problem.tsx) shared by the banner, the header and
// the Messages stat, so they always agree.
const problem = {
  progressLabel: 'The Problem',
  eyebrow: 'the problem',
  headline: {
    before: 'Matches die in the ',
    accent: 'chat',
    after: ', not on the pitch.',
  },
  sub: "Group chats weren't built for this. Drag to see what should have been there.",
  // The calm side: the confirmed lineup.
  calm: {
    eyebrow: 'the sporttimes way',
    title: '11/11 in seconds.',
    sub: "See who's playing. See the lineup fill. Show up.",
    confirmed: 'match confirmed',
    count: '11/11',
    details: {
      when: { label: 'when', value: 'Sunday · 18:30' },
      where: { label: 'where', value: 'East Field' },
      format: { label: 'format', value: '4-3-3 · 11v11' },
    },
    screenshotAlt:
      'A SPORTTIMES match screen showing the host, kick-off details and a lineup with 19 of 22 players.',
  },
  // The chaos side: the fake group chat.
  chaos: {
    eyebrow: 'the group chat way',
    title: '{count} messages. No lineup.',
    sub: 'Plans live inside threads nobody can actually read.',
    groupInitials: 'UG',
    groupName: 'United Group',
    groupStatus: '{count} unread · still no lineup',
    today: 'TODAY',
    // Sender shown as a phone number (not in contacts).
    unknownSender: '+212 6…',
    // One per MESSAGES entry in Problem.tsx, in the same order.
    messages: [
      "who's in tonight??",
      'thought it was Friday now',
      "can't make it sorry 🙏",
      'cancelled?',
      '+3?',
      '🤷',
      'who is captain again',
      'still need 2 ppl ⚠️',
      'east field or south?',
      'wait — is it on?',
    ],
    composer: 'Type a message…',
  },
  sliderLabel: 'Reveal the calm by dragging the handle',
  statsLabel: 'Before vs after at a glance',
  // Keyed by stat id (STAT_IDS in Problem.tsx).
  stats: {
    messages: { label: 'Messages', before: '{count} unread', after: '0' },
    lineup: { label: 'Lineup', before: 'unknown', after: '11 / 11' },
    organizers: { label: 'Organizers', before: 'exhausted', after: 'hands-free' },
  },
} as const;

export default problem;
