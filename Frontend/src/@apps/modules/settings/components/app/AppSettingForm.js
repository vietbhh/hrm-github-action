import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { isEmpty, map } from "lodash"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Col, Row, Spinner } from "reactstrap"
import { appSettingApi } from "../../common/api"
import { AppSettingField } from "./AppSettingField"

const AppSettingForm = (props) => {
  const { loading, fields } = props
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState } = methods

  const [state, setState] = useMergedState({
    filesWillDelete: {}
  })

  const onSubmit = (data) => {
    data.filesWillDelete = state.filesWillDelete
    appSettingApi
      .postUpdate(data)
      .then(() => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }

  const onDeleteFile = (file, fileIndex, field) => {
    const filePath = file?.url
    const newList = isEmpty(state.filesWillDelete[field])
      ? []
      : state.filesWillDelete[field]
    if (!isEmpty(filePath)) newList.push(filePath)

    setState({
      filesWillDelete: {
        [field]: newList
      }
    })
  }

  return (
    <FormProvider {...methods}>
      <Row className="w-100">
        {map(fields, (item, index) => {
          const colSize = item.size || 6
          return (
            <Col key={index} sm={12} md={colSize} className="mb-25">
              <AppSettingField
                {...item}
                useForm={methods}
                onFileDelete={onDeleteFile}
              />
            </Col>
          )
        })}
      </Row>
      <Col md={12} className="mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button
            type="submit"
            color="primary"
            disabled={
              loading || formState.isSubmitting || formState.isValidating
            }>
            {(loading || formState.isSubmitting || formState.isValidating) && (
              <Spinner size="sm" className="me-50" />
            )}
            {useFormatMessage("app.save")}
          </Button>
        </form>
      </Col>
    </FormProvider>
  )
}

export default AppSettingForm
