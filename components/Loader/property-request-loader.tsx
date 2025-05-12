import { RequestCardSkeleton } from "@/app/(nav)/management/agent-community/components";

export const PropertyrequestSkeletonLoader = ({ length }: { length: number }) => {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <RequestCardSkeleton key={index} />
      ))}
    </>
  );
};
