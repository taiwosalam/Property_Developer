import UnitStatisticDetails from "@/components/UnitStatistic/UnitStatisticDetails";

const UnitStatistic = ({ params }: { params: { unitId: string } }) => {

  return (
    <>
      <UnitStatisticDetails id={params.unitId}/>
    </>
  );
};

export default UnitStatistic;
