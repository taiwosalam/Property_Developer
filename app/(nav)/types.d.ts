export interface ActiveSubscriptionResponse {
  status: "success";
  data: {
    current_plan: {
      name: string;
      amount: string; 
      duration: string; 
      quantity: number;
      expired_date: string;
    };
    renewal_plan: {
      name: string;
      amount: string; 
      duration: string;
      quantity: number;
      start_date: string; 
    };
    amount_to_pay: string; 
    valid_till: string;
  };
}
