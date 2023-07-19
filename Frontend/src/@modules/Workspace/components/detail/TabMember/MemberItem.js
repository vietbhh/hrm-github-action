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
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              enableBackground="new 0 0 20 20"
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAilBMVEUAAAAwQEwxQ08xQ08y Q08wQk0yQk4xQ08yQ08zQ1A0RFAxQ04yQ08xQk8yQk8wQEowRFAyQk4zQ0wwQFAyQlAzQ04yQk4w SFAyQk4wQ0wyRFAxQ04xQ08yQ08yQk0wQFAwRVAzQU4wQk0xQU4yQ08yQk4zRE8yQlAyRFAwQk4w Q1ExQU4yQ0/////YYjPwAAAALHRSTlMAQL/fr2CQ7+9QQKDf358wf8BQEGCwjyCAUICwz59gIDCg cLDgf89wcI9foNGEUCQAAAABYktHRC3N2kE9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH 5wcDCjQbW9hNqQAAAK9JREFUGNN90dkSgiAUBmA3lOJoGhlh5FKWVrz/88UyDi4zcXH4+WZgOOB5 f4YfhGGEFhInON7tCaTZYbJcFkdq0qmUZ2sImNvEsD0juOhKETer6jpDgeGm57pw2MiWyzV6EAWw QUY6tkE/i9Eac9yVcHf40Nir8nypMFishM5SCDmqkA4Gqbkgq2vVKn1P7TFIG5sa4VqmxHb8SQid Pd4gM86/eFw+MiN9X7b/vuEHqiYL5aXWzwAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMDNU MDg6NTI6MjcrMDI6MDBUOKphAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTAzVDA4OjUyOjI3 KzAyOjAwJWUS3QAAAABJRU5ErkJggg=="
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
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="18px"
              height="18px"
              viewBox="0 0 18 18"
              enableBackground="new 0 0 18 18"
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="18"
                height="18"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAbFBMVEUAAAAwQFAwQFAwQEwx Q08xQ08yQ08wQk0yQ08yQk40RFA4QFAxQ04yQk8xQk8zQ08wSFAxQ08xQU4xQU4yQ08wQlAwQ1Ew Qk00QEwwQlAyQlAwRFAyQlAyRFAxQ04yQ08yQk4zQ04yQ0/////B+xLmAAAAInRSTlMAIBBAv++v YO+QQCCgn9/PIM+gsJ9wX3BAYGBAcHCw38CwU3pnVAAAAAFiS0dEIypibDoAAAAJcEhZcwAACxMA AAsTAQCanBgAAAAHdElNRQfnBwMKNTdwGxALAAAApklEQVQY01VQ6xqCIAzdABO0FMoo7KLu/R+y AaK5H2eH83F2A1gDBRxCqoqoOtWbIJQ2Tds2Z7rgaul6m5l1XbZf+62McCqmmuxe1GrJeBsY7h7A P5iY+E0/GQJ5TyOTl2Y7pS6BkgLIT8ySJ/JZ4l6pILtC0qIRlGF4syt84kTfpOM+BOaKyv2NOuQ8 ubKam8pqvK9ElKaa9wuNiybSc3M8mWgL+wFuwgiR1QQ8nQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAy My0wNy0wM1QwODo1Mzo1NSswMjowMCag2W8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDctMDNU MDg6NTM6NTUrMDI6MDBX/WHTAAAAAElFTkSuQmCC"
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
    if (parseInt(member.id) === parseInt(userState.id)) {
      return ""
    }

    return (
      <Button.Ripple
        className=" d-flex align-items-center custom-button custom-primary mb-25"
        disabled={loading}
        onClick={() => handleClickMessenge()}>
        <i className="fab fa-facebook-messenger me-50" />
        {useFormatMessage("modules.workspace.buttons.messenge")}
      </Button.Ripple>
    )
  }

  return (
    <div className="w-100 d-flex align-items-center justify-content-between justify-items-center member-item">
      <div className="w-50 d-flex align-items-center justify-content-start">
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
            <h6 className="username mb-0">{member.username}</h6>
          </Link>
          <small className="join-time">
            {isAdmin
              ? useFormatMessage("modules.workspace.text.admin")
              : useFormatMessage("modules.workspace.text.joined_on", {
                  date: "June 12, 2023"
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
