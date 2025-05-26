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
    <h2 className="text-[74px] font-bold mt-10"> TENANCY AGREEMENT </h2>
    <h2 className="text-[32px] font-normal uppercase my-10"> between </h2>
    <p className="text-[50px] uppercase font-semibold">{landlord}</p>
    <span className="text-[20px] font-semibold uppercase tracking-wide">
      (landlord/landlady)
    </span>
    <p className="text-[30px] text-base uppercase mt-[100px] mb-8"> and </p>
    <p className="text-[50px] uppercase font-semibold">{tenant}</p>
    <span className="text-[20px] uppercase font-semibold tracking-wide">
      (Tenant)
    </span>
  </div>
);

// Component for property description
export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description,
}) => (
  <div className="flex items-start justify-center mt-10">
    <p className="uppercase text-center tracking-wide font-bold text-[30px]">
      {description}
    </p>
  </div>
);

// Component for attorney information
export const AttorneyInfo: React.FC<AttorneyInfoProps> = ({ attorney }) => {
  const company_name = usePersonalInfoStore((state) => state.company_name);
  return (
    <div className="attorney flex flex-col items-center justify-center mt-10">
      <p className="text-[24px] text-center uppercase font-bold">
        Through his lawful Attorney:
      </p>
      {/* NB: CHANGED TO COMPANY NAME AS REQUESTED */}
      <p className="text-[30px] font-bold uppercase">{company_name}</p>
    </div>
  );
};

// Component for law firm details with logo and contact info
export const LawFirmInfo: React.FC<LawFirmInfoProps> = ({ lawFirm }) => (
  <div className="flex items-start justify-between mt-[200px] px-[100px] mb-10">
    <i className="uppercase font-semibold text-[25px] flex-1">Prepared by:</i>
    <div className="wrapper flex-1">
      <div className="logo w-[430px] h-[105px]">
        <Image
          alt="lawyer-logo"
          src={lawFirm.logoSrc}
          width={100}
          height={100}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col justify-center items-center mt-4 gap-2">
        {lawFirm.contactDetails.map((detail, index) => (
          <p key={index} className={detail.className}>
            {detail.text}
          </p>
        ))}
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center seal min-w-[300px] min-h-[300px] rounded-full">
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
  <div className="flex flex-col items-start text-[30px]">
    <p>
      <strong>THIS TENANCY AGREEMENT</strong> made this day of {date}{" "}
      <strong>BETWEEN</strong>
    </p>
    <p className="mt-4">
      <span className="uppercase font-bold">{landlord.name} </span>
      <span>
        of <b className="font-bold">{landlord.address} </b> (hereinafter
        referred to as the <b className="font-bold">“LANDLORD” </b> which
        expression shall where the context so admits includes his heirs
        successors-in-title, representatives and assigns) of the one part.
      </span>
    </p>
    <p className="uppercase my-4 font-bold">AND</p>
    <p>
      <span>
        <b className="uppercase font-bold">{tenant.name} </b>
        <span>
          of <b className="font-bold">{tenant.address} </b> (hereinafter
          referred to as the <b className="font-bold"> “TENANT” </b> which
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
  <li className="relative pl-8 mb-4" style={{ counterIncrement: "item" }}>
    <div className="absolute left-0 text-[30px] font-bold before:content-[counter(item)'.']"></div>
    <p className="uppercase font-bold text-[30px]">{title}</p>
    {/* {content && <p className="font-semibold text-[25px]">{content}</p>} */}
    {content && (
      <p
        className="font-semibold text-[25px]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )}
    {subClauses && subClauses.length > 0 && (
      <ol className="list-none pl-4 mt-2" style={{ counterReset: "subitem" }}>
        {subClauses.map((subClause, index) => (
          <li
            key={index}
            className="relative pl-12 mb-2 text-[25px]"
            style={{ counterIncrement: "subitem" }}
          >
            <div className="absolute left-0 before:content-[counter(item)'.'counter(subitem)]"></div>
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
    <ol className="list-none pl-0" style={{ counterReset: "item" }}>
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
  console.log("landlord", landlord);
  console.log("tenant", tenant);
  return (
    <div>
      <div className="flex flex-col items-start mt-8 font-bold">
        <h3 className="uppercase text-[25px] font-bold tracking-wide">
          IN WITNESS WHEREOF, THE PARTIES HAVE HERE UNTO SET THEIR HANDS AND
          SEALS THE DAY AND YEAR FIRST ABOVE WRITTEN.
        </h3>
        <p className="uppercase text-[25px] font-bold tracking-wide">
          SIGNED SEALED BY THE WITHIN NAMED TENANT
        </p>
      </div>
      <div className="mt-10 flex flex-col gap-1">
        <p>
          -----------------------------------------------------------------------------
        </p>
        <p className="uppercase text-[25px] font-bold tracking-wide">
          {tenant?.name}
        </p>
        <p className="uppercase text-[25px] font-bold tracking-wide">
          SIGNED, SEALED, AND DELIVERED by the within-named Landlord/landlady
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-1">
        <p>
          -----------------------------------------------------------------------------
        </p>
        <p className="uppercase text-[25px] font-bold tracking-wide">
          {landlord?.name}
        </p>
      </div>

      <div className="presence mt-[50px]">
        <h2 className="uppercase text-[25px] font-bold tracking-wide mb-4">
          Witness By his lawful Attorney
        </h2>
        <Signature noTitle />
      </div>

      <div className="preparedby w-full flex flex-col items-center justify-center">
        <div className="lawyersignature w-20 h-20">
          <Image
            alt="lawyer signature"
            src={lawFirm.sealSrc || empty}
            width={100}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col items-center mt-4 gap-1">
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
