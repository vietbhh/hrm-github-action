// ** React Imports
import { useEffect, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
// ** Styles
import { Row, Col, Button } from "reactstrap"
import { Space } from "antd"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"
import notification from "@apps/utility/notification"

const EditIntroduction = (props) => {
  const {
    // ** props
    id,
    api,
    introduction,
    customInputName = "introduction",
    // ** methods
    handleCancelEdit,
    setIntroduction
  } = props

  const [loading, setLoading] = useState(false)

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, reset } = methods

  const onSubmit = (values) => {
    setLoading(true)
    api(id, values)
      .then((res) => {
        notification.showSuccess()
        handleCancelEdit()
        setIntroduction(values[customInputName])
      })
      .catch((err) => {
        notification.showError()
      })
  }

  const handleClickCancel = () => {
    handleCancelEdit()
  }

  // ** effect
  useEffect(() => {
    reset({
      [customInputName]: introduction
    })
  }, [])

  // ** render
  return (
    <Row className="edit-introduction">
      <Col sm="12" xs="12">
        <FormProvider {...methods}>
          <ErpInput name={customInputName} type="textarea" useForm={methods} />
        </FormProvider>
      </Col>
      <Col sm="12" xs="12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space>
            <Button.Ripple
              type="submit"
              size="md"
              color="primary"
              disabled={loading}>
              {useFormatMessage("modules.workspace.buttons.save")}
            </Button.Ripple>
            <Button.Ripple
              type="button"
              size="md"
              color="danger"
              disabled={loading}
              onClick={() => handleClickCancel()}>
              {useFormatMessage("button.cancel")}
            </Button.Ripple>
          </Space>
        </form>
      </Col>
    </Row>
  )
}

export default EditIntroduction
