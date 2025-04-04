// Types
import type { StaffProfilePortfolioProps, StaffProfileProps } from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/types";
import type { Field } from "@/components/Table/types";
// Images
import SampleProperty from "@/public/empty/SampleProperty.jpeg";
import SampleProperty2 from "@/public/empty/SampleProperty2.jpeg";
import SampleProperty3 from "@/public/empty/SampleProperty3.jpeg";
import SampleProperty4 from "@/public/empty/SampleProperty4.png";

import Avatar1 from "@/public/empty/avatar-1.svg";
import Avatar2 from "@/public/empty/avatar-2.svg";
import Avatar3 from "@/public/empty/avatar-3.svg";
import Avatar4 from "@/public/empty/avatar-4.svg";
import { StaffAPIResponse, StaffPageTypes } from "./type";
import api, { handleAxiosError } from "@/services/api";

export const sendVerifyStaffOTP = async () => {
  try {
    const response = await api.post("/staff/restrict/get-otp");
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const lockStaffAccount = async (id: string, otp: string) => {
  try {
    const response = await api.post(`/staff/${id}/restrict`, { otp });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};


export const staffData: StaffProfileProps = {
    branch_id: "",
    id: "",
    personal_title: "",
    real_estate_title: "",
    full_name: "",
    email: "",
    phone_number: "",
    gender: "",
    position: "",
    picture: "",
    about: "",
    status: "",
    experience: "",
  };


  export const initialPageData: StaffPageTypes = {
    staff: {
      id: "",
      name: "",
      email: "",
      title: "",
      real_estate_title: "",
      phone: "",
      username: "",
      gender: "",
      position: "",
      state: "",
      local_government: "",
      address: "",
      picture: "",
      user_id: "0",
      branch_id: "0",
      company_id: "0",
      created_at: "",
      updated_at: "",
      about_staff: "",
      status: "",
    },
    activities: [],
    chats: [],
    portfolio: [],
  }
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
        {
          image: SampleProperty4,
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
        {
          image: Avatar4,
          user: {
            name: "Ibironke Adebimpe",
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
        {
          image: Avatar2,
          user: {
            name: "Oloruntoba Morakinyo",
            email: "test@testt.com",
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

  export const staffActivitiesTableFields: Field[] = [
    { id: "1", label: "S/N", accessor: "S/N" },
    { id: "2", label: "Username", accessor: "username" },
    { id: "3", label: "Page Visits", accessor: "page_visits" },
    { id: "4", label: "Action Taken", accessor: "action_taken" },
    { id: "5", label: "IP Address", accessor: "ip_address" },
    { id: "6", label: "Location", accessor: "location" },
    { id: "7", label: "Date", accessor: "date" },
    { id: "8", label: "Time", accessor: "time" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: `${index + 1}`,
      username: "ola@gail.com",
      page_visits: "Landlord Login Page",
      action_taken: "Login Success",
      ip_address: "105.113.18.186",
      location: "6.537216, 3.3488896",
      date: "12/12/12",
      time: "3:20pm",
    }));
  };
  
  export const activitiesTableData = generateTableData(5);
  
  // function to change Yes/no to active/inactive
  export const yesNoToActiveInactive = (yesNo: string): string => {
    return yesNo === "Yes" ? "active" : "inactive";
  };
  
  export const transformStaffAPIResponse = (
    res: StaffAPIResponse
  ): StaffPageTypes => {
    // console.log("acti", res.activities)
    return {
      staff: {
        id: res.data.id.toString(),
        name: res.data.name,
        email: res.data.email,
        title: res.data.title,
        real_estate_title: res.data.real_estate_title,
        phone: res.data.phone,
        picture: res.data.picture,
        username: res.data.username,
        gender: res.data.gender,
        position: res.data.position,
        state: res.data.state,
        local_government: res.data.local_government,
        address: res.data.address,
        user_id: res.data.user_id,
        branch_id: res.data.branch_id,
        company_id: res.data.company_id,
        created_at: res.data.created_at,
        updated_at: res.data.updated_at,
        about_staff: res.data.about_staff,
        status: yesNoToActiveInactive(res.data.status),
      },
      activities: res.activities.map((a) => {
        // Parsing action_taken
        let message = "Unknown action"; // Default message
        try {
          const actionTaken = JSON.parse(a.action_taken);
          message = actionTaken.message; // Accessing the message
        } catch (error) {
          console.error("Error parsing action_taken:", error);
        }
        const { latitude, longitude } = a.location;
        // const { address, error } = useReverseGeocoding(latitude, longitude);
        return {
          id: a["S/N"],
          username: a.username,
          page_visits: a.page_visits,
          action_taken: message,
          ip_address: a.ip_address,
          location: a.location,
          date: a.date,
          time: a.time,
        }
      }),
      chats: [],
      portfolio: [],
    }
  }