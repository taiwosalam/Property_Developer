"use client";

// Fonts
import { secondaryFont } from "@/utils/fonts";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import {
    LandlordTenantInfo,
    LandlordTenantInfoBox,
    LandlordTenantInfoSection,
    LandlordTenantInfoDocument,
    NotesInfoBox,
    MobileNotesModal,
    ViewNote,
} from "@/components/Management/landlord-tenant-info-components";
import PropertyCard from "@/components/Management/Properties/property-card";
import PropertyListItem from "@/components/Management/Properties/property-list-item";
import { LandlordEditContext } from "@/components/Management/Landlord/landlord-edit-context";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import UserTag from "@/components/Tags/user-tag";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { LandlordEditAttachmentInfoSection } from "@/components/Management/Landlord/Edit/landlord-edit-info-sections";
import CustomTable from "@/components/Table/table";
import {
    statementTableFields,
    transformIndividualOwnerAPIResponse,
    type IndividualOwnerAPIResponse,
    generateDummyIndividualOwnerAPIResponse,
} from "./data";
import { groupDocumentsByType } from "@/utils/group-documents";
import UpdateProfileWithIdModal from "@/components/Management/update-with-id-modal";
import { transformCardData } from "../../data";
import Link from "next/link";
import { SectionContainer } from "@/components/Section/section-components";
import EditMobileUser from "@/components/Management/edit-mobile-user";
import { NoteBlinkingIcon } from "@/public/icons/dashboard-cards/icons";
import { useGlobalStore } from "@/store/general-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const AddPropertyModal = dynamic(
    () => import("@/components/Management/Properties/add-property-modal"),
    { ssr: false }
);

