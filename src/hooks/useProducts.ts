import { useDbStore } from '@/store/dbStore';

export function useProducts() {
  const products = useDbStore((state) => state.products);
  const loading = useDbStore((state) => state.loading);
  const getProductBySlug = useDbStore((state) => state.getProductBySlug);
  const getBySubcategory = useDbStore((state) => state.getBySubcategory);

  const getAllProducts = () => products;

  const getProductsByCategory = (category: string) =>
    products.filter(p => p.category.toLowerCase() === category.toLowerCase());

  return {
    products,
    loading,
    getAllProducts,
    getProductBySlug,
    getProductsByCategory,
    getBySubcategory
  };
}

