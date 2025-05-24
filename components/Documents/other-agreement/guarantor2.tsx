import { LabeledLine } from "./application-form";

const HeadText = ({ title }: { title: string }) => {
  return (
    <div>
      <h2 className="text-brand-9 mt-3 font-semibold text-[16px]">{title}</h2>
    </div>
  );
};

const Guarantor2 = () => {
  return (
    <div>
      <div className="guarantor-1 custom-flex-col w-full mt-5">
        <div className="w-full flex justify-center">
          <h2 className="text-brand-9 mt-3 font-bold underline text-2xl uppercase">
            guarantor 2
          </h2>
        </div>

        <div className="flex w-full gap-2 mt-5">
          <div className="w-[75%] flex flex-col gap-2">
            <div className="flex w-full gap-4">
              <LabeledLine label="I" width="w-[80%]" />
              (NAME IN FULL)
            </div>
            <div className="flex w-full gap-4">
              <LabeledLine label="a Nigeria of" width="w-[50%]" />
              State of Origin Presently resident at
            </div>
            <div className="flex w-full gap-4">
              <LabeledLine label="(TRACEABLE ADDRESS)" width="w-[100%]" />
            </div>
            <div className="flex w-full">
              <LabeledLine label="" width="w-[100%]" />
            </div>
            <div className="flex w-full gap-4">
              <LabeledLine
                label="do hereby certify that; (Mr., Mrs., Miss)"
                width="w-[100%]"
              />
            </div>
            <div className="flex w-full gap-4">
              Is well known to me and is very responsible and not of a
              questionable character.
            </div>
          </div>

          <div className="w-[25%] min-h-[150px] border border-black flex items-center justify-center">
            <div className="w-full flex items-center justify-center text-red-500 text-center text-xl font-semibold uppercase">
              Guarantor 2 <br /> passport <br /> photograph
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4 mt-2">
          <p className="my-3">
            I also certify that he/she is capable of paying the rent in advance
            and any other bill(s) in respect of the said letting apartment,
          </p>
          <p>
            That he/she will abide to all condition that was abided in the
            agreement without default, breaching of the terms should be resulted
            to immediate termination of tenancy.
          </p>
          <p className="my-3">
            In the event of default in his/her obligation, I hereby undertake to
            be fully responsible for any outstanding owned by the above name
            tenant.
          </p>

          <div className="flex w-full gap-2">
            <div className="w-full flex flex-col gap-2">
              <div className="flex w-full gap-4">
                <LabeledLine label="My Office Address:" width="w-[100%]" />
              </div>
              <div className="flex w-full gap-4">
                <LabeledLine
                  label="My Relationship with the tenant:"
                  width="w-[50%]"
                />
                <LabeledLine
                  label="Our Year of Relationship:"
                  width="w-[50%]"
                />
              </div>
              <div className="flex w-full gap-4">
                <LabeledLine label="My Mobile No:" width="w-[35%]" />
                <LabeledLine label="or" width="w-[35%]" />
                <LabeledLine label="My Email:" width="w-[40%]" />
              </div>
              <div className="flex w-full gap-4">
                <LabeledLine label="Signed by me:" width="w-[40%]" />
                <LabeledLine label="Date:" width="w-[40%]" />
              </div>
              <div className="flex w-full gap-4 mt-3">
                <LabeledLine label="Witness by:" width="w-[60%]" />
                <LabeledLine label="Signed and Date:" width="w-[40%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center flex-col justify-center p-4 mt-5 shadow-sm border-2 border-b-2 border-brand-9">
          <p className="text-center text-brand-9 text-md font-semibold">
            References may be provided by a current or former landlord, estate
            agent, employer, bank manager, parent, accountant, or another
            trusted individual.
          </p>
          <p className="text-center text-brand-9 text-[16px] font-bold">
            All approved tenants and their guarantors are required to submit a
            passport-sized photograph and a photocopy of a valid means of
            identification, such as: National Identity Card (NIN Slip or Plastic
            ID), Driver’s License, International Passport, Voter’s Card, or any
            other government-issued ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Guarantor2;
