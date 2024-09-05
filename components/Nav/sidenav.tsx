import React from "react";

// Imports
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";

const Sidenav = () => {
  return (
    <div className="custom-flex-col">
      <NavButton href="/dashboard" type="buildings">
        dashboard
      </NavButton>
      <NavDropdown
        type="people"
        content={[
          { label: "landlord & landlady", href: "/landlord" },
          { label: "tenants & occupants", href: "/tenants" },
          { label: "staff & branches", href: "/staff-branch" },
          { label: "inventory", href: "/inventory" },
          { label: "properties", href: "/properties" },
          { label: "rent & unit", href: "/rent" },
        ]}
      >
        management
      </NavDropdown>
      <NavDropdown
        type="briefcase_timer"
        content={[
          { label: "complaints", href: "/complaints" },
          { label: "inspections", href: "/inspections" },
          { label: "examine", href: "/examine" },
          { label: "maintenance", href: "/maintenance" },
          { label: "service providers", href: "/service" },
          { label: "calendars", href: "/calendars" },
          { label: "announcements", href: "/announcements" },
          { label: "call back request", href: "/call" },
          { label: "visitors request", href: "/visitors" },
          { label: "property request", href: "/property" },
          { label: "deposits request", href: "/deposits" },
          { label: "vehicles record", href: "/vehicles" },
        ]}
      >
        tasks
      </NavDropdown>
      <NavDropdown
        type="briefcase_timer"
        content={[
          { label: "units", href: "/units" },
          { label: "statistics", href: "/statistics" },
          { label: "property", href: "/property" },
        ]}
      >
        listing
      </NavDropdown>
      <NavDropdown
        type="briefcase_timer"
        content={[
          { label: "invoice", href: "/invoice" },
          { label: "receipts", href: "/receipts" },
          { label: "expenses", href: "/expenses" },
          { label: "disbursement", href: "/disbursement" },
          { label: "statement", href: "/statement" },
          { label: "VAT", href: "/vat" },
        ]}
      >
        accounting
      </NavDropdown>
      <NavDropdown
        type="briefcase_timer"
        content={[
          { label: "tenants / occupants", href: "/tenants" },
          { label: "landlord / landlady", href: "/landlord" },
          { label: "properties", href: "/properties" },
          { label: "units", href: "/units" },
          { label: "rent roll", href: "/rent" },
          { label: "listings", href: "/listings" },
          { label: "email", href: "/email" },
          { label: "SMS", href: "/sms" },
          { label: "tracking", href: "/tracking" },
          { label: "call request", href: "/call" },
          { label: "visitors request", href: "/visitors" },
          { label: "undo", href: "/undo" },
          { label: "vehicles record", href: "/vehicles" },
        ]}
      >
        reports
      </NavDropdown>
      <NavButton href="/wallet" type="buildings">
        wallet
      </NavButton>
      <NavButton href="/applications" type="buildings">
        applications
      </NavButton>
      <NavButton href="/documents" type="buildings">
        documents
      </NavButton>
      <NavButton href="/settings" type="buildings">
        settings
      </NavButton>
    </div>
  );
};

export default Sidenav;
