export type CallRequest = {
  call_back_id: number;
  requester: string;
  branch_name: string;
  property_name: string;
  request_date_time: string;
  resolve_date_time: string;
  status: "completed" | string;
};

export type CallbackApiResponse = {
  status: "success" | string;
  message: string;
  data: {
    total_CallRequests: number;
    monthly_CallRequests: number;
    total_resolved: number;
    monthly_resolved: number;
    total_unresolved: number;
    monthly_unresolved: number;
    CallRequests: CallRequest[];
  };
};
