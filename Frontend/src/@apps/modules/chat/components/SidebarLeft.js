// ** React Imports
import { useState } from "react"

// ** Custom Components
import Avatar from "@apps/modules/download/pages/Avatar"

// ** Third Party Components
import classnames from "classnames"
import { Search, X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { formatTime, replaceTextMessage } from "../common/common"
import ModalNewGroup from "./modals/ModalNewGroup"

// ** Reactstrap Imports
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Dropdown, Tooltip } from "antd"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import {
  Badge,
  CardText,
  Input,
  InputGroup,
  InputGroupText,
  Label
} from "reactstrap"

const SidebarLeft = (props) => {
  // ** Props & Store
  const {
    store,
    sidebar,
    handleSidebar,
    userSidebarLeft,
    handleUserSidebarLeft,
    active,
    setActive,
    setActiveFullName,
    loadingGroup,
    setHasMoreHistory,
    handleAddNewGroup,
    userId,
    handleUpdateGroup,
    setDataUnseenDetail,
    imageGroup
  } = props
  const { groups, contacts, userProfile } = store
  const [state, setState] = useMergedState({
    modalNewGroup: false
  })

  // ** State
  const [query, setQuery] = useState("")
  const [about, setAbout] = useState("")
  const [status, setStatus] = useState("online")
  const [filteredChat, setFilteredChat] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])

  // ** Handles User Chat Click
  const handleUserClick = (id, fullName) => {
    setQuery("")
    setActive(id)
    setActiveFullName(fullName)
    if (sidebar === true) {
      handleSidebar()
    }
  }

  // ** Renders Chat
  const renderAvatar = (item) => {
    if (item.type && item.type === "group") {
      if (item.avatar) {
        return (
          <Avatar
            src={`/modules/chat/${item.id}/avatar/${item.avatar}`}
            imgHeight="50"
            imgWidth="50"
          />
        )
      } else {
        return (
          <div className="avatar rounded-circle">
            <img
              className=""
              src={imageGroup}
              alt="avatarImg"
              height="50"
              width="50"
            />
          </div>
        )
      }
    }

    return (
      <Avatar
        src={item.avatar}
        imgHeight="50"
        imgWidth="50"
        userId={item.idEmployee}
      />
    )
  }

  const renderChats = (pin = false) => {
    if (groups && groups.length) {
      const index_search = filteredChat.findIndex(
        (item) =>
          (pin === true && item.pin === 1) || (pin === false && item.pin === 0)
      )
      if (query.length && index_search === -1) {
        return (
          <>
            <h4 className="chat-list-title">
              {useFormatMessage(
                `modules.chat.text.${pin ? "pinned" : "recent"}`
              )}
            </h4>
            <ul className="chat-users-list contact-list media-list">
              <li className="no-results show">
                <h6 className="mb-0">
                  {useFormatMessage("modules.chat.text.no_chats_found")}
                </h6>
              </li>
            </ul>
          </>
        )
      } else {
        const arrToMap =
          query.length && filteredChat.length ? filteredChat : groups
        const index = arrToMap.findIndex(
          (item) =>
            (pin === true && item.pin === 1) ||
            (pin === false && item.pin === 0)
        )

        return (
          index > -1 && (
            <>
              <h4 className="chat-list-title">
                {useFormatMessage(
                  `modules.chat.text.${pin ? "pinned" : "recent"}`
                )}
              </h4>
              <ul className="chat-users-list chat-list media-list">
                {_.map(
                  _.filter(arrToMap, (val) => {
                    return (
                      (pin === true && val.pin === 1) ||
                      (pin === false && val.pin === 0)
                    )
                  }),
                  (item) => {
                    const time = formatTime(
                      item.chat.lastMessage
                        ? item.chat.lastMessage.time
                        : new Date()
                    )

                    let mute = false
                    if (item.mute.indexOf(userId) !== -1) {
                      mute = true
                    }

                    const items = [
                      {
                        key: "1",
                        label: (
                          <a
                            href="/"
                            onClick={(e) => {
                              e.preventDefault()
                              let dataUPdate = {
                                pin: arrayUnion(userId)
                              }
                              if (pin === true) {
                                dataUPdate = {
                                  pin: arrayRemove(userId)
                                }
                              }
                              handleUpdateGroup(item.id, dataUPdate)
                            }}>
                            <i className="fa-regular fa-thumbtack icon"></i>
                            {useFormatMessage(
                              `modules.chat.text.${
                                pin === true ? "un_pin" : "pin"
                              }`
                            )}
                          </a>
                        )
                      },
                      {
                        key: "2",
                        label: (
                          <a
                            href="/"
                            onClick={(e) => {
                              e.preventDefault()
                              let dataUPdate = {
                                mute: arrayUnion(userId)
                              }
                              if (mute === true) {
                                dataUPdate = {
                                  mute: arrayRemove(userId)
                                }
                              }
                              handleUpdateGroup(item.id, dataUPdate)
                            }}>
                            {mute === true ? (
                              <i className="fa-regular fa-bell-slash icon"></i>
                            ) : (
                              <i className="fa-regular fa-bell icon"></i>
                            )}

                            {useFormatMessage(
                              `modules.chat.text.${
                                mute === true ? "un_mute" : "mute"
                              }`
                            )}
                          </a>
                        )
                      }
                    ]

                    return (
                      <div className="div-li-chat" key={item.id}>
                        <li
                          onClick={() => {
                            window.history.replaceState(
                              null,
                              "",
                              `/chat/${item.id}`
                            )
                            handleUserClick(item.id, item.username)
                          }}
                          className={classnames({
                            active: active === item.id
                          })}>
                          {renderAvatar(item)}
                          <div
                            className={`chat-info flex-grow-1 ${
                              item.chat.unseenMsgs > 0 ? "unread" : ""
                            }`}>
                            <h5 className="mb-0">{item.fullName}</h5>
                            <CardText className="text-truncate">
                              {!_.isEmpty(item.chat.lastUser)
                                ? item.chat.lastUser + ": "
                                : ""}
                              {item.chat.lastMessage
                                ? replaceTextMessage(
                                    item.chat.lastMessage.message
                                  )
                                : groups[groups.length - 1].message}
                            </CardText>
                          </div>
                          {mute && (
                            <div className="d-flex align-items-center me-25 div-mute">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none">
                                <path
                                  d="M16.8975 10.065L15.81 8.97751L16.86 7.92751C17.0775 7.71001 17.0775 7.35001 16.86 7.13251C16.6425 6.91501 16.2825 6.91501 16.065 7.13251L15.015 8.18251L13.9275 7.09501C13.71 6.87751 13.35 6.87751 13.1325 7.09501C12.915 7.31251 12.915 7.67251 13.1325 7.89001L14.22 8.97751L13.1025 10.095C12.885 10.3125 12.885 10.6725 13.1025 10.89C13.215 11.0025 13.3575 11.055 13.5 11.055C13.6425 11.055 13.785 11.0025 13.8975 10.89L15.015 9.77251L16.1025 10.86C16.215 10.9725 16.3575 11.025 16.5 11.025C16.6425 11.025 16.785 10.9725 16.8975 10.86C17.115 10.6425 17.115 10.29 16.8975 10.065Z"
                                  fill="#AFB5BB"
                                />
                                <path
                                  d="M10.515 2.83504C9.675 2.37004 8.6025 2.49004 7.5075 3.17254L5.3175 4.54504C5.1675 4.63504 4.995 4.68754 4.8225 4.68754H4.125H3.75C1.935 4.68754 0.9375 5.68504 0.9375 7.50004V10.5C0.9375 12.315 1.935 13.3125 3.75 13.3125H4.125H4.8225C4.995 13.3125 5.1675 13.365 5.3175 13.455L7.5075 14.8275C8.1675 15.24 8.8125 15.4425 9.4125 15.4425C9.8025 15.4425 10.1775 15.3525 10.515 15.165C11.3475 14.7 11.8125 13.7325 11.8125 12.4425V5.55754C11.8125 4.26754 11.3475 3.30004 10.515 2.83504Z"
                                  fill="#AFB5BB"
                                />
                              </svg>
                            </div>
                          )}

                          <div className="chat-meta text-nowrap">
                            {item.chat.unseenMsgs > 0 ? (
                              <Badge className="float-end" color="danger" pill>
                                {item.chat.unseenMsgs &&
                                item.chat.unseenMsgs > 9 ? (
                                  <>
                                    9<span style={{ fontSize: "12px" }}>+</span>
                                  </>
                                ) : (
                                  item.chat.unseenMsgs
                                )}
                              </Badge>
                            ) : (
                              <span></span>
                            )}
                            <small className="float-end mb-25 chat-time ms-25">
                              {time}
                            </small>
                          </div>
                        </li>
                        <Dropdown
                          menu={{ items }}
                          placement="bottomRight"
                          arrow={{ pointAtCenter: true }}
                          trigger={["click"]}
                          overlayClassName="group-option-dropdown-menu">
                          <div className="group-option">
                            <i className="fa-light fa-ellipsis"></i>
                          </div>
                        </Dropdown>
                      </div>
                    )
                  }
                )}
              </ul>
            </>
          )
        )
      }
    } else {
      return null
    }
  }

  // ** Renders Contact
  const renderContacts = () => {
    if (contacts && contacts.length) {
      if (query.length && !filteredContacts.length) {
        return (
          <li className="no-results show">
            <h6 className="mb-0">
              {useFormatMessage("modules.chat.text.no_contacts_found")}
            </h6>
          </li>
        )
      } else {
        const arrToMap =
          query.length && filteredContacts.length ? filteredContacts : contacts
        return arrToMap.map((item) => {
          return (
            <li
              key={item.fullName}
              onClick={() => {
                window.history.replaceState(null, "", `/chat/${item.username}`)
                handleUserClick(item.id, item.username)
              }}>
              <Avatar
                src={item.avatar}
                imgHeight="50"
                imgWidth="50"
                userId={item.idEmployee}
              />
              <div
                className="chat-info flex-grow-1"
                style={{ display: "flex", alignItems: "center" }}>
                <h5>{item.fullName}</h5>
                {/* <CardText className="text-truncate">{item.about}</CardText> */}
              </div>
            </li>
          )
        })
      }
    } else {
      return null
    }
  }

  // ** Handles Filter
  const handleFilter = (e) => {
    setQuery(e.target.value)
    const searchFilterFunction = (contact) =>
      contact.fullName.toLowerCase().includes(e.target.value.toLowerCase())
    const filteredChatsArr = groups.filter(searchFilterFunction)
    const filteredContactssArr = contacts.filter(searchFilterFunction)
    setFilteredChat([...filteredChatsArr])
    setFilteredContacts([...filteredContactssArr])
  }

  const renderAboutCount = () => {
    if (
      userProfile &&
      userProfile.about &&
      userProfile.about.length &&
      about.length === 0
    ) {
      return userProfile.about.length
    } else {
      return about.length
    }
  }

  const toggleModalNewGroup = () => {
    setState({ modalNewGroup: !state.modalNewGroup })
  }

  return store ? (
    <>
      <div className="sidebar-left">
        <div className="sidebar">
          <div
            className={classnames("chat-profile-sidebar d-none", {
              show: userSidebarLeft
            })}>
            <header className="chat-profile-header">
              <div className="close-icon" onClick={handleUserSidebarLeft}>
                <X size={14} />
              </div>
              <div className="header-profile-sidebar">
                <Avatar
                  className="box-shadow-1 avatar-border"
                  src={userProfile.avatar}
                  size="xl"
                />
                <h4 className="chat-user-name">{userProfile.fullName}</h4>
                <span className="user-post">{userProfile.role}</span>
              </div>
            </header>
            <PerfectScrollbar
              className="profile-sidebar-area"
              options={{ wheelPropagation: false }}>
              <h6 className="section-label mb-1">About</h6>
              <div className="about-user">
                <Input
                  rows="5"
                  type="textarea"
                  defaultValue={userProfile.about}
                  onChange={(e) => setAbout(e.target.value)}
                  className={classnames("char-textarea", {
                    "text-danger": about && about.length > 120
                  })}
                />
                <small className="counter-value float-end">
                  <span className="char-count">{renderAboutCount()}</span> / 120
                </small>
              </div>
              <h6 className="section-label mb-1 mt-3">Status</h6>
              <ul className="list-unstyled user-status">
                <li className="pb-1">
                  <div className="form-check form-check-success">
                    <Input
                      type="radio"
                      label="Online"
                      id="user-online"
                      checked={status === "online"}
                      onChange={() => setStatus("online")}
                    />
                    <Label className="form-check-label" for="user-online">
                      Online
                    </Label>
                  </div>
                </li>
                <li className="pb-1">
                  <div className="form-check form-check-danger">
                    <Input
                      type="radio"
                      id="user-busy"
                      label="Do Not Disturb"
                      checked={status === "busy"}
                      onChange={() => setStatus("busy")}
                    />
                    <Label className="form-check-label" for="user-busy">
                      Busy
                    </Label>
                  </div>
                </li>
                <li className="pb-1">
                  <div className="form-check form-check-warning">
                    <Input
                      type="radio"
                      label="Away"
                      id="user-away"
                      checked={status === "away"}
                      onChange={() => setStatus("away")}
                    />
                    <Label className="form-check-label" for="user-away">
                      Away
                    </Label>
                  </div>
                </li>
                <li className="pb-1">
                  <div className="form-check form-check-secondary">
                    <Input
                      type="radio"
                      label="Offline"
                      id="user-offline"
                      checked={status === "offline"}
                      onChange={() => setStatus("offline")}
                    />
                    <Label className="form-check-label" for="user-offline">
                      Offline
                    </Label>
                  </div>
                </li>
              </ul>
            </PerfectScrollbar>
          </div>
          <div
            className={classnames("sidebar-content", {
              show: sidebar === true
            })}>
            {/* <div className="sidebar-close-icon" onClick={handleSidebar}>
              <X size={14} />
            </div> */}
            <div className="div-chat-logo">
              <span className="chat-title">Chat</span>
              <span className="chat-title chat-dot">.</span>
            </div>
            <div className="chat-fixed-search">
              <div className="d-flex align-items-center w-100">
                {/*                 <div
                  className="sidebar-profile-toggle"
                  onClick={handleUserSidebarLeft}>
                  {Object.keys(userProfile).length ? (
                    <Avatar
                      className="avatar-border"
                      src={userProfile.avatar}
                      status={status}
                      imgHeight="42"
                      imgWidth="42"
                    />
                  ) : null}
                </div> */}
                <InputGroup className="input-group-merge w-100 chat-input-search">
                  <InputGroupText className="round">
                    <Search className="text-muted" size={16} />
                  </InputGroupText>
                  <Input
                    value={query}
                    className="round"
                    placeholder="Search"
                    onChange={handleFilter}
                  />
                </InputGroup>

                <Tooltip title="New Group">
                  <button
                    type="button"
                    className="btn-new-group"
                    onClick={() => toggleModalNewGroup()}>
                    <i className="fa-regular fa-plus"></i>
                  </button>
                </Tooltip>
              </div>
            </div>
            <PerfectScrollbar
              className="chat-user-list-wrapper list-group"
              options={{ wheelPropagation: false }}>
              {loadingGroup && <DefaultSpinner />}
              {!loadingGroup && (
                <>
                  {renderChats(true)}
                  {renderChats()}
                  {!_.isEmpty(query) && (
                    <>
                      <h4 className="chat-list-title">
                        {useFormatMessage("modules.chat.text.contacts")}
                      </h4>
                      <ul className="chat-users-list contact-list media-list">
                        {renderContacts()}
                      </ul>
                    </>
                  )}
                </>
              )}
            </PerfectScrollbar>
          </div>
        </div>
      </div>

      <ModalNewGroup
        modal={state.modalNewGroup}
        toggleModal={toggleModalNewGroup}
        handleAddNewGroup={handleAddNewGroup}
        setActive={setActive}
        setActiveFullName={setActiveFullName}
        userId={userId}
        setDataUnseenDetail={setDataUnseenDetail}
      />
    </>
  ) : null
}

export default SidebarLeft
