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
      <h2 className="capitalize mt-3 font-bold text-md text-black">{title}</h2>
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

const TickBox = ({ text }: { text: string }) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="border h-4 w-4 border-black" />
      <span className="capitalize text-black"> {text} </span>
    </div>
  );
};

export const ManagemenApplicationForm3 = () => {
  return (
    <div className="w-full">
      {/* YOUR PROPOSED TERMS */}
      <div className="my-5">
        <HeadText title="YOUR PROPOSED TERMS" />
        <div className="flex flex-col gap-2 mt-3">
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
        </div>
      </div>

      {/* ADDITIONAL NOTE/SPECIAL INSTRUCTION */}
      <div className="mt-8 mb-5">
        <HeadText title="ADDITIONAL NOTE/SPECIAL INSTRUCTION" />
        <div className="flex flex-col gap-2">
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
          <LabeledLine label="" width="w-[100%]" />
        </div>
      </div>

      {/* ATTACHMENTS */}
      <div>
        <p className="text-black">Please attach the following: </p>
        <p className="text-black">Proof of Ownership (e.g., Title Document, Deed of Assignment) </p>
        <p className="text-black">
          Valid ID (National ID, Driver’s License, Voter’s Card, or
          International Passport)
        </p>
        <p className="text-black">Passport Photograph</p>

        <SubHead title="Declaration:" />
        <p className="text-black">
          I confirm that the information provided above is accurate and I hereby
          request property management services as specified.
        </p>

        <div className="flex gap-4 mt-5">
          <LabeledLine label="Signature:" width="w-[50%]" />
          <LabeledLine label="Date:" width="w-[50%]" />
        </div>
      </div>
    </div>
  );
};
