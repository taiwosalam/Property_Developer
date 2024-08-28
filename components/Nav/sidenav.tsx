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
        content={[
          "complaints",
          "inspections",
          "examine",
          "maintenance",
          "service providers",
          "calendars",
          "announcements",
          "call back request",
          "visitors request",
          "property request",
          "deposits request",
          "vehicles record",
        ]}
      >
        tasks
      </NavDropdown>
      <NavDropdown
        type="briefcase_timer"
        content={["units", "statistics", "property"]}
      >
        listing
      </NavDropdown>
      <NavDropdown
        type="briefcase_timer"
        content={[
          "invoice",
          "recepits",
          "expenses",
          "disbursement",
          "statement",
          "VAT",
        ]}
      >
        accounting
      </NavDropdown>
      <NavDropdown
        type="briefcase_timer"
        content={[
          "tenants / occupants",
          "landlord / landlady",
          "properties",
          "units",
          "rent roll",
          "listings",
          "email",
          "SMS",
          "tracking",
          "call request",
          "visitors request",
          "undo",
          "vehicles record",
        ]}
      >
        reports
      </NavDropdown>
      <NavButton type="buildings">wallet</NavButton>
      <NavButton type="buildings">applications</NavButton>
      <NavButton type="buildings">documents</NavButton>
      <NavButton type="buildings">settings</NavButton>
    </div>
  );
};

export default Sidenav;
