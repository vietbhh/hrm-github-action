// ** React Imports
import { FormProvider, useForm } from "react-hook-form"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { SettingTimeOffApi } from "@modules/TimeOff/common/api"
import notification from "@apps/utility/notification"
import { useEffect } from "react"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import moment from "moment"
// ** Styles
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
import { Space } from "antd"
// ** Components

const AddHolidayModal = (props) => {
  const {
    // ** props
    modal,
    moduleName,
    metas,
    isEditModal,
    filters,
    holidayData,
    // ** methods
    handleModal,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    isError: false,
    modalData: {},
    fromDate: "",
    toDate: ""
  })

  const methods = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  })
  const { handleSubmit, formState, getValues } = methods

  const handleCancelModal = () => {
    handleModal()
  }

  const onSubmit = (values) => {
    values.office_id = filters.office_id
    values.year = filters.year
    if (isEditModal) {
      SettingTimeOffApi.postUpdateHoliday(holidayData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          handleModal()
          setState({ loading: false })
          loadData()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
          setState({ loading: false })
        })
    } else {
      SettingTimeOffApi.postSaveHoliday(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          handleModal()
          setState({ loading: false })
          loadData()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
          setState({ loading: false })
        })
    }
  }

  const loadModalData = () => {
    setState({
      loading: true
    })
    defaultModuleApi
      .getDetail(moduleName, holidayData.id)
      .then((res) => {
        setState({
          loading: false,
          modalData: res.data.data,
          fromDate: res.data.data.from_date,
          toDate: res.data.data.to_date
        })
      })
      .catch((err) => {
        setState({
          loading: false
        })
      })
  }

  const handleValidateDate = async () => {
    const fromDate = getValues("from_date")
    const toDate = getValues("to_date")
    if (fromDate.diff(toDate, "days", true) > 0) {
      return false
    } else {
      return true
    }
  }

  // ** effect
  useEffect(() => {
    if (isEditModal === true) {
      loadModalData()
    }
  }, [modal])

  // ** render
  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        d={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("modules.time_off_holidays.title.add_holiday")}
        </ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <Row className="mt-1">
              <Col sm={12} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.name
                  }}
                  nolabel={false}
                  useForm={methods}
                  updateData={state.modalData?.name}
                />
              </Col>
            </Row>
            <Row className="mt-0">
              <Col sm={6} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.from_date
                  }}
                  nolabel={false}
                  useForm={methods}
                  updateData={state.fromDate}
                  validateRules={{
                    validate: {
                      checkDate: async (v) =>
                        (await handleValidateDate()) ||
                        useFormatMessage(
                          "modules.time_off_holidays.errors.from_date"
                        )
                    }
                  }}
                />
              </Col>
              <Col sm={6} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.to_date
                  }}
                  nolabel={false}
                  useForm={methods}
                  updateData={state.toDate}
                  validateRules={{
                    validate: {
                      checkDate: async (v) =>
                        (await handleValidateDate()) ||
                        useFormatMessage(
                          "modules.time_off_holidays.errors.to_date"
                        )
                    }
                  }}
                />
              </Col>
            </Row>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
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
                {(state.loading || formState.isSubmitting) && (
                  <Spinner size="sm" className="mr-50" />
                )}
                {isEditModal
                  ? useFormatMessage("app.update")
                  : useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleCancelModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </Space>
          </form>
        </ModalFooter>
      </Modal>
    )
  }

  return !state.loading && renderModal()
}

export default AddHolidayModal
AddHolidayModal.defaultProps = {
  loading: false,
  holidayData: {}
}
