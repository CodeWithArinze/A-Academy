export type ApplicationStatus = "Pending" | "Approved" | "Rejected";
export type PaymentStatus =
  | "Not Submitted"
  | "Awaiting Verification"
  | "Verified"
  | "Rejected"
  | "More Info Requested";
export type StudentStatus = "Applicant" | "Enrolled";

export type Application = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  courseOfStudy: string;
  programmingExperience: string;
  device: string;
  whyJoin: string;
  status: ApplicationStatus;
  paymentStatus: PaymentStatus;
  studentStatus: StudentStatus;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  applicationId: string | null;
  fullName: string;
  email: string;
  phone: string;
  amountPaid: number;
  dateOfPayment: string;
  paymentReference: string | null;
  receiptPath: string | null;
  status: PaymentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminPayload = {
  applications: Application[];
  payments: Payment[];
  stats: {
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    awaitingPaymentVerification: number;
    enrolledStudents: number;
    verifiedPayments: number;
    revenueCollected: number;
  };
};
