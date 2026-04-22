import type { Metadata } from "next";
import Link from "next/link";
import DocPageLayout from "@/components/DocPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Ngaru Pou Cultural Arts",
  description:
    "Terms and conditions for membership and participation in Ngaru Pou Cultural Arts Inc programmes and activities.",
};

export default function TermsOfServicePage() {
  return (
    <DocPageLayout title="Terms Of Service">
      <p>
        These terms of service (&quot;Terms&quot;) govern membership and
        participation in programmes, wānanga, events and activities
        delivered by <strong>Ngaru Pou Cultural Arts Inc.</strong> (the
        &quot;Society&quot;), an incorporated society registered in
        Aotearoa New Zealand. By enrolling a tamaiti, registering as a
        member, or participating in any Society activity, you agree to
        these Terms and to the Society&apos;s Constitution.
      </p>

      <h2>Membership</h2>
      <p>
        Membership is open to rangatahi, tamariki and whānau who wish to
        participate in the kaupapa of the Society. A signed registration
        form is required for each tamaiti, alongside up-to-date emergency
        and medical information. Membership is granted at the discretion
        of the komiti and may be reviewed or revoked where a member
        breaches these Terms, the{" "}
        <Link href="/enrolment/code-of-conduct">Code of Conduct</Link>, or
        the Society&apos;s Constitution.
      </p>
      <p>
        Parents and legal guardians remain responsible for the tamariki in
        their care at all Society activities, except during supervised
        practice sessions where Society tutors are in charge.
      </p>

      <h2>Fees &amp; Payment</h2>
      <p>
        Annual fees contribute toward hall hire, insurance, prizegiving,
        wānanga subsidies, and other operational costs. Current fees are
        published on the{" "}
        <Link href="/enrolment/handy-hints">Handy Hints</Link> page and are
        payable by the end of Term 1 each year.
      </p>
      <ul>
        <li>
          Fees must be paid into the Society&apos;s nominated bank account.
          Payments to any other account will be treated as a kōhā and
          considered unpaid until received correctly.
        </li>
        <li>
          Wānanga and event fees may apply in addition to the annual fee.
          Subsidies may be available for whānau who participate in
          fundraising.
        </li>
        <li>
          The komiti may adjust fees if operating costs change. Reasonable
          notice will be given in advance.
        </li>
        <li>
          Unpaid fees may result in suspension of participation until
          settled. The komiti may arrange payment plans on request.
        </li>
      </ul>

      <h2>Attendance &amp; Participation</h2>
      <p>
        Consistent attendance is expected. Our kaupapa relies on the roopu
        learning together, and absences make it difficult for the whole
        group to progress.
      </p>
      <ul>
        <li>
          100% attendance is the expected standard. Whānau are expected to
          notify a tutor or komiti member of any absence.
        </li>
        <li>
          Attendance below 96% without a valid reason (sickness, pre-agreed
          holidays, significant whānau events such as tangi) may result in
          a member&apos;s position being forfeited.
        </li>
        <li>
          Wānanga attendance is compulsory for all active members.
        </li>
        <li>
          Members confirming attendance at performances and events are
          expected to honour that commitment. Late cancellations disrupt
          the preparation of the whole roopu.
        </li>
      </ul>

      <h2>Conduct</h2>
      <p>
        All members, parents and caregivers must abide by the Society&apos;s{" "}
        <Link href="/enrolment/code-of-conduct">Code of Conduct</Link> and{" "}
        <Link href="/enrolment/uniform-regulations">Uniform Regulations</Link>.
        Breaches may be addressed by the komiti under the Society&apos;s
        Constitution, up to and including removal from the roopu.
      </p>

      <h2>Cancellation, Withdrawal &amp; Refunds</h2>
      <p>
        Members may withdraw from the roopu at any time by notifying the
        Secretary or Chairperson in writing.
      </p>
      <ul>
        <li>
          Annual fees are generally non-refundable once the year has
          commenced, as they are allocated to upfront operational costs.
        </li>
        <li>
          Event or wānanga fees may be refundable in part where the Society
          has not yet committed funds for that activity. Requests will be
          considered by the komiti on a case-by-case basis.
        </li>
        <li>
          Uniform and equipment costs already incurred by the Society are
          non-refundable.
        </li>
        <li>
          The Society reserves the right to cancel, postpone or modify any
          practice, wānanga or performance where necessary (for example,
          due to weather, venue availability, or safety concerns).
        </li>
      </ul>

      <h2>Media &amp; Photography</h2>
      <p>
        The Society may take photographs and videos of practices,
        performances and events for the purposes of roopu communication,
        promotion, and social media. By registering, whānau consent to
        this use unless written notice is provided to the Secretary
        requesting that a named tamaiti not be photographed or filmed.
      </p>

      <h2>Liability</h2>
      <p>
        Participation in cultural performance, including the use of rakau,
        taiaha and poi, carries inherent physical risk. The Society takes
        reasonable steps to provide a safe environment and to supervise
        tamariki during Society activities. To the extent permitted by
        law, Ngaru Pou Cultural Arts Inc., its komiti, tutors and
        volunteers are not liable for personal injury, illness, loss or
        damage to personal property arising from participation, other
        than as required under the Accident Compensation Act 2001 or
        other applicable New Zealand legislation. Nothing in these Terms
        limits rights a consumer has under the Consumer Guarantees Act
        1993 where that Act applies.
      </p>
      <p>
        Whānau are responsible for disclosing any medical conditions,
        allergies or safety considerations that may affect a member&apos;s
        participation.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        The komiti may update these Terms from time to time. The current
        version will always be available on this website, and material
        changes will be communicated to whānau via our usual channels.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms should be directed to the
        Chairperson or Secretary of Ngaru Pou Cultural Arts Inc. Komiti
        contacts are listed on the{" "}
        <Link href="/enrolment/handy-hints">Handy Hints</Link> page.
      </p>
    </DocPageLayout>
  );
}
