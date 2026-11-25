import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  ROUTE_SEO,
  SITE_NAME,
  SITE_URL_FALLBACK,
  getCategorySeo,
} from "./src/data/seoContent.js";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const fetchJson = async (url) => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(12000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${url} -> ${response.status}`);
  return response.json();
};

const baseGraph = (siteUrl) => `
  <script type="application/ld+json">
    ${JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: SITE_NAME,
          url: siteUrl,
          logo: `${siteUrl}/vintage-logo.png`,
          description:
            "A studio curating vintage-inspired gifts, accessories, clothing and home decor.",
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: siteUrl,
          name: SITE_NAME,
          publisher: { "@id": `${siteUrl}/#organization` },
          inLanguage: "en",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        },
      ],
    })}
  </script>`;

const seoHead = ({
  siteUrl,
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  image,
  jsonLd,
  noindex = false,
  type = "website",
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = canonical.startsWith("http") ? canonical : `${siteUrl}${canonical}`;
  const ogImage = image?.startsWith("http")
    ? image
    : `${siteUrl}${image || "/vintage-logo.png"}`;
  const meta = (key, attr, name, content) =>
    `<meta data-seo="${key}" ${attr}="${name}" content="${escapeHtml(content)}" />`;

  return `<!-- SEO:START -->
    <title>${escapeHtml(fullTitle)}</title>
    ${meta("description", "name", "description", description)}
    ${meta("keywords", "name", "keywords", keywords)}
    ${meta(
      "robots",
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    )}
    <link data-seo="canonical" rel="canonical" href="${escapeHtml(url)}" />
    ${meta("og:type", "property", "og:type", type)}
    ${meta("og:site_name", "property", "og:site_name", SITE_NAME)}
    ${meta("og:title", "property", "og:title", fullTitle)}
    ${meta("og:description", "property", "og:description", description)}
    ${meta("og:url", "property", "og:url", url)}
    ${meta("og:image", "property", "og:image", ogImage)}
    ${meta("twitter:card", "name", "twitter:card", "summary_large_image")}
    ${meta("twitter:title", "name", "twitter:title", fullTitle)}
    ${meta("twitter:description", "name", "twitter:description", description)}
    ${meta("twitter:image", "name", "twitter:image", ogImage)}
    ${baseGraph(siteUrl)}
    ${
      jsonLd
        ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
        : ""
    }
    <!-- SEO:END -->`;
};

const staticBody = ({ eyebrow, title, description, links = [] }) => `
  <section style="max-width:960px;margin:0 auto;padding:48px 20px;font-family:sans-serif">
    <p style="letter-spacing:.18em;text-transform:uppercase;color:#8a6b52">${escapeHtml(eyebrow)}</p>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <nav>${links
      .map(
        (link) =>
          `<a href="${escapeHtml(link.href)}" style="margin-right:16px">${escapeHtml(link.label)}</a>`,
      )
      .join("")}</nav>
  </section>`;

const categoryBody = (category, seo, items, categories) => `
  <main style="max-width:1100px;margin:0 auto;padding:32px 20px;font-family:sans-serif">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/shop">Shop</a> / <span>${escapeHtml(category.name)}</span></nav>
    <h1>${escapeHtml(seo.h1)}</h1>
    <p>${escapeHtml(seo.intro)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px">
      ${items
        .map(
          (item) =>
            `<a href="/product/${escapeHtml(item.id)}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="140" height="140" /><span>${escapeHtml(item.name)}</span></a>`,
        )
        .join("")}
    </div>
    <h2>Explore more collections</h2>
    <nav>${categories
      .filter((other) => other.slug !== category.slug)
      .slice(0, 12)
      .map(
        (other) =>
          `<a href="/category/${escapeHtml(other.slug)}" style="margin-right:12px">${escapeHtml(other.name)}</a>`,
      )
      .join("")}</nav>
    <h2>Questions about ${escapeHtml(category.name)}?</h2>
    ${seo.faqs
      .map(
        (faq) =>
          `<details><summary>${escapeHtml(faq.q)}</summary><p>${escapeHtml(faq.a)}</p></details>`,
      )
      .join("")}
  </main>`;

const productBody = (product) => `
  <main style="max-width:960px;margin:0 auto;padding:32px 20px;font-family:sans-serif">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/shop">Shop</a> / <span>${escapeHtml(product.name)}</span></nav>
    <h1>${escapeHtml(product.name)}</h1>
    <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" width="480" height="480" />
    <p>${escapeHtml(product.description || "A hand-selected vintage-inspired piece from our studio.")}</p>
    <p>$${Number(product.price || 0).toFixed(2)}</p>
    <a href="/shop">Back to the shop</a>
  </main>`;

const vintageSeoPlugin = (env) => ({
  name: "vintage-seo-prebuild",
  apply: "build",
  async closeBundle() {
    const outDir = path.resolve(process.cwd(), "dist");
    const indexPath = path.join(outDir, "index.html");
    const siteUrl = String(env.VITE_SITE_URL || SITE_URL_FALLBACK).replace(/\/+$/, "");
    const apiBase = String(
      env.VITE_API_BASE || "http://localhost:4000/api",
    ).replace(/\/+$/, "");
    const apiOrigin = apiBase.replace(/\/api$/, "");

    let base = await fs.readFile(indexPath, "utf8");
    let products = [];
    let categories = [];

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        fetchJson(`${apiBase}/products`),
        fetchJson(`${apiBase}/categories`),
      ]);
      products = productResponse.data || [];
      categories = categoryResponse.data || [];
      console.log(
        `[seo] catalog loaded: ${products.length} products, ${categories.length} categories`,
      );
    } catch (error) {
      console.warn(
        `[seo] API unavailable (${error.message}); generating static routes only.`,
      );
    }

    const absoluteImage = (value) => {
      if (!value) return `${siteUrl}/vintage-logo.png`;
      if (/^(https?:|data:|blob:)/i.test(value)) return value;
      if (String(value).startsWith("/api/")) return `${apiOrigin}${value}`;
      return `${siteUrl}${value}`;
    };

    const writePage = async (routePath, head, body) => {
      const html = base
        .replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, head)
        .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
      const directory = path.join(outDir, routePath);
      await fs.mkdir(directory, { recursive: true });
      await fs.writeFile(path.join(directory, "index.html"), html, "utf8");
    };

    // Canonical origin in the base document (also used by social previews).
    base = base.replaceAll("__SITE_URL__", siteUrl);
    await fs.writeFile(indexPath, base, "utf8");

    await fs.writeFile(
      path.join(outDir, "robots.txt"),
      `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /checkout\nDisallow: /dashboard\nDisallow: /wishlist\nDisallow: /auth\nDisallow: /order-success\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      "utf8",
    );

    const urlEntries = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/shop", priority: "0.9", changefreq: "daily" },
      { path: "/about", priority: "0.6", changefreq: "monthly" },
      { path: "/contact", priority: "0.5", changefreq: "monthly" },
      ...Object.keys(ROUTE_SEO)
        .filter((route) => route.startsWith("/info/"))
        .map((route) => ({ path: route, priority: "0.4", changefreq: "yearly" })),
      ...categories.map((category) => ({
        path: `/category/${category.slug}`,
        priority: "0.7",
        changefreq: "weekly",
      })),
      ...products.map((product) => ({
        path: `/product/${product.id}`,
        priority: "0.6",
        changefreq: "weekly",
        lastmod: String(product.updatedAt || product.createdAt || "").slice(0, 10),
      })),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries
      .map(
        (entry) =>
          `  <url>\n    <loc>${escapeHtml(`${siteUrl}${entry.path}`)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
      )
      .join("\n")}\n</urlset>\n`;
    await fs.writeFile(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

    // Static routes with real meta tags for crawlers that do not run JS.
    for (const [route, seo] of Object.entries(ROUTE_SEO)) {
      const directory = route === "/" ? "" : route.replace(/^\//, "");
      await writePage(
        directory,
        seoHead({
          siteUrl,
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
          canonical: route,
          image: "/vintage-logo.png",
        }),
        staticBody({
          eyebrow: SITE_NAME,
          title: seo.title,
          description: seo.description,
          links: [
            { href: "/shop", label: "Shop all gifts" },
            { href: "/about", label: "Our story" },
            { href: "/contact", label: "Contact" },
          ],
        }),
      );
    }

    // Home page copy (the SPA renders its own hero on top of this shell).
    await writePage(
      "",
      seoHead({
        siteUrl,
        title: "Curated Joy, Beautifully Boxed",
        description: DEFAULT_DESCRIPTION,
        keywords: DEFAULT_KEYWORDS,
        canonical: "/",
        image: absoluteImage(products.find((item) => item.featured)?.image),
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "ItemList",
          numberOfItems: products.length,
          itemListElement: products.slice(0, 12).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/product/${item.id}`,
            name: item.name,
          })),
        },
      }),
      staticBody({
        eyebrow: "Vintage Studio",
        title: "Curated Joy, Beautifully Boxed",
        description: DEFAULT_DESCRIPTION,
        links: [
          { href: "/shop", label: "Shop" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ],
      }),
    );

    for (const category of categories) {
      const seo = getCategorySeo(category);
      const items = products.filter((item) =>
        (item.categories || []).some(
          (name) => String(name).toLowerCase() === String(category.name).toLowerCase(),
        ),
      );
      await writePage(
        `category/${category.slug}`,
        seoHead({
          siteUrl,
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
          canonical: `/category/${category.slug}`,
          image: absoluteImage(items[0]?.image || category.image),
          jsonLd: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                name: seo.h1,
                description: seo.description,
                url: `${siteUrl}/category/${category.slug}`,
              },
              {
                "@type": "ItemList",
                numberOfItems: items.length,
                itemListElement: items.slice(0, 12).map((item, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  url: `${siteUrl}/product/${item.id}`,
                  name: item.name,
                })),
              },
              {
                "@type": "FAQPage",
                mainEntity: seo.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: { "@type": "Answer", text: faq.a },
                })),
              },
            ],
          },
        }),
        categoryBody(category, seo, items, categories),
      );
    }

    for (const product of products) {
      const categoryName = product.categories?.[0] || product.category?.name || "";
      await writePage(
        `product/${product.id}`,
        seoHead({
          siteUrl,
          title: `${product.name}${categoryName ? ` — ${categoryName}` : ""}`,
          description:
            product.description ||
            `Shop ${product.name} at Vintage — hand-selected, gift-ready and delivered with care.`,
          keywords: `${product.name}, ${categoryName}, vintage gifts, handmade, اكسسوارات, هدايا`,
          canonical: `/product/${product.id}`,
          image: absoluteImage(product.image),
          type: "product",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: [absoluteImage(product.image)],
            description:
              product.description || "A hand-selected vintage-inspired piece from our studio.",
            sku: String(product.id),
            brand: { "@type": "Brand", name: SITE_NAME },
            category: categoryName,
            offers: {
              "@type": "Offer",
              url: `${siteUrl}/product/${product.id}`,
              priceCurrency: "USD",
              price: Number(product.price || 0).toFixed(2),
              availability:
                product.quantity == null || Number(product.quantity) > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          },
        }),
        productBody({ ...product, image: absoluteImage(product.image) }),
      );
    }

    console.log(
      `[seo] generated sitemap.xml, robots.txt and ${categories.length + products.length + Object.keys(ROUTE_SEO).length + 1} HTML pages`,
    );
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [react(), tailwindcss(), vintageSeoPlugin(env)],
    server: {
      proxy: {
        // Same-origin API access in development — no CORS needed.
        // The Node.js backend lives in ../Backend (default port 4000).
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
      },
    },
  };
});
