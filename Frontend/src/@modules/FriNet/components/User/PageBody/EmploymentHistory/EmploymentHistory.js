// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { getDefaultFridayLogo } from "@apps/utility/common"
import classNames from "classnames"
import { convertNumberOfDays } from "../../../../common/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import CommonCardHeader from "../CommonCardHeader"
import PerfectScrollbar from "react-perfect-scrollbar"
import moment from "moment"
import { Fragment } from "react"

const EmploymentHistory = (props) => {
  const {
    // **  prop
    employeeData
    // ** methods
  } = props

  // ** render
  const renderNumberOfDay = (numberOfDay) => {
    if (
      numberOfDay === null ||
      numberOfDay === undefined
    ) {
      return ""
    }

    return <Fragment> • {convertNumberOfDays(numberOfDay)}</Fragment>
  }

  return (
    <Card className="mb-1 employment-history-section">
      <CardBody>
        <CommonCardHeader
          title={useFormatMessage("modules.employees.text.employment_history")}
          showButtonAction={false}
        />
        <PerfectScrollbar>
          <div className="employment-history-list">
            {employeeData.employee_history.map((item, index) => {
              const toTime =
                employeeData.employee_history[index - 1] === undefined
                  ? "present"
                  : moment(
                      employeeData.employee_history[index - 1]["created_at"]
                    ).format("MMMM YYYY")
              const numberOfDay =
                toTime === "present"
                  ? moment().diff(moment(item.created_at), "days")
                  : moment(toTime).diff(moment(item.created_at), "days")

              return (
                <div
                  key={`employment-history-item-${index}`}
                  className="employment-history-item">
                  <div className="d-flex align-items-start content-wrapper">
                    <div className="me-2 icon">
                      <img
                        src={item.icon ?? getDefaultFridayLogo("icon")}
                        className={classNames("img", {
                          custom: item.icon !== null
                        })}
                        width={48}
                      />
                    </div>
                    <div className="info">
                      <p className="mb-25 mt-0 title">
                        {item.employment.job_title_id?.label}
                      </p>
                      <p className="mb-25 mt-0 text">
                        {item.employment.department?.label} •{" "}
                        {item.employment.employee_type?.label}
                      </p>
                      <small className="time">
                        {moment(item.created_at).format("MMMM YYYY")} - {toTime}{" "}
                        <Fragment>{renderNumberOfDay(numberOfDay)}</Fragment>
                      </small>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </PerfectScrollbar>
      </CardBody>
    </Card>
  )
}

export default EmploymentHistory
