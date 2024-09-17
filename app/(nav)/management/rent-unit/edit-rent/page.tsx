import React from "react";
import { ChevronLeft, Calendar } from "lucide-react";
import EstateDetails from "@/components/Management/Rent And Unit/estate-details";
import EstateSettings from "@/components/Management/Rent And Unit/estate-settings";
import DateInput from "@/components/Form/DateInput/date-input";

const EditRent = () => {
  return (
    <main className="space-y-6 p-4">
      <div className="flex items-center space-x-3">
        <ChevronLeft />
        <h6 className="text-2xl font-medium">Edit Rent</h6>
      </div>
      <section className="space-y-6 pb-16">
        <EstateDetails title="Unit Details" />
        <EstateSettings title="Property Settings" />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Rent Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Current Start Date</p>
                  <p>12/1/2023</p>
                </div>
                <div>
                  <p className="text-gray-600">Annual Rent</p>
                  <p>₦300,000</p>
                </div>
                <div>
                  <p className="text-gray-600">Due Date</p>
                  <p>12/1/2023</p>
                </div>
                <div>
                  <p className="text-gray-600">Other Fee</p>
                  <p>₦200,000</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Renewal Fee</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Annual Rent</p>
                </div>
                <div></div>
                <div>
                  <p className="text-gray-600">Rent</p>
                  <p>₦300,000</p>
                </div>
                <div>
                  <p className="text-gray-600">Service Charge</p>
                  <p>₦200,000</p>
                </div>
                <div>
                  <p className="text-gray-600">Other Charges</p>
                  <p>₦200,000</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Total Package</p>
                  <p className="font-semibold text-xl text-blue-600">
                    ₦1,950,000
                  </p>
                </div>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">
                  Edit
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Edit Current Rent</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-2">Payment date</p>
                  <DateInput id="paymeny_date" />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Amount Paid</p>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value="₦ 300,000"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                  Update
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Add Part Payment</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-2">Amount</p>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="₦"
                  />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Date</p>
                  <DateInput id="date" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <input type="checkbox" id="createInvoice" className="mr-2" />
                <label htmlFor="createInvoice">Create Invoice</label>
              </div>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded float-right">
                Update
              </button>
              <p className="text-sm text-gray-600 mt-16 clear-both">
                *Part payment will be reflected once the tenant makes a payment
                towards the generated invoice
              </p>
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">User Profile</h2>
              <div className="flex items-center justify-center">
                <div className="mb-4">
                  <img
                    src="/empty/avatar-2.svg"
                    alt="Profile"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">Abimbola Adedeji</p>
                    <p className="text-green-500">Active</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-2">ID: 2212587645444</p>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Gender:</span> Male
                </p>
                <p>
                  <span className="font-semibold">Birthday:</span> 12/12/12
                </p>
                <p>
                  <span className="font-semibold">Religion:</span> Christianity
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> +2348132087958
                </p>
                <p>
                  <span className="font-semibold">Marital Status:</span> Single
                </p>
                <p>
                  <span className="font-semibold">Contact Address:</span>
                </p>
                <p>U4 Joke Plaza Bodija Ibadan</p>
                <p>
                  <span className="font-semibold">City:</span> Ibadan
                </p>
                <p>
                  <span className="font-semibold">State:</span> Oyo State
                </p>
                <p>
                  <span className="font-semibold">LG:</span> Ibadan North
                  Central
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Transfer Tenants</h2>
              <p className="text-sm text-gray-600 mb-4">
                Transfer tenants to another unit within the same property with
                the option to calculate and deduct outstanding amounts from the
                new unit.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Alternatively move the same tenants from their current rental
                property to another rental property with the option to pay
                either the outstanding amounts or previous package or new
                package and also calculate and deduct any outstanding payments.
              </p>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Switch Property
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Switch Unit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Previous Rent Records</h2>
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
        </div>
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
