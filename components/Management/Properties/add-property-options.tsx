import {
  getRentalPropertyCreatePath,
  getFacilityPropertyCreatePath,
} from "@/app/(onboarding)/auth/data";
import AddPropertyCard from "../add-landlord-or-tenant-card";
import { AddPropertyOptionsViewProps } from "./types";
import Cookies from "js-cookie";
import { useRole } from "@/hooks/roleContext";

const AddPropertyOptionsView: React.FC<AddPropertyOptionsViewProps> = ({
  setModalView,
  id,
}) => {
  const { role, setRole } = useRole();
  const rental_path = getRentalPropertyCreatePath(role, id);
  const facility_path = getFacilityPropertyCreatePath(role, id);
  return (
    <div className="add-property-options flex items-center justify-center gap-7 md:gap-14 w-full overflow-hidden">
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
    </div>
  );
};

export default AddPropertyOptionsView;
