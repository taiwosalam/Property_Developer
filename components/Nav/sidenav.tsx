import React from "react";

// Imports
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";

const Sidenav = () => {
  return (
    <div className="custom-flex-col">
      <NavButton type="buildings">dashboard</NavButton>
      <NavDropdown
        type="people"
        content={[
          "landlord & landlady",
          "tenants & occupants",
          "staff & branches",
          "inventory",
          "properties",
          "rent & unit",
        ]}
      >
        management
      </NavDropdown>
      <NavDropdown
        type="briefcase_timer"
        content={["complaints", "inspections", "examine", "maintenance"]}
      >
        tasks
      </NavDropdown>
    </div>
  );
};

export default Sidenav;
