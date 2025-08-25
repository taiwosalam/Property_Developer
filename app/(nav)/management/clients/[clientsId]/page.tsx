import { redirect } from "next/navigation";

const Landlord = ({ params }: { params: { landlordId: string } }) => {
  redirect(`/management/clients/${params.landlordId}/manage`);
};

export default Landlord;
