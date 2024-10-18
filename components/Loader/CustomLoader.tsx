"use client";
import Skeleton from "@mui/material/Skeleton";
import PageTitle from "../PageTitle/page-title";

interface CustomLoaderProps {
  hasStartCards?: boolean;
  statsCardCount?: number;
  hasPageTitle?: boolean;
  pageTitle?: string;
  dashboard?: boolean;
  tableView?: boolean;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  hasStartCards = true,
  statsCardCount = 3,
  hasPageTitle = true,
  pageTitle,
  dashboard = false,
  tableView = false,
}) => {
  return (
    <div className="max-h-[calc(100vh-200px)] space-y-9 overflow-y-hidden">
      {dashboard ? (
        <div className="flex flex-col xl:flex-row gap-x-10 gap-y-6">
          <div className="xl:flex-1 flex py-1.5 xl:py-7 overflow-x-auto md:overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton
                key={index}
                className="min-w-[270px] md:min-w-full"
                height={130}
                animation="wave"
                sx={{
                  transform: "none",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <div className="xl:w-[30%] xl:max-w-[342px] grid md:grid-cols-2 xl:grid-cols-1 gap-6 py-1.5 xl:py-7">
            <Skeleton
              width={"100%"}
              height={190}
              animation="wave"
              sx={{
                transform: "none",
              }}
            />
            <Skeleton
              width={"100%"}
              height={190}
              animation="wave"
              sx={{
                transform: "none",
              }}
            />
          </div>
        </div>
      ) : (
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
              {pageTitle ? (
                <PageTitle title={pageTitle} />
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

          {tableView ? (
            <div className="table-view-loading grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  width={"100%"}
                  height={50}
                  animation="wave"
                  sx={{
                    transform: "none",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 15 }).map((_, index) => (
                <Skeleton
                  key={index}
                  width={"100%"}
                  height={140}
                  animation="wave"
                  sx={{
                    transform: "none",
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomLoader;
