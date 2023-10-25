import { useFormatMessage } from "@apps/utility/common"
import facebookIcon from "../../assets/images/facebook.png"
import { ErpSwitch } from "@apps/components/common/ErpField"
import { arrayRemove, arrayUnion } from "firebase/firestore"

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
        <h6 className="section-label mb-1">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <g clipPath="url(#clip0_261_21601)">
                  <path
                    d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.38823 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9165 4.6875 14.6576 4.6875C15.9705 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.3399 7.875 13.875 8.80001 13.875 9.74899V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                    fill="#1877F2"
                  />
                  <path
                    d="M16.6711 15.4688L17.2031 12H13.875V9.74899C13.875 8.80001 14.3399 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9165 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C10.7359 23.9501 11.3621 24 12 24C12.6379 24 13.2641 23.9501 13.875 23.8542V15.4688H16.6711Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_261_21601">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>

            <a
              href={user?.personalInfo?.social_instagram}
              target="_blank"
              onClick={(e) => {
                if (!user?.personalInfo?.social_instagram) {
                  e.preventDefault()
                }
              }}
              className="social-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M22.222 0.00178957H1.77099C0.804431 -0.00911825 0.0117963 0.765131 0 1.7317V22.268C0.0113924 23.235 0.803963 24.01 1.77099 23.9999H22.222C23.1909 24.0119 23.9866 23.2369 24 22.268V1.73022C23.9862 0.761739 23.1904 -0.0124652 22.222 0.000152051"
                  fill="#0A66C2"
                />
                <path
                  d="M16.8928 20.4491H20.4489L20.4504 14.1666C20.4504 11.0824 19.7858 8.71162 16.1816 8.71162C14.8038 8.66047 13.5095 9.37134 12.8134 10.5615H12.7656V8.99648H9.35179V20.4487H12.9078V14.7833C12.9078 13.2894 13.1912 11.8425 15.0433 11.8425C16.8691 11.8425 16.8928 13.552 16.8928 14.88V20.4491Z"
                  fill="white"
                />
                <path
                  d="M3.27539 5.36775C3.2756 6.50748 4.19968 7.43125 5.33938 7.43104C5.88669 7.43094 6.41154 7.21343 6.79847 6.82635C7.18541 6.43926 7.40273 5.91432 7.40263 5.36701C7.40243 4.22727 6.47835 3.30351 5.33864 3.30371C4.19893 3.30392 3.27519 4.22802 3.27539 5.36775Z"
                  fill="white"
                />
                <path
                  d="M3.55765 20.4491H7.11741V8.99648H3.55765V20.4491Z"
                  fill="white"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <path
                  d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                  fill="url(#paint0_linear_950_3664)"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.43201 11.873C8.93026 10.3488 11.263 9.34403 12.4301 8.85856C15.7627 7.47245 16.4551 7.23167 16.9065 7.22372C17.0058 7.22197 17.2277 7.24657 17.3715 7.36323C17.4929 7.46174 17.5263 7.59481 17.5423 7.68821C17.5583 7.78161 17.5782 7.99436 17.5623 8.16061C17.3817 10.0581 16.6003 14.6628 16.2028 16.788C16.0346 17.6873 15.7034 17.9888 15.3827 18.0183C14.6858 18.0824 14.1567 17.5577 13.4817 17.1153C12.4256 16.423 11.8289 15.992 10.8037 15.3164C9.61896 14.5357 10.387 14.1066 11.0622 13.4053C11.2389 13.2217 14.3093 10.429 14.3687 10.1756C14.3762 10.144 14.3831 10.0258 14.3129 9.96348C14.2427 9.90112 14.1392 9.92244 14.0644 9.93941C13.9585 9.96345 12.2713 11.0786 9.00276 13.285C8.52385 13.6138 8.09007 13.7741 7.70141 13.7657C7.27295 13.7564 6.44876 13.5234 5.83606 13.3242C5.08456 13.08 4.48728 12.9508 4.53929 12.5359C4.56638 12.3199 4.86395 12.0989 5.43201 11.873Z"
                  fill="white"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_950_3664"
                    x1="12"
                    y1="0"
                    x2="12"
                    y2="23.822"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2AABEE" />
                    <stop offset="1" stopColor="#229ED9" />
                  </linearGradient>
                </defs>
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="21"
                viewBox="0 0 24 21"
                fill="none">
                <path
                  d="M21.543 4.99451C21.5576 5.2115 21.5576 5.42848 21.5576 5.64746C21.5576 12.32 16.6045 20.0154 7.54759 20.0154V20.0114C4.87215 20.0154 2.25229 19.2294 0 17.7476C0.389031 17.7955 0.780012 17.8195 1.17197 17.8205C3.38915 17.8225 5.54296 17.0596 7.28726 15.6547C5.18026 15.6137 3.3326 14.2048 2.68714 12.148C3.42523 12.294 4.18574 12.264 4.91018 12.061C2.61304 11.585 0.96039 9.51517 0.96039 7.11135C0.96039 7.08935 0.96039 7.06836 0.96039 7.04736C1.64485 7.43833 2.41121 7.65531 3.19512 7.67931C1.03157 6.19642 0.364656 3.24464 1.67118 0.936818C4.17111 4.09158 7.8596 6.00944 11.8191 6.21242C11.4223 4.45855 11.9644 2.62069 13.2436 1.38778C15.2268 -0.524072 18.3459 -0.426079 20.2101 1.60677C21.3129 1.38378 22.3698 0.968816 23.337 0.38086C22.9694 1.54977 22.2001 2.5427 21.1725 3.17365C22.1484 3.05566 23.102 2.78768 24 2.37871C23.3389 3.39463 22.5063 4.27957 21.543 4.99451Z"
                  fill="#1D9BF0"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none">
                <rect width="25" height="25" fill="url(#pattern4)" />
                <defs>
                  <pattern
                    id="pattern4"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1">
                    <use
                      xlinkHref="#image0_871_8324"
                      transform="scale(0.00195312)"
                    />
                  </pattern>
                  <image
                    id="image0_871_8324"
                    width="512"
                    height="512"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <hr />
    </>
  )
}

export default ProfileSidebarEmployee
