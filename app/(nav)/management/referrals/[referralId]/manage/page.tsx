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
    transformIndividualReferralAPIResponse,
    generateDummyIndividualReferralAPIResponse,
} from "./data";
import { groupDocumentsByType } from "@/utils/group-documents";
import { SectionContainer } from "@/components/Section/section-components";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import { useEffect } from "react";
import { toast } from "sonner";

const ManageReferral = ({ params }: { params: { referralId: string } }) => {
    const referralId = params.referralId;
    const router = useRouter();

    const referralData = transformIndividualReferralAPIResponse(
        generateDummyIndividualReferralAPIResponse(referralId)
    );

    const groupedDocuments = groupDocumentsByType(referralData?.documents as any);
    const IS_MOBILE = referralData?.referrals[0]?.user_tag === "mobile";

    let transformedTableData: any[] = [];

    const goToMessage = () => {
        if (!referralData?.referrals[0]?.user_id) return toast.warning("Referral User ID not Found!");
        router.push(`/messages/${referralData?.referrals[0]?.user_id}`);
    };

    // Dummy properties to show in grid
    const dummyProperties = [
        {
            id: "501",
            property_name: "Sunset Gardens",
            images: [
                "/empty/SampleProperty3.jpeg",
                "/empty/SampleProperty5.jpg",
                "/empty/SampleProperty6.jpg"
            ],
            default_image: "/empty/SampleProperty3.jpeg",
            address: "15 Sunset Blvd, Lekki, Lagos",
            total_units: 15,
            total_returns: 45000000,
            total_income: 6750000,
            property_type: "rental",
            total_unit_pictures: 4,
            hasVideo: true,
            currency: "naira" as const,
            mobile_tenants: 8,
            web_tenants: 7,
            owing_units: 1,
            available_units: 2,
            viewOnly: false,
            isClickable: true,
            branch: "Lekki Branch",
            last_updated: "10/09/2024",
            accountOfficer: "Biodun K.",
            documents: [],
        },
        {
            id: "502",
            property_name: "Ocean View Heights",
            images: [
                "/empty/SampleProperty4.png",
                "/empty/SampleProperty2.jpeg",
                "/empty/SampleProperty.jpeg"
            ],
            default_image: "/empty/SampleProperty4.png",
            address: "Victoria Island, Lagos",
            total_units: 8,
            total_returns: 32000000,
            total_income: 4800000,
            property_type: "rental",
            total_unit_pictures: 2,
            hasVideo: false,
            currency: "naira" as const,
            mobile_tenants: 4,
            web_tenants: 4,
            owing_units: 0,
            available_units: 1,
            viewOnly: false,
            isClickable: true,
            branch: "Victoria Island Branch",
            last_updated: "28/08/2024",
            accountOfficer: "Folake M.",
            documents: [],
        },
    ];

    // Build table rows to match the required columns
    transformedTableData = dummyProperties.map((prop, idx) => ({
        sn: idx + 1,
        property_name: prop.property_name,
        total_units: prop.total_units,
        total_amount: `₦${Number(prop.total_returns).toLocaleString()}`,
        total_sold: `₦${Number(prop.total_income).toLocaleString()}`,
        return_date: prop.last_updated || "-- -- -- --",
        payment_date: prop.last_updated || "-- -- -- --",
    }));

    return (
        <div className="custom-flex-col gap-6 lg:gap-10 my-6">
            <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
                <LandlordTenantInfoBox style={{ padding: "24px 40px" }} className="relative space-y-5">
                    <div className="flex flex-col xl:flex-row gap-5">
                        <button type="button" aria-label="back" className="absolute top-3 left-3" onClick={() => router.back()}>
                            <ChevronLeft />
                        </button>
                        <Picture src={referralData?.referrals[0]?.picture || ""} alt="profile picture" size={120} containerClassName="w-fit custom-secondary-bg rounded-full" rounded />

                        <div className="custom-flex-col gap-4">
                            <div className="custom-flex-col">
                                <div className="flex items-center">
                                    <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                                        {referralData.referrals[0]?.title} {referralData.referrals[0]?.name}
                                    </p>
                                    <div className="flex gap-2 items-center">
                                        {referralData.referrals[0]?.badge_color && <BadgeIcon color={referralData.referrals[0]?.badge_color} />}
                                    </div>
                                </div>
                                <p className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}>
                                    {referralData?.referrals[0]?.email}
                                </p>
                                {!IS_MOBILE && (
                                    <p className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}>
                                        {referralData?.referrals[0]?.phone_number}
                                    </p>
                                )}
                            </div>
                            <div className="custom-flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                    <UserTag type={referralData.referrals[0]?.user_tag} />
                                    {referralData?.referrals[0]?.note && (
                                        <Modal>
                                            <ModalTrigger>
                                                <NoteBlinkingIcon size={20} className="blink-color" />
                                            </ModalTrigger>
                                            <ModalContent>
                                                <ViewNote note={referralData.referrals[0]?.note || "High potential referral with excellent background"} />
                                            </ModalContent>
                                        </Modal>
                                    )}
                                </div>
                                {IS_MOBILE && (
                                    <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">ID: {referralData?.referrals[0]?.id}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-fit mx-auto flex flex-wrap gap-4">
                        {referralData?.referrals[0]?.user_tag === "mobile" ? (
                            <>
                                <Button onClick={goToMessage} size="base_medium" className="py-2 px-4 page-header-button">message</Button>
                            </>
                        ) : (
                            <>
                                <Button href={`/management/referral/${referralId}/manage/edit`} size="base_medium" className="py-2 px-4 page-header-button">edit</Button>
                            </>
                        )}
                    </div>
                </LandlordTenantInfoBox>

                {IS_MOBILE && (
                    <LandlordTenantInfo info={{ gender: referralData.referrals[0]?.gender, birthday: referralData.referrals[0]?.birthday, religion: referralData.referrals[0]?.religion, phone: referralData.referrals[0]?.phone_number, marital_status: referralData.referrals[0]?.marital_status }} />
                )}

                <LandlordTenantInfo
                    heading="bank details"
                    info={{
                        bank: referralData.referrals[0]?.bank_name,
                        "account name": referralData.referrals[0]?.account_name,
                        "account number": referralData.referrals[0]?.account_number,
                    }}
                />

                <LandlordTenantInfo
                    containerClassName="flex flex-col justify-center"
                    heading="Others"
                    info={{
                        occupation: referralData.referrals[0]?.occupation,
                        ...(referralData.referrals[0]?.occupation && referralData.referrals[0]?.occupation.toLowerCase() === "employed" && { employment_title: referralData.referrals[0]?.employment_type }),
                        family_type: referralData.referrals[0]?.family_type,
                        ...(!IS_MOBILE && { gender: referralData.referrals[0]?.gender }),
                    }}
                />

                <LandlordTenantInfo
                    heading="Next of Kin"
                    info={{
                        name: referralData.referrals[0]?.name,
                        address: referralData.referrals[0]?.address,
                        "phone number": referralData.referrals[0]?.phone,
                        relationship: referralData.referrals[0]?.relationship,
                    }}
                />

                <LandlordTenantInfo
                    heading="Referral Information"
                    info={{
                        "referral source": referralData.referrals[0]?.referral_source,
                        "referral status": referralData.referrals[0]?.referral_status,
                    }}
                />
            </div>

            {/* Properties Grid */}
            <LandlordTenantInfoSection title="Properties">
                <AutoResizingGrid minWidth={315}>
                    {dummyProperties.map((property) => (
                        <PropertyCard key={property.id} {...property} property_type={property.property_type as "rental" | "facility"} />
                    ))}
                </AutoResizingGrid>
            </LandlordTenantInfoSection>

            {/* Statement */}
            {referralData && referralData?.referrals && referralData.referrals?.length > 0 && (
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

export default ManageReferral;
