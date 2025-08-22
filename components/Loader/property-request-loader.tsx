import { RequestCardSkeleton } from "@/app/(nav)/community/agent-forum/components";

export const PropertyrequestSkeletonLoader = ({
  length,
}: {
  length: number;
}) => {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <RequestCardSkeleton key={index} />
      ))}
    </>
  );
};
