import type { Field } from "@/components/Table/types";
import type { ReferralsPageData } from "../../data";
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

export interface IndividualReferralAPIResponse {
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
        referral_source: string;
        referral_status: string;
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

export const transformIndividualReferralAPIResponse = ({ data }: IndividualReferralAPIResponse): ReferralsPageData => {
    return {
        referrals: [{
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
            address: data.address,
            phone: data.next_of_kin.phone,
            relationship: data.next_of_kin.relationship,
            note: data.note?.note,
            referral_source: data.referral_source,
            // referral_status: data.referral_status,
            referral_status: "pending" as "rejected" | "approved" | "pending" | undefined,
        }],
        total_referrals: 1,
        new_referrals_this_month: 0,
        mobile_referrals: 0,
        new_mobile_referrals_this_month: 0,
        web_referrals: 0,
        new_web_referrals_this_month: 0,
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
        })) || [],
        propertyOptions: [],
        messageUserData: [],
        documents: data?.documents || [],
    };
};

export const generateDummyIndividualReferralAPIResponse = (referralId: string): IndividualReferralAPIResponse => {
    const names = [
        "Emma Wilson", "James Davis", "Charlotte Brown", "William Miller", "Harper Garcia",
        "Benjamin Rodriguez", "Aria Martinez", "Henry Anderson", "Scarlett Taylor", "Sebastian Thomas",
    ];
    const referralSources = ["Social Media", "Friend", "Website", "Advertisement", "Agent"];
    const referralStatuses = ["pending", "approved", "rejected"];

    const randomIndex = parseInt(referralId) % names.length;
    const name = names[randomIndex];

    return {
        data: {
            id: referralId,
            name: name,
            title: "Mr.",
            email: `${name.split(" ")[0].toLowerCase()}.${name.split(" ")[1].toLowerCase()}@email.com`,
            phone: { profile_phone: "08011111111", user_phone: "08022222222" },
            user_id: uuidv4(),
            user_tier: (parseInt(referralId) % 3 + 1) as 1 | 2 | 3,
            picture: "/empty/SampleLandlord.jpeg",
            gender: parseInt(referralId) % 2 === 0 ? "Male" : "Female",
            agent: parseInt(referralId) % 2 === 0 ? "mobile" : "web",
            referral_source: referralSources[parseInt(referralId) % referralSources.length],
            referral_status: referralStatuses[parseInt(referralId) % referralStatuses.length],
            state: "Lagos",
            local_government: "Victoria Island",
            city: "Lagos",
            address: "123 Victoria Island, Lagos",
            note: {
                last_updated_at: new Date(),
                note: parseInt(referralId) % 7 === 0 ? "VIP referral with high potential" : ""
            },
            bank_details: {
                bank_name: "First Bank",
                account_name: name,
                account_number: "1234567890"
            },
            Others: {
                occupation: "Business Owner",
                job_type: "Self-employed",
                family_type: "Nuclear"
            },
            next_of_kin: {
                name: `${name.split(" ")[0]} ${name.split(" ")[1]} Jr.`,
                phone: "08033333333",
                email: `${name.split(" ")[0].toLowerCase()}.jr@email.com`,
                address: "123 Victoria Island, Lagos",
                relationship: "Spouse"
            },
            properties: [],
            previous_properties: [],
            statement: [],
            birthday: "1985-06-15",
            religion: "Christianity",
            marital_status: "Married",
            documents: [],
        }
    };
};
