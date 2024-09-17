import { Spin } from "antd";

const Loader = () => {
	return (
		<div style={{
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.1)',
			zIndex: 9999
		}}>
			<Spin size="large" />
		</div>
	);
};

export default Loader;