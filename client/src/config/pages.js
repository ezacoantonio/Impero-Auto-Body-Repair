// Import all page components
import DashboardPage from "../pages/Dashboard";
import UsersPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import ReportsPage from "../pages/UsersPage";
import AnalyticsPage from "../pages/AnalyticsPage";

// MAIN CONFIGURATION - EDIT THIS ARRAY TO ADD/REMOVE PAGES
const PAGE_CONFIG = [
  {
    name: "Dashboard",
    icon: "dashboard", // Material Icon name
    component: <DashboardPage />,
  },
  {
    name: "Users",
    icon: "people",
    component: <UsersPage />,
  },
  {
    name: "Settings",
    icon: "settings",
    component: <SettingsPage />,
  },
  {
    name: "Reports",
    icon: "assessment", // Material Icon name
    component: <ReportsPage />,
  },
  {
    name: "Analytics",
    icon: "analytics",
    component: <AnalyticsPage />,
  },
];

export default PAGE_CONFIG;
