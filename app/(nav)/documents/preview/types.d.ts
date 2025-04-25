import { WitnessLawFirm } from "./data";

export interface PartiesProps {
  landlord: string;
  tenant: string;
}

export interface PropertyDescriptionProps {
  description: string;
}

export interface AttorneyInfoProps {
  attorney: string;
}

export interface ContactDetail {
  text: string;
  className: string;
}

export interface LawFirm {
  logoSrc: string;
  contactDetails: ContactDetail[];
  sealSrc: string;
}

export interface LawFirmInfoProps {
  lawFirm: LawFirm;
}

export interface Party {
  name: string;
  address: string;
}

export interface AttestationProps {
  date: string;
  landlord: Party;
  tenant: Party;
}

export interface ClauseData {
  title: string;
  content?: string;
  subClauses?: string[];
}

export interface ClauseProps extends ClauseData {}

export interface ClauseListProps {
  clauses: ClauseData[];
}

export interface DocumentPreviewData {
  parties: {
    landlord: string;
    tenant: string;
  };
  propertyDescription: string;
  attorney: string;
  lawFirm: LawFirm;
  attestation: {
    date: string;
    landlord: Party;
    tenant: Party;
  };
  witnessLawFirm: WitnessLawFirm;
  clauses: ClauseData[];
}
