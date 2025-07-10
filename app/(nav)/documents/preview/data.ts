import { empty } from "@/app/config";
import { ClauseData, DocumentPreviewData, LawFirm, Party } from "./types";
import { formatFee, Occupant } from "../../management/rent-unit/data";
import { TenantData } from "@/components/Management/Rent And Unit/types";
import { transformUnitDetails } from "../../listing/data";
import dayjs from "dayjs";

export const landlord: Party = {
  name: "ADEBAYO OLUSOJI OKELARIN",
  address: "No.12, Kudeti Street, Off Adeniyi Jones Avenue, Ikeja Lagos State.",
};

export const tenant: Party = {
  name: "ADEGBOYEGA IBUKUN",
  address: "No 4, Salawu Area, Bodija, Ibadan",
};

export const propertyDescription: string =
  "in respect of a two (2) bedroom bungalow in a compound with a 4 flats of 3 bedroom situate at major salawu area, bodija ibadan";

export const attorney: string =
  "Mr. Agunbiade David of No 4, Salawu Area, Bodija, Ibadan";

export const lawFirm: LawFirm = {
  logoSrc: "/empty/logo-placeholder.svg",
  contactDetails: [
    {
      text: "T. dayo oyewumi esd,",
      className: "uppercase font-normal text-[30px]",
    },
    {
      text: "wellspring law firm,",
      className: "uppercase font-normal text-[30px]",
    },
    {
      text: "a30/31, mokola estate,",
      className: "uppercase font-normal text-[30px]",
    },
    {
      text: "behind veterinary hospital,",
      className: "uppercase font-normal text-[30px]",
    },
    {
      text: "mokola, ibadan, oyo state,",
      className: "uppercase font-normal text-[30px]",
    },
    {
      text: "wellspringlawfirm@gmail.com",
      className: "lowercase font-normal text-[30px] underline",
    },
    {
      text: "081038347346/09034316361",
      className: "uppercase font-normal text-[30px]",
    },
  ],
  sealSrc: empty,
};

export const date: string = "24th day of November, 2025";

