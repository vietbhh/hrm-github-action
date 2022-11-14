// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { employeesApi } from "@modules/Employees/common/api"
// ** Styles
import { Collapse, Space } from "antd"
import { Button } from "reactstrap"
// ** Components
import { ErpSwitch } from "@apps/components/common/ErpField"
import EditPattern from "./EditPattern"
import notification from "@apps/utility/notification"

const { Panel } = Collapse

const AutoGenerateCodeInfo = (props) => {
  const {
    // ** props
    tabName,
    content
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    isEdit: false,
    isActive: parseInt(content.active) === 1,
    previewCode: content.result
  })

  const methods = useForm({
    mode: "onChange"
  })
  const { handleSubmit, reset, formState } = methods

  const onSubmit = (values) => {
    const valueSubmit = {
      text_code: values.text_code,
      decimals: values.decimals,
      current_num: values.current_num
    }
    setState({
      loading: true
    })
    employeesApi
      .updateAutoGenerateCode(content.id, valueSubmit)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.update.success")
        })
        setState({
          loading: false
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.update.error")
        })
        setState({
          loading: false
        })
      })
  }

  const setIsEdit = (status) => {
    setState({
      isEdit: status
    })
  }

  const setPreviewCode = (code) => {
    setState({
      previewCode: code
    })
  }

  const handleCancelEdit = () => {
    setIsEdit(false)
  }

  const handleChangeActive = (e) => {
    const values = {
      active: e.target.checked
    }
    employeesApi
      .updateAutoGenerateCode(content.id, values)
      .then((res) => {
        setState({
          isActive: e.target.checked,
          isEdit: false
        })
        notification.showSuccess({
          text: useFormatMessage("notification.update.success")
        })
      })
      .catch((err) => {
        setState({
          isActive: false,
          isEdit: false
        })
        notification.showError({
          text: useFormatMessage("notification.update.error")
        })
      })
  }

  // ** effect
  useEffect(() => {
    reset({ ...content })
  }, [content, state.isActive, state.isEdit])

  // ** render
  const renderPanelHeader = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-between w-100">
          <div>
            <p className="mb-0">
              <i className="fas fa-text-size me-50 text-primary" />
              {useFormatMessage(
                `modules.employee_setting.text.${content.field}`
              )}
            </p>
          </div>
        </div>
      </Fragment>
    )
  }

  const renderEditPattern = () => {
    return (
      <EditPattern
        isEdit={state.isEdit}
        previewCode={state.previewCode}
        methods={methods}
        setIsEdit={setIsEdit}
        setPreviewCode={setPreviewCode}
      />
    )
  }

  const renderAction = () => {
    if (state.isEdit) {
      return (
        <Fragment>
          <Space className="mt-2 mb-1">
            <Button.Ripple
              type="submit"
              color="primary"
              disabled={state.loading || !formState.isValid}>
              {useFormatMessage("modules.employee_setting.buttons.save")}
            </Button.Ripple>
            <Button.Ripple
              type="submit"
              color="danger"
              disabled={state.loading}
              onClick={() => handleCancelEdit()}>
              {useFormatMessage("modules.employee_setting.buttons.cancel")}
            </Button.Ripple>
          </Space>
        </Fragment>
      )
    }

    return ""
  }

  const renderEditPatternForm = () => {
    if (!state.isActive) {
      return ""
    }

    return (
      <Fragment>
        <FormProvider {...methods}>
          <Fragment>{renderEditPattern()}</Fragment>
        </FormProvider>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fragment>{renderAction()}</Fragment>
        </form>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div className="collapse-custom-field no-action">
        <Collapse
          expandIcon={(panelProps) => {
            return panelProps.isActive ? (
              <i className="fas fa-angle-down" />
            ) : (
              <i className="fas fa-angle-right" />
            )
          }}
          bordered={false}
          className="mb-1">
          <Panel header={renderPanelHeader()} key="1">
            <div className="ps-2 pe-2 pt-1">
              <div>
                <div className="d-flex align-items-center">
                  <h6 className="me-1">
                    {useFormatMessage(
                      "modules.employee_setting.fields.autogenerate_id"
                    )}
                  </h6>
                  <ErpSwitch
                    name="active"
                    defaultChecked={state.isActive}
                    onChange={(e) => handleChangeActive(e)}
                  />
                </div>
                <p>
                  {useFormatMessage(
                    `modules.employee_setting.text.autogenerate_id_description.${tabName}`
                  )}
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <Fragment>{renderEditPatternForm()}</Fragment>
            </div>
          </Panel>
        </Collapse>
      </div>
    </Fragment>
  )
}

export default AutoGenerateCodeInfo
