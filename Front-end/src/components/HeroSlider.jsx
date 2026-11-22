import { useCallback, useRef, useState } from "react";
import Icon from "./Icon";
import { assetUrl } from "../utils/assets";

/**
 * Full-width hero slider for the home page.
 * Slides are promotional imagery (offers + new arrivals) with side arrows.
 */
const SLIDES = [
  {
    id: 1,
    image: "/api/images/hero/desktop-hero.jpg",
    mobileImage: "/api/images/hero/mobile-hero.jpg",
    eyebrow: "New Season",
    title: "Curated Joy, Beautifully Boxed",
    subtitle:
      "Bespoke gifting experiences, hand-selected and artisanally crafted for every meaningful moment.",
  },
  {
    id: 2,
    image: "/api/images/products/furniture-sofa.jpg",
    mobileImage: "/api/images/products/furniture-sofa.jpg",
    eyebrow: "The Velvet Edit",
    title: "Restored Classics, Ready to Ship",
    subtitle:
      "Deep-buttoned chesterfields and one-of-a-kind furniture, brought back to life in our workshop.",
  },
  {
    id: 3,
    image: "/api/images/products/clothing-dress2.jpg",
    mobileImage: "/api/images/products/clothing-dress2.jpg",
    eyebrow: "New Arrivals",
    title: "70s Florals & Soft Linen",
    subtitle:
      "Freshly curated vintage garments, washed soft and ready to wear — limited pieces only.",
  },
  {
    id: 4,
    image: "/api/images/products/accessories-watch-gold.jpg",
    mobileImage: "/api/images/products/accessories-watch-gold.jpg",
    eyebrow: "Timeless Pieces",
    title: "Heritage Watches, Serviced by Hand",
    subtitle:
      "Gold-tone cases, hand-stitched straps and honest timekeeping — chosen for craft, not logos.",
  },
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const count = SLIDES.length;

  const goTo = useCallback(
    (next) => setIndex(((next % count) + count) % count),
    [count],
  );
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 45) return;
    if (delta > 0) prev();
    else next();
  };

  return (
    <section
      aria-label="Featured offers"
      aria-roledescription="carousel"
      className="relative w-full overflow-hidden bg-surface-container-low"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") prev();
        if (event.key === "ArrowRight") next();
      }}
      tabIndex={0}
    >
      <div
        className="flex h-[60vh] min-h-[380px] w-full transition-transform duration-500 ease-out sm:h-[68vh] md:h-[calc(100svh-5rem)] md:min-h-[500px] md:max-h-[820px]"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className="relative h-full w-full shrink-0 grow-0 basis-full"
            aria-hidden={i !== index}
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={assetUrl(slide.mobileImage)} />
              <img
                src={assetUrl(slide.image)}
                alt={`${slide.title} — ${slide.eyebrow}`}
                className="h-full w-full object-cover"
                draggable="false"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-container-max px-6 sm:px-10 md:px-margin-desktop">
                <div className="max-w-xl text-white">
                  <p className="mb-3 font-label-sm text-[11px] uppercase tracking-[0.28em] text-white/80 md:text-xs">
                    {slide.eyebrow}
                  </p>
                  <h1 className="font-display-lg text-[34px] leading-[1.05] sm:text-[42px] md:text-display-lg">
                    {slide.title}
                  </h1>
                  <p className="mt-4 max-w-md font-body-md text-sm leading-relaxed text-white/85 md:text-body-lg">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 sm:left-4 sm:h-12 sm:w-12 md:left-6"
      >
        <Icon name="chevron_left" size={26} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 sm:right-4 sm:h-12 sm:w-12 md:right-6"
      >
        <Icon name="chevron_right" size={26} />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
