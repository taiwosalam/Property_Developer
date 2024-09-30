import React from "react";

// Imports
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";

const DocumentTenancyAgreements = () => {
  return (
    <div className="grid grid-cols-2 gap-10">
      <DocumentCheckbox title="guarantor">
        Does the Landlord/Landlady require the tenant to provide a guarantor?
      </DocumentCheckbox>
      <DocumentCheckbox title="Sublease ">
        Are tenants allowed to sublet a portion of the property to other
        tenants?
      </DocumentCheckbox>
      <DocumentCheckbox title="Rental Renewal">
        Does the tenant have the option to renew the tenancy for an additional
        term?
      </DocumentCheckbox>
      <DocumentCheckbox title="Rent Modification">
        Does the Landlord/Landlady have the authority to review the rent amount?
      </DocumentCheckbox>
      <DocumentCheckbox title="Parking Slot">
        Will there be designated parking spaces for the tenant?
      </DocumentCheckbox>
      <DocumentCheckbox title="Structural modification">
        Is the tenant prohibited from making structural modifications?
      </DocumentCheckbox>
      <DocumentCheckbox title="Pets Approver">
        Will the tenant be restricted from having pets in the property?
      </DocumentCheckbox>
      <DocumentCheckbox title="Rent Penalty">
        Is there a penalty for late renewal payment by the tenant?
      </DocumentCheckbox>
      <DocumentCheckbox title="Caution Fee">
        Will caution fee typically be reflected in the rental agreement
      </DocumentCheckbox>
      <DocumentCheckbox title="Landlord/Landlady Covenants">
        Is owner consent or covenants required?
      </DocumentCheckbox>
      <DocumentCheckbox title="Tenants/Occupant Covenants">
        Is Tenants consent or covenants required?
      </DocumentCheckbox>
      <DocumentCheckbox title="Bill/Service Charge">
        Are there going to be terms established for utility?
      </DocumentCheckbox>
      <DocumentCheckbox title="Dispute Resolutions Mechanism">
        Is there a content resolution available for the tenants?
      </DocumentCheckbox>
      <DocumentCheckbox title="Management Covenants">
        Is Management consent or covenants required?
      </DocumentCheckbox>
      <DocumentCheckbox title="Cleaning/Maintenance">
        Are there going to be sanitation terms established?
      </DocumentCheckbox>
    </div>
  );
};

export default DocumentTenancyAgreements;
