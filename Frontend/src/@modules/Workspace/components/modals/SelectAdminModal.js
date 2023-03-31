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
const SelectAdminModal = (props) => {
  const { modal, handleModal, handleDone, members } = props
  const [state, setState] = useMergedState({
    loading: false,
    page: 1,
    search: "",
    members: [],
    recordsTotal: [],
    perPage: 10
  })

  const onSubmit = (values) => {}
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const handleAdd = () => {
    const dataSelected = state.dataSelected
    console.log("dataSelected", dataSelected)
    handleDone(dataSelected, state.typeAdd)
  }

  const getDataSelect = (data = [], typeAdd) => {
    setState({ dataSelected: data, typeAdd: typeAdd })
  }
  const loadData = (filters = {}) => {
    defaultModuleApi.getList("employees", {}).then((res) => {
      console.log("res", res.data.results)
      setState({ members: res.data.results })
    })
  }
  const renderMember = (data = []) => {
    return data.map((item, key) => {
      return (
        <Col sm={12} className="d-flex">
          <UserDisplay user={item} className="mb-1" />
          <ErpCheckbox formGroupClass="ms-auto" />
        </Col>
      )
    })
  }

  useEffect(() => {
    loadData()
  }, [members])

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      size="md"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>Warning</ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-1">
            <Col className="text-center mb-1">
              You are the only administrator.
              <br />
              To take the action to leave the group please select an alternate
              administrator
            </Col>
            {renderMember(state.members)}
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
