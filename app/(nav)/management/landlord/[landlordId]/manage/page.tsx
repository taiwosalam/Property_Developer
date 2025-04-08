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

const ManageLandlord = ({ params }: { params: { landlordId: string } }) => {
  const { landlordId } = params;
  const router = useRouter();
  const { data, error, loading, isNetworkError, refetch } =
    useFetch<IndividualLandlordAPIResponse>(`landlord/${landlordId}`);
  useRefetchOnEvent("refetchlandlord", () => refetch({ silent: true }));

  const landlordData = data
    ? transformIndividualLandlordAPIResponse(data)
    : null;

  const userData = landlordData ? transformCardData(landlordData) : null;

  if (loading) return <CustomLoader layout="profile" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!landlordData) return null;
  const groupedDocuments = groupDocumentsByType(landlordData?.documents);

  const transformedTableData = landlordData?.statement?.map((item) => ({
    ...item,
    credit: (
      <p className={item.credit ? "text-status-success-3" : ""}>
        {item.credit ? item.credit : "--- ---"}
      </p>
    ),
    debit: (
      <p className={item.debit ? "text-status-error-2" : ""}>
        {item.debit ? item.debit : "--- ---"}
      </p>
    ),
  }));

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
                    {/* {landlordData?.first_name} {landlordData?.last_name} */}
                    {landlordData.name}
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
              </div>
              <div className="custom-flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <UserTag type={landlordData.user_tag} />
                  {landlordData?.note && 
                    <NoteBlinkingIcon size={20} className="blink-color" />
                  }
                </div>
                <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                  ID: {landlordData?.id}
                </p>
              </div>
            </div>
          </div>

          <div className="w-fit mx-auto flex flex-wrap gap-4">
            {landlordData?.user_tag === "mobile" ? (
              <>
                <Button size="base_medium" className="py-2 px-8">
                  message
                </Button>
                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      variant="light_green"
                      size="base_medium"
                      className="py-2 px-8"
                    >
                      Edit
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <EditMobileUser page="landlord" id={landlordId} />
                  </ModalContent>
                </Modal>

                <Modal>
                  <ModalTrigger asChild>
                    <Button
                      variant="sky_blue"
                      size="base_medium"
                      className="py-2 px-8"
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
              </>
            ) : (
              <>
                <Button
                  href={`/management/landlord/${landlordId}/manage/edit`}
                  size="base_medium"
                  className="py-2 px-8"
                >
                  edit
                </Button>
                <Modal>
                  <ModalTrigger asChild>
                    <Button size="base_medium" className="py-2 px-8">
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
            )}
          </div>
        </LandlordTenantInfoBox>

        {landlordData?.user_tag === "mobile" ? (
          <LandlordTenantInfo
            info={{
              gender: landlordData.gender,
              birthday: landlordData.birthday,
              religion: landlordData.religion,
              phone: landlordData.phone_number,
              marital_status: landlordData.marital_status,
            }}
          />
        ) : (
          <LandlordTenantInfo
            heading="Contact Address"
            info={{
              address: landlordData.contact_address.address,
              city: landlordData.contact_address.city,
              state: landlordData.contact_address.state,
              "L.G": landlordData.contact_address.local_govt,
            }}
          />
        )}

        <LandlordTenantInfo
          heading="bank details"
          info={{
            bank: landlordData.bank_details.bank_name,
            "account name": landlordData.bank_details.account_name,
            "account number": landlordData.bank_details.account_number,
            ...(landlordData.user_tag === "mobile" && {
              "wallet ID": landlordData.bank_details.wallet_id,
            }),
          }}
        />

        {landlordData?.user_tag === "mobile" ? (
          <LandlordTenantInfo
            heading="Contact Address"
            containerClassName="flex flex-col justify-center"
            info={{
              address: landlordData.contact_address.address,
              city: landlordData.contact_address.city,
              state: landlordData.contact_address.state,
              "L.G": landlordData.contact_address.local_govt,
            }}
          />
        ) : (
          <LandlordTenantInfo
            containerClassName="flex flex-col justify-center"
            heading="Others"
            info={{
              occupation: landlordData.others.employment,
              ...(landlordData.others.employment &&
                landlordData.others.employment.toLowerCase() === "employed" && {
                  employment_title: landlordData.others.employment_type,
                }),
              family_type: landlordData.others.family_type,
              landlord_type: landlordData.owner_type,
              // xxxxxxxxxxxxx: "xxxxxxxxxxxxxxx",
            }}
          />
        )}

        <LandlordTenantInfo
          heading="Next of Kin"
          info={{
            name: landlordData.next_of_kin.name,
            address: landlordData.next_of_kin.address,
            "phone number": landlordData.next_of_kin.phone,
            relationship: landlordData.next_of_kin.relationship,
          }}
        />
        {landlordData?.user_tag === "web" ? (
          <NotesInfoBox notes={landlordData.notes} />
        ) : (
          <>
            <LandlordTenantInfo
              containerClassName="flex flex-col justify-center"
              heading="Others"
              info={{
                occupation: landlordData.others.employment,
                ...(landlordData.others.employment &&
                  landlordData.others.employment.toLowerCase() ===
                    "employed" && {
                    employment_title: landlordData.others.employment_type,
                  }),
                family_type: landlordData.others.family_type,
                // xxxxxxxxxxxxx: "xxxxxxxxxxxxxxx",
              }}
            />
          </>
        )}
      </div>
      <LandlordTenantInfoSection title="Property Managed">
        {landlordData?.properties_managed?.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-neutral-500">
            The landlord does not manage any property yet
          </div>
        ) : (
          <AutoResizingGrid minWidth={315}>
            {landlordData?.properties_managed?.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </AutoResizingGrid>
        )}
      </LandlordTenantInfoSection>
      <SectionContainer
        heading="Statement"
        {...((landlordData?.statement?.length ?? 0) > 0 && {
          href: `/management/landlord/${landlordId}/export`,
        })}
        style={{ fontSize: "25px", fontWeight: "700" }}
      >
        {(landlordData?.statement?.length ?? 0) === 0 ? (
          <div className="flex justify-center items-center h-32 text-neutral-500">
            The landlord does not have any statement yet
          </div>
        ) : (
          <CustomTable
            fields={statementTableFields}
            data={transformedTableData ?? []}
            tableBodyCellSx={{ fontSize: "1rem" }}
            tableHeadCellSx={{ fontSize: "1rem" }}
          />
        )}
      </SectionContainer>

      {landlordData?.user_tag === "mobile" && (
        <LandlordEditContext.Provider value={{ data: landlordData }}>
          <LandlordEditAttachmentInfoSection />
        </LandlordEditContext.Provider>
      )}
      <LandlordTenantInfoSection title="shared documents">
        {landlordData?.documents?.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-neutral-500">
            The landlord does not have any document yet
          </div>
        ) : (
          <>
            {Object.entries(groupedDocuments).map(
              ([documentType, documents]) => {
                if (documentType === "others") return null; // Skip "others" for now
                return (
                  <LandlordTenantInfoSection
                    minimized
                    title={documentType}
                    key={documentType}
                  >
                    <div className="flex flex-wrap gap-4">
                      {documents?.map((document) => (
                        <LandlordTenantInfoDocument
                          key={document.id}
                          {...document}
                        />
                      ))}
                    </div>
                  </LandlordTenantInfoSection>
                );
              }
            )}
            {groupedDocuments?.others && (
              <LandlordTenantInfoSection
                minimized
                title="other documents"
                key="other document"
              >
                <div className="flex flex-wrap gap-4">
                  {groupedDocuments.others.map((document) => (
                    <LandlordTenantInfoDocument
                      key={document.id}
                      {...document}
                    />
                  ))}
                </div>
              </LandlordTenantInfoSection>
            )}
          </>
        )}
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="previous property">
        {landlordData?.previous_properties?.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-neutral-500">
            The landlord does not have any previous property yet
          </div>
        ) : (
          <AutoResizingGrid minWidth={315}>
            {landlordData?.previous_properties?.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </AutoResizingGrid>
        )}
      </LandlordTenantInfoSection>
    </div>
  );
};

export default ManageLandlord;
