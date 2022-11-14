import { DownOutlined } from "@ant-design/icons"
import { Button, Dropdown, Menu, Space } from "antd"
// ** React Imports
import promiseModal from "@apps/components/modals/PromiseModal"
import {
  formatDateTime,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { forEach, isFunction, map } from "lodash"
import { recruitmentsApi } from "../common/api"
import InterviewActionModal from "../components/actions/InterviewActionModal"
import OfferedActionModal from "../components/actions/OfferedActionModal"
import RejectedActionModal from "../components/actions/RejectedActionModal"
import { useSelector } from "react-redux"
const MoveStage = (props) => {
  const { stages, infoCandidate, loadData, closed } = props
  const appSetting = useSelector((state) => state.auth.settings)
  const [state, setState] = useMergedState({
    job: {},
    stages: {
      columns: []
    },
    publish_status: {},
    loading: false,
    textSearch: ""
  })
  const handleClick = (idStage) => {
    changeStage(idStage.key, infoCandidate)
  }
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
  const changeStage = async (index, data) => {
    recruitmentsApi
      .getJob(data.recruitment_proposal?.value, state.textSearch)
      .then(async (res) => {
        const { stages, ...rest } = res.data
        const toStage = stages.find(({ title }) => title === index)
        const fromStage = stages.find(({ title }) => title === data.stage.label)
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
          recruitment_proposal: data.recruitment_proposal?.value,
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

              infoCandidate.stage = {
                value: infoCandidate.listStage[toStage.id].id,
                label: infoCandidate.listStage[toStage.id].title
              }
              notification.showSuccess({
                text: useFormatMessage("notification.save.success")
              })
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

            infoCandidate.stage = {
              value: infoCandidate.listStage[toStage.id].id,
              label: infoCandidate.listStage[toStage.id].title
            }
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
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
        .checkCandidateInterviewSchedule(
          data.recruitment_proposal?.value,
          data.id
        )
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

  const menu = (stages) => {
    const arrItem = []
    map(stages, (item, index) => {
      const obj = {
        label: item.title,
        key: item.title,
        disabled: closed
      }
      arrItem.push(obj)
    })
    return <Menu onClick={handleClick} items={arrItem} />
  }
  return (
    <>
      <Dropdown overlay={menu(stages)}>
        <Button className="btn btn-primary btn-sm ms-1">
          <Space>
            {useFormatMessage("modules.candidates.button.moveTo")}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </>
  )
}

export default MoveStage
