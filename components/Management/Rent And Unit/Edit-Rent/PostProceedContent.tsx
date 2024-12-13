"use client";

import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import {
  estateSettingsDta,
  estateData,
  propertySettingsData,
  rentalData,
  DUMMY_OCCUPANT,
} from "@/components/Management/Rent And Unit/data";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import { PreviousUnitBalance, NewUnitCost } from "./Edit-rent-sections";
import {
  RenewalRent as StartRent,
  PreviousRentRecords,
} from "../renewal-rent-detals";
import { MatchedProfile } from "../matched-profile";
import { useRouter } from "next/navigation";
import ModalPreset from "@/components/Modal/modal-preset";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useSearchParams } from "next/navigation";

const PostProceedContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility"; //would be gotten from API
  const isRental = propertyType === "rental";
  const id = '1'  //change to API ID
  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Change Property Unit</BackButton>
      <section className="space-y-6">
        <EstateDetails
          title={`${isRental ? "Property" : "Estate"} Details`}
          estateData={isRental ? rentalData : estateData}
        />
        <EstateSettings
          title={`${isRental ? "Property" : "Estate"} Settings`}
          estateSettingsDta={
            isRental ? propertySettingsData : estateSettingsDta
          }
          {...(isRental ? { gridThree: true } : {})}
          id={id}
        />
        <div className="pt-6 lg:flex lg:gap-10 space-y-8">
          <div className="lg:w-3/5 space-y-8">
            <PreviousUnitBalance isRental={isRental} />
            <NewUnitCost
              isRental={isRental}
              feeDetails={[
                {
                  name: isRental ? "Rent" : "Fee",
                  amount: 300000,
                },
                { name: "Service Charge", amount: 300000 },
                { name: "Other Charges", amount: 300000 },
              ]}
            />
            <StartRent
              isRental={isRental}
              rentPeriod="yearly"
              title={`Start ${isRental ? "Rent" : "Counting"}`}
              start
            />
          </div>
          <div className="lg:flex-1 lg:!mt-[52px]">
            <MatchedProfile occupant={DUMMY_OCCUPANT} title="User Profile" />
          </div>
        </div>
        <PreviousRentRecords isRental={isRental} />
      </section>

      <FixedFooter className="flex items-center justify-end">
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_medium" className="py-2 px-6">
              Proceed
            </Button>
            <ModalContent>
              <ModalPreset type="success" className="w-full">
                <div className="flex flex-col gap-8">
                  <p className="text-text-tertiary text-sm">
                    Record Added Successfully
                  </p>
                  <Button
                    onClick={() => {
                      router.push("/management/rent-unit");
                    }}
                  >
                    OK
                  </Button>
                </div>
              </ModalPreset>
            </ModalContent>
          </ModalTrigger>
        </Modal>
      </FixedFooter>
    </div>
  );
};

export default PostProceedContent;
