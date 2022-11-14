// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { contractTypeApi } from "@modules/ContractType/common/api"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import AddContractTypeModal from "@modules/Employees/components/modals/add-contract-type/AddContractTypeModal"
import ListContractType from "./ListContractType"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { EmptyContent } from "@apps/components/common/EmptyContent"

const ContractSetting = (props) => {
  const {
    // ** props
    tab
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    listContractType: [],
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

  const handleAddContract = () => {
    setModalData({})
    handleModal(true)
  }

  const loadTabContent = () => {
    setState({
      loading: true
    })
    contractTypeApi
      .loadContractType()
      .then((res) => {
        setState({
          listContractType: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listContractType: [],
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadTabContent()
  }, [tab])

  // ** render
  const renderListContract = () => {
    if (state.loading) {
      return (
        <Fragment>
          <div className="mt-2">
            <AppSpinner />
          </div>
        </Fragment>
      )
    }

    if (state.listContractType.length === 0) {
      return (
        <Fragment>
          <div className="mt-2">
            <EmptyContent />
          </div>
        </Fragment>
      )
    }

    return (
      <ListContractType
        listContractType={state.listContractType}
        handleModal={handleModal}
        setModalData={setModalData}
        loadTabContent={loadTabContent}
      />
    )
  }

  const renderAddContractTypeModal = () => {
    return (
      <AddContractTypeModal
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
              {useFormatMessage(`modules.employee_setting.title.tabs.${tab}`)}
            </h4>
          </div>
          <div>
            <Button.Ripple
              size="md"
              color="primary"
              onClick={() => handleAddContract()}>
              <i className="fas fa-plus me-25" />
              {useFormatMessage(
                "modules.employee_setting.buttons.new_contract"
              )}
            </Button.Ripple>
          </div>
        </div>
        <div>
          <Fragment>{renderListContract()}</Fragment>
        </div>
      </div>
      <Fragment>{state.modal && renderAddContractTypeModal()}</Fragment>
    </Fragment>
  )
}

export default ContractSetting
