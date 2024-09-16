import React from "react";

// Types
import { KeyValueListProps } from "./types";

export const KeyValueList = <T extends object>({
  referenceObject,
  data = {},
  chunkSize = 3,
}: KeyValueListProps<T>) => {
  const keys = Object.keys(referenceObject) as Array<keyof T>; // Ensure keys are from the referenceObject

  const chunkArray = (arr: Array<keyof T>, size: number) =>
    arr.reduce(
      (acc, _, i) => (i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc),
      [] as Array<Array<keyof T>>
    );

  const chunkedKeys = chunkArray(keys, chunkSize); // Split keys into chunks

  return (
    <>
      {chunkedKeys.map((chunk, chunkIndex) => (
        <div
          key={chunkIndex}
          className="flex-1 flex gap-10 text-base font-medium capitalize"
        >
          <div className="custom-flex-col gap-4">
            {chunk.map((key) => (
              <p
                key={`${chunkIndex}-${String(key)}`}
                className="text-[#747474]"
              >
                {String(key).split("_").join(" ")}
              </p>
            ))}
          </div>
          <div className="custom-flex-col gap-4">
            {chunk.map((key) => (
              <p key={`${chunkIndex}-${String(key)}`} className="text-black">
                {/* Safely render the value or placeholder */}
                {data[key] !== undefined ? String(data[key]) : "---"}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default KeyValueList;
