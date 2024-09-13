import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";

const UnitBreakdownRenewalTenant = () => {
  return (
    <div>
      <h4 className="text-primary-navy text-lg md:text-xl font-bold">
        Unit Rent Breakdown - Renewal Tenants
      </h4>
      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-[970px]">
        <Select
          required
          id="renewal_rent_period"
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
        <Input
          id="renewal_rent_amount"
          required
          label="Rent Amount"
          inputClassName="bg-white"
        />
        <Input
          id="renewal_service_charge"
          label="Service Charge"
          inputClassName="bg-white"
        />
        <Input
          id="renewal_other_charges"
          label="Other Charges"
          inputClassName="bg-white"
        />
        <Input
          required
          id="renewal_total_package"
          label="Total Package"
          inputClassName="bg-white"
        />
      </div>
    </div>
  );
};

export default UnitBreakdownRenewalTenant;
