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
    label: "Homepage",
    link: {
      href: "",
    },
  },
  {
    label: "Company Reviews",
    link: {
      href: "/reviews",
    },
  },
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
      href: "https://ourproperty.com.ng/resources/privacy-policy",
      target: "_blank",
    },
  },
  {
    label: "Frequently Asked Questions",
    link: {
      href: "https://ourproperty.com.ng/resources/faq",
      target: "_blank",
    },
  },
  {
    label: "Request Call Back",
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
    label: "Homepage",
    link: {
      href: "",
    },
  },
  {
    label: "Branch Reviews",
    link: {
      href: "/reviews",
    },
  },
  {
    label: "Create Suggestion",
    modal: <NavCreateSuggestion />,
  },
  // {
  //   label: "Request Call",
  //   modal: <NavRequestCallback />,
  // },
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
    label: "Homepage",
    link: {
      href: "",
    },
  },
  {
    label: "Create Suggestion",
    modal: <NavCreateSuggestion />,
  },
  // {
  //   label: "Request Call",
  //   modal: <NavRequestCallback />,
  // },
];

export const staff_profile_actions: (
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
    label: "Homepage",
    link: {
      href: "",
    },
  },
  {
    label: "Create Suggestion",
    modal: <NavCreateSuggestion />,
  },
  // {
  //   label: "Request Call",
  //   modal: <NavRequestCallback />,
  // },
];

export const user_profile_actions: (
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
    label: "Homepage",
    link: {
      href: "",
    },
  },
  {
    label: "Create Suggestion",
    modal: <NavCreateSuggestion />,
  },
];
