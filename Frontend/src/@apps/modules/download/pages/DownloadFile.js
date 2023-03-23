import { axiosNodeApi } from "@apps/utility/api"
import React, { Component } from "react"
import { Button } from "reactstrap"
import { downloadApi } from "../common/api"

const fileType = {
  "application/msword": (
    <i className="far fa-file-word ms-1" style={{ fontSize: "25px" }} />
  ),
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
    <i className="far fa-file-word ms-1" style={{ fontSize: "25px" }} />
  ),
  "application/vnd.ms-excel": (
    <i className="far fa-file-excel ms-1" style={{ fontSize: "25px" }} />
  ),
  "application/vnd.ms-powerpoint": (
    <i className="far fa-file-powerpoint ms-1" style={{ fontSize: "25px" }} />
  ),
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
    <i className="far fa-file-excel ms-1" style={{ fontSize: "25px" }} />
  ),
  "application/pdf": (
    <i className="far fa-file-pdf ms-1" style={{ fontSize: "25px" }} />
  ),
  "application/application/x-zip-compressed": (
    <i className="far fa-file-archive ms-1" style={{ fontSize: "25px" }} />
  ),
  "video/mp4": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
  ),
  "video/avi": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
  ),
  "video/3gp": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
  ),
  "video/flv": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
  ),
  "video/mov": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
  ),
  "video/wmv": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "25px" }} />
  ),
  "audio/mpeg": (
    <i className="far fa-file-music ms-1" style={{ fontSize: "25px" }} />
  ),
  "audio/mp4": (
    <i className="far fa-file-audio ms-1" style={{ fontSize: "25px" }} />
  ),
  "audio/wav": (
    <i className="far fa-file-audio ms-1" style={{ fontSize: "25px" }} />
  ),
  "audio/mid": (
    <i className="far fa-file-audio ms-1" style={{ fontSize: "25px" }} />
  )
}

class DownloadFile extends Component {
  constructor(props) {
    super()
  }

  download = async () => {
    const downloadFromStorage = this.props.downloadFromStorage
    await downloadApi.getFile(this.props.src, downloadFromStorage).then((response) => {
      console.log(response.data)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${this.props.fileName}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    })
  }

  render() {
    const dType = this.props.type
    if (dType === "button") {
      const newProps = { ...this.props }
      delete newProps.src
      delete newProps.children
      delete newProps.onClick
      delete newProps.fileName
      delete newProps.fileType
      return (
        <Button.Ripple onClick={this.download} {...newProps}>
          {this.props.children}
        </Button.Ripple>
      )
    } else {
      return (
        <React.Fragment>
          <span onClick={this.download} style={{ cursor: "pointer" }}>
            {this.props.fileType && fileType[this.props.fileType]}{" "}
            {this.props.children}
          </span>
        </React.Fragment>
      )
    }
  }
}

export default DownloadFile
