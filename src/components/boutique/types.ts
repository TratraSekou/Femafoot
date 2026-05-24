export type ProductCategory = 'Maillots' | 'Équipements' | 'Accessoires' | 'Lifestyle';
export type OrderStatus = 'EN ATTENTE' | 'EN TRAITEMENT' | 'VALIDÉE' | 'ANNULÉE' | 'EXPIRÉE' | 'RÉCUPÉRÉE';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  sizes: string[];
  stock: number;
  reserved: number;
  image: string;
  description: string;
  isPopular?: boolean;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  clientName: string;
  clientPhone: string;
  clientNeighborhood: string;
  clientEmail?: string;
  date: string;
  status: OrderStatus;
  expiresAt: string; // ISO string
}

export interface BoutiqueStats {
  totalProducts: number;
  pendingOrders: number;
  revenue: number;
  lowStock: number;
  reservedItems: number;
}
