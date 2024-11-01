import PropertyPreview from "@/components/Management/Properties/property-preview";

const PropertyPreviewPage = ({
  params,
}: {
  params: { type: "rental" | "gated" };
}) => {
  // TODO: Get the property info from the database
  return (
    <PropertyPreview
      type={params.type}
      images={[
        "/empty/SampleProperty.jpeg",
        "/empty/SampleProperty2.jpeg",
        "/empty/SampleProperty3.jpeg",
        "/empty/SampleProperty4.png",
        "/empty/SampleProperty5.jpg",
      ]}
    />
  );
};

export default PropertyPreviewPage;
