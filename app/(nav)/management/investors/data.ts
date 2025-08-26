// data.ts
import type { Field } from "@/components/Table/types";
import { BadgeIconColors, tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { UserCardProps } from "@/components/Management/landlord-and-tenant-card";
import { empty } from "@/app/config";

interface InvestorCardProps {
    id: string;
    name: string;
    email: string | null;
    user_tag: "mobile" | "web";
    phone_number: string | null;
    picture_url: string | null;
    badge_color?: BadgeIconColors;
    note?: boolean;
}

export interface InvestorsPageData {
    total_investors: number;
    new_investors_this_month: number;
    mobile_investors: number;
    new_mobile_investors_this_month: number;
    web_investors: number;
    new_web_investors_this_month: number;
    total_pages: number;
    current_page: number;
    investors: InvestorCardProps[];
}

export const initialInvestorsPageData: InvestorsPageData = {
    total_pages: 1,
    current_page: 1,
    total_investors: 0,
    new_investors_this_month: 0,
    mobile_investors: 0,
    new_mobile_investors_this_month: 0,
    web_investors: 0,
    new_web_investors_this_month: 0,
    investors: [],
};

export const investorTableFields: Field[] = [
    { id: "1", accessor: "picture_url", isImage: true, cellStyle: { paddingRight: "4px" } },
    { id: "2", accessor: "full_name", cellStyle: { paddingLeft: "4px", fontWeight: 700, color: "#000" } },
    { id: "3", accessor: "email", cellStyle: { whiteSpace: "nowrap" } },
    { id: "4", accessor: "phone_number", cellStyle: { whiteSpace: "nowrap" } },
    { id: "5", accessor: "user_tag" },
    { id: "6", accessor: "manage/chat" },
];

const generateMockdata = (numItems: number): InvestorCardProps[] => {
    const names = [
        "Olivia Stone", "Liam Carter", "Ava Bennett", "Noah Turner", "Sophia Brooks",
        "Mason Reed", "Isabella Hayes", "Elijah Cooper", "Mia Collins", "Lucas Ward",
    ];
    const emails = names.map(n => `${n.split(" ")[0].toLowerCase()}.${n.split(" ")[1].toLowerCase()}@email.com`);
    const phones = ["08011111111", "08022222222", "08033333333", "08044444444", "08055555555", "08066666666", "08077777777", "08088888888", "08099999999", "08000000000"];
    return Array.from({ length: numItems }, (_, i) => ({
        id: `${i + 1}`,
        picture_url: "/empty/SampleLandlord.jpeg",
        name: names[i % names.length],
        user_tag: i % 2 === 0 ? "mobile" : "web",
        email: emails[i % emails.length],
        phone_number: phones[i % phones.length],
        badge_color: (i % 5 === 0 ? "black" : i % 3 === 0 ? "red" : "green") as BadgeIconColors,
        note: i % 7 === 0,
    }));
};

export interface InvestorApiResponse {
    data: {
        investors: {
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
        }[];
        pagination: { current_page: number; per_page: number; total_pages: number };
    };
    mobile_investor_count: number;
    web_investor_count: number;
    mobile_monthly_count: number;
    web_monthly_count: number;
    total_count_monthly: number;
    total_data_count: number;
}

export const generateDummyInvestorApiResponse = (page: number = 1, search?: string): InvestorApiResponse => {
    const totalItems = 40;
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
        note: { note: c.note ? "VIP investor" : null },
    }));
    return {
        data: { investors: paginated, pagination: { current_page: page, per_page: perPage, total_pages: totalPages } },
        mobile_investor_count: Math.floor(totalItems * 0.5),
        web_investor_count: Math.floor(totalItems * 0.5),
        mobile_monthly_count: Math.floor(totalItems * 0.1),
        web_monthly_count: Math.floor(totalItems * 0.1),
        total_count_monthly: Math.floor(totalItems * 0.2),
        total_data_count: totalItems,
    };
};

export const transformInvestorApiResponse = (response: InvestorApiResponse) => {
    const { data: { investors, pagination }, mobile_investor_count, web_investor_count, mobile_monthly_count, web_monthly_count, total_count_monthly, total_data_count } = response;
    return {
        total_investors: total_data_count,
        new_investors_this_month: total_count_monthly,
        mobile_investors: mobile_investor_count,
        new_mobile_investors_this_month: mobile_monthly_count,
        web_investors: web_investor_count,
        new_web_investors_this_month: web_monthly_count,
        total_pages: pagination.total_pages,
        current_page: pagination.current_page,
        investors: investors.map(inv => ({
            id: inv.id,
            name: inv.name,
            email: inv.email,
            phone_number: `${inv.phone.profile_phone || ""}${inv.phone.user_phone && inv.phone.profile_phone ? " / " + inv.phone.user_phone : ""}`,
            user_tag: inv.agent.toLowerCase() === "mobile" ? "mobile" : "web",
            picture_url: inv.picture,
            note: inv?.note?.note !== null && inv?.note?.note !== "",
            badge_color: inv?.user_tier ? tierColorMap[inv.user_tier] : undefined,
        }))
    } as InvestorsPageData;
};
