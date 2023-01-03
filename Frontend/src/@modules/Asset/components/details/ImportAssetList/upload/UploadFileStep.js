// ** React Imports
// ** Styles
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { assetApi } from "@modules/Asset/common/api"
import { Button, Card, CardBody } from "reactstrap"
import * as XLSX from "xlsx"
// ** Components
import WarningImport from "../WarningImport"
import DownloadTemplate from "./DownLoadTemplate"
import UploadTemplate from "./UploadTemplate"

const UploadFileStep = (props) => {
  const {
    // ** props
    // ** methods
    setListFieldImport,
    setListFieldSelect,
    setCurrentStep,
    setFileUploadContent
  } = props

  const [state, setState] = useMergedState({
    fileUpload: {},
    disableMapFieldButton: true
  })

  const setFileUpload = (fileData) => {
    setState({
      fileUpload: fileData
    })
  }

  const setDisableMapFieldButton = (status) => {
    setState({
      disableMapFieldButton: status
    })
  }

  const getFileContent = () => {
    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.readAsBinaryString(state.fileUpload)
      reader.onload = function () {
        const fileData = reader.result
        const wb = XLSX.read(fileData, { type: "binary" })
        wb.SheetNames.forEach(function (sheetName, index) {
          if (index === 1) {
            const header = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
              header: 1
            })[0]
            const body = XLSX.utils.sheet_to_row_object_array(
              wb.Sheets[sheetName]
            )
            resolve({
              header: header,
              body: body
            })
          }
        })
      }
    })
  }

  const handleClickMappingField = async () => {
    const fileContent = await getFileContent()
    const data = {
      file_content: fileContent
    }
    assetApi
      .getMappingFields(data)
      .then((res) => {
        setListFieldImport(res.data.arr_col)
        setListFieldSelect(res.data.arr_field_select)
        setFileUploadContent(fileContent)
        setCurrentStep("map_fields")
      })
      .catch((err) => {
        notification.showError()
        
        setFileUploadContent({})
        setListFieldImport([])
      })
  }

  // ** render
  return (
    <div className="upload-file-step">
      <div>
        <WarningImport />
      </div>
      <div>
        <Card>
          <CardBody>
            <div>
              <DownloadTemplate />
            </div>
            <div>
              <UploadTemplate
                fileUpload={state.fileUpload}
                setFileUpload={setFileUpload}
                setDisableMapFieldButton={setDisableMapFieldButton}
              />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Button.Ripple
              color="primary"
              disabled={state.disableMapFieldButton}
              onClick={() => handleClickMappingField()}>
              {useFormatMessage(
                "modules.asset.import_asset.buttons.mapping_fields"
              )}
              <i className="fas fa-arrow-right ms-50" />
            </Button.Ripple>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default UploadFileStep
