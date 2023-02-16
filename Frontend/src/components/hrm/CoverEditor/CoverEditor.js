import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import cameraBtn from "@src/assets/images/erp/icons/camera.svg"
import noAvatar from "@src/assets/images/erp/noavt.png"
import classNames from "classnames"
import { isEmpty } from "lodash-es"
import { Fragment, useEffect, useRef } from "react"
import AvatarEditor from "react-avatar-editor"
import ContentLoader from "react-content-loader"
import defaultWorkspaceCover from "./assets/images/default_workspace_cover.webp"

import { Button } from "reactstrap"
import { Dropdown, Space, Image } from "antd"
const CoverEditor = (props) => {
  const [state, setState] = useMergedState({
    photoPreview: defaultWorkspaceCover,
    linkPreview: "",
    preview: null,
    loading: true,
    editing: false
  })
  const { currentCover } = props
  const photoUploader = useRef()
  const photoEditor = useRef()
  console.log("state", state)
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
    console.log("photoEditor", photoEditor)
    if (photoEditor.current) {
      const img = photoEditor.current.getImageScaledToCanvas().toDataURL()
      console.log(
        "photoEditor.current.getImageScaledToCanvas()",
        photoEditor.current.getImageScaledToCanvas()
      )
      setState({
        photoPreview: img,
        editing: false
      })

      //props.handleSave(img)
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
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com">
          Remove cover photo
        </a>
      )
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
          <>
            <Button className="ms-auto" size="sm" color="secondary">
              Cancel
            </Button>

            <Button
              className="ms-50"
              size="sm"
              color="primary"
              onClick={() => handleSave()}>
              Save
            </Button>
          </>
        )}
      </Fragment>
    )
}

export default CoverEditor
