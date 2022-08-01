import { Status, tableData } from "./constants";

// Add data to array to render chart
export const getArrayByKey = (keyStr, object) => {
	// console.log("object: ", object);
	const arr = new Array(24).fill(0);
	// Remove first field
	// delete object[Object.keys(object)[0]];

	for (const [key, value] of Object.entries(object)) {
		const index = key.split("-")[1];
		if (value?.[keyStr]) {
			arr[index] = value[keyStr];
		}
	}

	return arr;
};

// Get chart options
export const getOptions = (
	text = "",
	display = true,
	position = "top",
	responsive = true
) => {
	return {
		responsive,
		plugins: {
			legend: {
				position,
			},
			title: {
				// display,
				text,
			},
		},
	};
};

// Get x axis label
const labels = Array(24)
	.fill()
	.map((_, i) => i);

// Get data to render chart
export const getData = (
	label = "",
	data,
	borderColor = "rgb(53, 162, 235)",
	backgroundColor = "rgba(53, 162, 235, 0.5)"
) => {
	return {
		labels,
		datasets: [
			{
				label,
				data,
				borderColor,
				backgroundColor,
			},
		],
		scales: {
			x: [
				{
					display: true,
					title: {
						display: true,
						text: "Month",
						color: "#911",
					},
				},
			],
			y: [
				{
					display: true,
					title: {
						display: true,
						text: "Value",
						color: "#191",
					},
				},
			],
		},
	};
};

//
const calculateAverageByKey = (arr = [], key) => {
	const temp = [];
	arr.map((ele) => temp.push(ele[key]));

	const sum = temp.reduce((acc, cur) => acc + cur);
	const average = sum / temp.length;

	return average;
};

export const calculateAverage = (arr = [], property) => {
	const temp = {};
	// console.log("vcalculateAverage: ", arr);
	const listKey = Object.keys(arr[0]);
	for (const key of listKey) {
		temp[key] = calculateAverageByKey(arr, key);
	}

	return { [property]: temp };
};

export const groupArray = (arr = []) => {
	const obj = {};
	const listKey = Object.keys(arr);
	for (const key of listKey) {
		const temp = calculateAverage(arr[key], key);
		obj[key] = { ...temp[key] };
	}
	return obj;
};

export const toArray = (dataObj) => {
	const obj = {};
	const listKey = Object.keys(dataObj);
	// console.log("===========");
	// console.log(dataObj);
	// console.log(listKey);
	for (const key of listKey) {
		const temp = [];
		if (dataObj[key]) {
			for (const element of Object.entries(dataObj[key])) {
				temp.push(element[1]);
			}
			obj[key] = temp;
		}
	}
	return obj;
};

export const sortObject = (dataObj, key) => {
	const listKeys = Object.keys(dataObj).sort((ele) => ele);
	// console.log("====dataObj: ", dataObj);
	if (listKeys.length <= 0) {
		return dataObj;
	}

	let summaryNodes = {};

	const listKeysSorted = listKeys
		.map((ele) => +ele.split("-")?.[1])
		.sort((a, b) => a - b)
		.map((ele) => {
			if (isNaN(ele)) {
				summaryNodes = {
					key: key.replace("n", "Node"),
					data: getSummaryNodeData(dataObj[key]),
				};
			}

			return `${key}-${ele}`;
		});

	const temp = {};

	for (const key of listKeysSorted) {
		temp[key] = dataObj[key];
	}

	return [temp, summaryNodes];
};

const getSummaryNodeData = (obj) => {
	const data = [];
	for (const [key, value] of Object.entries(obj)) {
		// console.log(key, value);
		data.push({
			key,
			name: key,
			concentration: `${value} ${
				key === "H" ? "%" : key === "T" ? "°C" : "µg/m³"
			}`,
		});
	}
	return data;
};

export const renameKey = (dataObj) => {
	const result = {};
	for (const [key, value] of Object.entries(dataObj)) {
		const number = key.split("-")[1];
		result[`n-${number}`] = value;
	}
	return result;
};

export const getDataByProperty = (dataObj, property) => {
	const arr = new Array(24).fill(0);
	for (const index in labels) {
		const temp = [];
		for (const [key, value] of Object.entries(dataObj)) {
			const listKey = Object.keys(value);
			// console.log({ property, index, key, value });
			if (listKey.includes(`n-${index}`)) {
				temp.push(value[`n-${index}`][property]);
			}
		}
		if (temp.length > 0) {
			const sum = temp.reduce((acc, cur) => acc + cur);
			const average = sum / temp.length;

			arr[index] = average;

			// clear arr
			temp.splice(0, temp.length);
		}
	}
	// console.log(property, arr);
	return arr;
};

// ================================================

export const calculateNowcast = (array) => {
	const arr = array.reverse();
	if (
		(arr[0] === 0 && arr[1] === 0) ||
		(arr[0] === 0 && arr[2] === 0) ||
		(arr[1] === 0 && arr[2] === 0)
	) {
		console.log("Không có dữ liệu");
	} else {
		let max_val = Math.max.apply(null, arr);
		let min_val = Math.min.apply(null, arr);
		let wi = min_val / max_val;
		const w = Number(wi.toFixed(2));

		if (w > 0.5) {
			let numerator = 0;
			let denominator = 0;
			let nowcast = 0;
			arr.reduce(function (previousValue, currentValue, currentIndex) {
				numerator = previousValue + currentValue * Math.pow(w, currentIndex);
				return numerator;
			});
			arr.forEach(function (value, index) {
				if (value !== 0) {
					denominator = denominator + Math.pow(w, index);
				}
			});
			nowcast = Number((numerator / denominator).toFixed(1));
			return nowcast;
		} else {
			const wt = 0.5;
			let nowcast;
			arr.forEach(function (value, index) {
				if (value !== 0) {
					nowcast = value * Math.pow(wt, index);
				}
			});
			return nowcast;
		}
	}
};

export const calculateAqiHour = (name, data) => {
	let i = 0;
	tableData[name].forEach((element, index, arr) => {
		if (data > element) {
			i = index;
			return i;
		}
	});

	const a = tableData["I"][i + 1] - tableData["I"][i]; //50
	const bp = tableData[name][i + 1] - tableData[name][i]; // 10000
	const aqi = (a / bp) * (data - tableData[name][i]) + tableData["I"][i];

	const result = aqi.toFixed();

	return Number(result);
};

export const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

export const getOverview = (aqi) => {
	if (aqi <= 50) {
		return Status.GOOD;
	} else if (aqi <= 100) {
		return Status.MEDIUM;
	} else if (aqi <= 150) {
		return Status.WARNING;
	} else if (aqi <= 200) {
		return Status.BAD;
	} else if (aqi <= 300) {
		return Status.VERYBAD;
	} else {
		return Status.DANGER;
	}
};

export const getTheNearest12Hours = (arr) => {
	const today = new Date();
	// const a = [];
	const temp = [];
	for (let i = 0; i < 12; i++) {
		const index = new Date(today.getTime() - 1000 * 60 * 60 * i).getHours();
		temp.unshift(arr[index]);
		// console.log(index, arr[index]);
		// a.push(new Date(today.getTime() - 1000 * 60 * 60 * i).getHours());
	}
	// console.log(a);
	// console.log(arr);
	// console.log(temp);
	return temp;
};
