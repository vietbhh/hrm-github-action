// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import LinkPreview from "@apps/components/link-preview/LinkPreview"

const MediaLinkItem = (props) => {
  const {
    // ** props
    mediaItem
    // ** methods
  } = props

  const link = mediaItem.info.link

  // ** render
  const renderComponent = () => {
    if (mediaItem === undefined) {
      return ""
    }

    if (Array.isArray(link)) {
      return (
        <Fragment>
          {link.map((item, index) => {
            return (
              <LinkPreview
                key={`link-item-${mediaItem.info._id}-${index}`}
                componentClassName="media-link-item"
                url={item}
                cardSize="medium"
                showGraphic={true}
                defaultImage=""
                maxLine={2}
                minLine={2}
              />
            )
          })}
        </Fragment>
      )
    }

    return (
      <LinkPreview
        componentClassName="mb-1 media-link-item"
        url={link}
        cardSize="medium"
        showGraphic={true}
        defaultImage=""
        maxLine={2}
        minLine={2}
      />
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MediaLinkItem
