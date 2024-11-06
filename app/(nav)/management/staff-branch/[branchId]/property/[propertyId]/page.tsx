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
      id={1}
      propertyId={1}
      name="Property 1"
      units={1}
      price={1000}
      currency="Naira"
    />
  );
};

export default BranchPPropertyPreview;
