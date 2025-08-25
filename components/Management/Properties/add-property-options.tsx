import {
  getRentalPropertyCreatePath,
  getFacilityPropertyCreatePath,
  getOutrightSalesPropertyCreatePath,
  getInstallmentSalesPropertyCreatePath,
} from "@/app/(onboarding)/auth/data";
import AddPropertyCard from "../add-landlord-or-tenant-card";
import { AddPropertyOptionsViewProps } from "./types";
import Cookies from "js-cookie";
import { useRole } from "@/hooks/roleContext";
import { useModule } from "@/contexts/moduleContext";

const AddPropertyOptionsView: React.FC<AddPropertyOptionsViewProps> = ({
  setModalView,
  id,
}) => {
  const { role, setRole } = useRole();
  const { activeModule, designVariant } = useModule();
  const rental_path = getRentalPropertyCreatePath(role, id);
  const facility_path = getFacilityPropertyCreatePath(role, id);
  const outright_path = getOutrightSalesPropertyCreatePath(role, id);
  const installment_path = getInstallmentSalesPropertyCreatePath(role, id);

  return (
    <div className="add-property-options flex items-center justify-center gap-7 md:gap-14 w-full overflow-hidden">
      {activeModule.id === "property_developer" ? (
        <div className="flex w-full gap-2 overflow-x-auto custom-round-scrollbar scrollbar-hide">
          <AddPropertyCard
            buttonText="create"
            title="Outright Sales"
            buttonHref={outright_path}
            desc="Are you looking to add a property for sale for an outright purchase?"
          />
          <AddPropertyCard
            buttonText="create"
            title="Installment Sales"
            buttonHref={installment_path}
            desc="Are you selling a property that allows payment to be spread over a specific period?"
          />
          <AddPropertyCard
            buttonText="Add"
            title="Joint Sales/Referral"
            onClick={() => setModalView("add-property-with-id")}
            desc="Would you like to collaborate with another company or marketer for a joint property sale?"
          />
        </div>
      ) : (
        <div className="flex w-full gap-2 overflow-x-auto custom-round-scrollbar scrollbar-hide">
          <AddPropertyCard
            buttonText="create"
            title="Add Rental Property"
            buttonHref={rental_path}
            desc="Are you looking to add a single standalone property for rent?"
          />
          <AddPropertyCard
            buttonText="choose"
            title="Add Facility Property"
            buttonHref={facility_path}
            desc="Are you managing an entire estate, facilities, or a gated community?"
          />
          <AddPropertyCard
            buttonText="Add"
            title="Add With ID"
            onClick={() => setModalView("add-property-with-id")}
            desc="Are you receiving the transfer of property from another company to manage?"
          />
        </div>
      )}
    </div>
  );
};

export default AddPropertyOptionsView;
