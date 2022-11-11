import { Fragment } from "react";
import LoadingBar from "react-top-loading-bar";
const AppLoadingBar = () => {
  return (
    <Fragment>
      <LoadingBar
        ref={(ref) => (global["appLoadingBar"] = ref)}
        shadow={true}
        className="appLoadingBar"
      />
    </Fragment>
  );
};

export default AppLoadingBar;
