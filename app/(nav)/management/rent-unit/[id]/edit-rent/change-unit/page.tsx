"use client";
import {
  estateSettingsDta,
  estateData,
  propertySettingsData,
  DUMMY_OCCUPANT,
  rentalData,
} from "@/components/Management/Rent And Unit/data";
import {
  RenewalRent as StartRent,
  PreviousRentRecords,
} from "@/components/Management/Rent And Unit/renewal-rent-detals";
import {
  PreviousUnitBalance,
  NewUnitCost,
} from "@/components/Management/Rent And Unit/Edit-Rent/Edit-rent-sections";
import { MatchedProfile } from "@/components/Management/Rent And Unit/matched-profile";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useRouter, useSearchParams } from "next/navigation";
import ModalPreset from "@/components/Modal/modal-preset";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";

const ChangeUnitpage = () => {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const isRental = propertyType === "rental";
  const router = useRouter();
  return (
    <div className="space-y-6 pb-[100px]">
      <BackButton>Change Unit</BackButton>
      <section className="space-y-6">
        <EstateDetails
          title={`${isRental ? "Unit" : "Estate"} Details`}
          estateData={isRental ? rentalData : estateData}
        />
        <EstateSettings
          title={`${isRental ? "Property" : "Estate"} Settings`}
          estateSettingsDta={
            isRental ? propertySettingsData : estateSettingsDta
          }
          {...(isRental ? { gridThree: true } : {})}
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
              title={`Start ${isRental ? "Rent" : "Fee"}`}
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

export default ChangeUnitpage;
