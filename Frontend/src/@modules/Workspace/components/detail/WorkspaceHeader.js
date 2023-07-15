import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Badge, Dropdown, Space } from "antd"
import { Fragment, useEffect, useRef } from "react"
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
const unique = (arr) => {
  return Array.from(new Set(arr)) //
}
const arrSplice = (arr = [], IDrm) => {
  const index = arr.findIndex((v) => v === IDrm)
  arr.splice(index, 1)
  return arr
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
  const items = [
    {
      label: (
        <div className="d-flex align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="22px"
            height="22px"
            viewBox="0 0 22 22"
            enableBackground="new 0 0 22 22"
            xmlSpace="preserve"
            className="me-50">
            {" "}
            <image
              id="image0"
              width="22"
              height="22"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhFBMVEUAAAAwQEwyQk8xQ08x Q08wQk0wQ0wxQ08wQFAyQ08zQ04zQU4wRVAwQk0yQk4yQ08yRFAxQk8zQ08wQFAyQlAyQk0xQ04y Qk8xQU4yQlAyQ08yRFA4QFAwQ04wSFAxQ04yQk0zRE8zQ1AyQ08wRFAwQlAxQ08yQ08yQk40RFAy Q0//////aiRPAAAAKnRSTlMAQJ/P33BQvyDvsKAwYMDfcN/PEGBwoN+gcOCAIG8gsGDPUJ9AcO+v 0EBakqoBAAAAAWJLR0QrJLnkCAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cHBgMLCL+3 7fYAAAC5SURBVBjTjZHrEoIgEIVXUJEUvJWVlZmV2b7/AwaEDjbldH6cZT7YXRYAfssj1DcKIGQ+ iwyMGPJVbJQIlHGKnsaUZ1NeXgCUnKlViOuJlrhRXm2V7VKnCyc6Reoa0sF7JIKZ9Jq4lzqk+G41 xwBHSE5fsG25gCM74wduzIzZn0UgGjVhetYPMKpVhF30HlfWtValHv6q7IbBvLTATgfGhUvvfWFi QzFnxOrRo2zsga4aaqshfi787gu9fg4uXSkkyQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wNy0w NlQwMzoxMTowOCswMDowMIwiv0oAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDctMDZUMDM6MTE6 MDgrMDA6MDD9fwf2AAAAAElFTkSuQmCC"
            />
          </svg>
          <span>
            {useFormatMessage("modules.workspace.display.manage_notification")}
          </span>
        </div>
      ),
      key: "1",
      onClick: () => handleSetupNotification()
    },
    {
      label: (
        <Link to={`/workspace/${params.id}/pending-posts`}>
          <div className="d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="22px"
              height="23px"
              viewBox="0 0 22 23"
              enableBackground="new 0 0 22 23"
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="22"
                height="23"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAMAAAA4Nk+sAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAkFBMVEUAAAAwQFAwQ0wwQk0w QEwxQ08xQ08wQlAyQ08yQlA1RVA4QFA0RFAyQlAwQk0yQ08wQFAyQ08wSFAyQk4yQk4xQ04yQ08w Q08zQ1AxQ04yQk8yQk8xQ08wQlAyQk0wQ1EwRVAyQk4zQ08yQk4wRFAxQU4zRE8yRFAyQk0xQk8w QEoyRFAwQ1AyQk4yQ0////8IfIaBAAAALnRSTlMAIFBgQL/PcN9wMCBAYHCvEO8ggMCw4J9QoN+f 72BgXzCQz49AsM+AcN8wcFDQnlu1HAAAAAFiS0dELyPUIBEAAAAJcEhZcwAACxMAAAsTAQCanBgA AAAHdElNRQfnBwYDDCzM9Z/gAAAAvElEQVQoz52R2w6CMAxAN2BcBGFcVLyhqKh46f9/ni1bZIsJ D56HJj1Nu61jbALuuBqHf6UnwMB3lA0gjGaxJpmHkA4DIJPWRJFTHkFhH1RAScVqSNKxxV9gWGKQ bAU14wRW1xvSW6zvsNFRFzH0nsbJhkgMbfO3PsDxVwctnCTPBHI2tEDLLhXRMtaR7q54t9Jcy/Du G3D7RA53jDIXlpWZ2l0EvetxzSPt4anqr7f5O1UyrrhuNHU89ecfWr0URvyo3IIAAAAldEVYdGRh dGU6Y3JlYXRlADIwMjMtMDctMDZUMDM6MTI6NDQrMDA6MDAk/2DHAAAAJXRFWHRkYXRlOm1vZGlm eQAyMDIzLTA3LTA2VDAzOjEyOjQ0KzAwOjAwVaLYewAAAABJRU5ErkJggg=="
              />
            </svg>
            <span>
              {useFormatMessage("modules.workspace.display.review_post")}
            </span>
          </div>
        </Link>
      ),
      key: "0"
    },
    {
      label: (
        <Link to={`/workspace/${params.id}/request-join`}>
          <div className="d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="22px"
              height="23px"
              viewBox="0 0 22 23"
              enableBackground="new 0 0 22 23"
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="22"
                height="23"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAMAAAA4Nk+sAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAmVBMVEUAAAAwQFAwQ0wwQk0w QFAwQEwxQ08zQ08yRFA1RVA4QFA0RFAyQlAyQ08xQk8yQ08yRFAyQlAwSFAyQk4wQk4wRVAwRFAw Qk4wRFAyQ08yQk4yQ04xQU4yQ08xQ04yQk0zRE8yQk4xQ08xQ04yQk8yQk8xQ08zQ04wQFAyQk4w Q1EyQk0xQU4wQk0wQlAwQEozQ1AyQ0////+y0vlVAAAAMXRSTlMAEFBgIEC/z4AwIEBw39/vcGAg gI8wf39An5CQsOCwcM/Az6Dfn++wMI9fYKBwcDBQvIqwRgAAAAFiS0dEMkDSTMgAAAAJcEhZcwAA CxMAAAsTAQCanBgAAAAHdElNRQfnBwYDDg4ro7yGAAAA90lEQVQoz32RbVeDMAyFWygdjrV1xYki bpa9KqK7///P2YSBO/uwfAjpc9KbSyrE/ZBJmibqBmYaHDq9gkpjlj/M58XCQE83lHWPY7109sKl NZ50yjKLH2+sZPyEVczPJF3F4gUlS+A15hS1lDmo/81JBiTRGGp5X8e0wiZm/UGg4awD5XY9doic BijUVG93hPdsx7h9fWBL11j4rXNHpqLZTapkafy/liYscIoalR5WomjCklTdp/g6INRdVwbYRHyz 42iiwqwY7vsW/WAnmoCR09r/D964fsQ/F5PMNWyfKfVbtQgTpTWH4XVCcfNs/tx1Zynuxx9fxBWu ChBtawAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wNy0wNlQwMzoxNDoxNCswMDowMGEBHuQAAAAl dEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDctMDZUMDM6MTQ6MTQrMDA6MDAQXKZYAAAAAElFTkSuQmCC"
              />
            </svg>
            <span>
              {useFormatMessage("modules.workspace.display.member_request")}
            </span>
            <div className="ms-auto">
              <Badge count={data?.request_joins?.length}></Badge>
            </div>
          </div>
        </Link>
      ),
      key: "3"
    },
    {
      label: (
        <Link to={`/workspace/${params.id}/setting`}>
          <div className="d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="22px"
              height="22px"
              viewBox="0 0 22 22"
              enableBackground="new 0 0 22 22"
              xmlSpace="preserve"
              className="me-50">
              {" "}
              <image
                id="image0"
                width="22"
                height="22"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaVBMVEUAAAAwQFAwQk4xQ08x Q08wQ04wQk0xQ08yQk4xQk8wQEw0RFAwSFAyQ08wQFAxQU4yQlAyQk8wRVAyQ08yRFAyQk4wQk0w RFAxQ04yQlAyQk0wRFAyQ08wQ08zQ08zRE8yQk4yQ0////8FKOj4AAAAIXRSTlMAEH/Pv29g78Df QEAg3yCgYJ8w74CAcH+gcHBAn5/Pz9CRnKBHAAAAAWJLR0QiXWVcrAAAAAlwSFlzAAALEwAACxMB AJqcGAAAAAd0SU1FB+cHBgMPDNy27OsAAACwSURBVBjTfVHtDoMgEANkCgrOKTrZ3Eff/yUnQhQh Wf9wKen1rkfIf1BW8AtN2bKCEJDliaw5REOI0pDtob9Cd77sNG7ho5eD2ZtSA9lvVaFV3FDpYnsx +v7T5OUjIvqOFSylW8xUzagT2mI1oHhkNHWSlH5iaenLSc6WxlmO2SREWdvEA76jHNxM8uOX12DH 8qzSfVh33hMtJZYj9JBoyDfCmijnGLrsaFZ8TXa0BD9/TQz6DmhQmwAAACV0RVh0ZGF0ZTpjcmVh dGUAMjAyMy0wNy0wNlQwMzoxNToxMiswMDowMO0TQOAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMt MDctMDZUMDM6MTU6MTIrMDA6MDCcTvhcAAAAAElFTkSuQmCC"
              />
            </svg>
            <span>
              {useFormatMessage("modules.workspace.display.workgroup_setting")}
            </span>
          </div>
        </Link>
      ),
      key: "2"
    },
    {
      label: (
        <div className="leave-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="22px"
            height="22px"
            viewBox="0 0 22 22"
            enableBackground="new 0 0 22 22"
            xmlSpace="preserve"
            className="me-50">
            {" "}
            <image
              id="image0"
              width="22"
              height="22"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAclBMVEUAAAAwQEowQk0yQk4w QEwxQk8wQ0wzQ08yQk04QFAzQ1AxQ08wQk0yQ08wQFAyQ08yQ08wQFAyQlAwRFAwRVAyQk4yRE4w Q1ExQ08yQk40QFAyQlAwQlAyQk4wQFAxQU4wSFAwQ1AyRFA0RFAyQ0////9RoEO5AAAAJHRSTlMA MGCAQN9Qz2AgUL9w3xCv7zBgQDCQgF/PwEBwcNAgoCBQcEBQNPwxAAAAAWJLR0QlwwHJDwAAAAlw SFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cHBgMaEYgFZiYAAAChSURBVBjThZHbEoIwEEMXWqBQ KVelioJK/v8bdYReBjuap8x5yE42RD8UxYzFfAd5go+S2KcpMpET5YXEwcNJqTZX1crSBq2xHYSX 0VtfH61lcHmnQlXDNyZSGkMAW77iVBppgFvcn40y4BIMaQPZG6URrtq1V7etnMAUqtO4xt4fiEpt UmbcHe7ej46IJi7B/OOPcp2hfu72WQRj46Lon15KVwxFLklQ8AAAACV0RVh0ZGF0ZTpjcmVhdGUA MjAyMy0wNy0wNlQwMzoyNjoxNyswMDowMM3+skUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDct MDZUMDM6MjY6MTcrMDA6MDC8owr5AAAAAElFTkSuQmCC"
            />
          </svg>
          {useFormatMessage("modules.workspace.display.leave_workspace")}
        </div>
      ),
      key: "5",
      onClick: () => handleLeaveWorkspace()
    }
  ]

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
    items: items
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
      if (data?.membership_approval === "auto" || isAdmin) {
        infoWorkspace.members = JSON.stringify(arrID)
      } else {
        infoWorkspace.request_joins = JSON.stringify(
          infoWorkspace.request_joins.concat(
            dataUpdate.map((x) => ({
              id_user: x["id"] * 1
            }))
          )
        )
      }
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

    adminArr.splice(indexOfAdmin, 1)
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
        navigate("/workspace/list")
        /*loadData()
        setState({ loading: false })*/
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
      request_joins.push({
        id_user: userId
      })
      infoWorkspace.request_joins = JSON.stringify(unique(request_joins))
    }
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
      return false
    }

    window.open(`/chat/${data.group_chat_id}`)
  }

  const handleClickSearchButton = () => {
    if (parseInt(tabActive) === 1) {
      toggleModal()
    }
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
    window.history.replaceState('Object', 'Title', `/workspace/${data._id}/${tab}${searchString}`);
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
    if (data?.administrators && !data?.administrators.includes(userId)) {
      const arr = [...items]
      arr.splice(1, 3)
      setState({ items: arr })
    }
  }, [data])

  return (
    <Fragment>
      <Card className="work-space-header pb-0 mb-50">
        <CoverImage
          src={data.cover_image}
          dataSave={{ ...data, id: data?._id }}
          isEditable={data.is_admin_group}
          saveCoverImageApi={workspaceApi.saveCoverImage}
          loadData={loadData}
        />

        <CardBody className="pb-0">
          <div className="d-flex justify-content-between align-content-center">
            <div className="workspaceInformation">
              <h2 className="workspaceName">{data?.name}</h2>
              <p className="workspaceOverviewInfo mb-75">
                {data?.type} · {data?.members ? data?.members.length : 0}{" "}
                {useFormatMessage("modules.workspace.display.members")}
                {/*{data?.pinPosts && data?.pinPosts.length}{" "}
              {useFormatMessage("modules.workspace.text.posts")}*/}
              </p>
            </div>
            <div className="pe-1 workspaceAction">
              {state.joined && (
                <Fragment>
                  {!_.isEmpty(data.group_chat_id) && (
                    <Button
                      className="btn btn-primary me-50 custom-secondary"
                      onClick={() => handleClickChat()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        id="Layer_1"
                        x="0px"
                        y="0px"
                        width="22px"
                        height="22px"
                        viewBox="0 0 22 22"
                        enableBackground="new 0 0 22 22"
                        xmlSpace="preserve">
                        {" "}
                        <image
                          id="image0"
                          width="22"
                          height="22"
                          x="0"
                          y="0"
                          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAmVBMVEUAAAAwQEwyQk4xQ08x Q08yQk8xQ08yQ08zQ04zQU4yQk4xQk8wRFAyQ08zQ0wwQFAyQlAwQk4yQ04wRFAzQ1AxQU4xQU4z RE8yQ08wQlAwQk0wQFAwRVAxQ04yQk80QEwyQk0xQ04wSFAyQ08wQ0wyQk0wQFAwQk40RFAyQk4w QEowQk0wQEwxQ08yQ081RVAyQk4yQ0////8LlwR4AAAAMXRSTlMAQJDP35+/77CgwN9/31AQYH+Q QFCgsM/gcGAgMKDfQGCwIJ9QcDCPQIAwcFDvrzDQU6dMlAAAAAFiS0dEMkDSTMgAAAAJcEhZcwAA CxMAAAsTAQCanBgAAAAHdElNRQfnBwYLMg5WQ5TBAAAAz0lEQVQY032P2wKCIBBEEUVSM8xIzTTN LO1itf//cwFmiQ/uAyyHZZhBaLYMbFqWSQwd2kAXjuNS8EYXS/BXTHWBD+s/xew3Eg7cADwWDKHX 8XztH+bbcttAoJvianxLJ14ZlaKmO80QxWJJiFQSXnYp2pNMHPLDgCMoEMSoVKYUNo9iqVYIZWKS ywC2lMWUTbTpSRmsdZoKQeEHzjru412Aa7SBtk9ZjLM0cFVNCcatvqc9fHhfKrKCrM4m5NmB2w7v Ks5frM3dJHnjFs3WB8bQDz/Gz+U2AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTA2VDA5OjUw OjE0KzAyOjAwSGVjsQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNy0wNlQwOTo1MDoxNCswMjow MDk42w0AAAAASUVORK5CYII="
                        />
                      </svg>
                    </Button>
                  )}
                  <Button
                    className="btn btn-primary custom-primary"
                    onClick={() => onClickInvite()}>
                    <i className="fa-regular fa-plus me-50"></i>
                    {useFormatMessage("modules.workspace.buttons.invite")}
                  </Button>
                </Fragment>
              )}

              {!state.joined && !state.waitJoined && (
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
              {!state.joined && state.waitJoined && (
                <Button
                  className="btn btn-secondary custom-secondary"
                  onClick={() => handleCancelJoin()}>
                  {useFormatMessage("button.cancel")}
                </Button>
              )}
            </div>
          </div>
          <Nav tabs className="mb-0 nav-tab-custom">
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
                {useFormatMessage("modules.workspace.display.information")}
              </NavLink>
            </NavItem>

            {state.joined && (
              <div className="action-nav ms-auto">
                <Space className="pe-1">
                  <Button
                    className="btn-sm custom-secondary animate__animated animate__zoomIn"
                    onClick={() => handleClickSearchButton()}>
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
                      xmlSpace="preserve">
                      {" "}
                      <image
                        id="image0"
                        width="18"
                        height="18"
                        x="0"
                        y="0"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAA0REwyRE4xRE4y Q04yQk4yQ002PFEyQ04yQ08yQ08zPVIxO04zQ080Qk02Q1EyRlAyQk8yQlA7O04zRE4yQVAxQ04y Q00xQ04vQ1EyRE4xQk0yQk40RFAnO04xQ08yRFAyRE8yQUsyQU0yRFAyQ08zQ08xRU4yRE8yRE8z Q04yRE7///8P1xM9AAAALHRSTlMAQH+mmX9MJrPMshkav1kmM02ADaYzjGZzJoBZgEANxeqOM2bw 8KsanriMmZdfS2QAAAABYktHRCy63XGrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wcG AyYyWZFuqwAAAJFJREFUGNN1kOsWgiAQhEnUGIqQNLtTqV19//eLcLFO1v4ZzrfLMCxjf2oU8ThJ P8BYwJecBDJVkDOdGfFmAnOveYG4IwaSernCwh9K9L5LrLwWWPcPoxyizmyDbUA7uriHtJRGkL0L kXi1h+OJxrWLmlZVrZrzhebZlT50u4MHxsyjbaPs1ePfG3HMDpj+ubwnhdEHvyCJ/DMAAAAldEVY dGRhdGU6Y3JlYXRlADIwMjMtMDctMDZUMDM6Mzg6NTArMDA6MDBTVG1CAAAAJXRFWHRkYXRlOm1v ZGlmeQAyMDIzLTA3LTA2VDAzOjM4OjUwKzAwOjAwIgnV/gAAAABJRU5ErkJggg=="
                      />
                    </svg>
                  </Button>

                  <Dropdown
                    menu={{ items: state.items }}
                    placement="bottomRight"
                    trigger={["click"]}
                    overlayClassName="worspace-dropdown-common">
                    <Button className="btn-sm custom-secondary">
                      <i className="fas fa-ellipsis"></i>
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

export default WorkspaceHeader
