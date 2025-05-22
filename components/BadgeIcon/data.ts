// export const transformDocumentsResponse = (
//   response: DocumentsAPIResponse
// ): CheckboxOption[] => {
//   // Transform the API response
//   const transformedDocs = response.document.map((doc) => ({
//     title: doc.type,
//     id: doc.document_id,
//     summary: "",
//     section: "",
//     value: doc.type.toLowerCase().replace(/\s+/g, "_"),
//     amount: doc.amount ?? 0, // Default to 0 if amount is missing
//     description: doc.category, // Assuming category is a suitable description
//   }));

//   // Ensure "Tenancy Agreement" is first and prepend "(Free)" to its title
//   return transformedDocs.sort((a, b) => {
//     if (a.title.toLowerCase() === "tenancy agreement") return -1;
//     if (b.title.toLowerCase() === "tenancy agreement") return 1;
//     return 0;
//   }).map((doc) => ({
//     ...doc,
//     title: doc.title.toLowerCase() === "tenancy agreement" ? `${doc.title}` : doc.title,
//   }));
// };

export const transformDocumentsResponse = (
  response: DocumentsAPIResponse,
  selectedAgreementType: string
): CheckboxOption[] => {
  // Map AGREEMENT_OPTIONS value to API document type
  const agreementTypeMap: { [key: string]: string } = {
    tenancy_agreement: "Tenancy Agreement",
    quit_notice: "Quit notice",
    warning_reminder: "Warning/Reminder",
    court_process: "Court Process",
    possession: "Possession",
    other_legal: "Other Document",
  };

  const selectedType =
    agreementTypeMap[selectedAgreementType] || selectedAgreementType;

  // Filter and transform the API response
  const transformedDocs = response.document
    .filter((doc) => doc.type === selectedType) 
    .map((doc) => ({
      title: doc.type,
      id: doc.document_id,
      summary: doc.articles[0]?.summary || "", 
      section: doc.articles[0]?.section || "", 
      value: doc.document_id.toString(),
      amount: doc.amount ?? 0,
      description: doc.category, 
    }));

  // Ensure "Tenancy Agreement" is first and prepend "(Free)" to its title
  return transformedDocs
    .sort((a, b) => {
      if (a.title.toLowerCase() === "tenancy agreement") return -1;
      if (b.title.toLowerCase() === "tenancy agreement") return 1;
      return 0;
    })
    .map((doc) => ({
      ...doc,
      title:
        doc.title.toLowerCase() === "tenancy agreement"
          ? `${doc.title}`
          : doc.title,
    }));
};

export const checkboxOptions = [
  {
    title: "Tenancy Agreement",
    value: "tenancy_agreement",
    amount: 0,
    description:
      "A tenancy agreement is a legally binding contract between a landlord and tenant that specifies the terms and conditions for renting or leasing a property. It clearly sets expectations for both parties, helping to prevent disputes by outlining their rights and responsibilities.",
  },
  {
    title: "Quit Notice ₦5,000",
    amount: 5000,
    value: "quit_notice",
    description:
      "A Quit Notice serves to formally inform tenants that their tenancy is ending and is issued by landlords to instruct tenants to vacate the rented premises by a specific date. It is typically issued when tenants breach the terms of the lease, such as by late rent payments, property damage, or involvement in illegal activities.",
  },
  {
    title: "Warning/Reminder ₦5,000",
    value: "warning_reminder",
    amount: 5000,
    description:
      "A warning or reminder is a form of communication designed to notify tenants or occupants about a specific issue, action, or situation. Its purpose is to draw attention to important matters that may necessitate action or careful consideration.",
  },
  {
    title: "Court Process ₦15,000",
    value: "court_process",
    amount: 15000,
    description:
      "The court process refers to the series of legal procedures and steps followed within a court system to resolve disputes or address legal matters. This process typically involves several stages, including filing of documents, hearings, evidence presentation, legal arguments, and ultimately a decision by a judge or jury.",
  },
  {
    title: "Possession ₦10,000",
    value: "possession",
    amount: 15000,
    description:
      "A Quit Notice serves to formally inform tenants that their tenancy is ending and is issued by landlords to instruct tenants to vacate the rented premises by a specific date. It is typically issued when tenants breach the terms of the lease, such as by late rent payments, property damage, or involvement in illegal activities.",
  },
  {
    title: "Other Legal Processes ₦10,000",
    value: "other_legal",
    amount: 10000,
    description:
      "These are the additional legal procedures that govern tenants and occupants, aside from the ones listed above.",
  },
];
