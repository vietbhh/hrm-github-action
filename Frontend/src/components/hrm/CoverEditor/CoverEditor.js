import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import cameraBtn from "@src/assets/images/erp/icons/camera.svg"
import classNames from "classnames"
import { isEmpty } from "lodash-es"
import { Fragment, useEffect, useRef } from "react"
import AvatarEditor from "react-avatar-editor"
import ContentLoader from "react-content-loader"
import defaultWorkspaceCover from "./assets/images/default_workspace_cover.webp"

import { Dropdown, Image } from "antd"
import { Button } from "reactstrap"
import "./assets/scss/cover.scss"
const CoverEditor = (props) => {
  const [state, setState] = useMergedState({
    photoPreview: defaultWorkspaceCover,
    linkPreview: "",
    preview: null,
    loading: true,
    editing: false
  })
  const { currentCover, saveCoverImage, removeCover } = props
  const photoUploader = useRef()
  const photoEditor = useRef()
  const handleUploadBtnClick = (e) => {
    if (photoUploader.current) {
      photoUploader.current.click()
    }
  }

  const handleFileChange = (file) => {
    if (!isEmpty(file)) {
      if (!["image/jpeg", "image/png"].includes(file[0].type)) {
        notification.showError({
          text: useFormatMessage("notification.wrong_avatar_file_type")
        })
      } else {
        const linkPreview = URL.createObjectURL(file[0])
        setState({ linkPreview: linkPreview, editing: true })
      }
    }
  }

  const handleSave = () => {
    if (photoEditor.current) {
      const img = photoEditor.current.getImageScaledToCanvas().toDataURL()
      setState({
        photoPreview: img,
        editing: false
      })
      saveCoverImage(img)
    }
  }

  useEffect(() => {
    setState({
      loading: true
    })
    downloadApi.getPhoto(currentCover).then((response) => {
      const imgUrl = response.data
      setState({
        photoPreview: URL.createObjectURL(imgUrl),
        loading: false
      })
    })
  }, [currentCover])

  const items = [
    {
      key: "1",
      label: "Change cover image",
      onClick: () => handleUploadBtnClick()
    },
    {
      key: "2",
      label: "Remove cover photo",
      onClick: () => removeCover()
    }
  ]

  if (state.loading)
    return (
      <ContentLoader viewBox="0 0 208 208" height={208} width={208}>
        <circle cx="100" cy="100" r="100" width="208" height="208" />
      </ContentLoader>
    )
  else
    return (
      <Fragment>
        <div
          className={classNames("coverPhoto", {
            "overflow-hidden": props.readOnly
          })}>
          {!props.readOnly && (
            <Fragment>
              <Dropdown menu={{ items: items }} placement="bottomLeft">
                <div className={`cameraBtn`}>
                  <img src={cameraBtn} />
                </div>
              </Dropdown>
              <input
                type="file"
                ref={photoUploader}
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e.target.files)}
              />
            </Fragment>
          )}
          {props.readOnly && (
            <Image
              src={state.photoPreview}
              alt="Avatar"
              className={`img-fluid w-100`}
            />
          )}
          {state.editing && (
            <>
              <AvatarEditor
                ref={photoEditor}
                image={state.linkPreview}
                border={0}
                borderRadius={0}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={1}
                rotate={0}
                width={1148}
                height={336}
              />
            </>
          )}
        </div>
        {state.editing && (
          <div className="text-end mt-50">
            <Button className="ms-auto" size="sm" color="secondary">
              {useFormatMessage("button.cancel")}
            </Button>

            <Button
              className="ms-50 me-1"
              size="sm"
              color="primary"
              onClick={() => handleSave()}>
              {useFormatMessage("button.save")}
            </Button>
          </div>
        )}
      </Fragment>
    )
}

export default CoverEditor
