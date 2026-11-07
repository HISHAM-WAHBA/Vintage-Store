const STRAPI_URL = "http://localhost:1337";

const mapStrapiProduct = (item) => {
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description,
    image: item.image?.url ? `${STRAPI_URL}${item.image.url}` : "",
    categories: item.categories ? item.categories.map((cat) => cat.name) : [],
  };
};

export const api = {
  getProducts: async () => {
    const response = await fetch(`${STRAPI_URL}/api/products?populate=*`);
    const result = await response.json();
    return result.data.map((item) => mapStrapiProduct(item));
  },

  getProductById: async (id) => {
    const response = await fetch(`${STRAPI_URL}/api/products/${id}?populate=*`);
    const result = await response.json();
    return mapStrapiProduct(result.data);
  },

  getCategories: async () => {
    const response = await fetch(`${STRAPI_URL}/api/categories`);
    const result = await response.json();
    return result.data;
  },
};
