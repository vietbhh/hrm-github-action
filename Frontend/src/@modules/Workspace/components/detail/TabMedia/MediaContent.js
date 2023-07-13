// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap"
// ** Components
import MediaTabContent from "./MediaTabContent"

const MediaContent = (props) => {
  const {
    // ** props
    id,
    mediaTabActive,
    // ** methods
    setMediaTabActive
  } = props

  // ** render
  return (
    <div className="pt-1 media-container">
      <Nav tabs className="mb-0">
        <NavItem>
          <NavLink
            active={mediaTabActive === 1}
            onClick={() => {
              setMediaTabActive(1)
            }}>
            {useFormatMessage("modules.workspace.display.tab_media.photos")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={mediaTabActive === 2}
            onClick={() => {
              setMediaTabActive(2)
            }}>
            {useFormatMessage("modules.workspace.display.tab_media.videos")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={mediaTabActive === 3}
            onClick={() => {
              setMediaTabActive(3)
            }}>
            {useFormatMessage("modules.workspace.display.tab_media.files")}
          </NavLink>
        </NavItem>
        {/*
        <NavItem>
          <NavLink
            active={mediaTabActive === 4}
            onClick={() => {
              setMediaTabActive(4)
            }}>
            {useFormatMessage("modules.workspace.display.tab_media.links")}
          </NavLink>
        </NavItem>
        */}
      </Nav>
      <div className="mt-1">
        <TabContent className="py-50" activeTab={mediaTabActive}>
          <TabPane tabId={1}>
            <MediaTabContent
              id={id}
              mediaTabActive={mediaTabActive}
              tabId={1}
              pageLength={12}
            />
          </TabPane>
          <TabPane tabId={2}>
            <MediaTabContent
              id={id}
              mediaTabActive={mediaTabActive}
              tabId={2}
              pageLength={24}
            />
          </TabPane>
          <TabPane tabId={3}>
            <Row>
              <MediaTabContent
                id={id}
                mediaTabActive={mediaTabActive}
                tabId={3}
                pageLength={24}
              />
            </Row>
          </TabPane>
          <TabPane tabId={4}>
            <MediaTabContent
              id={id}
              mediaTabActive={mediaTabActive}
              tabId={4}
              pageLength={12}
            />
          </TabPane>
        </TabContent>
      </div>
    </div>
  )
}

export default MediaContent
