import { ErpInput, ErpSwitch } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Collapse, Dropdown } from "antd"
import classnames from "classnames"
import { Fragment, useEffect, useRef } from "react"
import { X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import BackgroundProfile from "../assets/images/Bitmap.png"
import ModalAddMember from "./modals/ModalAddMember"
import SwAlert from "@apps/utility/SwAlert"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import FileViewComponent from "./details/FileView"
import notification from "@apps/utility/notification"
import { ChatApi } from "../common/api"
import Photo from "./details/Photo"
import ModalAvatarPreview from "./modals/ModalAvatarPreview"
import ModalBackgroundPreview from "./modals/ModalBackgroundPreview"
import { Button, Spinner } from "reactstrap"
import { FormProvider, useForm } from "react-hook-form"
import facebookIcon from "../assets/images/facebook.png"
import { Link } from "react-router-dom"

const { Panel } = Collapse

const UserProfileSidebar = (props) => {
  // ** Props
  const {
    user,
    handleUserSidebarRight,
    userSidebarRight,
    dataEmployees,
    userId,
    groups,
    active,
    handleUpdateGroup,
    setDataUnseenDetail,
    setActive,
    setActiveFullName
  } = props

  const [state, setState] = useMergedState({
    selectedGroup: {},
    modalAddMember: false,
    showMember: true,
    checkedNotification: true,
    showInputFullName: false,
    showInputDes: "",
    loadingEdit: false,

    // ** file view
    showFileView: false,
    tabView: "",

    // ** avatar
    avatarPreviewLink: "",
    avatarPreviewModal: false,
    avatarPreviewLoading: false,

    // ** background
    backgroundPreviewLink: "",
    backgroundPreviewModal: false,
    backgroundPreviewLoading: false
  })

  const avatarEditor = useRef(null)
  const backgroundEditor = useRef(null)
  const refInputFullName = useRef(null)
  const refInputDes = useRef(null)

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  const submitEdit = (values) => {
    setState({ loadingEdit: true })
    let dataUpdate = {}
    if (values.editFullName) {
      dataUpdate = { ...dataUpdate, name: values.editFullName }
    }
    if (values.editDes) {
      dataUpdate = { ...dataUpdate, des: values.editDes }
    }

    handleUpdateGroup(state.selectedGroup.id, {
      last_message: useFormatMessage("modules.chat.text.change_name"),
      last_user: userId,
      timestamp: Date.now(),
      ...dataUpdate
    })
      .then((res) => {
        setState({ loadingEdit: false })
        handleShowHideInput("fullName", "hide")
        handleShowHideInput("des", "hide")
      })
      .catch((err) => {
        setState({ loadingEdit: false })
        handleShowHideInput("fullName", "hide")
        handleShowHideInput("des", "hide")
      })
  }

  const toggleModalAddMember = () => {
    setState({ modalAddMember: !state.modalAddMember })
  }

  const toggleAvatarPreviewModal = () => {
    setState({ avatarPreviewModal: !state.avatarPreviewModal })
  }

  const toggleBackgroundPreviewModal = () => {
    setState({ backgroundPreviewModal: !state.backgroundPreviewModal })
  }

  const handleShowFileView = (value, tab = "") => {
    setState({ showFileView: value, tabView: tab })
  }

  const changeBackground = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        notification.showError({
          text: useFormatMessage("modules.chat.notification.image_error", {
            allowType: "image/png, image/jpeg"
          })
        })
      } else {
        const linkPreview = URL.createObjectURL(file)
        setState({
          backgroundPreviewLink: linkPreview,
          backgroundPreviewModal: true
        })
      }
    }
  }

  const handleSaveBackground = () => {
    if (backgroundEditor.current) {
      setState({ backgroundPreviewLoading: true })
      const img = backgroundEditor.current.getImageScaledToCanvas().toDataURL()
      const data = {
        groupId: state.selectedGroup.id,
        file: img
      }
      ChatApi.postUpBackground(data)
        .then((res) => {
          document.getElementById("input-background").value = null
          handleUpdateGroup(state.selectedGroup.id, {
            last_message: useFormatMessage(
              "modules.chat.text.change_background_image"
            ),
            last_user: userId,
            timestamp: Date.now(),
            background: res.data
          })
          toggleBackgroundPreviewModal()
          setState({ backgroundPreviewLoading: false })
        })
        .catch((err) => {
          document.getElementById("input-background").value = null
          notification.showError({
            text: useFormatMessage("notification.error")
          })
          setState({ backgroundPreviewLoading: false })
        })
    }
  }

  const changeAvatar = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        notification.showError({
          text: useFormatMessage("modules.chat.notification.image_error", {
            allowType: "image/png, image/jpeg"
          })
        })
      } else {
        const linkPreview = URL.createObjectURL(file)
        setState({ avatarPreviewLink: linkPreview, avatarPreviewModal: true })
      }
    }
  }

  const handleSaveAvatar = () => {
    if (avatarEditor.current) {
      setState({ avatarPreviewLoading: true })
      const img = avatarEditor.current.getImageScaledToCanvas().toDataURL()
      const data = {
        groupId: state.selectedGroup.id,
        file: img
      }
      ChatApi.postUpAvatar(data)
        .then((res) => {
          document.getElementById("input-avatar").value = null
          handleUpdateGroup(state.selectedGroup.id, {
            last_message: useFormatMessage(
              "modules.chat.text.change_avatar_image"
            ),
            last_user: userId,
            timestamp: Date.now(),
            avatar: res.data
          })
          toggleAvatarPreviewModal()
          setState({ avatarPreviewLoading: false })
        })
        .catch((err) => {
          document.getElementById("input-avatar").value = null
          notification.showError({
            text: useFormatMessage("notification.error")
          })
          setState({ avatarPreviewLoading: false })
        })
    }
  }

  const renderBackground = () => {
    if (user.type && user.type === "group" && state.selectedGroup.background) {
      return (
        <Photo
          tag="img"
          src={`/modules/chat/${state.selectedGroup.id}/background/${state.selectedGroup.background}`}
        />
      )
    }

    return <img src={BackgroundProfile} />
  }

  const renderAvatar = () => {
    if (user.type && user.type === "group" && state.selectedGroup.avatar) {
      return (
        <Avatar
          className="box-shadow-1 avatar-border"
          size="xl"
          src={`/modules/chat/${state.selectedGroup.id}/avatar/${state.selectedGroup.avatar}`}
          imgHeight="70"
          imgWidth="70"
        />
      )
    }

    return (
      <Avatar
        className="box-shadow-1 avatar-border"
        size="xl"
        src={user?.avatar}
        imgHeight="70"
        imgWidth="70"
        userId={user?.idEmployee}
      />
    )
  }

  const handleShowHideInput = (type, action) => {
    if (type === "fullName") {
      if (action === "show") {
        setState({ showInputFullName: true })
        setValue("editFullName", state.selectedGroup?.fullName)
      }
      if (action === "hide") {
        setState({ showInputFullName: false })
        setValue("editFullName", "")
      }
    }

    if (type === "des") {
      if (action === "show") {
        setState({ showInputDes: true })
        setValue("editDes", state.selectedGroup?.des)
      }
      if (action === "hide") {
        setState({ showInputDes: false })
        setValue("editDes", "")
      }
    }
  }

  useEffect(() => {
    const index = groups.findIndex((item) => item.id === active)
    if (index !== -1) {
      setState({
        selectedGroup: groups[index],
        checkedNotification:
          groups[index].mute && groups[index].mute.indexOf(userId) === -1
      })
    } else {
      setState({ selectedGroup: {}, checkedNotification: true })
    }
  }, [groups, active])

  useEffect(() => {
    setState({ showFileView: false, tabView: "" })
  }, [active])

  return (
    <Fragment>
      <div
        className={classnames("user-profile-sidebar", {
          show: userSidebarRight === true
        })}>
        <header className="user-profile-header">
          <span className="close-icon" onClick={handleUserSidebarRight}>
            <X size={14} />
          </span>
          <div className="header-profile-sidebar">
            <div className="header-profile-image-background">
              {renderBackground()}
              {user.type && user.type === "group" && (
                <>
                  <input
                    type="file"
                    id="input-background"
                    name="input-background"
                    accept="image/png, image/jpeg"
                    hidden
                    onChange={changeBackground}
                    onClick={() => {
                      document.getElementById("input-background").value = null
                    }}
                  />
                  <label id="label-background" htmlFor="input-background">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none">
                      <path
                        d="M1.5 6.9427C1.5 5.59364 2.59364 4.5 3.9427 4.5V4.5C4.75943 4.5 5.52212 4.09182 5.97516 3.41226L6 3.375C6.46856 2.67216 7.25738 2.25 8.10208 2.25H9.89792C10.7426 2.25 11.5314 2.67216 12 3.375L12.0248 3.41226C12.4779 4.09182 13.2406 4.5 14.0573 4.5V4.5C15.4064 4.5 16.5 5.59364 16.5 6.9427V11.75C16.5 13.9591 14.7091 15.75 12.5 15.75H5.5C3.29086 15.75 1.5 13.9591 1.5 11.75V6.9427Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="9.75"
                        r="3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </label>
                </>
              )}
            </div>
            <div className="header-profile-avatar">
              <div className="div-avatar">
                {renderAvatar()}
                {user.type && user.type === "group" && (
                  <>
                    <input
                      type="file"
                      id="input-avatar"
                      name="input-avatar"
                      accept="image/png, image/jpeg"
                      hidden
                      onChange={changeAvatar}
                      onClick={() => {
                        document.getElementById("input-avatar").value = null
                      }}
                    />
                    <label id="label-avatar" htmlFor="input-avatar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none">
                        <path
                          d="M1.5 6.9427C1.5 5.59364 2.59364 4.5 3.9427 4.5V4.5C4.75943 4.5 5.52212 4.09182 5.97516 3.41226L6 3.375C6.46856 2.67216 7.25738 2.25 8.10208 2.25H9.89792C10.7426 2.25 11.5314 2.67216 12 3.375L12.0248 3.41226C12.4779 4.09182 13.2406 4.5 14.0573 4.5V4.5C15.4064 4.5 16.5 5.59364 16.5 6.9427V11.75C16.5 13.9591 14.7091 15.75 12.5 15.75H5.5C3.29086 15.75 1.5 13.9591 1.5 11.75V6.9427Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="9"
                          cy="9.75"
                          r="3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </label>
                  </>
                )}
              </div>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(submitEdit)}>
                <h4 className="chat-user-name">
                  <div
                    className={`div-edit ${
                      state.showInputFullName ? "" : "d-none"
                    }`}>
                    <ErpInput
                      innerRef={refInputFullName}
                      useForm={methods}
                      nolabel
                      name="editFullName"
                      defaultValue={""}
                      autoComplete="off"
                      readOnly={state.loadingEdit}
                    />
                    <Button.Ripple
                      color="flat-primary"
                      type="submit"
                      className="btn-edit"
                      disabled={state.loadingEdit}>
                      {state.loadingEdit ? (
                        <Spinner size="sm" />
                      ) : (
                        <i className="fa-regular fa-check"></i>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="flat-danger"
                      type="button"
                      className="btn-edit"
                      disabled={state.loadingEdit}
                      onClick={() => {
                        handleShowHideInput("fullName", "hide")
                      }}>
                      <i className="fa-regular fa-times"></i>
                    </Button.Ripple>
                  </div>
                  <span
                    className={`${state.showInputFullName ? "d-none" : ""}`}
                    onClick={() => {
                      if (user?.type === "group") {
                        handleShowHideInput("fullName", "show")
                        setTimeout(() => {
                          if (refInputFullName.current) {
                            refInputFullName.current.focus()
                          }
                        }, 100)
                      }
                    }}>
                    {state.selectedGroup?.fullName}
                  </span>
                </h4>
                <span className="user-post">
                  <div
                    className={`div-edit ${
                      state.showInputDes ? "" : "d-none"
                    }`}>
                    <ErpInput
                      innerRef={refInputDes}
                      useForm={methods}
                      nolabel
                      name="editDes"
                      defaultValue={""}
                      autoComplete="off"
                      readOnly={state.loadingEdit}
                    />
                    <Button.Ripple
                      color="flat-primary"
                      type="submit"
                      className="btn-edit"
                      disabled={state.loadingEdit}>
                      {state.loadingEdit ? (
                        <Spinner size="sm" />
                      ) : (
                        <i className="fa-regular fa-check"></i>
                      )}
                    </Button.Ripple>
                    <Button.Ripple
                      color="flat-danger"
                      type="button"
                      className="btn-edit"
                      disabled={state.loadingEdit}
                      onClick={() => {
                        handleShowHideInput("des", "hide")
                      }}>
                      <i className="fa-regular fa-times"></i>
                    </Button.Ripple>
                  </div>
                  <span
                    className={`${state.showInputDes ? "d-none" : ""}`}
                    onClick={() => {
                      if (user?.type === "group") {
                        handleShowHideInput("des", "show")
                        setTimeout(() => {
                          if (refInputDes.current) {
                            refInputDes.current.focus()
                          }
                        }, 100)
                      }
                    }}>
                    {user?.type === "employee"
                      ? state.selectedGroup?.role
                      : state.selectedGroup?.des
                      ? state.selectedGroup?.des
                      : "Never settle!"}
                  </span>
                </span>
              </form>
            </FormProvider>
          </div>
        </header>
        <PerfectScrollbar
          className={`user-profile-sidebar-area ${
            state.showFileView ? "hide" : ""
          }`}
          options={{ wheelPropagation: false }}>
          {user?.type === "employee" && (
            <>
              <div className="personal-info">
                <h6 className="section-label mb-50">
                  {useFormatMessage("modules.chat.text.email")}
                </h6>
                <ul className="list-unstyled">
                  <li className="mb-50">
                    <span className="align-middle section-text">
                      {user?.personalInfo?.email}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="personal-info">
                <h6 className="section-label mb-50">
                  {useFormatMessage("modules.chat.text.phone")}
                </h6>
                <ul className="list-unstyled">
                  <li className="mb-50">
                    <span className="align-middle section-text">
                      {user?.personalInfo?.phone}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="personal-info">
                <h6 className="section-label mb-1">
                  {useFormatMessage("modules.chat.text.social")}
                </h6>
                <ul className="list-unstyled">
                  <li className="mb-50">
                    <a
                      href={`${user?.personalInfo?.social_facebook}`}
                      target="_blank"
                      onClick={(e) => {
                        if (!user?.personalInfo?.social_facebook) {
                          e.preventDefault()
                        }
                      }}
                      className="social-icon">
                      <img src={facebookIcon} />
                    </a>

                    <a
                      href={user?.personalInfo?.social_instagram}
                      target="_blank"
                      onClick={(e) => {
                        if (!user?.personalInfo?.social_instagram) {
                          e.preventDefault()
                        }
                      }}
                      className="social-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none">
                        <rect width="25" height="25" fill="url(#pattern1)" />
                        <defs>
                          <pattern
                            id="pattern1"
                            patternContentUnits="objectBoundingBox"
                            width="1"
                            height="1">
                            <use
                              xlinkHref="#image0_871_8322"
                              transform="scale(0.00195312)"
                            />
                          </pattern>
                          <image
                            id="image0_871_8322"
                            width="512"
                            height="512"
                            xlinkHref="data:image/png;base64,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J419+9XSg0CtBACwbLcmOW/s28+WHgRqJgCAZdqf5Blj336s9CBQOwEALNNFY9++q/QQgAAAluddSV5ZeghgQgAAy/CxTJb+nfEPK0IAAIv22UxO+ru19CDA1wkAYJG+msnb/T5TehDg9gQAsEjPHvv2mtJDAHckAIBFefXYt28vPQRweAIAWIQrk7y09BDAkQkAYN5uTPJ0Z/zDahMAwDx9JclTxr69ufQgwJ0TAMA8vWDs2+tKDwEcnQAA5uWysW9/pfQQwNYIAGAerk9yQekhgK0TAMA8vGvs2y+XHgLYOgEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABUSAABQIQEAABX6/1CqbldRO68XAAAAAElFTkSuQmCC"
                          />
                        </defs>
                      </svg>
                    </a>

                    <a
                      href={user?.personalInfo?.social_telegram}
                      target="_blank"
                      onClick={(e) => {
                        if (!user?.personalInfo?.social_telegram) {
                          e.preventDefault()
                        }
                      }}
                      className="social-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none">
                        <rect width="25" height="25" fill="url(#pattern2)" />
                        <defs>
                          <pattern
                            id="pattern2"
                            patternContentUnits="objectBoundingBox"
                            width="1"
                            height="1">
                            <use
                              xlinkHref="#image0_871_8320"
                              transform="scale(0.00195312)"
                            />
                          </pattern>
                          <image
                            id="image0_871_8320"
                            width="512"
                            height="512"
                            xlinkHref="data:image/png;base64,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"
                          />
                        </defs>
                      </svg>
                    </a>

                    <a
                      href={user?.personalInfo?.social_twitter}
                      target="_blank"
                      onClick={(e) => {
                        if (!user?.personalInfo?.social_twitter) {
                          e.preventDefault()
                        }
                      }}
                      className="social-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none">
                        <rect width="25" height="25" fill="url(#pattern3)" />
                        <defs>
                          <pattern
                            id="pattern3"
                            patternContentUnits="objectBoundingBox"
                            width="1"
                            height="1">
                            <use
                              xlinkHref="#image0_871_8323"
                              transform="scale(0.015625)"
                            />
                          </pattern>
                          <image
                            id="image0_871_8323"
                            width="64"
                            height="64"
                            xlinkHref="data:image/png;base64,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"
                          />
                        </defs>
                      </svg>
                    </a>

                    <a
                      href={user?.personalInfo?.social_youtube}
                      target="_blank"
                      onClick={(e) => {
                        if (!user?.personalInfo?.social_youtube) {
                          e.preventDefault()
                        }
                      }}
                      className="social-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none">
                        <rect width="25" height="25" fill="url(#pattern4)" />
                        <defs>
                          <pattern
                            id="pattern4"
                            patternContentUnits="objectBoundingBox"
                            width="1"
                            height="1">
                            <use
                              xlinkHref="#image0_871_8324"
                              transform="scale(0.00195312)"
                            />
                          </pattern>
                          <image
                            id="image0_871_8324"
                            width="512"
                            height="512"
                            xlinkHref="data:image/png;base64,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"
                          />
                        </defs>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>

              <hr />
            </>
          )}

          <div className="profile-div" style={{ cursor: "unset" }}>
            <span className="title">
              {useFormatMessage("modules.chat.text.notification")}
            </span>
            <ErpSwitch
              nolabel
              checked={state.checkedNotification}
              onChange={(e) => {
                setState({ checkedNotification: e.target.checked })
                if (e.target.checked === true) {
                  handleUpdateGroup(state.selectedGroup.id, {
                    mute: arrayRemove(userId)
                  })
                } else {
                  handleUpdateGroup(state.selectedGroup.id, {
                    mute: arrayUnion(userId)
                  })
                }
              }}
            />
          </div>

          <div
            className="profile-div"
            onClick={() => handleShowFileView(true, "file")}>
            <span className="title">
              {useFormatMessage("modules.chat.text.files")}
            </span>
            <div className="profile-div-right">
              <span className="number">
                {state.selectedGroup?.file_count?.file || 0}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none">
                <path
                  d="M5.3125 3.625L9.6875 8L5.3125 12.375"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div
            className="profile-div"
            onClick={() => handleShowFileView(true, "image")}>
            <span className="title">
              {useFormatMessage("modules.chat.text.images")}
            </span>
            <div className="profile-div-right">
              <span className="number">
                {state.selectedGroup?.file_count?.image || 0}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none">
                <path
                  d="M5.3125 3.625L9.6875 8L5.3125 12.375"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div
            className="profile-div"
            onClick={() => handleShowFileView(true, "link")}>
            <span className="title">
              {useFormatMessage("modules.chat.text.share_links")}
            </span>
            <div className="profile-div-right">
              <span className="number">
                {state.selectedGroup?.file_count?.link || 0}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none">
                <path
                  d="M5.3125 3.625L9.6875 8L5.3125 12.375"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="profile-div">
            <span className="title">
              {useFormatMessage("modules.chat.text.more_options")}
            </span>
            <div className="profile-div-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none">
                <path
                  d="M5.3125 3.625L9.6875 8L5.3125 12.375"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {user?.type === "group" && (
            <>
              <hr />
              <Collapse defaultActiveKey={["1"]} className="collapse-member">
                <Panel
                  header={
                    <div
                      className="profile-div member"
                      onClick={() =>
                        setState({ showMember: !state.showMember })
                      }>
                      <span className="title">
                        {useFormatMessage("modules.chat.text.members")} (
                        {state.selectedGroup.user
                          ? state.selectedGroup.user.length
                          : 0}
                        )
                      </span>
                    </div>
                  }
                  key="1">
                  <div
                    className="profile-add-member"
                    onClick={() => toggleModalAddMember()}>
                    <div className="div-left">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none">
                        <mask
                          id="mask0_1621_4150"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="1"
                          y="12"
                          width="14"
                          height="7">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.66675 12.0466H14.7951V18.1624H1.66675V12.0466Z"
                            fill="white"
                          />
                        </mask>
                        <g mask="url(#mask0_1621_4150)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.23091 13.2966C4.70508 13.2966 2.91675 13.9025 2.91675 15.0958C2.91675 16.3008 4.70508 16.9125 8.23091 16.9125C11.7567 16.9125 13.5451 16.3066 13.5451 15.1141C13.5451 13.9075 11.7567 13.2966 8.23091 13.2966M8.23091 18.1625C6.60758 18.1625 1.66675 18.1625 1.66675 15.0958C1.66675 12.3625 5.41258 12.0466 8.23091 12.0466C9.85425 12.0466 14.7951 12.0466 14.7951 15.1141C14.7951 17.8466 11.0492 18.1625 8.23091 18.1625"
                            fill="#8E8787"
                          />
                        </g>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.23091 2.91675C6.47758 2.91675 5.05008 4.34425 5.05008 6.09841C5.04674 6.94758 5.37341 7.74341 5.96924 8.34425C6.56591 8.94425 7.36091 9.27675 8.20758 9.28008L8.23091 9.90508V9.28008C9.98508 9.28008 11.4126 7.85258 11.4126 6.09841C11.4126 4.34425 9.98508 2.91675 8.23091 2.91675M8.23091 10.5301H8.20508C7.02258 10.5259 5.91424 10.0617 5.08341 9.22508C4.25174 8.38758 3.79591 7.27591 3.80008 6.09591C3.80008 3.65508 5.78758 1.66675 8.23091 1.66675C10.6751 1.66675 12.6626 3.65508 12.6626 6.09841C12.6626 8.54175 10.6751 10.5301 8.23091 10.5301"
                          fill="#8E8787"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.0034 11.1914C15.6584 11.1914 15.3784 10.9114 15.3784 10.5664V7.22388C15.3784 6.87888 15.6584 6.59888 16.0034 6.59888C16.3484 6.59888 16.6284 6.87888 16.6284 7.22388V10.5664C16.6284 10.9114 16.3484 11.1914 16.0034 11.1914"
                          fill="#8E8787"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M17.7084 9.52002H14.3C13.955 9.52002 13.675 9.24002 13.675 8.89502C13.675 8.55002 13.955 8.27002 14.3 8.27002H17.7084C18.0534 8.27002 18.3334 8.55002 18.3334 8.89502C18.3334 9.24002 18.0534 9.52002 17.7084 9.52002"
                          fill="#8E8787"
                        />
                      </svg>
                    </div>
                    <div className="div-center">
                      {useFormatMessage("modules.chat.text.add_member")}
                    </div>
                  </div>

                  {_.map(state.selectedGroup?.user, (value, index) => {
                    const indexEmployee = dataEmployees.findIndex(
                      (item) => item.id === value
                    )
                    let name = ""
                    let username = ""
                    let avatar = ""
                    let id = ""
                    if (indexEmployee > -1) {
                      id = dataEmployees[indexEmployee].id
                      name = dataEmployees[indexEmployee].full_name
                      username = dataEmployees[indexEmployee].username
                      avatar = dataEmployees[indexEmployee].avatar
                    }

                    let idGroup = ""
                    const indexGroup = groups.findIndex(
                      (item) => item.idEmployee !== "" && item.idEmployee === id
                    )
                    if (indexGroup !== -1) {
                      idGroup = groups[indexGroup].id
                    }

                    const items = [
                      {
                        key: "1",
                        label: (
                          <>
                            <a
                              href=""
                              className="react_more"
                              onClick={(e) => {
                                e.preventDefault()
                                setActive(idGroup)
                                setActiveFullName(username)
                              }}>
                              <i className="fa-regular fa-eye"></i>
                              <span>
                                {useFormatMessage(
                                  "modules.chat.text.view_chat"
                                )}
                              </span>
                            </a>
                          </>
                        )
                      }
                    ]
                    if (
                      state.selectedGroup?.admin &&
                      state.selectedGroup?.admin.indexOf(userId) !== -1
                    ) {
                      items.push({
                        key: "2",
                        label: (
                          <>
                            <a
                              href=""
                              className="react_more"
                              onClick={(e) => {
                                e.preventDefault()
                                SwAlert.showWarning({
                                  confirmButtonText:
                                    useFormatMessage("button.delete"),
                                  html: ""
                                }).then((res) => {
                                  if (res.value) {
                                    const timestamp = Date.now()
                                    const docData = {
                                      last_message: useFormatMessage(
                                        "modules.chat.text.delete_member"
                                      ),
                                      last_user: userId,
                                      timestamp: timestamp,
                                      user: arrayRemove(value),
                                      unseen: arrayRemove(value),
                                      unseen_detail: setDataUnseenDetail(
                                        "delete_member",
                                        userId,
                                        timestamp,
                                        state.selectedGroup.chat.unseen_detail,
                                        [],
                                        [],
                                        value
                                      )
                                    }
                                    handleUpdateGroup(
                                      state.selectedGroup.id,
                                      docData
                                    )
                                  }
                                })
                              }}>
                              <i className="fa-regular fa-delete-right"></i>
                              <span>
                                {useFormatMessage(
                                  "modules.chat.text.delete_member"
                                )}
                              </span>
                            </a>
                          </>
                        )
                      })
                    }

                    return (
                      <div key={index} className="profile-member">
                        <div className="div-left">
                          <Avatar
                            className="box-shadow-1 avatar-border"
                            src={avatar}
                            imgHeight="40"
                            imgWidth="40"
                            userId={id}
                          />
                        </div>
                        <div className="div-center">
                          <span className="name">
                            {name}{" "}
                            {id === userId
                              ? `(${useFormatMessage("modules.chat.text.you")})`
                              : ""}
                          </span>
                          {_.isArray(state.selectedGroup?.admin) &&
                          state.selectedGroup?.admin.indexOf(id) !== -1 ? (
                            <span className="des">
                              {useFormatMessage("modules.chat.text.admin")}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>

                        {id !== userId && (
                          <Dropdown
                            menu={{ items }}
                            placement="bottom"
                            trigger={["click"]}
                            overlayClassName="chat-content-reaction-dropdown-more"
                            arrow={{
                              pointAtCenter: true
                            }}>
                            <div className="div-right">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="4"
                                viewBox="0 0 15 4"
                                fill="none">
                                <path
                                  d="M7.5 2.5C7.77615 2.5 8 2.27615 8 2C8 1.72385 7.77615 1.5 7.5 1.5C7.22385 1.5 7 1.72385 7 2C7 2.27615 7.22385 2.5 7.5 2.5Z"
                                  stroke="#69707B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M13.5 2.5C13.7761 2.5 14 2.27615 14 2C14 1.72385 13.7761 1.5 13.5 1.5C13.2239 1.5 13 1.72385 13 2C13 2.27615 13.2239 2.5 13.5 2.5Z"
                                  stroke="#69707B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M1.5 2.5C1.77614 2.5 2 2.27615 2 2C2 1.72385 1.77614 1.5 1.5 1.5C1.22386 1.5 1 1.72385 1 2C1 2.27615 1.22386 2.5 1.5 2.5Z"
                                  stroke="#69707B"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </Dropdown>
                        )}
                      </div>
                    )
                  })}
                </Panel>
              </Collapse>
            </>
          )}
        </PerfectScrollbar>

        <div className={`div-file-view ${state.showFileView ? "" : "hide"}`}>
          <FileViewComponent
            handleShowFileView={handleShowFileView}
            handleShowTab={(value) => setState({ tabView: value })}
            selectedGroup={state.selectedGroup}
            tabView={state.tabView}
            active={active}
          />
        </div>
      </div>

      <ModalAddMember
        modal={state.modalAddMember}
        toggleModal={toggleModalAddMember}
        handleUpdateGroup={handleUpdateGroup}
        userId={userId}
        setDataUnseenDetail={setDataUnseenDetail}
        selectedGroup={state.selectedGroup}
      />

      <ModalAvatarPreview
        modal={state.avatarPreviewModal}
        toggleModal={toggleAvatarPreviewModal}
        linkPreview={state.avatarPreviewLink}
        handleSave={handleSaveAvatar}
        avatarEditor={avatarEditor}
        avatarPreviewLoading={state.avatarPreviewLoading}
      />

      <ModalBackgroundPreview
        modal={state.backgroundPreviewModal}
        toggleModal={toggleBackgroundPreviewModal}
        linkPreview={state.backgroundPreviewLink}
        handleSave={handleSaveBackground}
        backgroundEditor={backgroundEditor}
        backgroundPreviewLoading={state.backgroundPreviewLoading}
      />
    </Fragment>
  )
}

export default UserProfileSidebar
