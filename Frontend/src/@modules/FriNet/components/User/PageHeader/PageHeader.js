// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { userApi } from "@modules/FriNet/common/api"
import { useNavigate } from "react-router-dom"
// ** Styles
import { Button, Card } from "reactstrap"
import { Space, Dropdown } from "antd"
// ** Components
import noAvatar from "@src/assets/images/erp/noavt.png"
import CoverImage from "@modules/Workspace/components/detail/CoverImage"
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"
import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"

const PageHeader = (props) => {
  const {
    // ** props
    employeeData,
    isSettingPage = false,
    userAuth
    // ** methods
  } = props

  const navigate = useNavigate()

  const handleChangeAvatar = (img) => {
    userApi.saveAvatar({
      avatar: img
    })
  }

  const handleClickMessenge = () => {
    const toPage = parseInt(employeeData.id) === parseInt(userAuth.id) ? "/chat" : `/chat/${employeeData.username}`
    navigate(toPage)
  }

  const toggleProfileSetting = () => {
    const toPage = isSettingPage ? `/u/${employeeData.username}` : `/u/${employeeData.username}/setting`
    navigate(toPage)
  }

  let items = [
    {
      label: (
        <div className="d-flex justify-content-center align-items-center">
          <div className="w-85">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="22px"
              height="22px"
              viewBox="0 0 22 22"
              enableBackground="new 0 0 22 22"
              xmlSpace="preserve"
              className="me-1">
              {" "}
              <image
                id="image0"
                width="22"
                height="22"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAjVBMVEUAAAAwQEwyQk4xQ08x Q08yQk8xQ08yQ08zQ04zQU4yQk4xQk8wRFAyQ08zQ0wwQFAyQlAwQk4yQ04wQFAwRFAwSFAyQk4z Q1AxQU4xQ04xQ04xQU4zRE8yQ08yQ08wQk4yQk8yRFAyQlA1RVAwQ0wxQ08wQk00QEw0RFAwQlAw QEwyQ08yQk4yQ0////9vHMwJAAAALXRSTlMAQJDP35+/77CgwN9/31AQYH+QIEAggFCgoLCwz+Cf j9+AcDBQ72BAQGBQr9ACb46tAAAAAWJLR0QuVNMQhwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0 SU1FB+cHGA0DEaldwpgAAADsSURBVBjTfZHhVoMwDIVDu7aOWLOJoMx10ykTdXn/1zNpNybHc8yP e8KX5JIAwL9RGbtYWFfNoedws1zWgfFX4ZbjHeVsFXl9pYamlvsLr9iINp7ZN5kXH4xKMRgTUaYo eqUPvBI13AK0oZP0Mbc/BS36WtWqUjCXFPpcxI3q81YkuWK1a2if/aB/mTC8skQHE7absmd7OLyV zKuJCXoLVZ1zXdk47LLrO9B6YE6JGeXEI3/kGWws16POjD1byudpO5YNND7lYYTzEtvpU5E9r5M5 Hgv8wisVn8iDd+57kHfM/s/Yn1I6mTn8Ez9MBRHYFCYWwgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAy My0wNy0yNFQxMTowMzoxNyswMjowMHd96dIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDctMjRU MTE6MDM6MTcrMDI6MDAGIFFuAAAAAElFTkSuQmCC"
              />
            </svg>
            <span>
              {isSettingPage
                ? useFormatMessage("modules.employees.text.profile")
                : useFormatMessage("modules.employees.text.profile_setting")}
            </span>
          </div>
        </div>
      ),
      key: "1",
      onClick: () => toggleProfileSetting()
    }
  ]

  if (parseInt(employeeData.id) !== parseInt(userAuth.id) && !employeeData.is_admin_group) {
    items = []
  }

  // ** render
  const renderAvatar = () => {
    if (employeeData.is_profile) {
      return (
        <AvatarBox
          currentAvatar={
            _.isEmpty(employeeData.avatar) ? noAvatar : employeeData.avatar
          }
          readOnly={true}
          handleSave={(img) => handleChangeAvatar(img)}
        />
      )
    }

    return <Avatar src={employeeData.avatar} className="employeeAvatar" />
  }

  return (
    <Card className="mb-25  page-header">
      <div className="cover-image-container">
        <CoverImage
          src={employeeData.cover_image}
          dataSave={{ employeeData }}
          isEditable={employeeData.is_profile}
          saveCoverImageApi={userApi.saveCoverImage}
        />
        <div className="avatar-container">
          <Fragment>{renderAvatar(0)}</Fragment>
        </div>
      </div>
      <div className="pt-1 pb-3 d-flex align-items-center justify-content-between user-info-container">
        <div className="user-info-content">
          <h3 className="mb-75 username">
            <span className="me-50">{employeeData.full_name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              enableBackground="new 0 0 20 20"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAXVBMVEUAAAA4h+85i/E4i/E4 ifE4i/I5ivE5ie85jO85i/E5ivE5i/E5i/I4jfE6ifE5ifE5i/M4i+85jPI5ivI4h/M6jPE4ivI6 i/M2ifI5jPI5ivI4i/M6i/E5i/L///8VpZIgAAAAHXRSTlMAQI9/gL/PUFDPkKC/f4Cgj0Cvr0CQ n89QUMBAgPzdhd4AAAABYktHRB5yCiArAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wcN CwQFn4xbPQAAAH1JREFUGNOV0NkKhDAMBdCo12Xct3Hr5P9/cxpLpCIUzENJDyFtQhSMKHpazJzc i4CUbWRArlawF9oEPiKEH4WyYq6dNWotdfbsxQa5j5NYcz11Yk+VGs9S+pUsudq0rmkt+RI7W1// c/Bx0+F3YBU4AHPb1M8O9FyoMRSMP25OE1fK6seAAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA3 LTEzVDA5OjA0OjA1KzAyOjAwp/ty9gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNy0xM1QwOTow NDowNSswMjowMNamykoAAAAASUVORK5CYII="
              />
            </svg>
          </h3>
          <div className="d-flex align-items-center">
            <p className="mb-0 me-25 job-title">
              {employeeData.job_title_id?.label}
            </p>
            <p className="mt-0 mb-0 employment-type">
              {" "}
              • {employeeData.employee_type?.label}
            </p>
          </div>
        </div>
        <div className="button-action">
          <Space>
            <Button.Ripple
              className=" d-flex align-items-center custom-button custom-primary"
              onClick={() => handleClickMessenge()}>
              <i className="fab fa-facebook-messenger me-50" />
              {useFormatMessage("modules.workspace.buttons.messenge")}
            </Button.Ripple>
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={["click"]}
              overlayClassName="workspace-dropdown-common">
              <Button className="btn-sm custom-button custom-secondary">
                <i className="fas fa-ellipsis"></i>
              </Button>
            </Dropdown>
          </Space>
        </div>
      </div>
    </Card>
  )
}

export default PageHeader
