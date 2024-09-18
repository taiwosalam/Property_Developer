"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import DateInput from "@/components/Form/DateInput/date-input";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { estateData } from "@/components/Management/Rent And Unit/data";
import { EstateDetailItem } from "@/components/Management/Rent And Unit/detail-item";
import Link from "next/link";
import { RentSectionContainer } from "@/components/Management/Rent And Unit/rent-section-container";

const RentFeeDetails = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center">
    <p className="text-[#747474] w-[140px]">{label}</p>
    <p>{value}</p>
  </div>
);

const EditRent = () => {
  return (
    <main className="space-y-6 p-4">
      <Link
        href={"/management/rent-unit"}
        className="flex items-center space-x-3 w-fit"
      >
        <ChevronLeft />
        <h6 className="text-2xl font-medium">Edit Rent</h6>
      </Link>
      <section className="space-y-6 pb-16">
        <div
          className="py-6 px-6 bg-white shadow rounded-md space-y-4"
          style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
        >
          <h6 className="font-bold text-[#092C4C] text-xl">Unit Details</h6>
          <div className="w-5/6 h-[1px] bg-[#C0C2C8] bg-opacity-20"></div>
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4">
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
          <h6 className="font-bold text-[#092C4C] text-xl my-6">
            Rent Details
          </h6>
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3 space-y-6">
              <RentSectionContainer title="Rent Fee">
                <div className="grid grid-cols-2 gap-4 mt-4 text-[16px] font-normal">
                  <RentFeeDetails label="Rent" value="12/1/2023" />
                  <RentFeeDetails label="Annual Rent" value="₦300,000" />
                  <RentFeeDetails label="Service Charge" value="₦300,000" />
                  <RentFeeDetails label="Other Charges" value="₦200,000" />
                </div>
              </RentSectionContainer>

              <RentSectionContainer title="Renewal Fee">
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
                      <Button
                        type="submit"
                        className="py-2 px-8"
                        onClick={() => {}}
                      >
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
                              onClick={() => {}}
                            >
                              Proceed
                            </Button>
                            <Button
                              type="submit"
                              className="py-2 px-8"
                              size="16_bold"
                              onClick={() => {}}
                            >
                              Exit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </ModalContent>
                  </Modal>
                </div>
              </RentSectionContainer>

              <RentSectionContainer title="Edit Current Rent">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-2">Payment date</p>
                    <DateInput id="payment_date" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Amount Paid</p>
                    <Input
                      id="amount_paid"
                      type="text"
                      placeholder="₦ 300,000"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end my-4">
                  <Button
                    type="submit"
                    className="py-2 px-6"
                    onClick={() => {}}
                  >
                    Update
                  </Button>
                </div>
              </RentSectionContainer>

              <div className="p-6">
                <h1 className="font-bold text-[#092C4C] text-xl">
                  Add Part Payment
                </h1>
                <div className="w-full h-[2px] bg-[#C0C2C8] bg-opacity-20 my-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-2">Amount</p>
                    <Input id="amount" type="text" placeholder="₦" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Date</p>
                    <DateInput id="date" />
                  </div>
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
                  <Button
                    type="submit"
                    className="py-2 px-6"
                    onClick={() => {}}
                  >
                    Update
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-16 clear-both">
                  Clicking &lsquo;update&rsquo; confirms the partial payment.
                  However, if you intend to receive the payment, you can click
                  &lsquo;create invoice&rsquo; for tenants to make the payment.
                </p>
              </div>
            </div>

            <div className="col-span-2 space-y-8">
              <RentSectionContainer title="User Profile">
                <div className="flex items-center justify-center">
                  <div>
                    <img
                      src="/empty/avatar-2.svg"
                      alt="Profile"
                      className="w-16 h-16 rounded-full mb-4 mx-auto"
                    />
                    <div className="w-full text-center">
                      <p className="font-bold text-xl">Abimbola Adedeji</p>
                      <p className="text-xs text-text-label mb-4">
                        abimbola@gmail.com
                      </p>
                      <div className="space-y-2 mb-8">
                        <p className="bg-success-1 text-success-3 font-normal text-xs rounded-lg w-[70px] mx-auto">
                          Mobile
                        </p>
                        <p className="text-neutral-800 text-[16px] font-semibold">
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
                <p className="text-sm text-text-secondary mb-4">
                  Transfer tenants to another unit within the same property with
                  the option to calculate and deduct outstanding amounts from
                  the new unit.
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  Alternatively move the same tenants from their current rental
                  property to another rental property with the option to pay
                  either the outstanding amounts or previous package or new
                  package and also calculate and deduct any outstanding
                  payments.
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    className="py-2 px-8"
                    size="16_bold"
                    onClick={() => {}}
                  >
                    Switch Property
                  </Button>
                  <Button
                    type="submit"
                    className="py-2 px-8"
                    size="16_bold"
                    onClick={() => {}}
                  >
                    Switch Unit
                  </Button>
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

      <div className="fixed w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent">
        <button
          type="button"
          className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2"
        >
          Exit
        </button>
        <button
          type="submit"
          className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 active:bg-transparent active:border-brand-9"
        >
          Save
        </button>
      </div>
    </main>
  );
};

export default EditRent;
