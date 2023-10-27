import { ErpSwitch } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { arrayRemove, arrayUnion } from "firebase/firestore"

const ProfileSidebarGeneral = (props) => {
  const {
    checkedNotification,
    setCheckedNotification,
    handleUpdateGroup,
    handleShowFileView,
    selectedGroup,
    userId,
    handleShowMoreOption
  } = props

  return (
    <>
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

      <div
        className="profile-div"
        onClick={() => handleShowFileView(true, "file")}>
        <span className="title">
          {useFormatMessage("modules.chat.text.files")}
        </span>
        <div className="profile-div-right">
          <span className="number">{selectedGroup?.file_count?.file || 0}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none">
            <path
              d="M5.3125 3.625L9.6875 8L5.3125 12.375"
              stroke="#212121"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        className="profile-div"
        onClick={() => handleShowFileView(true, "media")}>
        <span className="title">
          {useFormatMessage("modules.chat.text.media")}
        </span>
        <div className="profile-div-right">
          <span className="number">
            {selectedGroup?.file_count?.image || 0}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none">
            <path
              d="M5.3125 3.625L9.6875 8L5.3125 12.375"
              stroke="#212121"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        className="profile-div"
        onClick={() => handleShowFileView(true, "link")}>
        <span className="title">
          {useFormatMessage("modules.chat.text.share_links")}
        </span>
        <div className="profile-div-right">
          <span className="number">{selectedGroup?.file_count?.link || 0}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none">
            <path
              d="M5.3125 3.625L9.6875 8L5.3125 12.375"
              stroke="#212121"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="profile-div" onClick={() => handleShowMoreOption()}>
        <span className="title">
          {useFormatMessage("modules.chat.text.more_options")}
        </span>
        <div className="profile-div-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none">
            <path
              d="M5.3125 3.625L9.6875 8L5.3125 12.375"
              stroke="#212121"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  )
}

export default ProfileSidebarGeneral
