import api, { handleAxiosError } from "@/services/api";

export const staffConfigurations = [
    {
      title: "staff configuration (branch manager)",
      subTitle: "Can be accessed through mobile app, software, or web cross-platform.",
      permissions: [
        [
          "Can view and reply branch messages",
          "Can add/delete branch properties",
          "Can view and edit branch profile",
          "Can upgrade or downgrade branch staff account",
          "Can view branch request",
          "Can approve/decline account officer property added",
          "Can check in visitors",
          "Can view all requests",
          "Can create Examine",
          "Can manage inspections",
          "Can create and manage announcement",
          "Can add and manage tenants/occupants",
          "Can view and reply branch reviews",
        ],
        [
          "Can add/delete branch staff",
          "Can add/delete branch staff",
          "Can view branch account statement",
          "Can approve/decline account officer portfolio",
          "Can add and manage landlords/landlady",
          "Can approve/decline account officer announcement",
          "Can view complaints",
          "Can create inventory",
          "Can manage calendar",
          "Can create service provider",
          "Can check in and manage vehicle records",
          "Can approve and refund caution deposit",
        ],
      ],
    },
    {
      title: "staff configuration (account officer)",
      subTitle: "Can be accessed through mobile app, software, or web cross-platform.",
      permissions: [
        [
          "Can manage assigned tenants/occupants",
          "Can manage assigned properties",
          "Can view service provider",
          "Can create announcement",
          "Can add properties to branch",
          "Can view assigned request",
          "Can create branch inventory",
          "Can reply assigned messages",
          "Can check in and manage vehicle records",
        ],
        [
          "Can manage assigned landlord/landlady",
          "Can approve/decline assigned tasks",
          "Can view assigned account statement",
          "Can check in visitors",
          "Can check calendars",
          "Can create branch examine",
          "Can reply to inspections",
        ],
      ],
    },
    {
      title: "staff configuration (staff)",
      subTitle: "Can be accessed through mobile app or web cross-platform.",
      permissions: [
        [
          "Can be added to task",
          "Can view assigned complaints",
          "Can view announcement",
          "Can create examine",
          "Can reply to inspections",
          "Can view service provider",
          "Can check in vehicle records",
        ],
        [
          "Can check in visitors",
          "Can view assigned request",
          "Can create inventory",
          "Can reply assigned messages",
          "Can check calendars",
          "Can view and reply assigned messages",
        ],
      ],
    },
    {
      title: "Users Configuration (Landlord, Occupant & Tenants)",
      subTitle: "Can be accessed through mobile app or web cross-platform.",
      permissions: [
        [
          "Create Profile Account For Tenants/Occupant",
          "Create Profile Account For Landlord/Landlady",
        ],
        [
          "Create Profile Account For Service Provider",
          "Create Profile Account When You Sent Invite",
        ],
      ],
    },
];

// /company/permissions
export const updateSettingsManagement = async(data: FormData)=> {
    try{
        data.append("_method", "PATCH")
        const res = await api.post('/company/permissions', data)
        if (res.status === 200 || res.status === 201) {
          window.dispatchEvent(new Event("refetchManagementSettings"));
          return true
        }
    }catch(err){
        handleAxiosError(err);
        return false;
    }
}