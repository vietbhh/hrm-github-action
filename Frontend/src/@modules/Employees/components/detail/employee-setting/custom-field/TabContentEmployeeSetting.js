// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { employeesApi } from "@modules/Employees/common/api"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import ListCustomField from "./ListCustomField"
import AddCustomFieldModal from "@modules/Employees/components/modals/add-custom-field/AddCustomFieldModal"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { EmptyContent } from "@apps/components/common/EmptyContent"

const TabContentEmployeeSetting = (props) => {
  const {
    // ** props
    tab
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    listCustomField: [],
    modal: false,
    modalData: {}
  })

  const handleModal = (status) => {
    setState({
      modal: status
    })
  }

  const handleAddCustomField = () => {
    setModalData({})
    handleModal(true)
  }

  const setModalData = (data) => {
    setState({
      modalData: data
    })
  }

  const loadTabContent = () => {
    setState({
      loading: true
    })
    employeesApi
      .loadTabContent(tab)
      .then((res) => {
        setState({
          listCustomField: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listCustomField: [],
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadTabContent()
  }, [tab])

  // ** render
  const renderListCustomField = () => {
    if (state.loading) {
      return (
        <Fragment>
          <div className="mt-2">
            <AppSpinner />
          </div>
        </Fragment>
      )
    }

    if (state.listCustomField.length === 0) {
      return (
        <Fragment>
          <div className="mt-2">
            <EmptyContent />
          </div>
        </Fragment>
      )
    }

    return (
      <ListCustomField
        listCustomField={state.listCustomField}
        handleModal={handleModal}
        setModalData={setModalData}
        loadTabContent={loadTabContent}
      />
    )
  }

  const renderAddCustomFieldModal = () => {
    return (
      <AddCustomFieldModal
        modal={state.modal}
        tab={tab}
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
              {useFormatMessage(`modules.employee_setting.title.tabs.${tab}`)}
            </h4>
          </div>
          <div>
            <Button.Ripple
              size="md"
              color="primary"
              onClick={() => handleAddCustomField()}>
              <i className="fas fa-plus me-25" />
              {useFormatMessage("modules.employee_setting.buttons.new_field")}
            </Button.Ripple>
          </div>
        </div>
        <div>
          <Fragment>{renderListCustomField()}</Fragment>
        </div>
      </div>
      <Fragment>{state.modal && renderAddCustomFieldModal()}</Fragment>
    </Fragment>
  )
}

export default TabContentEmployeeSetting
