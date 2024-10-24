"use client";
// Images
import Avatar from "@/public/empty/avatar-1.svg";

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
} from "@/components/Management/landlord-tenant-info-components";
import PropertyCard from "@/components/Management/Properties/property-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { ChevronLeft } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import { ASSET_URL, empty } from "@/app/config";
import UserTag from "@/components/Tags/user-tag";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import CustomLoader from "@/components/Loader/CustomLoader";
import useLandlordData from "@/hooks/useLandlordData";
import { MockFunction } from "@/components/Management/Tenants/Edit/mock";
import type { LandlordPageData } from "../../types";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { MobileNotesModal } from "@/components/Management/Landlord/Edit/landlord-edit-info-sections";
import { LandlordEditAttachmentInfoSection } from "@/components/Management/Landlord/Edit/landlord-edit-info-sections";
import CustomTable from "@/components/Table/table";

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
            <div className="custom-flex-col gap-8">
              <div className="custom-flex-col gap-4">
                <div className="custom-flex-col">
                  <div className="flex items-center">
                    <p className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize">
                      {LandlordPageData?.first_name}{" "}
                      {LandlordPageData?.last_name}
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
          <LandlordTenantInfoBox className="custom-flex-col gap-4">
            <div className="flex justify-between gap-4">
              <h3 className="text-black dark:text-white text-lg lg:text-xl font-bold capitalize flex items-end gap-1">
                <span>Note</span>
                <sub className="text-sm font-normal bottom-[unset]">
                  <span className="font-bold">Last Updated</span>{" "}
                  {LandlordPageData.notes.last_updated}
                </sub>
              </h3>
            </div>
            <TruncatedText
              lines={7}
              className="text-text-quaternary dark:text-darkText-2 text-sm lg:text-base font-normal"
            >
              building, is a residential property that living read more. They
              want to work with their budget in booking an appointment. They
              wants to ease themselves the stress having to que, and also
              reducety that living read more. They want to work with their
              budget in booking an appointment. They wants to ease themselves
              the stress having to que, and stress having to que, and stress
              having to que, and stress having to que, and stress having to que,
              and stress havingalso reduce the read more They wants to ease
              themselves of the stress of having to que, and also reduce the
              time spent searching for something new.for something new. A
              multi-family home, also know as a duplex, triplex, or multi-unit
              building, is a residential property that living read more. They
              want to work with their budget in booking an appointment. ime
              spent searching
            </TruncatedText>
          </LandlordTenantInfoBox>
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
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="w-[72px]" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>name</th>
                <th>payment ID</th>
                <th>details</th>
                <th>credit</th>
                <th>debit</th>
                <th>date</th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(null)
                .map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <Picture
                        src={Avatar}
                        alt="profile picture"
                        size={40}
                        rounded
                      />
                    </td>
                    <td>
                      <p>Abimbola Adedeji</p>
                    </td>
                    <td>
                      <p>22132876554444</p>
                    </td>
                    <td>
                      <p>Rent cost: Start date: Sept 22, 2020</p>
                    </td>
                    <td>
                      <p className="text-status-success-3">₦ 100,000</p>
                    </td>
                    <td>
                      <p className="text-status-error-primary">--- ---</p>
                    </td>
                    <td>
                      <p>12/12/12</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
