// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { assetApi } from "@modules/Asset/common/api"
// ** Styles
import { Button } from "reactstrap"
import { Space } from "antd"
// ** Components
import notification from "@apps/utility/notification"
import ReadyToCreate from "./ReadyToCreate"
import RecordSkip from "./RecordSkip"
import UnmappedField from "./UnmappedField"

const PreviewAndImportStep = (props) => {
  const {
    // ** props
    fileUploadContent,
    listFieldImport,
    recordReadyToCreate,
    recordSkip,
    unmappedField,
    // ** methods
    setCurrentStep
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

    assetApi
      .importAsset(submitData)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage(
            "modules.time_off_import.text.preview_and_import.import_success"
          )
        })
        setTimeout(() => {
          window.location.reload()
        }, 500)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage(
            "modules.time_off_import.text.preview_and_import.import_fail"
          )
        })
      })
  }

  // ** render
  const renderCollapseHeader = (number, type, description = false, color) => {
    let headerText = ""
    let recordText = ""
    if (type === "unmapped") {
      recordText = useFormatMessage(
        `modules.time_off_import.text.preview_and_import.${type}`
      )
      headerText = useFormatMessage(
        `modules.time_off_import.text.preview_and_import.fields`
      )
    } else {
      recordText =
        number === 1
          ? useFormatMessage(
              "modules.time_off_import.text.preview_and_import.record"
            )
          : useFormatMessage(
              "modules.time_off_import.text.preview_and_import.records"
            )
      headerText = useFormatMessage(
        `modules.time_off_import.text.preview_and_import.${type}`
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
              `modules.time_off_import.text.preview_and_import.descriptions.${type}`
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
                {useFormatMessage("modules.time_off_import.buttons.back")}
              </Button.Ripple>
              <Button.Ripple
                type="submit"
                color="primary"
                disabled={!formState.isValid || formState.isSubmitting}>
                {useFormatMessage("modules.time_off_import.buttons.import")}{" "}
              </Button.Ripple>
            </Space>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default PreviewAndImportStep
