import Skeleton from "@mui/material/Skeleton";

const DashboardLoading = () => {
  return (
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
  );
};

export default DashboardLoading;
