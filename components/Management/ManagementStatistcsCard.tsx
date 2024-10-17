import React from "react";
import clsx from "clsx";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Skeleton from "@mui/material/Skeleton";
// import { PieChart, Pie, Cell } from "recharts";

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
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke={newColor}
        strokeWidth="5"
        // strokeDasharray={`${(newPercentage * (2 * Math.PI * 25)) / 100} 157`}
        strokeDasharray={`${
          (newPercentage * circumference) / 100
        } ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
      />
      <text
        x="30"
        y="30"
        textAnchor="middle"
        dy=".35em"
        fontSize="16"
        fontWeight="bold"
        fill="#000"
      >
        +{newValue}
      </text>
    </svg>
  );
};

// const DonutChart: React.FC<DonutChartProps> = ({
//   oldValue,
//   newValue,
//   oldColor,
//   newColor,
// }) => {
//   const data = [
//     { name: "Old", value: oldValue },
//     { name: "New", value: newValue },
//   ];
//   const COLORS = [oldColor, newColor];
//   return (
//     <PieChart width={70} height={70}>
//       <Pie
//         data={data}
//         cx="50%"
//         cy="50%"
//         innerRadius={20}
//         outerRadius={30}
//         fill="#8884d8"
//         paddingAngle={5}
//         dataKey="value"
//       >
//         {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//     </PieChart>
//   );
// };

interface ManagementStatistcsCardProps {
  total: number;
  title: string;
  newData: number;
  className?: string;
  oldColor?: React.CSSProperties["color"];
  newColor?: React.CSSProperties["color"];
  colorScheme?: number;
}

const ManagementStatistcsCard: React.FC<ManagementStatistcsCardProps> = ({
  title,
  total,
  newData,
  className,
  oldColor,
  newColor,
  colorScheme = 1,
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
    default:
      oldColorScheme = colors.blue;
      newColorScheme = colors.green;
  }

  return (
    <Card
      className={clsx("w-[250px] custom-flex-col justify-center", className)}
      style={{ boxShadow: "-2px 2px 10px rgba(21, 21, 21, 0.10)" }}
    >
      <CardContent className="py-5">
        <div className="flex gap-4 justify-between">
          <div className="flex flex-col gap-y-3">
            <CardTitle className="text-base font-bold text-brand-10">
              {title}
            </CardTitle>
            <p className="text-[32px] font-bold text-text-label">{total}</p>
          </div>
          <div className="flex flex-col gap-y-3">
            <DonutChart
              oldValue={old || 0}
              newValue={newData || 0}
              newColor={newColor || newColorScheme}
              oldColor={oldColor || oldColorScheme}
            />
            <p
              className="font-normal text-xs text-neutral-6 text-right"
              style={{ whiteSpace: "nowrap" }}
            >
              This month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementStatistcsCard;
