import { Product } from '../types';

export const mockProducts: Product[] = [];

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/server-products');
    if (!response.ok) throw new Error('Failed to fetch from server');
    
    const result = await response.json();
    if (result.success && result.data) {
      // Map database snake_case to camelCase
      return result.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.original_price, // mapping from DB
        image: item.image,
        category: item.category,
        isNew: item.is_new,
        rating: item.rating,
        reviewCount: item.review_count
      }));
    }
  } catch (error) {
    console.error('Error fetching products, defaulting to empty array', error);
  }
  return [];
}

