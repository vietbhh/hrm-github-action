// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { SettingTimeOffApi } from "@modules/TimeOff/common/api"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
import { Button, Col, Row, Spinner } from "reactstrap"
import { Space } from "antd"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import PolicyFormElement from "./PolicyFormElement"
import GuildPolicy from "./GuildPolicy"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import notification from "@apps/utility/notification"

const AddTypeTimeOff = (props) => {
  const {
    // ** props
    moduleName,
    metas,
    options,
    optionsModules,
    moduleNamePolicy,
    metasPolicy,
    optionsPolicy,
    isEditType,
    typeData,
    // ** methods
    setAddType
  } = props
  const [state, setState] = useMergedState({
    loading: true,
    dataForm: {},
    timeOffTypePaidStatus: false
  })
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, setValue, watch, getValues } = methods

  const watchPaid = watch("type_field_paid", false)

  const onSubmit = (values) => {
    if (isEditType === true) {
      SettingTimeOffApi.postUpdateTypeAndPolicy(typeData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          setAddType("")
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
        })
    } else {
      SettingTimeOffApi.postSaveTypeAndPolicyTimeOff(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          setAddType("")
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
        })
    }
  }

  const handleCancel = () => {
    setAddType("")
  }

  // ** effect
  useEffect(() => {
    setState({
      timeOffTypePaidStatus: watchPaid
    })
  }, [watchPaid])

  useEffect(() => {
    if (isEditType === true) {
      setState({
        loading: true
      })
      defaultModuleApi.getDetail(moduleName, typeData.id).then((res) => {
        setState({
          loading: false,
          dataForm: res.data.data
        })
      })
    } else {
      setState({
        loading: false,
        dataForm: {}
      })
    }
  }, [isEditType])

  // ** render
  const renderAddPolicyFormElement = () => {
    return (
      <Fragment>
        <hr />
        <PolicyFormElement
          moduleName={moduleNamePolicy}
          metas={metasPolicy}
          options={optionsPolicy}
          optionsModules={optionsModules}
          typeData={{}}
          timeOffTypePaidStatus={state.timeOffTypePaidStatus}
          methods={methods}
        />
      </Fragment>
    )
  }

  const renderForm = () => {
    if (state.loading) {
      return <AppSpinner />
    }

    return (
      <Fragment>
        <div className="mb-1">
          <FormProvider {...methods}>
            <Row className="mt-2">
              <Col sm={12} className="mb-0">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.name
                  }}
                  name="type_field_name"
                  nolabel={true}
                  useForm={methods}
                  updateData={state.dataForm?.name}
                  updateId={state.dataForm?.id}
                />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col sm={6} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.paid
                  }}
                  name="type_field_paid"
                  nolabel={false}
                  useForm={methods}
                  updateData={state.dataForm?.paid}
                />
              </Col>
              <Col sm={6} className="mb-25 unit-form-group">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.unit
                  }}
                  name="type_field_unit"
                  useForm={methods}
                  options={options}
                  updateData={state.dataForm?.unit}
                />
              </Col>
            </Row>
            {!isEditType && renderAddPolicyFormElement()}
          </FormProvider>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space>
            <Button
              type="submit"
              color="primary"
              disabled={
                state.loading ||
                formState.isSubmitting ||
                formState.isValidating
              }>
              {(state.loading ||
                formState.isSubmitting ||
                formState.isValidating) && (
                <Spinner size="sm" className="mr-50" />
              )}
              {isEditType
                ? useFormatMessage("app.update")
                : useFormatMessage("app.save")}
            </Button>
            <Button color="flat-danger" onClick={() => handleCancel()}>
              {useFormatMessage("button.cancel")}
            </Button>
          </Space>
        </form>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Row className="mt-2">
        <Col sm={7} className="mb-25">
          <div>
            <h4>
              {isEditType
                ? useFormatMessage("modules.time_off.title.edit_type")
                : useFormatMessage("modules.time_off.title.create_type")}
            </h4>
          </div>
          <div>{!state.loading ? renderForm() : <AppSpinner />}</div>
        </Col>
        <Col sm={5} className="mb-25">
          <GuildPolicy lang="en" />
        </Col>
      </Row>
    </Fragment>
  )
}

export default AddTypeTimeOff
