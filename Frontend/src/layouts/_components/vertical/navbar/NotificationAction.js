// ** React Imports
import { Fragment } from "react"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { axiosNodeApi } from "@apps/utility/api"
import { useNavigate } from "react-router-dom"
import {
  checkHTMLTag,
  handleFormatMessageStr,
  handleFormatUrl
} from "layouts/_components/vertical/common/common"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { handleNotification, toggleOpenDropdown } from "@store/notification"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components

const NotificationAction = (props) => {
  const {
    // ** props
    notificationInfo,
    // ** methods
    toggleOpen
  } = props

  const action =
    notificationInfo &&
    notificationInfo.actions !== null &&
    notificationInfo.actions !== "" &&
    notificationInfo.actions !== undefined
      ? JSON.parse(notificationInfo.actions)
      : []

  const navigate = useNavigate()

  const notificationState = useSelector((state) => state.notification)
  const { listNotification } = notificationState

  const dispatch = useDispatch()

  const _handleSetNewNotificationState = (res, index) => {
    if (res?.data?.notification_info === undefined) {
      return false
    }

    const newListNotification = [...listNotification].map((item) => {
      if (parseInt(item.id) === parseInt(notificationInfo.id)) {
        const newAction = [...JSON.parse(item.actions)].map(
          (itemAction, indexAction) => {
            if (parseInt(indexAction) === parseInt(index)) {
              return {
                ...itemAction,
                ...res.data.notification_info
              }
            }

            return itemAction
          }
        )
          
        return {
          ...item,
          actions: JSON.stringify(newAction)
        }
      }

      return item
    })

    dispatch(
      handleNotification({
        listNotification: newListNotification,
        numberNotification: undefined
      })
    )
  }

  const handleClickApiButton = (e, itemContent, index) => {
    e.stopPropagation()
    const api = itemContent.api_type === "node" ? axiosNodeApi : defaultModuleApi
    const apiUrl = handleFormatUrl(itemContent.api_url, notificationInfo.id)
    if (itemContent.api_methods === "post") {
      const postData = {
        ...itemContent.api_post_data,
        notification_index: index,
        notification_id: notificationInfo.id,
        notification_status: itemContent.key
      }

      api
        .post(
          apiUrl,
          postData,
          itemContent.api_option
        )
        .then((res) => {
          _handleSetNewNotificationState(res, index)                                    
        })
        .catch((err) => {})
    } else if (itemContent.api_methods === "get") {
      api
        .get(
          apiUrl,
          itemContent.api_option
        )
        .then((res) => {
          _handleSetNewNotificationState(res, index)
        })
        .catch((err) => {})
    }
  }

  const handleClickLinkButton = (e, itemContent) => {
    e.preventDefault()
    toggleOpen()
    navigate(itemContent.url)
  }

  // ** render

  const renderContent = (item, index) => {
    const status = item.status
    const message = item.message
    const contents = item.contents

    if (status.trim().length > 0 && status !== "link_button") {
      const newStr = handleFormatMessageStr(message)
      return checkHTMLTag(newStr) ? (
        <p
          dangerouslySetInnerHTML={{ __html: newStr }}
          className="notification-message"></p>
      ) : (
        <p className="notification-message">{newStr}</p>
      )
    }

    return (
      <div className="mt-75 notification-buttons-actions">
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
                  onClick={(e) => handleClickLinkButton(e, itemContent)}>
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
    if (!_.isArray(action)) {
      return ""
    }

    if (action.length === 0) {
      return ""
    }

    return (
      <div className="d-flex align-items-center notification-actions">
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