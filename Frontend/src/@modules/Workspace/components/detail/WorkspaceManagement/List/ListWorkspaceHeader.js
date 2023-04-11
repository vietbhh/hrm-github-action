// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components
import Header from "../Common/Header"

const ListWorkspaceHeader = (props) => {
  const {
    // ** props
    data,
    filter,
    // ** methods
    setFilter
  } = props

  const numberWorkspace = data !== undefined ? data.length : 0

  const handleChangeDate = (value, type) => {
    console.log(value)
    setFilter({
      [type]: value
    })
  }

  const handleClickStatus = (status) => {
    setFilter({
      status: status
    })
  }

  // ** render
  return (
    <div className="w-100 mb-2 list-header">
      <div className="mb-1">
        <Header
          title={useFormatMessage(
            numberWorkspace === 1
              ? "modules.workspace.title.workspace_in_the_organization"
              : "modules.workspace.title.workspaces_in_the_organization",
            {
              number: numberWorkspace
            }
          )}
          from={filter.from}
          to={filter.to}
          handleChangeDate={handleChangeDate}
        />
      </div>
      <div className="status-filter">
        <Space>
          <Button.Ripple
            color={filter.status === "all" ? "success" : "secondary"}
            outline
            size="sm"
            onClick={() => handleClickStatus("all")}>
            {useFormatMessage("modules.workspace.options.status.all")}
          </Button.Ripple>
          <Button.Ripple
            color={filter.status === "active" ? "success" : "secondary"}
            outline
            size="sm"
            onClick={() => handleClickStatus("active")}>
            {useFormatMessage("modules.workspace.options.status.active")}
          </Button.Ripple>
          <Button.Ripple
            color={filter.status === "disable" ? "success" : "secondary"}
            outline
            size="sm"
            onClick={() => handleClickStatus("disable")}>
            {useFormatMessage("modules.workspace.options.status.disable")}
          </Button.Ripple>
        </Space>
      </div>
    </div>
  )
}

export default ListWorkspaceHeader
