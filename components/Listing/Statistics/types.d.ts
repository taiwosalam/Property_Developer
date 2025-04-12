// Imports
import { statistics_data_types } from "./data";

export type StatisticsDataTypes = (typeof statistics_data_types)[number];
interface User {
    id: number;
    unit_name: string;
    property_name: string;
    encodedId: string;
    name: string;
    email: string;
    phone: string | null;
    username: string | null;
    tier: number;
    referrer_code: string;
    photo: string | null;
    date: string;
  }
export interface StatisticsMessageCardProps {
  type: StatisticsDataTypes;
  user: User;
}
