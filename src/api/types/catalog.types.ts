export interface Category {
  _id: string;
  name: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  category: {
    _id: string;
    name: string;
    slug?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
}

export interface CreateServicePayload {
  title: string;
  description?: string;
  price?: number;
  category: string;
}

export interface UpdateServicePayload {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
}
