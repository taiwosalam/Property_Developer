import { ReactNode, CSSProperties } from "react";
import { SxProps, Theme } from "@mui/system";

export interface BranchProps {
  id: string | number;
  branch_title: string;
  branch_full_address: string;
  avatar: string | null;
  manager_name: string | null;
  manager_avatar: string | null;
  staff_count: number;
  property_count: number;
  unit_count: number;
}
