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
    content?: string; // Optional
    subClauses?: string[]; // Optional
}

export interface ClauseProps extends ClauseData {}

export interface ClauseListProps {
    clauses: ClauseData[];
}


// export interface WitnessSignatureDateProps {
//     landlord: Party;
//     tenant: Party;
//     witness: Witness;
//     lawFirm: LawFirm;
//   }