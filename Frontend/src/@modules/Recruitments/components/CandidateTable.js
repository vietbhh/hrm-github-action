// ** React Imports
import { DownOutlined } from "@ant-design/icons"
import promiseModal from "@apps/components/modals/PromiseModal"
import { ActionCellComp } from "@apps/modules/default/components/ListDefaultModule"
import TableDefaultModule from "@apps/modules/default/components/table/TableDefaultModule"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  formatDateTime,
  getBool,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { cellHandle, defaultCellHandle } from "@apps/utility/TableHandler"
import { Dropdown, Menu } from "antd"
import { filter, forEach, isFunction, isUndefined, map } from "lodash"
import { isEmpty } from "lodash-es"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "reactstrap"
import { Table } from "rsuite"
import { candidatesApi, recruitmentsApi } from "../common/api"
import InterviewActionModal from "../components/actions/InterviewActionModal"
import OfferedActionModal from "../components/actions/OfferedActionModal"
import RejectedActionModal from "../components/actions/RejectedActionModal"
import CandidateDetail from "../components/modals/CandidateDetailModal"
const CandidateTable = (props) => {
  // ** Props
  const { data, params, pagination, loadData, loading } = props
  const candidates = useSelector((state) => state.app.modules.candidates)
  const module = candidates.config
  const options = candidates.options
  const moduleName = candidates.config.name
  const appSetting = useSelector((state) => state.auth.settings)
  const filterConfig = useSelector((state) => state.app.filters)
  const defaultFields = filterConfig.defaultFields
  const { Cell } = Table
  const [state, setState] = useMergedState({
    job: {},
    stages: {
      columns: []
    },
    publish_status: {},
    dataStage: [],
    dataList: [],
    dataDetail: {},
    modalDetail: false,
    modalAddnew: false,
    settingModal: false,
    loading: false,
    viewGrid: true,
    textSearch: ""
  })

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
  const menu = (rowData) => {
    const stageArr = []
    state.dataStage.map((item, index) => {
      stageArr.push({
        label: (
          <div
            onClick={() => {
              changeStage(item.stage, rowData)
            }}>
            {item.stage}
          </div>
        ),
        key: index + item.stage
      })
    })
    return <Menu items={stageArr} />
  }
  const CellDisplay = (props) => {
    const { field, rowData, cellProps } = props
    switch (field.field) {
      case "candidate_name":
        return (
          <div className="d-flex justify-content-left align-items-center text-dark">
            <Avatar
              className="my-0 mr-50"
              size="sm"
              src={
                !isEmpty(rowData.candidate_avatar) && rowData.candidate_avatar
              }
            />
            <div
              className="d-flex flex-column cursor ms-50"
              onClick={() => handleDetail(rowData)}>
              <p className="user-name text-truncate mb-0">
                <span className="font-weight-bold">
                  {rowData.candidate_name}
                </span>
              </p>
            </div>
          </div>
        )
      case "stage":
        return (
          <Fragment>
            <Dropdown overlay={menu(rowData)} trigger={["click"]}>
              <Button outline className="status-stage p-50">
                {rowData.stage && rowData.stage.label} <DownOutlined />
              </Button>
            </Dropdown>
          </Fragment>
        )
      default:
        return cellHandle(field, rowData, cellProps)
    }
  }

  const changeStage = async (index, data) => {
    // await loadJob(data.recruitment_proposal.value, data.stage.label, index)
    recruitmentsApi
      .getJob(data.recruitment_proposal, state.textSearch)
      .then(async (res) => {
        const { stages, ...rest } = res.data
        const toStage = stages.find(({ title }) => title === index)
        const fromStage = stages.find(({ title }) => title === data.stage.label)
        console.log("rest", rest)
        setState({
          loading: false,
          job: rest,
          stages: {
            columns: stages
          },
          publish_status: rest.publish_status
        })

        const source = {
            fromColumnId: fromStage.id,
            fromStageName: fromStage.title
          },
          destination = { toColumnId: toStage.id, toStageName: toStage.title }

        const _card = {
          candidate_avatar: data.candidate_avatar,
          candidate_dob: data.candidate_dob,
          candidate_email: data.candidate_email,
          candidate_name: data.candidate_name,
          candidate_phone: data.candidate_phone,
          gender: data.gender,
          id: data.id,
          is_employed: data.is_employed,
          recruitment_proposal: data.recruitment_proposal,
          stage: data.stage,
          stage_order: data.stage_order
        }

        let actionBeforeResult = true
        const currentCol = data.stage.label
        if (isFunction(actionsBeforeDrag[currentCol])) {
          actionBeforeResult = await actionsBeforeDrag[currentCol](data)
          if (!actionBeforeResult) {
            return
          }
        }

        const targetCol = index
        let actionAfterResult = true
        if (isFunction(actionsAfterDrag[targetCol])) {
          actionAfterResult = await actionsAfterDrag[targetCol](data)
          let isComplete = false
          if (actionAfterResult) {
            isComplete = await handleStageChange(
              _card,
              { columns: stages },
              source,
              destination,
              actionAfterResult
            )
            if (isComplete) {
              loadData()
            }
          }
        } else {
          const m = await handleStageChange(
            _card,
            { columns: stages },
            source,
            destination
          )
          if (m) {
            loadData()
          }
        }
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
              stage: target.id === value.id ? destination.toColumnId : item.id
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
              stage: target.id === value.id ? destination.toColumnId : item.id
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
      .changeStage(target.recruitment_proposal, datasend)
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
      const rejection_reason_options = options.rejection_reason
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
                handleModal={onDismiss}
                onSubmit={onSubmit}
                onClosed={onDismiss}
                loadData={() => {}}
                metas={employeeModule.metas}
                options={employeeModule.options}
                module={employeeModule.config}
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
          dataDetail: res.data,
          loading: false
        })
      })
    } else {
      setState({ modalDetail: !state.modalDetail })
    }
  }

  useEffect(() => {
    loadStage()
  }, [])

  const loadStage = () => {
    defaultModuleApi.getList("hiring_workflow").then((res) => {
      setState({ dataStage: res.data.results })
    })
  }
  // ** Function to getTasks based on search query
  const moduleStore = useSelector((state) => state.app.modules[moduleName])
  let customColumnAfter = [
    {
      props: {
        width: 130,
        align: "center",
        verticalAlign: "middle",
        fixed: "right"
      },
      header: useFormatMessage("app.action"),
      cellComponent: (cellProps) => {
        return (
          <>
            <ActionCellComp
              handleDeleteClick={(idDelete = "") => {
                if (idDelete !== "") {
                  SwAlert.showWarning({
                    confirmButtonText: useFormatMessage("button.delete")
                  }).then((res) => {
                    if (res.value) {
                      defaultModuleApi
                        .delete("candidates", idDelete)
                        .then((result) => {
                          loadData()
                          notification.showSuccess({
                            text: useFormatMessage(
                              "notification.delete.success"
                            )
                          })
                        })
                        .catch((err) => {
                          notification.showError({
                            text: err.message
                          })
                        })
                    }
                  })
                }
              }}
              handleUpdateClick={(id = false) => {
                handleDetail(cellProps.rowData)
              }}
              module={module}
              {...cellProps}
            />
          </>
        )
      }
    }
  ]
  customColumnAfter = [
    ...map(
      filter(
        defaultFields,
        (field) =>
          !isUndefined(
            module.user_options?.table?.metas?.[field.field]?.field_table_show
          ) &&
          getBool(
            module.user_options?.table?.metas?.[field.field]?.field_table_show
          ) === true
      ),
      (field) => {
        return {
          props: {
            width: 110,
            align: "center",
            verticalAlign: "middle"
          },
          header: useFormatMessage(`common.${field.field}`),
          cellComponent: (props) => {
            return (
              <Cell
                {...props}
                dataKey={field.field}
                className={`table_cell_${field.field}`}>
                {(rowData) => {
                  return defaultCellHandle(field, rowData[field.field])
                }}
              </Cell>
            )
          }
        }
      }
    ),
    ...customColumnAfter
  ]
  return (
    <Fragment>
      <TableDefaultModule
        metas={moduleStore.metas}
        data={data}
        recordsTotal={pagination.toltalRow}
        currentPage={pagination.currentPage}
        perPage={pagination.perPage}
        module={moduleStore.config}
        loading={loading}
        CustomCell={CellDisplay}
        allowSelectRow={false}
        onChangePage={(page) => {
          loadData({ ...params, page: page })
        }}
        onChangeLength={(length) => {
          loadData({ ...params, length: length.toString() })
        }}
        onSortColumn={false}
        onSelectedRow={false}
        onDragColumn={false}
        onResize={(field, width) => {
          defaultModuleApi.updateUserMetas(moduleName, {
            data: [
              {
                module_id: field.module,
                module_meta_id: field.id,
                field_table_width: width
              }
            ]
          })
        }}
        customColumnAfter={customColumnAfter}
      />
      <CandidateDetail
        modal={state.modalDetail}
        dataDetail={state.dataDetail}
        handleDetail={handleDetail}
      />
    </Fragment>
  )
}

export default CandidateTable