export const clauses: ClauseData[] = [
  {
    title: "whereas",
    content:
      "The legal title to the Five (5) Bedroom Duplex Apartment and its appurtenances being at Bodija Estate, New Bodija, Ibadan, Oyo State inures in favor of and belongs to the Landlord.",
    subClauses: [
      "The Tenant is desirous of renting the said premises for Short-let Services, Hospitality and Residential Purposes.",
      "At the request of tenant, the Landlord has agreed to let the Premises for the above Purposes on the terms herein set-out.",
      "The Premises which is the subject matter of this Agreement is free from all encumbrances.",
    ],
  },
  {
    title: "NOW THIS AGREEMENT WITNESSES AS FOLLOWS",
    subClauses: [
      "The Landlord hereby lets to the Tenant and the Tenant hereby accepts to let the <b>Five (5) Bedroom Duplex Apartment</b> and its appurtenances being <b>at Bodija Estate, New Bodija, Ibadan, Oyo State</b> paying the sum of <b>N10,000, 000.00 (Ten Million Naira)</b> only as Rent, the receipt of which the Landlord hereby acknowledges.",
      "The tenancy hereby created is for a term of 2 (Two) years certain and definite, commencing from the <b>27th day of February, 2025 and shall terminate on the 26th day of February 2027</b>",
    ],
  },
  {
    title: "THE LANDLORD HEREBY CONVENANTS:",
    subClauses: [
      "To keep the Premises structurally sound and suitable for <b>residential</b> purposes with the exteriors of the Premises and all fixtures thereto in good and tenantable condition.",
      "To provide Solar Energy for the tenant if she desires to consume same at her own expense.",
      "In the event of the Premises or any part thereof being damaged or destroyed not by the doing of the tenant but by fire, tornado, earthquake or act of god, the landlord shall reinstate same at his expense.",
      "That the Tenant having paid the rent, the Landlord hereby covenants to keep observing and performing the several covenants and stipulations herein on his part, and to grant the Tenant quiet enjoyment without any interruption by herself, her agents or persons lawfully claiming through or under her.",
    ],
  },
  {
    title: "THE TENANT HEREBY COVENANTS:",
    subClauses: [
      "To use the Premises for residential purposes only.",
      "To pay for water, waste, electricity and other bills in the Premises.",
      "To bear, pay and discharge all local administration rates imposed or charged upon the owner of the Premises as may be applicable to it.",
      "To neither Change nor alter the existing paintings on the walls of the entire property by either changing the colours or fixating wallpapers or any other permanent alterations of the aesthetics, he may however improve on same while maintaining the existing colours.",
      "To neither liter the compound with luggage, spare parts, shaven or any debris, whatsoever; to not dry clothes on the walls or rails; and to not tamper or cause any person to tamper with the wiring system, solar cables or plumbing system.",
      "To not attach any nails on the walls, pound on any floor other than the ground floor, smoke or burn any form of materials or even make fire within the premises.",
      "To pay a of <b>N500,000.00 (Five Hundred Thousand Naira) only</b> Caution fee, Refundable on the termination of tenancy, subject to the absence of any damage within the apartment.",
      "To not accommodate or harbor any visitor with patent Criminal Records or tendency and all reasonable suspicion must be promptly reported to the appropriate law enforcement agency.",
      "To keep the interior of the Premises and fixtures and fittings therein in good and tenantable condition, reasonable wear and tear or damage by fire (not willfully or negligently caused or act of God generally exempted).",
      "Not to make or permit to be made any structural alterations or construction work within the Premises without the written consent of the Landlord sought for and obtained.",
      "Not to use part or the entire Premises for any illegal purposes or illegal businesses whatsoever; to forbid any loud music, partying or any form of Nuisance whatsoever within the premises",
      "To keep the premises, drainage, surroundings, tiles, floors and its appurtenances clear of all dirt and liters at all time.",
      "Not to assign, sublet or otherwise part with the Premises permanently to any third party without the prior written permission of the Landlord first obtained.",
      "On the expiration of the tenancy to yield up immediately to the Landlord, the Premises and fixtures and fitting in good and tenantable condition.",
      "To permit the Landlord or their authorized agent every once in three (3) months, during the day subject to adequate notice given by the Landlord, to enter the Premises to view the state of repair and or to effect repair, if necessary.",
      "To within 7 days repair all damages discovered within the apartment at his own expense.",
      "The Current Rent shall be subject to upward review upon the termination of this tenure, which is a period of Two (2) years and shall be between 10% and 30% increment depending on the prevalent inflation rate or any other amount as may be agreed upon in the course of review.",
      "The Tenant hereby acknowledges and confirms that he is fully informed of all the conditions to this agreement and agrees to be totally bound by them.",
    ],
  },
  {
    title: "PROVIDED ALWAYS AND IT IS HEREBY AGREED AS FOLLOWS:",
    subClauses: [
      "Where the Tenant is desirous of occupying the Premises let pursuant to this Agreement for a further term, he shall, 2 (two) months before the expiration of the term herein created, give to the Landlord a notice in writing of his desire to have a further term.",
      "On receipt of the notice given by the Tenant pursuant to the paragraph above if the proposal is agreeable to the Landlord, a meeting of both parties shall be held for the purpose of determining the new terms and fresh Tenancy agreement evidencing the agreed new terms executed.",
      "Where the Tenant is not interested in having a new term or where the desire for a fresh term by the Tenant is not acceptable to the Landlord, the Tenant shall vacate the Premises upon the expiration of his tenancy at the material time.",
      "Within a period of 7 (Seven) days following the vacation of the Premises by the Tenant, a joint inspection of the Premises shall be held by both Parties 4 with a view to determining the repairs that shall be effected in the Premises by the Tenant.",
      "The Tenant shall within 14 (Fourteen) days commencing from the date of the joint inspection effect the repairs determined to be required",
      "Where the Tenant fails or refuses to take part in the joint inspection or fails to carry out the agreed repairs within the period stipulated in paragraph 5.4 and 5.5 above.",
      "Parties understand and hereby record that the covenants hereinabove stated are of the essence, and the Tenant hereby agrees that in the event of a breach of any of the said covenants, the Landlord shall have the right to immediately re-enter the Premises and take possession of same without further recourse.",
      "Upon an agreement with the Landlord, the Tenant is hereby permitted to use the property as a Short-let apartment subject to paragraph 4.13 above.",
    ],
  },
  {
    title: "DISPUTE RESOLUTION MECHANISM:",
    subClauses: [
      "Any dispute or difference between the parties concerning the interpretation or validity of this agreement or the rights and liabilities if any of the parties shall in the first instance be referred to a sole arbitrator under the auspices of the Oyo State Multi-door Court house, under the applicable arbitration rules.",
      "The proceedings of the arbitral tribunal shall be conducted in English Language.",
      "The award of the arbitrator shall be final and binding upon the parties.",
    ],
  },
];

