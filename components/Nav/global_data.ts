export interface GlobalSearchApiResponse {
  query: string;
  results: {
    users: Array<{
      id: number;
      encodedId: string;
      name: string | null;
      email: string | null;
      phone: string | null;
      username: string | null;
      referrer_code: string | null;
      email_verified_at: string | null;
      phone_verified_at: string | null;
      username_updated_at: string | null;
      is_active: boolean;
      is_company_owner: boolean;
      tier_id: number;
      last_seen: string | null;
      provider_id: string | null;
      provider_name: string | null;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
      searchable_type: "users";
      is_verified: boolean;
      unread_messages_count: number;
      unread_notifications_count: number;
      profile_completion_status: string;
      is_subscription_expired: boolean;
      current_plan: string | null;
      current_subscription_expiry: string | null;
      profile: {
        id: number;
        user_id: number;
        type: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        picture: string | null;
        background_image: string | null;
        title: string | null;
        gender: string | null;
        address: string | null;
        state: string | null;
        lga: string | null;
        city: string | null;
        bio: string | null;
        dob: string | null;
        religion: string | null;
        marital_status: string | null;
        occupation: string | null;
        job_type: string | null;
        family_type: string | null;
        facebook: string | null;
        x: string | null;
        instagram: string | null;
        linkedin: string | null;
        youtube: string | null;
        tiktok: string | null;
        website: string | null;
        note: string | null;
        bvn_link_at: string | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        bvn_linked: boolean;
        completion_status: string;
      };
      roles: Array<{
        id: number;
        name: string;
        guard_name: string;
        created_at: string;
        updated_at: string;
        pivot: {
          model_type: string;
          model_id: number;
          role_id: number;
        };
      }>;
    }>;
    properties: Array<{
      id: number;
      branch_id: number;
      inventory_id: number | null;
      landlord_id: number | null;
      user_id: number;
      company_id: number;
      video_link: string | null;
      title: string;
      state: string;
      local_government: string;
      city_area: string;
      full_address: string;
      category: string;
      description: string;
      property_type: string;
      agency_fee: number;
      who_to_charge_new_tenant: string | null;
      who_to_charge_renew_tenant: string | null;
      caution_deposit: string | null;
      group_chat: boolean;
      rent_penalty: boolean;
      fee_penalty: boolean;
      request_call_back: boolean;
      book_visitors: boolean;
      vehicle_record: boolean;
      active_vat: boolean;
      currency: string;
      coordinate: string | null;
      management_fee: number;
      fee_period: string | null;
      is_featured: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      searchable_type: "properties";
      image_count: number;
      unit_count: number;
      review_count: number;
    }>;
    units: Array<{
      id: number;
      user_id: number;
      property_id: number;
      tenant_id: number | null;
      unit_name: string;
      unit_type: string;
      unit_sub_type: string | null;
      unit_preference: string;
      measurement: string;
      bedroom: string;
      bathroom: string;
      toilet: number;
      facilities: string[] | null;
      en_suit: boolean;
      prepaid: boolean;
      wardrobe: boolean;
      pet_allowed: boolean;
      total_area_sqm: string;
      number_of: string;
      fee_period: string;
      fee_amount: string;
      vat_amount: string;
      security_fee: string;
      service_charge: string;
      agency_fee: string;
      legal_fee: string;
      caution_fee: string;
      inspection_fee: string;
      management_fee: string | null;
      other_charge: string;
      negotiation: boolean;
      total_package: string;
      renew_fee_period: string;
      renew_fee_amount: string;
      renew_vat_amount: string;
      renew_service_charge: string;
      renew_other_charge: string;
      renew_total_package: string;
      renew_agency_fee: string;
      renew_security_fee: string;
      renew_legal_fee: string | null;
      renew_caution_fee: string | null;
      renew_inspection_fee: string | null;
      renew_management_fee: string | null;
      is_active: string;
      published: boolean;
      status: string;
      reject_reason: string | null;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      searchable_type: "units";
    }>;
    landlords: Array<{
      profile_id: number;
      profile: {
        id: number;
        type: string;
        name: string;
        email: string;
      };
    }>;
    tenants: Array<{
      profile_id: number;
      profile: {
        id: number;
        name: string;
        email: string;
        type: string;
      };
    }>;
    agentCommunities: any[];
    agentRequests: any[];
    property_application: any[];
    branches: any[];
    announcements: any[];
    brands: any[];
    campaigns: any[];
  };
  meta: SearchResponseMeta;
}

