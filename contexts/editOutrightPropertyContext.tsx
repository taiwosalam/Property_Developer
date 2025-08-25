import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { currencySymbols } from "@/utils/number-formatter";
import { UnitTypeKey } from "@/data";
import { Dispatch, SetStateAction } from "react";

// Types
export interface PropertyFormStateType {
  state: string;
  city: string;
  lga: string;
  resetKey: number;
}

export interface PropertyFormData {
  category: string;
  unit_type: UnitTypeKey | "";
  unit_sub_type: string;
  unit_preference: string;
  measurement: string;
  total_area_sqm: string;
  bedroom: string;
  bathroom: string;
  toilet: string;
  total_units: string;
  description: string;
  additional_units: Array<{
    unit_type: UnitTypeKey | "";
    unit_sub_type: string;
    bedroom: string;
    bathroom: string;
    toilet: string;
    total_units: string;
  }>;
  state: string;
  city: string;
  lga: string;
  full_address: string;
  coordinate: string;
  lat: number;
  lng: number;
  agreement_deed?: File | string;
  survey_plan?: File | string;
  building_plan?: File | string;
  cofo?: File | string;
  other_document?: File | string;
  gated_estate: string;
  drainage: string;
  fence: string;
  interlocking: string;
  parking_space: string;
  facilities: string[];
  currency: keyof typeof currencySymbols;
  fee_amount: string;
  inspection_fee: string;
  agency_fee: string;
  security_fee: string;
  service_charge: string;
  total_package: string;
  negotiation: string;
  branch: string;
  account_manager: string;
  owner_source: string;
  activate_vat: string;
  activate_joint_sales: string;
  staff: string;
  images: (File | string)[];
  video_link: string;
}

export interface EditPropertyContextType {
  editMode: boolean;
  propertyId: string;
  formData: PropertyFormData;
  setFormData: Dispatch<SetStateAction<PropertyFormData>>;
  resetForm: () => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  updateFormField: <K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K]
  ) => void;
  addAdditionalUnit: () => void;
  removeAdditionalUnit: (index: number) => void;
  updateAdditionalUnit: (
    index: number,
    field: keyof PropertyFormData["additional_units"][number],
    value: string
  ) => void;
}

const EditPropertyContext = createContext<EditPropertyContextType | undefined>(
  undefined
);

// Initial form data
const initialFormData: PropertyFormData = {
  category: "",
  unit_type: "",
  unit_sub_type: "",
  unit_preference: "none",
  measurement: "sqm",
  total_area_sqm: "",
  bedroom: "",
  bathroom: "",
  toilet: "",
  total_units: "",
  description: "",
  additional_units: [],
  state: "",
  city: "",
  lga: "",
  full_address: "",
  coordinate: "",
  lat: 0,
  lng: 0,
  agreement_deed: undefined,
  survey_plan: undefined,
  building_plan: undefined,
  cofo: undefined,
  other_document: undefined,
  gated_estate: "no",
  drainage: "no",
  fence: "no",
  interlocking: "no",
  parking_space: "no",
  facilities: [],
  currency: "naira",
  fee_amount: "",
  inspection_fee: "",
  agency_fee: "",
  security_fee: "",
  service_charge: "",
  total_package: "",
  negotiation: "no",
  branch: "",
  account_manager: "",
  owner_source: "",
  activate_vat: "no",
  activate_joint_sales: "no",
  staff: "",
  images: [],
  video_link: "",
};

interface EditPropertyProviderProps {
  propertyId: string;
  children: React.ReactNode;
}

export const EditPropertyProvider: React.FC<EditPropertyProviderProps> = ({
  propertyId,
  children,
}) => {
  const [editMode, setEditMode] = useState(!!propertyId);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPropertyData = useCallback(async () => {
    if (!propertyId) return;
    setIsLoading(true);
    try {
      // Replace with actual API call when ready
      const data = await new Promise<PropertyFormData>((resolve) => {
        setTimeout(() => {
          resolve({
            ...initialFormData,
            category: "residential",
            unit_type: "house",
            unit_sub_type: "detached",
            unit_preference: "used",
            measurement: "sqm",
            total_area_sqm: "500",
            bedroom: "3",
            bathroom: "2",
            toilet: "2",
            total_units: "1",
            description: "A spacious family home",
            additional_units: [],
            state: "Lagos",
            city: "Ikeja",
            lga: "Ikeja",
            full_address: "123 Example Street",
            coordinate: "6.5244,3.3792",
            lat: 6.5244,
            lng: 3.3792,
            gated_estate: "yes",
            drainage: "yes",
            fence: "yes",
            interlocking: "no",
            parking_space: "yes",
            facilities: ["pool", "gym"],
            currency: "naira",
            fee_amount: "2000000",
            inspection_fee: "50000",
            agency_fee: "100000",
            security_fee: "50000",
            service_charge: "100000",
            total_package: "2300000",
            negotiation: "yes",
            branch: "Branch 1",
            account_manager: "Manager 1",
            owner_source: "Owner 1",
            activate_vat: "no",
            activate_joint_sales: "no",
            staff: "Staff 1",
            images: [
              "/empty/SampleProperty.jpeg",
              "/empty/SamplePropert2y.jpeg",
            ],
            video_link: "",
          });
        }, 1000);
      });

      setFormData(data);
    } catch (error) {
      console.error("Failed to fetch property data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) {
      setEditMode(true);
      fetchPropertyData();
    } else {
      setEditMode(false);
      setFormData(initialFormData);
    }
  }, [propertyId, fetchPropertyData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const updateFormField = useCallback(
    <K extends keyof PropertyFormData>(
      field: K,
      value: PropertyFormData[K]
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const addAdditionalUnit = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      additional_units: [
        ...prev.additional_units,
        {
          unit_type: "",
          unit_sub_type: "",
          bedroom: "",
          bathroom: "",
          toilet: "",
          total_units: "",
        },
      ],
    }));
  }, []);

  const removeAdditionalUnit = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      additional_units: prev.additional_units.filter((_, i) => i !== index),
    }));
  }, []);

  const updateAdditionalUnit = useCallback(
    (
      index: number,
      field: keyof PropertyFormData["additional_units"][number],
      value: string
    ) => {
      setFormData((prev) => {
        const newUnits = [...prev.additional_units];
        newUnits[index] = { ...newUnits[index], [field]: value };
        return { ...prev, additional_units: newUnits };
      });
    },
    []
  );

  const contextValue: EditPropertyContextType = {
    editMode,
    propertyId,
    formData,
    setFormData,
    resetForm,
    isLoading,
    setIsLoading,
    updateFormField,
    addAdditionalUnit,
    removeAdditionalUnit,
    updateAdditionalUnit,
  };

  return (
    <EditPropertyContext.Provider value={contextValue}>
      {children}
    </EditPropertyContext.Provider>
  );
};

export const useEditPropertyContext = () => {
  const context = useContext(EditPropertyContext);
  if (!context) {
    throw new Error(
      "useEditPropertyContext must be used within an EditPropertyProvider"
    );
  }
  return context;
};
