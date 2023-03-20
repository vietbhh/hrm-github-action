import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import classNames from "classnames"
import React from "react"
import { useForm } from "react-hook-form"
import { Row, Spinner } from "reactstrap"
import IntroductionForm from "./IntroductionForm"

const IntroductionView = (props) => {
  const {
    employeeData,
    arrField,
    title,
    classColor,
    icon,
    permits,
    options,
    loadData
  } = props
  const [state, setState] = useMergedState({
    edit: false,
    loadingSubmit: false
  })
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  // ** function
  const renderDataField = (field, type) => {
    if (type === "select_option") {
      if (employeeData[field]?.label) {
        return useFormatMessage(employeeData[field].label)
      }
    }

    if (type === "select_module") {
      if (employeeData[field]?.label) {
        return employeeData[field].label
      }
    }

    if (type !== "select_option" && type !== "select_module") {
      return employeeData[field] === "" || employeeData[field] === null
        ? "-"
        : employeeData[field]
    }

    return "-"
  }

  const onSubmitFrm = (values) => {
    setState({ loadingSubmit: true })
    employeesApi
      .postUpdate(employeeData.id, values)
      .then(async (res) => {
        await loadData()
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loadingSubmit: false, edit: false })
      })
      .catch((err) => {
        setState({ loadingSubmit: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  return (
    <div className="user-information">
      <div className={`user__header border-left-${classColor}`}>
        <div className={`menu-icon ${classColor}`}>{icon}</div>
        <span className="title">{title}</span>
        {permits.update && (
          <div className="div-button">
            {!state.edit ? (
              <button
                type="button"
                className="btn-edit"
                onClick={() => setState({ edit: true })}>
                <i className="fa-light fa-pencil me-50"></i>
                {useFormatMessage("button.edit")}
              </button>
            ) : (
              <form
                className="col-12 text-center"
                onSubmit={handleSubmit(onSubmitFrm)}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setState({ edit: false })}
                  disabled={state.loadingSubmit}>
                  {useFormatMessage("button.cancel")}
                </button>

                <button
                  type="submit"
                  className="btn-save"
                  disabled={state.loadingSubmit}>
                  {state.loadingSubmit && (
                    <Spinner size="sm" className="me-50" />
                  )}
                  {useFormatMessage("button.save")}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      <div className="user__body">
        {!state.edit ? (
          <Row>
            {_.map(arrField, (field, index) => {
              return (
                <div
                  key={index}
                  className={classNames(`col-md-12`, {
                    "height-55": field.field_type !== "textarea"
                  })}>
                  <div className="form-group row">
                    <label className="col-form-label col-md-3 form-label">
                      {useFormatMessage(
                        `modules.employees.fields.${field.field}`
                      )}
                    </label>
                    <div className="col-md-9">
                      <span className="text">
                        {renderDataField(field.field, field.field_type)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </Row>
        ) : (
          <IntroductionForm
            employeeData={employeeData}
            arrField={arrField}
            options={options}
            methods={methods}
            setValue={setValue}
          />
        )}
      </div>
    </div>
  )
}

export default IntroductionView