interface SearchResponseMeta {
  total: number;
  details: {
    users: SearchResponseMetaDetails;
    properties: SearchResponseMetaDetails;
    landlords: SearchResponseMetaDetails;
    tenants: SearchResponseMetaDetails;
    units: SearchResponseMetaDetails;
    agentCommunities: SearchResponseMetaDetails;
    agentRequests: SearchResponseMetaDetails;
    property_application: SearchResponseMetaDetails;
    branches: SearchResponseMetaDetails;
    announcements: SearchResponseMetaDetails;
    brands: SearchResponseMetaDetails;
    campaigns: SearchResponseMetaDetails;
  };
}

interface SearchResponseMetaDetails {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

interface ISearchItem {
  type: string;
  title: string;
  subtitle: string;
  extra: string;
  icon: string;
  isVerified?: boolean;
  tier_id?: number;
  link: string;
}

interface IPaginationMeta {
  current_page: number;
  last_page: number;
}
export interface IGlobalSearchPageData {
  query: string;
  results: {
    users: ISearchItem[];
    properties: ISearchItem[];
    landlords: ISearchItem[];
    tenants: ISearchItem[];
    units: ISearchItem[];
    agentCommunities: ISearchItem[];
    agentRequests: ISearchItem[];
    propertyApplications: ISearchItem[];
    announcements: ISearchItem[];
    branches: ISearchItem[];
    brands: ISearchItem[];
    campaigns: ISearchItem[];
  };
  counts: {
    users: number;
    properties: number;
    units: number;
    agentCommunities: number;
    agentRequest: number;
    landlords: number;
    tenants: number;
    brands: number;
    announcement: number;
    campaigns: number;
    propertyApplications: number;
    branches: number;
    //wallets: number;
  };
  pagination: {
    users: IPaginationMeta;
    properties: IPaginationMeta;
    units: IPaginationMeta;
    agentCommunities: IPaginationMeta;
    agentRequests: IPaginationMeta;
    landlords: IPaginationMeta;
    tenants: IPaginationMeta;
    brands: IPaginationMeta;
    announcement: IPaginationMeta;
    campaigns: IPaginationMeta;
    propertyApplication: IPaginationMeta;
    branches: IPaginationMeta;
  };
}
export const transformGlobalSearchPageData = (
  res: GlobalSearchApiResponse
): IGlobalSearchPageData => {
  const {
    query,
    meta: { details },
    results,
  } = res;
  return {
    query: query,
    results: {
      users:
        results && results.users
          ? results.users.map((user) => ({
              id: user?.id,
              type: "users",
              title: user.name?.toLowerCase() || "Unknown User",
              subtitle: user.email || "No email",
              extra: user.roles?.[0]?.name || "",
              icon: "people",
              isVerified: user.is_verified || false,
              tier_id: user.tier_id,
              link: "",
            }))
          : [],
      landlords:
        results && results.landlords && results.landlords.length > 0
          ? results?.landlords?.map((landlord) => ({
              id: landlord?.profile_id,
              type: landlord?.profile?.type,
              subtitle: landlord?.profile?.email,
              extra: "",
              icon: "people",
              isVerified: false,
              title: landlord?.profile?.name,
              link: "/management/landlord",
            }))
          : [],
      tenants:
        results && results.tenants && results.tenants.length > 0
          ? results?.tenants?.map((tenant) => ({
              id: tenant?.profile_id,
              type: tenant?.profile?.type,
              subtitle: tenant?.profile?.email,
              extra: "",
              icon: "people",
              isVerified: false,
              title: tenant?.profile?.name,
              link: "/management/tenants",
            }))
          : [],
      properties:
        results && results.properties && results.properties.length > 0
          ? results.properties.map((property) => ({
              id: property?.id,
              type: "properties",
              title: property.title || "Unknown Property",
              subtitle: property.full_address || "No address",
              extra: property.category || "No category",
              icon: "people",
              link: "/management/properties",
            }))
          : [],
      units:
        results && results.units && results.units.length > 0
          ? results.units.map((unit) => ({
              id: unit?.id,
              type: "units",
              title: unit.unit_name || "Unknown Unit",
              subtitle: unit.unit_type || "No type",
              extra: `₦${unit.total_package || "0"}`,
              icon: "chart",
              link: "/listing/units",
            }))
          : [],
      agentCommunities:
        results &&
        results.agentCommunities &&
        results.agentCommunities.length > 0
          ? results.agentCommunities.map((community) => ({
              id: community?.id,
              type: "Agent Community",
              title: community.title || "Unknown Community",
              subtitle: community.description || "No description",
              extra: "Community",
              icon: "menu_board",
              link: "/community/agent-forum",
            }))
          : [],
      agentRequests:
        results && results.agentRequests && results.agentRequests.length > 0
          ? results.agentRequests.map((request) => ({
              id: request?.id,
              type: "Agent Requests",
              title: request.title || "Unknown Request",
              subtitle: request.description || "No description",
              extra: "Request",
              icon: "menu_board",
              link: "/community/agent-request",
            }))
          : [],
      propertyApplications:
        results &&
        results.property_application &&
        results.property_application.length > 0
          ? results.property_application.map((application) => ({
              id: application?.id,
              type: "Property Application",
              title: application.title || "Unknown Application",
              subtitle: application.description || "No description",
              extra: "Application",
              icon: "menu_board",
              link: "/tasks/applications",
            }))
          : [],
      branches:
        results && results.branches && results.branches.length > 0
          ? results.branches.map((branch) => ({
              id: branch?.id,
              type: "Branch",
              title: branch.name || branch.branch_name || "Unknown Branch",
              subtitle:
                branch.location || branch.branch_address || "No location",
              extra: "Branch",
              icon: "menu_board",
              link: "/management/staff-branch",
            }))
          : [],
      announcements:
        results && results.announcements && results.announcements.length > 0
          ? results.announcements.map((announcement) => ({
              id: announcement?.id,
              type: "Announcement",
              title: announcement.title || "Unknown Announcement",
              subtitle: announcement.description || "No description",
              extra: "Announcement",
              icon: "menu_board",
              link: "/tasks/announcements",
            }))
          : [],
      brands:
        results && results.brands && results.brands.length > 0
          ? results.brands.map((brand) => ({
              id: brand?.id,
              type: "Brand",
              title:
                brand.type +
                  " " +
                  (brand.period ? `(${brand.period} months)` : "") ||
                "Unknown Brand",
              subtitle: brand.page || "No description",
              extra: "Brand",
              icon: "settings",
              link: "/settings/add-on",
            }))
          : [],
      campaigns:
        results && results.campaigns && results.campaigns.length > 0
          ? results.campaigns.map((campaign) => ({
              id: campaign?.id,
              type: "Campaign",
              title:
                campaign.name +
                  " " +
                  `(${Math.round(Number(campaign.period))} months)` ||
                "Unknown Campaign",
              subtitle:
                "Amount Paid: " + campaign.formatted_amount || "No description",
              extra: "Campaign",
              icon: "settings",
              link: "/settings/add-on",
            }))
          : [],
    },
    counts: {
      users: details?.users?.total || 0,
      properties: details?.properties?.total || 0,
      landlords: details?.landlords?.total || 0,
      tenants: details?.tenants?.total || 0,
      units: details?.units?.total || 0,
      agentCommunities: details?.agentCommunities?.total || 0,
      agentRequest: details?.agentRequests?.total || 0,
      propertyApplications: details?.property_application?.total || 0,
      branches: details?.branches?.total || 0,
      announcement: details?.announcements?.total || 0,
      brands: details?.brands?.total || 0,
      campaigns: details?.campaigns?.total || 0,
    },
    pagination: {
      users: {
        current_page: details?.users?.current_page || 1,
        last_page: details?.users?.last_page || 1,
      },
      properties: {
        current_page: details?.properties?.current_page || 1,
        last_page: details?.properties?.last_page || 1,
      },
      landlords: {
        current_page: details?.landlords?.current_page || 1,
        last_page: details?.landlords?.last_page || 1,
      },
      tenants: {
        current_page: details?.tenants?.current_page || 1,
        last_page: details?.tenants?.last_page || 1,
      },
      units: {
        current_page: details?.units?.current_page || 1,
        last_page: details?.units?.last_page || 1,
      },
      agentCommunities: {
        current_page: details?.agentCommunities?.current_page || 1,
        last_page: details?.agentCommunities?.last_page || 1,
      },
      agentRequests: {
        current_page: details?.agentRequests?.current_page || 1,
        last_page: details?.agentRequests.last_page || 1,
      },
      propertyApplication: {
        current_page: details?.property_application?.current_page || 1,
        last_page: details?.property_application?.last_page || 1,
      },
      branches: {
        current_page: details?.branches?.current_page || 1,
        last_page: details?.branches?.last_page || 1,
      },
      announcement: {
        current_page: details?.announcements?.current_page || 1,
        last_page: details?.announcements?.last_page || 1,
      },
      brands: {
        current_page: details?.brands?.current_page || 1,
        last_page: details?.brands?.last_page || 1,
      },
      campaigns: {
        current_page: details?.campaigns?.current_page || 1,
        last_page: details?.campaigns?.last_page || 1,
      },
    },
  };
};
