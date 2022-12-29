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
  Spinner
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import SwAlert from "@apps/utility/SwAlert"
import Photo from "@apps/modules/download/pages/Photo"
const AssetDetailModal = (props) => {
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
  const module = "asset_lists"
  const arrFields = useSelector(
    (state) => state.app.modules["asset_lists"].metas
  )
  const optionsArr = useSelector(
    (state) => state.app.modules["asset_lists"].options
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
  console.log("ddđea", dataDetail)
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={() => handleDetail("")}
        backdrop={"static"}
        size="lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleDetail("")}>
          <span className="title-icon align-self-center">
            <i class="fa-regular fa-circle-info"></i>
          </span>{" "}
          <span className="ms-50">
            {useFormatMessage("modules.asset_lists.title.detail")}
          </span>
        </ModalHeader>
        <ModalBody>
          <Row className="mt-2">
            <Col
              sm={3}
              className="d-flex justify-content-center  align-content-center">
              <Photo src={dataDetail?.recent_image?.url} className="rounded" />
            </Col>
            <Col sm={9} className="d-flex info-candidate">
              <div className="content-left mt-2">
                <div className="name d-flex align-items-center">
                  {dataDetail?.asset_name}{" "}
                  {dataDetail?.asset_status && (
                    <span className="stage ms-1 btn-light btn-sm">
                      {dataDetail?.asset_status?.label}
                    </span>
                  )}
                </div>

                <div className="time-request mt-50">
                  <div className="create-date text-dark">
                    {useFormatMessage("modules.asset_lists.fields.asset_code")}:
                    <span> {dataDetail?.asset_code}</span>
                  </div>

                  <div className="create-date text-dark mt-50">
                    {useFormatMessage("modules.recruitments.fields.created_at")}
                    :<span> {formatDate(dataDetail?.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="content-right ms-auto mt-2">Owner</div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={12}></Col>
            <Col sm={12} className="mb-1">
              <div className="div-tab-content">
                <FormProvider {...methods}>
                  <Row>
                    <Col sm={12} className="d-flex">
                      <span className="title-info">
                        {useFormatMessage("modules.candidates.text.personal")}
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
                        (field) => field.field_form_show && field.field_enable
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
                              lg={field.field_form_col_size}
                              className="mb-1"
                              key={key}>
                              <Fragment>
                                <FieldHandle
                                  label={useFormatMessage(
                                    "modules.asset_lists.fields." + field.field
                                  )}
                                  updateData={dataDetail?.[field.field]}
                                  {...fieldProps}
                                />
                              </Fragment>
                            </Col>
                          )
                        }
                      })}
                    <Col sm={12}>
                      <span className="title-info">
                        {useFormatMessage("modules.candidates.fields.skills")}
                      </span>
                    </Col>

                    <Col sm={12}>
                      <span className="title-info">
                        {useFormatMessage(
                          "modules.candidates.fields.candidate_note"
                        )}
                      </span>
                    </Col>
                    <Col sm={12}>
                      <span className="title-info">
                        {useFormatMessage("modules.candidates.fields.cv")}
                      </span>
                      <div className="pt-50">cv</div>
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
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </>
  )
}
export default AssetDetailModal
