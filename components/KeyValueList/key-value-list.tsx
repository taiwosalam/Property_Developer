import React from "react";

// Types
import { KeyValueListProps } from "./types";

// Imports
import clsx from "clsx";

export const KeyValueList = <T extends object>({
  styles,
  data = {},
  chunkSize = 3,
  referenceObject,
  direction = "row",
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
          className={clsx("flex-1 text-base font-medium capitalize", {
            "flex gap-10": direction === "row",
            "custom-flex-col gap-6": direction === "column",
          })}
        >
          {direction === "column" ? (
            <>
              {chunk.map((key) => (
                <div
                  key={`${chunkIndex}-${String(key)}`}
                  className="custom-flex-col gap-2"
                >
                  <p
                    className="text-[#747474] whitespace-nowrap"
                    style={styles?.[key]?.label}
                  >
                    {String(key).split("_").join(" ")}
                  </p>
                  <p className="text-black" style={styles?.[key]?.value}>
                    {/* Safely render the value or placeholder */}
                    {data[key] !== undefined ? String(data[key]) : "---"}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="custom-flex-col gap-4">
                {chunk.map((key) => (
                  <p
                    key={`${chunkIndex}-${String(key)}`}
                    className="text-[#747474] whitespace-nowrap"
                    style={styles?.[key]?.label}
                  >
                    {String(key).split("_").join(" ")}
                  </p>
                ))}
              </div>
              <div className="custom-flex-col gap-4">
                {chunk.map((key) => (
                  <p
                    key={`${chunkIndex}-${String(key)}`}
                    className="text-black"
                    style={styles?.[key]?.value}
                  >
                    {/* Safely render the value or placeholder */}
                    {data[key] !== undefined ? String(data[key]) : "---"}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default KeyValueList;
