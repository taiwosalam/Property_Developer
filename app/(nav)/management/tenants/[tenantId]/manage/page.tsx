import React from "react";

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

const ManageTenant = () => {
  return (
    <div className="custom-flex-col gap-10">
      <div className="grid grid-cols-2 gap-y-5 gap-x-8">
        <LandlordTenantInfoBox style={{ padding: "24px 40px" }}>
          <div className="flex gap-5">
            <div className="flex items-start">
              <Picture src={Avatar} alt="profile picture" size={120} rounded />
            </div>
            <div className="custom-flex-col gap-8">
              <div className="custom-flex-col gap-4">
                <div className="custom-flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-black text-xl font-bold capitalize">
                      Abimbola Adedeji
                    </p>
                    <Picture src={Verified} alt="verified" size={16} />
                  </div>
                  <p
                    style={{ color: "rgba(21, 21, 21, 0.70)" }}
                    className={`${secondaryFont.className} text-sm font-normal`}
                  >
                    abimbola@gmail.com
                  </p>
                </div>
                <div className="custom-flex-col gap-2">
                  <div className="flex">
                    <div className="py-1 px-4 rounded-lg bg-success-1">
                      <p className="capitalize text-success-3 text-[10px] font-normal">
                        mobile
                      </p>
                    </div>
                  </div>
                  <p className="text-neutral-800 text-base font-medium">
                    ID: 22132876554444
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button>message</Button>
                <Button
                  style={{ color: "#01BA4C", backgroundColor: "#E6FAEE" }}
                >
                  unflag
                </Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button href="/management/tenants/1/manage/edit">edit</Button>
                <Button>update with ID</Button>
              </div>
            </div>
          </div>
        </LandlordTenantInfoBox>
        <LandlordTenantInfo
          info={{
            gender: "male",
            birthday: "12/12/12",
            religion: "christian",
            phone: "08012345678",
            "marital status": "single",
          }}
        />
        <LandlordTenantInfo
          heading="bank details"
          info={{
            "bank name": "access bank",
            "account name": "Abimbola Adedeji Q",
            "bank account no": "0694695153",
            "wallet ID": "8132086958",
          }}
        />
        <LandlordTenantInfo
          heading="contact address"
          info={{
            address: "U4 Joke Plaza Bodija Ibadan",
            city: "ibadan",
            state: "oyo state",
            "L.G": "Ibadan North Central",
          }}
        />
      </div>
      <LandlordTenantInfoSection title="Property">
        <div className="flex gap-8"></div>
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
                      <p>₦ 100,000</p>
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
        <div></div>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="previous property">
        <div></div>
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
