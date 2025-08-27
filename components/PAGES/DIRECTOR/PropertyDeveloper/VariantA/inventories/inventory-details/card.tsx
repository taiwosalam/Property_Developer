"use client";

import React from "react";
import { TrendingUp, TrendingDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { FiMinus } from "react-icons/fi";
import CustomTable from "@/components/Table/table";

// TypeScript interfaces
interface StatsCardData {
  title: string;
  totalPrice: string;
  quantity: number;
  quantityLabel: string;
  trend: {
    percentage: number;
    isPositive: boolean;
    description: string;
  };
  bgColor: string;
  textColor: string;
  trendColor: string;
}

interface StatsCardProps {
  data: StatsCardData;
}

interface StatsCardsGridProps {
  cards: StatsCardData[];
}

// Individual Stats Card Component
const StatsCard: React.FC<StatsCardProps> = ({ data }) => {
  const TrendIcon = data.trend.isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={`${data.bgColor} rounded-lg px-8 py-6 shadow-sm`}>
      {/* Title */}
      <h3 className={`${data.textColor} text-lg  font-medium mb-3`}>
        {data.title}
      </h3>

      {/* Main Stats Row */}
      <div className="flex justify-between items-start mb-3">
        {/* Total Price */}
        <div>
          <p className={`${data.textColor} text-2xl font-bold`}>
            {data.totalPrice}
          </p>
          <p className={`${data.textColor} opacity-70 text-xs mt-1`}>
            Total Price
          </p>
        </div>

        {/* Quantity */}
        <div className="text-right">
          <p className={`${data.textColor} text-2xl font-bold`}>
            {data.quantity}
          </p>
          <p className={`${data.textColor} opacity-70 text-sm mt-1`}>
            {data.quantityLabel}
          </p>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center gap-1">
        <TrendIcon className={`w-4 h-4 ${data.trendColor}`} />
        <span className={`text-sm font-medium ${data.trendColor}`}>
          {data.trend.percentage}%
        </span>
        <span className={`${data.textColor} opacity-70 text-sm`}>
          {data.trend.description}
        </span>
      </div>
    </div>
  );
};

// Stats Cards Grid Component
export const StatsCardsGrid: React.FC<StatsCardsGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[90%]">
      {cards.map((card, index) => (
        <StatsCard key={index} data={card} />
      ))}
    </div>
  );
};

export const statsCards: StatsCardData[] = [
  {
    title: "Total Record",
    totalPrice: "₦6,506,689",
    quantity: 456,
    quantityLabel: "Total Quantity",
    trend: {
      percentage: 53,
      isPositive: true,
      description: "Up from yesterday",
    },
    bgColor: "bg-blue-50",
    textColor: "text-gray-800",
    trendColor: "text-green-500",
  },
  {
    title: "Total Orderd",
    totalPrice: "₦6,506,689",
    quantity: 5664,
    quantityLabel: "Total Quantity",
    trend: {
      percentage: 4.3,
      isPositive: false,
      description: "Down from last week",
    },
    bgColor: "bg-purple-50",
    textColor: "text-gray-800",
    trendColor: "text-red-500",
  },
  {
    title: "Total Available",
    totalPrice: "₦6,506,689",
    quantity: 654,
    quantityLabel: "Total Quantity",
    trend: {
      percentage: 53,
      isPositive: true,
      description: "Up from yesterday",
    },
    bgColor: "bg-green-50",
    textColor: "text-gray-800",
    trendColor: "text-green-500",
  },
  {
    title: "Total To Return",
    totalPrice: "₦6,506,689",
    quantity: 765,
    quantityLabel: "Total Quantity",
    trend: {
      percentage: 53,
      isPositive: true,
      description: "Up from yesterday",
    },
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    trendColor: "text-green-500",
  },
];

// Main Demo Component
const InventoryStatsDemo: React.FC = () => {
  // Mock data matching the screenshot exactly

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Inventory Statistics Cards
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <StatsCardsGrid cards={statsCards} />
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-gray-800 text-green-400 p-4 rounded-lg text-sm font-mono">
          <div className="text-white mb-2">Usage Example:</div>
          {`<StatsCardsGrid cards={statsCardsData} />`}
        </div>
      </div>
    </div>
  );
};

export default InventoryStatsDemo;

interface ReturnItem {
  id: string;
  image: string;
  name: string;
  price: number;
  totalUnit: number;
  totalAvailable: number;
  returnUnit: number;
}

