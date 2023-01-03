// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { assetApi } from "@modules/Asset/common/api"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
import { Space } from "antd"
// ** Components
import WarningImport from "../WarningImport"
import TableMapField from "./TableMapField"
import { Fragment } from "react"

const MapFieldStep = (props) => {
  const {
    // ** props
    listFieldImport,
    listFieldSelect,
    fileUploadContent,
    // ** methods
    setCurrentStep,
    setListFieldImport,
    setRecordContent
  } = props

  const methods = useForm({
    mode: "all",
    reValidateMode: "onChange"
  })

  const { handleSubmit, formState } = methods

  const handleClickBack = () => {
    setCurrentStep("upload_file")
  }

  const onSubmit = (values) => {
    const newListFieldImport = listFieldImport.map((fieldItem) => {
      let newFieldItem = { ...fieldItem }
      _.forEach(values, (item, key) => {
        if (fieldItem.field === key) {
          newFieldItem = {
            ...fieldItem,
            header: item?.value
          }
        }
      })
      return newFieldItem
    })

    handleSubmitMapFields(newListFieldImport)
  }

  const handleSubmitMapFields = (newListFieldImport) => {
    const values = {
      list_field: newListFieldImport,
      file_upload_content: fileUploadContent
    }
    assetApi
      .getImportData(values)
      .then((res) => {
        setRecordContent({
          recordReadyToCreate: res.data.record_ready_to_create,
          recordSkip: res.data.record_skip,
          unmappedField: res.data.unmapped_field
        })
        setListFieldImport(newListFieldImport)
        setCurrentStep("preview_and_import")
      })
      .catch((err) => {
        notification.showError()
        setRecordContent({
          recordReadyToCreate: [],
          recordSkip: {},
          unmappedField: []
        })
      })
  }

  // ** render
  return (
    <Fragment>
      <Card className="map-fields mb-0">
        <CardBody className="pl-3 pt-3 pb-3">
          <div className="mb-4">
            <div className="mb-2">
              <h5>
                <i className="fas fa-exchange icon-circle bg-icon-green" />
                {useFormatMessage(
                  "modules.time_off_import.title.map_fields_step.default_fields_mapping"
                )}
              </h5>
            </div>
            <div>
              <p>
                {useFormatMessage(
                  "modules.time_off_import.text.map_fields_step.mapping_fields_header"
                )}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <FormProvider {...methods}>
              <TableMapField
                listFieldImport={listFieldImport}
                listFieldSelect={listFieldSelect}
                methods={methods}
              />
            </FormProvider>
          </div>
          <div className="mb-0">
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
                  disabled={!formState.isValid}>
                  {useFormatMessage("modules.time_off_import.buttons.preview")}{" "}
                  <i className="fas fa-arrow-right" />
                </Button.Ripple>
              </Space>
            </form>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default MapFieldStep
