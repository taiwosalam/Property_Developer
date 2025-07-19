export interface InventoryRequestParams{
    search?: string;
    sort?: 'asc' | 'desc'
    page?: number;
    // branch_id?: string;
    branch_id?: string[];
    accountOfficer_id?: string;
    start_date?: string;
    end_date?: string;
    status?: "used" | "unused";
}


export interface InventoryItemProps {
    id?: string;
    description: string;
    unit: string;
    condition: string;
  }
  

interface InventoryFile {
    [index: number]: File | string;
}
  
interface UpdateInventoryPayloadProps {
    title: string;
    video: string;
    branch_id: string;
    items: {
      id?: string;
      description: string;
      unit: string;
      condition: string;
      retain_media: string[];
      images: File[];
    }[];
  }
  

  export interface PropertyRequestParams{
    search?: string;
    order?: 'asc' | 'desc'
    page?: number;
    current_month?: boolean;
    start_date?: string;
    end_date?: string;
}