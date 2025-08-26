import { redirect } from "next/navigation";

const Client = ({ params }: { params: { clientId: string } }) => {
  redirect(`/management/clients/${params.clientId}/manage`);
};

export default Client;
