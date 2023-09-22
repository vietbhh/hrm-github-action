// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
// ** Styles
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
// ** Components
import LoadPost from "@/components/hrm/LoadPost/LoadPost"

const ModalPostComment = (props) => {
  const {
    // ** props
    modal,
    dataPreview,
    // ** methods
    handleModal,
    setData
  } = props

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="modal-dialog-centered feed modal-create-post modal-create-event modal-post-comment"
      size="md"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <span className="text-title">
          {useFormatMessage("modules.feed.manage_post.title.user_post", {
            label: dataPreview.owner.username
          })}
        </span>
        <div className="div-btn-close" onClick={() => handleModal()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <LoadPost
          data={dataPreview}
          avatarHeight={20}
          avatarWidth={20}
          offReactionAndComment={false}
          offPostHeaderAction={false}
          isFocusCommentOnclick={true}
          setData={setData}
        />
      </ModalBody>
    </Modal>
  )
}

export default ModalPostComment
