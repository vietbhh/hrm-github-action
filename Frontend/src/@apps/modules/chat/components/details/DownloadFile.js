import React, { Component } from "react"
import { Button } from "reactstrap"
import { downloadApi } from "../../../download/common/api"

class DownloadFile extends Component {
  constructor(props) {
    super()
  }

  download = async () => {
    await downloadApi.getFile(this.props.src).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${this.props.fileName}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    })
  }

  _renderIcon = (fileType) => {
    const arrPdf = ["pdf"]
    const arrPowerPoint = [
      "pot",
      "potm",
      "potx",
      "ppam",
      "pps",
      "ppsm",
      "ppsx",
      "ppt",
      "pptm",
      "pptx",
      "sldm",
      "sldx"
    ]
    const arrTxt = ["txt"]
    const arrExcel = [
      "xla",
      "xlam",
      "xll",
      "xlm",
      "xls",
      "xlsm",
      "xlsx",
      "xlt",
      "xltm",
      "xltx"
    ]
    const arrDoc = ["doc", "docm", "docx", "dot", "dotx"]
    switch (fileType) {
      case undefined:
        return <i className="fa-light fa-file"></i>

      case arrPdf[arrPdf.indexOf(fileType)]:
        return <i className="fa-light fa-file-pdf"></i>

      case arrPowerPoint[arrPowerPoint.indexOf(fileType)]:
        return <i className="fa-light fa-file-powerpoint"></i>

      case arrTxt[arrTxt.indexOf(fileType)]:
        return <i className="fa-light fa-file-lines"></i>

      case arrExcel[arrExcel.indexOf(fileType)]:
        return <i className="fa-light fa-file-excel"></i>

      case arrDoc[arrDoc.indexOf(fileType)]:
        return <i className="fa-light fa-file-word"></i>

      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 10H18C15 10 14 9 14 6V2L22 10Z"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="file-component"
          onClick={this.download}
          style={{ cursor: "pointer" }}>
          <div className="file-icon">
            {this._renderIcon(this.props.fileType)}
          </div>
          <div className="file-content">
            <span className="file-text" >
              {this.props.fileName}</span>
            <span className="file-size">
              {this.props.fileSize} {this.props.fileSizeType}
            </span>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DownloadFile
