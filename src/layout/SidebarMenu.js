const sidebarMenu = {
  admin: [
    {
      title: "Dashboard",
      icon: "dashboard_icon", // replace with the actual icon reference
      submenu: [
        { title: "Overview", route: "/dashboard/overview" },
        { title: "Analytics", route: "/dashboard/analytics" },
        { title: "Recent Activities", route: "/dashboard/activities" },
      ],
    },
    {
      title: "Loan Applications",
      icon: "loan_applications_icon",
      submenu: [
        { title: "New Applications", route: "/loan-applications/new" },
        { title: "In Progress", route: "/loan-applications/in-progress" },
        { title: "Approved", route: "/loan-applications/approved" },
        { title: "Rejected", route: "/loan-applications/rejected" },
      ],
    },
    {
      title: "Customer Management",
      icon: "customer_management_icon",
      submenu: [
        { title: "Customer List", route: "/customers/list" },
        { title: "Add New Customer", route: "/customers/add" },
        { title: "Customer Profiles", route: "/customers/profiles" },
      ],
    },
    {
      title: "Loan Management",
      icon: "loan_management_icon",
      submenu: [
        { title: "Active Loans", route: "/loans/active" },
        { title: "Pending Payments", route: "/loans/pending-payments" },
        { title: "Delinquent Loans", route: "/loans/delinquent" },
        { title: "Closed Loans", route: "/loans/closed" },
      ],
    },
    {
      title: "Payments",
      icon: "payments_icon",
      submenu: [
        { title: "Payment History", route: "/payments/history" },
        { title: "Upcoming Payments", route: "/payments/upcoming" },
        { title: "Process Payment", route: "/payments/process" },
        { title: "Refunds", route: "/payments/refunds" },
      ],
    },
    {
      title: "Reports",
      icon: "reports_icon",
      submenu: [
        { title: "Financial Reports", route: "/reports/financial" },
        { title: "Customer Reports", route: "/reports/customer" },
        { title: "Loan Performance", route: "/reports/loan-performance" },
      ],
    },
    {
      title: "Settings",
      icon: "settings_icon",
      submenu: [
        { title: "General Settings", route: "/settings/general" },
        { title: "User Management", route: "/settings/users" },
        { title: "Roles & Permissions", route: "/settings/roles" },
        { title: "Security Settings", route: "/settings/security" },
      ],
    },
    {
      title: "Notifications",
      icon: "notifications_icon",
      submenu: [
        { title: "System Notifications", route: "/notifications/system" },
        { title: "Customer Notifications", route: "/notifications/customer" },
        { title: "Email Templates", route: "/notifications/email-templates" },
      ],
    },
    {
      title: "Support",
      icon: "support_icon",
      submenu: [
        { title: "Customer Support Tickets", route: "/support/tickets" },
        { title: "FAQs", route: "/support/faqs" },
        { title: "Contact Support", route: "/support/contact" },
      ],
    },
    {
      title: "Logout",
      icon: "pi pi-check",
      route: "/logout",
    },
  ],
};

export default sidebarMenu;
