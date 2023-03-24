import { ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import LoadPost from "components/hrm/LoadPost/LoadPost"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, Spinner } from "reactstrap"
import { workspaceApi } from "../common/api"

import PerfectScrollbar from "react-perfect-scrollbar"
import SwAlert from "@apps/utility/SwAlert"
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
    page: 1,
    recordsTotal: 0,
    pageLength: 10
  })

  const current_url = window.location.pathname
  const params = useParams()
  const navigate = useNavigate()
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, reset } = methods

  const loadData = (props) => {
    const paramsSend = {
      page: state.page,
      sort: state.sort,
      id: params.id,
      pageLength: state.pageLength,
      ...props
    }
    setState({ loading: true })
    workspaceApi.loadPost(paramsSend).then((res) => {
      setState({
        listPost: res.data.results,
        loading: false,
        page: paramsSend.page,
        sort: paramsSend.sort,
        recordsTotal: res.data.recordsTotal
      })
    })
  }
  useEffect(() => {
    loadData()
  }, [])

  const endScrollLoad = () => {
    const page = state.page + 1
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

  const handleApproveAll = (id, status) => {
    const textBtn = "modules.workspace.buttons.approve_all_posts"
    if (status === "rejected") {
      textBtn = "modules.workspace.buttons.reject_all_posts"
    }
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage(textBtn)
    }).then((res) => {
      if (res.value) {
        console.log("status", status)
        return
        workspaceApi
          .approvePost({ id: id, approve_status: status })
          .then((res) => {
            loadData()
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
          })
      }
    })
  }
  const renderPost = (arrData = []) => {
    return arrData.map((item, key) => {
      return (
        <Card key={key}>
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
                  <span className="me-50">{state.listPost.length}</span>
                  {useFormatMessage("modules.workspace.text.pending_posts")}
                </h4>
                <ErpSelect
                  name="sort"
                  nolabel
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
            <div className="p-1 text-end d-flex">
              <Button
                type="submit"
                color="outline-secondary"
                className="me-1 w-100"
                onClick={() => handleApproveAll(params.id, "rejected")}
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("modules.workspace.buttons.reject_all_posts")}
              </Button>
              <Button
                type="submit"
                color="primary"
                className="ms-auto w-100"
                onClick={() => handleApproveAll(params.id, "approved")}
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage(
                  "modules.workspace.buttons.approve_all_posts"
                )}
              </Button>
            </div>
          </Card>
          {state.listPost.length <= 0 && (
            <div className="text-center mt-2 ">
              <h4 className="mb-2">
                {useFormatMessage("modules.workspace.text.no_pending_posts")}
              </h4>
              <Link to={`/workspace/${params.id}`}>
                <Button color="primary">
                  {useFormatMessage("modules.workspace.text.view_other_posts")}
                </Button>
              </Link>
            </div>
          )}
          {state.listPost.length > 0 && (
            <div className="feed w-100">
              <PerfectScrollbar
                onYReachEnd={() => endScrollLoad()}
                style={{
                  maxHeight: "750px",
                  minHeight: "200px"
                }}>
                {renderPost(state.listPost)}
              </PerfectScrollbar>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default PendingPostWorkspace