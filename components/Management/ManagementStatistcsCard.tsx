import clsx from "clsx";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/utils/number-formatter";

interface DonutChartProps {
  oldValue: number;
  newValue: number;
  oldColor: string;
  newColor: string;
}

const colors = {
  blue: "#0033C4",
  green: "#01BA4C",
  purple: "#8C62FF",
  orange: "#E15B0F",
  lightBlue: "#38BDF8",
  gray: "#B0B2B5",
};

const DonutChart: React.FC<DonutChartProps> = ({
  oldValue,
  newValue,
  oldColor,
  newColor,
}) => {
  const total = oldValue + newValue;
  const newPercentage = (newValue / total) * 100;
  const radius = 25;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke={oldColor}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {newValue > 0 && (
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke={newColor}
          strokeWidth="5"
          strokeDasharray={`${
            (newPercentage * circumference) / 100
          } ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 30 30)"
        />
      )}
      <text
        x="30"
        y="30"
        textAnchor="middle"
        dy=".35em"
        fontSize="16"
        fontWeight="bold"
        fill="#000"
        className="dark:fill-darkText-1"
      >
        {newValue > 99 ? "99+" : newValue}
      </text>
    </svg>
  );
};

interface ManagementStatistcsCardProps {
  total: number;
  title: string;
  newData: number;
  className?: string;
  colorScheme: 1 | 2 | 3 | 4;
}

const ManagementStatistcsCard: React.FC<ManagementStatistcsCardProps> = ({
  title,
  total,
  newData,
  className,
  colorScheme,
}) => {
  const old = total - newData;

  let oldColorScheme, newColorScheme;

  switch (colorScheme) {
    case 1:
      oldColorScheme = colors.blue;
      newColorScheme = colors.green;
      break;
    case 2:
      oldColorScheme = colors.purple;
      newColorScheme = colors.green;
      break;
    case 3:
      oldColorScheme = colors.orange;
      newColorScheme = colors.green;
      break;
    case 4:
      oldColorScheme = colors.lightBlue;
      newColorScheme = colors.green;
      break;
    default:
      oldColorScheme = colors.blue;
      newColorScheme = colors.green;
  }

  return (
    <Card
      className={clsx("w-[250px] h-[160px]", className)}
      style={{ boxShadow: "-2px 2px 10px rgba(21, 21, 21, 0.10)" }}
    >
      <CardContent className="h-full py-5">
        <div className="flex flex-col h-full justify-between">
          {/* Top section with title and donut */}
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-h-[60px] flex items-start">
              <CardTitle className="text-base font-bold text-brand-10 dark:text-darkText-1">
                {title}
              </CardTitle>
            </div>
            <div className="flex-shrink-0">
              <DonutChart
                oldValue={old || 0}
                newValue={newData || 0}
                newColor={newColorScheme}
                oldColor={oldColorScheme}
              />
            </div>
          </div>

          {/* Bottom section with total and "This month" */}
          <div className="flex justify-between items-end">
            <p className="text-[32px] font-bold text-text-label dark:text-darkText-1">
              {formatNumber(total)}
            </p>
            <p className="font-normal text-xs text-neutral-6 dark:text-darkText-2 whitespace-nowrap">
              This month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementStatistcsCard;
