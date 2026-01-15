export interface ProductModel {
  _id?: string;
  itemId: string;           // Link to ItemApiData._id
  webTitle: string;         // Customer-facing name
  slug: string;             // URL-friendly path (e.g., /product/premium-item)
  shortDescription: string;
  longDescription: string;  // HTML/Rich text
  images: string[];         // Multiple images for slider
  videoUrl?: string;
  webCategory: string[];    // Front-end categories (different from inventory cat)
  isPublished: boolean;
  isFeatured: boolean;
  discountedPrice: number;  // Special web offer price
  tags: string[];           // For web search
  metaTitle: string;
  metaDescription: string;
}