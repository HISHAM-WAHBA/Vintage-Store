import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import { api } from "../services/api";
import { ProductCard } from "./ShopPage";
import { useSeo } from "../utils/seo";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  getCategorySeo,
} from "../data/seoContent";

/**
 * Keyword-focused collection landing pages. They use the same catalog API and
 * product cards as the shop — no new data source, no change to existing views.
 */
const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([items, cats]) => {
        setProducts(items);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const category = useMemo(
    () =>
      categories.find(
        (item) =>
          item.slug === slug || String(item.id) === String(slug),
      ),
    [categories, slug],
  );

  const seo = category ? getCategorySeo(category) : null;

  const items = useMemo(() => {
    if (!category) return [];
    const name = String(category.name).toLowerCase();
    return products.filter((product) =>
      (product.categories || []).some(
        (value) => String(value).toLowerCase() === name,
      ),
    );
  }, [products, category]);

  useSeo({
    title: seo?.title || "Vintage Collections",
    description: seo?.description || DEFAULT_DESCRIPTION,
    keywords: seo?.keywords || DEFAULT_KEYWORDS,
    path: category ? `/category/${category.slug}` : `/category/${slug}`,
    image: items[0]?.image || category?.image,
    jsonLd: category
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: seo?.h1 || category.name,
              description: seo?.description,
            },
            {
              "@type": "ItemList",
              numberOfItems: items.length,
              itemListElement: items.map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `/product/${product.id}`,
                name: product.name,
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: (seo?.faqs || []).map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ],
        }
      : undefined,
  });

  if (!loading && !category) {
    return (
      <main className="mx-auto max-w-container-max px-margin-mobile py-stack-lg text-center md:px-margin-desktop">
        <h1 className="font-headline-lg text-headline-lg text-primary">
          Collection not found
        </h1>
        <Link to="/shop" className="mt-4 inline-block text-primary underline">
          Browse all products
        </Link>
      </main>
    );
  }

  const faqs = seo?.faqs || [];

  return (
    <main className="mx-auto w-full max-w-container-max px-margin-mobile py-stack-md pb-stack-lg md:px-margin-desktop md:py-stack-lg">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 font-label-sm text-label-sm text-on-surface-variant"
      >
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <Icon name="chevron_right" size={14} />
        <Link to="/shop" className="hover:text-primary">
          Shop
        </Link>
        <Icon name="chevron_right" size={14} />
        <span className="text-primary">{category?.name || "Collection"}</span>
      </nav>

      <header className="mb-stack-lg max-w-3xl">
        <h1 className="mb-4 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
          {seo?.h1 || category?.name || "Collection"}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {seo?.intro || DEFAULT_DESCRIPTION}
        </p>
      </header>

      <section aria-label="Products in this collection">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] animate-pulse rounded-xl bg-surface-container-low"
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-gutter">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-outline-variant p-12 text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Nothing here just yet
            </h2>
            <p className="mt-2 text-on-surface-variant">
              This collection is being curated — explore the rest of the shop.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-block rounded-full bg-primary px-6 py-2 text-on-primary"
            >
              Shop all products
            </Link>
          </div>
        )}
      </section>

      {faqs.length > 0 && (
        <section className="mt-stack-lg max-w-3xl">
          <h2 className="mb-6 font-headline-lg text-headline-lg text-primary">
            Common questions
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4"
              >
                <summary className="cursor-pointer font-label-md text-label-md text-primary">
                  {faq.q}
                </summary>
                <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mt-stack-lg">
          <h2 className="mb-6 font-headline-md text-headline-md text-primary">
            Explore other collections
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories
              .filter((item) => item.slug !== category?.slug)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/category/${item.slug}`}
                  className="rounded-full bg-surface-container px-4 py-2 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default CategoryPage;
