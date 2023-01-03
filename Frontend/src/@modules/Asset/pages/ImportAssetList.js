// ** React Imports
import { useContext } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { AbilityContext } from "utility/context/Can"
import { Navigate } from "react-router-dom"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import ImportStep from "../components/details/ImportAssetList/ImportStep"
import HandleImportStep from "../components/details/ImportAssetList/HandleImportStep"

const ImportAssetList = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    currentStep: "upload_file"
  })

  const assetListState = useSelector((state) => state.app.modules.asset_lists)
  const moduleNameAssetList = assetListState.config.name

  const ability = useContext(AbilityContext)
  if (ability.can("accessImportAsset", moduleNameAssetList) === false) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
      </>
    )
  }

  const setCurrentStep = (step) => {
    setState({
      currentStep: step
    })
  }

  // ** render
  return (
    <div className="import-asset-list-page">
      <div>
        <Breadcrumbs
          className="breadcrumbs-edit"
          list={[
            {
              title: useFormatMessage("modules.asset.import_asset.title.index")
            }
          ]}
        />
      </div>
      <div>
        <ImportStep currentStep={state.currentStep} />
      </div>
      <div>
        <HandleImportStep
          currentStep={state.currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </div>
  )
}

export default ImportAssetList
