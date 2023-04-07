// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components

const HeaderComponent = (props) => {
  const {
    // ** props
    filter,
    // ** methods
    setFilter
  } = props

  // ** render
  return (
    <div className="header">
      <div className="d-flex align-items-center justify-content-between mb-75">
        <h3>{useFormatMessage("modules.workspace.title.manage_workspace")}</h3>
        <Button.Ripple color="success">
          {useFormatMessage("modules.workspace.buttons.create")}
        </Button.Ripple>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <p>
          {useFormatMessage(
            "modules.workspace.text.manage_workspace_description"
          )}
        </p>
      </div>
    </div>
  )
}

export default HeaderComponent
