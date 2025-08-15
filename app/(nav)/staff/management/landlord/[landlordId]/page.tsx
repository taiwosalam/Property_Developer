import { redirect } from "next/navigation";

const Landlord = ({ params }: { params: { landlordId: string } }) => {
  redirect(`/staff/management/landlord/${params.landlordId}/manage`);
};

export default Landlord;
