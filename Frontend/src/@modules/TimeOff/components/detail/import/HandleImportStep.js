// ** React Imports
import { useMergedState } from "@apps/utility/common";
// ** Styles
// ** Components
import ImportStep from "./ImportStep";
import UploadFileStep from "./upload/UploadFileStep";
import MapFieldsStep from "./map/MapFieldsStep";
import PreviewAndImportStep from "./preview/PreviewAndImportStep";

const HandleImportStep = (props) => {
  const {
    // ** props
    currentStep,
    importType,
    // ** methods
    setCurrentStep
  } = props;

  const [state, setState] = useMergedState({
    fileUpload: {},
    listFieldImport: [],
    listFieldSelect: [],
    fileUploadContent: {},
    recordReadyToCreate: [],
    recordDuplicate: [],
    recordSkip: {},
    unmappedField: []
  });

  const setFileUpload = (data) => {
    setState({
      fileUpload: data
    });
  };

  const setListFieldImport = (data) => {
    setState({
      listFieldImport: data
    });
  };

  const setListFieldSelect = (data) => {
    setState({
      listFieldSelect: data
    });
  };

  const setFileUploadContent = (data) => {
    setState({
      fileUploadContent: data
    });
  };

  const setRecordContent = (data) => {
    setState({
      ...state,
      ...data
    });
  };

  // ** render
  const renderImportStep = () => {
    return <ImportStep currentStep={currentStep} />;
  };

  const renderUploadFileStep = () => {
    return (
      <UploadFileStep
        importType={importType}
        fileUpload={state.fileUpload}
        setCurrentStep={setCurrentStep}
        setFileUpload={setFileUpload}
        setListFieldImport={setListFieldImport}
        setListFieldSelect={setListFieldSelect}
        setFileUploadContent={setFileUploadContent}
      />
    );
  };

  const renderMapFieldsStep = () => {
    return (
      <MapFieldsStep
        listFieldImport={state.listFieldImport}
        listFieldSelect={state.listFieldSelect}
        fileUploadContent={state.fileUploadContent}
        setCurrentStep={setCurrentStep}
        setListFieldImport={setListFieldImport}
        setRecordContent={setRecordContent}
      />
    );
  };

  const renderPreviewAndImportStep = () => {
    return (
      <PreviewAndImportStep
        importType={importType}
        fileUploadContent={state.fileUploadContent}
        listFieldImport={state.listFieldImport}
        recordReadyToCreate={state.recordReadyToCreate}
        recordDuplicate={state.recordDuplicate}
        recordSkip={state.recordSkip}
        unmappedField={state.unmappedField}
        setCurrentStep={setCurrentStep}
        setRecordContent={setRecordContent}
      />
    );
  };

  const renderStep = () => {
    if (currentStep === "upload_file") {
      return renderUploadFileStep();
    } else if (currentStep === "map_fields") {
      return renderMapFieldsStep();
    } else if (currentStep === "preview_and_import") {
      return renderPreviewAndImportStep();
    }
  };

  return (
    <div>
      <div>{renderImportStep()}</div>
      <div>{renderStep()}</div>
    </div>
  );
};

export default HandleImportStep;
