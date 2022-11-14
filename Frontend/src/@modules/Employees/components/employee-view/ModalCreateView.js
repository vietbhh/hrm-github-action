import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import "@styles/react/libs/editor/editor.scss"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
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

const ModalCreateView = (props) => {
  const { modal, toggleModal, filters, tableFilters, setSettingEmployeeView } =
    props

  const [state, setState] = useMergedState({
    loading: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, reset } = methods

  useEffect(() => {
    reset()
  }, [])

  const onSubmit = (values) => {
    values.filters = filters
    values.tableFilters = JSON.stringify(tableFilters)
    setState({ loading: true })
    employeesApi
      .postAddEmployeeView(values)
      .then((res) => {
        setSettingEmployeeView(res.data)
        notification.showSuccess({
          text: useFormatMessage("notification.create.success")
        })
        toggleModal()
        setState({
          loading: false
        })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.create.error")
        })
      })
  }

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="modal-md"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => toggleModal()}>
          {useFormatMessage("modules.employee_view.modal.new_view")}
        </ModalHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Row>
                <Col sm="12" className="mt-10">
                  <ErpInput
                    name="title"
                    useForm={methods}
                    nolabel
                    placeholder={useFormatMessage(
                      "modules.employee_view.modal.title"
                    )}
                    required
                  />
                </Col>
                <Col sm="12" className="mt-10">
                  <ErpInput
                    type="textarea"
                    name="description"
                    useForm={methods}
                    nolabel
                    placeholder={useFormatMessage(
                      "modules.employee_view.modal.description"
                    )}
                    required
                  />
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary" disabled={state.loading}>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("modules.employee_view.buttons.create")}
              </Button>
              <Button
                color="flat-danger"
                onClick={() => {
                  toggleModal()
                }}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </Fragment>
  )
}

export default ModalCreateView
