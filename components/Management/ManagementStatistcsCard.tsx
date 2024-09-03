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

const ManagementStatistcsCard = () => {
  const existingLandlords = 457;
  const newLandlords = 200;
  const totalLandlords = existingLandlords + newLandlords;

  return (
    <Card className="w-full">
      <CardContent className="py-5">
        <div className="flex justify-between space-x-5 items-center">
          <div className="space-y-6">
            <CardTitle className="text-sm font-bold text-brand-primary">
              Total Landlords
            </CardTitle>
            <p className="text-2xl font-bold text-text-label">
              {totalLandlords}
            </p>
          </div>
          <DonutChart
            oldValue={existingLandlords}
            newValue={newLandlords}
            oldColor="#0033C4"
            newColor="#01BA4C"
          />
        </div>
        <div className="text-xs text-neutral-4 text-right mt-1">this month</div>
      </CardContent>
    </Card>
  );
};

export default ManagementStatistcsCard;
