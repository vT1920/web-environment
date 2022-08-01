import Login from "components/LoginForm";
import ProtectedRoute from "components/ProtectedRoute";
import HomePage from "pages/HomePage";
import NotFoundPage from "pages/NotFoundPage";
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";
import "./App.css";
import "./assets/styles/style.scss";

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route exact path="/home" element={<Navigate to="/" />} />

					<Route path="/login" element={<Login />} />

					<Route path="/register" element={<Login isRegister={true} />} />

					<Route exact path="/" element={<ProtectedRoute />}>
						<Route exact path="/" element={<HomePage />} />
					</Route>

					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
