// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Link } from "react-router-dom"
import dayjs from "dayjs"
// ** Styles
import { Dropdown, Space } from "antd"
import { Button } from "reactstrap"
import { Trash } from "react-feather"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import SwAlert from "@apps/utility/SwAlert"

const MemberItem = (props) => {
  const {
    // ** props
    id,
    member,
    currentPage,
    perPage,
    isAdmin,
    userState,
    isAdminGroup,
    avatarWidth,
    avatarHeight,
    // ** methods
    setFilter,
    loadData,
    setIsReloadAdmin
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
            loadData(true)
            setIsReloadAdmin(true)
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
          member_id: member.id,
          remove_member: true,
          page: currentPage,
          limit: perPage
        }

        workspaceApi
          .update(id, values)
          .then((res) => {
            loadData(true)
          })
          .catch((err) => {})
      }
    })
  }

  const handleClickMessenge = () => {
    window.open(`/chat/${member.username}`, "_blank", "noopener,noreferrer")
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-50">
              <path
                d="M8.74179 1.8583L4.58346 3.41663C3.62513 3.77496 2.8418 4.90829 2.8418 5.93329V12.1249C2.8418 13.1083 3.49181 14.4 4.28347 14.9916L7.8668 17.6666C9.0418 18.55 10.9751 18.55 12.1501 17.6666L15.7335 14.9916C16.5251 14.4 17.1751 13.1083 17.1751 12.1249V5.93329C17.1751 4.90829 16.3918 3.77496 15.4335 3.41663L11.2751 1.8583C10.5668 1.59997 9.43345 1.59997 8.74179 1.8583Z"
                stroke="#32434F"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.0001 9.09998C9.96674 9.09998 9.92507 9.09998 9.89173 9.09998C9.1084 9.07498 8.4834 8.42497 8.4834 7.6333C8.4834 6.82497 9.14174 6.16663 9.95007 6.16663C10.7584 6.16663 11.4167 6.82497 11.4167 7.6333C11.4084 8.4333 10.7834 9.07498 10.0001 9.09998Z"
                stroke="#32434F"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.3417 11.4333C7.5417 11.9666 7.5417 12.8416 8.3417 13.375C9.25003 13.9833 10.7417 13.9833 11.65 13.375C12.45 12.8416 12.45 11.9666 11.65 11.4333C10.75 10.825 9.25837 10.825 8.3417 11.4333Z"
                stroke="#32434F"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="align-middle">
              {useFormatMessage("modules.workspace.buttons.invite_as_admin")}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="me-50">
              <path
                d="M9 16.5C13.125 16.5 16.5 13.125 16.5 9C16.5 4.875 13.125 1.5 9 1.5C4.875 1.5 1.5 4.875 1.5 9C1.5 13.125 4.875 16.5 9 16.5Z"
                stroke="#32434F"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.87988 11.1213L11.1225 6.8787"
                stroke="#32434F"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.1225 11.1213L6.87988 6.87866"
                stroke="#32434F"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="align-middle">
              {useFormatMessage("modules.workspace.buttons.remove_member")}
            </span>
          </Button.Ripple>
        )
      }
    ]
  }

  // ** render
  const renderMemberAction = () => {
    if (isAdmin === true) {
      return ""
    }

    if (isAdminGroup && parseInt(member.id) !== parseInt(userState.id)) {
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

  const renderMesseneButton = () => {
    if (isAdmin === true) {
      return ""
    }

    if (parseInt(member.id) === parseInt(userState.id)) {
      return ""
    }

    return (
      <Button.Ripple
        className=" d-flex align-items-center custom-button custom-primary"
        disabled={loading}
        onClick={() => handleClickMessenge()}>
        <i className="fab fa-facebook-messenger me-50" />
        {useFormatMessage("modules.workspace.buttons.messenge")}
      </Button.Ripple>
    )
  }

  return (
    <div className="w-100 d-flex align-items-center justify-content-between justify-items-center member-item">
      <div className="w-100 d-flex align-items-center justify-content-start">
        <Avatar
          userId={member.id}
          src={member.avatar}
          title={member.username}
          imgHeight={avatarHeight === undefined ? 40 : avatarHeight}
          imgWidth={avatarWidth === undefined ? 40 : avatarWidth}
          className="me-50"
        />
        <div>
          <Link to={`/employees/u/${member.username}`}>
            <h6 className="username mb-0">{member.full_name}</h6>
          </Link>
          <small className="join-time">
            {isAdmin
              ? useFormatMessage("modules.workspace.text.admin")
              : useFormatMessage("modules.workspace.text.joined_on", {
                  date:
                    member?.joined_at !== undefined
                      ? dayjs(member.joined_at).format("MMM DD, YYYY")
                      : ""
                })}
          </small>
        </div>
      </div>
      <div className="w-50 d-flex justify-content-end">
        <Space>
          <Fragment>{renderMesseneButton()}</Fragment>
          <Fragment>{renderMemberAction()}</Fragment>
        </Space>
      </div>
    </div>
  )
}

export default MemberItem
