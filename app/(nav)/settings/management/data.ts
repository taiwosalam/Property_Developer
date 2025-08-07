import api, { handleAxiosError } from "@/services/api";

export const staffConfigurations = [
  {
    title: "admin configuration (company director)",
    permissions: [
      [
        "Add Other Directors",
        "Change Company Module",
        "Manage Messages & Reviews",
        "Notification Preferences",
        "Reset System Settings",
        "Customize Appearance",
        "Manage Enrollment Settings",
        "Set Authorized Signature",
        "Change Wallet PIN",
      ],
      [
        "Update Bank Details",
        "Modify SMS Sender Name",
        "Configure SMTP Settings",
        "Edit Services",
        "Manage Subscription Settings",
        "Access Management Settings",
        "Modify Company Information",
        "Full Wallet Access",
        "Activate Add-on",
      ],
    ],
  },
  {
    title: "partner configuration (branch manager)",
    permissions: [
      [
        "Can view and reply branch messages",
        "Can add/delete branch staff",
        "Can add/delete branch properties",
        "Can view and edit branch profile",
        "Can upgrade or downgrade branch staff account",
        "Can view call request",
        "Can check in visitors",
        "Can view property request",
        "Can create examine",
        "Can manage inspections",
      ],
      [
        "Can create and manage announcement",
        "Can add and manage tenants/occupants",
        "Can view and reply property reviews",
        "Can add and manage landlords/landlady",
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
    title: "colleague configuration (account manager)",
    permissions: [
      [
        "Can manage tenants/occupants",
        "Can view service provider",
        "Can create announcement",
        "Can add/delete branch properties",
        "Can view call request",
        "Can create branch inventory",
        "Can reply assigned messages",
        "Can check in and manage vehicle records",
      ],
      [
        "Can add and manage landlords/landlady",
        "Can check in visitors",
        "Can manage calendar",
        "Can create examine",
        "Can view complaints",
        "Can manage inspections",
      ],
    ],
  },
  {
    title: "staff configuration (other staff)",
    permissions: [
      [
        "Can view complaints",
        "Can view announcement",
        "Can create examine",
        "Can manage inspections",
        "Can view service provider",
        "Can check in vehicle records",
      ],
      [
        "Can check in visitors",
        "Can view call request",
        "Can create inventory",
        "Can manage calendar",
        "Can view and reply assigned messages",
      ],
    ],
  },
  {
    title: "Users Configuration (Landlord, Occupant & Tenants)",
    permissions: [
      [
        "Create profile account when you sent invite",
        "Create profile account for service provider",
      ],
      [
        "Create profile account for landlord/landlady",
        "Create profile account for tenants/occupant",
      ],
    ],
  },
];


export const validPermissions: Record<string, string[]> = {
  director: [
    "add_other_directors",
    "change_company_module",
    "manage_messages_reviews",
    "notification_preferences",
    "reset_system_settings",
    "customize_appearance",
    "manage_enrollment_settings",
    "set_authorized_signature",
    "change_wallet_pin",
    "update_bank_details",
    "modify_sms_sender_name",
    "configure_smtp_settings",
    "edit_services",
    "manage_subscription_settings",
    "access_management_settings",
    "modify_company_information",
    "full_wallet_access",
    "activate_add_on",
  ],
  manager: [
    "can_view_and_reply_branch_messages",
    "can_add_delete_branch_staff",
    "can_add_delete_branch_properties",
    "can_view_and_edit_branch_profile",
    "can_upgrade_or_downgrade_branch_staff_account",
    "can_view_call_request",
    "can_check_in_visitors",
    "can_view_property_request",
    "can_create_examine",
    "can_manage_inspections",
    "can_create_and_manage_announcement",
    "can_add_and_manage_tenants_occupants",
    "can_view_and_reply_property_reviews",
    "can_add_and_manage_landlords_landlady",
    "can_view_complaints",
    "can_create_inventory",
    "can_manage_calendar",
    "can_create_service_provider",
    "can_check_in_and_manage_vehicle_records",
    "can_approve_and_refund_caution_deposit",
  ],
  account: [
    "can_manage_tenants_occupants",
    "can_view_service_provider",
    "can_create_announcement",
    "can_add_delete_branch_properties",
    "can_view_call_request",
    "can_create_branch_inventory",
    "can_reply_assigned_messages",
    "can_check_in_and_manage_vehicle_records",
    "can_add_and_manage_landlords_landlady",
    "can_check_in_visitors",
    "can_manage_calendar",
    "can_create_examine",
    "can_view_complaints",
    "can_manage_inspections",
  ],
  staff: [
    "can_view_complaints",
    "can_view_announcement",
    "can_create_examine",
    "can_manage_inspections",
    "can_view_service_provider",
    "can_check_in_vehicle_records",
    "can_check_in_visitors",
    "can_view_call_request",
    "can_create_inventory",
    "can_manage_calendar",
    "can_view_and_reply_assigned_messages",
  ],
  user: [
    "create_profile_account_when_you_sent_invite",
    "create_profile_account_for_service_provider",
    "create_profile_account_for_landlord_landlady",
    "create_profile_account_for_tenants_occupant",
  ],
  landlord: [
    "create_profile_account_when_you_sent_invite",
    "create_profile_account_for_service_provider",
    "create_profile_account_for_landlord_landlady",
    "create_profile_account_for_tenants_occupant",
  ],
  tenant: [
    "create_profile_account_when_you_sent_invite",
    "create_profile_account_for_service_provider",
    "create_profile_account_for_landlord_landlady",
    "create_profile_account_for_tenants_occupant",
  ],
};


export type RentPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "biennially"
  | "triennially"
  | "quadrennial"
  | "quinquennial"
  | "sexennial"
  | "septennial"
  | "octennial"
  | "nonennial"
  | "decennial";

export const PERCENTAGE_OPTIONS = [
  "1%",
  "2%",
  "2.5%",
  "3%",
  "3.5%",
  "5%",
  "6%",
  "7%",
  "7.5%",
  "8%",
  "9%",
  "10%",
];

export const RENT_PERIODS: Array<{
  value: RentPeriod;
  label: string;
  desc: string;
  options: string[];
}> = [
  {
    value: "daily",
    label: "Daily",
    desc: "Select the percentage to be charged per hour on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "weekly",
    label: "Weekly",
    desc: "Select the percentage to be charged per daily on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "monthly",
    label: "Monthly",
    desc: "Select the percentage to be charged per weekly on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quarterly",
    label: "Quarterly",
    desc: "Select the percentage to be charged per monthly on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "yearly",
    label: "Yearly",
    desc: "Select the percentage to be charged per quarterly on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "biennially",
    label: "Biennially",
    desc: "Select the percentage to be charged per yearly on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "triennially",
    label: "Triennially",
    desc: "Select the percentage to be charged per biennially on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quadrennial",
    label: "Quadrennial",
    desc: "Select the percentage to be charged per triennially on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quinquennial",
    label: "Quinquennial",
    desc: "Select the percentage to be charged per quadrennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "sexennial",
    label: "Sexennial",
    desc: "Select the percentage to be charged per quinquennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "septennial",
    label: "Septennial",
    desc: "Select the percentage to be charged per sexennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "octennial",
    label: "Octennial",
    desc: "Select the percentage to be charged per septennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "nonennial",
    label: "Nonennial",
    desc: "Select the percentage to be charged per octennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "decennial",
    label: "Decennial",
    desc: "Select the percentage to be charged per nonennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
];

// /company/permissions
export const updateSettingsManagement = async (data: FormData) => {
  try {
    data.append("_method", "PATCH");
    const res = await api.post("/company/permissions", data);
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
  }
};
