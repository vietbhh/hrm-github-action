// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import LinkPreview from "@apps/components/link-preview/LinkPreview"

const MediaLinkItem = (props) => {
  const {
    // ** props
    mediaData
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    return (
      <Fragment>
        {mediaData.map((item) => {
          const link = item.link
          if (Array.isArray(link)) {
            return (
              <Fragment>
                {link.map((item, index) => {
                  return (
                    <LinkPreview
                      key={`link-item-${item._id}-${index}`}
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
          } else {
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
        })}
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MediaLinkItem
