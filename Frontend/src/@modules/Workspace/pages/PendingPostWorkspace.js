import {
  ErpInput,
  ErpSelect,
  ErpSwitch
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import LoadPost from "components/hrm/LoadPost/LoadPost"
import { useEffect, Fragment } from "react"
import { FormProvider, set, useForm } from "react-hook-form"
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

import PerfectScrollbar from "react-perfect-scrollbar"
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
    listPost: [],
    sort: "desc",
    page: 1
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

  const loadData = (props) => {
    const paramsSend = {
      page: state.page,
      sort: state.sort,
      id: params.id,
      ...props
    }
    setState({ loading: true })
    workspaceApi.loadPost(paramsSend).then((res) => {
      console.log("res DetailWS", res.data.results)
      setState({
        listPost: res.data.results,
        loading: false,
        page: paramsSend.page,
        sort: paramsSend.sort
      })
    })
  }
  useEffect(() => {
    loadData()
  }, [])

  const endScrollLoad = () => {
    const page = state.page + 1
    console.log("runnnnn")
    if (state.recordsTotal > state.listPost.length) {
      loadData({ page: page, search: state.search })
    }
  }

  const handleApprove = (id, status) => {
    workspaceApi.approvePost({ id: id, approve_status: status }).then((res) => {
      loadData()
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
    })
  }
  const renderPost = (arrData = []) => {
    return arrData.map((item, key) => {
      return (
        <Card>
          <CardBody className="p-0">
            <div className="load-feed">
              <LoadPost
                data={item}
                current_url={current_url}
                offReactionAndComment={true}
              />
            </div>
            <div className="p-1 text-end d-flex">
              <Button
                type="submit"
                color="outline-secondary"
                className="me-1 w-100"
                onClick={() => handleApprove(item._id, "rejected")}
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
                onClick={() => handleApprove(item._id, "approved")}
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("button.approve")}
              </Button>
            </div>
          </CardBody>
        </Card>
      )
    })
  }
  return (
    <Fragment>
      <div className="workspace-setting row">
        <div className="col-md-5 offset-md-3">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <h4 className="w-100 ">
                  {state.listPost.length} Pending posts
                </h4>
                <ErpSelect
                  name="sort"
                  nolabel
                  useForm={methods}
                  loading={state.loading}
                  label={useFormatMessage(
                    "modules.workspace.fields.workspace_type"
                  )}
                  formGroupClass="w-100 mb-0"
                  options={workspace_type}
                  defaultValue={workspace_type[0]}
                  isClearable={false}
                  isSearchable={false}
                  onChange={(e) => loadData({ sort: e?.value })}
                />
              </div>
            </CardBody>
          </Card>
          <PerfectScrollbar
            onYReachEnd={() => console.log("reunnn")}
            style={{
              maxHeight: "500px",
              minHeight: "200px"
            }}>
            <div className="feed">{renderPost(state.listPost)}</div>
          </PerfectScrollbar>
        </div>
      </div>
    </Fragment>
  )
}

export default PendingPostWorkspace
