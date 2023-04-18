// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
// ** Styles
import { Dropdown } from "antd"
import { Button } from "reactstrap"
// ** Components
import SwAlert from "@apps/utility/SwAlert"

const ActionTable = (props) => {
  const {
    // ** props
    data,
    rowData,
    // ** methods
    toggleModalPreview,
    setDataPreview,
    setData
  } = props

  const handleClickDeletePost = () => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.feed.manage_post.text.warning_delete_post.title"
      ),
      text: useFormatMessage(
        "modules.feed.manage_post.text.warning_delete_post.description"
      )
    }).then((resConfirm) => {
      if (resConfirm.isConfirmed === true) {
        const params = {
          ref: null,
          _id: rowData._id
        }

        feedApi
          .postDeletePost(params)
          .then((res) => {
            const newData = [...data].filter((item) => {
              return item._id !== rowData._id
            })

            setData(newData)
          })
          .catch((err) => {})
      }
    })
  }

  const handleClickPreviewPost = () => {
    setDataPreview(rowData)
    toggleModalPreview()
  }

  const items = [
    {
      key: "1",
      label: (
        <p className="mb-0 p-50" onClick={() => handleClickDeletePost()}>
          <i className="fa-regular fa-trash-can me-50" />
          {useFormatMessage("modules.feed.manage_post.buttons.delete_post")}
        </p>
      )
    },
    {
      key: "2",
      label: (
        <p className="mb-0 p-50" onClick={() => handleClickPreviewPost()}>
          <i className="far fa-eye me-50" />
          {useFormatMessage("modules.feed.manage_post.buttons.preview_post")}
        </p>
      )
    }
  ]

  // ** render
  return (
    <Dropdown
      menu={{
        items
      }}
      trigger="click"
      placement="bottom"
      overlayClassName="action-feed-dropdown">
      <Button.Ripple color="flat-secondary" className="btn-icon" size="sm">
        <i className="fa-solid fa-ellipsis" />
      </Button.Ripple>
    </Dropdown>
  )
}

export default ActionTable
