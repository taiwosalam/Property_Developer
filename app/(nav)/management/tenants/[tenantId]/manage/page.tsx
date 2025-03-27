"use client";

// Fonts
import { secondaryFont } from "@/utils/fonts";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import UserTag from "@/components/Tags/user-tag";
import CustomLoader from "@/components/Loader/CustomLoader";
import {
  LandlordTenantInfo,
  LandlordTenantInfoBox,
  LandlordTenantInfoSection,
  LandlordTenantInfoDocument,
  NotesInfoBox,
  MobileNotesModal,
} from "@/components/Management/landlord-tenant-info-components";
import { ChevronLeft } from "@/public/icons/icons";
import UnitItem from "@/components/Management/Properties/unit-item";
import { getObjectProperties } from "@/utils/get-object-properties";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useRouter } from "next/navigation";
import CustomTable from "@/components/Table/table";
import {
  statementTableFields,
  statementTableData,
  IndividualTenantAPIResponse,
  transformIndividualTenantAPIResponse,
} from "./data";
import { TenantEditAttachmentSection } from "@/components/Management/Tenants/Edit/tenant-edit-info-sectios";
import { groupDocumentsByType } from "@/utils/group-documents";
import useFetch from "@/hooks/useFetch";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import UpdateProfileWithIdModal from "@/components/Management/update-with-id-modal";
import { TenantEditContext } from "@/components/Management/Tenants/Edit/tenant-edit-context";
import { TenantData } from "../../types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { UnitStatusColors } from "@/components/Management/Properties/property-preview";
import dayjs from "dayjs";

const ManageTenant = ({ params }: { params: { tenantId: string } }) => {
  const { tenantId } = params;
  const router = useRouter();

  const {
    data: apiData,
    error,
    loading,
    refetch,
  } = useFetch<IndividualTenantAPIResponse>(`tenant/${tenantId}`);
  useRefetchOnEvent("refetchtenant", () => refetch({ silent: true }));

  const tenant = apiData ? transformIndividualTenantAPIResponse(apiData) : null;

  if (loading) return <CustomLoader layout="profile" />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!tenant) return null;

  const groupedDocuments = groupDocumentsByType(tenant?.documents);

  const otherData = getObjectProperties({ obj: tenant, exceptions: ["notes"] });

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
              src={tenant?.picture || ""}
              alt="profile picture"
              size={120}
              rounded
              containerClassName="bg-[#F0F2F5] w-fit rounded-full"
            />

            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-black text-lg lg:text-xl font-bold capitalize">
                    {tenant.name}
                  </p>
                  {tenant.badge_color && (
                    <BadgeIcon color={tenant.badge_color} />
                  )}
                </div>
                <p
                  className={`${secondaryFont.className} text-sm font-normal dark:text-white text-[#151515B3]`}
                >
                  {tenant.email}
                </p>
              </div>
              <div className="custom-flex-col gap-2">
                <UserTag type={tenant.user_tag} />
                <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                  ID: {tenant.id}
                </p>
              </div>
            </div>
          </div>

          <div className="w-fit mx-auto flex flex-wrap gap-4">
            {tenant?.user_tag === "mobile" ? (
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
                    <MobileNotesModal notes={tenant.notes} />
                  </ModalContent>
                </Modal>
              </>
            ) : (
              <>
                <Button
                  href={`/management/tenants/${tenant?.id}/manage/edit`}
                  size="base_medium"
                  className="py-2 px-8"
                >
                  edit
                </Button>
                <Modal>
                  <ModalTrigger>
                    <Button size="base_medium" className="py-2 px-8">
                      update with Email
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <UpdateProfileWithIdModal
                      page="tenant"
                      id={Number(tenant.id)}
                    />
                  </ModalContent>
                </Modal>
              </>
            )}
          </div>
        </LandlordTenantInfoBox>

        {tenant?.user_tag === "mobile" && (
          <LandlordTenantInfo
            info={{
              gender: tenant.gender,
              birthday: tenant.birthdate,
              religion: tenant.religion,
              phone: tenant.phone_number,
              "marital status": tenant.marital_status,
            }}
          />
        )}

        {Object.keys(otherData).map((key, idx) => (
          <LandlordTenantInfo key={idx} heading={key} info={otherData[key]} />
        ))}
        {tenant?.user_tag === "web" && <NotesInfoBox notes={tenant.notes} />}
      </div>
      <LandlordTenantInfoSection title="current rent">
        {tenant?.current_rent?.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-4">
            Tenant does not have any rent yet!
          </p>
        ) : (
          tenant?.current_rent?.map((rent, index) => (
            <UnitItem key={index} {...rent} />
          ))
        )}
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="statement">
        <CustomTable
          fields={statementTableFields}
          data={tenant.statement ?? []}
          tableBodyCellSx={{ fontSize: "1rem" }}
          tableHeadCellSx={{ fontSize: "1rem" }}
        />
      </LandlordTenantInfoSection>
      {tenant?.user_tag === "mobile" && (
        <TenantEditContext.Provider value={{ data: tenant }}>
          <TenantEditAttachmentSection />
        </TenantEditContext.Provider>
      )}
      <LandlordTenantInfoSection title="shared documents">
        {Object.entries(groupedDocuments).map(([documentType, documents]) => {
          if (documentType === "others") return null; 
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
        {groupedDocuments?.["others"] && (
          <LandlordTenantInfoSection
            minimized
            title="other documents"
            key="other document"
          >
            <div className="flex flex-wrap gap-4">
              {groupedDocuments?.["others"]?.map((document) => (
                <LandlordTenantInfoDocument key={document.id} {...document} />
              ))}
            </div>
          </LandlordTenantInfoSection>
        )}
      </LandlordTenantInfoSection>

      <LandlordTenantInfoSection title="previous rent">
        <div className="opacity-40">
          {tenant?.previous_rent?.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-4">
              Empty Previous Rent
            </p>
          ) : (
            tenant?.previous_rent?.map((rent, index) => (
              <UnitItem key={index} {...rent} />
            ))
          )}
        </div>
      </LandlordTenantInfoSection>
    </div>
  );
};

export default ManageTenant;
