// ** React Imports
import AvatarList from "@apps/components/common/AvatarList"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import Avatar from "@apps/modules/download/pages/Avatar"
import { getOptionValue, useFormatMessage } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import AddRequestModal from "@modules/Recruitments/components/modals/AddRequestModal"
import DetailModal from "@modules/Recruitments/components/modals/DetailModal"
import { isEmpty } from "lodash-es"
import { useNavigate } from "react-router-dom"
import { Badge, Button, Col, Row, UncontrolledTooltip } from "reactstrap"
import { recruitmentsApi } from "../common/api"
import PaginationCus from "./PaginationCus"
import RequestsList from "./RequestsList"
const Recruitment = (props) => {
  // ** Props
  const { state, setState, type, data, loadData, options } = props
  const dateTimeToYMD = (date) => {
    return new Date(date).toLocaleDateString("en-CA")
  }
  const history = useNavigate()
  const renderReQuests = () => {
    return (
      <>
        {data.length ? (
          <Row>
            {data.map((item) => {
              const candiArr = []
              if (type === "jobs") {
                item.candidates.map((candi) => {
                  const ca = {
                    id: candi.id,
                    src: candi.candidate_avatar?.url,
                    title: candi.candidate_name
                  }
                  candiArr.push(ca)
                })
              }
              const stt = item.status?.value
              let classStatus = "pending"
              if (stt * 1 === getOptionValue(options, "status", "approve"))
                classStatus = "approve"
              if (stt * 1 === getOptionValue(options, "status", "decline"))
                classStatus = "decline"

              const publish_status = item.publish_status?.value

              let classPublishStatus = "light-primary"
              if (
                publish_status * 1 ===
                getOptionValue(options, "publish_status", "published")
              )
                classPublishStatus = "light-success"
              if (
                publish_status * 1 ===
                getOptionValue(options, "publish_status", "private")
              )
                classPublishStatus = "light-danger"
              return (
                <div className="col-md-6 mt-2 mb-1" key={type + item.id}>
                  <div className="request">
                    <div className="request-top d-flex">
                      <div
                        className="job-name"
                        onClick={() => handleDetail(item.id, false)}>
                        <span className="text-name">
                          {item.recruitment_code}
                        </span>
                        <div className="department d-flex">
                          <span
                            className={
                              isEmpty(item.department) ? "none" : undefined
                            }>
                            {!isEmpty(item.department)
                              ? item.department.label
                              : useFormatMessage(
                                  "modules.recruitments.text.none"
                                )}
                          </span>
                          <div className="type mt-auto ms-1 ">
                            <span className={classStatus}>
                              {!isEmpty(item.status) &&
                                useFormatMessage(item.status.label)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {type !== "jobs" ? (
                        <div className="time-request ms-auto ">
                          <div className="create-date">
                            {useFormatMessage(
                              "modules.recruitments.fields.created_at"
                            )}{" "}
                            : <span>{dateTimeToYMD(item.created_at)}</span>
                          </div>
                          <div className="due-date mt-1">
                            {useFormatMessage(
                              "modules.recruitments.fields.due_date"
                            )}{" "}
                            :{" "}
                            <span
                              className={
                                isEmpty(item.recruitment_to)
                                  ? "none"
                                  : undefined
                              }>
                              {!isEmpty(item.recruitment_to)
                                ? item.recruitment_to
                                : useFormatMessage(
                                    "modules.recruitments.text.none"
                                  )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {type === "jobs" ? (
                        <div className="request-edit ms-auto mt-2 align-self-center text-center">
                          <Badge
                            color={classPublishStatus}
                            className={"mb-1 mt-1 w-100 "}>
                            {useFormatMessage(
                              isEmpty(item.publish_status)
                                ? "modules.recruitments.text.none"
                                : item.publish_status.label
                            )}
                          </Badge>
                          <div>
                            <Button
                              color="flat-secondary"
                              className="btn-icon mr-1"
                              onClick={() => handleDetail(item.id, true)}
                              id={"btn-kanbanJ" + item.id}>
                              <i className="iconly-User3"></i>
                            </Button>

                            <Button
                              color="flat-secondary"
                              className="btn-icon"
                              onClick={() => handleDetail(item.id, false)}
                              id={"btn-detail" + item.id}>
                              <i className="fal fa-info-circle"></i>
                            </Button>
                            <UncontrolledTooltip
                              placement="top"
                              target={"btn-kanbanJ" + item.id}>
                              {useFormatMessage(
                                "modules.recruitments.text.candidates"
                              )}
                            </UncontrolledTooltip>

                            <UncontrolledTooltip
                              placement="top"
                              target={"btn-detail" + item.id}
                              className="mt-1">
                              {useFormatMessage(
                                "modules.recruitments.text.view_detail"
                              )}
                            </UncontrolledTooltip>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="request-bottom mt-1 mb-1 d-flex">
                      {type !== "jobs" ? (
                        <div
                          className="owner-request"
                          onClick={() =>
                            history("/employees/u/" + item.username)
                          }>
                          <Avatar size="xl" src="" />
                          <div className="name">{item.full_name}</div>
                          <div className="username">@{item.username}</div>
                        </div>
                      ) : (
                        ""
                      )}
                      {type === "jobs" ? (
                        <>
                          <div className="candidate-apply">
                            <div className="candidate-avatar">
                              <AvatarList
                                data={candiArr}
                                key={"avaList" + item.id}
                              />
                            </div>
                            <div className="candidate-apply">
                              <strong>{item.candidates.length}</strong>{" "}
                              {useFormatMessage(
                                "modules.recruitments.text.candidates_apply"
                              )}
                            </div>
                          </div>
                          <div className="time-request ms-auto mt-25">
                            <div className="create-date">
                              {useFormatMessage(
                                "modules.recruitments.fields.created_at"
                              )}{" "}
                              : <span>{dateTimeToYMD(item.created_at)}</span>
                            </div>
                            <div className="due-date mt-1">
                              {useFormatMessage(
                                "modules.recruitments.fields.due_date"
                              )}{" "}
                              :{" "}
                              <span
                                className={
                                  isEmpty(item.recruitment_to)
                                    ? "none"
                                    : undefined
                                }>
                                {!isEmpty(item.recruitment_to)
                                  ? item.recruitment_to
                                  : useFormatMessage(
                                      "modules.recruitments.text.none"
                                    )}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                      {type !== "jobs" && (
                        <div className="request-edit ms-auto mt-2">
                          {type === "request" && (
                            <>
                              {item?.status.value * 1 ===
                                getOptionValue(
                                  options,
                                  "status",
                                  "approve"
                                ) && (
                                <>
                                  <Button
                                    color="flat-secondary"
                                    className="btn-icon mr-1"
                                    onClick={() => handleDetail(item.id, true)}
                                    id={"btn-kanbanJ" + item.id}>
                                    <i className="iconly-User3"></i>
                                  </Button>
                                  <UncontrolledTooltip
                                    placement="top"
                                    target={"btn-kanbanJ" + item.id}>
                                    {useFormatMessage(
                                      "modules.recruitments.text.candidates"
                                    )}
                                  </UncontrolledTooltip>
                                </>
                              )}
                            </>
                          )}

                          <Button
                            color="flat-secondary"
                            className="btn-icon"
                            onClick={() => handleDetail(item.id, false)}
                            id={"btn-detail" + item.id}>
                            <i className="fal fa-info-circle"></i>
                          </Button>

                          <UncontrolledTooltip
                            placement="top"
                            target={"btn-detail" + item.id}
                            className="mt-1">
                            {useFormatMessage(
                              "modules.recruitments.text.view_detail"
                            )}
                          </UncontrolledTooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="col-12 mt-2">
              {Math.ceil(
                state.pagination.toltalRow / state.pagination.perPage
              ) > 1 && (
                <PaginationCus
                  currentPage={state.pagination.currentPage}
                  pagination={state.pagination}
                  loadData={loadData}
                />
              )}
            </div>
          </Row>
        ) : (
          <Col sm={12}>
            <EmptyContent />
          </Col>
        )}
      </>
    )
  }
  const handleDetail = (id, link = true, modal = !state.modalDetail) => {
    if (id) {
      if ((type === "jobs" || type === "request") && link) {
        history("/recruitments/jobs/" + id)
      }
      recruitmentsApi.getInfo(id).then((res) => {
        setState({ modalDetail: modal, requestDetail: res.data })
      })
    } else {
      setState({
        modalDetail: !state.modalDetail,
        requestDetail: { approved: "0" }
      })
    }
  }

  const handleNewRe = (a = true) => {
    if (a) {
      setState({
        modalAddnew: !state.modalAddnew,
        requestDetail: { approved: "0" }
      })
    } else {
      setState({
        modalAddnew: !state.modalAddnew,
        requestDetail: { ...state.requestDetail }
      })
    }
  }
  const handleEdit = (id) => {
    if (id) {
      recruitmentsApi.getInfo(id).then((res) => {
        setState({
          modalAddnew: !state.modalAddnew,
          requestDetail: res.data
        })
      })
    } else {
      setState({ modalAddnew: !state.modalAddnew })
    }
  }

  const handleDelete = (idDelete) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        defaultModuleApi
          .delete("recruitments", idDelete)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            setState({
              modalAddnew: !state.modalAddnew,
              modalDetail: !state.modalDetail,
              requestDetail: {}
            })
            loadData()
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }

  return (
    <>
      <div className="mt-2">
        {state.viewGrid ? (
          <>{renderReQuests()}</>
        ) : (
          <RequestsList
            loading={state.loading}
            data={data}
            pagination={state.pagination}
            params={state.params}
            handleDetail={handleDetail}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            loadData={loadData}
          />
        )}
      </div>
      <AddRequestModal
        modal={state.modalAddnew}
        handleNewRe={handleNewRe}
        handleDelete={handleDelete}
        handleDetail={handleDetail}
        selectedRequest={state.requestDetail}
        loadData={loadData}
      />
      <DetailModal
        modal={state.modalDetail}
        requestDetail={state.requestDetail}
        handleDetail={handleDetail}
        handleEdit={handleEdit}
        loadData={loadData}
        tab={state.tab}
      />
    </>
  )
}

export default Recruitment