const ManageOwner = ({ params }: { params: { ownersId: string } }) => {
    const ownerId = params.ownersId;
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

    // Backend disabled: use only dummy data
    const apiOwner: IndividualOwnerAPIResponse | null = null;
    const fallbackOwner = generateDummyIndividualOwnerAPIResponse(ownerId);
    const ownerData = transformIndividualOwnerAPIResponse(fallbackOwner);

    useEffect(() => {
        if (ownerData) {
            setGlobalStore("selectedOwnerId", ownerData.id);
            const newMessageUserData = ownerData?.messageUserData;
            const currentMessageUserData = useGlobalStore.getState()?.messageUserData;

            if (
                JSON.stringify(currentMessageUserData) !==
                JSON.stringify(newMessageUserData)
            ) {
                setGlobalStore("messageUserData", newMessageUserData);
            }
        }
    }, [setGlobalStore, ownerData]);

    const userData = ownerData ? transformCardData(ownerData) : null;

    if (!ownerData) return null;
    const groupedDocuments = groupDocumentsByType(ownerData?.documents);

    const CAN_DELETE =
        ownerData && ownerData.properties_managed?.length === 0;
    const IS_MOBILE = ownerData?.user_tag === "mobile";

    const transformedTableData = ownerData?.statement?.map((item) => ({
        ...item,
        name: (
            <p className="flex items-center whitespace-nowrap">
                <span>{item.name || "--- ---"}</span>
                {item?.badge_color && <BadgeIcon color={item.badge_color} />}
            </p>
        ),
        credit: (
            <p className={item.credit ? "text-status-success-3 dark:text-white" : ""}>
                {item.credit ? item.credit : "--- ---"}
            </p>
        ),
        debit: (
            <p className={item.debit ? "text-status-error-2" : ""}>
                {item.debit ? `-${item.debit}` : "--- ---"}
            </p>
        ),
    }));

    const goToMessage = () => {
        if (!ownerData.user_id)
            return toast.warning("Owner User ID not Found!");
        router.push(`/messages/${ownerData?.user_id}`);
    };

    const handleAttachProperty = () => {
        router.push(
            `/management/properties/create-rental-property?ownerId=${ownerId}`
        );
    };

    // Dummy properties for Property Listing section
    const dummyProperties = [
        {
            id: "201",
            images: ["/empty/SampleProperty.jpeg"],
            property_name: "Marina Heights",
            total_units: 15,
            address: "25 Marina Road, Victoria Island, Lagos",
            available_units: 2,
            owing_units: 1,
            mobile_tenants: 8,
            web_tenants: 7,
            accountOfficer: "Michael Johnson",
            last_updated: "15/09/2024",
            total_returns: 32000000,
            total_income: 4800000,
            currency: "naira" as const,
            branch: "Victoria Island Branch",
            property_type: "rental" as const,
            total_unit_pictures: 5,
            hasVideo: true,
        },
        {
            id: "202",
            images: ["/empty/SampleProperty2.jpeg"],
            property_name: "Lekki Gardens",
            total_units: 10,
            address: "8B Admiralty Way, Lekki Phase 1, Lagos",
            available_units: 1,
            owing_units: 0,
            mobile_tenants: 4,
            web_tenants: 6,
            accountOfficer: "Sarah Williams",
            last_updated: "08/08/2024",
            total_returns: 18000000,
            total_income: 2700000,
            currency: "naira" as const,
            branch: "Lekki Branch",
            property_type: "rental" as const,
            total_unit_pictures: 3,
            hasVideo: false,
        },
    ];

    return (
        <div className="custom-flex-col gap-6 lg:gap-10 my-6">
            <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
                <LandlordTenantInfoBox
                    style={{ padding: "24px 40px" }}
                    className="relative space-y-5"
                >
                    <div className="flex flex-col xl:flex-row gap-5">
                        <button
                            type="button"
                            aria-label="back"
                            className="absolute top-3 left-3"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft />
                        </button>
                        <Picture
                            src={ownerData?.picture || ""}
                            alt="profile picture"
                            size={120}
                            containerClassName="w-fit custom-secondary-bg rounded-full"
                            rounded
                        />

                        <div className="custom-flex-col gap-4">
                            <div className="custom-flex-col">
                                <div className="flex items-center">
                                    <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                                        {ownerData.title} {ownerData.name}
                                    </p>
                                    <div className="flex gap-2 items-center">
                                        {ownerData.badge_color && (
                                            <BadgeIcon color={ownerData.badge_color} />
                                        )}
                                    </div>
                                </div>
                                <p
                                    className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
                                >
                                    {ownerData?.email}
                                </p>
                                {!IS_MOBILE && (
                                    <p
                                        className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
                                    >
                                        {ownerData?.phone_number}
                                    </p>
                                )}
                            </div>
                            <div className="custom-flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                    <UserTag type={ownerData.user_tag} />
                                    {ownerData?.note && (
                                        <Modal>
                                            <ModalTrigger>
                                                <NoteBlinkingIcon size={20} className="blink-color" />
                                            </ModalTrigger>
                                            <ModalContent>
                                                <ViewNote note={ownerData.notes?.write_up || ""} />
                                            </ModalContent>
                                        </Modal>
                                    )}
                                </div>
                                {IS_MOBILE && (
                                    <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                                        ID: {ownerData?.id}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-fit mx-auto flex flex-wrap gap-4">
                        {ownerData?.user_tag === "mobile" ? (
                            <>
                                <Button
                                    onClick={goToMessage}
                                    size="base_medium"
                                    className="py-2 px-4 page-header-button"
                                >
                                    message
                                </Button>
                                <Modal>
                                    <ModalTrigger asChild>
                                        <Button
                                            variant="light_green"
                                            size="base_medium"
                                            className="py-2 px-4 page-header-button"
                                        >
                                            Edit
                                        </Button>
                                    </ModalTrigger>
                                    <ModalContent>
                                        <EditMobileUser
                                            CAN_DELETE={CAN_DELETE}
                                            page="landlord"
                                            id={ownerId}
                                        />
                                    </ModalContent>
                                </Modal>

                                <Modal>
                                    <ModalTrigger asChild>
                                        <Button
                                            variant="sky_blue"
                                            size="base_medium"
                                            className="py-2 px-4 page-header-button"
                                        >
                                            Note
                                        </Button>
                                    </ModalTrigger>
                                    <ModalContent>
                                        <MobileNotesModal
                                            id={ownerId}
                                            page="landlord"
                                            notes={ownerData.notes}
                                        />
                                    </ModalContent>
                                </Modal>
                            </>
                        ) : (
                            <>
                                <Button
                                    href={`/management/owner/${ownerId}/manage/edit`}
                                    size="base_medium"
                                    className="py-2 px-4 page-header-button"
                                >
                                    edit
                                </Button>
                                <Modal>
                                    <ModalTrigger asChild>
                                        <Button
                                            variant="light_green"
                                            size="base_medium"
                                            className="py-2 px-4 page-header-button"
                                            type="button"
                                            onClick={handleAttachProperty}
                                        >
                                            Attach Property
                                        </Button>
                                    </ModalTrigger>
                                    <ModalContent>
                                        <AddPropertyModal id={Number(ownerId)} />
                                    </ModalContent>
                                </Modal>
                                <Modal>
                                    <ModalTrigger asChild>
                                        <Button
                                            variant="sky_blue"
                                            size="base_medium"
                                            className="py-2 px-4 page-header-button"
                                        >
                                            update with Email
                                        </Button>
                                    </ModalTrigger>
                                    <ModalContent>
                                        <UpdateProfileWithIdModal
                                            page="landlord"
                                            id={Number(ownerData.id)}
                                            data={userData && userData}
                                        />
                                    </ModalContent>
                                </Modal>
                            </>
                        )}
                    </div>
                </LandlordTenantInfoBox>

                {/* Mobile User Info */}
                {IS_MOBILE && (
                    <LandlordTenantInfo
                        info={{
                            gender: ownerData.gender,
                            birthday: ownerData.birthday,
                            religion: ownerData.religion,
                            phone: ownerData.phone_number,
                            marital_status: ownerData.marital_status,
                        }}
                    />
                )}

                {/* Bank Details */}
                <LandlordTenantInfo
                    heading="bank details"
                    info={{
                        bank: ownerData.bank_details.bank_name,
                        "account name": ownerData.bank_details.account_name,
                        "account number": ownerData.bank_details.account_number,
                        ...(ownerData.user_tag === "mobile" && {
                            "wallet ID": ownerData.bank_details.wallet_id,
                        }),
                    }}
                />

                {/* Others */}
                {ownerData?.user_tag === "mobile" ? (
                    <LandlordTenantInfo
                        heading="Contact Address"
                        containerClassName="flex flex-col justify-center"
                        info={{
                            address: ownerData.contact_address.address,
                            city: ownerData.contact_address.city,
                            state: ownerData.contact_address.state,
                            "L.G": ownerData.contact_address.local_govt,
                        }}
                    />
                ) : (
                    <LandlordTenantInfo
                        containerClassName="flex flex-col justify-center"
                        heading="Others"
                        info={{
                            occupation: ownerData.others.employment,
                            ...(ownerData.others.employment &&
                                ownerData.others.employment.toLowerCase() === "employed" && {
                                employment_title: ownerData.others.employment_type,
                            }),
                            family_type: ownerData.others.family_type,
                            owner_type: ownerData.owner_type,
                            ...(!IS_MOBILE && {
                                gender: ownerData.gender,
                            }),
                        }}
                    />
                )}

                {/* Next of Kin */}
                <LandlordTenantInfo
                    heading="Next of Kin"
                    info={{
                        name: ownerData.next_of_kin.name,
                        address: ownerData.next_of_kin.address,
                        "phone number": ownerData.next_of_kin.phone,
                        relationship: ownerData.next_of_kin.relationship,
                    }}
                />
            </div>

            {/* Edit attachment */}
            {ownerData?.user_tag === "mobile" && (
                <LandlordEditContext.Provider value={{ data: ownerData }}>
                    <LandlordEditAttachmentInfoSection noDefault />
                </LandlordEditContext.Provider>
            )}

            {/* Property Managed */}
            {ownerData &&
                ownerData?.properties_managed &&
                ownerData?.properties_managed?.length > 0 && (
                    <LandlordTenantInfoSection title="Property Managed">
                        {ownerData?.properties_managed?.length === 0 ? (""
                        ) : (
                            <AutoResizingGrid minWidth={315}>
                                {ownerData?.properties_managed?.map((property) => (
                                    <PropertyCard key={property.id} {...property} />
                                ))}
                            </AutoResizingGrid>
                        )}
                    </LandlordTenantInfoSection>
                )}

            {/* Statement */}
            {ownerData &&
                ownerData?.statement &&
                ownerData.statement?.length > 0 && (
                    <SectionContainer
                        heading="Statement"
                        {...((ownerData?.statement?.length ?? 0) > 0 && {
                            href: `/management/owner/${ownerId}/export`,
                        })}
                        style={{ fontSize: "25px", fontWeight: "700" }}
                    >
                        {(ownerData?.statement?.length ?? 0) === 0 ? (
                            ""
                        ) : (
                            <CustomTable
                                fields={statementTableFields}
                                data={transformedTableData ?? []}
                                tableBodyCellSx={{ fontSize: "1rem" }}
                                tableHeadCellSx={{ fontSize: "1rem" }}
                            />
                        )}
                    </SectionContainer>
                )}

            {/* Property Listing (List View) */}
            <LandlordTenantInfoSection title="Property Listing">
                <div className="custom-flex-col gap-4">
                    {dummyProperties.map((property) => (
                        <PropertyListItem key={`pli-${property.id}`} {...property} />
                    ))}
                </div>
            </LandlordTenantInfoSection>

            {/* Shared Documents */}
            <div>
                {[
                    ...(ownerData?.properties_managed ?? []),
                    ...(ownerData?.previous_properties ?? []),
                ].length === 0 ? (
                    <div className="">
                    </div>
                ) : (
                    <>
                        {[
                            ...(ownerData?.properties_managed ?? []),
                            ...(ownerData?.previous_properties ?? []),
                        ].map((property) => (
                            <LandlordTenantInfoSection
                                title={
                                    property?.documents?.length > 0
                                        ? `Shared Documents for ${property.property_name}`
                                        : ""
                                }
                                key={property.id}
                            >
                                {property.documents?.length > 0 ? (
                                    <>
                                        <div className="mb-5">
                                            {Object.entries(
                                                groupDocumentsByType(property.documents)
                                            ).map(([documentType, documents]) => {
                                                if (documentType === "others") return null;
                                                return (
                                                    <LandlordTenantInfoSection
                                                        minimized
                                                        title={`${documentType} documents`}
                                                        key={`${property.id}-${documentType}`}
                                                    >
                                                        <div className="flex overflow-x-auto custom-round-scrollbar gap-4">
                                                            {documents.map((document) => (
                                                                <LandlordTenantInfoDocument
                                                                    key={document.id}
                                                                    {...document}
                                                                />
                                                            ))}
                                                        </div>
                                                    </LandlordTenantInfoSection>
                                                );
                                            })}
                                        </div>
                                        {groupDocumentsByType(property.documents)?.["others"] && (
                                            <LandlordTenantInfoSection
                                                minimized
                                                title="other documents"
                                                key={`${property.id}-other-documents`}
                                            >
                                                <div className="flex flex-wrap gap-4">
                                                    {groupDocumentsByType(property.documents)[
                                                        "others"
                                                    ].map((document) => (
                                                        <LandlordTenantInfoDocument
                                                            key={document.id}
                                                            {...document}
                                                        />
                                                    ))}
                                                </div>
                                            </LandlordTenantInfoSection>
                                        )}
                                    </>
                                ) : (
                                    <p className="">
                                    </p>
                                )}
                            </LandlordTenantInfoSection>
                        ))}
                    </>
                )}
            </div>

            {/* Previous Property */}
            {ownerData &&
                ownerData?.previous_properties &&
                ownerData?.previous_properties?.length > 0 && (
                    <LandlordTenantInfoSection title="previous property">
                        <AutoResizingGrid minWidth={315}>
                            {ownerData?.previous_properties?.map((property) => (
                                <PropertyCard key={property.id} {...property} />
                            ))}
                        </AutoResizingGrid>
                    </LandlordTenantInfoSection>
                )}
        </div>
    );
};

export default ManageOwner;
