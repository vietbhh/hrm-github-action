// ** React Imports
import { useState } from "react"

// ** Custom Components
import Avatar from "@apps/modules/download/pages/Avatar"

// ** Third Party Components
import classnames from "classnames"
import { Search, X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { formatTime, renderAvatar, replaceHtmlMessage } from "../common/common"
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
import { removeAccents } from "../common/common"

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
    setDataUnseenDetail
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
              <h4 className={`chat-list-title ${pin ? "pinned" : "recent"}`}>
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
                            {
                              pin === false ? 
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M12 11V23" stroke="#696760" stroke-width="1.5" stroke-linecap="round"/>
                              <path d="M6 2L18 2" stroke="#696760" stroke-width="1.5" stroke-linecap="round"/>
                              <path d="M7.82143 9.64349V2H16.2589V9.65697C16.2589 10.3042 16.4682 10.934 16.8556 11.4525L19.8058 15.4015C20.2985 16.061 19.8279 17 19.0047 17H5.01561C4.1887 17 3.71911 16.0535 4.21935 15.395L7.21021 11.4584C7.60675 10.9364 7.82143 10.299 7.82143 9.64349Z" stroke="#696760" stroke-width="1.5"/>
                            </svg> : 
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 11V23" stroke="#696760" stroke-width="1.5" stroke-linecap="round"/>
                                  <path d="M6 2L18 2" stroke="#696760" stroke-width="1.5" stroke-linecap="round"/>
                                  <path d="M7.82143 9.64349V2H16.2589V9.65697C16.2589 10.3042 16.4682 10.934 16.8556 11.4525L19.8058 15.4015C20.2985 16.061 19.8279 17 19.0047 17H5.01561C4.1887 17 3.71911 16.0535 4.21935 15.395L7.21021 11.4584C7.60675 10.9364 7.82143 10.299 7.82143 9.64349Z" stroke="#696760" stroke-width="1.5"/>
                                  <path d="M21 4L3 19" stroke="#696760" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                              </>
                            }
                            <span>
                              {useFormatMessage(
                                `modules.chat.text.${
                                  pin === true ? "un_pin" : "pin"
                                }`
                              )}
                            </span>
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
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="vuesax/linear/notification">
                                <g id="notification">
                                <path id="Stroke 1" fill-rule="evenodd" clip-rule="evenodd" d="M12.5 17.2629C17.4758 17.2629 19.7777 16.6118 20 13.9985C20 11.3869 18.3951 11.5549 18.3951 8.35062C18.3951 5.84774 16.0693 3 12.5 3C8.93068 3 6.60487 5.84774 6.60487 8.35062C6.60487 11.5549 5 11.3869 5 13.9985C5.22319 16.6217 7.52509 17.2629 12.5 17.2629Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path id="Stroke 3" d="M14.608 19.9714C13.4043 21.3347 11.5267 21.3508 10.3115 19.9714" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path id="Line 1" d="M21 4L3 19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
                                </g>
                                </g>
                              </svg>
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="vuesax/linear/notification">
                                <g id="notification">
                                <g id="Notification">
                                <path id="Stroke 1" fill-rule="evenodd" clip-rule="evenodd" d="M12.5 19C18.8027 19 21.7184 18.1783 22 14.8802C22 11.5844 19.9672 11.7964 19.9672 7.75255C19.9672 4.59388 17.0211 1 12.5 1C7.97886 1 5.03283 4.59388 5.03283 7.75255C5.03283 11.7964 3 11.5844 3 14.8802C3.28271 18.1908 6.19845 19 12.5 19Z" stroke="#696760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path id="Stroke 3" d="M14.608 21.9717C13.4043 23.3349 11.5267 23.3511 10.3115 21.9717" stroke="#696760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </g>
                                </g>
                                </g>
                              </svg>
                            )}
                            <span>
                              {useFormatMessage(
                                `modules.chat.text.${
                                  mute === true ? "un_mute" : "mute"
                                }`
                              )}
                            </span>
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
                                ? replaceHtmlMessage(
                                    item.chat.lastMessage.message
                                  )
                                : ""}
                            </CardText>
                          </div>
                          {mute && (
                            <div className="d-flex align-items-center me-25 div-mute">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="vuesax/bold/volume-cross">
                                <g id="volume-cross">
                                <path id="Vector" d="M22.5299 13.4201L21.0799 11.9701L22.4799 10.5701C22.7699 10.2801 22.7699 9.80005 22.4799 9.51005C22.1899 9.22005 21.7099 9.22005 21.4199 9.51005L20.0199 10.9101L18.5699 9.46005C18.2799 9.17005 17.7999 9.17005 17.5099 9.46005C17.2199 9.75005 17.2199 10.2301 17.5099 10.5201L18.9599 11.9701L17.4699 13.4601C17.1799 13.7501 17.1799 14.2301 17.4699 14.5201C17.6199 14.6701 17.8099 14.7401 17.9999 14.7401C18.1899 14.7401 18.3799 14.6701 18.5299 14.5201L20.0199 13.0301L21.4699 14.4801C21.6199 14.6301 21.8099 14.7001 21.9999 14.7001C22.1899 14.7001 22.3799 14.6301 22.5299 14.4801C22.8199 14.1901 22.8199 13.7201 22.5299 13.4201Z" fill="#AFB5BB"/>
                                <path id="Vector_2" d="M14.02 3.77997C12.9 3.15997 11.47 3.31997 10.01 4.22997L7.09 6.05997C6.89 6.17997 6.66 6.24997 6.43 6.24997H5.5H5C2.58 6.24997 1.25 7.57997 1.25 9.99997V14C1.25 16.42 2.58 17.75 5 17.75H5.5H6.43C6.66 17.75 6.89 17.82 7.09 17.94L10.01 19.77C10.89 20.32 11.75 20.59 12.55 20.59C13.07 20.59 13.57 20.47 14.02 20.22C15.13 19.6 15.75 18.31 15.75 16.59V7.40997C15.75 5.68997 15.13 4.39997 14.02 3.77997Z" fill="#AFB5BB"/>
                                </g>
                                </g>
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
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{"width": "24px","height": "24px" }}>
                            <path d="M4 14C5.10457 14 6 13.1046 6 12C6 10.8954 5.10457 10 4 10C2.89543 10 2 10.8954 2 12C2 13.1046 2.89543 14 4 14Z" fill="#696760"/>
                            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="#696760"/>
                            <path d="M20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z" fill="#696760"/>
                          </svg>
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
              {renderAvatar(item)}
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
    const queryStr = removeAccents(e.target.value)
    setQuery(e.target.value)
    const searchFilterFunction = (contact) =>
      removeAccents(contact.fullName)
        .toLowerCase()
        .includes(queryStr.toLowerCase())
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
            {/* <div className="div-chat-logo">
              <span className="chat-title">Chat</span>
              <span className="chat-title chat-dot">.</span>
            </div> */}
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
                    <Search className="text-muted" size={24} />
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="vuesax/linear/add">
                      <g id="add">
                      <path id="Vector" d="M6 12H18" stroke="#696760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path id="Vector_2" d="M12 18V6" stroke="#696760" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                      </g>
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>

            <PerfectScrollbar
              className="chat-user-list-wrapper list-group"
              options={{ wheelPropagation: false }}>
              {loadingGroup && <DefaultSpinner className="mt-3" />}
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
