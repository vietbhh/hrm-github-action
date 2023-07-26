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
    showMapAddress = false,
    loadData
  } = props
  const [state, setState] = useMergedState({
    edit: false,
    loadingSubmit: false,
    employeeAddress: {}
  })
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  const setEmployeeAddress = (obj) => {
    setState({
      employeeAddress: {
        ...state.employeeAddress,
        ...obj
      }
    })
  }

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
    const newAddress = {}
    _.map(state.employeeAddress, (item, index) => {
      newAddress[index] = JSON.stringify(item)
    })
    const submitValues = {
      ...values,
      ...newAddress
    }

    employeesApi
      .postUpdate(employeeData.id, submitValues)
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
      <div className={`ps-2 pt-1 user__header`}>
        <div className={`menu-icon ${classColor}`}>{icon}</div>
        <span className="title">{title}</span>
        {permits.update && (
          <div className="div-button">
            {!state.edit ? (
              <button
                type="button"
                className="btn-edit"
                onClick={() => setState({ edit: true })}>
                {useFormatMessage("button.update")}
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
      <div className="p-4 pt-2 pb-3 w-75 user__body">
        <IntroductionForm
          employeeData={employeeData}
          arrField={arrField}
          options={options}
          methods={methods}
          isEdit={state.edit}
          showMapAddress={showMapAddress}
          setValue={setValue}
          setEmployeeAddress={setEmployeeAddress}
        />
      </div>
    </div>
  )
}

export default IntroductionView
