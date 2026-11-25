/**
 * SEO copy shared by the client-side head manager and the build-time
 * pre-renderer. Keep this file free of browser- and env-specific code so it
 * can be imported from vite.config.js as well.
 */

export const SITE_NAME = "Vintage";
export const SITE_URL_FALLBACK = "https://vintage-black-six.vercel.app";

export const DEFAULT_DESCRIPTION =
  "Shop vintage-inspired gifts, accessories, photo prints, clothing and home decor. Hand-selected, handmade pieces and custom gift boxes for every occasion.";

export const DEFAULT_KEYWORDS =
  "vintage, vintage store, vintage gifts, handmade gifts, gift boxes, accessories, photo prints, birthday gifts, christmas gifts, clothing, home decor, مطبوعات, اكسسوارات, هدايا, اعياد ميلاد, فينتج";

const page = ({
  title,
  description,
  keywords,
  h1,
  intro,
  faqs = [],
}) => ({ title, description, keywords, h1, intro, faqs });

const commonFaqs = (name, plural) => [
  {
    q: `Where can I buy ${plural} online?`,
    a: `Browse the ${name.toLowerCase()} collection at Vintage. Every piece is hand-selected or handmade, with live stock and tracked delivery.`,
  },
  {
    q: `Can I personalise ${plural}?`,
    a: `Yes. Our studio creates bespoke boxes and custom pieces — send us your idea through the contact page and we will craft it for you.`,
  },
  {
    q: `How long does delivery take?`,
    a: `Orders are packed within 1–2 business days and usually arrive within 2–4 weeks, depending on your location.`,
  },
];

