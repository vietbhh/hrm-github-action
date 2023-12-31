import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import classnames from "classnames"
import { Fragment, useEffect, useRef, useState } from "react"
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
import { ErpSwitch } from "@apps/components/common/ErpField"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { checkIsResponse } from "react-select-async-paginate"

const UserProfileSidebar = (props) => {
  // ** Props
  const {
    user,
    settingUser,
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
    selectedGroup,
    sendMessage,
    setSelectedGroup
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

  const windowWidth = window.innerWidth
  const isMinWidth = windowWidth < 767.98;

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
            last_message: `${settingUser.full_name} ${useFormatMessage(
              "modules.chat.text.change_group_cover"
            )}`,
            last_user: userId,
            timestamp: Date.now(),
            background: res.data
          }).then((res) => {
            sendMessage(
              selectedGroup.id,
              `${settingUser.full_name} ${useFormatMessage(
                "modules.chat.text.change_group_cover"
              )}`,
              {
                type: "notification"
              }
            )
            toggleBackgroundPreviewModal()
            setState({ backgroundPreviewLoading: false })
          })
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
            last_message: `${settingUser.full_name} ${useFormatMessage(
              "modules.chat.text.change_group_avatar"
            )}`,
            last_user: userId,
            timestamp: Date.now(),
            avatar: res.data
          }).then((res) => {
            sendMessage(
              selectedGroup.id,
              `${settingUser.full_name} ${useFormatMessage(
                "modules.chat.text.change_group_avatar"
              )}`,
              {
                type: "notification"
              }
            )
            toggleAvatarPreviewModal()
            setState({ avatarPreviewLoading: false })
          })
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
    } else if (user.type && user.type === "employee" && selectedGroup.background) {
      return (
        <Photo
          tag="img"
          src={selectedGroup.background}
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.76017 22H17.2402C20.0002 22 21.1002 20.31 21.2302 18.25L21.7502 9.99C21.8902 7.83 20.1702 6 18.0002 6C17.3902 6 16.8302 5.65 16.5502 5.11L15.8302 3.66C15.3702 2.75 14.1702 2 13.1502 2H10.8602C9.83017 2 8.63017 2.75 8.17017 3.66L7.45017 5.11C7.17017 5.65 6.61017 6 6.00017 6C3.83017 6 2.11017 7.83 2.25017 9.99L2.77017 18.25C2.89017 20.31 4.00017 22 6.76017 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.5 8H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18C13.79 18 15.25 16.54 15.25 14.75C15.25 12.96 13.79 11.5 12 11.5C10.21 11.5 8.75 12.96 8.75 14.75C8.75 16.54 10.21 18 12 18Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </label>
                </>
              )}
            </div>
            <div className="header-profile-avatar">
              <div className="div-avatar">
                {renderAvatar(selectedGroup, "", "102", "102")}
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.76017 22H17.2402C20.0002 22 21.1002 20.31 21.2302 18.25L21.7502 9.99C21.8902 7.83 20.1702 6 18.0002 6C17.3902 6 16.8302 5.65 16.5502 5.11L15.8302 3.66C15.3702 2.75 14.1702 2 13.1502 2H10.8602C9.83017 2 8.63017 2.75 8.17017 3.66L7.45017 5.11C7.17017 5.65 6.61017 6 6.00017 6C3.83017 6 2.11017 7.83 2.25017 9.99L2.77017 18.25C2.89017 20.31 4.00017 22 6.76017 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.5 8H13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18C13.79 18 15.25 16.54 15.25 14.75C15.25 12.96 13.79 11.5 12 11.5C10.21 11.5 8.75 12.96 8.75 14.75C8.75 16.54 10.21 18 12 18Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          {user?.type === "employee" && 
              <Fragment>
                <ProfileSidebarEmployee 
                user={user}  
                checkedNotification={state.checkedNotification}
                setCheckedNotification={(value) =>
                    setState({ checkedNotification: value })
                }
                handleUpdateGroup={handleUpdateGroup}
                selectedGroup={selectedGroup}
                userId={userId} />

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
                  active = {active}
                />
              </Fragment>
          }

          

          {user?.type === "group" && (
            <Fragment>
              {isMinWidth ? (<>
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
                    active = {active}
                    type = {user?.type}
                  />
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
                    settingUser={settingUser}
                    isAdminSystem={state.isAdminSystem}
                    sendMessage={sendMessage}
                    checkedNotification={state.checkedNotification}
                    setCheckedNotification={(value) =>
                        setState({ checkedNotification: value })
                    }
                  />
                </>) : (
                  <>
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
                    settingUser={settingUser}
                    isAdminSystem={state.isAdminSystem}
                    sendMessage={sendMessage}
                    checkedNotification={state.checkedNotification}
                    setCheckedNotification={(value) =>
                        setState({ checkedNotification: value })
                    }
                  />
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
                    active = {active}
                  />
                </>
                )}

             
            </Fragment>
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
            settingUser={settingUser}
            setActive={setActive}
            setActiveFullName={setActiveFullName}
            setDataUnseenDetail={setDataUnseenDetail}
            isAdminSystem={state.isAdminSystem}
            sendMessage={sendMessage}
            setSelectedGroup={setSelectedGroup}
          />
        </div>
      </div>

      <ModalAddMember
        modal={state.modalAddMember}
        toggleModal={toggleModalAddMember}
        handleUpdateGroup={handleUpdateGroup}
        userId={userId}
        settingUser={settingUser}
        setDataUnseenDetail={setDataUnseenDetail}
        selectedGroup={selectedGroup}
        sendMessage={sendMessage}
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
