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

export const Parties: React.FC<PartiesProps> = ({ landlord, tenant }) => (
  <div className="flex flex-col items-center justify-center">
    <h2 className="text-[64px] font-semibold"> TENANCY AGREEMENT </h2>
    <h2 className="text-[28px] font-normal uppercase"> between </h2>
    <p className="text-[40px] uppercase font-semibold">{landlord}</p>
    <span className="text-sm capitalize">(landlord/landlady)</span>
    <p className="text-[20px] text-base uppercase mt-6 mb-8"> and </p>
    <p className="text-[40px] uppercase font-semibold">{tenant}</p>
    <span className="text-sm capitalize">(Tenant)</span>
  </div>
);

// Component for property description
export const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description,
}) => (
  <div className="flex items-start justify-center mt-8">
    <p className="uppercase text-center tracking-wide font-normal text-[20px]">
      {description}
    </p>
  </div>
);

// Component for attorney information
export const AttorneyInfo: React.FC<AttorneyInfoProps> = ({ attorney }) => (
  <div className="attorney flex justify-between mt-4">
    <p className="text-[20px] uppercase font-normal">
      Through his lawful Attorney
    </p>
    <p className="text-[20px] font-normal uppercase">{attorney}</p>
  </div>
);

// Component for law firm details with logo and contact info
export const LawFirmInfo: React.FC<LawFirmInfoProps> = ({ lawFirm }) => (
  <div className="flex items-start justify-between mt-10">
    <i>Prepared by:</i>
    <div className="wrapper">
      <div className="logo w-[430px] h-[105px] bg-white shadow-md rounded-md">
        <Image
          alt="lawyer-logo"
          src={lawFirm.logoSrc}
          width={100}
          height={100}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col items-center mt-4 gap-1">
        {lawFirm.contactDetails.map((detail, index) => (
          <p key={index} className={detail.className}>
            {detail.text}
          </p>
        ))}
      </div>
    </div>
    <div className="seal custom-secondary-bg w-[100px] h-[100px] rounded-full">
      <Image
        alt="seal"
        src={lawFirm.sealSrc}
        width={100}
        height={100}
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
  <div className="flex flex-col items-start my-6">
    <p>
      <strong>THIS TENANCY AGREEMENT</strong> made this {date}
    </p>
    <p className="mt-4">
      <span className="uppercase">{landlord.name} </span>
      <span>
        of {landlord.address} (hereinafter referred to as the “LANDLORD” which
        expression shall where the context so admits includes his heirs
        successors-in-title, representatives and assigns) of the one part.
      </span>
    </p>
    <p className="uppercase my-4">AND</p>
    <p>
      <span>
        {tenant.name}
        <span>
          of {tenant.address} (hereinafter referred to as the “TENANT” which
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
    <div className="absolute left-0 font-bold before:content-[counter(item)'.']"></div>
    <p className="uppercase font-bold">{title}</p>
    {content && <p>{content}</p>}
    {subClauses && subClauses.length > 0 && (
      <ol className="list-none pl-4 mt-2" style={{ counterReset: "subitem" }}>
        {subClauses.map((subClause, index) => (
          <li
            key={index}
            className="relative pl-8 mb-2"
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

// component for witness
// export const WitnessSignatureDate = ({
//     lawfirm
// }) => {
//   return (
//     <div>
//       <div className="flex flex-col items-start">
//         <h3 className="uppercase text-[20px] font-bold tracking-wide">
//           IN WITNESS WHEREOF, THE PARTIES HAVE HERE UNTO SET THEIR HANDS AND
//           SEALS THE DAY AND YEAR FIRST ABOVE WRITTEN.{" "}
//         </h3>
//         <p className="uppercase text-[20px] font-bold tracking-wide">
//           {" "}
//           SIGNED SEALED BY THE WITHIN NAMED LANDLORD{" "}
//         </p>
//       </div>
//       <div className="mt-6 flex flex-col gap-1">
//         <p>
//           -----------------------------------------------------------------------------
//         </p>
//         <p className="uppercase text-[20px] font-bold tracking-wide">
//           ADEBAYO OLUSOJI OKELARIN
//         </p>
//         <p className="uppercase text-[20px] font-bold tracking-wide">
//           SIGNED SEALED BY THE WITHIN NAMED TENANT
//         </p>
//       </div>

//       <div className="mt-6 flex flex-col gap-1">
//         <p>
//           -----------------------------------------------------------------------------
//         </p>
//         <p className="uppercase text-[20px] font-bold tracking-wide">
//           ADEGBOYEGA IBUKUN
//         </p>
//       </div>

//       <div className="presence mt-10">
//         <h2 className="uppercase text-[20px] font-normal tracking-wide mb-4">
//           {" "}
//           IN THE PRESENCE OF:
//         </h2>
//         <div className="flex gap-2">
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             NAME:{" "}
//           </p>
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             MUBARAK ABDULRAFIU I{" "}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             ADDRESS:{" "}
//           </p>
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             12, KOLA sanusi street{" "}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             OCCUPATION:{" "}
//           </p>
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             software engineer{" "}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             SIGNATURE:{" "}
//           </p>
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             ---------------------------------{" "}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             DATE:{" "}
//           </p>
//           <p className="uppercase text-[20px] font-normal tracking-wide">
//             {" "}
//             12/02/2025{" "}
//           </p>
//         </div>
//       </div>

//       <div className="preparedby w-full flex items-center justify-center">
//         <div className="lawyersignature w-10 h-10">
//           <Image
//             alt="lawyer signature"
//             src={empty}
//             width={100}
//             height={100}
//             className="w-full h-full object-contain"
//           />
//         </div>
//         <div className="flex flex-col items-center mt-4 gap-1">
//           {lawFirm.contactDetails.map((detail, index) => (
//             <p key={index} className={detail.className}>
//               {detail.text}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

export const WitnessSignatureDate: React.FC<WitnessSignatureDateProps> = ({
  landlord,
  tenant,
  witness,
  lawFirm,
}) => {
  return (
    <div>
      <div className="flex flex-col items-start">
        <h3 className="uppercase text-[20px] font-bold tracking-wide">
          IN WITNESS WHEREOF, THE PARTIES HAVE HERE UNTO SET THEIR HANDS AND
          SEALS THE DAY AND YEAR FIRST ABOVE WRITTEN.
        </h3>
        <p className="uppercase text-[20px] font-bold tracking-wide">
          SIGNED SEALED BY THE WITHIN NAMED LANDLORD
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-1">
        <p>
          -----------------------------------------------------------------------------
        </p>
        <p className="uppercase text-[20px] font-bold tracking-wide">
          {landlord.name}
        </p>
        <p className="uppercase text-[20px] font-bold tracking-wide">
          SIGNED SEALED BY THE WITHIN NAMED TENANT
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-1">
        <p>
          -----------------------------------------------------------------------------
        </p>
        <p className="uppercase text-[20px] font-bold tracking-wide">
          {tenant.name}
        </p>
      </div>

      <div className="presence mt-10">
        <h2 className="uppercase text-[20px] font-normal tracking-wide mb-4">
          IN THE PRESENCE OF:
        </h2>
        <div className="flex gap-2">
          <p className="uppercase text-[20px] font-normal tracking-wide">
            NAME:
          </p>
          <p className="uppercase text-[20px] font-normal tracking-wide">
            {witness.name}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="uppercase text-[20px] font-normal tracking-wide">
            ADDRESS:
          </p>
          <p className="uppercase text-[20px] font-normal tracking-wide">
            {witness.address}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="uppercase text-[20px] font-normal tracking-wide">
            OCCUPATION:
          </p>
          <p className="uppercase text-[20px] font-normal tracking-wide">
            {witness.occupation}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="uppercase text-[20px] font-normal tracking-wide">
            SIGNATURE:
          </p>
          <p className="uppercase text-[20px] font-normal tracking-wide">
            ---------------------------------
          </p>
        </div>
        <div className="flex gap-2">
          <p className="uppercase text-[20px] font-normal tracking-wide">
            DATE:
          </p>
          <p className="uppercase text-[20px] font-normal tracking-wide">
            {witness.date}
          </p>
        </div>
      </div>

      <div className="preparedby w-full flex flex-col items-center justify-center">
        <div className="lawyersignature w-10 h-10">
          <Image
            alt="lawyer signature"
            src={empty}
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
