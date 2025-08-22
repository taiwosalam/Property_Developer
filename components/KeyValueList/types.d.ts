export interface KeyValueListProps<T> {
  referenceObject: T;
  data: Partial<T>;
  truncateLength?: number;
  chunkSize?: number;
  styles?: Partial<
    Record<
      keyof T,
      {
        label?: React.CSSProperties;
        value?: React.CSSProperties;
      }
    >
  >;
  direction?: "row" | "column";
}
