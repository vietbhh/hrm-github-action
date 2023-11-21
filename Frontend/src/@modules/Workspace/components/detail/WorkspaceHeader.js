import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Dropdown, Space } from "antd"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, Nav, NavItem, NavLink } from "reactstrap"
import defaultWorkspaceCover from "../../assets/images/default_workspace_cover.webp"
import InviteWorkspaceModal from "../modals/InviteWorkspaceModal"
import SelectAdminModal from "../modals/SelectAdminModal"
import SetupNotificationModal from "../modals/SetupNotificationModal"
import CoverImage from "./CoverImage"
import SearchPostModal from "../modals/SearchPostModal"
import { getTabByNameOrId } from "../../common/common"
import SwAlert from "@apps/utility/SwAlert"
import { ErpSelect } from "@apps/components/common/ErpField"
import InfoWorkgroupModal from "../modals/InfoWorkgroupModal"

const unique = (arr) => {
  return Array.from(new Set(arr)) //
}

const arrSplice = (arr = [], IDrm) => {
  const index = arr.findIndex((v) => parseInt(v.id_user) === parseInt(IDrm))
  arr.splice(index, 1)
  return arr
}

const checkMediaWidth = (x) => {
  if (x.matches) {
    return true
  }

  return false
}
const WorkspaceHeader = (props) => {
  //  disabled: data?.administrators ? !data?.administrators.includes(userId)  : true
  const {
    tabActive,
    tabToggle,
    data,
    searchTextFeed,
    loadData,
    setSearchTextFeed
  } = props
  const params = useParams()
  const userId = parseInt(useSelector((state) => state.auth.userData.id)) || 0
  const isAdmin = data?.administrators
    ? data?.administrators.includes(userId)
    : false

  const checkMobile = checkMediaWidth(
    window.matchMedia("(max-width: 767.98px)")
  )
  const optionTab = [
    {
      value: 1,
      label: useFormatMessage("modules.workspace.display.feed")
    },
    {
      value: 2,
      label: useFormatMessage("modules.workspace.display.pinned")
    },
    {
      value: 4,
      label: useFormatMessage("modules.workspace.display.member")
    },
    {
      value: 5,
      label: useFormatMessage("modules.workspace.display.media")
    },
    {
      value: 3,
      label: useFormatMessage("modules.workspace.display.information")
    }
  ]
  
  const renderDropMenu = (dataWorkspace) => {
    const items = [
      {
        label: (
          <div className="d-flex justify-content-center align-items-center">
            <div className="w-85">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 13H12"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 17H16"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V10"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {useFormatMessage(
                  "modules.workspace.display.manage_notification"
                )}
              </span>
            </div>
          </div>
        ),
        key: "1",
        onClick: () => handleSetupNotification()
      },
      {
        label: (
          <Link to={`/workspace/${params.id}/pending-posts`}>
            <div className="d-flex align-items-center justify-content-center">
              <div className="w-85 d-flex align-items-center">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.3701 8.87988H17.6201"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.37988 8.87988L7.12988 9.62988L9.37988 7.37988"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.3701 15.8799H17.6201"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.37988 15.8799L7.12988 16.6299L9.37988 14.3799"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <span>
                    {useFormatMessage(
                      "modules.workspace.display.nav_menu_setting_layout.approvals"
                    )}
                  </span>
                  <br />
                  <small>
                    {dataWorkspace?.pending_post === undefined
                      ? 0
                      : dataWorkspace.pending_post}{" "}
                    {useFormatMessage("modules.workspace.text.new_today")}
                  </small>
                </div>
              </div>
            </div>
          </Link>
        ),
        key: "0"
      },
      {
        label: (
          <Link to={`/workspace/${params.id}/request-join`}>
            <div className="d-flex align-items-center justify-content-center">
              <div className="w-85 d-flex align-items-center">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.12 12.7805C12.05 12.7705 11.96 12.7705 11.88 12.7805C10.12 12.7205 8.71997 11.2805 8.71997 9.51047C8.71997 7.70047 10.18 6.23047 12 6.23047C13.81 6.23047 15.28 7.70047 15.28 9.51047C15.27 11.2805 13.88 12.7205 12.12 12.7805Z"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.74 19.3796C16.96 21.0096 14.6 21.9996 12 21.9996C9.40001 21.9996 7.04001 21.0096 5.26001 19.3796C5.36001 18.4396 5.96001 17.5196 7.03001 16.7996C9.77001 14.9796 14.25 14.9796 16.97 16.7996C18.04 17.5196 18.64 18.4396 18.74 19.3796Z"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <span>
                    {useFormatMessage(
                      "modules.workspace.display.member_request"
                    )}
                  </span>
                  <br />
                  <small>
                    {dataWorkspace?.request_joins?.length === undefined
                      ? 0
                      : dataWorkspace?.request_joins?.length}{" "}
                    {useFormatMessage("modules.workspace.text.new_today")}
                  </small>
                </div>
              </div>
            </div>
          </Link>
        ),
        key: "3"
      },
      {
        label: (
          <Link to={`/workspace/${params.id}/setting`}>
            <div className="d-flex align-items-center justify-content-center">
              <div className="w-85">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 9.11035V14.8804C3 17.0004 3 17.0004 5 18.3504L10.5 21.5304C11.33 22.0104 12.68 22.0104 13.5 21.5304L19 18.3504C21 17.0004 21 17.0004 21 14.8904V9.11035C21 7.00035 21 7.00035 19 5.65035L13.5 2.47035C12.68 1.99035 11.33 1.99035 10.5 2.47035L5 5.65035C3 7.00035 3 7.00035 3 9.11035Z"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span>
                  {useFormatMessage(
                    "modules.workspace.display.workgroup_setting"
                  )}
                </span>
              </div>
            </div>
          </Link>
        ),
        key: "2"
      },
      {
        label: (
          <div className="leave-item d-flex align-items-center justify-content-center">
            <div className="w-85">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M15.1001 7.56023C14.7901 3.96023 12.9401 2.49023 8.8901 2.49023H8.7601C4.2901 2.49023 2.5001 4.28023 2.5001 8.75023V15.2702C2.5001 19.7402 4.2901 21.5302 8.7601 21.5302H8.8901C12.9101 21.5302 14.7601 20.0802 15.0901 16.5402"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.99988 12H20.3799"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.15 8.65039L21.5 12.0004L18.15 15.3504"
                  stroke="#696760"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {useFormatMessage("modules.workspace.display.leave_workspace")}
            </div>
          </div>
        ),
        key: "5",
        onClick: () => handleLeaveWorkspace(dataWorkspace)
      }
    ]
    if (
      dataWorkspace?.administrators &&
      !dataWorkspace?.administrators.includes(userId)
    ) {
      items.splice(1, 3)
    }
    return items
  }

  const [state, setState] = useMergedState({
    coverImage: "",
    inviteModal: false,
    setupNotifiModal: false,
    loading: false,
    defaultWorkspaceCover: "",
    selectAdmin: false,
    joined: false,
    waitJoined: false,
    showInput: false,
    modal: false,
    infoWorkgroupModal: false,
    items: renderDropMenu(data)
  })

  const navigate = useNavigate()

  const onClickInvite = () => {
    setState({ inviteModal: !state.inviteModal })
  }
  const handleDoneInvite = (dataUpdate, type) => {
    const infoWorkspace = { ...data }
    if (type === "members") {
      const arrID = infoWorkspace.members.concat(
        dataUpdate.map((x) => ({
          id_user: x["id"] * 1
        }))
      )
      let textNotifi = useFormatMessage("notification.save.success")
      if (data?.membership_approval === "auto" || isAdmin) {
        infoWorkspace.members = JSON.stringify(arrID)
      } else {
        textNotifi = useFormatMessage(
          "modules.workspace.display.wait_approval_member"
        )
        infoWorkspace.request_joins = JSON.stringify(
          infoWorkspace.request_joins.concat(
            dataUpdate.map((x) => ({
              id_user: x["id"] * 1
            }))
          )
        )
      }
      infoWorkspace["sen_notification_after_update"] = {
        type: "add_new_member",
        new_member: dataUpdate
      }
      workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
        if (res.statusText) {
          notification.showSuccess({
            text: textNotifi
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

  const handleLeaveWorkspace = (data) => {
    const infoWorkspace = { ...data }
    const adminArr = infoWorkspace?.administrators
      ? [...infoWorkspace.administrators]
      : []
    // check admin
    const indexOfAdmin = adminArr.indexOf(userId)
    if (indexOfAdmin >= 0 && adminArr.length <= 1) {
      setState({ selectAdmin: true })
      return
    }
    if (adminArr.includes(userId)) {
      adminArr.splice(indexOfAdmin, 1)
    }

    infoWorkspace.administrators = JSON.stringify(adminArr)

    const memberArr = [...infoWorkspace.members].filter((itemFilter) => {
      return parseInt(itemFilter.id_user) !== parseInt(userId)
    })
    infoWorkspace.members = JSON.stringify(memberArr)

    workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        // navigate("/workspace/list")
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
    infoWorkspace.administrators = JSON.stringify(arrID)
    // arrSplice members
    const memberArr = [...infoWorkspace.members].filter((itemFilter) => {
      return parseInt(itemFilter.id_user) !== parseInt(userId)
    })

    infoWorkspace.members = JSON.stringify(memberArr)

    workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        //onClickInvite()
        loadData()
        setState({ loading: false })
        // loadData()
      }
    })
  }
  const handleJoin = () => {
    const infoWorkspace = { ...data }
    if (data?.membership_approval === "auto") {
      const members = [...infoWorkspace.members]
      members.push({ id_user: userId })
      infoWorkspace.members = JSON.stringify(unique(members))
      workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
        if (res.statusText) {
          setState({ loading: false })
          loadData()
        }
      })
    } else {
      const request_joins = [...infoWorkspace.request_joins]
      request_joins.push({
        id_user: userId
      })
      infoWorkspace.request_joins = JSON.stringify(unique(request_joins))
      workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
        if (res.statusText) {
          setState({ loading: false })
          loadData()
        }
      })
    }
  }

  const handleCancelJoin = () => {
    const infoWorkspace = { ...data }
    const request_joinsArr = [...infoWorkspace.request_joins].filter(
      (itemFilter) => {
        return parseInt(itemFilter.id_user) !== parseInt(userId)
      }
    )
    infoWorkspace.request_joins = JSON.stringify(request_joinsArr)
    workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
      if (res.statusText) {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loading: false, waitJoined: false })
      }
    })
  }

  const handleClickChat = () => {
    if (_.isEmpty(data.group_chat_id)) {
      SwAlert.showWarning({
        title: useFormatMessage(
          "modules.workspace.display.waring_create_groupchat.title"
        ),
        text: useFormatMessage(
          "modules.workspace.display.waring_create_groupchat.text"
        )
      }).then((resSw) => {
        if (resSw.isConfirmed) {
          workspaceApi
            .createGroupChat(data._id, {
              workspace_name: data.name
            })
            .then((res) => {
              navigate(`/chat/${res.data}`)
            })
            .catch((err) => {})
        }
      })

      return false
    }

    window.open(`/chat/${data.group_chat_id}`)
  }

  const handleClickSearchButton = () => {
    if (parseInt(tabActive) === 1) {
      toggleModal()
    }
  }
  const handleClickInfoButton = () => {
    setState({ infoWorkgroupModal: !state.infoWorkgroupModal })
  }
  const toggleModal = () => {
    setState({
      modal: !state.modal
    })
  }

  const handleClickTabName = (id) => {
    const tabText = getTabByNameOrId({
      value: parseInt(id),
      type: "value"
    })
    const tab = `${tabText}`
    let searchString = ""
    if (id === 1 && searchTextFeed.trim().length > 0) {
      searchString += `&search=${searchTextFeed}`
    }

    //window.history.replaceState(null, "", searchString)
    window.history.replaceState(
      "Object",
      "Title",
      `/workspace/${data._id}/${tab}${searchString}`
    )
    tabToggle(id)
  }

  useEffect(() => {
    const arrAdmin = data?.administrators ? data?.administrators : []
    const arrMember = data?.members ? data?.members : []
    const arrRequest_joins = data?.request_joins ? data?.request_joins : []

    const isAdmin = arrAdmin.includes(userId)
    const isMember = arrMember.some(
      (itemSome) => parseInt(itemSome.id_user) === parseInt(userId)
    )
    let isJoined = false
    if (isAdmin || isMember) {
      isJoined = true
    }

    let waitJoined = false
    if (
      arrRequest_joins.some(
        (itemSome) => parseInt(itemSome.id_user) === parseInt(userId)
      )
    ) {
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
  const renderChatButton = () => {
    if (
      !_.isEmpty(data.group_chat_id) ||
      (_.isEmpty(data.group_chat_id) && isAdmin)
    ) {
      return (
        <div
          className="me-50 d-flex justify-content-center align-items-center pointer custom-secondary btn-chat"
          onClick={() => handleClickChat()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            viewBox="0 0 22 22"
            fill="none">
            <path
              d="M14.9393 11.4131H14.9483"
              stroke="#696760"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.9306 11.4131H10.9396"
              stroke="#696760"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.92128 11.4131H6.93028"
              stroke="#696760"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.071 18.0698C15.0159 21.1263 10.4896 21.7867 6.78631 20.074C6.23961 19.8539 2.70113 20.8339 1.93334 20.067C1.16555 19.2991 2.14639 15.7601 1.92631 15.2134C0.212846 11.5106 0.874111 6.9826 3.9302 3.9271C7.83147 0.0243002 14.1698 0.0243002 18.071 3.9271C21.9803 7.83593 21.9723 14.168 18.071 18.0698Z"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )
    }

    return ""
  }

  const renderComponent = () => {
    if (Object.keys(data).length === 0) {
      return ""
    }

    return (
      <Fragment>
        <Card className="work-space-header pb-0">
          <CoverImage
            src={data.cover_image}
            dataSave={{ ...data, id: data?._id }}
            isEditable={data.is_admin_group}
            saveCoverImageApi={workspaceApi.saveCoverImage}
            loadData={loadData}
          />

          <CardBody className="workspace-information-card">
            <div className="d-flex justify-content-between align-items-center name-and-action">
              <div className="ps-25 workspaceInformation">
                <h2 className="mb-25 workspaceName">{data?.name}</h2>
                <p className="mb-0 workspaceOverviewInfo">
                  <span
                    style={{
                      textTransform: "capitalize"
                    }}>
                    {data?.type}
                  </span>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={6}
                    height={6}
                    viewBox="0 0 6 6"
                    style={{ margin: "0px 2px" }}
                    fill="none">
                    <circle cx={3} cy={3} r={3} fill="#8C8A82" />
                  </svg>
                  {"  "}
                  {data?.total_member ? data?.total_member : 0}
                  {"  "}
                  {useFormatMessage("modules.workspace.display.members")}
                  {/*{data?.pinPosts && data?.pinPosts.length}{" "}
                {useFormatMessage("modules.workspace.text.posts")}*/}
                </p>
              </div>
              <div className="d-flex align-items-center workspaceAction">
                {state.joined && (
                  <Fragment>
                    <Fragment>{renderChatButton()}</Fragment>
                    <Button
                      className="btn btn-primary custom-primary"
                      onClick={() => onClickInvite()}>
                      <i className="fa-regular fa-plus me-50"></i>
                      {!checkMobile
                        ? useFormatMessage("modules.workspace.buttons.invite")
                        : "invite"}
                    </Button>
                  </Fragment>
                )}

                {!state.joined &&
                  !state.waitJoined &&
                  data?.mode === "visible" && (
                    <>
                      <Button
                        className="btn btn-success"
                        onClick={() => handleJoin()}>
                        {useFormatMessage(
                          "modules.workspace.buttons.join_workspace"
                        )}
                      </Button>
                    </>
                  )}
                {!state.joined &&
                  state.waitJoined &&
                  data?.mode === "visible" && (
                    <Button
                      className="btn btn-secondary custom-secondary"
                      onClick={() => handleCancelJoin()}>
                      {useFormatMessage("button.cancel")}
                    </Button>
                  )}
              </div>
            </div>
            <Nav tabs className="mb-0 nav-tab-custom">
              {!checkMobile && (
                <>
                  <NavItem>
                    <NavLink
                      active={tabActive === 1}
                      onClick={() => {
                        handleClickTabName(1)
                      }}>
                      {useFormatMessage("modules.workspace.display.feed")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={tabActive === 2}
                      onClick={() => {
                        handleClickTabName(2)
                      }}>
                      {useFormatMessage("modules.workspace.display.pinned")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={tabActive === 4}
                      onClick={() => {
                        handleClickTabName(4)
                      }}>
                      {useFormatMessage("modules.workspace.display.member")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={tabActive === 5}
                      onClick={() => {
                        handleClickTabName(5)
                      }}>
                      {useFormatMessage("modules.workspace.display.media")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      active={tabActive === 3}
                      onClick={() => {
                        handleClickTabName(3)
                      }}>
                      {useFormatMessage(
                        "modules.workspace.display.information"
                      )}
                    </NavLink>
                  </NavItem>
                </>
              )}
              {checkMobile && (
                <div className="action-nav">
                  <Space>
                    <ErpSelect
                      options={optionTab}
                      defaultValue={optionTab[0]}
                      className="w-100"
                      nolabel
                      isClearable={false}
                      formGroupClass="mb-0"
                      onChange={(e) => {
                        handleClickTabName(e?.value)
                      }}
                    />
                  </Space>
                </div>
              )}

              {state.joined && (
                <div className="action-nav ms-auto">
                  <Space>
                    <Button
                      className="btn-sm custom-secondary animate__animated animate__zoomIn"
                      onClick={() => handleClickSearchButton()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        // viewBox="0 0 24 24"
                        fill="none">
                        <path
                          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22 22L20 20"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                    {checkMobile && (
                      <Button
                        className="btn-sm custom-secondary animate__animated animate__zoomIn"
                        onClick={() => handleClickInfoButton()}>
                        <svg
                          width={24}
                          height={25}
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 22.1812C17.5 22.1812 22 17.6812 22 12.1812C22 6.68115 17.5 2.18115 12 2.18115C6.5 2.18115 2 6.68115 2 12.1812C2 17.6812 6.5 22.1812 12 22.1812Z"
                            stroke="#696760"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8.18115V13.1812"
                            stroke="#696760"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.9945 16.1812H12.0035H11.9945Z"
                            fill="#696760"
                          />
                          <path
                            d="M11.9945 16.1812H12.0035"
                            stroke="#696760"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                    )}
                    <Dropdown
                      menu={{ items: renderDropMenu(data) }}
                      placement="bottomRight"
                      trigger={["click"]}
                      overlayClassName="workspace-dropdown-common workspace-header-dropdown">
                      <Button className="btn-sm custom-secondary">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M5.5 12C5.5 12.8284 4.82843 13.5 4 13.5C3.17157 13.5 2.5 12.8284 2.5 12C2.5 11.1716 3.17157 10.5 4 10.5C4.82843 10.5 5.5 11.1716 5.5 12Z"
                            fill="#696760"
                            stroke="#696760"
                          />
                          <path
                            d="M13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12Z"
                            fill="#696760"
                            stroke="#696760"
                          />
                          <path
                            d="M20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z"
                            fill="#696760"
                          />
                        </svg>
                      </Button>
                    </Dropdown>
                  </Space>
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
            <InfoWorkgroupModal
              modal={state.infoWorkgroupModal}
              workspaceInfo={data}
              handleModal={handleClickInfoButton}
            />
          </CardBody>
        </Card>

        <SearchPostModal
          modal={state.modal}
          searchTextProp={searchTextFeed}
          handleModal={toggleModal}
          setSearchTextFeed={setSearchTextFeed}
        />
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkspaceHeader
