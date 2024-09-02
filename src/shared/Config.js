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
