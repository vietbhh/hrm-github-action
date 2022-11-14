// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components

const NumberFilesSelected = (props) => {
  const {
    // ** props
    showNumberFileSelected,
    showNumberFileInvalid,
    listCVUpload,
    listCVInvalid
    // ** methods
  } = props

  const listCVUploadLength = Object.keys(listCVUpload).length
  const listFileInvalidLength = Object.keys(listCVInvalid).length

  // ** render
  const renderNumberFileSelected = () => {
    return (
      <>
        {listCVUploadLength}{" "}
        {listCVUploadLength > 1
          ? useFormatMessage("modules.candidates.text.files")
          : useFormatMessage("modules.candidates.text.file")}{" "}
        {useFormatMessage("modules.candidates.text.selected")}
      </>
    )
  }

  const renderNumberFileInvalid = () => {
    return (
      <>
        <span className="error-file-selected ms-2">
          {listFileInvalidLength > 0
            ? ` ${listFileInvalidLength} ${
                listFileInvalidLength > 1
                  ? useFormatMessage("modules.candidates.text.files")
                  : useFormatMessage("modules.candidates.text.file")
              } ${useFormatMessage("modules.candidates.text.error")}`
            : ""}
        </span>
      </>
    )
  }

  const renderComponent = () => {
    if (showNumberFileSelected || showNumberFileInvalid) {
      return (
        <>
          {renderNumberFileSelected()}
          {renderNumberFileInvalid()}
        </>
      )
    } else {
      return useFormatMessage("modules.candidates.text.drag_and_drop_cv")
    }
  }

  return renderComponent()
}

export default NumberFilesSelected
