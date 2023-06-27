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
    toggleModalCreatePost
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
            checked={privacy_type === "workspace"}
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
    if (privacy === "workspace") {
      return (
        <>
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
          {useFormatMessage("modules.feed.create_post.title")}
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
