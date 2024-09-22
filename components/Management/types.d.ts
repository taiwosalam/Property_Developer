export interface LandlordTenantModalPresetProps {
  back?: {
    handleBack: () => void;
  };
  star?: boolean;
  heading: string;
  children: React.ReactNode;
}
