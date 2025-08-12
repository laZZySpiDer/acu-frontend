

import { Category } from "./category.interface";



export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
    category_id: string;
    general_images: Image[];
    sizes: ProductSize[];
    category: Category;
    rating: number;
    reviews: number;
    dimensions: string;
    weight: number;
    material: string;
    main_image_link: Image;
  }
  
  export interface Image {
    id: number;
    image_link: string;
    image_name: string;
  }
  
  export interface ProductSize {
    size: string;
    price: number;
    images: Image[];
    stock_quantity: number;
    dimensions: string;
    weight: number;
    material: string;
    product_variant_id: number;
  }
  
  // export interface Category {
  //   id: number;
  //   name: string;
  // }
  