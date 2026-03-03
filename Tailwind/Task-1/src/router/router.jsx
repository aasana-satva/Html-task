import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import PageSkeleton from "../components/layout/PageSkeleton";

const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Employees = lazy(() => import("../pages/Employees"));
const Departments = lazy(() => import("../pages/Departments"));
const HR = lazy(() => import("../pages/HR"));
const Settings = lazy(() => import("../pages/Settings"));

function withSuspense(component) {
  return <Suspense fallback={<PageSkeleton />}>{component}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: "employees", element: withSuspense(<Employees />) },
      { path: "departments", element: withSuspense(<Departments />) },
      { path: "hr", element: withSuspense(<HR />) },
      { path: "settings", element: withSuspense(<Settings />) },
    ],
  },
]);
