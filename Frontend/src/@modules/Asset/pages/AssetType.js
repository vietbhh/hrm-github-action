// ** React Imports
import { useEffect } from "react"
import { useMergedState, useFormatMessage } from "@apps/utility/common"
import { assetApi } from "../common/api"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import TableAssetType from "../components/details/AssetType/TableAssetType"
import AssetTypeModal from "../components/modals/AssetTypeModal/AssetTypeModal"
import SwAlert from "@apps/utility/SwAlert"
import notification from "@apps/utility/notification"

const AssetType = () => {
  const [state, setState] = useMergedState({
    loading: true,
    modal: false,
    listData: [],
    isEditing: false,
    editData: {}
  })

  const assetTypeState = useSelector((state) => state.app.modules.asset_types)
  const moduleName = assetTypeState.config.name
  const metas = assetTypeState.metas
  const options = assetTypeState.options
  const optionModule = useSelector((state) => state.app.optionsModules)

  const toggleModal = () => {
    setState({
      modal: !state.modal
    })
  }

  const setIsEditing = (status) => {
    setState({
      isEditing: status
    })
  }

  const setEditData = (data) => {
    setState({
      editData: data
    })
  }

  const handleClickAdd = () => {
    setIsEditing(false)
    setEditData({})
    toggleModal()
  }

  const loadData = () => {
    setState({
      loading: true
    })

    assetApi
      .getDataAssetType({})
      .then((res) => {
        setState({
          listData: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listData: [],
          loading: false
        })
      })
  }

  const handleDeleteAssetType = (id) => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.asset_groups.text.warning_delete_asset_type.title"
      ),
      text: useFormatMessage(
        "modules.asset_groups.text.warning_delete_asset_type.content"
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        assetApi
          .deleteAssetType(id)
          .then((res) => {
            notification.showSuccess()
            loadData()
          })
          .catch((err) => {
            notification.showError()
          })
      }
    })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  // ** render
  return (
    <div className="asset-type-page">
      <div>
        <Breadcrumbs
          className="breadcrumbs-edit"
          list={[
            {
              title: useFormatMessage("modules.asset_types.title")
            }
          ]}
        />
      </div>
      <Card>
        <CardBody>
          <div className="mb-2">
            <Button.Ripple color="primary" onClick={() => handleClickAdd()}>
              <i className="fas fa-plus me-50" />
              {useFormatMessage("modules.asset_types.buttons.create")}
            </Button.Ripple>
          </div>
          <div>
            <TableAssetType
              listData={state.listData}
              setIsEditing={setIsEditing}
              setEditData={setEditData}
              toggleModal={toggleModal}
              handleDeleteAssetType={handleDeleteAssetType}
            />
          </div>
        </CardBody>
      </Card>

      <AssetTypeModal
        modal={state.modal}
        isEditing={state.isEditing}
        editData={state.editData}
        moduleName={moduleName}
        metas={metas}
        options={options}
        optionModule={optionModule}
        toggleModal={toggleModal}
        setIsEditing={setIsEditing}
        loadData={loadData}
      />
    </div>
  )
}

export default AssetType
