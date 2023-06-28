// ** React Imports
import { Fragment } from "react"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { useNavigate } from "react-router-dom"
import {
  checkHTMLTag,
  handleFormatMessageStr,
  handleFormatUrl
} from "layouts/_components/vertical/common/common"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components

const NotificationAction = (props) => {
  const {
    // ** props
    notificationInfo
    // ** methods
  } = props

  const action =
    notificationInfo.actions === null
      ? []
      : JSON.parse(notificationInfo.actions)

  const navigate = useNavigate()

  const handleClickApiButton = (e, itemContent, index) => {
    e.preventDefault()
    if (itemContent.api_methods === "post") {
      const postData = {
        ...itemContent.api_post_data,
        index: index,
        status: itemContent.key
      }
      defaultModuleApi
        .post(
          handleFormatUrl(itemContent.api_url, notificationInfo.id),
          postData,
          itemContent.api_option
        )
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {})
    } else if (itemContent.api_methods === "get") {
      defaultModuleApi
        .get(
          handleFormatUrl(itemContent.api_url, notificationInfo.id),
          itemContent.api_option
        )
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {})
    }
  }

  const handleClickLinkButton = (itemContent) => {
    navigate(itemContent.url)
  }

  // ** render
  const renderContent = (item, index) => {
    const status = item.status
    const contents = item.contents

    return (
      <div className="notification-buttons-actions">
        <Space>
          {_.map(contents, (itemContent, indexContent) => {
            if (itemContent.type === "api_button") {
              return (
                <Button
                  className={`color-${itemContent.color}`}
                  size="sm"
                  key={`notification-buttons-${indexContent}`}
                  onClick={(e) => handleClickApiButton(e, itemContent, index)}>
                  {itemContent.text}
                </Button>
              )
            } else if (itemContent.type === "link_button") {
              return (
                <Button
                  className={`color-${itemContent.color}`}
                  size="sm"
                  key={`notification-buttons-${indexContent}`}
                  onClick={(e) => handleClickLinkButton(itemContent)}>
                  {itemContent.text}
                </Button>
              )
            }
          })}
        </Space>
      </div>
    )
  }

  const renderComponent = () => {
    return (
      <div className="d-flex align-items-center mt-75 notification-actions">
        {action.map((item, index) => {
          return (
            <Fragment key={`api-button-action-${index}`}>
              {renderContent(item, index)}
            </Fragment>
          )
        })}
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default NotificationAction
