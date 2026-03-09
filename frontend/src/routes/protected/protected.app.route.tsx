import { Navigate, Outlet } from "react-router-dom";
import { useGetUser } from "../../hook/auth/get.user.hook";
import { useEffect } from "react";
import { connectSocket } from "../../socket/socket";

export default function ProtectedRoute() {
  const { data: response, isLoading, isError } = useGetUser();
    useEffect(() => {
    connectSocket();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !response?.userData) {
    return <Navigate to="/" replace />;
  }


  return <Outlet />;
}