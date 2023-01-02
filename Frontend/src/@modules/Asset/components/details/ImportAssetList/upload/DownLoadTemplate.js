// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { assetApi } from "@modules/Asset/common/api"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"

const DownloadTemplate = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const handleDownloadTemplate = () => {
    setState({
      loading: true
    })

    assetApi
      .getAssetTemplate()
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `Asset Template.xlsx`)
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
      <div className="d-flex flex-wrap w-100 mb-7">
        <div className="d-flex align-items-center">
          <i className="far fa-arrow-alt-circle-down icon-circle bg-icon-green"></i>
          <span className="instruction-bold">
            {useFormatMessage(
              "modules.asset.import_asset.title.download_asset_template"
            )}
          </span>
        </div>
      </div>
      <div className="d-flex flex-wrap w-100 mb-7">
        <div className="d-flex align-items-center">
          <span className="">
            {useFormatMessage(
              "modules.asset.import_asset.text.download_template_description"
            )}
          </span>
        </div>
      </div>
      <div className="d-flex flex-wrap w-100 mb-40">
        <div className="d-flex align-items-center">
          <Button
            color="primary"
            className="btn-download-template"
            onClick={() => {
              handleDownloadTemplate()
            }}
            disabled={state.loading}>
            <i className="far fa-file-download me-7"></i>
            {useFormatMessage(
              "modules.asset.import_asset.buttons.asset_template"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DownloadTemplate
