import Avatar from "@apps/modules/download/pages/Avatar"
import {
  getAvatarUrl,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import ModalCreatePost from "./CreatePostDetails/modals/ModalCreatePost"

const CreatePost = (props) => {
  const {
    workspace, // arr workspace: []
    setDataCreateNew, // function set Data then create new post
    approveStatus = "approved" // approved / rejected / pending
  } = props
  const [state, setState] = useMergedState({
    modalCreatePost: false,
    dataMention: []
  })
  console.log("approveStatus", approveStatus)
  const dataEmployee = useSelector((state) => state.users.list)
  const userData = useSelector((state) => state.auth.userData)
  const avatar = userData.avatar
  const userName = userData.username
  const fullName = userData.full_name
  const userId = userData.id

  // ** function
  const toggleModalCreatePost = () => {
    setState({ modalCreatePost: !state.modalCreatePost })
  }

  // ** useEffect
  useEffect(() => {
    const data_mention = []
    _.forEach(dataEmployee, (value) => {
      data_mention.push({
        id: value.id,
        name: value.full_name,
        link: "#",
        avatar: getAvatarUrl(value.id * 1)
      })
    })
    setState({ dataMention: data_mention })
  }, [dataEmployee])

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
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none">
                <path
                  d="M12.37 9.38H17.62"
                  stroke="#69DCA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.38 9.38L7.13 10.13L9.38 7.88"
                  stroke="#69DCA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.37 16.38H17.62"
                  stroke="#69DCA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.38 16.38L7.13 17.13L9.38 14.88"
                  stroke="#69DCA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 22.5H15C20 22.5 22 20.5 22 15.5V9.5C22 4.5 20 2.5 15 2.5H9C4 2.5 2 4.5 2 9.5V15.5C2 20.5 4 22.5 9 22.5Z"
                  stroke="#69DCA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {useFormatMessage("modules.feed.create_post.text.task")}
              </span>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none">
                <path
                  d="M8 2.5V5.5"
                  stroke="#63A4F5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 2.5V5.5"
                  stroke="#63A4F5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 9.59H20.5"
                  stroke="#63A4F5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 9V17.5C21 20.5 19.5 22.5 16 22.5H8C4.5 22.5 3 20.5 3 17.5V9C3 6 4.5 4 8 4H16C19.5 4 21 6 21 9Z"
                  stroke="#63A4F5"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9955 14.2H12.0045"
                  stroke="#63A4F5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.29431 14.2H8.30329"
                  stroke="#63A4F5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.29431 17.2H8.30329"
                  stroke="#63A4F5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {useFormatMessage("modules.feed.create_post.text.event")}
              </span>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none">
                <path
                  d="M9 22.5H15C20 22.5 22 20.5 22 15.5V9.5C22 4.5 20 2.5 15 2.5H9C4 2.5 2 4.5 2 9.5V15.5C2 20.5 4 22.5 9 22.5Z"
                  stroke="#FFB11A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.5 10.25C16.3284 10.25 17 9.57843 17 8.75C17 7.92157 16.3284 7.25 15.5 7.25C14.6716 7.25 14 7.92157 14 8.75C14 9.57843 14.6716 10.25 15.5 10.25Z"
                  stroke="#FFB11A"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 10.25C9.32843 10.25 10 9.57843 10 8.75C10 7.92157 9.32843 7.25 8.5 7.25C7.67157 7.25 7 7.92157 7 8.75C7 9.57843 7.67157 10.25 8.5 10.25Z"
                  stroke="#FFB11A"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.4 13.8H15.6C16.1 13.8 16.5 14.2 16.5 14.7C16.5 17.19 14.49 19.2 12 19.2C9.51 19.2 7.5 17.19 7.5 14.7C7.5 14.2 7.9 13.8 8.4 13.8Z"
                  stroke="#FFB11A"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {useFormatMessage("modules.feed.create_post.text.poll")}
              </span>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none">
                <path
                  d="M19 8.5C20.6569 8.5 22 7.15685 22 5.5C22 3.84315 20.6569 2.5 19 2.5C17.3431 2.5 16 3.84315 16 5.5C16 7.15685 17.3431 8.5 19 8.5Z"
                  stroke="#784CD6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 13.5H12"
                  stroke="#784CD6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 17.5H16"
                  stroke="#784CD6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2.5H9C4 2.5 2 4.5 2 9.5V15.5C2 20.5 4 22.5 9 22.5H15C20 22.5 22 20.5 22 15.5V10.5"
                  stroke="#784CD6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {useFormatMessage("modules.feed.create_post.text.announcement")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <ModalCreatePost
        modal={state.modalCreatePost}
        toggleModal={toggleModalCreatePost}
        setModal={(value) => setState({ modalCreatePost: value })}
        avatar={avatar}
        fullName={fullName}
        dataMention={state.dataMention}
        workspace={workspace}
        setDataCreateNew={setDataCreateNew}
        approveStatus={approveStatus}
      />
    </Fragment>
  )
}

export default CreatePost
