// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { SettingTimeOffApi } from "@modules/TimeOff/common/api"
import notification from "@apps/utility/notification"
// ** Styles
import { Button, Col, Row, Spinner } from "reactstrap"
import { Space } from "antd"
// ** Components
import PolicyFormElement from "./PolicyFormElement"
import GuildPolicy from "./GuildPolicy"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const AddPolicyTimeOff = (props) => {
  const {
    // ** props
    moduleName,
    metas,
    options,
    optionsModules,
    moduleNamePolicy,
    metasPolicy,
    optionsPolicy,
    policyData,
    isEditPolicy,
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
  const { handleSubmit, formState, setValue, getValues, watch, register } =
    methods
  const onSubmit = (values) => {
    SettingTimeOffApi.postUpdatePolicy(policyData.id, values)
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
  }

  const handleCancel = () => {
    setAddType("")
  }

  // ** effect
  useEffect(() => {
    if (isEditPolicy === true) {
      setState({
        loading: true
      })
      SettingTimeOffApi.getDetailTimeOffPolicy(policyData.id).then((res) => {
        setState({
          dataForm: res.data.data,
          timeOffTypePaidStatus: res.data.data.paid_status,
          loading: false
        })
      })
    } else {
      setState({ loading: false })
    }
  }, [isEditPolicy])

  // ** render
  const renderFormElement = () => {
    if (state.loading) {
      return <AppSpinner />
    }
    
    return (
      <PolicyFormElement
        moduleName={moduleNamePolicy}
        metas={metasPolicy}
        options={optionsPolicy}
        optionsModules={optionsModules}
        dataForm={state.dataForm}
        methods={methods}
        timeOffTypePaidStatus={state.timeOffTypePaidStatus}
        isEditPolicy={isEditPolicy}
      />
    )
  }

  return (
    <Fragment>
      <Row className="mt-2">
        <Col sm={7} className="mb-25">
          <div className="mb-2">
            <FormProvider {...methods}>
              {!state.loading ? renderFormElement() : <AppSpinner />}
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
                {useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleCancel()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </Space>
          </form>
        </Col>
        <Col sm={5} className="mb-25">
          <GuildPolicy lang="en" />
        </Col>
      </Row>
    </Fragment>
  )
}

export default AddPolicyTimeOff
