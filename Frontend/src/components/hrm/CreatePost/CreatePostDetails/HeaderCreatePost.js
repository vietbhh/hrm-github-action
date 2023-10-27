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
        <a
          className=""
          onClick={(e) => {
            e.preventDefault()
            setPrivacyType("workspace")
          }}>
          <ErpRadio
            checked={privacy_type === "workspace" || privacy_type === "default"}
            onChange={() => {}}
          />
          <svg
            style={{ marginRight: "0.4rem", marginLeft: "-0.1rem" }}
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M13.3575 4.1175V4.6725L10.7025 3.135C9.69746 2.5575 8.29496 2.5575 7.29746 3.135L4.64246 4.68V4.1175C4.64246 2.43 5.56496 1.5 7.25246 1.5H10.7475C12.435 1.5 13.3575 2.43 13.3575 4.1175Z"
              fill="#139FF8"
            />
            <path
              d="M13.38 5.97749L13.275 5.92499L12.255 5.33999L10.14 4.11749C9.495 3.74249 8.505 3.74249 7.86 4.11749L5.745 5.33249L4.725 5.93249L4.59 5.99999C3.2775 6.88499 3.1875 7.04999 3.1875 8.46749V11.8575C3.1875 13.275 3.2775 13.44 4.62 14.3475L7.86 16.215C8.1825 16.41 8.5875 16.4925 9 16.4925C9.405 16.4925 9.8175 16.4025 10.14 16.215L13.41 14.325C14.73 13.44 14.8125 13.2825 14.8125 11.8575V8.46749C14.8125 7.04999 14.7225 6.88499 13.38 5.97749ZM11.0925 10.125L10.635 10.6875C10.56 10.77 10.5075 10.9275 10.515 11.04L10.56 11.76C10.59 12.2025 10.275 12.4275 9.8625 12.27L9.195 12C9.09 11.9625 8.9175 11.9625 8.8125 12L8.145 12.2625C7.7325 12.4275 7.4175 12.195 7.4475 11.7525L7.4925 11.0325C7.5 10.92 7.4475 10.7625 7.3725 10.68L6.9075 10.125C6.6225 9.78749 6.75 9.41249 7.1775 9.29999L7.875 9.11999C7.9875 9.08999 8.115 8.98499 8.175 8.89499L8.565 8.29499C8.805 7.91999 9.1875 7.91999 9.435 8.29499L9.825 8.89499C9.885 8.99249 10.02 9.08999 10.125 9.11999L10.8225 9.29999C11.25 9.41249 11.3775 9.78749 11.0925 10.125Z"
              fill="#139FF8"
            />
          </svg>
          <span>
            {useFormatMessage("modules.feed.create_post.text.workspace")}
          </span>
        </a>
      ),
      key: "1"
    },
    {
      label: (
        <a
          className=""
          onClick={(e) => {
            e.preventDefault()
            setPrivacyType("only_me")
          }}>
          <ErpRadio checked={privacy_type === "only_me"} onChange={() => {}} />
          <i className="fa-solid fa-lock-keyhole me-50"></i>
          <span>
            {useFormatMessage("modules.feed.create_post.text.only_me")}
          </span>
        </a>
      ),
      key: "2"
    }
  ]
  const renderTextDropdown = (privacy) => {
    if (privacy === "workspace" || privacy === "default") {
      return (
        <>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.55078 9.18329V13.325C3.55078 14.8416 3.55078 14.8416 4.98411 15.8083L8.92578 18.0833C9.51745 18.425 10.4841 18.425 11.0758 18.0833L15.0174 15.8083C16.4508 14.8416 16.4508 14.8416 16.4508 13.325V9.18329C16.4508 7.66662 16.4508 7.66662 15.0174 6.69995L11.0758 4.42495C10.4841 4.08328 9.51745 4.08328 8.92578 4.42495L4.98411 6.69995C3.55078 7.66662 3.55078 7.66662 3.55078 9.18329Z"
              stroke="#4986FF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.5846 6.35829V4.16663C14.5846 2.49996 13.7513 1.66663 12.0846 1.66663H7.91797C6.2513 1.66663 5.41797 2.49996 5.41797 4.16663V6.29996"
              stroke="#4986FF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.5264 9.1583L11.0014 9.89997C11.0764 10.0166 11.2431 10.1333 11.3681 10.1666L12.2181 10.3833C12.7431 10.5166 12.8848 10.9666 12.5431 11.3833L11.9848 12.0583C11.9014 12.1666 11.8348 12.3583 11.8431 12.4916L11.8931 13.3666C11.9264 13.9083 11.5431 14.1833 11.0431 13.9833L10.2264 13.6583C10.1014 13.6083 9.89311 13.6083 9.76811 13.6583L8.95144 13.9833C8.45144 14.1833 8.06811 13.9 8.10144 13.3666L8.15144 12.4916C8.15978 12.3583 8.09311 12.1583 8.00978 12.0583L7.45144 11.3833C7.10978 10.9666 7.25144 10.5166 7.77644 10.3833L8.62644 10.1666C8.75978 10.1333 8.92644 10.0083 8.99311 9.89997L9.46811 9.1583C9.76811 8.7083 10.2348 8.7083 10.5264 9.1583Z"
              stroke="#4986FF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          {useFormatMessage("modules.feed.create_post.text.workspace")}
        </>
      )
    }

    if (privacy === "only_me") {
      return (
        <>
          <i className="fa-solid fa-lock-keyhole me-50"></i>
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
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )}
              overlayClassName="modal-header-privacy-choose-dropdown">
              <a
                onClick={(e) => e.preventDefault()}
                className="modal-header-privacy-choose-dropdown-a">
                <Button.Ripple size="sm" color="flat-default" className="">
                  {renderTextDropdown(privacy_type)}
                  <i className="fa-sharp fa-solid fa-caret-down ms-50"></i>
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
