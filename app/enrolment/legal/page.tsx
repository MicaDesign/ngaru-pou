import type { Metadata } from "next";
import Link from "next/link";
import DocPageLayout from "@/components/DocPageLayout";

export const metadata: Metadata = {
  title: "Legal & Privacy | Ngaru Pou Cultural Arts",
  description:
    "Privacy policy, data collection practices, and legal information for Ngaru Pou Cultural Arts Inc.",
};

export default function LegalPrivacyPage() {
  return (
    <DocPageLayout title="Legal & Privacy">
      <p>
        <strong>Ngaru Pou Cultural Arts Inc.</strong> (the
        &quot;Society&quot;, &quot;we&quot;, &quot;us&quot;) is an
        incorporated society registered in Aotearoa New Zealand. This
        page sets out our privacy practices and general legal information
        for members, whānau, and visitors to this website. It is written
        to comply with the{" "}
        <strong>New Zealand Privacy Act 2020</strong> and the thirteen
        Information Privacy Principles (IPPs).
      </p>

      <h2>Who We Are</h2>
      <p>
        Ngaru Pou Cultural Arts Inc. is a kaupapa Māori cultural arts
        society providing Te Ao Haka experiences for tamariki and
        rangatahi. We are governed by our Constitution and a komiti
        elected by members.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We only collect personal information that is necessary for our
        kaupapa. This may include:
      </p>
      <ul>
        <li>
          Names, dates of birth, addresses, phone numbers and email
          addresses of members and their whānau
        </li>
        <li>
          Emergency contacts and relevant medical, dietary or safety
          information needed to care for tamariki during activities
        </li>
        <li>
          Attendance records, fundraising participation, and payment
          records
        </li>
        <li>
          Photographs and video recorded at practices, wānanga,
          performances and events
        </li>
        <li>
          For members of our online learning platform: account details,
          authentication records, lesson progress, and messages submitted
          through the platform
        </li>
        <li>
          Basic technical information when you use this website, such as
          browser type, device, and pages visited, collected via
          analytics tools
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use personal information to:</p>
      <ul>
        <li>
          Administer memberships, fees, attendance, wānanga and
          performances
        </li>
        <li>
          Communicate with whānau about roopu matters, practice changes,
          events and fundraising
        </li>
        <li>
          Keep tamariki safe during Society activities, including
          responding to medical or emergency situations
        </li>
        <li>
          Deliver and improve our online learning platform for enrolled
          students
        </li>
        <li>
          Meet legal and reporting obligations, including those under the
          Incorporated Societies Act 2022
        </li>
      </ul>

      <h2>Sharing Your Information</h2>
      <p>
        We do not sell or trade personal information. We only share
        information where necessary and with appropriate care:
      </p>
      <ul>
        <li>
          <strong>Komiti and tutors</strong> — information needed to run
          the roopu and care for tamariki.
        </li>
        <li>
          <strong>Service providers</strong> — trusted third parties who
          help us operate (for example, our hosting and authentication
          providers for the online platform). These providers are bound
          by their own privacy obligations.
        </li>
        <li>
          <strong>Emergency and medical services</strong> — where there
          is a risk to the life or health of a tamaiti or member.
        </li>
        <li>
          <strong>Legal obligations</strong> — where required by New
          Zealand law.
        </li>
      </ul>
      <p>
        Some of our service providers may store data outside New Zealand.
        Where this occurs, we take reasonable steps to ensure comparable
        protections are in place, in line with IPP 12.
      </p>

      <h2>Storage &amp; Security</h2>
      <p>
        We take reasonable steps to protect personal information from
        loss, unauthorised access, use, modification, or disclosure. This
        includes access controls for komiti-held records, secure password
        handling for online platform accounts, and restricting access to
        photographs and sensitive information to authorised komiti
        members and tutors.
      </p>
      <p>
        Personal information is retained only for as long as it is needed
        for the purposes set out above, or as required by law. Records
        relating to former members are reviewed periodically and
        destroyed when no longer required.
      </p>

      <h2>Your Rights Under the Privacy Act 2020</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>
          <strong>Access</strong> the personal information we hold about
          you or your tamaiti (IPP 6)
        </li>
        <li>
          <strong>Correct</strong> information you believe is inaccurate
          (IPP 7)
        </li>
        <li>
          <strong>Withdraw consent</strong> for certain uses, such as
          being photographed during activities
        </li>
        <li>
          <strong>Raise a concern</strong> about how we have handled your
          information
        </li>
      </ul>
      <p>
        To exercise any of these rights, please contact our Privacy
        Officer (see{" "}
        <a href="#contact">Contact</a> below). If you are not satisfied
        with our response, you may contact the{" "}
        <a
          href="https://www.privacy.org.nz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Office of the Privacy Commissioner
        </a>
        .
      </p>

      <h2>Photography, Video &amp; Social Media</h2>
      <p>
        We capture photos and videos at practices, wānanga, performances
        and events for roopu communication, promotion, and social media.
        By enrolling, whānau consent to this use. If you do not want a
        named tamaiti to be photographed or filmed, please advise the
        Secretary in writing and we will record that preference against
        your registration.
      </p>

      <h2>Cookies &amp; Analytics</h2>
      <p>
        This website uses essential cookies required for authentication
        and site functionality. We also use privacy-respecting analytics
        to understand which pages whānau and members use, so we can
        improve the site. No personal information is sold, and tracking
        is limited to what is necessary to operate and improve the
        service.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        Our kaupapa centres on tamariki. Where information relates to a
        child, it is collected from and accessed by their parent or legal
        guardian. Lesson progress and activity within our online
        platform are visible to the student, their parent or guardian,
        and authorised kaiako (teachers).
      </p>

      <h2>Governing Law</h2>
      <p>
        These notices and any dispute relating to them are governed by
        the laws of New Zealand. The Society operates under the
        Incorporated Societies Act 2022 and the Privacy Act 2020.
      </p>

      <h2>Changes to This Notice</h2>
      <p>
        We may update this page from time to time. The current version
        will always be available here. Material changes will be
        communicated to whānau via our usual channels.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        For privacy requests, corrections, or concerns, please contact
        our Privacy Officer through the Chairperson or Secretary of
        Ngaru Pou Cultural Arts Inc. Komiti contacts are listed on the{" "}
        <Link href="/enrolment/handy-hints">Handy Hints</Link> page.
      </p>
    </DocPageLayout>
  );
}
