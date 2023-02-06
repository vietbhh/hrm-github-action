// ** React Imports\
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { EmployeeSettingApi } from "@modules/Employees/common/api"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components
import { EmptyContent } from "@apps/components/common/EmptyContent"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import AddEmployeeTypeModal from "@modules/Employees/components/modals/add-employee-type/AddEmployeeTypeModal"
import EmployeeTypeItem from "../employee-type/EmployeeTypeItem"

const EmployeeTypeSetting = (props) => {
  const {
    // ** props
    tab
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    listEmployeeType: [],
    modal: false,
    modalData: {}
  })

  const handleModal = (status) => {
    setState({
      modal: status
    })
  }

  const setModalData = (data) => {
    setState({
      modalData: data
    })
  }

  const handleAddEmployeeType = () => {
    setModalData({})
    handleModal(true)
  }

  const loadTabContent = () => {
    setState({
      loading: true
    })

    EmployeeSettingApi.loadEmployeeType()
      .then((res) => {
        setState({
          listEmployeeType: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listEmployeeType: [],
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadTabContent()
  }, [tab])

  // ** render
  const renderListEmployeeType = () => {
    if (state.loading) {
      return (
        <Fragment>
          <div className="mt-2">
            <AppSpinner />
          </div>
        </Fragment>
      )
    }

    if (state.listEmployeeType.length === 0) {
      return (
        <Fragment>
          <div className="mt-2">
            <EmptyContent />
          </div>
        </Fragment>
      )
    }

    return (
      <Space direction="vertical" className="w-100">
        <div className="collapse-custom-field">
          {state.listEmployeeType.map((item, index) => {
            return (
              <Fragment key={`contact_item_${index}`}>
                <EmployeeTypeItem
                  employeeType={item}
                  handleModal={handleModal}
                  setModalData={setModalData}
                  loadTabContent={loadTabContent}
                />
              </Fragment>
            )
          })}
        </div>
      </Space>
    )
  }

  const renderAddEmployeeTypeModal = () => {
    return (
      <AddEmployeeTypeModal
        modal={state.modal}
        modalData={state.modalData}
        handleModal={handleModal}
        loadTabContent={loadTabContent}
      />
    )
  }

  return (
    <Fragment>
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 className="mb-0">
              <i className="far fa-scroll icon-circle bg-icon-green" />
              {useFormatMessage(
                `modules.employee_setting.title.tabs.employee_type`
              )}
            </h4>
          </div>
          <div>
            <Button.Ripple
              size="md"
              color="primary"
              onClick={() => handleAddEmployeeType()}>
              <i className="fas fa-plus me-25" />
              {useFormatMessage(
                "modules.employee_setting.buttons.new_employee_type"
              )}
            </Button.Ripple>
          </div>
        </div>
        <div>
          <Fragment>{renderListEmployeeType()}</Fragment>
        </div>
      </div>
      <Fragment>{state.modal && renderAddEmployeeTypeModal()}</Fragment>
    </Fragment>
  )
}

export default EmployeeTypeSetting