export interface WitnessParty {
  name: string;
  address: string;
  signature?: string;
}

export interface Witness {
  name: string;
  address: string;
  occupation: string;
  date: string;
}

export interface WitnessSignatureDateProps {
  landlord: WitnessParty;
  tenant: WitnessParty;
  witness?: Witness;
  lawFirm: LawFirm;
  lawOfficeData?: LawFirm;
}

export interface WitnessLawFirm {
  contactDetails: Array<{ text: string; className: string }>;
}

// export const witnessLandlord: WitnessParty = {
//   name: "ADEBAYO OLUSOJI OKELARIN",
//   address: "No.12, Kudeti Street, Off Adeniyi Jones Avenue, Ikeja Lagos State.",
// };

// export const witnessTenant: WitnessParty = {
//   name: "ADEGBOYEGA IBUKUN",
//   address: "No 4, Salawu Area, Bodija, Ibadan",
// };

export const witness: Witness = {
  name: "MUBARAK ABDULRAFIU I",
  address: "12, KOLA sanusi street",
  occupation: "software engineer",
  date: "12/02/2025",
};

export const witnessLawFirm: WitnessLawFirm = {
  contactDetails: [
    {
      text: "T. ‘DAYO OYEWUMI ESQ.",
      className: "uppercase text-[30px] font-bold",
    },
    {
      text: "WELLSPRING LAW FIRM",
      className: "uppercase text-[30px] font-bold",
    },
    {
      text: "SUITE 2A, TINU OKETAYO PLAZA",
      className: "text-[16px] font-bold",
    },
    {
      text: "MOLETE-OKE ADO ROAD,",
      className: "text-[16px] uppercase font-bold",
    },
    { text: "IBADAN, OYO STATE", className: "text-[16px] font-bold" },
    {
      text: "wellspringlawfirm@gmail.com",
      className: "text-[16px] font-semibold underline italic",
    },
    { text: "08102397035/09053349137 ", className: "text-[16px] font-bold" },
  ],
};

// // ============ API INTEGRATION FOR DOCUMENT PREVIEW ================
// Helper to strip HTML tags and format fees in content
const formatContent = (content: string, currency: string): string => {
  const feeMatch = content.match(/N([\d,.]+)/);
  if (feeMatch && feeMatch[1]) {
    const amount = feeMatch[1].replace(/,/g, "");
    const formattedFee = formatFee(amount, currency);
    if (formattedFee) {
      return content.replace(feeMatch[0], formattedFee);
    }
  }
  return content.replace(/<[^>]+>/g, "");
};

// 1. Transform Parties (Landlord and Tenant Names)
const transformParties = (
  document: any,
  selectedOccupant?: Occupant
): DocumentPreviewData["parties"] => {
  const landlordName =
    // document.landlord_name ||
    document.property?.landlord?.profile?.name || "--- ---";
  const tenantName = selectedOccupant?.name || "--- ---";
  return { landlord: landlordName, tenant: tenantName };
};

// 2. Transform Property Description
const transformPropertyDescription = (unitData: any, property: any): string => {
  const details = transformUnitDetails(unitData);
  return `in respect of ${details || "--- ---"} situate at ${
    unitData?.address || property.full_address || "--- ---"
  }, ${unitData?.city_area || property.city_area || "--- ---"}, ${
    unitData?.local_government || property.local_government || "--- ---"
  }, ${unitData?.state || property.state || "--- ---"}`;
};

// 3. Transform Attorney
const transformAttorney = (templateDocument: any): string => {
  return templateDocument.lawyer_fullname || "--- ---";
};

// 4. Transform Law Firm
const transformLawFirm = (
  templateDocument: any
): DocumentPreviewData["lawFirm"] => {
  return {
    logoSrc: templateDocument.lawyer_signature || "--- ---",
    contactDetails: [
      {
        text: templateDocument.lawyer_fullname || "--- ---",
        className: "text-[25px] font-bold uppercase text-center",
      },
      {
        text: templateDocument.lawyer_firm_name || "--- ---",
        className: "text-[25px] font-bold uppercase text-center",
      },
      {
        text: templateDocument.lawyer_office_address || "--- ---",
        className: "text-[20px] uppercase text-center",
      },
      {
        text: templateDocument.lawyer_email || "--- ---",
        className: "text-[20px] text-center",
      },
      {
        text: templateDocument.lawyer_phone_number || "--- ---",
        className: "text-[20px] text-center",
      },
    ],
    sealSrc: templateDocument.lawyer_legal_seal || "--- ---",
  };
};

