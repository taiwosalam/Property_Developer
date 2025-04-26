// Types
import type { Field } from "@/components/Table/types";

export interface SubscriptionTableType {
  fields: Field[];
  data: Record<string, string>[];
}
