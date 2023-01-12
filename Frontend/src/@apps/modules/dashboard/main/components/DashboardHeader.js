import { useFormatMessage } from "@apps/utility/common"
import { Dropdown } from "antd"
import { Link } from "react-router-dom"
import { CardHeader } from "reactstrap"

const DashboardHeader = (props) => {
  const {
    id,
    handleWidget,
    isRemoveWidget,
    title,
    classIconBg,
    icon,
    menuRight = [],
    customRight,
    titleLink,
    noIcon
  } = props

  const menuRemove = isRemoveWidget
    ? [
        {
          key: "1",
          label: (
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                handleWidget(id)
              }}>
              <i className="fa-regular fa-times"></i>
              {useFormatMessage("modules.dashboard.remove_widget")}
            </a>
          )
        }
      ]
    : []
  const items = [...menuRemove, ...menuRight]

  const TitleTag = titleLink ? Link : "h1"

  return (
    <CardHeader>
      <div className="d-flex flex-wrap align-items-center w-100">
        <TitleTag {...(titleLink && { to: titleLink })} className="card-title">
          {noIcon !== true && (
            <span
              className={`dashboard-title-icon ${
                classIconBg ? classIconBg : "news-bg-icon"
              }`}>
              {icon ? (
                icon
              ) : (
                <svg
                  className="icon news-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none">
                  <path
                    d="M14.25 6C15.4926 6 16.5 4.99264 16.5 3.75C16.5 2.50736 15.4926 1.5 14.25 1.5C13.0074 1.5 12 2.50736 12 3.75C12 4.99264 13.0074 6 14.25 6Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.25 9.75H9"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.25 12.75H12"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.5 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V7.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          )}

          <span className="title">{title ? title : "undefined"}</span>
        </TitleTag>

        <div className="ms-auto">
          {customRight}
          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            trigger={["click"]}
            className="cursor-pointer"
            overlayClassName="dashboard-dropdown-menu">
            {noIcon === true ? (
              <svg
                className="btn-icon-right"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="4"
                viewBox="0 0 18 4"
                fill="none">
                <path
                  d="M9 3C9.5523 3 10 2.5523 10 2C10 1.4477 9.5523 1 9 1C8.4477 1 8 1.4477 8 2C8 2.5523 8.4477 3 9 3Z"
                  stroke="#B0B7C3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3C16.5523 3 17 2.5523 17 2C17 1.4477 16.5523 1 16 1C15.4477 1 15 1.4477 15 2C15 2.5523 15.4477 3 16 3Z"
                  stroke="#B0B7C3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 3C2.55228 3 3 2.5523 3 2C3 1.4477 2.55228 1 2 1C1.44772 1 1 1.4477 1 2C1 2.5523 1.44772 3 2 3Z"
                  stroke="#B0B7C3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className="btn-icon-right"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none">
                <path
                  opacity="0.7"
                  d="M6.67166 12.5764H1.00031M9.32913 3.38606H14.9997M10.2302 12.5772C10.2302 14.3662 10.8269 14.9621 12.6151 14.9621C14.4034 14.9621 15 14.3662 15 12.5772C15 10.7881 14.4034 10.1923 12.6151 10.1923C10.8269 10.1923 10.2302 10.7881 10.2302 12.5772ZM5.77055 3.38488C5.77055 1.59661 5.17393 1 3.38566 1C1.59661 1 1 1.59661 1 3.38488C1 5.17393 1.59661 5.76976 3.38566 5.76976C5.17393 5.76976 5.77055 5.17393 5.77055 3.38488Z"
                  stroke="#00003B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Dropdown>
        </div>
      </div>
    </CardHeader>
  )
}

export default DashboardHeader
