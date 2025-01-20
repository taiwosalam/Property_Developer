import { redirect } from "next/navigation";

const Application = ({ params }: { params: { applicationId: string } }) => {
  redirect(`/applications/${params.applicationId}/manage`);
};

export default Application;
