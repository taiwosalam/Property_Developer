// data.ts
import type { Field } from "@/components/Table/types";
import { BadgeIconColors, tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { UserCardProps } from "@/components/Management/landlord-and-tenant-card";
import { empty } from "@/app/config";

interface ReferralCardProps {
    id: string;
    name: string;
    email: string | null;
    user_tag: "mobile" | "web";
    phone_number: string | null;
    picture_url: string | null;
    badge_color?: BadgeIconColors;
    note?: boolean;
    referral_source?: string;
    referral_status?: "pending" | "approved" | "rejected";
}

export interface ReferralsPageData {
    total_referrals: number;
    new_referrals_this_month: number;
    mobile_referrals: number;
    new_mobile_referrals_this_month: number;
    web_referrals: number;
    new_web_referrals_this_month: number;
    total_pages: number;
    current_page: number;
    referrals: {
        id: string;
        name: string;
        email: string | null;
        phone_number: string | null;
        picture_url: string | null;
        badge_color?: BadgeIconColors;
        note?: string | null;
        user_tag: "mobile" | "web";
        referral_source?: string;
        referral_status?: "pending" | "approved" | "rejected";
        user_id?: string;
        title?: string;
        picture?: string;
        gender?: string;
        birthday?: string;
        religion?: string;
        marital_status?: string;
        bank_name?: string;
        account_name?: string;
        account_number?: string;
        occupation?: string;
        employment_type?: string;
        family_type?: string;
        address?: string;
        phone?: string;
        relationship?: string;
    }[];
    statement: any[];
    propertyOptions: any[];
    messageUserData: any;
    documents?: { type: string; files: ({ url: string; updated_at: string } | string)[] }[];
}

export const initialReferralsPageData: ReferralsPageData = {
    total_pages: 1,
    current_page: 1,
    total_referrals: 0,
    new_referrals_this_month: 0,
    mobile_referrals: 0,
    new_mobile_referrals_this_month: 0,
    web_referrals: 0,
    new_web_referrals_this_month: 0,
    referrals: [],
    statement: [],
    propertyOptions: [],
    messageUserData: [],
};

export const referralTableFields: Field[] = [
    { id: "1", accessor: "picture_url", isImage: true, cellStyle: { paddingRight: "4px" } },
    { id: "2", accessor: "full_name", cellStyle: { paddingLeft: "4px", fontWeight: 700, color: "#000" } },
    { id: "3", accessor: "email", cellStyle: { whiteSpace: "nowrap" } },
    { id: "4", accessor: "phone_number", cellStyle: { whiteSpace: "nowrap" } },
    { id: "5", accessor: "user_tag" },
    { id: "6", accessor: "referral_source", cellStyle: { whiteSpace: "nowrap" } },
    { id: "7", accessor: "manage/chat" },
];

const generateMockdata = (numItems: number): ReferralCardProps[] => {
    const names = [
        "Emma Wilson", "James Davis", "Charlotte Brown", "William Miller", "Harper Garcia",
        "Benjamin Rodriguez", "Aria Martinez", "Henry Anderson", "Scarlett Taylor", "Sebastian Thomas",
    ];
    const emails = names.map(n => `${n.split(" ")[0].toLowerCase()}.${n.split(" ")[1].toLowerCase()}@email.com`);
    const phones = ["08011111111", "08022222222", "08033333333", "08044444444", "08055555555", "08066666666", "08077777777", "08088888888", "08099999999", "08000000000"];
    const referralSources = ["Social Media", "Friend", "Website", "Advertisement", "Agent"];
    const referralStatuses: ("pending" | "approved" | "rejected")[] = ["pending", "approved", "rejected"];

    return Array.from({ length: numItems }, (_, i) => ({
        id: `${i + 1}`,
        picture_url: "/empty/SampleLandlord.jpeg",
        name: names[i % names.length],
        user_tag: i % 2 === 0 ? "mobile" : "web",
        email: emails[i % emails.length],
        phone_number: phones[i % phones.length],
        badge_color: (i % 5 === 0 ? "black" : i % 3 === 0 ? "red" : "green") as BadgeIconColors,
        note: i % 7 === 0,
        referral_source: referralSources[i % referralSources.length],
        referral_status: referralStatuses[i % referralStatuses.length],
    }));
};

export interface ReferralApiResponse {
    data: {
        referrals: {
            id: string;
            name: string;
            email: string | null;
            phone: { user_phone: string | null; profile_phone: string | null };
            username: string | null;
            picture: string;
            agent: string;
            tier_id?: 1 | 2 | 3 | 4 | 5;
            user_tier?: 1 | 2 | 3 | 4 | 5;
            note: { note: string | null };
            referral_source?: string;
            referral_status?: string;
        }[];
        pagination: { current_page: number; per_page: number; total_pages: number };
    };
    mobile_referral_count: number;
    web_referral_count: number;
    mobile_monthly_count: number;
    web_monthly_count: number;
    total_count_monthly: number;
    total_data_count: number;
}

export const generateDummyReferralApiResponse = (page: number = 1, search?: string): ReferralApiResponse => {
    const totalItems = 35;
    const perPage = 10;
    const totalPages = Math.ceil(totalItems / perPage);
    let items = generateMockdata(totalItems);
    if (search) {
        const s = search.toLowerCase();
        items = items.filter(x => x.name.toLowerCase().includes(s) || (x.email || "").toLowerCase().includes(s));
    }
    const start = (page - 1) * perPage;
    const paginated = items.slice(start, start + perPage).map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: { user_phone: c.phone_number, profile_phone: c.phone_number },
        username: c.name.toLowerCase().replace(" ", "."),
        picture: c.picture_url || empty,
        agent: c.user_tag,
        tier_id: c.badge_color === "black" ? 1 : c.badge_color === "red" ? 2 : 3,
        user_tier: c.badge_color === "black" ? 1 : c.badge_color === "red" ? 2 : 3,
        note: { note: c.note ? "VIP referral" : null },
        referral_source: c.referral_source,
        referral_status: c.referral_status,
    }));
    return {
        data: { referrals: paginated as any, pagination: { current_page: page, per_page: perPage, total_pages: totalPages } },
        mobile_referral_count: Math.floor(totalItems * 0.5),
        web_referral_count: Math.floor(totalItems * 0.5),
        mobile_monthly_count: Math.floor(totalItems * 0.1),
        web_monthly_count: Math.floor(totalItems * 0.1),
        total_count_monthly: Math.floor(totalItems * 0.2),
        total_data_count: totalItems,
    };
};

export const transformReferralApiResponse = (response: ReferralApiResponse) => {
    const { data: { referrals, pagination }, mobile_referral_count, web_referral_count, mobile_monthly_count, web_monthly_count, total_count_monthly, total_data_count } = response;
    return {
        total_referrals: total_data_count,
        new_referrals_this_month: total_count_monthly,
        mobile_referrals: mobile_referral_count,
        new_mobile_referrals_this_month: mobile_monthly_count,
        web_referrals: web_referral_count,
        new_web_referrals_this_month: web_monthly_count,
        total_pages: pagination.total_pages,
        current_page: pagination.current_page,
        referrals: referrals.map(ref => ({
            id: ref.id,
            name: ref.name,
            email: ref.email,
            phone_number: `${ref.phone.profile_phone || ""}${ref.phone.user_phone && ref.phone.profile_phone ? " / " + ref.phone.user_phone : ""}`,
            user_tag: ref.agent.toLowerCase() === "mobile" ? "mobile" : "web",
            picture_url: ref.picture,
            note: ref?.note?.note,
            badge_color: ref?.user_tier ? tierColorMap[ref.user_tier] : undefined,
            referral_source: ref.referral_source,
            referral_status: ref.referral_status,
        }))
    } as ReferralsPageData;
};
