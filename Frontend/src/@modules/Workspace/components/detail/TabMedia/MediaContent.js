// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Nav, NavItem, NavLink, Row, Col } from "reactstrap"
// ** Components
import MediaItem from "./MediaItem"

const MediaContent = (props) => {
  const {
    // ** props
    mediaTabActive,
    data,
    // ** methods
    setMediaTabActive
  } = props

  // ** render
  const renderContent = () => {
    if (Object.keys(data).length === 0) {
      return "asdf"
    }

    return (
      <Fragment>
        {_.map(data, (item, index) => {
          return (
            <MediaItem
              mediaItem={item}
              mediaTabActive={mediaTabActive}
              key={`media-item-${item._id}`}
            />
          )
        })}
      </Fragment>
    )
  }

  return (
    <div className="p-1 ps-2">
      <Nav tabs className="mb-4">
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
        <Row>
          <Fragment>{renderContent()}</Fragment>
        </Row>
      </div>
    </div>
  )
}

export default MediaContent
