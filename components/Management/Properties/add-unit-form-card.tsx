import UnitCard from "./unit-card";
import { useState } from "react";

import UnitForm from "./unit-form";

// set d data structute and dont continue with any
const AddUnitFormCard = ({
  data,
  index,
  handleRemove,
}: {
  data: any;
  index: number;
  handleRemove: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div
      className="w-full p-6 rounded-2xl bg-white dark:bg-darkText-primary custom-flex-col gap-4"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {!isEditing ? (
        <UnitCard
          data={data}
          setIsEditing={setIsEditing}
          handleRemove={handleRemove}
        />
      ) : (
        <UnitForm
          index={index}
          empty={false}
          data={data}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default AddUnitFormCard;
