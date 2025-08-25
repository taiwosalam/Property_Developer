import { redirect } from "next/navigation";

const page = ({ params }: { params: { propertyId: string } }) => {
  return redirect(
    `/management/properties/create-outright-property/${params.propertyId}/add-unit`
  );
};

export default page;
