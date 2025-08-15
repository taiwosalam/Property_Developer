export interface DashboardCard {
  title: string;
  value: number | string;
  subValue: number | string;
  icon: React.ReactNode;
  bg: string;
  link?: string;
}

// Define the shape of branchData
export interface BranchData {
  properties?: Stats;
  landlords?: Stats;
  tenants?: Stats;
  vacant_units?: Stats;
  expired?: Stats;
  invoices?: Stats;
  inquiries?: Stats;
  complaints?: Stats;
  listings?: Stats;
}
