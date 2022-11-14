// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment, useEffect, useState } from "react"
import { recruitmentsApi } from "@modules/Recruitments/common/api"
import notification from "@apps/utility/notification"
// ** Styles
import { Button, Spinner } from "reactstrap"
import { Drawer, Space } from "antd"
// ** Components
import CVDragger from "../form/CVDragger"
import ListFileNameCV from "./ListFileNameCV"
import NumberFilesSelected from "./NumberFilesSelected."
import CVInfo from "./CVInfo"
import PreviewCVContent from "./PreviewCVContent"

const PreviewListCV = (props) => {
  const {
    // ** props
    visible,
    listCVUpload,
    listCVInvalid,
    listFileCV,
    listEmployeeEmail,
    recruitmentProposal,
    metas,
    moduleName,
    // ** methods
    setState,
    loadData,
    changeJob,
    jobUpdate
  } = props

  const [loading, setLoading] = useState(false)
  const [showCVContent, setShowCVContent] = useState(false)
  const [currentCVContent, setCurrentCVContent] = useState({})
  const [currentCVIndex, setCurrentCVIndex] = useState(null)

  const removeOldCV = () => {
    recruitmentsApi.deleteOldCV()
  }

  const handleRemoveFileCV = () => {
    const listFileName = _.filter(listCVUpload, (item) => {
      return item.type === "doc"
    })
    if (listFileName.length > 0) {
      recruitmentsApi.deleteListFileCV(listFileName)
    }
  }

  const handleCancel = () => {
    setState({
      listCVUpload: {},
      listCVInvalid: {},
      showPreviewCV: false
    })
    setShowCVContent(false)
    handleRemoveFileCV()
  }

  const handleImport = () => {
    if (listCVInvalid.length > 0) {
      return notification.showError({
        text: useFormatMessage("modules.candidates.text.fail_import")
      })
    }
    setLoading(true)
    const values = {
      list_cv_upload: listCVUpload,
      list_file_cv: listFileCV
    }
    recruitmentsApi
      .importCV(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
        setLoading(false)
        handleCancel()
        loadData()
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("modules.candidates.text.fail_import")
        })
        setLoading(false)
      })
  }

  // ** effect
  useEffect(() => {
    if (visible === true) {
      removeOldCV()
    }
  }, [visible])

  // ** render
  const renderCVDragger = () => {
    return (
      <CVDragger
        showNumberFileSelected={false}
        autoUpload={true}
        listCVUpload={listCVUpload}
        recruitmentProposal={recruitmentProposal}
        setListFile={undefined}
        setState={setState}
      />
    )
  }

  const renderNumberFilesSelected = () => {
    return (
      <h6>
        <NumberFilesSelected
          showNumberFileSelected={true}
          showNumberFileInvalid={true}
          listCVUpload={listCVUpload}
          listCVInvalid={listCVInvalid}
        />
      </h6>
    )
  }

  const renderListFileName = () => {
    return (
      <ListFileNameCV
        listCVUpload={listCVUpload}
        listFileCV={listFileCV}
        currentCVIndex={currentCVIndex}
        currentCVContent={currentCVContent}
        listCVInvalid={listCVInvalid}
        listEmployeeEmail={listEmployeeEmail}
        setShowCVContent={setShowCVContent}
        setCurrentCVContent={setCurrentCVContent}
        setCurrentCVIndex={setCurrentCVIndex}
        setState={setState}
      />
    )
  }

  const renderCVInfo = () => {
    return (
      <CVInfo
        listCVUpload={listCVUpload}
        currentCVContent={currentCVContent}
        currentCVIndex={currentCVIndex}
        listCVInvalid={listCVInvalid}
        listEmployeeEmail={listEmployeeEmail}
        metas={metas}
        moduleName={moduleName}
        setCurrentCVContent={setCurrentCVContent}
        setState={setState}
        changeJob={changeJob}
        jobUpdate={jobUpdate}
      />
    )
  }

  const renderPreviewCVContent = () => {
    return <PreviewCVContent currentCVContent={currentCVContent} />
  }

  return (
    <Fragment>
      <Drawer
        className="preview-cv-drawer"
        placement="left"
        closable={false}
        visible={visible}
        mask={true}>
        <div className="drawer-content">
          <div className="upload-area">{renderCVDragger()}</div>
          <div className="list-cv-area">
            {renderNumberFilesSelected()}
            {renderListFileName()}
          </div>
          <div className="drawer-footer">
            <Space>
              <Button
                color="primary"
                disabled={loading}
                onClick={() => handleImport()}>
                {loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("app.save")}
              </Button>
              <Button.Ripple color="flat-danger" onClick={() => handleCancel()}>
                {useFormatMessage("app.cancel")}
              </Button.Ripple>
            </Space>
          </div>
        </div>
      </Drawer>

      <Drawer
        className={showCVContent === true ? "preview-cv-drawer-content" : ""}
        placement="left"
        closable={false}
        visible={showCVContent}
        mask={false}>
        <div className="preview-cv-container d-flex">
          <div className="cv-info-area">{renderCVInfo()}</div>
          <div>{renderPreviewCVContent()}</div>
        </div>
      </Drawer>
    </Fragment>
  )
}

export default PreviewListCV
