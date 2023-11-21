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
    detailWorkspace,
    member,
    currentPage,
    perPage,
    isAdmin,
    userState,
    isAdminGroup,
    avatarWidth,
    avatarHeight,
    // ** methods
    loadData,
    setIsReloadAdmin,
    setDetailWorkspace
  } = props

  const [loading, setLoading] = useState(false)
  const isMemberAdmin =
    detailWorkspace !== undefined
      ? detailWorkspace.administrators.includes(member.id)
      : false

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
          data: JSON.stringify(member),
          type: type,
          update_administrator: true
        }

        workspaceApi
          .update(id, values)
          .then((res) => {
            const newWorkspace = { ...detailWorkspace }
            newWorkspace["administrators"] = res.data.data.administrators
            setDetailWorkspace(newWorkspace)
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
            const newWorkspace = { ...detailWorkspace }
            newWorkspace["members"] = res.data.data.members
            setDetailWorkspace(newWorkspace)
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
    if (isMemberAdmin) {
      items = [
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
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.87988 11.1213L11.1225 6.8787"
                  stroke="#32434F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.1225 11.1213L6.87988 6.87866"
                  stroke="#32434F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="align-middle">
                {useFormatMessage("modules.workspace.buttons.remove_member")}
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
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0001 9.09998C9.96674 9.09998 9.92507 9.09998 9.89173 9.09998C9.1084 9.07498 8.4834 8.42497 8.4834 7.6333C8.4834 6.82497 9.14174 6.16663 9.95007 6.16663C10.7584 6.16663 11.4167 6.82497 11.4167 7.6333C11.4084 8.4333 10.7834 9.07498 10.0001 9.09998Z"
                  stroke="#32434F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.3417 11.4333C7.5417 11.9666 7.5417 12.8416 8.3417 13.375C9.25003 13.9833 10.7417 13.9833 11.65 13.375C12.45 12.8416 12.45 11.9666 11.65 11.4333C10.75 10.825 9.25837 10.825 8.3417 11.4333Z"
                  stroke="#32434F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.87988 11.1213L11.1225 6.8787"
                  stroke="#32434F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.1225 11.1213L6.87988 6.87866"
                  stroke="#32434F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.5 10C3.5 10.8284 2.82843 11.5 2 11.5C1.17157 11.5 0.5 10.8284 0.5 10C0.5 9.17157 1.17157 8.5 2 8.5C2.82843 8.5 3.5 9.17157 3.5 10Z"
                fill="#696760"
                stroke="#696760"
              />
              <path
                d="M11.5 10C11.5 10.8284 10.8284 11.5 10 11.5C9.17157 11.5 8.5 10.8284 8.5 10C8.5 9.17157 9.17157 8.5 10 8.5C10.8284 8.5 11.5 9.17157 11.5 10Z"
                fill="#696760"
                stroke="#696760"
              />
              <path
                d="M18 12C19.1046 12 20 11.1046 20 10C20 8.89543 19.1046 8 18 8C16.8954 8 16 8.89543 16 10C16 11.1046 16.8954 12 18 12Z"
                fill="#696760"
              />
            </svg>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 20 20"
          style={{ marginRight: "4px" }}
          fill="none">
          <path
            d="M9.99984 1.66699C5.39984 1.66699 1.6665 5.12533 1.6665 9.38367C1.6665 11.8003 2.8665 13.9503 4.73316 15.367V16.9087C4.73316 17.5503 5.41649 17.9503 5.97482 17.6337L7.52486 16.7586C8.3082 16.9836 9.13316 17.1003 9.9915 17.1003C14.5915 17.1003 18.3248 13.642 18.3248 9.38367C18.3332 5.12533 14.5998 1.66699 9.99984 1.66699ZM12.9248 8.70033L10.8415 11.192C10.7082 11.3503 10.4915 11.3837 10.3165 11.2837L9.47483 10.792C9.38317 10.742 9.27484 10.7253 9.1665 10.7503L7.4915 11.1587C7.09983 11.2503 6.8165 10.792 7.07483 10.4836L9.19153 7.96699C9.31653 7.81699 9.53319 7.77533 9.70819 7.86699L10.6915 8.38366C10.7832 8.43366 10.8915 8.442 10.9915 8.417L12.5082 8.02533C12.8915 7.92533 13.1832 8.39199 12.9248 8.70033Z"
            fill="#4986FF"
          />
        </svg>

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
