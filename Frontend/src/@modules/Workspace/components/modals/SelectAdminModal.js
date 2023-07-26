import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { Alert } from "antd"
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
    handleModal()
  }

  const loadData = () => {
    setState({
      loading: true
    })
    const arrIdUser = members ? members.map((e) => e["id_user"]) : []
    defaultModuleApi
      .getUsers({ perPage: 1000, filters: { ["whereIN"]: { id: arrIdUser } } })
      .then((res) => {
        setState({
          members: res.data.results,
          loading: false
        })
      })
  }

  const handleSelected = (itemSelect) => {
    const arr = [...state.admins]
    const index = arr.findIndex((p) => p.id === itemSelect.id)
    if (index >= 0) {
      arr.splice(index, 1)
    } else {
      arr.push(itemSelect)
    }
    setState({ admins: arr })
  }

  useEffect(() => {
    loadData()
  }, [])

  const renderUser = (data) => {
    const arrAD = state.admins.map((e) => e["id"])
    return data.map((item, key) => {
      return (
        <Col sm={4} key={key} className="mb-1">
          <div
            className={`box-member d-flex ${
              arrAD.includes(item.id) ? "selected_member" : ""
            } `}
            onClick={() => handleSelected(item)}>
            <Avatar src={item.avatar} className="me-50" width={"100px"} />
            <div>
              <div className="title">{item.full_name}</div>
              <span className="sub-email">{item?.email}</span>
            </div>
          </div>
        </Col>
      )
    })
  }
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      className="invite-workspace--off"
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}></ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-1">
            <Col className="text-left mb-1" sm={12}>
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
            {renderUser(state.members)}
          </Row>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <div className="ms-auto">
              {state.admins.length > 0 && (
                <Button
                  type="button"
                  onClick={() => handleAdd()}
                  color="primary"
                  disabled={state.loading}
                  className="ms-auto mr-2">
                  {state.loading && (
                    <Spinner size="sm" className="mr-50 mr-1" />
                  )}
                  {useFormatMessage("button.save")}
                </Button>
              )}
              <Button
                className="btn-cancel ms-1"
                color="flat-danger"
                onClick={() => handleModal(false)}>
                {useFormatMessage("button.cancel")}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default SelectAdminModal
