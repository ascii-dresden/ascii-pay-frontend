import { useCookies } from "react-cookie";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { userApi } from "../redux/api/userApi";
import FullScreenLoader from "./FullScreenLoader";
import { RoleDto } from "../redux/api/contracts";

export const RequireUser = ({ allowedRoles }: { allowedRoles: RoleDto[] }) => {
  const [ascii_pay_session] = useCookies(["ascii_pay_session"]);
  const location = useLocation();

  const { isLoading, isFetching } = userApi.endpoints.getMe.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });

  const loading = isLoading || isFetching;

  const user = userApi.endpoints.getMe.useQueryState(null, {
    selectFromResult: ({ data }) => data!,
  });

  if (loading) {
    return <FullScreenLoader />;
  }

  return (ascii_pay_session.ascii_pay_session || user) &&
    allowedRoles.includes(user?.role) ? (
    <Outlet />
  ) : ascii_pay_session.ascii_pay_session && user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
