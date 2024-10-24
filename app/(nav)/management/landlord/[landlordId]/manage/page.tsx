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
} from "@/components/Management/landlord-tenant-info-components";
import PropertyCard from "@/components/Management/Properties/property-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import { ASSET_URL, empty } from "@/app/config";
import UserTag from "@/components/Tags/user-tag";
import CustomLoader from "@/components/Loader/CustomLoader";
import useLandlordData from "@/hooks/useLandlordData";
import { MockFunction } from "@/components/Management/Tenants/Edit/mock";
import type { LandlordPageData } from "../../types";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { MobileNotesModal } from "@/components/Management/Landlord/Edit/landlord-edit-info-sections";
import { LandlordEditAttachmentInfoSection } from "@/components/Management/Landlord/Edit/landlord-edit-info-sections";
import CustomTable from "@/components/Table/table";
import { statementTableFields, statementTableData } from "./data";

const ManageLandlord = () => {
  // const {
  //   landlord: LandlordPageData,
  //   landlordId,
  //   loading,
  //   error,
  // } = useLandlordData();

  // Stressing myself
  const isDarkMode = useDarkMode();
  const {
    data: LandlordPageData,
    loading,
    error,
  } = MockFunction("landlord") as {
    data: LandlordPageData;
    loading: boolean;
    error: Error | null;
  };

  const router = useRouter();
  const groupDocumentsByType = (documents: LandlordPageData["documents"]) => {
    return documents.reduce((acc, document) => {
      if (!acc[document.document_type]) {
        acc[document.document_type] = [];
      }
      acc[document.document_type].push(document);
      return acc;
    }, {} as Record<string, LandlordPageData["documents"]>);
  };

  if (loading) return <CustomLoader layout="profile" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!LandlordPageData) return null;
  const groupedDocuments = groupDocumentsByType(LandlordPageData?.documents);

  const transformedTableData = statementTableData.map((item) => ({
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
              src={
                LandlordPageData.picture
                  ? `${ASSET_URL}${LandlordPageData.picture}`
                  : empty
              }
              alt="profile picture"
              size={120}
              rounded
            />

            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center">
                  <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                    {LandlordPageData?.first_name} {LandlordPageData?.last_name}
                  </p>
                  <BadgeIcon color="blue" />
                </div>
                <p
                  style={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.70)"
                      : "rgba(21, 21, 21, 0.70)",
                  }}
                  className={`${secondaryFont.className} text-sm font-normal`}
                >
                  {LandlordPageData?.email}
                </p>
              </div>
              <div className="custom-flex-col gap-2">
                <UserTag type={LandlordPageData.user_tag} />
                <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                  {/* ID: {LandlordPageData?.id || landlordId} */}
                  ID: {LandlordPageData?.id}
                </p>
              </div>
            </div>
          </div>

          <div className="w-fit mx-auto flex flex-wrap gap-4">
            {LandlordPageData?.user_tag === "mobile" ? (
              <>
                <Button size="base_medium" className="py-2 px-8">
                  message
                </Button>
                <Button
                  variant="light_green"
                  size="base_medium"
                  className="py-2 px-8"
                >
                  unflag
                </Button>
                <Modal>
                  <ModalTrigger>
                    <Button
                      variant="sky_blue"
                      size="base_medium"
                      className="py-2 px-8"
                    >
                      Note
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <MobileNotesModal notes={LandlordPageData.notes} />
                  </ModalContent>
                </Modal>
              </>
            ) : (
              <>
                <Button
                  href={`/management/landlord/${LandlordPageData?.id}/manage/edit`}
                  size="base_medium"
                  className="py-2 px-8"
                >
                  edit
                </Button>
                <Button size="base_medium" className="py-2 px-8">
                  update with ID
                </Button>
              </>
            )}
          </div>
        </LandlordTenantInfoBox>

        {LandlordPageData?.user_tag === "mobile" ? (
          <LandlordTenantInfo
            info={{
              gender: "LandlordPageData.gender",
              birthday: "LandlordPageData.birthday",
              religion: "LandlordPageData.religion",
              phone: LandlordPageData.phone_number,
              marital_status: "LandlordPageData.marital_status",
            }}
          />
        ) : (
          <LandlordTenantInfo
            heading="Contact Address"
            info={
              LandlordPageData?.contact_address
                ? {
                    address: LandlordPageData.contact_address.address,
                    city: LandlordPageData.contact_address.city,
                    state: LandlordPageData.contact_address.state,
                    "L.G": LandlordPageData.contact_address.local_govt,
                  }
                : {}
            }
          />
        )}

        <LandlordTenantInfo
          containerClassName="flex flex-col justify-center"
          heading="bank details"
          info={
            LandlordPageData?.bank_details
              ? {
                  bank: LandlordPageData.bank_details.bank_name,
                  "account name": LandlordPageData.bank_details.account_name,
                  "account number":
                    LandlordPageData.bank_details.account_number,
                  "wallet ID": LandlordPageData.bank_details.wallet_id,
                }
              : {}
          }
        />

        {LandlordPageData?.user_tag === "mobile" ? (
          <LandlordTenantInfo
            heading="Contact Address"
            containerClassName="flex flex-col justify-center"
            info={
              LandlordPageData?.contact_address
                ? {
                    address: LandlordPageData.contact_address.address,
                    city: LandlordPageData.contact_address.city,
                    state: LandlordPageData.contact_address.state,
                    "L.G": LandlordPageData.contact_address.local_govt,
                  }
                : {}
            }
          />
        ) : (
          <LandlordTenantInfo
            containerClassName="flex flex-col justify-center"
            heading="Others"
            info={{
              occupation: "LandlordPageData?.occupation",
              employment_title: "LandlordPageData?.employment_title",
              "family type": "LandlordPageData?.family_type",
              xxxxxxxxxxxxx: "xxxxxxxxxxxxxxx",
            }}
          />
        )}

        <LandlordTenantInfo
          heading="Next of Kin"
          info={{
            name: "LandlordPageData.next_of_kin.name",
            address: "LandlordPageData.next_of_kin.address",
            "phone number": "LandlordPageData.next_of_kin.phone_number",
            relationship: "LandlordPageData.next_of_kin.relationship",
          }}
        />
        {LandlordPageData?.user_tag === "web" ? (
          <NotesInfoBox notes={LandlordPageData.notes} />
        ) : (
          <>
            <LandlordTenantInfo
              containerClassName="flex flex-col justify-center"
              heading="Others"
              info={{
                occupation: "LandlordPageData?.occupation",
                employment_title: "LandlordPageData?.employment_title",
                "family type": "LandlordPageData?.family_type",
                xxxxxxxxxxxxx: "xxxxxxxxxxxxxxx",
              }}
            />
            <LandlordTenantInfo
              heading="Guarantor 1"
              containerClassName="flex flex-col justify-center"
              info={{
                name: "LandlordPageData.guarantor1.name",
                email: "LandlordPageData.guarantor1.email",
                "phone number": "LandlordPageData.guarantor1.phone_number",
                address: "LandlordPageData.guarantor1.address",
              }}
            />
            <LandlordTenantInfo
              heading="Guarantor 2"
              containerClassName="flex flex-col justify-center"
              info={{
                name: "LandlordPageData.guarantor2.name",
                email: "LandlordPageData.guarantor2.email",
                "phone number": "LandlordPageData.guarantor2.phone_number",
                address: "LandlordPageData.guarantor2.address",
              }}
            />
          </>
        )}
      </div>
      <LandlordTenantInfoSection title="Property Managed">
        <AutoResizingGrid minWidth={315}>
          {LandlordPageData?.properties_managed?.map((property) => (
            <PropertyCard
              key={property.id}
              images={property.images}
              id={property.id.toString()}
              propertyId={property.id.toString()}
              name={property.name}
              units={property.units}
              address={property.address}
              price={property.rental_value}
              currency={property.currency}
            />
          ))}
        </AutoResizingGrid>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="statement">
        <CustomTable
          fields={statementTableFields}
          data={transformedTableData}
          tableHeadClassName="bg-brand-9"
          oddRowColor={isDarkMode ? "#020617" : "var(--brand-1)"}
          evenRowColor={isDarkMode ? "#3C3D37" : "#fff"}
          tableBodyCellSx={{ fontSize: "1rem" }}
          tableHeadCellSx={{ fontSize: "1rem" }}
        />
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="previous property">
        <div className="flex gap-8"></div>
      </LandlordTenantInfoSection>
      {LandlordPageData?.user_tag === "mobile" && (
        <LandlordEditAttachmentInfoSection useContext={false} />
      )}
      <LandlordTenantInfoSection title="shared documents">
        {Object.entries(groupedDocuments).map(([documentType, documents]) => {
          if (documentType === "other document") return null; // Skip "other document" for now
          return (
            <LandlordTenantInfoSection
              minimized
              title={documentType}
              key={documentType}
            >
              <div className="flex flex-wrap gap-4">
                {documents.map((document) => (
                  <LandlordTenantInfoDocument key={document.id} {...document} />
                ))}
              </div>
            </LandlordTenantInfoSection>
          );
        })}
        {groupedDocuments["other document"] && (
          <LandlordTenantInfoSection
            minimized
            title="other documents"
            key="other document"
          >
            <div className="flex flex-wrap gap-4">
              {groupedDocuments["other document"].map((document) => (
                <LandlordTenantInfoDocument key={document.id} {...document} />
              ))}
            </div>
          </LandlordTenantInfoSection>
        )}
      </LandlordTenantInfoSection>
    </div>
  );
};

export default ManageLandlord;
