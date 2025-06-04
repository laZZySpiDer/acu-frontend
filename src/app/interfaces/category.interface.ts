// created_at
// : 
// "2025-02-18T07:59:39.306Z"
// description
// : 
// "Description"
// id
// : 
// "7"
// name
// : 
// "Personalised Dolls"
// parent_category_id
// : 
// null
// updated_at
// : 
// "2025-02-18T07:59:39.306Z"

export interface Category {
  id: number;
  name: string;
  description: string;
  parent_category_id: number | null;
  created_at: string;
  updated_at: string;
  image?:string;
}