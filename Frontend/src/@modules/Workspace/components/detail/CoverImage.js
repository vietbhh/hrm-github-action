// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import defaultWorkspaceCover from "../../assets/images/default_workspace_cover.webp"
import CoverEditor from "components/hrm/CoverEditor/CoverEditor"
import Photo from "@apps/modules/download/pages/Photo"

const CoverImage = (props) => {
  const {
    // ** props
    src,
    dataSave,
    isEditable,
    // ** methods
    saveCoverImageApi
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
          loading={state.loading}
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
