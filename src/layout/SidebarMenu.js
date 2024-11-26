const sidebarMenu = {
  admin: [
    {
      title: "Dashboard",
      icon: "pi pi-table", // replace with the actual icon reference
      submenu: [
        { title: "Overview", route: "/dashboard/overview" },
        { title: "Analytics", route: "/dashboard/analytics" },
        { title: "Recent Activities", route: "/dashboard/activities" },
      ],
    },
    {
      title: "Branch",
      icon: "pi pi-building-columns",
      submenu: [{ title: "Branch", route: "/branch/list" }],
    },
    {
      title: "EMI",
      icon: "pi pi-calculator",
      submenu: [{ title: "Calculator", route: "/emi/calculator" }],
    },
    {
      title: "Loan",
      icon: "pi pi-file",
      submenu: [
        { title: "Lead", route: "/lead/list" },
        { title: "Application", route: "/applications/list" },
        { title: "In Progress", route: "/applications/progress" },
        { title: "Approved", route: "/applications/approved" },
        { title: "Disbursed", route: "/applications/disbursed" },
        { title: "Rejected", route: "/applications/rejected" },
      ],
    },
    {
      title: "User",
      icon: "pi pi-user",
      submenu: [
        { title: "Customer", route: "/customers/list" },
        { title: "Employee", route: "/employee/list" },
      ],
    },
    {
      title: "Loan Management",
      icon: "pi pi-ticket",
      submenu: [
        { title: "Active Loans", route: "/loans/active" },
        { title: "Delinquent Loans", route: "/loans/delinquent" },
        { title: "Closed Loans", route: "/loans/closed" },
      ],
    },
    {
      title: "Payments",
      icon: "pi pi-money-bill",
      submenu: [
        { title: "History", route: "/payments/history" },
        { title: "Upcoming", route: "/payments/upcoming" },
        { title: "Defaulter", route: "/payments/defaulter" },
      ],
    },
    {
      title: "Finance",
      icon: "pi pi-wallet",
      submenu: [
        { title: "Investor", route: "/finance/investor" },
        { title: "Payout", route: "/finance/payout" },
        { title: "Reedem", route: "/finance/reedem" },
        { title: "Matured", route: "/finance/matured" },
      ],
    },
    {
      title: "Reports",
      icon: "pi pi-file-export",
      submenu: [
        { title: "Financial Reports", route: "/reports/financial" },
        { title: "Customer Reports", route: "/reports/customer" },
        { title: "Loan Performance", route: "/reports/loan-performance" },
      ],
    },
    {
      title: "Operations Hub",
      icon: "pi pi-unlock",
      submenu: [
        { title: "Charges", route: "/operation-hub/charges" },
        { title: "Documents Name", route: "/operation-hub/document" },
        { title: "Document Type", route: "/operation-hub/document-type" },
        { title: "Loan Type", route: "/operation-hub/loan-type" },
      ],
    },
    {
      title: "Setting",
      icon: "pi pi-cog",
      submenu: [{ title: "Profile", route: "/setting/profile" }],
    },
  ],
  "branch-manager": [],
  "state-manager": [],
  "loan-manager": [],
  "product-manager": [],
  "collection-department-head": [],
  "collection-department": [],
  "loan-department": [],
  "verication-department": [],
  "financial-manager": [],
  customer: [],
};

export default sidebarMenu;
