import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — SportTimes',
  description:
    'Terms of use for SportTimes — communities, matches, conduct, and liability.',
};

export default function TermsPage() {
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

          <div className="mono-eyebrow mb-4">[ Legal · Terms ]</div>
          <h1
            className="headline-display uppercase text-ink mb-6"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
            }}
          >
            Terms of service.
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
            Last updated · 21 April 2026. By creating an account, joining a
            community, or RSVPing to a match on SportTimes, you agree to the
            terms below.
          </p>

          <Section title="1 · The app">
            <p>
              SportTimes helps communities organize matches, visualize
              lineups, and coordinate players. We provide the software;
              communities run their own matches. We are not a party to any
              agreement you make with a community or its members.
            </p>
          </Section>

          <Section title="2 · Your account">
            <p>
              You&rsquo;re responsible for the account, the credentials, and
              whatever happens from it. One account per person. No bots, no
              impersonation, no accounts on behalf of minors under 13.
            </p>
          </Section>

          <Section title="3 · Communities">
            <p>
              Public communities are open to anyone. Private communities are
              invite-only; admins have the final word on membership. Admins
              can remove members for conduct reasons. We reserve the right to
              shut down communities that violate these terms.
            </p>
          </Section>

          <Section title="4 · Conduct on pitch + in app">
            <p>
              Show up when you RSVP. Treat other players the way you want to
              be treated. No harassment, no hate speech, no discriminatory
              behavior based on race, gender, religion, sexual orientation,
              or disability — online or on the pitch. Violations result in
              removal from communities and, for repeat offenses, the
              platform.
            </p>
          </Section>

          <Section title="5 · Safety + liability">
            <p>
              Playing sports carries inherent risk. SportTimes is not
              responsible for injuries, disputes between players, venue
              issues, or the quality of any community-organized match. Bring
              the right gear and play smart.
            </p>
          </Section>

          <Section title="6 · Payments">
            <p>
              The core app is free. Optional extras (venue booking, team kit
              store, tournament hosting) may carry fees. Fees, refund terms,
              and supplier contact are shown at checkout.
            </p>
          </Section>

          <Section title="7 · Content you post">
            <p>
              You own what you post — match notes, community descriptions,
              photos. You grant SportTimes a limited license to display and
              distribute that content to the community you shared it with.
              We don&rsquo;t use it outside the app.
            </p>
          </Section>

          <Section title="8 · Termination">
            <p>
              You can delete your account anytime from Settings → Account. We
              can suspend or terminate accounts that violate these terms.
              Deleted accounts lose access immediately; match history inside
              communities is retained (anonymized) so community records stay
              consistent.
            </p>
          </Section>

          <Section title="9 · Changes">
            <p>
              We may update these terms. Material changes are posted here and
              announced in-app 14 days before they take effect. Continued use
              after that counts as acceptance.
            </p>
          </Section>

          <Section title="10 · Contact">
            <p>
              Legal questions, disputes, or account issues? Write to{' '}
              <a
                href="mailto:contact@sporttimes.app"
                data-cursor="hover"
                style={{ color: 'var(--lime)', textDecoration: 'underline' }}
              >
                contact@sporttimes.app
              </a>
              .
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
