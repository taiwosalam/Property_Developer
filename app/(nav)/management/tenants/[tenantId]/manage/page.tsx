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
} from "@/components/Management/landlord-tenant-info-components";
import { ChevronLeft } from "@/public/icons/icons";
import { ASSET_URL, empty } from "@/app/config";
import useTenantData from "@/hooks/useTenantData";
import UnitItem from "@/components/Management/Properties/unit-item";
import { getObjectProperties } from "@/utils/get-object-properties";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import UpdateTenantProfile from "@/components/Management/Tenants/update-tenant-profile";
import { useRouter } from "next/navigation";
import { TenantData } from "../../types";
import { MockFunction } from "@/components/Management/Tenants/Edit/mock";

const groupDocumentsByType = (documents: TenantData["documents"]) => {
  return documents.reduce((acc, document) => {
    if (!acc[document.document_type]) {
      acc[document.document_type] = [];
    }
    acc[document.document_type].push(document);
    return acc;
  }, {} as Record<string, TenantData["documents"]>);
};

const ManageTenant = () => {
  // const { tenant, tenantId, loading, error } = useTenantData();
  const {
    data: tenant,
    id: tenantId,
    loading,
    error,
  } = MockFunction("tenant") as {
    data: TenantData;
    id: string | number;
    loading: boolean;
    error: Error | null;
  };
  const router = useRouter();
  if (loading) return <CustomLoader layout="profile" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!tenant) return null;

  const groupedDocuments = groupDocumentsByType(tenant?.documents);

  const otherData = getObjectProperties(tenant);

  return (
    <div className="custom-flex-col gap-6 lg:gap-10">
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <LandlordTenantInfoBox
          style={{ padding: "24px 40px" }}
          className="relative flex flex-col xl:flex-row gap-5"
        >
          <button
            type="button"
            aria-label="back"
            className="absolute top-3 left-3"
            onClick={() => router.back()}
          >
            <ChevronLeft />
          </button>
          <Picture
            src={tenant.picture ? `${ASSET_URL}${tenant.picture}` : empty}
            alt="profile picture"
            size={120}
            rounded
          />
          <div className="custom-flex-col gap-8">
            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-black text-lg lg:text-xl font-bold capitalize">
                    {tenant.first_name} {tenant.last_name}
                  </p>
                </div>
                <p
                  style={{ color: "rgba(21, 21, 21, 0.70)" }}
                  className={`${secondaryFont.className} text-sm font-normal`}
                >
                  {tenant.email}
                </p>
              </div>
              <div className="custom-flex-col gap-2">
                <UserTag type={tenant.user_tag} />
                <p className="text-neutral-800 text-base font-medium">
                  ID: {tenantId}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {tenant.user_tag === "web" ? (
                <>
                  <Button
                    href={`/management/tenants/${tenantId}/manage/edit`}
                    size="base_medium"
                    className="py-2 px-8"
                  >
                    edit
                  </Button>
                  <Modal>
                    <ModalTrigger asChild>
                      <Button size="base_medium" className="py-2 px-8">
                        update with ID
                      </Button>
                    </ModalTrigger>
                    <ModalContent>
                      <UpdateTenantProfile />
                    </ModalContent>
                  </Modal>
                </>
              ) : (
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
                </>
              )}
            </div>
          </div>
        </LandlordTenantInfoBox>

        <LandlordTenantInfo
          info={{
            gender: tenant.gender,
            birthday: tenant.birthdate,
            religion: tenant.religion,
            phone: tenant.phone_number,
            "marital status": tenant.marital_status,
          }}
        />

        {Object.keys(otherData).map((key, idx) => (
          <LandlordTenantInfo key={idx} heading={key} info={otherData[key]} />
        ))}
      </div>
      <LandlordTenantInfoSection title="current rent">
        <UnitItem />
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="Property">
        <UnitItem />
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="statement">
        <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
          <table className="dash-table">
            <colgroup>
              <col className="w-[72px]" />
            </colgroup>
            <thead>
              <tr>
                <th>S/N</th>
                <th>payment date</th>
                <th>amount paid</th>
                <th>details</th>
                <th>start date</th>
                <th>due date</th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(null)
                .map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <p>{idx + 1}</p>
                    </td>
                    <td>
                      <p>12/01/2023</p>
                    </td>
                    <td>
                      <p>₦115,000.00</p>
                    </td>
                    <td>
                      <p>Rent cost: Start date: Sept 22, 2020</p>
                    </td>
                    <td>
                      <p>12/01/2023</p>
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
      <LandlordTenantInfoSection title="previous rent">
        <div className="opacity-40">
          <UnitItem />
        </div>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="previous property">
        <div className="opacity-40">
          <UnitItem />
        </div>
      </LandlordTenantInfoSection>
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

export default ManageTenant;
