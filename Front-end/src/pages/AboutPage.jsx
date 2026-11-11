import Icon from "../components/Icon";

const PROCESS_STEPS = [
  {
    number: "1",
    title: "Conception",
    desc: "Sketching the vision.",
    primary: true,
  },
  {
    number: "2",
    title: "Sourcing",
    desc: "Finding premium materials.",
    primary: false,
  },
  {
    number: "3",
    title: "Creation",
    desc: "Crafting the final piece.",
    primary: false,
  },
];

const AboutPage = () => (
  <div className="relative w-full overflow-hidden">
    {/* Background accents */}
    <div className="pointer-events-none absolute left-0 top-0 -z-10 h-80 w-80 -translate-x-1/3 -translate-y-1/4 rounded-full bg-primary-fixed opacity-25 blur-3xl" />
    <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-96 w-96 translate-x-1/3 translate-y-1/4 rounded-full bg-secondary-fixed opacity-20 blur-3xl" />

    <main className="mx-auto w-full max-w-container-max px-margin-mobile py-stack-md pb-stack-lg md:px-margin-desktop md:py-stack-lg">
      {/* Hero */}
      <section className="mx-auto mb-stack-lg max-w-3xl text-center">
        <h1 className="mb-stack-md font-display-lg text-headline-lg-mobile md:text-display-lg text-primary">
          Crafting Memories
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          We believe in the power of handmade artistry to transform everyday
          moments into cherished, neo-vintage experiences.
        </p>
      </section>

      {/* Bento Grid: Story & Mission */}
      <section className="mb-stack-lg grid grid-cols-1 gap-gutter md:grid-cols-12">
        {/* Our Story */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(45,41,38,0.05)] md:col-span-8 md:p-8">
          <div className="relative z-10">
            <h2 className="mb-4 font-headline-md text-headline-md text-primary">
              Our Story
            </h2>
            <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
              Born from a passion for the tactile and the timeless, Vintage
              began as a small studio dedicated to reviving lost artisanal
              techniques. Today, we blend 1970s creative freedom with modern
              precision.
            </p>
          </div>
          <div className="mt-6 h-64 overflow-hidden rounded-xl">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=1400"
              alt="Inside the Vintage artisanal studio"
            />
          </div>
        </div>

        {/* Mission column */}
        <div className="flex flex-col gap-gutter md:col-span-4">
          <div className="flex-grow rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <Icon name="lightbulb" />
            </div>
            <h3 className="mb-2 font-headline-md text-[24px] font-semibold leading-8 text-on-surface">
              The Mission
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              To design high-end, bespoke creations that feel inherently human.
            </p>
          </div>
          <div className="flex flex-grow items-center justify-center rounded-xl bg-secondary-container p-8 text-center shadow-[0_10px_30px_rgba(45,41,38,0.05)]">
            <span className="font-headline-md text-headline-md text-on-secondary-container">
              Handmade
              <br />
              with Care
            </span>
          </div>
        </div>
      </section>

      {/* Creative Process */}
      <section className="mb-stack-lg">
        <h2 className="mb-stack-md text-center font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Our Process
        </h2>
        <div className="relative flex flex-col items-center justify-between gap-gutter md:flex-row md:items-start">
          {/* Progress track (desktop) */}
          <div className="absolute left-[10%] right-[10%] top-6 hidden h-2 rounded-full bg-primary-fixed-dim md:block">
            <div className="h-full w-1/3 rounded-full bg-primary" />
          </div>

          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="relative z-10 flex w-full flex-col items-center text-center md:w-1/3"
            >
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-surface shadow-sm ${
                  step.primary
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface"
                }`}
              >
                <span className="font-headline-md text-headline-md">
                  {step.number}
                </span>
              </div>
              <h4 className="mb-2 font-label-md text-label-md text-on-surface">
                {step.title}
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default AboutPage;
