import Image from "next/image";
import {
  AttestationProps,
  AttorneyInfoProps,
  ClauseListProps,
  ClauseProps,
  LawFirmInfoProps,
  PartiesProps,
  PropertyDescriptionProps,
} from "./types";
import { empty } from "@/app/config";
import { WitnessSignatureDateProps } from "./data";
import Signature from "@/components/Signature/signature";
import { usePersonalInfoStore } from "@/store/personal-info-store";

export const Parties: React.FC<PartiesProps> = ({ landlord, tenant }) => (
  <div className="flex flex-col items-center justify-center mb-10">
    <h2 className="text-[74px] font-bold mt-10 fixedText-color"> TENANCY AGREEMENT </h2>
    <h2 className="text-[32px] fixedText-color font-normal uppercase my-10"> between </h2>
    <p className="text-[50px] fixedText-color uppercase font-semibold">{landlord}</p>
    <span className="text-[20px] fixedText-color font-semibold uppercase tracking-wide">
      (landlord/landlady)
    </span>
    <p className="text-[30px] text-base fixedText-color uppercase mt-[100px] mb-8"> and </p>
    <p className="text-[50px] uppercase fixedText-color font-semibold">{tenant}</p>
    <span className="text-[20px] fixedText-color uppercase font-semibold tracking-wide">
      (Tenant)
    </span>
  </div>
);

// Component for property description
export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description,
}) => (
  <div className="flex items-start justify-center mt-10">
    <p className="uppercase text-center fixedText-color tracking-wide font-bold text-[30px]">
      {description}
    </p>
  </div>
);

// Component for attorney information
export const AttorneyInfo: React.FC<AttorneyInfoProps> = ({ attorney }) => {
  const company_name = usePersonalInfoStore((state) => state.company_name);
  return (
    <div className="attorney flex flex-col fixedText-color items-center justify-center mt-10">
      <p className="text-[24px] text-center fixedText-color uppercase font-bold">
        Through his lawful Attorney:
      </p>
      {/* NB: CHANGED TO COMPANY NAME AS REQUESTED */}
      <p className="text-[30px] font-bold fixedText-color uppercase">{company_name}</p>
    </div>
  );
};

// Component for law firm details with logo and contact info
export const LawFirmInfo: React.FC<LawFirmInfoProps> = ({ lawFirm }) => (
  <div className="flex items-start justify-between mt-[200px] px-[100px] mb-10">
    <i className="uppercase fixedText-color font-semibold text-[25px] flex-1">Prepared by:</i>
    <div className="wrapper flex-1">
      <div className="logo fixedText-color w-[430px] h-[105px]">
        <Image
          alt="lawyer-logo"
          src={lawFirm.logoSrc}
          width={100}
          height={100}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex fixedText-color flex-col justify-center items-center mt-4 gap-2">
        {lawFirm.contactDetails.map((detail, index) => (
          <p key={index} className={detail.className}>
            {detail.text}
          </p>
        ))}
      </div>
    </div>
    <div className="flex-1 fixedText-color flex items-center justify-center seal min-w-[300px] min-h-[300px] rounded-full">
      <Image
        alt="seal"
        src={lawFirm.sealSrc}
        width={300}
        height={300}
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  </div>
);

// Component for attestation
export const Attestation: React.FC<AttestationProps> = ({
  date,
  landlord,
  tenant,
}) => (
  <div className="flex flex-col items-start fixedText-color text-[30px]">
    <p>
      <strong>THIS TENANCY AGREEMENT</strong> made this day of {date}{" "}
      <strong>BETWEEN</strong>
    </p>
    <p className="mt-4">
      <span className="uppercase font-bold fixedText-color">{landlord.name} </span>
      <span>
        of <b className="font-bold fixedText-color">{landlord.address} </b> (hereinafter
        referred to as the <b className="font-bold fixedText-color">“LANDLORD” </b> which
        expression shall where the context so admits includes his heirs
        successors-in-title, representatives and assigns) of the one part.
      </span>
    </p>
    <p className="uppercase my-4 font-bold fixedText-color">AND</p>
    <p>
      <span>
        <b className="uppercase font-bold fixedText-color">{tenant.name} </b>
        <span>
          of <b className="font-bold fixedText-color">{tenant.address} </b> (hereinafter
          referred to as the <b className="font-bold fixedText-color"> “TENANT” </b> which
          expression shall where the context so admits includes his heirs
          successors-in-title, representatives and assigns) of the other part.
        </span>
      </span>
    </p>
  </div>
);

