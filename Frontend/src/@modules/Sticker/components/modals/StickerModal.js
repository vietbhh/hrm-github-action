import { Modal } from "antd"
import StickerCreateOrUpdate from "../StickerCreateOrUpdate"
import StickerDetail from "../StickerDetail"
import SwAlert from "@apps/utility/SwAlert"
import notification from "@apps/utility/notification"
import { useFormatMessage } from "@apps/utility/common"
import { stickerApi } from "../../common/api"
import { stickerDefaultName } from "../../common/constant"

export default function StickerModal({
  open,
  handleOk,
  handleCancel,
  state,
  setState,
  getData,
  markStickersDefault
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
            markStickersDefault.default = null
          }

          handleCancel()
        })
      }
    })
  }

  const generateTitle = () => {
    if (state.modalMode === "createOrUpdate") {
      if (!state.stickerEdit) {
        return useFormatMessage("modules.sticker.modal.title.create")
      }

      return useFormatMessage("modules.sticker.modal.title.update")
    } else {
      if (state.stickerDetail.name !== stickerDefaultName) {
        return state.stickerDetail.name
      }

      return state.stickerDetail.label
    }
  }

  return (
    <Modal
      title={generateTitle()}
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