export const CATEGORY_SEO = {
  christmas: page({
    title: "Christmas Gifts & Festive Decor",
    description:
      "Christmas gifts, festive decor and handmade stocking fillers. Discover vintage-inspired Christmas pieces, gift boxes and seasonal decorations at Vintage.",
    keywords:
      "christmas gifts, christmas decor, stocking fillers, festive gift boxes, vintage christmas, هدايا عيد الميلاد, ديكور,Krismas",
    h1: "Christmas Gifts & Festive Decor",
    intro:
      "Warm, nostalgic pieces for the most magical time of year — handmade ornaments, thoughtful stocking fillers and gift boxes wrapped ready to give.",
    faqs: commonFaqs("Christmas", "Christmas gifts"),
  }),
  "birthday-giveaways": page({
    title: "Birthday Gifts & Giveaways",
    description:
      "Birthday gifts for every age — curated gift boxes, party favours, prints and keepsakes. Shop unique birthday giveaways at Vintage.",
    keywords:
      "birthday gifts, birthday giveaways, birthday gift box, birthday presents, party favours, هدايا اعياد الميلاد, هدايا عيد ميلاد",
    h1: "Birthday Gifts & Giveaways",
    intro:
      "From milestone birthdays to small surprises, find one-of-a-kind gifts, handmade keepsakes and ready-to-send boxes that feel personal.",
    faqs: commonFaqs("birthday", "birthday gifts"),
  }),
  "baby-giveaways": page({
    title: "Baby Shower Gifts & Newborn Keepsakes",
    description:
      "Baby shower gifts, newborn keepsakes and handmade baby giveaways. Discover thoughtful vintage-inspired baby gifts at Vintage.",
    keywords:
      "baby shower gifts, newborn gifts, baby keepsakes, baby giveaways, هدايا بيبي, هدايا حمل",
    h1: "Baby Shower Gifts & Newborn Keepsakes",
    intro:
      "Soft, thoughtful little gifts for new arrivals and baby showers — keepsakes made to be kept long after the celebration.",
    faqs: commonFaqs("baby", "baby gifts"),
  }),
  "bridal-giveaways": page({
    title: "Bridal Shower Favours & Wedding Keepsakes",
    description:
      "Bridal shower favours, wedding keepsakes and handmade bridal giveaways. Shop unique vintage-inspired gifts for the bride at Vintage.",
    keywords:
      "bridal shower gifts, wedding favours, bridal giveaways, wedding keepsakes, هدايا عروس, هدايا زفاف",
    h1: "Bridal Shower Favours & Wedding Keepsakes",
    intro:
      "Hand-finished favours and keepsakes for the bride-to-be and her guests — the kind of details people remember.",
    faqs: commonFaqs("bridal", "bridal gifts"),
  }),
  "photo-prints": page({
    title: "Photo Prints & Framed Memories",
    description:
      "Photo prints, framed memories and personalised print gifts. Turn your favourite moments into vintage-inspired keepsakes at Vintage.",
    keywords:
      "photo prints, personalised prints, framed photos, print gifts, مطبوعات, مطبوعات صور, هدايا مطبوعة",
    h1: "Photo Prints & Framed Memories",
    intro:
      "Turn the photos you love into something you can hold — printed, framed and ready to gift, with a warm vintage finish.",
    faqs: commonFaqs("photo print", "photo prints"),
  }),
  "party-supplies": page({
    title: "Party Supplies & Celebration Decor",
    description:
      "Party supplies, decorations and favours for birthdays, bridal showers and celebrations. Shop curated party pieces at Vintage.",
    keywords:
      "party supplies, party decor, party favours, celebration gifts, مستلزمات حفلات, هدايا حفلات",
    h1: "Party Supplies & Celebration Decor",
    intro:
      "Everything that makes a gathering feel considered — decorations, favours and small surprises for birthdays, showers and milestones.",
    faqs: commonFaqs("party", "party supplies"),
  }),
  "create-your-gift-box": page({
    title: "Create Your Own Gift Box",
    description:
      "Create your own gift box — choose handmade prints, accessories and keepsakes to build a personalised vintage gift at Vintage.",
    keywords:
      "custom gift box, create your own gift box, personalised gift box, build a gift box, صندوق هدايا, هدايا مخصصة",
    h1: "Create Your Own Gift Box",
    intro:
      "Pick the pieces, set the mood and let our studio pack it beautifully. A personal gift, made your way.",
    faqs: commonFaqs("gift box", "custom gift boxes"),
  }),
  "gifts-only": page({
    title: "Gifts for Every Occasion",
    description:
      "Gifts for every occasion — vintage finds, handmade accessories, prints and gift boxes for birthdays, Christmas and more.",
    keywords:
      "gifts, unique gifts, handmade gifts, vintage gifts, occasion gifts, هدايا, هدايا مميزة, هدايا مناسبات",
    h1: "Gifts for Every Occasion",
    intro:
      "A considered edit of gifts for birthdays, holidays, housewarmings and just-because moments — all beautifully boxed.",
    faqs: commonFaqs("gift", "gifts"),
  }),
  outlet: page({
    title: "Outlet & Last-Chance Vintage Finds",
    description:
      "Outlet finds and last-chance vintage pieces at reduced prices. Shop discontinued gifts, accessories and home decor at Vintage.",
    keywords:
      "vintage outlet, sale gifts, clearance vintage, last chance finds, تخفيضات, هدايا رخيصة",
    h1: "Outlet & Last-Chance Finds",
    intro:
      "The final pieces from past collections — same hand-selected quality, at a friendlier price. When they are gone, they are gone.",
    faqs: commonFaqs("outlet", "outlet finds"),
  }),
  stickers: page({
    title: "Vintage Stickers & Decorative Labels",
    description:
      "Vintage-style stickers, labels and decorative decals for gifts, journals and packaging. Shop handmade sticker designs at Vintage.",
    keywords:
      "stickers, vintage stickers, decorative labels, sticker packs, ملصقات, استيكرات",
    h1: "Vintage Stickers & Decorative Labels",
    intro:
      "Small details with a lot of character — stickers and labels for journals, gift wrap, laptops and packaging.",
    faqs: commonFaqs("sticker", "stickers"),
  }),
  "mugs-bottles": page({
    title: "Vintage Mugs, Bottles & Drinkware",
    description:
      "Vintage mugs, bottles and drinkware — handmade, reusable and gift-ready. Shop coffee mugs and water bottles at Vintage.",
    keywords:
      "vintage mugs, coffee mugs, reusable bottles, drinkware gifts, اكواب, قوارير, هدايا اكواب",
    h1: "Vintage Mugs, Bottles & Drinkware",
    intro:
      "Morning rituals, made lovelier. Hand-picked mugs and bottles that are as practical as they are giftable.",
    faqs: commonFaqs("mug", "mugs and bottles"),
  }),
  "mask-hat-crown": page({
    title: "Hats, Crowns & Costume Accessories",
    description:
      "Vintage hats, crowns and costume accessories for parties, photoshoots and celebrations. Shop statement headwear at Vintage.",
    keywords:
      "vintage hats, crowns, costume accessories, party headwear, تاج, اكسسوارات حفلات",
    h1: "Hats, Crowns & Costume Accessories",
    intro:
      "Statement headwear for parties, photoshoots and dress-up — the finishing touch that makes an outfit.",
    faqs: commonFaqs("hat", "hats and crowns"),
  }),
  "mystery-box": page({
    title: "Mystery Gift Boxes",
    description:
      "Mystery gift boxes filled with curated vintage surprises — prints, accessories and keepsakes. Discover your box at Vintage.",
    keywords:
      "mystery box, surprise gift box, curated gift box, vintage mystery box, صندوق مفاجآت, هدايا مفاجئة",
    h1: "Mystery Gift Boxes",
    intro:
      "A little surprise, carefully curated. Each box brings together vintage-inspired finds chosen by our studio.",
    faqs: commonFaqs("mystery box", "mystery boxes"),
  }),
  "umrah-hajj": page({
    title: "Umrah & Hajj Gifts and Islamic Keepsakes",
    description:
      "Umrah and Hajj gifts, Islamic keepsakes and thoughtful gift sets for pilgrims. Shop respectful, handmade gifts at Vintage.",
    keywords:
      "umrah gifts, hajj gifts, islamic keepsakes, pilgrimage gifts, هدايا عمرة, هدايا حج, هدايا إسلامية",
    h1: "Umrah & Hajj Gifts",
    intro:
      "Thoughtful, respectful gifts to mark a meaningful journey — keepsakes made with care and delivered beautifully boxed.",
    faqs: commonFaqs("pilgrimage", "pilgrimage gifts"),
  }),
  accessories: page({
    title: "Vintage Accessories — Watches, Jewellery & More",
    description:
      "Vintage accessories — gold-tone watches, jewellery, bags and small leather goods. Shop hand-selected accessories at Vintage.",
    keywords:
      "vintage accessories, gold watch, jewellery, leather goods, handbags, اكسسوارات, اكسسوارات فينتج, ساعات",
    h1: "Vintage Accessories",
    intro:
      "The small things that change everything — serviced watches, jewellery, bags and leather pieces chosen for craft, not logos.",
    faqs: commonFaqs("accessory", "accessories"),
  }),
  clothing: page({
    title: "Vintage Clothing & Restored Garments",
    description:
      "Vintage clothing — restored dresses, linen pieces and 70s-inspired garments. Shop one-of-a-kind handmade fashion at Vintage.",
    keywords:
      "vintage clothing, vintage dresses, linen clothing, 70s fashion, restored garments, ملابس فينتج, فساتين",
    h1: "Vintage Clothing",
    intro:
      "Soft linen, bold prints and properly restored pieces — one-of-a-kind garments with a past and a future.",
    faqs: commonFaqs("clothing", "clothing"),
  }),
  decor: page({
    title: "Vintage Home Decor & Handmade Ornaments",
    description:
      "Vintage home decor — restored accents, framed prints and handmade ornaments. Shop unique decor pieces at Vintage.",
    keywords:
      "vintage home decor, handmade ornaments, framed prints, home accessories, ديكور, ديكور منزلي, تحف",
    h1: "Vintage Home Decor",
    intro:
      "Objects with character for shelves, walls and corners — each one chosen to make a room feel lived in and loved.",
    faqs: commonFaqs("decor", "home decor"),
  }),
  furniture: page({
    title: "Restored Vintage Furniture",
    description:
      "Restored vintage furniture — chesterfield sofas, club chairs and statement pieces. Shop hand-finished furniture at Vintage.",
    keywords:
      "vintage furniture, restored sofa, chesterfield, club chair, mid century furniture, أثاث فينتج, كنب",
    h1: "Restored Vintage Furniture",
    intro:
      "Properly restored sofas, chairs and statement pieces — solid, comfortable and ready to arrive looking like they always belonged.",
    faqs: commonFaqs("furniture", "furniture"),
  }),
};

