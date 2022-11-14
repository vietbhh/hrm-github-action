// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
import { FormProvider, useForm } from "react-hook-form";
import { timeoffApi } from "@modules/TimeOff/common/api";
import notification from "@apps/utility/notification";
// ** Styles
import { Button } from "reactstrap";
import { Space } from "antd";
// ** Components
import BoxRecordSkip from "./BoxRecordSkip";
import BoxUnmappedField from "./BoxUnmappedField";
import BoxReadyToCreate from "./BoxReadyToCreate";
import BoxDuplicate from "./BoxDuplicate";

const PreviewAndImportStep = (props) => {
  const {
    // ** props
    importType,
    fileUploadContent,
    listFieldImport,
    recordReadyToCreate,
    recordDuplicate,
    recordSkip,
    unmappedField,
    // ** methods
    setCurrentStep,
    setRecordContent
  } = props;

  const methods = useForm({
    mode: "all",
    reValidateMode: "onSubmit"
  });
  const { handleSubmit, formState } = methods;

  const handleBack = () => {
    setCurrentStep("map_fields");
  };

  const onSubmit = (values) => {
    const submitData = {
      import_type: importType,
      import_data: recordReadyToCreate,
      list_field_import: listFieldImport
    };
    timeoffApi
      .importTimeOff(submitData)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage(
            "modules.time_off_import.text.preview_and_import.import_success"
          )
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage(
            "modules.time_off_import.text.preview_and_import.import_fail"
          )
        });
      });
  };

  // ** return
  const renderCollapseHeader = (number, type, description = false, color) => {
    let headerText = "";
    let recordText = "";
    if (type === "unmapped") {
      recordText = useFormatMessage(
        `modules.time_off_import.text.preview_and_import.${type}`
      );
      headerText = useFormatMessage(
        `modules.time_off_import.text.preview_and_import.fields`
      );
    } else {
      recordText =
        number === 1
          ? useFormatMessage(
              "modules.time_off_import.text.preview_and_import.record"
            )
          : useFormatMessage(
              "modules.time_off_import.text.preview_and_import.records"
            );
      headerText = useFormatMessage(
        `modules.time_off_import.text.preview_and_import.${type}`
      );
    }
    return (
      <div className="d-flex flex-column">
        <h4 className="mb-25">
          <span style={{ color: color }}>
            {number} {recordText}
          </span>{" "}
          {headerText}
        </h4>
        <p className="mb-0">
          {description === true &&
            useFormatMessage(
              `modules.time_off_import.text.preview_and_import.descriptions.${type}`
            )}
        </p>
      </div>
    );
  };

  const renderReadyToCreate = () => {
    return (
      <BoxReadyToCreate
        fileUploadContent={fileUploadContent}
        recordReadyToCreate={recordReadyToCreate}
        renderCollapseHeader={renderCollapseHeader}
      />
    );
  };

  const renderDuplicate = () => {
    return (
      <BoxDuplicate
        fileUploadContent={fileUploadContent}
        recordDuplicate={recordDuplicate}
        recordReadyToCreate={recordReadyToCreate}
        methods={methods}
        renderCollapseHeader={renderCollapseHeader}
        setRecordContent={setRecordContent}
      />
    );
  };

  const renderSkip = () => {
    return (
      <BoxRecordSkip
        recordSkip={recordSkip}
        renderCollapseHeader={renderCollapseHeader}
      />
    );
  };

  const renderUnmappedField = () => {
    return (
      <BoxUnmappedField
        unmappedField={unmappedField}
        renderCollapseHeader={renderCollapseHeader}
      />
    );
  };

  return (
    <div className="preview-and-import">
      <div className="mb-2">{renderReadyToCreate()}</div>
      <div className="mb-2">{renderDuplicate()}</div>
      <div className="mb-2">{renderSkip()}</div>
      <div className="mb-3">{renderUnmappedField()}</div>
      <div className="mb-2">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space>
              <Button.Ripple
                type="button"
                color="primary"
                onClick={() => handleBack()}
              >
                <i className="fas fa-arrow-left" />{" "}
                {useFormatMessage("modules.time_off_import.buttons.back")}
              </Button.Ripple>
              <Button.Ripple
                type="submit"
                color="primary"
                disabled={!formState.isValid || formState.isSubmitting}
              >
                {useFormatMessage("modules.time_off_import.buttons.import")}{" "}
              </Button.Ripple>
            </Space>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default PreviewAndImportStep;
