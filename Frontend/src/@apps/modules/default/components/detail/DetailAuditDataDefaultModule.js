import { UncontrolledTooltip } from "reactstrap";

const { useFormatMessage, timeDifference } = require("@apps/utility/common");
const { isEmpty } = require("lodash");
const { Fragment } = require("react");
import { Link } from "react-router-dom";
const DetailAuditDataDefaultModule = (props) => {
  const { data } = props;
  return (
    <Fragment>
      <p className="mb-0">
        <small>
          {!isEmpty(data.owner) && (
            <Fragment>
              {useFormatMessage("common.owner_by")}{" "}
              <Link to={`/users/${data.owner.label}`}>@{data.owner.label}</Link>{" "}
              <br />
            </Fragment>
          )}
          {!isEmpty(data.created_by) && (
            <Fragment>
              {useFormatMessage("common.created_by")}{" "}
              <Link to={`/users/${data.created_by.label}`}>
                @{data.created_by.label}
              </Link>
            </Fragment>
          )}
          ({timeDifference(data.created_at)})
          {!isEmpty(data.updated_by) ? (
            <Fragment>
              <br />
              {useFormatMessage("common.updated_by")}{" "}
              <Link to={`/users/${data.updated_by.label}`}>
                @{data.updated_by.label}
              </Link>{" "}
              ({timeDifference(data.updated_at)})
            </Fragment>
          ) : (
            ""
          )}
          {!isEmpty(data.update_permissions) ||
          !isEmpty(data.view_permissions) ? (
            <Fragment>
              <br />
              {!isEmpty(data.update_permissions) && (
                <Fragment>
                  <span
                    className="text-primary cursor-pointer"
                    id="update_permissions"
                  >
                    {data.update_permissions.length}{" "}
                    {useFormatMessage("common.others")}
                  </span>{" "}
                  {useFormatMessage("common.can_update")}{" "}
                  <UncontrolledTooltip
                    placement="top"
                    target="update_permissions"
                  >
                    {data.update_permissions.map((item, index) => {
                      let str = `@${item.label}`;
                      if (index !== data.view_permissions.length - 1)
                        str += ",";
                      return str;
                    })}
                  </UncontrolledTooltip>
                </Fragment>
              )}
              {!isEmpty(data.view_permissions) && (
                <Fragment>
                  <span
                    className="text-primary cursor-pointer"
                    id="view_permissions"
                  >
                    {data.view_permissions.length}{" "}
                    {useFormatMessage("common.others")}
                  </span>{" "}
                  {useFormatMessage("common.can_view")}
                  <UncontrolledTooltip
                    placement="top"
                    target="view_permissions"
                  >
                    {data.view_permissions.map((item, index) => {
                      let str = `@${item.label}`;
                      if (index !== data.view_permissions.length - 1)
                        str += ",";
                      return str;
                    })}
                  </UncontrolledTooltip>
                </Fragment>
              )}
            </Fragment>
          ) : (
            ""
          )}
        </small>
      </p>
    </Fragment>
  );
};

export default DetailAuditDataDefaultModule;
