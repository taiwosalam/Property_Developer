import { redirect } from "next/navigation";

const Disbursement = ({ params }: { params: { disbursementId: string } }) => {
  redirect(
    `/accounting/disbursement/${params.disbursementId}/manage-disbursement`
  );
};

export default Disbursement;
