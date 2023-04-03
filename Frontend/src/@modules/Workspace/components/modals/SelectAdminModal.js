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
  const { modal, handleModal, members } = props
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

  const handleAddOld = () => {
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

  const handleSelect = (arr) => {
    setState({ admins: arr })
  }

  const handleDone = (dataUpdate, type) => {
    const infoWorkspace = { ...data }
    if (type === "members") {
      const arrID = infoWorkspace.members.concat(
        dataUpdate.map((x) => x["id"] * 1)
      )

      infoWorkspace.members = JSON.stringify(arrID)
      workspaceApi.update(infoWorkspace._id, infoWorkspace).then((res) => {
        if (res.statusText) {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          onClickInvite()
          setState({ loading: false })
          // loadData()
        }
      })
    } else {
      let varTxt = "department_id"
      if (type !== "departments") {
        varTxt = "job_title_id"
      }
      const arrIdDepartment = JSON.stringify(dataUpdate.map((x) => x["id"] * 1))
      workspaceApi
        .loadMember({
          [varTxt]: dataUpdate.map((x) => x["id"] * 1)
        })
        .then((res) => {
          if (res.data) {
            const arrID = infoWorkspace.members.concat(
              res.data.map((x) => parseInt(x))
            )

            infoWorkspace.members = JSON.stringify(unique(arrID))
            workspaceApi
              .update(infoWorkspace._id, infoWorkspace)
              .then((res) => {
                if (res.statusText) {
                  notification.showSuccess({
                    text: useFormatMessage("notification.save.success")
                  })
                  onClickInvite()
                  setState({ loading: false })
                  //loadData()
                }
              })
          }
        })
    }
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
