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
    module
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const handleDownloadTemplate = () => {
    setState({
      loading: true
    })

    defaultModuleApi
      .exportTemplate(module.name)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `Module ${module.name} template.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
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
            {useFormatMessage(
              "module.default.import.buttons.asset_template"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DownloadTemplate
