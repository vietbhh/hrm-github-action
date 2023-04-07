import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Dropdown } from "antd"
import CoverEditor from "components/hrm/CoverEditor/CoverEditor"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Button, Card, CardBody, Nav, NavItem, NavLink } from "reactstrap"
import defaultWorkspaceCover from "../../assets/images/default_workspace_cover.webp"
import InviteWorkspaceModal from "../modals/InviteWorkspaceModal"
import SelectAdminModal from "../modals/SelectAdminModal"
import SetupNotificationModal from "../modals/SetupNotificationModal"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import CoverImage from "./CoverImage"

const unique = (arr) => {
  return Array.from(new Set(arr)) //
}
const arrSplice = (arr = [], IDrm) => {
  const index = arr.findIndex((v) => v === IDrm)
  arr.splice(index, 1)
  return arr
}
const WorkspaceHeader = (props) => {
  const { tabActive, tabToggle, data, loadData } = props

  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const [state, setState] = useMergedState({
    coverImage: "",
    inviteModal: false,
    setupNotifiModal: false,
    loading: false,
    defaultWorkspaceCover: "",
    selectAdmin: false,
    joined: false,
    waitJoined: false
  })
  const onClickInvite = () => {
    setState({ inviteModal: !state.inviteModal })
  }
  const handleDoneInvite = (dataUpdate, type) => {
    const infoWorkspace = { ...data }
    if (type === "members") {
      const arrID = infoWorkspace.members.concat(
        dataUpdate.map((x) => x["id"] * 1)
      )

      infoWorkspace.members = JSON.stringify(arrID)
      workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
        if (res.statusText) {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          onClickInvite()
          setState({ loading: false })
          loadData()
        }
      })
    } else {
      let varTxt = "department_id"
      if (type !== "departments") {
        varTxt = "job_title_id"
      }
      const arrIdDepartment = JSON.stringify(dataUpdate.map((x) => x["id"] * 1))
      workspaceApi
        .loadMember({
          [varTxt]: dataUpdate.map((x) => x["id"] * 1)
        })
        .then((res) => {
          if (res.data) {
            const arrID = infoWorkspace.members.concat(
              res.data.map((x) => parseInt(x))
            )

            infoWorkspace.members = JSON.stringify(unique(arrID))
            workspaceApi
              .update(infoWorkspace._id, infoWorkspace)
              .then((res) => {
                if (res.statusText) {
                  notification.showSuccess({
                    text: useFormatMessage("notification.save.success")
                  })
                  onClickInvite()
                  setState({ loading: false })
                  loadData()
                }
              })
          }
        })
    }
  }

  const handleLeaveWorkspace = () => {
    const infoWorkspace = { ...data }
    const adminArr = [...infoWorkspace.administrators]
    // check admin
    const indexOfAdmin = adminArr.indexOf(userId)
    if (indexOfAdmin >= 0 && adminArr.length <= 1) {
      setState({ selectAdmin: true })
      return
    }

    const memberArr = [...infoWorkspace.members]
    const indexOf = memberArr.indexOf(userId)
    memberArr.splice(indexOf, 1)
    infoWorkspace.members = JSON.stringify(memberArr)
    workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        loadData()
        setState({ loading: false })
      }
    })
  }

  const handleSetupNotification = () => {
    setState({ setupNotifiModal: !state.setupNotifiModal })
  }

  const handleSelectAD = () => {
    setState({ selectAdmin: !state.selectAdmin })
  }
  const handleDoneAddAD = (dataUpdate) => {
    const infoWorkspace = { ...data }
    const arrID = dataUpdate.map((x) => parseInt(x["id"]))
    infoWorkspace.administrators = arrID
    // arrSplice members
    infoWorkspace.members = arrSplice(infoWorkspace.members, userId)

    workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        //onClickInvite()
        setState({ loading: false })
        // loadData()
      }
    })
  }
  const handleJoin = () => {
    const infoWorkspace = { ...data }
    if (data?.membership_approval === "auto") {
      const members = [...infoWorkspace.members]
      members.push(userId)
      infoWorkspace.members = JSON.stringify(unique(members))
    } else {
      const request_joins = [...infoWorkspace.request_joins]
      request_joins.push(userId)
      infoWorkspace.request_joins = JSON.stringify(unique(request_joins))
    }
    console.log("infoWorkspace", infoWorkspace)
    workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loading: false })
        loadData()
      }
    })
  }

  const handleCancelJoin = () => {
    const infoWorkspace = { ...data }
    const request_joinsArr = [...infoWorkspace.request_joins]
    const indexOf = request_joinsArr.indexOf(userId)
    request_joinsArr.splice(indexOf, 1)
    infoWorkspace.request_joins = JSON.stringify(request_joinsArr)
    workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loading: false, waitJoined: false })
      }
    })
    console.log("handleCancelJoin", infoWorkspace)
  }

  const items = [
    {
      label: (
        <Link to={`/workspace/${data._id}/pending-posts`}>
          <i className="fa-regular fa-list-ul me-50"></i>{" "}
          {useFormatMessage("modules.workspace.display.waiting_for_approval")}
        </Link>
      ),
      key: "0"
    },
    {
      label: (
        <Link to={`/workspace/${data._id}/request-join`}>
          <i className="fa-duotone fa-user me-50"></i>{" "}
          {useFormatMessage("modules.workspace.display.request_to_join")}
        </Link>
      ),
      key: "3"
    },
    {
      label: (
        <div>
          <i className="fa-solid fa-bell me-50"></i>{" "}
          {useFormatMessage("modules.workspace.display.setup_notification")}
        </div>
      ),
      key: "1",
      onClick: () => handleSetupNotification()
    },
    {
      label: (
        <Link to={`/workspace/${data._id}/setting`}>
          <i className="fa-regular fa-gear  me-50"></i>{" "}
          {useFormatMessage("modules.workspace.display.workspace_settings")}
        </Link>
      ),
      key: "2"
    }
  ]

  useEffect(() => {
    const arrAdmin = data?.administrators ? data?.administrators : []
    const arrMember = data?.members ? data?.members : []
    const arrRequest_joins = data?.request_joins ? data?.request_joins : []

    const isAdmin = arrAdmin.includes(userId)
    const isMember = arrMember.includes(userId)
    let isJoined = false
    if (isAdmin || isMember) {
      isJoined = true
    }

    let waitJoined = false
    if (arrRequest_joins.includes(userId)) {
      waitJoined = true
    }
    if (data.cover_image) {
      setState({
        coverImage: data.cover_image,
        defaultWorkspaceCover: "",
        joined: isJoined,
        waitJoined: waitJoined
      })
    } else {
      setState({
        defaultWorkspaceCover: defaultWorkspaceCover,
        joined: isJoined,
        waitJoined: waitJoined
      })
    }
  }, [data])

  return (
    <Card className="pb-0">
      <CoverImage
        src={data.cover_image}
        dataSave={{ ...data, id: data?._id }}
        isEditable={data.is_admin_group}
        saveCoverImageApi={workspaceApi.saveCoverImage}
      />

      <CardBody className="pb-0">
        <div className="d-flex justify-content-between align-content-center">
          <div className="workspaceInformation">
            <h2 className="workspaceName">{data?.name}</h2>
            <p>
              <i className="fa-regular fa-earth-asia"></i> {data?.type} ·{" "}
              {data?.members && data?.members.length}{" "}
              {useFormatMessage("modules.workspace.text.members")} ·{" "}
              {data?.pinPosts && data?.pinPosts.length}{" "}
              {useFormatMessage("modules.workspace.text.posts")}
            </p>
          </div>
          <div className="workspaceAction">
            {state.joined && (
              <Button
                className="btn btn-success"
                onClick={() => onClickInvite()}>
                <i className="fa-regular fa-plus me-50"></i>
                {useFormatMessage("modules.workspace.buttons.invite")}
              </Button>
            )}

            {!state.joined && !state.waitJoined && (
              <>
                <Button
                  className="btn btn-success"
                  onClick={() => handleJoin()}>
                  {useFormatMessage("modules.workspace.buttons.join_workspace")}
                </Button>
              </>
            )}
            {!state.joined && state.waitJoined && (
              <Button
                className="btn btn-secondary"
                onClick={() => handleCancelJoin()}>
                {useFormatMessage("button.cancel")}
              </Button>
            )}
          </div>
        </div>
        <hr
          style={{
            margin: "0.5rem 0"
          }}
        />
        <Nav tabs className="mb-0">
          <NavItem>
            <NavLink
              active={tabActive === 1}
              onClick={() => {
                tabToggle(1)
              }}>
              {useFormatMessage("modules.workspace.display.feed")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 2}
              onClick={() => {
                tabToggle(2)
              }}>
              {useFormatMessage("modules.workspace.display.pinned")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 3}
              onClick={() => {
                tabToggle(3)
              }}>
              {useFormatMessage("modules.workspace.display.introduction")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 4}
              onClick={() => {
                tabToggle(4)
              }}>
              {useFormatMessage("modules.workspace.display.member")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 5}
              onClick={() => {
                tabToggle(5)
              }}>
              {useFormatMessage("modules.workspace.display.media")}
            </NavLink>
          </NavItem>
          {state.joined && (
            <div className="ms-auto">
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <>
                          <i className="fa-light fa-right-from-bracket me-50"></i>
                          {useFormatMessage(
                            "modules.workspace.display.leave_workspace"
                          )}
                        </>
                      ),
                      key: "0",
                      onClick: () => handleLeaveWorkspace()
                    }
                  ]
                }}
                placement="bottomRight"
                trigger={["click"]}>
                <Button className="me-50 btn-sm" color="secondary" outline>
                  {useFormatMessage("modules.workspace.text.joined")}{" "}
                  <i class="fa-regular fa-chevron-down"></i>
                </Button>
              </Dropdown>

              <Dropdown
                menu={{
                  items
                }}
                placement="bottomRight"
                trigger={["click"]}>
                <Button
                  color="flat-secondary"
                  className="btn-sm"
                  style={{ backgroundColor: "rgba(130, 134, 139, 0.12)" }}>
                  <i className="fa-light fa-ellipsis"></i>
                </Button>
              </Dropdown>
            </div>
          )}
        </Nav>
        <InviteWorkspaceModal
          modal={state.inviteModal}
          handleModal={onClickInvite}
          handleDone={handleDoneInvite}
          member_selected={data?.members}
        />
        <SetupNotificationModal
          modal={state.setupNotifiModal}
          dataWorkspace={data}
          handleModal={handleSetupNotification}
        />
        <SelectAdminModal
          modal={state.selectAdmin}
          members={data.members}
          handleDone={handleDoneAddAD}
          handleModal={handleSelectAD}
        />
      </CardBody>
    </Card>
  )
}

export default WorkspaceHeader
