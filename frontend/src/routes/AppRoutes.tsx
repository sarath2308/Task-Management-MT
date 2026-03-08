import { useRoutes } from "react-router-dom";
import { lazy, Suspense } from "react";

// Routes
import AuthRoutes from "./AuthRoutes";
import userRoutes from "./UserRoutes";
const Landing = lazy(() => import("../pages/landing"));
const Auth = lazy(() => import("../pages/auth.page"));
// import LandingPage from "./pages/LandingPage";

function AppRoutes() {
  const routes = [
    { path: "/", element: <Landing /> },
    { path: "/auth", element: <Auth /> },
    ...AuthRoutes,
    ...userRoutes,
  ];
  return <Suspense fallback={<div>loading....</div>}>{useRoutes(routes)}</Suspense>;
}

export default AppRoutes;