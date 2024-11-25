import Skeleton from "@mui/material/Skeleton";
import PageTitle from "../PageTitle/page-title";
import type { CustomLoaderProps } from "./types";
import {
  LoadingProfileInfo,
  LoadingProfileCard,
  LoadingEditProfile,
} from "./LoadingProfile";
import DashboardLoading from "./DashboardLoading";
import TableLoading from "./TableLoading";
import CardsLoading from "./CardsLoading";

const CustomLoader: React.FC<CustomLoaderProps> = (props) => {
  const { layout } = props;

  // Apply defaults only when layout is 'page' and the props are not provided
  const view = layout === "page" ? props.view || "grid" : undefined;
  const hasStartCards =
    layout === "page" ? props.hasStartCards ?? true : undefined;
  const statsCardCount =
    layout === "page" ? props.statsCardCount ?? 3 : undefined;
  const hasPageTitle =
    layout === "page" ? props.hasPageTitle ?? true : undefined;

  return (
    <div className="h-[calc(100vh-200px)] space-y-9 overflow-y-hidden">
      {layout === "dasboard" ? (
        <DashboardLoading />
      ) : layout === "page" ? (
        <>
          {hasStartCards && (
            <div className="hidden md:flex flex-wrap gap-5">
              {Array.from({ length: 1 }).map((_, index) => (
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
          )}

          {hasPageTitle && (
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
          )}

          {view === "table" ? (
            <TableLoading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <CardsLoading />
            </div>
          )}
        </>
      ) : layout === "profile" ? (
        <div className="grid lg:grid-cols-2 gap-y-5 gap-x-8">
          <LoadingProfileInfo />
          {Array.from({ length: 15 }).map((_, index) => (
            <LoadingProfileCard key={index} />
          ))}
        </div>
      ) : layout === "edit-page" ? (
        <LoadingEditProfile pageTitle={props.pageTitle} />
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default CustomLoader;
