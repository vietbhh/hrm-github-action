import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { Fragment } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button, Card, CardBody, CardFooter, Spinner } from "reactstrap"
import { workspaceApi } from "../common/api"
import ReactHtmlParser from "react-html-parser"
import WorkspaceForm from "../components/detail/CreateWorkspace/WorkspaceForm"
const CreateWorkspace = (props) => {
  const [state, setState] = useMergedState({
    loading: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, reset } = methods
  const navigate = useNavigate()
  const onSubmit = (values) => {
    workspaceApi.save(values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      reset()
      navigate(`/workspace/${res.data._id}`)
    })
  }

  return (
    <Fragment>
      <div className="row">
        <div className="col-md-5 offset-md-3">
          <h2>
            {useFormatMessage(
              "modules.workspace.display.create_workspace_title"
            )}
          </h2>
          <p>
            {ReactHtmlParser(
              useFormatMessage("modules.workspace.display.what_is_workspace")
            )}
            <br />
            {ReactHtmlParser(
              useFormatMessage(
                "modules.workspace.display.workspace_description"
              )
            )}
          </p>
          <Card>
            <CardBody>
              <FormProvider {...methods}>
                <WorkspaceForm methods={methods} />
              </FormProvider>
            </CardBody>
            <CardFooter className="text-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Button
                  type="submit"
                  color="primary"
                  disabled={
                    state.loading ||
                    formState.isSubmitting ||
                    formState.isValidating
                  }>
                  {state.loading && <Spinner size="sm" className="me-50" />}
                  {useFormatMessage("modules.workspace.buttons.create")}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Fragment>
  )
}

export default CreateWorkspace
