import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import {
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { Collapse, Space } from "antd"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Button } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { ChecklistApi } from "../common/api"
import TaskDetail from "../components/detail/TaskDetail"
import AddTaskModal from "../components/modals/AddTaskModal"
import CheckListLayout from "./CheckListTemplateLayout"

const { Panel } = Collapse

const DetailChecklistTemplate = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    loading: true,
    perPage: 15,
    recordsTotal: 0,
    currentPage: 1,
    searchVal: "",
    tableFilters: [],
    addModal: false,
    settingModal: false,
    filterModal: false,
    exportModal: false,
    selectedRows: [],
    orderCol: "id",
    orderType: "desc"
  })

  const moduleData = useSelector(
    (state) => state.app.modules.checklist_template_detail
  )
  const module = moduleData.config
  const moduleName = module.name
  const ability = useContext(AbilityContext)
  const metas = moduleData.metas
  const options = moduleData.options

  const optionsModules = useSelector((state) => state.app.optionsModules)
  const [fillData, setFillData] = useState({})
  const [isEditModal, setIsEditModal] = useState(false)

  const { type, id } = useParams()

  const loadData = () => {
    setState({
      loading: true
    })
    ChecklistApi.getDetailChecklist(id).then((res, stateParams = {}) => {
      const resData = res.data.results.data
      setState({
        data: resData,
        loading: false,
        ...stateParams
      })
    })
  }

  const toggleAddModal = () => {
    setFillData({})
    setIsEditModal(false)
    setState({
      addModal: !state.addModal
    })
  }

  const handleEdit = (e, task) => {
    e.stopPropagation()
    setIsEditModal(true)
    setFillData({
      ...task
    })
    setState({
      addModal: !state.addModal
    })
  }

  const handleDelete = (e, task) => {
    e.stopPropagation()
    ChecklistApi.deleteTask(task.id)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
        loadData()
        setState({ loading: false })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.delete.error")
        })
      })
  }

  const handleAddTask = () => {
    setState({
      isEditModal: false,
      addModal: true
    })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  // ** render
  const addBtn = ability.can("add", moduleName) ? (
    <Button.Ripple color="primary" onClick={() => handleAddTask()}>
      <i className="icpega Actions-Plus"></i> &nbsp;
      <span className="align-self-center">
        {useFormatMessage("modules.checklist_template.buttons.add_detail")}
      </span>
    </Button.Ripple>
  ) : (
    ""
  )

  const renderBreadCrumb = () => {
    return (
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage("modules.checklist.title.checklist")
          },
          {
            title: useFormatMessage("modules.checklist_template.title.setting")
          }
        ]}
        custom={addBtn}
      />
    )
  }

  const renderListTask = () => {
    if (state.data.checklistDetail.length > 0) {
      return state.data.checklistDetail.map((task) => {
        const taskAction = () => {
          return (
            <div className="d-flex">
              <Button.Ripple
                size="sm"
                color="flat-primary"
                onClick={(event) => handleEdit(event, task)}>
                <i className="fal fa-edit" />
              </Button.Ripple>
              <Button.Ripple
                size="sm"
                color="flat-danger"
                onClick={(event) => handleDelete(event, task)}>
                <i className="far fa-trash-alt" />
              </Button.Ripple>
            </div>
          )
        }
        return (
          <Collapse key={task.id} expandIconPosition="start">
            <Panel header={task.task_name} extra={taskAction()}>
              <TaskDetail {...task} options={options} />
            </Panel>
          </Collapse>
        )
      })
    } else {
      return (
        <div className="mt-3">
          <EmptyContent />
        </div>
      )
    }
  }

  const renderChecklistDetail = () => {
    return (
      <div>
        <h3 className="mb-2">{state.data.checklist.name}</h3>
        <Space direction="vertical">{renderListTask()}</Space>
      </div>
    )
  }

  return (
    <>
      <CheckListLayout
        state={state}
        setState={setState}
        loadData={loadData}
        options={options}
        module={module}
        ability={ability}
        breadcrumbs={renderBreadCrumb()}>
        {state.loading ? <AppSpinner /> : renderChecklistDetail()}
      </CheckListLayout>

      <AddTaskModal
        modal={state.addModal}
        handleModal={toggleAddModal}
        loadData={loadData}
        metas={metas}
        options={options}
        module={module}
        checklistInfo={state.data.checklist}
        optionsModules={optionsModules}
        fillData={fillData}
        modalTitle={useFormatMessage(
          "modules.checklist_template_detail.buttons.add"
        )}
        isEditModal={isEditModal}
        checklistType={type}
      />
    </>
  )
}

export default DetailChecklistTemplate
