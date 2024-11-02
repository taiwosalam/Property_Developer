"use client";

import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import DateInput from "@/components/Form/DateInput/date-input";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { estateData } from "@/components/Management/Rent And Unit/data";
import { EstateDetailItem } from "@/components/Management/Rent And Unit/detail-item";
import { RentSectionContainer } from "@/components/Management/Rent And Unit/rent-section-container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ModalPreset from "@/components/Modal/modal-preset";
import SwitchPropertyModal from "@/components/Management/Rent And Unit/Edit-Rent/SwitchPropertyModal";
import SwitchUnitModal from "@/components/Management/Rent And Unit/Edit-Rent/SwitchUnitModal";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { rentRecordsTableData, rentRecordsTableFields } from "./data";
import CustomTable from "@/components/Table/table";
import { currencySymbols } from "@/utils/number-formatter";
import { useSearchParams } from "next/navigation";

const RentFeeDetails = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center">
    <p className="text-[#747474] w-[140px] dark:text-white">{label}</p>
    <p className="dark:text-darkText-1">{value}</p>
  </div>
);

const EditRent = () => {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type") as "rental" | "facility"; //would be gotten from API
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"];
  const router = useRouter();
  const isRental = propertyType === "rental";
  return (
    <div className="space-y-6">
      <BackButton>Edit {isRental ? "Rent" : "Fee"}</BackButton>
      <section className="space-y-6 pb-16">
        <div
          className="py-6 px-6 bg-white dark:bg-darkText-primary shadow rounded-md space-y-4"
          style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
        >
          <h6 className="font-bold text-[#092C4C] dark:text-white text-xl">
            {isRental ? "Unit" : "Estate"} Details
          </h6>
          <div className="w-5/6 h-[1px] bg-[#C0C2C8] bg-opacity-20"></div>
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-4 gap-x-2">
              {estateData.map((item, index) => (
                <EstateDetailItem
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        </div>
        <EstateSettings
          gridThree
          title={isRental ? "Property Settings" : "Estate Settings"}
          estateSettingsDta={[
            { label: isRental ? "Agency Fee" : "Management Fee", value: "10%" },
            { label: "Period", value: "Annually" },
            { label: "Charge", value: "Tenant" },
            { label: "Caution Deposit", value: "Escrow it" },
            { label: "Group Chat", value: "Yes" },
            { label: isRental ? "Rent Penalty" : "Fee Penalty", value: "Yes" },
          ]}
        />

        <div>
          <h6 className="font-bold text-[#092C4C] dark:text-white text-xl my-6">
            {isRental ? "Rent" : "Fee"} Details
          </h6>
          <div className="grid md:grid-cols-2 xl:grid-cols-5 lg:gap-6">
            <div className="col-span-3 space-y-6">
              <RentSectionContainer title={isRental ? "Rent Fee" : "Fee"}>
                <div className="grid grid-cols-2 gap-4 mt-4 text-[16px] font-normal">
                  <RentFeeDetails label="Rent" value="12/1/2023" />
                  <RentFeeDetails
                    label={isRental ? "Annual Rent" : "Annual Fee"}
                    value="₦300,000"
                  />
                  <RentFeeDetails label="Service Charge" value="₦300,000" />
                  <RentFeeDetails label="Other Charges" value="₦200,000" />
                </div>
              </RentSectionContainer>

              <RentSectionContainer title="Renewal Fee">
                <div className="grid grid-cols-2 gap-4 my-4">
                  <RentFeeDetails
                    label={isRental ? "Rent" : "Fee"}
                    value="₦300,000"
                  />
                  <RentFeeDetails label="Service Charge" value="₦200,000" />
                  <RentFeeDetails label="Other Charges" value="₦200,000" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Total Package</p>
                    <p className="font-semibold text-xl text-blue-600">
                      ₦1,950,000
                    </p>
                  </div>
                  <Modal>
                    <ModalTrigger asChild>
                      <Button size="base_medium" className="py-2 px-6">
                        Edit
                      </Button>
                    </ModalTrigger>
                    <ModalContent>
                      <div className="bg-white py-10 absolute bottom-0 left-0 right-0">
                        <p className="text-center font-semibold my-4 text-brand-9">
                          This action will navigate you away from the Rent and
                          Unit menu to another menu. You can choose to continue
                          or exit from the process
                        </p>
                        <div className="flex items-center justify-center">
                          <div className="flex items-center justify-between space-x-10">
                            <Button
                              type="submit"
                              className="py-2 px-8"
                              size="16_bold"
                              onClick={() => {
                                router.push(
                                  "/management/properties/1/edit-property"
                                );
                              }}
                            >
                              Proceed
                            </Button>
                            <ModalTrigger asChild close>
                              <Button
                                type="submit"
                                className="py-2 px-8"
                                size="16_bold"
                              >
                                Exit
                              </Button>
                            </ModalTrigger>
                          </div>
                        </div>
                      </div>
                    </ModalContent>
                  </Modal>
                </div>
              </RentSectionContainer>

              <RentSectionContainer
                title={isRental ? "Edit Current Rent" : "Edit Current Fee"}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <DateInput id="payment_date" label="Payment Date" />
                  <Input
                    id="amount_paid"
                    placeholder="300,000"
                    label="Amount Paid"
                    inputClassName="bg-white"
                    CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                    formatNumber
                  />
                </div>
                <div className="flex items-center justify-end my-4">
                  <Modal>
                    <ModalTrigger asChild>
                      <Button size="base_medium" className="py-2 px-6">
                        Update
                      </Button>
                    </ModalTrigger>
                    <ModalContent>
                      <ModalPreset type="success" className="w-full">
                        <div className="flex flex-col gap-11">
                          <div className="flex flex-col gap-10">
                            <p className="text-text-tertiary text-sm">
                              Record Added Successfully
                            </p>
                            <ModalTrigger asChild close>
                              <Button>Ok</Button>
                            </ModalTrigger>
                          </div>
                        </div>
                      </ModalPreset>
                    </ModalContent>
                  </Modal>
                </div>
              </RentSectionContainer>

              <div className="p-6">
                <h1 className="font-bold text-[#092C4C] dark:text-white text-xl">
                  Add Part Payment
                </h1>
                <div className="w-full h-[2px] bg-[#C0C2C8] bg-opacity-20 my-4" />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    id="amount"
                    placeholder="300,000"
                    label="Amount"
                    formatNumber
                    CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                    inputClassName="bg-white"
                  />
                  <DateInput
                    id="date"
                    label="Date"
                    containerClassName="bg-white"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <input
                      type="checkbox"
                      id="createInvoice"
                      className="mr-2"
                    />
                    <label htmlFor="createInvoice">Create Invoice</label>
                  </div>
                  <Modal>
                    <ModalTrigger asChild>
                      <Button size="base_medium" className="py-2 px-6">
                        Update
                      </Button>
                    </ModalTrigger>
                    <ModalContent>
                      <ModalPreset type="success" className="w-full">
                        <div className="flex flex-col gap-11">
                          <div className="flex flex-col gap-10">
                            <p className="text-text-tertiary text-sm">
                              Record Added Successfully
                            </p>
                            <ModalTrigger asChild close>
                              <Button>Ok</Button>
                            </ModalTrigger>
                          </div>
                        </div>
                      </ModalPreset>
                    </ModalContent>
                  </Modal>
                </div>
                <p className="text-sm text-gray-600 dark:text-darkText-1 mt-16 clear-both">
                  Clicking &lsquo;update&rsquo; confirms the partial payment.
                  However, if you intend to receive the payment, you can click
                  &lsquo;create invoice&rsquo; for tenants to make the payment.
                </p>
              </div>
            </div>
            <div className="col-span-2 space-y-8">
              <RentSectionContainer
                title={`${isRental ? "Tenant" : "Occupant"} Profile`}
              >
                <div className="flex items-center justify-center">
                  <div>
                    <Image
                      src="/empty/avatar-2.svg"
                      alt="Profile"
                      className="rounded-full mb-4 mx-auto"
                      width={64}
                      height={64}
                    />
                    <div className="w-full text-center">
                      <p className="font-bold text-xl">Abimbola Adedeji</p>
                      <p className="text-xs text-text-label mb-4">
                        abimbola@gmail.com
                      </p>
                      <div className="space-y-2 mb-8">
                        <p className="bg-status-success-1 text-status-success-3 font-normal text-xs rounded-lg w-[70px] mx-auto">
                          Mobile
                        </p>
                        <p className="text-neutral-800 dark:text-darkText-1 text-[16px] font-semibold">
                          ID: 2212587645444
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="text-brand-9 text-[16px] font-medium mb-2">
                  About
                </h1>
                <div className="space-y-4">
                  <RentFeeDetails label="Gender" value="Male" />
                  <RentFeeDetails label="Birthday" value="12/12/12" />
                  <RentFeeDetails label="Religion" value="Christianity" />
                  <RentFeeDetails label="Phone" value="+2348132087958" />
                  <RentFeeDetails label="Marital Status" value="Single" />
                </div>
                <h1 className="text-brand-9 text-[16px] font-medium my-6">
                  Contact Address
                </h1>
                <div className="space-y-4">
                  <RentFeeDetails
                    label="Address"
                    value="U4 Joke Plaza Bodija Ibadan"
                  />
                  <RentFeeDetails label="City" value="Ibadan" />
                  <RentFeeDetails label="State" value="Oyo State" />
                  <RentFeeDetails label="LG" value="Ibadan North Central" />
                </div>
              </RentSectionContainer>

              <RentSectionContainer title="Transfer Tenants">
                <p className="text-sm text-text-secondary dark:text-darkText-2 mb-4">
                  Transfer tenants to another unit within the same property with
                  the option to calculate and deduct outstanding amounts from
                  the new unit.
                </p>
                <p className="text-sm text-text-secondary dark:text-darkText-2 mb-4">
                  Alternatively move the same tenants from their current rental
                  property to another rental property with the option to pay
                  either the outstanding amounts or previous package or new
                  package and also calculate and deduct any outstanding
                  payments.
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <Modal>
                    <ModalTrigger asChild>
                      <Button
                        type="submit"
                        className="py-2 px-6"
                        size="base_medium"
                      >
                        Switch Property
                      </Button>
                    </ModalTrigger>
                    <ModalContent>
                      <SwitchPropertyModal />
                    </ModalContent>
                  </Modal>
                  <Modal>
                    <ModalTrigger asChild>
                      <Button
                        type="submit"
                        className="py-2 px-6"
                        size="base_medium"
                      >
                        Switch Unit
                      </Button>
                    </ModalTrigger>
                    <ModalContent>
                      <SwitchUnitModal />
                    </ModalContent>
                  </Modal>
                </div>
              </RentSectionContainer>
            </div>
          </div>
        </div>
        <RentSectionContainer
          title={isRental ? "Previous Rent Records" : "Previous Fee Records"}
        >
          <CustomTable
            data={rentRecordsTableData}
            fields={rentRecordsTableFields}
            tableHeadCellSx={{
              fontSize: "1rem",
              paddingTop: "18px",
              paddingBottom: "18px",
            }}
            tableBodyCellSx={{
              fontSize: "1rem",
              paddingTop: "18px",
              paddingBottom: "18px",
            }}
          />
        </RentSectionContainer>
      </section>

      <FixedFooter className="flex gap-4 justify-end">
        <Button size="base_medium" className="py-2 px-6">
          Save
        </Button>
      </FixedFooter>
    </div>
  );
};

export default EditRent;
