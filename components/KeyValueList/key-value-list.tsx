import { KeyValueListProps } from "./types";
import clsx from "clsx";

const KeyValueList = <T extends object>({
  styles,
  data = {},
  chunkSize = 3,
  referenceObject,
  direction = "row",
  truncateLength,
}: KeyValueListProps<T>) => {
  const isValidValue = (value: any) =>
    value !== undefined && value !== null && value !== "";

  // Filter keys with valid data before chunking
  const validKeys = (Object.keys(referenceObject) as Array<keyof T>).filter(
    (key) => isValidValue(data[key])
  );

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

  const chunkedKeys = chunkArray(validKeys, chunkSize);

  // If no valid keys, return null to avoid rendering anything
  if (validKeys.length === 0) return null;

  // Keys that should have special styling
  const specialKeys = ["investor capital", "unit price", "first deposit"];

  return (
    <>
      {chunkedKeys.map((chunk, chunkIndex) => (
        <div
          key={chunkIndex}
          className={clsx("flex-1 text-base font-medium capitalize", {
            "flex gap-10 max-sm:gap-4": direction === "row",
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
                  {String(key) === "description" ? (
                    <p
                      className={clsx(" line-clamp-1", {
                        "text-brand-9 font-semibold": specialKeys.includes(String(key)),
                      })}
                      style={styles?.[key]?.value}
                      dangerouslySetInnerHTML={{
                        __html: truncateText(String(data[key]), truncateLength),
                      }}
                    />
                  ) : (
                    <p
                      className={clsx("text-black dark:text-darkText-2 line-clamp-1", {
                        "text-brand-9 font-semibold": specialKeys.includes(String(key)),
                      })}
                      style={styles?.[key]?.value}
                    >
                      {truncateText(String(data[key]), truncateLength)}
                    </p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="custom-flex-col gap-4">
                {chunk.map((key) => (
                  <p
                    key={`${chunkIndex}-${String(key)}-label`}
                    className="text-[#747474] dark:text-darkText-1 whitespace-nowrap"
                    style={styles?.[key]?.label}
                  >
                    {String(key).split("_").join(" ")}
                  </p>
                ))}
              </div>
              <div className="custom-flex-col gap-4">
                {chunk.map((key) =>
                  String(key) === "description" ? (
                    <p
                      key={`${chunkIndex}-${String(key)}-value`}
                      className={clsx("text-black dark:text-darkText-2", {
                        "text-brand-9 font-semibold": specialKeys.includes(String(key)),
                      })}
                      style={styles?.[key]?.value}
                      dangerouslySetInnerHTML={{
                        __html: truncateText(String(data[key]), truncateLength),
                      }}
                    />
                  ) : (
                    <p
                      key={`${chunkIndex}-${String(key)}-value`}
                      className={clsx("text-black dark:text-darkText-2", {
                        "text-brand-9 font-semibold": specialKeys.includes(String(key)),
                      })}
                      style={styles?.[key]?.value}
                    >
                      {truncateText(String(data[key]), truncateLength)}
                    </p>
                  )
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default KeyValueList;