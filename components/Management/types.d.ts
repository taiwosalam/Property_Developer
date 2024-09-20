export interface LandlordTenantModalPresetProps {
  back?: {
    handleBack: () => void;
  };
  heading: string;
  children: React.ReactNode;
}
