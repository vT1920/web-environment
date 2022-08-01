import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
	return sessionStorage.getItem("datn-token") ? (
		<Outlet />
	) : (
		<Navigate to="/login" />
	);
};

export default ProtectedRoute;