// Mock data
const mockReturnData: ReturnItem[] = [
  {
    id: "1",
    image: "/images/item1.png",
    name: "Item A",
    price: 100,
    totalUnit: 20,
    totalAvailable: 15,
    returnUnit: 0,
  },
  {
    id: "2",
    image: "/images/item2.png",
    name: "Item B",
    price: 150,
    totalUnit: 10,
    totalAvailable: 8,
    returnUnit: 0,
  },
  {
    id: "1",
    image: "/images/item1.png",
    name: "Item A",
    price: 100,
    totalUnit: 20,
    totalAvailable: 15,
    returnUnit: 0,
  },
  {
    id: "1",
    image: "/images/item1.png",
    name: "Item A",
    price: 100,
    totalUnit: 20,
    totalAvailable: 15,
    returnUnit: 0,
  },
  {
    id: "1",
    image: "/images/item1.png",
    name: "Item A",
    price: 100,
    totalUnit: 20,
    totalAvailable: 15,
    returnUnit: 0,
  },
  {
    id: "1",
    image: "/images/item1.png",
    name: "Item A",
    price: 100,
    totalUnit: 20,
    totalAvailable: 15,
    returnUnit: 0,
  },
  {
    id: "1",
    image: "/images/item1.png",
    name: "Item A",
    price: 100,
    totalUnit: 20,
    totalAvailable: 15,
    returnUnit: 0,
  },
  {
    id: "1",
    image: "/images/item1.png",
    name: "Item A",
    price: 100,
    totalUnit: 20,
    totalAvailable: 15,
    returnUnit: 0,
  },
];

export const ReturnItemsTable: React.FC = () => {
  const [items, setItems] = useState(mockReturnData);

  const handleReturnUnitChange = (id: string, value: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, returnUnit: value } : item
      )
    );
  };

  const fields = [
    { id: "image", accessor: "image", isImage: true, label: "", picSize: 50 },
    { id: "name", accessor: "name", label: "Item Name" },
    {
      id: "price",
      accessor: "price",
      label: "Price (per unit)",
      cellStyle: { minWidth: "120px" },
    },
    {
      id: "totalUnit",
      accessor: "totalUnit",
      label: "Total Unit",
    },
    {
      id: "totalAvailable",
      accessor: "totalAvailable",
      label: "Total Available",
    },
    {
      id: "returnUnit",
      accessor: "returnUnit",
      label: "Return Unit",
      contentStyle: { display: "flex", gap: "8px", alignItems: "center" },
      cellRenderer: (item: ReturnItem) => (
        <div className="flex gap-2 items-center">
          <Input
            id="Input"
            type="number"
            value={item.returnUnit}
            onChange={(val) => handleReturnUnitChange(item.id, Number(val))}
            className="w-[80px]"
            min={0}
            max={item.totalAvailable}
          />
          <Button
            type="button"
            onClick={() => console.log("Minus clicked", item.id)}
            className="size-8 !bg-white !text-red-600 !border !border-red-600 grid place-items-center !p-0 rounded-full"
          >
            <FiMinus />
          </Button>
        </div>
      ),
    },
  ];

  return <CustomTable data={items} fields={fields} />;
};

import { ChevronLeft, ChevronRight } from "lucide-react";

// TypeScript interfaces
interface InventoryDetailsData {
  addedDate: string;
  creatorName: string;
  orderRate: string;
  lastEdited: string;
}

interface OrderActivity {
  id: string;
  type: "order" | "return";
  customerName: string;
  description: string;
  time: string;
}

interface OrderActivitiesData {
  date: string;
  activities: OrderActivity[];
}

interface InventoryDetailsCardProps {
  data: InventoryDetailsData;
}

interface OrderActivitiesCardProps {
  activitiesData: OrderActivitiesData[];
  currentDateIndex: number;
  onDateChange: (index: number) => void;
}

