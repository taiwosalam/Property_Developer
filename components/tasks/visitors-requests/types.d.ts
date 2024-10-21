export interface VisitorRequestModalProps {
  status: "completed" | "pending" | "in-progress" | "decline";
  pictureSrc: string;
  id: string;
  userName: string;
  visitorName: string;
  visitorPhoneNumber: string;
  requestDate: string;
  secretQuestion: string;
  secretAnswer: string;
}
