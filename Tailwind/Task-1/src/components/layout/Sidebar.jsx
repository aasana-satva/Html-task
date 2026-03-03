import { NavLink } from "react-router-dom";

const iconClass = "h-5 w-5";

function DashboardIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="5" rx="1" />
      <rect x="13" y="10" width="8" height="11" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
    </svg>
  );
}

function EmployeesIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

function DepartmentsIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function HrIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M2 7h20" />
      <path d="M5 7v13h14V7" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-.4-1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 .4 1 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .38.14.74.4 1 .26.26.62.4 1 .4H21a2 2 0 1 1 0 4h-.1c-.38 0-.74.14-1 .4-.26.26-.4.62-.4 1Z" />
    </svg>
  );
}

export default function Sidebar({
  isMobileOpen = false,
  onClose = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {},
}) {
  const links = [
    { to: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/employees", label: "Employees", icon: <EmployeesIcon /> },
    { to: "/departments", label: "Departments", icon: <DepartmentsIcon /> },
    { to: "/hr", label: "HR", icon: <HrIcon /> },
    { to: "/settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const desktopWidthClass = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      <aside
        className={`sticky top-0 hidden h-screen lg:flex flex-col ${desktopWidthClass} bg-white dark:bg-gray-800 shadow-lg p-4 transition-all duration-300`}
      >
        {!isCollapsed ? (
          <NavLink to="/" className="mb-6 text-xl font-bold text-primary dark:text-white">Admin Panel</NavLink>
        ) : (
          <span className="sr-only">Admin Panel</span>
        )}

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? "justify-center" : "justify-start"} rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                }`
              }
              title={isCollapsed ? link.label : undefined}
            >
              <span>{link.icon}</span>
              {!isCollapsed ? <span className="ml-3">{link.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={onToggleCollapse}
          className={`mt-4 flex items-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 ${
            isCollapsed ? "justify-center" : "justify-center gap-2"
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {!isCollapsed ? <span className="text-sm">Collapse</span> : null}
        </button>
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          <aside className="absolute left-0 top-0 h-full w-72 bg-white p-5 shadow-xl dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary dark:text-white">Admin Panel</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Close
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              {links.map((link) => (
                <NavLink
                  key={`mobile-${link.to}`}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-3 py-2 text-sm ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <span>{link.icon}</span>
                  <span className="ml-3">{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
