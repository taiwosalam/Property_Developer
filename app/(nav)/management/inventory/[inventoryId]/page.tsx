import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const Inventory = () => {
  const router = useRouter();
  const { landlordId } = useParams();

  useEffect(() => {
    router.replace(`/management/inventory/${landlordId}/manage`);
  }, [router, landlordId]);

  return null;
};

export default Inventory;
