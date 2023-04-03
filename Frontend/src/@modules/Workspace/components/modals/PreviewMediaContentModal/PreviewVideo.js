// ** React Imports
import { axiosNodeApi } from "@apps/utility/api"
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect, useState } from "react"
// ** Styles
// ** Components
import ModalButton from "./ModalButton"

const PreviewVideo = (props) => {
  const {
    // ** props
    mediaInfo,
    // ** methods
    handleModal,
    handleClickDownload
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    url: ""
  })

  const getContent = () => {
    setState({
      loading: true
    })
    axiosNodeApi
      .get(`/download/file/?name=${mediaInfo.path}`)
      .then((res) => {
        const buffer = new ArrayBuffer(res.data.data.length)
        const resBuffer = new Uint8Array(buffer)
        for (let i = 0; i < res.data.data.length; ++i) {
          resBuffer[i] = res.data.data[i]
        }
        const blob = new Blob([resBuffer], { type: "video/mp4" })
        setState({
          url: URL.createObjectURL(blob),
          loading: false
        })
      })
      .catch((err) => {
        setState({
          url: "",
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    getContent()
  }, [mediaInfo])

  // ** render
  const renderVideo = () => {
    if (state.loading) {
      return ""
    }

    return (
      <video width="100%" controls muted>
        <source src={state.url}></source>
      </video>
    )
  }

  return (
    <div className="d-flex align-items-center justify-content-center preview-video">
      <Fragment>{renderVideo()}</Fragment>

      <ModalButton
        mediaInfo={mediaInfo}
        handleModal={handleModal}
        handleClickDownload={handleClickDownload}
      />
    </div>
  )
}

export default PreviewVideo
