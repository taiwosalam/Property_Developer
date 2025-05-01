export type BvnLookupResponse = {
    status: "successful";
    message: string;
    timestamp: string; // ISO timestamp format
    data: {
      session_id: string;
      bvn: string;
      methods: {
        method: string;
        hint: string;
      }[];
    };
  };
  