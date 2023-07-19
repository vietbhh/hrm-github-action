// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import CommonCardHeader from "../CommonCardHeader"

const EmploymentHistory = (props) => {
  const {
    // **  prop
    employeeData,
    userAuth
    // ** methods
  } = props

  // ** render
  return (
    <Card className="mb-1 about-me-section" id="about-me-section">
      <CardBody>
        <CommonCardHeader
          title={useFormatMessage("modules.employees.text.employment_history")}
          showButtonAction={false}
        />
        <div></div>
      </CardBody>
    </Card>
  )
}

export default EmploymentHistory
