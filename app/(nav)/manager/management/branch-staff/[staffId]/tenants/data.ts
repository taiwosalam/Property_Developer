import { empty } from "@/app/config";
import {
  StaffTenantPageData,
  StaffTenant,
  StaffTenantPagination,
} from "./types";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";

export const transformStaffTenantsApiResponse = (
  apiData: any
): StaffTenantPageData => {
  const tenants: StaffTenant[] =
    apiData?.data?.tenants?.data?.map((t: any) => ({
      id: String(t.id),
      picture_url: t.picture || empty,
      name: t.name,
      title: t.title || "",
      user_tag: t.user_tag || (t.email?.includes("mobile") ? "mobile" : "web"),
      email: t.email,
      phone_number: t.phone,
      badge_color: t.user_tier
        ? tierColorMap[t.user_tier as keyof typeof tierColorMap]
        : undefined,
      note: t.note || "",
      flagged: t.flagged || false,
    })) || [];

  const pagination: StaffTenantPagination = {
    current_page: apiData?.data?.tenants?.pagination?.current_page || 1,
    total_page: apiData?.data?.tenants?.pagination?.total_pages || 1,
  };

  const staff = {
    name: apiData?.data?.name || "",
    role: apiData?.data?.position || "",
  };

  return {
    tenants,
    pagination,
    staff,
  };
};
