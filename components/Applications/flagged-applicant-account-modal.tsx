import React from "react";

// Imports
import Button from "../Form/Button/button";
import UserCard from "../Management/landlord-and-tenant-card";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";

const FlaggedApplicantAccountModal = () => {
  return (
    <LandlordTenantModalPreset
      heading="Applicant Account Is Flagged"
      style={{ maxWidth: "714px" }}
    >
      <div className="custom-flex-col gap-6">
        <div className="custom-flex-col gap-8">
          <div className="flex gap-6 flex-col sm:flex-row">
            <div className="custom-flex-col gap-2 flex-1">
              <p className="text-primary-navy dark:text-white text-sm font-medium">
                Previous Manager
              </p>
              <UserCard
                id={"1"}
                last_name="abah"
                user_tag="web"
                cardType="landlord"
                first_name="david"
                email="example@gmail.com"
                phone_number="08132086958"
                picture_url="/empty/SampleLandlord.jpeg"
              />
            </div>
            <div className="custom-flex-col gap-2 flex-1">
              <p className="text-primary-navy dark:text-white text-sm font-medium">
                Applicant Information
              </p>
              <UserCard
                id={"1"}
                last_name="abah"
                user_tag="web"
                cardType="landlord"
                first_name="david"
                email="example@gmail.com"
                phone_number="08132086958"
                picture_url="/empty/SampleLandlord.jpeg"
              />
            </div>
          </div>
          <p className="text-center text-status-error-2 text-xs font-bold">
            The tenant has been flagged for owing rent and causing damages by
            David & Co Limited. Please instruct the applicant to settle with
            their previous manager so that they can unflag the account.
          </p>
        </div>
        <div className="flex gap-4 justify-end">
          <Button size="base_bold" variant="light_red" className="py-2 px-8">
            reject application
          </Button>
          <Button size="base_bold" className="py-2 px-8">
            skip
          </Button>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default FlaggedApplicantAccountModal;
