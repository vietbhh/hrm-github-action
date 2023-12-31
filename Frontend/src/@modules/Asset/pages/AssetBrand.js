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
import TableAssetBrand from "../components/details/AssetBrand/TableAssetBrand"
import AssetBrandModal from "../components/modals/AssetBrandModal"
import SwAlert from "@apps/utility/SwAlert"
import notification from "@apps/utility/notification"
import { ErpInput } from "@apps/components/common/ErpField"
import { FieldHandle } from "@apps/utility/FieldHandler"

const AssetBrand = (props) => {
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
      text: ""
    }
  })

  const assetBrandState = useSelector((state) => state.app.modules.asset_brands)
  const moduleName = assetBrandState.config.name
  const metas = assetBrandState.metas
  const options = assetBrandState.options
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
      .getDataAssetBrand(state.filter)
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

  const handleDeleteAssetBrand = (id) => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.asset_brands.text.warning_delete.title"
      ),
      text: useFormatMessage(
        "modules.asset_brands.text.warning_delete.content"
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        assetApi
          .deleteAssetBrand(id)
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
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
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
    <div className="asset-brand-page">
      <div>
        <Breadcrumbs
          className="breadcrumbs-edit"
          list={[
            {
              title: useFormatMessage("modules.asset_brands.title")
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
                {useFormatMessage("button.create")}
              </Button.Ripple>
            </div>
            <div className="col-md-3 ms-auto">
              <ErpInput
                nolabel
                prepend={<i className="fas fa-search" />}
                placeholder={useFormatMessage("app.search")}
                onChange={(e) => handleSearchVal(e)}
              />
            </div>
          </div>
          <div>
            <TableAssetBrand
              listData={state.listData}
              totalData={state.totalData}
              page={state.filter.page}
              limit={state.filter.limit}
              setIsEditing={setIsEditing}
              setEditData={setEditData}
              setFilter={setFilter}
              toggleModal={toggleModal}
              handleDeleteAssetBrand={handleDeleteAssetBrand}
            />
          </div>
        </CardBody>
      </Card>

      <AssetBrandModal
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

export default AssetBrand
