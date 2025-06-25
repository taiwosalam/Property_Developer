import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";

const MessageUserProfileSkeleton = () => {
  return (
    <LandlordTenantModalPreset
      style={{ maxWidth: "614px" }}
      heading="Profile Details"
    >
      <div className="animate-pulse space-y-6 px-6 py-4">
        {/* Header section with image and name */}
        <div className="flex justify-center items-center gap-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-[100px] w-[100px]" />
          <div className="flex flex-col flex-1 gap-2">
            <div className="h-6 w-3/5 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 w-4/5 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>

        {/* Section heading */}
        <div className="h-5 w-24 rounded bg-gray-300 dark:bg-gray-700 mt-4" />

        {/* Contact Details */}
        <div className="space-y-4 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="w-2/3 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default MessageUserProfileSkeleton;
