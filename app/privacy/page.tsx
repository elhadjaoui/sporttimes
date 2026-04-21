import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — SportTimes',
  description:
    'How SportTimes handles your data — communities, matches, lineups, and messages.',
};

export default function PrivacyPage() {
  return (
    <main
      className="relative w-full"
      data-palette="hero"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(7rem, 12vh, 10rem)',
        paddingBottom: 'clamp(4rem, 8vh, 7rem)',
      }}
    >
      <div className="grid-12 relative z-[5]">
        <div className="col-span-12 md:col-start-2 md:col-span-8">
          <Link
            href="/"
            data-cursor="hover"
            className="mono-eyebrow inline-flex items-center gap-2 mb-8"
            style={{ color: 'var(--lime)', letterSpacing: '0.2em' }}
          >
            ← Back to home
          </Link>

          <div className="mono-eyebrow mb-4">[ Legal · Privacy ]</div>
          <h1
            className="headline-display uppercase text-ink mb-6"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
            }}
          >
            Privacy policy.
          </h1>
          <p
            className="font-body mb-12"
            style={{
              color: 'rgba(245,245,240,0.6)',
              fontSize: 15,
              lineHeight: 1.5,
              maxWidth: '62ch',
            }}
          >
            Last updated · 21 April 2026. This page describes what SportTimes
            collects, why, how it&rsquo;s stored, and the rights you have over
            your data.
          </p>

          <Section title="1 · What we collect">
            <p>
              When you create a SportTimes account we store the minimum needed
              to run a match: display name, phone number or email, the
              communities you join, and the matches you RSVP to. We never ask
              for anything we don&rsquo;t need to put you on a pitch.
            </p>
          </Section>

          <Section title="2 · How we use it">
            <p>
              Your data drives three things: finding you matches, filling
              rosters fairly, and keeping your community organizers in the
              loop. We do not sell it, rent it, or ship it to ad networks.
            </p>
          </Section>

          <Section title="3 · Who sees what">
            <p>
              Other community members see your display name, your RSVP
              status, and your position on the lineup. Admins of a private
              community see an extended view (joined date, match history
              inside that community). You can leave a community at any time
              to revoke that view.
            </p>
          </Section>

          <Section title="4 · Messages + match chat">
            <p>
              Match-chat threads are scoped to a single match and archived
              after full time. We keep a 30-day rolling window for dispute
              resolution (no-shows, scheduling conflicts) and then delete.
            </p>
          </Section>

          <Section title="5 · Your controls">
            <p>
              Export your data from Settings → Data. Delete your account at
              any time — we purge your profile within 30 days, keeping only
              anonymized match stats so community averages stay accurate.
            </p>
          </Section>

          <Section title="6 · Security">
            <p>
              Data at rest is encrypted. Data in transit is TLS 1.3. Phone
              numbers and emails are stored with one-way salted hashes where
              the app doesn&rsquo;t need the plaintext.
            </p>
          </Section>

          <Section title="7 · Kids">
            <p>
              SportTimes is 13+. School-team communities require an admin who
              is 18+ to vouch for younger members. We do not knowingly
              collect data from children under 13.
            </p>
          </Section>

          <Section title="8 · Changes">
            <p>
              We&rsquo;ll post changes here and notify you in-app if something
              substantive shifts. Small edits (typos, clarifications) happen
              silently.
            </p>
          </Section>

          <Section title="9 · Contact">
            <p>
              Questions, data requests, or complaints? Write to{' '}
              <a
                href="mailto:contact@sporttimes.app"
                data-cursor="hover"
                style={{ color: 'var(--lime)', textDecoration: 'underline' }}
              >
                contact@sporttimes.app
              </a>
              . We answer within 2 business days.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: '2.25rem' }}>
      <h2
        className="headline-display uppercase text-ink"
        style={{
          fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)',
          letterSpacing: '-0.015em',
          marginBottom: '0.65rem',
        }}
      >
        {title}
      </h2>
      <div
        className="font-body"
        style={{
          color: 'rgba(245,245,240,0.72)',
          fontSize: 15,
          lineHeight: 1.6,
          maxWidth: '64ch',
        }}
      >
        {children}
      </div>
    </section>
  );
}
