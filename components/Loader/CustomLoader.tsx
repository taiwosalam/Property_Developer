import Skeleton from "@mui/material/Skeleton";
import PageTitle from "../PageTitle/page-title";

interface CustomLoaderProps {
  hasStartCards?: boolean;
  statsCardCount?: number;
  hasPageTitle?: boolean;
  pageTitle?: string;
  // tableView?: boolean;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  hasStartCards = true,
  statsCardCount = 3,
  hasPageTitle = true,
  pageTitle,
  // tableView = false,
}) => {
  const skeletonCount = window.innerWidth > 1920 ? 15 : 9; // Example threshold for TV screens
  return (
    <div className="max-h-[calc(100vh-200px)] space-y-9 overflow-y-hidden">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: skeletonCount }).map((_, index) => (
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
    </div>
  );
};

export default CustomLoader;
