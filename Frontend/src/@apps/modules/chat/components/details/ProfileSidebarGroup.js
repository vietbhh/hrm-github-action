import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import SwAlert from "@apps/utility/SwAlert"
import { Collapse, Dropdown } from "antd"
import { arrayRemove, arrayUnion } from "firebase/firestore"
const { Panel } = Collapse

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
    sendMessage
  } = props

  // ** render
  const renderAddMember = () => {
    if (isAdminSystem) {
      return (
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
      )
    }

    return ""
  }

  return (
    <>
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
            _.filter(selectedGroup?.user, (value) =>
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
                                last_message: useFormatMessage(
                                  "modules.chat.text.delete_member"
                                ),
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
                              handleUpdateGroup(selectedGroup.id, docData)
                              sendMessage(
                                selectedGroup.id,
                                `${settingUser.full_name} ${useFormatMessage(
                                  "modules.chat.text.remove_member_from_group_chat", {
                                    name: name
                                  }
                                )}`,
                                {
                                  type: "notification"
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
                                last_message: useFormatMessage(
                                  "modules.chat.text.assign_a_new_admin"
                                ),
                                last_user: userId,
                                timestamp: timestamp,
                                admin: arrayUnion(value)
                              }
                              handleUpdateGroup(selectedGroup.id, docData)
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
