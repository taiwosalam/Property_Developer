export type InventoryApiResponse = {
  status: "success";
  statusCode: number;
  total_month: number;
  total: number;
  inventories: Inventory[];
  pagination: Pagination;
  message: string;
};

type Inventory = {
  id: number;
  title: string;
  video: string;
  branch_id: number;
  branch_name: string;
  property_name: string | null;
  account_officer: AccountOfficer;
  items: InventoryItem[];
  created_at: string;
  updated_at: string;
};

type AccountOfficer = {
  id: number | null;
  name: string | null;
};

type InventoryItem = {
  id: number;
  description: string;
  unit: string;
  condition: string;
  image: string[];
};

type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type InventoryPageState = {
  total: number;
  this_month: number;
  inventories: {
    id: string;
    title: string;
    branch_name: string;
    property_name: string;
    account_officer: string;
    last_edited: string;
    created_date: string;

  }[];
};

export const transformInventoryApiResponse = (data: InventoryApiResponse): InventoryPageState => {
  return {
    total: data.total ?? 0,
    this_month: data.total_month ?? 0,
    inventories: data.inventories.map((inventory) => {
      return {
        id: inventory.id ? inventory?.id?.toString() : "1",
        title: inventory.title ?? "___ ___",
        branch_name: inventory.branch_name ?? "___ ___",
        property_name: inventory.property_name ?? "___ ___",
        account_officer: inventory.account_officer.name ?? "___ ___",
        last_edited: inventory.updated_at ?? "___ ___",
        created_date: inventory.created_at ?? "___ ___",
      };
    }),
  };
};
