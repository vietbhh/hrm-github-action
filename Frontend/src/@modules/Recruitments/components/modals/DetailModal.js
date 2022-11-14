import {
  useFormatMessage,
  useMergedState,
  getOptionValue
} from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { canUpdateData } from "@apps/utility/permissions"
import SwAlert from "@apps/utility/SwAlert"
import { isEmpty } from "lodash-es"
import React, { useContext } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { recruitmentsApi } from "../../common/api"
const DetailModal = (props) => {
  const moduleName = "recruitments"
  const { modal, handleDetail, handleEdit, requestDetail, loadData, tab } =
    props
  const [state, setState] = useMergedState({
    loading: false
  })
  const ability = useContext(AbilityContext)
  const userId = useSelector((state) => state.auth.userData.id) || 0
  const modules = useSelector((state) => state.app.modules.recruitments)
  const options = modules.options
  const canUpdate = canUpdateData(ability, moduleName, userId, requestDetail)
  const onSubmit = (values) => {
    setState({ loading: true })
    recruitmentsApi
      .saveApprove(values.id, { status: values.status })
      .then((res) => {
        notification.showSuccess({
          text:
            values.status === getOptionValue(options, "status", "approve")
              ? useFormatMessage("notification.approve")
              : useFormatMessage("notification.decline")
        })
        setState({ loading: false })
        handleDetail(!modal)
        loadData()
      })
      .catch((err) => {
        //props.submitError();
        setState({ loading: false })
        console.log(err)
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }
  const handleApprove = (e) => {
    const data = { ...requestDetail }
    data.status = e
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage(approveStatus(e))
    }).then((res) => {
      if (res.value) {
        setState({
          modalAddnew: !state.modalAddnew,
          requestDetail: {}
        })
        onSubmit(data)
      }
    })
  }

  const handleCloseJob = (idJob) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.close")
    }).then((res) => {
      if (res.value) {
        recruitmentsApi
          .saveRequest({
            id: idJob,
            status: getOptionValue(options, "status", "closed"),
            recruitment_code: requestDetail.recruitment_code
          })
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
            handleDetail(!modal)
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
  const dateTimeToYMD = (date) => {
    return new Date(date).toLocaleDateString("en-CA")
  }

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  const approveStatus = (
    status,
    approved = requestDetail.userapproved || ""
  ) => {
    if (status === getOptionValue(options, "status", "approve")) {
      return "button.approve"
    } else if (status === getOptionValue(options, "status", "decline")) {
      return "button.decline"
    } else {
      return (
        "button.cancel_" +
        (approved === getOptionValue(options, "status", "approve")
          ? "approve"
          : "decline")
      )
    }
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  if (requestDetail) {
    const sendTo = () => {
      const reIcon = (status) => {
        if (parseInt(status) === getOptionValue(options, "status", "approve")) {
          return "fad fa-check-circle"
        } else if (
          parseInt(status) === getOptionValue(options, "status", "decline")
        ) {
          return "fad fa-do-not-enter"
        } else {
          return "fal fa-spinner"
        }
      }
      if (!isEmpty(requestDetail.send_to)) {
        return requestDetail.send_to.map((item) => {
          return (
            <div
              className="d-flex justify-content-end"
              key={`sen_${item.value}`}>
              <p className="me-1">@{item.label}</p>{" "}
              <i className={reIcon(item.status)}></i>
            </div>
          )
        })
      }
    }
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleDetail()}
        className="detail-request-modal"
        backdrop={"static"}
        size="lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleDetail()}>
          <span className="title-icon align-self-center">
            <i className="fad fa-briefcase"></i>
          </span>{" "}
          <span className="ms-1">
            {useFormatMessage("modules.recruitments.title.detail")}
          </span>
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <div className="request mt-1">
              <Row className="mt-2">
                <Col sm={3} className="mb-25">
                  <span className="title-icon-big align-self-center">
                    <i className="fad fa-briefcase"></i>
                  </span>
                </Col>
                <Col sm={9} className="mb-25 mt-3">
                  <Row>
                    <Col sm={12} className="mb-25">
                      <div className="d-flex">
                        <span className="title-detail">
                          {requestDetail.recruitment_code}
                        </span>
                        <div className="type align-self-center ms-3">
                          <span
                            className={
                              !isEmpty(requestDetail.priority) &&
                              requestDetail.priority.value === "329"
                                ? "high"
                                : "low"
                            }>
                            {!isEmpty(requestDetail.priority) &&
                              useFormatMessage(requestDetail.priority.label)}
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} className="mb-25 d-flex">
                      <div className="d-flex align-self-center flex-column">
                        <div className="create-date">
                          {useFormatMessage(
                            "modules.recruitments.fields.created_at"
                          )}{" "}
                          :{" "}
                          <span className="ms-2">
                            {!isEmpty(requestDetail.created_at) &&
                              dateTimeToYMD(requestDetail.created_at)}
                          </span>
                        </div>
                        <div className="create-date mt-1">
                          {useFormatMessage(
                            "modules.recruitments.fields.due_date"
                          )}{" "}
                          :{" "}
                          <span
                            className={
                              (isEmpty(requestDetail.recruitment_to) &&
                                "none") + " ms-2"
                            }>
                            {!isEmpty(requestDetail.recruitment_to)
                              ? requestDetail.recruitment_to
                              : useFormatMessage(
                                  "modules.recruitments.text.none"
                                )}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-self-center flex-column ms-auto text-right">
                        <span className="title">
                          {useFormatMessage(
                            "modules.recruitments.fields.send_to"
                          )}{" "}
                          :
                        </span>
                        <div className="send-to">{sendTo()}</div>
                      </div>
                    </Col>
                    <Col sm={12} className="mb-25 mt-1">
                      <hr />
                    </Col>
                  </Row>
                </Col>

                <Col sm={4} className="mb-25 mt-1">
                  <div className="form-group">
                    <label>
                      {useFormatMessage("modules.recruitments.fields.office")}
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={
                        isEmpty(requestDetail.office)
                          ? useFormatMessage("modules.recruitments.text.none")
                          : requestDetail.office.label
                      }
                    />
                  </div>
                </Col>

                <Col sm={4} className="mb-25 mt-1">
                  <div className="form-group">
                    <label>
                      {useFormatMessage(
                        "modules.recruitments.fields.department"
                      )}
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={
                        isEmpty(requestDetail.department)
                          ? useFormatMessage("modules.recruitments.text.none")
                          : requestDetail.department.label
                      }
                    />
                  </div>
                </Col>

                <Col sm={4} className="mb-25 mt-1">
                  <div className="form-group">
                    <label>
                      {useFormatMessage(
                        "modules.recruitments.fields.job_title"
                      )}
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={
                        isEmpty(requestDetail.job_title)
                          ? useFormatMessage("modules.recruitments.text.none")
                          : requestDetail.job_title.label
                      }
                    />
                  </div>
                </Col>

                <Col sm={4} className="mb-25 mt-1">
                  <div className="form-group">
                    <label>
                      {useFormatMessage(
                        "modules.recruitments.fields.employment_type"
                      )}
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={
                        isEmpty(requestDetail.employment_type)
                          ? useFormatMessage("modules.recruitments.text.none")
                          : useFormatMessage(
                              requestDetail.employment_type.label
                            )
                      }
                    />
                  </div>
                </Col>

                <Col sm={4} className="mb-25 mt-1">
                  <div className="form-group">
                    <label>
                      {useFormatMessage(
                        "modules.recruitments.fields.experience"
                      )}
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={
                        isEmpty(requestDetail.experience)
                          ? useFormatMessage("modules.recruitments.text.none")
                          : numberWithCommas(requestDetail.experience)
                      }
                    />
                  </div>
                </Col>

                <Col sm={4} className="mb-25 mt-1">
                  <div className="form-group">
                    <label>
                      {useFormatMessage("modules.recruitments.fields.quantity")}
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={
                        isEmpty(requestDetail.quantity)
                          ? useFormatMessage("modules.recruitments.text.none")
                          : requestDetail.quantity
                      }
                    />
                  </div>
                </Col>

                <Col sm={4} className="mb-25 mt-1">
                  <div className="form-group">
                    <label>
                      {useFormatMessage("modules.recruitments.fields.gender")}
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={
                        isEmpty(requestDetail.gender)
                          ? useFormatMessage("modules.recruitments.text.none")
                          : requestDetail.gender.label
                      }
                    />
                  </div>
                </Col>

                <Col sm={4} className="mb-25">
                  <div>
                    <label className="form-group">
                      {useFormatMessage("modules.recruitments.fields.age")} :
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={`${
                        !isEmpty(requestDetail.age_from) &&
                        requestDetail.age_from
                      } - ${
                        !isEmpty(requestDetail.age_to) && requestDetail.age_to
                      }`}
                    />
                  </div>
                </Col>
                <Col sm={4} className="mb-25">
                  <div>
                    <label className="form-group">
                      {useFormatMessage("modules.recruitments.fields.salary")} :
                    </label>
                    <Input
                      type="text"
                      readOnly
                      className="form-control"
                      value={`${
                        !isEmpty(requestDetail.salary_from) &&
                        numberWithCommas(requestDetail.salary_from)
                      } - ${
                        !isEmpty(requestDetail.salary_to) &&
                        numberWithCommas(requestDetail.salary_to)
                      }`}
                    />
                  </div>
                </Col>
                <Col sm={12} className="mb-25 mt-3">
                  <hr />
                </Col>
                <Col sm={12} className="mb-25">
                  <div>
                    <span className="title">
                      {useFormatMessage(
                        "modules.recruitments.fields.job_description"
                      )}{" "}
                      :
                    </span>
                    <p
                      className={
                        isEmpty(requestDetail.descriptions) ? "none" : undefined
                      }>
                      {isEmpty(requestDetail.descriptions)
                        ? useFormatMessage("modules.recruitments.text.none")
                        : requestDetail.descriptions}
                    </p>
                  </div>
                </Col>
                <Col sm={12} className="mb-25">
                  <div>
                    <span className="title">
                      {useFormatMessage(
                        "modules.recruitments.fields.requirements"
                      )}{" "}
                      :
                    </span>
                    <p
                      className={
                        isEmpty(requestDetail.requirements) ? "none" : undefined
                      }>
                      {isEmpty(requestDetail.requirements)
                        ? useFormatMessage("modules.recruitments.text.none")
                        : requestDetail.requirements}
                    </p>
                  </div>
                </Col>

                <Col sm={12} className="mb-25">
                  <div>
                    <span className="title">
                      {useFormatMessage("modules.recruitments.fields.benefits")}{" "}
                      :
                    </span>
                    <p
                      className={
                        isEmpty(requestDetail.benefits) ? "none" : undefined
                      }>
                      {isEmpty(requestDetail.benefits)
                        ? useFormatMessage("modules.recruitments.text.none")
                        : requestDetail.benefits}
                    </p>
                  </div>
                </Col>

                <Col sm={12} className="mb-25">
                  <div>
                    <span className="title">
                      {useFormatMessage("modules.recruitments.fields.skills")} :
                    </span>
                    <p>
                      {!isEmpty(requestDetail.skills) &&
                        requestDetail.skills.map((item, key) => {
                          return (
                            item.label +
                            (key + 1 === requestDetail.skills.length
                              ? ""
                              : " , ")
                          )
                        })}
                    </p>
                    <p
                      className={
                        isEmpty(requestDetail.skills) ? "none" : undefined
                      }>
                      {isEmpty(requestDetail.skills) &&
                        useFormatMessage("modules.recruitments.text.none")}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter className="center mt-1">
              {ability.can("approve", moduleName) && tab === "approve" && (
                <>
                  {requestDetail.userapproved === "0" && (
                    <>
                      <Button
                        className="me-2"
                        color="primary"
                        disabled={state.loading}
                        onClick={() =>
                          handleApprove(
                            getOptionValue(options, "status", "approve")
                          )
                        }>
                        {state.loading && (
                          <Spinner size="sm" className="me-50" />
                        )}
                        {requestDetail.userapproved ===
                        getOptionValue(options, "status", "approve")
                          ? useFormatMessage("button.cancel_approve")
                          : useFormatMessage("button.approve")}
                      </Button>
                      <Button
                        className="me-2"
                        color="outline-danger"
                        onClick={() =>
                          handleApprove(
                            getOptionValue(options, "status", "decline")
                          )
                        }>
                        {useFormatMessage("button.decline")}
                      </Button>
                    </>
                  )}
                  {requestDetail.userapproved !== "0" && (
                    <Button
                      color="flat-danger"
                      className="btn-cancel me-2"
                      onClick={() => handleApprove(0)}>
                      {requestDetail.userapproved ===
                      getOptionValue(options, "status", "approve")
                        ? useFormatMessage("button.cancel_approve")
                        : useFormatMessage("button.cancel_decline")}
                    </Button>
                  )}
                </>
              )}

              {ability.can("update", moduleName) &&
                tab === "request" &&
                modal &&
                requestDetail.approved === "0" &&
                canUpdate && (
                  <>
                    <Button
                      color="secondary"
                      type="button"
                      onClick={() => handleEdit(requestDetail.id)}>
                      {state.loading && <Spinner size="sm" className="me-50" />}{" "}
                      {useFormatMessage("button.edit")}
                    </Button>
                  </>
                )}
              {ability.can("update", moduleName) &&
                tab === "jobs" &&
                requestDetail?.status?.value * 1 !==
                  getOptionValue(options, "status", "closed") &&
                modal &&
                canUpdate && (
                  <>
                    <Button
                      color="secondary"
                      type="button"
                      onClick={() => handleEdit(requestDetail.id)}>
                      {state.loading && <Spinner size="sm" className="mr-50" />}{" "}
                      {useFormatMessage("button.edit")}
                    </Button>
                  </>
                )}
              {tab === "jobs" &&
                requestDetail?.status?.value * 1 !==
                  getOptionValue(options, "status", "closed") && (
                  <Button
                    color="primary"
                    onClick={() => handleCloseJob(requestDetail.id)}>
                    {useFormatMessage("modules.recruitments.button.close_job")}
                  </Button>
                )}
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    )
  } else {
    return <div></div>
  }
}
export default DetailModal
