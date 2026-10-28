// Plain JSON shapes passed from the server to components (dates as ISO strings).

export type ProjectDTO = {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  author?: string;
  image: string;
  images?: string[];
  avatars?: { src: string }[];
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  order: number;
  link?: string;
  tags?: string[];
  content: string;
  metadata?: { readTime?: string; views?: number; likes?: number };
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string };
};

export type PostDTO = {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  order: number;
  tags?: string[];
  content: string;
  author?: string;
  metadata?: { readTime?: string; views?: number; likes?: number; tag?: string };
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string };
};

export type GalleryImageDTO = {
  id: string;
  url: string;
  thumbnail: string;
  medium: string;
  large: string;
  width: number;
  height: number;
  format?: string;
  createdAt?: string;
};
