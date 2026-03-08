import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const OtpInput = lazy(()=>import("../pages/otp.verification.page"));
const AuthRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
      { path:"verify-otp", element: <OtpInput /> },
    ],
  },
];

export default AuthRoutes;