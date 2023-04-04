import { ErpCheckbox, ErpRadio } from "@apps/components/common/ErpField"
import UserDisplay from "@apps/components/users/UserDisplay"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import EmployeesSelect from "components/hrm/Employees/EmployeesSelect"
import React, { useEffect } from "react"
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
import { Alert } from "antd"
const SelectAdminModal = (props) => {
  const { modal, handleModal, members, handleDone } = props
  const [state, setState] = useMergedState({
    loading: false,
    page: 1,
    search: "",
    members: [],
    recordsTotal: [],
    perPage: 10,
    admins: []
  })

  const onSubmit = (values) => {}
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const handleAdd = () => {
    handleDone(state.admins)
  }

  const handleSelect = (arr) => {
    setState({ admins: arr })
  }

  useEffect(() => {}, [members])

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
      <ModalHeader toggle={() => handleModal()}>Warning</ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-1">
            <Col className="text-left mb-1">
              <Alert
                description={
                  <>
                    You are the only administrator.
                    <br />
                    To take the action to leave the group please select an
                    alternate administrator
                  </>
                }
                type="error"
              />
            </Col>
            <Col sm={12}>
              <EmployeesSelect handleSelect={handleSelect} />
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
              className="ms-auto mr-2">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {useFormatMessage("button.done")}
            </Button>
            <Button
              className="btn-cancel"
              color="flat-danger"
              onClick={() => handleModal(false)}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default SelectAdminModal
