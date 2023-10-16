import { useFormatMessage } from "@apps/utility/common"
import { Button } from "antd"

export default function StickerModalFooter({ ...rest }) {
  let Footer = <></>
  if (rest.state?.modalMode === "createOrUpdate" && rest.state?.stickerEdit) {
    // update
    Footer = (
      <>
        <Button type="primary" htmlType="submit" loading={rest?.loading}>
          {!rest.state?.stickerEdit
            ? useFormatMessage("modules.sticker.modal.button.create")
            : useFormatMessage("modules.sticker.modal.button.update")}
        </Button>
        <Button
          type="primary"
          htmlType="button"
          danger
          className="sticker-btn-delete"
          onClick={() => rest.onDelete(rest.state?.stickerEdit.id)}>
          {useFormatMessage("modules.sticker.modal.button.delete")}
        </Button>
      </>
    )
  } else if (
    rest.state?.modalMode === "detail" &&
    rest.state?.stickerDetail.name !== "sticker_default"
  ) {
    // detail

    Footer = (
      <>
        <Button
          type="primary"
          htmlType="button"
          onClick={() => {
            rest.setState({
              stickerEdit: rest.state?.stickerDetail,
              modalMode: "createOrUpdate"
            })
          }}>
          {useFormatMessage("modules.sticker.modal.button.update")}
        </Button>
        <Button
          type="primary"
          htmlType="button"
          danger
          className="sticker-btn-delete"
          onClick={() => {
            rest.onDelete(rest.state?.stickerDetail.id)
          }}>
          {useFormatMessage("modules.sticker.modal.button.delete")}
        </Button>
      </>
    )
  } else {
    // create
    Footer =
      rest.state?.stickerDetail?.name !== "sticker_default" ? (
        <Button type="primary" htmlType="submit" loading={rest?.loading}>
          {!rest.state?.stickerEdit
            ? useFormatMessage("modules.sticker.modal.button.create")
            : useFormatMessage("modules.sticker.modal.button.update")}
        </Button>
      ) : (
        <></>
      )
  }

  return Footer
}
