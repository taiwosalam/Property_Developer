// Components
import dynamic from "next/dynamic";
const CreateRecordForm = dynamic(
  () => import("@/components//vehicles-record/create-record-form"),
  { ssr: false }
);

const CreateRecordPage = () => {
  return <CreateRecordForm />;
};

export default CreateRecordPage;
