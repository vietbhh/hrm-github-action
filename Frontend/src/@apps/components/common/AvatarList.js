// ** React Imports
import { Fragment } from "react";

// ** Third Party Components
import Proptypes from "prop-types";
import classnames from "classnames";
import Avatar from "@apps/modules/download/pages/Avatar";
import { MoreHorizontal } from "react-feather";
import AvatarComponent from "@components/avatar";
import { useFormatMessage } from "@apps/utility/common";
import { UncontrolledTooltip } from "reactstrap";
// ** Custom Components

const AvatarList = (props) => {
  // ** Props
  const { data, tag, className } = props;
  // ** Conditional Tag
  const Tag = tag ? tag : "div";
  const limit = props.maxShow;
  // ** Render Data
  const renderData = () => {
    return data.map((item, i) => {
      const newProps = { ...item };
      if (i < limit) {
        return (
          <Fragment key={i}>
            <Avatar
              src={item[props.avatarKey]}
              className={classnames("pull-up", {
                [item.className]: item.className
              })}
              title={item[props.titleKey]}
              meta={undefined}
              {...newProps}
            />
          </Fragment>
        );
      }
    });
  };
  const title = parseInt(data.length) - parseInt(limit);
  return (
    <Tag
      className={classnames("avatar-group", {
        [className]: className
      })}
    >
      {renderData()}
      {title > 0 && (
        <Fragment>
          <UncontrolledTooltip target="more_permissions">
            {`${title} ${useFormatMessage("common.more")}`}
          </UncontrolledTooltip>
          <AvatarComponent
            className="pull-up"
            id="more_permissions"
            size="sm"
            meta={undefined}
            title={`${title} ${useFormatMessage("common.more")}`}
            color="primary"
            icon={<MoreHorizontal size={14} />}
            onClick={props.moreOnclick || null}
          />
        </Fragment>
      )}
    </Tag>
  );
};

export default AvatarList;
AvatarList.defaultProps = {
  maxShow: 3,
  avatarKey: "img",
  titleKey: "title"
};
// ** PropTypes
AvatarList.propTypes = {
  data: Proptypes.array.isRequired,
  tag: Proptypes.oneOfType([Proptypes.func, Proptypes.string]),
  maxShow: Proptypes.number,
  avatarKey: Proptypes.string,
  titleKey: Proptypes.string
};
