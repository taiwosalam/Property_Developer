import { redirect } from "next/navigation";

const ApplicationDetailsPage = ({ params }: { params: { applicationId: string } }) => {
  redirect(`/application/${params.applicationId}/manage`);
};

export default ApplicationDetailsPage;
