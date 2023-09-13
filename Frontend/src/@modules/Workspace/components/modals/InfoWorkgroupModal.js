// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
// ** Components
import AboutWorkgroup from "../detail/TabFeed/AboutWorkgroup"

const InfoWorkgroupModal = (props) => {
  const { modal, handleModal, workspaceInfo } = props

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      size="sm"
      className="create-workgroup-modal info-workgroup-modal"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}></ModalHeader>
      <ModalBody>
        <AboutWorkgroup workspaceInfo={workspaceInfo} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  )
}

export default InfoWorkgroupModal
