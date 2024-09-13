import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";

const UnitBreakdownNewTenant = () => {
  return (
    <div>
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Unit Rent Breakdown - New Tenant
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-[970px]">
        <Select
          id="rent_period"
          required
          options={[
            "daily",
            "weekly",
            "monthly",
            "yearly",
            "quarterly",
            "bi-annually",
          ]}
          label="Rent Period"
          inputContainerClassName="bg-white"
        />
        <Input id="rent_amount" label="Rent Amount" required inputClassName="bg-white" />
        <Input
          id="service_charge"
          label="Service Charge"
          inputClassName="bg-white"
        />
        <Input id="agency_fee" label="Agency Fee" inputClassName="bg-white" />
        <Input id="legal_fee" label="Legal Fee" inputClassName="bg-white" />
        <Input id="caution_fee" label="Caution Fee" inputClassName="bg-white" />
        <Input
          id="inspection_fee"
          label="Inspection Fee"
          inputClassName="bg-white"
        />
        <Input
          id="other_charges"
          label="Other Charges"
          inputClassName="bg-white"
        />
        <Select
          required
          options={["yes", "no"]}
          id="open_to_negotiation"
          label="Are you open to negotiation?"
          inputContainerClassName="bg-white"
        />

        <Input
          required
          id="total_package"
          label="Total Package"
          inputClassName="bg-white"
        />
      </div>
    </div>
  );
};

export default UnitBreakdownNewTenant;
