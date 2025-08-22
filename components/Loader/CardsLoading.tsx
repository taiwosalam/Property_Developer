import Skeleton from "@mui/material/Skeleton";

const CardsLoading = ({ length = 20, className}: {length?: number, className?: string}) => {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <Skeleton
          key={index}
          width={"100%"}
          height={140}
          animation="wave"
          sx={{
            transform: "none",
          }}
          className={className}
        />
      ))}
    </>
  );
};

export default CardsLoading;
