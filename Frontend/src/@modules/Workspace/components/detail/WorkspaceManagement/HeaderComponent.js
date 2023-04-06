// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"

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
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3>{useFormatMessage("modules.workspace.title.manage_workspace")}</h3>
        <Button.Ripple color="success">
          {useFormatMessage("modules.workspace.buttons.create")}
        </Button.Ripple>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <Space>
            <Button.Ripple color="success" outline size="sm">
              All
            </Button.Ripple>
            <Button.Ripple color="secondary" outline size="sm">
              Active
            </Button.Ripple>
            <Button.Ripple color="secondary" outline size="sm">
              Disabled
            </Button.Ripple>
          </Space>
        </div>
        <div className="w-25">
          <ErpInput
            prepend={<i className="fas fa-search" />}
            nolabel={true}
            placeholder={useFormatMessage(
              "modules.workspace.text.search_workspace"
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default HeaderComponent
