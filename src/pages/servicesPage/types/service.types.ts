export type ServiceCategory = 'ear' | 'nose' | 'throat' | 'larynx';

export interface Service {
    id: number;
    name: string;
    price: string;
    category: ServiceCategory;
}

export interface CategoryInfo {
    id: ServiceCategory;
    title: string;
    icon: string;
    description: string;
}
