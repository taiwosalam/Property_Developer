import { redirect } from "next/navigation";

const Tenant = ({ params }: { params: { tenantId: string } }) => {
  redirect(`/management/landlord/${params.tenantId}/manage`);
};

export default Tenant;
