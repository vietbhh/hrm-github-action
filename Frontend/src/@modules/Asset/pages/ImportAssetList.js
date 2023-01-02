// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
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
