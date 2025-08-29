export interface InventoryItem {
    id: string;
    name: string;
    image: string;
    price: string;
    unit: string;
    remaining: number;
}

export interface InventorySection {
    id: string;
    title: string;
    items: InventoryItem[];
}
