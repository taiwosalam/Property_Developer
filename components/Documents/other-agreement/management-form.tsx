const HeadText = ({ title }: { title: string }) => {
  return (
    <div>
      <h2 className="uppercase text-brand-9 mt-3 font-bold text-xl">
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

export const ManagemenApplicationForm = () => {
  return (
    <div className="w-full">
      <div className="w-full items-center justify-center mb-4">
        <h1 className="font-bold uppercase text-brand-9 text-3xl text-center stroke-texts">
          management application form
        </h1>
      </div>

      <div className="flex w-full gap-2">
        <div className="w-[75%] flex flex-col gap-2">
          <div className="flex w-full gap-4">
            <LabeledLine label="First Name:" width="w-[50%]" />
            <LabeledLine label="Last Name:" width="w-[50%]" />
          </div>
          <div className="flex w-full gap-4">
            <LabeledLine label="Mobile No:" width="w-[50%]" />
            <LabeledLine label="Email:" width="w-[50%]" />
          </div>
          <div className="flex w-full gap-4">
            <LabeledLine label="State:" width="w-[40%]" />
            <LabeledLine label="LGA:" width="w-[60%]" />
          </div>
          <div className="flex w-full gap-4">
            <LabeledLine label="City:" width="w-[35%]" />
            <LabeledLine label="Address:" width="w-[65%]" />
          </div>
          <div className="flex w-full gap-4">
            <LabeledLine label="Tenant Type/Status:" width="w-[70%]" />
            <LabeledLine label="Gender:" width="w-[30%]" />
          </div>
          <div className="flex w-full">
            <LabeledLine label="Propose Apartment:" width="w-[100%]" />
          </div>
          <div className="flex w-full">
            <LabeledLine
              label="Address of Propose Apartment:"
              width="w-[100%]"
            />
          </div>
          <div className="flex w-full">
            <LabeledLine label="" width="w-[100%]" />
          </div>
        </div>

        <div className="w-[25%] min-h-[150px] border border-black flex items-center justify-center">
          <div className="w-full flex items-center justify-center text-red-500 text-center text-xl font-semibold uppercase">
            Applicant <br /> passport <br /> photograph
          </div>
        </div>
      </div>

      {/* NEXT OF KIN */}
      <div className="my-5">
        <HeadText title="Next of kin" />
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex gap-4">
            <LabeledLine label="Name:" width="w-[65%]" />
            <LabeledLine label="Mobile No:" width="w-[35%]" />
          </div>
          <LabeledLine label="Traceable Address:" width="w-[100%]" />
          <div className="flex gap-4">
            <LabeledLine label="Email:" width="w-[70%]" />
            <LabeledLine label="Relationship:" width="w-[30%]" />
          </div>
        </div>
      </div>

      {/* BANK DETAILS */}
      <div className="my-5">
        <HeadText title="bank details" />
        <div className="flex flex-col gap-2 mt-3">
          <LabeledLine label="Bank Account Name:" width="w-[100%]" />
          <div className="flex gap-4">
            <LabeledLine label="Account Number:" width="w-[50%]" />
            <LabeledLine label="Bank Name:" width="w-[50%]" />
          </div>
        </div>
      </div>

      {/* PROPERTY INFORMATION */}
      <div className="my-5">
        <HeadText title="Property Information" />
        <div className="flex gap-6 my-4">
          <TickBox text="Residential" />
          <TickBox text="Commercial" />
          <TickBox text="Mixed-Use" />
        </div>
        <div className="flex flex-col w-full gap-4">
          <LabeledLine label="Number of Units:" width="w-[50%]" />
          <LabeledLine label="Expected total annual return:" width="w-[50%]" />
        </div>
        <h3 className="mt-4 font-bold text-black">Current Occupancy Status:</h3>
        <div className="flex gap-6 mt-2">
          <TickBox text="Fully Occupied" />
          <TickBox text="partially occupied" />
          <TickBox text="all unit vacant" />
        </div>
      </div>

      {/* OWNERSHIP DETAILS */}
      <div className="my-5">
        <HeadText title="Ownership details" />
        <h3 className="mt-4 font-bold text-black">
          Are you the legal owner of the property?
        </h3>
        <div className="flex gap-6 mt-2">
          <TickBox text="yes" />
          <TickBox text="No (If no, state relationship to owner):" />
          <LabeledLine label="" width="w-[30%]" />
        </div>
        <h3 className="mt-4 font-bold text-black">
          Do you have any existing property management agreement?
        </h3>
        <div className="flex gap-6 mt-2">
          <TickBox text="yes" />
          <TickBox text="No" />
        </div>
      </div>
    </div>
  );
};


