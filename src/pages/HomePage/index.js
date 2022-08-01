import {
	ControlOutlined,
	CopyOutlined,
	ExclamationCircleOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import {
	Button,
	Form,
	InputNumber,
	Menu,
	message,
	Modal,
	Switch,
	Table,
} from "antd";
import confirm from "antd/lib/modal/confirm";
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import Overview from "components/Overview";
import { get, onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { db } from "utils/firebase";
import {
	average,
	calculateAqiHour,
	calculateNowcast,
	getData,
	getDataByProperty,
	getOptions,
	getOverview,
	getTheNearest12Hours,
	groupArray,
	renameKey,
	sortObject,
	toArray,
} from "utils/helpers";
import "../../App.css";
import "./style.scss";

function HomePage() {
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);

	const [listData, setListData] = useState([]);
	const [aqi, setAQI] = useState(0);
	const initialSate = { visible: false, isForm: false };
	const [isModalVisible, setIsModalVisible] = useState(initialSate);
	const [summaryNodeData, setSummaryNodeData] = useState([]);

	useEffect(() => {
		onValue(ref(db), (snapshot) => {
			const data = snapshot.val();
			const listKey = Object.keys(data.node);

			const list = {};
			const summaryNodeTemp = [];
			for (const key of listKey) {
				const objectSorted = sortObject(data.node[key], key);

				const objectToArray = toArray(objectSorted[0]);
				// console.log(objectSorted[1]);
				summaryNodeTemp.push(objectSorted[1]);

				const groupedArray = groupArray(objectToArray);
				const renameKeys = renameKey(groupedArray);
				list[key] = renameKeys;
			}
			setSummaryNodeData(summaryNodeTemp);

			const listCO = getDataByProperty(list, "CO");
			const listD = getDataByProperty(list, "D");
			const listD10 = getDataByProperty(list, "D10");

			const listData = [
				{
					property: "CO",
					data: listCO,
					borderColor: "rgba(255, 99, 132, 1)",
					backgroundColor: "rgba(255, 99, 132, 0.5)",
				},
				{
					property: "PM2.5",
					data: listD,
					borderColor: "rgba(54, 162, 235, 1)",
					backgroundColor: "rgba(54, 162, 235, 0.5)",
				},
				{
					property: "PM10",
					data: listD10,
					borderColor: "rgba(75, 192, 192, 1)",
					backgroundColor: "rgba(75, 192, 192, 0.5)",
				},
				{
					property: "Humidity",
					data: getDataByProperty(list, "H"),
					borderColor: "rgba(255, 206, 86, 1)",
					backgroundColor: "rgba(255, 206, 86, 0.5)",
				},
				{
					property: "Temperature",
					data: getDataByProperty(list, "T"),
					borderColor: "rgba(54, 162, 235, 1)",
					backgroundColor: "rgba(54, 162, 235, 0.5)",
				},
				{
					property: "GAS",
					data: getDataByProperty(list, "GAS"),
					borderColor: "rgba(153, 102, 255, 1)",
					backgroundColor: "rgba(153, 102, 255, 0.5)",
				},
			];

			setListData(listData);

			const list12hCO = getTheNearest12Hours(listCO);
			//console.log("list12hCO: ", list12hCO);
			const list12hD = getTheNearest12Hours(listD);
			//console.log("list12hD: ", list12hD);
			const list12hD10 = getTheNearest12Hours(listD10);
			//console.log("list12hD10: ", list12hD10);

			const nowcastD = calculateNowcast(list12hD);
			const nowcastD10 = calculateNowcast(list12hD10);
			const nowcastCO = average(list12hCO);
			const aqiD = calculateAqiHour("D", nowcastD) || 0;
			const aqiD10 = calculateAqiHour("D10", nowcastD10) || 0;
			const aqiCO = calculateAqiHour("CO", nowcastCO) || 0;
			//console.log({ nowcastD, aqiD, nowcastD10, aqiD10, nowcastCO, aqiCO });

			const max = Math.max(aqiD, aqiD10, aqiCO);
			//console.log("Max: ", max);

			setAQI(max);
		});
	}, []);

	const navigate = useNavigate();
	const handleLogout = () => {
		confirm({
			title: "Bạn có muốn đăng xuất không?",
			icon: <ExclamationCircleOutlined />,
			onOk() {
				sessionStorage.removeItem("datn-token");
				sessionStorage.removeItem("datn-uid");
				navigate("/login");
			},
			okText: "Đăng xuất",
			cancelText: "Huỷ",
		});
	};

	const showModal = (isForm) => {
		get(ref(db, `control/${isForm ? "element" : "device"}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					console.log(snapshot.val());

					const initData = isForm
						? snapshot.val()
						: {
								fan: snapshot.val().fan === 0 ? false : true,
								window: snapshot.val().window === 0 ? false : true,
						  };

					setIsModalVisible({
						visible: true,
						isForm,
						initData,
					});
				} else {
					console.log("No data available");
				}
			})
			.catch((error) => {
				console.error(error);
				message.error("Có lỗi xảy ra");
			});
		//console.log({ isForm });
	};

	const handleCancel = () => {
		setIsModalVisible(initialSate);
	};

	const handleSubmit = async (value) => {
		//console.log(value);
		try {
			await update(
				ref(db, `control/${isModalVisible.isForm ? "element" : "device"}`),
				isModalVisible.isForm
					? value
					: {
							fan: value.fan === true ? 1 : 0,
							window: value.window === true ? 1 : 0,
					  }
			);
			await update(ref(db, "control/config"), {
				mode: isModalVisible.isForm ? "auto" : "manual",
			});

			message.success("Cập nhật thành công");
			handleCancel();
		} catch (error) {
			message.error("Có lỗi xảy ra");
			console.error("eee: ", error);
		}
	};

	const columns = [
		{
			title: "Chất gây ô nhiễm",
			dataIndex: "name",
			key: "name",
			render: (text) => <a style={{ pointerEvents: "none" }}>{text}</a>,
		},
		{
			title: "Nồng độ",
			dataIndex: "concentration",
			key: "concentration",
		},
	];

	return (
		<div
			className="App"
			style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
		>
			{/* Modal */}
			{isModalVisible.visible && (
				<Modal
					title={isModalVisible.isForm ? "Cài đặt ngưỡng" : "Điều khiển"}
					visible={isModalVisible.visible}
					onOk={handleCancel}
					onCancel={handleCancel}
					footer={false}
					width={isModalVisible.isForm ? "520px" : "350px"}
					forceRender={true}
				>
					<Form
						name="basic"
						labelCol={{
							span: 5,
						}}
						wrapperCol={{
							span: 18,
						}}
						onFinish={handleSubmit}
						autoComplete="off"
						initialValues={isModalVisible.initData}
					>
						{isModalVisible.isForm ? (
							<>
								<Form.Item
									label="CO"
									name="CO"
									rules={[
										{
											validator: (_, value) => {
												if (value > 0) return Promise.resolve();
												return Promise.reject(new Error("Không hợp lệ"));
											},
										},
									]}
								>
									<InputNumber style={{ width: "100%" }} />
								</Form.Item>

								<Form.Item
									label="PM2.5"
									name="D"
									rules={[
										{
											validator: (_, value) => {
												if (value > 0) return Promise.resolve();
												return Promise.reject(new Error("Không hợp lệ"));
											},
										},
									]}
								>
									<InputNumber style={{ width: "100%" }} />
								</Form.Item>
								<Form.Item
									label="PM10"
									name="D10"
									rules={[
										{
											validator: (_, value) => {
												if (value > 0) return Promise.resolve();
												return Promise.reject(new Error("Không hợp lệ"));
											},
										},
									]}
								>
									<InputNumber style={{ width: "100%" }} />
								</Form.Item>

								<Form.Item
									label="GAS"
									name="GAS"
									rules={[
										{
											validator: (_, value) => {
												if (value > 0) return Promise.resolve();
												return Promise.reject(new Error("Không hợp lệ"));
											},
										},
									]}
								>
									<InputNumber style={{ width: "100%" }} />
								</Form.Item>
							</>
						) : (
							<>
								<Form.Item label="Quạt" name="fan">
									<Switch defaultChecked={isModalVisible.initData.fan} />
								</Form.Item>
								<Form.Item label="Cửa" name="window">
									<Switch defaultChecked={isModalVisible.initData.window} />
								</Form.Item>
							</>
						)}
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
								Thiết lập
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			)}
			{/* Header */}
			<Menu
				mode="horizontal"
				defaultSelectedKeys={["mail"]}
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "flex-end",
					marginInline: "2rem",
				}}
			>
				{process.env.REACT_APP_ADMIN_UID.includes(
					sessionStorage.getItem("datn-uid")
				) && (
					<>
						<Menu.Item
							key="form"
							icon={<CopyOutlined />}
							onClick={() => showModal(true)}
						>
							Cài đặt ngưỡng
						</Menu.Item>
						<Menu.Item
							key="modal"
							icon={<ControlOutlined />}
							onClick={() => showModal(false)}
						>
							Điều khiển
						</Menu.Item>
					</>
				)}
				<Menu.Item
					key="logout"
					icon={<LogoutOutlined />}
					onClick={handleLogout}
				>
					Đăng xuất
				</Menu.Item>
			</Menu>
			{/* Overview */}
			<Overview status={getOverview(aqi)} value={aqi} />
			{/* Chart */}
			<div className="content-wrapper">
				<div className="content-left">
					{summaryNodeData.map((ele) => (
						<div key={ele.key}>
							<h3 style={{ color: "#499fbc" }}>{ele.key}</h3>
							<Table
								columns={columns}
								dataSource={ele.data}
								pagination={false}
							/>
						</div>
					))}
				</div>
				<div className="content-right">
					{listData.map((ele, index) => (
						<div style={{ width: "45%", minWidth: "300px" }} key={index}>
							<Line
								options={getOptions(ele.property)}
								data={getData(
									ele.property,
									ele.data,
									ele.borderColor,
									ele.backgroundColor
								)}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default HomePage;
