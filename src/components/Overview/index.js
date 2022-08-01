import PropTypes from "prop-types";
import { Status } from "utils/constants";
import "./style.scss";

const Overview = (props) => {
	const { status, value } = props;
	return (
		<div className={`overview__summary overview--${status.color}`}>
			<div className="overview-value-wrapper">
				<div className={`overview-value overview-box--${status.color}`}>
					<p className="overview-value__unit"> VN AQI </p>
					<p className="overview-value__value">{value}</p>
				</div>
				<p className="overview-status">
					<span className="overview-status__label">chỉ số AQI trực tiếp</span>
					<br />
					<span className="overview-status__text">{status.text}</span>
					<br />
					<span className="overview-status__text1">{status.text1}</span>
				</p>
			</div>
			<img
				className="overview__icon"
				src={status.icon}
				alt="Mặt người cho biết mức AQI"
			/>
		</div>
	);
};

Overview.propTypes = {
	status: PropTypes.object,
	value: PropTypes.number,
};

Overview.defaultProps = {
	status: Status.GOOD,
	value: 0,
};

export default Overview;
