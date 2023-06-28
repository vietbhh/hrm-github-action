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
    coverImage: "",
    defaultWorkspaceCover: ""
  })
  const saveCoverImage = (image) => {
    const dataPost = { ...dataSave, image: image }
    saveCoverImageApi(dataPost).then((res) => {
      setState({ defaultWorkspaceCover: image })
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
              coverImage: "",
              defaultWorkspaceCover: defaultWorkspaceCover
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
    if (src) {
      setState({
        coverImage: src,
        defaultWorkspaceCover: ""
      })
    } else {
      setState({
        coverImage: "",
        defaultWorkspaceCover: defaultWorkspaceCover
      })
    }
  }, [src])

  // ** render
  const renderEditButton = () => {
    if (isEditable === true) {
      return (
        <CoverEditor
          src=""
          className="btn-cover"
          saveCoverImage={saveCoverImage}
          removeCover={removeCover}
        />
      )
    }

    return ""
  }

  return (
    <div className="image-cover">
      {state.defaultWorkspaceCover && (
        <img
          src={state.defaultWorkspaceCover}
          width="100%"
          className="w-100 workspaceCover"
        />
      )}

      {state.coverImage && !state.defaultWorkspaceCover && (
        <Photo
          loading={state.loading.toString()}
          src={state.coverImage}
          width="100%"
          className="h-100 w-100 workspaceCover"
        />
      )}

      <Fragment>{renderEditButton()}</Fragment>
    </div>
  )
}

export default CoverImage
