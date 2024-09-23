import React from "react";

interface ActivityItemProps {
  label: string;
  description: string;
  time: string;
  color: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  label,
  description,
  time,
  color,
}) => {
  return (
    <div className="flex items-start p-2">
      <div className={`w-1 h-10 mr-4 ${color}`}></div>
      <div>
        <div className="text-sm">
          <span className="font-bold">
            {label}
            {" || "}
          </span>
          <span>{description}</span>
        </div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
  );
};

const BranchActivitiesCard = () => {
  const activities = [
    {
      label: "Complain",
      description:
        "Adedeji to go on a site inspection by 12:30 pm at Akinyele, Ibadan.",
      time: "",
      color: "bg-teal-500",
    },
    {
      label: "New Payment",
      description:
        "Adedeji to go on a site inspection by 12:30 pm at Akinyele, Ibadan.",
      time: "",
      color: "bg-orange-400",
    },
    {
      label: "Inspection",
      description:
        "Adedeji to go on a site inspection by 12:30 pm at Akinyele, Ibadan.",
      time: "",
      color: "bg-green-500",
    },
    {
      label: "Rent due",
      description:
        "Adedeji to go on a site inspection by 12:30 pm at Akinyele, Ibadan.",
      time: "",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="bg-brand-1 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center p-4">
        <div>
          <h2 className="font-medium text-sm">Branch Activities</h2>
          <span className="text-text-label text-sm font-medium">
            25 January 2023
          </span>
        </div>
        <div className="flex space-x-5 items-center text-gray-500">
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </div>

      <div className="bg-white py-4 px-2 text-text-primary rounded-b-lg">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            label={activity.label}
            description={activity.description.substring(0, 65).concat("...")}
            time={activity.time}
            color={activity.color}
          />
        ))}
      </div>
    </div>
  );
};

export default BranchActivitiesCard;
