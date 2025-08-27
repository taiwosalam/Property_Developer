// import PropertyPreview from "@/components/Management/Properties/property-card";
import PropertyPreview from "@/components/Management/Properties/property-card";

const BranchPPropertyPreview = () => {
  return (
    <PropertyPreview
      property_type="facility"
      images={[
        "/empty/SampleProperty.jpeg",
        // "/empty/SampleProperty2.jpeg",
        // "/empty/SampleProperty3.jpeg",
        // "/empty/SampleProperty4.png",
        // "/empty/SampleProperty5.jpg",
      ]}
      address="123 Main St"
      total_income={1000000}
      total_returns={1000000}
      total_units={1}
      property_name="Property 1"
      category="facility"
      currency="naira"
      state="Lagos"
      local_government="Ikeja"
      // isRental={false}
      id="22"
      units={[]}
      total_unit_pictures={null}
      hasVideo={false}
      // units={[]}
    />
  );
};

export default BranchPPropertyPreview;
