import { useEffect } from "react";
import { API_ORIGIN } from "./assets";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "../data/seoContent";

/** Canonical site origin — env-driven so a domain change needs only one var. */
export const getSiteUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL;
  const origin =
    configured ||
    (typeof window !== "undefined" ? window.location.origin : SITE_URL_FALLBACK);
  return String(origin).replace(/\/+$/, "");
};

export const absoluteUrl = (value = "/") => {
  if (!value) return getSiteUrl();
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${getSiteUrl()}${value.startsWith("/") ? "" : "/"}${value}`;
};

/** Product/category images may be relative to the API, not to the storefront. */
export const absoluteImage = (value) => {
  if (!value) return absoluteUrl("/vintage-logo.png");
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (String(value).startsWith("/api/")) return `${API_ORIGIN}${value}`;
  return absoluteUrl(value);
};

const setMeta = (key, attribute, name, content) => {
  let element = document.head.querySelector(`[data-seo="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("data-seo", key);
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const setLink = (key, rel, href) => {
  let element = document.head.querySelector(`[data-seo="${key}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("data-seo", key);
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

/**
 * Per-page head manager. Everything it creates is tagged with `data-seo` and
 * removed on unmount, so navigating between routes never leaves stale tags.
 */
export const useSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  path = "/",
  image,
  type = "website",
  jsonLd,
  noindex = false,
} = {}) => {
  const documentTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = absoluteUrl(path);
  const ogImage = absoluteImage(image || "/vintage-logo.png");
  const structured = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = documentTitle;

    setMeta("description", "name", "description", description);
    setMeta("keywords", "name", "keywords", keywords);
    setMeta(
      "robots",
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    );
    setLink("canonical", "canonical", url);

    setMeta("og:type", "property", "og:type", type);
    setMeta("og:site_name", "property", "og:site_name", SITE_NAME);
    setMeta("og:title", "property", "og:title", documentTitle);
    setMeta("og:description", "property", "og:description", description);
    setMeta("og:url", "property", "og:url", url);
    setMeta("og:image", "property", "og:image", ogImage);

    setMeta("twitter:card", "name", "twitter:card", "summary_large_image");
    setMeta("twitter:title", "name", "twitter:title", documentTitle);
    setMeta("twitter:description", "name", "twitter:description", description);
    setMeta("twitter:image", "name", "twitter:image", ogImage);

    if (jsonLd) {
      let script = document.head.querySelector('[data-seo="jsonld"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("data-seo", "jsonld");
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = structured;
    } else {
      document.head.querySelector('[data-seo="jsonld"]')?.remove();
    }

    return () => {
      document.head.querySelectorAll("[data-seo]").forEach((element) => element.remove());
    };
  }, [
    documentTitle,
    description,
    keywords,
    url,
    ogImage,
    type,
    noindex,
    structured,
    jsonLd,
  ]);
};
