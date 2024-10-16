"use client";

// Images
import Avatar from "@/public/empty/avatar-1.svg";
import Verified from "@/public/icons/verified.svg";

// Fonts
import { secondaryFont } from "@/utils/fonts";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import UserTag from "@/components/Tags/user-tag";

import {
  LandlordTenantInfo,
  LandlordTenantInfoBox,
  // LandlordTenantUserTag,
  LandlordTenantInfoSection,
  LandlordTenantInfoDocument,
} from "@/components/Management/landlord-tenant-info-components";

import { ASSET_URL, empty } from "@/app/config";
import useTenantData from "@/hooks/useTenantData";
import UnitItem from "@/components/Management/Properties/unit-item";
import { getObjectProperties } from "@/utils/get-object-properties";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import UpdateTenantProfile from "@/components/Management/Tenants/update-tenant-profile";

const ManageTenant = () => {
  const { tenant, tenantId } = useTenantData();

  if (!tenant) return null;

  const otherData = getObjectProperties(tenant);

  return (
    <div className="custom-flex-col gap-10">
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <LandlordTenantInfoBox style={{ padding: "24px 40px" }}>
          <div className="flex flex-col xl:flex-row gap-5">
            <div className="flex items-start">
              <Picture
                src={tenant.picture ? `${ASSET_URL}${tenant.picture}` : empty}
                alt="profile picture"
                size={120}
                rounded
              />
            </div>
            <div className="custom-flex-col gap-8">
              <div className="custom-flex-col gap-4">
                <div className="custom-flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-black text-xl font-bold capitalize">
                      {tenant.name}
                    </p>
                    <Picture src={Verified} alt="verified" size={16} />
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
        <LandlordTenantInfoSection minimized title="invoice">
          <div className="flex flex-wrap gap-4">
            {Array(4)
              .fill(null)
              .map((_, idx) => (
                <LandlordTenantInfoDocument key={idx} />
              ))}
          </div>
        </LandlordTenantInfoSection>
        <LandlordTenantInfoSection minimized title="receipts">
          <div className="flex flex-wrap gap-4">
            {Array(3)
              .fill(null)
              .map((_, idx) => (
                <LandlordTenantInfoDocument key={idx} />
              ))}
          </div>
        </LandlordTenantInfoSection>
        <LandlordTenantInfoSection minimized title="other documents">
          <div className="flex flex-wrap gap-4">
            {Array(2)
              .fill(null)
              .map((_, idx) => (
                <LandlordTenantInfoDocument key={idx} />
              ))}
          </div>
        </LandlordTenantInfoSection>
      </LandlordTenantInfoSection>
    </div>
  );
};

export default ManageTenant;
