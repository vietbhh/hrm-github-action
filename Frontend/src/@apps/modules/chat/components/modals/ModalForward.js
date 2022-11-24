import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import { FormProvider, useForm } from "react-hook-form"
import { ErpInput, ErpUserSelect } from "@apps/components/common/ErpField"

const ModalForward = (props) => {
  const { modal, toggleModal } = props
  const [state, setState] = useMergedState({
    loading: false
  })

  return (
    <Modal
      isOpen={modal}
      toggle={toggleModal}
      className="modal-dialog-centered">
      <ModalHeader toggle={() => toggleModal()}>
        {useFormatMessage("modules.chat.text.forward")}
      </ModalHeader>
      <ModalBody></ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  )
}

export default ModalForward
