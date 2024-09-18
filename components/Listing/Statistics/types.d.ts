// Imports
import { statistics_data_types } from "./data";

export type StatisticsDataTypes = (typeof statistics_data_types)[number];

export interface StatisticsMessageCardProps {
  type: StatisticsDataTypes;
}
