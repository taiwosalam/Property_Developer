import DateInput from "@/components/Form/DateInput/date-input";
import { EstateDetailItem } from "./detail-item";
import { MatchedProfile } from "./matched-profile";
import Checkbox from "@/components/Form/Checkbox/checkbox";

export const RenewalRentDetails = (
  { title }: { title?: string } = { title: "Renewal Fee" }
) => {
  return (
    <div>
      <div className="flex space-x-8 items-center">
        {/* Left Column */}
        <div className="w-3/5 space-y-6 py-10">
          <div>
            <h6 className="text-[#092C4C] text-xl font-bold mb-2">
              Renewal Rent Details
            </h6>
            <div className="w-full bg-white shadow p-6 space-y-3 rounded-sm">
              <p className="text-[16px] text-brand-10">Rent Fee </p>
              <div className="w-full h-[2px] bg-[#C0C2C8] opacity-20"></div>
              <div className="grid grid-cols-2 gap-4">
                {detailItems.map((item, index) => (
                  <EstateDetailItem
                    key={index}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h6 className="text-[#092C4C] text-xl font-bold mb-2">
              Renewal Fee
            </h6>
            <div className="w-full bg-white shadow p-6 space-y-3 rounded-sm">
              <p className="text-[16px] text-brand-10">{title}</p>
              <div className="w-full h-[2px] bg-[#C0C2C8]"></div>
              <div className="grid grid-cols-2 gap-4">
                {detailItems.map((item, index) => (
                  <EstateDetailItem
                    key={index}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
              <div className="w-full flex items-center justify-between">
                <div>
                  <h3 className="text-[#747474] text-[16px] font-normal">
                    Total Package
                  </h3>
                  <p className="text-xl font-bold text-brand-primary">
                    ₦1,950,000
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-brand-9 text-white hover:bg-[#0033c4b3] active:text-brand-9 py-2 px-6 rounded active:bg-transparent active:border-brand-9"
                  //   onClick={() => {}}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-7">
            <h6 className="font-bold text-[#092C4C] text-xl mb-2">
              Renew Rent
            </h6>
            <div className="w-full h-[1px] bg-[#C0C2C8] mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Start Date</span>
                <DateInput id="start date" />
              </label>
              <label className="block">
                <span className="text-gray-700">Due Date</span>
                <DateInput id="due date" />
              </label>
            </div>

            <div className="flex items-center justify-end">
              <div className="space-y-2 space-x-2">
                {[
                  "Create Invoice",
                  "Mobile Notification",
                  "SMS Alert",
                  "Email Alert",
                ].map((option) => (
                  <label key={option} className="inline-flex items-center">
                    <Checkbox checked={false} onChange={() => {}}>
                      <span>{option}</span>
                    </Checkbox>
                  </label>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-text-secondary">
              Confirms that you have received payment for the rent renewal.
              However, if you intend to receive the payment, you can click
              &apos;create invoice&apos; for tenants to make the payment.
            </p>
            <h6 className="font-bold text-[#092C4C] text-xl">
              Previous Rent Records
            </h6>
            <div className="w-full h-[1px] bg-[#C0C2C8] mb-4"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/5">
          <MatchedProfile
            occupant={{
              name: "Abimbola Adedeji",
              email: "abimbola@gmail.com",
              avatar: "/empty/avatar-1.svg",
              gender: "Male",
              birthday: "12/12/12",
              religion: "Christianity",
              phone: "+2348132086958",
              maritalStatus: "Single",
              address: "U4 Joke Plaza Bodija Ibadan",
              city: "Ibadan",
              state: "Oyo State",
              lg: "Ibadan North Central",
            }}
          />
        </div>
      </div>
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
  );
};

const detailItems = [
  { label: "Current Start Date", value: "12/1/2023" },
  { label: "Due Date", value: "12/1/2023" },
  { label: "Annual Rent", value: "300,000" },
  { label: "Other Fees", value: "300,000" },
];
