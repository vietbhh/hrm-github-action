import React, { Fragment, useEffect, useState } from "react"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { Popover } from "antd"
import { Button, Spinner } from "reactstrap"
import { useSelector } from "react-redux"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { useForm } from "react-hook-form"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
const FastEdit = (props) => {
  const { meta, value, idUpdate, api, loadData } = props
  const [state, setState] = useMergedState({
    loading: false,
    openPop: false
  })
  const options = useSelector(
    (state) => state.app.modules[meta.moduleName].options
  )

  const methods = useForm({
    mode: "onSubmit"
  })
  const { getValues } = methods

  const onSave = (values) => {
    const data = { ...values }
    data.id = idUpdate
    if (meta?.field_type !== "switch") {
      data[meta?.field] = getValues(meta?.field)
    }
    setState({ loading: true })
    if (!api) {
      if (idUpdate) {
        defaultModuleApi
          .postSave(meta?.moduleName, data, true)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
            if (loadData) {
              loadData()
            }
            setState({ loading: false, openPop: false })
          })
          .catch((err) => {
            setState({ loading: false })
            notification.showError(useFormatMessage("notification.save.error"))
          })
      }
    } else {
      api(data)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          if (loadData) {
            loadData()
          }
          setState({ loading: false, openPop: false })
        })
        .catch((err) => {
          setState({ loading: false })
          notification.showError(useFormatMessage("notification.save.error"))
        })
    }
  }
  const content = () => {
    return (
      <div className="d-flex align-items-center">
        <FieldHandle
          module={meta?.moduleName}
          nolabel
          formGroupClass="mb-0"
          className="w-100"
          fieldData={{
            ...meta
          }}
          useForm={methods}
          updateData={value}
          options={options}
        />
        <div>
          <Button
            size="sm"
            className="ms-1 btn-tool"
            color="primary"
            type="button"
            disabled={state.loading}
            onClick={() => onSave()}>
            {state.loading && <Spinner size="sm" className="me-50" />}
            <i className="fa-regular fa-check"></i>
          </Button>
        </div>
      </div>
    )
  }
  const handleOpenChange = (open) => {
    setState({ openPop: open })
  }

  return (
    <React.Fragment>
      {meta?.field_type === "switch" && (
        <FieldHandle
          module={meta.moduleName}
          nolabel
          formGroupClass="mb-0"
          fieldData={{
            ...meta
          }}
          onChange={(e) => onSave({ [meta?.field]: e.target.checked })}
          options={options}
        />
      )}
      {meta?.field_type !== "switch" && (
        <div className="d-flex justify-content-left align-items-center text-dark">
          <Popover
            content={content()}
            className="popover-fastedit"
            overlayClassName="overlay-fastedit"
            trigger="click"
            open={state.openPop}
            onOpenChange={handleOpenChange}>
            <p className="user-name text-truncate mb-0">
              <span className="text-value-fastedit">
                {value ? value : "---"}
              </span>
            </p>
          </Popover>
        </div>
      )}
    </React.Fragment>
  )
}

export default FastEdit
