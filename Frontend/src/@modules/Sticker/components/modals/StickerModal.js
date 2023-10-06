import { Modal } from "antd"
import StickerCreateOrUpdate from "../StickerCreateOrUpdate"
import StickerDetail from "../StickerDetail"
import SwAlert from "@apps/utility/SwAlert"
import notification from "@apps/utility/notification"
import { useFormatMessage } from "@apps/utility/common"
import { stickerApi } from "../../common/api"

export default function StickerModal({
  open,
  handleOk,
  confirmLoading,
  handleCancel,
  state,
  setState,
  getData
}) {
  const onDelete = (stickerId) => {
    SwAlert.showWarning({
      title: useFormatMessage("notification.confirm.title"),
      text: useFormatMessage("notification.confirm.text")
    }).then(async (result) => {
      if (result["isConfirmed"]) {
        stickerApi.delete(stickerId).then(async () => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })

          // 2 check when: last page and item + sticker item
          if (state.stickerList.length === 2 && state.page != 1) {
            setState({
              page: 1
            })
          } else {
            getData()
          }

          handleCancel()
        })
      }
    })
  }

  return (
    <Modal
      title={
        state.modalMode === "createOrUpdate"
          ? !state.stickerEdit
            ? useFormatMessage("modules.sticker.modal.title.create")
            : useFormatMessage("modules.sticker.modal.title.update")
          : state.stickerDetail.name
      }
      className="sticker-modal"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}>
      {state.modalMode === "createOrUpdate" && (
        <StickerCreateOrUpdate
          state={state}
          setState={setState}
          onDelete={onDelete}
          handleCancel={handleCancel}
          getData={getData}
        />
      )}
      {state.modalMode === "detail" && (
        <StickerDetail state={state} setState={setState} onDelete={onDelete} />
      )}
    </Modal>
  )
}
