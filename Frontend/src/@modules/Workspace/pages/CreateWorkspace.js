import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { Fragment } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button, Card, CardBody, CardFooter, Spinner } from "reactstrap"
import { workspaceApi } from "../common/api"
import ReactHtmlParser from "react-html-parser"
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

  const workspace_type = [
    {
      value: "public",
      label: "Public",
      icon: "fa-regular fa-earth-asia",
      text: "Anyone can see post and activites in workspace"
    },
    {
      value: "private",
      label: "Private",
      icon: "fa-regular fa-lock",
      text: "Only member on workspace can see posts and activites"
    }
  ]

  const workspace_mode = [
    {
      value: "visible",
      label: "Visible",
      icon: "fa-regular fa-eye",
      text: "Anyone can see your workspace and request to join"
    },
    {
      value: "hidden",
      label: "Hidden",
      icon: "fa-regular fa-eye-slash",
      text: "Only administrator can add member and other unable to see workspace"
    }
  ]

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
                <ErpInput
                  name="workspace_name"
                  useForm={methods}
                  label={useFormatMessage(
                    "modules.workspace.fields.workspace_name"
                  )}
                  required
                />
                <ErpSelect
                  name="workspace_type"
                  useForm={methods}
                  label={useFormatMessage(
                    "modules.workspace.fields.workspace_type"
                  )}
                  options={workspace_type}
                  defaultValue={workspace_type[0]}
                  isClearable={false}
                  isSearchable={false}
                />
                <ErpSelect
                  name="workspace_mode"
                  useForm={methods}
                  label={useFormatMessage(
                    "modules.workspace.fields.workspace_mode"
                  )}
                  options={workspace_mode}
                  defaultValue={workspace_mode[0]}
                  isClearable={false}
                  isSearchable={false}
                />
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
