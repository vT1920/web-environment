import { Button, Result } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import "./style.scss";

function NotFoundPage(props) {
	useEffect(() => {
		document.title = "404 error";
	}, []);

	const navigate = useNavigate();
	return (
		<div id="not-found-page">
			<div className="main">
				<Result
					status="404"
					title="404"
					subTitle="Trang bạn đang truy cập không tồn tại."
					extra={
						<Button type="primary" onClick={() => navigate("/")}>
							Trang chủ
						</Button>
					}
				/>
			</div>
		</div>
	);
}
NotFoundPage.propTypes = {};

export default NotFoundPage;
