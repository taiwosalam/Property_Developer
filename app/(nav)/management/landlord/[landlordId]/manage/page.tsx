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

const ManageLandlord = ({ params }: { params: { landlordId: string } }) => {
  const { landlordId } = params;
  const router = useRouter();
  const { data, error, loading, isNetworkError } =
    useFetch<IndividualLandlordAPIResponse>(`landlord/${landlordId}`);

  const landlordData = data
    ? transformIndividualLandlordAPIResponse(data)
    : null;

  if (loading) return <CustomLoader layout="profile" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!landlordData) return null;
  const groupedDocuments = groupDocumentsByType(landlordData?.documents);

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

  console.log("landlord data", landlordData);
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
              containerClassName="w-fit bg-[#F0F2F5] rounded-full"
              rounded
            />

            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center">
                  <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                    {/* {landlordData?.first_name} {landlordData?.last_name} */}
                    {landlordData.name}
                  </p>
                  {landlordData.badge_color && (
                    <BadgeIcon color={landlordData.badge_color} />
                  )}
                </div>
                <p
                  className={`${secondaryFont.className} text-sm font-normal text-[#151515B2] dark:text-[#FFFFFFB2]`}
                >
                  {landlordData?.email}
                </p>
              </div>
              <div className="custom-flex-col gap-2">
                <UserTag type={landlordData.user_tag} />
                <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                  ID: {landlordData?.user_id}
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
                <Button
                  variant="light_green"
                  size="base_medium"
                  className="py-2 px-8"
                >
                  unflag
                </Button>

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
                    <MobileNotesModal notes={landlordData.notes} />
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
                <Button size="base_medium" className="py-2 px-8">
                  update with ID
                </Button>
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
              xxxxxxxxxxxxx: "xxxxxxxxxxxxxxx",
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
          {landlordData?.properties_managed?.map((property) => (
            <PropertyCard
              key={property.id}
              images={property.images}
              id={property.id.toString()}
              property_name={property.name}
              address={property.address}
              total_units={property.total_units}
              total_income={property.total_income}
              total_returns={property.total_returns}
              property_type="facility"
              total_unit_pictures={2}
              currency="naira"
              mobile_tenants={property.mobile_tenants}
              web_tenants={property.web_tenants}
              owing_units={property.owing_units}
              available_units={property.available_units}
              viewOnly={property.viewOnly}
              isClickable={property.isClickable}
              hasVideo
              branch={property.branch}
            />
          ))}
        </AutoResizingGrid>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="statement">
        <CustomTable
          fields={statementTableFields}
          data={transformedTableData}
          tableBodyCellSx={{ fontSize: "1rem" }}
          tableHeadCellSx={{ fontSize: "1rem" }}
        />
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="previous property">
        <div className="flex gap-8"></div>
      </LandlordTenantInfoSection>
      {landlordData?.user_tag === "mobile" && (
        <LandlordEditContext.Provider value={{ data: landlordData }}>
          <LandlordEditAttachmentInfoSection />
        </LandlordEditContext.Provider>
      )}
      <LandlordTenantInfoSection title="shared documents">
        {Object.entries(groupedDocuments).map(([documentType, documents]) => {
          if (documentType === "others") return null; // Skip "others" for now
          return (
            <LandlordTenantInfoSection
              minimized
              title={documentType}
              key={documentType}
            >
              <div className="flex flex-wrap gap-4">
                {documents?.map((document) => (
                  <LandlordTenantInfoDocument key={document.id} {...document} />
                ))}
              </div>
            </LandlordTenantInfoSection>
          );
        })}
        {groupedDocuments?.others && (
          <LandlordTenantInfoSection
            minimized
            title="other documents"
            key="other document"
          >
            <div className="flex flex-wrap gap-4">
              {groupedDocuments.others.map((document) => (
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