// 5. Transform Witness Law Firm
const transformWitnessLawFirm = (
  templateDocument: any
): DocumentPreviewData["witnessLawFirm"] => {
  return {
    contactDetails: [
      {
        text: templateDocument.lawyer_fullname || "--- ---",
        className: "uppercase text-[30px] font-bold",
      },
      {
        text: templateDocument.lawyer_firm_name || "--- ---",
        className: "uppercase text-[30px] font-bold",
      },
      {
        text: templateDocument.lawyer_office_address || "--- ---",
        className: "text-[16px] font-bold",
      },
      {
        text: templateDocument.lawyer_email || "--- ---",
        className: "text-[16px] font-semibold underline italic",
      },
      {
        text: templateDocument.lawyer_phone_number || "--- ---",
        className: "text-[16px] font-bold",
      },
    ],
  };
};

// 6. Transform Attestation
const transformAttestation = (
  document: any,
  landlordName: string,
  tenantName: string,
  selectedOccupant?: Occupant,
  unitData?: any,
  property?: any,
  rentStartDate?: string
): DocumentPreviewData["attestation"] => {
  const date = rentStartDate || "--- ---";
  const landlord = {
    name: landlordName,
    address: `${document?.property?.landlord?.profile?.address || "--- ---"}, ${
      document?.property?.landlord?.profile?.lga || "--- ---"
    }, ${document?.property?.landlord?.profile?.city || "--- ---"}, ${
      document?.property?.landlord?.profile?.state || "--- ---"
    }`,
    signature: document?.property?.landlord?.signature,
  };
  const tenant = {
    name: tenantName,
    address: selectedOccupant?.address
      ? `${selectedOccupant.address || "--- ---"}, ${
          selectedOccupant.city || "--- ---"
        }, ${selectedOccupant.lg || "--- ---"}, ${
          selectedOccupant.state || "--- ---"
        }`
      : unitData?.address || "--- ---",
    signature: selectedOccupant?.tenant_signature,
  };
  return { date, landlord, tenant };
};

