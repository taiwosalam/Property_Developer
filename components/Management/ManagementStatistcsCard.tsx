import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DonutChartProps {
  oldValue: number;
  newValue: number;
  oldColor: string;
  newColor: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  oldValue,
  newValue,
  oldColor,
  newColor,
}) => {
  const total = oldValue + newValue;
  const newPercentage = (newValue / total) * 100;

  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle
        cx="30"
        cy="30"
        r="27"
        fill="none"
        stroke={oldColor}
        strokeWidth="6"
      />
      <circle
        cx="30"
        cy="30"
        r="27"
        fill="none"
        stroke={newColor}
        strokeWidth="6"
        strokeDasharray={`${newPercentage * 1.696} 170`}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
      />
      <text
        x="30"
        y="30"
        textAnchor="middle"
        dy=".3em"
        fontSize="14"
        fontWeight="bold"
        fill="#000"
      >
        +{newValue}
      </text>
    </svg>
  );
};

const ManagementStatistcsCard = ({
  title,
  old,
  newData,
  total,
}: {
  title: string;
  old: number;
  newData: number;
  total: number;
}) => {
  return (
    <Card
      className="w-full"
      style={{ boxShadow: "-2px 2px 10px rgba(21, 21, 21, 0.10)" }}
    >
      <CardContent className="py-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-3">
            <CardTitle className="text-base font-bold text-brand-10">
              {title}
            </CardTitle>
            <p className="text-[32px] font-bold text-text-label">{total}</p>
          </div>
          <div className="flex flex-col gap-y-3 ml-5">
            <DonutChart
              oldValue={old || 0}
              newValue={newData || 0}
              newColor={
                title === "Web Landlords" ||
                title === "Total Properties" ||
                title === "Web Tenants"
                  ? "#8C62FF"
                  : title === "Mobile Landlords" ||
                    title === "Total Staff" ||
                    title === "Mobile Tenants"
                  ? "#E15B0F"
                  : "#01BA4C"
              }
              oldColor="#0033C4"
            />
            <p className="font-normal text-xs text-neutral-6 text-right">
              this month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementStatistcsCard;
