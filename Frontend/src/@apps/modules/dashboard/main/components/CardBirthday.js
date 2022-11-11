import { EmptyContent } from "@apps/components/common/EmptyContent";
import Avatar from "@apps/modules/download/pages/Avatar";
import { useFormatMessage } from "@apps/utility/common";
import { convertDate } from "@modules/Payrolls/common/common";
import { Tooltip } from "antd";
import classNames from "classnames";
import { isEmpty, map } from "lodash";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

const CardBirthday = (props) => {
  const { loading, data } = props;

  return (
    <Card className="card-user-timeline">
      <CardHeader>
        <div className="d-flex align-items-center">
          <h1 className="card-title">
            <span className="title-icon">
              <i className="fal fa-birthday-cake"></i>
            </span>
            <CardTitle tag="span">
              {useFormatMessage("modules.dashboard.birthday_this_month")}
            </CardTitle>
          </h1>
        </div>
      </CardHeader>
      <CardBody className="profile-suggestion min-height-50">
        <div className="ant-spin-nested-loading">
          {loading && (
            <div>
              <div
                className="ant-spin ant-spin-spinning"
                aria-live="polite"
                aria-busy="true"
              >
                <span className="ant-spin-dot ant-spin-dot-spin">
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                </span>
              </div>
            </div>
          )}
          <div
            className={classNames({
              "ant-spin-blur": loading
            })}
          >
            {!loading && (
              <>
                {isEmpty(data) && (
                  <EmptyContent
                    icon={<i className="fal fa-birthday-cake"></i>}
                    title={useFormatMessage(
                      "modules.dashboard.birthday_this_month_empty"
                    )}
                    text=""
                  />
                )}

                {map(data, (value, key) => {
                  return (
                    <Tooltip key={key} title={convertDate(value.dob)}>
                      <div style={{ display: "inline-block" }}>
                        <div className="d-flex justify-content-start align-items-center mb-1 me-1 bg-birth-day bg-light-success">
                          <div className="avatar me-1">
                            <Avatar
                              className="img"
                              size="sm"
                              src={value.avatar}
                            />
                          </div>
                          <div className="profile-user-info">
                            <h6 className="mb-0 text-primary">
                              {value.full_name}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardBirthday;
