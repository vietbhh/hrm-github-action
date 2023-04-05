// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { userApi } from "@modules/FriNet/common/api"
import { getTabId } from "@modules/FriNet/common/common"
// ** Styles
import { Card, CardBody, Nav, NavItem, NavLink } from "reactstrap"
// ** Components
import noAvatar from "@src/assets/images/erp/noavt.png"
import CoverImage from "@modules/Workspace/components/detail/CoverImage"
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"
import Avatar from "@apps/modules/download/pages/Avatar"

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
    setTabActive(getTabId(tabId))
    window.history.replaceState(null, "", `/u/${identity}/${tabId}`)
  }

  const handleChangeAvatar = (img) => {
    userApi.saveAvatar({
      avatar: img
    })
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
    <Card>
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
      <div className="mt-2 pt-2 d-flex justify-content-center user-info-container">
        <h3>{employeeData.full_name}</h3>
      </div>
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
        </Nav>
      </CardBody>
    </Card>
  )
}

export default PageHeader
