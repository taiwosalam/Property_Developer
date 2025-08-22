import { redirect } from "next/navigation";

const page = ({ params }: { params: { propertyId: string } }) => {
  return redirect(
    `/manager/management/properties/create-gated-estate-property/${params.propertyId}/add-unit`
  );
};

export default page;
