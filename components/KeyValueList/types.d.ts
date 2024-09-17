export interface KeyValueListProps<T> {
  referenceObject: T;
  data: Partial<T>;
  chunkSize?: number;
}
