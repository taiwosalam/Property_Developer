import { empty } from "@/app/config";
import { ClauseData, LawFirm, Party } from "./types";

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
  witness: Witness;
  lawFirm: WitnessLawFirm;
}

export interface WitnessLawFirm {
  contactDetails: Array<{ text: string; className: string }>;
}

export const witnessLandlord: WitnessParty = {
  name: "ADEBAYO OLUSOJI OKELARIN",
  address: "No.12, Kudeti Street, Off Adeniyi Jones Avenue, Ikeja Lagos State.",
};

export const witnessTenant: WitnessParty = {
  name: "ADEGBOYEGA IBUKUN",
  address: "No 4, Salawu Area, Bodija, Ibadan",
};

export const witness: Witness = {
  name: "MUBARAK ABDULRAFIU I",
  address: "12, KOLA sanusi street",
  occupation: "software engineer",
  date: "12/02/2025",
};

export const witnessLawFirm: WitnessLawFirm = {
  contactDetails: [
    { text: "T. ‘DAYO OYEWUMI ESQ.", className: "uppercase text-[30px] font-bold" },
    { text: "WELLSPRING LAW FIRM", className: "uppercase text-[30px] font-bold" },
    { text: "SUITE 2A, TINU OKETAYO PLAZA", className: "text-[16px] font-bold" },
    { text: "MOLETE-OKE ADO ROAD,", className: "text-[16px] uppercase font-bold" },
    { text: "IBADAN, OYO STATE", className: "text-[16px] font-bold" },
    { text: "wellspringlawfirm@gmail.com", className: "text-[16px] font-semibold underline italic" },
    { text: "08102397035/09053349137 ", className: "text-[16px] font-bold" },
  ],
};
