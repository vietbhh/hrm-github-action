// ** React Imports
// ** Styles
// ** Components
import CVInfoEmployee from "./CVInfoEmployee"
import CVInfoForm from "./CVInfoForm"

const CVInfo = (props) => {
  const {
    // ** props
    listCVUpload,
    currentCVContent,
    currentCVIndex,
    listCVInvalid,
    listEmployeeEmail,
    metas,
    moduleName,
    // ** methods
    setCurrentCVContent,
    setState,
    changeJob,
    jobUpdate
  } = props

  // ** render
  const renderCVInfoForm = () => {
    return (
      <CVInfoForm
        listCVUpload={listCVUpload}
        listCVInvalid={listCVInvalid}
        currentCVContent={currentCVContent}
        currentCVIndex={currentCVIndex}
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

  const renderCVInfoEmployee = () => {
    return (
      <CVInfoEmployee
        listCVUpload={listCVUpload}
        currentCVContent={currentCVContent}
        currentCVIndex={currentCVIndex}
        setCurrentCVContent={setCurrentCVContent}
        setState={setState}
      />
    )
  }

  return (
    <div>
      <div>{renderCVInfoEmployee()}</div>
      <div>{renderCVInfoForm()}</div>
    </div>
  )
}

export default CVInfo
