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
      title: "Loan Applications",
      icon: "pi pi-file",
      submenu: [
        { title: "New Applications", route: "/loan-applications/new" },
        { title: "In Progress", route: "/loan-applications/in-progress" },
        { title: "Approved", route: "/loan-applications/approved" },
        { title: "Rejected", route: "/loan-applications/rejected" },
      ],
    },
    {
      title: "Customer Management",
      icon: "pi pi-user",
      submenu: [
        { title: "Customer List", route: "/customers/list" },
        { title: "Add New Customer", route: "/customers/add" },
        { title: "Customer Profiles", route: "/customers/profiles" },
      ],
    },
    {
      title: "Loan Management",
      icon: "pi pi-ticket",
      submenu: [
        { title: "Active Loans", route: "/loans/active" },
        { title: "Pending Payments", route: "/loans/pending-payments" },
        { title: "Delinquent Loans", route: "/loans/delinquent" },
        { title: "Closed Loans", route: "/loans/closed" },
      ],
    },
    {
      title: "Payments",
      icon: "pi pi-money-bill",
      submenu: [
        { title: "Payment History", route: "/payments/history" },
        { title: "Upcoming Payments", route: "/payments/upcoming" },
        { title: "Process Payment", route: "/payments/process" },
        { title: "Refunds", route: "/payments/refunds" },
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
      title: "Settings",
      icon: "pi pi-cog",
      submenu: [
        { title: "General Settings", route: "/settings/general" },
        { title: "User Management", route: "/settings/users" },
        { title: "Roles & Permissions", route: "/settings/roles" },
        { title: "Security Settings", route: "/settings/security" },
      ],
    },
    {
      title: "Notifications",
      icon: "pi pi-bell",
      submenu: [
        { title: "System Notifications", route: "/notifications/system" },
        { title: "Customer Notifications", route: "/notifications/customer" },
        { title: "Email Templates", route: "/notifications/email-templates" },
      ],
    },
    {
      title: "Support",
      icon: "pi pi-question-circle",
      submenu: [
        { title: "Customer Support Tickets", route: "/support/tickets" },
        { title: "FAQs", route: "/support/faqs" },
        { title: "Contact Support", route: "/support/contact" },
      ],
    },
  ],
};

export default sidebarMenu;
