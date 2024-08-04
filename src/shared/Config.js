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
  { label: "ADMIN", value: "admin" },
  { label: "BM", value: "branch-manager" },
  { label: "SM", value: "state-manager" },
  { label: "LM", value: "loan-manager" },
  { label: "PM", value: "product-manager" },
  { label: "CDM", value: "collection-department-head" },
  { label: "CD", value: "collection-department" },
  { label: "LD", value: "loan-department" },
  { label: "VD", value: "verification-department" },
  { label: "FM", value: "financial-manager" },
  { label: "CUSTOMER", value: "customer" },
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
