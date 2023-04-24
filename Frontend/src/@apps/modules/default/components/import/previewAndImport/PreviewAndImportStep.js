// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components
import notification from "@apps/utility/notification"
import ReadyToCreate from "./ReadyToCreate"
import RecordSkip from "./RecordSkip"
import UnmappedField from "./UnmappedField"
import SwAlert from "@apps/utility/SwAlert"

const PreviewAndImportStep = (props) => {
  const {
    // ** props
    module,
    fileUploadContent,
    listFieldImport,
    recordReadyToCreate,
    recordSkip,
    unmappedField,
    // ** methods
    setCurrentStep,
    // ** custom
    customProps
  } = props

  const methods = useForm({
    mode: "all",
    reValidateMode: "onSubmit"
  })
  const { handleSubmit, formState } = methods

  const handleClickBack = () => {
    setCurrentStep("map_fields")
  }

  const onSubmit = (values) => {
    const submitData = {
      import_data: recordReadyToCreate,
      list_field_import: listFieldImport
    }

    let swContent = {
      title: useFormatMessage(
        "module.default.import.warning_format_module_import.title"
      ),
      text: useFormatMessage(
        "module.default.import.warning_format_module_import.description"
      ),
      showDenyButton: true,
      denyButtonText: useFormatMessage(
        "module.default.import.buttons.format_and_import"
      ),
      confirmButtonText: useFormatMessage(
        "module.default.import.buttons.import"
      ),
      customClass: {
        denyButton: "btn btn-danger ms-1"
      }
    }

    if (customProps?.disableFormatImport === true) {
      swContent = {
        title: useFormatMessage(
          "module.default.import.warning_format_module_import.title"
        ),
        text: useFormatMessage(
          "module.default.import.warning_format_module_import.normal_description"
        )
      }
    }

    SwAlert.showWarning(swContent).then((res) => {
      if (res.isDismissed === true) {
        return true
      }
      
      submitData["format"] = !res.isConfirmed

      let api = defaultModuleApi.postImport

      if (customProps.importApi !== undefined) {
        api = customProps.importApi
      }

      api(module.name, submitData)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage(
              "module.default.import.text.preview_and_import.import_success"
            )
          })
          setTimeout(() => {
            //setCurrentStep("upload_file")
          }, 500)
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage(
              "module.default.import.text.preview_and_import.import_fail"
            )
          })
        })
    })
  }

  // ** render
  const renderCollapseHeader = (number, type, description = false, color) => {
    let headerText = ""
    let recordText = ""
    if (type === "unmapped") {
      recordText = useFormatMessage(
        `module.default.import.text.preview_and_import.${type}`
      )
      headerText = useFormatMessage(
        `module.default.import.text.preview_and_import.fields`
      )
    } else {
      recordText =
        number === 1
          ? useFormatMessage(
              "module.default.import.text.preview_and_import.record"
            )
          : useFormatMessage(
              "module.default.import.text.preview_and_import.records"
            )
      headerText = useFormatMessage(
        `module.default.import.text.preview_and_import.${type}`
      )
    }
    return (
      <div className="d-flex flex-column">
        <h5 className="mb-0">
          <span style={{ color: color }}>
            {number} {recordText}
          </span>{" "}
          {headerText}
        </h5>
        <p className="mb-0">
          {description === true &&
            useFormatMessage(
              `module.default.import.text.preview_and_import.descriptions.${type}`
            )}
        </p>
      </div>
    )
  }

  return (
    <div className="preview-and-import">
      <div className="mb-2">
        <ReadyToCreate
          fileUploadContent={fileUploadContent}
          recordReadyToCreate={recordReadyToCreate}
          renderCollapseHeader={renderCollapseHeader}
        />
      </div>
      <div className="mb-2">
        <RecordSkip
          recordSkip={recordSkip}
          renderCollapseHeader={renderCollapseHeader}
        />
      </div>
      <div className="mb-3">
        <UnmappedField
          unmappedField={unmappedField}
          renderCollapseHeader={renderCollapseHeader}
        />
      </div>
      <div className="mb-2">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space>
              <Button.Ripple
                type="button"
                color="primary"
                onClick={() => handleClickBack()}>
                <i className="fas fa-arrow-left" />{" "}
                {useFormatMessage("module.default.import.buttons.back")}
              </Button.Ripple>
              <Button.Ripple
                type="submit"
                color="primary"
                disabled={!formState.isValid || formState.isSubmitting}>
                {useFormatMessage("module.default.import.buttons.import")}{" "}
              </Button.Ripple>
            </Space>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default PreviewAndImportStep
