import EmployeesSelect from "@/components/hrm/Employees/EmployeesSelect"
import { useMergedState, useFormatMessage } from "@apps/utility/common"
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

import notification from "@apps/utility/notification"
import { isMobileView } from "../../common/common"
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
    const arr_member_selected = member_selected.map((x) => x.id_user)
    const dataFilter = dataSelected.filter(
      (employee) => !arr_member_selected.includes(employee.id)
    )
    let checkExist = false
    dataSelected.map((member) => {
      if (arr_member_selected.includes(member.id)) {
        if (checkExist) return
        notification.showError({
          text: useFormatMessage("modules.workspace.display.member_already", {
            full_name: member.full_name
          })
        })
        checkExist = true
      }
    })
    if (checkExist) return
    if (dataSelected.length <= 0) {
      notification.showError({
        text: useFormatMessage("modules.workspace.display.no_data_seletec")
      })
      return
    }
    handleDone(dataFilter, "members")
  }

  const getDataSelect = (data = [], typeAdd) => {
    setState({ dataSelected: data, typeAdd: typeAdd })
  }
  return (
    <Modal
      isOpen={modal}
      style={{ top: "50px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="invite-workspace-modal-off"
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {!isMobileView()
          ? useFormatMessage(
              "modules.workspace.display.invite_memvers_to_group"
            )
          : "Invite member"}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row>
            <Col sm={12}>
              <span className="filter-text">
                {useFormatMessage(
                  "modules.workspace.display.filter_member_category"
                )}
              </span>
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
          <ModalFooter>
            <Button
              type="button"
              onClick={() => handleAdd()}
              color="primary"
              disabled={state.loading}
              className="btn-send-invite ms-auto me-auto w-100">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {!isMobileView()
                ? useFormatMessage("modules.workspace.buttons.send_invites")
                : useFormatMessage("modules.users.display.inviteBtn")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default InviteWorkspaceModal
