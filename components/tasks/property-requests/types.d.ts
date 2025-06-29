export interface PropertyRequestModalProps {
  state: string;
  lga: string;
  propertyType: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  minBudget: string;
  maxBudget: string;
  subType: string;
  requestType: string;
  userName: string;
  phoneNumber: string;
  description: string;
  location?: string
}

export interface LabelValuePairProps {
  label: string;
  value: string;
}
