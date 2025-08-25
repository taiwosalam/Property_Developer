import { getAllStates } from "@/utils/states";
import { currencySymbols } from "@/utils/number-formatter";
import { type PropertyCardProps } from "@/components/Management/Properties/property-card";
import type { FilterOptionMenu } from "@/components/Management/Landlord/types";
import moment from "moment";
import { UnitStatusColors } from "@/components/Management/Properties/previews/property-preview";
import { ProgressCardStep } from "@/components/Loader/setup-card-loader";

const states = getAllStates();

// Dummy data for PropertiesPageState
export const initialState: PropertiesPageState = {
  total_pages: 3,
  current_page: 1,
  total_properties: 12,
  new_properties_count: 2,
  total_outright_properties: 5,
  new_outright_properties_count: 1,
  total_installment_properties: 7,
  new_installment_properties_count: 1,
  properties: [
    {
      id: "PROP001",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Sunset Villa",
      total_units: 10,
      address: "123 Ocean Drive, Lagos, Nigeria",
      total_unit_pictures: 15,
      hasVideo: true,
      property_type: "outright",
      total_returns: 15000000,
      total_income: 20000000,
      branch: "Lagos Branch",
      accountOfficer: "John Adebayo",
      last_updated: "2025-08-20",
      mobile_tenants: 0, // Not applicable for outright/installment
      web_tenants: 0, // Not applicable for outright/installment
      owing_units: 0,
      available_units: 4,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP002",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Green Heights Estate",
      total_units: 8,
      address: "45 Green Road, Abuja, Nigeria",
      total_unit_pictures: 10,
      hasVideo: false,
      property_type: "installment",
      total_returns: 8000000,
      total_income: 12000000,
      branch: "Abuja Branch",
      accountOfficer: "Aisha Mohammed",
      last_updated: "2025-08-18",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 3,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP003",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Palm Grove Residences",
      total_units: 12,
      address: "78 Palm Avenue, Port Harcourt, Nigeria",
      total_unit_pictures: 20,
      hasVideo: true,
      property_type: "outright",
      total_returns: 25000000,
      total_income: 30000000,
      branch: "Port Harcourt Branch",
      accountOfficer: "Chinedu Okeke",
      last_updated: "2025-08-15",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 5,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP004",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
        ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Skyline Towers",
      total_units: 6,
      address: "101 Skyline Boulevard, Ibadan, Nigeria",
      total_unit_pictures: 8,
      hasVideo: false,
      property_type: "installment",
      total_returns: 5000000,
      total_income: 7500000,
      branch: "Ibadan Branch",
      accountOfficer: "Funmi Ola",
      last_updated: "2025-08-10",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 2,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP001",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Sunset Villa",
      total_units: 10,
      address: "123 Ocean Drive, Lagos, Nigeria",
      total_unit_pictures: 15,
      hasVideo: true,
      property_type: "outright",
      total_returns: 15000000,
      total_income: 20000000,
      branch: "Lagos Branch",
      accountOfficer: "John Adebayo",
      last_updated: "2025-08-20",
      mobile_tenants: 0, // Not applicable for outright/installment
      web_tenants: 0, // Not applicable for outright/installment
      owing_units: 0,
      available_units: 4,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP002",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Green Heights Estate",
      total_units: 8,
      address: "45 Green Road, Abuja, Nigeria",
      total_unit_pictures: 10,
      hasVideo: false,
      property_type: "installment",
      total_returns: 8000000,
      total_income: 12000000,
      branch: "Abuja Branch",
      accountOfficer: "Aisha Mohammed",
      last_updated: "2025-08-18",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 3,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP003",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Palm Grove Residences",
      total_units: 12,
      address: "78 Palm Avenue, Port Harcourt, Nigeria",
      total_unit_pictures: 20,
      hasVideo: true,
      property_type: "outright",
      total_returns: 25000000,
      total_income: 30000000,
      branch: "Port Harcourt Branch",
      accountOfficer: "Chinedu Okeke",
      last_updated: "2025-08-15",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 5,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP004",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
        ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Skyline Towers",
      total_units: 6,
      address: "101 Skyline Boulevard, Ibadan, Nigeria",
      total_unit_pictures: 8,
      hasVideo: false,
      property_type: "installment",
      total_returns: 5000000,
      total_income: 7500000,
      branch: "Ibadan Branch",
      accountOfficer: "Funmi Ola",
      last_updated: "2025-08-10",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 2,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP001",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Sunset Villa",
      total_units: 10,
      address: "123 Ocean Drive, Lagos, Nigeria",
      total_unit_pictures: 15,
      hasVideo: true,
      property_type: "outright",
      total_returns: 15000000,
      total_income: 20000000,
      branch: "Lagos Branch",
      accountOfficer: "John Adebayo",
      last_updated: "2025-08-20",
      mobile_tenants: 0, // Not applicable for outright/installment
      web_tenants: 0, // Not applicable for outright/installment
      owing_units: 0,
      available_units: 4,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP002",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Green Heights Estate",
      total_units: 8,
      address: "45 Green Road, Abuja, Nigeria",
      total_unit_pictures: 10,
      hasVideo: false,
      property_type: "installment",
      total_returns: 8000000,
      total_income: 12000000,
      branch: "Abuja Branch",
      accountOfficer: "Aisha Mohammed",
      last_updated: "2025-08-18",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 3,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP003",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
      ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Palm Grove Residences",
      total_units: 12,
      address: "78 Palm Avenue, Port Harcourt, Nigeria",
      total_unit_pictures: 20,
      hasVideo: true,
      property_type: "outright",
      total_returns: 25000000,
      total_income: 30000000,
      branch: "Port Harcourt Branch",
      accountOfficer: "Chinedu Okeke",
      last_updated: "2025-08-15",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 5,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
    {
      id: "PROP004",
      images: [
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
        ],
      default_image: "/empty/SampleProperty.jpeg",
      property_name: "Skyline Towers",
      total_units: 6,
      address: "101 Skyline Boulevard, Ibadan, Nigeria",
      total_unit_pictures: 8,
      hasVideo: false,
      property_type: "installment",
      total_returns: 5000000,
      total_income: 7500000,
      branch: "Ibadan Branch",
      accountOfficer: "Funmi Ola",
      last_updated: "2025-08-10",
      mobile_tenants: 0,
      web_tenants: 0,
      owing_units: 0,
      available_units: 2,
      currency: "naira",
      isClickable: true,
      viewOnly: false,
      isManagerPage: true,
    },
  ],
};

// Dummy data for branch options (used in FilterBar)
export const dummyBranchOptions = [
  { label: "Lagos Branch", value: "BR001" },
  { label: "Abuja Branch", value: "BR002" },
  { label: "Port Harcourt Branch", value: "BR003" },
  { label: "Ibadan Branch", value: "BR004" },
];

export const propertyFilterOptionsMenu: FilterOptionMenu[] = [
  {
    label: "State",
    value: states.map((state) => ({
      label: state,
      value: state.toLowerCase(),
    })),
  },
  {
    label: "Branch",
    value: dummyBranchOptions,
  },
  {
    radio: true,
    label: "Property Type",
    value: [
      { label: "All properties", value: "all", isChecked: true },
      { label: "Rental Property", value: "rental" },
      { label: "Facility Property", value: "facility" },
    ],
  },
];

export interface PropertiesPageState {
  total_pages: number;
  current_page: number;
  total_properties: number;
  new_properties_count: number;
  total_outright_properties: number;
  new_outright_properties_count: number;
  total_installment_properties: number;
  new_installment_properties_count: number;
  properties: PropertyCardProps[];
}

export interface PropertiesFilterParams {
  date_from?: string;
  date_to?: string;
  branch_id?: string[];
  state?: string[];
  staff_id?: string[];
  property_type?: "rental" | "facility";
  sort_by?: "desc";
  search?: string;
  // per_page?: number;
}

// ================  CREATE UNIT LOADING STEPS ====================

export const CreateUnitLoadsteps: ProgressCardStep[] = [
  {
    title: "Setting up unit details to property details",
    type: "warning",
    desc: "Adding unit name, type, size, and linking it to the property with complete location and category details.",
  },
  {
    title: "Creating unit breakdown and slots",
    type: "warning",
    desc: "Structuring units into sections or groups, creating inventory slots, and defining capacity for clients or tenants.",
  },
  {
    title: "Applying settings, features, and pricing",
    type: "warning",
    desc: "Adding amenities, availability status, rent or sale prices, and management preferences for both property and units.",
  },
  {
    title: "Uploading and optimizing images",
    type: "success",
    desc: "Preparing high-quality, fast-loading photos for the property and all associated units.",
  },
  {
    title: "Publishing to your website and sending for approval",
    type: "success",
    desc: "Finalizing layout, maps, and branding, then making the listing live and submitting it for admin review.",
  },
  {
    title: "Unit creation complete",
    type: "success",
    desc: "All steps finished successfully — your unit is now fully set up and ready for use.",
  },
];
