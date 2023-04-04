// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { Link } from "react-router-dom"
// ** Styles
import { Row, Col, Button, Spinner, Card, CardBody } from "reactstrap"
// ** Components
import WorkspaceItem from "./WorkspaceItem"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const WorkspaceManaged = (props) => {
  const {
    // ** props
    title,
    workspaceType,
    customLimit,
    customUserId
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    data: [],
    totalPage: 0,
    showLoadMore: true,
    filter: {
      page: 1,
      limit: 4,
      workspace_type: workspaceType
    }
  })

  const loadData = () => {
    setState({
      loading: true
    })

    const params = {
      ...state.filter
    }

    if (customLimit !== undefined) {
      params["limit"] = customLimit
    }

    if (customUserId !== undefined) {
      params['user_id'] = customUserId
    }

    workspaceApi
      .getList(params)
      .then((res) => {
        setTimeout(() => {
          setState({
            data: [...state.data, ...res.data.results],
            totalPage: res.data.total_page,
            loading: false
          })
        }, 300)
      })
      .catch((err) => {
        setState({
          data: [],
          totalPage: 0,
          loading: false
        })
      })
  }

  const handleCLickLoadMore = () => {
    setState({
      filter: {
        ...state.filter,
        page: state.filter.page + 1
      }
    })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

  useEffect(() => {
    if (state.loading === false) {
      setState({
        showLoadMore: state.filter.page < state.totalPage
      })
    }
  }, [state.loading, state.filter])

  // ** render
  const renderLoading = () => {
    if (!state.loading) {
      return ""
    }

    return (
      <div className="d-flex align-items-center justify-content-center loading-component">
        <AppSpinner />
      </div>
    )
  }

  const renderLoadMore = () => {
    if (!state.showLoadMore) {
      return ""
    }

    return (
      <Row>
        <Col
          sm={12}
          xs={12}
          className="w-100 d-flex align-items-end justify-content-end">
          <Button.Ripple
            color="flat-info"
            disabled={state.loading}
            onClick={() => handleCLickLoadMore()}>
            {state.loading ? (
              <Spinner size="sm" className="me-50" />
            ) : (
              <i className="fas fa-angle-down me-50" />
            )}
            {useFormatMessage("modules.workspace.buttons.load_more")}
          </Button.Ripple>
        </Col>
      </Row>
    )
  }

  const renderContent = () => {
    if (state.data.length === 0 && state.loading === false) {
      return (
        <Card>
          <CardBody>
            {useFormatMessage("modules.workspace.text.empty_workspace")}{" "}
            <Link to="/workspace/create">
              {useFormatMessage("modules.workspace.text.create_new_workspace")}
            </Link>
          </CardBody>
        </Card>
      )
    }

    return (
      <Row>
        {state.data.map((item) => {
          return (
            <Col
              sm="3"
              xs="12"
              className=""
              key={`work-space-item-${item._id}`}>
              <WorkspaceItem workspace={item} />
            </Col>
          )
        })}
      </Row>
    )
  }

  const renderTitle = () => {
    if (title === undefined) {
      return ""
    }

    return <h3 className="mb-2 work-space-title">{title}</h3>
  }

  return (
    <div className="p-1 workspace-container">
      <div>
        <div>
          <Fragment>{renderTitle()}</Fragment>
        </div>
        <div>
          <Fragment>{renderContent()}</Fragment>
        </div>
        <Fragment>{renderLoading()}</Fragment>
        <Fragment>{renderLoadMore()}</Fragment>
      </div>
    </div>
  )
}

export default WorkspaceManaged
