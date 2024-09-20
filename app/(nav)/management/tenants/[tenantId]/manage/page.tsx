"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Images
import Avatar from "@/public/empty/avatar-1.svg";
import Verified from "@/public/icons/verified.svg";

// Types
import type { TenantData } from "../../types";

// Fonts
import { secondaryFont } from "@/utils/fonts";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";

import {
  LandlordTenantInfo,
  LandlordTenantInfoBox,
  LandlordTenantInfoSection,
  LandlordTenantInfoDocument,
  LandlordTenantUserTag,
} from "@/components/Management/landlord-tenant-info-components";

import { getOneTenant } from "../../data";
import { useAuthStore } from "@/store/authstrore";
import UnitItem from "@/components/Management/Properties/unit-item";
import { ASSET_URL } from "@/app/config";
import { getObjectProperties } from "@/utils/get-object-properties";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import UpdateTenantProfile from "@/components/Management/Tenants/update-tenant-profile";

const ManageTenant = () => {
  const router = useRouter();

  const { tenantId } = useParams();

  const accessToken = useAuthStore((state) => state.access_token);

  const [tenant, setTenant] = useState<TenantData | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      const data = await getOneTenant(
        tenantId as string,
        accessToken as string
      );

      if (!data) return router.push("/management/tenants");

      setTenant(data);
    };

    fetchTenant();
  }, [accessToken, tenantId, router]);

  if (!tenant) return null;

  const otherData = getObjectProperties(tenant);

  return (
    <div className="custom-flex-col gap-10">
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <LandlordTenantInfoBox style={{ padding: "24px 40px" }}>
          <div className="flex flex-col xl:flex-row gap-5">
            <div className="flex items-start">
              <Picture
                src={
                  tenant.picture
                    ? `${ASSET_URL}${tenant.picture}`
                    : tenant.avatar
                }
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
                  <div className="flex">
                    <LandlordTenantUserTag type={tenant.user_tag} />
                  </div>
                  <p className="text-neutral-800 text-base font-medium">
                    ID: 22132876554444
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
                      <ModalTrigger>
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
                      <p className="text-success-3">₦ 100,000</p>
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
