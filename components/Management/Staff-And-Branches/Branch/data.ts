import { toast } from "sonner";

export const createNewBranch = async (
  data: FormData,
  access_token: string | null
) => {
  let isSuccess = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/branches`,
      {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${access_token}`,
          // "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast.error(
        result.message || "An error occurred while creating the branch"
      );
      return isSuccess;
    }

    toast.success(result.message);

    isSuccess = true;
  } catch (error) {
    console.error("Error creating a new branch:", error);
    toast.error("An error occurred. Please try again.");
  }

  return isSuccess;
};
