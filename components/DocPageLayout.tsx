import { ReactNode } from "react";

interface DocPageLayoutProps {
  title: string;
  children: ReactNode;
}

export default function DocPageLayout({ title, children }: DocPageLayoutProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)]">
      <section className="bg-iron-depth px-6 py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-5xl leading-[0.95] tracking-[0.02em] text-white md:text-6xl lg:text-7xl">
            {title}
          </h1>
        </div>
      </section>

      <section className="flex-1 bg-salt-mist px-6 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl font-sans text-base leading-relaxed text-midnight-tidal md:text-lg">
          <div className="[&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul_ul]:mt-3 [&_ul_ul]:mb-0 [&_ul_ul]:space-y-1.5 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_strong]:font-semibold [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-iron-depth md:[&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-iron-depth md:[&_h3]:text-2xl [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary-light [&>*:first-child]:mt-0">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
