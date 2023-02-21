// ** React Imports
import { useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
// ** Styles
import { Row, Col, Button } from "reactstrap"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"
import notification from "@apps/utility/notification"

const EditIntroduction = (props) => {
  const {
    // ** props
    // ** methods
    toggleEdit
  } = props

  const [loading, setLoading] = useState(false)

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const { id } = useParams()

  const onSubmit = (values) => {
    setLoading(true)
    workspaceApi
      .update(id, values)
      .then((res) => {
        notification.showSuccess()
        toggleEdit()
      })
      .catch((err) => {
        notification.showError()
      })
  }

  // ** render
  return (
    <Row className="edit-introduction">
      <Col sm="12" xs="12">
        <FormProvider {...methods}>
          <ErpInput name="introduction" type="textarea" useForm={methods} />
        </FormProvider>
      </Col>
      <Col sm="12" xs="12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button.Ripple
            type="submit"
            size="md"
            color="primary"
            disabled={loading}>
            {useFormatMessage("modules.workspace.buttons.save")}
          </Button.Ripple>
        </form>
      </Col>
    </Row>
  )
}

export default EditIntroduction