export const getCategorySeo = (category) => {
  const slug = String(category?.slug || "").toLowerCase();
  const configured = CATEGORY_SEO[slug];
  if (configured) return configured;
  const name = category?.name || "Collection";
  return page({
    title: `${name} Gifts & Vintage Finds`,
    description: `Shop ${name.toLowerCase()} at Vintage — hand-selected, handmade pieces and gift-ready finds for every occasion.`,
    keywords: `${name.toLowerCase()}, vintage ${name.toLowerCase()}, handmade gifts, هدايا, فينتج`,
    h1: name,
    intro: `Explore our hand-picked ${name.toLowerCase()} collection — considered pieces, beautifully boxed.`,
    faqs: commonFaqs(name.toLowerCase(), name.toLowerCase()),
  });
};

export const ROUTE_SEO = {
  "/shop": {
    title: "Shop Vintage Gifts, Accessories & Home Decor",
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
  },
  "/about": {
    title: "Our Story — Handmade Since Day One",
    description:
      "Meet the studio behind Vintage: a small team restoring vintage furniture, curating garments and handmaking gifts with care.",
    keywords: "vintage studio, handmade gifts, our story, restored furniture, فينتج",
  },
  "/contact": {
    title: "Contact Vintage — Custom Orders & Support",
    description:
      "Questions about an order or a custom gift? Contact the Vintage studio by email, phone or WhatsApp — we reply quickly.",
    keywords: "contact vintage, custom orders, gift consultation, تواصل معنا",
  },
  "/info/faq": {
    title: "Frequently Asked Questions",
    description:
      "Answers about vintage orders, payments, shipping, returns, stock and custom gift boxes at Vintage.",
    keywords: "vintage faq, shipping, returns, custom orders, الأسئلة الشائعة",
  },
  "/info/shipping-returns": {
    title: "Shipping & Returns",
    description:
      "Flat $12 tracked shipping, careful packaging and a 14-day return window. Read the Vintage shipping and returns policy.",
    keywords: "shipping, returns, tracked delivery, الشحن والاسترجاع",
  },
  "/info/privacy-policy": {
    title: "Privacy Policy",
    description:
      "How Vintage handles your personal data, orders and newsletter details. Read our privacy policy.",
    keywords: "privacy policy, خصوصية, حماية البيانات",
  },
  "/info/custom-orders": {
    title: "Custom Orders & Personalised Gifts",
    description:
      "Have an idea in mind? Vintage creates bespoke gift boxes, prints and restored pieces made to your brief.",
    keywords: "custom orders, personalised gifts, bespoke gift box, هدايا مخصصة",
  },
};
