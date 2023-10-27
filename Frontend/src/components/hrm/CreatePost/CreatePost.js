import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { handleDataMention } from "@modules/Feed/common/common"
import React, { Fragment, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import ModalAnnouncement from "./CreatePostDetails/modals/ModalAnnouncement"
import ModalCreateEvent from "./CreatePostDetails/modals/ModalCreateEvent"
import ModalCreatePost from "./CreatePostDetails/modals/ModalCreatePost"
import { iconEndorsement } from "../common/common"
import Endorsement from "./CreatePostDetails/Endorsement"
import { eventApi } from "@modules/Feed/common/api"
// ** redux
import { useDispatch } from "react-redux"
import { showAddEventCalendarModal } from "@apps/modules/calendar/common/reducer/calendar"
import { AbilityContext } from "utility/context/Can"

const CreatePost = (props) => {
  const {
    workspace, // arr workspace: []
    setDataCreateNew, // function set Data then create new post
    approveStatus = "approved", // approved / rejected / pending

    // create event / announcement
    options_employee_department = [],
    optionsMeetingRoom = [],
    allowPostType = [],
    ...rest
  } = props
  const setting = useSelector((state) => state.auth.settings)
  const feed_post_approve = setting?.feed_post_approve === "true" ? true : false
  const feed_post_type_allow = setting?.feed_post_type_allow
    ? Object.values(setting?.feed_post_type_allow)
    : []
  const ability = useContext(AbilityContext)
  const createAnnouncement = feed_post_type_allow.includes("announcement")
    ? ability.can("create_announcement", "feed")
    : false // announcement
  const createEndorsement = feed_post_type_allow.includes("endorsement")
    ? ability.can("create_endorsement", "feed")
    : false

  const PostWithoutApproval = feed_post_approve
    ? ability.can("PostWithoutApproval", "feed")
    : true
  let approveStatusfm = approveStatus
  if (workspace.length <= 0 && !PostWithoutApproval) {
    approveStatusfm = "pending"
  }
  const [state, setState] = useMergedState({
    modalCreatePost: false,
    dataMention: [],
    optionCreate: "",

    // ** announcement
    modalAnnouncement: false,
    // endorsement
    modalEndorsement: false
  })
  const dataEmployee = useSelector((state) => state.users.list)
  const userData = useSelector((state) => state.auth.userData)
  const avatar = userData.avatar
  const fullName = userData.full_name
  const userId = userData.id

  const dispatch = useDispatch()
  // ** function
  const toggleModalCreatePost = () => {
    setState({ modalCreatePost: !state.modalCreatePost })
  }
  const setOptionCreate = (value) => setState({ optionCreate: value })

  const toggleModalCreateEvent = () => {
    dispatch(
      showAddEventCalendarModal({
        idEvent: null,
        viewOnly: false
      })
    )
  }
  const toggleModalAnnouncement = () =>
    setState({ modalAnnouncement: !state.modalAnnouncement })
  const toggleModalEndorsement = () =>
    setState({ modalEndorsement: !state.modalEndorsement })
  // ** useEffect
  useEffect(() => {
    let data_mention = handleDataMention(dataEmployee, userId)

    if (rest?.detailWorkspace?.members) {
      const arrMemberId = rest.detailWorkspace?.members?.map(
        (item) => item.id_user
      )

      let newDataEmployee = {}
      Object.keys(dataEmployee).forEach((key) => {
        if (arrMemberId.includes(dataEmployee[key].id)) {
          newDataEmployee[Number(dataEmployee[key].id)] = dataEmployee[key]
        }
      })

      data_mention = handleDataMention(newDataEmployee, userId)
    }

    setState({ dataMention: data_mention })
  }, [dataEmployee, rest.detailWorkspace])

  const checkAllowPostType = (typeCheck) => {
    if (_.isEmpty(allowPostType)) return true
    else {
      if (allowPostType.includes(typeCheck)) return true
    }
    return false
  }
  return (
    <Fragment>
      <div className="div-create-post">
        <div className="div-post">
          <Avatar className="img" src={avatar} />
          <div
            className="div-post-input"
            onClick={() => toggleModalCreatePost()}>
            <span>
              {useFormatMessage(
                "modules.feed.create_post.text.placeholder_input"
              )}
            </span>
          </div>
        </div>
        <hr />
        <div className="div-option">
          <ul className="ul-option">
            {/*  <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none">
                <path
                  d="M16.19 2.5H7.81C4.17 2.5 2 4.67 2 8.31V16.69C2 20.33 4.17 22.5 7.81 22.5H16.19C19.83 22.5 22 20.33 22 16.69V8.31C22 4.67 19.83 2.5 16.19 2.5ZM9.97 15.4L7.72 17.65C7.57 17.8 7.38 17.87 7.19 17.87C7 17.87 6.8 17.8 6.66 17.65L5.91 16.9C5.61 16.61 5.61 16.13 5.91 15.84C6.2 15.55 6.67 15.55 6.97 15.84L7.19 16.06L8.91 14.34C9.2 14.05 9.67 14.05 9.97 14.34C10.26 14.63 10.26 15.11 9.97 15.4ZM9.97 8.4L7.72 10.65C7.57 10.8 7.38 10.87 7.19 10.87C7 10.87 6.8 10.8 6.66 10.65L5.91 9.9C5.61 9.61 5.61 9.13 5.91 8.84C6.2 8.55 6.67 8.55 6.97 8.84L7.19 9.06L8.91 7.34C9.2 7.05 9.67 7.05 9.97 7.34C10.26 7.63 10.26 8.11 9.97 8.4ZM17.56 17.12H12.31C11.9 17.12 11.56 16.78 11.56 16.37C11.56 15.96 11.9 15.62 12.31 15.62H17.56C17.98 15.62 18.31 15.96 18.31 16.37C18.31 16.78 17.98 17.12 17.56 17.12ZM17.56 10.12H12.31C11.9 10.12 11.56 9.78 11.56 9.37C11.56 8.96 11.9 8.62 12.31 8.62H17.56C17.98 8.62 18.31 8.96 18.31 9.37C18.31 9.78 17.98 10.12 17.56 10.12Z"
                  fill="#69DCA1"
                />
              </svg>

              <span>
                {useFormatMessage("modules.feed.create_post.text.task")}
              </span>
            </li> */}
            {feed_post_type_allow.includes("event") &&
              checkAllowPostType("event") && (
                <li onClick={() => toggleModalCreateEvent()}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25C15.59 1.25 15.25 1.59 15.25 2V3.5H8.74999V2C8.74999 1.59 8.40999 1.25 7.99999 1.25C7.58999 1.25 7.24999 1.59 7.24999 2V3.56C4.54999 3.81 3.23999 5.42 3.03999 7.81C3.01999 8.1 3.25999 8.34 3.53999 8.34H20.46C20.75 8.34 20.99 8.09 20.96 7.81C20.76 5.42 19.45 3.81 16.75 3.56Z"
                      fill="#00B3B3"
                    />
                    <path
                      d="M20 9.83997H4C3.45 9.83997 3 10.29 3 10.84V17C3 20 4.5 22 8 22H16C19.5 22 21 20 21 17V10.84C21 10.29 20.55 9.83997 20 9.83997ZM9.21 18.21C9.11 18.3 9 18.37 8.88 18.42C8.76 18.47 8.63 18.5 8.5 18.5C8.37 18.5 8.24 18.47 8.12 18.42C8 18.37 7.89 18.3 7.79 18.21C7.61 18.02 7.5 17.76 7.5 17.5C7.5 17.24 7.61 16.98 7.79 16.79C7.89 16.7 8 16.63 8.12 16.58C8.36 16.48 8.64 16.48 8.88 16.58C9 16.63 9.11 16.7 9.21 16.79C9.39 16.98 9.5 17.24 9.5 17.5C9.5 17.76 9.39 18.02 9.21 18.21ZM9.42 14.38C9.37 14.5 9.3 14.61 9.21 14.71C9.11 14.8 9 14.87 8.88 14.92C8.76 14.97 8.63 15 8.5 15C8.37 15 8.24 14.97 8.12 14.92C8 14.87 7.89 14.8 7.79 14.71C7.7 14.61 7.63 14.5 7.58 14.38C7.53 14.26 7.5 14.13 7.5 14C7.5 13.87 7.53 13.74 7.58 13.62C7.63 13.5 7.7 13.39 7.79 13.29C7.89 13.2 8 13.13 8.12 13.08C8.36 12.98 8.64 12.98 8.88 13.08C9 13.13 9.11 13.2 9.21 13.29C9.3 13.39 9.37 13.5 9.42 13.62C9.47 13.74 9.5 13.87 9.5 14C9.5 14.13 9.47 14.26 9.42 14.38ZM12.71 14.71C12.61 14.8 12.5 14.87 12.38 14.92C12.26 14.97 12.13 15 12 15C11.87 15 11.74 14.97 11.62 14.92C11.5 14.87 11.39 14.8 11.29 14.71C11.11 14.52 11 14.26 11 14C11 13.74 11.11 13.48 11.29 13.29C11.39 13.2 11.5 13.13 11.62 13.08C11.86 12.97 12.14 12.97 12.38 13.08C12.5 13.13 12.61 13.2 12.71 13.29C12.89 13.48 13 13.74 13 14C13 14.26 12.89 14.52 12.71 14.71Z"
                      fill="#00B3B3"
                    />
                  </svg>

                  <span>
                    {useFormatMessage("modules.feed.create_post.text.event")}
                  </span>
                </li>
              )}
            {feed_post_type_allow.includes("poll") &&
              checkAllowPostType("poll") && (
                <li
                  onClick={() => {
                    setState({ optionCreate: "poll_vote" })
                    toggleModalCreatePost()
                  }}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM8.5 6.38C9.53 6.38 10.38 7.22 10.38 8.26C10.38 9.3 9.54 10.14 8.5 10.14C7.46 10.14 6.62 9.28 6.62 8.25C6.62 7.22 7.47 6.38 8.5 6.38ZM12 19.08C9.31 19.08 7.12 16.89 7.12 14.2C7.12 13.5 7.69 12.92 8.39 12.92H15.59C16.29 12.92 16.86 13.49 16.86 14.2C16.88 16.89 14.69 19.08 12 19.08ZM15.5 10.12C14.47 10.12 13.62 9.28 13.62 8.24C13.62 7.2 14.46 6.36 15.5 6.36C16.54 6.36 17.38 7.2 17.38 8.24C17.38 9.28 16.53 10.12 15.5 10.12Z"
                      fill="#FF9149"
                    />
                  </svg>

                  <span>
                    {useFormatMessage("modules.feed.create_post.text.poll")}
                  </span>
                </li>
              )}

            {createAnnouncement && checkAllowPostType("announcement") && (
              <li onClick={() => toggleModalAnnouncement()}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
                    fill="#A279EF"
                  />
                  <path
                    d="M19.8 9.42C19.78 9.42 19.76 9.43 19.74 9.43C19.64 9.45 19.54 9.46 19.43 9.48C19.01 9.52 18.56 9.5 18.1 9.41C17.98 9.38 17.88 9.36 17.77 9.32C17.44 9.24 17.13 9.11 16.84 8.94C16.72 8.88 16.6 8.8 16.49 8.73C16.01 8.4 15.6 7.99 15.27 7.51C15.2 7.4 15.12 7.28 15.06 7.16C14.89 6.87 14.76 6.56 14.68 6.23C14.64 6.12 14.62 6.02 14.59 5.9C14.5 5.44 14.48 4.99 14.52 4.57C14.54 4.46 14.55 4.36 14.57 4.26C14.57 4.24 14.58 4.22 14.58 4.2C14.7 3.58 14.24 3 13.6 3H7.52C7.38 3 7.24 3.01 7.11 3.02C6.99 3.03 6.88 3.04 6.76 3.06C6.64 3.07 6.52 3.09 6.41 3.11C4 3.46 2.46 4.99 2.11 7.41C2.09 7.52 2.07 7.64 2.06 7.76C2.04 7.88 2.03 7.99 2.02 8.11C2.01 8.24 2 8.38 2 8.52V16.48C2 16.62 2.01 16.76 2.02 16.89C2.03 17.01 2.04 17.12 2.06 17.24C2.07 17.36 2.09 17.48 2.11 17.59C2.46 20.01 4 21.54 6.41 21.89C6.52 21.91 6.64 21.93 6.76 21.94C6.88 21.96 6.99 21.97 7.11 21.98C7.24 21.99 7.38 22 7.52 22H15.48C15.62 22 15.76 21.99 15.89 21.98C16.01 21.97 16.12 21.96 16.24 21.94C16.36 21.93 16.48 21.91 16.59 21.89C19 21.54 20.54 20.01 20.89 17.59C20.91 17.48 20.93 17.36 20.94 17.24C20.96 17.12 20.97 17.01 20.98 16.89C20.99 16.76 21 16.62 21 16.48V10.4C21 9.76 20.42 9.3 19.8 9.42ZM6.75 12.5H11.75C12.16 12.5 12.5 12.84 12.5 13.25C12.5 13.66 12.16 14 11.75 14H6.75C6.34 14 6 13.66 6 13.25C6 12.84 6.34 12.5 6.75 12.5ZM15.75 18H6.75C6.34 18 6 17.66 6 17.25C6 16.84 6.34 16.5 6.75 16.5H15.75C16.16 16.5 16.5 16.84 16.5 17.25C16.5 17.66 16.16 18 15.75 18Z"
                    fill="#A279EF"
                  />
                </svg>

                <span>
                  {useFormatMessage(
                    "modules.feed.create_post.text.announcement"
                  )}
                </span>
              </li>
            )}
            {createEndorsement && checkAllowPostType("endorsement") && (
              <li
                onClick={() => {
                  toggleModalEndorsement()
                }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.25 18.25H9C7.9 18.25 7 19.15 7 20.25V20.5H6C5.59 20.5 5.25 20.84 5.25 21.25C5.25 21.66 5.59 22 6 22H18C18.41 22 18.75 21.66 18.75 21.25C18.75 20.84 18.41 20.5 18 20.5H17V20.25C17 19.15 16.1 18.25 15 18.25H12.75V15.96C12.5 15.99 12.25 16 12 16C11.75 16 11.5 15.99 11.25 15.96V18.25Z"
                    fill="#E52717"
                  />
                  <path
                    d="M18.48 11.64C19.14 11.39 19.72 10.98 20.18 10.52C21.11 9.49 21.72 8.26 21.72 6.82C21.72 5.38 20.59 4.25 19.15 4.25H18.59C17.94 2.92 16.58 2 15 2H9C7.42 2 6.06 2.92 5.41 4.25H4.85C3.41 4.25 2.28 5.38 2.28 6.82C2.28 8.26 2.89 9.49 3.82 10.52C4.28 10.98 4.86 11.39 5.52 11.64C6.56 14.2 9.06 16 12 16C14.94 16 17.44 14.2 18.48 11.64ZM14.84 8.45L14.22 9.21C14.12 9.32 14.05 9.54 14.06 9.69L14.12 10.67C14.16 11.27 13.73 11.58 13.17 11.36L12.26 11C12.12 10.95 11.88 10.95 11.74 11L10.83 11.36C10.27 11.58 9.84 11.27 9.88 10.67L9.94 9.69C9.95 9.54 9.88 9.32 9.78 9.21L9.16 8.45C8.77 7.99 8.94 7.48 9.52 7.33L10.47 7.09C10.62 7.05 10.8 6.91 10.88 6.78L11.41 5.96C11.74 5.45 12.26 5.45 12.59 5.96L13.12 6.78C13.2 6.91 13.38 7.05 13.53 7.09L14.48 7.33C15.06 7.48 15.23 7.99 14.84 8.45Z"
                    fill="#E52717"
                  />
                </svg>

                <span>
                  {useFormatMessage(
                    "modules.feed.create_post.endorsement.title"
                  )}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {state.modalCreatePost && (
        <ModalCreatePost
          modal={state.modalCreatePost}
          toggleModal={toggleModalCreatePost}
          setModal={(value) => setState({ modalCreatePost: value })}
          avatar={avatar}
          fullName={fullName}
          userId={userId}
          dataMention={state.dataMention}
          workspace={workspace}
          setDataCreateNew={setDataCreateNew}
          approveStatus={approveStatusfm}
          optionCreate={state.optionCreate}
          setOptionCreate={setOptionCreate}
        />
      )}

      <ModalCreateEvent
        options_employee_department={options_employee_department}
        optionsMeetingRoom={optionsMeetingRoom}
        setDataCreateNew={setDataCreateNew}
        workspace={workspace}
        createEventApi={eventApi.postSubmitEvent}
        getDetailApi={eventApi.getGetEventById}
      />

      <ModalAnnouncement
        modal={state.modalAnnouncement}
        toggleModal={toggleModalAnnouncement}
        options_employee_department={options_employee_department}
        setDataCreateNew={setDataCreateNew}
      />

      <Endorsement
        modal={state.modalEndorsement}
        toggleModal={toggleModalEndorsement}
        dataMention={state.dataMention}
        setDataCreateNew={setDataCreateNew}
        showTooltip={false}
      />
    </Fragment>
  )
}

export default CreatePost
