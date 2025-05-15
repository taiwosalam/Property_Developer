
// import { KeyValueListProps } from "./types";
// import clsx from "clsx";

// export const KeyValueList = <T extends object>({
//   styles,
//   data = {},
//   chunkSize = 3,
//   referenceObject,
//   direction = "row",
//   truncateLength,
// }: KeyValueListProps<T>) => {
//   const keys = Object.keys(referenceObject) as Array<keyof T>;

//   // Helper function to truncate text
//   const truncateText = (text: string, length?: number): string => {
//     if (length === undefined || text.length <= length) {
//       return text;
//     }
//     return text.slice(0, length) + "...";
//   };

//   // Helper function to check if a value is valid
//   const isValidValue = (value: any): boolean => {
//     return value !== undefined && value !== null && value !== "";
//   };

//   // Filter keys to only include those with valid values
//   const validKeys = keys.filter((key) => isValidValue(data[key]));

//   const chunkArray = (arr: Array<keyof T>, size: number) =>
//     arr.reduce(
//       (acc, _, i) => (i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc),
//       [] as Array<Array<keyof T>>
//     );

//   const chunkedKeys = chunkArray(validKeys, chunkSize);

//   // If no valid keys, return null or an empty fragment
//   if (validKeys.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       {chunkedKeys.map((chunk, chunkIndex) => (
//         <div
//           key={chunkIndex}
//           className={clsx("flex-1 text-base font-medium capitalize", {
//             "flex gap-10": direction === "row",
//             "custom-flex-col gap-6": direction === "column",
//           })}
//         >
//           {direction === "column" ? (
//             <>
//               {chunk.map((key) => (
//                 <div
//                   key={`${chunkIndex}-${String(key)}`}
//                   className="custom-flex-col gap-2"
//                 >
//                   <p
//                     className="text-[#747474] dark:text-darkText-1 whitespace-nowrap"
//                     style={styles?.[key]?.label}
//                   >
//                     {String(key).split("*").join(" ")}
//                   </p>
//                   <p
//                     className="text-black dark:text-darkText-2 line-clamp-1"
//                     style={styles?.[key]?.value}
//                   >
//                     {truncateText(String(data[key]), truncateLength)}
//                   </p>
//                 </div>
//               ))}
//             </>
//           ) : (
//             <>
//               <div className="custom-flex-col gap-4">
//                 {chunk.map((key) => (
//                   <p
//                     key={`${chunkIndex}-${String(key)}`}
//                     className="text-[#747474] dark:text-darkText-1 whitespace-nowrap"
//                     style={styles?.[key]?.label}
//                   >
//                     {String(key).split("*").join(" ")}
//                   </p>
//                 ))}
//               </div>
//               <div className="custom-flex-col gap-4">
//                 {chunk.map((key) => (
//                   <p
//                     key={`${chunkIndex}-${String(key)}`}
//                     className="text-black dark:text-darkText-2"
//                     style={styles?.[key]?.value}
//                   >
//                     {truncateText(String(data[key]), truncateLength)}
//                   </p>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       ))}
//     </>
//   );
// };

// export default KeyValueList;





























import { KeyValueListProps } from "./types";
import clsx from "clsx";

export const KeyValueList = <T extends object>({
  styles,
  data = {},
  chunkSize = 3,
  referenceObject,
  direction = "row",
  truncateLength, // Add truncateLength prop
}: KeyValueListProps<T>) => {
  const keys = Object.keys(referenceObject) as Array<keyof T>;

  // Helper function to truncate text
  const truncateText = (text: string, length?: number): string => {
    if (length === undefined || text.length <= length) {
      return text;
    }
    return text.slice(0, length) + "...";
  };

  const chunkArray = (arr: Array<keyof T>, size: number) =>
    arr.reduce(
      (acc, _, i) => (i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc),
      [] as Array<Array<keyof T>>
    );

  const chunkedKeys = chunkArray(keys, chunkSize);

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
                    className="text-[#747474] dark:text-darkText-1 whitespace-nowrap"
                    style={styles?.[key]?.label}
                  >
                    {String(key).split("_").join(" ")}
                  </p>
                  <p
                    className="text-black dark:text-darkText-2 line-clamp-1"
                    style={styles?.[key]?.value}
                  >
                    {/* Apply truncation to the value */}
                    {data && data[key] !== undefined
                      ? truncateText(String(data[key]), truncateLength)
                      : "---"}
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
                    className="text-[#747474] dark:text-darkText-1 whitespace-nowrap"
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
                    className="text-black dark:text-darkText-2"
                    style={styles?.[key]?.value}
                  >
                    {/* Apply truncation to the value */}
                    {data && data[key] !== undefined
                      ? truncateText(String(data[key]), truncateLength)
                      : "---"}
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