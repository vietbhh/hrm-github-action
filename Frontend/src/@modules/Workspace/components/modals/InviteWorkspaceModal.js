import EmployeesSelect from "@/components/hrm/Employees/EmployeesSelect"
import { useMergedState } from "@apps/utility/common"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import "react-perfect-scrollbar/dist/css/styles.css"
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
const InviteWorkspaceModal = (props) => {
  const { modal, handleModal, handleDone, member_selected } = props
  const [state, setState] = useMergedState({
    loading: false,
    page: 1,
    search: "",
    members: [],
    departments: [],
    jobTitles: [],
    recordsTotal: [],
    perPage: 10,
    dataSelected: [],
    typeAdd: "members"
  })

  const onSubmit = (values) => {}
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const handleAdd = () => {
    const dataSelected = state.dataSelected
    handleDone(dataSelected, "members")
  }

  const getDataSelect = (data = [], typeAdd) => {
    setState({ dataSelected: data, typeAdd: typeAdd })
  }
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="invite-workspace-modal-off"
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        Invite members to this group
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-50">
            <Col sm={12} className="mb-1">
              <span className="filter-text">Filter members to invite by category</span>
            </Col>
            <Col sm={12}>
              <EmployeesSelect
                handleSelect={getDataSelect}
                member_selected={member_selected}
              />
            </Col>
          </Row>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter className="mt-2">
            <Button
              type="button"
              onClick={() => handleAdd()}
              color="primary"
              disabled={state.loading}
              className="btn-send-invite ms-auto me-auto w-100">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              Send invites
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default InviteWorkspaceModal
