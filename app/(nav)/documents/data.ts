import api, { handleAxiosError } from "@/services/api";

// /property-document
export const createPropertyDocument = async (data: FormData) => {
  try {
    const res = await api.post("/property-document", data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// /property-document/1
export const updatePropertyDocument = async (id: number, data: FormData) => {
  try {
    const res = await api.post(`/property-document/${id}`, data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const DocumentssFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "Branch1" },
      { label: "Branch 2", value: "Branch2" },
      { label: "Branch 3", value: "Branch3" },
    ],
  },
];

export const AGREEMENT_OPTIONS = [
  {
    title: "Tenancy Agreement",
    value: "tenancy_agreement",
    description:
      "A tenancy agreement is a legally binding contract between a landlord and tenant that specifies the terms and conditions for renting or leasing a property. It clearly sets expectations for both parties, helping to prevent disputes by outlining their rights and responsibilities.",
  },
  {
    title: "Other Document",
    value: "other_document",
    description:
      "These are the additional legal procedures that govern tenants and occupants, aside from the ones listed above.",
  },
  {
    title: "Quit Notice",
    value: "quit_notice",
    description:
      "A Quit Notice serves to formally inform tenants that their tenancy is ending and is issued by landlords to instruct tenants to vacate the rented premises by a specific date. It is typically issued when tenants breach the terms of the lease, such as by late rent payments, property damage, or involvement in illegal activities.",
  },
  {
    title: "Warning/Reminder",
    value: "warning_reminder",
    description:
      "A warning or reminder is a form of communication designed to notify tenants or occupants about a specific issue, action, or situation. Its purpose is to draw attention to important matters that may necessitate action or careful consideration.",
  },
  {
    title: "Court Process",
    value: "court_process",
    description:
      "The court process refers to the series of legal procedures and steps followed within a court system to resolve disputes or address legal matters. This process typically involves several stages, including filing of documents, hearings, evidence presentation, legal arguments, and ultimately a decision by a judge or jury.",
  },
  {
    title: "Possession",
    value: "possession",
    description:
      "A Quit Notice serves to formally inform tenants that their tenancy is ending and is issued by landlords to instruct tenants to vacate the rented premises by a specific date. It is typically issued when tenants breach the terms of the lease, such as by late rent payments, property damage, or involvement in illegal activities.",
  },
];

export const OTHER_DOCUMENTS_OPTIONS = [
  {
    title: "Tenancy Application Form",
    value: "tenancy_application_form",
    description:
      "Collect key information from prospective tenants, including personal details, rental history, employment, and references streamlining the tenant screening and approval process.",
  },
  {
    title: "Management Application Form",
    value: "management_application_form",
    description:
      "Used to gather detailed information from property owners or landlords seeking professional management services, ensures accurate onboarding and efficient property oversight.",
  },
];
