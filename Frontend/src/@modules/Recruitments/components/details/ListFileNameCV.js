// ** React Imports
// ** Styles
// ** Components

import { Button } from "reactstrap"

const ListFileNameCV = (props) => {
  const {
    // ** props
    listCVUpload,
    listFileCV,
    currentCVIndex,
    currentCVContent,
    listCVInvalid,
    // ** methods
    setShowCVContent,
    listEmployeeEmail,
    setCurrentCVContent,
    setCurrentCVIndex,
    setState
  } = props

  const handleClickFileName = (index) => {
    const cvInfo = listCVUpload[index]
    setCurrentCVContent(cvInfo)
    setCurrentCVIndex(index)
    setShowCVContent(true)
  }

  const handleRemoveFile = (indexFile) => {
    const newListCV = {}
    _.forEach({ ...listCVUpload }, (item, index) => {
      if (parseInt(item.key) !== parseInt(indexFile)) {
        newListCV[index] = item
      }
    })

    const newListCVInvalid = {}
    _.forEach({ ...listCVInvalid }, (item, index) => {
      if (parseInt(item.key) !== parseInt(indexFile)) {
        newListCVInvalid[index] = item
      }
    })

    const newListFileCV = [...listFileCV]
    const newListFile = newListFileCV.filter((item, index) => {
      return index !== indexFile
    })

    setState({
      listCVUpload: newListCV,
      listCVInvalid: newListCVInvalid,
      listFileCV: newListFile
    })
    if (parseInt(indexFile) === parseInt(currentCVContent.key)) {
      setShowCVContent(false)
    }
  }

  // ** render
  const renderInvalid = () => {
    return <i className="far fa-exclamation-triangle warning-icon" />
  }

  return (
    <div className="list-file-name">
      {_.map(listCVUpload, (item, index) => {
        let invalid = false
        if (
          _.some(
            listCVInvalid,
            (itemInvalid) => parseInt(itemInvalid.key) === parseInt(item.key)
          )
        ) {
          invalid = true
        }

        return (
          <div
            className={`d-flex justify-content-between file-name-item ${
              currentCVIndex === index ? "file-name-item-active" : ""
            }`}
            key={`file-item-${index}`}>
            <div
              className="file-item"
              onClick={() => handleClickFileName(index)}>
              <p>
                {invalid && renderInvalid()} {item.file_name}
              </p>
            </div>
            <div className="align-self-center">
              <Button.Ripple
                color="flat-danger"
                size="sm"
                onClick={() => handleRemoveFile(item.key)}>
                <i className="far fa-trash-alt delete-file-icon" />
              </Button.Ripple>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ListFileNameCV
