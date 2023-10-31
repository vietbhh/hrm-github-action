import { useFormatMessage } from "@apps/utility/common"
import facebookIcon from "../../assets/images/facebook.png"
import { ErpSwitch } from "@apps/components/common/ErpField"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import facebook from "@src/assets/images/social/facebook.png";
import linkedin from "@src/assets/images/social/linkedin.png";
import telegram from "@src/assets/images/social/telegram 1.png";
import twitter from "@src/assets/images/social/twitter.png";
import youtube from "@src/assets/images/social/youtube.png";

const ProfileSidebarEmployee = (props) => {
  const {user ,  checkedNotification, setCheckedNotification,handleUpdateGroup ,selectedGroup, userId} = props
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

      <div className="personal-info">
        <h6 className="section-label mb-50">
          {useFormatMessage("modules.chat.text.email")}
        </h6>
        <ul className="list-unstyled">
          <li className="mb-50">
            <span className="align-middle section-text">
              {user?.personalInfo?.email}
            </span>
          </li>
        </ul>
      </div>

      <div className="personal-info">
        <h6 className="section-label mb-50">
          {useFormatMessage("modules.chat.text.phone")}
        </h6>
        <ul className="list-unstyled">
          <li className="mb-50">
            <span className="align-middle section-text">
              {user?.personalInfo?.phone}
            </span>
          </li>
        </ul>
      </div>

      <div className="personal-info">
        <h6 className="section-label mb-1 social">
          {useFormatMessage("modules.chat.text.social")}
        </h6>
        <ul className="list-unstyled">
          <li className="mb-50">
            <a
              href={`${user?.personalInfo?.social_facebook}`}
              target="_blank"
              onClick={(e) => {
                if (!user?.personalInfo?.social_facebook) {
                  e.preventDefault()
                }
              }}
              className="social-icon">
               <img src={facebook} />
            </a>

            <a
              href={user?.personalInfo?.social_linkedin}
              target="_blank"
              onClick={(e) => {
                if (!user?.personalInfo?.social_linkedin) {
                  e.preventDefault()
                }
              }}
              className="social-icon">
               <img src={linkedin} />
            </a>

            <a
              href={user?.personalInfo?.social_telegram}
              target="_blank"
              onClick={(e) => {
                if (!user?.personalInfo?.social_telegram) {
                  e.preventDefault()
                }
              }}
              className="social-icon">
               <img src={telegram} />
            </a>

            <a
              href={user?.personalInfo?.social_twitter}
              target="_blank"
              onClick={(e) => {
                if (!user?.personalInfo?.social_twitter) {
                  e.preventDefault()
                }
              }}
              className="social-icon">
               <img src={twitter} />
            </a>

            <a
              href={user?.personalInfo?.social_youtube}
              target="_blank"
              onClick={(e) => {
                if (!user?.personalInfo?.social_youtube) {
                  e.preventDefault()
                }
              }}
              className="social-icon">
              <img src={youtube}></img>
            </a>
          </li>
        </ul>
      </div>

    </>
  )
}

export default ProfileSidebarEmployee
