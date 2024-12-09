export interface InventoryRequestParams{
    search?: string;
    sort?: 'asc' | 'desc'
    page?: number;
    branch_id?: string;
    start_date?: string;
    end_date?: string;
}