import { useRouter } from "next/navigation";
import AddPropertyCard from "../add-landlord-or-tenant-card";
import { AddPropertyOptionsViewProps } from "./types";

const AddPropertyOptionsView: React.FC<AddPropertyOptionsViewProps> = ({
  setModalView,
}) => {
  const router = useRouter();

  const navigateToCreateTRentalProperty = () => {
    router.push("/management/properties/create-rental-property");
  };
  const navigateToCreateTGatedEstateProperty = () => {
    router.push("/management/properties/create-gated-estate-property");
  };
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-7 md:gap-14">
      <AddPropertyCard
        buttonText="create"
        title="Add Rental Property"
        onClick={navigateToCreateTRentalProperty}
        desc="Are you looking to add a single standalone property for rent?"
      />
      <AddPropertyCard
        buttonText="choose"
        title="Add Gated Estate"
        onClick={navigateToCreateTGatedEstateProperty}
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
