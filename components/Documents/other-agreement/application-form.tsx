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
    <span className="whitespace-nowrap text-black">{label}</span>
    <span className="border-b border-black flex-1 min-w-[80px]">&nbsp;</span>
  </div>
);

export const ApplicationForm = () => {
  return (
    <div className="w-full">
      <div className="w-full items-center justify-center mb-4">
        <h1 className="font-bold text-brand-9 text-3xl text-center stroke-texts">
          TENANCY AGREEMENT FORM
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

      {/* OTHER DETAILS */}
      <div className="my-5">
        <HeadText title="OTHER details" />
        <div className="flex flex-col gap-2 mt-3">
          <LabeledLine label="Employment/Job Type:" width="w-[100%]" />
          <LabeledLine label="Family Size/Family Type:" width="w-[100%]" />
        </div>
      </div>

      {/* OTHER DETAILS */}
      <div className="my-5">
        <HeadText title="details of those that will be living with you permanently" />
        <div className="flex flex-col gap-2 mt-3">
          <div>
            <AgreementTableHeader
              titles={["name", "relationship", "age", "phone number"]}
            />
          </div>
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <div>
            <AgreementTableHeader
              titles={["name", "relationship", "age", "phone number"]}
            />
          </div>
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
        </div>
      </div>
    </div>
  );
};

interface TableHeaderProps {
  titles: string[];
}

export const AgreementTableHeader: React.FC<TableHeaderProps> = ({
  titles,
}) => {
  return (
    <div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="font-bold text-xl uppercase text-left text-black pr-8">S/N</th>
            {titles.map((title, index) => (
              <th
                key={index}
                className="font-bold text-xl uppercase border-4 border-brand-9 text-black bg-gray-100 text-left py-2 px-4"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
};
