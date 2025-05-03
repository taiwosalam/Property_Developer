export interface ManagementConfigApiResponse {
  //data: {
  status: boolean;
  message: string;
  data: {
    manager: string[];
    account: string[];
    staff: string[];
    user: string[];
  };
  //};
}

export interface RentPenaltySettings {
  daily: number;
  weekly: number;
  monthly: number;
  quarterly: number;
  yearly: number;
  biennially: number;
  triennially: number;
  quadrennial: number;
  quinquennial: number;
  sexennial: number;
  septennial: number;
  octennial: number;
  nonennial: number;
  decennial: number;
}
