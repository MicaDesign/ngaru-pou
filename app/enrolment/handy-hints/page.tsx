import type { Metadata } from "next";
import Link from "next/link";
import DocPageLayout from "@/components/DocPageLayout";

export const metadata: Metadata = {
  title: "Handy Hints | Ngaru Pou Cultural Arts",
  description:
    "Everything you need to know about practices, attendance, fees, wānanga and roopu expectations at Ngaru Pou Cultural Arts Inc.",
};

export default function HandyHintsPage() {
  return (
    <DocPageLayout title="Handy Hints">
      <p>
        <strong>Ko te pukapuka hei āwhina i a koe.</strong>
        <br />A handbook to help you — everything whānau need to know about
        practices, attendance, fees, wānanga and our roopu expectations.
      </p>

      <h2>Our Vision</h2>
      <p>
        The vision of this group is to provide a Māori cultural experience
        for our children and youth. This opportunity will allow them to
        experience Māori heritage — the indigenous culture of Aotearoa —
        through the medium of Te Ao Haka, which involves te reo Māori,
        protocol, traditions, values, and the essence of being united as
        one.
      </p>
      <p>
        <strong>Nāu te rourou, nāku te rourou, ka ora ai te iwi.</strong>
        <br />
        With your basket and my basket, the people will prosper. Together,
        we strengthen our tamariki, our whānau and our culture.
      </p>

      <h2>Emergency Contact</h2>
      <p>
        For emergencies, please contact the Chairperson directly.
        Chairperson contact details are provided to whānau upon
        registration. If you have mislaid them, speak with any komiti
        member at practice.
      </p>

      <h2>Bank Details &amp; Payments</h2>
      <p>
        Ngaru Pou Cultural Arts Inc. operates several bank accounts
        depending on the kaupapa at the time. Account details are
        provided to whānau upon registration or on request from the
        Treasurer.
      </p>
      <p>
        <strong>
          Please ensure payments are made to the correct account.
        </strong>{" "}
        Payments made to the wrong account will be treated as a kōhā and
        considered unpaid until received in the correct account. Always
        use clear references (child&apos;s name and purpose of payment).
      </p>

      <h2>Communication</h2>
      <p>
        Facebook and Messenger are our primary communication platforms. We
        have:
      </p>
      <ul>
        <li>A private Facebook page (general communication)</li>
        <li>A separate page for practice videos</li>
      </ul>
      <p>
        You will be added once registration forms are returned. If you do
        not have Facebook, please let us know so alternative arrangements
        can be made. Sensitive matters may be communicated via text message
        or email.
      </p>

      <h2>Ngaru Pou Komiti</h2>
      <p>
        To operate effectively under our Constitution, we require four
        appointed office holders.
      </p>

      <h3>Executive Committee</h3>
      <ul>
        <li>
          <strong>Chairperson</strong> — Marcia Reihana
        </li>
        <li>
          <strong>Vice Chairperson</strong> — Rio-rita Lutui
        </li>
        <li>
          <strong>Secretary</strong> — Shikaia Needham
        </li>
        <li>
          <strong>Treasurer</strong> — Rachel Waikari
        </li>
      </ul>

      <h3>Leadership &amp; Support Roles</h3>
      <ul>
        <li>
          <strong>Events Coordinator</strong> — Ipu-Ariana Smith
        </li>
        <li>
          <strong>Head Tutor</strong> — Rio-rita Lutui
        </li>
        <li>
          <strong>Wardrobe Coordinator</strong> — Rachel Waikari
        </li>
        <li>
          <strong>Wānanga Coordinators</strong> — Rachel Waikari &amp;
          Sarah Rangiwai
        </li>
        <li>
          <strong>Fundraising Coordinator</strong> — Vanessa Mariri
        </li>
        <li>
          <strong>Uniform Coordinator</strong> — Toia Richardson
        </li>
        <li>
          <strong>Social Media</strong> — Toia Richardson &amp; Shikaia
          Needham
        </li>
        <li>
          <strong>Registrar</strong> — Sarah Rangiwai
        </li>
      </ul>

      <h2>Weekly Practice</h2>
      <p>
        <strong>When:</strong> Mondays during school term
        <br />
        <strong>Time:</strong> 4:15pm – 7:30pm (finish time depends on
        group)
        <br />
        <strong>Where:</strong> Success Regional Sporting Facility, 359
        Hammond Road, Success
      </p>
      <ul>
        <li>
          <strong>Te Puawai</strong> — arrive from 4pm, sign in, be on the
          floor by 4:15pm
        </li>
        <li>
          <strong>Te Pukenga Rau</strong> — arrive from 4pm, sign in, be on
          the floor by 4:15pm
        </li>
        <li>
          <strong>Te Pumanawa</strong> — arrive from 4pm, sign in, be on
          the floor by 4:15pm
        </li>
      </ul>
      <p>
        Kaitahi is at 6:15pm — all groups stop and have a kai. 6:30pm back
        on the floor for Te Pumanawa. Te Pukenga Rau and Te Puawai finish
        for the evening.
      </p>

      <h3>Attendance Expectations</h3>
      <ul>
        <li>100% attendance is expected.</li>
        <li>Notify a tutor or komiti member if absent.</li>
        <li>Whānau are responsible for catching up missed learning.</li>
      </ul>
      <p>
        Kaiako teach at a steady pace and cannot reteach content for the
        whole roopu.
      </p>

      <h2>What Tamariki Must Bring</h2>
      <p>Each tamaiti must bring:</p>
      <ul>
        <li>Bottle of water</li>
        <li>Healthy snack</li>
        <li>Own set of practice poi</li>
        <li>Own rakau</li>
      </ul>
      <p>
        Speak to a komiti member if assistance is needed purchasing poi.
      </p>

      <h3>Performance Poi and Rākau</h3>
      <ul>
        <li>
          <strong>Junior tamariki</strong> — provided and must be returned
          after each performance.
        </li>
        <li>
          <strong>Senior tamariki</strong> — must provide their own
          performance poi in roopu colours. Ask a komiti member.
        </li>
      </ul>

      <h2>Hall Etiquette</h2>
      <p>Upon arrival:</p>
      <ul>
        <li>Remove shoes before entering.</li>
        <li>Line shoes up neatly.</li>
        <li>
          Tamariki sit quietly and wait for kaiako, or warm up with
          raukura.
        </li>
        <li>
          Parents and caregivers remove shoes (unless medically unable —
          kei te pai).
        </li>
      </ul>
      <p>Lead by example — our tamariki follow our footsteps.</p>

      <h2>Attendance Recognition</h2>
      <p>To encourage commitment:</p>
      <ul>
        <li>
          <strong>100% attendance</strong> — end-of-year acknowledgement
          and reward.
        </li>
        <li>
          <strong>Below 98%</strong> — reminder sent home.
        </li>
        <li>
          <strong>Below 96% (without valid reason)</strong> — position may
          be forfeited.
        </li>
      </ul>
      <p>Valid reasons include:</p>
      <ul>
        <li>Sickness</li>
        <li>Holidays (discussed with kaiako in advance)</li>
        <li>Significant whānau events (e.g. tangi)</li>
      </ul>

      <h2>Practice Guidelines</h2>
      <ul>
        <li>Practices are CLOSED to whānau.</li>
        <li>Drop off and pick up at designated times.</li>
        <li>Te Puawai MUST sign tamariki in and out.</li>
        <li>
          Te Pukenga Rau and Te Pumanawa do not need to sign in or out —
          attendance will be taken for these roopu.
        </li>
        <li>Keep emergency details current.</li>
        <li>All students must be picked up by an adult.</li>
        <li>One open practice per term is offered for viewing.</li>
      </ul>

      <h3>Safety Expectations</h3>
      <ul>
        <li>No unsupervised running outside.</li>
        <li>
          Younger siblings must sit quietly in the hall while waiting for
          their older sibling.
        </li>
      </ul>
      <p>
        FIFO or visiting whānau? Please speak with a komiti member.
      </p>

      <h2>Annual Fees</h2>
      <p>Fees contribute toward hall hire and operational costs.</p>
      <ul>
        <li>
          <strong>1 child</strong> — $250
        </li>
        <li>
          <strong>2 children</strong> — $350
        </li>
        <li>
          <strong>3+ immediate siblings</strong> — $500 (immediate siblings
          only)
        </li>
      </ul>
      <p>Due by the end of Term 1.</p>
      <p>Additional fundraising supports:</p>
      <ul>
        <li>Insurance</li>
        <li>Wānanga</li>
        <li>Prizegiving</li>
        <li>Other overhead costs</li>
      </ul>

      <h2>Roopu Clothing</h2>
      <p>
        Currently being updated. Details will follow once confirmed.
      </p>

      <h2>Wānanga (Compulsory)</h2>
      <p>
        Held mostly during school holidays (venue dependent). The majority
        of learning takes place here.
      </p>
      <ul>
        <li>Attendance is compulsory.</li>
        <li>
          Inform komiti if leaving and returning during a wānanga.
        </li>
        <li>
          Catching up on any missed material is up to the student and
          whānau.
        </li>
      </ul>

      <h3>Wānanga Fees</h3>
      <ul>
        <li>Subsidised for whānau who assist with fundraising.</li>
        <li>Full fees apply if there is no fundraising participation.</li>
        <li>Fees may increase if costs rise (notice will be provided).</li>
      </ul>
      <p>Food donations may be requested prior to wānanga.</p>

      <h2>Fundraising</h2>
      <p>Fundraising is a vital part of our roopu.</p>
      <ul>
        <li>100% commitment expected.</li>
        <li>All funds go back to tamariki and the roopu.</li>
      </ul>

      <h2>Events &amp; Performances</h2>
      <p>If you confirm availability:</p>
      <ul>
        <li>Attendance is expected.</li>
        <li>Notify immediately if circumstances change.</li>
        <li>Do not ignore Messenger communications.</li>
      </ul>
      <p>
        Late cancellations cause disruption due to the extensive
        behind-the-scenes preparation.
      </p>

      <h2>School Holidays</h2>
      <ul>
        <li>No regular training.</li>
        <li>Wānanga is usually scheduled during this time.</li>
        <li>Refer to the yearly planner for availability.</li>
      </ul>

      <h2>Our Shared Commitment</h2>
      <p>By joining Ngaru Pou Cultural Arts Inc., you commit to:</p>
      <ul>
        <li>Regular attendance</li>
        <li>Respectful behaviour</li>
        <li>Fundraising participation</li>
        <li>Supporting your tamaiti</li>
        <li>Upholding roopu values</li>
      </ul>
      <p>Together, we create a safe and proud cultural environment.</p>

      <h2>Complaints Process</h2>
      <p>If you have a complaint:</p>
      <ol>
        <li>Approach a komiti member directly.</li>
        <li>The komiti will follow the appropriate process.</li>
        <li>
          If you feel unable to speak with a komiti member, contact the
          Chairperson directly.
        </li>
      </ol>

      <h2>Code of Conduct</h2>
      <p>
        For the full code of conduct, behavioural expectations, and
        reportable behaviours, please see our{" "}
        <Link href="/enrolment/code-of-conduct">Code of Conduct</Link>{" "}
        page.
      </p>
    </DocPageLayout>
  );
}
