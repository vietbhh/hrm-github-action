// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import {
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  TabContent,
  TabPane
} from "reactstrap"
// ** Components
import MediaTabContent from "./MediaTabContent"

const MediaContent = (props) => {
  const {
    // ** props
    id,
    mediaTabActive,
    modalPreview,
    // ** methods
    setMediaTabActive,
    setMediaInfo,
    handleModalPreview
  } = props

  // ** render

  return (
    <div className="p-1 ps-2">
      <Nav tabs className="mb-0">
        <NavItem>
          <NavLink
            active={mediaTabActive === 1}
            onClick={() => {
              setMediaTabActive(1)
            }}>
            {useFormatMessage("modules.workspace.display.tab_media.files")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={mediaTabActive === 2}
            onClick={() => {
              setMediaTabActive(2)
            }}>
            {useFormatMessage("modules.workspace.display.tab_media.photos")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={mediaTabActive === 3}
            onClick={() => {
              setMediaTabActive(3)
            }}>
            {useFormatMessage("modules.workspace.display.tab_media.videos")}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={mediaTabActive === 4}
            onClick={() => {
              setMediaTabActive(4)
            }}>
            {useFormatMessage("modules.workspace.display.tab_media.links")}
          </NavLink>
        </NavItem>
      </Nav>
      <div className="mt-1">
        <TabContent className="py-50" activeTab={mediaTabActive}>
          <TabPane tabId={1}>
            <MediaTabContent
              id={id}
              mediaTabActive={mediaTabActive}
              tabId={1}
              modalPreview={modalPreview}
              pageLength={7}
              handleModalPreview={handleModalPreview}
              setMediaInfo={setMediaInfo}
            />
          </TabPane>
          <TabPane tabId={2}>
            <MediaTabContent
              id={id}
              mediaTabActive={mediaTabActive}
              tabId={2}
              modalPreview={modalPreview}
              pageLength={18}
              handleModalPreview={handleModalPreview}
              setMediaInfo={setMediaInfo}
            />
          </TabPane>
          <TabPane tabId={3}>
            <Row>
              <MediaTabContent
                id={id}
                mediaTabActive={mediaTabActive}
                tabId={3}
                modalPreview={modalPreview}
                pageLength={18}
                handleModalPreview={handleModalPreview}
                setMediaInfo={setMediaInfo}
              />
            </Row>
          </TabPane>
          <TabPane tabId={4}>
            <Row>
              <MediaTabContent
                id={id}
                mediaTabActive={mediaTabActive}
                tabId={4}
                modalPreview={modalPreview}
                pageLength={7}
                handleModalPreview={handleModalPreview}
                setMediaInfo={setMediaInfo}
              />
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </div>
  )
}

export default MediaContent
