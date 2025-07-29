import { redirect } from "next/navigation";

const Tenant = ({ params }: { params: { tenantId: string } }) => {
  redirect(`/staff/management/tenants/${params.tenantId}/manage`);
};

export default Tenant;
