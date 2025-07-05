import { Skeleton } from "@mui/material";
import AutoResizingGrid from "../AutoResizingGrid/AutoResizingGrid";
import { PropertyrequestSkeletonLoader } from "./property-request-loader";
import PageTitle from "../PageTitle/page-title";
import React from "react";
import { ThreadSkeletonLoader } from "@/app/(nav)/community/agent-forum/components";

interface IProps {
  pageTitle?: string;
  threadCard?: boolean;
  statCardsLength?: number;
}

const PropertyRequestPageLoader: React.FC<IProps> = (props) => {
  return (
    <div className="">
      <div className="hidden md:flex flex-wrap gap-5">
        {Array.from({ length: props.statCardsLength || 3 }).map((_, index) => (
          <Skeleton
            key={index}
            width={240}
            height={130}
            animation="wave"
            sx={{
              transform: "none",
            }}
          />
        ))}
      </div>
      <div className="page-title-container h-16">
        {props.pageTitle ? (
          <PageTitle title={props.pageTitle} />
        ) : (
          <Skeleton
            variant="text"
            width={150}
            height={30}
            animation="wave"
            sx={{
              transform: "none",
            }}
          />
        )}
      </div>

      <div className="mt-4">
        {props.threadCard ? (
          <AutoResizingGrid gap={28} minWidth={300}>
            <ThreadSkeletonLoader length={10} />
          </AutoResizingGrid>
        ) : (
          <AutoResizingGrid gap={28} minWidth={400}>
            <PropertyrequestSkeletonLoader length={10} />
          </AutoResizingGrid>
        )}
      </div>
    </div>
  );
};

export default PropertyRequestPageLoader;
