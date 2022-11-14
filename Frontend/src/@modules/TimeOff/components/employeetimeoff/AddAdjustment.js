import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import "@core/scss/react/libs/flatpickr/flatpickr.scss"
import { timeoffApi } from "@modules/TimeOff/common/api"
import "@styles/react/libs/editor/editor.scss"
import "flatpickr/dist/themes/light.css"
import React, { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Col,
  FormFeedback,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"

const AddAdjustment = (props) => {
  const { id_user_select, afterAction } = props

  const [state, setState] = useMergedState({
    loading: false,
    modal: false,
    loading_config: false,
    data_type: {},
    data_employee: [],
    current_balance: 0,
    carry_over_balance: 0
  })

  const loadConfig = () => {
    setState({ loading_config: true })
    const params = {
      id_user_select: id_user_select
    }
    timeoffApi
      .getEmployeeTimeOffConfig(params)
      .then((res) => {
        setState({
          data_type: res.data.data_type,
          data_employee: res.data.data_employee,
          loading_config: false
        })
      })
      .catch((err) => {
        console.log(err)
        setState({ loading_config: false })
      })
  }

  useEffect(() => {
    loadConfig()
  }, [id_user_select])

  const toggleAddModal = () => {
    setState({ modal: !state.modal })
  }

  const onSubmit = (values) => {
    setState({ loading: true })
    values.id_user_select = id_user_select
    timeoffApi
      .postEmployeeTimeOffSubmitAdjustment(values)
      .then((res) => {
        setState({ loading: false, modal: false })
        afterAction()
        setState({ current_balance: 0, carry_over_balance: 0 })
      })
      .catch((err) => {
        console.log(err)
        setState({ loading: false })
      })
  }

  const methods = useForm({
    mode: "all",
    reValidateMode: "onChange"
  })
  const { handleSubmit, setValue, trigger } = methods

  const changeType = (e) => {
    setValue("type", e)
    trigger("type")
    const params = {
      id_user_select: id_user_select,
      type: e.value
    }
    timeoffApi
      .getEmployeeTimeOffChangeType(params)
      .then((res) => {
        setState({
          current_balance: res.data.balance,
          carry_over_balance: res.data.carry_over_balance
        })
      })
      .catch((err) => {
        setState({
          current_balance: 0,
          carry_over_balance: 0
        })
        console.log(err)
      })
  }

  const select_adjustment_options = [
    {
      value: "add",
      label: useFormatMessage("modules.time_off_requests.employee_time_off.add")
    },
    {
      value: "subtract",
      label: useFormatMessage(
        "modules.time_off_requests.employee_time_off.subtract"
      )
    }
  ]

  const changeSelectAdjustment = (e) => {
    setValue("adjustment", e)
    trigger("adjustment")
  }

  return (
    <Fragment>
      <Button.Ripple
        color="primary"
        outline
        onClick={() => {
          toggleAddModal()
        }}>
        <i className="icpega Actions-Plus button-icon"></i> &nbsp;
        <span className="align-self-center">
          {useFormatMessage("modules.time_off_requests.button.add_adjustment")}
        </span>
      </Button.Ripple>

      <Modal
        isOpen={state.modal}
        toggle={() => toggleAddModal()}
        className="modal-lg my-requests"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => toggleAddModal()}>
          {useFormatMessage("modules.time_off_requests.button.add_adjustment")}
        </ModalHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody className="modal-body">
              <div className="notify" style={{ marginBottom: "20px" }}>
                <Avatar
                  style={{ cursor: "default" }}
                  className="img"
                  size="sm"
                  src={state.data_employee.avatar}
                />
                <span>{state.data_employee.full_name}</span>
              </div>
              <Row>
                <Col sm={6}>
                  <ErpSelect
                    onChange={(e) => {
                      changeType(e)
                    }}
                    name="type"
                    options={state.data_type}
                    label={useFormatMessage(
                      "modules.time_off_requests.fields.type"
                    )}
                    useForm={methods}
                    isClearable={false}
                    required={true}
                    placeholder={useFormatMessage(
                      "modules.time_off_requests.select_type"
                    )}
                  />
                </Col>
                <Col sm={3}>
                  <ErpSelect
                    onChange={(e) => {
                      changeSelectAdjustment(e)
                    }}
                    name="adjustment"
                    options={select_adjustment_options}
                    label={useFormatMessage(
                      "modules.time_off_requests.employee_time_off.adjustment"
                    )}
                    useForm={methods}
                    isClearable={false}
                    required={true}
                    defaultValue={select_adjustment_options[0]}
                  />
                </Col>
                <Col sm={3}>
                  <ErpInput
                    name="total_day"
                    label={useFormatMessage(
                      "modules.time_off_requests.employee_time_off.day"
                    )}
                    useForm={methods}
                    required={true}
                    defaultValue={1}
                    type="number"
                    step="any"
                    validateRules={{
                      validate: {
                        positive: (v) =>
                          v <= 0
                            ? useFormatMessage(
                                "modules.time_off_requests.employee_time_off.validate_number"
                              )
                            : true
                      }
                    }}
                  />
                </Col>
                <Col sm={12}>
                  <FormFeedback
                    style={{ display: "block", color: "rgb(14, 34, 61)" }}>
                    <i
                      className="fal fa-info-circle"
                      style={{ marginRight: "5px" }}></i>
                    <span style={{ marginRight: "20px" }}>
                      {useFormatMessage(
                        "modules.time_off_requests.employee_time_off.current_balance"
                      )}
                      : {state.current_balance}{" "}
                      {useFormatMessage("modules.time_off_requests.days")}
                    </span>
                    <span>
                      {useFormatMessage(
                        "modules.time_off_requests.employee_time_off.carry_over_balance"
                      )}
                      : {state.carry_over_balance}{" "}
                      {useFormatMessage("modules.time_off_requests.days")}
                    </span>
                  </FormFeedback>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter style={{ marginTop: "20px" }}>
              <Button
                onClick={(e) => {}}
                type="submit"
                color="primary"
                disabled={state.loading}>
                {state.loading && (
                  <Spinner
                    size="sm"
                    className="mr-50"
                    style={{ marginBottom: "4px" }}
                  />
                )}
                {useFormatMessage("modules.time_off_requests.button.submit")}
              </Button>
              <Button
                color="flat-danger"
                onClick={() => {
                  toggleAddModal()
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

export default AddAdjustment
