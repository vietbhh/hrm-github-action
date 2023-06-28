import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { useSelector } from "react-redux"
import { AbilityContext } from "utility/context/Can"

import { EmptyContent } from "@apps/components/common/EmptyContent"
import notification from "@apps/utility/notification"
import { useParams } from "react-router-dom"
import { Button, Col, Row } from "reactstrap"
import { ChecklistApi } from "../common/api"
import ChecklistItem from "../components/detail/CheckListItem"
import AddChecklistTemplateModal from "../components/modals/AddChecklistTemplateModal"
import DuplicateChecklistTemplateModal from "../components/modals/DuplicateChecklistTemplateModal"
import CheckListLayout from "./CheckListTemplateLayout"
import { Fragment, useContext, useEffect, useState } from "react"

const SettingChecklistTemplate = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    loading: true,
    perPage: 15,
    recordsTotal: 0,
    currentPage: 1,
    searchVal: "",
    tableFilters: [],
    addModal: false,
    duplicateModal: false,
    fillDataDuplicate: {},
    settingModal: false,
    filterModal: false,
    exportModal: false,
    selectedRows: [],
    orderCol: "id",
    orderType: "desc"
  })

  const moduleData = useSelector(
    (state) => state.app.modules.checklist_template
  )
  const module = moduleData.config
  const moduleName = module.name
  const ability = useContext(AbilityContext)
  const metas = moduleData.metas
  const options = moduleData.options

  const optionsModules = useSelector((state) => state.app.optionsModules)
  const [windowWidth, setWindowWidth] = useState(null)
  const { type } = useParams()

  const [fillData, setFillData] = useState({})
  const [isEditModal, setIsEditModal] = useState({})

  const [modalTitle, setModalTitle] = useState(
    useFormatMessage("modules.checklist_template.buttons.add")
  )

  const getChosenType = (type, item) => {
    return item.name_option === type
  }

  const getCurrentType = (type) => {
    if (type === undefined) {
      return { value: getOptionValue(options, "type", "onboarding") }
    }
    const [currentType] = options.type.filter(
      getChosenType.bind(this, type.toLowerCase())
    )
    return currentType
  }

  const [filters, setFilters] = useMergedState({
    type: getCurrentType(type).value
  })

  const toggleAddModal = () => {
    setFillData({})
    setIsEditModal(false)
    setState({
      addModal: !state.addModal
    })
  }

  const toggleDuplicateModal = () => {
    setState({
      duplicateModal: !state.duplicateModal
    })
  }

  const setFillDataDuplicateModal = (data) => {
    setState({
      fillDataDuplicate: data
    })
  }

  const loadApi = (props) => {
    const params = {
      perPage: state.perPage,
      filters: filters,
      search: state.searchVal,
      orderCol: state.orderCol,
      orderType: state.orderType,
      tableFilters: state.tableFilters,
      ...props
    }
    return ChecklistApi.getList(params)
  }
  const loadData = () => {
    setState({
      loading: true
    })
    const params = {
      perPage: state.perPage,
      orderCol: state.orderCol,
      orderType: state.orderType,
      ...props
    }
    loadApi(params).then((res, stateParams = {}) => {
      setState({
        data: res.data.results,
        loading: false,
        recordsTotal: res.data.recordsTotal,
        currentPage: res.data.page,
        perPage: params.perPage,
        orderCol: params.orderCol,
        orderType: params.orderType,
        ...stateParams
      })
    })
  }

  const saveData = (values) => {
    ChecklistApi.postSave(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        toggleAddModal()
        loadData()
        setState({ loading: false })
      })
      .catch((err) => {
        //props.submitError();
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const editChecklist = (data) => {
    setFillData({
      id: data.id,
      name: data.name,
      type: data.type,
      description: data.description
    })
    setModalTitle(data.modalTitle)
    setIsEditModal(true)
    setState({
      addModal: !state.addModal
    })
  }

  const deleteChecklist = (id) => {
    ChecklistApi.deleteChecklist(id)
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

  // ** effect
  useEffect(() => {
    loadData()
  }, [filters, state.searchVal, state.tableFilters])

  useEffect(() => {
    if (window !== undefined) {
      setWindowWidth(window.innerWidth)
      window.addEventListener("resize", setWindowWidth(window.innerWidth))
    }
  }, [])

  useEffect(() => {
    setFilters((oldFilter) => ({
      ...oldFilter,
      type: getCurrentType(type).value
    }))
  }, [type])

  // ** render
  const addBtn = ability.can("add", moduleName) ? (
    <Button.Ripple color="primary" onClick={toggleAddModal}>
      <i className="icpega Actions-Plus"></i> &nbsp;
      <span className="align-self-center">
        {useFormatMessage("modules.checklist_template.buttons.add")}
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

  const renderChecklist = () => {
    if (state.data.length > 0) {
      return (
        <div className="row mt-2">
          {state.data.map((checklist) => {
            return (
              <ChecklistItem
                key={checklist.id}
                checklistInfo={checklist}
                editChecklist={editChecklist}
                deleteChecklist={deleteChecklist}
                toggleDuplicateModal={toggleDuplicateModal}
                setFillDataDuplicateModal={setFillDataDuplicateModal}
              />
            )
          })}
        </div>
      )
    }
    return (
      <Row className="mt-2">
        <Col sm={12}>
          <EmptyContent />
        </Col>
      </Row>
    )
  }

  const renderDuplicateModal = () => {
    return (
      <DuplicateChecklistTemplateModal
        modal={state.duplicateModal}
        handleModal={toggleDuplicateModal}
        loadData={loadData}
        metas={metas}
        moduleName={moduleName}
        fillData={state.fillDataDuplicate}
      />
    )
  }

  return (
    <Fragment>
      <CheckListLayout
        state={state}
        setState={setState}
        loadData={loadData}
        options={options}
        module={module}
        ability={ability}
        breadcrumbs={renderBreadCrumb()}>
        {state.loading ? <AppSpinner /> : renderChecklist()}
      </CheckListLayout>

      <AddChecklistTemplateModal
        modal={state.addModal}
        handleModal={toggleAddModal}
        loadData={loadData}
        saveData={saveData}
        metas={metas}
        options={options}
        module={module}
        optionsModules={optionsModules}
        fillData={fillData}
        modalTitle={modalTitle}
        isEditModal={isEditModal}
        moduleName={moduleName}
      />

      {state.duplicateModal && renderDuplicateModal()}
    </Fragment>
  )
}

export default SettingChecklistTemplate
