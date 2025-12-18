import { Flex, Spin } from "antd";
import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../api/userAPI";
import { getRefreshToken } from "../helpers/storeTokenLocal";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { selectIsAuth } from "../store/slices/auth/authSelectors";
import { refreshThunk } from "../store/slices/auth/authSlice";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const {
    data: isAuth,
    status: { isLoadedOrError },
  } = useAppSelector(selectIsAuth);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoadedOrError || (getRefreshToken() && !getAccessToken())) {
      dispatch(refreshThunk());
    }
  }, [dispatch, isLoadedOrError]);

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
