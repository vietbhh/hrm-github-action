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
    allowPostType = []
  } = props
  const ability = useContext(AbilityContext)
  const createAnnouncement = ability.can("create_announcement", "feed")
  const createEndorsement = ability.can("create_endorsement", "feed")
  const PostWithoutApproval = ability.can("PostWithoutApproval", "feed")
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
    const data_mention = handleDataMention(dataEmployee, userId)
    setState({ dataMention: data_mention })
  }, [dataEmployee])

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
            {checkAllowPostType("event") && (
              <li onClick={() => toggleModalCreateEvent()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none">
                  <path
                    d="M17.4479 3.70834V2.08334C17.4479 1.65626 17.0937 1.30209 16.6667 1.30209C16.2396 1.30209 15.8854 1.65626 15.8854 2.08334V3.64584H9.11458V2.08334C9.11458 1.65626 8.76042 1.30209 8.33333 1.30209C7.90625 1.30209 7.55208 1.65626 7.55208 2.08334V3.70834C4.73958 3.96876 3.375 5.64584 3.16667 8.13543C3.14583 8.43751 3.39583 8.68751 3.6875 8.68751H21.3125C21.6146 8.68751 21.8646 8.42709 21.8333 8.13543C21.625 5.64584 20.2604 3.96876 17.4479 3.70834Z"
                    fill="#63A4F5"
                  />
                  <path
                    d="M20.8333 10.25H4.16667C3.59375 10.25 3.125 10.7187 3.125 11.2917V17.7083C3.125 20.8333 4.6875 22.9167 8.33333 22.9167H16.6667C20.3125 22.9167 21.875 20.8333 21.875 17.7083V11.2917C21.875 10.7187 21.4062 10.25 20.8333 10.25ZM9.59375 18.9687C9.48958 19.0625 9.375 19.1354 9.25 19.1875C9.125 19.2396 8.98958 19.2708 8.85417 19.2708C8.71875 19.2708 8.58333 19.2396 8.45833 19.1875C8.33333 19.1354 8.21875 19.0625 8.11458 18.9687C7.92708 18.7708 7.8125 18.5 7.8125 18.2292C7.8125 17.9583 7.92708 17.6875 8.11458 17.4896C8.21875 17.3958 8.33333 17.3229 8.45833 17.2708C8.70833 17.1667 9 17.1667 9.25 17.2708C9.375 17.3229 9.48958 17.3958 9.59375 17.4896C9.78125 17.6875 9.89583 17.9583 9.89583 18.2292C9.89583 18.5 9.78125 18.7708 9.59375 18.9687ZM9.8125 14.9792C9.76042 15.1042 9.6875 15.2187 9.59375 15.3229C9.48958 15.4167 9.375 15.4896 9.25 15.5417C9.125 15.5937 8.98958 15.625 8.85417 15.625C8.71875 15.625 8.58333 15.5937 8.45833 15.5417C8.33333 15.4896 8.21875 15.4167 8.11458 15.3229C8.02083 15.2187 7.94792 15.1042 7.89583 14.9792C7.84375 14.8542 7.8125 14.7187 7.8125 14.5833C7.8125 14.4479 7.84375 14.3125 7.89583 14.1875C7.94792 14.0625 8.02083 13.9479 8.11458 13.8437C8.21875 13.75 8.33333 13.6771 8.45833 13.625C8.70833 13.5208 9 13.5208 9.25 13.625C9.375 13.6771 9.48958 13.75 9.59375 13.8437C9.6875 13.9479 9.76042 14.0625 9.8125 14.1875C9.86458 14.3125 9.89583 14.4479 9.89583 14.5833C9.89583 14.7187 9.86458 14.8542 9.8125 14.9792ZM13.2396 15.3229C13.1354 15.4167 13.0208 15.4896 12.8958 15.5417C12.7708 15.5937 12.6354 15.625 12.5 15.625C12.3646 15.625 12.2292 15.5937 12.1042 15.5417C11.9792 15.4896 11.8646 15.4167 11.7604 15.3229C11.5729 15.125 11.4583 14.8542 11.4583 14.5833C11.4583 14.3125 11.5729 14.0417 11.7604 13.8437C11.8646 13.75 11.9792 13.6771 12.1042 13.625C12.3542 13.5104 12.6458 13.5104 12.8958 13.625C13.0208 13.6771 13.1354 13.75 13.2396 13.8437C13.4271 14.0417 13.5417 14.3125 13.5417 14.5833C13.5417 14.8542 13.4271 15.125 13.2396 15.3229Z"
                    fill="#63A4F5"
                  />
                </svg>

                <span>
                  {useFormatMessage("modules.feed.create_post.text.event")}
                </span>
              </li>
            )}
            {checkAllowPostType("poll") && (
              <li
                onClick={() => {
                  setState({ optionCreate: "poll_vote" })
                  toggleModalCreatePost()
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none">
                  <path
                    d="M16.19 2.5H7.81C4.17 2.5 2 4.67 2 8.31V16.68C2 20.33 4.17 22.5 7.81 22.5H16.18C19.82 22.5 21.99 20.33 21.99 16.69V8.31C22 4.67 19.83 2.5 16.19 2.5ZM8.5 6.88C9.53 6.88 10.38 7.72 10.38 8.76C10.38 9.8 9.54 10.64 8.5 10.64C7.46 10.64 6.62 9.78 6.62 8.75C6.62 7.72 7.47 6.88 8.5 6.88ZM12 19.58C9.31 19.58 7.12 17.39 7.12 14.7C7.12 14 7.69 13.42 8.39 13.42H15.59C16.29 13.42 16.86 13.99 16.86 14.7C16.88 17.39 14.69 19.58 12 19.58ZM15.5 10.62C14.47 10.62 13.62 9.78 13.62 8.74C13.62 7.7 14.46 6.86 15.5 6.86C16.54 6.86 17.38 7.7 17.38 8.74C17.38 9.78 16.53 10.62 15.5 10.62Z"
                    fill="#FFB11A"
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
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none">
                  <path
                    d="M19 8.5C20.6569 8.5 22 7.15685 22 5.5C22 3.84315 20.6569 2.5 19 2.5C17.3431 2.5 16 3.84315 16 5.5C16 7.15685 17.3431 8.5 19 8.5Z"
                    fill="#784CD6"
                  />
                  <path
                    d="M19.8 9.92C19.78 9.92 19.76 9.93 19.74 9.93C19.64 9.95 19.54 9.96 19.43 9.98C19.01 10.02 18.56 10 18.1 9.91C17.98 9.88 17.88 9.86 17.77 9.82C17.44 9.74 17.13 9.61 16.84 9.44C16.72 9.38 16.6 9.3 16.49 9.23C16.01 8.9 15.6 8.49 15.27 8.01C15.2 7.9 15.12 7.78 15.06 7.66C14.89 7.37 14.76 7.06 14.68 6.73C14.64 6.62 14.62 6.52 14.59 6.4C14.5 5.94 14.48 5.49 14.52 5.07C14.54 4.96 14.55 4.86 14.57 4.76C14.57 4.74 14.58 4.72 14.58 4.7C14.7 4.08 14.24 3.5 13.6 3.5H7.52C7.38 3.5 7.24 3.51 7.11 3.52C6.99 3.53 6.88 3.54 6.76 3.56C6.64 3.57 6.52 3.59 6.41 3.61C4 3.96 2.46 5.49 2.11 7.91C2.09 8.02 2.07 8.14 2.06 8.26C2.04 8.38 2.03 8.49 2.02 8.61C2.01 8.74 2 8.88 2 9.02V16.98C2 17.12 2.01 17.26 2.02 17.39C2.03 17.51 2.04 17.62 2.06 17.74C2.07 17.86 2.09 17.98 2.11 18.09C2.46 20.51 4 22.04 6.41 22.39C6.52 22.41 6.64 22.43 6.76 22.44C6.88 22.46 6.99 22.47 7.11 22.48C7.24 22.49 7.38 22.5 7.52 22.5H15.48C15.62 22.5 15.76 22.49 15.89 22.48C16.01 22.47 16.12 22.46 16.24 22.44C16.36 22.43 16.48 22.41 16.59 22.39C19 22.04 20.54 20.51 20.89 18.09C20.91 17.98 20.93 17.86 20.94 17.74C20.96 17.62 20.97 17.51 20.98 17.39C20.99 17.26 21 17.12 21 16.98V10.9C21 10.26 20.42 9.8 19.8 9.92ZM6.75 13H11.75C12.16 13 12.5 13.34 12.5 13.75C12.5 14.16 12.16 14.5 11.75 14.5H6.75C6.34 14.5 6 14.16 6 13.75C6 13.34 6.34 13 6.75 13ZM15.75 18.5H6.75C6.34 18.5 6 18.16 6 17.75C6 17.34 6.34 17 6.75 17H15.75C16.16 17 16.5 17.34 16.5 17.75C16.5 18.16 16.16 18.5 15.75 18.5Z"
                    fill="#784CD6"
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
                {iconEndorsement}
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
        toggleModalCreatePost={toggleModalCreatePost}
      />
    </Fragment>
  )
}

export default CreatePost
