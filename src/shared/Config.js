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
