import SquareLoader from './SquareLoader';

const { Spinner } = require('reactstrap');

const AppSpinner = (props) => {
	return (
		<div className="fallback-spinner">
			<div className="loading component-loader">
				<SquareLoader type="grow" color="primary" {...props} />
			</div>
		</div>
	);
};

export default AppSpinner;
