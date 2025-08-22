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
  transformIndividualLandlordAPIResponse,
  type IndividualLandlordAPIResponse,
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
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

const AddPropertyModal = dynamic(
  () => import("@/components/Management/Properties/add-property-modal"),
  { ssr: false }
);

const ManageLandlord = ({ params }: { params: { landlordId: string } }) => {
  const { landlordId } = params;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const { role } = useRole();

  // PERMISSIONS
  const canCreateAndManageLandlord = usePermission(
    role,
    "Can add and manage landlords/landlady"
  );

  const { data, error, loading, isNetworkError, refetch } =
    useFetch<IndividualLandlordAPIResponse>(`landlord/${landlordId}`);
  useRefetchOnEvent("refetchlandlord", () => refetch({ silent: true }));

  const landlordData = data
    ? transformIndividualLandlordAPIResponse(data)
    : null;

  useEffect(() => {
    if (landlordData) {
      setGlobalStore("selectedLandlordId", landlordData.id);
      const newMessageUserData = landlordData?.messageUserData;
      const currentMessageUserData = useGlobalStore.getState()?.messageUserData;

      if (
        JSON.stringify(currentMessageUserData) !==
        JSON.stringify(newMessageUserData)
      ) {
        setGlobalStore("messageUserData", newMessageUserData);
      }
    }
  }, [setGlobalStore, landlordData]);

  const userData = landlordData ? transformCardData(landlordData) : null;

  if (loading) return <CustomLoader layout="profile" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!landlordData) return null;
  const groupedDocuments = groupDocumentsByType(landlordData?.documents);

  const CAN_DELETE =
    landlordData && landlordData.properties_managed?.length === 0;
  const IS_MOBILE = landlordData?.user_tag === "mobile";

  const transformedTableData = landlordData?.statement?.map((item) => ({
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
    if (!landlordData.user_id)
      return toast.warning("Landlord User ID not Found!");
    router.push(`/messages/${landlordData?.user_id}`);
  };

  // const handleAttachProperty = () => {
  //   setGlobalStore("selectedLandlordId", landlordId);
  //   setIsModalOpen(true);
  // };

  const handleAttachProperty = () => {
    router.push(
      `/staff/management/properties/create-rental-property?landlordId=${landlordId}`
    );
  };

  return (
    <div className="custom-flex-col gap-6 lg:gap-10">
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
              src={landlordData?.picture || ""}
              alt="profile picture"
              size={120}
              containerClassName="w-fit custom-secondary-bg rounded-full"
              rounded
            />

            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center">
                  <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                    {landlordData.title} {landlordData.name}
                  </p>
                  <div className="flex gap-2 items-center">
                    {landlordData.badge_color && (
                      <BadgeIcon color={landlordData.badge_color} />
                    )}
                  </div>
                </div>
                <p
                  className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
                >
                  {landlordData?.email}
                </p>
                {!IS_MOBILE && (
                  <p
                    className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
                  >
                    {landlordData?.phone_number}
                  </p>
                )}
              </div>
              <div className="custom-flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <UserTag type={landlordData.user_tag} />
                  {landlordData?.note && (
                    <Modal>
                      <ModalTrigger>
                        <NoteBlinkingIcon size={20} className="blink-color" />
                      </ModalTrigger>
                      <ModalContent>
                        <ViewNote note={landlordData.notes?.write_up || ""} />
                      </ModalContent>
                    </Modal>
                  )}
                </div>
                {IS_MOBILE && (
                  <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                    ID: {landlordData?.id}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-fit mx-auto flex flex-wrap gap-4">
            {landlordData?.user_tag === "mobile" ? (
              <>
                <Button
                  onClick={goToMessage}
                  size="base_medium"
                  className="py-2 px-4 page-header-button"
                >
                  message
                </Button>

                {canCreateAndManageLandlord && (
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
                        id={landlordId}
                        page="landlord"
                        notes={landlordData.notes}
                      />
                    </ModalContent>
                  </Modal>
                )}
              </>
            ) : (
              canCreateAndManageLandlord && (
                <>
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
                      <AddPropertyModal id={Number(landlordId)} />
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
                        id={Number(landlordData.id)}
                        data={userData && userData}
                      />
                    </ModalContent>
                  </Modal>
                </>
              )
            )}
          </div>
        </LandlordTenantInfoBox>

        {/* Notes */}
        {landlordData?.user_tag === "web" && (
          <NotesInfoBox notes={landlordData.notes} />
        )}
      </div>

      {/* Edit attachment */}
      {landlordData?.user_tag === "mobile" && (
        <LandlordEditContext.Provider value={{ data: landlordData }}>
          <LandlordEditAttachmentInfoSection noDefault />
        </LandlordEditContext.Provider>
      )}

      {/* Property Managed */}
      {landlordData &&
        landlordData?.properties_managed &&
        landlordData?.properties_managed?.length > 0 && (
          <LandlordTenantInfoSection title="Property Managed">
            {landlordData?.properties_managed?.length === 0 ? (
              // <div className="flex justify-center items-center h-32 text-neutral-500">
              //   The landlord does not manage any property yet
              // </div>
              ""
            ) : (
              <AutoResizingGrid minWidth={315}>
                {landlordData?.properties_managed?.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </AutoResizingGrid>
            )}
          </LandlordTenantInfoSection>
        )}

      {/* Statement */}
      {landlordData &&
        landlordData?.statement &&
        landlordData.statement?.length > 0 && (
          <SectionContainer
            heading="Statement"
            {...((landlordData?.statement?.length ?? 0) > 0 && {
              href: `/staff/management/landlord/${landlordId}/export`,
            })}
            style={{ fontSize: "25px", fontWeight: "700" }}
          >
            {(landlordData?.statement?.length ?? 0) === 0 ? (
              // <div className="flex justify-center items-center h-32 text-neutral-500">
              //   The landlord does not have any statement yet
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

      {/* Shared Documents */}
      <div>
        {[
          ...(landlordData?.properties_managed ?? []),
          ...(landlordData?.previous_properties ?? []),
        ].length === 0 ? (
          <div className="">
            {/* No documents available for any properties */}
          </div>
        ) : (
          <>
            {[
              ...(landlordData?.properties_managed ?? []),
              ...(landlordData?.previous_properties ?? []),
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
      {landlordData &&
        landlordData?.previous_properties &&
        landlordData?.previous_properties?.length > 0 && (
          <LandlordTenantInfoSection title="previous property">
            <AutoResizingGrid minWidth={315}>
              {landlordData?.previous_properties?.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </AutoResizingGrid>
          </LandlordTenantInfoSection>
        )}
    </div>
  );
};

export default ManageLandlord;
