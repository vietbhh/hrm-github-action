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
    userAuth,
    // ** methods
    setData
  } = props

  const _handleSetData = (obj, isNewObj = false) => {
    const newData = [...data].map((item) => {
      if (item._id === rowData._id) {
        if (isNewObj) {
          return {
            ...obj
          }
        }

        return {
          ...item,
          ...obj
        }
      }

      return { ...item }
    })

    setData(newData)
  }

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
            _handleSetData({
              status: status
            })
          })
          .catch((err) => {})
      }
    })
  }

  const handleClickSetAdmin = (type) => {
    SwAlert.showWarning({
      title: useFormatMessage(
        `modules.workspace.text.warning_set_admin.${type}.title`
      ),
      text: useFormatMessage(
        `modules.workspace.text.warning_set_admin.${type}.description`,
        {
          name: rowData.name
        }
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        workspaceApi
          .update(rowData._id, {
            data: {
              id: parseInt(userAuth.id)
            },
            type: type === "become" ? "add" : "remove",
            update_administrator: true
          })
          .then((res) => {
            _handleSetData(res.data.data)
          })
          .catch((err) => {})
      }
    })
  }

  const getItem = (rowData) => {
    if (rowData.status === "active") {
      const temp = [
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
        }
      ]
      if (rowData.administrators.includes(parseInt(userAuth.id))) {
        temp.push({
          key: "2",
          label: (
            <p
              className="mb-0 p-50"
              onClick={() => handleClickSetAdmin("leave")}>
              <i className="far fa-user-tag me-50" />
              {useFormatMessage(
                "modules.workspace.buttons.leave_admin_workspace"
              )}
            </p>
          )
        })
      } else {
        temp.push({
          key: "2",
          label: (
            <p
              className="mb-0 p-50"
              onClick={() => handleClickSetAdmin("become")}>
              <i className="far fa-user-cog me-50" />
              {useFormatMessage(
                "modules.workspace.buttons.become_admin_workspace"
              )}
            </p>
          )
        })
      }

      return temp
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
