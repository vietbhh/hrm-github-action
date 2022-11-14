// ** React Imports
// ** Styles
// ** Components
import { Table } from "rsuite"
import DocumentAction from "../DocumentAction"
import FileAction from "../FileAction"

const { Cell } = Table

const FolderActionCell = (props) => {
  const {
    // ** props
    data,
    rowData,
    options,
    other
    // ** methods
  } = props

  const {
    moduleName,
    dataDocument,
    toggleAddModal,
    toggleShareModal,
    setModalData,
    setParentFolder,
    loadData
  } = other

  const isDocument = rowData?.type === "document"

  // ** render
  const renderDocumentAction = () => {
    return (
      <DocumentAction
        folderData={rowData}
        handleModal={toggleAddModal}
        handleShareModal={toggleShareModal}
        setModalData={setModalData}
        setParentFolder={setParentFolder}
        loadData={loadData}
      />
    )
  }

  const renderFileAction = () => {
    return (
      <FileAction
        fileData={rowData}
        loadData={loadData}
        dataDocument={dataDocument}
        options={options}
        moduleName={moduleName}
      />
    )
  }

  return (
    <Cell {...props}>
      {isDocument ? renderDocumentAction() : renderFileAction()}
    </Cell>
  )
}

export default FolderActionCell
