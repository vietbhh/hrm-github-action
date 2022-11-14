// ** React Imports
import { formatDate, useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import PerfectScrollbar from "react-perfect-scrollbar"

const ListEmployeeDOBPopover = (props) => {
  const {
    // ** props
    listEmployeeDob,
    date
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div>
        <div>
          <h4>{useFormatMessage("modules.calendar.title.birthday")}</h4>
        </div>
        <hr />
        <div>
          <p>
            <i className="far fa-calendar me-50" /> {formatDate(date)}
          </p>
          <p>
            <i className="fal fa-user-circle me-50" />
            {listEmployeeDob.length}{" "}
            {listEmployeeDob.length === 1
              ? useFormatMessage("modules.calendar.text.people")
              : useFormatMessage("modules.calendar.text.peoples")}
          </p>
        </div>
        <div className="employee-dob-info">
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            {listEmployeeDob.map((employee) => {
              return (
                <div
                  key={`employee-dob-info-${employee.id}`}
                  className="d-flex align-items-center mb-1">
                  <div>
                    <Avatar
                      src={employee.avatar}
                      imgHeight="35"
                      imgWidth="35"
                      className="me-1"
                    />
                  </div>
                  <div>
                    <p className="mb-0">{employee.full_name}</p>
                    <small>{employee.email}</small>
                  </div>
                </div>
              )
            })}
          </PerfectScrollbar>
        </div>
      </div>
    </Fragment>
  )
}

export default ListEmployeeDOBPopover
