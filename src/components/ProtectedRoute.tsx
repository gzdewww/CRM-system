import { Flex, Spin } from "antd";
import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { selectToken } from "../store/slices/auth/authSelectors";
import { refreshThunk } from "../store/slices/auth/authSlice";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const {
    data: token,
    status: { isLoadedOrError },
  } = useAppSelector(selectToken);
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoadedOrError || (token?.refreshToken && !token.accessToken)) {
      dispatch(refreshThunk());
    }
  }, [dispatch, token, isLoadedOrError]);

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
