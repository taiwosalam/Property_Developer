// Types
import type { StaffProfilePortfolioProps } from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/types";

// Images
import SampleProperty from "@/public/empty/SampleProperty.jpeg";
import SampleProperty2 from "@/public/empty/SampleProperty2.jpeg";
import SampleProperty3 from "@/public/empty/SampleProperty3.jpeg";
import SampleProperty4 from "@/public/empty/SampleProperty4.png";

import Avatar1 from "@/public/empty/avatar-1.svg";
import Avatar2 from "@/public/empty/avatar-2.svg";
import Avatar3 from "@/public/empty/avatar-3.svg";
import Avatar4 from "@/public/empty/avatar-4.svg";

export const placeholder_portfolio_data: StaffProfilePortfolioProps[] = [
  {
    title: "Properties",
    items: [
      {
        image: SampleProperty,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty2,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty3,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
      {
        image: SampleProperty4,
        property: {
          name: "moniya apartment",
          location: "Street 23, All Avenue, Nigeria",
        },
      },
    ],
  },
  {
    title: "Landlords",
    items: [
      {
        image: Avatar1,
        user: {
          name: "Abimbola Azeez Wasiu",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar2,
        user: {
          name: "Oloruntoba Morakinyo",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar3,
        user: {
          name: "Wasiu Sodeeq",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar4,
        user: {
          name: "Ibironke Adebimpe",
          email: "example@gmail.com",
          phone_number: "+2348123456789",
        },
      },
    ],
  },
  {
    title: "Occupants & Tenants",
    items: [
      {
        image: Avatar1,
        user: {
          name: "Abimbola Azeez Wasiu",
          email: "test@test.com",
          phone_number: "+2348123456789",
        },
      },
      {
        image: Avatar2,
        user: {
          name: "Oloruntoba Morakinyo",
          email: "test@testt.com",
          phone_number: "+2348123456789",
        },
      },
    ],
  },
];
