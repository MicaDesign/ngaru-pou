import type { Metadata } from "next";
import DocPageLayout from "@/components/DocPageLayout";

export const metadata: Metadata = {
  title: "Code of Conduct | Ngaru Pou Cultural Arts",
  description:
    "Our code of conduct ensures a safe, respectful environment. Learn about behavioral expectations, safety policies, and our commitment to wellbeing.",
};

export default function CodeOfConductPage() {
  return (
    <DocPageLayout title="Code Of Conduct">
      <p>
        <strong>Ngaru Pou Cultural Arts</strong> Inc believes that it is
        important that members and parents associated with the roopu should
        at all times, show respect and understanding for the safety and
        welfare of others. Members are encouraged to be open at all times
        and to share any concerns or complaints that they may have about
        any aspect of Ngaru Pou Inc with the Parent Representative or the
        Chairperson of the Association.
      </p>

      <ul>
        <li>Be loyal, friendly, supportive and respectful to all persons and property</li>
        <li>Behave and listen to all instructions from the tutors and supporting parents</li>
        <li>
          Respect the rights, dignity and worth of all members, regardless
          of age, gender, ability, race, cultural background, religious
          beliefs or sexual identity
        </li>
        <li>Refrain from the use of bad language or racial/sectarian references</li>
        <li>
          Refrain from bullying. This includes bullying using instantaneous
          communications ie facebook, snap chat, Instagram
        </li>
        <li>
          Keep to agreed timings for practises, performances and wānanga or
          inform the komiti if you are unable to do so
        </li>
        <li>
          All Ngaru Pou members including parents/guardians, must not smoke
          or drink whilst in Ngaru Pou attire, or attending an event,
          wānanga or practise whilst representing Ngaru Pou Cultural Arts
          Inc.
        </li>
        <li>Be safe at all times</li>
        <li>Sign tamariki in and out of practise, events and wānanga</li>
        <li>Report inappropriate behaviour</li>
        <li>Be fair and trustworthy</li>
        <li>Not show violent or aggressive behaviour</li>
        <li>100% attendance</li>
        <li>Commitment to practises, performances, wānanga and fundraising</li>
        <li>
          We are a sunsmart roopu and we follow the Sunsmart policy to
          ensure the safety of our tamariki and whānau.{" "}
          <strong>This means:</strong>
          <ul>
            <li>Tamariki must wear rashy or shirt to cover shoulders, back and chest area</li>
            <li>Apply sunblock every 20 minutes</li>
            <li>Wear a sunsmart hat</li>
          </ul>
        </li>
        <li>
          Supervisors / Parents should:
          <ul>
            <li>Monitor sunblock and make sure it is reapplied</li>
            <li>Ensure tamariki are wearing the correct attire, otherwise they exit the water</li>
            <li>
              If they are allergic to sunblock, they will need to supply
              their own form of sunblock and/or make sure they are fully
              covered if no sunblock is applied.
            </li>
          </ul>
        </li>
      </ul>

      <p>
        Ngaru Pou Cultural Arts Inc offers a positive experience where
        whānau can learn new things in a safe and positive environment. We
        are fully committed to safeguarding and promoting the wellbeing of
        all tamariki.
      </p>

      <p>
        <strong>As a member of </strong>Ngaru Pou Cultural Arts
        <strong>
          {" "}
          Inc you are expected to abide by the following Code of Conduct:
        </strong>
      </p>

      <p>
        If you experience or witness any of the following behaviour when we
        are attending an occasion/event as a roopu, during practises/wānanga,
        or on social media, please report it immediately
      </p>

      <ul>
        <li>Racism</li>
        <li>Sexism</li>
        <li>Sexual Harrassment</li>
        <li>Abuse: verbal of physical</li>
        <li>Intolerance of a person&apos;s religion, gender identity or sexual orientation</li>
        <li>Behaving in a way that disturbs the enjoyment of the event/discussion for other people</li>
        <li>Any other actions deemed to be intentionally hurtful, harmful, threatening or inappropriate</li>
        <li>Offensive or obscene language</li>
      </ul>

      <p>
        <strong>
          We aim to enforce the right for all Ngaru Pou Cultural Arts Inc
          members to enjoy the roopu in an environment that is safe and
          without risks to mental and physical health. Any breach of the
          Code of Conduct, the Chairperson, Tutor or komiti will be
          notified and further action will be taken according to the Ngaru
          Pou Cultural Arts Inc constitution.
        </strong>
      </p>
    </DocPageLayout>
  );
}
