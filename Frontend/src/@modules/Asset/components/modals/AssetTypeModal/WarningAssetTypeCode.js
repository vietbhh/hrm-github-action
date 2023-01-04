// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Alert } from "reactstrap"
// ** Components
import { ErpRadio } from "@apps/components/common/ErpField"

const WarningAssetTypeCode = (props) => {
  const {
    // ** props
    acceptChangeAssetCode,
    // ** methods
    setAcceptChangeAssetCode
  } = props

  const handleChangeAccept = (value) => {
    setAcceptChangeAssetCode(value)
  }

  // ** render
  return (
    <Fragment>
      <Alert color="danger" isOpen={true}>
        <div className="alert-body ">
          {useFormatMessage(
            "modules.asset_groups.text.warning_asset_type_code"
          )}
        </div>
        <div className="d-flex align-items-center justify-content-start p-1">
          <div className="d-flex align-items-center me-2">
            <ErpRadio
              name="rdo-accept-change-code"
              value={1}
              checked={acceptChangeAssetCode === 1}
              onChange={() => handleChangeAccept(1)}
            />
            <span>{useFormatMessage("modules.asset_groups.text.yes")}</span>
          </div>
          <div className="d-flex align-items-center">
            <ErpRadio
              name="rdo-accept-change-code"
              value={0}
              checked={acceptChangeAssetCode === 0}
              onChange={() => handleChangeAccept(0)}
            />
            <span>{useFormatMessage("modules.asset_groups.text.no")}</span>
          </div>
        </div>
      </Alert>
    </Fragment>
  )
}

export default WarningAssetTypeCode
