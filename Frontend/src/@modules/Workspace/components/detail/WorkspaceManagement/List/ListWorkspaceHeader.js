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
    filter,
    // ** methods
    setFilter
  } = props

  const handleChangeDate = (value, to) => {
    console.log(value, to)
  }

  // ** render
  return (
    <div className="w-100 mb-2 list-header">
      <div className="mb-1">
        <Header
          title={useFormatMessage(
            "modules.workspace.title.workspaces_in_the_organization",
            {
              number: 2
            }
          )}
          from={filter.from}
          to={filter.to}
          handleChangeDate={handleChangeDate}
        />
      </div>
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
    </div>
  )
}

export default ListWorkspaceHeader
