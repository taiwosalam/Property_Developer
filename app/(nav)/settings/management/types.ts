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
