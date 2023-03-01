// ** React Imports
import { useEffect, useRef, useContext, Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { assetApi } from "../common/api"
import { AbilityContext } from "utility/context/Can"
import ReactToPrint from "react-to-print"
import { Navigate } from "react-router-dom"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import FilterAssetList from "../components/details/BarcodeGenerator/FilterAssetList"
import ChoseAsset from "../components/details/BarcodeGenerator/ChoseAsset"
import ChosenAsset from "../components/details/BarcodeGenerator/ChosenAsset"
import { ListCode } from "../components/details/BarcodeGenerator/ListCode"
import PrintQRCode from "../components/details/BarcodeGenerator/PrintQRCode"
import PrintBarcode from "../components/details/BarcodeGenerator/PrintBarcode"
import { Space } from "antd"

const BarcodeGenerator = () => {
  const [state, setState] = useMergedState({
    loading: true,
    loadingTable: true,
    assetList: [],
    totalRecord: [],
    chosenAssetList: [],
    filter: {}
  })

  const assetListState = useSelector((state) => state.app.modules.asset_lists)
  const moduleNameAssetList = assetListState.config.name
  const metasAssetList = assetListState.metas

  const assetTypeState = useSelector((state) => state.app.modules.asset_types)
  const moduleNameAssetType = assetTypeState.config.name
  const metasAssetType = assetTypeState.metas

  const optionModules = useSelector((state) => state.app.optionModules)

  const ability = useContext(AbilityContext)
  if (ability.can("accessBarcodeGenerator", moduleNameAssetList) === false) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
      </>
    )
  }

  const setFilter = (key, value) => {
    setState({
      filter: { ...state.filter, [key]: value }
    })
  }

  const setFilterByObj = (obj) => {
    setState({
      filter: { ...state.filter, ...obj }
    })
  }

  const setChosenAssetList = (data) => {
    setState({
      chosenAssetList: data
    })
  }

  const setLoadingTable = (status) => {
    setState({
      loadingTable: status
    })
  }

  const loadDataAssetList = (setLoading = true) => {
    const stateLoad = { loadingTable: true }
    if (setLoading) {
      stateLoad["loading"] = true
    }
    setState(stateLoad)

    assetApi
      .getDataAssetList(state.filter)
      .then((res) => {
        const resultState = {
          assetList: res.data.results,
          totalRecord: res.data.total_record,
          loadingTable: false
        }
        if (setLoading) {
          resultState["loading"] = false
        }
        setState(resultState)
      })
      .catch((err) => {
        setState({
          assetList: [],
          totalRecord: 0,
          loading: false,
          loadingTable: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    const reloadTable = Object.keys(state.filter).length === 0
    loadDataAssetList(reloadTable)
  }, [state.filter])

  // ** render
  const renderChoseAsset = () => {
    if (state.loading) {
      return ""
    }

    return (
      <ChoseAsset
        loadingTable={state.loadingTable}
        totalRecord={state.totalRecord}
        assetList={state.assetList}
        chosenAssetList={state.chosenAssetList}
        filter={state.filter}
        setChosenAssetList={setChosenAssetList}
        setFilterByObj={setFilterByObj}
      />
    )
  }

  return (
    <div className="barcode-generator-page">
      <div>
        <Breadcrumbs
          className="breadcrumbs-edit"
          list={[
            {
              title: useFormatMessage(
                "modules.asset.asset_code_generator.title.index"
              )
            }
          ]}
        />
      </div>
      <div>
        <Card>
          <CardBody className="pt-3">
            <div className="mb-3">
              <FilterAssetList
                moduleNameAssetList={moduleNameAssetList}
                metasAssetList={metasAssetList}
                moduleNameAssetType={moduleNameAssetType}
                metasAssetType={metasAssetType}
                optionModules={optionModules}
                setFilter={setFilter}
              />
            </div>
            <div className="mb-3">
              <div className="mb-2">
                <h5>
                  {useFormatMessage(
                    "modules.asset.asset_code_generator.title.asset_list"
                  )}
                </h5>
              </div>
              <div className="w-100 d-flex">
                <div className="w-50 me-1">
                  <Fragment>{renderChoseAsset()}</Fragment>
                </div>
                <div className="w-50 ms-1">
                  <ChosenAsset chosenAssetList={state.chosenAssetList} />
                </div>
              </div>
            </div>
            <div>
              <PrintQRCode chosenAssetList={state.chosenAssetList} />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default BarcodeGenerator
