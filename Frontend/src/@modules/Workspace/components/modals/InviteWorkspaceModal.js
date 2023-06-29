import { useFormatMessage, useMergedState } from "@apps/utility/common"
import EmployeesSelect from "@/components/hrm/Employees/EmployeesSelect"
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
    handleDone(dataSelected, state.typeAdd)
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
        {useFormatMessage("modules.workspace.display.add_member_to_ws")}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-1">
            <Col sm={12} className="mb-1">
              Filter members to invite by category
            </Col>
            <Col sm={12} className="">
              <span className="border rounded w-100 me-1 px-1 py-50">
                Users
              </span>
              <span className="border rounded w-100 me-1 px-1 py-50">
                Derpartment
              </span>
              <span className="border rounded w-100 px-1 py-50">Job title</span>
              <hr />
            </Col>
            <Col sm={12} className="mt-3">
              <EmployeesSelect
                handleSelect={getDataSelect}
                member_selected={member_selected}
              />
            </Col>
          </Row>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <Button
              type="button"
              onClick={() => handleAdd()}
              color="primary"
              disabled={state.loading}
              className="ms-auto mr-2 w-100">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {useFormatMessage("button.done")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default InviteWorkspaceModal
