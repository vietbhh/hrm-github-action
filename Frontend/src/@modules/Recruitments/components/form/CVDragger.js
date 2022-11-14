// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { recruitmentsApi } from "@modules/Recruitments/common/api"
import notification from "@apps/utility/notification"
// ** Styles
import { Button } from "reactstrap"
import { Upload } from "antd"
import { Fragment, useState } from "react"
// ** Components
import NumberFilesSelected from "../details/NumberFilesSelected."

const { Dragger } = Upload

const CVDragger = (props) => {
  const {
    // ** props
    showNumberFileSelected,
    autoUpload,
    listCVUpload,
    recruitmentProposal,
    // ** methods
    setListFile,
    setState
  } = props

  const handleLoadContentCV = (info) => {
    const fileList = info.fileList.filter((item) => {
      return item.percent !== 100
    })
    const values = {
      list_file: fileList,
      recruitment_proposal: recruitmentProposal,
      list_cv_upload: listCVUpload
    }
    recruitmentsApi
      .loadContentCV(values)
      .then((res) => {
        setState({
          listCVUpload: { ...listCVUpload, ...res.data.list_cv_content}
        })
        info.fileList.map((item) => {
          item.percent = 100
        })
      })
      .catch((err) => {
        notification.showError()
      })
  }

  const uploadProps = {
    name: "upload_cv_input",
    multiple: true,
    showUploadList: false,

    beforeUpload() {
      return false
    },

    onChange(info) {
      if (autoUpload === true) {
        handleLoadContentCV(info)
      } else {
        setListFile([...info.fileList])
      }
    }
  }

  // ** render
  const renderNumberFilesSelected = () => {
    return (
      <NumberFilesSelected
        showNumberFileSelected={showNumberFileSelected}
        showNumberFileInvalid={false}
        listCVUpload={listCVUpload}
        listCVInvalid={{}}
      />
    )
  }

  return (
    <Fragment>
      <Dragger
        {...uploadProps}
        className="dragger-cv-upload"
        accept=".pdf, .doc, .docx">
        <i className="fad fa-file-pdf icon" />
        <p>{renderNumberFilesSelected()}</p>
        <p>{useFormatMessage("modules.candidates.text.or")}</p>
        <Button.Ripple color="flat-primary" size="sm">
          {useFormatMessage("modules.candidates.button.select_file")}
        </Button.Ripple>
      </Dragger>
    </Fragment>
  )
}

export default CVDragger
