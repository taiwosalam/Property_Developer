"use client";

import React, { useEffect, useState } from "react";

// Images
import Avatar from "@/public/empty/avatar-1.svg";
import Verified from "@/public/icons/verified.svg";

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
} from "@/components/Management/landlord-tenant-info-components";
import { getOneLandlord } from "../../data";
import PropertyCard from "@/components/Management/Properties/property-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { useAuthStore } from "@/store/authstrore";
import { useParams } from "next/navigation";

type LandlordPageData = {
  avatar: string;
  picture: string;
  name: string;
  email: string;
  phone_number: string;
  user_tag: string;
  id: number;
  contact_address: {
    address: string;
    city: string | null;
    state: string;
    local_govt: string;
  };
  guarantor: {
    name: string | null;
    relationship: string | null;
    email: string | null;
    phone_number: string | null;
    address: string | null;
    note: string | null;
  };
  bank_details: {
    bank_name: string | null;
    account_name: string | null;
    account_number: string | null;
    wallet_id: string | null;
  };
  attachment: string | null;
  properties_managed: {
    id: number;
    property_name: string;
    address: string;
    property_tag: string;
    units: number;
    rental_value: number;
    annual_returns: number | null;
    account_officer: string;
    image: string | null;
  }[];
};

const ManageLandlord = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const { landlordId } = useParams();
  const id = Number(landlordId);
  const [LandlordPageData, setLandlordPageData] =
    useState<LandlordPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch the landlord when the component mounts
    const fetchLandlords = async () => {
      try {
        const data = await getOneLandlord({
          landlordId: id,
          access_token: accessToken,
        });
        console.log(data, "data");
        setLandlordPageData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="custom-flex-col gap-10">
      <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
        <LandlordTenantInfoBox style={{ padding: "24px 40px" }}>
          <div className="flex flex-col xl:flex-row gap-5">
            <div className="flex items-start">
              <Picture
                src={LandlordPageData?.avatar}
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
                      {LandlordPageData?.name}
                    </p>
                    <Picture src={Verified} alt="verified" size={16} />
                  </div>
                  <p
                    style={{ color: "rgba(21, 21, 21, 0.70)" }}
                    className={`${secondaryFont.className} text-sm font-normal`}
                  >
                    {LandlordPageData?.email}
                  </p>
                </div>
                <div className="custom-flex-col gap-2">
                  <div className="flex">
                    <div className="py-1 px-4 rounded-lg bg-success-1">
                      <p className="capitalize text-success-3 text-[10px] font-normal">
                        {LandlordPageData?.user_tag}
                      </p>
                    </div>
                  </div>
                  <p className="text-neutral-800 text-base font-medium">
                    ID: {LandlordPageData?.id}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
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
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  href="/management/tenants/1/manage/edit"
                  size="base_medium"
                  className="py-2 px-8"
                >
                  edit
                </Button>
                <Button size="base_medium" className="py-2 px-8">
                  update with ID
                </Button>
              </div>
            </div>
          </div>
        </LandlordTenantInfoBox>
        <LandlordTenantInfo
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
        <LandlordTenantInfo
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
        <LandlordTenantInfo
          heading="Others"
          info={{
            address: "U4 Joke Plaza Bodija Ibadan",
            city: "ibadan",
            state: "oyo state",
            "L.G": "Ibadan North Central",
          }}
        />
        <LandlordTenantInfo
          heading="Guarantor"
          info={
            LandlordPageData?.guarantor
              ? {
                  name: LandlordPageData.guarantor.name,
                  relationship: LandlordPageData.guarantor.relationship,
                  email: LandlordPageData.guarantor.email,
                  phone: LandlordPageData.guarantor.phone_number,
                  address: LandlordPageData.guarantor.address,
                  note: LandlordPageData.guarantor.note,
                }
              : {}
          }
        />
        <LandlordTenantInfo
          heading="Note"
          info={
            LandlordPageData?.guarantor.note
              ? { note: LandlordPageData.guarantor.note }
              : { note: "N/A" }
          }
        />
      </div>
      <LandlordTenantInfoSection title="Property Managed">
        <AutoResizingGrid minWidth={250}>
          {LandlordPageData?.properties_managed.map((property) => (
            <PropertyCard
              key={property.id}
              images={[]}
              id={property.id.toString()}
              propertyId={property.id.toString()}
              {...{
                name: property.property_name,
                units: property.units,
                address: property.address,
                price: property.rental_value,
                type: "rent",
                image: property.image || "https://via.placeholder.com/150",
              }}
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
      <LandlordTenantInfoSection title="previous property">
        <div className="flex gap-8"></div>
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

export default ManageLandlord;
