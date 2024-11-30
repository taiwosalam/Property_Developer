import PropertyPreview from "@/components/Management/Properties/property-preview";

const BranchPPropertyPreview = () => {
  return (
    <PropertyPreview
      propertyType="facility"
      images={[
        "/empty/SampleProperty.jpeg",
        // "/empty/SampleProperty2.jpeg",
        // "/empty/SampleProperty3.jpeg",
        // "/empty/SampleProperty4.png",
        // "/empty/SampleProperty5.jpg",
      ]}
      address="123 Main St"
      annual_income={1000000}
      annual_returns={1000000}
      total_units={1}
      property_name="Property 1"
      category="facility"
      currency="naira"
      state="Lagos"
      local_government="Ikeja"
      fee_period="Monthly"
      isRental={false}
      id="22"
      units={[]}
    />
  );
};

export default BranchPPropertyPreview;
