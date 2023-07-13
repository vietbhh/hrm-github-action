// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { userApi } from "@modules/FriNet/common/api"
// ** Styles
import { Button, Card, CardBody, Nav, NavItem, NavLink } from "reactstrap"
// ** Components
import noAvatar from "@src/assets/images/erp/noavt.png"
import CoverImage from "@modules/Workspace/components/detail/CoverImage"
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"
import Avatar from "@apps/modules/download/pages/Avatar"
import { Space } from "antd"

const PageHeader = (props) => {
  const {
    // ** props
    identity,
    employeeData,
    tabActive,
    // ** methods
    setTabActive
  } = props

  const handleChangeTab = (tabId) => {
    setTabActive(tabId)
  }

  const handleChangeAvatar = (img) => {
    userApi.saveAvatar({
      avatar: img
    })
  }

  const handleClickMessenge = () => {}

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

  const renderNav = () => {
    return (
      <CardBody className="pb-0">
        <hr
          style={{
            margin: "0.5rem 0"
          }}
        />
        <Nav tabs className="mb-0">
          <NavItem>
            <NavLink
              active={tabActive === 1}
              onClick={() => handleChangeTab("timeline")}>
              {useFormatMessage("modules.employees.tabs.timeline.title")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 2}
              onClick={() => handleChangeTab("introduction")}>
              {useFormatMessage("modules.employees.tabs.introduction.title")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 3}
              onClick={() => handleChangeTab("workspace")}>
              {useFormatMessage("modules.employees.tabs.workspace.title")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 4}
              onClick={() => handleChangeTab("photo")}>
              {useFormatMessage("modules.employees.tabs.photo.title")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={tabActive === 5}
              onClick={() => handleChangeTab("achievement")}>
              {useFormatMessage("modules.employees.tabs.endorsement.title")}
            </NavLink>
          </NavItem>
        </Nav>
      </CardBody>
    )
  }

  return (
    <Card className="mb-25 page-header">
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
              className="me-50">
              {" "}
              <image
                id="image0"
                width="22"
                height="22"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAzFBMVEUAAADvcFj0b130b171 b131b171bl32b13zbl73cGD0bl71b172eGj3k4b2gXL3kYP2gHH////5qp/+7ev//v72gnP+9vX7 ycP7wLn929f7wbn6tKv2hXf5rKL5tq35pJn95+T6vrX3lYn5sKb6t6783dn+8fD7xb/+9/f+7+75 rqT7ycL1cF/8z8n++fn4rKH+9/X93tn83Nj//f393Nj7wLj4mIz2inz829b4nJD5rqX2g3T+5uP4 koX4k4b2emr3i333jH/3inz4j4JA5yjnAAAAC3RSTlMAIL/vr++wv7AgwNvx2aQAAAABYktHRBHi tT26AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wcNCjcYCSM44wAAALJJREFUGNOV0McW gkAMheGgouIdRmPB3ntvqNiwvf87qSsFxoX/Kuc7ySZEWigMbxGNSPPjK12jKBSFSKXQ1YxfLEwJ IV+TSKa+2OQ0MlmBnMV5HxeKQInLFR9Xa6g3uNlCqt2RH+720B/wcCQtZja/GWOeYDqbpxfLAK/W tm1PA7yxtjtnj4MjPCwzzNYRJz6TcC+43oC7+z52HwKQd/z5E13NMZXGyVCs6waREfdjwqAnK9oe MIk0LSwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDctMTNUMDg6NTU6MjQrMDI6MDAAqmDGAAAA JXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA3LTEzVDA4OjU1OjI0KzAyOjAwcffYegAAAABJRU5ErkJg gg=="
              />
            </svg>
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
              className=" d-flex align-items-center custom-button custom-primary mb-25"
              onClick={() => handleClickMessenge()}>
              <i className="fab fa-facebook-messenger me-50" />
              {useFormatMessage("modules.workspace.buttons.messenge")}
            </Button.Ripple>
            <Button className="btn-sm custom-button custom-secondary">
              <i className="fas fa-ellipsis"></i>
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  )
}

export default PageHeader
