// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Link } from "react-router-dom"
// ** Styles
import { Dropdown, Space } from "antd"
import { Button } from "reactstrap"
import { Trash } from "react-feather"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import SwAlert from "@apps/utility/SwAlert"
import notification from "@apps/utility/notification"

const MemberItem = (props) => {
  const {
    // ** props
    id,
    member,
    isFullPage,
    isLoadingApprovedAll,
    currentPage,
    perPage,
    isAdmin,
    isRequest,
    userState,
    isAdminGroup,
    avatarWidth,
    avatarHeight,
    // ** methods
    setFilter,
    loadData
  } = props

  const [loading, setLoading] = useState(false)

  const handleClickSetAsAdmin = (type) => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.workspace.text.confirm_set_as_administrator.title"
      ),
      text: useFormatMessage(
        `modules.workspace.text.confirm_set_as_administrator.content_${type}`,
        { name: member.username }
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        const values = {
          data: member,
          type: type,
          update_administrator: true
        }

        workspaceApi
          .update(id, values)
          .then((res) => {
            if (type === "add") {
              setFilter({
                page: res.data.current_page
              })
            } else {
              console.log("r")
              loadData()
            }
          })
          .catch((err) => {})
      }
    })
  }

  const handleRemoveMember = () => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.workspace.text.confirm_remove_member.title"
      ),
      text: useFormatMessage(
        `modules.workspace.text.confirm_remove_member.content`,
        { name: member.username }
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        const values = {
          data: member,
          remove_member: true,
          page: currentPage,
          limit: perPage
        }

        workspaceApi
          .update(id, values)
          .then((res) => {
            if (res.data.current_page !== 0) {
              setFilter({
                page: res.data.current_page
              })
            } else {
              loadData()
            }
          })
          .catch((err) => {})
      }
    })
  }

  const handleClickApprove = () => {
    setLoading(true)

    if (isFullPage) {
      const values = {
        data: member,
        approve_join_request: true,
        is_all: false,
        page: currentPage,
        limit: perPage
      }

      workspaceApi
        .update(id, values)
        .then((res) => {
          setLoading(false)
          setFilter({
            page: res.data.currentPage
          })
        })
        .catch((err) => {
          setLoading(false)
        })
    } else {
      const values = {
        data: member,
        approve_join_request: true,
        is_all: false
      }

      workspaceApi
        .update(id, values)
        .then((res) => {
          setLoading(false)
          loadData()
        })
        .catch((err) => {
          setLoading(false)
        })
    }
  }

  let items = []
  if (isAdmin) {
    items = [
      {
        key: "1",
        label: (
          <Button.Ripple
            color="flat-secondary"
            size="sm"
            onClick={() => handleClickSetAsAdmin("remove")}
            className="w-100">
            <i className="far fa-shield me-50" />
            <span className="align-middle">
              {useFormatMessage(
                "modules.workspace.buttons.remove_from_administrator"
              )}
            </span>
          </Button.Ripple>
        )
      },
      {
        key: "2",
        label: (
          <Button.Ripple
            color="flat-secondary"
            size="sm"
            onClick={() => handleRemoveMember()}
            className="w-100">
            <Trash className="me-50" size={15} />
            <span className="align-middle">
              {useFormatMessage(
                "modules.workspace.buttons.remove_this_member_from_this_workspace"
              )}
            </span>
          </Button.Ripple>
        )
      },
      {
        key: "3",
        label: (
          <Button.Ripple
            color="flat-secondary"
            size="sm"
            //onClick={() => handleClickDelete()}
            className="w-100">
            <i className="far fa-user-circle me-50" />
            <span className="align-middle">
              {useFormatMessage("modules.workspace.buttons.view_profile")}
            </span>
          </Button.Ripple>
        )
      }
    ]
  } else {
    items = [
      {
        key: "1",
        label: (
          <Button.Ripple
            color="flat-secondary"
            size="sm"
            onClick={() => handleClickSetAsAdmin("add")}
            className="w-100">
            <i className="far fa-shield me-50" />
            <span className="align-middle">
              {useFormatMessage(
                "modules.workspace.buttons.set_as_administrator"
              )}
            </span>
          </Button.Ripple>
        )
      },
      {
        key: "2",
        label: (
          <Button.Ripple
            color="flat-secondary"
            size="sm"
            onClick={() => handleRemoveMember()}
            className="w-100">
            <Trash className="me-50" size={15} />
            <span className="align-middle">
              {useFormatMessage(
                "modules.workspace.buttons.remove_this_member_from_this_workspace"
              )}
            </span>
          </Button.Ripple>
        )
      },
      {
        key: "3",
        label: (
          <Button.Ripple
            color="flat-secondary"
            size="sm"
            //onClick={() => handleClickDelete()}
            className="w-100">
            <i className="far fa-user-circle me-50" />
            <span className="align-middle">
              {useFormatMessage("modules.workspace.buttons.view_profile")}
            </span>
          </Button.Ripple>
        )
      }
    ]
  }

  // ** render
  const renderMemberAction = () => {
    if (isAdminGroup && parseInt(member.id) !== parseInt(userState.id)) {
      if (isRequest) {
        if (member.approved === true) {
          return ""
        }

        return (
          <Button.Ripple
            size="sm"
            color="secondary"
            className="btn-action-secondary"
            disabled={loading || isLoadingApprovedAll}
            onClick={() => handleClickApprove()}>
            {useFormatMessage("modules.workspace.buttons.approve")}
          </Button.Ripple>
        )
      }

      return (
        <Dropdown
          placement="bottomRight"
          menu={{ items }}
          trigger="click"
          overlayClassName="dropdown-workspace-group-rule">
          <Button.Ripple
            color="secondary"
            className="btn-icon btn-action-secondary">
            <i className="fas fa-ellipsis-h" />
          </Button.Ripple>
        </Dropdown>
      )
    }

    return ""
  }

  return (
    <div className="w-100 d-flex align-items-center justify-content-between justify-items-center member-item">
      <Link to={`/employees/u/${member.username}`}>
        <div className="w-50 d-flex align-items-center justify-content-start">
          <Avatar
            userId={member.id}
            src={member.avatar}
            title={member.username}
            imgHeight={avatarHeight === undefined ? 48 : avatarHeight}
            imgWidth={avatarWidth === undefined ? 48 : avatarWidth}
            className="me-50"
          />
          <h6 className="mb-0">{member.username}</h6>
        </div>
      </Link>
      <div className="w-50 d-flex justify-content-end">
        <Fragment>{renderMemberAction()}</Fragment>
      </div>
    </div>
  )
}

export default MemberItem
