import { PRODUCTS } from '@/data/mock';

export function useProducts() {
  // In the future, this will fetch from Supabase
  const getAllProducts = () => PRODUCTS;
  
  const getProductBySlug = (slug: string) => 
    PRODUCTS.find(p => p.id === slug || p.name.toLowerCase().replace(/ /g, '-') === slug);

  const getProductsByCategory = (category: string) =>
    PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());

  return {
    products: PRODUCTS,
    getAllProducts,
    getProductBySlug,
    getProductsByCategory
  };
}
