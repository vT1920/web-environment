import { Result } from "antd";
import React from "react";
export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="exception-page">
					<div className="main">
						<Result status="500" title="Có lỗi xảy ra." />
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
