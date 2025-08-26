"use client";

import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import {
    LandlordTenantInfo,
    LandlordTenantInfoBox,
    LandlordTenantInfoSection,
    LandlordTenantInfoDocument,
    MobileNotesModal,
    ViewNote,
} from "@/components/Management/landlord-tenant-info-components";
import PropertyCard from "@/components/Management/Properties/property-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import UserTag from "@/components/Tags/user-tag";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CustomTable from "@/components/Table/table";
import {
    statementTableFields,
    transformIndividualInvestorAPIResponse,
    generateDummyIndividualInvestorAPIResponse,
} from "./data";
import { groupDocumentsByType } from "@/utils/group-documents";
import { SectionContainer } from "@/components/Section/section-components";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import { useEffect } from "react";
import { toast } from "sonner";

const ManageInvestor = ({ params }: { params: { investorId: string } }) => {
    const investorId = params.investorId;
    const router = useRouter();

    const investorData = transformIndividualInvestorAPIResponse(
        generateDummyIndividualInvestorAPIResponse(investorId)
    );

    const groupedDocuments = groupDocumentsByType(investorData?.documents);
    const IS_MOBILE = investorData?.user_tag === "mobile";

    let transformedTableData: any[] = [];

    const goToMessage = () => {
        if (!investorData.user_id) return toast.warning("Investor User ID not Found!");
        router.push(`/messages/${investorData?.user_id}`);
    };

    // Dummy investments (properties) to show in grid
    const dummyInvestments = [
        {
            id: "401",
            property_name: "Harbour View Residences",
            images: [
                "/empty/SampleProperty3.jpeg",
                "/empty/SampleProperty5.jpg",
                "/empty/SampleProperty6.jpg"
            ],
            default_image: "/empty/SampleProperty3.jpeg",
            address: "1 Marina Rd, Ikoyi, Lagos",
            total_units: 20,
            total_returns: 56000000,
            total_income: 8400000,
            property_type: "rental",
            total_unit_pictures: 6,
            hasVideo: true,
            currency: "naira" as const,
            mobile_tenants: 10,
            web_tenants: 10,
            owing_units: 2,
            available_units: 3,
            viewOnly: false,
            isClickable: true,
            branch: "Ikoyi Branch",
            last_updated: "05/09/2024",
            accountOfficer: "Adekunle A.",
            documents: [],
        },
        {
            id: "402",
            property_name: "Palm Grove Estate",
            images: [
                "/empty/SampleProperty4.png",
                "/empty/SampleProperty2.jpeg",
                "/empty/SampleProperty.jpeg"
            ],
            default_image: "/empty/SampleProperty4.png",
            address: "Lekki Phase 2, Lagos",
            total_units: 12,
            total_returns: 24000000,
            total_income: 3600000,
            property_type: "rental",
            total_unit_pictures: 3,
            hasVideo: false,
            currency: "naira" as const,
            mobile_tenants: 6,
            web_tenants: 6,
            owing_units: 1,
            available_units: 1,
            viewOnly: false,
            isClickable: true,
            branch: "Lekki Branch",
            last_updated: "22/08/2024",
            accountOfficer: "Chioma O.",
            documents: [],
        },
    ];

    // Build table rows to match the required columns
    transformedTableData = dummyInvestments.map((inv, idx) => ({
        sn: idx + 1,
        property_name: inv.property_name,
        total_units: inv.total_units,
        total_amount: `₦${Number(inv.total_returns).toLocaleString()}`,
        total_sold: `₦${Number(inv.total_income).toLocaleString()}`,
        return_date: inv.last_updated || "-- -- -- --",
        payment_date: inv.last_updated || "-- -- -- --",
    }));

    return (
        <div className="custom-flex-col gap-6 lg:gap-10 my-6">
            <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
                <LandlordTenantInfoBox style={{ padding: "24px 40px" }} className="relative space-y-5">
                    <div className="flex flex-col xl:flex-row gap-5">
                        <button type="button" aria-label="back" className="absolute top-3 left-3" onClick={() => router.back()}>
                            <ChevronLeft />
                        </button>
                        <Picture src={investorData?.picture || ""} alt="profile picture" size={120} containerClassName="w-fit custom-secondary-bg rounded-full" rounded />

                        <div className="custom-flex-col gap-4">
                            <div className="custom-flex-col">
                                <div className="flex items-center">
                                    <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                                        {investorData.title} {investorData.name}
                                    </p>
                                    <div className="flex gap-2 items-center">
                                        {investorData.badge_color && <BadgeIcon color={investorData.badge_color} />}
                                    </div>
                                </div>
                                <p className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}>
                                    {investorData?.email}
                                </p>
                                {!IS_MOBILE && (
                                    <p className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}>
                                        {investorData?.phone_number}
                                    </p>
                                )}
                            </div>
                            <div className="custom-flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                    <UserTag type={investorData.user_tag} />
                                    {investorData?.note && (
                                        <Modal>
                                            <ModalTrigger>
                                                <NoteBlinkingIcon size={20} className="blink-color" />
                                            </ModalTrigger>
                                            <ModalContent>
                                                <ViewNote note={investorData.notes?.write_up || ""} />
                                            </ModalContent>
                                        </Modal>
                                    )}
                                </div>
                                {IS_MOBILE && (
                                    <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">ID: {investorData?.id}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-fit mx-auto flex flex-wrap gap-4">
                        {investorData?.user_tag === "mobile" ? (
                            <>
                                <Button onClick={goToMessage} size="base_medium" className="py-2 px-4 page-header-button">message</Button>
                            </>
                        ) : (
                            <>
                                <Button href={`/management/investor/${investorId}/manage/edit`} size="base_medium" className="py-2 px-4 page-header-button">edit</Button>
                            </>
                        )}
                    </div>
                </LandlordTenantInfoBox>

                {IS_MOBILE && (
                    <LandlordTenantInfo info={{ gender: investorData.gender, birthday: investorData.birthday, religion: investorData.religion, phone: investorData.phone_number, marital_status: investorData.marital_status }} />
                )}

                <LandlordTenantInfo
                    heading="bank details"
                    info={{
                        bank: investorData.bank_details.bank_name,
                        "account name": investorData.bank_details.account_name,
                        "account number": investorData.bank_details.account_number,
                    }}
                />

                <LandlordTenantInfo
                    containerClassName="flex flex-col justify-center"
                    heading="Others"
                    info={{
                        occupation: investorData.others.employment,
                        ...(investorData.others.employment && investorData.others.employment.toLowerCase() === "employed" && { employment_title: investorData.others.employment_type }),
                        family_type: investorData.others.family_type,
                        investor_type: investorData.owner_type,
                        ...(!IS_MOBILE && { gender: investorData.gender }),
                    }}
                />

                <LandlordTenantInfo
                    heading="Next of Kin"
                    info={{
                        name: investorData.next_of_kin.name,
                        address: investorData.next_of_kin.address,
                        "phone number": investorData.next_of_kin.phone,
                        relationship: investorData.next_of_kin.relationship,
                    }}
                />
            </div>

            {/* Investments Grid */}
            <LandlordTenantInfoSection title="Investments">
                <AutoResizingGrid minWidth={315}>
                    {dummyInvestments.map((investment) => (
                        <PropertyCard key={investment.id} {...investment} property_type={investment.property_type as "rental" | "facility"} />
                    ))}
                </AutoResizingGrid>
            </LandlordTenantInfoSection>

            {/* Statement
            {investorData && investorData?.statement && investorData.statement?.length > 0 && (
                <SectionContainer heading="Statement" style={{ fontSize: "25px", fontWeight: "700" }}>
                    <CustomTable fields={statementTableFields} data={transformedTableData ?? []} tableBodyCellSx={{ fontSize: "1rem" }} tableHeadCellSx={{ fontSize: "1rem" }} />
                </SectionContainer>
            )} */}

            {/* Statement */}
            {investorData && investorData?.statement && investorData.statement?.length > 0 && (
                <SectionContainer heading="Statement" style={{ fontSize: "25px", fontWeight: "700" }}>
                    <CustomTable fields={statementTableFields} data={transformedTableData ?? []} tableBodyCellSx={{ fontSize: "1rem" }} tableHeadCellSx={{ fontSize: "1rem" }} />
                </SectionContainer>
            )}

            {/* Shared Documents */}
            <div>
                {[].length === 0 ? (
                    <div className=""></div>
                ) : null}
            </div>
        </div>
    );
};

export default ManageInvestor;
