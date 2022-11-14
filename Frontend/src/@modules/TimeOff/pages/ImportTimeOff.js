// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common";
// ** Styles
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs";
import ImportType from "../components/detail/import/ImportType";
import HandleImportStep from "../components/detail/import/HandleImportStep";

const ImportTimeOff = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    importType: "set_new_balance",
    currentStep: ""
  });

  const setImportType = (type) => {
    setState({
      importType: type
    });
  };

  const setCurrentStep = (step) => {
    setState({
      currentStep: step
    });
  };

  // ** render
  const renderBreadCrumb = () => {
    return (
      <Breadcrumbs
        className="breadcrumbs-edit"
        list={[
          {
            title: useFormatMessage("modules.time_off.title.import")
          }
        ]}
      />
    );
  };

  const renderImportType = () => {
    return (
      <ImportType
        importType={state.importType}
        setImportType={setImportType}
        setCurrentStep={setCurrentStep}
      />
    );
  };

  const renderHandleImportStep = () => {
    return (
      <HandleImportStep
        currentStep={state.currentStep}
        importType={state.importType}
        setCurrentStep={setCurrentStep}
      />
    );
  };

  const renderContent = () => {
    if (state.currentStep === "") {
      return renderImportType();
    }
    return renderHandleImportStep();
  };

  return (
    <div className="time-off-import">
      <div>{renderBreadCrumb()}</div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default ImportTimeOff;
