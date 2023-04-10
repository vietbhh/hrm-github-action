// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { workspaceApi } from "../../../../common/api"
// ** Styles
import { Dropdown } from "antd"
import { Button } from "reactstrap"
// ** Components
import SwAlert from "@apps/utility/SwAlert"

const ActionTable = (props) => {
  const {
    // ** props
    data,
    rowData,
    // ** methods
    setData
  } = props

  const handleClickChangeStatus = (status) => {
    SwAlert.showWarning({
      title: useFormatMessage(
        `modules.workspace.text.warning_change_workspace_status.${status}.title`
      ),
      text: useFormatMessage(
        `modules.workspace.text.warning_change_workspace_status.${status}.description`,
        {
          name: rowData.name
        }
      )
    }).then((res) => {
      if (res.isConfirmed) {
        workspaceApi
          .update(rowData._id, {
            status: status
          })
          .then((res) => {
            const newData = [...data].map((item) => {
              if (item._id === rowData._id) {
                return {
                  ...item,
                  status: status
                }
              }

              return { ...item }
            })

            setData(newData)
          })
          .catch((err) => {})
      }
    })
  }

  const handleClickBecomeAdmin = () => {
    SwAlert.showWarning({
      title: useFormatMessage(
        `modules.workspace.text.warning_become_admin.title`
      ),
      text: useFormatMessage(
        `modules.workspace.text.warning_become_admin.description`,
        {
          name: rowData.name
        }
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
      }
    })
  }

  const getItem = (rowData) => {
    if (rowData.status === "active") {
      return [
        {
          key: "1",
          label: (
            <p
              className="mb-0 p-50"
              onClick={() => handleClickChangeStatus("disable")}>
              <i className="far fa-lock-alt me-50" />
              {useFormatMessage("modules.workspace.buttons.disable_workspace")}
            </p>
          )
        },
        {
          key: "2",
          label: (
            <p className="mb-0 p-50" onClick={() => handleClickBecomeAdmin()}>
              <i className="far fa-user-cog me-50" />
              {useFormatMessage(
                "modules.workspace.buttons.become_admin_workspace"
              )}
            </p>
          )
        }
      ]
    }

    return [
      {
        key: "1",
        label: (
          <p
            className="mb-0 p-50"
            onClick={() => handleClickChangeStatus("active")}>
            <i className="far fa-lock-open-alt me-50" />
            {useFormatMessage("modules.workspace.buttons.reactivate_workspace")}
          </p>
        )
      }
    ]
  }

  const items = getItem(rowData)

  // ** render
  return (
    <Dropdown
      menu={{
        items
      }}
      trigger="click"
      placement="bottom"
      overlayClassName="action-workspace-dropdown">
      <Button.Ripple color="flat-secondary" className="btn-icon" size="sm">
        <i className="fa-solid fa-ellipsis" />
      </Button.Ripple>
    </Dropdown>
  )
}

export default ActionTable
