import React from "react";
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
        r="25"
        fill="none"
        stroke={oldColor}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle
        cx="30"
        cy="30"
        r="25"
        fill="none"
        stroke={newColor}
        strokeWidth="5"
        strokeDasharray={`${(newPercentage * (2 * Math.PI * 25)) / 100} 157`} // Correct formula
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
      />
      <text
        x="30"
        y="30"
        textAnchor="middle"
        dy=".35em"
        fontSize="14"
        fontWeight="bold"
        fill="#000"
      >
        +{newValue}
      </text>
    </svg>
  );
};

interface ManagementStatistcsCardProps {
  total: number;
  title: string;
  newData: number;
}

const ManagementStatistcsCard: React.FC<ManagementStatistcsCardProps> = ({
  title,
  total,
  newData,
}) => {
  const old = total - newData;
  return (
    <Card
      className="w-full"
      style={{ boxShadow: "-2px 2px 10px rgba(21, 21, 21, 0.10)" }}
    >
      <CardContent className="py-5">
        <div className="flex gap-4 justify-between items-center">
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
              This month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagementStatistcsCard;
