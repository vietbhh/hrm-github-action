// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
import { Fragment } from "react";
import { getTotalTimeAttendance } from "@modules/Attendances/common/common";
// ** Styles
import { Card, CardHeader, CardBody } from "reactstrap";
// ** Components

const AttendanceTotalTime = (props) => {
  const {
    // ** props
    loadingAttendanceBodyApi,
    totalTime
    // ** methods
  } = props;

  // ** render
  const renderHours = (seconds, roundUp = false, isNegative = false) => {
    const { hours, minutes } = getTotalTimeAttendance(seconds, roundUp);
    return (
      <span>
        {isNegative === true && "-"}
        {hours}h {minutes === 0 ? "" : minutes + "m"}
      </span>
    );
  };

  const renderComponent = () => {
    if (Object.keys(totalTime).length > 0) {
      return (
        <Fragment>
          <div className="total-time-container mt-2">
            <Card className="total-time-item">
              <CardHeader>
                <h6>
                  {useFormatMessage("modules.attendance.title.work_schedule")}
                </h6>
              </CardHeader>
              <CardBody>
                <p className="mb-0">{totalTime.work_schedule}h</p>
              </CardBody>
            </Card>
            <Card className="total-time-item">
              <CardHeader>
                <h6>
                  {useFormatMessage("modules.attendance.title.logged_time")}
                </h6>
              </CardHeader>
              <CardBody>
                <p className="mb-0">{renderHours(totalTime.logged_time)}</p>
              </CardBody>
            </Card>
            <Card className="total-time-item">
              <CardHeader>
                <h6>
                  {useFormatMessage("modules.attendance.title.paid_time")}
                </h6>
              </CardHeader>
              <CardBody>
                <p className="mb-0">{renderHours(totalTime.paid_time)}</p>
              </CardBody>
            </Card>
            <Card className="total-time-item">
              <CardHeader>
                <h6>{useFormatMessage("modules.attendance.title.deficit")}</h6>
              </CardHeader>
              <CardBody>
                <p className="mb-0">
                  {renderHours(totalTime.deficit, true, true)}
                </p>
              </CardBody>
            </Card>
            <Card className="total-time-item">
              <CardHeader>
                <h6>{useFormatMessage("modules.attendance.title.overtime")}</h6>
              </CardHeader>
              <CardBody>
                <p className="mb-0">{renderHours(totalTime.overtime)}</p>
              </CardBody>
            </Card>
          </div>
        </Fragment>
      );
    } else {
      return <Fragment></Fragment>;
    }
  };
  return !loadingAttendanceBodyApi && renderComponent();
};

export default AttendanceTotalTime;
