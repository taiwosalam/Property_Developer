/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import DateInput from "@/components/Form/DateInput/date-input";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { EstateDetailItem } from "@/components/Management/Rent And Unit/detail-item";
import { RentSectionContainer } from "@/components/Management/Rent And Unit/rent-section-container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ModalPreset from "@/components/Modal/modal-preset";
import BackButton from "@/components/BackButton/back-button";

const RentFeeDetails = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center">
    <p className="text-[#747474] w-[140px] dark:text-white">{label}</p>
    <p className="dark:text-darkText-1">{value}</p>
  </div>
);

const estateData = [
  { label: "Property Title", value: "Golden Estate" },
  { label: "State", value: "Oyo State" },
  { label: "Local Government", value: "Akinyele" },
  { label: "Full Address", value: "56, Abiola way area Moniya ibadan" },
  { label: "Branch", value: "Moniya Branch" },
  { label: "Account Officer", value: "Ajadi David" },
  { label: "Landlors", value: "John Doe" },
  { label: "Categories", value: "Residential" },
  { label: "Unit Id", value: "1233456776543" },
];

const PostProceedContent = () => {
  const router = useRouter();
  return (
    <div className="space-y-6 p-4">
      <BackButton>Change Property Unit</BackButton>
      <section className="space-y-6 pb-16">
        <div
          className="py-6 px-6 bg-white dark:bg-darkText-primary shadow rounded-md space-y-4"
          style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
        >
          <h6 className="font-bold text-[#092C4C] dark:text-white text-xl">
            Property Details
          </h6>
          <div className="w-5/6 h-[1px] bg-[#C0C2C8] bg-opacity-20"></div>
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-4">
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
          title="Property Settings"
          estateSettingsDta={[
            { label: "Agency Fee", value: "10%" },
            { label: "Period", value: "Annually" },
            { label: "Charge", value: "Tenant" },
            { label: "Caution Deposit", value: "Escrow it" },
            { label: "Group Chat", value: "Yes" },
            { label: "Rent Penalty", value: "Yes" },
          ]}
        />

        <div>
          <h6 className="font-bold text-[#092C4C] dark:text-white text-xl my-6">
            Previous Unit Balance
          </h6>
          <div className="grid md:grid-cols-2 xl:grid-cols-5 lg:gap-6">
            <div className="col-span-3 space-y-6">
              <RentSectionContainer title="Rent Fee">
                <div className="grid grid-cols-2 gap-4 my-4">
                  <RentFeeDetails label="Current Start Date" value="11-1-24" />
                  <RentFeeDetails label="Annual Rent" value="₦200,000" />
                  <RentFeeDetails label="Due Date" value="11-1-24" />
                  <RentFeeDetails label="Other Fees" value="₦200,000" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Balance</p>
                    <p className="font-semibold text-xl text-brand-9">
                      ₦1,950,000
                    </p>
                  </div>
                </div>
              </RentSectionContainer>
              <div>
                <h6 className="font-bold text-[#092C4C] dark:text-white text-xl my-6">
                  New Unit Cost
                </h6>
                <RentSectionContainer title="Annual Rent">
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <RentFeeDetails label="Rent" value="₦300,000" />
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
                        <Button type="submit" className="py-2 px-8">
                          Edit
                        </Button>
                      </ModalTrigger>
                      <ModalContent>
                        <div className="bg-white py-10 absolute bottom-0 left-0 right-0">
                          <p className="text-center font-semibold my-4 text-brand-9">
                            This action will navigate you away from the Rent and
                            Unit menu to another menu. You can choose to
                            continue or exit from the process
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
              </div>
              <div className="p-6 flex flex-col gap-8">
                <div>
                  <h1 className="font-bold text-[#092C4C] dark:text-white text-xl">
                    Start Rent
                  </h1>
                  <div className="w-full h-[2px] bg-[#C0C2C8] bg-opacity-20 my-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 dark:text-darkText-1 mb-2">
                        Payment Date
                      </p>
                      <DateInput id="paymentdate" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-darkText-1 mb-2">
                        Due Date
                      </p>
                      <DateInput id="date" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <div className="flex items-center gap-2">
                      <div>
                        <input
                          type="checkbox"
                          id="createInvoice"
                          className="mr-2"
                        />
                        <label htmlFor="createInvoice">Create Invoice</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="mobileNotifications"
                          className="mr-2"
                        />
                        <label htmlFor="mobileNotifications">
                          Mobile Notification
                        </label>
                      </div>
                      <div>
                        <input type="checkbox" id="sms" className="mr-2" />
                        <label htmlFor="sms">SMS Alert</label>
                      </div>
                      <div>
                        <input type="checkbox" id="Email" className="mr-2" />
                        <label htmlFor="Email">Email ALert</label>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-darkText-1 clear-both">
                  Confirms that you have received payment for the Unit Change.
                  However, if you intend to receive the payment, you can click
                  'create invoice' for tenants to make the payment.
                </p>
              </div>
            </div>
            <div className="col-span-2 space-y-8">
              <RentSectionContainer title="User Profile">
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
            </div>
          </div>
        </div>
        <RentSectionContainer title="Previous Rent Records">
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
                {Array(2)
                  .fill(null)
                  .map((_, idx) => (
                    <tr key={idx}>
                      <td>
                        <p>0{idx + 1}</p>
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
        </RentSectionContainer>
      </section>

      <div className="fixed w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white dark:bg-darkText-primary flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
        <Modal>
          <ModalTrigger asChild>
            <Button type="submit">Proceed</Button>
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
      </div>
    </div>
  );
};

export default PostProceedContent;
