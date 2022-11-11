import React from "react"
import Uppy from "@uppy/core"

import { Dashboard } from "@uppy/react"
import { Row, Col } from "reactstrap"

import "uppy/dist/uppy.css"
import "@uppy/status-bar/dist/style.css"
import "@styles/react/libs/file-uploader/file-uploader.scss"
import "@uppy/core/dist/style.css"
import "@uppy/dashboard/dist/style.css"
import { Webcam } from "uppy"
import ImageEditor from "@uppy/image-editor"
import { useSelector } from "react-redux"
import { downloadApi } from "@apps/modules/download/common/api"
import { useMergedState } from "@apps/utility/common"
const FileUploadFormDefaultModule = (props) => {
  const [state, setState] = useMergedState({
    files: [],
    filesUpdate: []
  })

  const { files_upload_module, onFileDelete, setFiles } = props
  const uppy = React.useMemo(() => {
    return new Uppy()
      .use(Webcam)
      .use(ImageEditor, {
        quality: 0.8
      })
      .on("file-added", (file) => {
        if (file.meta.status === undefined) {
          uppy.setFileMeta(file.id, {
            status: "new"
          })
          setState({
            files: uppy.getFiles().filter((item) => item.meta.status === "new")
          })
        }
      })
      .on("file-removed", (file) => {
        if (file.meta.status === "uploaded") {
          onFileDelete(file)
          setState({
            files: uppy.getFiles().filter((item) => item.meta.status === "new")
          })
        }
      })
      .on("file-editor:complete", (file) => {
        uppy.setFileMeta(file.id, {
          status: "update"
        })
        const listFile = uppy.getFiles()
        setState({
          files: listFile.filter((item) => item.meta.status === "new"),
          filesUpdate: listFile.filter((item) => item.meta.status === "update")
        })
      })
  }, [])
  React.useEffect(() => {
    return () => uppy.close()
  }, [])

  React.useEffect(() => {
    const currentFiles = files_upload_module
    const hanleFilesArray = currentFiles.map(async (item, index) => {
      currentFiles[index] = {
        ...currentFiles[index],
        name: item.fileName,
        type: item.type,
        meta: {
          status: "uploaded"
        },
        source: "server"
      }
      await downloadApi.getFile(item.url).then((response) => {
        currentFiles[index].data = new Blob([response.data], {
          type: response.data.type
        })
      })
    })
    Promise.all(hanleFilesArray).then(() => {
      for (const item of currentFiles) {
        uppy.addFile(item)
      }
    })
  }, [files_upload_module])

  React.useEffect(() => {
    setFiles(state.files, state.filesUpdate)
  }, [state.files, state.filesUpdate])
  const themeMode =
    useSelector((state) => state.layout.skin) === "light" ? "light" : "dark"
  return (
    <Row>
      <Col sm={12}>
        <Dashboard
          width="100%"
          theme={themeMode}
          hideCancelButton={false}
          hideUploadButton={true}
          uppy={uppy}
          plugins={["Webcam", "ImageEditor"]}
        />
      </Col>
    </Row>
  )
}

export default FileUploadFormDefaultModule
