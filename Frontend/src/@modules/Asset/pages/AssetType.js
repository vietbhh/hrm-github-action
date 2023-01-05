// ** React Imports
import { useEffect, useRef } from "react"
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
import { ErpInput } from "@apps/components/common/ErpField"
import { FieldHandle } from "@apps/utility/FieldHandler"

const AssetType = () => {
  const [state, setState] = useMergedState({
    loading: true,
    modal: false,
    listData: [],
    totalData: 0,
    isEditing: false,
    editData: {},
    filter: {
      page: 1,
      limit: 30,
      text: "",
      asset_type_group: ""
    }
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

  const setFilter = (key, value) => {
    setState({
      filter: {
        ...state.filter,
        [key]: value
      }
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
      .getDataAssetType(state.filter)
      .then((res) => {
        setState({
          listData: res.data.results,
          totalData: res.data.total,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listData: [],
          totalData: 0,
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

  const debounceSearch = useRef(
    _.debounce((nextValue) => {
      setFilter("text", nextValue)
    }, process.env.REACT_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

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
          <div className="mb-2 row">
            <div className="col-md-3">
              <Button.Ripple color="primary" onClick={() => handleClickAdd()}>
                <i className="fas fa-plus me-50" />
                {useFormatMessage("modules.asset_types.buttons.create")}
              </Button.Ripple>
            </div>
            <div className="col-md-3 ms-auto">
              <FieldHandle
                module={moduleName}
                fieldData={metas.asset_type_group}
                optionModules={optionModule}
                nolabel={true}
                onChange={(value) =>
                  setFilter("asset_type_group", value?.value ?? "")
                }
                style={{
                  width: "200px"
                }}
              />
            </div>
            <div className="col-md-3">
              <ErpInput
                nolabel
                prepend={<i className="fas fa-search" />}
                placeholder={useFormatMessage("app.search")}
                onChange={(e) => handleSearchVal(e)}
              />
            </div>
          </div>
          <div>
            <TableAssetType
              listData={state.listData}
              totalData={state.totalData}
              page={state.filter.page}
              limit={state.filter.limit}
              setIsEditing={setIsEditing}
              setEditData={setEditData}
              setFilter={setFilter}
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
