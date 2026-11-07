import { ArrowRight, ArrowUpRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

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

const Wish = () => (
  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-vintage-light-brown">
    <Heart className="h-4 w-4" />
  </span>
);

const MobileHome = () => (
  <div className="pb-24 lg:hidden">
    <section className="px-4 py-6">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(45,41,38,0.1)]">
        <img
          src={images.mobileHero}
          alt="Curated artisanal gift box"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#34302c]/85 via-[#34302c]/10 to-transparent p-6 text-center">
          <h1 className="font-serif text-[32px] font-bold leading-[1.05] text-white">
            Curated Joy,
            <br />
            Beautifully Boxed
          </h1>
          <p className="mt-3 text-lg leading-7 text-[#e9e1dc]">
            Bespoke artisanal gifts for every moment.
          </p>
          <Link
            to="/shop"
            className="mt-7 rounded-full bg-vintage-gold py-4 text-sm font-semibold"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </section>
    <div className="mb-12 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
      {["All", "Birthdays", "Anniversary", "Just Because", "Corporate"].map(
        (category, index) => (
          <Link
            key={category}
            to="/shop"
            className={`shrink-0 rounded-full px-6 py-2 text-sm font-medium ${index === 0 ? "border border-vintage-accent/20 bg-vintage-accent/10 text-vintage-accent" : "bg-vintage-pink text-vintage-light-brown"}`}
          >
            {category}
          </Link>
        ),
      )}
    </div>
    <section className="px-4">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="max-w-56 font-serif text-[32px] font-bold leading-10 text-vintage-gold">
          Featured Curations
        </h2>
        <Link
          to="/shop"
          className="mb-1 flex items-center gap-2 text-xs font-medium text-vintage-accent"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/shop"
          className="col-span-2 rounded-[24px] border border-vintage-border/30 bg-white p-4 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
        >
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <img
              src={images.coffee}
              alt="The Morning Ritual coffee set"
              className="h-full w-full object-cover"
            />
            <Wish />
          </div>
          <div className="mt-4 flex justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">The Morning Ritual</h3>
              <p className="mt-1 text-xs text-vintage-light-brown">
                Artisanal Coffee Set
              </p>
            </div>
            <b className="text-sm text-vintage-gold">$85</b>
          </div>
        </Link>
        {[
          { name: "Self-Care Sunday", price: "$55", image: images.care },
          { name: "Botanical Bites", price: "$35", image: images.bites },
        ].map((item) => (
          <Link
            to="/shop"
            key={item.name}
            className="rounded-[24px] border border-vintage-border/30 bg-white p-3 shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
              <Wish />
            </div>
            <h3 className="mt-3 truncate text-sm font-semibold">{item.name}</h3>
            <b className="mt-1 block text-sm text-vintage-gold">{item.price}</b>
          </Link>
        ))}
      </div>
    </section>
    <section className="mt-12 overflow-hidden">
      <h2 className="px-4 font-serif text-[32px] font-bold leading-10 text-vintage-gold">
        Shop by Occasion
      </h2>
      <div className="mt-4 flex gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
        {[
          { name: "Weddings", count: "12 Curations", image: images.bridal },
          { name: "Housewarming", count: "8 Curations", image: images.coffee },
          { name: "Birthdays", count: "15 Curations", image: images.birthday },
        ].map((item) => (
          <Link
            to="/shop"
            key={item.name}
            className="flex w-64 shrink-0 items-center gap-4 rounded-[24px] border border-vintage-border/20 bg-vintage-pink p-4"
          >
            <img
              src={item.image}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-sm font-semibold">{item.name}</h3>
              <p className="text-xs text-vintage-light-brown">{item.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
    <section className="mx-4 mt-12 overflow-hidden rounded-t-[24px] bg-[#ffd9e3] p-6 text-center">
      <h2 className="font-serif text-[32px] font-bold text-[#3e001e]">
        Join the Studio
      </h2>
      <p className="mt-2 text-sm leading-5 text-[#8a0e4c]">
        Get 10% off your first custom box and exclusive artisanal updates.
      </p>
      <input
        type="email"
        placeholder="Your email address"
        className="mt-6 w-full rounded-xl border border-vintage-border bg-white px-4 py-3 text-sm outline-none focus:border-vintage-accent"
      />
      <button className="mt-3 w-full rounded-xl bg-vintage-mustard py-3 text-sm font-semibold text-[#6d4f00]">
        Subscribe
      </button>
    </section>
  </div>
);

const DesktopHome = () => (
  <div className="hidden overflow-hidden bg-vintage-cream lg:block">
    <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-vintage-pink">
      <img
        src={images.desktopHero}
        alt="Curated gift boxes"
        className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-vintage-pink via-vintage-pink/88 to-vintage-pink/15" />
      <div className="relative mx-auto w-full max-w-[1280px] px-12 py-24">
        <div className="max-w-xl">
          <h1 className="font-serif text-[64px] font-bold leading-[1.12] tracking-[-0.035em] text-vintage-brown">
            Curated Joy,
            <br />
            Beautifully Boxed
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-7 text-vintage-light-brown">
            Discover bespoke gifting experiences tailored for every meaningful
            moment. Hand-selected, artisanally crafted, and delivered with love.
          </p>
          <div className="mt-9 flex gap-4">
            <Link
              to="/shop"
              className="btn-vintage-primary inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-semibold shadow-md"
            >
              Explore Collections
            </Link>
            <Link
              to="/shop"
              className="btn-vintage-secondary inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-semibold shadow-md"
            >
              Customize a Gift
            </Link>
          </div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-[1280px] px-12 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-5xl font-bold text-vintage-brown">
            Shop by Occasion
          </h2>
          <p className="mt-2 text-base text-vintage-light-brown">
            Perfectly tailored collections for life's special moments.
          </p>
        </div>
        <Link
          to="/shop"
          className="group flex items-center gap-2 text-sm font-medium text-vintage-gold transition-colors hover:text-[#8a0e4c]"
        >
          View All Occasions{" "}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {occasions.map((item) => (
          <Link
            key={item.name}
            to={`/shop?category=${item.category}`}
            className="group overflow-hidden rounded-xl border border-vintage-border/30 bg-white shadow-[0_10px_30px_rgba(45,41,38,0.05)]"
          >
            <div className="h-64 overflow-hidden">
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-serif text-3xl font-bold leading-none">
                  {item.name}
                </h3>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.1em] text-vintage-light-brown">
                  {item.count}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-vintage-pink group-hover:bg-vintage-mustard active:scale-95 transition-all duration-300">
                <ArrowUpRight className="h-5 w-5 transition-all duration-300 group-hover:rotate-45" />
              </span>
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
