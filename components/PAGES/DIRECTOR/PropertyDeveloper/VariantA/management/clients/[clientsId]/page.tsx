import { redirect } from "next/navigation";

const Client = ({ params }: { params: { clientsId: string } }) => {
  redirect(`/management/clients/${params.clientsId}/manage`);
};

export default Client;