export const InventoryDetailsCard: React.FC<InventoryDetailsCardProps> = ({
  data,
}) => {
  const fields = [
    { label: "Added Date", value: data.addedDate },
    { label: "Creator Name", value: data.creatorName },
    { label: "Order Rate", value: data.orderRate },
    { label: "Last Edited", value: data.lastEdited },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.label} className="flex justify-between items-center">
            <span className=" text-gray-500 text-lg">{field.label}</span>
            <span className="font-medium text-gray-800">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Activities Card Component
export const OrderActivitiesCard: React.FC<OrderActivitiesCardProps> = ({
  activitiesData,
  currentDateIndex,
  onDateChange,
}) => {
  const currentData = activitiesData[currentDateIndex];
  const hasActivities = currentData && currentData.activities.length > 0;

  const handlePrevDate = (): void => {
    if (currentDateIndex > 0) {
      onDateChange(currentDateIndex - 1);
    }
  };

  const handleNextDate = (): void => {
    if (currentDateIndex < activitiesData.length - 1) {
      onDateChange(currentDateIndex + 1);
    }
  };

  const getActivityIcon = (type: "order" | "return"): string => {
    return type === "order" ? "🔵" : "🟠";
  };

  const getActivityBorderColor = (type: "order" | "return"): string => {
    return type === "order" ? "border-l-blue-400" : "border-l-orange-400";
  };

  return (
    <div className="bg-white overflow-hidden rounded-xl shadow-md border border-gray-200 ">
      {/* Header */}

      <div className="all px-4 py-2 bg-blue-50">
        <div className="flex justify-between  items-center mb-1">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Order Activities
            </h3>
            <p className="text-sm text-gray-500 mb-4">{currentData?.date}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDate}
              disabled={currentDateIndex === 0}
              className={`p-1 rounded ${
                currentDateIndex === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextDate}
              disabled={currentDateIndex === activitiesData.length - 1}
              className={`p-1 rounded ${
                currentDateIndex === activitiesData.length - 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 "
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date */}
      </div>

      {/* Activities */}
      <div className="space-y-3 p-4">
        {hasActivities ? (
          currentData.activities.map((activity) => (
            <div
              key={activity.id}
              className={`border-l-4 pl-3 py-2 ${getActivityBorderColor(
                activity.type
              )}`}
            >
              <div className="flex items-start gap-2">
                {/* <span className="text-lg leading-none mt-0.5">
                  {getActivityIcon(activity.type)}
                </span> */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {activity.type === "order" ? "Order" : "Return Order"} ||{" "}
                    {activity.customerName} {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No events for this date</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const orderActivitiesData: OrderActivitiesData[] = [
  {
    date: "25 January 2023",
    activities: [
      {
        id: "1",
        type: "order",
        customerName: "Ajadi David",
        description: "order 50KG Cement 10 unit at 25/01/2023 (3:33pm)",
        time: "25/01/2023 (3:33pm)",
      },
      {
        id: "2",
        type: "return",
        customerName: "Ajadi David",
        description: "return Glove 10 unit at 25/01/2023 (3:33pm)",
        time: "25/01/2023 (3:33pm)",
      },
      {
        id: "3",
        type: "order",
        customerName: "Ajadi David",
        description: "order 50KG Cement 10 unit at 26/01/2023 (3:33pm)",
        time: "26/01/2023 (3:33pm)",
      },
      {
        id: "4",
        type: "return",
        customerName: "Ajadi David",
        description: "return Glove 10 unit at 25/01/2023 (3:33pm)",
        time: "25/01/2023 (3:33pm)",
      },
    ],
  },
  {
    date: "26 January 2023",
    activities: [
      {
        id: "5",
        type: "order",
        customerName: "John Smith",
        description: "order 30KG Sand 5 unit at 26/01/2023 (2:15pm)",
        time: "26/01/2023 (2:15pm)",
      },
      {
        id: "6",
        type: "order",
        customerName: "Sarah Johnson",
        description: "order Iron Rod 20 unit at 26/01/2023 (4:45pm)",
        time: "26/01/2023 (4:45pm)",
      },
    ],
  },
  {
    date: "27 January 2023",
    activities: [],
  },
  {
    date: "28 January 2023",
    activities: [
      {
        id: "7",
        type: "return",
        customerName: "Mike Brown",
        description: "return Wheelbarrow 2 unit at 28/01/2023 (1:20pm)",
        time: "28/01/2023 (1:20pm)",
      },
    ],
  },
];

export const inventoryDetails: InventoryDetailsData = {
  addedDate: "21/02/2024",
  creatorName: "Amori Ademakinwa",
  orderRate: "121 order",
  lastEdited: "3 hours ago",
};

// Main Demo Component
export const InventoryInfoCardsDemo: React.FC = () => {
  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);

  // Mock data for inventory details

  // Mock data for order activities with different dates

  const handleDateChange = (index: number): void => {
    setCurrentDateIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Inventory Info Cards
        </h1>

        <div className="space-y-4">
          {/* Inventory Details Card */}
          <InventoryDetailsCard data={inventoryDetails} />

          {/* Order Activities Card */}
          <OrderActivitiesCard
            activitiesData={orderActivitiesData}
            currentDateIndex={currentDateIndex}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-800 text-white rounded-lg text-sm">
          <p>Current Date: {orderActivitiesData[currentDateIndex]?.date}</p>
          <p>
            Activities:{" "}
            {orderActivitiesData[currentDateIndex]?.activities.length || 0}
          </p>
          <p>
            Date Index: {currentDateIndex + 1} of {orderActivitiesData.length}
          </p>
        </div>
      </div>
    </div>
  );
};
