import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { isEmpty } from "lodash"
import { filter, map, orderBy } from "lodash-es"
import moment from "moment"
import React, { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
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

const EmployeeContractModal = (props) => {
  const {
    modal,
    handleModal,
    loadData,
    updateId,
    updateData,
    employeeId,
    api,
    loadingDataEdit,
    contractMinDate,
    reload
  } = props
  const module = useSelector((state) => state.app.modules.contracts)
  const options = module.options
  const [state, setState] = useMergedState({
    loading: true,
    submitting: false,
    checkedEndDate: false
  })
  const fields = module.metas
  const onSubmit = (values) => {
    if (!isEmpty(updateId)) {
      values.id = updateId
    }

    setState({ submitting: true })
    api
      .saveRelated("contracts", values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
        reload()
        loadData()
        setState({ submitting: false })
      })
      .catch((err) => {
        //props.submitError();
        setState({ submitting: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
        if (
          err.response.data &&
          err.response.data.messages.error === "error_date_start"
        ) {
          setError("contract_date_start", {
            type: "custom",
            message: useFormatMessage("modules.employees.tabs.job.error_date")
          })
        }
        if (
          state.checkedEndDate === false &&
          err.response.data &&
          err.response.data.messages.error === "error_date_end"
        ) {
          setError("contract_date_end", {
            type: "custom",
            message: useFormatMessage("modules.employees.tabs.job.error_date")
          })
        }
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setError, watch } = methods

  useEffect(() => {
    if (
      !_.isEmpty(updateData) &&
      (updateData.contract_date_end === "" ||
        updateData.contract_date_end === null)
    ) {
      setState({ checkedEndDate: true })
      return
    }

    setState({ checkedEndDate: false })
  }, [updateData])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "contract_type" && type === "change") {
        const contractTypeId = value.contract_type?.value
        if (!isEmpty(contractTypeId)) {
          defaultModuleApi
            .getDetail("contract_type", contractTypeId)
            .then((res) => {
              const data = res.data.data
              const noEndDate = data.no_end_date
              setState({
                checkedEndDate: noEndDate
              })
            })
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        onClosed={() => {
          props.onClosed()
        }}>
        <ModalHeader toggle={() => handleModal()}>
          {isEmpty(updateId) &&
            useFormatMessage("modules.contracts.buttons.add")}
          {!isEmpty(updateId) &&
            useFormatMessage("modules.contracts.buttons.update")}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Row className="my-1">
              {!isEmpty(fields) &&
                orderBy(
                  map(
                    filter(
                      fields,
                      (field) =>
                        field.field_form_show &&
                        !["employee"].includes(field.field)
                    ),
                    (field, key) => {
                      let fieldProps = {
                        module: field.moduleName,
                        fieldData: field,
                        useForm: methods,
                        options,
                        updateData: updateData?.[field.field],
                        updateDataId: updateId,
                        loading: loadingDataEdit
                      }
                      if (field.field === "contract_date_start") {
                        fieldProps = {
                          ...fieldProps,
                          disabled: updateData && updateData.active === true,
                          disabledDate: (date) => {
                            if (
                              Date.parse(moment(date).format("YYYY-MM-DD")) <=
                              Date.parse(contractMinDate)
                            ) {
                              return true
                            }

                            return false
                          }
                        }
                      }

                      if (field.field === "contract_date_end") {
                        fieldProps = {
                          ...fieldProps,
                          nolabel: false,
                          disabled: state.checkedEndDate,
                          required: !state.checkedEndDate,
                          disabledDate: (date) => {
                            if (
                              Date.parse(moment(date).format("YYYY-MM-DD")) <=
                              Date.parse(contractMinDate)
                            ) {
                              return true
                            }

                            return false
                          }
                        }
                      }

                      return (
                        <Fragment key={key}>
                          {field.field_options?.form?.break_row_before && (
                            <div className="w-100" />
                          )}
                          <Col md={field.field_form_col_size}>
                            <FieldHandle {...fieldProps} />
                          </Col>
                          {field.field_options?.form?.break_row_after && (
                            <div className="w-100" />
                          )}
                        </Fragment>
                      )
                    }
                  ),
                  (field) => parseInt(field.field_form_order),
                  "asc"
                )}
            </Row>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter>
              <Button type="submit" color="primary" disabled={state.submitting}>
                {state.submitting && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </React.Fragment>
  )
}
export default EmployeeContractModal
