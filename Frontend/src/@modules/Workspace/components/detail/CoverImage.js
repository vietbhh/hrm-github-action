// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import defaultWorkspaceCover from "../../assets/images/default_workspace_cover.webp"
import CoverEditor from "@/components/hrm/CoverEditor/CoverEditor"
import Photo from "@apps/modules/download/pages/Photo"
import SwAlert from "@apps/utility/SwAlert"
import { workspaceApi } from "@modules/Workspace/common/api"
import notification from "@apps/utility/notification"

const CoverImage = (props) => {
  const {
    // ** props
    src,
    dataSave,
    isEditable,
    // ** methods
    saveCoverImageApi,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    coverImage: ""
  })
  const saveCoverImage = (image) => {
    const dataPost = { ...dataSave, image: image }
    saveCoverImageApi(dataPost).then((res) => {
      setState({ coverImage: res.data })
    })
  }
  const removeCover = () => {
    SwAlert.showWarning({
      title: useFormatMessage("modules.workspace.title.remove_cover_image"),
      confirmButtonText: useFormatMessage("button.confirm")
    }).then((res) => {
      if (res.value) {
        dataSave.cover_image = ""
        workspaceApi
          .update(dataSave._id, dataSave)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
            setState({
              coverImage: ""
            })
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }
  // ** effect
  useEffect(() => {
    setState({
      coverImage: src
    })
  }, [src])

  // ** render

  return (
    <div className="image-cover">
      <Photo
        src={state.coverImage}
        width="100%"
        className="w-100 workspaceCover"
        defaultPhoto={defaultWorkspaceCover}
      />

      <Fragment>
        {isEditable === true && (
          <CoverEditor
            src=""
            className="btn-cover"
            saveCoverImage={saveCoverImage}
            removeCover={removeCover}
          />
        )}
      </Fragment>
    </div>
  )
}

export default CoverImage
