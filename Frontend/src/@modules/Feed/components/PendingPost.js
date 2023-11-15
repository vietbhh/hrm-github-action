import LoadPost from "@/components/hrm/LoadPost/LoadPost"
import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { Fragment, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { Button, Card, CardBody, Col, Row, Spinner } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import { workspaceApi } from "../../Workspace/common/api"
import PostApprovalSettingModal from "./modals/PostApprovalSettingModal"
import { useSelector } from "react-redux"
import { handleLoadAttachmentThumb } from "../common/common"
import UnavailableData from "./UnavailableData"
import { isMobileView } from "../../Workspace/common/common"

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
const PendingPost = (props) => {
  const userData = useSelector((state) => state.auth.userData)
  const cover = userData?.cover || ""
  const { loadPost, idWorkspace } = props
  const [state, setState] = useMergedState({
    prevScrollY: 0,
    tabActive: 1,
    detailWorkspace: {},
    loading: false,
    listPost: [],
    sort: "desc",
    page: 1,
    recordsTotal: 0,
    pageLength: 10,
    settingModal: false,
    statusButtonModal: true
  })

  const current_url = window.location.pathname
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, reset } = methods
  const loadData = (props) => {
    const paramsSend = {
      page: state.page,
      sort: state.sort,
      id: idWorkspace,
      pageLength: state.pageLength,
      ...props
    }
    setState({ loading: true })
    loadPost(paramsSend).then(async (res) => {
      const data_attachment = res.data.results.map(async (item) => {
        let newProperties = await handleLoadAttachmentThumb(item, cover)

        return {
          ...item,
          ...newProperties
        }
      })

      Promise.all(data_attachment).then((values) => {
        setState({
          listPost: values,
          loading: false,
          page: paramsSend.page,
          sort: paramsSend.sort,
          recordsTotal: res.data.recordsTotal
        })
      })
    })
  }
  useEffect(() => {
    loadData()
  }, [])

  const typingTimeoutRef = useRef(null)
  const handleFilterText = (e) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadData({ search: e, page: 1 })
    }, 500)
  }

  const endScrollLoad = () => {
    const page = state.page + 1
    if (state.recordsTotal > state.listPost.length) {
      loadData({ page: page, search: state.search })
    }
  }

  const handleApprove = (id, status) => {
    workspaceApi
      .approvePost({ id: id, approve_status: status, idWorkspace: idWorkspace })
      .then((res) => {
        loadData()
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
  }

  const handleApproveAll = (id, status) => {
    let textBtn = "modules.workspace.buttons.approve_all_posts"
    if (status === "rejected") {
      textBtn = "modules.workspace.buttons.decline_all"
    }

    SwAlert.showWarning({
      confirmButtonText: useFormatMessage(textBtn)
    }).then((res) => {
      if (res.value) {
        workspaceApi
          .approvePost({
            id: id,
            idWorkspace: id,
            approve_status: status,
            all: true
          })
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
      item.permission = " "
      return (
        <Card key={key}>
          <CardBody className="p-0">
            <div>
              <LoadPost
                data={item}
                current_url={current_url}
                offReactionAndComment={true}
              />
            </div>
            <div className="text-end d-flex">
              <Button
                type="submit"
                color="primary"
                className="btn-approve w-100"
                onClick={() => handleApprove(item._id, "approved")}
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("button.approve")}
              </Button>

              <Button
                type="submit"
                color="secondary"
                className="btn-approve bg-secondary ms-1 w-100"
                onClick={() => handleApprove(item._id, "declined")}
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("modules.workspace.buttons.decline")}
              </Button>
            </div>
          </CardBody>
        </Card>
      )
    })
  }
  const handleSettingModal = () => {
    setState({ settingModal: !state.settingModal })
  }

  const statusButtonSettingModal = () => {
    setState({ statusButtonModal: !state.statusButtonModal })
  }

  return (
    <Fragment>
      <div className="workspace-pending-post row">
        <div className="col-md-12 feed mb-1">
          <Card>
            <CardBody>
              <div className="d-flex align-items-center">
                <h4 className="w-100 num_of_pending">
                  {state.listPost.length !== 0 ? (
                    <>
                      <span className="me-50">{state.listPost.length}</span>
                      {!isMobileView()
                        ? useFormatMessage(
                            "modules.workspace.text.pending_posts"
                          )
                        : "Pending"}
                    </>
                  ) : (
                    useFormatMessage(
                      "modules.workspace.text.pending_posts_empty"
                    )
                  )}
                </h4>
                <div className="w-100 text-end d-flex ms-auto ">
                  <Button
                    type="submit"
                    color="primary"
                    className="btn-action-primary me-1 ms-auto"
                    onClick={() => handleApproveAll(idWorkspace, "approved")}
                    disabled={state.listPost.length === 0}>
                    {state.loading && <Spinner size="sm" className="me-50" />}
                    {useFormatMessage(
                      "modules.workspace.buttons.approve_all_posts"
                    )}
                  </Button>
                  <Button
                    type="submit"
                    color="secondary"
                    className="btn-action-secondary "
                    onClick={() => handleApproveAll(idWorkspace, "rejected")}
                    disabled={state.listPost.length === 0}>
                    {state.loading && <Spinner size="sm" className="me-50" />}
                    {useFormatMessage(
                      "modules.workspace.buttons.decline_all_posts"
                    )}
                  </Button>
                  {!idWorkspace && (
                    <Button
                      style={{ maxWidth: "50px" }}
                      color="secondary"
                      className="ms-1 btn-action-secondary "
                      onClick={() => handleSettingModal()}
                      disabled={state.statusButtonModal}>
                      <i className="fa-light fa-gear"></i>
                    </Button>
                  )}
                </div>
              </div>
              <Row style={{ height: "40px" }}>
                <Col xs="6" md="4">
                  <ErpSelect
                    name="sort"
                    nolabel
                    loading={state.loading}
                    label={useFormatMessage(
                      "modules.workspace.fields.workspace_type"
                    )}
                    className="select_bg-secondary workspace-setting-select_bg-secondary"
                    formGroupClass="mb-0"
                    options={workspace_type}
                    defaultValue={workspace_type[0]}
                    isClearable={false}
                    isSearchable={false}
                    onChange={(e) => loadData({ sort: e?.value })}
                  />
                </Col>
                <Col xs="6" md="8" className="search_post_pending mt-0">
                  <ErpInput
                    nolabel
                    placeholder="Find a post"
                    prepend={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none">
                        <path
                          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22 22L20 20"
                          stroke="#696760"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                    onChange={(e) => handleFilterText(e.target.value)}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
        {state.listPost.length <= 0 && (
          <div className="text-center mt-2 ">
            <UnavailableData />
          </div>
        )}
        <div className="col-md-12 ">
          {state.listPost.length > 0 && (
            <div className="feed  w-100">
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

      <PostApprovalSettingModal
        modal={state.settingModal}
        handleModal={handleSettingModal}
        statusButtonSettingModal={statusButtonSettingModal}
      />
    </Fragment>
  )
}

export default PendingPost
