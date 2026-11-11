import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const images = {
  desktopHero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuACC_7lifwAjQGtevorrMb9Vbto-v9yRHjcWIkUjfNqs_tpwM3rCr2InORPrkue8fNDKkfgxQPEXApdjoGMYzLL4cBo-o6c7ICsffvc17ud9HAGHDLzO7zEFcMEutitTvUHQGE0vN78y54KU6VfC2WC4WMpimPdNCBdWa51j-y0jGWWs36tu3yt4rbp-closVepC8oJDDxXRvCQlFtODdsqsNqzXRpT5h1g2eS-jZ6KJYhUz8LZ_KLWHw",
  mobileHero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBA1mdV38fBgLnyuKAdm2ntyMy9fAbAqpECdTRhlvTursYdqXFcYIyDokBcTVllAyZlSst6eN76mZh5evRp2RGehdkf030TqolmBk2Tcr33VSH0hcDLR6EJfxzXeu6nTw3SSoYliCL4fGHdT3cgmA5A2ZnbYnx_59qegGO_Vumu0tw-2dclfQlGo4LfX2thXbwcbaoMX9DVNY-3lAnJUhTqVCQZSJMOKNgpX_VtNA71_88N3XQJ3nu2SQ",
  coffee:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAFubrZS8vX8SU2hs6eoIUyP3gRI_68iUwfO4ObaywzR0dq8YsPdLE0xLAn7c_5nHcg9klbJ7Jewp7nNfknX7NX8q1fxh7jErr9CWA37kFOLst6TQeBztTqgQ3NMPZfXbS1-1pcOSWglTTD9dXOY4qtfQrt2na5py_Eap4z-ieJ2Rk8t-VWz-Lzhe8rrtyub7S1_67Bs0ltddNL_wRLZLzqpEQlf_KrSUDGJ-Oj7r73F-uaRouzbA6EHw",
  care: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTV06tM-yPGfeJJLDJWZTAe39IPNUUs4wBYnQ8A_rkU74ai-dd9Nb8PLZTeD3-ZKYi1gXntEQqYa7VA35YLm9-pieY01_1ZgslZVhJnLjbhN3_9G4VeY0etp8zNjHg8SfngdMnZ-Wwhw8ld8Tu-AC_HdH-hfOXI4zlKrblM8vKSfNJWyw3srdF2eNkATZQ4ocKy8ownkV6l-S8fkDJ8cTesPbqBrDqHf_kCbbsv3pcYDKFGJDyqYqc0g",
  bites:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCDQtdaNVcoNoRVxNumY8w8PHPCP8n6P9AUjrUS2KZPSlhZJoIoi5m1lyp5OAWj-BCk-W-9rp_jspb08ie27csLUGUJkKtNS5mKRyOU1zVpVjvXs0O0MYd_8Uu_eebo4gVucFrLsLXiC-CZ7W03MczC6AdqHeIvtpimXcjKg5mDARws8toxv6tW8IY4Kux6C5s4eDFlVnyGOIkaieBeCylZ2LdrQ13bKeZWI8JjvBrB2vrUbDQx31yDGA",
  birthday:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD9KX3OytyIuQjf0WqrnKz5N1YZcTxixTdd5rRp5-JNAQVuwqRgexe0jY98iNUK7SJD8VzSFf9mFJoKlLG0XBoYHVFfoViuvXzZw2ZvQycH-kJuQ2vucDDm6LxM0gWa7tPdEIPMNVGmVfy_iWD0Eqc9VsIkCPd5gQ7vfXl51m13Agvbpya2u7orbepVDqUQEO7-17ZEAx-0J1JT6Pkc7XJABaUYFrUk0vl_3Eyz-GiQO-t8P0tWLewRdw",
  bridal:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBq_5Miu19mkAnfYFzhQfkaHLYGhLLATLMpr0_FGgQteyF_n3QmyjwRVRG3d1i6wjaPyIAV7MiQjkHvwkCuSnpfaxFOcTX6g2WOLBhPqM7KQMUb8mF0bHApwq19j8hp5QiiVEm9HB7VYSuvMMBO8J5N8nHx6jzNfZQBxcIr1PMr4lrAtqMjb4EHIBWQPj-Wrud-ddfI9xZTHIQ8np-Uc469SWRVqP5id73_4QkZRp0lrlDOOUfHsEiREw",
  baby: "https://lh3.googleusercontent.com/aida-public/AB6AXuDromhgENE6PCbd8S4hqk9Td_TTxJjmRSVSUz3SwfVb7qSwU61MQr0fKgQi_qk6pudPXr87SoXVY1U5eEHdJZvYp2HLNXzFQwbcUszqlnF_eZWIdBvfx_Q4vhCR8E1NElGu_GfGcncxmob77GSQ-hNhxyGGYZeSSsGzH2QhuvYtia-6eTxVBMv5KhGn94I-_L6Y5hs7_kDcE5eDxLXZPT1lhZ1h3FZSxCXVb-gdz_4TSbEAea2CeoxTyw",
};

