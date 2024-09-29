import Details from "@/components/Accounting/invoice/create-invoice/Details";
import Picture from "@/components/Picture/picture";
import { LocationIcon } from "@/public/icons/icons";

const CreateInvoicePage = () => {
  return (
    <section className="space-y-7">
      <h1 className="font-medium text-2xl">Create New Invoice</h1>
      <div
        className="bg-white rounded-[8px] p-6 flex items-center justify-between flex-wrap"
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <div
          style={{
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 4px 6px 0px rgba(13, 23, 33, 0.08)",
          }}
        >
          <Picture
            src={"/empty/logo placeholder.svg"}
            width={300}
            height={100}
          />
        </div>
        <div className="w-fit text-left">
          <p className="text-text-secondary text-sm font-medium">Contacts</p>
          <div className="text-text-secondary text-sm font-normal">
            <div className="flex items-center gap-1">
              <LocationIcon color="#0033C4" />
              <span>States and Local Govt.</span>
            </div>
            <div className="flex items-center gap-1">
              <Picture src={"/icons/global-search.svg"} size={16} />
              <span>https://www.hprealestate.co.in1</span>
            </div>
            <div className="flex items-center gap-1">
              <Picture src={"/icons/phone.svg"} size={16} />
              <span>08132086958 || 09123435487 || 9848848488</span>
            </div>
            <div className="flex items-center gap-1">
              <Picture src={"/icons/mail2.svg"} size={16} />
              <span>Email@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Details />
        <div>{/* dropdown beow it */}</div>
      </div>
      <div>{/* add payment */}</div>
      <div>{/* breakdown */}</div>
      <div>{/* checkboxes */}</div>
    </section>
  );
};

export default CreateInvoicePage;
