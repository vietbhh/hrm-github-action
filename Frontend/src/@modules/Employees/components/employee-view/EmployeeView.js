import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { employeesApi } from "@modules/Employees/common/api"
import { Menu, Popover } from "antd"
import { Fragment, useEffect } from "react"
import { Button } from "reactstrap"
import ModalCreateView from "./ModalCreateView"
import ModalManageView from "./ModalManageView"

const EmployeeView = (props) => {
  const {
    filters,
    tableFilters,
    setLoadingEmployeeView,
    setFiltersAfterLoadEmployeeView,
    settingEmployeeView,
    setReduxAuth,
    updateModules
  } = props

  const [state, setState] = useMergedState({
    visibleEmployeeView: false,
    menuSelectedKey: 1,
    employeeViewTitle: "",
    employeeViewDescription: "",
    modalManageView: false,
    modalCreateView: false,
    settingEmployeeView: settingEmployeeView
  })

  const setSettingEmployeeView = (settings) => {
    setState({ settingEmployeeView: settings })
    setReduxAuth(settings)
  }

  useEffect(() => {
    state.settingEmployeeView.forEach((item, index) => {
      if (item.active === true) {
        setState({
          menuSelectedKey: item.key,
          employeeViewTitle: item.title,
          employeeViewDescription: item.description
        })
        return false
      }
    })
  }, [state.settingEmployeeView])

  const toggleModalManageView = () => {
    setState({
      modalManageView: !state.modalManageView,
      visibleEmployeeView: false
    })
  }

  const toggleModalCreateView = () => {
    setState({
      modalCreateView: !state.modalCreateView,
      visibleEmployeeView: false
    })
  }

  const handleVisibleChange = (newVisible) => {
    setState({ visibleEmployeeView: newVisible })
  }

  const setFilterEmployeeView = (filterEmployeeView) => {
    const key = filterEmployeeView.key
    setLoadingEmployeeView(true)
    employeesApi
      .getSetACtiveEmployeeView(key)
      .then((res) => {
        updateModules(res.data.moduleData.modules)
        setSettingEmployeeView(res.data.data_employee_view)
        setFiltersAfterLoadEmployeeView(res.data.data_active)
        //location.reload()
      })
      .catch((err) => {
        setLoadingEmployeeView(false)
      })
  }

  const renderTitle = () => {
    return (
      <>
        <i className="fa-regular fa-star me-10"></i>
        <span>
          {useFormatMessage("modules.employee_view.text.saved_views")}
        </span>
      </>
    )
  }

  const renderMenu = () => {
    const renderTitleMenu = (title, index) => {
      return (
        <>
          <span>{title}</span> {index <= 1 && <span>*</span>}
        </>
      )
    }
    const items = [
      ..._.map(state.settingEmployeeView, (item, index) => {
        return {
          key: item.key,
          label: renderTitleMenu(item.title, index)
        }
      })
    ]
    return (
      <Menu
        items={items}
        selectedKeys={[`${state.menuSelectedKey}`]}
        onClick={(item) => {
          const filterEmployeeView = state.settingEmployeeView.filter((val) => {
            return val.key.toString() === item.key.toString()
          })
          setFilterEmployeeView(filterEmployeeView[0])
          setState({
            visibleEmployeeView: false,
            menuSelectedKey: item.key,
            employeeViewTitle: filterEmployeeView[0].title,
            employeeViewDescription: filterEmployeeView[0].description
          })
        }}
      />
    )
  }

  const renderButton = () => {
    return (
      <>
        <div className="mt-10">
          <Button.Ripple
            color="primary"
            outline
            className="me-10"
            onClick={() => toggleModalCreateView()}>
            <i className="fa-regular fa-plus me-10"></i>
            {useFormatMessage("modules.employee_view.buttons.create_a_view")}
          </Button.Ripple>
          <Button.Ripple
            color="primary"
            outline
            onClick={() => toggleModalManageView()}>
            <i className="fa-regular fa-star me-10"></i>
            {useFormatMessage("modules.employee_view.buttons.manage_views")}
          </Button.Ripple>
        </div>
      </>
    )
  }

  const renderContent = () => {
    return (
      <>
        {renderMenu()}
        <hr />
        <div className="d-flex">
          <small className="ms-auto">
            * {useFormatMessage("modules.employee_view.text.note_*")}
          </small>
        </div>
        <hr />
        {renderButton()}
      </>
    )
  }

  return (
    <Fragment>
      <div className="employee-view">
        <Popover
          placement="bottomRight"
          title={renderTitle()}
          content={renderContent()}
          trigger="click"
          visible={state.visibleEmployeeView}
          onVisibleChange={handleVisibleChange}
          overlayClassName="employee-view-popover">
          <div className="employee-view-text">
            <span>{state.employeeViewTitle}</span>
            <i className="fa-regular fa-angle-down"></i>
          </div>
        </Popover>
        <div className="employee-view-des">{state.employeeViewDescription}</div>
      </div>

      <ModalCreateView
        modal={state.modalCreateView}
        toggleModal={toggleModalCreateView}
        filters={filters}
        tableFilters={tableFilters}
        setSettingEmployeeView={setSettingEmployeeView}
      />

      <ModalManageView
        modal={state.modalManageView}
        toggleModal={toggleModalManageView}
        settingEmployeeView={state.settingEmployeeView}
        setSettingEmployeeView={setSettingEmployeeView}
        setFiltersAfterLoadEmployeeView={setFiltersAfterLoadEmployeeView}
        setLoadingEmployeeView={setLoadingEmployeeView}
      />
    </Fragment>
  )
}

export default EmployeeView