const occasions = [
  {
    name: "Birthday",
    count: "24 Curated Sets",
    category: "birthday-giveaways",
    image: images.birthday,
  },
  {
    name: "Bridal",
    count: "18 Curated Sets",
    category: "bridal-giveaways",
    image: images.bridal,
  },
  {
    name: "Baby",
    count: "32 Curated Sets",
    category: "baby-giveaways",
    image: images.baby,
  },
];

/* ─── Shared pieces ─────────────────────────────────────────────────────────── */

const WishlistButton = ({ className = "" }) => (
  <button
    type="button"
    aria-label="Add to wishlist"
    className={`flex items-center justify-center rounded-full bg-surface-container-lowest/80 text-on-surface-variant backdrop-blur ${className}`}
  >
    <Icon name="favorite" size={16} />
  </button>
);

const Newsletter = () => (
  <section className="mb-stack-lg px-margin-mobile">
    <div className="relative overflow-hidden rounded-[24px] bg-primary-fixed p-stack-md text-center">
      {/* Abstract decorative shapes */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-container/20 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-surface-container-lowest/40 blur-2xl" />
      <h2 className="relative z-10 mb-2 font-headline-md text-headline-md text-on-primary-fixed">
        Join the Studio
      </h2>
      <p className="relative z-10 mb-6 font-body-md text-body-md text-on-primary-fixed-variant">
        Get 10% off your first custom box and exclusive artisanal updates.
      </p>
      <div className="relative z-10 flex flex-col gap-3">
        <input
          type="email"
          placeholder="Your email address"
          className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-tertiary focus:ring-1 focus:ring-tertiary"
        />
        <button
          type="button"
          className="w-full rounded-xl bg-secondary-container px-6 py-3 font-label-md text-label-md text-on-secondary-container shadow-sm transition-transform active:scale-95"
        >
          Subscribe
        </button>
      </div>
    </div>
  </section>
);

/* ─── Mobile home ──────────────────────────────────────────────────────────── */

const MobileHome = () => (
  <div className="md:hidden">
    {/* Hero */}
    <section className="flex flex-col items-center px-margin-mobile py-stack-md text-center">
      <div className="relative mb-stack-md aspect-[4/5] w-full overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(45,41,38,0.1)]">
        <img
          src={images.mobileHero}
          alt="Curated artisanal gift box"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent p-6">
          <h1 className="mb-2 font-headline-lg-mobile text-headline-lg-mobile leading-tight text-surface-container-lowest">
            Curated Joy,
            <br />
            Beautifully Boxed
          </h1>
          <p className="mb-6 font-body-lg text-body-lg text-surface-container-highest">
            Bespoke artisanal gifts for every moment.
          </p>
          <Link
            to="/shop"
            className="w-full rounded-full bg-primary px-8 py-4 font-label-md text-label-md text-on-primary shadow-[0_10px_30px_rgba(167,41,97,0.3)] transition-transform active:scale-95"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </section>

    {/* Categories pills */}
    <section className="mb-stack-lg pl-margin-mobile">
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 pr-margin-mobile">
        {["All", "Birthdays", "Anniversary", "Just Because", "Corporate"].map(
          (category, index) => (
            <Link
              key={category}
              to="/shop"
              className={`shrink-0 rounded-full px-6 py-2 font-label-md text-label-md ${
                index === 0
                  ? "border border-tertiary/20 bg-tertiary/10 text-tertiary"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {category}
            </Link>
          ),
        )}
      </div>
    </section>

    {/* Featured curations bento grid */}
    <section className="mb-stack-lg px-margin-mobile">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-headline-md text-headline-md text-primary">
          Featured Curations
        </h2>
        <Link
          to="/shop"
          className="flex items-center font-label-sm text-label-sm text-tertiary"
        >
          View All <Icon name="arrow_forward" size={16} className="ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Large item */}
        <Link
          to="/shop"
          className="col-span-2 flex flex-col rounded-[24px] border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
        >
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl">
            <img
              src={images.coffee}
              alt="The Morning Ritual coffee set"
              className="h-full w-full object-cover"
            />
            <WishlistButton className="absolute right-3 top-3 h-8 w-8" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-1 font-label-md text-label-md text-on-surface">
                The Morning Ritual
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Artisanal Coffee Set
              </p>
            </div>
            <span className="font-label-md text-label-md text-primary">$85</span>
          </div>
        </Link>

        {/* Small items */}
        {[
          { name: "Self-Care Sunday", price: "$55", image: images.care },
          { name: "Botanical Bites", price: "$35", image: images.bites },
        ].map((item) => (
          <Link
            to="/shop"
            key={item.name}
            className="flex flex-col rounded-[24px] border border-outline-variant/30 bg-surface-container-lowest p-3 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
          >
            <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
              <WishlistButton className="absolute right-2 top-2 h-7 w-7" />
            </div>
            <h3 className="mb-1 truncate font-label-md text-label-md text-on-surface">
              {item.name}
            </h3>
            <span className="font-label-md text-label-md text-primary">
              {item.price}
            </span>
          </Link>
        ))}
      </div>
    </section>

    {/* Occasions horizontal scroll */}
    <section className="mb-stack-lg pl-margin-mobile">
      <h2 className="mb-4 pr-margin-mobile font-headline-md text-headline-md text-primary">
        Shop by Occasion
      </h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 pr-margin-mobile">
        {[
          { name: "Weddings", count: "12 Curations", image: images.bridal },
          {
            name: "Housewarming",
            count: "8 Curations",
            image: images.coffee,
          },
          { name: "Birthdays", count: "15 Curations", image: images.birthday },
        ].map((item) => (
          <Link
            key={item.name}
            to="/shop"
            className="flex w-64 shrink-0 items-center gap-4 rounded-[24px] border border-outline-variant/20 bg-surface-container-low p-4 shadow-[0_10px_30px_rgba(45,41,38,0.03)]"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface">
                {item.name}
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                {item.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>

    <Newsletter />
  </div>
);

/* ─── Desktop home ─────────────────────────────────────────────────────────── */

const DesktopHome = () => (
  <div className="hidden overflow-hidden md:block">
    {/* Hero */}
    <section
      className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-surface-container-low px-margin-desktop py-stack-lg"
      id="collections"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-surface-container-low via-surface-container-low/80 to-transparent" />
        <img
          src={images.desktopHero}
          alt="Curated gift boxes"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-80"
        />
      </div>
      <div className="relative z-20 mx-auto w-full max-w-container-max">
        <div className="flex max-w-xl flex-col items-start justify-center space-y-stack-md">
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Curated Joy, Beautifully Boxed
          </h1>
          <p className="max-w-lg font-body-lg text-body-lg text-on-surface-variant">
            Discover bespoke gifting experiences tailored for every meaningful
            moment. Hand-selected, artisanally crafted, and delivered with love.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 font-label-md text-label-md text-on-primary shadow-[0_10px_30px_rgba(45,41,38,0.05)] transition-all hover:-translate-y-0.5 hover:bg-surface-tint"
            >
              Explore Collections
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-xl bg-secondary-container px-8 py-4 font-label-md text-label-md text-on-secondary-container shadow-[0_10px_30px_rgba(45,41,38,0.05)] transition-all hover:-translate-y-0.5 hover:bg-secondary-fixed"
            >
              Customize a Gift
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Collections / Occasions */}
    <section className="mx-auto max-w-container-max px-margin-desktop py-stack-lg">
      <div className="mb-stack-md flex items-end justify-between">
        <div>
          <h2 className="mb-2 font-headline-lg text-headline-lg text-on-surface">
            Shop by Occasion
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Perfectly tailored collections for life's special moments.
          </p>
        </div>
        <Link
          to="/shop"
          className="group flex items-center font-label-md text-label-md text-primary hover:underline"
        >
          View All Occasions
          <Icon
            name="arrow_forward"
            className="ml-1 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        {occasions.map((item) => (
          <Link
            key={item.name}
            to={`/shop?category=${item.category}`}
            className="group relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_10px_30px_rgba(45,41,38,0.05)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="relative z-10 flex items-center justify-between bg-surface-container-lowest p-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {item.name}
                </h3>
                <p className="mt-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  {item.count}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container transition-colors group-hover:bg-primary group-hover:text-on-primary">
                <Icon name="arrow_outward" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

const HomePage = () => (
  <>
    <MobileHome />
    <DesktopHome />
  </>
);

export default HomePage;
