import { ErpRadio } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import { Dropdown } from "antd"
import { Fragment } from "react"
import { Button } from "reactstrap"

const HeaderCreatePost = (props) => {
  const {
    avatar,
    fullName,
    dataMention,
    privacy_type,
    setPrivacyType,
    tag_your_colleagues,
    toggleModalTag,
    toggleModalCreatePost,
    is_poll
  } = props
  // ** render
  const items = [
    {
      label: (
        <a className="">
          <ErpRadio
            checked={privacy_type === "workspace" || privacy_type === "default"}
            onChange={() => {}}
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.25977 11.0199V15.9899C4.25977 17.8099 4.25977 17.8099 5.97977 18.9699L10.7098 21.6999C11.4198 22.1099 12.5798 22.1099 13.2898 21.6999L18.0198 18.9699C19.7398 17.8099 19.7398 17.8099 19.7398 15.9899V11.0199C19.7398 9.19994 19.7398 9.19994 18.0198 8.03994L13.2898 5.30994C12.5798 4.89994 11.4198 4.89994 10.7098 5.30994L5.97977 8.03994C4.25977 9.19994 4.25977 9.19994 4.25977 11.0199Z"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.5 7.63V5C17.5 3 16.5 2 14.5 2H9.5C7.5 2 6.5 3 6.5 5V7.56"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.6298 10.99L13.1998 11.88C13.2898 12.02 13.4898 12.16 13.6398 12.2L14.6598 12.46C15.2898 12.62 15.4598 13.16 15.0498 13.66L14.3798 14.47C14.2798 14.6 14.1998 14.83 14.2098 14.99L14.2698 16.04C14.3098 16.69 13.8498 17.02 13.2498 16.78L12.2698 16.39C12.1198 16.33 11.8698 16.33 11.7198 16.39L10.7398 16.78C10.1398 17.02 9.67978 16.68 9.71978 16.04L9.77978 14.99C9.78978 14.83 9.70978 14.59 9.60978 14.47L8.93978 13.66C8.52978 13.16 8.69978 12.62 9.32978 12.46L10.3498 12.2C10.5098 12.16 10.7098 12.01 10.7898 11.88L11.3598 10.99C11.7198 10.45 12.2798 10.45 12.6298 10.99Z"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="ms-50">
            {useFormatMessage("modules.feed.create_post.text.workspace")}
          </span>
        </a>
      ),
      key: "1",
      onClick: () => setPrivacyType("workspace")
    },
    {
      label: (
        <a className="">
          <ErpRadio checked={privacy_type === "only_me"} onChange={() => {}} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="ms-50">
            {useFormatMessage("modules.feed.create_post.text.only_me")}
          </span>
        </a>
      ),
      key: "2",
      onClick: () => setPrivacyType("only_me")
    }
  ]
  const renderTextDropdown = (privacy) => {
    if (privacy === "workspace" || privacy === "default") {
      return (
        <>
          <span className="me-50">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.55078 9.18329V13.325C3.55078 14.8416 3.55078 14.8416 4.98411 15.8083L8.92578 18.0833C9.51745 18.425 10.4841 18.425 11.0758 18.0833L15.0174 15.8083C16.4508 14.8416 16.4508 14.8416 16.4508 13.325V9.18329C16.4508 7.66662 16.4508 7.66662 15.0174 6.69995L11.0758 4.42495C10.4841 4.08328 9.51745 4.08328 8.92578 4.42495L4.98411 6.69995C3.55078 7.66662 3.55078 7.66662 3.55078 9.18329Z"
                stroke="#4986FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5846 6.35829V4.16663C14.5846 2.49996 13.7513 1.66663 12.0846 1.66663H7.91797C6.2513 1.66663 5.41797 2.49996 5.41797 4.16663V6.29996"
                stroke="#4986FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5264 9.1583L11.0014 9.89997C11.0764 10.0166 11.2431 10.1333 11.3681 10.1666L12.2181 10.3833C12.7431 10.5166 12.8848 10.9666 12.5431 11.3833L11.9848 12.0583C11.9014 12.1666 11.8348 12.3583 11.8431 12.4916L11.8931 13.3666C11.9264 13.9083 11.5431 14.1833 11.0431 13.9833L10.2264 13.6583C10.1014 13.6083 9.89311 13.6083 9.76811 13.6583L8.95144 13.9833C8.45144 14.1833 8.06811 13.9 8.10144 13.3666L8.15144 12.4916C8.15978 12.3583 8.09311 12.1583 8.00978 12.0583L7.45144 11.3833C7.10978 10.9666 7.25144 10.5166 7.77644 10.3833L8.62644 10.1666C8.75978 10.1333 8.92644 10.0083 8.99311 9.89997L9.46811 9.1583C9.76811 8.7083 10.2348 8.7083 10.5264 9.1583Z"
                stroke="#4986FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-privacy">
            {useFormatMessage("modules.feed.create_post.text.workspace")}
          </span>
        </>
      )
    }

    if (privacy === "only_me") {
      return (
        <>
          <span className="me-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                stroke="#4986FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z"
                stroke="#4986FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                stroke="#4986FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {useFormatMessage("modules.feed.create_post.text.only_me")}
        </>
      )
    }

    return ""
  }

  const renderWithTag = () => {
    if (!_.isEmpty(tag_your_colleagues)) {
      const index_user = dataMention.findIndex(
        (item) => item.id === tag_your_colleagues[0]
      )
      let data_user = {}
      if (index_user !== -1) {
        data_user = dataMention[index_user]
      }
      if (tag_your_colleagues.length > 2) {
        return (
          <span className="cursor-pointer" onClick={() => toggleModalTag()}>
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.with")}
            </span>{" "}
            <span className="text-tag">{data_user?.full_name}</span>{" "}
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.and")}
            </span>{" "}
            <span className="text-tag">
              {tag_your_colleagues.length - 1}{" "}
              {useFormatMessage(`modules.feed.post.text.others`)}
            </span>
          </span>
        )
      } else {
        let data_user_and = {}
        if (tag_your_colleagues.length === 2) {
          const index_user = dataMention.findIndex(
            (item) => item.id === tag_your_colleagues[1]
          )
          if (index_user !== -1) {
            data_user_and = dataMention[index_user]
          }
        }
        return (
          <span className="cursor-pointer" onClick={() => toggleModalTag()}>
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.with")}
            </span>{" "}
            <span className="text-tag">{data_user?.full_name}</span>{" "}
            {tag_your_colleagues.length === 2 && (
              <>
                <span className="text-default">
                  {useFormatMessage("modules.feed.post.text.and")}
                </span>{" "}
                <span className="text-tag">{data_user_and?.full_name}</span>
              </>
            )}
          </span>
        )
      }
    }

    return ""
  }

  return (
    <Fragment>
      <div className="div-header-title">
        <span className="text-title">
          {is_poll
            ? useFormatMessage("modules.feed.create_post.text.create_poll")
            : useFormatMessage("modules.feed.create_post.title")}
        </span>
        <div className="div-btn-close" onClick={() => toggleModalCreatePost()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </div>
      <div className="div-header-avatar">
        <Avatar className="img" src={avatar} />
        <div className="modal-header-privacy">
          <span className="modal-header-privacy-name">
            {fullName} {renderWithTag()}
          </span>
          <div className="modal-header-privacy-choose">
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              icon={() => (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.5984 7.45837L11.1651 12.8917C10.5234 13.5334 9.47344 13.5334 8.83177 12.8917L3.39844 7.45837"
                    stroke="#4986FF"
                    strokeWidth="1.5"
                    stroke-miterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              overlayClassName="modal-header-privacy-choose-dropdown">
              <a className="modal-header-privacy-choose-dropdown-a">
                <Button.Ripple size="sm" color="flat-default" className="">
                  <div className="privacy-workspace d-flex align-items-baseline">
                    {renderTextDropdown(privacy_type)}
                    <span className="ms-50">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16.5984 7.45837L11.1651 12.8917C10.5234 13.5334 9.47344 13.5334 8.83177 12.8917L3.39844 7.45837"
                          stroke="#4986FF"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </Button.Ripple>
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default HeaderCreatePost
