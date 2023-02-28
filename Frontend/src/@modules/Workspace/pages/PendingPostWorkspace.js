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
    value: "desc",
    label: "Newest first",
    icon: "",
    text: ""
  },
  {
    value: "asc",
    label: "Oldest first",
    icon: "",
    text: ""
  }
]

const PendingPostWorkspace = () => {
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
            <CardBody>
              <ErpSelect
                name="type"
                nolabel
                useForm={methods}
                loading={state.loading}
                label={useFormatMessage(
                  "modules.workspace.fields.workspace_type"
                )}
                options={workspace_type}
                defaultValue={workspace_type[0]}
                isClearable={false}
                isSearchable={false}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>POst</CardBody>
            <CardFooter className="text-end d-flex">
              <Button
                type="submit"
                color="outline-secondary"
                className="me-1 w-100"
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("button.reject")}
              </Button>
              <Button
                type="submit"
                color="primary"
                className="ms-auto w-100"
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("button.approve")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Fragment>
  )
}

export default PendingPostWorkspace
