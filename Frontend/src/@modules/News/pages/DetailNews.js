import { ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { canDeleteData, canUpdateData } from "@apps/utility/permissions"
import SwAlert from "@apps/utility/SwAlert"
import classNames from "classnames"
import draftToHtml from "draftjs-to-html"
import { isEmpty } from "lodash"
import { Fragment, useContext, useEffect } from "react"
import { ArrowLeft } from "react-feather"
import { FormProvider, useForm } from "react-hook-form"
import ReactHtmlParser from "react-html-parser"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { newsApi } from "../common/api"
import AddNewsModal from "../components/modals/AddNewsModal"
import EditNewCommentModal from "../components/modals/EditNewCommentModal"

const DetailNews = (props) => {
  const [state, setState] = useMergedState({
    loadingPage: false,
    data: [],
    canDelete: false,
    canUpdate: false,
    modal: false,
    modalTitle: useFormatMessage("modules.news.buttons.edit"),
    newsId: 0,

    // comment
    canDeleteComment: false,
    loading: false,
    showComment: false,
    totalComment: 0,
    dataNewComments: [],
    hasMore: false,
    page: 1,
    loadingLoadMore: false,
    editModal: false,
    editCommentId: 0,
    editCommentText: ""
  })
  const { id } = useParams()
  const ability = useContext(AbilityContext)
  const userId = useSelector((state) => state.auth.userData.id) || 0
  const moduleData = useSelector((state) => state.app.modules.news)
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const module = moduleData.config
  const metas = moduleData.metas
  const options = moduleData.options
  const history = useNavigate()

  const loadData = () => {
    setState({ loadingPage: true })
    newsApi.getNewsDetail(id).then((res) => {
      const data = res.data
      setState({
        loadingPage: false,
        data: data,
        canDelete: canDeleteData(ability, "news", userId, data),
        canUpdate: canUpdateData(ability, "news", userId, data),
        canDeleteComment: canDeleteData(ability, "new_comments", userId, data),
        totalComment: data.total_comment,
        dataNewComments: data.newComments.results,
        hasMore: data.newComments.hasMore,
        page: data.newComments.page
      })
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const checkShowContent = (props) => {
    try {
      const json = JSON.parse(state.data.content)
      return ReactHtmlParser(draftToHtml(json))
    } catch (e) {
      return ""
    }
  }

  const handleDeleteClick = () => {
    if (!isEmpty(id)) {
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete"),
        html: ""
      }).then((res) => {
        if (res.value) {
          _handleDeleteClick(id)
        }
      })
    }
  }

  const _handleDeleteClick = (id) => {
    newsApi
      .deleteNews(id)
      .then((result) => {
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
        history("/news")
      })
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }

  const toggleAddModal = (props) => {
    setState({
      modal: !state.modal,
      newsId: props
    })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    values.id = state.data.id
    setState({ loading: true })
    newsApi
      .postSaveComment(values)
      .then((res) => {
        setState({
          dataNewComments: res.data.results,
          totalComment: res.data.total_comment,
          hasMore: res.data.hasMore,
          page: res.data.page,
          showComment: false,
          loading: false
        })
      })
      .catch((err) => {
        setState({ loading: false })
      })
  }

  const loadMoreComment = () => {
    setState({ loadingLoadMore: true })
    const param = {
      id: state.data.id,
      page: state.page
    }
    newsApi
      .getLoadMoreComments(param)
      .then((res) => {
        setState({
          dataNewComments: [...state.dataNewComments, ...res.data.results],
          hasMore: res.data.hasMore,
          page: res.data.page,
          loadingLoadMore: false
        })
      })
      .catch((err) => {
        setState({ loadingLoadMore: false })
      })
  }

  const toggleEditModal = (id = 0, text = "") => {
    setState({
      editModal: !state.editModal,
      editCommentId: id,
      editCommentText: text
    })
  }

  const deleteComment = (id) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete"),
      html: ""
    }).then((res) => {
      if (res.value) {
        newsApi
          .deleteNewComment(id)
          .then((res) => {
            setState({
              dataNewComments: res.data.results,
              totalComment: res.data.total_comment,
              hasMore: res.data.hasMore,
              page: res.data.page
            })
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.save.error")
            })
          })
      }
    })
  }

  return (
    <Fragment>
      <Card className="news">
        <CardBody style={{ padding: 0 }}>
          <div className="d-flex flex-wrap w-100">
            <div className="d-flex align-items-center">
              <Link to="/news">
                <Button.Ripple color="flat-dark" size="md">
                  <ArrowLeft size={12} /> {useFormatMessage("app.back")}
                </Button.Ripple>
              </Link>
            </div>
            <div className="d-flex ms-auto align-items-center">
              {state.canUpdate ? (
                <button
                  className="btn button-action button-action-edit"
                  onClick={() => {
                    toggleAddModal(id)
                  }}>
                  <i className="far fa-edit"></i>
                </button>
              ) : (
                ""
              )}

              {state.canDelete ? (
                <button
                  className="btn button-action button-action-delete"
                  onClick={() => {
                    handleDeleteClick()
                  }}>
                  <i className="far fa-trash"></i>
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="news">
        <CardBody>
          {!isEmpty(state.data) && (
            <Row>
              <Col xs="12" style={{ marginBot: "10px !important" }}>
                {state.data.important ? (
                  <span className="news-flag">
                    <i className="fas fa-flag"></i>
                  </span>
                ) : (
                  ""
                )}

                <h3 className="inline-block me-1">{state.data.title}</h3>
                <div
                  className={classNames("bg-status", {
                    [` bg-status-${state.data.status.name_option}`]: true
                  })}>
                  {useFormatMessage(state.data.status.label)}
                </div>
              </Col>
              <Col xs="12">
                <i className="fas fa-clock" style={{ marginRight: "7px" }}></i>
                <span className="span-date">
                  {timeDifference(state.data.created_at)}
                </span>
                <span style={{ margin: "0px 10px" }}>|</span>
                <span>{state.data.created_by.label}</span>
              </Col>
              <Col xs="12" style={{ marginTop: "20px" }}>
                {checkShowContent()}
              </Col>
            </Row>
          )}

          {state.loadingPage && (
            <Row>
              <Col size="12" className="text-center mt-1 mb-3">
                <Spinner size="sm" className="me-50" />
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>

      <Card className="news">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            <h1 className="card-title">
              <span className="title-icon">
                <i className="fa-regular fa-comment"></i>
              </span>
              <span>{useFormatMessage("modules.news.comment.title")}</span>
            </h1>
            <div className="ms-auto">
              <span className="text-nowrap color-primary">
                <i className="fa-solid fa-comment"></i>
                <span className="text-muted ms-50">{state.totalComment}</span>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {_.map(state.dataNewComments, (item, index) => {
            return (
              <Row key={index}>
                <Col sm={12}>
                  <div className="d-flex align-items-start w-100 mb-2">
                    <div className="avatar mt-50 me-75">
                      <Avatar className="img" src={item.avatar} />
                    </div>
                    <div className="profile-user-info w-100">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="mb-0">{item.full_name}</h6>
                        <div className="div-action-comment">
                          {userId.toString() === item.owner.toString() && (
                            <Button
                              type="button"
                              color="warning"
                              outline
                              className="btn-action-comment me-25"
                              onClick={() => {
                                toggleEditModal(item.id, item.comment)
                              }}>
                              <i className="fa-solid fa-edit"></i>
                            </Button>
                          )}

                          {(state.canDeleteComment ||
                            userId.toString() === item.owner.toString()) && (
                            <Button
                              type="button"
                              color="danger"
                              outline
                              className="btn-action-comment"
                              onClick={() => {
                                deleteComment(item.id)
                              }}>
                              <i className="fa-solid fa-times"></i>
                            </Button>
                          )}
                        </div>
                      </div>
                      <span style={{ whiteSpace: "pre-line" }}>
                        {item.comment}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            )
          })}
          {state.hasMore && state.loadingLoadMore && <Spinner size="sm" />}
          {state.hasMore && !state.loadingLoadMore && (
            <Row>
              <Col sm={12}>
                <p
                  className="text-load-more-comments"
                  onClick={() => {
                    loadMoreComment()
                  }}>
                  {useFormatMessage("modules.news.load_more_comments")}
                </p>
              </Col>
            </Row>
          )}
          <Row>
            <Col sm={12}>
              <p
                className="right p-add-comment"
                onClick={() => {
                  setState({ showComment: !state.showComment })
                }}>
                {useFormatMessage("modules.news.comment.add_comment")}
              </p>
            </Col>
          </Row>
          {state.showComment && (
            <Row>
              <Col sm={12}>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <ErpInput
                      type="textarea"
                      useForm={methods}
                      name="comment"
                      defaultValue={""}
                      nolabel
                      placeholder={useFormatMessage(
                        "modules.news.comment.add_comment"
                      )}
                      rows={3}
                      required={true}
                    />
                    <Button
                      type="submit"
                      color="primary"
                      disabled={state.loading}>
                      {state.loading && <Spinner size="sm" className="me-50" />}
                      {useFormatMessage("modules.news.comment.post_comment")}
                    </Button>
                  </form>
                </FormProvider>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>

      <AddNewsModal
        modal={state.modal}
        toggleAddModal={toggleAddModal}
        loadData={loadData}
        metas={metas}
        options={options}
        module={module}
        optionsModules={optionsModules}
        modalTitle={state.modalTitle}
        newsId={state.newsId}
      />

      <EditNewCommentModal
        editModal={state.editModal}
        toggleEditModal={toggleEditModal}
        editCommentId={state.editCommentId}
        editCommentText={state.editCommentText}
        dataNewComments={state.dataNewComments}
        setDataNewComments={(dataNewComments) => {
          setState({ dataNewComments: dataNewComments })
        }}
      />
    </Fragment>
  )
}

export default DetailNews
