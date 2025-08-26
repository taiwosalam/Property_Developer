// data.ts
import type { Field } from "@/components/Table/types";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { UserCardProps } from "@/components/Management/landlord-and-tenant-card";
import { PersonalDataProps } from "@/components/tasks/vehicles-record/form-sections";
import { empty } from "@/app/config";

interface OwnerCardProps {
    id: string;
    name: string;
    email: string | null;
    user_tag: "mobile" | "web";
    phone_number: string | null;
    picture_url: string | null;
    badge_color?: BadgeIconColors;
    note?: boolean;
}

export interface OwnersPageData {
    total_owners: number;
    new_owners_this_month: number;
    mobile_owners: number;
    new_mobile_owners_this_month: number;
    web_owners: number;
    new_web_owners_this_month: number;
    total_pages: number;
    current_page: number;
    owners: OwnerCardProps[];
}

export const initialOwnersPageData: OwnersPageData = {
    total_pages: 1,
    current_page: 1,
    total_owners: 0,
    new_owners_this_month: 0,
    mobile_owners: 0,
    new_mobile_owners_this_month: 0,
    web_owners: 0,
    new_web_owners_this_month: 0,
    owners: [],
};

export const getOneOwner = async (id: string) => { };

export const getOwnersHelpInfo = async () => {
    try {
        const response = await fetch(
            `https://kb.ourproperty.ng/property-manager/api/helpinfo/landlord`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const res = await response.json();
        return { success: "True", res };
    } catch (error) {
        return { success: "False", error: (error as Error).message };
    }
};

export const ownerTableFields: Field[] = [
    {
        id: "1",
        accessor: "picture_url",
        isImage: true,
        cellStyle: { paddingRight: "4px" },
    },
    {
        id: "2",
        accessor: "full_name",
        cellStyle: {
            paddingLeft: "4px",
            fontWeight: 700,
            color: "#000",
        },
    },
    {
        id: "3",
        accessor: "email",
        cellStyle: {
            whiteSpace: "nowrap",
        },
    },
    {
        id: "4",
        accessor: "phone_number",
        cellStyle: {
            whiteSpace: "nowrap",
        },
    },
    { id: "5", accessor: "user_tag" },
    { id: "6", accessor: "manage/chat" },
];

const generateMockdata = (numItems: number): OwnerCardProps[] => {
    const names = [
        "Michael Johnson",
        "Sarah Williams",
        "David Brown",
        "Emily Davis",
        "Robert Wilson",
        "Lisa Anderson",
        "James Taylor",
        "Jennifer Martinez",
        "William Garcia",
        "Amanda Rodriguez"
    ];

    const emails = [
        "michael.j@email.com",
        "sarah.w@email.com",
        "david.brown@email.com",
        "emily.davis@email.com",
        "robert.wilson@email.com",
        "lisa.anderson@email.com",
        "james.taylor@email.com",
        "jen.martinez@email.com",
        "will.garcia@email.com",
        "amanda.rod@email.com"
    ];

    const phoneNumbers = [
        "08012345678",
        "08023456789",
        "08034567890",
        "08045678901",
        "08056789012",
        "08067890123",
        "08078901234",
        "08089012345",
        "08090123456",
        "08001234567"
    ];

    return Array.from({ length: numItems }, (_, index) => ({
        id: `${index + 1}`,
        picture_url: "/empty/SampleLandlord.jpeg",
        name: names[index % names.length],
        user_tag: index % 2 === 0 ? "mobile" : "web",
        email: emails[index % emails.length],
        phone_number: phoneNumbers[index % phoneNumbers.length],
        badge_color: index % 5 === 0 ? "black" : index % 3 === 0 ? "red" : "green",
        note: index % 7 === 0,
    }));
};

export const mockData = generateMockdata(10);

// Generate dummy API response data for development/testing
export const generateDummyOwnerApiResponse = (page: number = 1, search?: string): OwnerApiResponse => {
    const totalItems = 45; // Total dummy owners
    const perPage = 10;
    const totalPages = Math.ceil(totalItems / perPage);

    // Filter owners if search is provided
    let filteredOwners = generateMockdata(totalItems);
    if (search) {
        filteredOwners = filteredOwners.filter(owner =>
            owner.name.toLowerCase().includes(search.toLowerCase()) ||
            owner.email?.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Paginate results
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedOwners = filteredOwners.slice(startIndex, endIndex);

    // Transform to API response format
    const apiOwners = paginatedOwners.map(owner => ({
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: {
            user_phone: owner.phone_number,
            profile_phone: owner.phone_number,
        },
        username: owner.name.toLowerCase().replace(' ', '.'),
        picture: owner.picture_url,
        agent: owner.user_tag,
        tier_id: owner.badge_color === "black" ? 1 : owner.badge_color === "red" ? 2 : 3,
        user_tier: owner.badge_color === "black" ? 1 : owner.badge_color === "red" ? 2 : 3,
        note: {
            note: owner.note ? "Important owner note" : null,
        },
    }));

    return {
        data: {
            owners: apiOwners,
            pagination: {
                current_page: page,
                per_page: perPage,
                total_pages: totalPages,
            },
        },
        mobile_owner_count: Math.floor(totalItems * 0.55), // 55% mobile
        web_owner_count: Math.floor(totalItems * 0.45), // 45% web
        mobile_monthly_count: Math.floor(totalItems * 0.12), // 12% new this month
        web_monthly_count: Math.floor(totalItems * 0.08), // 8% new this month
        total_count_monthly: Math.floor(totalItems * 0.20), // 20% total new this month
        total_data_count: totalItems,
    };
};

export interface OwnerApiResponse {
    data: {
        owners: {
            id: string;
            name: string;
            email: string | null;
            phone: {
                user_phone: string | null;
                profile_phone: string | null;
            };
            username: string | null;
            picture: string;
            agent: string;
            tier_id?: 1 | 2 | 3 | 4 | 5;
            user_tier?: 1 | 2 | 3 | 4 | 5;
            note: {
                note: string | null;
            };
        }[];
        pagination: {
            current_page: number;
            per_page: number;
            total_pages: number;
        };
    };
    mobile_owner_count: number;
    web_owner_count: number;
    mobile_monthly_count: number;
    web_monthly_count: number;
    total_count_monthly: number;
    total_data_count: number;
}

export const transformOwnerApiResponse = (
    response: OwnerApiResponse
): OwnersPageData => {
    const {
        data: { owners, pagination },
        mobile_owner_count,
        web_owner_count,
        mobile_monthly_count,
        web_monthly_count,
        total_count_monthly,
        total_data_count,
    } = response;
    return {
        total_owners: total_data_count,
        new_owners_this_month: total_count_monthly,
        mobile_owners: mobile_owner_count,
        new_mobile_owners_this_month: mobile_monthly_count,
        web_owners: web_owner_count,
        new_web_owners_this_month: web_monthly_count,
        total_pages: pagination.total_pages,
        current_page: pagination.current_page,
        owners: owners.map((owner) => ({
            id: owner.id,
            name: owner.name,
            email: owner.email,
            phone_number: `${owner?.phone?.profile_phone || ""}${owner?.phone?.user_phone && owner?.phone?.profile_phone
                ? " / " + owner?.phone?.user_phone
                : ""
                }`,
            user_tag: owner.agent.toLowerCase() === "mobile" ? "mobile" : "web",
            picture_url: owner?.picture,
            note: owner?.note?.note !== null && owner?.note?.note !== "",
            badge_color: owner?.user_tier
                ? tierColorMap[owner?.user_tier]
                : undefined,
        })),
    };
};

export interface OwnerRequestParams {
    page?: number;
    search?: string;
    sort_order?: "asc" | "desc";
    states?: string;
    state?: string;
    start_date?: string;
    end_date?: string;
    date_from?: string;
    date_to?: string;
    agent?: string;
    branch_ids?: string;
    property_ids?: string;
    status?: string;
    tenant_ids?: string;
}

export const transformMobileUseData = (res: any): UserCardProps => {
    const { data } = res;
    const badgeColor =
        tierColorMap[data.tier.id as keyof typeof tierColorMap] || "green";
    return {
        id: data.id,
        name: data.name,
        picture_url: data.profile.picture,
        email: data.email,
        phone_number: data.profile.phone,
        user_tag: "mobile",
        badge_color: badgeColor,
    };
};

export const transformCardData = (data: any): UserCardProps => {
    return {
        name: data.name,
        picture_url: data.picture,
        email: data.email,
        phone_number: data.phone_number,
        user_tag: "web",
        badge_color: "green",
    };
};

export const transformMobileUseDataForVehicleRecord = (
    res: any
): PersonalDataProps => {
    const { data } = res;
    const badgeColor =
        tierColorMap[data.tier.id as keyof typeof tierColorMap] || "green";
    return {
        id: data.id,
        full_name: data.name,
        state: data.profile.state,
        local_government: data.profile.lga,
        avatar: data.profile.picture,
        city: data.profile.city,
        phone_number: data.phone,
        address: data.profile.address,
    };
};

export const transformTenantUserData = (res: any): UserCardProps => {
    const { data } = res;
    const badgeColor =
        tierColorMap[data.user_tier as keyof typeof tierColorMap] || "green";
    return {
        id: data?.id || "",
        name: data?.name || "",
        picture_url: data?.picture || empty,
        email: data?.email || "",
        phone_number: data?.phone?.profile_phone || data?.phone?.user_phone || "",
        user_tag: "mobile",
        badge_color: badgeColor,
    };
};
