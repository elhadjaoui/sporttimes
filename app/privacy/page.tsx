import Link from 'next/link';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  path: '/privacy',
  title: 'Privacy Policy — SPORTTIMES',
  description:
    'How SPORTTIMES handles your data — communities, matches, and lineups.',
});

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

            className="mono-eyebrow inline-flex items-center gap-2 mb-8"
            style={{ color: 'var(--lime)', letterSpacing: '0.2em' }}
          >
            ← Back to home
          </Link>

          <div className="mono-eyebrow mb-4">Legal · Privacy</div>
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
            Last updated · 9 November 2026. This page describes what SPORTTIMES
            collects, why, how it&rsquo;s stored, and the rights you have over
            your data.
          </p>

          <Section title="1 · What we collect">
            <p>
              When you create a SPORTTIMES account we store the minimum needed
              to run a match: your display name, your email address, the
              communities you join, and the matches you RSVP to. You sign in
              with Apple, Google, or a one-time code sent to your email. If
              you use Sign in with Apple and hide your email, we only see
              Apple&rsquo;s private relay address. We never ask for anything
              we don&rsquo;t need to put you on a pitch.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              We also store a profile photo if you add one, your preferred
              sport, your notification settings, a device token so we can send
              push notifications, and the ratings players give each other
              after a match.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              If you join the waitlist on our website, your email goes into a
              Google Form. We only use it to email you about the launch.
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
            <p style={{ marginTop: '0.75rem' }}>
              We use a few service providers to run SPORTTIMES: Supabase
              (sign-in and file storage), Firebase (push notifications),
              PostHog (product analytics, linked to your account ID), Render
              (app servers), and Vercel (website hosting and visitor
              analytics). Apple and Google handle sign-in if you choose them.
            </p>
          </Section>

          <Section title="4 · Your controls">
            <p>
              Email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{ color: 'var(--lime)', textDecoration: 'underline' }}
              >
                {CONTACT_EMAIL}
              </a>{' '}
              to request a copy of your data. Delete your account at any time
              — we purge your profile within 30 days, keeping only anonymized
              match stats so community averages stay accurate.
            </p>
          </Section>

          <Section title="5 · Security">
            <p>Data at rest is encrypted. Data in transit is TLS 1.3.</p>
          </Section>

          <Section title="6 · Kids">
            <p>
              SPORTTIMES is 13+. We do not knowingly collect data from
              children under 13.
            </p>
          </Section>

          <Section title="7 · Changes">
            <p>
              We&rsquo;ll post changes here and notify you in-app if something
              substantive shifts. Small edits (typos, clarifications) happen
              silently.
            </p>
          </Section>

          <Section title="8 · Contact">
            <p>
              Questions, data requests, or complaints? Write to{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}

                style={{ color: 'var(--lime)', textDecoration: 'underline' }}
              >
                {CONTACT_EMAIL}
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
