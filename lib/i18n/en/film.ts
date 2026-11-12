// The launch film: section head, video player and chapter rail.
const film = {
  progressLabel: 'The Film',
  eyebrow: 'the launch film',
  // first and accent never wrap; accent is lime. The component renders a
  // space between middle and accent.
  headline: {
    first: 'Ninety-three',
    middle: ' seconds to',
    accent: 'kick-off.',
  },
  sub: "Find a game. See who's playing. Host your own, or challenge another team. The whole app, start to finish.",
  // Text around the runtime value (e.g. 01:33).
  runtime: { before: 'Runtime ', after: '' },
  youtube: 'Watch on YouTube ↗',
  videoLabel: 'SPORTTIMES launch film',
  poster: {
    // {duration} is a spoken duration (see `duration` below).
    play: 'Play the SPORTTIMES launch film, {duration}',
    replay: 'Replay the SPORTTIMES launch film, {duration}',
    watch: 'Watch the film',
    watchAgain: 'Watch again',
    // {runtime} is the timecode, e.g. 01:33.
    meta: '{runtime} · Sound on',
  },
  controls: {
    play: 'Play',
    pause: 'Pause',
    mute: 'Mute',
    unmute: 'Unmute',
    fullScreen: 'Full screen',
    exitFullScreen: 'Exit full screen',
    seek: 'Seek',
    // Read out on the seek bar; both values are spoken durations.
    seekValue: '{current} of {total}',
  },
  // Spoken durations for screen readers. `one` is used when the count is
  // exactly 1, `other` for every other count.
  duration: {
    minutes: { one: '{count} minute', other: '{count} minutes' },
    // The English text has always read "1 seconds"; kept as is.
    seconds: { one: '{count} seconds', other: '{count} seconds' },
    // Used when there is at least one minute.
    minutesAndSeconds: '{minutes} {seconds}',
  },
  chaptersLabel: 'Film chapters',
  // {time} is the chapter's start, e.g. 00:11.
  playFrom: 'Play from {time}: {title}',
  // Chapter titles, in the same order as CHAPTERS in
  // components/sections/Film.tsx.
  chapters: [
    'Kick-off',
    'Find a match',
    'Host or challenge',
    'Player ratings',
    'Your community',
    'What’s next',
  ],
} as const;

export default film;
