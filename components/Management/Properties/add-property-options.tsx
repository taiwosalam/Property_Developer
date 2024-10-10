import AddPropertyCard from "../add-landlord-or-tenant-card";
import { AddPropertyOptionsViewProps } from "./types";

const AddPropertyOptionsView: React.FC<AddPropertyOptionsViewProps> = ({
  setModalView,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-7 md:gap-14">
      <AddPropertyCard
        buttonText="create"
        title="Add Rental Property"
        buttonHref="/management/properties/create-rental-property"
        desc="Are you looking to add a single standalone property for rent?"
      />
      <AddPropertyCard
        buttonText="choose"
        title="Add Gated Estate"
        buttonHref="/management/properties/create-gated-estate-property"
        desc="Are you managing an entire estate, facilities, or a gated community?"
      />
      <AddPropertyCard
        buttonText="Add"
        title="Add With ID"
        onClick={() => setModalView("add-property-with-id")}
        desc="Are you receiving the transfer of property from another company to manage?"
      />
    </div>
  );
};

export default AddPropertyOptionsView;