// 7. Transform Clauses
const transformClauses = (
  document: any,
  unitData: any,
  property: any,
  templateDocument: any,
  articles: any[],
  currency: string,
  chargePenalty: boolean,
  rentStartDate: string,
  rentEndDate: string
): ClauseData[] => {
  const showCaution = unitData?.caution_deposit?.toLowerCase() !== "none";
  // Group articles by section
  const unitDetails = transformUnitDetails(unitData) || unitData?.unit_name;
  const landlordArticles = articles
    .filter((article: any) => article.section?.trim() === "Landlord Consent")
    .map((article: any) => formatContent(article.content, currency));

  const tenantArticles = articles
    .filter((article: any) => article.section?.trim() === "Tenant Consent")
    .map((article: any) => formatContent(article.content, currency));

  const bothArticles = articles
    .filter((article: any) => article.section?.trim() === "Both Consent")
    .map((article: any) => formatContent(article.content, currency));

  const period = unitData?.fee_period || "";
  const penaltyPercentage = unitData?.rent_penalty_setting?.[period] || 0;

  // Construct clauses
  const clauses: ClauseData[] = [
    {
      title: "whereas",
      content: `The legal title to the ${
        unitDetails || "--- ---"
      } and its appurtenances being at ${
        unitData?.address || property.full_address || "--- ---"
      }, ${unitData?.city_area || property?.city_area || "--- ---"}, ${
        unitData?.local_government || property?.local_government || "--- ---"
      }, ${
        unitData?.state || property?.state || "--- ---"
      } inures in favor of and belongs to the Landlord.`,
      subClauses: [
        `The Tenant is desirous of renting the said premises for ${
          property.category || "--- ---"
        } Purposes.`,
        "At the request of tenant, the Landlord has agreed to let the Premises for the above Purposes on the terms herein set-out.",
        "The Premises which is the subject matter of this Agreement is free from all encumbrances.",
      ],
    },
    {
      title: "NOW THIS AGREEMENT WITNESSES AS FOLLOWS",
      subClauses: [
        `The Landlord hereby lets to the Tenant and the Tenant hereby accepts to let the <b>${
          unitDetails || "--- ---"
        }</b> and its appurtenances being <b>at ${
          unitData?.address || property?.full_address || "--- ---"
        }, ${unitData?.city_area || property?.city_area || "--- ---"}, ${
          unitData?.localGovernment || property?.local_government || "--- ---"
        }, ${
          unitData?.state || property.state || "--- ---"
        }</b> paying the sum of <b>${
          unitData?.newTenantPrice || formatFee("0", currency) || "--- ---"
        }</b> only as Rent, the receipt of which the Landlord hereby acknowledges.`,
        `The tenancy hereby created for a term of ${period} period certain and definite, commencing from the <b>${
          rentStartDate || "--- ---"
        }</b> and shall terminate on the <b>${rentEndDate || "--- ---"}.
        </b>`,
        ...(showCaution
          ? [
              `The Tenant shall, upon execution of this Agreement, pay a refundable caution deposit in the sum of ${
                unitData?.caution_fee || "--- ---"
              }, which shall be held in trust by the ${
                unitData?.caution_deposit || "--- ---"
              } as security against any loss, damage, or breach of the terms and conditions of this Tenancy Agreement. The said deposit shall be refundable, without interest, to the Tenant within thirty (30) days of the lawful termination or expiration of the tenancy, provided that the premises are vacated in good condition. Deductions may be made from the caution deposit for the cost of repairs, replacements, or other charges arising from any default by the Tenant.`,
            ]
          : []),
        ...(chargePenalty
          ? [
              `Failure to renew the rent on or before the agreed due date shall constitute a default under this Agreement. In such an event, the Tenant shall be liable to pay a penalty fee equivalent to (${
                penaltyPercentage || ""
              }%) of the ${
                period || "--- ---"
              } rent, which shall accrue until the outstanding rent is fully paid. This penalty is strictly enforceable, non-waivable, and shall be deemed an integral part of the financial obligations imposed on the Tenant under this Agreement.`,
            ]
          : []),
      ],
    },
    ...(landlordArticles.length > 0
      ? [
          {
            title: "THE LANDLORD HEREBY COVENANTS:",
            subClauses: landlordArticles,
          },
        ]
      : []),
    ...(tenantArticles.length > 0
      ? [
          {
            title: "THE TENANT HEREBY COVENANTS:",
            subClauses: tenantArticles,
          },
        ]
      : []),
    ...(bothArticles.length > 0
      ? [
          {
            title: "PROVIDED ALWAYS AND IT IS HEREBY AGREED AS FOLLOWS:",
            subClauses: bothArticles,
          },
        ]
      : []),
    {
      title: "DISPUTE RESOLUTION MECHANISM:",
      subClauses: [
        "Any dispute or difference between the parties concerning the interpretation or validity of this agreement or the rights and liabilities if any of the parties shall in the first instance be referred to a sole arbitrator under the auspices of the Oyo State Multi-door Court house, under the applicable arbitration rules.",
        "The proceedings of the arbitral tribunal shall be conducted in English Language.",
        "The award of the arbitrator shall be final and binding upon the parties.",
      ],
    },
  ];

  return clauses;
};

// Main Transform Function
export const transformDocumentData = (
  data: any,
  selectedOccupant?: Occupant,
  unitData?: any,
  rentStartDate?: string,
  rentEndDate?: string
): DocumentPreviewData => {
  const document = data?.document;
  const property = document?.property;
  const templateDocument = document?.document;
  const articles = document.articles || [];
  const currency = unitData?.currency || property?.currency || "naira";
  const chargePenalty = property.rent_penalty !== 0;

  const parties = transformParties(document, selectedOccupant);
  const propertyDescription = transformPropertyDescription(unitData, property);
  const attorney = transformAttorney(templateDocument);
  const lawFirm = transformLawFirm(templateDocument);
  const witnessLawFirm = transformWitnessLawFirm(templateDocument);
  const attestation = transformAttestation(
    document,
    parties.landlord,
    parties.tenant,
    selectedOccupant,
    unitData,
    property,
    rentStartDate
  );
  const clauses = transformClauses(
    document,
    unitData,
    property,
    templateDocument,
    articles,
    currency,
    chargePenalty,
    rentStartDate || "--- ---",
    rentEndDate || "--- ---"
  );

  return {
    parties,
    propertyDescription,
    attorney,
    lawFirm,
    witnessLawFirm,
    attestation,
    clauses,
  };
};
