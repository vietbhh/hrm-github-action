import { EmptyContent } from "@apps/components/common/EmptyContent"
import LockedCard from "@apps/components/common/LockedCard"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { workScheduleApi } from "@modules/WorkSchedule/common/api"
import WorkScheduleDetail from "@modules/WorkSchedule/components/WorkScheduleDetail"
import { isEmpty } from "lodash-es"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button, Card, CardBody, CardHeader, Spinner } from "reactstrap"

import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
const EmployeeWorkSchedule = (props) => {
  const { api, permits, employeeData, reload } = props
  const [state, setState] = useMergedState({
    workScheduleChange: false,
    workScheduleID: 0,
    contractLoading: true,
    contractUpdateId: null,
    Detail: {},
    timeMachineID: 0
  })
  const canView = permits.view || false
  const canUpdate = permits.update || false
  const modules = useSelector((state) => state.app.modules.employees)
  const module = modules.config
  const moduleName = module.name
  const metas = modules.metas
  const options = modules.options

  const loadWorkSchedule = (id) => {
    if (!isEmpty(id)) {
      workScheduleApi.info(id).then((res) => {
        res.data.id_time_machine = employeeData.id_time_machine
        res.data.showIDTM = true
        setState({
          contractLoading: false,
          Detail: res.data,
          timeMachineID: employeeData.id_time_machine,
          workScheduleID: employeeData.work_schedule?.value
        })
      })
    } else {
      setState({
        contractLoading: false
      })
    }
  }
  useEffect(() => {
    loadWorkSchedule(employeeData.work_schedule?.value)
  }, [employeeData])

  const updateWorkSchedule = () => {
    if (employeeData.work_schedule?.value === state.workScheduleID) {
      const data = { id: employeeData.id }
      data.id_time_machine = state.timeMachineID
      defaultModuleApi.postSave("employees", data).then((res) => {
        employeeData.id_time_machine = state.timeMachineID
        loadWorkSchedule(state.workScheduleID)
        setState({
          workScheduleChange: !state.workScheduleChange
        })
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
    } else {
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.confirm"),
        html: useFormatMessage(
          "modules.work_schedules.text.note_edit_work_schedule"
        ),
        title: useFormatMessage(
          "modules.work_schedules.text.change_work_schedule"
        )
      }).then((res) => {
        if (res.value) {
          const data = { id: employeeData.id }
          data.work_schedule = state.workScheduleID
          data.id_time_machine = state.timeMachineID
          defaultModuleApi.postSave("employees", data).then((res) => {
            loadWorkSchedule(state.workScheduleID)
            setState({
              workScheduleChange: !state.workScheduleChange
            })
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
          })
        }
      })
    }
  }
  return (
    <Fragment>
      <LockedCard blocking={!canView}>
        <Card className="card-inside with-border-radius life-card">
          <CardHeader>
            <div className="d-flex flex-wrap w-100">
              <h1 className="card-title">
                <span className="title-icon">
                  <i className="fal fa-clipboard-list-check" />
                </span>
                <span>
                  {useFormatMessage("modules.employees.tabs.job.work_schedule")}
                </span>
              </h1>
              {canUpdate && (
                <div className="d-flex ms-auto">
                  <Button
                    color="flat-primary"
                    tag="div"
                    className="text-primary btn-table-more btn-icon"
                    onClick={() => {
                      setState({
                        workScheduleChange: !state.workScheduleChange
                      })
                    }}>
                    <i className="iconly-Edit icli" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {state.contractLoading && <DefaultSpinner center="true" />}
            {!state.contractLoading &&
              !state.workScheduleChange &&
              isEmpty(state.Detail.id) && <EmptyContent />}
            {!state.contractLoading && !state.workScheduleChange && (
              <WorkScheduleDetail item={state.Detail} />
            )}

            {state.workScheduleChange && (
              <>
                <div className="row ">
                  <div className="col-6">
                    <FieldHandle
                      module={moduleName}
                      fieldData={{
                        ...metas.work_schedule
                      }}
                      options={options}
                      isClearable={false}
                      labelInline
                      updateData={employeeData.work_schedule}
                      onChange={(e) =>
                        setState({
                          workScheduleID: e.value
                        })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <FieldHandle
                      module={moduleName}
                      fieldData={{
                        ...metas.id_time_machine
                      }}
                      onChange={(e) => {
                        setState({ timeMachineID: e.target.value })
                      }}
                      labelInline
                      value={employeeData?.id_time_machine}
                    />
                  </div>
                  <div className="col-12 text-center">
                    <Button.Ripple
                      type="submit"
                      color="primary"
                      className="me-1"
                      onClick={() => updateWorkSchedule()}>
                      <span className="align-middle d-sm-inline-block d-none">
                        {props.saving && (
                          <Spinner size="sm" className="me-50" />
                        )}
                        {useFormatMessage("button.update")}
                      </span>
                    </Button.Ripple>
                    <Button.Ripple
                      type="submit"
                      color="primary"
                      onClick={() => {
                        setState({
                          workScheduleChange: !state.workScheduleChange
                        })
                      }}>
                      <span className="align-middle d-sm-inline-block d-none">
                        {useFormatMessage("button.cancel")}
                      </span>
                    </Button.Ripple>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </LockedCard>
    </Fragment>
  )
}

export default EmployeeWorkSchedule
