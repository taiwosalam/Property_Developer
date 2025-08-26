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
import CustomLoader from "@/components/Loader/CustomLoader";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { LandlordEditAttachmentInfoSection } from "@/components/Management/Landlord/Edit/landlord-edit-info-sections";
import NetworkError from "@/components/Error/NetworkError";
import CustomTable from "@/components/Table/table";
import {
  statementTableFields,
  statementTableData,
  transformIndividualClientAPIResponse,
  type IndividualClientAPIResponse,
  generateDummyIndividualClientAPIResponse,
} from "./data";
import { groupDocumentsByType } from "@/utils/group-documents";
import useFetch from "@/hooks/useFetch";
import UpdateProfileWithIdModal from "@/components/Management/update-with-id-modal";
import { transformCardData } from "../../data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
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

const ManageClient = ({ params }: { params: { clientsId: string } }) => {
  const clientId = params.clientsId;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  // Backend disabled: use only dummy data
  const apiClient: IndividualClientAPIResponse | null = null;
  const fallbackClient = generateDummyIndividualClientAPIResponse(clientId);
  const clientData = transformIndividualClientAPIResponse(fallbackClient);

  useEffect(() => {
    if (clientData) {
      setGlobalStore("selectedClientId", clientData.id);
      const newMessageUserData = clientData?.messageUserData;
      const currentMessageUserData = useGlobalStore.getState()?.messageUserData;

      if (
        JSON.stringify(currentMessageUserData) !==
        JSON.stringify(newMessageUserData)
      ) {
        setGlobalStore("messageUserData", newMessageUserData);
      }
    }
  }, [setGlobalStore, clientData]);

  const userData = clientData ? transformCardData(clientData) : null;

  if (!clientData) return <CustomLoader layout="profile" />;
  const groupedDocuments = groupDocumentsByType(clientData?.documents);

  const CAN_DELETE =
    clientData && clientData.properties_managed?.length === 0;
  const IS_MOBILE = clientData?.user_tag === "mobile";

  const transformedTableData = clientData?.statement?.map((item) => ({
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

  // Dummy properties for Property Listing section
  const dummyProperties = [
    {
      id: "101",
      images: ["/empty/SampleProperty.jpeg"],
      property_name: "Ocean View Apartments",
      total_units: 12,
      address: "23 Marine Road, Oniru, Lagos",
      available_units: 3,
      owing_units: 1,
      mobile_tenants: 7,
      web_tenants: 5,
      accountOfficer: "Adeola Johnson",
      last_updated: "12/09/2024",
      total_returns: 24500000,
      total_income: 3675000,
      currency: "naira" as const,
      branch: "Lagos HQ",
      property_type: "rental" as const,
      total_unit_pictures: 4,
      hasVideo: true,
    },
    {
      id: "102",
      images: ["/empty/SampleProperty2.jpeg"],
      property_name: "Greenwood Estate",
      total_units: 8,
      address: "5B Admiralty Way, Lekki Phase 1, Lagos",
      available_units: 1,
      owing_units: 2,
      mobile_tenants: 3,
      web_tenants: 5,
      accountOfficer: "Chinedu Okafor",
      last_updated: "03/08/2024",
      total_returns: 12800000,
      total_income: 1920000,
      currency: "naira" as const,
      branch: "Island Branch",
      property_type: "rental" as const,
      total_unit_pictures: 2,
      hasVideo: false,
    },
  ];

  const goToMessage = () => {
    if (!clientData.user_id)
      return toast.warning("Client User ID not Found!");
    router.push(`/messages/${clientData?.user_id}`);
  };


  const handleAttachProperty = () => {
    router.push(
      `/management/properties/create-rental-property?clientId=${clientId}`
    );
  };

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
              src={clientData?.picture || ""}
              alt="profile picture"
              size={120}
              containerClassName="w-fit custom-secondary-bg rounded-full"
              rounded
            />

            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center">
                  <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                    {clientData.title} {clientData.name}
                  </p>
                  <div className="flex gap-2 items-center">
                    {clientData.badge_color && (
                      <BadgeIcon color={clientData.badge_color} />
                    )}
                  </div>
                </div>
                <p
                  className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
                >
                  {clientData?.email}
                </p>
                {!IS_MOBILE && (
                  <p
                    className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
                  >
                    {clientData?.phone_number}
                  </p>
                )}
              </div>
              <div className="custom-flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <UserTag type={clientData.user_tag} />
                  {clientData?.note && (
                    <Modal>
                      <ModalTrigger>
                        <NoteBlinkingIcon size={20} className="blink-color" />
                      </ModalTrigger>
                      <ModalContent>
                        <ViewNote note={clientData.notes?.write_up || ""} />
                      </ModalContent>
                    </Modal>
                  )}
                </div>
                {IS_MOBILE && (
                  <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                    ID: {clientData?.id}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-fit mx-auto flex flex-wrap gap-4">
            {clientData?.user_tag === "mobile" ? (
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
                      id={clientId}
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
                      id={clientId}
                      page="landlord"
                      notes={clientData.notes}
                    />
                  </ModalContent>
                </Modal>
              </>
            ) : (
              <>
                <Button
                  href={`/management/client/${clientId}/manage/edit`}
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
                    <AddPropertyModal id={Number(clientId)} />
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
                      id={Number(clientData.id)}
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
              gender: clientData.gender,
              birthday: clientData.birthday,
              religion: clientData.religion,
              phone: clientData.phone_number,
              marital_status: clientData.marital_status,
            }}
          />
        )}

        {/* Contact Address */}
        {/* <LandlordTenantInfo
          heading="Contact Address"
          info={{
            address: clientData.contact_address.address,
            city: clientData.contact_address.city,
            state: clientData.contact_address.state,
            "L.G": clientData.contact_address.local_govt,
          }}
        /> */}

        {/* Bank Details */}
        <LandlordTenantInfo
          heading="bank details"
          info={{
            bank: clientData.bank_details.bank_name,
            "account name": clientData.bank_details.account_name,
            "account number": clientData.bank_details.account_number,
            ...(clientData.user_tag === "mobile" && {
              "wallet ID": clientData.bank_details.wallet_id,
            }),
          }}
        />

        {/* Others */}
        {clientData?.user_tag === "mobile" ? (
          <LandlordTenantInfo
            heading="Contact Address"
            containerClassName="flex flex-col justify-center"
            info={{
              address: clientData.contact_address.address,
              city: clientData.contact_address.city,
              state: clientData.contact_address.state,
              "L.G": clientData.contact_address.local_govt,
            }}
          />
        ) : (
          <LandlordTenantInfo
            containerClassName="flex flex-col justify-center"
            heading="Others"
            info={{
              occupation: clientData.others.employment,
              ...(clientData.others.employment &&
                clientData.others.employment.toLowerCase() === "employed" && {
                employment_title: clientData.others.employment_type,
              }),
              family_type: clientData.others.family_type,
              client_type: clientData.owner_type,
              ...(!IS_MOBILE && {
                gender: clientData.gender,
              }),
              // xxxxxxxxxxxxx: "xxxxxxxxxxxxxxx",
            }}
          />
        )}

        {/* Next of Kin */}
        <LandlordTenantInfo
          heading="Next of Kin"
          info={{
            name: clientData.next_of_kin.name,
            address: clientData.next_of_kin.address,
            "phone number": clientData.next_of_kin.phone,
            relationship: clientData.next_of_kin.relationship,
          }}
        />

        {/* Notes */}
        {clientData?.user_tag === "web" ? (
          <NotesInfoBox notes={clientData.notes} />
        ) : (
          <>
            <LandlordTenantInfo
              containerClassName="flex flex-col justify-center"
              heading="Others"
              info={{
                occupation: clientData.others.employment,
                ...(clientData.others.employment &&
                  clientData.others.employment.toLowerCase() ===
                  "employed" && {
                  employment_title: clientData.others.employment_type,
                }),
                family_type: clientData.others.family_type,
                // xxxxxxxxxxxxx: "xxxxxxxxxxxxxxx",
              }}
            />
          </>
        )}
      </div>

      {/* Edit attachment */}
      {clientData?.user_tag === "mobile" && (
        <LandlordEditContext.Provider value={{ data: clientData }}>
          <LandlordEditAttachmentInfoSection noDefault />
        </LandlordEditContext.Provider>
      )}

      {/* Property Managed */}
      {clientData &&
        clientData?.properties_managed &&
        clientData?.properties_managed?.length > 0 && (
          <LandlordTenantInfoSection title="Property Managed">
            {clientData?.properties_managed?.length === 0 ? (""
            ) : (
              <AutoResizingGrid minWidth={315}>
                {clientData?.properties_managed?.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </AutoResizingGrid>
            )}
          </LandlordTenantInfoSection>
        )}

      {/* Statement */}
      {clientData &&
        clientData?.statement &&
        clientData.statement?.length > 0 && (
          <SectionContainer
            heading="Statement"
            {...((clientData?.statement?.length ?? 0) > 0 && {
              href: `/management/client/${clientId}/export`,
            })}
            style={{ fontSize: "25px", fontWeight: "700" }}
          >
            {(clientData?.statement?.length ?? 0) === 0 ? (
              // <div className="flex justify-center items-center h-32 text-neutral-500">
              //   The client does not have any statement yet
              // </div>
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
          ...(clientData?.properties_managed ?? []),
          ...(clientData?.previous_properties ?? []),
        ].length === 0 ? (
          <div className="">
            {/* No documents available for any properties */}
          </div>
        ) : (
          <>
            {[
              ...(clientData?.properties_managed ?? []),
              ...(clientData?.previous_properties ?? []),
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
                    {/* No documents available for this property */}
                  </p>
                )}
              </LandlordTenantInfoSection>
            ))}
          </>
        )}
      </div>

      {/* Previous Property */}
      {clientData &&
        clientData?.previous_properties &&
        clientData?.previous_properties?.length > 0 && (
          <LandlordTenantInfoSection title="previous property">
            <AutoResizingGrid minWidth={315}>
              {clientData?.previous_properties?.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </AutoResizingGrid>
          </LandlordTenantInfoSection>
        )}
    </div>
  );
};

export default ManageClient;
