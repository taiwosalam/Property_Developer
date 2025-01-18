// Imports
import NavRequestCallback from "./NavModals/nav-request-callback";
import NavCreateSuggestion from "./NavModals/nav-create-suggestion";

export const profile_actions: (
  | {
      label: string;
      link: {
        href: string;
        target?: "_blank" | "_self";
      };
      modal?: never;
    }
  | { label: string; modal: React.ReactNode; link?: never }
)[] = [
  {
    label: "Assistance & Support",
    link: {
      href: "https://kb.ourproperty.ng/",
      target: "_blank",
    },
  },
  {
    label: "Create Suggestion",
    modal: <NavCreateSuggestion />,
  },
  {
    label: "Terms & Conditions",
    link: {
      href: "",
    },
  },
  {
    label: "Frequently Asked Questions",
    link: {
      href: "",
    },
  },
  {
    label: "Request Call",
    modal: <NavRequestCallback />,
  },
];


export const manager_profile_actions: (
  | {
      label: string;
      link: {
        href: string;
        target?: "_blank" | "_self";
      };
      modal?: never;
    }
  | { label: string; modal: React.ReactNode; link?: never }
)[] = [
  {
    label: "Create Suggestion",
    modal: <NavCreateSuggestion />,
  },
  {
    label: "Request Call",
    modal: <NavRequestCallback />,
  },
];


export const account_profile_actions: (
  | {
      label: string;
      link: {
        href: string;
        target?: "_blank" | "_self";
      };
      modal?: never;
    }
  | { label: string; modal: React.ReactNode; link?: never }
)[] = [
  {
    label: "Create Suggestion",
    modal: <NavCreateSuggestion />,
  },
  {
    label: "Request Call",
    modal: <NavRequestCallback />,
  },
];
