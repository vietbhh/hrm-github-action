// ** React Imports
import { useEffect, useRef, useContext } from "react"
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

const BarcodeGenerator = () => {
  const [state, setState] = useMergedState({
    loading: true,
    assetList: [],
    chosenAssetList: [],
    filter: {
      text: "",
      asset_type_group: 0,
      asset_type: 0,
      asset_status: 0,
      owner: 0
    }
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

  const componentRef = useRef()

  const setFilter = (key, value) => {
    setState({
      filter: { ...state.filter, [key]: value }
    })
  }

  const setChosenAssetList = (data) => {
    setState({
      chosenAssetList: data
    })
  }

  const loadDataAssetList = () => {
    setState({
      loading: true
    })

    assetApi
      .getDataAssetList(state.filter)
      .then((res) => {
        setState({
          assetList: res.data.results,
          loading: false
        })
      })
      .catch((err) => {})
  }

  const handleGenerate = () => {}

  // ** effect
  useEffect(() => {
    loadDataAssetList()
  }, [state.filter])

  // ** render
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
                  <ChoseAsset
                    assetList={state.assetList}
                    chosenAssetList={state.chosenAssetList}
                    setChosenAssetList={setChosenAssetList}
                  />
                </div>
                <div className="w-50 ms-1">
                  <ChosenAsset chosenAssetList={state.chosenAssetList} />
                </div>
              </div>
            </div>
            <div>
              <ReactToPrint
                pageStyle=""
                copyStyles={false}
                trigger={() => {
                  return (
                    <Button.Ripple color="primary">
                      <i className="fas fa-qrcode me-50" /> {useFormatMessage("modules.asset_lists.buttons.generate")}
                    </Button.Ripple>
                  )
                }}
                content={() => componentRef.current}
              />
              <div style={{ display: "none" }}>
                <ListCode
                  ref={componentRef}
                  chosenAssetList={state.chosenAssetList}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default BarcodeGenerator
