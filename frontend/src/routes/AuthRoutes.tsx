import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { DemoComponent } from "../pages/demo.data.page";

const OtpInput = lazy(()=>import("../pages/otp.verification.page"));
const AuthRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
      { path:"verify-otp", element: <OtpInput /> },
       { path:"demo", element: <DemoComponent /> },
    ],
  },
];

export default AuthRoutes;