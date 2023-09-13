// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { employeesApi } from "../../common/api"
// ** Styles
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"
import UserDisplay from "@apps/components/users/UserDisplay"

const InviteEmployeesModal = (props) => {
  const {
    // ** props
    modal,
    listEmployee,
    // ** methods
    handleModal,
    onComplete
  } = props

  const [state, setState] = useMergedState({
    submitting: false
  })

  const handleSubmit = () => {
    const arrId = listEmployee.map((item) => {
      return item.id
    })
    employeesApi
      .sendInvite("multi", {
        employee_id: arrId
      })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage(
            "modules.employees.notifications.sendInviteSuccess"
          )
        })
        handleModal()
        onComplete()
        setState({
          submitting: false
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
        setState({
          submitting: false
        })
      })
  }

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="new-profile-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.employees.buttons.invite_member", {
          number: listEmployee.length
        })}
      </ModalHeader>
      <ModalBody>
        <div className="d-flex align-items-center flex-wrap mt-1">
          {listEmployee.map((item) => {
            return <UserDisplay user={item} className="mb-1 me-75" />
          })}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => handleSubmit()}
          color="primary"
          disabled={state.submitting}>
          {state.submitting && <Spinner size="sm" className="me-50" />}
          {useFormatMessage("app.save")}
        </Button>
        <Button color="flat-danger" onClick={() => handleModal()}>
          {useFormatMessage("button.cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default InviteEmployeesModal
