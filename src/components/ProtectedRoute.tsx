import { Flex, Spin } from "antd";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectToken } from "../store/slices/auth/authSelectors";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const {
    status: { isLoadedOrError },
  } = useAppSelector(selectToken);
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth && isLoadedOrError) {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, isAuth, isLoadedOrError]);

  if (!isLoadedOrError) {
    return (
      <Flex justify="center" align="center" style={{ height: "100dvh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return <>{children}</>;
}
