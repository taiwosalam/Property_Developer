const HeadText = ({ title }: { title: string }) => {
  return (
    <div>
      <h2 className="uppercase text-brand-9 mt-3 font-bold text-xl">
        {title}
      </h2>
    </div>
  );
};


const SubHead = ({ title }: { title: string }) => {
  return (
    <div>
      <h2 className="capitalize mt-3 font-bold text-md">
        {title}
      </h2>
    </div>
  );
};

export const LabeledLine = ({
  label,
  width = "w-[70%]",
}: {
  label: string;
  width?: string;
}) => (
  <div className={`flex items-center gap-1 ${width}`}>
    <span className="whitespace-nowrap">{label}</span>
    <span className="border-b border-black flex-1 min-w-[80px]">&nbsp;</span>
  </div>
);

const TickBox = ({ text }: { text: string }) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="border h-4 w-4 border-black" />
      <span className="capitalize"> {text} </span>
    </div>
  );
};

export const ManagemenApplicationForm2 = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col w-full gap-2">
        <p>If yes, name of current manager or agency and company name: </p>
        <LabeledLine label="" width="w-[100%]" />
      </div>

      {/* SERVICES REQUIRED */}
      <div className="my-5">
        <HeadText title="Services Required" />
        <p>Please select the services you would like us to handle: </p>
        <div className="flex flex-col gap-2 my-4">
          <TickBox text="Tenant Sourcing & Screening" />
          <TickBox text="rent collection" />
          <TickBox text="Property Maintenance" />
          <TickBox text="Inspection & Reporting" />
          <TickBox text="Legal/Documentation Support" />
          <div className="flex">
            <TickBox text="Other (please specify):" />
            <LabeledLine label="" width="w-[30%]" />
          </div>
        </div>

        <SubHead title="Do you require Caution/Damages deposit?" />
        <div className="flex gap-6 mt-2">
          <TickBox text="yes" />
          <TickBox text="No" />
        </div>
        <SubHead title="Who To Keep Deposit" />
        <div className="flex gap-6 mt-2">
          <TickBox text="landlord" />
          <TickBox text="management company" />
          <TickBox text="escrow it" />
        </div>
        <SubHead title="Do you require late rent Penalty? " />
        <div className="flex gap-6 mt-2">
          <TickBox text="yes" />
          <TickBox text="No (state your reasons):" />
          <LabeledLine label="" width="w-[30%]" />
        </div>
        <SubHead title="Do you require call request from tenant? " />
        <div className="flex gap-6 mt-2">
          <TickBox text="yes" />
          <TickBox text="No (state your reasons):" />
          <LabeledLine label="" width="w-[30%]" />
        </div>
        <SubHead title="Do you require Tenants Group Chat?" />
        <div className="flex gap-6 mt-2">
          <TickBox text="yes" />
          <TickBox text="No (state your reasons):" />
          <LabeledLine label="" width="w-[30%]" />
        </div>
        <SubHead title="Do you require tenant to schedule for visitor? " />
        <div className="flex gap-6 mt-2">
          <TickBox text="yes" />
          <TickBox text="No (state your reasons):" />
          <LabeledLine label="" width="w-[30%]" />
        </div>
        <SubHead title="Who To Charge renewal package" />
        <div className="flex gap-6 mt-2">
          <TickBox text="landlord" />
          <TickBox text="tenant" />
          <TickBox text="both" />
        </div>
        <SubHead title="Management Commission/Percentage " />
        <div className="flex gap-6 mt-2">
          <TickBox text="1%" />
          <TickBox text="2%" />
          <TickBox text="3%" />
          <TickBox text="4%" />
          <TickBox text="5%" />
          <TickBox text="6%" />
          <TickBox text="7%" />
          <TickBox text="8%" />
          <TickBox text="9%" />
          <TickBox text="10%" />
        </div>
      </div>
    </div>
  );
};
