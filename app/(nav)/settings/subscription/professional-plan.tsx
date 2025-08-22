import Link from "next/link";

const ProfessionalPlanComponent = () => {
  return (
    <div className="flex flex-col w-full pr-10 pl-4 rounded-md mt-8 flex-wrap shadow-md py-4 bg-[url('/icons/enrollment-bg.svg')] bg-no-repeat bg-center bg-cover bg-opacity-60">
      <h3 className="text-[16px] underline font-bold text-brand-9">
        PROFESSIONAL PLAN
      </h3>
      <p className="text-sm max-w-[964px] text-text-secondary dark:text-darkText-1">
        If none of the available plans meets your company&apos;s standards,
        consider opting for the Professional plan. This plan provides unlimited
        access to all software solutions. Professional plans are ideal for
        established property managers who wish to customize the software with
        their company&apos;s name and brand.
      </p>

      <h4 className="text-sm font-bold mt-4 text-text-secondary dark:text-white">
        Features Included:
      </h4>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-start w-full lg:justify-between flex-wrap">
        <strong className="leading-[150%] w-full lg:w-4/5 max-w-[750px]">
          All plans benefit and all Ads-on Inclusive; API integrations, SaaS,
          Whitelabel, Custom domain, Unlimited Branches, Director, Staff and
          Property Creations. Dedicated account officer, 24/7 Support and
          training, Email integration, and SMS prefer name.
        </strong>

        <div className="w-full sm:w-1/2 lg:w-1/5 bg-brand-9 h-10 text-white px-4 py-2 rounded-md flex items-center justify-center">
          <Link
            href="https://ourproperty.com.ng/resources/professional-plan/"
            className=""
            target="_blank"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};


export default ProfessionalPlanComponent;