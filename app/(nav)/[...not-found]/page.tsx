"use client";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import { useRouter } from "next/navigation";
import { PageNotFoundIcon } from "@/public/icons/icons";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="py-11 px-20 flex flex-col gap-10">
      <div className="w-full flex items-center justify-center">
        <div className="relative text-brand-9">
          <PageNotFoundIcon />
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <Button
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Go to Dashboard
        </Button>
      </div>
      <div className="flex flex-col gap-[15px]">
        <div>
          <p className="text-[#092C4C] dark:text-darkText-1 font-bold text-xl">
            Error: Page Not Found
          </p>
        </div>
        <div className="h-[2px] bg-[#C0C2C8] bg-opacity-20 w-full" />
        <div className="flex flex-col gap-7 text-text-secondary dark:text-darkText-2 font-normal text-sm">
          <div className="flex flex-col gap-5">
            <p>
              The page you are trying to access encountered an error due to one
              of the following reasons:
            </p>
            <div>
              <p>- The URL entered may be misspelled or incorrect.</p>
              <p>
                - The page might have been moved to a different location without
                updating the URL.
              </p>
              <p>- The page may have been deleted or no longer exists.</p>
              <p>
                - The link pointing to the page might be broken or outdated.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p>To resolve this issue:</p>
            <div>
              <p>
                - Use the browser&rsquo;s back button to return to the previous
                page.
              </p>
              <p>- Use the search function to locate the desired content.</p>
              <p>
                - Click on the &quot;Go to Dashboard&quot; button to return to
                the dashboard.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p>
              If the error persists, please click on your profile at the top
              right of the page to contact the support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
