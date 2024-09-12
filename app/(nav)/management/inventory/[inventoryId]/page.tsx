import { redirect } from "next/navigation";

const Inventory = ({ params }: { params: { inventoryId: string } }) => {
  redirect(`/management/inventory/${params.inventoryId}/preview`);
};

export default Inventory;
