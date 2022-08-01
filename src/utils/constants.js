import faceRedIcon from "../assets/images/ic-face-red.svg";
import faceOrangeIcon from "../assets/images/ic-face-orange.svg";
import faceYellowIcon from "../assets/images/ic-face-yellow.svg";
import faceGreenIcon from "../assets/images/ic-face-green.svg";

export const Status = {
	DANGER: {
		color: "purple",
		icon: faceRedIcon,
		text: "Cảnh báo khẩn cấp về sức khỏe: Toàn bộ dân số bị ảnh hưởng tới sức khỏe tới mức nghiêm trọng.",
		text1:"Mọi người nên ở trong nhà, đóng cửa ra vào và cửa sổ. Nếu cần thiết phải ra ngoài, hãy đeo khẩu trang đạt tiêu chuẩn."
	},
	VERYBAD: {
		color: "purple",
		icon: faceRedIcon,
		text: "Cảnh báo hưởng tới sức khỏe: mọi người bị ảnh hưởng tới sức khỏe nghiêm trọng hơn.",
		text1:"Mọi người hạn chế tối đa các hoạt động ngoài trời và chuyển tất cả các hoạt động vào trong nhà."
	},
	BAD: {
		color: "red",
		icon: faceRedIcon,
		text: "Những người bình thường bắt đầu có các ảnh hưởng tới sức khỏe, nhóm người nhạy cảm có thể gặp những vấn đề sức khỏe nghiêm trọng hơn.",
		text1:"Mọi người nên giảm các hoạt động mạnh khi ở ngoài trời, tránh tập thể dục kéo dài và nghỉ ngơi nhiều hơn trong nhà."
	},
	WARNING: {
		color: "orange",
		icon: faceOrangeIcon,
		text: "Những người nhạy cảm gặp phải các vấn đề về sức khỏe, những người bình thường ít ảnh hưởng.",
		text1:"Những người thấy có triệu chứng đau mắt, ho hoặc đau họng… nên cân nhắc giảm các hoạt động ngoài trời."
	},
	MEDIUM: {
		color: "yellow",
		icon: faceYellowIcon,
		text: "Chất lượng không khí ở mức chấp nhận được. Tuy nhiên, đối với những người nhạy cảm (người già, trẻ em, người mắc các bệnh hô hấp, tim mạch…) có thể chịu những tác động nhất định tới sức khỏe",
		text1:"Tự do thực hiện các hoạt động ngoài trời."
	},
	GOOD: {
		color: "green",
		icon: faceGreenIcon,
		text: "Chất lượng không khí tốt, không ảnh hưởng tới sức khỏe",
		text1:"Tự do thực hiện các hoạt động ngoài trời."
	},
};

export const tableData = {
	//i:[1,2,3,4,5,6,7,8],
	I: [0, 50, 100, 150, 200, 300, 400, 500],
	CO: [0, 10000, 30000, 45000, 60000, 90000, 120000, 150000],
	D: [0, 25, 50, 80, 150, 250, 350, 500],
	D10: [0, 50, 150, 250, 350, 420, 500, 600],
};
