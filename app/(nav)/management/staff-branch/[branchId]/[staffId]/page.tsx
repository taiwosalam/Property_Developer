import { redirect } from "next/navigation";

const Inventory = ({
  params,
}: {
  params: { branchId: string; staffId: string };
}) => {
  redirect(
    `/management/staff-branch/${params.branchId}/${params.staffId}/staff-profile`
  );
};

export default Inventory;
