import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import SwAlert from "@apps/utility/SwAlert"
import { Collapse, Dropdown } from "antd"
import { arrayRemove, arrayUnion } from "firebase/firestore"
const { Panel } = Collapse
import { ErpSwitch } from "@apps/components/common/ErpField"

const ProfileSidebarGroup = (props) => {
  const {
    setShowMember,
    selectedGroup,
    toggleModalAddMember,
    dataEmployees,
    groups,
    setActive,
    setActiveFullName,
    setDataUnseenDetail,
    handleUpdateGroup,
    userId,
    settingUser,
    isAdminSystem,
    sendMessage,
    checkedNotification,
    setCheckedNotification,
  } = props

  const checkMediaWidth = (x) => {
    if (x.matches) {
      return true
    }
  
    return false
  }

  const checkMobile = checkMediaWidth(
    window.matchMedia("(max-width: 767.98px)")
  )

  // ** render
  const renderAddMember = () => {
    if (isAdminSystem) {
      return (
        <div
          className="profile-add-member"
          onClick={() => toggleModalAddMember()}>
         
          <div className="div-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#292D32" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 18V6" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className="text-add-member">
              {useFormatMessage("modules.chat.text.add_member")}
            </span>
          </div>
        </div>
      )
    }

    return ""
  }

  return (
    <>
      {!checkMobile &&
        <div className="profile-div" style={{ cursor: "unset" }}>
          <span className="title">
            {useFormatMessage("modules.chat.text.notification")}
          </span>
          <ErpSwitch
            nolabel
            checked={checkedNotification}
            onChange={(e) => {
              setCheckedNotification(e.target.checked)
              if (e.target.checked === true) {
                handleUpdateGroup(selectedGroup.id, {
                  mute: arrayRemove(userId)
                })
              } else {
                handleUpdateGroup(selectedGroup.id, {
                  mute: arrayUnion(userId)
                })
              }
            }}
          />
        </div>
      }
      <hr />
      <Collapse defaultActiveKey={["1"]} className="collapse-member">
        <Panel
          header={
            <div className="profile-div member" onClick={() => setShowMember()}>
              <span className="title">
                {useFormatMessage("modules.chat.text.members")} (
                {selectedGroup.user ? selectedGroup.user.length : 0})
              </span>
            </div>
          }
          key="1">
          {renderAddMember()}

          {_.map(
            _.filter(
              selectedGroup?.user,
              (value) =>
                dataEmployees.findIndex((item) => item.id === value) > -1
            ),
            (value, index) => {
              const indexEmployee = dataEmployees.findIndex(
                (item) => item.id === value
              )
              let name = "Deactive Account"
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
                          window.history.replaceState(
                            null,
                            "",
                            `/chat/${username}`
                          )
                        }}>
                        <i className="fa-regular fa-eye"></i>
                        <span>
                          {useFormatMessage("modules.chat.text.chat")}
                        </span>
                      </a>
                    </>
                  )
                }
              ]

              if (
                selectedGroup?.admin &&
                selectedGroup?.admin.indexOf(userId) !== -1
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
                                last_message: `${
                                  settingUser.full_name
                                } ${useFormatMessage(
                                  "modules.chat.text.remove_member_from_group_chat",
                                  {
                                    name: name
                                  }
                                )}`,
                                last_user: userId,
                                timestamp: timestamp,
                                user: arrayRemove(value),
                                unseen: arrayRemove(value),
                                admin: arrayRemove(value),
                                mute: arrayRemove(value),
                                pin: arrayRemove(value),
                                unseen_detail: setDataUnseenDetail(
                                  "delete_member",
                                  userId,
                                  timestamp,
                                  selectedGroup.chat.unseen_detail,
                                  [],
                                  [],
                                  value
                                )
                              }
                              handleUpdateGroup(selectedGroup.id, docData).then(
                                (resUpdateGroup) => {
                                  sendMessage(
                                    selectedGroup.id,
                                    `${
                                      settingUser.full_name
                                    } ${useFormatMessage(
                                      "modules.chat.text.remove_member_from_group_chat",
                                      {
                                        name: name
                                      }
                                    )}`,
                                    {
                                      type: "notification"
                                    }
                                  )
                                }
                              )
                            }
                          })
                        }}>
                        <i className="fa-regular fa-delete-right"></i>
                        <span>
                          {useFormatMessage("modules.chat.text.delete_member")}
                        </span>
                      </a>
                    </>
                  )
                })
              }

              if (
                selectedGroup?.admin &&
                selectedGroup?.admin.indexOf(userId) !== -1 &&
                selectedGroup?.admin.indexOf(value) === -1
              ) {
                items.push({
                  key: "3",
                  label: (
                    <>
                      <a
                        href=""
                        className="react_more"
                        onClick={(e) => {
                          e.preventDefault()
                          SwAlert.showWarning({
                            confirmButtonText: useFormatMessage("button.save"),
                            html: ""
                          }).then((res) => {
                            if (res.value) {
                              const timestamp = Date.now()
                              const docData = {
                                last_message: `${
                                  settingUser.full_name
                                } ${useFormatMessage(
                                  "modules.chat.text.assign_member_as_admin",
                                  {
                                    name: name
                                  }
                                )}`,
                                last_user: userId,
                                timestamp: timestamp,
                                admin: arrayUnion(value)
                              }
                              handleUpdateGroup(selectedGroup.id, docData).then(
                                (resUpdate) => {
                                  sendMessage(
                                    selectedGroup.id,
                                    `${
                                      settingUser.full_name
                                    } ${useFormatMessage(
                                      "modules.chat.text.assign_member_as_admin",
                                      {
                                        name: name
                                      }
                                    )}`,
                                    {
                                      type: "notification"
                                    }
                                  )
                                }
                              )
                            }
                          })
                        }}>
                        <i className="fa-regular fa-delete-right"></i>
                        <span>
                          {useFormatMessage(
                            "modules.chat.text.assign_a_new_admin"
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
                    {_.isArray(selectedGroup?.admin) &&
                    selectedGroup?.admin.indexOf(id) !== -1 ? (
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
                      overlayClassName="chat-content-reaction-dropdown-more dropdown-sidebar-group"
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
            }
          )}
        </Panel>
      </Collapse>
    </>
  )
}

export default ProfileSidebarGroup
