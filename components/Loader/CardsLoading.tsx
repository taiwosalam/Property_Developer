import Skeleton from "@mui/material/Skeleton";

const CardsLoading = () => {
  return (
    <>
      {Array.from({ length: 20 }).map((_, index) => (
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
    </>
  );
};

export default CardsLoading;
