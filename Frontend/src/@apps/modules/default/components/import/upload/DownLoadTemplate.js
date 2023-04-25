// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"

const DownloadTemplate = (props) => {
  const {
    // ** props
    module,
    // ** methods
    // ** custom
    customProps
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const handleDownloadTemplate = () => {
    setState({
      loading: true
    })

    let api = defaultModuleApi.exportTemplate(module.name)

    if (customProps?.downloadTemplateApi !== undefined) {
      api = customProps.downloadTemplateApi
    }

    api(module.name)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        const fileName =
          customProps?.templateFileName !== undefined
            ? customProps.templateFileName
            : `Module ${module.name} template.xlsx`
        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        setState({
          loading: false
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.template.not_found")
        })
      })
  }

  // ** render
  return (
    <div>
      <div className="d-flex flex-wrap w-100 mb-25">
        <div className="d-flex align-items-center">
          <i className="far fa-arrow-alt-circle-down icon-circle bg-icon-green"></i>
          <span className="instruction-bold">
            {useFormatMessage(
              "module.default.import.title.download_asset_template"
            )}
          </span>
        </div>
      </div>
      <div className="d-flex flex-wrap w-100 mb-25">
        <div className="d-flex align-items-center">
          <span className="">
            {useFormatMessage(
              "module.default.import.text.download_template_description"
            )}
          </span>
        </div>
      </div>
      <div className="d-flex flex-wrap w-100 mb-1">
        <div className="d-flex align-items-center">
          <Button
            color="primary"
            className="btn-download-template"
            onClick={() => {
              handleDownloadTemplate()
            }}
            disabled={state.loading}>
            <i className="far fa-file-download me-50"></i>
            {customProps?.templateFileName !== undefined
              ? customProps.templateFileName
              : useFormatMessage(
                  "module.default.import.buttons.asset_template"
                )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DownloadTemplate
