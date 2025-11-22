import { Flex, Spin } from "antd";
import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuth && !isLoading && isInitialized) {
      navigate("/auth/login", { replace: true });
    }
  }, [isAuth, isInitialized, isLoading, navigate, location]);

  if (isLoading || !isInitialized || !isAuth) {
    return (
      <Flex justify="center" align="center" style={{ height: "100dvh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return <>{children}</>;
}
