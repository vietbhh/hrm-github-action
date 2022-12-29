// ** React Imports
import { useState } from "react"

// ** Custom Components
import Avatar from "@apps/modules/download/pages/Avatar"

// ** Third Party Components
import classnames from "classnames"
import { Search, X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { formatTime } from "../common/common"
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
import { Link } from "react-router-dom"

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
                            <i className="fa-regular fa-thumbtack me-75"></i>
                            {useFormatMessage(
                              `modules.chat.text.${
                                pin === true ? "un_pin" : "pin"
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
                          <Avatar
                            src={item.avatar}
                            imgHeight="50"
                            imgWidth="50"
                            userId={item.idEmployee}
                          />
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
                                ? item.chat.lastMessage.message
                                : groups[groups.length - 1].message}
                            </CardText>
                          </div>
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
        userId={userId}
        setDataUnseenDetail={setDataUnseenDetail}
      />
    </>
  ) : null
}

export default SidebarLeft
