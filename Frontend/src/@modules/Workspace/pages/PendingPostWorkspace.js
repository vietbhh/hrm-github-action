import {
  ErpInput,
  ErpSelect,
  ErpSwitch
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import LoadPost from "components/hrm/LoadPost/LoadPost"
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
    label: "Newest first"
  },
  {
    value: "asc",
    label: "Oldest first"
  }
]

const PendingPostWorkspace = () => {
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    tabActive: 1,
    detailWorkspace: {},
    loading: false,
    listPost: []
  })

  const current_url = window.location.pathname
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
    workspaceApi
      .loadPost({ id: params.id, page: 1, sort: "desc" })
      .then((res) => {
        console.log("res DetailWS", res.data.results)
        setState({ listPost: res.data.results, loading: false })
      })
  }
  useEffect(() => {
    loadData()
  }, [])
  const renderPost = (arrData = []) => {
    return arrData.map((item, key) => {
      return (
        <div className="load-feed">
          <LoadPost data={item} current_url={current_url} />
          asd
        </div>
      )
    })
  }
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
          <div className="feed">{renderPost(state.listPost)}</div>

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
