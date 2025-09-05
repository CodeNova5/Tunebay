"use client";

import React from "react";

/**

Next.js 13 App Router page component for a Privacy Policy.

Place this file at: /app/privacy/page.tsx


Tailwind CSS classes used. Make sure Tailwind is set up in your project.


Replace placeholders: SITE_NAME, SITE_URL, CONTACT_EMAIL, EFFECTIVE_DATE. */



export default function PrivacyPolicyPage() { const SITE_NAME = "Tunebay";
const SITE_URL = "https://tunebay.vercel.app";
const CONTACT_EMAIL = "codenova02@gmail.com";
const EFFECTIVE_DATE = "September 5, 2025";

return ( <main className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8"> <div className="mx-auto max-w-4xl bg-white p-8 rounded-2xl shadow"> <header className="mb-6"> <h1 className="text-3xl font-extrabold">Privacy Policy</h1> <p className="mt-1 text-sm text-gray-500">Effective date: {EFFECTIVE_DATE}</p> </header>

<section className="prose prose-neutral max-w-none">
      <p>
        Welcome to <strong>{SITE_NAME}</strong> ("we", "us", or "our"). We respect your privacy and are
        committed to protecting the personal information you share with us when you visit {SITE_URL} or use
        our services. This Privacy Policy explains what information we collect, how we use it, and your
        rights in relation to that information.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Personal information you provide</h3>
      <p>
        When you interact with our site you may provide personal information such as your name, email address,
        profile information, and any other data you choose to submit when contacting us, signing up for
        newsletters, or creating an account.
      </p>

      <h3>Automatically collected information</h3>
      <p>
        We automatically collect certain information about your device and usage, such as IP address,
        browser type, operating system, pages viewed, time spent on pages, and referring URLs. This helps us
        analyze trends and improve our services.
      </p>

      <h3>Cookies and tracking technologies</h3>
      <p>
        We use cookies and similar technologies (like local storage and web beacons) to remember your
        preferences, enable certain site features, and analyze usage. You can control cookies via your
        browser settings; however disabling cookies may limit functionality.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide, maintain, and improve our website and services.</li>
        <li>To communicate with you about updates, newsletters, and promotional offers (if you opt in).</li>
        <li>To respond to your inquiries and provide customer support.</li>
        <li>To detect, prevent, and investigate security incidents or fraudulent activity.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>3. Legal Basis for Processing (EEA / UK)</h2>
      <p>
        If you are in the European Economic Area (EEA) or the UK, we process personal data only when we have
        a legal basis to do so, such as your consent, performance of a contract, legal obligation, legitimate
        interests, or other lawful grounds. Where consent is required, you may withdraw it anytime.
      </p>

      <h2>4. Sharing &amp; Disclosure</h2>
      <p>
        We do not sell your personal information. We may share data with trusted third-party service
        providers who perform services on our behalf (e.g., hosting, analytics, email delivery). These
        providers are contractually bound to protect your information and use it only for specified purposes.
      </p>

      <h3>Third-party services</h3>
      <p>
        Our site may use third-party services such as analytics (e.g., Google Analytics), payment processors,
        or social integrations. These services have their own privacy policies — we recommend reviewing them
        to understand how they handle your information.
      </p>

      <h2>5. Cookies &amp; Opt-Out</h2>
      <p>
        We use session and persistent cookies. You can set your browser to refuse cookies or alert you when
        cookies are being sent. To opt out of targeted advertising provided by third parties, visit your ad
        preferences on those platforms or use industry opt-out tools such as the Network Advertising
        Initiative (NAI) or Digital Advertising Alliance (DAA).
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain personal information only as long as necessary to fulfill the purposes described in this
        policy, comply with legal obligations, resolve disputes, and enforce our agreements.
      </p>

      <h2>7. Security</h2>
      <p>
        We implement reasonable administrative, technical, and physical safeguards designed to protect your
        information. No internet transmission is 100% secure; while we strive to protect your data, we cannot
        guarantee absolute security.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Depending on your location, you may have rights such as accessing, correcting, deleting, or
        restricting processing of your personal data. If you are a resident of the EEA/UK or certain U.S.
        states (like California), you may have additional rights under applicable laws. To exercise your
        rights, please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>9. Children’s Privacy</h2>
      <p>
        Our services are not intended for children under 13 (or the applicable age in your jurisdiction). We
        do not knowingly collect personal information from children. If you believe we have collected
        information from a child, please contact us and we will take steps to delete it.
      </p>

      <h2>10. International Transfers</h2>
      <p>
        Your information may be stored and processed in countries other than your own. When transferring
        personal data across borders, we take steps to ensure appropriate safeguards are in place.
      </p>

      <h2>11. Links to Other Sites</h2>
      <p>
        Our website may contain links to other websites not operated by us. We are not responsible for the
        privacy practices of those sites; please review their privacy policies.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make material changes, we will notify you
        by posting the updated policy on this page and updating the effective date.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        If you have questions, concerns, or requests regarding this Privacy Policy, contact us at:
      </p>
      <address>
        <a className="font-medium" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <div className="text-sm text-gray-500">{SITE_NAME} — {SITE_URL}</div>
      </address>

      <hr />
      <p className="text-xs text-gray-500">Last updated: {EFFECTIVE_DATE}</p>
    </section>
  </div>
</main>

); }

