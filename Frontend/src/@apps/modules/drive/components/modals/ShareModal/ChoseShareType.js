// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { ErpRadio } from "@apps/components/common/ErpField"

const ChoseShareType = (props) => {
  const {
    // ** props
    shareType,
    // ** methods
    setShareType
  } = props

  const handleChangeShareType = (value) => {
    setShareType(value)
  }

  // ** render
  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-start">
        <div className="d-flex align-items-center me-1 chose-share-type-item">
          <ErpRadio
            name="share_type"
            className="me-25"
            value={0}
            checked={shareType === 0}
            onChange={() => handleChangeShareType(0)}
          />
          <span>
            {useFormatMessage(
              "modules.drive.field_options.share_type.share_private"
            )}
          </span>
        </div>
        <div className="d-flex align-items-center me-1 chose-share-type-item">
          <ErpRadio
            name="share_type"
            className="me-25"
            value={1}
            checked={shareType === 1 || shareType === 2}
            onChange={() => handleChangeShareType(1)}
          />
          <span>
            {useFormatMessage(
              "modules.drive.field_options.share_type.share_to_everyone"
            )}
          </span>
        </div>
        <div className="d-flex align-items-center chose-share-type-item">
          <ErpRadio
            name="share_type"
            className="me-25"
            value={2}
            checked={shareType === 3}
            onChange={() => handleChangeShareType(3)}
          />
          <span>
            {useFormatMessage(
              "modules.drive.field_options.share_type.share_to_user"
            )}
          </span>
        </div>
      </div>
    </Fragment>
  )
}

export default ChoseShareType
