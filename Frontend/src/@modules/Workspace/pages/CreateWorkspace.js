import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner
} from "reactstrap"

const CreateWorkspace = (props) => {
  const [state, setState] = useMergedState({
    loading: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, setValue, getValues, watch } = methods

  const onSubmit = (values) => {
    console.log(values)
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
          <h2>Create Workspace</h2>
          <p>
            <span className="fw-bold">W</span>hat is workspace ? <br />
            <span className="fw-bold">Workspace</span> can be a department, a
            group, a project..v.v. Together sharing video and photo,
            conversation, make a plan, share your work and many other
            activities.
          </p>
          <Card>
            <CardBody>
              <FormProvider {...methods}>
                <ErpInput
                  name="workspace_name"
                  useForm={methods}
                  label="Workspace name"
                  required
                />
                <ErpSelect
                  name="workspace_type"
                  useForm={methods}
                  label="Workspace type"
                  options={workspace_type}
                  defaultValue={workspace_type[0]}
                  isClearable={false}
                  isSearchable={false}
                />
                <ErpSelect
                  name="workspace_mode"
                  useForm={methods}
                  label="Workspace mode"
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
