import { Fragment } from "react";
import classnames from "classnames";
import { Spinner } from "reactstrap";
import Proptypes from "prop-types";
import { Lock } from "react-feather";
const LockedCard = (props) => {
  const { children, blocking, loader, className, tag, overlayColor } = props;

  const Tag = tag;

  return (
    <Fragment>
      <Tag
        className={classnames("ui-loader div-locked", {
          [className]: className,
          show: blocking
        })}
      >
        {children}
        {blocking ? (
          <Fragment>
            <div
              className="overlay-blur with-border-radius" /*eslint-disable */
              {...(blocking && overlayColor
                ? { style: { backgroundColor: overlayColor } }
                : {})}
              /*eslint-enable */
            ></div>
            <div className="locked-loader">{loader}</div>
          </Fragment>
        ) : null}
      </Tag>
    </Fragment>
  );
};
export default LockedCard;

LockedCard.defaultProps = {
  tag: "div",
  blocking: false,
  loader: <Lock size="30"/>
};

LockedCard.propTypes = {
  tag: Proptypes.string,
  loader: Proptypes.any,
  className: Proptypes.string,
  overlayColor: Proptypes.string,
  blocking: Proptypes.bool.isRequired
};
