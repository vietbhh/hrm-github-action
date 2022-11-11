import AvatarBox from "@apps/components/common/AvatarBox"
import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { Fragment } from "react"
import ContentLoader from "react-content-loader"
import { NavLink as RRNavLink } from "react-router-dom"
import { Card, CardBody, Nav, NavItem, NavLink, Row } from "reactstrap"
import TabUserGeneral from "./detail/TabUserGeneral"
const UserLayout = (props) => {
  const { loading, tab, url, userData, page, api, reload } = props
  const onlyView = props.onlyView || false
  const navs = [
    {
      id: "general",
      title: "general",
      icon: "iconly-Star icli",
      navLink: `/${url}`
    }
  ]
  const renderNav = () => {
    return navs.map((menu) => {
      const icon = menu.icon
      return (
        <NavItem key={menu.id}>
          <NavLink to={menu.navLink} tag={RRNavLink}>
            <i className={`${icon}`}></i>
            <span className="d-md-inline-block d-none align-middle ms-1">
              {useFormatMessage(`modules.users.tabs.${menu.title}.title`)}
            </span>
          </NavLink>
        </NavItem>
      )
    })
  }
  return (
    <Fragment>
      <Card className="extraWidthLayoutPage employeePage">
        <CardBody className="p-md-0">
          <Row className="contentWrapper">
            <div className="col-md-3 sideBarColumn employeeSidebar">
              {loading && (
                <ContentLoader viewBox="0 0 208 208" height={208} width={208}>
                  <circle cx="100" cy="100" r="100" width="208" height="208" />
                </ContentLoader>
              )}
              {!loading && (
                <AvatarBox
                  currentAvatar={userData.avatar}
                  readOnly={onlyView}
                  handleSave={(img) => {
                    api.avatar(img).catch((err) => {
                      console.log(err)
                      notification.showError({
                        text: useFormatMessage("notification.save.error")
                      })
                    })
                  }}
                />
              )}
              <h1 className="employeeName">{userData?.full_name}</h1>
              <small>@{userData?.username}</small>
              <div className="nav nav-vertical employeeNav">
                <Nav className="module-menu nav-left w-100" tabs>
                  {renderNav()}
                </Nav>
              </div>
            </div>
            <div className="col-md-9 mainContent">
              {(tab === undefined || tab === "general") && (
                <TabUserGeneral
                  {...props}
                  userData={userData}
                  loading={loading}
                  onlyView={onlyView}
                />
              )}
            </div>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UserLayout
