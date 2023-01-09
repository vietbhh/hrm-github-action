// ** React Imports
import { Fragment } from "react"
import { useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import UploadFileStep from "./upload/UploadFileStep"
import MapFieldStep from "./mapField/MapFieldStep"
import PreviewAndImportStep from "./previewAndImport/PreviewAndImportStep"

const HandleImportStep = (props) => {
  const {
    // ** props
    module,
    currentStep,
    // ** methods
    setCurrentStep
  } = props

  const [state, setState] = useMergedState({
    listFieldImport: [],
    listFieldSelect: [],
    fileUploadContent: {},
    recordReadyToCreate: [],
    recordSkip: {},
    unmappedField: []
  })

  const setListFieldImport = (data) => {
    setState({
      listFieldImport: data
    })
  }

  const setListFieldSelect = (data) => {
    setState({
      listFieldSelect: data
    })
  }

  const setFileUploadContent = (data) => {
    setState({
      fileUploadContent: data
    })
  }

  const setRecordContent = (data) => {
    setState({
      ...state,
      ...data
    })
  }

  // ** render
  const renderCurrentStep = () => {
    if (currentStep === "upload_file") {
      return (
        <UploadFileStep
          module={module}
          setListFieldImport={setListFieldImport}
          setListFieldSelect={setListFieldSelect}
          setCurrentStep={setCurrentStep}
          setFileUploadContent={setFileUploadContent}
        />
      )
    } else if (currentStep === "map_fields") {
      return (
        <MapFieldStep
          module={module}
          listFieldImport={state.listFieldImport}
          listFieldSelect={state.listFieldSelect}
          fileUploadContent={state.fileUploadContent}
          setCurrentStep={setCurrentStep}
          setListFieldImport={setListFieldImport}
          setRecordContent={setRecordContent}
        />
      )
    } else if (currentStep === "preview_and_import") {
      return (
        <PreviewAndImportStep
          module={module}
          fileUploadContent={state.fileUploadContent}
          listFieldImport={state.listFieldImport}
          recordReadyToCreate={state.recordReadyToCreate}
          recordSkip={state.recordSkip}
          unmappedField={state.unmappedField}
          setCurrentStep={setCurrentStep}
        />
      )
    }
  }

  return <Fragment>{renderCurrentStep()}</Fragment>
}

export default HandleImportStep