// Component for a single clause with optional content and sub-clauses
export const Clause: React.FC<ClauseProps> = ({
  title,
  content,
  subClauses,
}) => (
  <li className="relative pl-8 fixedText-color mb-4" style={{ counterIncrement: "item" }}>
    <div className="absolute left-0 text-[30px] font-bold before:content-[counter(item)'.']"></div>
    <p className="uppercase fixedText-color font-bold text-[30px]">{title}</p>
    {/* {content && <p className="font-semibold text-[25px]">{content}</p>} */}
    {content && (
      <p
        className="font-semibold text-[25px] fixedText-color"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )}
    {subClauses && subClauses.length > 0 && (
      <ol className="list-none pl-4 mt-2 fixedText-color" style={{ counterReset: "subitem" }}>
        {subClauses.map((subClause, index) => (
          <li
            key={index}
            className="relative fixedText-color pl-12 mb-2 text-[25px]"
            style={{ counterIncrement: "subitem" }}
          >
            <div className="absolute fixedText-color left-0 before:content-[counter(item)'.'counter(subitem)]"></div>
            <span dangerouslySetInnerHTML={{ __html: subClause }} />
          </li>
        ))}
      </ol>
    )}
  </li>
);

// Component for the list of clauses
export const ClauseList: React.FC<ClauseListProps> = ({ clauses }) => (
  <div className="counts">
    <ol className="list-none pl-0 fixedText-color" style={{ counterReset: "item" }}>
      {clauses.map((clause, index) => (
        <Clause key={index} {...clause} />
      ))}
    </ol>
  </div>
);

export const WitnessSignatureDate: React.FC<WitnessSignatureDateProps> = ({
  landlord,
  tenant,
  witness,
  lawFirm,
}) => {
  return (
    <div>
      <div className="flex flex-col items-start mt-8 font-bold fixedText-color">
        <h3 className="uppercase text-[25px] fixedText-color font-bold tracking-wide">
          IN WITNESS WHEREOF, THE PARTIES HAVE HERE UNTO SET THEIR HANDS AND
          SEALS THE DAY AND YEAR FIRST ABOVE WRITTEN.
        </h3>
        <p className="uppercase fixedText-color text-[25px] font-bold tracking-wide">
          SIGNED SEALED BY THE WITHIN NAMED TENANT
        </p>
      </div>
      <div className="mt-10 fixedText-color flex flex-col gap-1">
        {/* TENANT SIGNATURE */}
        <>
          {tenant?.signature ? (
            <div className="w-[150px] h-[50px]">
              <Image
                alt="tenant signature"
                src={tenant?.signature}
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <p>-----------------------------------------------------------------------------</p>
          )}
        </>
        <p className="uppercase text-[25px] fixedText-color font-bold tracking-wide">
          {tenant?.name}
        </p>
        <p className="uppercase text-[25px] fixedText-color font-bold tracking-wide">
          SIGNED, SEALED, AND DELIVERED by the within-named Landlord/landlady
        </p>
      </div>

      <div className="mt-6 flex flex-col fixedText-color gap-1">
        <>
          {landlord?.signature ? (
            <Image
              alt="landlord signature"
              src={landlord?.signature}
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          ) : (
            <p>-----------------------------------------------------------------------------</p>
          )}
        </>
        <p className="uppercase text-[25px] font-bold fixedText-color tracking-wide">
          {landlord?.name}
        </p>
      </div>

      <div className="presence mt-[50px]">
        <h2 className="uppercase text-[25px] fixedText-color font-bold tracking-wide mb-4">
          Witness By his lawful Attorney
        </h2>
        <Signature noTitle />
      </div>

      <div className="preparedby w-full flex flex-col items-center justify-center">
        <div className="lawyersignature w-20 h-20 fixedText-color">
          <Image
            alt="lawyer signature"
            src={lawFirm.sealSrc || empty}
            width={100}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col items-center mt-4 gap-1 fixedText-color">
          {lawFirm.contactDetails.map((detail: any, index: number) => (
            <p key={index} className={detail.className}>
              {detail.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
