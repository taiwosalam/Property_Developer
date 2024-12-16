import Skeleton from "@mui/material/Skeleton";

const CardsLoading = ({ length = 20 }) => {
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
        />
      ))}
    </>
  );
};

export default CardsLoading;
