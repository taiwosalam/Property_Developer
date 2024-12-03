export const UseerSkeletonVehicleRecord = () => {
  return (
      <div className="flex flex-col xl:flex-row gap-5 animate-pulse">
            <div className="bg-gray-300 rounded-full w-30 h-30" /> {/* Skeleton for Picture */}
            <div className="custom-flex-col gap-4">
              <div className="custom-flex-col">
                <div className="flex items-center">
                  <div className="bg-gray-300 h-6 w-1/2 rounded" /> {/* Skeleton for full_name */}
                  <div className="bg-gray-300 h-6 w-6 rounded-full ml-2" /> {/* Skeleton for BadgeIcon */}
                </div>
                <div className="bg-gray-300 h-4 w-1/3 rounded" /> {/* Skeleton for phone_number */}
              </div>
              <div className="custom-flex-col gap-2">
                <div className="bg-gray-300 h-4 w-1/4 rounded" /> {/* Skeleton for UserTag */}
                <div className="bg-gray-300 h-4 w-1/4 rounded" /> {/* Skeleton for ID */}               
              </div>
            </div>
 </div>
  )
}