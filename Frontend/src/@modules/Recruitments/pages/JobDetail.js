import { DownOutlined } from "@ant-design/icons"
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { ErpInput } from "@apps/components/common/ErpField"
import promiseModal from "@apps/components/modals/PromiseModal"
import {
  formatDateTime,
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import "@asseinfo/react-kanban/dist/styles.css"
import { Dropdown, Menu } from "antd"
import { debounce, forEach, map } from "lodash"
import React, { Fragment, useEffect, useRef } from "react"
import { Clock, Share, Upload, Download, AlertCircle } from "react-feather"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  UncontrolledTooltip,
  Alert
} from "reactstrap"
import AddEmployeeModal from "../../Employees/components/modals/AddEmployeeModal"
import { candidatesApi, recruitmentsApi } from "../common/api"
import InterviewActionModal from "../components/actions/InterviewActionModal"
import OfferedActionModal from "../components/actions/OfferedActionModal"
import RejectedActionModal from "../components/actions/RejectedActionModal"
import JobActivityModal from "../components/kanban/JobActivityModal"
import JobKanban from "../components/kanban/JobKanban"
import AddCandidateModal from "../components/modals/AddCandidateModal"
import CandidateDetail from "../components/modals/CandidateDetailModal"
import PreviewListCV from "../components/details/PreviewListCV"
import UploadCVModal from "../components/modals/UploadCVModal"
import CandidateTable from "../components/CandidateTable"
import CustomFieldHandle from "@modules/Employees/components/detail/custom-field-handle/CustomFieldHandle"
const JobDetail = () => {
  const { id } = useParams()

  const modules = useSelector((state) => state.app.modules)
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const publish_status = modules.recruitments.options.publish_status
  const candidates = modules.candidates
  const metas = candidates.metas
  const moduleName = candidates.config.name

  const options = modules.recruitments.options
  const [state, setState] = useMergedState({
    loading: true,
    job: {},
    stages: {
      columns: []
    },
    publish_status: {},
    textSearch: "",
    viewType: "kanban",
    activityModal: false,
    addCandidateModal: false,
    modalDetail: false,
    dataDetail: {},
    listCVUpload: {},
    listCVInvalid: {},
    listFileCV: [],
    listEmployeeEmail: [],
    listCandidate: [],
    uploadCVModal: false,
    showPreviewCV: false,
    loadExport: false
  })

  const appSetting = useSelector((state) => state.auth.settings)

  const replaceData = {
    company_name: appSetting.app_name,
    company_website: appSetting.website,
    company_address: appSetting.address,
    company_phone: appSetting.phone,
    company_email: appSetting.email,
    job_name: state.job?.recruitment_code,
    job_department: state.job?.recruitment_department?.label,
    job_position: state.job?.recruitment_job_title?.label
  }

  const debounceSearch = useRef(
    debounce(
      (nextValue) =>
        setState({
          textSearch: nextValue
        }),
      process.env.REACT_APP_DEBOUNCE_INPUT_DELAY
    )
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  const loadData = () => {
    recruitmentsApi.getJob(id, state.textSearch).then((res) => {
      const { candidates, stages, ...rest } = res.data
      setState({
        loading: false,
        job: rest,
        stages: {
          columns: stages
        },
        publish_status: rest.publish_status,
        listCandidate: candidates
      })
    })
  }

  useEffect(() => {
    loadData()
  }, [state.textSearch])

  const changePublishStatus = (status) => {
    recruitmentsApi
      .changeStatus(id, status.value)
      .then((res) => {
        setState({
          publish_status: status
        })
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        console.log(err)
        notification.showError({ text: err.message })
      })
  }
  const handleStageChange = async (
    target,
    data,
    source,
    destination,
    actionData = {}
  ) => {
    let updateData = [],
      fromStageName = "",
      toStageName = ""
    forEach(state.stages?.columns, (item) => {
      if (parseInt(source.fromColumnId) === parseInt(item.id)) {
        fromStageName = item.title
      }
      if (parseInt(destination.toColumnId) === parseInt(item.id)) {
        toStageName = item.title
      }
    })
    forEach(data.columns, (item) => {
      if (parseInt(item.id) === parseInt(source.fromColumnId)) {
        updateData = [
          ...updateData,
          ...map(item.cards, (value, position) => {
            return {
              id: value.id,
              stage_order: position,
              stage: item.id
            }
          })
        ]
      }
      if (parseInt(item.id) === parseInt(destination.toColumnId)) {
        updateData = [
          ...updateData,
          ...map(item.cards, (value, position) => {
            return {
              id: value.id,
              stage_order: position,
              stage: item.id
            }
          })
        ]
      }
    })

    const datasend = {
      candidate: target.id,
      candidateName: target.candidate_name,
      toStage: destination.toColumnId,
      toStageName: toStageName,
      fromStage: source.fromColumnId,
      fromStageName: fromStageName,
      stageData: updateData,
      actionData
    }
    let result = false
    await recruitmentsApi
      .changeStage(id, datasend)
      .then((res) => {
        result = true
      })
      .catch((err) => {
        result = false
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
    return result
  }

  const actionsBeforeDrag = {
    interview: async (data) => {
      let interview = false
      await recruitmentsApi
        .checkCandidateInterviewSchedule(data.recruitment_proposal, data.id)
        .then((res) => {
          interview = res.data
        })
      let result = true
      if (interview) {
        await SwAlert.showWarning({
          title: "Hmm...",
          html: useFormatMessage(
            "modules.candidates.actions.interview.text.warning_candidate_interview_schedule",
            {
              date: formatDateTime(interview.interview_date),
              interviewer: interview.interviewer.full_name
            }
          ),
          confirmButtonText: useFormatMessage(
            "modules.candidates.actions.interview.text.remove_interview_schedule"
          ),
          customClass: {
            confirmButton: "btn btn-danger"
          }
        }).then((res) => {
          result = res.value
          if (result) {
            defaultModuleApi.delete("interviews", interview.id).then((res) => {
              //do nothing
            })
          }
        })
      }
      return result
    },
    hired: async (data) => {
      let result = true
      if (data.is_employed) {
        result = false
        await SwAlert.showInfo({
          title: "Oops...",
          text: useFormatMessage(
            "modules.candidates.actions.hired.text.can_change_stage"
          )
        }).then((res) => {})
      }
      return result
    }
  }

  const actionsAfterDrag = {
    interview: async (data) => {
      const result = await promiseModal(({ show, onSubmit, onDismiss }) => {
        return (
          <InterviewActionModal
            modal={show}
            toggleModal={onDismiss}
            onSubmit={onSubmit}
            onClosed={onDismiss}
            mailContentReplace={{
              ...replaceData,
              candidate_email: data.candidate_email,
              candidate_name: data.candidate_name,
              candidate_phone: data.candidate_phone
            }}
            candidate={data}
          />
        )
      })
      return result
    },
    offered: async (data) => {
      const result = await promiseModal(({ show, onSubmit, onDismiss }) => {
        return (
          <OfferedActionModal
            modal={show}
            toggleModal={onDismiss}
            onSubmit={onSubmit}
            onClosed={onDismiss}
            mailContentReplace={{
              ...replaceData,
              candidate_email: data.candidate_email,
              candidate_name: data.candidate_name,
              candidate_phone: data.candidate_phone
            }}
            candidate={data}
          />
        )
      })
      return result
    },
    rejected: async (data) => {
      const rejection_reason_options =
        modules.candidates.options.rejection_reason
      const result = await promiseModal(({ show, onSubmit, onDismiss }) => {
        return (
          <RejectedActionModal
            modal={show}
            toggleModal={onDismiss}
            onSubmit={onSubmit}
            onClosed={onDismiss}
            mailContentReplace={{
              ...replaceData,
              candidate_email: data.candidate_email,
              candidate_name: data.candidate_name,
              candidate_phone: data.candidate_phone
            }}
            candidate={data}
            rejection_reason_options={rejection_reason_options}
          />
        )
      })
      return result
    },
    hired: async (data) => {
      let result = true
      await SwAlert.showInfo({
        title: useFormatMessage(
          "modules.candidates.actions.hired.text.add_as_employee_title"
        ),
        text: useFormatMessage(
          "modules.candidates.actions.hired.text.add_as_employee_text"
        ),
        showCancelButton: true,
        confirmButtonText: useFormatMessage(
          "modules.candidates.actions.hired.text.add_as_employee_button"
        ),
        cancelButtonText: useFormatMessage("button.notNow"),
        icon: "question",
        customClass: {
          cancelButton: "btn btn-outline-secondary ms-1"
        }
      }).then(async (res) => {
        if (res.value) {
          const addEmployee = true
          await promiseModal(({ show, onSubmit, onDismiss }) => {
            const employeeModule = modules.employees
            return (
              <AddEmployeeModal
                modal={show}
                showCustomField={true}
                handleModal={onDismiss}
                onSubmit={onSubmit}
                onClosed={onDismiss}
                loadData={loadData}
                metas={employeeModule.metas}
                options={employeeModule.options}
                module={employeeModule.config}
                optionsModules={optionsModules}
                fillData={{
                  full_name: data.candidate_name,
                  username: data.candidate_email,
                  phone: data.candidate_phone,
                  email: data.candidate_email,
                  dob: data.candidate_dob,
                  gender: data.gender
                }}
              />
            )
          })
          if (addEmployee) {
            data.is_employed = true
            result = {
              is_employed: true
            }
          }
        }
      })
      return result
    }
  }

  const handleDetail = (data) => {
    if (data) {
      candidatesApi.getInfo(data.id).then((res) => {
        setState({
          modalDetail: !state.modalDetail,
          dataDetail: res.data
        })
      })
    } else {
      setState({ modalDetail: !state.modalDetail })
    }
  }
  const toggleUploadCVModal = () => {
    setState({
      uploadCVModal: !state.uploadCVModal
    })
  }

  const handleAddListCVInvalid = (
    name,
    index,
    newListCVInvalid,
    error = ""
  ) => {
    const newListCVInvalidTemp = { ...newListCVInvalid }
    if (
      _.some(
        newListCVInvalidTemp,
        (itemInvalid) => parseInt(itemInvalid.key) === parseInt(index)
      )
    ) {
      const [newValueFilter] = _.filter(
        _.map(newListCVInvalid, (itemInvalid) => {
          if (parseInt(itemInvalid.key) === parseInt(index)) {
            return {
              ...itemInvalid,
              [name]: error !== "" ? error : `empty_${name}`
            }
          }
        }),
        (itemFilter) => {
          return itemFilter !== undefined
        }
      )
      newListCVInvalidTemp[index] = newValueFilter
    } else {
      newListCVInvalidTemp[index] = {
        key: index,
        [name]: error !== "" ? error : `empty_${name}`
      }
    }
    newListCVInvalid = newListCVInvalidTemp
    return newListCVInvalid
  }

  const handleSetListInvalidCV = () => {
    let newListCVInvalid = {}
    const arrDuplicateEmail = []
    const arrEmptyName = []
    const arrEmptyEmail = []
    const arrEmptyPhone = []

    const newListCVUpload = { ...state.listCVUpload }
    _.map(newListCVUpload, (item, index) => {
      if (item.name.trim().length === 0) {
        arrEmptyName.push(item.key)
      }

      if (item.email.trim().length === 0) {
        arrEmptyEmail.push(item.key)
      } else {
        _.map(newListCVUpload, (itemSecond, indexSecond) => {
          if (
            item.email === itemSecond.email &&
            index !== indexSecond &&
            item.recruitment_proposal?.value ===
              itemSecond.recruitment_proposal?.value
          ) {
            arrDuplicateEmail.push(itemSecond.key)
          }
        })

        if (state.listEmployeeEmail[item.recruitment_proposal?.value]) {
          state.listEmployeeEmail[item.recruitment_proposal?.value].map(
            (employeeEmail) => {
              if (employeeEmail === item.email) {
                if (
                  !arrDuplicateEmail.some(
                    (itemDuplicate) =>
                      parseInt(itemDuplicate) === parseInt(item.key)
                  )
                ) {
                  arrDuplicateEmail.push(item.key)
                }
              }
            }
          )
        }
      }

      if (item.phone.trim().length === 0) {
        arrEmptyPhone.push(item.key)
      }
    })

    if (arrDuplicateEmail.length > 0) {
      arrDuplicateEmail.map((item) => {
        newListCVInvalid = handleAddListCVInvalid(
          "email",
          item,
          { ...newListCVInvalid },
          "duplicate_email"
        )
      })
    }

    if (arrEmptyName.length > 0) {
      arrEmptyName.map((item) => {
        newListCVInvalid = handleAddListCVInvalid("name", item, {
          ...newListCVInvalid
        })
      })
    }

    if (arrEmptyEmail.length > 0) {
      arrEmptyEmail.map((item) => {
        newListCVInvalid = handleAddListCVInvalid("email", item, {
          ...newListCVInvalid
        })
      })
    }

    if (arrEmptyPhone.length > 0) {
      arrEmptyPhone.map((item) => {
        newListCVInvalid = handleAddListCVInvalid("phone", item, {
          ...newListCVInvalid
        })
      })
    }

    setState({
      listCVInvalid: newListCVInvalid
    })
  }
  const exportExcel = () => {
    setState({ loadExport: true })
    candidatesApi
      .exportData({ filters: { recruitment_proposal: id } })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `Candidates.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)

        setState({ loadExport: false })
      })
      .catch((err) => {
        setState({ loadExport: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.error")
        })
      })
  }
  const loadEmployeeEmail = (arrJob = []) => {
    recruitmentsApi.loadEmployeeEmail(arrJob).then((res) => {
      setState({
        listEmployeeEmail: res.data
      })
    })
  }

  useEffect(() => {
    if (
      state.listCVUpload !== undefined &&
      Object.keys(state.listCVUpload).length > 0
    ) {
      handleSetListInvalidCV()
    }
  }, [state.listCVUpload, state.listEmployeeEmail])
  useEffect(() => {
    loadData()
  }, [id])

  return (
    <React.Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage(
              "modules.recruitments.kanban.breadcumb.recruitments"
            ),
            link: "#"
          },
          {
            title: useFormatMessage(
              "modules.recruitments.kanban.breadcumb.jobs"
            ),
            link: "/recruitments/jobs"
          },
          {
            title: state.job.recruitment_code
          }
        ]}
        custom={
          <>
            <Button.Ripple
              color="primary"
              className="ms-1"
              disabled={
                state.job.status?.value * 1 ===
                getOptionValue(options, "status", "closed")
              }
              onClick={() => {
                setState({
                  addCandidateModal: !state.addCandidateModal
                })
              }}>
              <i className="icpega Actions-Plus"></i> &nbsp;
              <span className="align-self-center">
                {useFormatMessage("modules.candidates.button.new_candidate")}
              </span>
            </Button.Ripple>
          </>
        }
      />
      {state.job.status?.value * 1 ===
        getOptionValue(options, "status", "closed") && (
        <Alert color="danger" className="mb-2">
          <div className="alert-body d-flex align-items-center">
            <AlertCircle size={15} />{" "}
            <span className="ms-1">
              {useFormatMessage("modules.recruitments.text.this_job_closed")}
            </span>
          </div>
        </Alert>
      )}
      <Card className="jobDetail">
        <CardHeader>
          <div className="d-flex flex-wrap">
            <div className="card-title">
              <span className="title-icon-med">
                <i className="fad fa-suitcase"></i>
              </span>

              <span className="jobName">{state.job.recruitment_code}</span>
              <span>
                <a href={"/careers/" + state.job?.slug} target="blank">
                  <i className="far fa-external-link ms-50 careerBtn"></i>
                </a>
              </span>
              <br />
              <Dropdown
                trigger={["click"]}
                overlay={() => (
                  <Menu>
                    {publish_status.map((item, index) => (
                      <Menu.Item
                        key={index}
                        onClick={() => {
                          changePublishStatus(item)
                        }}
                        disabled={
                          state.job.status?.value * 1 ===
                          getOptionValue(options, "status", "closed")
                        }
                        className={`jobStatus-${item?.icon}`}>
                        <i className="fas fa-circle"></i>
                        {useFormatMessage(`${item?.label}`)}
                      </Menu.Item>
                    ))}
                  </Menu>
                )}>
                <a
                  className={`ant-dropdown-link jobStatus jobStatus-${state.publish_status?.icon}`}
                  onClick={(e) => e.preventDefault()}>
                  <i className="fas fa-circle"></i>{" "}
                  {useFormatMessage(`${state.publish_status?.label}`)}{" "}
                  <DownOutlined />
                </a>
              </Dropdown>
            </div>
          </div>
          <div className="d-flex ms-auto">
            <ErpInput
              onChange={handleSearchVal}
              formGroupClass="search-filter me-1"
              placeholder="Search candidate"
              prepend={<i className="iconly-Search icli"></i>}
              nolabel
            />
            <ButtonGroup className="mb-1 me-1 viewType">
              <Button
                outline={state.viewType === "list"}
                color="primary"
                className="kanbanType"
                onClick={() => setState({ viewType: "kanban" })}>
                <i className="icpega Grid-Menu" />
              </Button>
              <Button
                outline={state.viewType === "kanban"}
                color="primary"
                className="listType"
                onClick={() => setState({ viewType: "list" })}>
                <i className="icpega Feed-List" />
              </Button>
            </ButtonGroup>

            <ButtonGroup className="mb-1 me-1 viewType">
              <Button
                outline
                className="historyBtn"
                color="secondary"
                id="btn-upload"
                disabled={
                  state.job.status?.value * 1 ===
                  getOptionValue(options, "status", "closed")
                }
                onClick={() => toggleUploadCVModal()}>
                <Upload />
              </Button>
            </ButtonGroup>
            <UncontrolledTooltip placement="top" target="btn-upload">
              {useFormatMessage("modules.candidates.button.upload_cv")}
            </UncontrolledTooltip>
            <ButtonGroup className="mb-1 me-1 viewType">
              <Button
                outline
                className="historyBtn"
                color="secondary"
                id="btn-export"
                onClick={() => exportExcel()}
                disabled={state.loadExport}>
                <Download />
              </Button>
            </ButtonGroup>
            <UncontrolledTooltip placement="top" target="btn-export">
              {useFormatMessage("modules.candidates.button.export")}
            </UncontrolledTooltip>
            <ButtonGroup className="mb-1 viewType">
              <Button
                outline
                className="historyBtn"
                color="secondary"
                onClick={() => {
                  setState({
                    activityModal: !state.activityModal
                  })
                }}>
                <Clock />
              </Button>
            </ButtonGroup>
          </div>
        </CardHeader>
        <CardBody className="pt-1">
          {state.viewType === "kanban" ? (
            <JobKanban
              loading={state.loading}
              stages={state.stages}
              onCandidateMove={handleStageChange}
              actionsBeforeDrag={actionsBeforeDrag}
              actionsAfterDrag={actionsAfterDrag}
              onCandidateClick={(candidate) => {
                handleDetail(candidate)
              }}
              loadData={loadData}
              closed={
                state.job.status?.value * 1 ===
                getOptionValue(options, "status", "closed")
              }
            />
          ) : (
            <Fragment>
              <CandidateTable
                pagination={{ toltalRow: 2, currentPage: 1, perPage: 10 }}
                data={state.listCandidate}
                loadData={loadData}
              />
            </Fragment>
          )}
        </CardBody>
      </Card>
      <JobActivityModal
        modal={state.activityModal}
        recruitmentId={id}
        toggleModal={() => {
          setState({
            activityModal: !state.activityModal
          })
        }}
      />
      <AddCandidateModal
        loadData={loadData}
        modal={state.addCandidateModal}
        handleNewRe={() => {
          setState({
            addCandidateModal: !state.addCandidateModal
          })
        }}
        idJob={id}
        updateData={{
          recruitment_proposal: {
            label: state.job?.recruitment_code,
            value: state.job?.id
          }
        }}
      />
      <CandidateDetail
        modal={state.modalDetail}
        dataDetail={state.dataDetail}
        handleDetail={handleDetail}
        loadData={loadData}
      />
      <UploadCVModal
        modal={state.uploadCVModal}
        listCVUpload={state.listCVUpload}
        metas={metas}
        moduleName={moduleName}
        handleModal={toggleUploadCVModal}
        setState={setState}
        jobUpdate={{
          value: id,
          label: state.job?.recruitment_code
        }}
      />
      <PreviewListCV
        visible={state.showPreviewCV}
        listCVUpload={state.listCVUpload}
        listCVInvalid={state.listCVInvalid}
        listFileCV={state.listFileCV}
        listEmployeeEmail={state.listEmployeeEmail}
        recruitmentProposal={state.recruitmentProposal}
        metas={metas}
        moduleName={moduleName}
        setState={setState}
        loadData={loadData}
        changeJob={loadEmployeeEmail}
        jobUpdate={{
          value: id,
          label: state.job?.recruitment_code
        }}
      />
    </React.Fragment>
  )
}

export default JobDetail
