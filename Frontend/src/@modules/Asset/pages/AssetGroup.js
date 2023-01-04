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
import TableAssetGroup from "../components/details/AssetGroup/TableAssetGroup"
import AssetGroupModal from "../components/modals/AssetGroupModal/AssetGroupModal"
import SwAlert from "@apps/utility/SwAlert"
import notification from "@apps/utility/notification"

const AssetGroup = () => {
  const [state, setState] = useMergedState({
    loading: true,
    modal: false,
    listData: [],
    isEditing: false,
    editData: {}
  })

  const assetGroupState = useSelector((state) => state.app.modules.asset_groups)
  const moduleName = assetGroupState.config.name
  const metas = assetGroupState.metas
  const options = assetGroupState.options
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
      .getDataAssetGroup({})
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

  const handleDeleteAssetGroup = (id) => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.asset_groups.text.warning_delete_asset_group.title"
      ),
      text: useFormatMessage(
        "modules.asset_groups.text.warning_delete_asset_group.content"
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        assetApi
          .deleteAssetGroup(id)
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
    <div className="asset-group-page">
      <div>
        <Breadcrumbs
          className="breadcrumbs-edit"
          list={[
            {
              title: useFormatMessage("modules.asset_groups.title")
            }
          ]}
        />
      </div>
      <Card>
        <CardBody>
          <div className="mb-2">
            <Button.Ripple color="primary" onClick={() => handleClickAdd()}>
              <i className="fas fa-plus me-50" />
              {useFormatMessage("modules.asset_groups.buttons.create")}
            </Button.Ripple>
          </div>
          <div>
            <TableAssetGroup
              listData={state.listData}
              setIsEditing={setIsEditing}
              setEditData={setEditData}
              toggleModal={toggleModal}
              handleDeleteAssetGroup={handleDeleteAssetGroup}
            />
          </div>
        </CardBody>
      </Card>

      <AssetGroupModal
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

export default AssetGroup
