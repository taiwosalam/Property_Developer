export interface VisitorRequestModalProps {
  props: {
    status: "completed" | "pending" | "in-progress" | "decline" | "checked_in" | "cancelled";
    pictureSrc: string;
    id: number;
    tier_id?: number;
    req_id?: number;
    purpose: string;
    userName: string;
    visitorName: string;
    visitorPhoneNumber: string;
    requestDate: string;
    secretQuestion: string;
    secretAnswer: string;
    requestId: string;
    checked_status: string;
    checked_in_by: string | null;
    checked_out_by: string | null;
    check_out_companion: string;
    check_in_companion: string;
    check_in_inventory: string;
    check_out_inventory: string;
    check_in_date: string | null;
    check_out_date: string | null;
    check_in_time: string | null;
    check_out_time: string | null;
  };
  closeModal?: () => void;
}
