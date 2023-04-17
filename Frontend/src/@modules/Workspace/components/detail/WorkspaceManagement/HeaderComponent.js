// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { useNavigate } from "react-router"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components

const HeaderComponent = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const history = useNavigate()

  const handleClickCreate = () => {
    history("/workspace/create")
  }

  // ** render
  return (
    <div className="header">
      <div className="d-flex align-items-center justify-content-between mb-75">
        <h3>{useFormatMessage("modules.workspace.title.manage_workspace")}</h3>
        <div>
          <Space>
            <Button.Ripple color="success" onClick={() => handleClickCreate()}>
              <i className="fas fa-plus me-50" />
              {useFormatMessage("modules.workspace.buttons.create")}
            </Button.Ripple>
          </Space>
        </div>
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
