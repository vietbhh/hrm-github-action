// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
// ** Styles
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
// ** Components
import LoadPost from "components/hrm/LoadPost/LoadPost"
import SwAlert from "@apps/utility/SwAlert"

const PreviewPostModal = (props) => {
  const {
    // ** props
    modal,
    dataPreview,
    data,
    // ** methods
    handleModal,
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
          _id: dataPreview._id
        }

        feedApi
          .postDeletePost(params)
          .then((res) => {
            const newData = [...data].filter((item) => {
              return item._id !== dataPreview._id
            })
            console.log("sdf")
            setData(newData)
            handleModal()
          })
          .catch((err) => {})
      }
    })
  }

  // ** render
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="preview-post-modal"
      size="md"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.feed.manage_post.buttons.preview_post")}
      </ModalHeader>
      <ModalBody>
        <LoadPost
          data={dataPreview}
          avatarHeight={20}
          avatarWidth={20}
          offReactionAndComment={true}
          offPostHeaderAction={true}
        />
      </ModalBody>
      <ModalFooter className="d-flex justify-content-end">
        <Button.Ripple onClick={() => handleClickDeletePost()}>
          <i className="fa-regular fa-trash-can me-50" />
          {useFormatMessage("modules.feed.manage_post.buttons.delete_post")}
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}

export default PreviewPostModal
