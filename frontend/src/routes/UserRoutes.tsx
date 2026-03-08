import { type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./protected/protected.app.route";
import AppLayout from "../components/app.layout";
import { Loader } from "lucide-react";

// Lazy Loads
const HomePage = lazy(() => import("../pages/home.page"));
const TasksPage = lazy(() => import("../pages/task.page"));


const userRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />, // All children here will have Sidebar + Topbar
        children: [
          { 
            path: "/home", 
            element: (
              <Suspense fallback={<Loader />}>
                <HomePage />
              </Suspense>
            ) 
          },
          { 
            path: "/tasks", 
            element: (
              <Suspense fallback={<Loader />}>
                <TasksPage />
              </Suspense>
            ) 
          },
        ],
      },
    ],
  },
];

export default userRoutes;