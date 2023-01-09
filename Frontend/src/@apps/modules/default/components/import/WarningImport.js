// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components

const WarningImport = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <Card>
      <CardBody className="border-box">
        <div className="d-flex flex-wrap w-100 mb-1">
          <div className="d-flex align-items-center">
            <i className="fal fa-info-circle icon-instruction"></i>
            <span className="instruction-bold">
              {useFormatMessage("module.default.import.text.warning_import.title")}
            </span>
          </div>
        </div>
        <div className="d-flex flex-wrap w-100 mb-1">
          <div className="d-flex align-items-center">
            <span className="">
              {useFormatMessage("module.default.import.text.warning_import.text")}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default WarningImport
