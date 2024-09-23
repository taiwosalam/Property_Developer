import { LandlordTenantInfoBox as InfoBox } from "@/components/Management/landlord-tenant-info-components";
import Picture from "@/components/Picture/picture";
import DefaultLandlordAvatar from "@/public/empty/landlord-avatar.png";
import Button from "@/components/Form/Button/button";
import UserTag from "@/components/Tags/user-tag";
import { LandlordTenantInfo as ContactInfo } from "@/components/Management/landlord-tenant-info-components";

const ManageServiceProvider = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
      <InfoBox style={{ padding: "24px 40px" }}>
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="flex items-start">
            <Picture
              src={DefaultLandlordAvatar}
              alt="profile picture"
              size={120}
              rounded
            />
          </div>
          <div>
            <p className="text-black text-lg lg:text-xl font-bold">
              Abimbola Adedeji
            </p>
            <p
              className="text-sm font-normal mb-4"
              style={{ color: "rgba(21, 21, 21, 0.70)" }}
            >
              abimbola@gmail.com
            </p>
            <UserTag type="web" />
            <div className="flex flex-wrap gap-4 mt-7">
              <Button
                href={`/tasks/service-providers/${1}/manage/edit`}
                size="base_medium"
                className="py-2 px-8"
              >
                Manage
              </Button>
              <Button size="base_medium" className="py-2 px-8">
                Update with ID
              </Button>
            </div>
          </div>
        </div>
      </InfoBox>
      <ContactInfo
        info={{
          "Company Name": "Abmbola Services",
          "Full name": "Abimbola Adedeji",
          email: "abimbolaadedeji@gmail.com",
          "Company Phone": "+2348132086958 ; +2348132086958",
          services: "Painter",
        }}
      />
      <ContactInfo
        heading="bank details"
        info={{
          "bank name": "---",
          "Bank Account No": "---",
          "Account Name": "---",
        }}
      />
      <ContactInfo
        heading="Contact Address"
        info={{
          "Company Address:": "U4, Joke Palza bodija ibadan.",
          state: "Oyo State",
          "Local Government": "Akinyele",
        }}
      />
    </div>
  );
};

export default ManageServiceProvider;
