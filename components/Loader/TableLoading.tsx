import Skeleton from "@mui/material/Skeleton";

const TableLoading = ({ length = 20 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length }).map((_, index) => (
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
  );
};

export default TableLoading;
