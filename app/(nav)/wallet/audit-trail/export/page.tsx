// Images
import SendIcon from "@/public/icons/send.svg";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import Signature from "@/components/Signature/signature";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";

const ExportWallet = () => {
  return (
    <div className="custom-flex-col gap-10 pb-[100px]">
      <ExportPageHeader
        logo={empty}
        location="States and Local Govt"
        website="https://realesate.com"
        phoneNumbers={["09022312133", "07012133313", "0901212121"]}
        email="example@mail.com"
      />
      <div className="custom-flex-col gap-6">
        <div className="flex justify-center">
          <div className="custom-flex-col text-center gap-1">
            <h1 className="text-black text-2xl font-medium">Summary</h1>
            <p className="text-text-label text-xl font-normal">
              21st JAN -16th March
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <WalletAnalytics
            title="funds"
            amount={6505689}
            trend={{
              from: "yesterday",
              type: "up",
              percent: 53,
            }}
          />
          <WalletAnalytics
            title="debit"
            amount={6505689}
            trend={{
              from: "last week",
              type: "down",
              percent: 4.3,
            }}
          />
          <WalletAnalytics
            title="credit"
            amount={6505689}
            trend={{
              from: "yesterday",
              type: "up",
              percent: 53,
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
              <th></th>
              <th>transaction ID</th>
              <th>source</th>
              <th>description</th>
              <th>amount</th>
              <th>status</th>
              <th>date</th>
              <th>time</th>
            </tr>
          </thead>
          <tbody>
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <tr key={index}>
                  <td>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-status-error-1">
                      <Picture src={SendIcon} alt="send icon" size={20} />
                    </div>
                  </td>
                  <td>
                    <p>00001102332</p>
                  </td>
                  <td>
                    <p>Debit</p>
                  </td>
                  <td>
                    <p>Paid for services</p>
                  </td>
                  <td>
                    <p className="text-status-error-2">-₦5,000.00</p>
                  </td>
                  <td>
                    <p>Pending</p>
                  </td>
                  <td>
                    <p>12/01/2024</p>
                  </td>
                  <td>
                    <p>03:30pm</p>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Signature />
      </div>
      <div className="fixed bottom-0 right-0 w-full bg-white py-5 px-[60px] flex gap-6 justify-end">
        <Button variant="sky_blue" size="base_medium" className="py-2 px-8">
          back
        </Button>
        <div className="flex gap-6">
          <Button variant="sky_blue" size="base_medium" className="py-2 px-8">
            download
          </Button>
          <Button size="base_medium" className="py-2 px-8">
            print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportWallet;
