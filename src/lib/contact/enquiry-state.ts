export type ContactEnquiryActionState = {
  status: "idle" | "success" | "error";
  message: string;
  submissionId?: string;
};

export const contactEnquiryInitialState: ContactEnquiryActionState = {
  status: "idle",
  message: "",
};
