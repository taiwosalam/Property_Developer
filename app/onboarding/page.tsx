import Button from "@/components/Form/Button/button";
import Label from "@/components/Form/Label/label";
import CompanyType from "@/components/company-type";
import { companyTypes } from "./data";

export default function Onboarding() {
  return (
    <div>
      <div className="text-text-primary flex items-center justify-between bg-brand-1 px-10 py-5">
        <div>
          <h2 className="text-2xl font-medium">
            Finish Setting Up Your Account!
          </h2>
          <p className="text-text-tertiary text-base">
            Please furnish the folowing details to finalize the setup of your
            account and company profile.
          </p>
        </div>
        <Button className="rounded-none opacity-50">Submit</Button>
      </div>
      <section className="px-10 py-5">
        <div>
          <Label id="company-type" important>
            Company Type
          </Label>
          <p className="text-sm font-normal text-text-disabled">
            Please Choose the company type tha best fits your default das
          </p>
          <div className="flex gap-5 p-4">
            {companyTypes.map((c) => (
              <CompanyType key={c.name} {...c} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
