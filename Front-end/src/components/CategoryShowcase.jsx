import { Link } from "react-router-dom";

/**
 * "Our Categories" — round doodle illustrations with labels, matching the
 * home-page reference. Categories are managed in the backend (sortOrder > 0).
 */
const CategoryShowcase = ({ categories = [] }) => {
  const items = categories
    .filter((category) => Number(category.sortOrder) > 0)
    .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));

  if (items.length === 0) return null;

  return (
    <section
      aria-label="Our Categories"
      className="px-margin-mobile py-stack-lg md:px-margin-desktop"
    >
      <div className="mx-auto max-w-container-max">
        <h2 className="mb-10 text-center font-headline-md text-[26px] font-bold uppercase tracking-[0.18em] text-on-background md:text-[30px]">
          Our Categories
        </h2>

        <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9">
          {items.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group flex w-full max-w-[7.5rem] flex-col items-center gap-2 text-center"
            >
              <span className="flex h-20 w-20 items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-[5.5rem] sm:w-[5.5rem] lg:h-24 lg:w-24">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-body-md text-[14px] leading-snug text-on-surface transition-colors group-hover:text-primary">
                  {category.name}
                </span>
                {category.subtitle ? (
                  <span className="font-body-md text-[12px] leading-snug text-primary">
                    {category.subtitle}
                  </span>
                ) : null}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
