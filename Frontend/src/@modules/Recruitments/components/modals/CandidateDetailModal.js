import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import {
  formatDate,
  sortFieldsDisplay,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { isArray } from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"
import classnames from "classnames"
import { isEmpty, toArray } from "lodash-es"
import { Fragment, useContext, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"
import {
  Badge,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { recruitmentsApi } from "../../common/api"
import Reviews from "../form/Reviews"
import ReviewsData from "../reviews/ReviewsData"
import TestButton from "../../../Test/components/TestButton"
import MoveStage from "../MoveStage"
import AssignJobModal from "./AssignJobModal"
import { Button as ButtonAntd, Dropdown, Menu, Space } from "antd"
import SwAlert from "@apps/utility/SwAlert"
const CandidateDetailModal = (props) => {
  const { modal, options, dataDetail, handleDetail, loadData } = props
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false,
    loading: false,
    averageStar: 0,
    loadingStar: modal,
    dataReviews: [],
    modalAssign: false,
    currentJob: "",
    typeCoppy: false
  })
  const module = "candidates"
  const arrFields = useSelector(
    (state) => state.app.modules["candidates"].metas
  )
  const optionsArr = useSelector(
    (state) => state.app.modules["candidates"].options
  )
  const [activeTab, setActiveTab] = useState("1")
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }
  const onSubmitFrm = (values) => {
    values.id = dataDetail.id
    recruitmentsApi
      .saveCandidate(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        cancelUpdate()
        loadData()
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const dataFields = isArray(arrFields) ? arrFields : toArray(arrFields)
  const { handleSubmit, errors, control, register, reset, setValue } = methods
  const fieldNoteProps = {
    module: "candidates",
    fieldData: { ...arrFields.candidate_note, field_readonly: state.readOnly },
    useForm: methods,
    options
  }
  const fieldSkillProps = {
    module: "candidates",
    fieldData: { ...arrFields.skills, field_readonly: state.readOnly },
    useForm: methods,
    options
  }
  const loadDataReviews = () => {
    defaultModuleApi
      .getList("candidate_reviews", {
        filters: { candidate_id: dataDetail.id }
      })
      .then((res) => {
        setState({ dataReviews: res.data.results })
        calculationRating(res.data.results)
      })
  }
  const calculationRating = (data) => {
    if (!isEmpty(data)) {
      const totalStar = data.reduce(
        (total, value) => total + value.rating * 1,
        0
      )
      const totalRV = _.size(data)
      // round
      const averageStar = Math.round((totalStar / totalRV) * 2) / 2
      setState({ loadingStar: false, averageStar: averageStar })
    }
  }

  const ratingChanged = (star) => {
    setState({ averageStar: star })
  }

  const updateBtn = () => {
    setState({
      readOnly: false
    })
  }

  const cancelUpdate = () => {
    setState({
      readOnly: true,
      saving: false
    })
  }
  const renDISC = (data) => {
    if (isEmpty(data))
      return <span>({useFormatMessage("modules.test.text.none")})</span>
    return Object.keys(data).map(function (key) {
      return (
        <Fragment key={`test_` + key}>
          <span className="name-key">{key}</span>{" "}
          <span className="disc-point">{data[key]}</span>
        </Fragment>
      )
    })
  }

  useEffect(() => {
    loadDataReviews()
  }, [dataDetail.id])

  const handleCoppy = () => {
    const idCandidate = dataDetail.id
    setState({ modalAssign: true, typeCoppy: true })
  }

  const handleRemoveJob = () => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.remove")
    }).then((res) => {
      if (res.value) {
        onSubmitFrm({ recruitment_proposal: 0 })
        dataDetail.recruitment_proposal = null
      }
    })
  }

  const handleDeDelete = () => {
    const idCandidate = dataDetail.id
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        defaultModuleApi
          .delete("candidates", idCandidate)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })

            loadData()
            handleDetail("")
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }
  const btnMore = (
    <Menu
      items={[
        {
          label: useFormatMessage("modules.candidates.button.another_job"),
          key: "another_job",
          onClick: () => setState({ modalAssign: true }),
          disabled: !dataDetail?.recruitment_proposal
        },
        {
          label: useFormatMessage("modules.candidates.button.copy_job"),
          key: "copy_job",
          onClick: () => handleCoppy(),
          disabled: !dataDetail?.recruitment_proposal
        },
        {
          label: useFormatMessage("modules.candidates.button.remove_job"),
          key: "remove_job",
          onClick: () => handleRemoveJob(),
          disabled: !dataDetail?.recruitment_proposal
        },
        {
          label: (
            <span className="text-danger">
              {useFormatMessage("modules.candidates.button.delete_candidate")}
            </span>
          ),
          key: "delete_candidate",
          onClick: () => handleDeDelete()
        }
      ]}
    />
  )
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={() => handleDetail("")}
        className="new-modal detail-candidate"
        backdrop={"static"}
        size="lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleDetail("")}>
          <span className="title-icon align-self-center">
            <i className="fad fa-user"></i>
          </span>{" "}
          <span className="ms-1">
            {useFormatMessage("modules.candidates.title.detail")}
          </span>
        </ModalHeader>
        <ModalBody>
          <Row className="mt-2">
            <Col sm={3} className="d-flex justify-content-center">
              <div className="avatar-candidates">
                <AvatarBox
                  currentAvatar={
                    !isEmpty(dataDetail.candidate_avatar) &&
                    dataDetail.candidate_avatar.url
                  }
                  readOnly={""}
                  handleSave={(img) => {
                    onSubmitFrm({ candidate_avatar: img })
                  }}
                />
              </div>
            </Col>
            <Col sm={9} className="d-flex info-candidate">
              <div className="content-left mt-2">
                <div className="name d-flex align-items-center">
                  {dataDetail.candidate_name}{" "}
                  {dataDetail?.recruitment_proposal && (
                    <span className="stage ms-1 btn-light btn-sm">
                      {dataDetail?.stage?.label}
                    </span>
                  )}
                </div>
                <div className="start-rate mt-1">
                  {state.loadingStar && <DefaultSpinner />}
                  {!state.loadingStar && (
                    <ReactStars
                      className="ms-2"
                      isHalf={true}
                      value={state.averageStar}
                      key={Math.random()}
                      edit={false}
                      size={15}
                      emptyIcon={<i className="far fa-star" />}
                      halfIcon={<i className="fa fa-star-half-alt" />}
                      filledIcon={<i className="fa fa-star" />}
                      color="#f9d324"
                      activeColor="#f9d324"
                    />
                  )}
                </div>
                <div className="time-request mt-1">
                  <div className="create-date text-dark">
                    {useFormatMessage("modules.recruitments.fields.created_at")}{" "}
                    :<span> {formatDate(dataDetail.created_at)}</span>
                  </div>
                </div>
                <div className="mt-1">
                  {dataDetail?.recruitment_proposal
                    ? dataDetail.recruitment_proposal?.label
                    : useFormatMessage("modules.candidates.text.not_jobs")}
                </div>
                <div className="button-test d-flex mt-2">
                  <TestButton idTest={dataDetail.id} />

                  {dataDetail?.recruitment_proposal ? (
                    <MoveStage
                      stages={dataDetail.listStage}
                      infoCandidate={dataDetail}
                      onSave={onSubmitFrm}
                      loadData={loadData}
                      closed={dataDetail.closed_job}
                    />
                  ) : (
                    <Button
                      color="primary"
                      className="ms-1"
                      size="sm"
                      onClick={() => {
                        setState({ modalAssign: true })
                      }}>
                      {useFormatMessage("modules.candidates.text.assign_job")}
                    </Button>
                  )}

                  <Dropdown overlay={btnMore}>
                    <ButtonAntd className="btn btn-primary btn-sm ms-1 me-1">
                      <Space>
                        <i className="fa-light fa-ellipsis-vertical"></i>
                      </Space>
                    </ButtonAntd>
                  </Dropdown>
                </div>
              </div>
              <div className="content-right ms-auto mt-2">
                <div className="source">
                  <span className="title">
                    {useFormatMessage("modules.candidates.fields.source")}
                  </span>
                  <br />
                  <span className="content">
                    {!isEmpty(dataDetail.source) ? dataDetail.source.label : ""}
                  </span>
                </div>
                <div className="tags mt-1">
                  <span className="title">
                    {useFormatMessage("modules.candidates.fields.disc")}
                  </span>
                  <br />
                  <div className="result-disc">{renDISC(dataDetail?.disc)}</div>
                </div>

                <div className="tags mt-1">
                  <span className="title">
                    {useFormatMessage("modules.candidates.fields.vakad")}
                  </span>
                  <br />
                  <div className="result-disc">
                    {renDISC(dataDetail?.vakad)}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={12}>
              <Nav tabs>
                <NavItem className="style-tab-left">
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggle("1")
                    }}>
                    <i className="fas fa-user"></i>{" "}
                    {useFormatMessage("modules.candidates.text.infomations")}
                  </NavLink>
                </NavItem>
                <NavItem className="style-tab-right">
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggle("2")
                    }}>
                    <i className="fas fa-star"></i>{" "}
                    {useFormatMessage("modules.candidates.text.reviews")}
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
            <Col sm={12} className="mb-1">
              <div className="div-tab-content">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <FormProvider {...methods}>
                      <Row>
                        <Col sm={12} className="mb-1 d-flex">
                          <span className="title-info">
                            {useFormatMessage(
                              "modules.candidates.text.personal"
                            )}
                          </span>
                          <div className="d-flex ms-auto">
                            {ability.can("update", module) && (
                              <Button
                                color="flat-primary"
                                tag="div"
                                className="text-primary btn-table-more btn-icon"
                                onClick={updateBtn}>
                                <i className="iconly-Edit icli"></i>
                              </Button>
                            )}
                          </div>
                        </Col>

                        {dataFields
                          .filter(
                            (field) =>
                              field.field_form_show && field.field_enable
                          )
                          .sort((a, b) => {
                            return sortFieldsDisplay(a, b)
                          })
                          .map((field, key) => {
                            const options = optionsArr
                            const fieldAuth = { ...field }
                            fieldAuth.field_readonly = state.readOnly
                            const fieldProps = {
                              module: "candidates",
                              fieldData: fieldAuth,
                              useForm: methods,
                              options
                            }

                            const nameField = field.field
                            if (nameField !== "recruitment_proposal") {
                              return (
                                <Col
                                  sm={field.field_form_col_size}
                                  className="mb-1"
                                  key={key}>
                                  <Fragment>
                                    <FieldHandle
                                      label={useFormatMessage(
                                        "modules.candidates.fields." +
                                          field.field
                                      )}
                                      updateData={dataDetail[field.field]}
                                      {...fieldProps}
                                    />
                                  </Fragment>
                                </Col>
                              )
                            }
                          })}
                        <Col sm={12}>
                          <span className="title-info">
                            {useFormatMessage(
                              "modules.candidates.fields.skills"
                            )}
                          </span>
                          <FieldHandle
                            nolabel
                            label={useFormatMessage(
                              "modules.candidates.fields.skills"
                            )}
                            {...fieldSkillProps}
                            updateData={dataDetail["skills"]}
                          />
                        </Col>

                        <Col sm={12}>
                          <span className="title-info">
                            {useFormatMessage(
                              "modules.candidates.fields.candidate_note"
                            )}
                          </span>
                          <Fragment>
                            <FieldHandle
                              nolabel
                              label={useFormatMessage(
                                "modules.candidates.fields.candidate_note"
                              )}
                              {...fieldNoteProps}
                              updateData={dataDetail["candidate_note"]}
                            />
                          </Fragment>
                        </Col>
                        <Col sm={12}>
                          <span className="title-info">
                            {useFormatMessage("modules.candidates.fields.cv")}
                          </span>
                          <div className="pt-50">
                            {!isEmpty(dataDetail["cv"]) && (
                              <Badge color="light-secondary">
                                <DownloadFile
                                  fileName={dataDetail["cv"].fileName}
                                  src={dataDetail["cv"].url}>
                                  <i className="far fa-paperclip"></i>{" "}
                                  {dataDetail["cv"].fileName}
                                </DownloadFile>
                              </Badge>
                            )}
                          </div>
                        </Col>
                        <Col sm={12}>
                          {!state.readOnly && (
                            <div className="row pt-2">
                              <form
                                className="col-12 text-center"
                                onSubmit={handleSubmit(onSubmitFrm)}>
                                <Button
                                  type="submit"
                                  color="primary"
                                  className="btn-next me-2"
                                  disabled={state.saving}>
                                  <span className="align-middle d-sm-inline-block d-none">
                                    {state.saving && (
                                      <Spinner size="sm" className="mr-50" />
                                    )}
                                    {useFormatMessage("button.save")}
                                  </span>
                                </Button>

                                <Button.Ripple
                                  type="button"
                                  className="btn-cancel"
                                  onClick={cancelUpdate}
                                  disabled={state.saving}>
                                  <span className="align-middle d-sm-inline-block d-none">
                                    {useFormatMessage("button.cancel")}
                                  </span>
                                </Button.Ripple>
                              </form>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </FormProvider>
                  </TabPane>
                  <TabPane tabId="2">
                    <h3>
                      {useFormatMessage(
                        "modules.candidates.text.reviews_candi"
                      )}
                    </h3>
                    <Reviews
                      dataDetail={dataDetail}
                      ratingChanged={ratingChanged}
                      setStateStar={setState}
                      files={[]}
                      loadData={loadDataReviews}
                    />
                    <ReviewsData
                      dataReviews={state.dataReviews}
                      loadData={loadDataReviews}
                    />
                  </TabPane>
                </TabContent>
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
      <AssignJobModal
        modal={state.modalAssign}
        handleModal={(e) => {
          setState({ modalAssign: !state.modalAssign, typeCoppy: false })
        }}
        idCandidate={dataDetail.id}
        dataDetail={dataDetail}
        typeCoppy={state.typeCoppy}
        loadData={loadData}
        handleDetail={handleDetail}
      />
    </>
  )
}
export default CandidateDetailModal
