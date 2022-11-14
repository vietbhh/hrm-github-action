// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const EmployeeOvertimeItem = (props) => {
  const {
    // ** props
    employee
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div className="d-flex flex-column align-items-center  me-75 mb-1 employee-item">
        <div className="mb-1">
          <Avatar imgWidth={40} imgHeight={40} />
        </div>
        <p className="mb-0 employee-name">{employee.full_name}</p>
        <small>{employee.email}</small>
      </div>
    </Fragment>
  )
}

export default EmployeeOvertimeItem
