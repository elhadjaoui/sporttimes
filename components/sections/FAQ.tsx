import type { ReactNode } from 'react';

const QUESTIONS: { question: string; answer: ReactNode }[] = [
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
    answer: (
      <>
        Not yet. SPORTTIMES is iOS only for now, and Google Play is coming
        soon.{' '}
        <a
          href="#download"
          className="text-lime underline underline-offset-2"
        >
          Join the waitlist
        </a>{' '}
        and we&apos;ll email you about the launch.
      </>
    ),
  },
  {
    question: 'How do I start a community?',
    answer:
      'Tap +, choose Create Community, give it a name and pick Public or Private. Anyone can join a Public community in one tap. Private communities need your approval.',
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      data-progress-section
      data-progress-label="FAQ"
      data-palette="hero"
      className="relative"
      style={{ padding: 'clamp(6rem, 12vh, 9rem) 0' }}
    >
      <div className="grid-12" data-reveal>
        <div className="col-span-12 xl:col-start-2 xl:col-span-4" data-reveal-child>
          <div className="mono-eyebrow" style={{ marginBottom: 24 }}>
            FAQ
          </div>
          <h2
            className="headline-display"
            style={{
              fontSize: 'clamp(2rem, 4.6vw, 3.4rem)',
              color: 'var(--ink)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              marginBottom: 40,
              maxWidth: '12ch',
            }}
          >
            Questions before kickoff.
          </h2>
        </div>

        <div className="col-span-12 xl:col-span-6" data-reveal-child>
          {QUESTIONS.map(({ question, answer }) => (
            <div
              key={question}
              style={{
                padding: '22px 0',
                borderTop: '1px solid rgba(245, 245, 240, 0.10)',
              }}
            >
              <h3
                className="headline-display"
                style={{
                  fontSize: 19,
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.015em',
                  marginBottom: 8,
                }}
              >
                {question}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body), Inter, system-ui, sans-serif',
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: 'var(--muted)',
                  maxWidth: '58ch',
                }}
              >
                {answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
