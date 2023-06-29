// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
// ** Components

const CreateWorkgroupModal = (props) => {
  const {
    // ** props
    modal,
    // ** methods
    handleModal
  } = props

  // ** render
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="invite-workspace-modal"
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.workspace.display.create_workgroup")}aa
      </ModalHeader>
      <ModalBody></ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  )
}

export default CreateWorkgroupModal
