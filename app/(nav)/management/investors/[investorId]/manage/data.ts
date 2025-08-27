import type { Field } from "@/components/Table/types";
import type { InvestorsPageData } from "../../../../../../components/PAGES/DIRECTOR/PropertyDeveloper/VariantA/management/investors/data";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";
import { empty } from "@/app/config";

export const statementTableFields: Field[] = [
    { id: "1", label: "S/N", accessor: "sn", cellStyle: { width: "60px" } },
    { id: "2", label: "Property Name", accessor: "property_name" },
    { id: "3", label: "Total Units", accessor: "total_units" },
    { id: "4", label: "Total Amount", accessor: "total_amount" },
    { id: "5", label: "Total Sold", accessor: "total_sold" },
    { id: "6", label: "Return Date", accessor: "return_date" },
    { id: "7", label: "Payment Date", accessor: "payment_date" },
];

export interface IndividualInvestorAPIResponse {
    data: {
        id: string;
        name: string;
        title: string;
        email: string;
        phone: { profile_phone: string | null; user_phone: string | null };
        user_id: string;
        user_tier?: 1 | 2 | 3 | 4 | 5;
        picture?: string;
        gender: string;
        agent: string;
        investor_type: string;
        state: string;
        local_government: string;
        city: string;
        address: string;
        note: { last_updated_at: Date | null; note: string };
        bank_details: { bank_name: string; account_name: string; account_number: string };
        Others: { occupation: string | null; job_type: string | null; family_type: string | null };
        next_of_kin: { name: string; phone: string; email: string; address: string; relationship: string };
        properties: any[];
        previous_properties: any[];
        statement: any[];
        birthday: string;
        religion: string;
        marital_status: string;
        documents: { type: string; files: ({ url: string; updated_at: string } | string)[] }[];
    };
}

export const transformIndividualInvestorAPIResponse = ({ data }: IndividualInvestorAPIResponse): InvestorsPageData => {
    return {
        investors: [{
            id: data.id,
            name: data.name,
            email: data.email,
            phone_number: `${data.phone.profile_phone ?? ""}${data.phone.user_phone && data.phone.profile_phone ? " / " + data.phone.user_phone : ""}`,
            picture_url: data.picture || "",
            badge_color: data?.user_tier ? tierColorMap[data?.user_tier] : undefined,
            user_tag: data?.agent?.toLowerCase() === "mobile" ? "mobile" : "web",
            user_id: data.user_id,
            title: data.title,
            picture: data.picture,
            gender: data.gender,
            birthday: data.birthday,
            religion: data.religion,
            marital_status: data.marital_status,
            bank_name: data.bank_details.bank_name,
            account_name: data.bank_details.account_name,
            account_number: data.bank_details.account_number,
            occupation: data.Others.occupation || undefined,
            employment_type: data.Others.job_type || undefined,
            family_type: data.Others.family_type || undefined,
            investor_type: data.investor_type,
            address: data.address,
            phone: data.next_of_kin.phone,
            relationship: data.next_of_kin.relationship,
            note: data.note?.note,
        }],
        total_investors: 1,
        new_investors_this_month: 0,
        mobile_investors: 0,
        new_mobile_investors_this_month: 0,
        web_investors: 0,
        new_web_investors_this_month: 0,
        total_pages: 1,
        current_page: 1,
        statement: data?.statement?.map((s: any) => ({
            sn: s?.id || 0,
            property_name: s?.property_name || "",
            total_units: s?.total_units || "",
            total_amount: s?.total_amount || "",
            total_sold: s?.total_sold || "",
            return_date: s?.return_date || "",
            payment_date: s?.payment_date || "",
            badge_color: s?.payer_tier ? tierColorMap[s?.payer_tier as keyof typeof tierColorMap] : undefined,
            id: s?.id || 0,
            picture: s?.payer_picture || empty,
            name: s?.payer_name || "",
            payment_id: s?.payment_id || "",
            details: s?.details || "",
            unit_name: s?.unit_name || "",
            credit: s?.amount_paid ? `₦${Number(s.amount_paid).toLocaleString()}` : null,
            debit: null,
        })),
        propertyOptions: [],
        messageUserData: { id: Number(data?.user_id) || 0, name: data?.name || "", position: "investor", imageUrl: data?.picture ?? empty, branch_id: 1 },
        documents: data.documents,
    };
};

export const generateDummyIndividualInvestorAPIResponse = (id: string): IndividualInvestorAPIResponse => {
    const name = "Olivia Stone";
    const picture = "/empty/SampleLandlord.jpeg";
    const now = dayjs();
    return {
        data: {
            id,
            name,
            title: "Ms",
            email: "olivia.stone@email.com",
            phone: { profile_phone: "08011111111", user_phone: "08012121212" },
            user_id: "3001",
            user_tier: 3,
            picture,
            gender: "female",
            agent: "web",
            investor_type: "equity",
            state: "Lagos",
            local_government: "Ikoyi",
            city: "Ikoyi",
            address: "7 Queen's Drive",
            birthday: "15/03/1985",
            religion: "Christianity",
            marital_status: "Married",
            note: { last_updated_at: now.toDate(), note: "High net worth investor" },
            bank_details: { bank_name: "Access Bank", account_name: name, account_number: "1234567890" },
            Others: { occupation: "Investor", job_type: "Self-employed", family_type: "Nuclear" },
            next_of_kin: { name: "Emma Stone", phone: "08033334444", email: "emma@example.com", address: "Ikoyi", relationship: "Sister" },
            properties: [],
            previous_properties: [],
            statement: [{ id: 1, payer_picture: picture, payer_name: "Return A", payment_id: "INV-001", details: "Dividend payout", unit_name: "Fund A", amount_paid: "250000", currency: "naira", date: now.format("DD/MM/YYYY"), payer_tier: 2 }],
            documents: [{ type: "identification", files: [{ url: "/document-thumbnails/identification.png", updated_at: now.toISOString() }] }],
        }
    };
};
