// ** React Imports
import { CaretRightOutlined } from "@ant-design/icons"
import { ErpInput, ErpSwitch } from "@apps/components/common/ErpField"
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
// ** Styles
import SwAlert from "@apps/utility/SwAlert"
import "@styles/react/apps/app-todo.scss"
import { Collapse, Dropdown, Menu } from "antd"
import React, { useContext, useEffect, useRef } from "react"
import { MoreVertical, Plus } from "react-feather"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { workScheduleApi } from "../common/api"
import WorkScheduleDetail from "../components/WorkScheduleDetail"

const WorkSchedule = (props) => {
  const ability = useContext(AbilityContext)
  const { Panel } = Collapse
  // 17-05
  const modules = useSelector((state) => state.app.modules.work_schedules)
  const module = modules.config
  const moduleName = module.name
  const metas = modules.metas
  const options = modules.options
  const format = "HH:mm"
  const [state, setState] = useMergedState({
    loading: false,
    dataList: [],
    filters: {}
  })

  const loaddata = (props) => {
    const paramsEx = {
      ...state.filters,
      ...props
    }
    workScheduleApi.getList(paramsEx).then((res) => {
      setState({
        loading: false,
        dataList: res.data,
        filters: paramsEx
      })
    })
  }
  const handleFilter = (e) => {
    const arrFilter = Object.assign({}, { ...state.filters }, e)
    loaddata({ ...arrFilter })
  }

  const typingTimeoutRef = useRef(null)

  const handleFilterText = (e) => {
    const arrFilter = Object.assign({}, { ...state.filters }, e)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      loaddata({ ...arrFilter })
    }, 500)
  }

  const genExtra = (item) => (
    <div
      className="d-flex active-schedule "
      onClick={(e) => e.stopPropagation()}>
      <ErpSwitch
        id={item?.id}
        name="primary"
        inline
        nolabel
        defaultValue={
          parseInt(item?.status.value) ===
          getOptionValue(options, "status", "active")
        }
        disabled={item?.default}
        onChange={(e) => changeSTT(e.target)}
      />
      <div style={{ width: "80px", marginLeft: "1rem" }}>
        {useFormatMessage(item.status?.label)}
      </div>
      <Dropdown
        menu={{
          items: [
            {
              label: (
                <div>
                  {useFormatMessage(
                    "modules.work_schedules.buttons.set_default"
                  )}
                </div>
              ),
              onClick: () => handleSetDefault(item?.id),
              disabled: item.default
            },
            {
              label: (
                <div>
                  {useFormatMessage("modules.work_schedules.buttons.duplicate")}
                </div>
              ),
              onClick: () => handleDuplicate(item?.id)
            },
            {
              label: <div>{useFormatMessage("button.edit")}</div>,
              onClick: () => handleEdit(item?.id)
            },
            {
              label: <div>{useFormatMessage("button.delete")}</div>,
              onClick: () => handleDelete(item),
              disabled: item.default
            }
          ]
        }}
        placement="bottomRight"
        overlayClassName="drop_workschedule">
        <Button className="p-0" color="flat-secondary">
          <MoreVertical size={15} />
        </Button>
      </Dropdown>
    </div>
  )

  const headerPanel = (item) => {
    return (
      <div className="d-flex align-items-center">
        <div className="title-panel">{item.name}</div>{" "}
        {item.default && (
          <Badge color="light-secondary" className="ms-1">
            {useFormatMessage("modules.work_schedules.fields.default")}
          </Badge>
        )}
      </div>
    )
  }

  const render = () => {
    return state.dataList.map((item) => {
      return (
        <Panel
          header={headerPanel(item)}
          key={item.id}
          className="site-collapse-custom-panel"
          extra={genExtra(item)}>
          <WorkScheduleDetail item={item} key={item.id + "_detail"} />
        </Panel>
      )
    })
  }
  const history = useNavigate()

  const methods = useForm({
    mode: "onSubmit"
  })

  const {
    handleSubmit,
    errors,
    control,
    register,
    reset,
    setValue,
    getValues
  } = methods

  useEffect(() => {
    loaddata()
  }, [])

  const changeSTT = (e) => {
    const stt = e.checked
      ? getOptionValue(options, "status", "active")
      : getOptionValue(options, "status", "inactive")
    workScheduleApi
      .changeActive({ id: e.id, status: stt })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const handleSetDefault = (idSet) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.confirm"),
      title: useFormatMessage(
        "modules.work_schedules.text.setdefault_work_schedule"
      )
    }).then((res) => {
      if (res.value) {
        workScheduleApi
          .setDefault({ id: idSet })
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })

            loaddata()
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }

  const handleDuplicate = (idDuplicate) => {
    history("/work-schedules/duplicate/" + idDuplicate)
  }

  const handleEdit = (idDuplicate) => {
    history("/work-schedules/add/" + idDuplicate)
  }

  const handleDelete = (itemDelete) => {
    if (itemDelete.default) {
      notification.showError({
        text: useFormatMessage(
          "modules.work_schedules.text_note.can_not_del_default"
        )
      })
      return
    }
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete"),
      text: useFormatMessage(
        "modules.work_schedules.text_note.note_delete_workschedule"
      )
    }).then((res) => {
      if (res.value) {
        workScheduleApi
          .delete(itemDelete.id)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })

            loaddata()
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
    <React.Fragment>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h2 className="card-title">
          {useFormatMessage("modules.work_schedules.title")}
        </h2>
        <Button.Ripple
          color="primary"
          onClick={() => history("/work-schedules/add")}>
          <Plus size={20} />{" "}
          {useFormatMessage("modules.work_schedules.buttons.add_new")}
        </Button.Ripple>
      </div>
      <Card className="extraWidthLayoutPage work_schedule">
        <FormProvider {...methods}>
          <CardBody>
            <Row>
              <Col sm={12} md={3}>
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.type
                  }}
                  options={options}
                  nolabel
                  onChange={(e) =>
                    handleFilter({
                      type: e?.value || ""
                    })
                  }
                  isClearable={true}
                />
              </Col>

              <Col sm={12} md={3}>
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.status
                  }}
                  options={options}
                  nolabel
                  onChange={(e) =>
                    handleFilter({
                      status: e?.value || ""
                    })
                  }
                  isClearable={true}
                />
              </Col>
              <Col sm={2} key="search_text">
                <ErpInput
                  prepend={<i className="iconly-Search icli"></i>}
                  onChange={(e) =>
                    handleFilterText({
                      textSearch: e?.target.value || ""
                    })
                  }
                  name="search_field"
                  placeholder="Search"
                  label={useFormatMessage("modules.recruitments.fields.search")}
                  nolabel
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  className="site-collapse-custom-collapse">
                  {render()}
                </Collapse>
              </Col>
            </Row>
          </CardBody>
        </FormProvider>
      </Card>
    </React.Fragment>
  )
}
export default WorkSchedule
