export const Position = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  BM: "branch-manager",
  SM: "state-manager",
  LM: "loan-manager",
  PM: "product-manager",
  CDM: "collection-department-head",
  CD: "collection-department",
  LD: "loan-department",
  VD: "verication-department",
  FM: "financial-manager",
  CM: "city-manager",
};

export const DropdownPosition = [
  { label: "Admin", value: "admin" },
  { label: "Branch Manager", value: "branch-manager" },
  { label: "State Manager", value: "state-manager" },
  { label: "Loan Manager", value: "loan-manager" },
  { label: "Product Manager", value: "product-manager" },
  {
    label: "Collection Department Manager",
    value: "collection-department-head",
  },
  { label: "Collection Department", value: "collection-department" },
  { label: "Loan Department", value: "loan-department" },
  { label: "Verification Department", value: "verification-department" },
  { label: "Financial Manager", value: "financial-manager" },
  { label: "Customer", value: "customer" },
];

export const Status = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

export const fresherOrExperience = {
  FRESHER: "fresher",
  EXPERIENCE: "experience",
};

export const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
export const REFRESH_TOKEN_STORAGE_KEY = "refreshToken";

export const PAGINATOR_DROPDOWN_OPTIONS = [
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 20, value: 20 },
  { label: 50, value: 50 },
];

export const ActiveStatus = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const PAGE_ROW = [10, 15, 25];

export const RoleSeverityColor = (role) => {
  switch (role) {
    case "admin":
      return { label: "Admin", severity: "info" };
    case "branch-manager":
      return { label: "Branch Manager", severity: "warning" };
    case "state-manager":
      return { label: "State Manager", severity: "success" };
    case "loan-manager":
      return { label: "Loan Manager", severity: "help" };
    case "product-manager":
      return { label: "Product Manager", severity: "warning" };
    case "collection-department-head":
      return { label: "Collection Department Manager", severity: "danger" };
    case "collection-department":
      return { label: "Collection Department", severity: "success" };
    case "loan-department":
      return { label: "Loan Department", severity: "secondary" };
    case "verification-department":
      return { label: "Verification Department", severity: "warning" };
    case "financial-manager":
      return { label: "Financial Manager", severity: "help" };
    case "customer":
      return { label: "Customer", severity: "danger" };
    default:
      return { label: "Unknown", severity: "contrast" }; // Fallback case
  }
};

export const EmployeeTypes = [
  { label: "Salaried", value: "salaried" },
  { label: "Self-Employed", value: "self_employed" },
  { label: "Business", value: "business" },
];

export const LoanApplicationSteps = [
  {
    label: "Incompleted",
    value: "incompleted",
  },
  {
    label: "Application Number Generated",
    value: "application_number_generated",
  },
  { label: "Loan Amount Generated", value: "loan_amount_generated" },
  {
    label: "Document Address Verified",
    value: "document_address_verification",
  },
  {
    label: "Business or Company Address Verified",
    value: "business_address_verification",
  },
  { label: "Document Verified", value: "document_verification" },

  { label: "Loan Approved", value: "loan_approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Amount Disbursed", value: "disbursed" },
];

export const ResidenceTypes = [
  { label: "Rented", value: "rented" },
  { label: "Owned", value: "owned" },
  { label: "Parent", value: "parent" },
];

export const applicationRenderStatus = {
  lead: "lead",
  incompleted: "incompleted",
  inProgress: "progress",
  approved: "approved",
  rejected: "rejected",
};

export const AddLoanPath = (entity) => {
  switch (entity) {
    case "personal_loan":
      return "/application/personal-loan/add";
    case "home_loan":
      return "/application/home-loan/add";
    case "car_loan":
      return "/application/car-loan/add";
    case "education_loan":
      return "/application/education-loan/add";
    case "business_loan":
      return "/application/business-loan/add";
    case "payday_loan":
      return "/application/payday-loan/add";
    case "gold_loan":
      return "/application/gold-loan/add";
    case "mortgage_loan":
      return "/application/mortgage-loan/add";
    case "credit_card_loan":
      return "/application/credit-card-loan/add";
    case "agriculture_loan":
      return "/application/agriculture-loan/add";

    default:
      return "";
  }
};

export const EditLoanPath = (entity) => {
  switch (entity) {
    case "personal_loan":
      return "/application/personal-loan/edit";
    case "home_loan":
      return "/application/home-loan/edit";
    case "car_loan":
      return "/application/car-loan/edit";
    case "education_loan":
      return "/application/education-loan/edit";
    case "business_loan":
      return "/application/business-loan/edit";
    case "payday_loan":
      return "/application/payday-loan/edit";
    case "gold_loan":
      return "/application/gold-loan/edit";
    case "mortgage_loan":
      return "/application/mortgage-loan/edit";
    case "credit_card_loan":
      return "/application/credit-card-loan/edit";
    case "agriculture_loan":
      return "/application/agriculture-loan/edit";

    default:
      return "";
  }
};

export const LoantatusSeverityColor = (role) => {
  switch (role) {
    case "incompleted":
      return { label: "Incompleted", severity: "info" };
    case "application_number_generated":
      return { label: "Application Number Generated", severity: "warning" };
    case "loan_amount_generated":
      return { label: "Loan Amount Generated", severity: "success" };
    case "document_address_verification":
      return { label: "Document Address Verified", severity: "help" };
    case "business_address_verification":
      return {
        label: "Business or Company Address Verified",
        severity: "warning",
      };
    case "document_verification":
      return { label: "Document Verified", severity: "secondary" };
    case "loan_amount_approved_processing":
      return { label: "Loan Amount Approved Processing", severity: "success" };
    case "loan_approved":
      return { label: "Loan Approved", severity: "secondary" };
    case "rejected":
      return { label: "Rejected", severity: "danger" };
    case "disbursed":
      return { label: "Amount Disbursed", severity: "help" };

    default:
      return { label: "Unknown", severity: "contrast" }; // Fallback case
  }
};
