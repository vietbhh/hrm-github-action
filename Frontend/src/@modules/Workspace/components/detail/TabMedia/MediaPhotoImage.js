// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { downloadApi } from "@apps/modules/download/common/api"
// ** Styles
import { Skeleton } from "antd"
// ** Components

const MediaPhotoImage = (props) => {
  const {
    // ** props
    src
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    urlThumb: ""
  })

  const handleLoadThumb = () => {
    setState({
      loading: true
    })

    downloadApi
      .getPhoto(src)
      .then((response) => {
        setTimeout(() => {
          setState({
            urlThumb: URL.createObjectURL(response.data),
            loading: false
          })
        }, 200)
      })
      .catch((err) => {
        setState({
          urlThumb: "",
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    handleLoadThumb()
  }, [])

  // ** render
  const renderComponent = () => {
    if (state.loading) {
      return <Skeleton.Image active={true} />
    }

    return (
      <div
        className="w-100 h-100 image-container"
        style={{
          backgroundImage: `url("${state.urlThumb}")`
        }}></div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MediaPhotoImage
