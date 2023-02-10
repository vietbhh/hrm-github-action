import { Modal, ModalBody, ModalHeader } from "reactstrap"

const ModalEditAttachment = (props) => {
  const { modal, toggleModal } = props

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="feed modal-lg modal-dialog-centered"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      /* backdrop={"static"} */
    >
      <ModalHeader toggle={() => toggleModal()}></ModalHeader>
      <ModalBody></ModalBody>
    </Modal>
  )
}

export default ModalEditAttachment
