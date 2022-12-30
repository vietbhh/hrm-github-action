// ** React Imports
import classNames from "classnames"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components

const ImportStep = (props) => {
  const {
    // ** props
    currentStep
    // ** methods
  } = props

  // ** render
  return (
    <Card>
      <CardBody className="pl-3">
        <div className="d-flex flex-wrap w-100 import-step-area">
          <div className="d-flex align-items-center step-div ">
            <i
              className={classNames("far fa-angle-right icon-circle step-i", {
                "active-i": currentStep === "upload_file"
              })}></i>
            <span
              className={classNames("step-text", {
                "active-text": currentStep === "upload_file"
              })}>
              1. {useFormatMessage("modules.employees.import.step_1")}
            </span>
          </div>
          <div className="d-flex align-items-center step-div">
            <i
              className={classNames("far fa-angle-right icon-circle step-i", {
                "active-i": currentStep === "map_fields"
              })}></i>
            <span
              className={classNames("step-text", {
                "active-text": currentStep === "map_fields"
              })}>
              2. {useFormatMessage("modules.employees.import.step_2")}
            </span>
          </div>
          <div className="d-flex align-items-center step-div">
            <i
              className={classNames("far fa-angle-right icon-circle step-i", {
                "active-i": currentStep === "preview_and_import"
              })}></i>
            <span
              className={classNames("step-text", {
                "active-text": currentStep === "preview_and_import"
              })}>
              3. {useFormatMessage("modules.employees.import.step_3")}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default ImportStep
