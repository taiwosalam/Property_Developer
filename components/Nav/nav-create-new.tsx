// Imports

import NavCreateNewColumn from "./nav-create-new-column";
import { create_new_items } from "./nav-create-new-items";
import ModalPreset from "@/components/Management/landlord-tenant-modal-preset";

const NavCreateNew = () => {
  return (
    <ModalPreset
      heading="CREATE NEW"
      lightSeparator
      style={{ width: "85%", maxWidth: "1200px" }}
    >
      <NavCreateNewColumn data={create_new_items} />
    </ModalPreset>
  );
};

export default NavCreateNew;
