import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import classnames from "classnames"
import { Fragment, useEffect, useRef } from "react"
import { X } from "react-feather"
import { FormProvider, useForm } from "react-hook-form"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Button, Spinner } from "reactstrap"
import BackgroundProfile from "../assets/images/Bitmap.png"
import { ChatApi } from "../common/api"
import { renderAvatar } from "../common/common"
import FileViewComponent from "./details/FileView"
import Photo from "./details/Photo"
import ProfileSidebarEmployee from "./details/ProfileSidebarEmployee"
import ProfileSidebarGeneral from "./details/ProfileSidebarGeneral"
import ProfileSidebarGroup from "./details/ProfileSidebarGroup"
import ProfileSidebarMoreOption from "./details/ProfileSidebarMoreOption"
import ModalAddMember from "./modals/ModalAddMember"
import ModalAvatarPreview from "./modals/ModalAvatarPreview"
import ModalBackgroundPreview from "./modals/ModalBackgroundPreview"

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
    setActiveFullName,
    selectedGroup
  } = props

  const [state, setState] = useMergedState({
    modalAddMember: false,
    showMember: true,
    checkedNotification: true,
    showInputFullName: false,
    showInputDes: "",
    loadingEdit: false,
    showMoreOption: false,
    isAdminSystem: false,

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
    if (state.showInputDes) {
      if (values.editDes) {
        dataUpdate = { ...dataUpdate, des: values.editDes }
      } else {
        dataUpdate = { ...dataUpdate, des: "Never settle!" }
      }
    }

    handleUpdateGroup(selectedGroup.id, {
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

  const handleShowMoreOption = () => {
    setState({ showMoreOption: !state.showMoreOption })
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
        groupId: selectedGroup.id,
        file: img
      }
      ChatApi.postUpBackground(data)
        .then((res) => {
          document.getElementById("input-background").value = null
          handleUpdateGroup(selectedGroup.id, {
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
        groupId: selectedGroup.id,
        file: img
      }
      ChatApi.postUpAvatar(data)
        .then((res) => {
          document.getElementById("input-avatar").value = null
          handleUpdateGroup(selectedGroup.id, {
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
    if (user.type && user.type === "group" && selectedGroup.background) {
      return (
        <Photo
          tag="img"
          src={`/modules/chat/${selectedGroup.id}/background/${selectedGroup.background}`}
        />
      )
    }

    return <img src={BackgroundProfile} />
  }

  const handleShowHideInput = (type, action) => {
    if (type === "fullName") {
      if (action === "show") {
        setState({ showInputFullName: true })
        setValue("editFullName", selectedGroup?.fullName)
      }
      if (action === "hide") {
        setState({ showInputFullName: false })
        setValue("editFullName", "")
      }
    }

    if (type === "des") {
      if (action === "show") {
        setState({ showInputDes: true })
        setValue("editDes", selectedGroup?.des)
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
        checkedNotification:
          groups[index].mute && groups[index].mute.indexOf(userId) === -1
      })
    } else {
      setState({ checkedNotification: true })
    }
  }, [groups, active])

  useEffect(() => {
    setState({ showFileView: false, tabView: "", showMoreOption: false })
  }, [active])

  useEffect(() => {
    let isAdminSystem = false
    if (selectedGroup?.type === "group") {
      isAdminSystem = true

      if (
        selectedGroup?.is_system === true &&
        selectedGroup?.admin &&
        selectedGroup?.admin.indexOf(userId) === -1
      ) {
        isAdminSystem = false
      }
    }

    setState({ isAdminSystem: isAdminSystem })

    handleShowHideInput("fullName", "hide")
    handleShowHideInput("des", "hide")
  }, [selectedGroup])

  // **

  return (
    <Fragment>
      <div
        className={classnames("user-profile-sidebar", {
          show: userSidebarRight === true
        })}>
        <header className="user-profile-header">
          <span
            className="close-icon-left d-none"
            onClick={() => handleUserSidebarRight()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M14.9998 19.9201L8.47984 13.4001C7.70984 12.6301 7.70984 11.3701 8.47984 10.6001L14.9998 4.08008"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="close-icon" onClick={handleUserSidebarRight}>
            <X size={14} />
          </span>
          <div className="header-profile-sidebar">
            <div className="header-profile-image-background">
              {renderBackground()}
              {state.isAdminSystem && (
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
                {renderAvatar(selectedGroup, "", "70", "70")}
                {state.isAdminSystem && (
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
                      if (state.isAdminSystem) {
                        handleShowHideInput("fullName", "show")
                        setTimeout(() => {
                          if (refInputFullName.current) {
                            refInputFullName.current.focus()
                          }
                        }, 100)
                      }
                    }}>
                    {selectedGroup?.fullName}
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
                      if (state.isAdminSystem) {
                        handleShowHideInput("des", "show")
                        setTimeout(() => {
                          if (refInputDes.current) {
                            refInputDes.current.focus()
                          }
                        }, 100)
                      }
                    }}>
                    {user?.type === "employee"
                      ? selectedGroup?.role
                      : selectedGroup?.des
                      ? selectedGroup?.des
                      : "Never settle!"}
                  </span>
                </span>
              </form>
            </FormProvider>
          </div>
        </header>
        <PerfectScrollbar
          className={`user-profile-sidebar-area ${
            state.showFileView || state.showMoreOption ? "hide" : ""
          }`}
          options={{ wheelPropagation: false }}>
          {user?.type === "employee" && <ProfileSidebarEmployee user={user} />}

          <ProfileSidebarGeneral
            checkedNotification={state.checkedNotification}
            setCheckedNotification={(value) =>
              setState({ checkedNotification: value })
            }
            handleUpdateGroup={handleUpdateGroup}
            handleShowFileView={handleShowFileView}
            selectedGroup={selectedGroup}
            userId={userId}
            handleShowMoreOption={handleShowMoreOption}
          />

          {user?.type === "group" && (
            <ProfileSidebarGroup
              setShowMember={() => setState({ showMember: !state.showMember })}
              selectedGroup={selectedGroup}
              toggleModalAddMember={toggleModalAddMember}
              dataEmployees={dataEmployees}
              groups={groups}
              setActive={setActive}
              setActiveFullName={setActiveFullName}
              setDataUnseenDetail={setDataUnseenDetail}
              handleUpdateGroup={handleUpdateGroup}
              userId={userId}
              isAdminSystem={state.isAdminSystem}
            />
          )}
        </PerfectScrollbar>

        <div className={`div-file-view ${state.showFileView ? "" : "hide"}`}>
          <FileViewComponent
            handleShowFileView={handleShowFileView}
            handleShowTab={(value) => setState({ tabView: value })}
            selectedGroup={selectedGroup}
            tabView={state.tabView}
            active={active}
          />
        </div>

        <div
          className={`div-more-option ${state.showMoreOption ? "" : "hide"}`}>
          <ProfileSidebarMoreOption
            handleShowMoreOption={handleShowMoreOption}
            selectedGroup={selectedGroup}
            handleUpdateGroup={handleUpdateGroup}
            userId={userId}
            setActive={setActive}
            setActiveFullName={setActiveFullName}
            setDataUnseenDetail={setDataUnseenDetail}
            isAdminSystem={state.isAdminSystem}
          />
        </div>
      </div>

      <ModalAddMember
        modal={state.modalAddMember}
        toggleModal={toggleModalAddMember}
        handleUpdateGroup={handleUpdateGroup}
        userId={userId}
        setDataUnseenDetail={setDataUnseenDetail}
        selectedGroup={selectedGroup}
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
