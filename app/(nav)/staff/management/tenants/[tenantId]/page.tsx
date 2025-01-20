import { redirect } from "next/navigation";

const Tenant = ({ params }: { params: { tenantId: string } }) => {
  // redirect(`/management/landlord/${params.tenantId}/manage`);
  redirect(`/management/tenants/${params.tenantId}/manage`);
};

export default Tenant;
