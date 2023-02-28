import {
  ErpInput,
  ErpSelect,
  ErpSwitch
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { useEffect, Fragment } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import {
  Card,
  CardBody,
  CardTitle,
  TabContent,
  TabPane,
  CardHeader,
  Row,
  Col,
  CardFooter,
  Button,
  Spinner
} from "reactstrap"
import { workspaceApi } from "../common/api"
import TabFeed from "../components/detail/TabFeed/TabFeed"
import WorkspaceHeader from "../components/detail/WorkspaceHeader"
const findKeyByValue = (arr = [], value) => {
  const index = arr.findIndex((p) => p.value === value)
  return index
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

const membership_approval = [
  {
    value: "approver",
    label: "Admin",
    icon: "fa-sharp fa-solid fa-shield-plus",
    text: "Only administrators can approve joining group request"
  },
  {
    value: "auto",
    label: "Automatically approve",
    icon: "fa-duotone fa-unlock",
    text: "Automatically approve all joining group request"
  }
]

const SettingWorkspace = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    tabActive: 1,
    detailWorkspace: {},
    loading: false
  })
  const params = useParams()
  const navigate = useNavigate()
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, reset } = methods
  const onSubmit = (values) => {
    values._id = params.id
    console.log("values", values)
    workspaceApi.update(values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      reset()
      navigate(`/workspace/${res.data._id}`)
    })
  }

  const loadData = () => {
    setState({ loading: true })
    workspaceApi.getDetailWorkspace(params.id).then((res) => {
      console.log("res DetailWS", res.data)
      setState({ detailWorkspace: res.data, loading: false })
    })
  }
  console.log("detailWorkspace", state.detailWorkspace)
  useEffect(() => {
    loadData()
  }, [])

  return (
    <Fragment>
      <div className="workspace-setting row">
        <div className="col-md-5 offset-md-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {useFormatMessage(
                  "modules.workspace.display.workspace_infomation"
                )}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <FormProvider {...methods}>
                <ErpInput
                  name="name"
                  useForm={methods}
                  label={useFormatMessage(
                    "modules.workspace.fields.workspace_name"
                  )}
                  defaultValue={state.detailWorkspace?.name}
                  loading={state.loading}
                  required
                />
                <ErpSelect
                  name="type"
                  useForm={methods}
                  loading={state.loading}
                  label={useFormatMessage(
                    "modules.workspace.fields.workspace_type"
                  )}
                  options={workspace_type}
                  defaultValue={
                    state.detailWorkspace?.type
                      ? workspace_type[
                          findKeyByValue(
                            workspace_type,
                            state.detailWorkspace?.type
                          )
                        ]
                      : workspace_type[0]
                  }
                  isClearable={false}
                  isSearchable={false}
                />
                <ErpSelect
                  name="mode"
                  useForm={methods}
                  loading={state.loading}
                  label={useFormatMessage(
                    "modules.workspace.fields.workspace_mode"
                  )}
                  options={workspace_mode}
                  defaultValue={
                    state.detailWorkspace?.mode
                      ? workspace_mode[
                          findKeyByValue(
                            workspace_mode,
                            state.detailWorkspace?.mode
                          )
                        ]
                      : workspace_mode[0]
                  }
                  isClearable={false}
                  isSearchable={false}
                />
              </FormProvider>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {useFormatMessage(
                  "modules.workspace.display.workspace_settings"
                )}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <FormProvider {...methods}>
                <ErpSelect
                  name="membership_approval"
                  useForm={methods}
                  loading={state.loading}
                  label={useFormatMessage(
                    "modules.workspace.fields.membership_approval"
                  )}
                  options={membership_approval}
                  defaultValue={
                    state.detailWorkspace?.membership_approval
                      ? membership_approval[
                          findKeyByValue(
                            membership_approval,
                            state.detailWorkspace?.membership_approval
                          )
                        ]
                      : membership_approval[0]
                  }
                  isClearable={false}
                  isSearchable={false}
                />
                <div className="mt-2 field_switch">
                  <div>
                    <div className="label">Review post</div>
                    <div className="sub-label">
                      All member posts must be approved by administrator
                    </div>
                  </div>
                  <ErpSwitch
                    formGroupClass="ms-auto mb-0"
                    name="review_post"
                    useForm={methods}
                    loading={state.loading}
                    defaultValue={state.detailWorkspace?.review_post}
                  />
                </div>
              </FormProvider>
            </CardBody>
            <CardFooter className="text-end">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Button
                  type="submit"
                  color="success"
                  className="ms-auto"
                  disabled={
                    state.loading ||
                    formState.isSubmitting ||
                    formState.isValidating
                  }>
                  {state.loading && <Spinner size="sm" className="me-50" />}
                  {useFormatMessage("button.save")}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Fragment>
  )
}

export default SettingWorkspace
