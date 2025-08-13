export interface Product {
    id: number;
    name: string;
    barcode: string;
    price: number;
    discount_nominal: number;
    stock: number;
    is_consignment: boolean;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}