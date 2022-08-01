import { Button, Form, Input, message } from "antd";
import {
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
} from "firebase/auth";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";

const LoginForm = (props) => {
	const { isRegister } = props;
	const navigate = useNavigate();

	const handleLogin = async (value) => {
		const { email, password } = value;
		console.log({ email, password });

		try {
			const authentication = getAuth();

			const response = await signInWithEmailAndPassword(
				authentication,
				email,
				password
			);
			const token = response?._tokenResponse?.refreshToken;
			const uid = response?.user?.uid;
			sessionStorage.setItem("datn-token", token);
			sessionStorage.setItem("datn-uid", uid);
			navigate("/home");
		} catch (error) {
			if (error.code === "auth/wrong-password") {
				message.error("Tài khoản hoặc mật khẩu không đúng");
			}
			if (error.code === "auth/user-not-found") {
				message.error("Tài khoản hoặc mật khẩu không đúng");
			}
		}
	};

	const handleRegister = async (value) => {
		const { email, password } = value;
		try {
			const authentication = getAuth();

			const response = await createUserWithEmailAndPassword(
				authentication,
				email,
				password
			);
			const token = response?._tokenResponse?.refreshToken;
			const uid = response?.user?.uid;
			sessionStorage.setItem("datn-token", token);
			sessionStorage.setItem("datn-uid", uid);
			navigate("/home");
		} catch (error) {
			if (error.code === "auth/email-already-in-use") {
				message.error("Tài khoản đã tồn tại");
			}
		}
	};

	useEffect(() => {
		if (sessionStorage.getItem("datn-token")) {
			navigate("/home");
		}
	}, []);

	return (
		<div className="form-container">
			<div className="form-title">{isRegister ? "Đăng ký" : "Đăng nhập"}</div>

			<Form
				name="basic"
				labelCol={{
					span: 5,
				}}
				wrapperCol={{
					span: 18,
				}}
				onFinish={isRegister ? handleRegister : handleLogin}
				autoComplete="off"
			>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "Không được để trống",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Mật khẩu"
					name="password"
					rules={[
						{
							required: true,
							message: "Không được để trống",
						},
						{
							min: 6,
							message: "Mật khẩu ít nhất 6 ký tự",
						},
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 5,
						span: 20,
					}}
				>
					<Button
						type="primary"
						htmlType="submit"
						style={{ marginBottom: "8px" }}
					>
						{isRegister ? "Đăng ký" : "Đăng nhập"}
					</Button>
					<br />
					<Link to={isRegister ? "/login" : "/register"}>
						{isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
					</Link>
				</Form.Item>
			</Form>
		</div>
	);
};

LoginForm.propTypes = {
	isRegister: PropTypes.bool,
};

LoginForm.defaultProps = {
	isRegister: false,
};
export default LoginForm;
